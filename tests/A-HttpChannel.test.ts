import { A_Feature, A_Inject, A_Scope } from '@adaas/a-concept';
import { A_ChannelRequest } from '@adaas/a-utils/a-channel';
import { A_HTTPChannel } from '@adaas/a-server/channels/A-Http/A-Http.channel';
import { A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle } from '@adaas/a-server/channels/A-Http/A-Http.channel.constants';

jest.retryTimes(0);


type MockResponse = Array<{ userId: number; id: number; title: string; body: string; customField: string }>

describe('A-HttpChannel Tests', () => {
    it('Should be possible to create a new HttpChannel', async () => {
        const scope = new A_Scope({
            components: [A_HTTPChannel]
        });

        const channel = scope.resolve(A_HTTPChannel)!;

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

        const channel = scope.resolve(myChannel)!;
        expect(channel).toBeInstanceOf(myChannel);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>(
            '/posts',
            { userId: 1 }
        );

        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data?.length).toBeGreaterThan(0);
        expect(response.data?.[0].userId).toBe(1);
    });

    it('Should throw an error if baseUrl is not set', async () => {
        const scope = new A_Scope({
            components: [A_HTTPChannel]
        });

        const channel = scope.resolve(A_HTTPChannel)!;

        // The error is wrapped by A-Feature processing machinery, so we only check it rejects
        await expect(channel.get('/posts')).rejects.toThrow();
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
            protected async handleResponse(
                @A_Inject(A_ChannelRequest) context: A_ChannelRequest<any, MockResponse>
            ): Promise<void> {
                context.succeed((context.data?.map(item => ({
                    ...item,
                    customField: 'customValue'
                })) || []) as unknown as MockResponse);
            }
        }

        const scope = new A_Scope({
            components: [myChannel, myChannelWithCustomResponseHandler]
        });

        const channel = scope.resolve(myChannelWithCustomResponseHandler)!;
        expect(channel).toBeInstanceOf(myChannelWithCustomResponseHandler);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>('/posts', { userId: 1 });

        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data?.length).toBeGreaterThan(0);
        expect(response.data?.[0].userId).toBe(1);
        expect((response.data?.[0] as any).customField).toBe('customValue');
    });

    it('Should call the error handler extension and still throw on request failure', async () => {
        class myChannel extends A_HTTPChannel {
            custom = true;
            constructor() {
                super();
                this.baseUrl = "https://jsonplaceholder.typicode.com";
            }
        }

        let errorHandlerCalled = false;

        class myChannelWithCustomErrorHandler extends myChannel {
            @A_Feature.Extend({
                name: A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onError
            })
            protected async handleError(
                @A_Inject(A_ChannelRequest) context: A_ChannelRequest<any, MockResponse>
            ): Promise<void> {
                errorHandlerCalled = true;
            }
        }

        const scope = new A_Scope({
            components: [myChannel, myChannelWithCustomErrorHandler]
        });

        const channel = scope.resolve(myChannelWithCustomErrorHandler)!;
        expect(channel).toBeInstanceOf(myChannelWithCustomErrorHandler);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        // request() always re-throws after calling onError; no throwOnError suppression in A_Channel
        await expect(channel.get<MockResponse>('/posts_invalid', { userId: 1 })).rejects.toThrow();
        expect(errorHandlerCalled).toBe(true);
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

        const channel = scope.resolve(myChannel)!;
        expect(channel).toBeInstanceOf(myChannel);
        expect(channel.custom).toBe(true);
        expect(channel.processing).toBe(false);

        const response = await channel.get<MockResponse>('/posts', { userId: 1 });

        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data?.length).toBeGreaterThan(0);
        expect(response.data?.every(item => item.userId === 1)).toBe(true);
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

        const channel = scope.resolve(myChannel)!;
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

        expect(response.data).toBeDefined();
        expect((response.data as any).id).toBeDefined();
        expect((response.data as any).title).toBe('foo');
        expect((response.data as any).body).toBe('bar');
        expect((response.data as any).userId).toBe(1);
    });
});
