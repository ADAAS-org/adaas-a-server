import { A_Component, A_Scope, A_Container } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A_Logger } from '@adaas/a-utils/a-logger';
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
import '@adaas/a-utils/a-config';
import '../../lib/A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.js';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.js';
import 'stream';
import '../../lib/A-Response/A-Response.constants.js';

declare class A_CommandController extends A_Component {
    handleCommand(req: A_Request<any, any, {
        command: string;
    }>, res: A_Response, scope: A_Scope, container: A_Container, logger: A_Logger): Promise<void>;
}

export { A_CommandController };
