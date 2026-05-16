import { A_SERVER_TYPES__HttpChannelRequestParams, A_SERVER_TYPES__HttpChannelRequestConfig } from './A-Http.channel.types.mjs';
import { A_ServerRoute } from '../../lib/A-ServerRoute/A-ServerRoute.entity.mjs';
import { A_Channel, A_ChannelRequest } from '@adaas/a-utils/a-channel';
import { A_Scope } from '@adaas/a-concept';
import '../../lib/A-Server/A-HttpServer.types.mjs';
import '../../lib/A-Server/A-HttpServer.constants.mjs';
import './A-Http.channel.constants.mjs';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.mjs';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_HTTPChannel extends A_Channel {
    protected baseUrl?: string;
    onBeforeRequest(context: A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams>, scope: A_Scope): Promise<void>;
    onRequest(context: A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams>, route: A_ServerRoute): Promise<void>;
    post<T extends Record<string, any> = any, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>>;
    get<T extends Record<string, any> = any, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>>;
    put<T extends Record<string, any> = any, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>>;
    delete<T extends Record<string, any> = any, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_ChannelRequest<A_SERVER_TYPES__HttpChannelRequestParams<M>, T>>;
    protected buildURL(path?: string, params?: Record<string, any>): string;
}

export { A_HTTPChannel };
