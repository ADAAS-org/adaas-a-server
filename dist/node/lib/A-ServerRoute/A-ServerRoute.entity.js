'use strict';

var aRoute = require('@adaas/a-utils/a-route');

class A_ServerRoute extends aRoute.A_Route {
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

exports.A_ServerRoute = A_ServerRoute;
//# sourceMappingURL=A-ServerRoute.entity.js.map
//# sourceMappingURL=A-ServerRoute.entity.js.map