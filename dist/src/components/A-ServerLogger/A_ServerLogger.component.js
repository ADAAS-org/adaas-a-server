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
exports.A_ServerLogger = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Server_container_types_1 = require("../../containers/A-Server/A-Server.container.types");
const A_Server_context_1 = require("../../context/A-Server/A_Server.context");
const A_Server_container_1 = require("../../containers/A-Server/A-Server.container");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_Response_entity_types_1 = require("../../entities/A-Response/A-Response.entity.types");
const A_Request_entity_types_1 = require("../../entities/A-Request/A-Request.entity.types");
class A_ServerLogger extends a_concept_1.A_Logger {
    onRequestEnd(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            this.route({
                method: request.method,
                url: request.url,
                status: response.statusCode,
                responseTime: response.duration
            });
        });
    }
    onRequestError(request) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    logStart(server) {
        this.serverReady({
            port: server.port,
            app: {
                name: server.name,
                version: server.version
            }
        });
    }
    logStop(server) {
        this.log('red', `Server ${server.name} stopped`);
    }
    metrics() {
    }
    routes(routes) {
        const time = this.getTime();
        console.log(`\x1b[36m[${this.scope.name}] |${time}| Exposed Routes:
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${routes.map(route => `${' '.repeat(this.scopeLength + 3)}| [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.path}`).join('\n')}
${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`);
    }
    /**
     * Logs the route information based on status code
     *
     * @param route
     */
    route(route) {
        switch (route.status) {
            case 200:
                this.log200(route);
                break;
            case 404:
                this.log404(route);
                break;
            case 500:
                this.log500(route);
                break;
            case 400:
                this.log400(route);
                break;
            default:
                this.logDefault(route);
                break;
        }
    }
    log200(route) {
        if (this.config.get('SERVER_IGNORE_LOG_200'))
            return;
        console.log(`\x1b[32m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }
    log404(route) {
        if (this.config.get('SERVER_IGNORE_LOG_404'))
            return;
        console.log(`\x1b[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }
    log500(route) {
        if (this.config.get('SERVER_IGNORE_LOG_500'))
            return;
        console.log(`\x1b[31m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }
    log400(route) {
        if (this.config.get('SERVER_IGNORE_LOG_400'))
            return;
        console.log(`\x1b[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }
    logDefault(route) {
        if (this.config.get('SERVER_IGNORE_LOG_DEFAULT'))
            return;
        console.log(`\x1b[36m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${' '.repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1b[0m`);
    }
    serverReady(params) {
        const processId = process.pid;
        console.log(`\x1b[36m[${this.scope.name}] |${this.getTime()}| Server Ready:
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ${params.app.name} v${params.app.version || '0.0.1'} is running on port ${params.port}
${' '.repeat(this.scopeLength + 3)}| Process ID: ${processId}
${' '.repeat(this.scopeLength + 3)}|-------------------------------
${' '.repeat(this.scopeLength + 3)}| ==============================
${' '.repeat(this.scopeLength + 3)}|          LISTENING...         
${' '.repeat(this.scopeLength + 3)}| ==============================
\x1b[0m`);
    }
    /**
     * Displays a proxy routes
     *
     * @param params
     */
    proxy(params) {
        console.log(`\x1b[35m[${this.scope.name}] |${this.getTime()}| Proxy:
${' '.repeat(this.scopeLength + 3)}| ${params.original} -> ${params.destination}
${' '.repeat(this.scopeLength + 3)}|-------------------------------\x1b[0m`);
    }
}
exports.A_ServerLogger = A_ServerLogger;
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Response_entity_types_1.A_SERVER_TYPES__ResponseEvent.Finish,
        scope: [A_Response_entity_1.A_Response]
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response))
], A_ServerLogger.prototype, "onRequestEnd", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Request_entity_types_1.A_SERVER_TYPES__RequestEvent.Error,
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request))
], A_ServerLogger.prototype, "onRequestError", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: false }),
    a_concept_1.A_Feature.Extend({
        name: A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.afterStart,
        scope: [A_Server_container_1.A_ServerContainer]
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Server_context_1.A_Server))
], A_ServerLogger.prototype, "logStart", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.afterStop,
        scope: [A_Server_container_1.A_ServerContainer]
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Server_context_1.A_Server))
], A_ServerLogger.prototype, "logStop", null);
//# sourceMappingURL=A_ServerLogger.component.js.map