import '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class A_ServerListQueryFilter extends A_Fragment {
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

export { A_ServerListQueryFilter };
//# sourceMappingURL=A-ServerListQueryFilter.context.mjs.map
//# sourceMappingURL=A-ServerListQueryFilter.context.mjs.map