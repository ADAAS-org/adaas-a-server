import { A_Error } from '@adaas/a-concept';
import { A_Server } from '../A-Server/A-Server.context.js';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A_HttpServerRequestContext } from '../A-Request/A-HttpServerRequest.context.js';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import '../A-Server/A-Server.types.js';
import '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';
import 'http';
import '../A-Server/A-HttpServer.error.js';
import '../A-Server/A-HttpServer.types.js';
import '../A-Server/A-HttpServer.constants.js';
import '../A-Request/A-Request.constants.js';
import '../A-Request/A-Request.env.js';
import '../A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import 'stream';
import '../A-Response/A-Response.constants.js';
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
