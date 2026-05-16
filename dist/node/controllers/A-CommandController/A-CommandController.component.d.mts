import { A_Component, A_Scope, A_Container } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-BVYAc6-8.mjs';
import { A_Logger } from '@adaas/a-utils/a-logger';
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

declare class A_CommandController extends A_Component {
    handleCommand(req: A_Request<any, any, {
        command: string;
    }>, res: A_Response, scope: A_Scope, container: A_Container, logger: A_Logger): Promise<void>;
}

export { A_CommandController };
