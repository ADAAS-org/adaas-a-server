import { A_Component } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-6qhiV7BE.mjs';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerLogger } from '../../lib/A-ServerLogger/A-ServerLogger.component.mjs';
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
import '../../lib/A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.mjs';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.mjs';
import 'stream';
import '../../lib/A-Response/A-Response.constants.mjs';
import '@adaas/a-utils/a-logger';

declare class A_ServerHealthMonitor extends A_Component {
    get(config: A_Config<['VERSION_PATH', 'EXPOSED_PROPERTIES']>, request: A_Request, response: A_Response, logger: A_ServerLogger): Promise<any>;
}

export { A_ServerHealthMonitor };
