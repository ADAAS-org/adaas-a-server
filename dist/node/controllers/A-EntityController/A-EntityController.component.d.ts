import { A_Component, A_Scope } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A_Config } from '@adaas/a-utils/a-config';
import 'http';
import '../../lib/A-Server/A-HttpServer.error.js';
import '../../lib/A-Server/A-HttpServer.types.js';
import '../../lib/A-Server/A-HttpServer.constants.js';
import '../../lib/A-Request/A-Request.constants.js';
import '../../lib/A-Request/A-Request.env.js';
import '../../lib/A-Request/A-HttpServerRequest.context.js';
import '@adaas/a-utils/a-operation';
import '../../lib/A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import '../../lib/A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.js';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.js';
import 'stream';
import '../../lib/A-Response/A-Response.constants.js';

declare class A_EntityController extends A_Component {
    list(request: A_Request<any, any, {
        type: string;
    }>, response: A_Response, scope: A_Scope, config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>): Promise<void>;
    load(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    create(request: A_Request<any, any, {
        aseid: string;
    }>, scope: A_Scope): Promise<void>;
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
