import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_HttpServerFeatures } from './A-HttpServer.constants';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_Feature, A_IdentityHelper, A_Scope, A_Error, A_Dependency, A_Inject } from '@adaas/a-concept';
import { A_ServerRoute } from '@adaas/a-server/route/A-ServerRoute.entity';
import { A_HttpServerError } from './A-HttpServer.error';
import { A_RequestFeatures } from '@adaas/a-server/request/A-Request.constants';
import { A_HttpServerRequestContext } from '@adaas/a-server/request/A-HttpServerRequest.context';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import { A_Config } from '@adaas/a-utils/a-config';

var _a, _b, _c, _d, _e;
class A_HttpServer extends A_Service {
  static get onBeforeRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onBeforeRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onAfterRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onAfterRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  async [_e = A_ServiceFeatures.onStart](polyfill, config) {
    const http = await polyfill.http();
    this.server = http.createServer(this.handleRequest.bind(this));
    await this.listen(config.get("A_SERVER_PORT"));
  }
  async [_d = A_ServiceFeatures.onAfterStart](config, logger) {
    logger.serverReady({
      port: config.get("A_SERVER_PORT"),
      app: {
        name: this.scope.name
      }
    });
  }
  async [A_ServiceFeatures.onStop](...args) {
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
  async [_c = A_HttpServerFeatures.onBeforeRequest](...args) {
  }
  async [_b = A_HttpServerFeatures.onRequest](...args) {
  }
  async [_a = A_HttpServerFeatures.onAfterRequest](...args) {
  }
  // ======================================================================================
  // ============================= A_HttpServer Methods =================================
  // ======================================================================================
  async handleRequest(request, response) {
    const route = new A_ServerRoute(
      request.url || "",
      request.method
    );
    const id = A_IdentityHelper.generateTimeId();
    const shard = `${request.method}-${route.path.replace("/", "-")}`;
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
      await new Promise(async (resolve, reject) => {
        const cleanup = () => {
          onBeforeRequestFeature.interrupt();
          onRequestFeature.interrupt();
          onAfterRequestFeature.interrupt();
          req.off(A_RequestFeatures.onError, cleanup);
          req.off(A_RequestFeatures.onClose, cleanup);
          req.off(A_RequestFeatures.onTimeout, cleanup);
          reject(scope.resolve(A_Error));
        };
        req.on(A_RequestFeatures.onError, cleanup.bind(this));
        req.on(A_RequestFeatures.onClose, cleanup.bind(this));
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
        case error instanceof A_HttpServerError:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_HttpServerError):
          wrappedError = error.originalError;
          break;
        // Duck-type: any Error with a numeric statusCode property (e.g. http-errors,
        // Express-style errors, or plain project HttpError classes).  Honour the
        // status code so the caller gets the right 4xx / 5xx rather than a blanket 500.
        case (error instanceof Error && typeof error.statusCode === "number"):
          wrappedError = new A_HttpServerError({
            status: error.statusCode,
            description: error.message,
            originalError: error
          });
          break;
        default:
          wrappedError = new A_HttpServerError({
            status: 500,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await res.fail(wrappedError);
      await this.call(A_ServiceFeatures.onError, scope);
    }
    scope.destroy();
  }
}
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_Polyfill)),
  __decorateParam(1, A_Dependency.Required()),
  __decorateParam(1, A_Inject(A_Config))
], A_HttpServer.prototype, _e, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_ServerLogger))
], A_HttpServer.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _a, 1);

export { A_HttpServer };
//# sourceMappingURL=A-HttpServer.container.mjs.map
//# sourceMappingURL=A-HttpServer.container.mjs.map