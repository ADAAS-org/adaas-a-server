'use strict';

var aConcept = require('@adaas/a-concept');
var stream = require('stream');
var AResponse_constants = require('./A-Response.constants');
var AHttpServer_error = require('@adaas/a-server/server/A-HttpServer.error');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AHttpServerRequest_context = require('@adaas/a-server/request/A-HttpServerRequest.context');

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
var _a, _b, _c;
class A_Response extends aConcept.A_Entity {
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
    this.aseid = new aConcept.ASEID({
      concept: aConcept.A_Context.root.name,
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
      this.fail(new AHttpServer_error.A_HttpServerError({
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
      aConcept.A_Context.scope(this).register(err);
    await this.call(AResponse_constants.A_ResponseFeatures.onError);
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
      await this.call(AResponse_constants.A_ResponseFeatures.onSend);
    } catch (error) {
      await this.fail(error instanceof AHttpServer_error.A_HttpServerError ? error : new AHttpServer_error.A_HttpServerError({
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
        let stream$1;
        if (Array.isArray(dataStream)) {
          stream$1 = new stream.Readable({
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
          stream$1 = dataStream;
        }
        let bytesWritten = 0;
        stream$1.on("data", (chunk) => {
          bytesWritten += chunk.length;
        });
        stream$1.on("end", resolve);
        stream$1.on("error", reject);
        stream.pipeline(stream$1, this.original, (error) => {
          if (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      await this.fail(error instanceof AHttpServer_error.A_HttpServerError ? error : new AHttpServer_error.A_HttpServerError({
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
      await this.call(AResponse_constants.A_ResponseFeatures.onRedirect);
    } catch (error) {
      await this.fail(error instanceof AHttpServer_error.A_HttpServerError ? error : new AHttpServer_error.A_HttpServerError({
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
      return this.call(AResponse_constants.A_ResponseFeatures.onFinish);
    } catch (error) {
      return this.fail(new AHttpServer_error.A_HttpServerError({
        status: 500,
        description: `Response finish error: ${error instanceof aConcept.A_Error ? error.message : "An error occurred while finishing the response."}`,
        originalError: error
      }));
    }
  }
  /**
   * Handle response close event
   */
  async handleClose() {
    try {
      await this.call(AResponse_constants.A_ResponseFeatures.onClose);
    } catch (error) {
      await this.fail(new AHttpServer_error.A_HttpServerError({
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
  async [_c = AResponse_constants.A_ResponseFeatures.onSend](context, ...args) {
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
  async [_b = AResponse_constants.A_ResponseFeatures.onRedirect](context, ...args) {
    if (!this._redirectURL) return;
    this.original.setHeader("Location", this._redirectURL);
    if (!this.statusCode || (this.statusCode < 300 || this.statusCode > 399))
      this.status(301);
    this.original.end();
  }
  async [_a = AResponse_constants.A_ResponseFeatures.onError](error, context, request, ...args) {
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
      if (value instanceof aConcept.A_Entity) {
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
}
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(AHttpServerRequest_context.A_HttpServerRequestContext))
], A_Response.prototype, _c);
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(AHttpServerRequest_context.A_HttpServerRequestContext))
], A_Response.prototype, _b);
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(AHttpServer_error.A_HttpServerError)),
  __decorateParam(1, aConcept.A_Inject(AHttpServerRequest_context.A_HttpServerRequestContext)),
  __decorateParam(2, aConcept.A_Inject(ARequest_entity.A_Request))
], A_Response.prototype, _a);

exports.A_Response = A_Response;
//# sourceMappingURL=A-Response.entity.js.map
//# sourceMappingURL=A-Response.entity.js.map