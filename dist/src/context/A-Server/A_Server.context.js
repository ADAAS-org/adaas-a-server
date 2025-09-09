"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Server = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_Server extends a_concept_1.A_Fragment {
    constructor(params) {
        super(params);
        this._routes = [];
        this.port = params.port;
        this.name = params.name;
        this.version = params.version || 'v1';
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
//# sourceMappingURL=A_Server.context.js.map