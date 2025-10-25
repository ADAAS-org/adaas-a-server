import { IncomingMessage } from "http";
import { A_Request } from "./A-Request.entity";
import { A_TYPES__Entity_Serialized } from "@adaas/a-concept";
export type A_SERVER_TYPES__RequestConstructor = {
    /**
     * Should correspond to Response id
     */
    id: string;
    request: IncomingMessage;
    scope: string;
};
export type A_SERVER_TYPES__RequestSerialized = {} & A_TYPES__Entity_Serialized;
export type A_SERVER_TYPES__RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | 'DEFAULT';
export declare enum A_SERVER_TYPES__RequestEvent {
    Error = "error",
    Finish = "finish",
    Data = "data",
    End = "end",
    Close = "close"
}
export type A_SERVER_TYPES__RequestEventCallback = (request: A_Request) => void;
