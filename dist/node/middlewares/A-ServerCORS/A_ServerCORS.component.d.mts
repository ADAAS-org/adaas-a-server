import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-6qhiV7BE.mjs';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerMiddleware } from '../../lib/A-ServerMiddleware/A-ServerMiddleware.component.mjs';
import 'http';
import '@adaas/a-concept';
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

declare class A_ServerCORS extends A_ServerMiddleware {
    private config;
    init(config: A_Config<['ORIGIN', 'METHODS', 'HEADERS', 'CREDENTIALS', 'MAX_AGE']>): Promise<void>;
    apply(aReq: A_Request, aRes: A_Response): void;
}

export { A_ServerCORS };
