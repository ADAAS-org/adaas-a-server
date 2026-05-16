import {
    A_Component,
    A_Concept,
    A_Context,
    A_Feature,
    A_Inject,
    A_Meta,
    A_Scope,
    A_TypeGuards,
    A_TYPES__Required
} from "@adaas/a-concept";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_ServerLogger } from "../A-ServerLogger/A-ServerLogger.component";
import { A_HttpServerFeatures } from "@adaas/a-server/server/A-HttpServer.constants";
import { A_HttpServerError } from "@adaas/a-server/server/A-HttpServer.error";
import { A_Config } from "@adaas/a-utils/a-config";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_ServerRouteHttpMethodNames } from "@adaas/a-server/route/A-ServerRoute.types";
import { A_ServerRouteHttpMethods } from "@adaas/a-server/route/A-ServerRoute.constants";
import { A_ServerRouterMeta } from "./A-ServerRouter.meta";
import { A_ServerRouterDefineDecorator } from "./A-ServerRouterDefine.decorator";
import { A_ServerRouterRouteConfig } from "./A-ServerRouter.types";



@A_Meta.Define(A_ServerRouterMeta)
export class A_ServerRouter extends A_Component {

    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    /**
     * Allows to define a custom route for POST requests
     * 
     * @param path 
     * @returns 
     */
    static Post(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.POST,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }

    /**
     * Allows to define a custom route for GET requests
     * 
     * @param path 
     * @returns 
     */
    static Get(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.GET,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }

    /**
     * Allows to define a custom route for PUT requests
     * 
     * @param path 
     * @returns 
     */
    static Put(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.PUT,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }

    /**
     * Allows to define a custom route for DELETE requests
     * 
     * @param path 
     * @returns 
     */
    static Delete(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.DELETE,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }

    /**
     * Allows to define a custom route for PATCH requests
     * 
     * @param path 
     * @returns 
     */
    static Patch(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.PATCH,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }

    /**
     * Allows to define a custom route for DEFAULT requests
     * 
     * @param path 
     * @returns 
     */
    static Default(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_ServerRouteHttpMethods.DEFAULT,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }


    // static routes: Array<A_ServerRoute> = [];

    /**
     * Private method to have the same signature for all route methods
     * 
     * @param method 
     * @param path 
     * @returns 
     */
    private static defineRoute(
        config: A_ServerRouterRouteConfig & { method: A_ServerRouteHttpMethodNames }
    ) {
        const route = typeof config.path === 'string' || config.path instanceof RegExp
            ? new A_ServerRoute(
                `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith('/') ? config.path : `/${config.path}`}`,
                config.method)
            : config.path;

        return A_ServerRouterDefineDecorator(route);
    }


    // =====================================================
    // ================ Concept Lifecycle ========================
    // =====================================================

    @A_Concept.Load()
    protected async load(
        @A_Inject(A_ServerLogger) logger: A_ServerLogger
    ): Promise<void> {
        const meta = A_Context.meta<A_ServerRouterMeta>(this.constructor as any);

        const routes = meta.routes;

        if (!routes || !routes.length) {
            logger.warning('yellow', `No routes defined for ${this.constructor.name}`);
            return;
        }


        logger.info('cyan',
            `Registered Routes:`,
            `------------------------------------\n`,
            ...routes
                .map(route => `[${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.path}`)

        );
    }



    // =======================================================
    // ================ Feature Definition=====================
    // =======================================================
    // @A_Feature.Define({
    //     invoke: false
    // })
    @A_Feature.Extend({
        name: A_HttpServerFeatures.onRequest,
    })
    async identifyRoute(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Config) config: A_Config,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_ServerRoute) route: A_ServerRoute,
    ) {
        if (route.method === 'OPTIONS') {
            // Ignore OPTIONS requests
            return;
        }
        /**
         * just execute all listeners on the Route
         * url example: /api/v1/users/123
         * OR
         * url example: /api/v1/users
         * => Then The feature will be "GET::/api/v1/users"
         * And it will return all stages that are similar to the feature name 
         */

        const feature = new A_Feature({ name: route.toString(), component: this, })

        if (!feature.size)
            throw new A_HttpServerError({
                status: 404,
                title: 'Route Not Found',
                description: `No route found for ${request.method} ${request.url}`,
            })


        for (const stage of feature) {

            const targetConstructor = stage.definition.dependency.target;

            if (A_TypeGuards.isComponentConstructor(targetConstructor)) {

                const meta: A_ServerRouterMeta = A_Context.meta<A_ServerRouterMeta>(this.constructor as any);

                const routeDefinitions = meta.definitions;

                const routeDefinition = routeDefinitions?.get(stage.definition.name || '');




                if (routeDefinition) {
                    request.useRoute(routeDefinition.route);
                }
            }

            const stageScope = new A_Scope({
                name: `a-route--${request.id}--${stage.definition.name}`,
            }, {
                parent: scope
            });


            await stage.process(stageScope);
        }

    }
}