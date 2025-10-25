import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_SERVER_TYPES__ServerFeature, A_SERVER_TYPES__ServerFeatures } from "./A-Service.container.types";
import { A_Server } from "@adaas/a-server/context/A-Server/A_Server.context";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import crypto from 'crypto';
import { A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_TYPES__ServerENVVariables } from "@adaas/a-server/constants/env.constants";
import { A_Concept, A_Container, A_Feature, A_IdentityHelper, A_Scope } from "@adaas/a-concept";
import { A_Config, A_Logger } from "@adaas/a-utils";




/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 * 
 */
export class A_Service extends A_Container {

    private server!: Server;
    port!: number;

    @A_Concept.Load()
    async load() {

        let config: A_Config<A_TYPES__ServerENVVariables>;
        let aServer: A_Server;

        if (!this.scope.has(A_Config<A_TYPES__ServerENVVariables>)) {
            const config = new A_Config<A_TYPES__ServerENVVariables>({
                variables: [...Array.from(A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY)],
                defaults: {
                    A_SERVER_PORT: 3000
                }
            });

            this.scope.register(config);
        }

        config = this.scope.resolve(A_Config) as A_Config<A_TYPES__ServerENVVariables>;


        if (!this.scope.has(A_Server)) {
            aServer = new A_Server({
                port: config.get('A_SERVER_PORT'),
                name: this.name,
                version: 'v1'
            });
        }

        // Set the server to listen on port 3000
        this.port = config.get('A_SERVER_PORT');

        // Create the HTTP server
        this.server = createServer(this.onRequest.bind(this));

    }

    protected listen(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                resolve();
            });
        });
    }

    protected close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close(() => {
                resolve();
            });
        });
    }


    @A_Concept.Start()
    /**
     * Start the server
     */
    async start() {
        await this.beforeStart();

        await this.listen();

        await this.afterStart();
    }


    @A_Feature.Define({ invoke: true })
    async beforeStart() { }

    @A_Feature.Define({ invoke: true })
    async afterStart() { }



    @A_Concept.Stop()
    /**
     * Stop service 
     */
    async stop() {
        await this.call(A_SERVER_TYPES__ServerFeature.beforeStop);

        await this.server.close();

        await this.call(A_SERVER_TYPES__ServerFeature.afterStop)
    }

    @A_Feature.Define({
        name: A_SERVER_TYPES__ServerFeature.beforeRequest,
        invoke: true
    })
    async beforeRequest(scope: A_Scope) { }

    @A_Feature.Define({
        name: A_SERVER_TYPES__ServerFeature.beforeRequest,
        invoke: true
    })
    async afterRequest(scope: A_Scope) { }

    @A_Feature.Define({
        name: A_SERVER_TYPES__ServerFeature.onRequest,
        invoke: false
    })
    async onRequest(
        request: IncomingMessage,
        response: ServerResponse
    ) {
        const scope = new A_Scope({
            name: `a-server-request::${Date.now()}`,
        });

        // We need it to stop feature execution in case request ends
        const { req, res } = await this.convertToAServer(request, response);

        try {
            scope.register(req);
            scope.register(res);

            scope.inherit(this.scope);

            await this.beforeRequest(scope);
            await this.call(A_SERVER_TYPES__ServerFeature.onRequest, scope);
            await this.afterRequest(scope);

            await res.status(200).send();

        } catch (error) {
            
            const logger = this.scope.resolve(A_Logger);

            logger.error(error);

            return res.failed(error);
        }
    }



    protected async convertToAServer(
        request: IncomingMessage,
        response: ServerResponse
    ): Promise<{ req: A_Request, res: A_Response }> {

        if (!request.method || !request.url)
            throw new Error('Request method or url is missing');

        const id = this.generateRequestId(request.method, request.url);

        const req = new A_Request({ id, request, scope: this.scope.name });
        const res = new A_Response({ id, response, scope: this.scope.name });

        await req.init();
        await res.init();

        return { req, res };
    }

    protected generateRequestId(
        method: string,
        url: string
    ): string {
        // Use the current time, request URL, and a few other details to create a unique ID
        const hash = crypto.createHash('sha256');
        const timeId = A_IdentityHelper.generateTimeId();
        const randomValue = Math.random().toString(); // Adds extra randomness

        hash.update(`${timeId}-${method}-${url}-${randomValue}`);
        return `${timeId}-${hash.digest('hex')}`;
    }

    @A_Feature.Define({ invoke: true })
    async beforeStop() { }

    @A_Feature.Define({ invoke: true })
    async afterStop() { }
}