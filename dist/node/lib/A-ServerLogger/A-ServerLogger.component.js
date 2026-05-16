'use strict';

var aConcept = require('@adaas/a-concept');
var AServer_context = require('@adaas/a-server/server/A-Server.context');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AResponse_constants = require('@adaas/a-server/response/A-Response.constants');
var AHttpServerRequest_context = require('@adaas/a-server/request/A-HttpServerRequest.context');
var aLogger = require('@adaas/a-utils/a-logger');
var aService = require('@adaas/a-utils/a-service');

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
class A_ServerLogger extends aLogger.A_Logger {
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
  aConcept.A_Feature.Extend({
    name: AResponse_constants.A_ResponseFeatures.onSend,
    scope: [AResponse_entity.A_Response]
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(AHttpServerRequest_context.A_HttpServerRequestContext))
], A_ServerLogger.prototype, "logRequestFinish");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AResponse_constants.A_ResponseFeatures.onError,
    scope: [AResponse_entity.A_Response]
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(AHttpServerRequest_context.A_HttpServerRequestContext)),
  __decorateParam(3, aConcept.A_Inject(aConcept.A_Error))
], A_ServerLogger.prototype, "logResponseError");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aService.A_ServiceFeatures.onAfterStop,
    scope: [aService.A_Service]
  }),
  __decorateParam(0, aConcept.A_Inject(AServer_context.A_Server))
], A_ServerLogger.prototype, "logStop");

exports.A_ServerLogger = A_ServerLogger;
//# sourceMappingURL=A-ServerLogger.component.js.map
//# sourceMappingURL=A-ServerLogger.component.js.map