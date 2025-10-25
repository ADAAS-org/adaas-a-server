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
exports.A_ServerCORS = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_ServerCORS_component_defaults_1 = require("./A_ServerCORS.component.defaults");
const A_Service_container_types_1 = require("../../containers/A-Service/A-Service.container.types");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const a_utils_1 = require("@adaas/a-utils");
class A_ServerCORS extends a_concept_1.A_Component {
    init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = {
                origin: config.get('ORIGIN') || A_ServerCORS_component_defaults_1.A_SERVER_DEFAULTS__CorsConfig.origin,
                methods: config.get('METHODS') || A_ServerCORS_component_defaults_1.A_SERVER_DEFAULTS__CorsConfig.methods,
                headers: config.get('HEADERS') || A_ServerCORS_component_defaults_1.A_SERVER_DEFAULTS__CorsConfig.headers,
                credentials: config.get('CREDENTIALS') || A_ServerCORS_component_defaults_1.A_SERVER_DEFAULTS__CorsConfig.credentials,
                maxAge: config.get('MAX_AGE') || A_ServerCORS_component_defaults_1.A_SERVER_DEFAULTS__CorsConfig.maxAge,
            };
        });
    }
    apply(aReq, aRes) {
        aRes.setHeader('Access-Control-Allow-Origin', this.config.origin);
        aRes.setHeader('Access-Control-Allow-Methods', this.config.methods.join(', '));
        aRes.setHeader('Access-Control-Allow-Headers', this.config.headers.join(', '));
        if (this.config.credentials) {
            aRes.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        if (this.config.maxAge) {
            aRes.setHeader('Access-Control-Max-Age', this.config.maxAge.toString());
        }
        // Handle preflight OPTIONS requests
        if (aReq.req.method === 'OPTIONS') {
            aRes.status(204).send();
        }
    }
}
exports.A_ServerCORS = A_ServerCORS;
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.beforeStart
    }),
    __param(0, (0, a_concept_1.A_Inject)(a_utils_1.A_Config))
], A_ServerCORS.prototype, "init", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Service_container_types_1.A_SERVER_TYPES__ServerFeature.beforeRequest
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response))
], A_ServerCORS.prototype, "apply", null);
//# sourceMappingURL=A_ServerCORS.component.js.map