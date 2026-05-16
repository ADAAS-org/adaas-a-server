'use strict';

var aConcept = require('@adaas/a-concept');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServer_error = require('../../lib/A-Server/A-Server.error');
var AServerListQueryFilter_context = require('@adaas/a-server/list-query/A-ServerListQueryFilter.context');
var AEntityList_entity = require('@adaas/a-server/entity-list/A-EntityList.entity');
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
class A_EntityController extends aConcept.A_Component {
  async list(request, response, scope, config) {
    const constructor = scope.resolveConstructor(request.params.type);
    if (constructor) {
      const entityList = new AEntityList_entity.A_ServerEntityList({
        name: request.params.type,
        scope: scope.name,
        constructor
      });
      scope.register(entityList);
      const queryFilter = new AServerListQueryFilter_context.A_ServerListQueryFilter(request.query, {
        itemsPerPage: String(config.get("A_LIST_ITEMS_PER_PAGE") || "10"),
        page: String(config.get("A_LIST_PAGE") || "1")
      });
      const queryScope = new aConcept.A_Scope({
        fragments: [queryFilter]
      }).inherit(scope);
      await entityList.load(queryScope);
      response.add("items", entityList.items);
      response.add("pagination", entityList.pagination);
    }
  }
  async load(request, response, scope) {
    console.log("Request params:", request.params);
    if (!aConcept.ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.load", "Invalid ASEID");
      return;
    }
    const aseid = new aConcept.ASEID(request.params.aseid);
    const constructor = scope.resolveConstructor(aseid.entity);
    if (constructor) {
      const entity = new constructor(request.params.aseid);
      scope.register(entity);
      await entity.load();
      return response.status(200).send(entity.toJSON());
    } else
      throw new AServer_error.A_ServerError({
        title: "Entity Not Found",
        description: `Entity constructor for ASEID ${request.params.aseid} not found`,
        status: 404
      });
  }
  async create(request, scope) {
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.body);
      scope.register(entity);
      await entity.save();
    }
  }
  async update(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.update", "Invalid ASEID");
      return;
    }
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.body);
      scope.register(entity);
      await entity.save();
    }
  }
  async delete(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.delete", "Invalid ASEID");
      return;
    }
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.params.aseid);
      scope.register(entity);
      await entity.destroy();
    }
  }
  async callEntity(request, response, scope) {
    if (!aConcept.ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.callEntity", "Invalid ASEID");
      return;
    }
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor) {
      response.add("A_EntityController.callEntity", "Entity not found");
      return;
    }
    const meta = aConcept.A_Context.meta(constructor);
    const targetFeature = meta.features().find((f) => f.name === `${constructor.name}.${request.params.action}`);
    if (!targetFeature) {
      response.add("A_EntityController.callEntity", "Feature not found");
      return;
    }
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
  AServerRouter_component.A_ServerRouter.Get({
    path: "/:type",
    version: "v1",
    prefix: "a-list"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(3, aConcept.A_Inject(aConfig.A_Config))
], A_EntityController.prototype, "list");
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
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
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