"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Router = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Server_container_1 = require("../../containers/A-Server/A-Server.container");
const A_Server_container_types_1 = require("../../containers/A-Server/A-Server.container.types");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Router_component_types_1 = require("./A-Router.component.types");
const A_Route_entity_1 = require("../../entities/A-Route/A-Route.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_ServerLogger_component_1 = require("../A-ServerLogger/A_ServerLogger.component");
class A_Router extends a_concept_1.A_Component {
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.POST,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.GET,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.PUT,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.DELETE,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.PATCH,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
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
            method: A_Router_component_types_1.A_SERVER_TYPES__RouterMethod.DEFAULT,
            path: typeof path === 'object' && 'path' in path ? path.path : path,
            version: typeof path === 'object' && 'version' in path && path.version ? path.version : 'v1',
            prefix: typeof path === 'object' && 'prefix' in path && path.prefix ? path.prefix : 'api',
        });
    }
    /**
     * Private method to have the same signature for all route methods
     *
     * @param method
     * @param path
     * @returns
     */
    static defineRoute(config) {
        const route = typeof config.path === 'string' || config.path instanceof RegExp
            ? new A_Route_entity_1.A_Route(`/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith('/') ? config.path : `/${config.path}`}`, config.method)
            : config.path;
        this.routes.push(route);
        return function decorator(target, propertyKey, descriptor) {
            const meta = a_concept_1.A_Context.meta(target);
            const routes = meta.get(A_Router_component_types_1.A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES) || new Map();
            const searchKey = route.toAFeatureExtension(['A_Router', 'A_ServerContainer']);
            routes.set(searchKey.source, route);
            meta.set(A_Router_component_types_1.A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES, routes);
            (0, a_concept_1.A_Feature_Define)({
                name: searchKey.source,
                invoke: false
            })(target, propertyKey, descriptor);
            return (0, a_concept_1.A_Feature_Extend)(searchKey)(target, propertyKey, descriptor);
        };
    }
    // =====================================================
    // ================ Concept Lifecycle ========================
    // =====================================================
    load(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.routes(A_Router.routes);
        });
    }
    // =======================================================
    // ================ Feature Definition=====================
    // =======================================================
    identifyRoute(request, response, scope, config, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { method, url } = request;
            const route = new A_Route_entity_1.A_Route(url, method);
            console.log('--- Incoming Request ---', route.toString());
            if (config.get('DEV_MODE')) {
                logger.log(`Incoming request: ${request.method} ${request.url}`);
                logger.log(`Identified route: ${route.toString()}`);
            }
            /**
             * just execute all listeners on the Route
             * url example: /api/v1/users/123
             * OR
             * url example: /api/v1/users
             * => Then The feature will be "GET::/api/v1/users"
             * And it will return all stages that are similar to the feature name
             */
            const feature = a_concept_1.A_Context.feature(this, route.toString(), scope);
            for (const stage of feature) {
                for (const step of stage.steps) {
                    const meta = a_concept_1.A_Context.meta(step.component);
                    const routes = meta.get(A_Router_component_types_1.A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES);
                    if (routes) {
                        const currentRoute = routes.get(step.name || '');
                        if (currentRoute) {
                            request.params = Object.assign(Object.assign({}, request.params), currentRoute.extractParams(url));
                        }
                    }
                }
                const stageScope = new a_concept_1.A_Scope({
                    name: `a-route::${Date.now()}`,
                    entities: [request],
                });
                yield stage.process(stageScope);
            }
        });
    }
}
exports.A_Router = A_Router;
A_Router.routes = [];
__decorate([
    a_concept_1.A_Concept.Load(),
    __param(0, (0, a_concept_1.A_Inject)(A_ServerLogger_component_1.A_ServerLogger))
], A_Router.prototype, "load", null);
__decorate([
    a_concept_1.A_Feature.Define({
        invoke: false
    }),
    a_concept_1.A_Feature.Extend({
        name: A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest,
        scope: [A_Server_container_1.A_ServerContainer],
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Config)),
    __param(4, (0, a_concept_1.A_Inject)(a_concept_1.A_Logger))
], A_Router.prototype, "identifyRoute", null);
//# sourceMappingURL=A-Router.component.js.map