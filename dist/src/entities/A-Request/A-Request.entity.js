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
exports.A_Request = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Request_entity_types_1 = require("./A-Request.entity.types");
const A_Route_entity_1 = require("../A-Route/A-Route.entity");
const A_ServerError_class_1 = require("../../components/A-ServerError/A-ServerError.class");
class A_Request extends a_concept_1.A_Entity {
    constructor() {
        super(...arguments);
        this.body = {};
        this.params = {};
        this.query = {};
        /**
         * Duration of the request in milliseconds
         */
        this.duration = 0;
    }
    static get namespace() {
        return 'a-server';
    }
    fromNew(newEntity) {
        this.req = newEntity.request;
        this.aseid = new a_concept_1.ASEID({
            concept: a_concept_1.A_Context.root.name,
            scope: newEntity.scope,
            entity: this.constructor.entity,
            id: newEntity.id
        });
    }
    get startedAt() {
        const timeId = a_concept_1.A_IdentityHelper.parseTimeId(this.aseid.id.split('-')[0]);
        return timeId ? new Date(timeId.timestamp) : undefined;
    }
    // Getter for request URL
    get url() {
        return this.req.url;
    }
    // Getter for request method
    get method() {
        return String(this.req.method).toUpperCase() || 'DEFAULT';
    }
    get headers() {
        return this.req.headers;
    }
    get route() {
        return new A_Route_entity_1.A_Route(this.url, this.method);
    }
    pipe(destination, options) {
        return this.req.pipe(destination, options);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.req.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                this.error = new A_ServerError_class_1.A_ServerError(err);
                yield this.call(A_Request_entity_types_1.A_SERVER_TYPES__RequestEvent.Error);
            }));
            this.params = this.extractParams(this.url);
            this.query = this.extractQuery(this.url);
        });
    }
    extractParams(url) {
        // Remove query string (anything after ?)
        const cleanUrl = url.split('?')[0];
        const urlSegments = cleanUrl.split('/').filter(Boolean);
        const maskSegments = this.url.split('/').filter(Boolean);
        const params = {};
        for (let i = 0; i < maskSegments.length; i++) {
            const maskSegment = maskSegments[i];
            const urlSegment = urlSegments[i];
            if (maskSegment.startsWith(':')) {
                const paramName = maskSegment.slice(1); // Remove ':' from mask
                params[paramName] = urlSegment;
            }
            else if (maskSegment !== urlSegment) {
                // If static segments don’t match → fail
                return {};
            }
        }
        return params;
    }
    extractQuery(url) {
        const query = {};
        // Take only the part after "?"
        const queryString = url.split('?')[1];
        if (!queryString)
            return query;
        // Remove fragment (#...) if present
        const cleanQuery = queryString.split('#')[0];
        // Split into key=value pairs
        for (const pair of cleanQuery.split('&')) {
            if (!pair)
                continue;
            const [key, value = ''] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value);
        }
        return query;
    }
    parseBody() {
        return new Promise((resolve, reject) => {
            let body = '';
            this.req.on('data', chunk => body += chunk);
            this.req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (err) {
                    reject(err);
                }
            });
            this.req.on('error', reject);
        });
    }
}
exports.A_Request = A_Request;
//# sourceMappingURL=A-Request.entity.js.map