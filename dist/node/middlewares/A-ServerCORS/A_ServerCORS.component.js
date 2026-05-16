'use strict';

var aConcept = require('@adaas/a-concept');
var aService = require('@adaas/a-utils/a-service');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var aConfig = require('@adaas/a-utils/a-config');
var AServerMiddleware_component = require('@adaas/a-server/middleware/A-ServerMiddleware.component');
var A_ServerCORS_constants = require('./A_ServerCORS.constants');
var AHttpServer_container = require('@adaas/a-server/server/A-HttpServer.container');

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
class A_ServerCORS extends AServerMiddleware_component.A_ServerMiddleware {
  async init(config) {
    this.config = {
      origin: config.get("ORIGIN") || A_ServerCORS_constants.A_SERVER_DEFAULTS__CorsConfig.origin,
      methods: config.get("METHODS") || A_ServerCORS_constants.A_SERVER_DEFAULTS__CorsConfig.methods,
      headers: config.get("HEADERS") || A_ServerCORS_constants.A_SERVER_DEFAULTS__CorsConfig.headers,
      credentials: config.get("CREDENTIALS") || A_ServerCORS_constants.A_SERVER_DEFAULTS__CorsConfig.credentials,
      maxAge: config.get("MAX_AGE") || A_ServerCORS_constants.A_SERVER_DEFAULTS__CorsConfig.maxAge
    };
  }
  apply(aReq, aRes) {
    aRes.setHeader("Access-Control-Allow-Origin", this.config.origin);
    aRes.setHeader("Access-Control-Allow-Methods", this.config.methods.join(", "));
    aRes.setHeader("Access-Control-Allow-Headers", this.config.headers.join(", "));
    if (this.config.credentials) {
      aRes.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (this.config.maxAge) {
      aRes.setHeader("Access-Control-Max-Age", this.config.maxAge.toString());
    }
    if (aReq.method === "OPTIONS") {
      aRes.status(204).send();
    }
  }
}
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aService.A_ServiceFeatures.onBeforeStart
  }),
  __decorateParam(0, aConcept.A_Inject(aConfig.A_Config))
], A_ServerCORS.prototype, "init");
__decorateClass([
  AHttpServer_container.A_HttpServer.onAfterRequest,
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response))
], A_ServerCORS.prototype, "apply");

exports.A_ServerCORS = A_ServerCORS;
//# sourceMappingURL=A_ServerCORS.component.js.map
//# sourceMappingURL=A_ServerCORS.component.js.map