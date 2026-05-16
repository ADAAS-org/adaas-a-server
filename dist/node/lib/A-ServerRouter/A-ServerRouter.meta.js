'use strict';

var aConcept = require('@adaas/a-concept');
var AServerRouter_constants = require('./A-ServerRouter.constants');

class A_ServerRouterMeta extends aConcept.A_ComponentMeta {
  get routes() {
    return this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
  }
  get definitions() {
    return this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
  }
  addRoute(regexp, route) {
    const existingRoutes = this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.set(regexp.source, route);
    this.meta.set(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    existingRoutesConfigs.push(route.route);
    this.meta.set(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
  removeRoute(route) {
    const existingRoutes = this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.forEach((value, key) => {
      if (value.route === route) {
        existingRoutes.delete(key);
      }
    });
    this.meta.set(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    const index = existingRoutesConfigs.indexOf(route);
    if (index !== -1) {
      existingRoutesConfigs.splice(index, 1);
    }
    this.meta.set(AServerRouter_constants.A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
}

exports.A_ServerRouterMeta = A_ServerRouterMeta;
//# sourceMappingURL=A-ServerRouter.meta.js.map
//# sourceMappingURL=A-ServerRouter.meta.js.map