"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_EntityList = void 0;
const a_concept_1 = require("@adaas/a-concept");
const a_utils_1 = require("@adaas/a-utils");
/**
 * A-EntityList
 *
 * Entity that represents a list of entities with pagination of particular type
 */
class A_EntityList extends a_concept_1.A_Entity {
    constructor() {
        super(...arguments);
        this._items = [];
        this._pagination = {
            total: 0,
            page: 1,
            pageSize: 10
        };
    }
    get items() {
        return this._items;
    }
    get pagination() {
        return this._pagination;
    }
    fromNew(newEntity) {
        this.aseid = new a_utils_1.ASEID({
            namespace: a_concept_1.A_Context.root.name,
            scope: 'default',
            entity: 'a-list' + (newEntity.name ? `.${newEntity.name}` : ''),
            id: (new Date()).getTime().toString(),
        });
        this._entityConstructor = newEntity.constructor;
    }
    fromList(items, pagination) {
        this._items = items.map(item => {
            if (item instanceof a_concept_1.A_Entity) {
                return item;
            }
            else {
                const entity = new this._entityConstructor(item);
                return entity;
            }
        });
        if (pagination) {
            this._pagination = {
                total: pagination.total,
                page: pagination.page,
                pageSize: pagination.pageSize
            };
        }
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { items: this._items.map(i => i.toJSON()), pagination: this._pagination });
    }
}
exports.A_EntityList = A_EntityList;
//# sourceMappingURL=A_EntityList.entity.js.map