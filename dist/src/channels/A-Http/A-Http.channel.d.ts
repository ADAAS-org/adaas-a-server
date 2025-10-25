import { A_HTTPChannel_RequestContext } from "../../context/A-HttpChannel/A-HttpChannel.context";
import { A_Channel } from "@adaas/a-utils";
import { A_SERVER_TYPES__HttpChannelRequestConfig, A_SERVER_TYPES__HttpChannelRequestParams, A_SERVER_TYPES__HttpChannelSendParams } from "./A-Http.channel.types";
export declare class A_HTTPChannel extends A_Channel {
    protected baseUrl?: string;
    /**
     * Allows to send an HTTP request without expecting a response
     *
     * @param params
     */
    send(params: A_SERVER_TYPES__HttpChannelSendParams): Promise<void>;
    /**
     * Makes an HTTP request
     *
     * @param params
     * @returns
     */
    request<T = any, M extends Record<string, any> = any>(
    /**
     * Provide request parameters
     */
    params: A_SERVER_TYPES__HttpChannelRequestParams<M>): Promise<A_HTTPChannel_RequestContext<T>>;
    post<T, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    get<T, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    put<T, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    delete<T, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    protected buildURL(path?: string, params?: Record<string, any>): string;
}
