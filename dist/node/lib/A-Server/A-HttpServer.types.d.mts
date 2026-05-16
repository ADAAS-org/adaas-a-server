import { A_TYPES__Error_Init, A_TYPES__Error_Serialized } from '@adaas/a-concept';
import { A_HttpServerFeatures } from './A-HttpServer.constants.mjs';

type A_HttpServerRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | 'DEFAULT';
type A_HttpServerFeatureNames = typeof A_HttpServerFeatures[keyof typeof A_HttpServerFeatures];
type A_HttpServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init;
type A_HttpServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number;
} & A_TYPES__Error_Serialized;

export type { A_HttpServerError_Init, A_HttpServerError_Serialized, A_HttpServerFeatureNames, A_HttpServerRequestMethod };
