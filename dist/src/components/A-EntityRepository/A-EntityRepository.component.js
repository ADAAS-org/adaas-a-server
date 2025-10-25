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
exports.A_EntityRepository = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Entity_constants_1 = require("@adaas/a-concept/dist/src/global/A-Entity/A-Entity.constants");
const A_Http_channel_1 = require("../../channels/A-Http/A-Http.channel");
const A_EntityList_entity_1 = require("../../entities/A_EntityList/A_EntityList.entity");
const a_utils_1 = require("@adaas/a-utils");
class A_EntityRepository extends a_concept_1.A_Component {
    load(channel, entity, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the scope has a manifest and if the entity is allowed to load
            if (scope.has(a_utils_1.A_Manifest) && !scope.resolve(a_utils_1.A_Manifest)
                .isAllowed(entity.constructor, 'load')
                .for(entity.constructor))
                return;
            const response = yield channel.get(`/a-entity/${entity.aseid.toString()}`);
            entity.fromJSON(response.data);
        });
    }
    save(channel, entity, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the scope has a manifest and if the entity is allowed to save
            if (scope.has(a_utils_1.A_Manifest) && !scope.resolve(a_utils_1.A_Manifest)
                .isAllowed(entity.constructor, 'save')
                .for(entity.constructor))
                return;
            const response = yield channel.post(`/a-entity/${entity.aseid.toString()}`, entity.toJSON());
            entity.fromJSON(response.data);
        });
    }
    destroy(channel, entity, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the scope has a manifest and if the entity is allowed to destroy
            if (scope.has(a_utils_1.A_Manifest) && !scope.resolve(a_utils_1.A_Manifest)
                .isAllowed(entity.constructor, 'destroy')
                .for(entity.constructor))
                return;
            const response = yield channel.delete(`/a-entity/${entity.aseid.toString()}`);
            entity.fromJSON(response.data);
        });
    }
}
exports.A_EntityRepository = A_EntityRepository;
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Entity_constants_1.A_TYPES__EntityFeatures.LOAD,
        scope: {
            exclude: [A_EntityList_entity_1.A_EntityList]
        }
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Http_channel_1.A_HTTPChannel)),
    __param(1, (0, a_concept_1.A_Inject)(a_concept_1.A_Caller)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityRepository.prototype, "load", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Entity_constants_1.A_TYPES__EntityFeatures.SAVE,
        scope: {
            exclude: [A_EntityList_entity_1.A_EntityList]
        }
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Http_channel_1.A_HTTPChannel)),
    __param(1, (0, a_concept_1.A_Inject)(a_concept_1.A_Caller)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityRepository.prototype, "save", null);
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Entity_constants_1.A_TYPES__EntityFeatures.DESTROY,
        scope: {
            exclude: [A_EntityList_entity_1.A_EntityList]
        }
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Http_channel_1.A_HTTPChannel)),
    __param(1, (0, a_concept_1.A_Inject)(a_concept_1.A_Caller)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope))
], A_EntityRepository.prototype, "destroy", null);
//# sourceMappingURL=A-EntityRepository.component.js.map