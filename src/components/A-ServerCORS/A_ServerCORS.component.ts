import { A_Component, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_SERVER_TYPES__CorsConfig } from './A_ServerCORS.component.types';
import { A_SERVER_DEFAULTS__CorsConfig } from './A_ServerCORS.component.defaults';
import { A_SERVER_TYPES__ServerFeature } from '@adaas/a-server/containers/A-Service/A-Service.container.types';
import { A_Request } from '@adaas/a-server/entities/A-Request/A-Request.entity';
import { A_Response } from '@adaas/a-server/entities/A-Response/A-Response.entity';
import { A_Config } from '@adaas/a-utils';


export class A_ServerCORS extends A_Component {

    private config!: A_SERVER_TYPES__CorsConfig;

    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.beforeStart
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


    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.beforeRequest
    })
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
        if (aReq.req.method === 'OPTIONS') {
            aRes.status(204).send();
        }
    }
}
