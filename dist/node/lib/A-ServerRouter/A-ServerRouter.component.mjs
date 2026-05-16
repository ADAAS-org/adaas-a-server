import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Feature, A_Scope, A_Meta, A_Component, A_Context, A_TypeGuards } from '@adaas/a-concept';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_ServerLogger } from '../A-ServerLogger/A-ServerLogger.component';
import { A_HttpServerFeatures } from '@adaas/a-server/server/A-HttpServer.constants';
import { A_HttpServerError } from '@adaas/a-server/server/A-HttpServer.error';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ServerRoute } from '@adaas/a-server/route/A-ServerRoute.entity';
import { A_ServerRouteHttpMethods } from '@adaas/a-server/route/A-ServerRoute.constants';
import { A_ServerRouterMeta } from './A-ServerRouter.meta';
import { A_ServerRouterDefineDecorator } from './A-ServerRouterDefine.decorator';

let A_ServerRouter = class extends A_Component {
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
      method: A_ServerRouteHttpMethods.POST,
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
      method: A_ServerRouteHttpMethods.GET,
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
      method: A_ServerRouteHttpMethods.PUT,
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
      method: A_ServerRouteHttpMethods.DELETE,
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
      method: A_ServerRouteHttpMethods.PATCH,
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
      method: A_ServerRouteHttpMethods.DEFAULT,
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
    const route = typeof config.path === "string" || config.path instanceof RegExp ? new A_ServerRoute(
      `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith("/") ? config.path : `/${config.path}`}`,
      config.method
    ) : config.path;
    return A_ServerRouterDefineDecorator(route);
  }
  async load(logger) {
    const meta = A_Context.meta(this.constructor);
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
    const feature = new A_Feature({ name: route.toString(), component: this });
    if (!feature.size)
      throw new A_HttpServerError({
        status: 404,
        title: "Route Not Found",
        description: `No route found for ${request.method} ${request.url}`
      });
    for (const stage of feature) {
      const targetConstructor = stage.definition.dependency.target;
      if (A_TypeGuards.isComponentConstructor(targetConstructor)) {
        const meta = A_Context.meta(this.constructor);
        const routeDefinitions = meta.definitions;
        const routeDefinition = routeDefinitions?.get(stage.definition.name || "");
        if (routeDefinition) {
          request.useRoute(routeDefinition.route);
        }
      }
      const stageScope = new A_Scope({
        name: `a-route--${request.id}--${stage.definition.name}`
      }, {
        parent: scope
      });
      await stage.process(stageScope);
    }
  }
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_ServerLogger))
], A_ServerRouter.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_HttpServerFeatures.onRequest
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Config)),
  __decorateParam(4, A_Inject(A_Logger)),
  __decorateParam(5, A_Inject(A_ServerRoute))
], A_ServerRouter.prototype, "identifyRoute", 1);
A_ServerRouter = __decorateClass([
  A_Meta.Define(A_ServerRouterMeta)
], A_ServerRouter);

export { A_ServerRouter };
//# sourceMappingURL=A-ServerRouter.component.mjs.map
//# sourceMappingURL=A-ServerRouter.component.mjs.map