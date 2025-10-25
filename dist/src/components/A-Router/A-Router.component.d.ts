import { A_Component, A_Scope } from "@adaas/a-concept";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_SERVER_TYPES__ARouterRouteConfig } from "./A-Router.component.types";
import { A_Route } from "../../entities/A-Route/A-Route.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
import { A_ServerLogger } from "../A-ServerLogger/A_ServerLogger.component";
import { A_TYPES__Required } from "@adaas/a-concept/dist/src/types/A_Common.types";
import { A_Config, A_Logger } from "@adaas/a-utils";
export declare class A_Router extends A_Component {
    /**
     * Allows to define a custom route for POST requests
     *
     * @param path
     * @returns
     */
    static Post(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for GET requests
     *
     * @param path
     * @returns
     */
    static Get(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PUT requests
     *
     * @param path
     * @returns
     */
    static Put(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DELETE requests
     *
     * @param path
     * @returns
     */
    static Delete(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PATCH requests
     *
     * @param path
     * @returns
     */
    static Patch(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DEFAULT requests
     *
     * @param path
     * @returns
     */
    static Default(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static routes: Array<A_Route>;
    /**
     * Private method to have the same signature for all route methods
     *
     * @param method
     * @param path
     * @returns
     */
    private static defineRoute;
    protected load(logger: A_ServerLogger): Promise<void>;
    identifyRoute(request: A_Request, response: A_Response, scope: A_Scope, config: A_Config, logger: A_Logger): Promise<void>;
}
