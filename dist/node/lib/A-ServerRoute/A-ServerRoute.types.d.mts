import { A_ServerRouteHttpMethods, A_ServerRouteProtocols } from './A-ServerRoute.constants.mjs';

type A_serverRouteProtocolNames = typeof A_ServerRouteProtocols[keyof typeof A_ServerRouteProtocols];
type A_ServerRouteHttpMethodNames = typeof A_ServerRouteHttpMethods[keyof typeof A_ServerRouteHttpMethods];

export type { A_ServerRouteHttpMethodNames, A_serverRouteProtocolNames };
