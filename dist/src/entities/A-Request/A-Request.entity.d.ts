import { IncomingHttpHeaders, IncomingMessage } from "http";
import { A_Entity } from '@adaas/a-concept';
import { A_ServerError } from "@adaas/a-utils";
import { A_SERVER_TYPES__RequestConstructor, A_SERVER_TYPES__RequestMethods, A_SERVER_TYPES__RequestSerialized } from "./A-Request.entity.types";
import { A_Route } from '../A-Route/A-Route.entity';
export declare class A_Request<_ReqBodyType = any, _ResponseType = any, _ParamsType extends Record<string, string> = any, _QueryType = any> extends A_Entity<A_SERVER_TYPES__RequestConstructor, A_SERVER_TYPES__RequestSerialized> {
    req: IncomingMessage;
    body: _ReqBodyType;
    params: _ParamsType;
    query: _QueryType;
    response?: _ResponseType;
    error?: A_ServerError;
    /**
     * Duration of the request in milliseconds
     */
    duration: number;
    fromNew(newEntity: A_SERVER_TYPES__RequestConstructor): void;
    protected generateRequestId(): string;
    get url(): string;
    get method(): A_SERVER_TYPES__RequestMethods;
    get headers(): IncomingHttpHeaders;
    get route(): A_Route;
    pipe(destination: NodeJS.WritableStream, options?: {
        end?: boolean | undefined;
    }): NodeJS.WritableStream;
    init(): Promise<void>;
    extractParams(url: string): Record<string, string>;
    extractQuery(url: string): Record<string, string>;
    parseBody(): Promise<any>;
}
