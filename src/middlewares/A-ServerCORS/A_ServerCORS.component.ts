import { A_Feature, A_Inject } from '@adaas/a-concept';
import { A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_HttpServerFeatures } from '@adaas/a-server/server/A-HttpServer.constants';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerMiddleware } from '@adaas/a-server/middleware/A-ServerMiddleware.component';
import { A_SERVER_TYPES__CorsConfig } from './A_ServerCORS.types';
import { A_SERVER_DEFAULTS__CorsConfig } from './A_ServerCORS.constants';
import { A_HttpServer } from '@adaas/a-server/server/A-HttpServer.container';




export class A_ServerCORS extends A_ServerMiddleware {

    private config!: A_SERVER_TYPES__CorsConfig;

    @A_Feature.Extend({
        name: A_ServiceFeatures.onBeforeStart
    })
    async init(
        @A_Inject(A_Config) config: A_Config<['ORIGIN', 'METHODS', 'HEADERS', 'CREDENTIALS', 'MAX_AGE']>,
    ) {
        this.config = {
            origin: config.get('ORIGIN') || A_SERVER_DEFAULTS__CorsConfig.origin,
            methods: config.get('METHODS') || A_SERVER_DEFAULTS__CorsConfig.methods,
            headers: config.get('HEADERS') || A_SERVER_DEFAULTS__CorsConfig.headers,
            credentials: config.get('CREDENTIALS') || A_SERVER_DEFAULTS__CorsConfig.credentials,
            maxAge: config.get('MAX_AGE') || A_SERVER_DEFAULTS__CorsConfig.maxAge,
        };
    }


    @A_HttpServer.onAfterRequest
    public apply(
        @A_Inject(A_Request) aReq: A_Request,
        @A_Inject(A_Response) aRes: A_Response,
    ) {

        aRes.setHeader('Access-Control-Allow-Origin', this.config.origin);
        aRes.setHeader('Access-Control-Allow-Methods', this.config.methods.join(', '));
        aRes.setHeader('Access-Control-Allow-Headers', this.config.headers.join(', '));

        if (this.config.credentials) {
            aRes.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        if (this.config.maxAge) {
            aRes.setHeader('Access-Control-Max-Age', this.config.maxAge.toString());
        }

        // Handle preflight OPTIONS requests
        if (aReq.method === 'OPTIONS') {
            aRes.status(204).send();
        }
    }
}
