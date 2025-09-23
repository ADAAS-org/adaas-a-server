import { A_Component, A_TYPES__ComponentMeta } from "@adaas/a-concept";
import { A_Route } from "../../entities/A-Route/A-Route.entity";
export declare enum A_SERVER_TYPES__RouterMethod {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    DEFAULT = "DEFAULT"
}
export type A_TYPES__ARouterComponentMeta = {
    [A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES]: Map<string, A_TYPES__ARouterDefineRoute>;
} & A_TYPES__ComponentMeta;
export type A_TYPES__ARouterDefineRoute = {
    component: A_Component;
    handler: string;
    route: A_Route;
};
export declare enum A_SERVER_TYPES__ARouterComponentMetaKey {
    ROUTES = "ROUTES"
}
export type A_SERVER_TYPES__ARouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
};
