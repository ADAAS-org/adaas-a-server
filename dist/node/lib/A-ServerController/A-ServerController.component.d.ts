import { A_Component, A_Scope } from '@adaas/a-concept';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import 'http';
import 'stream';
import '../A-Response/A-Response.constants.js';
import '../A-Server/A-HttpServer.error.js';
import '../A-Server/A-HttpServer.types.js';
import '../A-Server/A-HttpServer.constants.js';
import '../A-Request/A-HttpServerRequest.context.js';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-Request.constants.js';
import '../A-Request/A-Request.env.js';
import '../A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';

declare class A_ServerController extends A_Component {
    callEntityMethod(request: A_Request<any, any, {
        component: string;
        operation: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}

export { A_ServerController };
