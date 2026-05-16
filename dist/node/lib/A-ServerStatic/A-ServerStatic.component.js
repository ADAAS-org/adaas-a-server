'use strict';

var aConcept = require('@adaas/a-concept');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServerStatic_context = require('./A-ServerStatic.context');
var AHttpServer_constants = require('@adaas/a-server/server/A-HttpServer.constants');
var AHttpServer_error = require('@adaas/a-server/server/A-HttpServer.error');
var aLogger = require('@adaas/a-utils/a-logger');
var aPolyfill = require('@adaas/a-utils/a-polyfill');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var _a;
class A_StaticLoader extends aConcept.A_Component {
  async load(logger, config, polyfill) {
    this._fsPolyfill = await polyfill.fs();
    this._pathPolyfill = await polyfill.path();
    const aliases = config.getEnabledAliases();
    logger.info(
      "cyan",
      `Static aliases configured:`,
      ...aliases.map((alias) => `${alias.alias} -> ${alias.directory}`)
    );
  }
  async [_a = AHttpServer_constants.A_HttpServerFeatures.onRequest](req, res, logger, config, polyfill) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return;
    }
    const { method, url } = req;
    const route = new AServerRoute_entity.A_ServerRoute(url, method);
    const alias = config.findMatchingAlias(route.path);
    if (!alias) {
      return;
    }
    try {
      const fs = this._fsPolyfill || await polyfill.fs();
      const path = this._pathPolyfill || await polyfill.path();
      const staticDir = path.resolve(process.cwd(), alias.directory);
      if (!fs.existsSync(staticDir)) {
        logger.log("red", `Static directory ${staticDir} does not exist.`);
        return;
      }
      const relativePath = route.path.replace(alias.path, "");
      const safePath = this.safeFilePath(staticDir, relativePath, req.headers?.host, path, fs);
      await this.serveFile(safePath, res, logger, fs, path);
      logger.log("green", `Successfully served: ${safePath}`);
    } catch (error) {
      throw new AHttpServer_error.A_HttpServerError({
        status: 500,
        title: "Static File Serving Error",
        description: `Error serving static file for ${route.path}: ${error.message}`,
        originalError: error
      });
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
  addAlias(alias, directory, config, logger, path) {
    config.addAlias(alias, directory, path);
    if (logger) {
      logger.log("cyan", `Static alias added: ${alias} -> ${directory}`);
    }
  }
  /**
   * Remove a static file alias through the config
   * @param aliasPath - The path of the alias to remove
   * @param config - Static config instance
   * @param logger - Logger instance for logging
   */
  removeAlias(aliasPath, config, logger) {
    const removed = config.removeAlias(aliasPath);
    if (removed && logger) {
      logger.log("yellow", `Static alias removed: ${aliasPath}`);
    }
    return removed;
  }
  /**
   * Get all configured aliases from config
   * @param config - Static config instance
   */
  getAliases(config) {
    return config.getAliases();
  }
  /**
   * Enable or disable an alias
   * @param aliasPath - The path of the alias
   * @param enabled - Whether to enable or disable
   * @param config - Static config instance
   * @param logger - Logger instance for logging
   */
  setAliasEnabled(aliasPath, enabled, config, logger) {
    const result = config.setAliasEnabled(aliasPath, enabled);
    if (result && logger) {
      logger.log("blue", `Static alias ${enabled ? "enabled" : "disabled"}: ${aliasPath}`);
    }
    return result;
  }
  getMimeType(ext) {
    const mimeTypes = {
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
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }
  safeFilePath(staticDir, reqUrl, host = "localhost", pathPolyfill, fsPolyfill) {
    const parsedUrl = new URL(reqUrl || "/", `http://${host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    pathname = pathname.replace(/\.\.[\/\\]/g, "");
    let filePath = pathPolyfill.join(staticDir, pathname);
    if (!fsPolyfill.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return filePath;
  }
  serveFile(filePath, res, logger, fsPolyfill, pathPolyfill) {
    return new Promise((resolve, reject) => {
      try {
        if (fsPolyfill.existsSync(filePath)) {
          const ext = pathPolyfill.extname(filePath);
          const contentType = this.getMimeType(ext);
          const headers = {
            "Content-Type": contentType,
            "Cache-Control": this.getCacheControl(ext),
            "X-Content-Type-Options": "nosniff"
          };
          res.writeHead(200, headers);
          const stream = fsPolyfill.createReadStream(filePath);
          if (stream && res.original) {
            stream.pipe(res.original);
            stream.on("end", () => {
              resolve();
            });
            stream.on("error", (err) => {
              reject(new AHttpServer_error.A_HttpServerError({
                status: 500,
                title: "File Stream Error",
                description: `Error reading file stream for ${filePath}: ${err.message}`,
                originalError: err
              }));
            });
          } else {
            reject(new AHttpServer_error.A_HttpServerError({
              status: 500,
              title: "Response Stream Error",
              description: `Unable to pipe file stream for ${filePath}`
            }));
          }
        } else {
          reject(new AHttpServer_error.A_HttpServerError({
            status: 404,
            title: "File Not Found",
            description: `File not found: ${filePath}`
          }));
        }
      } catch (error) {
        logger.error(`Error serving file: ${error.message}`);
        reject(new AHttpServer_error.A_HttpServerError({
          status: 500,
          title: "Internal Server Error",
          description: `Error serving file: ${error.message}`,
          originalError: error
        }));
      }
    });
  }
  getCacheControl(ext) {
    const staticAssets = [".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".otf"];
    const dynamicContent = [".html", ".htm"];
    if (staticAssets.includes(ext.toLowerCase())) {
      return "public, max-age=31536000";
    } else if (dynamicContent.includes(ext.toLowerCase())) {
      return "public, max-age=3600";
    } else {
      return "public, max-age=86400";
    }
  }
}
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(1, aConcept.A_Inject(AServerStatic_context.A_StaticConfig)),
  __decorateParam(2, aConcept.A_Inject(aPolyfill.A_Polyfill))
], A_StaticLoader.prototype, "load");
__decorateClass([
  aConcept.A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(3, aConcept.A_Inject(AServerStatic_context.A_StaticConfig)),
  __decorateParam(4, aConcept.A_Inject(aPolyfill.A_Polyfill))
], A_StaticLoader.prototype, _a);

exports.A_StaticLoader = A_StaticLoader;
//# sourceMappingURL=A-ServerStatic.component.js.map
//# sourceMappingURL=A-ServerStatic.component.js.map