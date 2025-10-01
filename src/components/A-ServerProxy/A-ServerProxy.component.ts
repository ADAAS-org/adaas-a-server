import { A_Component, A_Concept, A_Feature, A_Inject, A_Logger } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Service/A-Service.container.types";
import { A_ProxyConfig } from "@adaas/a-server/context/A_ProxyConfig/A_ProxyConfig.context";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";
import http from "http";
import https from "https";


export class A_ServerProxy extends A_Component {


    @A_Concept.Load()
    async load(
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_ProxyConfig) config: A_ProxyConfig
    ) {
        logger.log(
            'pink',
            `Proxy routes configured:`,
            config.configs.map(c => c.route).join('\n')
        );
    }


    
    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.onRequest,
    })
    async onRequest(
        @A_Inject(A_Request) req: A_Request,
        @A_Inject(A_Response) res: A_Response,
        @A_Inject(A_ProxyConfig) proxyConfig: A_ProxyConfig,
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        return new Promise<void>((resolve, reject) => {
            const { method, url } = req;

            const route = new A_Route(url, method);
            const config = proxyConfig.config(route.toString());

            if (!config) {
                return resolve(); // nothing to proxy
            }

            logger.log(
                "yellow",
                `Proxying request ${method} ${url} to ${config.hostname}`,
                config
            );

            const client = config.protocol === "https:" ? https : http;

            const proxyReq = client.request(
                {
                    method: config.route.method,
                    hostname: config.hostname,
                    port: config.port,
                    headers: config.headers,
                    path: route.path,
                },
                (proxyRes) => {
                    if (!res.headersSent) {
                        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
                    }
                    proxyRes.on("end", () => {

                        logger.log("green", `Proxy request to ${config?.hostname} completed`);

                        resolve();
                    });

                    proxyRes.pipe(res.original);
                }
            );

            proxyReq.on("error", (err) => reject(err));

            req.pipe(proxyReq);
        });
    }

}