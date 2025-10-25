"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.A_ServerHealthMonitor = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Router_component_1 = require("../A-Router/A-Router.component");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const a_utils_1 = require("@adaas/a-utils");
class A_ServerHealthMonitor extends a_concept_1.A_Component {
    // =======================================================
    // ================ Method Definition=====================
    // =======================================================
    get(config, request, response, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            logger.log('Health check requested', config.get('A_CONCEPT_ROOT_FOLDER'));
            const packageJSON = yield Promise.resolve(`${`${config.get('A_CONCEPT_ROOT_FOLDER')}/package.json`}`).then(s => __importStar(require(s)));
            const exposedProperties = ((_a = config.get('EXPOSED_PROPERTIES')) === null || _a === void 0 ? void 0 : _a.split(',')) || [
                'name',
                'version',
                'description',
            ];
            exposedProperties.forEach(prop => response.add(prop, packageJSON[prop]));
            console.log(`Health check accessed: ${request.method} ${request.url}`);
        });
    }
}
exports.A_ServerHealthMonitor = A_ServerHealthMonitor;
__decorate([
    A_Router_component_1.A_Router.Get({
        path: '/',
        prefix: 'health',
        version: 'v1',
    }),
    __param(0, (0, a_concept_1.A_Inject)(a_utils_1.A_Config)),
    __param(1, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(2, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(3, (0, a_concept_1.A_Inject)(a_utils_1.A_Logger))
], A_ServerHealthMonitor.prototype, "get", null);
//# sourceMappingURL=A-ServerHealthMonitor.component.js.map