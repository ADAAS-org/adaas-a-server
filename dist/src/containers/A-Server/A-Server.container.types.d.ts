import { A_Component, A_Fragment } from "@adaas/a-concept";
export type A_SERVER_TYPES__ServerFeatures = [
    A_SERVER_TYPES__ServerFeature.beforeStart,
    A_SERVER_TYPES__ServerFeature.afterStart,
    A_SERVER_TYPES__ServerFeature.beforeStop,
    A_SERVER_TYPES__ServerFeature.afterStop,
    A_SERVER_TYPES__ServerFeature.onRequest
];
export declare enum A_SERVER_TYPES__ServerFeature {
    beforeStart = "beforeStart",
    afterStart = "afterStart",
    beforeStop = "beforeStop",
    afterStop = "afterStop",
    onRequest = "onRequest"
}
export type A_SERVER_TYPES__ServerConstructor = {
    name: string;
    version: string;
    controllers: Array<A_Component>;
    entities: Array<A_Fragment>;
    extensions: Array<A_Component>;
};
export declare enum A_SERVER_TYPES__ServerMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    CONNECT = "CONNECT",
    TRACE = "TRACE",
    DEFAULT = "DEFAULT"
}
