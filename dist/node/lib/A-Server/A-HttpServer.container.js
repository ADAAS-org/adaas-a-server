'use strict';

var AHttpServer_constants = require('./A-HttpServer.constants');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var aConcept = require('@adaas/a-concept');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');
var AHttpServer_error = require('./A-HttpServer.error');
var ARequest_constants = require('@adaas/a-server/request/A-Request.constants');
var AHttpServerRequest_context = require('@adaas/a-server/request/A-HttpServerRequest.context');
var AServerLogger_component = require('@adaas/a-server/logger/A-ServerLogger.component');
var aService = require('@adaas/a-utils/a-service');
var aPolyfill = require('@adaas/a-utils/a-polyfill');
var aConfig = require('@adaas/a-utils/a-config');

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
var _a, _b, _c, _d, _e;
class A_HttpServer extends aService.A_Service {
  static get onBeforeRequest() {
    return (target, propertyKey, descriptor) => {
      return aConcept.A_Feature.Extend({
        name: AHttpServer_constants.A_HttpServerFeatures.onBeforeRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onRequest() {
    return (target, propertyKey, descriptor) => {
      return aConcept.A_Feature.Extend({
        name: AHttpServer_constants.A_HttpServerFeatures.onRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onAfterRequest() {
    return (target, propertyKey, descriptor) => {
      return aConcept.A_Feature.Extend({
        name: AHttpServer_constants.A_HttpServerFeatures.onAfterRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  async [_e = aService.A_ServiceFeatures.onStart](polyfill, config) {
    const http = await polyfill.http();
    this.server = http.createServer(this.handleRequest.bind(this));
    await this.listen(config.get("A_SERVER_PORT"));
  }
  async [_d = aService.A_ServiceFeatures.onAfterStart](config, logger) {
    logger.serverReady({
      port: config.get("A_SERVER_PORT"),
      app: {
        name: this.scope.name
      }
    });
  }
  async [aService.A_ServiceFeatures.onStop](...args) {
    await this.close();
  }
  close() {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        resolve();
      });
    });
  }
  listen(port) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        resolve();
      });
    });
  }
  async [_c = AHttpServer_constants.A_HttpServerFeatures.onBeforeRequest](...args) {
  }
  async [_b = AHttpServer_constants.A_HttpServerFeatures.onRequest](...args) {
  }
  async [_a = AHttpServer_constants.A_HttpServerFeatures.onAfterRequest](...args) {
  }
  // ======================================================================================
  // ============================= A_HttpServer Methods =================================
  // ======================================================================================
  async handleRequest(request, response) {
    const route = new AServerRoute_entity.A_ServerRoute(
      request.url || "",
      request.method
    );
    const id = aConcept.A_IdentityHelper.generateTimeId();
    const shard = `${request.method}-${route.path.replace("/", "-")}`;
    const req = new ARequest_entity.A_Request({ id, shard, request, scope: this.scope.name });
    const res = new AResponse_entity.A_Response({ id, shard, response, scope: this.scope.name });
    const context = new AHttpServerRequest_context.A_HttpServerRequestContext(request, response);
    const scope = new aConcept.A_Scope({
      name: id,
      entities: [req, res],
      fragments: [route, context]
    }).inherit(this.scope);
    try {
      const onBeforeRequestFeature = new aConcept.A_Feature({
        name: AHttpServer_constants.A_HttpServerFeatures.onBeforeRequest,
        component: this
      });
      const onRequestFeature = new aConcept.A_Feature({
        name: AHttpServer_constants.A_HttpServerFeatures.onRequest,
        component: this
      });
      const onAfterRequestFeature = new aConcept.A_Feature({
        name: AHttpServer_constants.A_HttpServerFeatures.onAfterRequest,
        component: this
      });
      await new Promise(async (resolve, reject) => {
        const cleanup = () => {
          onBeforeRequestFeature.interrupt();
          onRequestFeature.interrupt();
          onAfterRequestFeature.interrupt();
          req.off(ARequest_constants.A_RequestFeatures.onError, cleanup);
          req.off(ARequest_constants.A_RequestFeatures.onClose, cleanup);
          req.off(ARequest_constants.A_RequestFeatures.onTimeout, cleanup);
          reject(scope.resolve(aConcept.A_Error));
        };
        req.on(ARequest_constants.A_RequestFeatures.onError, cleanup.bind(this));
        req.on(ARequest_constants.A_RequestFeatures.onClose, cleanup.bind(this));
        try {
          await req.load();
          await res.load();
          await onBeforeRequestFeature.process(scope);
          await onRequestFeature.process(scope);
          await onAfterRequestFeature.process(scope);
          req.clearTimeout();
          if (!res.isStreaming) {
            await res.status(200).send();
          }
          resolve();
        } catch (error) {
          req.clearTimeout();
          reject(error);
        }
      });
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof AHttpServer_error.A_HttpServerError:
          wrappedError = error;
          break;
        case (error instanceof aConcept.A_Error && error.originalError instanceof AHttpServer_error.A_HttpServerError):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new AHttpServer_error.A_HttpServerError({
            status: 500,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await res.fail(wrappedError);
      await this.call(aService.A_ServiceFeatures.onError, scope);
    }
    scope.destroy();
  }
}
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aPolyfill.A_Polyfill)),
  __decorateParam(1, aConcept.A_Dependency.Required()),
  __decorateParam(1, aConcept.A_Inject(aConfig.A_Config))
], A_HttpServer.prototype, _e);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(1, aConcept.A_Inject(AServerLogger_component.A_ServerLogger))
], A_HttpServer.prototype, _d);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_HttpServer.prototype, _c);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_HttpServer.prototype, _b);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_HttpServer.prototype, _a);

exports.A_HttpServer = A_HttpServer;
//# sourceMappingURL=A-HttpServer.container.js.map
//# sourceMappingURL=A-HttpServer.container.js.map