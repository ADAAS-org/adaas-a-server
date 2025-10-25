import { A_Error } from '@adaas/a-concept';
import { A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized } from './A-ServerError.types';


export class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {

    status: number = 500;


    // constructor(
    //     /**
    //      * A_Error Constructor params
    //      */
    //     params: A_SERVER_TYPES__ServerError_Init
    // )
    // constructor(
    //     /**
    //      * HTTP Status Code of the error
    //      */
    //     status: number,
    //     /**
    //      * Error message
    //      */
    //     message: string
    // )
    // constructor(
    //     /**
    //      * Original JS Error
    //      */
    //     error: Error
    // )
    // constructor(
    //     /**
    //      * HTTP Status Code of the error
    //      */
    //     status: number,
    //     /**
    //      * Error message
    //      */
    //     title: string,
    //     /**
    //      * Detailed description of the error
    //      */
    //     description: string
    // )
    // constructor(
    //     param1: A_SERVER_TYPES__ServerError_Init | Error | string | A_Error | number,
    //     param2?: string | A_Error,
    //     param3?: string
    // ) {
    //   switch (true) {
    //     case typeof param1 === 'number':
    //         if (typeof param2 === 'string' && param3) {
    //             super({
    //                 title: param2,
    //                 description: param3
    //             });
    //         }
    //         else if (param2 instanceof A_Error) {
    //             super(param2);
    //         }
    //         else {
    //             super();
    //         }
    //         this.status = param1;
    //         break;

    //     case param1 instanceof A_Error:
    //         super (param1);
    //         break;
    //     case param1 instanceof Error:
    //         super (param1);
    //         break;
      
    //     default:
    //         break;
    //   }

    // }


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


