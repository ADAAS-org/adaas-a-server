import { A_Fragment } from "@adaas/a-concept";
import { A_SERVER_TYPES__ProxyConfigConstructor, A_SERVER_TYPES__ProxyConfigConstructorConfig, A_SERVER_TYPES__RoutesConfig } from "./A_ProxyConfig.types";
import { PROXY_CONFIG_DEFAULTS } from "./A_ProxyConfig.constants";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";



export class A_ProxyConfig extends A_Fragment {

    protected readonly _configs: Array<A_SERVER_TYPES__RoutesConfig>

    constructor(
        /**
         * Setup proxy configs, where key is the path to match, and value is either a full URL or a partial config object
         */
        configs: A_SERVER_TYPES__ProxyConfigConstructor = {}
    ) {
        super();

        this._configs = Object.entries(configs).map(([path, config]) => {

            const targetUrl = new URL(typeof config === 'string' ? config : config.hostname || ''); // parse hostname, may include scheme

            const port =
                targetUrl.port ||
                (targetUrl.protocol === "https:" ? '443' : '80');


            const prepared = {
                ...PROXY_CONFIG_DEFAULTS,
                ...(typeof config === 'string' ? {
                    path,
                    port: parseInt(port),
                    protocol: targetUrl.protocol,
                    hostname: targetUrl.hostname
                } : config)
            }

            return {
                route: new A_Route(prepared.path, prepared.method),
                hostname: prepared.hostname,
                port: prepared.port,
                headers: prepared.headers,
                protocol: prepared.protocol
            }
        });
    }

    /**
     * Returns all configured proxy configs
     * 
     */
    get configs(): Array<A_SERVER_TYPES__RoutesConfig> {
        return this._configs;
    }


    /**
     * Checks if a given path is configured in the proxy
     * 
     * @param path 
     * @returns 
     */
    has(path: string): boolean {
        return this._configs.some(route => route.route.toRegExp().test(path));
    }

    /**
     * Returns the proxy configuration for a given path, if exists
     *
     * @param path 
     * @returns 
     */
    config(path: string): A_SERVER_TYPES__RoutesConfig | undefined {
        

        return this._configs.find(route => route.route.toRegExp().test(path));
    }
}