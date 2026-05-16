import { A_Component, A_Concept, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_HttpServerFeatures } from "@adaas/a-server/server/A-HttpServer.constants";
import { A_ProxyConfig } from "./A-ServerProxy.context";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";
import { A_Logger, A_LOGGER_COLORS } from "@adaas/a-utils/a-logger";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";


export class A_ServerProxy extends A_Component {


    @A_Concept.Load()
    async load(
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_ProxyConfig) config: A_ProxyConfig
    ) {
        logger.info(
            'green',
            `Proxy routes configured:`,
            ...config.configs.map(c => `${c.route.toString()} -> ${c.protocol}//${c.hostname}:${c.port}`)
        );
    }



    @A_Feature.Extend({
        name: A_HttpServerFeatures.onRequest,
        before:/.*/
    })
    async onRequest(
        @A_Inject(A_Request) req: A_Request,
        @A_Inject(A_Response) res: A_Response,
        @A_Inject(A_ProxyConfig) proxyConfig: A_ProxyConfig,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_Polyfill) polyfill: A_Polyfill,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        return new Promise<void>(async (resolve, reject) => {
            const { method, url } = req;

            const route = new A_ServerRoute(url, method);
            const config = proxyConfig.config(route.toString());

            if (!config) {
                return resolve(); // nothing to proxy
            }

            logger.log(
                "yellow",
                `Proxying request ${method} ${url} to ${config.hostname}`,
                config
            );

            const client = await (config.protocol === "https:"
                ? polyfill.https()
                : polyfill.http());

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

            feature.interrupt();
        });
    }

}