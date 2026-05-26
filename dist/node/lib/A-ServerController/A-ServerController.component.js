'use strict';

var aConcept = require('@adaas/a-concept');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AHttpServer_error = require('../A-Server/A-HttpServer.error');

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
class A_ServerController extends aConcept.A_Component {
  async callEntityMethod(request, response, scope) {
    if (!scope.has(request.params.component))
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Component "${request.params.component}" not found`
      });
    if (!request.params.operation || typeof request.params.operation !== "string")
      throw new AHttpServer_error.A_HttpServerError({
        status: 400,
        description: 'Missing or invalid "operation" parameter'
      });
    const possibleComponent = scope.resolve(request.params.component);
    if (!possibleComponent || ![aConcept.A_Component, aConcept.A_Container].some((c) => possibleComponent instanceof c))
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `"${request.params.component}" is not a valid component`
      });
    const component = possibleComponent;
    const meta = aConcept.A_Context.meta(component);
    const targetFeature = meta.features().find((f) => f.name === `${component.constructor.name}.${request.params.operation}`);
    if (!targetFeature)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Operation "${request.params.operation}" not found on component "${request.params.component}"`
      });
    await component.call(request.params.operation, scope);
  }
}
__decorateClass([
  AServerRouter_component.A_ServerRouter.Post({
    path: "/:component/:operation",
    version: "v1",
    prefix: "a-component"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_ServerController.prototype, "callEntityMethod");

exports.A_ServerController = A_ServerController;
//# sourceMappingURL=A-ServerController.component.js.map
//# sourceMappingURL=A-ServerController.component.js.map