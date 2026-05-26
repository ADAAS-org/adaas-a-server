'use strict';

var aConcept = require('@adaas/a-concept');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AHttpServer_error = require('../../lib/A-Server/A-HttpServer.error');

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
class A_EntityController extends aConcept.A_Component {
  async load(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid))
      throw new AHttpServer_error.A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const aseid = new aConcept.ASEID(request.params.aseid);
    const constructor = scope.resolveConstructor(aseid.entity);
    if (!constructor)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const entity = new constructor(request.params.aseid);
    scope.register(entity);
    await entity.load();
    return response.status(200).send(entity.toJSON());
  }
  async create(request, response, scope) {
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Entity type "${request.params.aseid}" not registered`
      });
    const entity = new constructor(request.body);
    scope.register(entity);
    await entity.save();
  }
  async update(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid))
      throw new AHttpServer_error.A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const entity = new constructor(request.body);
    scope.register(entity);
    await entity.save();
  }
  async delete(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid))
      throw new AHttpServer_error.A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const entity = new constructor(request.params.aseid);
    scope.register(entity);
    await entity.destroy();
  }
  async callEntity(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid))
      throw new AHttpServer_error.A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const meta = aConcept.A_Context.meta(constructor);
    const targetFeature = meta.features().find((f) => f.name === `${constructor.name}.${request.params.action}`);
    if (!targetFeature)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        description: `Feature "${request.params.action}" not found on entity`
      });
    const entity = new constructor(request.params.aseid);
    scope.register(entity);
    await entity.load(scope);
    await entity[targetFeature.handler](scope);
    response.add("result", scope.toJSON());
    response.add("entity", entity);
    response.add("type", entity.aseid.entity);
  }
}
__decorateClass([
  aConcept.A_Feature.Define({
    name: "getEntity",
    invoke: false
  }),
  AServerRouter_component.A_ServerRouter.Get({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityController.prototype, "load");
__decorateClass([
  AServerRouter_component.A_ServerRouter.Post({
    path: "/",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityController.prototype, "create");
__decorateClass([
  AServerRouter_component.A_ServerRouter.Put({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityController.prototype, "update");
__decorateClass([
  AServerRouter_component.A_ServerRouter.Delete({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityController.prototype, "delete");
__decorateClass([
  AServerRouter_component.A_ServerRouter.Post({
    path: "/:aseid/:action",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityController.prototype, "callEntity");

exports.A_EntityController = A_EntityController;
//# sourceMappingURL=A-EntityController.component.js.map
//# sourceMappingURL=A-EntityController.component.js.map