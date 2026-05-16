import { A_ServerRouteHttpMethods, A_ServerRouteProtocols } from "./A-ServerRoute.constants";


export type A_serverRouteProtocolNames = typeof A_ServerRouteProtocols[keyof typeof A_ServerRouteProtocols];

export type A_ServerRouteHttpMethodNames = typeof A_ServerRouteHttpMethods[keyof typeof A_ServerRouteHttpMethods]