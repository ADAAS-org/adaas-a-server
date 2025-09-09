import { A_Concept, A_Config, A_Container, A_Context, A_Errors, A_Feature, A_Inject, A_Logger, A_Scope, A_TYPES__ComponentMetaKey, } from "@adaas/a-concept";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { A_SERVER_TYPES__ServerFeature, A_SERVER_TYPES__ServerFeatures } from "./A-Server.container.types";
import { A_Server } from "@adaas/a-server/context/A-Server/A_Server.context";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import crypto from 'crypto';




export class A_ServerContainer extends A_Container {

    private server!: Server;
    private port: number = 3000;

    @A_Concept.Load()
    async load() {
        if (!this.Scope.has(A_Errors)) {
            const errorsRegistry = new A_Errors({});

            this.Scope.register(errorsRegistry);
        }



        if (!this.Scope.has(A_Config)) {
            const config = new A_Config({
                variables: ['DEV_MODE', 'CONFIG_VERBOSE', 'PORT'],
                defaults: {
                    DEV_MODE: true,
                    CONFIG_VERBOSE: true,
                    PORT: 3000
                }
            });

            this.Scope.register(config);
        }

        const config = this.Scope.resolve(A_Config);

        // Set the server to listen on port 3000
        const port = config.get('PORT') || 3000;

        // Create the HTTP server
        this.server = createServer(this.onRequest.bind(this));

        const newServer = new A_Server({
            port,
            name: this.name,
            version: 'v1'
        });

        this.Scope.register(newServer);





        // } else {
        //     this.server = existedServer;
        // }
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
     * Stop the server
     */
    async stop() {
        await this.call(A_SERVER_TYPES__ServerFeature.beforeStop);

        await this.server.close();

        await this.call(A_SERVER_TYPES__ServerFeature.afterStop)
    }



    @A_Feature.Define({
        name: A_SERVER_TYPES__ServerFeature.onRequest,
        invoke: false
    })
    /**
     * Handle incoming requests
     */
    async onRequest(
        request: IncomingMessage,
        response: ServerResponse
    ) {
        // We need it to stop feature execution in case request ends
        const { req, res } = await this.convertToAServer(request, response);

        try {
            const scope = new A_Scope({
                name: `a-server-request::${Date.now()}`,
                entities: [req, res],
            });

            await this.call(A_SERVER_TYPES__ServerFeature.onRequest, scope);

            await res.status(200).send();

        } catch (error) {
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

        const req = new A_Request({ id, request, scope: this.Scope.name });
        const res = new A_Response({ id, response, scope: this.Scope.name });

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
        const time = Date.now();
        const randomValue = Math.random().toString(); // Adds extra randomness

        hash.update(`${time}-${method}-${url}-${randomValue}`);
        return hash.digest('hex');
    }

    @A_Feature.Define({ invoke: true })
    async beforeStop() { }

    @A_Feature.Define({ invoke: true })
    async afterStop() { }
}