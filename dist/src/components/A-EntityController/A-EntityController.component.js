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
exports.A_EntityController = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Router_component_1 = require("../A-Router/A-Router.component");
const A_EntityFactory_context_1 = require("../../context/A-EntityFactory/A-EntityFactory.context");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const a_utils_1 = require("@adaas/a-utils");
class A_EntityController extends a_concept_1.A_Component {
    // =======================================================
    // ================ Method Definition=====================
    // =======================================================
    load(request, response, factory, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!a_utils_1.ASEID.isASEID(request.params.aseid)) {
                response.add('A_EntityController.load', 'Invalid ASEID');
                return;
            }
            console.log('Loading entity with ASEID:', request.params.aseid);
            const constructor = factory.resolve(request.params.aseid);
            if (constructor) {
                const entity = new constructor(request.params.aseid);
                scope.register(entity);
                yield entity.load();
                response.add('entity', entity);
                response.add('type', entity.entity);
            }
            else
                throw new Error('Entity is not available or invalid');
        });
    }
    create(request, factory, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = factory.resolve(request.params.aseid);
            if (constructor) {
                const entity = new constructor(request.body);
                scope.register(entity);
                yield entity.save();
            }
        });
    }
    update(request, response, factory, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!a_utils_1.ASEID.isASEID(request.params.aseid)) {
                response.add('A_EntityController.update', 'Invalid ASEID');
                return;
            }
            const constructor = factory.resolve(request.params.aseid);
            if (constructor) {
                const entity = new constructor(request.body);
                scope.register(entity);
                yield entity.save();
            }
        });
    }
    delete(request, response, factory, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!a_utils_1.ASEID.isASEID(request.params.aseid)) {
                response.add('A_EntityController.delete', 'Invalid ASEID');
                return;
            }
            const constructor = factory.resolve(request.params.aseid);
            if (constructor) {
                const entity = new constructor(request.params.aseid);
                scope.register(entity);
                yield entity.destroy();
            }
        });
    }
    callEntity(request, response, factory, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!a_utils_1.ASEID.isASEID(request.params.aseid)) {
                response.add('A_EntityController.callEntity', 'Invalid ASEID');
                return;
            }
            const constructor = factory.resolve(request.params.aseid);
            if (!constructor) {
                response.add('A_EntityController.callEntity', 'Entity not found');
                return;
            }
            const meta = a_concept_1.A_Context.meta(constructor);
            const targetFeature = meta.features().find(f => f.name === `${constructor.name}.${request.params.action}`);
            if (!targetFeature) {
                response.add('A_EntityController.callEntity', 'Feature not found');
                return;
            }
            const entity = new constructor(request.params.aseid);
            scope.register(entity);
            yield entity.load(scope);
            yield entity[targetFeature.handler](scope);
            response.add('result', scope.toJSON());
            response.add('entity', entity);
            response.add('type', entity.entity);
        });
    }
}
exports.A_EntityController = A_EntityController;
__decorate([
    a_concept_1.A_Feature.Define({
        name: 'getEntity',
        invoke: false
    }),
    A_Router_component_1.A_Router.Get({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityController.prototype, "load", null);
__decorate([
    A_Router_component_1.A_Router.Post({
        path: '/',
        version: 'v1',
        prefix: 'a-entity'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityController.prototype, "create", null);
__decorate([
    A_Router_component_1.A_Router.Put({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityController.prototype, "update", null);
__decorate([
    A_Router_component_1.A_Router.Delete({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityController.prototype, "delete", null);
__decorate([
    a_concept_1.A_Feature.Define({
        name: 'callEntity',
        invoke: false
    }),
    A_Router_component_1.A_Router.Get({
        path: '/:aseid/:action',
        version: 'v1',
        prefix: 'a-entity'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityController.prototype, "callEntity", null);
//# sourceMappingURL=A-EntityController.component.js.map