import { A_TYPES__Error_Init, A_TYPES__Error_Serialized } from "@adaas/a-concept";
export type A_SERVER_TYPES__ServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init;
export type A_SERVER_TYPES__ServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number;
} & A_TYPES__Error_Serialized;
