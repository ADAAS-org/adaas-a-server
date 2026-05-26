import http from 'http';
import { A_Concept, A_Scope, ASEID, A_Component, A_Entity, A_Feature, A_Inject, A_TYPES__EntityFeatures } from '@adaas/a-concept';
import { A_Config, ENVConfigReader } from '@adaas/a-utils/a-config';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_ServerController } from '@adaas/a-server/controller/A-ServerController.component';
import { A_ServerHealthMonitor } from '@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component';
import { A_EntityController } from '@adaas/a-server/controllers/A-EntityController/A-EntityController.component';
import { A_ListingController } from '@adaas/a-server/controllers/A-ListingController/A-ListingController.component';
import { A_ServerEntityList } from '@adaas/a-server/entity-list/A-EntityList.entity';
import { A_SERVER_TYPES__A_EntityListPagination } from '@adaas/a-server/entity-list/A-EntityList.types';
import { A_ServerListQueryFilter } from '@adaas/a-server/list-query/A-ServerListQueryFilter.context';
import { A_HTTPChannel } from '@adaas/a-server/channels/A-Http/A-Http.channel';

jest.retryTimes(0);
jest.setTimeout(30_000);

const TEST_PORT = 3903;

// ── Shared entity types ───────────────────────────────────────────────────────

type NewUser = { id: number; email: string; name: string; };
type UserJSON = NewUser & { aseid: string; };

class User extends A_Entity<NewUser, UserJSON> {
    static get entity() { return 'user'; }
    static get concept() { return 'a-server'; }
    static get scope() { return 'entity-list-test'; }

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

// ── Server-side repository (in-memory) ────────────────────────────────────────

class UsersRepository extends A_Component {
    private mockedUsers: UserJSON[] = [
        new User({ id: 1, name: 'John Doe', email: 'joe@doe.com' }).toJSON(),
        new User({ id: 2, name: 'mr Smith', email: 'mr.smith@doe.com' }).toJSON(),
    ];

    @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD, scope: { exclude: [A_ServerEntityList] } })
    load(@A_Inject(User) user: User) {
        const existedUser = this.mockedUsers.find(u => u.id === user.id);
        if (!existedUser) throw new Error('User not found');
        user.fromJSON(existedUser);
    }

    @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD, scope: [A_ServerEntityList] })
    list(
        @A_Inject(A_ServerListQueryFilter<['page', 'itemsPerPage']>) query: A_ServerListQueryFilter<['page', 'itemsPerPage']>,
        @A_Inject(A_ServerEntityList<User>) list: A_ServerEntityList<User>
    ) {
        const page = parseInt(query.get('page', '1'), 10);
        const itemsPerPage = parseInt(query.get('itemsPerPage', '10'), 10);
        const items = this.mockedUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        list.fromList(items, { total: this.mockedUsers.length, page, pageSize: itemsPerPage });
    }
}

// ── Client-side components (HTTP-based) ───────────────────────────────────────

class UserListChannel extends A_HTTPChannel {
    constructor() {
        super();
        this.baseUrl = `http://localhost:${TEST_PORT}`;
    }
}

class ClientUsersRepository extends A_Component {
    @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD, scope: [A_ServerEntityList] })
    async list(
        @A_Inject(A_ServerEntityList<User>) list: A_ServerEntityList<User>,
        @A_Inject(UserListChannel) channel: UserListChannel
    ) {
        const { page, pageSize } = list.pagination;
        const response = await channel.get<{ items: UserJSON[]; pagination: A_SERVER_TYPES__A_EntityListPagination }>(
            '/a-list/v1/user',
            { page: String(page), itemsPerPage: String(pageSize) },
        );
        list.fromList(response.data!.items, response.data!.pagination);
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function httpGet(url: string): Promise<{ status: number; body: unknown }> {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let raw = '';
            res.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
            res.on('end', () => {
                try { resolve({ status: res.statusCode ?? 0, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode ?? 0, body: raw }); }
            });
        }).on('error', reject);
    });
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('A-ServerEntityList', () => {
    let serverConcept: A_Concept;
    let clientScope: A_Scope;

    beforeAll(async () => {
        const server = new A_HttpServer({
            name: 'entity-list-test-server',
            components: [
                A_Polyfill,
                A_ServerLogger,
                ENVConfigReader,
                A_ServerRouter,
                A_ServerController,
                A_ServerHealthMonitor,
                A_EntityController,
                A_ListingController,
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

        serverConcept = new A_Concept({
            name: 'entity-list-test-concept',
            containers: [server],
            components: [],
            fragments: [],
            entities: [],
        });

        await serverConcept.load();
        await serverConcept.start();
    });

    beforeEach(() => {
        clientScope = new A_Scope({
            components: [UserListChannel, ClientUsersRepository],
        });
    });

    afterAll(async () => {
        await serverConcept.stop();
    });

    // ── HTTP endpoint smoke tests ─────────────────────────────────────────────

    describe('HTTP endpoint (smoke tests)', () => {
        it('should return all users in the list', async () => {
            const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/a-list/v1/user`);

            expect(status).toBe(200);
            expect(body).toHaveProperty('items');
            expect(Array.isArray((body as Record<string, unknown>).items)).toBe(true);
            expect((body as Record<string, unknown[]>).items).toHaveLength(2);
        });

        it('should include pagination metadata in the response', async () => {
            const { status, body } = await httpGet(`http://localhost:${TEST_PORT}/a-list/v1/user`);

            expect(status).toBe(200);
            expect(body).toHaveProperty('pagination');
            expect((body as Record<string, Record<string, unknown>>).pagination).toMatchObject({ total: 2 });
        });

        it('should respect itemsPerPage=1 and return a single item', async () => {
            const { status, body } = await httpGet(
                `http://localhost:${TEST_PORT}/a-list/v1/user?page=1&itemsPerPage=1`
            );

            expect(status).toBe(200);
            expect((body as Record<string, unknown[]>).items).toHaveLength(1);
            expect((body as any).items[0]).toMatchObject({ name: 'John Doe' });
        });

        it('should return second page when page=2&itemsPerPage=1', async () => {
            const { status, body } = await httpGet(
                `http://localhost:${TEST_PORT}/a-list/v1/user?page=2&itemsPerPage=1`
            );

            expect(status).toBe(200);
            expect((body as Record<string, unknown[]>).items).toHaveLength(1);
            expect((body as any).items[0]).toMatchObject({ name: 'mr Smith' });
        });

        it('should return 404 for an unregistered entity type', async () => {
            const { status } = await httpGet(`http://localhost:${TEST_PORT}/a-list/v1/unknown-entity`);

            expect(status).toBe(404);
        });
    });

    // ── Entity-first API tests ────────────────────────────────────────────────

    describe('Entity-first API', () => {

        it('should load all users via entity constructor', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            expect(list.length).toBe(2);
            expect(list.items[0]).toBeInstanceOf(User);
            expect(list.items[0].name).toBe('John Doe');
        });

        it('should populate pagination after load', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 1 } });
            clientScope.register(list);
            await list.load();

            expect(list.length).toBe(1);
            expect(list.pagination.total).toBe(2);
            expect(list.pagination.page).toBe(1);
            expect(list.pagination.pageSize).toBe(1);
        });

        it('should return the second page', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 2, pageSize: 1 } });
            clientScope.register(list);
            await list.load();

            expect(list.length).toBe(1);
            expect(list.at(0)!.name).toBe('mr Smith');
        });

        // ── at() ───────────────────────────────────────────────────────────────

        it('at() returns the item at the given index', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            expect(list.at(0)).toBeInstanceOf(User);
            expect(list.at(0)!.name).toBe('John Doe');
            expect(list.at(1)!.name).toBe('mr Smith');
            expect(list.at(99)).toBeUndefined();
        });

        // ── replace() ──────────────────────────────────────────────────────────

        it('replace() swaps the item at the given index', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            list.replace(0, new User({ id: 1, name: 'Updated Name', email: 'updated@example.com' }));

            expect(list.length).toBe(2);
            expect(list.at(0)!.name).toBe('Updated Name');
        });

        it('replace() accepts a plain serialised object', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            const json = new User({ id: 1, name: 'From JSON', email: 'json@example.com' }).toJSON();
            list.replace(0, json);

            expect(list.at(0)!.name).toBe('From JSON');
        });

        // ── push() ─────────────────────────────────────────────────────────────

        it('push() appends an item', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            list.push(new User({ id: 3, name: 'Alice', email: 'alice@example.com' }));

            expect(list.length).toBe(3);
            expect(list.at(2)!.name).toBe('Alice');
        });

        // ── unshift() ──────────────────────────────────────────────────────────

        it('unshift() prepends an item', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            list.unshift(new User({ id: 99, name: 'First', email: 'first@example.com' }));

            expect(list.length).toBe(3);
            expect(list.at(0)!.name).toBe('First');
            expect(list.at(1)!.name).toBe('John Doe');
        });

        // ── remove() ───────────────────────────────────────────────────────────

        it('remove() deletes the item at the given index', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            list.remove(0);

            expect(list.length).toBe(1);
            expect(list.at(0)!.name).toBe('mr Smith');
        });

        // ── find() ─────────────────────────────────────────────────────────────

        it('find() returns the first matching item', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            const found = list.find(u => u.name === 'mr Smith');
            expect(found).toBeInstanceOf(User);
            expect(found!.email).toBe('mr.smith@doe.com');
        });

        it('find() returns undefined when no item matches', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            expect(list.find(u => u.name === 'Nobody')).toBeUndefined();
        });

        // ── filter() ───────────────────────────────────────────────────────────

        it('filter() returns all matching items without mutating the list', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            const filtered = list.filter(u => u.id > 0);

            expect(filtered).toHaveLength(2);
            expect(list.length).toBe(2); // original unchanged
        });

        it('filter() returns empty array when nothing matches', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            expect(list.filter(u => u.id > 999)).toHaveLength(0);
        });

        // ── cache ──────────────────────────────────────────────────────────────

        it('isCached() returns false before setCache is called', () => {
            const list = new A_ServerEntityList<User>({ entity: User });
            expect(list.isCached()).toBe(false);
        });

        it('setCache() / isCached() / invalidateCache() lifecycle', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            expect(list.isCached()).toBe(false);

            list.setCache(60_000);
            expect(list.isCached()).toBe(true);

            list.invalidateCache();
            expect(list.isCached()).toBe(false);
        });

        it('setCache() with a negative ttl reports as stale immediately', () => {
            const list = new A_ServerEntityList<User>({ entity: User });
            list.setCache(-1);
            expect(list.isCached()).toBe(false);
        });

        // ── chaining ───────────────────────────────────────────────────────────

        it('mutation methods return `this` for chaining', async () => {
            const list = new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 10 } });
            clientScope.register(list);
            await list.load();

            const newUser = new User({ id: 3, name: 'Chained', email: 'chain@example.com' });
            const result = list.push(newUser).remove(0).setCache(5_000);

            expect(result).toBe(list);
            expect(list.length).toBe(2);
            expect(list.isCached()).toBe(true);
        });
    });
});
