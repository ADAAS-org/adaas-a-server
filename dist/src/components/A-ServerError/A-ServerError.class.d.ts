import { A_Error } from '@adaas/a-concept';
import { A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized } from './A-ServerError.types';
export declare class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {
    status: number;
    protected fromConstructor(params: A_SERVER_TYPES__ServerError_Init): void;
    toJSON(): A_SERVER_TYPES__ServerError_Serialized;
}
