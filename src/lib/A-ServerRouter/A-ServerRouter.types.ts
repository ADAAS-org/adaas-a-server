import { A_Component, A_TYPES__ComponentMeta } from "@adaas/a-concept";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_ServerRouterMetaKeys } from "./A-ServerRouter.constants";





export type A_ServerRouterRouteDefinition = {
    component: A_Component,
    handler: string,
    route: A_ServerRoute
}

export type A_ServerRouterMetaStructure = {
    [A_ServerRouterMetaKeys.ROUTES]: Map<string, A_ServerRouterRouteDefinition>
    [A_ServerRouterMetaKeys.ROUTES_CONFIGS]: Array<A_ServerRoute>
} & A_TYPES__ComponentMeta

export type A_ServerRouterMetaKeyNames = typeof A_ServerRouterMetaKeys[keyof typeof A_ServerRouterMetaKeys]


export type A_ServerRouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
} 