"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_HTTPChannel_RequestContext = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_HTTPChannel_RequestContext extends a_concept_1.A_Fragment {
    constructor(params) {
        super();
        const { method, url, data, config, } = params;
        this.url = url;
        this.method = method;
        this.data = data;
        this.config = config;
    }
}
exports.A_HTTPChannel_RequestContext = A_HTTPChannel_RequestContext;
//# sourceMappingURL=A-HttpChannel.context.js.map