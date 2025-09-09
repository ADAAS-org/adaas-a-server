import { A_Container } from "@adaas/a-concept";
import { IncomingMessage, ServerResponse } from "http";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_ServerContainer extends A_Container {
    private server;
    private port;
    load(): Promise<void>;
    protected listen(): Promise<void>;
    protected close(): Promise<void>;
    start(): Promise<void>;
    beforeStart(): Promise<void>;
    afterStart(): Promise<void>;
    stop(): Promise<void>;
    onRequest(request: IncomingMessage, response: ServerResponse): Promise<void>;
    protected convertToAServer(request: IncomingMessage, response: ServerResponse): Promise<{
        req: A_Request;
        res: A_Response;
    }>;
    protected generateRequestId(method: string, url: string): string;
    beforeStop(): Promise<void>;
    afterStop(): Promise<void>;
}
