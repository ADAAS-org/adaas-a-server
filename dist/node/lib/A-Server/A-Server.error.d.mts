import { A_Error } from '@adaas/a-concept';
import { A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized } from './A-Server.types.mjs';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {
    status: number;
    protected fromConstructor(params: A_SERVER_TYPES__ServerError_Init): void;
    toJSON(): A_SERVER_TYPES__ServerError_Serialized;
}

export { A_ServerError };
