import { A_ExecutionContext } from '@adaas/a-utils/a-execution';
import { A_Feature, A_Inject, A_Error, A_IdentityHelper, A_Scope, A_Dependency, A_Concept, A_Meta, A_Entity, ASEID, A_Context, A_Fragment, A_ComponentMeta, A_Component, A_TypeGuards, A_Feature_Define, A_Feature_Extend, A_Container } from '@adaas/a-concept';
import { A_OperationContext } from '@adaas/a-utils/a-operation';
import { A_ScheduleObject } from '@adaas/a-utils/a-schedule';
import { A_Config } from '@adaas/a-utils/a-config';
import { Readable, pipeline } from 'stream';
import { A_Route } from '@adaas/a-utils/a-route';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var A_HttpRequestData = class extends A_ExecutionContext {
  constructor(data) {
    super(
      "a-http-request-data"
    );
    this._meta.set("data", data);
  }
  get length() {
    return this.data?.length || 0;
  }
  get data() {
    return this._meta.get("data");
  }
  toString(encoding = "utf-8") {
    return this.data.toString(encoding);
  }
};
var A_HttpServerRequestContext = class extends A_OperationContext {
  get _request() {
    return super.params.request;
  }
  get _response() {
    return super.params.response;
  }
  constructor(request, response) {
    super("http-server-request", { request, response });
    this._id = A_IdentityHelper.generateTimeId();
  }
  get id() {
    return `[${this._request.method}]${this._request.url}-${this._id}`;
  }
  get buffers() {
    if (!this._meta.has("buffers")) {
      this._meta.set("buffers", []);
    }
    return this._meta.get("buffers");
  }
  get contentType() {
    return this._request.headers["content-type"] || void 0;
  }
  get data() {
    return this._meta.get("data");
  }
  set data(value) {
    this._meta.set("data", value);
  }
  get length() {
    return this.buffers.reduce((acc, buf) => acc + buf.length, 0);
  }
  get processingTime() {
    let endTime = this._endTime;
    if (!endTime) {
      endTime = process.hrtime();
    }
    const [seconds, nanoseconds] = process.hrtime(this._startTime);
    return seconds * 1e3 + nanoseconds / 1e6;
  }
  startProcessing() {
    this._startTime = process.hrtime();
  }
  stopProcessing() {
    this._endTime = process.hrtime();
  }
};

// src/lib/A-Request/A-Request.constants.ts
var A_RequestFeatures = {
  onError: "A_Request_onError",
  onInit: "A_Request_onInit",
  onAfterInit: "A_Request_onAfterInit",
  onParse: "A_Request_onParse",
  onValidate: "A_Request_onValidate",
  onClose: "A_Request_onClose",
  onAborted: "A_Request_onAborted",
  onTimeout: "A_Request_onTimeout",
  onData: "A_Request_onData",
  onEnd: "A_Request_onEnd",
  onBodyParse: "A_Request_onBodyParse",
  onQueryParse: "A_Request_onQueryParse",
  onParamsParse: "A_Request_onParamsParse",
  onCookiesParse: "A_Request_onCookiesParse"
};
var _A_HttpServerError = class _A_HttpServerError extends A_Error {
  /**
   * Gets the appropriate title for a given HTTP status code
   */
  static getHttpStatusTitle(status) {
    return this.HTTP_STATUS_TITLES[status] || "Unknown Error";
  }
  constructor(param1, param2) {
    switch (true) {
      // Pattern: new A_HttpServerError(404, 'The requested resource was not found')
      case (typeof param1 === "number" && typeof param2 === "string"):
        super({
          title: _A_HttpServerError.getHttpStatusTitle(param1),
          description: param2
        });
        this.status = param1;
        break;
      // Pattern: new A_HttpServerError(someErrorObject)
      case param1 instanceof Error:
        super(param1);
        this.status = 500;
        break;
      // Pattern: new A_HttpServerError({ status: 500, description: '...', originalError: ... })
      case (typeof param1 === "object" && param1 !== null && !(param1 instanceof Error)):
        const params = param1;
        if ("title" in params && params.title) {
          super(params);
          this.status = params.status || 500;
        } else {
          const title = params.status ? _A_HttpServerError.getHttpStatusTitle(params.status) : "Internal Server Error";
          super({
            title,
            description: params.description,
            code: params.code,
            scope: params.scope,
            link: params.link,
            originalError: params.originalError
          });
          this.status = params.status || 500;
        }
        break;
      default:
        throw new Error("Invalid parameters provided to A_HttpServerError constructor");
    }
  }
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
_A_HttpServerError.NotFoundErrorStatus = 404;
_A_HttpServerError.NotFoundError = "Resource Not Found";
_A_HttpServerError.InternalServerErrorStatus = 500;
_A_HttpServerError.InternalServerError = "Internal Server Error";
/**
 * HTTP status code to title mapping
 */
_A_HttpServerError.HTTP_STATUS_TITLES = {
  // 4xx Client Errors
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  // 5xx Server Errors
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};
var A_HttpServerError = _A_HttpServerError;
var A_RequestError = class extends A_Error {
};
A_RequestError.RequestBodyParsingError = "Unable to parse request body";
A_RequestError.FileUploadError = "File upload error";
A_RequestError.RequestTimeoutError = "Request timed out";
A_RequestError.InvalidRequestError = "Invalid request";
A_RequestError.MissingParametersError = "Missing required parameters";

// src/lib/A-Request/A-Request.helper.ts
var A_RequestHelper = class _A_RequestHelper {
  /**
   * Extract URL parameters from a URL using a route pattern
   * @param url - The actual URL to extract parameters from
   * @param routePattern - The route pattern with parameters (e.g., "/users/:id/posts/:postId")
   * @returns Object containing extracted parameters
   */
  static extractParams(url, routePattern) {
    const cleanUrl = url.split("?")[0];
    const cleanPattern = routePattern.split("?")[0];
    const urlSegments = cleanUrl.split("/").filter(Boolean);
    const patternSegments = cleanPattern.split("/").filter(Boolean);
    const params = {};
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const urlSegment = urlSegments[i];
      if (patternSegment.startsWith(":")) {
        const paramName = patternSegment.slice(1);
        if (urlSegment) {
          params[paramName] = decodeURIComponent(urlSegment);
        }
      } else if (patternSegment !== urlSegment) {
        return {};
      }
    }
    return params;
  }
  /**
   * Extract query parameters from URL
   * @param url - The URL to extract query parameters from
   * @returns Object containing query parameters
   */
  static extractQuery(url) {
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
  /**
   * Parse cookies from Cookie header
   */
  static parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      const value = rest.join("=");
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }
  /**
   * Parse request body based on Content-Type
   * 
   * 
   * @param context - The HTTP server request context
   * @returns Parsed body data and detected body type
   */
  static parseRequestBody(context) {
    let parsedBody;
    let bodyType;
    switch (true) {
      case (!!context.contentType && context.contentType.includes("application/json")):
        parsedBody = JSON.parse(context.data);
        bodyType = "json";
        break;
      case (!!context.contentType && context.contentType.includes("application/x-www-form-urlencoded")):
        parsedBody = _A_RequestHelper.parseFormUrlEncoded(context.data);
        bodyType = "form";
        break;
      case (!!context.contentType && context.contentType.includes("multipart/form-data")):
        const multipartResult = _A_RequestHelper.parseMultipartData(Buffer.concat(context.buffers), context.contentType);
        parsedBody = {
          ...multipartResult.fields,
          _files: multipartResult.files
        };
        bodyType = "multipart";
        break;
      case (!!context.contentType && context.contentType.includes("text/")):
        parsedBody = context.data;
        bodyType = "text";
        break;
      default:
        parsedBody = Buffer.concat(context.buffers);
        bodyType = "raw";
        break;
    }
    return {
      data: parsedBody,
      type: bodyType
    };
  }
  /**
   * Parse URL-encoded form data (application/x-www-form-urlencoded)
   * @param body - The URL-encoded body string
   * @returns Object containing form data
   */
  static parseFormUrlEncoded(body) {
    const result = {};
    if (!body) return result;
    const pairs = body.split("&");
    for (const pair of pairs) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      const decodedKey = decodeURIComponent(key.replace(/\+/g, " "));
      const decodedValue = decodeURIComponent(value.replace(/\+/g, " "));
      if (decodedKey in result) {
        const existing = result[decodedKey];
        if (Array.isArray(existing)) {
          existing.push(decodedValue);
        } else {
          result[decodedKey] = [existing, decodedValue];
        }
      } else {
        result[decodedKey] = decodedValue;
      }
    }
    return result;
  }
  /**
   * Parse multipart form data (for file uploads and form data)
   * @param buffer - The raw buffer containing multipart data
   * @param contentType - The content type header
   * @returns Object containing fields and files
   */
  static parseMultipartData(buffer, contentType) {
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      throw new A_RequestError(
        A_RequestError.RequestBodyParsingError,
        "Missing boundary in multipart/form-data content type"
      );
    }
    const boundary = "--" + boundaryMatch[1];
    const textData = buffer.toString();
    const parts = textData.split(boundary).filter((part) => part.trim() && !part.includes("--"));
    const fields = {};
    const files = [];
    parts.forEach((part) => {
      const [headers, content] = part.split("\r\n\r\n");
      if (!headers || content === void 0) return;
      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
      if (nameMatch) {
        const fieldName = nameMatch[1];
        const cleanContent = content.replace(/\r\n$/, "");
        if (filenameMatch) {
          const file = {
            fieldName,
            filename: filenameMatch[1],
            encoding: "binary",
            mimetype: contentTypeMatch?.[1] || "application/octet-stream",
            size: Buffer.byteLength(cleanContent),
            buffer: Buffer.from(cleanContent, "binary")
          };
          files.push(file);
        } else {
          fields[fieldName] = cleanContent;
        }
      }
    });
    return { fields, files };
  }
};

// src/lib/A-Request/A-Request.env.ts
var A_RequestEnvVariables = {
  /**
   * Default request timeout in milliseconds
   */
  A_SERVER_REQUEST_TIMEOUT: 5e3,
  /**
   * Maximum request body size in bytes
   */
  A_SERVER_REQUEST_MAX_BODY_SIZE: 10 * 1024 * 1024,
  // 10MB
  /**
   * Default request encoding
   */
  A_SERVER_REQUEST_DEFAULT_ENCODING: "utf8",
  /**
   * Enable automatic cookie parsing
   */
  A_SERVER_REQUEST_PARSE_COOKIES: true,
  /**
   * Enable automatic query parameter parsing
   */
  A_SERVER_REQUEST_PARSE_QUERY: true,
  /**
   * Enable automatic body parsing
   */
  A_SERVER_REQUEST_PARSE_BODY: true,
  /**
   * Enable file upload handling
   */
  A_SERVER_REQUEST_ENABLE_FILE_UPLOADS: false
};
var A_RequestEnvVariablesArray = Object.keys(A_RequestEnvVariables);
var _a, _b, _c, _d, _e, _f, _g;
var A_Request = class extends A_Entity {
  /**
   * A_Request - Comprehensive HTTP Request Processing Entity
   * 
   * This class provides a complete wrapper around Node.js IncomingMessage with advanced features:
   * - Automatic body parsing (JSON, form-data, multipart, raw)
   * - Cookie and session management
   * - File upload handling with easy access methods
   * - Request validation
   * - Middleware support
   * - Type-safe parameter extraction
   * - Request timing and metrics
   * 
   * @example
   * ```typescript
   * const request = new A_Request({
   *     id: 'req-123',
   *     request: incomingMessage,
   *     scope: 'api'
   * }, {
   *     enableFileUploads: true,
   *     maxBodySize: 50 * 1024 * 1024 // 50MB for file uploads
   * });
   * 
   * await request.init();
   * 
   * // Access parsed body
   * const userData = request.body;
   * 
   * // Get typed parameters
   * const userId = request.params.id;
   * 
   * // Handle file uploads
   * if (request.hasFiles()) {
   *     const avatar = request.getFile('avatar');
   *     if (avatar) {
   *         console.log(`Uploaded file: ${avatar.filename}`);
   *         console.log(`File size: ${avatar.size} bytes`);
   *         console.log(`File type: ${avatar.mimetype}`);
   *         
   *         // Access file buffer for processing
   *         const fileBuffer = avatar.buffer;
   *         // Save to disk, process, etc.
   *     }
   *     
   *     // Get all files for a specific field
   *     const documents = request.getFiles('documents');
   *     for (const doc of documents) {
   *         // Process each document...
   *     }
   * }
   * 
   * // Check specific files
   * if (request.hasFile('profilePicture')) {
   *     const pic = request.getFile('profilePicture');
   *     // Process profile picture...
   * }
   * ```
   */
  constructor(params, options) {
    super(params);
    // =============================================
    // Core Properties
    // =============================================
    /**
     * Request processing status
     */
    this._listeners = /* @__PURE__ */ new Map();
    this._options = {
      maxBodySize: 10 * 1024 * 1024,
      // 10MB default
      timeout: 3e4,
      // 30 seconds
      encoding: "utf8",
      parseCookies: true,
      parseQuery: true,
      parseBody: true,
      enableFileUploads: false,
      strictValidation: false,
      ...options || {}
    };
  }
  static get concept() {
    return "a-server";
  }
  /**
   * Creates A_Request entity from initialization data
   * 
   * @param newEntity 
   */
  fromNew(newEntity) {
    this.aseid = new ASEID({
      concept: this.constructor.concept,
      scope: newEntity.scope,
      entity: this.constructor.entity,
      shard: newEntity.shard,
      id: newEntity.id
    });
    this._req = newEntity.request;
  }
  /**
   * Core HTTP request object from Node.js
   */
  get original() {
    return this._req;
  }
  /**
   * Parsed request body data
   */
  get body() {
    return this._body;
  }
  /**
   * URL route parameters (e.g., /users/:id)
   */
  get params() {
    console.log("Extracting params using route definition:", this.url);
    console.log("Extracting params using route definition:", this._routeDefinition?.path);
    return A_RequestHelper.extractParams(
      this.url,
      this._routeDefinition?.path || ""
    );
  }
  /**
   * Query string parameters
   */
  get query() {
    return A_RequestHelper.extractQuery(this.url);
  }
  /**
   * Gets the parsed cookies
   */
  get cookies() {
    if (!this._cookies) {
      this._cookies = A_RequestHelper.parseCookies(this.headers["cookie"]);
    }
    return this._cookies;
  }
  /**
   * Gets the request URL
   */
  get url() {
    return this.original.url;
  }
  /**
   * Gets the HTTP method
   */
  get method() {
    return String(this.original.method).toUpperCase() || "DEFAULT";
  }
  /**
   * Gets the request headers
   */
  get headers() {
    return this.original.headers;
  }
  /**
   * Gets the timestamp when the request was started
   */
  get startedAt() {
    const timeId = A_IdentityHelper.parseTimeId(this.aseid.id.split("-")[0]);
    return timeId ? new Date(timeId.timestamp) : void 0;
  }
  /**
   * Gets uploaded files
   */
  get files() {
    return this._files || [];
  }
  /**
   * Gets user agent string
   */
  get userAgent() {
    return this.headers?.["user-agent"] || "";
  }
  /**
   * Gets content length
   */
  get contentLength() {
    return this.headers?.["content-length"] ? parseInt(this.headers["content-length"], 10) : 0;
  }
  /**
   * Check if request is secure (HTTPS)
   */
  get isSecure() {
    return this.original.socket && "encrypted" in this.original.socket;
  }
  /**
   * Check if request is from mobile device
   */
  get isMobile() {
    const userAgent = this._userAgent?.toLowerCase() || "";
    return /mobile|android|iphone|ipad|phone/i.test(userAgent);
  }
  /**
   * Get request size in bytes
   */
  get size() {
    return this._contentLength || 0;
  }
  /**
   * Gets content type from headers
   */
  get contentType() {
    return this.headers["content-type"] || void 0;
  }
  /**
   * Pipes request stream to destination
   */
  pipe(destination, options) {
    return this.original.pipe(destination, options);
  }
  /**
   * Get a file by field name
   */
  getFile(fieldName) {
    return this._files?.find((file) => file.fieldName === fieldName);
  }
  /**
   * Get all files for a specific field name
   */
  getFiles(fieldName) {
    return this._files?.filter((file) => file.fieldName === fieldName) || [];
  }
  /**
   * Check if request has any files
   */
  hasFiles() {
    return this._files && this._files.length > 0;
  }
  /**
   * Check if request has a file with specific field name
   */
  hasFile(fieldName) {
    return this._files?.some((file) => file.fieldName === fieldName) || false;
  }
  /**
   * Get total size of all uploaded files
   */
  getTotalFileSize() {
    return this._files?.reduce((total, file) => total + file.size, 0) || 0;
  }
  /**
   * Get a cookie value
   */
  getCookie(name) {
    return this._cookies[name];
  }
  /**
   * Check if request has a specific cookie
   */
  hasCookie(name) {
    return name in this._cookies;
  }
  /**
   * Check if request accepts specific content type
   */
  accepts(contentType) {
    const acceptHeader = this.headers.accept || "";
    return acceptHeader.includes(contentType) || acceptHeader.includes("*/*");
  }
  /**
   * Get request fingerprint for caching/identification
   */
  getFingerprint() {
    const components = [
      this.method,
      this.url,
      this._userAgent,
      JSON.stringify(this.body)
    ];
    return Buffer.from(components.join("|")).toString("base64");
  }
  // --------------------------------------------------------------------------   
  // A-Request Event-Emitter methods
  // --------------------------------------------------------------------------
  /**
   * Registers an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, /* @__PURE__ */ new Set());
    }
    this._listeners.get(event).add(listener);
  }
  /**
   * Removes an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  off(event, listener) {
    this._listeners.get(event)?.delete(listener);
  }
  /**
   * Emits an event to all registered listeners
   * 
   * @param event 
   */
  emit(event) {
    this._listeners.get(event)?.forEach(async (listener) => {
      listener(this);
    });
  }
  /**
   * Allows to use a route definition for this request
   * 
   * @param route 
   */
  useRoute(route) {
    this._routeDefinition = route;
  }
  clearTimeout() {
    this._timeout?.clear();
  }
  /**
   * Initialize the request - parse cookies, query, body etc.
   */
  async load() {
    try {
      await this.call(A_RequestFeatures.onInit);
      await new Promise((resolve, reject) => {
        const onData = this.handleData.bind(this);
        const onEnd = () => {
          cleanup();
          resolve();
        };
        const onError = (err) => {
          cleanup();
          reject(err);
        };
        const cleanup = () => {
          this.original.off("data", onData);
          this.original.off("end", onEnd);
          this.original.off("error", onError);
        };
        this.original.on("data", onData);
        this.original.on("end", onEnd);
        this.original.on("error", onError);
      });
      await this.handleEnd();
    } catch (error) {
      const targetError = error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 500,
        description: "An error occurred while processing the request.",
        originalError: error
      });
      await this.fail(targetError);
    }
    this.original.on("error", (err) => {
      this.fail(new A_HttpServerError({
        status: 500,
        description: `Request error: ${err.message}`,
        originalError: err
      }));
    });
  }
  async validate() {
    try {
      await this.call(A_RequestFeatures.onValidate);
    } catch (error) {
      const targetError = error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 400,
        description: ` Request Validation Failed: ${error instanceof A_Error ? error.message : "Invalid request."}`,
        originalError: error
      });
      await this.fail(targetError);
    }
  }
  /**
   * Destroy the request A-Entity with cleanup
   * 
   * @returns 
   */
  async destroy() {
    const targetError = A_Context.scope(this)?.resolve(A_Error);
    if (!this.original.destroyed) {
      this.original.destroy(targetError);
      this.original.removeAllListeners();
      this._listeners.clear();
      return super.destroy();
    }
  }
  /**
   * Handles request failure - registers error, emits event, and destroys request
   * 
   * [!] Destroys the request after handling the failure.
   * 
   * @param err 
   */
  async fail(err) {
    console.log("Request failed with error:", this.method, this.url, err?.message);
    if (err)
      A_Context.scope(this).register(err);
    this._timeout?.clear();
    await this.call(A_RequestFeatures.onError);
    await this.destroy();
  }
  // ======================================================================================
  // Internal handlers for request events
  // ======================================================================================
  /**
   * Internal helper method to handle incoming data chunks
   * It creates a new scope for each data chunk, inherits the parent scope,
   * and calls the onData feature with the new scope.
   * 
   * [!] This method ensures that each data chunk is processed in isolation, 
   * preventing side effects between chunks.
   * 
   * @param data 
   */
  async handleData(data) {
    const chunk = new A_HttpRequestData(data);
    const scope = new A_Scope({
      name: `${this.aseid.toString()}-data-chunk`,
      fragments: [chunk]
    }).inherit(A_Context.scope(this));
    try {
      scope.inherit(A_Context.scope(this));
      await this.call(A_RequestFeatures.onData, scope);
      scope.destroy();
    } catch (error) {
      scope.destroy();
      await this.fail(new A_HttpServerError({
        status: 500,
        description: `Request data chunk error: ${error instanceof A_Error ? error.message : "Unable to process request data chunk."}`,
        originalError: error
      }));
    }
  }
  /**
   * Handles request close event
   * 
   * This method is called when the request is closed prematurely.
   * It triggers the onClose feature and handles any errors that occur during processing.
   * 
   */
  async handleClose() {
    try {
      await this.call(A_RequestFeatures.onClose);
    } catch (error) {
      await this.fail(new A_HttpServerError({
        status: 499,
        description: `Request closed error: ${error instanceof A_Error ? error.message : "Request was closed."}`,
        originalError: error
      }));
    }
  }
  /**
   * Handles request end event
   * 
   * This method is called when the request has finished sending data.
   * It triggers the onEnd feature and handles any errors that occur during processing.
   */
  async handleEnd() {
    try {
      await this.call(A_RequestFeatures.onEnd);
    } catch (error) {
      await this.fail(new A_HttpServerError({
        status: 500,
        description: `Request processing error: ${error instanceof A_Error ? error.message : "Unable to process request."}`,
        originalError: error
      }));
    }
  }
  /**
   * Handles request timeout event
   * 
   * This method is called when the request processing exceeds the configured timeout.
   * It triggers the onTimeout feature and fails the request with a timeout error.
   */
  async handleTimeout() {
    try {
      await this.call(A_RequestFeatures.onTimeout);
      throw new A_HttpServerError({
        status: 503,
        description: `Request processing take too long and timed out. Current timeout is set to ${this._options.timeout} ms.`
      });
    } catch (error) {
      const targetError = error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 503,
        description: `Request timeout error: ${error instanceof A_Error ? error.message : "Request timed out."}`,
        originalError: error
      });
      await this.fail(targetError);
    }
  }
  /**
   * Hook called during initialization
   * 
   * Default Behavior: Starts request processing timer and sets up timeout handling.
   */
  async [_g = A_RequestFeatures.onInit](config, context, ...args) {
    context.startProcessing();
    const ms = Number(config?.get("A_SERVER_REQUEST_TIMEOUT") || A_RequestEnvVariables.A_SERVER_REQUEST_TIMEOUT);
    this._timeout = new A_ScheduleObject(ms, this.handleTimeout.bind(this), { resolveOnClear: true });
  }
  /**
   * Hook called on receiving data chunk
   * 
   * Default Behavior: Accumulates data chunks into context buffers and checks for max body size.
   */
  async [_f = A_RequestFeatures.onData](context, chunk, ...args) {
    if (context.length + chunk.length > this._options.maxBodySize) {
      throw new A_RequestError(
        A_RequestError.RequestBodyParsingError,
        `Request body too large. Max size is ${this._options.maxBodySize} bytes.`
      );
    }
    context.buffers.push(chunk.data);
    if (!context.data)
      context.data = "";
    context.data += chunk.toString(this._options.encoding);
  }
  /**
   * Hook called on request timeout
   * 
   * Default Behavior: Stops request processing and emits timeout event.
   * 
   * @param context 
   * @param args 
   */
  async [_e = A_RequestFeatures.onTimeout](context, ...args) {
    context.stopProcessing();
    this._timeout?.clear();
    this.emit(A_RequestFeatures.onTimeout);
  }
  /**
   * Hook called on request close
   */
  async [_d = A_RequestFeatures.onClose](context, ...args) {
    this.emit(A_RequestFeatures.onClose);
  }
  /**
   * Hook called on request error
   */
  async [_c = A_RequestFeatures.onError](error, context, ...args) {
    context.stopProcessing();
    this.emit(A_RequestFeatures.onError);
  }
  /**
   * Hook called to parse request data
   */
  async [_b = A_RequestFeatures.onEnd](config, context, ...args) {
    const { data, type } = A_RequestHelper.parseRequestBody(context);
    this._body = data;
    this._bodyType = type;
  }
  /**
   * Hook called to validate request data
   */
  async [_a = A_RequestFeatures.onValidate](context, ...args) {
    if (!!this.contentType && this.contentType.includes("multipart/form-data") && !this._options.enableFileUploads) {
      throw new A_HttpServerError({
        status: 400,
        description: "File uploads detected but not enabled. Set enableFileUploads: true in options."
      });
    }
  }
  /**
   * Serialize request for logging/debugging
   */
  toJSON() {
    return {
      ...super.toJSON(),
      method: this.method,
      url: this.url,
      headers: this.headers,
      params: this.params,
      query: this.query,
      cookies: this._cookies,
      userAgent: this.userAgent,
      bodyType: this._bodyType,
      body: this._body,
      filesCount: this._files?.length || 0,
      totalFileSize: this.getTotalFileSize()
    };
  }
};
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _g, 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext)),
  __decorateParam(1, A_Inject(A_HttpRequestData))
], A_Request.prototype, _f, 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _e, 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Inject(A_Error)),
  __decorateParam(1, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext))
], A_Request.prototype, _a, 1);

// src/lib/A-Request/A-Request.types.ts
var A_Request_Event = /* @__PURE__ */ ((A_Request_Event2) => {
  A_Request_Event2["Error"] = "error";
  A_Request_Event2["Finish"] = "finish";
  A_Request_Event2["Data"] = "data";
  A_Request_Event2["End"] = "end";
  A_Request_Event2["Close"] = "close";
  return A_Request_Event2;
})(A_Request_Event || {});

// src/lib/A-Response/A-Response.constants.ts
var A_ResponseFeatures = {
  /**
   * Event fired when an error occurs while sending the response
   */
  onError: "_A_Response_onError",
  /**
   * Event fired when the response is closed
   */
  onClose: "_A_Response_onClose",
  /**
   * Event fired when the response is finished
   */
  onFinish: "_A_Response_onFinish",
  /**
   * Event fired when the response is sent
   */
  onSend: "_A_Response_onSend",
  /**
   * Event fired when the response is redirected
   */
  onRedirect: "_A_Response_onRedirect"
};
var _a2, _b2, _c2;
var A_Response = class extends A_Entity {
  constructor(params, options) {
    super(params);
    /**
     * Event listeners map for A_Response events
     */
    this._listeners = /* @__PURE__ */ new Map();
    this._options = {
      autoCompress: true,
      compressionThreshold: 1024,
      // 1KB
      enableCaching: true,
      defaultCacheMaxAge: 3600,
      // 1 hour
      enableMetrics: true,
      enableEtag: true,
      enableLastModified: true,
      charset: "utf-8",
      defaultContentType: "application/json",
      maxRedirects: 5,
      enableCookies: true,
      enableSessions: true,
      ...options || {}
    };
  }
  // =============================================
  // Static Properties
  // =============================================
  static get namespace() {
    return "a-server";
  }
  /**
   * Initialize from new entity parameters
   */
  fromNew(newEntity) {
    this.aseid = new ASEID({
      concept: A_Context.root.name,
      scope: newEntity.scope,
      entity: this.constructor.entity,
      shard: newEntity.shard,
      id: newEntity.id
    });
    this._res = newEntity.response;
    this._data = /* @__PURE__ */ new Map();
    this._cookies = /* @__PURE__ */ new Map();
  }
  /**
   * Gets the response data map
   */
  get data() {
    return this._data;
  }
  /**
   * Gets the original ServerResponse object
   */
  get original() {
    return this._res;
  }
  /**
   * Gets whether headers have been sent
   */
  get headersSent() {
    return this.original.headersSent;
  }
  /**
   * Gets the current status code
   */
  get statusCode() {
    return this.original.statusCode;
  }
  /**
   * Gets response size in bytes
   */
  get size() {
    return this.original.getHeader("Content-Length") || 0;
  }
  // ======================================================================================
  // --------------------------------------------------------------------------
  // A-Response Primary Methods
  // --------------------------------------------------------------------------
  // ======================================================================================
  /**
   * Initialize the response
   */
  async load() {
    this.original.on("error", (err) => {
      this.fail(new A_HttpServerError({
        status: 500,
        description: `Request error: ${err.message}`,
        originalError: err
      }));
    });
  }
  /**
   * Destroy the response
   */
  async destroy() {
    if (!this.original.destroyed) {
      this.original.end();
      this._listeners.clear();
      this.original.removeAllListeners();
    }
    return super.destroy();
  }
  /**
   * Handle response failure with error details
   */
  async fail(err) {
    if (err)
      A_Context.scope(this).register(err);
    await this.call(A_ResponseFeatures.onError);
    await this.destroy();
  }
  /**
   * Send a plain text or JSON response
   */
  async send(data) {
    if (this.headersSent)
      return;
    try {
      this._dataOverride = data;
      await this.call(A_ResponseFeatures.onSend);
    } catch (error) {
      await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 500,
        description: "An error occurred while sending the response.",
        originalError: error
      }));
    }
  }
  /**
    * Stream response data
    */
  async stream(dataStream) {
    if (this.headersSent)
      return;
    try {
      return new Promise((resolve, reject) => {
        this.original.setHeader("Transfer-Encoding", "chunked");
        this.setDefaultResponseHeaders();
        this.setCookieHeaders();
        this.original.writeHead(this.statusCode);
        let stream;
        if (Array.isArray(dataStream)) {
          stream = new Readable({
            read() {
              if (dataStream.length > 0) {
                const chunk = dataStream.shift();
                this.push(typeof chunk === "string" ? chunk : JSON.stringify(chunk) + "\n");
              } else {
                this.push(null);
              }
            }
          });
        } else {
          stream = dataStream;
        }
        let bytesWritten = 0;
        stream.on("data", (chunk) => {
          bytesWritten += chunk.length;
        });
        stream.on("end", resolve);
        stream.on("error", reject);
        pipeline(stream, this.original, (error) => {
          if (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 500,
        description: "An error occurred while streaming the response. Unable to process the stream.",
        originalError: error
      }));
    }
  }
  /**
   * Redirect response
   * 
   * [!] Note: This method ends the response immediately.
   */
  async redirect(url) {
    if (this.headersSent)
      return;
    try {
      this._redirectURL = url;
      await this.call(A_ResponseFeatures.onRedirect);
    } catch (error) {
      await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
        status: 500,
        description: "An error occurred while redirecting the response.",
        originalError: error
      }));
    }
  }
  /**
   * Write head with status and headers
   */
  writeHead(statusCode, headers) {
    this.original.writeHead(statusCode, headers);
    return this;
  }
  /**
   * Set HTTP status code
   */
  status(code) {
    this.original.statusCode = code;
    return this;
  }
  /**
   * Set response header
   */
  setHeader(key, value) {
    this.original.setHeader(key, value);
    return this;
  }
  /**
   * Get response header
   */
  getHeader(key) {
    return this.original.getHeader(key);
  }
  /**
   * Remove response header
   */
  removeHeader(key) {
    this.original.removeHeader(key);
    return this;
  }
  /**
   * Set cookie
   */
  setCookie(name, value, options) {
    this._cookies.set(name, { value, options });
    return this;
  }
  /**
   * Clear cookie
   */
  clearCookie(name, options) {
    const clearOptions = {
      ...options,
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0
    };
    this._cookies.set(name, { value: "", options: clearOptions });
    return this;
  }
  // --------------------------------------------------------------------------
  // Response Data manipulation methods
  // --------------------------------------------------------------------------
  /**
   * Add data to response
   */
  add(key, data) {
    this._data.set(key, data);
    return this;
  }
  /**
   * Remove data from response
   */
  remove(key) {
    this._data.delete(key);
    return this;
  }
  /**
   * Get data from response
   */
  get(key) {
    return this._data.get(key);
  }
  /**
   * Check if response has data
   */
  has(key) {
    return this._data.has(key);
  }
  /**
   * Clear all response data
   */
  clear() {
    this._data.clear();
    return this;
  }
  // ======================================================================================
  // --------------------------------------------------------------------------
  // Internal handlers for request events
  // --------------------------------------------------------------------------
  // ======================================================================================
  /**
   * Handle response finish event
   * 
   * @returns 
   */
  handleFinish() {
    try {
      return this.call(A_ResponseFeatures.onFinish);
    } catch (error) {
      return this.fail(new A_HttpServerError({
        status: 500,
        description: `Response finish error: ${error instanceof A_Error ? error.message : "An error occurred while finishing the response."}`,
        originalError: error
      }));
    }
  }
  /**
   * Handle response close event
   */
  async handleClose() {
    try {
      await this.call(A_ResponseFeatures.onClose);
    } catch (error) {
      await this.fail(new A_HttpServerError({
        status: 499,
        description: "Client closed the connection before the response could be completed.",
        originalError: error
      }));
    }
  }
  // ======================================================================================
  // --------------------------------------------------------------------------   
  // A-Request Event-Emitter methods
  // --------------------------------------------------------------------------
  // ======================================================================================
  /**
   * Registers an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, /* @__PURE__ */ new Set());
    }
    this._listeners.get(event).add(listener);
  }
  /**
   * Removes an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  off(event, listener) {
    this._listeners.get(event)?.delete(listener);
  }
  /**
   * Emits an event to all registered listeners
   * 
   * @param event 
   */
  emit(event) {
    this._listeners.get(event)?.forEach(async (listener) => {
      listener(this);
    });
  }
  async [_c2 = A_ResponseFeatures.onSend](context, ...args) {
    const responseData = this._dataOverride || this.toResponse();
    switch (true) {
      case (!!responseData && typeof responseData === "object"):
        this.original.setHeader("Content-Type", `application/json; charset=${this._options.charset}`);
        this.setDefaultResponseHeaders();
        this.original.writeHead(this.statusCode);
        this.original.end(JSON.stringify(responseData));
        return;
      case (!!responseData && typeof responseData === "string"):
        this.original.setHeader("Content-Type", `text/plain; charset=${this._options.charset}`);
        this.setDefaultResponseHeaders();
        this.original.writeHead(this.statusCode);
        this.original.end(responseData);
        return;
      default:
        this.setDefaultResponseHeaders();
        this.original.writeHead(this.statusCode);
        this.original.end(responseData);
        return;
    }
  }
  async [_b2 = A_ResponseFeatures.onRedirect](context, ...args) {
    if (!this._redirectURL) return;
    this.original.setHeader("Location", this._redirectURL);
    if (!this.statusCode || (this.statusCode < 300 || this.statusCode > 399))
      this.status(301);
    this.original.end();
  }
  async [_a2 = A_ResponseFeatures.onError](error, context, request, ...args) {
    if (this.headersSent) {
      return;
    }
    const statusCode = error.status || 500;
    this.status(statusCode);
    const errorResponse = {
      error: {
        message: error.message,
        status: statusCode,
        description: error.description || ""
      }
    };
    this.setDefaultResponseHeaders();
    this.original.writeHead(this.statusCode);
    this.original.end(JSON.stringify(errorResponse));
  }
  // ======================================================================================
  // --------------------------------------------------------------------------
  // A-Response Helper Methods
  // --------------------------------------------------------------------------
  // ======================================================================================
  /**
  * Set standard response headers
  */
  setDefaultResponseHeaders() {
    this.original.setHeader("X-Content-Type-Options", "nosniff");
    this.original.setHeader("X-Frame-Options", "DENY");
    this.original.setHeader("X-XSS-Protection", "1; mode=block");
    this.original.setHeader("X-Request-ID", this.aseid.id);
  }
  /**
   * Set cookie headers
   */
  setCookieHeaders() {
    if (!this._options.enableCookies || this._cookies.size === 0) return;
    const cookieStrings = [];
    this._cookies.forEach(({ value, options }, name) => {
      let cookieString = `${name}=${encodeURIComponent(value)}`;
      if (options) {
        if (options.domain) cookieString += `; Domain=${options.domain}`;
        if (options.path) cookieString += `; Path=${options.path}`;
        if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
        if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
        if (options.httpOnly) cookieString += "; HttpOnly";
        if (options.secure) cookieString += "; Secure";
        if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
      }
      cookieStrings.push(cookieString);
    });
    this.original.setHeader("Set-Cookie", cookieStrings);
  }
  /**
   * Set cache headers
   */
  setCacheHeaders() {
    if (!this._cacheOptions) return;
    const cacheControl = [];
    if (this._cacheOptions.public) cacheControl.push("public");
    if (this._cacheOptions.private) cacheControl.push("private");
    if (this._cacheOptions.noCache) cacheControl.push("no-cache");
    if (this._cacheOptions.noStore) cacheControl.push("no-store");
    if (this._cacheOptions.mustRevalidate) cacheControl.push("must-revalidate");
    if (this._cacheOptions.proxyRevalidate) cacheControl.push("proxy-revalidate");
    if (this._cacheOptions.immutable) cacheControl.push("immutable");
    if (this._cacheOptions.maxAge !== void 0) {
      cacheControl.push(`max-age=${this._cacheOptions.maxAge}`);
    }
    if (this._cacheOptions.sMaxAge !== void 0) {
      cacheControl.push(`s-maxage=${this._cacheOptions.sMaxAge}`);
    }
    if (cacheControl.length > 0) {
      this.original.setHeader("Cache-Control", cacheControl.join(", "));
    }
    if (this._cacheOptions.etag) {
      this.original.setHeader("ETag", this._cacheOptions.etag);
    }
    if (this._cacheOptions.lastModified) {
      this.original.setHeader("Last-Modified", this._cacheOptions.lastModified.toUTCString());
    }
  }
  // ======================================================================================
  // --------------------------------------------------------------------------
  // A-Response Serialization Methods
  // --------------------------------------------------------------------------
  // ======================================================================================
  /**
   * Convert accumulated data to response object
   */
  toResponse() {
    const response = Array.from(this._data.entries()).reduce((acc, [key, value]) => {
      if (value instanceof A_Entity) {
        acc[key] = value.toJSON();
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
    return response;
  }
  /**
   * Enhanced JSON serialization for logging/debugging
   */
  toJSON() {
    return {
      ...super.toJSON(),
      status: this.statusCode,
      headersSent: this.headersSent,
      size: this.size,
      data: this.toResponse(),
      redirectURL: this._redirectURL
    };
  }
};
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext))
], A_Response.prototype, _c2, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerRequestContext))
], A_Response.prototype, _b2, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Inject(A_HttpServerError)),
  __decorateParam(1, A_Inject(A_HttpServerRequestContext)),
  __decorateParam(2, A_Inject(A_Request))
], A_Response.prototype, _a2, 1);
var A_ResponseError = class extends A_Error {
};

// src/lib/A-Server/A-HttpServer.constants.ts
var A_HttpServerFeatures = {
  onBeforeRequest: "_A_HTTPServer_onBeforeRequest",
  onRequest: "_A_HTTPServer_onRequest",
  onAfterRequest: "_A_HTTPServer_onAfterRequest"
};
var A_ServerRoute = class extends A_Route {
  constructor(param1, param2) {
    super(param1);
    this.url = param1 instanceof RegExp ? param1.source : param1;
    this.method = param2 || "GET";
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
var A_Server = class extends A_Fragment {
  constructor(params) {
    super(params);
    this._routes = [];
    this.port = params.port;
    this._name = params.name;
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
var A_ServerLogger = class extends A_Logger {
  logRequestFinish(request, response, context) {
    this.info("green", `Request ${request.method} ${request.url} finished with status ${response.statusCode} in ${context.processingTime ?? "N/A"}ms`);
  }
  logResponseError(request, response, context, error) {
    this.info("red", `Request ${request.method} ${request.url} errored with status ${response.statusCode} in ${context.processingTime ?? "N/A"}ms`);
    this.error(error);
  }
  logStop(server) {
    this.log("red", `Server ${server.name} stopped`);
  }
  serverReady(params) {
    const processId = process.pid;
    this.info(
      "cyan",
      ` ${params.app.name} v${params.app.version || "0.0.1"} is running on port ${params.port}`,
      ` Process ID: ${processId}`,
      ` Open In Browser: http://localhost:${params.port}`,
      ``,
      `-------------------------------`,
      ` ==============================`,
      `          LISTENING...      `,
      ` ==============================`
    );
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
    name: A_ResponseFeatures.onSend,
    scope: [A_Response]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_HttpServerRequestContext))
], A_ServerLogger.prototype, "logRequestFinish", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ResponseFeatures.onError,
    scope: [A_Response]
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_HttpServerRequestContext)),
  __decorateParam(3, A_Inject(A_Error))
], A_ServerLogger.prototype, "logResponseError", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_ServiceFeatures.onAfterStop,
    scope: [A_Service]
  }),
  __decorateParam(0, A_Inject(A_Server))
], A_ServerLogger.prototype, "logStop", 1);
var _a3, _b3, _c3, _d2, _e2;
var A_HttpServer = class extends A_Service {
  static get onBeforeRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onBeforeRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  static get onAfterRequest() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_HttpServerFeatures.onAfterRequest,
        scope: [target.constructor]
      })(target, propertyKey, descriptor);
    };
  }
  async [_e2 = A_ServiceFeatures.onStart](polyfill, config) {
    const http = await polyfill.http();
    this.server = http.createServer(this.handleRequest.bind(this));
    await this.listen(config.get("A_SERVER_PORT"));
  }
  async [_d2 = A_ServiceFeatures.onAfterStart](config, logger) {
    logger.serverReady({
      port: config.get("A_SERVER_PORT"),
      app: {
        name: this.scope.name
      }
    });
  }
  async [A_ServiceFeatures.onStop](...args) {
    await this.close();
  }
  close() {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        resolve();
      });
    });
  }
  listen(port) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => {
        resolve();
      });
    });
  }
  async [_c3 = A_HttpServerFeatures.onBeforeRequest](...args) {
  }
  async [_b3 = A_HttpServerFeatures.onRequest](...args) {
  }
  async [_a3 = A_HttpServerFeatures.onAfterRequest](...args) {
  }
  // ======================================================================================
  // ============================= A_HttpServer Methods =================================
  // ======================================================================================
  async handleRequest(request, response) {
    const route = new A_ServerRoute(
      request.url || "",
      request.method
    );
    const id = A_IdentityHelper.generateTimeId();
    const shard = `${request.method}-${route.path.replace("/", "-")}`;
    const req = new A_Request({ id, shard, request, scope: this.scope.name });
    const res = new A_Response({ id, shard, response, scope: this.scope.name });
    const context = new A_HttpServerRequestContext(request, response);
    const scope = new A_Scope({
      name: id,
      entities: [req, res],
      fragments: [route, context]
    }).inherit(this.scope);
    try {
      const onBeforeRequestFeature = new A_Feature({
        name: A_HttpServerFeatures.onBeforeRequest,
        component: this
      });
      const onRequestFeature = new A_Feature({
        name: A_HttpServerFeatures.onRequest,
        component: this
      });
      const onAfterRequestFeature = new A_Feature({
        name: A_HttpServerFeatures.onAfterRequest,
        component: this
      });
      await new Promise(async (resolve, reject) => {
        const cleanup = () => {
          onBeforeRequestFeature.interrupt();
          onRequestFeature.interrupt();
          onAfterRequestFeature.interrupt();
          req.off(A_RequestFeatures.onError, cleanup);
          req.off(A_RequestFeatures.onClose, cleanup);
          req.off(A_RequestFeatures.onTimeout, cleanup);
          reject(scope.resolve(A_Error));
        };
        req.on(A_RequestFeatures.onError, cleanup.bind(this));
        req.on(A_RequestFeatures.onClose, cleanup.bind(this));
        try {
          await req.load();
          await res.load();
          await onBeforeRequestFeature.process(scope);
          await onRequestFeature.process(scope);
          await onAfterRequestFeature.process(scope);
          req.clearTimeout();
          await res.status(200).send();
          resolve();
        } catch (error) {
          req.clearTimeout();
          reject(error);
        }
      });
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_HttpServerError:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_HttpServerError):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_HttpServerError({
            status: 500,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await res.fail(wrappedError);
      await this.call(A_ServiceFeatures.onError, scope);
    }
    scope.destroy();
  }
};
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_Polyfill)),
  __decorateParam(1, A_Dependency.Required()),
  __decorateParam(1, A_Inject(A_Config))
], A_HttpServer.prototype, _e2, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_ServerLogger))
], A_HttpServer.prototype, _d2, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _c3, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _b3, 1);
__decorateClass([
  A_Feature.Extend()
], A_HttpServer.prototype, _a3, 1);
var A_ServerError = class extends A_Error {
  constructor() {
    super(...arguments);
    this.status = 500;
  }
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

// src/lib/A-ServerRoute/A-ServerRoute.constants.ts
var A_ServerRouteHttpMethods = {
  DEFAULT: "DEFAULT",
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
  CONNECT: "CONNECT",
  TRACE: "TRACE"
};
var A_ServerRouteProtocols = {
  HTTP: "http",
  HTTPS: "https",
  WS: "ws",
  WSS: "wss"
};

// src/lib/A-ServerRouter/A-ServerRouter.constants.ts
var A_ServerRouterMetaKeys = {
  ROUTES: "_A_ServerRouterMeta_ROUTES",
  ROUTES_CONFIGS: "_A_ServerRouterMeta_ROUTES_CONFIGS"
};

// src/lib/A-ServerRouter/A-ServerRouter.meta.ts
var A_ServerRouterMeta = class extends A_ComponentMeta {
  get routes() {
    return this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
  }
  get definitions() {
    return this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
  }
  addRoute(regexp, route) {
    const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.set(regexp.source, route);
    this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    existingRoutesConfigs.push(route.route);
    this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
  removeRoute(route) {
    const existingRoutes = this.meta.get(A_ServerRouterMetaKeys.ROUTES) || /* @__PURE__ */ new Map();
    existingRoutes.forEach((value, key) => {
      if (value.route === route) {
        existingRoutes.delete(key);
      }
    });
    this.meta.set(A_ServerRouterMetaKeys.ROUTES, existingRoutes);
    const existingRoutesConfigs = this.meta.get(A_ServerRouterMetaKeys.ROUTES_CONFIGS) || [];
    const index = existingRoutesConfigs.indexOf(route);
    if (index !== -1) {
      existingRoutesConfigs.splice(index, 1);
    }
    this.meta.set(A_ServerRouterMetaKeys.ROUTES_CONFIGS, existingRoutesConfigs);
  }
};
function A_ServerRouterDefineDecorator(route) {
  return function(target, propertyKey, descriptor) {
    const meta = A_Context.meta(A_ServerRouter);
    const searchKey = route.toAFeatureExtension(["A_ServerRouter", "A_Service"]);
    meta.addRoute(searchKey, {
      component: target,
      handler: propertyKey,
      route
    });
    A_Feature_Define({
      name: searchKey.source,
      invoke: false
    })(target, propertyKey, descriptor);
    return A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
  };
}

// src/lib/A-ServerRouter/A-ServerRouter.component.ts
var A_ServerRouter = class extends A_Component {
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
      method: A_ServerRouteHttpMethods.POST,
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
      method: A_ServerRouteHttpMethods.GET,
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
      method: A_ServerRouteHttpMethods.PUT,
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
      method: A_ServerRouteHttpMethods.DELETE,
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
      method: A_ServerRouteHttpMethods.PATCH,
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
      method: A_ServerRouteHttpMethods.DEFAULT,
      path: typeof path === "object" && "path" in path ? path.path : path,
      version: typeof path === "object" && "version" in path && path.version ? path.version : "v1",
      prefix: typeof path === "object" && "prefix" in path && path.prefix ? path.prefix : "api"
    });
  }
  // static routes: Array<A_ServerRoute> = [];
  /**
   * Private method to have the same signature for all route methods
   * 
   * @param method 
   * @param path 
   * @returns 
   */
  static defineRoute(config) {
    const route = typeof config.path === "string" || config.path instanceof RegExp ? new A_ServerRoute(
      `/${config.prefix}/${config.version}${config.path instanceof RegExp ? config.path.source : config.path.startsWith("/") ? config.path : `/${config.path}`}`,
      config.method
    ) : config.path;
    return A_ServerRouterDefineDecorator(route);
  }
  async load(logger) {
    const meta = A_Context.meta(this.constructor);
    const routes = meta.routes;
    if (!routes || !routes.length) {
      logger.warning("yellow", `No routes defined for ${this.constructor.name}`);
      return;
    }
    logger.info(
      "cyan",
      `Registered Routes:`,
      `------------------------------------
`,
      ...routes.map((route) => `[${route.method.toUpperCase()}]${" ".repeat(7 - route.method.length)} ${route.path}`)
    );
  }
  async identifyRoute(request, response, scope, config, logger, route) {
    if (route.method === "OPTIONS") {
      return;
    }
    const feature = new A_Feature({ name: route.toString(), component: this });
    if (!feature.size)
      throw new A_HttpServerError({
        status: 404,
        title: "Route Not Found",
        description: `No route found for ${request.method} ${request.url}`
      });
    for (const stage of feature) {
      const targetConstructor = stage.definition.dependency.target;
      if (A_TypeGuards.isComponentConstructor(targetConstructor)) {
        const meta = A_Context.meta(this.constructor);
        const routeDefinitions = meta.definitions;
        const routeDefinition = routeDefinitions?.get(stage.definition.name || "");
        if (routeDefinition) {
          request.useRoute(routeDefinition.route);
        }
      }
      const stageScope = new A_Scope({
        name: `a-route--${request.id}--${stage.definition.name}`
      }, {
        parent: scope
      });
      await stage.process(stageScope);
    }
  }
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_ServerLogger))
], A_ServerRouter.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_HttpServerFeatures.onRequest
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Config)),
  __decorateParam(4, A_Inject(A_Logger)),
  __decorateParam(5, A_Inject(A_ServerRoute))
], A_ServerRouter.prototype, "identifyRoute", 1);
A_ServerRouter = __decorateClass([
  A_Meta.Define(A_ServerRouterMeta)
], A_ServerRouter);

// src/lib/A-ServerController/A-ServerController.component.ts
var A_ServerController = class extends A_Component {
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
  A_ServerRouter.Post({
    path: "/:component/:operation",
    version: "v1",
    prefix: "a-component"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_ServerController.prototype, "callEntityMethod", 1);
var A_ServerEntityList = class extends A_Entity {
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

// src/lib/A-ServerEntityList/A-EntityList.types.ts
var A_SERVER_TYPES__A_EntityListEvent = /* @__PURE__ */ ((A_SERVER_TYPES__A_EntityListEvent2) => {
  A_SERVER_TYPES__A_EntityListEvent2["Load"] = "load";
  return A_SERVER_TYPES__A_EntityListEvent2;
})(A_SERVER_TYPES__A_EntityListEvent || {});
var A_ServerListQueryFilter = class extends A_Fragment {
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

// src/lib/A-ServerLogger/A-ServerLogger.constants.ts
var A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES = {
  // ----------------------------------------------------------
  // A-ServerLogger Environment Variables
  // ----------------------------------------------------------
  // These environment variables are used by A-Concept core to configure the application
  // ----------------------------------------------------------
  /**
   * Enable logging of 200 responses
   */
  SERVER_IGNORE_LOG_200: "SERVER_IGNORE_LOG_200",
  /**
   * Enable logging of 404 responses
   */
  SERVER_IGNORE_LOG_404: "SERVER_IGNORE_LOG_404",
  /**
   * Enable logging of 500 responses
   */
  SERVER_IGNORE_LOG_500: "SERVER_IGNORE_LOG_500",
  /**
   * Enable logging of 400 responses
   */
  SERVER_IGNORE_LOG_400: "SERVER_IGNORE_LOG_400",
  /**
   * Enable logging of default responses
   */
  SERVER_IGNORE_LOG_DEFAULT: "SERVER_IGNORE_LOG_DEFAULT"
};
var A_ServerMiddleware = class extends A_Component {
  // static get features() {
  //     // return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  //     //     return A_Feature.Extend({
  //     //         name: A_ServerMiddlewareFeatures.onBeforeInit,
  //     //         scope: [target.constructor],
  //     //     })(target, propertyKey, descriptor);
  //     // }
  // }
};

// src/lib/A-ServerProxy/A-ServerProxy.constants.ts
var PROXY_CONFIG_DEFAULTS = {
  path: "/",
  hostname: "localhost",
  port: 80,
  method: "GET",
  headers: {},
  protocol: "http"
};

// src/lib/A-ServerProxy/A-ServerProxy.context.ts
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
        route: new A_ServerRoute(prepared.path, prepared.method),
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
var A_ServerProxy = class extends A_Component {
  async load(logger, config) {
    logger.info(
      "green",
      `Proxy routes configured:`,
      ...config.configs.map((c) => `${c.route.toString()} -> ${c.protocol}//${c.hostname}:${c.port}`)
    );
  }
  async onRequest(req, res, proxyConfig, logger, polyfill, feature) {
    return new Promise(async (resolve, reject) => {
      const { method, url } = req;
      const route = new A_ServerRoute(url, method);
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
      feature.interrupt();
    });
  }
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Logger)),
  __decorateParam(1, A_Inject(A_ProxyConfig))
], A_ServerProxy.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_HttpServerFeatures.onRequest,
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_ProxyConfig)),
  __decorateParam(3, A_Inject(A_Logger)),
  __decorateParam(4, A_Inject(A_Polyfill)),
  __decorateParam(5, A_Inject(A_Feature))
], A_ServerProxy.prototype, "onRequest", 1);
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
    return alias ? !!alias.directory : false;
  }
  /**
   * Gets the directory for a given path if configured (legacy method)
   * 
   * @param path 
   * @returns 
   */
  get(path) {
    const alias = this.findMatchingAlias(path);
    return alias ? alias.directory : void 0;
  }
};
var _a4;
var A_StaticLoader = class extends A_Component {
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
  async [_a4 = A_HttpServerFeatures.onRequest](req, res, logger, config, polyfill) {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return;
    }
    const { method, url } = req;
    const route = new A_ServerRoute(url, method);
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
      throw new A_HttpServerError({
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
              reject(new A_HttpServerError({
                status: 500,
                title: "File Stream Error",
                description: `Error reading file stream for ${filePath}: ${err.message}`,
                originalError: err
              }));
            });
          } else {
            reject(new A_HttpServerError({
              status: 500,
              title: "Response Stream Error",
              description: `Unable to pipe file stream for ${filePath}`
            }));
          }
        } else {
          reject(new A_HttpServerError({
            status: 404,
            title: "File Not Found",
            description: `File not found: ${filePath}`
          }));
        }
      } catch (error) {
        logger.error(`Error serving file: ${error.message}`);
        reject(new A_HttpServerError({
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
};
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Logger)),
  __decorateParam(1, A_Inject(A_StaticConfig)),
  __decorateParam(2, A_Inject(A_Polyfill))
], A_StaticLoader.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Logger)),
  __decorateParam(3, A_Inject(A_StaticConfig)),
  __decorateParam(4, A_Inject(A_Polyfill))
], A_StaticLoader.prototype, _a4, 1);

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

export { A_HttpRequestData, A_HttpServer, A_HttpServerError, A_HttpServerFeatures, A_HttpServerRequestContext, A_ProxyConfig, A_Request, A_RequestEnvVariables, A_RequestEnvVariablesArray, A_RequestError, A_RequestFeatures, A_RequestHelper, A_Request_Event, A_Response, A_ResponseError, A_ResponseFeatures, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_SERVER_TYPES__A_EntityListEvent, A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES, A_Server, A_ServerController, A_ServerEntityList, A_ServerError, A_ServerListQueryFilter, A_ServerLogger, A_ServerMiddleware, A_ServerProxy, A_ServerRoute, A_ServerRouteHttpMethods, A_ServerRouteProtocols, A_ServerRouter, A_ServerRouterDefineDecorator, A_ServerRouterMeta, A_ServerRouterMetaKeys, A_StaticConfig, A_StaticLoader, PROXY_CONFIG_DEFAULTS };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map