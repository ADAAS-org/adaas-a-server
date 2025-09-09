"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_StaticLoader = void 0;
const a_concept_1 = require("@adaas/a-concept");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
const A_Server_container_types_1 = require("../../containers/A-Server/A-Server.container.types");
class A_StaticLoader extends a_concept_1.A_Component {
    // =======================================================
    // ================ Method Definition=====================
    // =======================================================
    onRequest(req, res, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                return; // Only handle GET and HEAD requests
            }
            const staticDir = path_1.default.resolve(process.cwd(), 'public');
            if (!fs_1.default.existsSync(staticDir) || !fs_1.default.statSync(staticDir).isDirectory()) {
                logger.log("red", `Static directory ${staticDir} does not exist or is not a directory.`);
                return;
            }
            const filePath = this.safeFilePath(staticDir, req.url || "/", req.headers.host);
            yield this.serveFile(filePath, res);
        });
    }
    getMimeType(ext) {
        const mimeTypes = {
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
    safeFilePath(staticDir, reqUrl, host) {
        const parsedUrl = new url_1.URL(reqUrl || "/", `http://${host || "localhost"}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);
        // Prevent path traversal attacks
        pathname = pathname.replace(/\.\.[\/\\]/g, "");
        let filePath = path_1.default.join(staticDir, pathname);
        if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isDirectory()) {
            filePath = path_1.default.join(filePath, "index.html");
        }
        return filePath;
    }
    serveFile(filePath, res) {
        return new Promise((resolve, reject) => {
            if (fs_1.default.existsSync(filePath)) {
                const ext = path_1.default.extname(filePath);
                const contentType = this.getMimeType(ext);
                res.writeHead(200, { "Content-Type": contentType });
                const stream = fs_1.default.createReadStream(filePath);
                stream.pipe(res.original);
                stream.on('end', () => {
                    resolve();
                });
                stream.on("error", (err) => {
                    reject(new Error(`File stream error: ${err.message}`));
                });
            }
            else {
                reject(new Error(`File not found: ${filePath}`));
            }
            resolve();
        });
    }
}
exports.A_StaticLoader = A_StaticLoader;
__decorate([
    a_concept_1.A_Feature.Extend({
        name: A_Server_container_types_1.A_SERVER_TYPES__ServerFeature.onRequest,
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Logger))
], A_StaticLoader.prototype, "onRequest", null);
//# sourceMappingURL=A-StaticLoader.component.types.js.map