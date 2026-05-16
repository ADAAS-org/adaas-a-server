import { Server, IncomingMessage, ServerResponse } from 'http';
import { A_HttpServerFeatures } from './A-HttpServer.constants.mjs';
import { A_TYPES__ServerENVVariables } from '../../constants/env.constants.mjs';
import { A_ServerLogger } from '../A-ServerLogger/A-ServerLogger.component.mjs';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_Config } from '@adaas/a-utils/a-config';
import '@adaas/a-concept';
import './A-Server.context.mjs';
import './A-Server.types.mjs';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';
import '../../A-Request.entity-r905O60G.mjs';
import './A-HttpServer.error.mjs';
import './A-HttpServer.types.mjs';
import '../A-Request/A-Request.constants.mjs';
import '../A-Request/A-Request.env.mjs';
import '../A-Request/A-HttpServerRequest.context.mjs';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import '../../A-Response.entity-BVYAc6-8.mjs';
import 'stream';
import '../A-Response/A-Response.constants.mjs';
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
