"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ServerError = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_ServerError extends a_concept_1.A_Error {
    constructor() {
        super(...arguments);
        this.status = 500;
    }
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
    fromConstructor(params) {
        super.fromConstructor(params);
        if (params.status) {
            this.status = params.status;
        }
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { status: this.status });
    }
}
exports.A_ServerError = A_ServerError;
//# sourceMappingURL=A-ServerError.class.js.map