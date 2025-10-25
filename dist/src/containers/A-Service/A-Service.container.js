"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Service = void 0;
const http_1 = require("http");
const A_Service_container_types_1 = require("./A-Service.container.types");
const A_Server_context_1 = require("../../context/A-Server/A_Server.context");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const crypto_1 = __importDefault(require("crypto"));
const env_constants_1 = require("../../constants/env.constants");
const a_concept_1 = require("@adaas/a-concept");
const a_utils_1 = require("@adaas/a-utils");
/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
class A_Service extends a_concept_1.A_Container {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let config;
            let aServer;
            if (!this.scope.has((a_utils_1.A_Config))) {
                const config = new a_utils_1.A_Config({
                    variables: [...Array.from(env_constants_1.A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY)],
                    defaults: {
                        A_SERVER_PORT: 3000
                    }
                });
                this.scope.register(config);
            }
            config = this.scope.resolve(a_utils_1.A_Config);
            if (!this.scope.has(A_Server_context_1.A_Server)) {
                aServer = new A_Server_context_1.A_Server({
                    port: config.get('A_SERVER_PORT'),
                    name: this.name,
                    version: 'v1'
                });
            }
            // Set the server to listen on port 3000
            this.port = config.get('A_SERVER_PORT');
            // Create the HTTP server
            this.server = (0, http_1.createServer)(this.onRequest.bind(this));
        });
    }
    listen() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                resolve();
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.server.close(() => {
                resolve();
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.beforeStart();
            yield this.listen();
            yield this.afterStart();
        });
    }
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterStart() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.call(A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.beforeStop);
            yield this.server.close();
            yield this.call(A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.afterStop);
        });
    }
    beforeRequest(scope) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterRequest(scope) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const scope = new a_concept_1.A_Scope({
                name: `a-server-request::${Date.now()}`,
            });
            // We need it to stop feature execution in case request ends
            const { req, res } = yield this.convertToAServer(request, response);
            try {
                scope.register(req);
                scope.register(res);
                scope.inherit(this.scope);
                yield this.beforeRequest(scope);
                yield this.call(A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest, scope);
                yield this.afterRequest(scope);
                yield res.status(200).send();
            }
            catch (error) {
                const logger = this.scope.resolve(a_utils_1.A_Logger);
                logger.error(error);
                return res.failed(error);
            }
        });
    }
    convertToAServer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.method || !request.url)
                throw new Error('Request method or url is missing');
            const id = this.generateRequestId(request.method, request.url);
            const req = new A_Request_entity_1.A_Request({ id, request, scope: this.scope.name });
            const res = new A_Response_entity_1.A_Response({ id, response, scope: this.scope.name });
            yield req.init();
            yield res.init();
            return { req, res };
        });
    }
    generateRequestId(method, url) {
        // Use the current time, request URL, and a few other details to create a unique ID
        const hash = crypto_1.default.createHash('sha256');
        const timeId = a_concept_1.A_IdentityHelper.generateTimeId();
        const randomValue = Math.random().toString(); // Adds extra randomness
        hash.update(`${timeId}-${method}-${url}-${randomValue}`);
        return `${timeId}-${hash.digest('hex')}`;
    }
    beforeStop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterStop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.A_Service = A_Service;
__decorate([
    a_concept_1.A_Concept.Load()
], A_Service.prototype, "load", null);
__decorate([
    a_concept_1.A_Concept.Start()
    /**
     * Start the server
     */
], A_Service.prototype, "start", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_Service.prototype, "beforeStart", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_Service.prototype, "afterStart", null);
__decorate([
    a_concept_1.A_Concept.Stop()
    /**
     * Stop service
     */
], A_Service.prototype, "stop", null);
__decorate([
    a_concept_1.A_Feature.Define({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.beforeRequest,
        invoke: true
    })
], A_Service.prototype, "beforeRequest", null);
__decorate([
    a_concept_1.A_Feature.Define({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.beforeRequest,
        invoke: true
    })
], A_Service.prototype, "afterRequest", null);
__decorate([
    a_concept_1.A_Feature.Define({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest,
        invoke: false
    })
], A_Service.prototype, "onRequest", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_Service.prototype, "beforeStop", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_Service.prototype, "afterStop", null);
//# sourceMappingURL=A-Service.container.js.map