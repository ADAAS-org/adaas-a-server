'use strict';

var aConcept = require('@adaas/a-concept');

class A_ServerListQueryFilter extends aConcept.A_Fragment {
  constructor(_query = {}, defaults = {}) {
    super();
    this._query = _query;
    this.defaults = defaults;
    this.parsedQuery = this.parseQueryString(_query);
  }
  get query() {
    return this._query;
  }
  get(property, defaultValue = "") {
    return this.parsedQuery[property] || this.defaults[property] || defaultValue;
  }
  parseQueryString(value = {}) {
    if (typeof value === "string") {
      return value.split("&").reduce((acc, part) => {
        const [key, val] = part.split("=");
        acc[decodeURIComponent(key)] = decodeURIComponent(val || "");
        return acc;
      }, {});
    }
    return value;
  }
}

exports.A_ServerListQueryFilter = A_ServerListQueryFilter;
//# sourceMappingURL=A-ServerListQueryFilter.context.js.map
//# sourceMappingURL=A-ServerListQueryFilter.context.js.map