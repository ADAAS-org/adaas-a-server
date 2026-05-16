'use strict';

var aConcept = require('@adaas/a-concept');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AServerLogger_component = require('../A-ServerLogger/A-ServerLogger.component');
var AHttpServer_constants = require('@adaas/a-server/server/A-HttpServer.constants');
var AHttpServer_error = require('@adaas/a-server/server/A-HttpServer.error');
var aConfig = require('@adaas/a-utils/a-config');
var aLogger = require('@adaas/a-utils/a-logger');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');
var AServerRoute_constants = require('@adaas/a-server/route/A-ServerRoute.constants');
var AServerRouter_meta = require('./A-ServerRouter.meta');
var AServerRouterDefine_decorator = require('./A-ServerRouterDefine.decorator');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
exports.A_ServerRouter = class A_ServerRouter extends aConcept.A_Component {
  // =======================================================
  // ================ Method Definition=====================
  // =======================================================
  /**
   * Allows to define a custom route for POST requests
   * 
   * @param path 
   * @returns 
   */
  static Post(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.POST,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for GET requests
   * 
   * @param path 
   * @returns 
   */
  static Get(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.GET,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for PUT requests
   * 
   * @param path 
   * @returns 
   */
  static Put(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.PUT,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for DELETE requests
   * 
   * @param path 
   * @returns 
   */
  static Delete(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.DELETE,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for PATCH requests
   * 
   * @param path 
   * @returns 
   */
  static Patch(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.PATCH,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for DEFAULT requests
   * 
   * @param path 
   * @returns 
   */
  static Default(path) {
    return this.defineRoute({
      method: AServerRoute_constants.A_ServerRouteHttpMethods.DEFAULT,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  // static routes: Array<A_ServerRoute> = [];
  /**
   * Private method to have the same signature for all route methods
   * 
   * @param method 
   * @param path 
   * @returns 
   */
  static defineRoute(config) {
    const route = typeof config.path === "string" || config.path instanceof RegExp ? new AServerRoute_entity.A_ServerRoute(
      `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith("/") ? config.path : `/${config.path}`}`,
      config.method
    ) : config.path;
    return AServerRouterDefine_decorator.A_ServerRouterDefineDecorator(route);
  }
  async load(logger) {
    const meta = aConcept.A_Context.meta(this.constructor);
    const routes = meta.routes;
    if (!routes || !routes.length) {
      logger.warning("yellow", `No routes defined for ${this.constructor.name}`);
      return;
    }
    logger.info(
      "cyan",
      `Registered Routes:`,
      `------------------------------------
`,
      ...routes.map((route) => `[${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.path}`)
    );
  }
  async identifyRoute(request, response, scope, config, logger, route) {
    if (route.method === "OPTIONS") {
      return;
    }
    const feature = new aConcept.A_Feature({ name: route.toString(), component: this });
    if (!feature.size)
      throw new AHttpServer_error.A_HttpServerError({
        status: 404,
        title: "Route Not Found",
        description: `No route found for ${request.method} ${request.url}`
      });
    for (const stage of feature) {
      const targetConstructor = stage.definition.dependency.target;
      if (aConcept.A_TypeGuards.isComponentConstructor(targetConstructor)) {
        const meta = aConcept.A_Context.meta(this.constructor);
        const routeDefinitions = meta.definitions;
        const routeDefinition = routeDefinitions?.get(stage.definition.name || "");
        if (routeDefinition) {
          request.useRoute(routeDefinition.route);
        }
      }
      const stageScope = new aConcept.A_Scope({
        name: `a-route--${request.id}--${stage.definition.name}`
      }, {
        parent: scope
      });
      await stage.process(stageScope);
    }
  }
};
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(AServerLogger_component.A_ServerLogger))
], exports.A_ServerRouter.prototype, "load", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AHttpServer_constants.A_HttpServerFeatures.onRequest
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(3, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(4, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(5, aConcept.A_Inject(AServerRoute_entity.A_ServerRoute))
], exports.A_ServerRouter.prototype, "identifyRoute", 1);
exports.A_ServerRouter = __decorateClass([
  aConcept.A_Meta.Define(AServerRouter_meta.A_ServerRouterMeta)
], exports.A_ServerRouter);
//# sourceMappingURL=A-ServerRouter.component.js.map
//# sourceMappingURL=A-ServerRouter.component.js.map