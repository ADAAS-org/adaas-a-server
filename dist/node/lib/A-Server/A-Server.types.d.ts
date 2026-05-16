import { A_TYPES__Error_Init, A_TYPES__Error_Serialized } from '@adaas/a-concept';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';

type A_SERVER_TYPES__ServerConstructor = {
    name: string;
    version: string;
    routes: A_ServerRoute[];
    port: number;
};
type A_SERVER_TYPES__ServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init;
type A_SERVER_TYPES__ServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number;
} & A_TYPES__Error_Serialized;

export type { A_SERVER_TYPES__ServerConstructor, A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized };
