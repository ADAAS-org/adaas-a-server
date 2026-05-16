import { A_Component } from '@adaas/a-concept';
import { A as A_Request } from '../../A-Request.entity-8_9MCXT2.js';
import { A as A_Response } from '../../A-Response.entity-bjh6bofZ.js';
import { A_StaticConfig, A_StaticAlias } from './A-ServerStatic.context.js';
import { A_HttpServerFeatures } from '../A-Server/A-HttpServer.constants.js';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import 'http';
import '../A-Server/A-HttpServer.error.js';
import '../A-Server/A-HttpServer.types.js';
import '../A-Request/A-Request.constants.js';
import '../A-Request/A-Request.env.js';
import '../A-Request/A-HttpServerRequest.context.js';
import '@adaas/a-utils/a-operation';
import '../A-Request/A-HttpRequestData.context.js';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import '../A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.js';
import '../A-ServerRoute/A-ServerRoute.constants.js';
import 'stream';
import '../A-Response/A-Response.constants.js';

declare class A_StaticLoader extends A_Component {
    private _fsPolyfill;
    private _pathPolyfill;
    load(logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
    [A_HttpServerFeatures.onRequest](req: A_Request, res: A_Response, logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
    /**
     * Add a custom static file alias through the config
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    addAlias(alias: string, directory: string, config: A_StaticConfig, logger?: A_Logger, path?: string): void;
    /**
     * Remove a static file alias through the config
     * @param aliasPath - The path of the alias to remove
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    removeAlias(aliasPath: string, config: A_StaticConfig, logger?: A_Logger): boolean;
    /**
     * Get all configured aliases from config
     * @param config - Static config instance
     */
    getAliases(config: A_StaticConfig): A_StaticAlias[];
    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    setAliasEnabled(aliasPath: string, enabled: boolean, config: A_StaticConfig, logger?: A_Logger): boolean;
    protected getMimeType(ext: string): string;
    protected safeFilePath(staticDir: string, reqUrl: string, host: string | undefined, pathPolyfill: any, fsPolyfill: any): string;
    protected serveFile(filePath: string, res: A_Response, logger: A_Logger, fsPolyfill: any, pathPolyfill: any): Promise<void>;
    protected getCacheControl(ext: string): string;
}

export { A_StaticLoader };
