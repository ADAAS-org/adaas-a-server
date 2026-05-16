import { Server, IncomingMessage, ServerResponse } from 'http';
import { A_HttpServerFeatures } from './A-HttpServer.constants.js';
import { A_TYPES__ServerENVVariables } from '../../constants/env.constants.js';
import { A_ServerLogger } from '../A-ServerLogger/A-ServerLogger.component.js';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_Config } from '@adaas/a-utils/a-config';
import '@adaas/a-concept';
import './A-Server.context.js';
import './A-Server.types.js';
import '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';
import '../../A-Request.entity-8_9MCXT2.js';
import './A-HttpServer.error.js';
import './A-HttpServer.types.js';
import '../A-Request/A-Request.constants.js';
import '../A-Request/A-Request.env.js';
import '../A-Request/A-HttpServerRequest.context.js';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import '../../A-Response.entity-bjh6bofZ.js';
import 'stream';
import '../A-Response/A-Response.constants.js';
import '@adaas/a-utils/a-logger';

/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
declare class A_HttpServer extends A_Service {
    protected server: Server;
    static get onBeforeRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static get onRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static get onAfterRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    protected [A_ServiceFeatures.onStart](polyfill: A_Polyfill, config: A_Config<A_TYPES__ServerENVVariables>): Promise<void>;
    protected [A_ServiceFeatures.onAfterStart](config: A_Config<A_TYPES__ServerENVVariables>, logger: A_ServerLogger): Promise<void>;
    protected [A_ServiceFeatures.onStop](...args: any[]): Promise<void>;
    close(): Promise<void>;
    listen(port: number): Promise<void>;
    protected [A_HttpServerFeatures.onBeforeRequest](...args: any[]): Promise<void>;
    protected [A_HttpServerFeatures.onRequest](...args: any[]): Promise<void>;
    protected [A_HttpServerFeatures.onAfterRequest](...args: any[]): Promise<void>;
    handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void>;
}

export { A_HttpServer };
