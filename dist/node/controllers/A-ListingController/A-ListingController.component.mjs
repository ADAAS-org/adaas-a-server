import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Scope, A_Component } from '@adaas/a-concept';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_ServerEntityList } from '@adaas/a-server/entity-list/A-EntityList.entity';
import { A_ServerListQueryFilter } from '@adaas/a-server/list-query/A-ServerListQueryFilter.context';
import { A_HttpServerError } from '../../lib/A-Server/A-HttpServer.error';

class A_ListingController extends A_Component {
  async list(request, response, scope, config) {
    const ctor = scope.resolveConstructor(request.params.type);
    if (!ctor)
      throw new A_HttpServerError({
        status: 404,
        description: `Entity type "${request.params.type}" not registered`
      });
    const entityList = new A_ServerEntityList({
      entity: ctor
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
], A_ListingController.prototype, "list", 1);

export { A_ListingController };
//# sourceMappingURL=A-ListingController.component.mjs.map
//# sourceMappingURL=A-ListingController.component.mjs.map