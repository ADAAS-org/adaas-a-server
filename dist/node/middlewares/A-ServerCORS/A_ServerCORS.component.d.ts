import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-CRc-t-vr.js';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerMiddleware } from '../../lib/A-ServerMiddleware/A-ServerMiddleware.component.js';
import 'http';
import '@adaas/a-concept';
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

declare class A_ServerCORS extends A_ServerMiddleware {
    private config;
    init(config: A_Config<['ORIGIN', 'METHODS', 'HEADERS', 'CREDENTIALS', 'MAX_AGE']>): Promise<void>;
    apply(aReq: A_Request, aRes: A_Response): void;
}

export { A_ServerCORS };
