import { A_SERVER_TYPES__ServerMethod } from "@adaas/a-server/containers/A-Service/A-Service.container.types";

export type A_SERVER_TYPES__HttpChannelSendParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_SERVER_TYPES__ServerMethod,
    /**
     * Request URL
     */
    url: string,
    /**
     * Request Body or Query Parameters
     */
    data?: any,
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>,
}


export type A_SERVER_TYPES__HttpChannelRequestParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_SERVER_TYPES__ServerMethod,
    /**
     * Request URL
     */
    url: string,
    /**
     * Request Body or Query Parameters
     */
    data?: any,
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>,
}


export type A_SERVER_TYPES__HttpChannelRequestConfig<M extends Record<string, any> = any> = {
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


