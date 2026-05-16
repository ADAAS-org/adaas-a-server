import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Scope, A_Feature, A_Component, ASEID, A_Context } from '@adaas/a-concept';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ServerError } from '../../lib/A-Server/A-Server.error';
import { A_ServerListQueryFilter } from '@adaas/a-server/list-query/A-ServerListQueryFilter.context';
import { A_ServerEntityList } from '@adaas/a-server/entity-list/A-EntityList.entity';
import { A_Config } from '@adaas/a-utils/a-config';

class A_EntityController extends A_Component {
  async list(request, response, scope, config) {
    const constructor = scope.resolveConstructor(request.params.type);
    if (constructor) {
      const entityList = new A_ServerEntityList({
        name: request.params.type,
        scope: scope.name,
        constructor
      });
      scope.register(entityList);
      const queryFilter = new A_ServerListQueryFilter(request.query, {
        itemsPerPage: String(config.get("A_LIST_ITEMS_PER_PAGE") || "10"),
        page: String(config.get("A_LIST_PAGE") || "1")
      });
      const queryScope = new A_Scope({
        fragments: [queryFilter]
      }).inherit(scope);
      await entityList.load(queryScope);
      response.add("items", entityList.items);
      response.add("pagination", entityList.pagination);
    }
  }
  async load(request, response, scope) {
    console.log("Request params:", request.params);
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.load", "Invalid ASEID");
      return;
    }
    const aseid = new ASEID(request.params.aseid);
    const constructor = scope.resolveConstructor(aseid.entity);
    if (constructor) {
      const entity = new constructor(request.params.aseid);
      scope.register(entity);
      await entity.load();
      return response.status(200).send(entity.toJSON());
    } else
      throw new A_ServerError({
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
    if (!ASEID.isASEID(request.params.aseid)) {
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
    if (!ASEID.isASEID(request.params.aseid)) {
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
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.callEntity", "Invalid ASEID");
      return;
    }
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor) {
      response.add("A_EntityController.callEntity", "Entity not found");
      return;
    }
    const meta = A_Context.meta(constructor);
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
  A_ServerRouter.Get({
    path: "/:type",
    version: "v1",
    prefix: "a-list"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Config))
], A_EntityController.prototype, "list", 1);
__decorateClass([
  A_Feature.Define({
    name: "getEntity",
    invoke: false
  }),
  A_ServerRouter.Get({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "load", 1);
__decorateClass([
  A_ServerRouter.Post({
    path: "/",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityController.prototype, "create", 1);
__decorateClass([
  A_ServerRouter.Put({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "update", 1);
__decorateClass([
  A_ServerRouter.Delete({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "delete", 1);
__decorateClass([
  A_ServerRouter.Post({
    path: "/:aseid/:action",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "callEntity", 1);

export { A_EntityController };
//# sourceMappingURL=A-EntityController.component.mjs.map
//# sourceMappingURL=A-EntityController.component.mjs.map