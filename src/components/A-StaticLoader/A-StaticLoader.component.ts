import { A_Component, A_Concept, A_Feature, A_Inject } from "@adaas/a-concept"
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Service/A-Service.container.types";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";
import { A_StaticConfig, A_StaticAlias } from "@adaas/a-server/context/A-StaticConfig/A-StaticConfig.context";
import { A_Logger, A_Polyfill } from "@adaas/a-utils";

export class A_StaticLoader extends A_Component {

    private _fsPolyfill: any;
    private _pathPolyfill: any;

    @A_Concept.Load()
    async load(
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_StaticConfig) config: A_StaticConfig,
        @A_Inject(A_Polyfill) polyfill: A_Polyfill
    ) {
        // Initialize polyfills
        this._fsPolyfill = await polyfill.fs();
        this._pathPolyfill = await polyfill.path();

        // Log configured aliases
        const aliases = config.getEnabledAliases();
        logger.log(
            'pink',
            `Static aliases configured:`,
            aliases.map(alias => `${alias.alias} -> ${alias.directory}`).join('\n')
        );
    }


    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.onRequest,
    })
    async onRequest(
        @A_Inject(A_Request) req: A_Request,
        @A_Inject(A_Response) res: A_Response,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_StaticConfig) config: A_StaticConfig,
        @A_Inject(A_Polyfill) polyfill: A_Polyfill
    ) {

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return; // Only handle GET and HEAD requests
        }

        const { method, url } = req;
        const route = new A_Route(url, method);

        // Check if this request matches any of our configured aliases
        const alias = config.findMatchingAlias(route.path);
        if (!alias) {
            return; // No static config for this path
        }

        try {
            // Ensure polyfills are available
            const fs = this._fsPolyfill || await polyfill.fs();
            const path = this._pathPolyfill || await polyfill.path();

            const staticDir = path.resolve(process.cwd(), alias.directory);

            // Validate static directory exists
            if (!fs.existsSync(staticDir)) {
                logger.log("red", `Static directory ${staticDir} does not exist.`);
                return;
            }

            // Get the file path relative to the alias
            const relativePath = route.path.replace(alias.path, '');
            const safePath = this.safeFilePath(staticDir, relativePath, req.headers?.host, path, fs);
            
            await this.serveFile(safePath, res, logger, fs, path);
        } catch (error: any) {
            logger.error(`Static file serving error: ${error.message}`);
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.send("File not found");
        }
    }

    /**
     * Add a custom static file alias through the config
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    public addAlias(
        alias: string, 
        directory: string, 
        config: A_StaticConfig, 
        logger?: A_Logger, 
        path?: string
    ): void {
        config.addAlias(alias, directory, path);
        
        if (logger) {
            logger.log('cyan', `Static alias added: ${alias} -> ${directory}`);
        }
    }

    /**
     * Remove a static file alias through the config
     * @param aliasPath - The path of the alias to remove
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    public removeAlias(aliasPath: string, config: A_StaticConfig, logger?: A_Logger): boolean {
        const removed = config.removeAlias(aliasPath);
        
        if (removed && logger) {
            logger.log('yellow', `Static alias removed: ${aliasPath}`);
        }
        
        return removed;
    }

    /**
     * Get all configured aliases from config
     * @param config - Static config instance
     */
    public getAliases(config: A_StaticConfig): A_StaticAlias[] {
        return config.getAliases();
    }

    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    public setAliasEnabled(
        aliasPath: string, 
        enabled: boolean, 
        config: A_StaticConfig, 
        logger?: A_Logger
    ): boolean {
        const result = config.setAliasEnabled(aliasPath, enabled);
        
        if (result && logger) {
            logger.log('blue', `Static alias ${enabled ? 'enabled' : 'disabled'}: ${aliasPath}`);
        }
        
        return result;
    }

    protected getMimeType(ext: string): string {
        const mimeTypes: Record<string, string> = {
            // Text
            ".html": "text/html",
            ".htm": "text/html",
            ".css": "text/css",
            ".txt": "text/plain",
            ".md": "text/markdown",
            ".xml": "application/xml",
            
            // JavaScript
            ".js": "application/javascript",
            ".mjs": "application/javascript",
            ".jsx": "application/javascript",
            ".ts": "application/typescript",
            ".tsx": "application/typescript",
            
            // JSON
            ".json": "application/json",
            ".jsonld": "application/ld+json",
            
            // Images
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".webp": "image/webp",
            ".bmp": "image/bmp",
            ".tiff": "image/tiff",
            
            // Fonts
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
            ".otf": "font/otf",
            ".eot": "application/vnd.ms-fontobject",
            
            // Audio/Video
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".ogg": "application/ogg",
            
            // Archives
            ".zip": "application/zip",
            ".tar": "application/x-tar",
            ".gz": "application/gzip",
            
            // Documents
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls": "application/vnd.ms-excel",
            ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };

        return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
    }


    protected safeFilePath(staticDir: string, reqUrl: string, host: string = 'localhost', pathPolyfill: any, fsPolyfill: any): string {
        const parsedUrl = new URL(reqUrl || "/", `http://${host}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Prevent path traversal attacks
        pathname = pathname.replace(/\.\.[\/\\]/g, "");

        let filePath = pathPolyfill.join(staticDir, pathname);
        
        if (!fsPolyfill.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        return filePath;
    }

    protected serveFile(
        filePath: string, 
        res: A_Response, 
        logger: A_Logger, 
        fsPolyfill: any, 
        pathPolyfill: any
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                if (fsPolyfill.existsSync(filePath)) {
                    const ext = pathPolyfill.extname(filePath);
                    const contentType = this.getMimeType(ext);

                    // Set appropriate headers
                    const headers: Record<string, string> = {
                        "Content-Type": contentType,
                        "Cache-Control": this.getCacheControl(ext),
                        "X-Content-Type-Options": "nosniff"
                    };

                    res.writeHead(200, headers);
                    const stream = fsPolyfill.createReadStream(filePath);
                    
                    if (stream && res.original) {
                        stream.pipe(res.original);

                        stream.on('end', () => {
                            logger.log('green', `Successfully served: ${filePath}`);
                            resolve();
                        });

                        stream.on("error", (err: any) => {
                            logger.error(`File stream error: ${err.message}`);
                            reject(new Error(`File stream error: ${err.message}`));
                        });
                    } else {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.send("Internal server error");
                        reject(new Error("Failed to create file stream"));
                    }
                } else {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.send("File not found");
                    reject(new Error(`File not found: ${filePath}`));
                }
            } catch (error: any) {
                logger.error(`Error serving file: ${error.message}`);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.send("Internal server error");
                reject(error);
            }
        });
    }

    protected getCacheControl(ext: string): string {
        // Different cache strategies for different file types
        const staticAssets = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf'];
        const dynamicContent = ['.html', '.htm'];
        
        if (staticAssets.includes(ext.toLowerCase())) {
            return "public, max-age=31536000"; // 1 year for static assets
        } else if (dynamicContent.includes(ext.toLowerCase())) {
            return "public, max-age=3600"; // 1 hour for HTML
        } else {
            return "public, max-age=86400"; // 1 day for other files
        }
    }

}


