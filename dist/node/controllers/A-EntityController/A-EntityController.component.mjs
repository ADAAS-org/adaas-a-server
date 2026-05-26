import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Scope, A_Component, ASEID, A_Context } from '@adaas/a-concept';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_HttpServerError } from '../../lib/A-Server/A-HttpServer.error';

class A_EntityController extends A_Component {
  async load(request, response, scope) {
    if (!ASEID.isASEID(request.params.aseid))
      throw new A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const aseid = new ASEID(request.params.aseid);
    const constructor = scope.resolveConstructor(aseid.entity);
    if (!constructor)
      throw new A_HttpServerError({
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
      throw new A_HttpServerError({
        status: 404,
        description: `Entity type "${request.params.aseid}" not registered`
      });
    const entity = new constructor(request.body);
    scope.register(entity);
    await entity.save();
  }
  async update(request, response, scope) {
    if (!ASEID.isASEID(request.params.aseid))
      throw new A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const entity = new constructor(request.body);
    scope.register(entity);
    await entity.save();
  }
  async delete(request, response, scope) {
    if (!ASEID.isASEID(request.params.aseid))
      throw new A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const entity = new constructor(request.params.aseid);
    scope.register(entity);
    await entity.destroy();
  }
  async callEntity(request, response, scope) {
    if (!ASEID.isASEID(request.params.aseid))
      throw new A_HttpServerError({
        status: 400,
        description: `Invalid ASEID: "${request.params.aseid}"`
      });
    const constructor = scope.resolveConstructor(request.params.aseid);
    if (!constructor)
      throw new A_HttpServerError({
        status: 404,
        description: `Entity constructor for ASEID ${request.params.aseid} not found`
      });
    const meta = A_Context.meta(constructor);
    const targetFeature = meta.features().find((f) => f.name === `${constructor.name}.${request.params.action}`);
    if (!targetFeature)
      throw new A_HttpServerError({
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
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
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