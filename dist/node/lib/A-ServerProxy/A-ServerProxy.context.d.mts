import { A_Fragment } from '@adaas/a-concept';
import { A_SERVER_TYPES__RoutesConfig, A_SERVER_TYPES__ProxyConfigConstructor } from './A-ServerProxy.types.mjs';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_ProxyConfig extends A_Fragment {
    protected readonly _configs: Array<A_SERVER_TYPES__RoutesConfig>;
    constructor(
    /**
     * Setup proxy configs, where key is the path to match, and value is either a full URL or a partial config object
     */
    configs?: A_SERVER_TYPES__ProxyConfigConstructor);
    /**
     * Returns all configured proxy configs
     *
     */
    get configs(): Array<A_SERVER_TYPES__RoutesConfig>;
    /**
     * Checks if a given path is configured in the proxy
     *
     * @param path
     * @returns
     */
    has(path: string): boolean;
    /**
     * Returns the proxy configuration for a given path, if exists
     *
     * @param path
     * @returns
     */
    config(path: string): A_SERVER_TYPES__RoutesConfig | undefined;
}

export { A_ProxyConfig };
