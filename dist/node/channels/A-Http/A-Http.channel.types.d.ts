import { A_HttpServerRequestMethod } from '../../lib/A-Server/A-HttpServer.types.js';
import { A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle } from './A-Http.channel.constants.js';
import '@adaas/a-concept';
import '../../lib/A-Server/A-HttpServer.constants.js';
import '@adaas/a-utils/a-channel';

type A_SERVER_CONSTANTS__A_HttpChannel_LifecycleNames = typeof A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle[keyof typeof A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle];
type A_SERVER_TYPES__HttpChannelSendParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_HttpServerRequestMethod;
    /**
     * Request URL
     */
    url: string;
    /**
     * Request Body or Query Parameters
     */
    data?: any;
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>;
};
type A_SERVER_TYPES__HttpChannelRequestParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_HttpServerRequestMethod;
    /**
     * Request URL
     */
    url: string;
    /**
     * Request Body or Query Parameters
     */
    data?: any;
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>;
};
type A_SERVER_TYPES__HttpChannelRequestConfig<M extends Record<string, any> = any> = {
    /**
     * Response Type
     */
    responseType: "json" | "text" | "blob";
    /**
     * Request Headers
     */
    headers: Record<string, string>;
    /**
     * Query Parameters
     */
    params: Record<string, any>;
    /**
     * Metadata
     */
    meta: M;
    /**
     * Throw on Error
     */
    throwOnError: boolean;
};

export type { A_SERVER_CONSTANTS__A_HttpChannel_LifecycleNames, A_SERVER_TYPES__HttpChannelRequestConfig, A_SERVER_TYPES__HttpChannelRequestParams, A_SERVER_TYPES__HttpChannelSendParams };
