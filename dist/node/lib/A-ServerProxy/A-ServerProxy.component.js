'use strict';

var aConcept = require('@adaas/a-concept');
var AHttpServer_constants = require('@adaas/a-server/server/A-HttpServer.constants');
var AServerProxy_context = require('./A-ServerProxy.context');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');
var aLogger = require('@adaas/a-utils/a-logger');
var aPolyfill = require('@adaas/a-utils/a-polyfill');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
class A_ServerProxy extends aConcept.A_Component {
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
      const route = new AServerRoute_entity.A_ServerRoute(url, method);
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
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(1, aConcept.A_Inject(AServerProxy_context.A_ProxyConfig))
], A_ServerProxy.prototype, "load");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AHttpServer_constants.A_HttpServerFeatures.onRequest,
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(AServerProxy_context.A_ProxyConfig)),
  __decorateParam(3, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(4, aConcept.A_Inject(aPolyfill.A_Polyfill)),
  __decorateParam(5, aConcept.A_Inject(aConcept.A_Feature))
], A_ServerProxy.prototype, "onRequest");

exports.A_ServerProxy = A_ServerProxy;
//# sourceMappingURL=A-ServerProxy.component.js.map
//# sourceMappingURL=A-ServerProxy.component.js.map