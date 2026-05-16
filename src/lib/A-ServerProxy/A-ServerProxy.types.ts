import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_ServerRouteHttpMethodNames } from "@adaas/a-server/route/A-ServerRoute.types"



export type A_SERVER_TYPES__ProxyConfigConstructor = Record<
    string, string | Partial<A_SERVER_TYPES__ProxyConfigConstructorConfig>>



export type A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    hostname: string,
    protocol: 'http' | 'https' | string,
    port: number,
    path: string,
    method: A_ServerRouteHttpMethodNames,
    headers: Record<string, string>
}


export type A_SERVER_TYPES__RoutesConfig = {
    route: A_ServerRoute,
    protocol: 'http' | 'https' | string,
    hostname: string,
    port: number,
    headers: Record<string, string>
}