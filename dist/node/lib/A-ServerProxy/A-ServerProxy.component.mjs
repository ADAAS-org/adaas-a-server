import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Feature, A_Component } from '@adaas/a-concept';
import { A_HttpServerFeatures } from '@adaas/a-server/server/A-HttpServer.constants';
import { A_ProxyConfig } from './A-ServerProxy.context';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ServerRoute } from '@adaas/a-server/route/A-ServerRoute.entity';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

class A_ServerProxy extends A_Component {
  async load(logger, config) {
    logger.info(
      "green",
      `Proxy routes configured:`,
      ...config.configs.map((c) => `${c.route.toString()} -> ${c.protocol}//${c.hostname}:${c.port}`)
    );
  }
  async onRequest(req, res, proxyConfig, logger, polyfill, feature) {
    return new Promise(async (resolve, reject) => {
      const { method, url } = req;
      const route = new A_ServerRoute(url, method);
      const config = proxyConfig.config(route.toString());
      if (!config) {
        return resolve();
      }
      logger.log(
        "yellow",
        `Proxying request ${method} ${url} to ${config.hostname}`,
        config
      );
      const client = await (config.protocol === "https:" ? polyfill.https() : polyfill.http());
      const proxyReq = client.request(
        {
          method: config.route.method,
          hostname: config.hostname,
          port: config.port,
          headers: config.headers,
          path: route.path
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
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Logger)),
  __decorateParam(1, A_Inject(A_ProxyConfig))
], A_ServerProxy.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_HttpServerFeatures.onRequest,
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_ProxyConfig)),
  __decorateParam(3, A_Inject(A_Logger)),
  __decorateParam(4, A_Inject(A_Polyfill)),
  __decorateParam(5, A_Inject(A_Feature))
], A_ServerProxy.prototype, "onRequest", 1);

export { A_ServerProxy };
//# sourceMappingURL=A-ServerProxy.component.mjs.map
//# sourceMappingURL=A-ServerProxy.component.mjs.map