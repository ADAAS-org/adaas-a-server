import '../../chunk-EQQGB2QZ.mjs';
import { A_ComponentMeta } from '@adaas/a-concept';
import { A_ServerRouterMetaKeys } from './A-ServerRouter.constants';

class A_ServerRouterMeta extends A_ComponentMeta {
  get routes() {
    return this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
  }
  get definitions() {
    return this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
  }
  addRoute(regexp, route) {
    const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.set(regexp.source, route);
    this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    existingRoutesConfigs.push(route.route);
    this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
  removeRoute(route) {
    const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.forEach((value, key) => {
      if (value.route === route) {
        existingRoutes.delete(key);
      }
    });
    this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    const index = existingRoutesConfigs.indexOf(route);
    if (index !== -1) {
      existingRoutesConfigs.splice(index, 1);
    }
    this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
}

export { A_ServerRouterMeta };
//# sourceMappingURL=A-ServerRouter.meta.mjs.map
//# sourceMappingURL=A-ServerRouter.meta.mjs.map