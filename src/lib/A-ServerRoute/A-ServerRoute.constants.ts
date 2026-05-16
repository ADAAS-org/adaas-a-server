export const A_ServerRouteHttpMethods = {
    DEFAULT: 'DEFAULT',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS',
    HEAD: 'HEAD',
    CONNECT: 'CONNECT',
    TRACE: 'TRACE',
} as const


export const A_ServerRouteProtocols = {
    HTTP: 'http',
    HTTPS: 'https',
    WS: 'ws',
    WSS: 'wss',
} as const