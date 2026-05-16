import { A_Component } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-CRc-t-vr.js';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerLogger } from '../../lib/A-ServerLogger/A-ServerLogger.component.js';
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
import '../../lib/A-Server/A-Server.context.js';
import '../../lib/A-Server/A-Server.types.js';
import '@adaas/a-utils/a-logger';

declare class A_ServerHealthMonitor extends A_Component {
    get(config: A_Config<['VERSION_PATH', 'EXPOSED_PROPERTIES']>, request: A_Request, response: A_Response, logger: A_ServerLogger): Promise<any>;
}

export { A_ServerHealthMonitor };
