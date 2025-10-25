import { A_Component, A_Concept, A_Feature, A_Inject } from "@adaas/a-concept"
import fs from "fs";
import path from "path";
import { URL } from "url";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Service/A-Service.container.types";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";
import { A_StaticConfig } from "@adaas/a-server/context/A-StaticConfig/A-StaticConfig.context";
import { A_Logger } from "@adaas/a-utils";


export class A_StaticLoader extends A_Component {


    @A_Concept.Load()
    async load(
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_StaticConfig) config: A_StaticConfig
    ) {
        logger.log(
            'pink',
            `Static directories configured:`,
            config.directories.join('\n')
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
        @A_Inject(A_StaticConfig) config: A_StaticConfig
    ) {

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return; // Only handle GET and HEAD requests
        }

        const { method, url } = req;
        const route = new A_Route(url, method);

        const staticDirConfig = config.has(route.path)

        if (!staticDirConfig) {
            return; // No static config for this path
        }

        const staticDir = path.resolve(process.cwd(), staticDirConfig);

        if (!fs.existsSync(staticDir) || !fs.statSync(staticDir).isDirectory()) {
            logger.log("red", `Static directory ${staticDir} does not exist or is not a directory.`);
            return;
        }

        await this.serveFile(route.path.startsWith('/') ? route.path.slice(1) : route.path, res);
    }



    protected getMimeType(ext: string): string {
        const mimeTypes: Record<string, string> = {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".txt": "text/plain",
        };

        return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
    }


    protected safeFilePath(staticDir: string, reqUrl: string, host?: string): string {
        const parsedUrl = new URL(reqUrl || "/", `http://${host || "localhost"}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Prevent path traversal attacks
        pathname = pathname.replace(/\.\.[\/\\]/g, "");

        let filePath = path.join(staticDir, pathname);
        if (!fs.existsSync(filePath))
            throw new Error(`File not found: ${filePath}`);

        return filePath;
    }


    protected serveFile(filePath: string, res: A_Response): Promise<void> {


        return new Promise<void>((resolve, reject) => {

            if (fs.existsSync(filePath)) {
                const ext = path.extname(filePath);
                const contentType = this.getMimeType(ext);

                res.writeHead(200, { "Content-Type": contentType });
                const stream = fs.createReadStream(filePath);
                stream.pipe(res.original);

                stream.on('end', () => {
                    resolve();
                });

                stream.on("error", (err) => {
                    reject(new Error(`File stream error: ${err.message}`));
                });
            } else {
                reject(new Error(`File not found: ${filePath}`));
            }


            resolve();
        });
    }

}


