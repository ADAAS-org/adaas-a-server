import http from 'http';
import { A_Concept, A_Component, A_Inject } from '@adaas/a-concept';
import { A_Config, ENVConfigReader } from '@adaas/a-utils/a-config';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_ServerController } from '@adaas/a-server/controller/A-ServerController.component';
import { A_ServerHealthMonitor } from '@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_Logger } from '@adaas/a-utils/a-logger';

class TestController extends A_Component {
    @A_ServerRouter.Get({
        path: '/test',
        version: 'v1',
        prefix: 'test',
    })
    async test(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        response.add('test', 'test');
    }
}

jest.retryTimes(0);
jest.setTimeout(30_000);

const TEST_PORT = 3904;

function httpGet(url: string): Promise<{ status: number; body: unknown }> {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let raw = '';
            res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw) });
                } catch {
                    resolve({ status: res.statusCode ?? 0, body: raw });
                }
            });
        }).on('error', reject);
    });
}

describe('A-Server Custom Route Tests', () => {
    let concept: A_Concept;

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'routes-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                TestController,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: ['A_SERVER_PORT', 'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY', 'CONFIG_VERBOSE'] as const,
                    defaults: {
                        A_SERVER_PORT: TEST_PORT,
                        A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
                        CONFIG_VERBOSE: false,
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'routes-test-concept',
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

    it('should respond 200 on GET /test/v1/test', async () => {
        const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/test/v1/test`);

        expect(status).toBe(200);
        expect(body).toHaveProperty('test');
    });

    it('should return the test field value', async () => {
        const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/test/v1/test`);

        expect(status).toBe(200);
        expect((body as Record<string, unknown>).test).toBe('test');
    });

    it('should still respond to healthcheck on the same server', async () => {
        const { status } = await httpGet(`http://localhost:${TEST_PORT}/health/v1/`);

        expect(status).toBe(200);
    });
});
