import { A_Component, A_Scope } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-6qhiV7BE.mjs';
import 'http';
import '../../lib/A-Server/A-HttpServer.error.mjs';
import '../../lib/A-Server/A-HttpServer.types.mjs';
import '../../lib/A-Server/A-HttpServer.constants.mjs';
import '../../lib/A-Request/A-Request.constants.mjs';
import '../../lib/A-Request/A-Request.env.mjs';
import '../../lib/A-Request/A-HttpServerRequest.context.mjs';
import '@adaas/a-utils/a-operation';
import '../../lib/A-Request/A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import '../../lib/A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.mjs';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.mjs';
import 'stream';
import '../../lib/A-Response/A-Response.constants.mjs';

declare class A_EntityController extends A_Component {
    load(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    create(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    update(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    delete(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    callEntity(request: A_Request<any, any, {
        aseid: string;
        action: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}

export { A_EntityController };
