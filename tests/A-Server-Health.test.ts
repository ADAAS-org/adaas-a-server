import http from 'http';
import { A_Concept, ASEID } from '@adaas/a-concept';
import { A_Config, ENVConfigReader } from '@adaas/a-utils/a-config';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_ServerController } from '@adaas/a-server/controller/A-ServerController.component';
import { A_ServerHealthMonitor } from '@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component';

jest.retryTimes(0);
jest.setTimeout(30_000);

const TEST_PORT = 3901;

function httpGet(url: string): Promise<{ status: number; body: string }> {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let body = '';
            res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
            res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
        }).on('error', reject);
    });
}

describe('A-Server Health Tests', () => {
    let concept: A_Concept;

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'health-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
            ],
            entities: [],
            fragments: [
                new A_Config({
                    variables: ['A_SERVER_PORT', 'CONFIG_VERBOSE'] as const,
                    defaults: {
                        A_SERVER_PORT: TEST_PORT,
                        CONFIG_VERBOSE: false,
                    },
                }),
            ],
        });

        concept = new A_Concept({
            name: 'health-test-concept',
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

    it('should respond 200 on GET /health/v1/', async () => {
        const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/health/v1/`);

        expect(status).toBe(200);
        expect(body).toBeDefined();
    });

    it('should return package.json fields in health response', async () => {
        const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/health/v1/`);
        const parsed = JSON.parse(body);

        expect(status).toBe(200);
        expect(parsed).toHaveProperty('name');
        expect(parsed).toHaveProperty('version');
    });

    it('should return 404 for unknown routes', async () => {
        const { status } = await httpGet(`http://localhost:${TEST_PORT}/unknown/path`);

        expect(status).toBe(404);
    });
});
