"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ListQueryFilter = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_ListQueryFilter extends a_concept_1.A_Fragment {
    constructor(_query = {}, defaults = {}) {
        super();
        this._query = _query;
        this.defaults = defaults;
        this.parsedQuery = this.parseQueryString(_query);
    }
    get query() {
        return this._query;
    }
    get(property, defaultValue = '') {
        return this.parsedQuery[property] || this.defaults[property] || defaultValue;
    }
    parseQueryString(value = {}) {
        if (typeof value === 'string') {
            return value.split('&').reduce((acc, part) => {
                const [key, val] = part.split('=');
                acc[decodeURIComponent(key)] = decodeURIComponent(val || '');
                return acc;
            }, {});
        }
        return value;
    }
}
exports.A_ListQueryFilter = A_ListQueryFilter;
//# sourceMappingURL=A_ListQueryFilter.context.js.map