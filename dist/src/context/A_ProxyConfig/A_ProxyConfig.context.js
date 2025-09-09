"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ProxyConfig = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_ProxyConfig_constants_1 = require("./A_ProxyConfig.constants");
const A_Route_entity_1 = require("../../entities/A-Route/A-Route.entity");
class A_ProxyConfig extends a_concept_1.A_Fragment {
    constructor(
    /**
     * Setup proxy configs, where key is the path to match, and value is either a full URL or a partial config object
     */
    configs = {}) {
        super();
        this._configs = Object.entries(configs).map(([path, config]) => {
            const targetUrl = new URL(typeof config === 'string' ? config : config.hostname || ''); // parse hostname, may include scheme
            const port = targetUrl.port ||
                (targetUrl.protocol === "https:" ? '443' : '80');
            const prepared = Object.assign(Object.assign({}, A_ProxyConfig_constants_1.PROXY_CONFIG_DEFAULTS), (typeof config === 'string' ? {
                path,
                port: parseInt(port),
                protocol: targetUrl.protocol,
                hostname: targetUrl.hostname
            } : config));
            return {
                route: new A_Route_entity_1.A_Route(prepared.path, prepared.method),
                hostname: prepared.hostname,
                port: prepared.port,
                headers: prepared.headers,
                protocol: prepared.protocol
            };
        });
    }
    /**
     * Returns all configured proxy configs
     *
     */
    get configs() {
        return this._configs;
    }
    /**
     * Checks if a given path is configured in the proxy
     *
     * @param path
     * @returns
     */
    has(path) {
        return this._configs.some(route => route.route.toRegExp().test(path));
    }
    /**
     * Returns the proxy configuration for a given path, if exists
     *
     * @param path
     * @returns
     */
    config(path) {
        return this._configs.find(route => route.route.toRegExp().test(path));
    }
}
exports.A_ProxyConfig = A_ProxyConfig;
//# sourceMappingURL=A_ProxyConfig.context.js.map