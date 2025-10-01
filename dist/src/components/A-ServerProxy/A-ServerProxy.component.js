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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ServerProxy = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Service_container_types_1 = require("../../containers/A-Service/A-Service.container.types");
const A_ProxyConfig_context_1 = require("../../context/A_ProxyConfig/A_ProxyConfig.context");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_Route_entity_1 = require("../../entities/A-Route/A-Route.entity");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class A_ServerProxy extends a_concept_1.A_Component {
    load(logger, config) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('pink', `Proxy routes configured:`, config.configs.map(c => c.route).join('\n'));
        });
    }
    onRequest(req, res, proxyConfig, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const { method, url } = req;
                const route = new A_Route_entity_1.A_Route(url, method);
                const config = proxyConfig.config(route.toString());
                if (!config) {
                    return resolve(); // nothing to proxy
                }
                logger.log("yellow", `Proxying request ${method} ${url} to ${config.hostname}`, config);
                const client = config.protocol === "https:" ? https_1.default : http_1.default;
                const proxyReq = client.request({
                    method: config.route.method,
                    hostname: config.hostname,
                    port: config.port,
                    headers: config.headers,
                    path: route.path,
                }, (proxyRes) => {
                    if (!res.headersSent) {
                        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
                    }
                    proxyRes.on("end", () => {
                        logger.log("green", `Proxy request to ${config === null || config === void 0 ? void 0 : config.hostname} completed`);
                        resolve();
                    });
                    proxyRes.pipe(res.original);
                });
                proxyReq.on("error", (err) => reject(err));
                req.pipe(proxyReq);
            });
        });
    }
}
exports.A_ServerProxy = A_ServerProxy;
__decorate([
    a_concept_1.A_Concept.Load(),
    __param(0, (0, a_concept_1.A_Inject)(a_concept_1.A_Logger)),
    __param(1, (0, a_concept_1.A_Inject)(A_ProxyConfig_context_1.A_ProxyConfig))
], A_ServerProxy.prototype, "load", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest,
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_ProxyConfig_context_1.A_ProxyConfig)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Logger))
], A_ServerProxy.prototype, "onRequest", null);
//# sourceMappingURL=A-ServerProxy.component.js.map