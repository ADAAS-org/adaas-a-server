import { A_ComponentMeta } from "@adaas/a-concept";
import { A_ServerRouterMetaStructure, A_ServerRouterRouteDefinition } from "./A-ServerRouter.types";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_ServerRouterMetaKeys } from "./A-ServerRouter.constants";



export class A_ServerRouterMeta extends A_ComponentMeta<A_ServerRouterMetaStructure> {


    get routes(): Array<A_ServerRoute> {
        return this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) as Array<A_ServerRoute> || [];
    }


    get definitions(): Map<string, A_ServerRouterRouteDefinition> {
        return this.meta.get(A_ServerRouterMetaKeys.ROUTES) as Map<string, A_ServerRouterRouteDefinition> || new Map<string, A_ServerRouterRouteDefinition>();
    }


    addRoute(regexp: RegExp, route: A_ServerRouterRouteDefinition) {
        const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) as Map<string, A_ServerRouterRouteDefinition> || new Map<string, A_ServerRouterRouteDefinition>();
        existingRoutes.set(regexp.source, route);
        this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);

        const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) as Array<A_ServerRoute> || [];
        existingRoutesConfigs.push(route.route);
        this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
    }


    removeRoute(route: A_ServerRoute) {
        const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) as Map<string, A_ServerRouterRouteDefinition> || new Map<string, A_ServerRouterRouteDefinition>();
        existingRoutes.forEach((value, key) => {
            if (value.route === route) {
                existingRoutes.delete(key);
            }
        });
        this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);

        const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) as Array<A_ServerRoute> || [];
        const index = existingRoutesConfigs.indexOf(route);
        if (index !== -1) {
            existingRoutesConfigs.splice(index, 1);
        }
        this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
    }
}