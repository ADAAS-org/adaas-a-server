import { A_Entity, A_Error, A_Scope } from "@adaas/a-concept";
import { IncomingHttpHeaders, ServerResponse } from "http";
import { A_SERVER_TYPES__ResponseConstructor, A_SERVER_TYPES__ResponseSerialized, A_SERVER_TYPES__SendResponseObject } from "./A-Response.entity.types";
import { A_ServerError } from "../../components/A-ServerError/A-ServerError.class";
export declare class A_Response<_ResponseType = any> extends A_Entity<A_SERVER_TYPES__ResponseConstructor, A_SERVER_TYPES__ResponseSerialized> {
    /**
     * Duration of the request in milliseconds
     */
    duration: number;
    private res;
    private data;
    error?: A_ServerError;
    fromNew(newEntity: A_SERVER_TYPES__ResponseConstructor): void;
    get headersSent(): boolean;
    get original(): ServerResponse<import("http").IncomingMessage>;
    get statusCode(): number;
    init(): Promise<void>;
    failed(error: A_ServerError | A_Error | Error | any): void;
    send(data?: string | object): void;
    destroy(error: Error | unknown, scope?: A_Scope): Promise<any>;
    json(data?: object): void;
    status(code: number): this;
    writeHead(statusCode: number, headers?: Record<string, string> | IncomingHttpHeaders | any): void;
    setHeader(key: string, value: string): void;
    getHeader(key: string): string | number | string[] | undefined;
    add(key: string, data: _ResponseType): void;
    toResponse(): A_SERVER_TYPES__SendResponseObject<_ResponseType>;
}
