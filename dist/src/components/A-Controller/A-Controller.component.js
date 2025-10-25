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
exports.A_Controller = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Router_component_1 = require("../A-Router/A-Router.component");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
class A_Controller extends a_concept_1.A_Component {
    callEntityMethod(request, response, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            //  check step by step each parameter to ensure they are valid
            if (!scope.has(request.params.component))
                return;
            if (!request.params.operation || typeof request.params.operation !== 'string')
                return;
            const possibleComponent = scope.resolve(request.params.component);
            if (!possibleComponent
                ||
                    ![a_concept_1.A_Component, a_concept_1.A_Container]
                        .some(c => possibleComponent instanceof c))
                return;
            const component = possibleComponent;
            const meta = a_concept_1.A_Context.meta(component);
            const targetFeature = meta.features().find(f => f.name === `${component.constructor.name}.${request.params.operation}`);
            if (!targetFeature)
                return;
            yield component.call(request.params.operation, scope);
        });
    }
}
exports.A_Controller = A_Controller;
__decorate([
    A_Router_component_1.A_Router.Post({
        path: '/:component/:operation',
        version: 'v1',
        prefix: 'a-component'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_Controller.prototype, "callEntityMethod", null);
//# sourceMappingURL=A-Controller.component.js.map