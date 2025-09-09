import { A_TYPES__ComponentMeta, A_TYPES__ComponentMetaKey } from "@adaas/a-concept";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";


export enum A_SERVER_TYPES__RouterMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    DEFAULT = 'DEFAULT'
}


export type A_TYPES__ARouterComponentMeta = {
    [A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES]: Map<string, A_Route>
} & A_TYPES__ComponentMeta


export enum A_SERVER_TYPES__ARouterComponentMetaKey {
    ROUTES = 'ROUTES'

}



export type A_SERVER_TYPES__ARouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
} 