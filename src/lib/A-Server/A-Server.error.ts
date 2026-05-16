import { A_Error } from '@adaas/a-concept';
import { A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized } from './A-Server.types';


export class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {

    status: number = 500;


    protected fromConstructor(params: A_SERVER_TYPES__ServerError_Init): void {
        super.fromConstructor(params);
        if (params.status) {
            this.status = params.status;
        }
    }


    toJSON(): A_SERVER_TYPES__ServerError_Serialized {
        return {
            ...super.toJSON(),
            status: this.status
        }
    }
}


