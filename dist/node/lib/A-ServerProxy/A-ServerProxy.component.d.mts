import { A_Component, A_Feature } from '@adaas/a-concept';
import { A_ProxyConfig } from './A-ServerProxy.context.mjs';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A as A_Response } from '../../A-Response.entity-BVYAc6-8.mjs';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import './A-ServerProxy.types.mjs';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';
import 'http';
import '../A-Server/A-HttpServer.error.mjs';
import '../A-Server/A-HttpServer.types.mjs';
import '../A-Server/A-HttpServer.constants.mjs';
import '../A-Request/A-Request.constants.mjs';
import '../A-Request/A-Request.env.mjs';
import '../A-Request/A-HttpServerRequest.context.mjs';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import 'stream';
import '../A-Response/A-Response.constants.mjs';

declare class A_ServerProxy extends A_Component {
    load(logger: A_Logger, config: A_ProxyConfig): Promise<void>;
    onRequest(req: A_Request, res: A_Response, proxyConfig: A_ProxyConfig, logger: A_Logger, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
}

export { A_ServerProxy };
