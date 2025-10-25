"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_EntityFactory = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_EntityFactory extends a_concept_1.A_Fragment {
    constructor(param1, param2) {
        super();
        this._entities = new Map();
        this._setEntities(param1);
        this._setEntities(param2);
    }
    _setEntities(entities = []) {
        if (Array.isArray(entities)) {
            entities.forEach((entity) => {
                this._entities.set(entity.entity, entity);
            });
        }
        else {
            Object.keys(entities).forEach((key) => {
                this._entities.set(key, entities[key]);
            });
        }
    }
    add(param1, param2) {
        switch (true) {
            case typeof param1 === 'string' && !!param2:
                this._entities.set(param1, param2);
                break;
            case typeof param1 !== 'string':
                this._entities.set(param1.entity, param1);
                break;
        }
    }
    has(param1) {
        let name;
        switch (true) {
            case param1 instanceof a_concept_1.ASEID:
                name = param1.entity;
                break;
            case !(param1 instanceof a_concept_1.ASEID) && a_concept_1.ASEID.isASEID(param1):
                name = new a_concept_1.ASEID(param1).entity;
                break;
            default:
                name = param1;
                break;
        }
        return this._entities.has(name);
    }
    resolve(param1) {
        let name;
        switch (true) {
            case param1 instanceof a_concept_1.ASEID:
                name = param1.entity;
                break;
            case typeof param1 === 'string' && a_concept_1.ASEID.isASEID(param1):
                name = new a_concept_1.ASEID(param1).entity;
                break;
            default:
                name = param1;
                break;
        }
        return this._entities.get(name);
    }
    resolveByName(name) {
        return this._entities.get(name);
    }
}
exports.A_EntityFactory = A_EntityFactory;
//# sourceMappingURL=A-EntityFactory.context.js.map