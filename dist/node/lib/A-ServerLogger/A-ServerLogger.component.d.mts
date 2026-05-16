import { A_Error } from '@adaas/a-concept';
import { A_Server } from '../A-Server/A-Server.context.mjs';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-BVYAc6-8.mjs';
import { A_HttpServerRequestContext } from '../A-Request/A-HttpServerRequest.context.mjs';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import '../A-Server/A-Server.types.mjs';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';
import 'http';
import '../A-Server/A-HttpServer.error.mjs';
import '../A-Server/A-HttpServer.types.mjs';
import '../A-Server/A-HttpServer.constants.mjs';
import '../A-Request/A-Request.constants.mjs';
import '../A-Request/A-Request.env.mjs';
import '../A-Request/A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import 'stream';
import '../A-Response/A-Response.constants.mjs';
import '@adaas/a-utils/a-operation';

declare class A_ServerLogger extends A_Logger {
    protected config: A_Config<any>;
    logRequestFinish(request: A_Request, response: A_Response, context: A_HttpServerRequestContext): void;
    logResponseError(request: A_Request, response: A_Response, context: A_HttpServerRequestContext, error: A_Error): void;
    logStop(server: A_Server): void;
    serverReady(params: {
        port: number;
        app: {
            name: string;
            version?: string;
        };
    }): void;
    /**
     * Displays a proxy routes
     *
     * @param params
     */
    proxy(params: {
        original: string;
        destination: string;
    }): void;
}

export { A_ServerLogger };
