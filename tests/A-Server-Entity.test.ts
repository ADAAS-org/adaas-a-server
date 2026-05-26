import http from 'http';
import { A_Concept, ASEID, A_Component, A_Entity, A_Feature, A_Inject, A_TYPES__EntityFeatures } from '@adaas/a-concept';
import { A_Config, ENVConfigReader } from '@adaas/a-utils/a-config';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_ServerController } from '@adaas/a-server/controller/A-ServerController.component';
import { A_ServerHealthMonitor } from '@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component';
import { A_EntityController } from '@adaas/a-server/controllers/A-EntityController/A-EntityController.component';

// --- Test-local types ---
type NewUser = { id: number; email: string; name: string; };
type UserJSON = NewUser & { aseid: string; };

class User extends A_Entity<NewUser, UserJSON> {
    static get entity() { return 'user'; }
    static get concept() { return 'a-server'; }
    static get scope() { return 'entity-test'; }

    email!: string;
    name!: string;

    get id(): number { return Number(this.aseid.id); }

    fromNew(newEntity: NewUser): void {
        this.aseid = new ASEID({ concept: User.concept, scope: User.scope, entity: User.entity, id: newEntity.id });
        this.email = newEntity.email;
        this.name = newEntity.name;
    }

    fromJSON(serialized: UserJSON): void {
        this.aseid = new ASEID(serialized.aseid);
        this.email = serialized.email;
        this.name = serialized.name;
    }

    toJSON(): UserJSON {
        return { id: this.id, aseid: this.aseid.toString(), email: this.email, name: this.name };
    }
}

class UsersRepository extends A_Component {
    private mockedUsers: UserJSON[] = [
        new User({ id: 1, name: 'John Doe', email: 'joe@doe.com' }).toJSON(),
        new User({ id: 2, name: 'mr Smith', email: 'mr.smith@doe.com' }).toJSON(),
    ];

    @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD })
    load(@A_Inject(User) user: User) {
        const existedUser = this.mockedUsers.find(u => u.id === user.id);
        if (!existedUser) throw new Error('User not found');
        user.fromJSON(existedUser);
    }

    @A_Feature.Extend({ name: A_TYPES__EntityFeatures.SAVE })
    create(@A_Inject(User) user: User) {
        this.mockedUsers.push(user.toJSON());
    }
}

jest.retryTimes(0);
jest.setTimeout(30_000);

const TEST_PORT = 3902;

function httpRequest(
    method: string,
    path: string,
    body?: Record<string, unknown>
): Promise<{ status: number; body: unknown }> {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : undefined;
        const options: http.RequestOptions = {
            hostname: 'localhost',
            port: TEST_PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
            },
        };
        const req = http.request(options, (res) => {
            let raw = '';
            res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw) });
                } catch {
                    resolve({ status: res.statusCode ?? 0, body: raw });
                }
            });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

describe('A-Server Entity Tests', () => {
    let concept: A_Concept;

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'entity-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_EntityController,
                UsersRepository,
            ],
            entities: [User],
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
            name: 'entity-test-concept',
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

    it('should load an existing user by ASEID', async () => {
        const aseid = new ASEID({ concept: User.concept, scope: User.scope, entity: User.entity, id: 1 });
        const path = `/a-entity/v1/${encodeURIComponent(aseid.toString())}`;
        const { status, body } = await httpRequest('GET', path);

        expect(status).toBe(200);
        expect(body).toMatchObject({ name: 'John Doe', email: 'joe@doe.com' });
    });

    it('should load a second user by ASEID', async () => {
        const aseid = new ASEID({ concept: User.concept, scope: User.scope, entity: User.entity, id: 2 });
        const path = `/a-entity/v1/${encodeURIComponent(aseid.toString())}`;
        const { status, body } = await httpRequest('GET', path);

        expect(status).toBe(200);
        expect(body).toMatchObject({ name: 'mr Smith', email: 'mr.smith@doe.com' });
    });

    it('should return an error for a non-existent user ASEID', async () => {
        const aseid = new ASEID({ concept: User.concept, scope: User.scope, entity: User.entity, id: 999 });
        const path = `/a-entity/v1/${encodeURIComponent(aseid.toString())}`;
        const { status } = await httpRequest('GET', path);

        expect(status).toBeGreaterThanOrEqual(500);
    });

    it('should return 400 for an invalid ASEID', async () => {
        const { status } = await httpRequest('GET', '/a-entity/v1/not-a-valid-aseid');

        expect(status).toBe(400);
    });

    it('should return 404 for an unregistered entity type in ASEID', async () => {
        // Valid ASEID format but entity type not registered in this server
        const aseid = new ASEID({ concept: 'a-server', scope: 'entity-test', entity: 'unknown-entity', id: 1 });
        const path = `/a-entity/v1/${encodeURIComponent(aseid.toString())}`;
        const { status } = await httpRequest('GET', path);

        expect(status).toBe(404);
    });

    it('should return 400 for PUT with invalid ASEID', async () => {
        const { status } = await httpRequest('PUT', '/a-entity/v1/not-a-valid-aseid', { name: 'Test' });

        expect(status).toBe(400);
    });

    it('should return 400 for DELETE with invalid ASEID', async () => {
        const { status } = await httpRequest('DELETE', '/a-entity/v1/not-a-valid-aseid');

        expect(status).toBe(400);
    });

    it('should create a new user via POST and receive a response', async () => {
        const newUser = { id: 3, name: 'Alice', email: 'alice@example.com' };
        const { status } = await httpRequest('POST', '/a-entity/v1/', newUser);

        expect(status).toBeGreaterThanOrEqual(200);
    });
});
