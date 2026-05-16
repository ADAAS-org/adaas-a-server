'use strict';

var aConcept = require('@adaas/a-concept');
var AServerRouter_component = require('./A-ServerRouter.component');

function A_ServerRouterDefineDecorator(route) {
  return function(target, propertyKey, descriptor) {
    const meta = aConcept.A_Context.meta(AServerRouter_component.A_ServerRouter);
    const searchKey = route.toAFeatureExtension(["A_ServerRouter", "A_Service"]);
    meta.addRoute(searchKey, {
      component: target,
      handler: propertyKey,
      route
    });
    aConcept.A_Feature_Define({
      name: searchKey.source,
      invoke: false
    })(target, propertyKey, descriptor);
    return aConcept.A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
  };
}

exports.A_ServerRouterDefineDecorator = A_ServerRouterDefineDecorator;
//# sourceMappingURL=A-ServerRouterDefine.decorator.js.map
//# sourceMappingURL=A-ServerRouterDefine.decorator.js.map