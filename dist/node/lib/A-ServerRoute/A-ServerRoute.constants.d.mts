declare const A_ServerRouteHttpMethods: {
    readonly DEFAULT: "DEFAULT";
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
    readonly PATCH: "PATCH";
    readonly OPTIONS: "OPTIONS";
    readonly HEAD: "HEAD";
    readonly CONNECT: "CONNECT";
    readonly TRACE: "TRACE";
};
declare const A_ServerRouteProtocols: {
    readonly HTTP: "http";
    readonly HTTPS: "https";
    readonly WS: "ws";
    readonly WSS: "wss";
};

export { A_ServerRouteHttpMethods, A_ServerRouteProtocols };
