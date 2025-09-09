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
exports.A_ServerContainer = void 0;
const a_concept_1 = require("@adaas/a-concept");
const http_1 = require("http");
const A_Server_container_types_1 = require("./A-Server.container.types");
const A_Server_context_1 = require("../../context/A-Server/A_Server.context");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const crypto_1 = __importDefault(require("crypto"));
class A_ServerContainer extends a_concept_1.A_Container {
    constructor() {
        super(...arguments);
        this.port = 3000;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.Scope.has(a_concept_1.A_Errors)) {
                const errorsRegistry = new a_concept_1.A_Errors({});
                this.Scope.register(errorsRegistry);
            }
            if (!this.Scope.has(a_concept_1.A_Config)) {
                const config = new a_concept_1.A_Config({
                    variables: ['DEV_MODE', 'CONFIG_VERBOSE', 'PORT'],
                    defaults: {
                        DEV_MODE: true,
                        CONFIG_VERBOSE: true,
                        PORT: 3000
                    }
                });
                this.Scope.register(config);
            }
            const config = this.Scope.resolve(a_concept_1.A_Config);
            // Set the server to listen on port 3000
            const port = config.get('PORT') || 3000;
            // Create the HTTP server
            this.server = (0, http_1.createServer)(this.onRequest.bind(this));
            const newServer = new A_Server_context_1.A_Server({
                port,
                name: this.name,
                version: 'v1'
            });
            this.Scope.register(newServer);
            // } else {
            //     this.server = existedServer;
            // }
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
            yield this.call(A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.beforeStop);
            yield this.server.close();
            yield this.call(A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.afterStop);
        });
    }
    onRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            // We need it to stop feature execution in case request ends
            const { req, res } = yield this.convertToAServer(request, response);
            try {
                const scope = new a_concept_1.A_Scope({
                    name: `a-server-request::${Date.now()}`,
                    entities: [req, res],
                });
                yield this.call(A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest, scope);
                yield res.status(200).send();
            }
            catch (error) {
                return res.failed(error);
            }
        });
    }
    convertToAServer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.method || !request.url)
                throw new Error('Request method or url is missing');
            const id = this.generateRequestId(request.method, request.url);
            const req = new A_Request_entity_1.A_Request({ id, request, scope: this.Scope.name });
            const res = new A_Response_entity_1.A_Response({ id, response, scope: this.Scope.name });
            yield req.init();
            yield res.init();
            return { req, res };
        });
    }
    generateRequestId(method, url) {
        // Use the current time, request URL, and a few other details to create a unique ID
        const hash = crypto_1.default.createHash('sha256');
        const time = Date.now();
        const randomValue = Math.random().toString(); // Adds extra randomness
        hash.update(`${time}-${method}-${url}-${randomValue}`);
        return hash.digest('hex');
    }
    beforeStop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    afterStop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.A_ServerContainer = A_ServerContainer;
__decorate([
    a_concept_1.A_Concept.Load()
], A_ServerContainer.prototype, "load", null);
__decorate([
    a_concept_1.A_Concept.Start()
    /**
     * Start the server
     */
], A_ServerContainer.prototype, "start", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_ServerContainer.prototype, "beforeStart", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_ServerContainer.prototype, "afterStart", null);
__decorate([
    a_concept_1.A_Concept.Stop()
    /**
     * Stop the server
     */
], A_ServerContainer.prototype, "stop", null);
__decorate([
    a_concept_1.A_Feature.Define({
        name: A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest,
        invoke: false
    })
    /**
     * Handle incoming requests
     */
], A_ServerContainer.prototype, "onRequest", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_ServerContainer.prototype, "beforeStop", null);
__decorate([
    a_concept_1.A_Feature.Define({ invoke: true })
], A_ServerContainer.prototype, "afterStop", null);
//# sourceMappingURL=A-Server.container.js.map