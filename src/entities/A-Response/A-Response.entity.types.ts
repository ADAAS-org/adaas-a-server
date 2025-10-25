import { A_TYPES__Entity_Serialized } from "@adaas/a-concept";
import { ServerResponse } from "http";


export type A_SERVER_TYPES__ResponseConstructor = {
    /**
     * Should correspond to Request id
     */
    id: string,
    scope: string,
    response: ServerResponse,
}

export enum A_SERVER_TYPES__ResponseEvent {
    Error = 'error',
    Finish = 'finish',
    Data = 'data',
    End = 'end',
    Close = 'close',
}

export type A_SERVER_TYPES__ResponseSerialized = A_TYPES__Entity_Serialized;


export type A_SERVER_TYPES__SendResponseObject<_ResponseType = any> = 
Record<string, _ResponseType> ;