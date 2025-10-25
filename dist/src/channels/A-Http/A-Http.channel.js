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
exports.A_HTTPChannel = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Service_container_types_1 = require("../../containers/A-Service/A-Service.container.types");
const A_HttpChannel_context_1 = require("../../context/A-HttpChannel/A-HttpChannel.context");
const A_Http_channel_constants_1 = require("./A-Http.channel.constants");
const A_ServerError_class_1 = require("../../components/A-ServerError/A-ServerError.class");
const a_utils_1 = require("@adaas/a-utils");
const A_Http_channel_error_1 = require("./A-Http.channel.error");
class A_HTTPChannel extends a_utils_1.A_Channel {
    /**
     * Allows to send an HTTP request without expecting a response
     *
     * @param params
     */
    send(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.request(params);
        });
    }
    /**
     * Makes an HTTP request
     *
     * @param params
     * @returns
     */
    request(
    /**
     * Provide request parameters
     */
    params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { method, url, data, config } = params;
            yield this.initialize;
            this._processing = true;
            const fullUrl = this.buildURL(url, config === null || config === void 0 ? void 0 : config.params);
            const requestScope = new a_concept_1.A_Scope({ name: `a-http-channel-request-scope-${method}-${url}-${Date.now()}` });
            const context = new A_HttpChannel_context_1.A_HTTPChannel_RequestContext({
                method,
                url,
                data,
                config
            });
            requestScope.inherit(a_concept_1.A_Context.scope(this));
            requestScope.register(context);
            try {
                yield this.call(A_Http_channel_constants_1.A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onBeforeRequest, requestScope);
                const headers = Object.assign({ "Content-Type": "application/json" }, config === null || config === void 0 ? void 0 : config.headers);
                const options = {
                    method,
                    headers,
                };
                if (data && method !== A_Service_container_types_1.A_SERVER_TYPES__ServerMethod.GET) {
                    options.body = JSON.stringify(data);
                }
                const response = yield fetch(fullUrl, options);
                if (!response.ok) {
                    throw new A_ServerError_class_1.A_ServerError({
                        status: response.status,
                        title: response.statusText,
                        description: `HTTP request to ${fullUrl} failed with status ${response.status}`,
                    });
                }
                context.result =
                    ((_a = config === null || config === void 0 ? void 0 : config.params) === null || _a === void 0 ? void 0 : _a.responseType) === "text"
                        ? yield response.text()
                        : ((_b = config === null || config === void 0 ? void 0 : config.params) === null || _b === void 0 ? void 0 : _b.responseType) === "blob"
                            ? yield response.blob()
                            : yield response.json();
                yield this.call(A_Http_channel_constants_1.A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onAfterRequest, requestScope);
                this._processing = false;
                return context;
            }
            catch (error) {
                this._processing = false;
                context.error = error;
                yield this.call(A_Http_channel_constants_1.A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle.onError, requestScope);
                if ((config === null || config === void 0 ? void 0 : config.throwOnError) === false)
                    return context;
                else
                    throw error;
            }
        });
    }
    post(url, body, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                method: A_Service_container_types_1.A_SERVER_TYPES__ServerMethod.POST,
                url,
                data: body,
                config,
            });
        });
    }
    get(url, params, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                method: A_Service_container_types_1.A_SERVER_TYPES__ServerMethod.GET,
                url,
                config: Object.assign(Object.assign({}, config), { params })
            });
        });
    }
    put(url, body, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                method: A_Service_container_types_1.A_SERVER_TYPES__ServerMethod.PUT,
                url,
                data: body,
                config,
            });
        });
    }
    delete(url, params, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                method: A_Service_container_types_1.A_SERVER_TYPES__ServerMethod.DELETE,
                url,
                data: params,
                config,
            });
        });
    }
    buildURL(path = '', params = {}) {
        if (!this.baseUrl)
            throw new A_Http_channel_error_1.A_HTTPChannelError(A_Http_channel_error_1.A_HTTPChannelError.HttpRequestError, "Base URL is not set for HTTP Channel");
        const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    }
}
exports.A_HTTPChannel = A_HTTPChannel;
//# sourceMappingURL=A-Http.channel.js.map