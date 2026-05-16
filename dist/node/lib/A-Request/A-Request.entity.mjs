import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Entity, ASEID, A_IdentityHelper, A_Error, A_Context, A_Scope, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_HttpServerError } from '@adaas/a-server/server/A-HttpServer.error';
import { A_RequestFeatures } from './A-Request.constants';
import { A_RequestHelper } from './A-Request.helper';
import { A_RequestEnvVariables } from './A-Request.env';
import { A_HttpServerRequestContext } from './A-HttpServerRequest.context';
import { A_HttpRequestData } from './A-HttpRequestData.context';
import { A_RequestError } from './A-Request.error';
import { A_ScheduleObject } from '@adaas/a-utils/a-schedule';
import { A_Config } from '@adaas/a-utils/a-config';

var _a, _b, _c, _d, _e, _f, _g;
class A_Request extends A_Entity {
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
}
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

export { A_Request };
//# sourceMappingURL=A-Request.entity.mjs.map
//# sourceMappingURL=A-Request.entity.mjs.map