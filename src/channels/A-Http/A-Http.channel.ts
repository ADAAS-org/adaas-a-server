import { A_ServerError } from "@adaas/a-server/server/A-Server.error";
import { A_HTTPChannelError } from "./A-Http.channel.error";
import { A_SERVER_TYPES__HttpChannelRequestConfig, A_SERVER_TYPES__HttpChannelRequestParams } from "./A-Http.channel.types";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_Channel, A_ChannelRequest } from '@adaas/a-utils/a-channel'
import { A_Inject, A_Scope } from "@adaas/a-concept";


export class A_HTTPChannel extends A_Channel {

    protected baseUrl?: string;

    async onBeforeRequest(
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams>,
        @A_Inject(A_Scope) scope: A_Scope,
    ): Promise<void> {
        const { method, url, data, config } = context.params;

        const fullUrl = this.buildURL(url, config?.params);

        const route = new A_ServerRoute(fullUrl, method);
        scope.register(route);

        context.params.config = context.params.config || {};

        context.params.config.headers = {
            "Content-Type": "application/json",
            ...config?.headers,
        };
    }

    async onRequest(
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams>,
        @A_Inject(A_ServerRoute) route: A_ServerRoute,
    ): Promise<void> {
        const options: RequestInit = {
            method: route.method,
            headers: context.params.config?.headers || {
            },
        };

        if (context.params.data && route.method !== 'GET') {
            options.body = JSON.stringify(context.params.data);
        }

        const response = await fetch(route.url, options);

        if (!response.ok) {
            throw new A_ServerError({
                status: response.status,
                title: response.statusText,
                description: `HTTP request to ${route.url} failed with status ${response.status}`,
            });
        }


        switch (context.params.config?.params?.responseType) {
            case "text":
                context.succeed({
                    data: await response.text()
                });
                break;
            case "blob":
                context.succeed(await response.blob());
                break;
            default:
                context.succeed(await response.json());
                break;
        }
    }


    async post<T extends Record<string, any> = any, M extends Record<string, any> = any>(
        url: string,
        body?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>> {
        return this.request<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>({
            method: 'POST',
            url,
            data: body,
            config,
        });
    }

    async get<T extends Record<string, any> = any, M extends Record<string, any> = any>(
        url: string,
        params?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>> {
        return this.request<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>({
            method: 'GET',
            url,
            config: {
                ...config,
                params,
            }
        });
    }

    async put<T extends Record<string, any> = any, M extends Record<string, any> = any>(
        url: string,
        body?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>> {
        return this.request<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>({
            method: 'PUT',
            url,
            data: body,
            config,
        });
    }

    async delete<T extends Record<string, any> = any, M extends Record<string, any> = any>(
        url: string,
        params?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>> {
        return this.request<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>({
            method: 'DELETE',
            url,
            data: params,
            config,
        });
    }


    protected buildURL(path: string = '', params: Record<string, any> = {}): string {
        if (!this.baseUrl)
            throw new A_HTTPChannelError(
                A_HTTPChannelError.HttpRequestError,
                "Base URL is not set for HTTP Channel"
            );

        const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        return url.toString()
    }
}
