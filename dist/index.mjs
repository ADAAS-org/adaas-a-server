import { A_Feature, A_Inject, A_Container, A_Scope, A_Error, A_IdentityHelper, A_Concept, A_Caller, A_Entity, ASEID, A_Context, A_Fragment, A_Component, A_Feature_Define, A_Feature_Extend, A_TypeGuards } from '@adaas/a-concept';
import { A_Polyfill, A_Config, A_Logger, A_Channel, A_Manifest } from '@adaas/a-utils';
import { A_TYPES__EntityFeatures } from '@adaas/a-concept/dist/src/global/A-Entity/A-Entity.constants';

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

// src/containers/A-Service/A-Service.container.types.ts
var A_SERVER_TYPES__ServerFeature = /* @__PURE__ */ ((A_SERVER_TYPES__ServerFeature2) => {
  A_SERVER_TYPES__ServerFeature2["beforeStart"] = "beforeStart";
  A_SERVER_TYPES__ServerFeature2["afterStart"] = "afterStart";
  A_SERVER_TYPES__ServerFeature2["beforeStop"] = "beforeStop";
  A_SERVER_TYPES__ServerFeature2["afterStop"] = "afterStop";
  A_SERVER_TYPES__ServerFeature2["beforeRequest"] = "beforeRequest";
  A_SERVER_TYPES__ServerFeature2["onRequest"] = "onRequest";
  A_SERVER_TYPES__ServerFeature2["afterRequest"] = "afterRequest";
  return A_SERVER_TYPES__ServerFeature2;
})(A_SERVER_TYPES__ServerFeature || {});
var A_SERVER_TYPES__ServerMethod = /* @__PURE__ */ ((A_SERVER_TYPES__ServerMethod2) => {
  A_SERVER_TYPES__ServerMethod2["GET"] = "GET";
  A_SERVER_TYPES__ServerMethod2["POST"] = "POST";
  A_SERVER_TYPES__ServerMethod2["PUT"] = "PUT";
  A_SERVER_TYPES__ServerMethod2["DELETE"] = "DELETE";
  A_SERVER_TYPES__ServerMethod2["PATCH"] = "PATCH";
  A_SERVER_TYPES__ServerMethod2["OPTIONS"] = "OPTIONS";
  A_SERVER_TYPES__ServerMethod2["HEAD"] = "HEAD";
  A_SERVER_TYPES__ServerMethod2["CONNECT"] = "CONNECT";
  A_SERVER_TYPES__ServerMethod2["TRACE"] = "TRACE";
  A_SERVER_TYPES__ServerMethod2["DEFAULT"] = "DEFAULT";
  return A_SERVER_TYPES__ServerMethod2;
})(A_SERVER_TYPES__ServerMethod || {});
var A_HTTPChannel_RequestContext = class extends A_Fragment {
  constructor(params) {
    super();
    const {
      method,
      url,
      data,
      config
    } = params;
    this.url = url;
    this.method = method;
    this.data = data;
    this.config = config;
  }
};

// src/channels/A-Http/A-Http.channel.constants.ts
var A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle = /* @__PURE__ */ ((A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle2) => {
  A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle2["onAfterRequest"] = "onAfterHttpChannelRequest";
  A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle2["onError"] = "onHttpChannelError";
  A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle2["onBeforeRequest"] = "onBeforeHttpChannelRequest";
  return A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle2;
})(A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle || {});
var A_ServerError = class extends A_Error {
  constructor() {
    super(...arguments);
    this.status = 500;
  }
  // constructor(
  //     /**
  //      * A_Error Constructor params
  //      */
  //     params: A_SERVER_TYPES__ServerError_Init
  // )
  // constructor(
  //     /**
  //      * HTTP Status Code of the error
  //      */
  //     status: number,
  //     /**
  //      * Error message
  //      */
  //     message: string
  // )
  // constructor(
  //     /**
  //      * Original JS Error
  //      */
  //     error: Error
  // )
  // constructor(
  //     /**
  //      * HTTP Status Code of the error
  //      */
  //     status: number,
  //     /**
  //      * Error message
  //      */
  //     title: string,
  //     /**
  //      * Detailed description of the error
  //      */
  //     description: string
  // )
  // constructor(
  //     param1: A_SERVER_TYPES__ServerError_Init | Error | string | A_Error | number,
  //     param2?: string | A_Error,
  //     param3?: string
  // ) {
  //   switch (true) {
  //     case typeof param1 === 'number':
  //         if (typeof param2 === 'string' && param3) {
  //             super({
  //                 title: param2,
  //                 description: param3
  //             });
  //         }
  //         else if (param2 instanceof A_Error) {
  //             super(param2);
  //         }
  //         else {
  //             super();
  //         }
  //         this.status = param1;
  //         break;
  //     case param1 instanceof A_Error:
  //         super (param1);
  //         break;
  //     case param1 instanceof Error:
  //         super (param1);
  //         break;
  //     default:
  //         break;
  //   }
  // }
  fromConstructor(params) {
    super.fromConstructor(params);
    if (params.status) {
      this.status = params.status;
    }
  }
  toJSON() {
    return {
      ...super.toJSON(),
      status: this.status
    };
  }
};
var A_HTTPChannelError = class extends A_Error {
};
A_HTTPChannelError.HttpRequestError = "HTTP Channel Request Error";

// src/channels/A-Http/A-Http.channel.ts
var A_HTTPChannel = class extends A_Channel {
  async connect() {
    return;
  }
  /**
   * Allows to send an HTTP request without expecting a response
   * 
   * @param params 
   */
  async send(params) {
    this.request(params);
  }
  /**
   * Makes an HTTP request
   * 
   * @param params 
   * @returns 
   */
  async request(params) {
    const { method, url, data, config } = params;
    await this.initialize;
    this._processing = true;
    const fullUrl = this.buildURL(url, config?.params);
    const requestScope = new A_Scope({ name: `a-http-channel-request-scope-${method}-${url}-${Date.now()}` });
    const context = new A_HTTPChannel_RequestContext({
      method,
      url,
      data,
      config
    });
    requestScope.inherit(A_Context.scope(this));
    requestScope.register(context);
    try {
      await this.call("onBeforeHttpChannelRequest" /* onBeforeRequest */, requestScope);
      const headers = {
        "Content-Type": "application/json",
        ...config?.headers
      };
      const options = {
        method,
        headers
      };
      if (data && method !== "GET" /* GET */) {
        options.body = JSON.stringify(data);
      }
      const response = await fetch(fullUrl, options);
      if (!response.ok) {
        throw new A_ServerError({
          status: response.status,
          title: response.statusText,
          description: `HTTP request to ${fullUrl} failed with status ${response.status}`
        });
      }
      context.result = config?.params?.responseType === "text" ? await response.text() : config?.params?.responseType === "blob" ? await response.blob() : await response.json();
      await this.call("onAfterHttpChannelRequest" /* onAfterRequest */, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      context.error = error;
      await this.call("onHttpChannelError" /* onError */, requestScope);
      if (config?.throwOnError === false)
        return context;
      else
        throw error;
    }
  }
  async post(url, body, config) {
    return this.request(
      {
        method: "POST" /* POST */,
        url,
        data: body,
        config
      }
    );
  }
  async get(url, params, config) {
    return this.request(
      {
        method: "GET" /* GET */,
        url,
        config: {
          ...config,
          params
        }
      }
    );
  }
  async put(url, body, config) {
    return this.request({
      method: "PUT" /* PUT */,
      url,
      data: body,
      config
    });
  }
  async delete(url, params, config) {
    return this.request({
      method: "DELETE" /* DELETE */,
      url,
      data: params,
      config
    });
  }
  buildURL(path = "", params = {}) {
    if (!this.baseUrl)
      throw new A_HTTPChannelError(
        A_HTTPChannelError.HttpRequestError,
        "Base URL is not set for HTTP Channel"
      );
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }
};

// src/constants/env.constants.ts
var A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES = {
  // ----------------------------------------------------------
  // A-Server Environment Variables
  // ----------------------------------------------------------
  // These environment variables are used by A-Server to configure the application
  // ----------------------------------------------------------
  /**
   * Port for the server to listen on
   * [!] Default is 3000
   * @default 3000
   */
  A_SERVER_PORT: "A_SERVER_PORT"
};
var A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = [
  A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES.A_SERVER_PORT
];
var A_Server = class extends A_Fragment {
  constructor(params) {
    super(params);
    this._routes = [];
    this.port = params.port;
    this.name = params.name;
    this.version = params.version || "v1";
    this._routes = params.routes || this._routes;
  }
  /**
   * A list of routes that the server will listen to
   */
  get routes() {
    return this._routes;
  }
};

// src/entities/A-Request/A-Request.entity.types.ts
var A_SERVER_TYPES__RequestEvent = /* @__PURE__ */ ((A_SERVER_TYPES__RequestEvent2) => {
  A_SERVER_TYPES__RequestEvent2["Error"] = "error";
  A_SERVER_TYPES__RequestEvent2["Finish"] = "finish";
  A_SERVER_TYPES__RequestEvent2["Data"] = "data";
  A_SERVER_TYPES__RequestEvent2["End"] = "end";
  A_SERVER_TYPES__RequestEvent2["Close"] = "close";
  return A_SERVER_TYPES__RequestEvent2;
})(A_SERVER_TYPES__RequestEvent || {});

// src/entities/A-Route/A-Route.entity.ts
var A_Route = class {
  constructor(param1, param2) {
    this.url = param1 instanceof RegExp ? param1.source : param1;
    this.method = param2 || "GET";
  }
  /**
   * returns path only without query and hash
   */
  get path() {
    const p = this.url.split("?")[0].split("#")[0];
    return p.endsWith("/") ? p.slice(0, -1) : p;
  }
  get params() {
    return this.path.match(/:([^\/]+)/g)?.map((param) => param.slice(1)) || [];
  }
  extractParams(url) {
    const cleanUrl = url.split("?")[0];
    const urlSegments = cleanUrl.split("/").filter(Boolean);
    const maskSegments = this.path.split("/").filter(Boolean);
    const params = {};
    for (let i = 0; i < maskSegments.length; i++) {
      const maskSegment = maskSegments[i];
      const urlSegment = urlSegments[i];
      if (maskSegment.startsWith(":")) {
        const paramName = maskSegment.slice(1);
        params[paramName] = urlSegment;
      } else if (maskSegment !== urlSegment) {
        return {};
      }
    }
    return params;
  }
  extractQuery(url) {
    const query = {};
    const queryString = url.split("?")[1];
    if (!queryString) return query;
    const cleanQuery = queryString.split("#")[0];
    for (const pair of cleanQuery.split("&")) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return query;
  }
  toString() {
    return `${this.method}::${this.path}`;
  }
  toRegExp() {
    return new RegExp(`^${this.method}::${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
  toAFeatureExtension(extensionScope = []) {
    return new RegExp(`^${extensionScope.length ? `(${extensionScope.join("|")})` : ".*"}\\.${this.method}::${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
};

// src/entities/A-Request/A-Request.entity.ts
var A_Request = class extends A_Entity {
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
    return "a-server";
  }
  fromNew(newEntity) {
    this.req = newEntity.request;
    this.aseid = new ASEID({
      concept: A_Context.root.name,
      scope: newEntity.scope,
      entity: this.constructor.entity,
      id: newEntity.id
    });
  }
  get startedAt() {
    const timeId = A_IdentityHelper.parseTimeId(this.aseid.id.split("-")[0]);
    return timeId ? new Date(timeId.timestamp) : void 0;
  }
  // Getter for request URL
  get url() {
    return this.req.url;
  }
  // Getter for request method
  get method() {
    return String(this.req.method).toUpperCase() || "DEFAULT";
  }
  get headers() {
    return this.req.headers;
  }
  get route() {
    return new A_Route(this.url, this.method);
  }
  pipe(destination, options) {
    return this.req.pipe(destination, options);
  }
  async init() {
    this.req.on("error", async (err) => {
      this.error = new A_ServerError(err);
      await this.call("error" /* Error */);
    });
    this.params = this.extractParams(this.url);
    this.query = this.extractQuery(this.url);
  }
  extractParams(url) {
    const cleanUrl = url.split("?")[0];
    const urlSegments = cleanUrl.split("/").filter(Boolean);
    const maskSegments = this.url.split("/").filter(Boolean);
    const params = {};
    for (let i = 0; i < maskSegments.length; i++) {
      const maskSegment = maskSegments[i];
      const urlSegment = urlSegments[i];
      if (maskSegment.startsWith(":")) {
        const paramName = maskSegment.slice(1);
        params[paramName] = urlSegment;
      } else if (maskSegment !== urlSegment) {
        return {};
      }
    }
    return params;
  }
  extractQuery(url) {
    const query = {};
    const queryString = url.split("?")[1];
    if (!queryString) return query;
    const cleanQuery = queryString.split("#")[0];
    for (const pair of cleanQuery.split("&")) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return query;
  }
  parseBody() {
    return new Promise((resolve, reject) => {
      let body = "";
      this.req.on("data", (chunk) => body += chunk);
      this.req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
      this.req.on("error", reject);
    });
  }
};

// src/entities/A-Response/A-Response.entity.types.ts
var A_SERVER_TYPES__ResponseEvent = /* @__PURE__ */ ((A_SERVER_TYPES__ResponseEvent2) => {
  A_SERVER_TYPES__ResponseEvent2["Error"] = "error";
  A_SERVER_TYPES__ResponseEvent2["Finish"] = "finish";
  A_SERVER_TYPES__ResponseEvent2["Data"] = "data";
  A_SERVER_TYPES__ResponseEvent2["End"] = "end";
  A_SERVER_TYPES__ResponseEvent2["Close"] = "close";
  return A_SERVER_TYPES__ResponseEvent2;
})(A_SERVER_TYPES__ResponseEvent || {});
var A_Response = class extends A_Entity {
  constructor() {
    super(...arguments);
    /**
     * Duration of the request in milliseconds
     */
    this.duration = 0;
    this.data = /* @__PURE__ */ new Map();
  }
  fromNew(newEntity) {
    this.res = newEntity.response;
    this.aseid = new ASEID({
      concept: A_Context.root.name,
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
  async init() {
    const startTime = process.hrtime();
    this.res.on("finish", async () => {
      const elapsedTime = process.hrtime(startTime);
      const elapsedMilliseconds = elapsedTime[0] * 1e3 + elapsedTime[1] / 1e6;
      this.duration = elapsedMilliseconds;
      await this.call("finish" /* Finish */);
    });
    this.res.on("close", async () => {
      await this.call("close" /* Close */);
    });
  }
  failed(error) {
    switch (true) {
      case error instanceof A_ServerError:
        this.error = error;
        break;
      case error instanceof A_Error:
        this.error = new A_ServerError(error);
        break;
      default:
        this.error = new A_ServerError(error);
        break;
    }
    return this.status(this.error.status).json(this.error);
  }
  // Send a plain text or JSON response
  send(data = this.toResponse()) {
    const logger = A_Context.scope(this).resolve(A_Logger);
    if (this.headersSent) {
      logger.warning("Response headers already sent, cannot send response again.");
      return;
    }
    try {
      switch (true) {
        case (!!data && typeof data === "object"):
          return this.json(data);
        case (!!data && typeof data === "string"):
          this.res.setHeader("Content-Type", "text/plain");
          this.res.writeHead(this.statusCode);
          this.res.end(data);
          return;
        default:
          this.res.writeHead(this.statusCode);
          this.res.end(data);
          return;
      }
    } catch (error) {
      logger.warning("Response send error:", error);
    }
  }
  destroy(error, scope) {
    this.res.end();
    return super.destroy(scope);
  }
  // Explicit JSON response
  json(data = this.toResponse()) {
    const logger = A_Context.scope(this).resolve(A_Logger);
    if (this.headersSent) {
      logger.warning("Response headers already sent, cannot send response again.");
      return;
    }
    this.res.setHeader("Content-Type", "application/json");
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
      if (value instanceof A_Entity)
        acc[key] = value.toJSON();
      else
        acc[key] = value;
      return acc;
    }, {});
  }
};
var A_ServerLogger = class extends A_Logger {
  async onRequestEnd(request, response) {
    this.route({
      method: request.method,
      url: request.url,
      status: response.statusCode,
      responseTime: response.duration
    });
  }
  async onRequestError(request) {
  }
  logStart(container) {
    this.serverReady({
      port: container.port,
      app: {
        name: container.name
      }
    });
  }
  logStop(server) {
    this.log("red", `Server ${server.name} stopped`);
  }
  metrics() {
  }
  routes(routes) {
    const time = this.getTime();
    console.log(`\x1B[36m[${this.scope.name}] |${time}| Exposed Routes:
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${routes.map((route) => `${" ".repeat(this.scopeLength + 3)}| [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.path}`).join("\n")}
${" ".repeat(this.scopeLength + 3)}|-------------------------------\x1B[0m`);
  }
  /**
   * Logs the route information based on status code
   * 
   * @param route 
   */
  route(route) {
    switch (route.status) {
      case 200:
        this.log200(route);
        break;
      case 404:
        this.log404(route);
        break;
      case 500:
        this.log500(route);
        break;
      case 400:
        this.log400(route);
        break;
      default:
        this.logDefault(route);
        break;
    }
  }
  log200(route) {
    if (this.config.get("SERVER_IGNORE_LOG_200"))
      return;
    console.log(`\x1B[32m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1B[0m`);
  }
  log404(route) {
    if (this.config.get("SERVER_IGNORE_LOG_404"))
      return;
    console.log(`\x1B[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1B[0m`);
  }
  log500(route) {
    if (this.config.get("SERVER_IGNORE_LOG_500"))
      return;
    console.log(`\x1B[31m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1B[0m`);
  }
  log400(route) {
    if (this.config.get("SERVER_IGNORE_LOG_400"))
      return;
    console.log(`\x1B[33m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1B[0m`);
  }
  logDefault(route) {
    if (this.config.get("SERVER_IGNORE_LOG_DEFAULT"))
      return;
    console.log(`\x1B[36m[${this.scope.name}] |${this.getTime()}| ${route.status} | [${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.url} | ${route.responseTime}ms\x1B[0m`);
  }
  serverReady(params) {
    const processId = process.pid;
    console.log(`\x1B[36m[${this.scope.name}] |${this.getTime()}| Server Ready:
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ${params.app.name} v${params.app.version || "0.0.1"} is running on port ${params.port}
${" ".repeat(this.scopeLength + 3)}| Process ID: ${processId}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ==============================
${" ".repeat(this.scopeLength + 3)}|          LISTENING...         
${" ".repeat(this.scopeLength + 3)}| ==============================
\x1B[0m`);
  }
  /**
   * Displays a proxy routes 
   * 
   * @param params 
   */
  proxy(params) {
    console.log(`\x1B[35m[${this.scope.name}] |${this.getTime()}| Proxy:
${" ".repeat(this.scopeLength + 3)}| ${params.original} -> ${params.destination}
${" ".repeat(this.scopeLength + 3)}|-------------------------------\x1B[0m`);
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "finish" /* Finish */,
    scope: [A_Response]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response))
], A_ServerLogger.prototype, "onRequestEnd");
__decorateClass([
  A_Feature.Extend({
    name: "error" /* Error */
  }),
  __decorateParam(0, A_Inject(A_Request))
], A_ServerLogger.prototype, "onRequestError");
__decorateClass([
  A_Feature.Extend({
    name: "afterStart" /* afterStart */,
    scope: [A_Service]
  }),
  __decorateParam(0, A_Inject(A_Service))
], A_ServerLogger.prototype, "logStart");
__decorateClass([
  A_Feature.Extend({
    name: "afterStop" /* afterStop */,
    scope: [A_Service]
  }),
  __decorateParam(0, A_Inject(A_Server))
], A_ServerLogger.prototype, "logStop");

// src/containers/A-Service/A-Service.container.ts
var A_Service = class extends A_Container {
  async load() {
    if (!this.scope.has(A_ServerLogger))
      this.scope.register(A_ServerLogger);
    this.scope.resolve(A_ServerLogger);
    let polyfill;
    if (!this.scope.has(A_Polyfill))
      this.scope.register(A_Polyfill);
    polyfill = this.scope.resolve(A_Polyfill);
    let config;
    if (!this.scope.has(A_Config)) {
      const config2 = new A_Config({
        variables: [...Array.from(A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY)],
        defaults: {
          A_SERVER_PORT: 3e3
        }
      });
      this.scope.register(config2);
    }
    config = this.scope.resolve(A_Config);
    if (!this.scope.has(A_Server)) {
      new A_Server({
        port: config.get("A_SERVER_PORT"),
        name: this.name,
        version: "v1"
      });
    }
    this.port = config.get("A_SERVER_PORT");
    const http = await polyfill.http();
    this.server = http.createServer(this.onRequest.bind(this));
  }
  listen() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        resolve();
      });
    });
  }
  /**
   * Start the server
   */
  async start() {
    await this.beforeStart();
    await this.listen();
    await this.afterStart();
  }
  async beforeStart() {
  }
  async afterStart() {
  }
  /**
   * Stop service 
   */
  async stop() {
    await this.call("beforeStop" /* beforeStop */);
    await this.server.close();
    await this.call("afterStop" /* afterStop */);
  }
  async beforeRequest(scope) {
  }
  async afterRequest(scope) {
  }
  async onRequest(request, response) {
    const scope = new A_Scope({
      name: `a-server-request::${Date.now()}`
    });
    const { req, res } = await this.convertToAServer(request, response);
    try {
      scope.register(req);
      scope.register(res);
      scope.inherit(this.scope);
      await this.beforeRequest(scope);
      await this.call("onRequest" /* onRequest */, scope);
      await this.afterRequest(scope);
      await res.status(200).send();
    } catch (error) {
      const logger = this.scope.resolve(A_Logger);
      logger.error(error);
      return res.failed(error);
    }
  }
  async convertToAServer(request, response) {
    if (!request.method || !request.url)
      throw new A_Error("Request method or url is missing");
    const id = await this.generateRequestId(request.method, request.url);
    const req = new A_Request({ id, request, scope: this.scope.name });
    const res = new A_Response({ id, response, scope: this.scope.name });
    await req.init();
    await res.init();
    return { req, res };
  }
  async generateRequestId(method, url) {
    const crypto = await this.scope.resolve(A_Polyfill).crypto();
    const timeId = A_IdentityHelper.generateTimeId();
    const randomValue = Math.random().toString();
    const hash = await crypto.createTextHash(`${timeId}-${method}-${url}-${randomValue}`, "sha256");
    return `${timeId}-${hash}`;
  }
  async beforeStop() {
  }
  async afterStop() {
  }
};
__decorateClass([
  A_Concept.Load()
], A_Service.prototype, "load");
__decorateClass([
  A_Concept.Start()
], A_Service.prototype, "start");
__decorateClass([
  A_Feature.Define({ invoke: true })
], A_Service.prototype, "beforeStart");
__decorateClass([
  A_Feature.Define({ invoke: true })
], A_Service.prototype, "afterStart");
__decorateClass([
  A_Concept.Stop()
], A_Service.prototype, "stop");
__decorateClass([
  A_Feature.Define({
    name: "beforeRequest" /* beforeRequest */,
    invoke: true
  })
], A_Service.prototype, "beforeRequest");
__decorateClass([
  A_Feature.Define({
    name: "beforeRequest" /* beforeRequest */,
    invoke: true
  })
], A_Service.prototype, "afterRequest");
__decorateClass([
  A_Feature.Define({
    name: "onRequest" /* onRequest */,
    invoke: false
  })
], A_Service.prototype, "onRequest");
__decorateClass([
  A_Feature.Define({ invoke: true })
], A_Service.prototype, "beforeStop");
__decorateClass([
  A_Feature.Define({ invoke: true })
], A_Service.prototype, "afterStop");

// src/context/A-ProxyConfig/A_ProxyConfig.constants.ts
var PROXY_CONFIG_DEFAULTS = {
  path: "/",
  hostname: "localhost",
  port: 80,
  method: "GET",
  headers: {},
  protocol: "http"
};

// src/context/A-ProxyConfig/A_ProxyConfig.context.ts
var A_ProxyConfig = class extends A_Fragment {
  constructor(configs = {}) {
    super();
    this._configs = Object.entries(configs).map(([path, config]) => {
      const targetUrl = new URL(typeof config === "string" ? config : config.hostname || "");
      const port = targetUrl.port || (targetUrl.protocol === "https:" ? "443" : "80");
      const prepared = {
        ...PROXY_CONFIG_DEFAULTS,
        ...typeof config === "string" ? {
          path,
          port: parseInt(port),
          protocol: targetUrl.protocol,
          hostname: targetUrl.hostname
        } : config
      };
      return {
        route: new A_Route(prepared.path, prepared.method),
        hostname: prepared.hostname,
        port: prepared.port,
        headers: prepared.headers,
        protocol: prepared.protocol
      };
    });
  }
  /**
   * Returns all configured proxy configs
   * 
   */
  get configs() {
    return this._configs;
  }
  /**
   * Checks if a given path is configured in the proxy
   * 
   * @param path 
   * @returns 
   */
  has(path) {
    return this._configs.some((route) => route.route.toRegExp().test(path));
  }
  /**
   * Returns the proxy configuration for a given path, if exists
   *
   * @param path 
   * @returns 
   */
  config(path) {
    return this._configs.find((route) => route.route.toRegExp().test(path));
  }
};
var A_StaticConfig = class extends A_Fragment {
  constructor(directories = [], directoryConfigs = []) {
    super();
    this._aliases = /* @__PURE__ */ new Map();
    this._directoryConfigs = [];
    this.directories = directories;
    this._directoryConfigs = directoryConfigs;
    this.initializeDefaultAliases();
    this.initializeCustomAliases();
  }
  initializeDefaultAliases() {
    this.directories.forEach((dir, index) => {
      const alias = {
        alias: `/static${index > 0 ? index : ""}`,
        path: `/static${index > 0 ? index : ""}`,
        directory: dir,
        enabled: true
      };
      this._aliases.set(alias.path, alias);
    });
  }
  initializeCustomAliases() {
    this._directoryConfigs.forEach((config) => {
      const alias = {
        alias: config.alias || config.path,
        path: config.path,
        directory: config.directory,
        enabled: true
      };
      this._aliases.set(alias.path, alias);
    });
  }
  /**
   * Add a custom static file alias
   * @param alias - The URL path alias (e.g., '/assets')
   * @param directory - The local directory path
   * @param path - Optional custom path (defaults to alias)
   */
  addAlias(alias, directory, path) {
    const staticAlias = {
      alias,
      path: path || alias,
      directory,
      enabled: true
    };
    this._aliases.set(staticAlias.path, staticAlias);
  }
  /**
   * Remove a static file alias
   * @param aliasPath - The path of the alias to remove
   */
  removeAlias(aliasPath) {
    return this._aliases.delete(aliasPath);
  }
  /**
   * Enable or disable an alias
   * @param aliasPath - The path of the alias
   * @param enabled - Whether to enable or disable
   */
  setAliasEnabled(aliasPath, enabled) {
    const alias = this._aliases.get(aliasPath);
    if (alias) {
      alias.enabled = enabled;
      return true;
    }
    return false;
  }
  /**
   * Get all configured aliases
   */
  getAliases() {
    return Array.from(this._aliases.values());
  }
  /**
   * Get enabled aliases only
   */
  getEnabledAliases() {
    return Array.from(this._aliases.values()).filter((alias) => alias.enabled !== false);
  }
  /**
   * Find the best matching alias for a given request path
   * @param requestPath - The request path to match
   */
  findMatchingAlias(requestPath) {
    let bestMatch = null;
    let longestMatch = 0;
    for (const alias of this.getEnabledAliases()) {
      if (requestPath.startsWith(alias.path) && alias.path.length > longestMatch) {
        bestMatch = alias;
        longestMatch = alias.path.length;
      }
    }
    return bestMatch;
  }
  /**
   * Check if an alias exists
   * @param aliasPath - The path to check
   */
  hasAlias(aliasPath) {
    return this._aliases.has(aliasPath);
  }
  /**
   * Get a specific alias by path
   * @param aliasPath - The path of the alias
   */
  getAlias(aliasPath) {
    return this._aliases.get(aliasPath);
  }
  /**
   * Add multiple aliases at once
   * @param aliases - Array of alias configurations
   */
  addAliases(aliases) {
    aliases.forEach((config) => {
      this.addAlias(config.alias || config.path, config.directory, config.path);
    });
  }
  /**
   * Clear all aliases
   */
  clearAliases() {
    this._aliases.clear();
  }
  /**
   * Update an existing alias
   * @param aliasPath - The path of the alias to update
   * @param updates - Partial updates to apply
   */
  updateAlias(aliasPath, updates) {
    const alias = this._aliases.get(aliasPath);
    if (alias) {
      Object.assign(alias, updates);
      return true;
    }
    return false;
  }
  /**
   * Get statistics about configured aliases
   */
  getStats() {
    const aliases = this.getAliases();
    const enabled = aliases.filter((a) => a.enabled !== false);
    const disabled = aliases.filter((a) => a.enabled === false);
    const directories = [...new Set(aliases.map((a) => a.directory))];
    return {
      total: aliases.length,
      enabled: enabled.length,
      disabled: disabled.length,
      directories
    };
  }
  /**
   * Checks if a given path is configured in the proxy (legacy method)
   * @deprecated Use findMatchingAlias instead
   * @param path 
   * @returns 
   */
  has(path) {
    const alias = this.findMatchingAlias(path);
    return alias ? alias.directory : false;
  }
};
var A_ListQueryFilter = class extends A_Fragment {
  constructor(_query = {}, defaults = {}) {
    super();
    this._query = _query;
    this.defaults = defaults;
    this.parsedQuery = this.parseQueryString(_query);
  }
  get query() {
    return this._query;
  }
  get(property, defaultValue = "") {
    return this.parsedQuery[property] || this.defaults[property] || defaultValue;
  }
  parseQueryString(value = {}) {
    if (typeof value === "string") {
      return value.split("&").reduce((acc, part) => {
        const [key, val] = part.split("=");
        acc[decodeURIComponent(key)] = decodeURIComponent(val || "");
        return acc;
      }, {});
    }
    return value;
  }
};
var A_EntityFactory = class extends A_Fragment {
  constructor(param1, param2) {
    super();
    this._entities = /* @__PURE__ */ new Map();
    this._setEntities(param1);
    this._setEntities(param2);
  }
  _setEntities(entities = []) {
    if (Array.isArray(entities)) {
      entities.forEach((entity) => {
        this._entities.set(entity.entity, entity);
      });
    } else {
      Object.keys(entities).forEach((key) => {
        this._entities.set(key, entities[key]);
      });
    }
  }
  add(param1, param2) {
    switch (true) {
      case (typeof param1 === "string" && !!param2):
        this._entities.set(param1, param2);
        break;
      case typeof param1 !== "string":
        this._entities.set(param1.entity, param1);
        break;
    }
  }
  has(param1) {
    let name;
    switch (true) {
      case param1 instanceof ASEID:
        name = param1.entity;
        break;
      case (!(param1 instanceof ASEID) && ASEID.isASEID(param1)):
        name = new ASEID(param1).entity;
        break;
      default:
        name = param1;
        break;
    }
    return this._entities.has(name);
  }
  resolve(param1) {
    let name;
    switch (true) {
      case param1 instanceof ASEID:
        name = param1.entity;
        break;
      case (typeof param1 === "string" && ASEID.isASEID(param1)):
        name = new ASEID(param1).entity;
        break;
      default:
        name = param1;
        break;
    }
    return this._entities.get(name);
  }
  resolveByName(name) {
    return this._entities.get(name);
  }
};
var A_EntityList = class extends A_Entity {
  constructor() {
    super(...arguments);
    this._items = [];
    this._pagination = {
      total: 0,
      page: 1,
      pageSize: 10
    };
  }
  static get scope() {
    return "a-server";
  }
  /**
   * Returns the entity constructor used for the list
   */
  get entityConstructor() {
    return this._entityConstructor;
  }
  /**
   * Returns the list of items contained in the entity list
   */
  get items() {
    return this._items;
  }
  /**
   * Returns pagination information about the entity list
   */
  get pagination() {
    return this._pagination;
  }
  /**
   * Creates a new instance of A_EntityList
   * 
   * @param newEntity 
   */
  fromNew(newEntity) {
    this.aseid = new ASEID({
      concept: A_Context.root.name,
      scope: "default",
      entity: "a-list" + (newEntity.name ? `.${newEntity.name}` : ""),
      id: (/* @__PURE__ */ new Date()).getTime().toString()
    });
    this._entityConstructor = newEntity.constructor;
  }
  /**
   * Allows to convert Repository Response data to EntityList instance
   * 
   * [!] This method does not load the data from the repository, it only converts the data to the EntityList instance
   * 
   * @param items 
   * @param pagination 
   */
  fromList(items, pagination) {
    this._items = items.map((item) => {
      if (item instanceof A_Entity) {
        return item;
      } else {
        const entity = new this._entityConstructor(item);
        return entity;
      }
    });
    if (pagination) {
      this._pagination = {
        total: pagination.total,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
    }
  }
  /**
   * Serializes the EntityList to a JSON object
   * 
   * @returns 
   */
  toJSON() {
    return {
      ...super.toJSON(),
      items: this._items.map((i) => i.toJSON()),
      pagination: this._pagination
    };
  }
};

// src/components/A-Router/A-Router.component.types.ts
var A_SERVER_TYPES__RouterMethod = /* @__PURE__ */ ((A_SERVER_TYPES__RouterMethod2) => {
  A_SERVER_TYPES__RouterMethod2["POST"] = "POST";
  A_SERVER_TYPES__RouterMethod2["GET"] = "GET";
  A_SERVER_TYPES__RouterMethod2["PUT"] = "PUT";
  A_SERVER_TYPES__RouterMethod2["DELETE"] = "DELETE";
  A_SERVER_TYPES__RouterMethod2["PATCH"] = "PATCH";
  A_SERVER_TYPES__RouterMethod2["DEFAULT"] = "DEFAULT";
  return A_SERVER_TYPES__RouterMethod2;
})(A_SERVER_TYPES__RouterMethod || {});
var A_SERVER_TYPES__ARouterComponentMetaKey = /* @__PURE__ */ ((A_SERVER_TYPES__ARouterComponentMetaKey2) => {
  A_SERVER_TYPES__ARouterComponentMetaKey2["ROUTES"] = "ROUTES";
  return A_SERVER_TYPES__ARouterComponentMetaKey2;
})(A_SERVER_TYPES__ARouterComponentMetaKey || {});
var _A_Router = class _A_Router extends A_Component {
  // =======================================================
  // ================ Method Definition=====================
  // =======================================================
  /**
   * Allows to define a custom route for POST requests
   * 
   * @param path 
   * @returns 
   */
  static Post(path) {
    return this.defineRoute({
      method: "POST" /* POST */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for GET requests
   * 
   * @param path 
   * @returns 
   */
  static Get(path) {
    return this.defineRoute({
      method: "GET" /* GET */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for PUT requests
   * 
   * @param path 
   * @returns 
   */
  static Put(path) {
    return this.defineRoute({
      method: "PUT" /* PUT */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for DELETE requests
   * 
   * @param path 
   * @returns 
   */
  static Delete(path) {
    return this.defineRoute({
      method: "DELETE" /* DELETE */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for PATCH requests
   * 
   * @param path 
   * @returns 
   */
  static Patch(path) {
    return this.defineRoute({
      method: "PATCH" /* PATCH */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Allows to define a custom route for DEFAULT requests
   * 
   * @param path 
   * @returns 
   */
  static Default(path) {
    return this.defineRoute({
      method: "DEFAULT" /* DEFAULT */,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  /**
   * Private method to have the same signature for all route methods
   * 
   * @param method 
   * @param path 
   * @returns 
   */
  static defineRoute(config) {
    const route = typeof config.path === "string" || config.path instanceof RegExp ? new A_Route(
      `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith("/") ? config.path : `/${config.path}`}`,
      config.method
    ) : config.path;
    this.routes.push(route);
    return function decorator(target, propertyKey, descriptor) {
      const meta = A_Context.meta(target);
      const routes = meta.get("ROUTES" /* ROUTES */) || /* @__PURE__ */ new Map();
      const searchKey = route.toAFeatureExtension(["A_Router", "A_Service"]);
      routes.set(searchKey.source, {
        component: target,
        handler: propertyKey,
        route
      });
      meta.set("ROUTES" /* ROUTES */, routes);
      A_Feature_Define({
        name: searchKey.source,
        invoke: false
      })(target, propertyKey, descriptor);
      return A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
    };
  }
  async load(logger) {
    logger.routes(_A_Router.routes);
  }
  async identifyRoute(request, response, scope, config, logger) {
    const route = request.route;
    if (config.get("A_CONCEPT_ENVIRONMENT") === "development") {
      logger.log(`Incoming request: ${request.method} ${request.url}`);
      logger.log(`Identified route: ${route.toString()}`);
    }
    const feature = new A_Feature({
      name: route.toString(),
      component: this
    });
    for (const stage of feature) {
      if (A_TypeGuards.isComponentConstructor(stage.definition.component)) {
        const meta = A_Context.meta(stage.definition.component);
        const routes = meta.get("ROUTES" /* ROUTES */);
        if (routes) {
          const currentRoute = routes.get(stage.definition.name || "");
          if (currentRoute) {
            request.params = {
              ...request.params,
              ...currentRoute.route.extractParams(request.url)
            };
          }
        }
      }
      const stageScope = new A_Scope({
        name: `a-route--${A_IdentityHelper.generateTimeId()}`,
        entities: [request]
      }, {
        parent: scope
      });
      await stage.process(stageScope);
    }
    console.log("Finished processing route for request:", request.method, request.url);
  }
};
_A_Router.routes = [];
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_ServerLogger))
], _A_Router.prototype, "load");
__decorateClass([
  A_Feature.Extend({
    name: "onRequest" /* onRequest */,
    scope: [A_Service]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Config)),
  __decorateParam(4, A_Inject(A_Logger))
], _A_Router.prototype, "identifyRoute");
var A_Router = _A_Router;
var A_EntityController = class extends A_Component {
  async list(request, response, factory, scope, config) {
    const constructor = factory.resolveByName(request.params.type);
    if (constructor) {
      const entityList = new A_EntityList({
        name: request.params.type,
        scope: scope.name,
        constructor
      });
      scope.register(entityList);
      const queryFilter = new A_ListQueryFilter(request.query, {
        itemsPerPage: String(config.get("A_LIST_ITEMS_PER_PAGE") || "10"),
        page: String(config.get("A_LIST_PAGE") || "1")
      });
      const queryScope = new A_Scope({
        fragments: [queryFilter]
      }).inherit(scope);
      await entityList.load(queryScope);
      response.add("items", entityList.items);
      response.add("pagination", entityList.pagination);
    }
  }
  async load(request, response, scope) {
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.load", "Invalid ASEID");
      return;
    }
    const aseid = new ASEID(request.params.aseid);
    const constructor = scope.resolveConstructor(aseid.entity);
    if (constructor) {
      const entity = new constructor(request.params.aseid);
      scope.register(entity);
      await entity.load();
      return response.status(200).json(entity.toJSON());
    } else
      throw new A_ServerError({
        title: "Entity Not Found",
        description: `Entity constructor for ASEID ${request.params.aseid} not found`,
        status: 404
      });
  }
  async create(request, factory, scope) {
    const constructor = factory.resolve(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.body);
      scope.register(entity);
      await entity.save();
    }
  }
  async update(request, response, factory, scope) {
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.update", "Invalid ASEID");
      return;
    }
    const constructor = factory.resolve(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.body);
      scope.register(entity);
      await entity.save();
    }
  }
  async delete(request, response, factory, scope) {
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.delete", "Invalid ASEID");
      return;
    }
    const constructor = factory.resolve(request.params.aseid);
    if (constructor) {
      const entity = new constructor(request.params.aseid);
      scope.register(entity);
      await entity.destroy();
    }
  }
  async callEntity(request, response, factory, scope) {
    if (!ASEID.isASEID(request.params.aseid)) {
      response.add("A_EntityController.callEntity", "Invalid ASEID");
      return;
    }
    const constructor = factory.resolve(request.params.aseid);
    if (!constructor) {
      response.add("A_EntityController.callEntity", "Entity not found");
      return;
    }
    const meta = A_Context.meta(constructor);
    const targetFeature = meta.features().find((f) => f.name === `${constructor.name}.${request.params.action}`);
    if (!targetFeature) {
      response.add("A_EntityController.callEntity", "Feature not found");
      return;
    }
    const entity = new constructor(request.params.aseid);
    scope.register(entity);
    await entity.load(scope);
    await entity[targetFeature.handler](scope);
    response.add("result", scope.toJSON());
    response.add("entity", entity);
    response.add("type", entity.aseid.entity);
  }
};
__decorateClass([
  A_Router.Get({
    path: "/:type",
    version: "v1",
    prefix: "a-list"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_EntityFactory)),
  __decorateParam(3, A_Inject(A_Scope)),
  __decorateParam(4, A_Inject(A_Config))
], A_EntityController.prototype, "list");
__decorateClass([
  A_Feature.Define({
    name: "getEntity",
    invoke: false
  }),
  A_Router.Get({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "load");
__decorateClass([
  A_Router.Post({
    path: "/",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_EntityFactory)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityController.prototype, "create");
__decorateClass([
  A_Router.Put({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_EntityFactory)),
  __decorateParam(3, A_Inject(A_Scope))
], A_EntityController.prototype, "update");
__decorateClass([
  A_Router.Delete({
    path: "/:aseid",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_EntityFactory)),
  __decorateParam(3, A_Inject(A_Scope))
], A_EntityController.prototype, "delete");
__decorateClass([
  A_Router.Post({
    path: "/:aseid/:action",
    version: "v1",
    prefix: "a-entity"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_EntityFactory)),
  __decorateParam(3, A_Inject(A_Scope))
], A_EntityController.prototype, "callEntity");
var A_ServerHealthMonitor = class extends A_Component {
  async get(config, request, response, logger) {
    logger.log("Health check requested", config.get("A_CONCEPT_ROOT_FOLDER"));
    const packageJSON = await import(`${config.get("A_CONCEPT_ROOT_FOLDER")}/package.json`);
    const exposedProperties = config.get("EXPOSED_PROPERTIES")?.split(",") || [
      "name",
      "version",
      "description"
    ];
    exposedProperties.forEach((prop) => response.add(prop, packageJSON[prop]));
    console.log(`Health check accessed: ${request.method} ${request.url}`);
  }
};
__decorateClass([
  A_Router.Get({
    path: "/",
    prefix: "health",
    version: "v1"
  }),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Request)),
  __decorateParam(2, A_Inject(A_Response)),
  __decorateParam(3, A_Inject(A_Logger))
], A_ServerHealthMonitor.prototype, "get");
var A_ServerProxy = class extends A_Component {
  async load(logger, config) {
    logger.log(
      "pink",
      `Proxy routes configured:`,
      config.configs.map((c) => c.route).join("\n")
    );
  }
  async onRequest(req, res, proxyConfig, logger, polyfill) {
    return new Promise(async (resolve, reject) => {
      const { method, url } = req;
      const route = new A_Route(url, method);
      const config = proxyConfig.config(route.toString());
      if (!config) {
        return resolve();
      }
      logger.log(
        "yellow",
        `Proxying request ${method} ${url} to ${config.hostname}`,
        config
      );
      const client = await (config.protocol === "https:" ? polyfill.https() : polyfill.http());
      const proxyReq = client.request(
        {
          method: config.route.method,
          hostname: config.hostname,
          port: config.port,
          headers: config.headers,
          path: route.path
        },
        (proxyRes) => {
          if (!res.headersSent) {
            res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          }
          proxyRes.on("end", () => {
            logger.log("green", `Proxy request to ${config?.hostname} completed`);
            resolve();
          });
          proxyRes.pipe(res.original);
        }
      );
      proxyReq.on("error", (err) => reject(err));
      req.pipe(proxyReq);
    });
  }
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Logger)),
  __decorateParam(1, A_Inject(A_ProxyConfig))
], A_ServerProxy.prototype, "load");
__decorateClass([
  A_Feature.Extend({
    name: "onRequest" /* onRequest */
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_ProxyConfig)),
  __decorateParam(3, A_Inject(A_Logger)),
  __decorateParam(4, A_Inject(A_Polyfill))
], A_ServerProxy.prototype, "onRequest");

// src/components/A-ServerCORS/A_ServerCORS.component.defaults.ts
var A_SERVER_DEFAULTS__CorsConfig = {
  origin: "*",
  // Default to allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  headers: ["Content-Type"],
  credentials: false,
  maxAge: 0
};
var A_ServerCORS = class extends A_Component {
  async init(config) {
    this.config = {
      origin: config.get("ORIGIN") || A_SERVER_DEFAULTS__CorsConfig.origin,
      methods: config.get("METHODS") || A_SERVER_DEFAULTS__CorsConfig.methods,
      headers: config.get("HEADERS") || A_SERVER_DEFAULTS__CorsConfig.headers,
      credentials: config.get("CREDENTIALS") || A_SERVER_DEFAULTS__CorsConfig.credentials,
      maxAge: config.get("MAX_AGE") || A_SERVER_DEFAULTS__CorsConfig.maxAge
    };
  }
  apply(aReq, aRes) {
    aRes.setHeader("Access-Control-Allow-Origin", this.config.origin);
    aRes.setHeader("Access-Control-Allow-Methods", this.config.methods.join(", "));
    aRes.setHeader("Access-Control-Allow-Headers", this.config.headers.join(", "));
    if (this.config.credentials) {
      aRes.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (this.config.maxAge) {
      aRes.setHeader("Access-Control-Max-Age", this.config.maxAge.toString());
    }
    if (aReq.req.method === "OPTIONS") {
      aRes.status(204).send();
    }
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "beforeStart" /* beforeStart */
  }),
  __decorateParam(0, A_Inject(A_Config))
], A_ServerCORS.prototype, "init");
__decorateClass([
  A_Feature.Extend({
    name: "beforeRequest" /* beforeRequest */
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response))
], A_ServerCORS.prototype, "apply");
var A_StaticLoader = class extends A_Component {
  async load(logger, config, polyfill) {
    this._fsPolyfill = await polyfill.fs();
    this._pathPolyfill = await polyfill.path();
    const aliases = config.getEnabledAliases();
    logger.log(
      "pink",
      `Static aliases configured:`,
      aliases.map((alias) => `${alias.alias} -> ${alias.directory}`).join("\n")
    );
  }
  async onRequest(req, res, logger, config, polyfill) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return;
    }
    const { method, url } = req;
    const route = new A_Route(url, method);
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
    } catch (error) {
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
              logger.log("green", `Successfully served: ${filePath}`);
              resolve();
            });
            stream.on("error", (err) => {
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
      } catch (error) {
        logger.error(`Error serving file: ${error.message}`);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.send("Internal server error");
        reject(error);
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
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Logger)),
  __decorateParam(1, A_Inject(A_StaticConfig)),
  __decorateParam(2, A_Inject(A_Polyfill))
], A_StaticLoader.prototype, "load");
__decorateClass([
  A_Feature.Extend({
    name: "onRequest" /* onRequest */
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Logger)),
  __decorateParam(3, A_Inject(A_StaticConfig)),
  __decorateParam(4, A_Inject(A_Polyfill))
], A_StaticLoader.prototype, "onRequest");
var A_Controller = class extends A_Component {
  async callEntityMethod(request, response, scope) {
    if (!scope.has(request.params.component))
      return;
    if (!request.params.operation || typeof request.params.operation !== "string")
      return;
    const possibleComponent = scope.resolve(request.params.component);
    if (!possibleComponent || ![A_Component, A_Container].some((c) => possibleComponent instanceof c))
      return;
    const component = possibleComponent;
    const meta = A_Context.meta(component);
    const targetFeature = meta.features().find((f) => f.name === `${component.constructor.name}.${request.params.operation}`);
    if (!targetFeature)
      return;
    await component.call(request.params.operation, scope);
  }
};
__decorateClass([
  A_Router.Post({
    path: "/:component/:operation",
    version: "v1",
    prefix: "a-component"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_Controller.prototype, "callEntityMethod");
var A_ListingController = class extends A_Component {
  async list(request, response, factory, scope, config) {
    const constructor = factory.resolveByName(request.params.type);
    if (constructor) {
      const entityList = new A_EntityList({
        name: request.params.type,
        scope: scope.name,
        constructor
      });
      scope.register(entityList);
      const queryFilter = new A_ListQueryFilter(request.query, {
        itemsPerPage: String(config.get("A_LIST_ITEMS_PER_PAGE") || "10"),
        page: String(config.get("A_LIST_PAGE") || "1")
      });
      const queryScope = new A_Scope({
        fragments: [queryFilter]
      }).inherit(scope);
      await entityList.load(queryScope);
      response.add("items", entityList.items);
      response.add("pagination", entityList.pagination);
    }
  }
};
__decorateClass([
  A_Router.Get({
    path: "/:type",
    version: "v1",
    prefix: "a-list"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_EntityFactory)),
  __decorateParam(3, A_Inject(A_Scope)),
  __decorateParam(4, A_Inject(A_Config))
], A_ListingController.prototype, "list");
var A_CommandController = class extends A_Component {
  async handleCommand(req, res, scope, container) {
    const commandName = req.params.command;
    const CommandConstructor = scope.resolveConstructor(commandName);
    if (!CommandConstructor) {
      res.status(404);
      throw new Error(`Command ${commandName} not found`);
    }
    const command = new CommandConstructor(req.body);
    container.scope.register(command);
    await command.execute();
    const serialized = command.toJSON();
    return res.status(200).json(serialized);
  }
};
__decorateClass([
  A_Router.Get({
    path: "/:command/execute",
    version: "v1",
    prefix: "a-command"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Container))
], A_CommandController.prototype, "handleCommand");
var A_EntityRepository = class extends A_Component {
  async list(channel, entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await channel.get(`/a-list/${entity.aseid.entity}`);
    entity.fromJSON(response.data);
  }
  async load(channel, entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await channel.get(`/a-entity/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
  async save(channel, entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "save").for(entity.constructor))
      return;
    const response = await channel.post(`/a-entity/${entity.aseid.toString()}`, entity.toJSON());
    entity.fromJSON(response.data);
  }
  async destroy(channel, entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "destroy").for(entity.constructor))
      return;
    const response = await channel.delete(`/a-entity/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
};
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.LOAD,
    scope: {
      include: [A_EntityList]
    }
  }),
  __decorateParam(0, A_Inject(A_HTTPChannel)),
  __decorateParam(1, A_Inject(A_Caller)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityRepository.prototype, "list");
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.LOAD,
    scope: {
      exclude: [A_EntityList]
    }
  }),
  __decorateParam(0, A_Inject(A_HTTPChannel)),
  __decorateParam(1, A_Inject(A_Caller)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityRepository.prototype, "load");
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.SAVE,
    scope: {
      exclude: [A_EntityList]
    }
  }),
  __decorateParam(0, A_Inject(A_HTTPChannel)),
  __decorateParam(1, A_Inject(A_Caller)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityRepository.prototype, "save");
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.DESTROY,
    scope: {
      exclude: [A_EntityList]
    }
  }),
  __decorateParam(0, A_Inject(A_HTTPChannel)),
  __decorateParam(1, A_Inject(A_Caller)),
  __decorateParam(2, A_Inject(A_Scope))
], A_EntityRepository.prototype, "destroy");

export { A_CommandController, A_Controller, A_EntityController, A_EntityFactory, A_EntityList, A_EntityRepository, A_HTTPChannel, A_HTTPChannelError, A_HTTPChannel_RequestContext, A_ListQueryFilter, A_ListingController, A_ProxyConfig, A_Request, A_Response, A_Route, A_Router, A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_SERVER_TYPES__ARouterComponentMetaKey, A_SERVER_TYPES__RequestEvent, A_SERVER_TYPES__ResponseEvent, A_SERVER_TYPES__RouterMethod, A_SERVER_TYPES__ServerFeature, A_SERVER_TYPES__ServerMethod, A_Server, A_ServerCORS, A_ServerError, A_ServerHealthMonitor, A_ServerLogger, A_ServerProxy, A_Service, A_StaticConfig, A_StaticLoader };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map