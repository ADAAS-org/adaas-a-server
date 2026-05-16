import { A_TYPES__Entity_Serialized, A_Entity } from '@adaas/a-concept';
import { ServerResponse, IncomingHttpHeaders } from 'http';
import { Readable } from 'stream';
import { A_ResponseFeatures } from './lib/A-Response/A-Response.constants.mjs';
import { A_HttpServerError } from './lib/A-Server/A-HttpServer.error.mjs';
import { A as A_Request } from './A-Request.entity-r905O60G.mjs';
import { A_HttpServerRequestContext } from './lib/A-Request/A-HttpServerRequest.context.mjs';

type A_Response_Constructor = {
    /**
     * Should correspond to Request id
     */
    id: string;
    scope: string;
    shard: string;
    response: ServerResponse;
};
type A_Response_Serialized<T extends any> = {
    status: number;
    headersSent: boolean;
    size: number;
    data: T;
    redirectURL?: string;
} & A_TYPES__Entity_Serialized;
type A_Response_SendResponseObject<_ResponseType = any> = Record<string, _ResponseType>;
/**
 * Cookie configuration for setting response cookies
 */
type A_Response_CookieOptions = {
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    expires?: Date;
    sameSite?: 'strict' | 'lax' | 'none';
    signed?: boolean;
};
type A_ResponseFeatureNames = typeof A_ResponseFeatures[keyof typeof A_ResponseFeatures];
/**
 * Response streaming options
 */
type A_Response_StreamOptions = {
    chunkSize?: number;
    delay?: number;
    encoding?: BufferEncoding;
    transform?: (chunk: any) => any;
    onProgress?: (bytesWritten: number, totalBytes: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
};
/**
 * Response compression options
 */
type A_Response_CompressionOptions = {
    threshold?: number;
    level?: number;
    strategy?: number;
    chunkSize?: number;
    windowBits?: number;
    memLevel?: number;
};
/**
 * File download options
 */
type A_Response_DownloadOptions = {
    filename?: string;
    contentType?: string;
    disposition?: 'attachment' | 'inline';
    maxAge?: number;
    etag?: boolean;
    lastModified?: boolean;
    cacheControl?: string;
};
/**
 * Response caching options
 */
type A_Response_CacheOptions = {
    maxAge?: number;
    sMaxAge?: number;
    noCache?: boolean;
    noStore?: boolean;
    mustRevalidate?: boolean;
    proxyRevalidate?: boolean;
    immutable?: boolean;
    private?: boolean;
    public?: boolean;
    etag?: string;
    lastModified?: Date;
};
/**
 * Response configuration options
 */
type A_Response_Options = {
    autoCompress?: boolean;
    compressionThreshold?: number;
    enableCaching?: boolean;
    defaultCacheMaxAge?: number;
    enableMetrics?: boolean;
    enableEtag?: boolean;
    enableLastModified?: boolean;
    charset?: string;
    defaultContentType?: string;
    maxRedirects?: number;
    enableCookies?: boolean;
    enableSessions?: boolean;
};
/**
 * Response Event Listener Function
 */
type A_Response_Listener = (res?: A_Response) => void;

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
declare class A_Response<_ResponseType = any> extends A_Entity<A_Response_Constructor, A_Response_Serialized<_ResponseType>> {
    static get namespace(): string;
    /**
     * Original ServerResponse object
     */
    private _res;
    /**
     * Internal object to store all response data
     */
    private _data;
    /**
     * uses in case the response isn't an object
     */
    private _dataOverride?;
    /**
     * Redirect URL for handling redirects
     */
    private _redirectURL?;
    /**
     * Cookies map for managing response cookies
     */
    private _cookies;
    /**
     * Indicates if the response has finished
     */
    private _cacheOptions?;
    /**
     * Indicates if the response has finished
     */
    private _options;
    /**
     * Event listeners map for A_Response events
     */
    private _listeners;
    constructor(params: A_Response_Constructor, options?: A_Response_Options);
    /**
     * Initialize from new entity parameters
     */
    fromNew(newEntity: A_Response_Constructor): void;
    /**
     * Gets the response data map
     */
    get data(): Map<string, _ResponseType>;
    /**
     * Gets the original ServerResponse object
     */
    get original(): ServerResponse;
    /**
     * Gets whether headers have been sent
     */
    get headersSent(): boolean;
    /**
     * Gets the current status code
     */
    get statusCode(): number;
    /**
     * Gets response size in bytes
     */
    get size(): number;
    /**
     * Initialize the response
     */
    load(): Promise<void>;
    /**
     * Destroy the response
     */
    destroy(): Promise<any>;
    /**
     * Handle response failure with error details
     */
    fail(err?: A_HttpServerError): Promise<void>;
    /**
     * Send a plain text or JSON response
     */
    send(data?: any): Promise<void>;
    /**
      * Stream response data
      */
    stream(dataStream: Readable | any[]): Promise<void>;
    /**
     * Redirect response
     *
     * [!] Note: This method ends the response immediately.
     */
    redirect(url: string): Promise<void>;
    /**
     * Write head with status and headers
     */
    writeHead(statusCode: number, headers?: Record<string, string> | IncomingHttpHeaders | any): this;
    /**
     * Set HTTP status code
     */
    status(code: number): this;
    /**
     * Set response header
     */
    setHeader(key: string, value: string | number | string[]): this;
    /**
     * Get response header
     */
    getHeader(key: string): string | number | string[] | undefined;
    /**
     * Remove response header
     */
    removeHeader(key: string): this;
    /**
     * Set cookie
     */
    setCookie(name: string, value: string, options?: A_Response_CookieOptions): this;
    /**
     * Clear cookie
     */
    clearCookie(name: string, options?: A_Response_CookieOptions): this;
    /**
     * Add data to response
     */
    add(key: string, data: _ResponseType): this;
    /**
     * Remove data from response
     */
    remove(key: string): this;
    /**
     * Get data from response
     */
    get(key: string): _ResponseType | undefined;
    /**
     * Check if response has data
     */
    has(key: string): boolean;
    /**
     * Clear all response data
     */
    clear(): this;
    /**
     * Handle response finish event
     *
     * @returns
     */
    protected handleFinish(): Promise<void>;
    /**
     * Handle response close event
     */
    protected handleClose(): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: A_ResponseFeatureNames, listener: A_Response_Listener): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: A_ResponseFeatureNames, listener: A_Response_Listener): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: A_ResponseFeatureNames): void;
    [A_ResponseFeatures.onSend](context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_ResponseFeatures.onRedirect](context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_ResponseFeatures.onError](error: A_HttpServerError, context: A_HttpServerRequestContext, request: A_Request, ...args: any[]): Promise<void>;
    /**
  * Set standard response headers
  */
    protected setDefaultResponseHeaders(): void;
    /**
     * Set cookie headers
     */
    protected setCookieHeaders(): void;
    /**
     * Set cache headers
     */
    protected setCacheHeaders(): void;
    /**
     * Convert accumulated data to response object
     */
    toResponse(): _ResponseType;
    /**
     * Enhanced JSON serialization for logging/debugging
     */
    toJSON(): A_Response_Serialized<_ResponseType>;
}

export { A_Response as A, type A_ResponseFeatureNames as a, type A_Response_CacheOptions as b, type A_Response_CompressionOptions as c, type A_Response_Constructor as d, type A_Response_CookieOptions as e, type A_Response_DownloadOptions as f, type A_Response_Listener as g, type A_Response_Options as h, type A_Response_SendResponseObject as i, type A_Response_Serialized as j, type A_Response_StreamOptions as k };
