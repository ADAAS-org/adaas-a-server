import { A_TYPES__Error_Init, A_TYPES__Error_Serialized } from "@adaas/a-concept"
import { A_HttpServerFeatures } from "./A-HttpServer.constants";


export type A_HttpServerRequestMethod = 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD'
    | 'CONNECT'
    | 'TRACE'
    | 'DEFAULT'; // Default is used for routes that do not have a method specified

export type A_HttpServerFeatureNames = typeof A_HttpServerFeatures[keyof typeof A_HttpServerFeatures]



export type A_HttpServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init




export type A_HttpServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number
} & A_TYPES__Error_Serialized


