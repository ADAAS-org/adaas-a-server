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
exports.A_ListingController = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_EntityFactory_context_1 = require("../../context/A-EntityFactory/A-EntityFactory.context");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_Router_component_1 = require("../A-Router/A-Router.component");
const A_EntityList_entity_1 = require("../../entities/A_EntityList/A_EntityList.entity");
const A_ListQueryFilter_context_1 = require("../../context/A-ListQueryFilter/A_ListQueryFilter.context");
const a_utils_1 = require("@adaas/a-utils");
class A_ListingController extends a_concept_1.A_Component {
    // @A_Feature.Define({
    //     name: 'listEntities',
    //     invoke: false
    // })
    list(request, response, factory, scope, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = factory.resolveByName(request.params.type);
            if (constructor) {
                const entityList = new A_EntityList_entity_1.A_EntityList({
                    name: request.params.type,
                    scope: scope.name,
                    constructor
                });
                scope.register(entityList);
                const queryFilter = new A_ListQueryFilter_context_1.A_ListQueryFilter(request.query, {
                    itemsPerPage: String(config.get('A_LIST_ITEMS_PER_PAGE') || '10'),
                    page: String(config.get('A_LIST_PAGE') || '1')
                });
                const queryScope = new a_concept_1.A_Scope({
                    fragments: [queryFilter]
                }).inherit(scope);
                yield entityList.load(queryScope);
                response.add('items', entityList.items);
                response.add('pagination', entityList.pagination);
            }
        });
    }
}
exports.A_ListingController = A_ListingController;
__decorate([
    A_Router_component_1.A_Router.Get({
        path: '/:type',
        version: 'v1',
        prefix: 'a-list'
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(A_EntityFactory_context_1.A_EntityFactory)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope)),
    __param(4, (0, a_concept_1.A_Inject)(a_utils_1.A_Config))
], A_ListingController.prototype, "list", null);
//# sourceMappingURL=A-ListingController.component.js.map