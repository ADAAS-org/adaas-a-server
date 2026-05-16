import '../../chunk-EQQGB2QZ.mjs';
import { A_Context, A_Feature_Define, A_Feature_Extend } from '@adaas/a-concept';
import { A_ServerRouter } from './A-ServerRouter.component';

function A_ServerRouterDefineDecorator(route) {
  return function(target, propertyKey, descriptor) {
    const meta = A_Context.meta(A_ServerRouter);
    const searchKey = route.toAFeatureExtension(["A_ServerRouter", "A_Service"]);
    meta.addRoute(searchKey, {
      component: target,
      handler: propertyKey,
      route
    });
    A_Feature_Define({
      name: searchKey.source,
      invoke: false
    })(target, propertyKey, descriptor);
    return A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
  };
}

export { A_ServerRouterDefineDecorator };
//# sourceMappingURL=A-ServerRouterDefine.decorator.mjs.map
//# sourceMappingURL=A-ServerRouterDefine.decorator.mjs.map