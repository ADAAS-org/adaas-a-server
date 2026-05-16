import '../../chunk-EQQGB2QZ.mjs';
import { A_Route } from '@adaas/a-utils/a-route';

class A_ServerRoute extends A_Route {
  constructor(param1, param2) {
    super(param1);
    this.url = param1 instanceof RegExp ? param1.source : param1;
    this.method = param2 || "GET";
  }
  toString() {
    return `${this.method}::${this.path}`;
  }
  toRegExp() {
    return new RegExp(`^${this.method}::${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
  toAFeatureExtension(extensionScope = []) {
    return new RegExp(`^${extensionScope.length ? `(${extensionScope.join("|")})` : ".*"}\\.${this.method}::${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
}

export { A_ServerRoute };
//# sourceMappingURL=A-ServerRoute.entity.mjs.map
//# sourceMappingURL=A-ServerRoute.entity.mjs.map