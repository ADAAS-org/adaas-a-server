import { A_Error, A_Feature, A_Inject, A_Scope, } from "@adaas/a-concept";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ResponseFeatures } from "@adaas/a-server/response/A-Response.constants";
import { A_HttpServerRequestContext } from "@adaas/a-server/request/A-HttpServerRequest.context";
import { A_Config } from "@adaas/a-utils/a-config";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Service, A_ServiceFeatures } from "@adaas/a-utils/a-service";


export class A_ServerLogger extends A_Logger {

    protected declare config: A_Config<any>



    @A_Feature.Extend({
        name: A_ResponseFeatures.onSend,
        scope: [A_Response]
    })
    logRequestFinish(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
    ) {

        this.info('green', `Request ${request.method} ${request.url} finished with status ${response.statusCode} in ${context.processingTime ?? 'N/A'}ms`);
    }


    @A_Feature.Extend({
        name: A_ResponseFeatures.onError,
        scope: [A_Response]
    })
    logResponseError(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        @A_Inject(A_Error) error: A_Error,
    ) {
        this.info('red', `Request ${request.method} ${request.url} errored with status ${response.statusCode} in ${context.processingTime ?? 'N/A'}ms`);
        this.error(error);
    }




    // @A_Feature.Extend({
    //     name: A_ServiceFeatures.onAfterStart,
    //     scope: [A_Service]
    // })
    // logStart(
    //     @A_Inject(A_Service) container: A_Service,
    // ): void {
    //     // this.serverReady({
    //     //     port: container.port,
    //     //     app: {
    //     //         name: container.name,
    //     //     }
    //     // })
    // }




    @A_Feature.Extend({
        name: A_ServiceFeatures.onAfterStop,
        scope: [A_Service]
    })
    logStop(
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        this.info('red', `Server ${scope.name} stopped`);
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

        this.info('cyan',
            ` ${params.app.name} v${params.app.version || '0.0.1'} is running on port ${params.port}`,
            ` Process ID: ${processId}`,
            ` Open In Browser: http://localhost:${params.port}`,
            ``,
            `-------------------------------`,
            ` ==============================`,
            `          LISTENING...      `,
            ` ==============================`
        );
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