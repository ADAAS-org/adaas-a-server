import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.js';
import { A_ServerRouteHttpMethodNames } from '../A-ServerRoute/A-ServerRoute.types.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.constants.js';

type A_SERVER_TYPES__ProxyConfigConstructor = Record<string, string | Partial<A_SERVER_TYPES__ProxyConfigConstructorConfig>>;
type A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    hostname: string;
    protocol: 'http' | 'https' | string;
    port: number;
    path: string;
    method: A_ServerRouteHttpMethodNames;
    headers: Record<string, string>;
};
type A_SERVER_TYPES__RoutesConfig = {
    route: A_ServerRoute;
    protocol: 'http' | 'https' | string;
    hostname: string;
    port: number;
    headers: Record<string, string>;
};

export type { A_SERVER_TYPES__ProxyConfigConstructor, A_SERVER_TYPES__ProxyConfigConstructorConfig, A_SERVER_TYPES__RoutesConfig };
