import { A_SERVER_TYPES__RequestMethods } from "../../entities/A-Request/A-Request.entity.types";
import { A_Route } from "../../entities/A-Route/A-Route.entity";
export type A_SERVER_TYPES__ProxyConfigConstructor = Record<string, string | Partial<A_SERVER_TYPES__ProxyConfigConstructorConfig>>;
export type A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    hostname: string;
    protocol: 'http' | 'https' | string;
    port: number;
    path: string;
    method: A_SERVER_TYPES__RequestMethods;
    headers: Record<string, string>;
};
export type A_SERVER_TYPES__RoutesConfig = {
    route: A_Route;
    protocol: 'http' | 'https' | string;
    hostname: string;
    port: number;
    headers: Record<string, string>;
};
