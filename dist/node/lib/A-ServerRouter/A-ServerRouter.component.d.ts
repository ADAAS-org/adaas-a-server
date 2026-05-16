import * as _adaas_a_concept from '@adaas/a-concept';
import { A_Component, A_TYPES__Required, A_Scope } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A_ServerLogger } from '../A-ServerLogger/A-ServerLogger.component.js';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.js';
import { A_ServerRouterRouteConfig } from './A-ServerRouter.types.js';
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
import '../A-Server/A-Server.context.js';
import '../A-Server/A-Server.types.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';
import 'stream';
import '../A-Response/A-Response.constants.js';
import './A-ServerRouter.constants.js';

declare class A_ServerRouter extends A_Component {
    /**
     * Allows to define a custom route for POST requests
     *
     * @param path
     * @returns
     */
    static Post(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for GET requests
     *
     * @param path
     * @returns
     */
    static Get(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PUT requests
     *
     * @param path
     * @returns
     */
    static Put(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DELETE requests
     *
     * @param path
     * @returns
     */
    static Delete(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PATCH requests
     *
     * @param path
     * @returns
     */
    static Patch(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DEFAULT requests
     *
     * @param path
     * @returns
     */
    static Default(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Private method to have the same signature for all route methods
     *
     * @param method
     * @param path
     * @returns
     */
    private static defineRoute;
    protected load(logger: A_ServerLogger): Promise<void>;
    identifyRoute(request: A_Request, response: A_Response, scope: A_Scope, config: A_Config, logger: A_Logger, route: A_ServerRoute): Promise<void>;
}

export { A_ServerRouter };
