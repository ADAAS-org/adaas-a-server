import http from 'http';
import { A_Concept, A_Component, A_Inject } from '@adaas/a-concept';
import { A_Config, ENVConfigReader } from '@adaas/a-utils/a-config';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_ServerController } from '@adaas/a-server/controller/A-ServerController.component';
import { A_ServerHealthMonitor } from '@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component';
import { A_ServerCORS } from '@adaas/a-server/middlewares/A-ServerCORS/A_ServerCORS.component';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';

jest.retryTimes(0);
jest.setTimeout(30_000);

const TEST_PORT = 3905;

type ResponseHeaders = Record<string, string | string[] | undefined>;

function httpRequest(
    method: string,
    path: string,
    reqHeaders: Record<string, string> = {}
): Promise<{ status: number; body: unknown; headers: ResponseHeaders }> {
    return new Promise((resolve, reject) => {
        const options: http.RequestOptions = {
            hostname: 'localhost',
            port: TEST_PORT,
            path,
            method,
            headers: reqHeaders,
        };
        const req = http.request(options, (res) => {
            let raw = '';
            res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw), headers: res.headers as ResponseHeaders });
                } catch {
                    resolve({ status: res.statusCode ?? 0, body: raw, headers: res.headers as ResponseHeaders });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

// Minimal controller to ensure there is a non-health route available
class PingController extends A_Component {
    @A_ServerRouter.Get({
        path: '/ping',
        version: 'v1',
        prefix: 'cors-test',
    })
    async ping(
        @A_Inject(A_Request) _request: A_Request,
        @A_Inject(A_Response) response: A_Response,
    ) {
        response.add('pong', true);
    }
}

describe('A-ServerCORS Tests — custom config', () => {
    let concept: A_Concept;

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'cors-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_ServerCORS,
                PingController,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: [
                        'A_SERVER_PORT',
                        'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY',
                        'CONFIG_VERBOSE',
                        'ORIGIN',
                        'CREDENTIALS',
                        'MAX_AGE',
                    ] as const,
                    defaults: {
                        A_SERVER_PORT: TEST_PORT,
                        A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
                        CONFIG_VERBOSE: false,
                        ORIGIN: 'https://allowed.example.com',
                        CREDENTIALS: true,
                        MAX_AGE: 600,
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'cors-test-concept',
            containers: [server],
            components: [],
            fragments: [],
            entities: [],
        });

        await concept.load();
        await concept.start();
    });

    afterAll(async () => {
        await concept.stop();
    });

    it('should include Access-Control-Allow-Origin on a regular GET response', async () => {
        const { status, headers } = await httpRequest('GET', '/cors-test/v1/ping', {
            Origin: 'https://allowed.example.com',
        });

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe('https://allowed.example.com');
    });

    it('should include Access-Control-Allow-Methods on a regular GET response', async () => {
        const { headers } = await httpRequest('GET', '/cors-test/v1/ping');

        expect(headers['access-control-allow-methods']).toBeDefined();
        expect(typeof headers['access-control-allow-methods']).toBe('string');
    });

    it('should include Access-Control-Allow-Headers on a regular GET response', async () => {
        const { headers } = await httpRequest('GET', '/cors-test/v1/ping');

        expect(headers['access-control-allow-headers']).toBeDefined();
    });

    it('should include Access-Control-Allow-Credentials when credentials are enabled', async () => {
        const { headers } = await httpRequest('GET', '/cors-test/v1/ping');

        expect(headers['access-control-allow-credentials']).toBe('true');
    });

    it('should include Access-Control-Max-Age when maxAge is configured', async () => {
        const { headers } = await httpRequest('GET', '/cors-test/v1/ping');

        expect(headers['access-control-max-age']).toBe('600');
    });

    it('should return 204 for OPTIONS preflight request', async () => {
        const { status } = await httpRequest('OPTIONS', '/cors-test/v1/ping', {
            Origin: 'https://allowed.example.com',
            'Access-Control-Request-Method': 'GET',
        });

        expect(status).toBe(204);
    });

    it('should include CORS headers on OPTIONS preflight response', async () => {
        const { headers } = await httpRequest('OPTIONS', '/cors-test/v1/ping', {
            Origin: 'https://allowed.example.com',
            'Access-Control-Request-Method': 'POST',
        });

        expect(headers['access-control-allow-origin']).toBe('https://allowed.example.com');
        expect(headers['access-control-allow-methods']).toBeDefined();
        expect(headers['access-control-allow-headers']).toBeDefined();
    });

    it('should also apply CORS headers to health endpoint', async () => {
        const { status, headers } = await httpRequest('GET', '/health/v1/');

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe('https://allowed.example.com');
    });

    it('should include CORS headers on a 404 error response', async () => {
        const { status, headers } = await httpRequest('GET', '/does-not-exist/v1/nowhere');

        expect(status).toBe(404);
        expect(headers['access-control-allow-origin']).toBe('https://allowed.example.com');
    });
});

describe('A-ServerCORS Tests — default config', () => {
    const DEFAULT_PORT = TEST_PORT + 1;
    let concept: A_Concept;

    function httpGetDefault(path: string): Promise<{ status: number; headers: ResponseHeaders }> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                { hostname: 'localhost', port: DEFAULT_PORT, path, method: 'GET' },
                (res) => {
                    res.on('data', () => { /* drain */ });
                    res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers as ResponseHeaders }));
                }
            );
            req.on('error', reject);
            req.end();
        });
    }

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'cors-default-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_ServerCORS,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: ['A_SERVER_PORT', 'CONFIG_VERBOSE'] as const,
                    defaults: {
                        A_SERVER_PORT: DEFAULT_PORT,
                        CONFIG_VERBOSE: false,
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'cors-default-test-concept',
            containers: [server],
            components: [],
            fragments: [],
            entities: [],
        });

        await concept.load();
        await concept.start();
    });

    afterAll(async () => {
        await concept.stop();
    });

    it('should use wildcard origin by default', async () => {
        const { status, headers } = await httpGetDefault('/health/v1/');

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe('*');
    });

    it('should not include credentials header when credentials are disabled by default', async () => {
        const { headers } = await httpGetDefault('/health/v1/');

        expect(headers['access-control-allow-credentials']).toBeUndefined();
    });
});

describe('A-ServerCORS Tests — explicit wildcard origin', () => {
    const WILDCARD_PORT = TEST_PORT + 2;
    let concept: A_Concept;

    function httpWildcard(
        method: string,
        path: string,
        reqHeaders: Record<string, string> = {}
    ): Promise<{ status: number; headers: ResponseHeaders }> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                { hostname: 'localhost', port: WILDCARD_PORT, path, method, headers: reqHeaders },
                (res) => {
                    res.on('data', () => { /* drain */ });
                    res.on('end', () => resolve({ status: res.statusCode ?? 0, headers: res.headers as ResponseHeaders }));
                }
            );
            req.on('error', reject);
            req.end();
        });
    }

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'cors-wildcard-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_ServerCORS,
                PingController,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: [
                        'A_SERVER_PORT',
                        'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY',
                        'CONFIG_VERBOSE',
                        'ORIGIN',
                    ] as const,
                    defaults: {
                        A_SERVER_PORT: WILDCARD_PORT,
                        A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
                        CONFIG_VERBOSE: false,
                        ORIGIN: '*',
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'cors-wildcard-test-concept',
            containers: [server],
            components: [],
            fragments: [],
            entities: [],
        });

        await concept.load();
        await concept.start();
    });

    afterAll(async () => {
        await concept.stop();
    });

    it('should return Access-Control-Allow-Origin: * on a regular GET', async () => {
        const { status, headers } = await httpWildcard('GET', '/cors-test/v1/ping');

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe('*');
    });

    it('should return Access-Control-Allow-Origin: * even when a specific Origin header is sent', async () => {
        const { status, headers } = await httpWildcard('GET', '/cors-test/v1/ping', {
            Origin: 'https://some-other-domain.com',
        });

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe('*');
    });

    it('should return 204 for OPTIONS preflight with wildcard origin', async () => {
        const { status, headers } = await httpWildcard('OPTIONS', '/cors-test/v1/ping', {
            Origin: 'https://any-origin.com',
            'Access-Control-Request-Method': 'GET',
        });

        expect(status).toBe(204);
        expect(headers['access-control-allow-origin']).toBe('*');
    });

    it('should include Access-Control-Allow-Methods on wildcard preflight', async () => {
        const { headers } = await httpWildcard('OPTIONS', '/cors-test/v1/ping', {
            Origin: 'https://any-origin.com',
            'Access-Control-Request-Method': 'POST',
        });

        expect(headers['access-control-allow-methods']).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// Browser cross-origin simulation
// Replicates the exact two-step handshake a browser performs when a page at
// https://app.example.com makes a fetch() to https://api.example.com:
//   Step 1 — preflight:  OPTIONS <path>  (no body, browser-added headers)
//   Step 2 — real GET:   GET     <path>  (with Origin, custom header)
//
// The server MUST grant permission in the preflight response, and the actual
// response MUST also carry the CORS headers so the browser can expose it.
// ---------------------------------------------------------------------------
describe('A-ServerCORS Tests — browser cross-origin simulation', () => {
    const BROWSER_PORT = TEST_PORT + 3;
    const BROWSER_ORIGIN = 'https://app.example.com';
    const CUSTOM_HEADER = 'X-Custom-Token';
    let concept: A_Concept;

    // Generic per-port request helper scoped to this suite
    function browserRequest(
        method: string,
        path: string,
        reqHeaders: Record<string, string> = {}
    ): Promise<{ status: number; body: unknown; headers: ResponseHeaders }> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: 'localhost',
                    port: BROWSER_PORT,
                    path,
                    method,
                    headers: reqHeaders,
                },
                (res) => {
                    let raw = '';
                    res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
                    res.on('end', () => {
                        try {
                            resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw), headers: res.headers as ResponseHeaders });
                        } catch {
                            resolve({ status: res.statusCode ?? 0, body: raw, headers: res.headers as ResponseHeaders });
                        }
                    });
                }
            );
            req.on('error', reject);
            req.end();
        });
    }

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'cors-browser-sim-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_ServerCORS,
                PingController,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: [
                        'A_SERVER_PORT',
                        'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY',
                        'CONFIG_VERBOSE',
                        'ORIGIN',
                        'HEADERS',
                        'CREDENTIALS',
                        'MAX_AGE',
                    ] as const,
                    defaults: {
                        A_SERVER_PORT: BROWSER_PORT,
                        A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
                        CONFIG_VERBOSE: false,
                        ORIGIN: BROWSER_ORIGIN,
                        HEADERS: ['Content-Type', CUSTOM_HEADER] as any,
                        CREDENTIALS: true,
                        MAX_AGE: 86400,
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'cors-browser-sim-concept',
            containers: [server],
            components: [],
            fragments: [],
            entities: [],
        });

        await concept.load();
        await concept.start();
    });

    afterAll(async () => {
        await concept.stop();
    });

    it('Step 1 — preflight: browser sends OPTIONS with Access-Control-Request-Method and Access-Control-Request-Headers', async () => {
        // This is exactly what Chrome/Firefox sends before a cross-origin fetch()
        // with a non-simple method or a custom header.
        const { status, headers } = await browserRequest('OPTIONS', '/cors-test/v1/ping', {
            'Origin': BROWSER_ORIGIN,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': `content-type, ${CUSTOM_HEADER.toLowerCase()}`,
        });

        // Browser requires 2xx (typically 204) to proceed with the real request.
        expect(status).toBe(204);

        // Origin must be echoed back exactly.
        expect(headers['access-control-allow-origin']).toBe(BROWSER_ORIGIN);

        // The requested method must be listed.
        expect(headers['access-control-allow-methods']).toContain('GET');

        // The custom header must be explicitly allowed.
        const allowedHeaders = String(headers['access-control-allow-headers'] ?? '').toLowerCase();
        expect(allowedHeaders).toContain(CUSTOM_HEADER.toLowerCase());

        // Credentials must be allowed so the browser sends cookies/auth.
        expect(headers['access-control-allow-credentials']).toBe('true');

        // Max-age tells the browser to cache this preflight result.
        expect(headers['access-control-max-age']).toBe('86400');
    });

    it('Step 2 — actual request: browser sends GET with Origin after a successful preflight', async () => {
        // After a passing preflight the browser sends the real request.
        // The response must also carry CORS headers so the browser can read the body.
        const { status, headers, body } = await browserRequest('GET', '/cors-test/v1/ping', {
            'Origin': BROWSER_ORIGIN,
            CUSTOM_HEADER: 'test-token-value',
        });

        expect(status).toBe(200);
        expect(headers['access-control-allow-origin']).toBe(BROWSER_ORIGIN);
        expect(headers['access-control-allow-credentials']).toBe('true');
        expect((body as Record<string, unknown>).pong).toBe(true);
    });

    it('Full flow — preflight immediately followed by actual request succeeds end-to-end', async () => {
        // Simulate the complete browser fetch() lifecycle in sequence.
        const preflightHeaders = {
            'Origin': BROWSER_ORIGIN,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'content-type',
        };

        const { status: preflightStatus } = await browserRequest('OPTIONS', '/cors-test/v1/ping', preflightHeaders);
        expect(preflightStatus).toBe(204);

        const { status: actualStatus, headers: actualHeaders } = await browserRequest('GET', '/cors-test/v1/ping', {
            'Origin': BROWSER_ORIGIN,
            'Content-Type': 'application/json',
        });

        expect(actualStatus).toBe(200);
        expect(actualHeaders['access-control-allow-origin']).toBe(BROWSER_ORIGIN);
    });

    it('should include CORS headers on a cross-origin error response (browser can read the error body)', async () => {
        // If the server returns 4xx/5xx, the browser can only read the error body
        // if CORS headers are present on the error response too.
        const { status, headers } = await browserRequest('GET', '/does-not-exist', {
            'Origin': BROWSER_ORIGIN,
        });

        expect(status).toBeGreaterThanOrEqual(400);
        expect(headers['access-control-allow-origin']).toBe(BROWSER_ORIGIN);
    });
});
