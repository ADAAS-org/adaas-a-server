import * as _adaas_a_concept from '@adaas/a-concept';
import { A_Component, A_TYPES__Required, A_Scope } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-r905O60G.mjs';
import { A_ServerLogger } from '../A-ServerLogger/A-ServerLogger.component.mjs';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A as A_Response } from '../../A-Response.entity-BVYAc6-8.mjs';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.mjs';
import { A_ServerRouterRouteConfig } from './A-ServerRouter.types.mjs';
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
import '../A-Server/A-Server.context.mjs';
import '../A-Server/A-Server.types.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';
import 'stream';
import '../A-Response/A-Response.constants.mjs';
import './A-ServerRouter.constants.mjs';

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
