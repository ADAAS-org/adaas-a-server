'use strict';

var aConcept = require('@adaas/a-concept');

class A_Server extends aConcept.A_Fragment {
  constructor(params) {
    super(params);
    this._routes = [];
    this.port = params.port;
    this._name = params.name;
    this.version = params.version || "v1";
    this._routes = params.routes || this._routes;
  }
  /**
   * A list of routes that the server will listen to
   */
  get routes() {
    return this._routes;
  }
}

exports.A_Server = A_Server;
//# sourceMappingURL=A-Server.context.js.map
//# sourceMappingURL=A-Server.context.js.map