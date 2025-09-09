import {
    A_Component,
    A_Concept,
    A_Config,
    A_Context,
    A_Feature,
    A_Feature_Define,
    A_Feature_Extend,
    A_Inject,
    A_Logger,
    A_Meta,
    A_Scope
} from "@adaas/a-concept";
import { A_ServerContainer } from "@adaas/a-server/containers/A-Server/A-Server.container";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Server/A-Server.container.types";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import {
    A_SERVER_TYPES__ARouterComponentMetaKey,
    A_SERVER_TYPES__ARouterRouteConfig,
    A_SERVER_TYPES__RouterMethod,
    A_TYPES__ARouterComponentMeta
} from "./A-Router.component.types";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_ServerLogger } from "../A-ServerLogger/A_ServerLogger.component";
import { A_TYPES__Required } from "@adaas/a-utils";



export class A_Router extends A_Component {

    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    /**
     * Allows to define a custom route for POST requests
     * 
     * @param path 
     * @returns 
     */
    static Post(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {


        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.POST,
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
    static Get(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.GET,
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
    static Put(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.PUT,
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
    static Delete(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.DELETE,
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
    static Patch(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.PATCH,
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
    static Default(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>) {
        return this.defineRoute({
            method: A_SERVER_TYPES__RouterMethod.DEFAULT,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }


    static routes: Array<A_Route> = [];

    /**
     * Private method to have the same signature for all route methods
     * 
     * @param method 
     * @param path 
     * @returns 
     */
    private static defineRoute(
        config: A_SERVER_TYPES__ARouterRouteConfig & { method: A_SERVER_TYPES__RouterMethod }
    ) {
        const route = typeof config.path === 'string' || config.path instanceof RegExp
            ? new A_Route(
                `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith('/') ? config.path : `/${config.path}`}`,
                 config.method)
            : config.path;

        this.routes.push(route);

        return function decorator(
            target: A_Component,
            propertyKey: string,
            descriptor: PropertyDescriptor
        ) {

            const meta: A_Meta<A_TYPES__ARouterComponentMeta> = A_Context.meta<A_TYPES__ARouterComponentMeta>(target as any);

            const routes = meta.get(A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES) || new Map();

            const searchKey = route.toAFeatureExtension(['A_Router', 'A_ServerContainer']);

            routes.set(searchKey.source, route);

            meta.set(A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES, routes);

            A_Feature_Define({
                name: searchKey.source,
                invoke: false
            })(target, propertyKey, descriptor)

            return A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
        }
    }


    // =====================================================
    // ================ Concept Lifecycle ========================
    // =====================================================

    @A_Concept.Load()
    protected async load(
        @A_Inject(A_ServerLogger) logger: A_ServerLogger
    ): Promise<void> {
        logger.routes(A_Router.routes);
    }



    // =======================================================
    // ================ Feature Definition=====================
    // =======================================================
    @A_Feature.Define({
        invoke: false
    })
    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.onRequest,
        scope: [A_ServerContainer],
    })
    async identifyRoute(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Config) config: A_Config,
        @A_Inject(A_Logger) logger: A_Logger
    ) {

        const { method, url } = request;
        const route = new A_Route(url, method);

        if (config.get('DEV_MODE')) {
            logger.log(`Incoming request: ${request.method} ${request.url}`);
            logger.log(`Identified route: ${route.toString()}`);
        }


        /**
         * just execute all listeners on the Route
         * url example: /api/v1/users/123
         * OR
         * url example: /api/v1/users
         * => Then The feature will be "GET::/api/v1/users"
         * And it will return all stages that are similar to the feature name 
         */

        const feature = A_Context.feature(this, route.toString(), scope);

        for (const stage of feature) {

            for (const step of stage.steps) {

                const meta: A_Meta<A_TYPES__ARouterComponentMeta> = A_Context.meta<A_TYPES__ARouterComponentMeta>(step.component);

                const routes = meta.get(A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES);

                if (routes) {
                    const currentRoute = routes.get(step.name || '');

                    if (currentRoute) {
                        request.params = {
                            ...request.params,
                            ...currentRoute.extractParams(url)
                        };
                    }
                }
            }

            const stageScope = new A_Scope({
                name: `a-route::${Date.now()}`,
                entities: [request],
            });
            await stage.process(stageScope);
        }
    }
}