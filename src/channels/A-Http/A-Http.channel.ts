import { A_Context, A_Scope } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerMethod } from "../../containers/A-Service/A-Service.container.types";
import { A_HTTPChannel_RequestContext } from "../../context/A-HttpChannel/A-HttpChannel.context";
import { A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle } from "./A-Http.channel.constants";
import { A_ServerError } from "@adaas/a-server/components/A-ServerError/A-ServerError.class";
import { A_Channel } from "@adaas/a-utils";
import { A_HTTPChannelError } from "./A-Http.channel.error";
import { A_SERVER_TYPES__HttpChannelRequestConfig, A_SERVER_TYPES__HttpChannelRequestParams, A_SERVER_TYPES__HttpChannelSendParams } from "./A-Http.channel.types";



export class A_HTTPChannel extends A_Channel {

    protected baseUrl?: string;

    /**
     * Allows to send an HTTP request without expecting a response
     * 
     * @param params 
     */
    async send(params: A_SERVER_TYPES__HttpChannelSendParams): Promise<void> {
        this.request(params);
    }

    /**
     * Makes an HTTP request
     * 
     * @param params 
     * @returns 
     */
    async request<T = any, M extends Record<string, any> = any>(
        /**
         * Provide request parameters
         */
        params: A_SERVER_TYPES__HttpChannelRequestParams<M>
    ): Promise<A_HTTPChannel_RequestContext<T>> {
        const { method, url, data, config } = params;

        await this.initialize;

        this._processing = true;

        const fullUrl = this.buildURL(url, config?.params);

        const requestScope = new A_Scope({ name: `a-http-channel-request-scope-${method}-${url}-${Date.now()}` });
        const context = new A_HTTPChannel_RequestContext({
            method,
            url,
            data,
            config
        });

        requestScope.inherit(A_Context.scope(this));
        requestScope.register(context);

        try {
            await this.call(A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onBeforeRequest, requestScope);

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                ...config?.headers,
            };

            const options: RequestInit = {
                method,
                headers,
            };

            if (data && method !== A_SERVER_TYPES__ServerMethod.GET) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(fullUrl, options);

            if (!response.ok) {
                throw new A_ServerError({
                    status: response.status,
                    title: response.statusText,
                    description: `HTTP request to ${fullUrl} failed with status ${response.status}`,
                });
            }

            context.result =
                config?.params?.responseType === "text"
                    ? await response.text()
                    : config?.params?.responseType === "blob"
                        ? await response.blob()
                        : await response.json();

            await this.call(A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onAfterRequest, requestScope);

            this._processing = false;

            return context as A_HTTPChannel_RequestContext<T>;

        } catch (error) {

            this._processing = false;

            context.error = error;

            await this.call(A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onError, requestScope);

            if (config?.throwOnError === false)
                return context as A_HTTPChannel_RequestContext<T>;
            else
                throw error;
        }
    }

    async post<T, M extends Record<string, any> = any>(
        url: string,
        body?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_HTTPChannel_RequestContext<T>> {
        return this.request<T, M>(
            {
                method: A_SERVER_TYPES__ServerMethod.POST,
                url,
                data: body,
                config,
            }
        );
    }

    async get<T, M extends Record<string, any> = any>(
        url: string,
        params?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_HTTPChannel_RequestContext<T>> {
        return this.request<T, M>(
            {
                method: A_SERVER_TYPES__ServerMethod.GET,
                url,
                config: {
                    ...config,
                    params,
                }
            }
        );
    }

    async put<T, M extends Record<string, any> = any>(
        url: string,
        body?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_HTTPChannel_RequestContext<T>> {
        return this.request<T, M>({
            method: A_SERVER_TYPES__ServerMethod.PUT,
            url,
            data: body,
            config,
        });
    }

    async delete<T, M extends Record<string, any> = any>(
        url: string,
        params?: any,
        config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>,
    ): Promise<A_HTTPChannel_RequestContext<T>> {
        return this.request<T, M>({
            method: A_SERVER_TYPES__ServerMethod.DELETE,
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
