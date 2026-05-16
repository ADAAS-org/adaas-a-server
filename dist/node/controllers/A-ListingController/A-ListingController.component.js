'use strict';

var aConcept = require('@adaas/a-concept');
var aConfig = require('@adaas/a-utils/a-config');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var AEntityList_entity = require('@adaas/a-server/entity-list/A-EntityList.entity');
var AServerListQueryFilter_context = require('@adaas/a-server/list-query/A-ServerListQueryFilter.context');

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
class A_ListingController extends aConcept.A_Component {
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
], A_ListingController.prototype, "list");

exports.A_ListingController = A_ListingController;
//# sourceMappingURL=A-ListingController.component.js.map
//# sourceMappingURL=A-ListingController.component.js.map