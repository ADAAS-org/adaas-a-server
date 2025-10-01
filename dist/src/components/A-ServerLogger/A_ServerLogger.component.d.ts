import { A_Config, A_Logger } from "@adaas/a-concept";
import { A_Server } from "../../context/A-Server/A_Server.context";
import { A_SERVER_TYPES__ServerLoggerEnvVariables, A_SERVER_TYPES__ServerLoggerRouteParams } from "./A_ServerLogger.component.types";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
import { A_Route } from "../../entities/A-Route/A-Route.entity";
export declare class A_ServerLogger extends A_Logger {
    protected config: A_Config<A_SERVER_TYPES__ServerLoggerEnvVariables>;
    onRequestEnd(request: A_Request, response: A_Response): Promise<void>;
    onRequestError(request: A_Request): Promise<void>;
    logStart(server: A_Server): void;
    logStop(server: A_Server): void;
    metrics(): void;
    routes(routes: Array<A_Route>): void;
    /**
     * Logs the route information based on status code
     *
     * @param route
     */
    route(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log200(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log404(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log500(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log400(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    logDefault(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    serverReady(params: {
        port: number;
        app: {
            name: string;
            version?: string;
        };
    }): void;
    /**
     * Displays a proxy routes
     *
     * @param params
     */
    proxy(params: {
        original: string;
        destination: string;
    }): void;
}
