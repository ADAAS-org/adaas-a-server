import '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class A_Server extends A_Fragment {
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

export { A_Server };
//# sourceMappingURL=A-Server.context.mjs.map
//# sourceMappingURL=A-Server.context.mjs.map