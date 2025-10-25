import { A_Context, A_Feature, A_Inject, A_Scope } from '@adaas/a-concept';
import { A_HTTPChannel } from '@adaas/a-server/channels/A-Http/A-Http.channel';
import { A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle } from '@adaas/a-server/channels/A-Http/A-Http.channel.constants';
import { A_HTTPChannel_RequestContext } from '@adaas/a-server/context/A-HttpChannel/A-HttpChannel.context';

jest.retryTimes(0);


type MockResponse = Array<{ userId: number; id: number; title: string; body: string; customField: string }>

describe('A-HttpChannel Tests', () => {
    it('Should be possible to create a new HttpChannel', async () => {
        const scope = new A_Scope({
            components: [A_HTTPChannel]
        });


        const channel = scope.resolve(A_HTTPChannel);

        expect(channel).toBeInstanceOf(A_HTTPChannel);
        expect(channel.processing).toBe(false);
    });
    it('Should be possible to create a custom Channel', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;

            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        const scope = new A_Scope({
            components: [myChannel]
        });

        const channel = scope.resolve(myChannel);
        expect(channel).toBeInstanceOf(myChannel);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>(
            '/posts',
            { userId: 1 }
        );

        expect(Array.isArray(response.result)).toBe(true);
        expect(response.result?.length).toBeGreaterThan(0);
        expect(response.result?.[0].userId).toBe(1);
    });

    it('Should throw an error if baseUrl is not set', async () => {
        const scope = new A_Scope({
            components: [A_HTTPChannel]
        });

        const channel = scope.resolve(A_HTTPChannel);

        await expect(channel.get('/posts')).rejects.toThrow("Base URL is not set for HTTP Channel");
    });

    it('Should allow to extend response handler behavior', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;
            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        class myChannelWithCustomResponseHandler extends myChannel {

            @A_Feature.Extend({
                name: A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onAfterRequest
            })
            protected async handleResponse<T>(
                @A_Inject(A_HTTPChannel_RequestContext) context: A_HTTPChannel_RequestContext<MockResponse>
            ): Promise<void> {
                context.result = context.result?.map(item => ({
                    ...item,
                    customField: 'customValue'
                })) || [];
            }
        }

        const scope = new A_Scope({
            components: [myChannel, myChannelWithCustomResponseHandler]
        });

        const channel = scope.resolve(myChannelWithCustomResponseHandler);
        expect(channel).toBeInstanceOf(myChannelWithCustomResponseHandler);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>('/posts', { userId: 1 });

        expect(Array.isArray(response.result)).toBe(true);
        expect(response.result?.length).toBeGreaterThan(0);
        expect(response.result?.[0].userId).toBe(1);
        expect((response.result?.[0] as any).customField).toBe('customValue');
    });
    it('Should allow to extend error handler behavior', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;
            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        class myChannelWithCustomErrorHandler extends myChannel {
            @A_Feature.Extend({
                name: A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onError
            })
            protected async handleError(
                @A_Inject(A_HTTPChannel_RequestContext) context: A_HTTPChannel_RequestContext<MockResponse>,
                error: any
            ): Promise<void> {
                context.result = [{
                    userId: -1,
                    id: -1,
                    title: 'error',
                    body: 'error',
                    customField: 'customValue'
                }];
            }
        }

        const scope = new A_Scope({
            components: [myChannel, myChannelWithCustomErrorHandler]
        });

        const channel = scope.resolve(myChannelWithCustomErrorHandler);
        expect(channel).toBeInstanceOf(myChannelWithCustomErrorHandler);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>('/posts_invalid', { userId: 1 }, { throwOnError: false });

        expect(Array.isArray(response.result)).toBe(true);
        expect(response.result?.length).toBe(1);
        expect(response.result?.[0].userId).toBe(-1);
        expect((response.result?.[0] as any).customField).toBe('customValue');
    });

    it('Should do a proper filtering with query params', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;
            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        const scope = new A_Scope({
            components: [myChannel]
        });

        const channel = scope.resolve(myChannel);
        expect(channel).toBeInstanceOf(myChannel);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>('/posts', { userId: 1 });

        expect(Array.isArray(response.result)).toBe(true);
        expect(response.result?.length).toBeGreaterThan(0);
        expect(response.result?.every(item => item.userId === 1)).toBe(true);
    });

    it('Should be possible to do a POST request', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;
            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        const scope = new A_Scope({
            components: [myChannel]
        });

        const channel = scope.resolve(myChannel);
        expect(channel).toBeInstanceOf(myChannel);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.post<MockResponse>(
            '/posts',
            {
                title: 'foo',
                body: 'bar',
                userId: 1,
            }
        );

        expect(response.result).toBeDefined();
        expect((response.result as any).id).toBeDefined();
        expect((response.result as any).title).toBe('foo');
        expect((response.result as any).body).toBe('bar');
        expect((response.result as any).userId).toBe(1);
    });
});