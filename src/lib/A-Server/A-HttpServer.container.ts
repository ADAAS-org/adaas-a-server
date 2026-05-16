import type { IncomingMessage, Server, ServerResponse } from "http";
import { A_HttpServerFeatures } from "./A-HttpServer.constants";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_TYPES__ServerENVVariables } from "@adaas/a-server/constants/env.constants";
import { A_Dependency, A_Error, A_Feature, A_IdentityHelper, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_HttpServerRequestMethod } from "./A-HttpServer.types";
import { A_HttpServerError } from "./A-HttpServer.error";
import { A_RequestFeatures } from "@adaas/a-server/request/A-Request.constants";
import { A_HttpServerRequestContext } from "@adaas/a-server/request/A-HttpServerRequest.context";
import { A_ServerLogger } from "@adaas/a-server/logger/A-ServerLogger.component";
import { A_Service, A_ServiceFeatures } from "@adaas/a-utils/a-service";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";
import { A_Config } from "@adaas/a-utils/a-config";




/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 * 
 */
export class A_HttpServer extends A_Service {

    protected server!: Server;


    static get onBeforeRequest() {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            return A_Feature.Extend({
                name: A_HttpServerFeatures.onBeforeRequest,
                scope: [target.constructor],
            })(target, propertyKey, descriptor);
        }
    }

    static get onRequest() {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            return A_Feature.Extend({
                name: A_HttpServerFeatures.onRequest,
                scope: [target.constructor],
            })(target, propertyKey, descriptor);
        }
    }

    static get onAfterRequest() {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            return A_Feature.Extend({
                name: A_HttpServerFeatures.onAfterRequest,
                scope: [target.constructor],
            })(target, propertyKey, descriptor);
        }
    }



    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onStart](

        @A_Dependency.Required()
        @A_Inject(A_Polyfill) polyfill: A_Polyfill,

        @A_Dependency.Required()
        @A_Inject(A_Config) config: A_Config<A_TYPES__ServerENVVariables>,

    ): Promise<void> {
        const http = await polyfill.http();

        // Create the HTTP server
        this.server = http.createServer(this.handleRequest.bind(this));

        // Start listening on the specified port
        await this.listen(config.get('A_SERVER_PORT'));
    }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onAfterStart](
        @A_Inject(A_Config) config: A_Config<A_TYPES__ServerENVVariables>,
        @A_Inject(A_ServerLogger) logger: A_ServerLogger,
    ): Promise<void> {
        logger.serverReady({
            port: config.get('A_SERVER_PORT'),
            app: {
                name: this.scope.name,
            }
        });
    }

    protected async [A_ServiceFeatures.onStop](...args: any[]): Promise<void> {
        await this.close();
    }

    close() {
        return new Promise<void>((resolve, reject) => {
            this.server.close(() => {
                resolve();
            });
        });
    }

    listen(port: number) {
        return new Promise<void>((resolve, reject) => {
            this.server.listen(port, () => {
                resolve();
            });
        });
    }


    // ======================================================================================
    // ============================= A_HttpServer Lifecycle =================================
    // ======================================================================================

    @A_Feature.Extend()
    protected async [A_HttpServerFeatures.onBeforeRequest](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_HttpServerFeatures.onRequest](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_HttpServerFeatures.onAfterRequest](...args: any[]) { }


    // ======================================================================================
    // ============================= A_HttpServer Methods =================================
    // ======================================================================================

    async handleRequest(
        request: IncomingMessage,
        response: ServerResponse
    ) {
        const route = new A_ServerRoute(
            request.url || '',
            request.method as A_HttpServerRequestMethod
        );

        const id = A_IdentityHelper.generateTimeId();
        const shard = `${request.method}-${route.path.replace('/', '-')}`;

        const req = new A_Request({ id, shard, request, scope: this.scope.name });
        const res = new A_Response({ id, shard, response, scope: this.scope.name });
        const context = new A_HttpServerRequestContext(request, response);

        const scope = new A_Scope({
            name: id,
            entities: [req, res],
            fragments: [route, context]
        }).inherit(this.scope);

        try {
            const onBeforeRequestFeature = new A_Feature({
                name: A_HttpServerFeatures.onBeforeRequest,
                component: this
            });

            const onRequestFeature = new A_Feature({
                name: A_HttpServerFeatures.onRequest,
                component: this
            });

            const onAfterRequestFeature = new A_Feature({
                name: A_HttpServerFeatures.onAfterRequest,
                component: this
            });

            await new Promise<void>(async (resolve, reject) => {

                const cleanup = () => {
                    onBeforeRequestFeature.interrupt();
                    onRequestFeature.interrupt();
                    onAfterRequestFeature.interrupt();

                    req.off(A_RequestFeatures.onError, cleanup);
                    req.off(A_RequestFeatures.onClose, cleanup);
                    req.off(A_RequestFeatures.onTimeout, cleanup);


                    reject(scope.resolve(A_Error)!);
                }


                req.on(A_RequestFeatures.onError, cleanup.bind(this));
                req.on(A_RequestFeatures.onClose, cleanup.bind(this));

                try {
                    await req.load();
                    await res.load();


                    await onBeforeRequestFeature.process(scope);

                    await onRequestFeature.process(scope);

                    await onAfterRequestFeature.process(scope);


                    req.clearTimeout();
                    await res.status(200).send();

                    resolve();
                } catch (error) {

                    req.clearTimeout();
                    reject(error);
                }
            });

        } catch (error) {

            let wrappedError;

            switch (true) {
                case error instanceof A_HttpServerError:
                    wrappedError = error;
                    break;

                case error instanceof A_Error && error.originalError instanceof A_HttpServerError:
                    wrappedError = error.originalError;
                    break;

                default:
                    wrappedError = new A_HttpServerError({
                        status: 500,
                        description: 'An error occurred while processing the request.',
                        originalError: error
                    })
                    break;
            }


            scope.register(wrappedError);

            await res.fail(wrappedError);

            await this.call(A_ServiceFeatures.onError, scope);
        }

        scope.destroy();
    }

}








