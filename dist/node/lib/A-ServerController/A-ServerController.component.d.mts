import { A_Component, A_Scope } from '@adaas/a-concept';
import { A as A_Response } from '../../A-Response.entity-6qhiV7BE.mjs';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import 'http';
import 'stream';
import '../A-Response/A-Response.constants.mjs';
import '../A-Server/A-HttpServer.error.mjs';
import '../A-Server/A-HttpServer.types.mjs';
import '../A-Server/A-HttpServer.constants.mjs';
import '../A-Request/A-HttpServerRequest.context.mjs';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-Request.constants.mjs';
import '../A-Request/A-Request.env.mjs';
import '../A-Request/A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_ServerController extends A_Component {
    callEntityMethod(request: A_Request<any, any, {
        component: string;
        operation: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}

export { A_ServerController };
