import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Error } from '@adaas/a-concept';
import { A_Server } from '@adaas/a-server/server/A-Server.context';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ResponseFeatures } from '@adaas/a-server/response/A-Response.constants';
import { A_HttpServerRequestContext } from '@adaas/a-server/request/A-HttpServerRequest.context';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';

class A_ServerLogger extends A_Logger {
  logRequestFinish(request, response, context) {
    this.info("green", `Request ${request.method} ${request.url} finished with status ${response.statusCode} in ${context.processingTime ?? "N/A"}ms`);
  }
  logResponseError(request, response, context, error) {
    this.info("red", `Request ${request.method} ${request.url} errored with status ${response.statusCode} in ${context.processingTime ?? "N/A"}ms`);
    this.error(error);
  }
  logStop(server) {
    this.log("red", `Server ${server.name} stopped`);
  }
  serverReady(params) {
    const processId = process.pid;
    this.info(
      "cyan",
      ` ${params.app.name} v${params.app.version || "0.0.1"} is running on port ${params.port}`,
      ` Process ID: ${processId}`,
      ` Open In Browser: http://localhost:${params.port}`,
      ``,
      `-------------------------------`,
      ` ==============================`,
      `          LISTENING...      `,
      ` ==============================`
    );
  }
  /**
   * Displays a proxy routes 
   * 
   * @param params 
   */
  proxy(params) {
    console.log(`\x1B[35m[${this.scope.name}] |${this.getTime()}| Proxy:
${" ".repeat(this.scopeLength + 3)}| ${params.original} -> ${params.destination}
${" ".repeat(this.scopeLength + 3)}|-------------------------------\x1B[0m`);
  }
}
__decorateClass([
  A_Feature.Extend({
    name: A_ResponseFeatures.onSend,
    scope: [A_Response]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_HttpServerRequestContext))
], A_ServerLogger.prototype, "logRequestFinish", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ResponseFeatures.onError,
    scope: [A_Response]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_HttpServerRequestContext)),
  __decorateParam(3, A_Inject(A_Error))
], A_ServerLogger.prototype, "logResponseError", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ServiceFeatures.onAfterStop,
    scope: [A_Service]
  }),
  __decorateParam(0, A_Inject(A_Server))
], A_ServerLogger.prototype, "logStop", 1);

export { A_ServerLogger };
//# sourceMappingURL=A-ServerLogger.component.mjs.map
//# sourceMappingURL=A-ServerLogger.component.mjs.map