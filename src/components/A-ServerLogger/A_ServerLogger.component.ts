import { A_Config, A_Feature, A_Inject, A_Logger, A_Scope } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Server/A-Server.container.types";
import { A_Server } from "@adaas/a-server/context/A-Server/A_Server.context";
import { A_SERVER_TYPES__ServerLoggerRouteParams } from "./A_ServerLogger.component.types";
import { A_ServerContainer } from "@adaas/a-server/containers/A-Server/A-Server.container";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_SERVER_TYPES__ResponseEvent } from "@adaas/a-server/entities/A-Response/A-Response.entity.types";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";
import { A_SERVER_TYPES__RequestEvent } from "@adaas/a-server/entities/A-Request/A-Request.entity.types";


export class A_ServerLogger extends A_Logger {

    protected config!: A_Config<
        'DEV_MODE'
        | 'SERVER_IGNORE_LOG_200'
        | 'SERVER_IGNORE_LOG_404'
        | 'SERVER_IGNORE_LOG_500'
        | 'SERVER_IGNORE_LOG_400'
        | 'SERVER_IGNORE_LOG_DEFAULT'
    >



    @A_Feature.Extend({
        name: A_SERVER_TYPES__ResponseEvent.Finish,
        scope: [A_Response]
    })
    async onRequestEnd(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response
    ) {

        this.route({
            method: request.method,
            url: request.url,
            status: response.statusCode,
            responseTime: response.duration
        });
    }


    @A_Feature.Extend({
        name: A_SERVER_TYPES__RequestEvent.Error,
    })
    async onRequestError(
        @A_Inject(A_Request) request: A_Request
    ) {
    }


    @A_Feature.Define({ invoke: false })
    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.afterStart,
        scope: [A_ServerContainer]
    })
    logStart(
        @A_Inject(A_Server) server: A_Server,
    ) {
        this.serverReady({
            port: server.port,
            app: {
                name: server.name,
                version: server.version
            }
        })
    }




    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.afterStop,
        scope: [A_ServerContainer]
    })
    logStop(
        @A_Inject(A_Server) server: A_Server,
    ) {
        this.log('red', `Server ${server.name} stopped`);
    }




    metrics() {

    }



    routes(routes: Array<A_Route>) {
        const time = this.getTime();

        console.log(`\x1b[36m[${this.scope.name}] |${time}| Exposed Routes:
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${routes.map(route => `${' '.repeat(this.scopeLength + 3)}| [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.path}`).join('\n')
            }
${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`);

    }

    /**
     * Logs the route information based on status code
     * 
     * @param route 
     */
    route(route: A_SERVER_TYPES__ServerLoggerRouteParams) {

        switch (route.status) {
            case 200:
                this.log200(route);
                break;
            case 404:
                this.log404(route);
                break;
            case 500:
                this.log500(route);
                break;
            case 400:
                this.log400(route);
                break;
            default:
                this.logDefault(route);
                break;
        }
    }


    log200(route: A_SERVER_TYPES__ServerLoggerRouteParams) {
        if (this.config.get('SERVER_IGNORE_LOG_200'))
            return
        console.log(`\x1b[32m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }

    log404(route: A_SERVER_TYPES__ServerLoggerRouteParams) {
        if (this.config.get('SERVER_IGNORE_LOG_404'))
            return;

        console.log(`\x1b[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }

    log500(route: A_SERVER_TYPES__ServerLoggerRouteParams) {
        if (this.config.get('SERVER_IGNORE_LOG_500'))
            return;

        console.log(`\x1b[31m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }

    log400(route: A_SERVER_TYPES__ServerLoggerRouteParams) {
        if (this.config.get('SERVER_IGNORE_LOG_400'))
            return;
        console.log(`\x1b[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }

    logDefault(route: A_SERVER_TYPES__ServerLoggerRouteParams) {
        if (this.config.get('SERVER_IGNORE_LOG_DEFAULT'))
            return
        console.log(`\x1b[36m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }


    serverReady(
        params: {
            port: number,

            app: {
                name: string,
                version?: string
            }
        }
    ) {
        const processId = process.pid;

        console.log(`\x1b[36m[${this.scope.name}] |${this.getTime()}| Server Ready:
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${params.app.name} v${params.app.version || '0.0.1'} is running on port ${params.port}
${' '.repeat(this.scopeLength + 3)}| Process ID: ${processId}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ==============================
${' '.repeat(this.scopeLength + 3)}|          LISTENING...         
${' '.repeat(this.scopeLength + 3)}| ==============================
\x1b[0m`);
    }


    /**
     * Displays a proxy routes 
     * 
     * @param params 
     */
    proxy(
        params: {
            original: string,
            destination: string,
        }
    ) {
        console.log(`\x1b[35m[${this.scope.name}] |${this.getTime()}| Proxy:
${' '.repeat(this.scopeLength + 3)}| ${params.original} -> ${params.destination}
${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`);
    }

}