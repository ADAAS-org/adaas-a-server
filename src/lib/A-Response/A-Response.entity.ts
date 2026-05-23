import {
    A_Context,
    A_Entity,
    A_Error,
    A_Feature,
    A_Inject,
    ASEID,
} from "@adaas/a-concept";
import type {
    IncomingHttpHeaders,
    ServerResponse
} from "http";
import {
    A_Response_Constructor,
    A_Response_CacheOptions,
    A_Response_Options,
    A_Response_Serialized,
    A_Response_CookieOptions,
    A_ResponseFeatureNames,
} from "./A-Response.types";
import { pipeline, Readable } from 'stream';
import { A_ResponseFeatures } from "./A-Response.constants";
import { A_Response_Listener } from "./A-Response.types";
import { A_HttpServerError } from "@adaas/a-server/server/A-HttpServer.error";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_HttpServerRequestContext } from "@adaas/a-server/request/A-HttpServerRequest.context";

/**
 * A_Response - Comprehensive HTTP Response Processing Entity
 * 
 * This class provides a complete wrapper around Node.js ServerResponse with advanced features:
 * - Response data accumulation and value management
 * - Error collection and standardized error responses
 * - Response streaming with progress tracking
 * - Template rendering and view engine support
 * - Cookie management and secure cookie handling
 * - Response compression (gzip, deflate, brotli)
 * - File downloads and static file serving
 * - Response caching and ETags
 * - Performance metrics and timing
 * - Response validation and content negotiation
 * 
 * @example
 */
export class A_Response<_ResponseType = any> extends A_Entity<
    A_Response_Constructor,
    A_Response_Serialized<_ResponseType>
> {

    // =============================================
    // Static Properties
    // =============================================
    static get namespace(): string {
        return 'a-server';
    }

    // =============================================
    // Core Properties
    // =============================================
    /**
     * Original ServerResponse object
     */
    private _res!: ServerResponse;
    /**
     * Internal object to store all response data
     */
    private _data!: Map<string, _ResponseType>;
    /**
     * uses in case the response isn't an object 
     */
    private _dataOverride?: _ResponseType
    /**
     * Redirect URL for handling redirects
     */
    private _redirectURL?: string;
    /**
     * Cookies map for managing response cookies
     */
    private _cookies!: Map<string, { value: string, options?: A_Response_CookieOptions }>;
    /**
     * Indicates if the response has finished
     */
    private _cacheOptions?: A_Response_CacheOptions;
    /**
     * Indicates if the response has finished
     */
    private _options!: Required<A_Response_Options>
    /**
     * Event listeners map for A_Response events
     */
    private _listeners: Map<A_ResponseFeatureNames, Set<A_Response_Listener>> = new Map();
    /**
     * Whether this response is operating as a persistent SSE stream
     */
    private _isStreaming: boolean = false;


    constructor(params: A_Response_Constructor, options?: A_Response_Options) {
        super(params);
        this._options = {
            autoCompress: true,
            compressionThreshold: 1024, // 1KB
            enableCaching: true,
            defaultCacheMaxAge: 3600, // 1 hour
            enableMetrics: true,
            enableEtag: true,
            enableLastModified: true,
            charset: 'utf-8',
            defaultContentType: 'application/json',
            maxRedirects: 5,
            enableCookies: true,
            enableSessions: true,
            ...(options || {})
        };
    }

    /**
     * Initialize from new entity parameters
     */
    fromNew(newEntity: A_Response_Constructor): void {
        this.aseid = new ASEID({
            concept: A_Context.root.name,
            scope: newEntity.scope,
            entity: (this.constructor as typeof A_Response).entity,
            shard: newEntity.shard,
            id: newEntity.id
        });

        this._res = newEntity.response;
        this._data = new Map<string, _ResponseType>();
        this._cookies = new Map<string, { value: string, options?: A_Response_CookieOptions }>();


    }
    /**
     * Gets the response data map
     */
    get data(): Map<string, _ResponseType> {
        return this._data;
    }
    /**
     * Gets the original ServerResponse object
     */
    get original(): ServerResponse {
        return this._res;
    }
    /**
     * Gets whether headers have been sent
     */
    get headersSent(): boolean {
        return this.original.headersSent;
    }
    /**
     * Gets the current status code
     */
    get statusCode(): number {
        return this.original.statusCode;
    }
    /**
     * Gets response size in bytes
     */
    get size(): number {
        return this.original.getHeader('Content-Length') as number || 0;
    }
    /**
     * Whether this response is in SSE streaming mode.
     * When true the server container will NOT auto-send and destroy() will
     * leave the underlying socket open.
     */
    get isStreaming(): boolean {
        return this._isStreaming;
    }

    // ======================================================================================
    // --------------------------------------------------------------------------
    // A-Response Primary Methods
    // --------------------------------------------------------------------------
    // ======================================================================================
    /**
     * Initialize the response
     */
    async load(): Promise<void> {

        // Track response completion
        // this.original.on('finish', this.handleFinish.bind(this));

        // this.original.on('close', this.handleClose.bind(this));


        this.original.on('error', err => {
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
    async destroy(): Promise<any> {

        if (!this._isStreaming) {
            // Only call end() if not already ended — avoids double-end which can
            // interrupt an in-flight response body on keep-alive connections.
            if (!this.original.writableEnded) {
                this.original.end();
            }

            this._listeners.clear();

            // Remove only the 'error' listener we added in load().
            // Do NOT call removeAllListeners() — that strips Node.js HTTP's own
            // internal keep-alive 'finish' handler, causing the socket to never
            // re-enter the server's connection pool and hanging all subsequent
            // requests on the same keep-alive connection.
            this.original.removeAllListeners('error');
        }

        return super.destroy();
    }
    /**
     * Handle response failure with error details
     */
    async fail(err?: A_HttpServerError): Promise<void> {
        if (err)
            A_Context
                .scope(this)
                .register(err);

        await this.call(A_ResponseFeatures.onError);

        await this.destroy();
    }
    /**
     * Send a plain text or JSON response
     */
    async send(data?: any): Promise<void> {
        if (this.headersSent)
            return;

        try {
            this._dataOverride = data;

            await this.call(A_ResponseFeatures.onSend);

        } catch (error) {
            await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
                status: 500,
                description: 'An error occurred while sending the response.',
                originalError: error
            }));
        }
    }
    /**
      * Stream response data
      */
    public async stream(
        dataStream: Readable | any[]
    ): Promise<void> {
        if (this.headersSent)
            return;

        try {
            return new Promise((resolve, reject) => {
                this.original.setHeader('Transfer-Encoding', 'chunked');
                this.setDefaultResponseHeaders();
                this.setCookieHeaders();
                this.original.writeHead(this.statusCode);

                let stream: Readable;

                if (Array.isArray(dataStream)) {
                    // Convert array to readable stream
                    stream = new Readable({
                        read() {
                            if (dataStream.length > 0) {
                                const chunk = dataStream.shift();
                                this.push(typeof chunk === 'string' ? chunk : JSON.stringify(chunk) + '\n');
                            } else {
                                this.push(null);
                            }
                        }
                    });
                } else {
                    stream = dataStream;
                }

                let bytesWritten = 0;

                stream.on('data', (chunk) => {
                    bytesWritten += chunk.length;
                });

                stream.on('end', resolve);

                stream.on('error', reject);

                pipeline(stream, this.original, (error) => {
                    if (error) {
                        reject(error);
                    }
                });

            });
        } catch (error) {
            await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
                status: 500,
                description: 'An error occurred while streaming the response. Unable to process the stream.',
                originalError: error
            }));
        }
    }
    /**
     * Redirect response
     * 
     * [!] Note: This method ends the response immediately.
     */
    public async redirect(
        url: string
    ): Promise<void> {
        if (this.headersSent)
            return;

        try {
            this._redirectURL = url;

            await this.call(A_ResponseFeatures.onRedirect);

        } catch (error) {
            await this.fail(error instanceof A_HttpServerError ? error : new A_HttpServerError({
                status: 500,
                description: 'An error occurred while redirecting the response.',
                originalError: error
            }));
        }
    }
    // ======================================================================================
    // --------------------------------------------------------------------------
    // A-Response SSE (Server-Sent Events) Methods
    // --------------------------------------------------------------------------
    // ======================================================================================
    /**
     * Upgrade this response to a persistent SSE stream.
     * Sends the required headers and writes the initial `:ok` comment to flush
     * the connection. After calling this the response will NOT be auto-closed
     * by the server container or by destroy().
     */
    public sseOpen(): void {
        if (this.headersSent || this._isStreaming) return;
        this._isStreaming = true;
        this.original.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        this.original.write(':ok\n\n');
        // Reset streaming flag when the client disconnects
        this.original.once('close', () => {
            this._isStreaming = false;
        });
    }
    /**
     * Write a named SSE event onto the open stream.
     * Format: `event: <name>\ndata: <JSON>\n\n`
     *
     * Compatible with browser EventSource `addEventListener(name, handler)`.
     *
     * @returns false when the channel is no longer writable
     */
    public sseWrite(event: string, data?: any): boolean {
        if (!this._isStreaming || this.original.destroyed) return false;
        try {
            return this.original.write(`event: ${event}\ndata: ${JSON.stringify(data ?? {})}\n\n`);
        } catch {
            return false;
        }
    }
    /**
     * Close the SSE stream gracefully.
     */
    public sseClose(): void {
        if (!this._isStreaming || this.original.destroyed) return;
        this._isStreaming = false;
        this.original.end();
    }
    /**
     * Write head with status and headers
     */
    public writeHead(statusCode: number, headers?: Record<string, string> | IncomingHttpHeaders | any): this {
        this.original.writeHead(statusCode, headers);
        return this;
    }
    /**
     * Set HTTP status code
     */
    public status(code: number): this {
        this.original.statusCode = code;
        return this;
    }
    /**
     * Set response header
     */
    public setHeader(key: string, value: string | number | string[]): this {
        this.original.setHeader(key, value);
        return this;
    }
    /**
     * Get response header
     */
    public getHeader(key: string): string | number | string[] | undefined {
        return this.original.getHeader(key);
    }
    /**
     * Remove response header
     */
    public removeHeader(key: string): this {
        this.original.removeHeader(key);
        return this;
    }
    /**
     * Set cookie
     */
    public setCookie(
        name: string,
        value: string,
        options?: A_Response_CookieOptions
    ): this {
        this._cookies.set(name, { value, options });
        return this;
    }
    /**
     * Clear cookie
     */
    public clearCookie(name: string, options?: A_Response_CookieOptions): this {
        const clearOptions = {
            ...options,
            expires: new Date(0),
            maxAge: 0
        };
        this._cookies.set(name, { value: '', options: clearOptions });
        return this;
    }
    // --------------------------------------------------------------------------
    // Response Data manipulation methods
    // --------------------------------------------------------------------------
    /**
     * Add data to response
     */
    public add(key: string, data: _ResponseType): this {
        this._data.set(key, data);
        return this;
    }
    /**
     * Remove data from response
     */
    public remove(key: string): this {
        this._data.delete(key);
        return this;
    }
    /**
     * Get data from response
     */
    public get(key: string): _ResponseType | undefined {
        return this._data.get(key);
    }
    /**
     * Check if response has data
     */
    public has(key: string): boolean {
        return this._data.has(key);
    }
    /**
     * Clear all response data
     */
    public clear(): this {
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
    protected handleFinish(): Promise<void> {
        try {
            return this.call(A_ResponseFeatures.onFinish) as Promise<void>;
        } catch (error) {
            return this.fail(new A_HttpServerError({
                status: 500,
                description: `Response finish error: ${error instanceof A_Error ? error.message : 'An error occurred while finishing the response.'}`,
                originalError: error
            }));
        }
    }
    /**
     * Handle response close event
     */
    protected async handleClose(): Promise<void> {
        try {

            await this.call(A_ResponseFeatures.onClose);

        } catch (error) {

            await this.fail(new A_HttpServerError({
                status: 499,
                description: 'Client closed the connection before the response could be completed.',
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
    on(event: A_ResponseFeatureNames, listener: A_Response_Listener) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event)!.add(listener);
    }
    /**
     * Removes an event listener for a specific event
     * 
     * @param event 
     * @param listener 
     */
    off(event: A_ResponseFeatureNames, listener: A_Response_Listener) {
        this._listeners.get(event)?.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     * 
     * @param event 
     */
    emit(event: A_ResponseFeatureNames) {
        this._listeners.get(event)?.forEach(async listener => {
            listener(this);
        });
    }

    // ======================================================================================
    // --------------------------------------------------------------------------
    // A-Response Feature Default Extensions
    // --------------------------------------------------------------------------
    // ======================================================================================

    @A_Feature.Extend({
        after: /.*/
    })
    async [A_ResponseFeatures.onSend](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ) {

        const responseData = this._dataOverride || this.toResponse();

        switch (true) {
            case !!responseData && typeof responseData === 'object':
                this.original.setHeader('Content-Type', `application/json; charset=${this._options.charset}`);
                this.setDefaultResponseHeaders();
                this.original.writeHead(this.statusCode);

                // this.setCookieHeaders();
                // this.setCacheHeaders();

                this.original.end(JSON.stringify(responseData));
                return;

            case !!responseData && typeof responseData === 'string':
                this.original.setHeader('Content-Type', `text/plain; charset=${this._options.charset}`);
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

    @A_Feature.Extend({
        after: /.*/
    })
    async [A_ResponseFeatures.onRedirect](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ) {

        if (!this._redirectURL) return;

        this.original.setHeader('Location', this._redirectURL!);
        if (!this.statusCode || (this.statusCode < 300 || this.statusCode > 399))
            this.status(301);

        this.original.end();
    }

    @A_Feature.Extend({
        after: /.*/
    })
    async [A_ResponseFeatures.onError](
        @A_Inject(A_HttpServerError) error: A_HttpServerError,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        @A_Inject(A_Request) request: A_Request,
        ...args: any[]
    ) {

        if (this.headersSent) {
            return;
        }

        const statusCode = error.status || 500;
        this.status(statusCode);

        const errorResponse = {
            error: {
                message: error.message,
                status: statusCode,
                description: error.description || '',
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
    protected setDefaultResponseHeaders(): void {
        // Security headers
        this.original.setHeader('X-Content-Type-Options', 'nosniff');
        this.original.setHeader('X-Frame-Options', 'DENY');
        this.original.setHeader('X-XSS-Protection', '1; mode=block');

        // Request ID for tracking
        this.original.setHeader('X-Request-ID', this.aseid.id);
    }
    /**
     * Set cookie headers
     */
    protected setCookieHeaders(): void {
        if (!this._options.enableCookies || this._cookies.size === 0) return;

        const cookieStrings: string[] = [];

        this._cookies.forEach(({ value, options }, name) => {
            let cookieString = `${name}=${encodeURIComponent(value)}`;

            if (options) {
                if (options.domain) cookieString += `; Domain=${options.domain}`;
                if (options.path) cookieString += `; Path=${options.path}`;
                if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
                if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
                if (options.httpOnly) cookieString += '; HttpOnly';
                if (options.secure) cookieString += '; Secure';
                if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
            }

            cookieStrings.push(cookieString);
        });

        this.original.setHeader('Set-Cookie', cookieStrings);
    }
    /**
     * Set cache headers
     */
    protected setCacheHeaders(): void {
        if (!this._cacheOptions) return;

        const cacheControl: string[] = [];

        if (this._cacheOptions.public) cacheControl.push('public');
        if (this._cacheOptions.private) cacheControl.push('private');
        if (this._cacheOptions.noCache) cacheControl.push('no-cache');
        if (this._cacheOptions.noStore) cacheControl.push('no-store');
        if (this._cacheOptions.mustRevalidate) cacheControl.push('must-revalidate');
        if (this._cacheOptions.proxyRevalidate) cacheControl.push('proxy-revalidate');
        if (this._cacheOptions.immutable) cacheControl.push('immutable');

        if (this._cacheOptions.maxAge !== undefined) {
            cacheControl.push(`max-age=${this._cacheOptions.maxAge}`);
        }

        if (this._cacheOptions.sMaxAge !== undefined) {
            cacheControl.push(`s-maxage=${this._cacheOptions.sMaxAge}`);
        }

        if (cacheControl.length > 0) {
            this.original.setHeader('Cache-Control', cacheControl.join(', '));
        }

        if (this._cacheOptions.etag) {
            this.original.setHeader('ETag', this._cacheOptions.etag);
        }

        if (this._cacheOptions.lastModified) {
            this.original.setHeader('Last-Modified', this._cacheOptions.lastModified.toUTCString());
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
    public toResponse(): _ResponseType {
        const response = Array.from(this._data.entries()).reduce((acc, [key, value]) => {
            if (value instanceof A_Entity) {
                acc[key] = value.toJSON();
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as any);

        return response;
    }
    /**
     * Enhanced JSON serialization for logging/debugging
     */
    public toJSON(): A_Response_Serialized<_ResponseType> {
        return {
            ...super.toJSON(),
            status: this.statusCode,
            headersSent: this.headersSent,
            size: this.size,
            data: this.toResponse(),
            redirectURL: this._redirectURL,
        };
    }
}