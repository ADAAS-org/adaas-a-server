"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Response = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Response_entity_types_1 = require("./A-Response.entity.types");
const A_ServerError_class_1 = require("../../components/A-ServerError/A-ServerError.class");
const a_utils_1 = require("@adaas/a-utils");
class A_Response extends a_concept_1.A_Entity {
    constructor() {
        super(...arguments);
        /**
         * Duration of the request in milliseconds
         */
        this.duration = 0;
        this.data = new Map();
    }
    fromNew(newEntity) {
        this.res = newEntity.response;
        this.aseid = new a_concept_1.ASEID({
            concept: a_concept_1.A_Context.root.name,
            scope: newEntity.scope,
            entity: this.constructor.entity,
            id: newEntity.id
        });
    }
    get headersSent() {
        return this.res.headersSent;
    }
    get original() {
        return this.res;
    }
    get statusCode() {
        return this.res.statusCode;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            this.res.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                const elapsedTime = process.hrtime(startTime);
                const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;
                this.duration = elapsedMilliseconds;
                yield this.call(A_Response_entity_types_1.A_SERVER_TYPES__ResponseEvent.Finish);
            }));
            this.res.on('close', () => __awaiter(this, void 0, void 0, function* () {
                yield this.call(A_Response_entity_types_1.A_SERVER_TYPES__ResponseEvent.Close);
            }));
        });
    }
    failed(error) {
        switch (true) {
            case error instanceof A_ServerError_class_1.A_ServerError:
                this.error = error;
                break;
            case error instanceof a_concept_1.A_Error:
                this.error = new A_ServerError_class_1.A_ServerError(error);
                break;
            default:
                this.error = new A_ServerError_class_1.A_ServerError(error);
                break;
        }
        return this.status(this.error.status).json(this.error);
    }
    // Send a plain text or JSON response
    send(data = this.toResponse()) {
        const logger = a_concept_1.A_Context.scope(this).resolve(a_utils_1.A_Logger);
        if (this.headersSent) {
            logger.warning('Response headers already sent, cannot send response again.');
            return;
        }
        try {
            switch (true) {
                case !!data && typeof data === 'object':
                    return this.json(data);
                case !!data && typeof data === 'string':
                    this.res.setHeader('Content-Type', 'text/plain');
                    this.res.writeHead(this.statusCode);
                    this.res.end(data);
                    return;
                default:
                    this.res.writeHead(this.statusCode);
                    this.res.end(data);
                    return;
            }
        }
        catch (error) {
            logger.warning('Response send error:', error);
        }
    }
    destroy(error, scope) {
        this.res.end();
        return super.destroy(scope);
    }
    // Explicit JSON response
    json(data = this.toResponse()) {
        const logger = a_concept_1.A_Context.scope(this).resolve(a_utils_1.A_Logger);
        if (this.headersSent) {
            logger.warning('Response headers already sent, cannot send response again.');
            return;
        }
        this.res.setHeader('Content-Type', 'application/json');
        this.res.writeHead(this.statusCode);
        this.res.end(JSON.stringify(data));
    }
    // Set HTTP status code
    status(code) {
        this.res.statusCode = code;
        return this;
    }
    writeHead(statusCode, headers) {
        this.res.writeHead(statusCode, headers);
    }
    setHeader(key, value) {
        this.res.setHeader(key, value);
    }
    getHeader(key) {
        return this.res.getHeader(key);
    }
    add(key, data) {
        this.data.set(key, data);
    }
    toResponse() {
        return Array.from(this.data.entries()).reduce((acc, [key, value]) => {
            if (value instanceof a_concept_1.A_Entity)
                acc[key] = value.toJSON();
            else
                acc[key] = value;
            return acc;
        }, {});
    }
}
exports.A_Response = A_Response;
//# sourceMappingURL=A-Response.entity.js.map