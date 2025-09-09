"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_StaticConfig = void 0;
const a_concept_1 = require("@adaas/a-concept");
class A_StaticConfig extends a_concept_1.A_Fragment {
    constructor(
    /**
     * Setup directories to serve static files from, comma separated
     */
    directories = []) {
        super();
        this.directories = directories;
    }
    /**
     * Checks if a given path is configured in the proxy
     *
     * @param path
     * @returns
     */
    has(path) {
        const found = this.directories.find(dir => {
            return new RegExp(`^\/${dir.startsWith('/') ? dir.slice(1) : dir}/?.*`).test(path);
        });
        return !!found && found;
    }
}
exports.A_StaticConfig = A_StaticConfig;
//# sourceMappingURL=A-StaticConfig.context.js.map