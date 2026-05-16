import { A_Component, A_Feature } from '@adaas/a-concept';
import { A_ProxyConfig } from './A-ServerProxy.context.js';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-CRc-t-vr.js';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import './A-ServerProxy.types.js';
import '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';
import 'http';
import '../A-Server/A-HttpServer.error.js';
import '../A-Server/A-HttpServer.types.js';
import '../A-Server/A-HttpServer.constants.js';
import '../A-Request/A-Request.constants.js';
import '../A-Request/A-Request.env.js';
import '../A-Request/A-HttpServerRequest.context.js';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import 'stream';
import '../A-Response/A-Response.constants.js';

declare class A_ServerProxy extends A_Component {
    load(logger: A_Logger, config: A_ProxyConfig): Promise<void>;
    onRequest(req: A_Request, res: A_Response, proxyConfig: A_ProxyConfig, logger: A_Logger, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
}

export { A_ServerProxy };
