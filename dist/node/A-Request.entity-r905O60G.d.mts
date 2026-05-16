import { IncomingMessage, IncomingHttpHeaders } from 'http';
import { A_TYPES__Entity_Serialized, A_Entity, A_Error } from '@adaas/a-concept';
import { A_HttpServerError } from './lib/A-Server/A-HttpServer.error.mjs';
import { A_HttpServerRequestMethod } from './lib/A-Server/A-HttpServer.types.mjs';
import { A_RequestFeatures } from './lib/A-Request/A-Request.constants.mjs';
import { A_RequestEnvVariablesType } from './lib/A-Request/A-Request.env.mjs';
import { A_HttpServerRequestContext } from './lib/A-Request/A-HttpServerRequest.context.mjs';
import { A_HttpRequestData } from './lib/A-Request/A-HttpRequestData.context.mjs';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerRoute } from './lib/A-ServerRoute/A-ServerRoute.entity.mjs';

/**
 * Constructor parameters for A_Request entity
 */
type A_Request_Init = {
    /**
     * Unique identifier for the request (should correspond to Response id)
     */
    id: string;
    /**
     * ASEID Shard for the request.
     * it's some sort of request fingerprint
     */
    shard: string;
    /**
     * Node.js IncomingMessage object
     */
    request: IncomingMessage;
    /**
     * Request scope for context resolution
     */
    scope: string;
};
/**
 * Serialized representation of A_Request entity
 */
type A_Request_Serialized<_ReqBodyType = any, _ParamsType extends Record<string, string> = any, _QueryType = any> = A_TYPES__Entity_Serialized & {
    method: A_HttpServerRequestMethod;
    url: string;
    headers: Record<string, string | string[] | undefined>;
    params?: _ParamsType;
    query?: _QueryType;
    cookies: Record<string, string>;
    body?: _ReqBodyType;
    userAgent?: string;
    isValid: boolean;
    bodyType?: A_Request_BodyType;
    filesCount?: number;
    fileFieldNames?: string[];
    totalFileSize?: number;
};
/**
 * Supported HTTP request methods
 */
type A_Request_Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | 'DEFAULT';
/**
 * Request lifecycle events
 */
declare enum A_Request_Event {
    Error = "error",
    Finish = "finish",
    Data = "data",
    End = "end",
    Close = "close"
}
type A_RequestFeatureNames = typeof A_RequestFeatures[keyof typeof A_RequestFeatures];
/**
 * Request event callback function type
 */
type A_Request_EventCallback = (request: A_Request) => void;
/**
 * Supported body content types for parsing
 */
type A_Request_BodyType = 'json' | 'form' | 'multipart' | 'raw' | 'text';
/**
 * Result of body parsing operation
 */
type A_Request_ParsedBody = {
    /**
     * Type of parsed content
     */
    type: A_Request_BodyType;
    /**
     * Parsed data
     */
    data: any;
    /**
     * Size of the body in bytes
     */
    size: number;
    /**
     * Character encoding used
     */
    encoding?: string;
    /**
     * Multipart boundary (for multipart content)
     */
    boundary?: string;
};
/**
 * Session data structure for user session management
 */
type A_Request_SessionData = {
    /**
     * Unique session identifier
     */
    id?: string;
    /**
     * Associated user ID
     */
    userId?: string;
    /**
     * Session creation timestamp
     */
    createdAt?: Date;
    /**
     * Last access timestamp
     */
    lastAccess?: Date;
    /**
     * Session data storage
     */
    data?: Record<string, any>;
    /**
     * Whether session is expired
     */
    isExpired?: boolean;
    /**
     * Maximum session age in milliseconds
     */
    maxAge?: number;
};
/**
 * File upload information for multipart requests
 */
type A_Request_FileUpload = {
    /**
     * Form field name
     */
    fieldName: string;
    /**
     * Original filename
     */
    filename: string;
    /**
     * File encoding
     */
    encoding: string;
    /**
     * MIME type
     */
    mimetype: string;
    /**
     * File size in bytes
     */
    size: number;
    /**
     * File buffer data
     */
    buffer: Buffer;
    /**
     * Path if saved to disk
     */
    path?: string;
    /**
     * File hash for integrity verification
     */
    hash?: string;
};
/**
 * Request validation result with detailed feedback
 */
type A_Request_ValidationResult = {
    /**
     * Whether validation passed
     */
    isValid: boolean;
    /**
     * Validation error messages
     */
    errors: string[];
    /**
     * Warning messages
     */
    warnings: string[];
    /**
     * Sanitized data after validation
     */
    sanitized?: any;
};
/**
 * Request processing configuration options
 */
type A_Request_Options = {
    /**
     * Maximum request body size in bytes (default: 10MB)
     */
    maxBodySize?: number;
    /**
     * Request timeout in milliseconds (default: 30s)
     */
    timeout?: number;
    /**
     * Default character encoding (default: 'utf8')
     */
    encoding?: string;
    /**
     * Automatically parse cookies (default: true)
     */
    parseCookies?: boolean;
    /**
     * Automatically parse query parameters (default: true)
     */
    parseQuery?: boolean;
    /**
     * Automatically parse request body (default: true)
     */
    parseBody?: boolean;
    /**
     * Enable file upload handling (default: false)
     */
    enableFileUploads?: boolean;
    /**
     * Enable strict validation mode (default: false)
     */
    strictValidation?: boolean;
};
/**
 * Request Event Listener Function
 */
type A_Request_Listener = (req?: A_Request) => void;

declare class A_Request<_ReqBodyType = any, _ParamsType extends Record<string, string> = any, _QueryType = any> extends A_Entity<A_Request_Init, A_Request_Serialized<_ReqBodyType, _ParamsType, _QueryType>> {
    static get concept(): string;
    /**
     * Request processing status
     */
    protected _listeners: Map<A_RequestFeatureNames, Set<A_Request_Listener>>;
    /**
     * Parsed cookies from request headers
     */
    private _cookies;
    /**
     * Request body type
     */
    private _bodyType?;
    /**
     * Request body data
     */
    private _body;
    private _req;
    private _timeout;
    /**
     * Uploaded files from multipart requests
     */
    private _files;
    /**
     * User agent string from request headers
     */
    private _userAgent?;
    /**
     * Content length in bytes
     */
    private _contentLength?;
    /**
     * Request processing configuration options
     */
    private _options;
    private _routeDefinition?;
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
    constructor(params: A_Request_Init, options?: A_Request_Options);
    /**
     * Creates A_Request entity from initialization data
     *
     * @param newEntity
     */
    fromNew(newEntity: A_Request_Init): void;
    /**
     * Core HTTP request object from Node.js
     */
    get original(): IncomingMessage;
    /**
     * Parsed request body data
     */
    get body(): _ReqBodyType;
    /**
     * URL route parameters (e.g., /users/:id)
     */
    get params(): _ParamsType;
    /**
     * Query string parameters
     */
    get query(): _QueryType;
    /**
     * Gets the parsed cookies
     */
    get cookies(): Record<string, string>;
    /**
     * Gets the request URL
     */
    get url(): string;
    /**
     * Gets the HTTP method
     */
    get method(): A_HttpServerRequestMethod;
    /**
     * Gets the request headers
     */
    get headers(): IncomingHttpHeaders;
    /**
     * Gets the timestamp when the request was started
     */
    get startedAt(): Date | undefined;
    /**
     * Gets uploaded files
     */
    get files(): A_Request_FileUpload[];
    /**
     * Gets user agent string
     */
    get userAgent(): string | undefined;
    /**
     * Gets content length
     */
    get contentLength(): number;
    /**
     * Check if request is secure (HTTPS)
     */
    get isSecure(): boolean;
    /**
     * Check if request is from mobile device
     */
    get isMobile(): boolean;
    /**
     * Get request size in bytes
     */
    get size(): number;
    /**
     * Gets content type from headers
     */
    get contentType(): string | undefined;
    /**
     * Pipes request stream to destination
     */
    pipe(destination: NodeJS.WritableStream, options?: {
        end?: boolean | undefined;
    }): NodeJS.WritableStream;
    /**
     * Get a file by field name
     */
    getFile(fieldName: string): A_Request_FileUpload | undefined;
    /**
     * Get all files for a specific field name
     */
    getFiles(fieldName: string): A_Request_FileUpload[];
    /**
     * Check if request has any files
     */
    hasFiles(): boolean;
    /**
     * Check if request has a file with specific field name
     */
    hasFile(fieldName: string): boolean;
    /**
     * Get total size of all uploaded files
     */
    getTotalFileSize(): number;
    /**
     * Get a cookie value
     */
    getCookie(name: string): string | undefined;
    /**
     * Check if request has a specific cookie
     */
    hasCookie(name: string): boolean;
    /**
     * Check if request accepts specific content type
     */
    accepts(contentType: string): boolean;
    /**
     * Get request fingerprint for caching/identification
     */
    getFingerprint(): string;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: A_RequestFeatureNames, listener: A_Request_Listener): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: A_RequestFeatureNames, listener: A_Request_Listener): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: A_RequestFeatureNames): void;
    /**
     * Allows to use a route definition for this request
     *
     * @param route
     */
    useRoute(route: A_ServerRoute): void;
    clearTimeout(): void;
    /**
     * Initialize the request - parse cookies, query, body etc.
     */
    load(): Promise<void>;
    validate(): Promise<void>;
    /**
     * Destroy the request A-Entity with cleanup
     *
     * @returns
     */
    destroy(): Promise<any>;
    /**
     * Handles request failure - registers error, emits event, and destroys request
     *
     * [!] Destroys the request after handling the failure.
     *
     * @param err
     */
    fail(err?: A_HttpServerError): Promise<void>;
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
    protected handleData(data: Buffer): Promise<void>;
    /**
     * Handles request close event
     *
     * This method is called when the request is closed prematurely.
     * It triggers the onClose feature and handles any errors that occur during processing.
     *
     */
    protected handleClose(): Promise<void>;
    /**
     * Handles request end event
     *
     * This method is called when the request has finished sending data.
     * It triggers the onEnd feature and handles any errors that occur during processing.
     */
    protected handleEnd(): Promise<void>;
    /**
     * Handles request timeout event
     *
     * This method is called when the request processing exceeds the configured timeout.
     * It triggers the onTimeout feature and fails the request with a timeout error.
     */
    protected handleTimeout(): Promise<void>;
    [A_RequestFeatures.onInit](config: A_Config<['A_SERVER_REQUEST_TIMEOUT']>, context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onData](context: A_HttpServerRequestContext, chunk: A_HttpRequestData, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onTimeout](context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onClose](context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onError](error: A_Error, context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onEnd](config: A_Config<A_RequestEnvVariablesType>, context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    [A_RequestFeatures.onValidate](context: A_HttpServerRequestContext, ...args: any[]): Promise<void>;
    /**
     * Serialize request for logging/debugging
     */
    toJSON(): A_Request_Serialized;
}

export { A_Request as A, type A_RequestFeatureNames as a, type A_Request_BodyType as b, A_Request_Event as c, type A_Request_EventCallback as d, type A_Request_FileUpload as e, type A_Request_Init as f, type A_Request_Listener as g, type A_Request_Methods as h, type A_Request_Options as i, type A_Request_ParsedBody as j, type A_Request_Serialized as k, type A_Request_SessionData as l, type A_Request_ValidationResult as m };
