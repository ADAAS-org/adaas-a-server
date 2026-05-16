'use strict';

var aConcept = require('@adaas/a-concept');
var AServerProxy_constants = require('./A-ServerProxy.constants');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');

class A_ProxyConfig extends aConcept.A_Fragment {
  constructor(configs = {}) {
    super();
    this._configs = Object.entries(configs).map(([path, config]) => {
      const targetUrl = new URL(typeof config === "string" ? config : config.hostname || "");
      const port = targetUrl.port || (targetUrl.protocol === "https:" ? "443" : "80");
      const prepared = {
        ...AServerProxy_constants.PROXY_CONFIG_DEFAULTS,
        ...typeof config === "string" ? {
          path,
          port: parseInt(port),
          protocol: targetUrl.protocol,
          hostname: targetUrl.hostname
        } : config
      };
      return {
        route: new AServerRoute_entity.A_ServerRoute(prepared.path, prepared.method),
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
    return this._configs.some((route) => route.route.toRegExp().test(path));
  }
  /**
   * Returns the proxy configuration for a given path, if exists
   *
   * @param path 
   * @returns 
   */
  config(path) {
    return this._configs.find((route) => route.route.toRegExp().test(path));
  }
}

exports.A_ProxyConfig = A_ProxyConfig;
//# sourceMappingURL=A-ServerProxy.context.js.map
//# sourceMappingURL=A-ServerProxy.context.js.map