import { A_ExecutionContext } from '@adaas/a-utils/a-execution';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders, Server } from 'http';
import { A_OperationContext, A_Operation_Storage } from '@adaas/a-utils/a-operation';
import * as _adaas_a_concept from '@adaas/a-concept';
import { A_TYPES__Error_Init, A_TYPES__Error_Serialized, A_TYPES__Entity_Serialized, A_Error, A_Entity, A_Scope, A_Fragment, A_TYPES__Required, A_Component, A_TYPES__Entity_Constructor, A_TYPES__Fragment_Serialized, A_TYPES__ConceptENVVariables, A_Feature, A_TYPES__ComponentMeta, A_ComponentMeta, A_TYPES__MetaLinkedComponentConstructors } from '@adaas/a-concept';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Route } from '@adaas/a-utils/a-route';
import { Readable } from 'stream';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Service, A_ServiceFeatures } from '@adaas/a-utils/a-service';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

declare class A_HttpRequestData extends A_ExecutionContext<{
    data: Buffer;
}> {
    constructor(data: Buffer);
    get length(): number;
    get data(): Buffer;
    toString(encoding?: BufferEncoding): string;
}

declare class A_HttpServerRequestContext<_DataType extends any = any> extends A_OperationContext<'http-server-request', {
    request: IncomingMessage;
    response: ServerResponse;
}, {
    buffers: Buffer[];
    data: _DataType;
    files: Record<string, any[]>;
}, {
    buffers: Buffer[];
    data: _DataType;
    files: Record<string, any[]>;
    params: {
        request: IncomingMessage;
        response: ServerResponse;
    };
} & A_Operation_Storage> {
    protected _id: string;
    protected _startTime: [number, number];
    protected _endTime?: [number, number];
    protected _ready?: Promise<void>;
    protected get _request(): IncomingMessage;
    protected get _response(): ServerResponse;
    protected _customResponse: any;
    constructor(request: IncomingMessage, response: ServerResponse);
    get id(): string;
    get buffers(): Buffer[];
    get contentType(): string | undefined;
    get data(): _DataType;
    set data(value: _DataType);
    get length(): number;
    get processingTime(): number;
    startProcessing(): void;
    stopProcessing(): void;
}

declare const A_RequestFeatures: {
    readonly onError: "A_Request_onError";
    readonly onInit: "A_Request_onInit";
    readonly onAfterInit: "A_Request_onAfterInit";
    readonly onParse: "A_Request_onParse";
    readonly onValidate: "A_Request_onValidate";
    readonly onClose: "A_Request_onClose";
    readonly onAborted: "A_Request_onAborted";
    readonly onTimeout: "A_Request_onTimeout";
    readonly onData: "A_Request_onData";
    readonly onEnd: "A_Request_onEnd";
    readonly onBodyParse: "A_Request_onBodyParse";
    readonly onQueryParse: "A_Request_onQueryParse";
    readonly onParamsParse: "A_Request_onParamsParse";
    readonly onCookiesParse: "A_Request_onCookiesParse";
};

declare const A_HttpServerFeatures: {
    readonly onBeforeRequest: "_A_HTTPServer_onBeforeRequest";
    readonly onRequest: "_A_HTTPServer_onRequest";
    readonly onAfterRequest: "_A_HTTPServer_onAfterRequest";
};

type A_HttpServerRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | 'DEFAULT';
type A_HttpServerFeatureNames = typeof A_HttpServerFeatures[keyof typeof A_HttpServerFeatures];
type A_HttpServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init;
type A_HttpServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number;
} & A_TYPES__Error_Serialized;

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

declare class A_HttpServerError extends A_Error<A_HttpServerError_Init, A_HttpServerError_Serialized> {
    static readonly NotFoundErrorStatus: number;
    static readonly NotFoundError = "Resource Not Found";
    static readonly InternalServerErrorStatus: number;
    static readonly InternalServerError = "Internal Server Error";
    /**
     * HTTP status code to title mapping
     */
    private static readonly HTTP_STATUS_TITLES;
    status: number;
    /**
     * Gets the appropriate title for a given HTTP status code
     */
    private static getHttpStatusTitle;
    constructor(
    /**
     * A_Error Constructor params with required title
     */
    params: A_HttpServerError_Init);
    constructor(
    /**
     * Simplified params with optional title - will auto-generate from status
     */
    params: {
        status?: number;
        description?: string;
        code?: string;
        scope?: string;
        link?: string;
        originalError?: Error | unknown;
    });
    constructor(
    /**
     * HTTP Status Code of the error
     */
    status: number, 
    /**
     * Error description
     */
    description: string);
    constructor(
    /**
     * Original JS Error
     */
    error: Error);
    protected fromConstructor(params: A_HttpServerError_Init): void;
    toJSON(): A_HttpServerError_Serialized;
}

declare const A_RequestEnvVariables: {
    /**
     * Default request timeout in milliseconds
     */
    readonly A_SERVER_REQUEST_TIMEOUT: 5000;
    /**
     * Maximum request body size in bytes
     */
    readonly A_SERVER_REQUEST_MAX_BODY_SIZE: number;
    /**
     * Default request encoding
     */
    readonly A_SERVER_REQUEST_DEFAULT_ENCODING: "utf8";
    /**
     * Enable automatic cookie parsing
     */
    readonly A_SERVER_REQUEST_PARSE_COOKIES: true;
    /**
     * Enable automatic query parameter parsing
     */
    readonly A_SERVER_REQUEST_PARSE_QUERY: true;
    /**
     * Enable automatic body parsing
     */
    readonly A_SERVER_REQUEST_PARSE_BODY: true;
    /**
     * Enable file upload handling
     */
    readonly A_SERVER_REQUEST_ENABLE_FILE_UPLOADS: false;
};
declare const A_RequestEnvVariablesArray: Array<keyof typeof A_RequestEnvVariables>;
/**
 * Array of all possible fields in A_RequestEnvVariables
 */
type A_RequestEnvVariablesType = Array<keyof typeof A_RequestEnvVariables>;

declare const A_ServerRouteHttpMethods: {
    readonly DEFAULT: "DEFAULT";
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
    readonly PATCH: "PATCH";
    readonly OPTIONS: "OPTIONS";
    readonly HEAD: "HEAD";
    readonly CONNECT: "CONNECT";
    readonly TRACE: "TRACE";
};
declare const A_ServerRouteProtocols: {
    readonly HTTP: "http";
    readonly HTTPS: "https";
    readonly WS: "ws";
    readonly WSS: "wss";
};

type A_serverRouteProtocolNames = typeof A_ServerRouteProtocols[keyof typeof A_ServerRouteProtocols];
type A_ServerRouteHttpMethodNames = typeof A_ServerRouteHttpMethods[keyof typeof A_ServerRouteHttpMethods];

declare class A_ServerRoute extends A_Route {
    url: string;
    method: A_ServerRouteHttpMethodNames;
    constructor(url: string | RegExp, method: A_ServerRouteHttpMethodNames);
    constructor(url: string | RegExp);
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}

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

declare class A_RequestError extends A_Error {
    static readonly RequestBodyParsingError = "Unable to parse request body";
    static readonly FileUploadError = "File upload error";
    static readonly RequestTimeoutError = "Request timed out";
    static readonly InvalidRequestError = "Invalid request";
    static readonly MissingParametersError = "Missing required parameters";
}

/**
 * A_RequestHelper - Stateless utility class for HTTP request processing
 *
 * This helper class provides static methods for parsing and processing HTTP request data:
 * - URL parameter extraction from route patterns
 * - Query string parsing
 * - Request body parsing (JSON, form-data, multipart, raw)
 * - URL-encoded form data parsing
 * - Multipart form data parsing (including file uploads)
 *
 * All methods are stateless and only depend on input parameters.
 *
 * @example
 * ```typescript
 * // Extract URL parameters
 * const params = A_RequestHelper.extractParams('/users/123', '/users/:id');
 * // { id: '123' }
 *
 * // Parse query string
 * const query = A_RequestHelper.extractQuery('/api/users?page=1&limit=10');
 * // { page: '1', limit: '10' }
 *
 * // Parse request body
 * const result = await A_RequestHelper.parseRequestBody(req, { maxBodySize: 1024 * 1024 });
 * // { data: {...}, type: 'json' }
 * ```
 */
declare class A_RequestHelper {
    /**
     * Extract URL parameters from a URL using a route pattern
     * @param url - The actual URL to extract parameters from
     * @param routePattern - The route pattern with parameters (e.g., "/users/:id/posts/:postId")
     * @returns Object containing extracted parameters
     */
    static extractParams(url: string, routePattern: string): Record<string, string>;
    /**
     * Extract query parameters from URL
     * @param url - The URL to extract query parameters from
     * @returns Object containing query parameters
     */
    static extractQuery<T = Record<string, string>>(url: string): T;
    /**
     * Parse cookies from Cookie header
     */
    static parseCookies(cookieHeader?: string): Record<string, string>;
    /**
     * Parse request body based on Content-Type
     *
     *
     * @param context - The HTTP server request context
     * @returns Parsed body data and detected body type
     */
    static parseRequestBody<T extends any = any>(context: A_HttpServerRequestContext): {
        data: T;
        type: A_Request_BodyType;
    };
    /**
     * Parse URL-encoded form data (application/x-www-form-urlencoded)
     * @param body - The URL-encoded body string
     * @returns Object containing form data
     */
    static parseFormUrlEncoded(
    /**
     * The URL-encoded body string
     */
    body: string): Record<string, string | string[]>;
    /**
     * Parse multipart form data (for file uploads and form data)
     * @param buffer - The raw buffer containing multipart data
     * @param contentType - The content type header
     * @returns Object containing fields and files
     */
    static parseMultipartData(
    /**
     * The raw buffer containing multipart data
     */
    buffer: Buffer, 
    /**
     * The content type header
     */
    contentType: string): {
        fields: Record<string, string>;
        files: A_Request_FileUpload[];
    };
}

declare const A_ResponseFeatures: {
    /**
     * Event fired when an error occurs while sending the response
     */
    readonly onError: "_A_Response_onError";
    /**
     * Event fired when the response is closed
     */
    readonly onClose: "_A_Response_onClose";
    /**
     * Event fired when the response is finished
     */
    readonly onFinish: "_A_Response_onFinish";
    /**
     * Event fired when the response is sent
     */
    readonly onSend: "_A_Response_onSend";
    /**
     * Event fired when the response is redirected
     */
    readonly onRedirect: "_A_Response_onRedirect";
};

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
    /**
     * Whether this response is operating as a persistent SSE stream
     */
    private _isStreaming;
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
     * Whether this response is in SSE streaming mode.
     * When true the server container will NOT auto-send and destroy() will
     * leave the underlying socket open.
     */
    get isStreaming(): boolean;
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
     * Upgrade this response to a persistent SSE stream.
     * Sends the required headers and writes the initial `:ok` comment to flush
     * the connection. After calling this the response will NOT be auto-closed
     * by the server container or by destroy().
     */
    sseOpen(): void;
    /**
     * Write a named SSE event onto the open stream.
     * Format: `event: <name>\ndata: <JSON>\n\n`
     *
     * Compatible with browser EventSource `addEventListener(name, handler)`.
     *
     * @returns false when the channel is no longer writable
     */
    sseWrite(event: string, data?: any): boolean;
    /**
     * Close the SSE stream gracefully.
     */
    sseClose(): void;
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

declare class A_ResponseError extends A_Error {
}

declare const A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES: {
    /**
     * Port for the server to listen on
     * [!] Default is 3000
     * @default 3000
     */
    readonly A_SERVER_PORT: "A_SERVER_PORT";
};
type A_TYPES__ServerENVVariables = (typeof A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES][];
declare const A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY: readonly ["A_SERVER_PORT"];

declare class A_ServerLogger extends A_Logger {
    protected config: A_Config<any>;
    logRequestFinish(request: A_Request, response: A_Response, context: A_HttpServerRequestContext): void;
    logResponseError(request: A_Request, response: A_Response, context: A_HttpServerRequestContext, error: A_Error): void;
    logStop(scope: A_Scope): void;
    serverReady(params: {
        port: number;
        app: {
            name: string;
            version?: string;
        };
    }): void;
    /**
     * Displays a proxy routes
     *
     * @param params
     */
    proxy(params: {
        original: string;
        destination: string;
    }): void;
}

/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
declare class A_HttpServer extends A_Service {
    protected server: Server;
    static get onBeforeRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static get onRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static get onAfterRequest(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    protected [A_ServiceFeatures.onStart](polyfill: A_Polyfill, config: A_Config<A_TYPES__ServerENVVariables>): Promise<void>;
    protected [A_ServiceFeatures.onAfterStart](config: A_Config<A_TYPES__ServerENVVariables>, logger: A_ServerLogger): Promise<void>;
    protected [A_ServiceFeatures.onStop](...args: any[]): Promise<void>;
    close(): Promise<void>;
    listen(port: number): Promise<void>;
    protected [A_HttpServerFeatures.onBeforeRequest](...args: any[]): Promise<void>;
    protected [A_HttpServerFeatures.onRequest](...args: any[]): Promise<void>;
    protected [A_HttpServerFeatures.onAfterRequest](...args: any[]): Promise<void>;
    handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void>;
}

type A_SERVER_TYPES__ServerConstructor = {
    name: string;
    version: string;
    routes: A_ServerRoute[];
    port: number;
};
type A_SERVER_TYPES__ServerError_Init = {
    /**
     * HTTP Status Code of the error
     */
    status?: number;
} & A_TYPES__Error_Init;
type A_SERVER_TYPES__ServerError_Serialized = {
    /**
     * HTTP Status Code of the error
     */
    status: number;
} & A_TYPES__Error_Serialized;

declare class A_Server extends A_Fragment {
    port: number;
    version: string;
    protected _routes: A_ServerRoute[];
    constructor(params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
        'port',
        'name'
    ]>);
    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_ServerRoute[];
}

declare class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {
    status: number;
    protected fromConstructor(params: A_SERVER_TYPES__ServerError_Init): void;
    toJSON(): A_SERVER_TYPES__ServerError_Serialized;
}

declare class A_ServerController extends A_Component {
    callEntityMethod(request: A_Request<any, any, {
        component: string;
        operation: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}

type A_SERVER_TYPES__A_EntityListConstructor<T extends A_Entity = A_Entity> = {
    /** User-facing: the entity class (e.g. `User`). Name and scope are derived from its statics. */
    entity: A_TYPES__Entity_Constructor<T>;
    /** Initial pagination request parameters. Defaults to page 1, pageSize 10. */
    pagination?: {
        page?: number;
        pageSize?: number;
    };
};
declare enum A_SERVER_TYPES__A_EntityListEvent {
    Load = "load"
}
type A_SERVER_TYPES__A_EntityListSerialized<EntityTypes extends A_Entity = A_Entity> = {
    items: Array<ReturnType<EntityTypes['toJSON']>>;
    type: string;
    pagination: A_SERVER_TYPES__A_EntityListPagination;
} & A_TYPES__Entity_Serialized;
type A_SERVER_TYPES__A_EntityListPagination = {
    total: number;
    page: number;
    pageSize: number;
};
type A_SERVER_TYPES__A_EntityListCacheEntry = {
    timestamp: number;
    ttl: number;
};

type A_SERVER_TYPES__A_EntityListPaginationSerialized = A_SERVER_TYPES__A_EntityListPagination & A_TYPES__Fragment_Serialized;
declare class A_ServerEntityListPagination extends A_Fragment<A_SERVER_TYPES__A_EntityListPaginationSerialized> {
    protected _total: number;
    protected _page: number;
    protected _pageSize: number;
    constructor(init?: Partial<A_SERVER_TYPES__A_EntityListPagination>);
    get total(): number;
    get page(): number;
    get pageSize(): number;
    update(data: Partial<A_SERVER_TYPES__A_EntityListPagination>): void;
    fromJSON(serialized: A_SERVER_TYPES__A_EntityListPaginationSerialized): void;
    toJSON(): A_SERVER_TYPES__A_EntityListPaginationSerialized;
}

/**
 * A-EntityList
 *
 * Typed, paginated list of A-Concept entities.
 *
 * Construction (user-facing):
 *   new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 20 } })
 *
 * Construction (controller-internal, backward-compat):
 *   new A_ServerEntityList({ name: 'user', scope: 'my-scope', constructor: User })
 */
declare class A_ServerEntityList<EntityType extends A_Entity = A_Entity> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor<EntityType>, A_SERVER_TYPES__A_EntityListSerialized<EntityType>> {
    static get scope(): string;
    protected _entityConstructor: A_TYPES__Entity_Constructor<EntityType>;
    /**
     * Ordered item references for O(1) positional access.
     * The list's own scope is the authoritative store (enables @A_Inject and
     * feature chains on items); this array mirrors the same items in order.
     */
    protected _items: Array<EntityType>;
    /** Lazily allocated private scope — pagination and cache state live here. */
    private _ownScope?;
    /**
     * The list's own scope, created on first access and bound to this entity
     * via A_Context.allocate.  Items, pagination and cache state are registered
     * here so they participate in feature chains and @A_Inject resolution.
     */
    get ownScope(): A_Scope;
    get entityConstructor(): A_TYPES__Entity_Constructor<EntityType>;
    get items(): Array<EntityType>;
    /** Pagination state — lives as a Fragment in the list's own scope. */
    get pagination(): A_ServerEntityListPagination;
    private get cacheState();
    /** Total number of items currently held in memory. */
    get length(): number;
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor<EntityType>): void;
    /**
     * Populate the list from raw repository data.
     * Items are registered in the list's own scope so they participate in
     * feature chains and @A_Inject resolution.
     */
    fromList(items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    /** Return the item at `index`, or `undefined` if out of range. */
    at(index: number): EntityType | undefined;
    /** Replace the item at `index` in place. Accepts a live entity or a plain serialised object. */
    replace(index: number, item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Append an item to the end of the list. */
    push(item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Prepend an item to the beginning of the list. */
    unshift(item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Remove the item at `index` from the list. */
    remove(index: number): this;
    /** Return the first item that satisfies `predicate`, or `undefined`. */
    find(predicate: (item: EntityType, index: number) => boolean): EntityType | undefined;
    /** Return all items that satisfy `predicate` without mutating the list. */
    filter(predicate: (item: EntityType, index: number) => boolean): EntityType[];
    /**
     * Mark this list as cached for `ttlMs` milliseconds from now.
     * Callers can check `isCached()` to decide whether to skip `load()`.
     */
    setCache(ttlMs: number): this;
    /** Returns `true` if the cache is still valid. */
    isCached(): boolean;
    /** Invalidate the cache so the next `load()` call fetches fresh data. */
    invalidateCache(): this;
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType>;
}

declare class A_ServerEntityListCacheState extends A_Fragment<A_TYPES__Fragment_Serialized> {
    protected _timestamp?: number;
    protected _ttl?: number;
    set(ttlMs: number): void;
    invalidate(): void;
    isValid(): boolean;
    toJSON(): A_TYPES__Fragment_Serialized;
}

declare class A_ServerListQueryFilter<FilterFields extends string[]> extends A_Fragment {
    protected _query: string | Partial<Record<FilterFields[number], string>>;
    protected defaults: Partial<Record<FilterFields[number], string>>;
    protected parsedQuery: Record<FilterFields[number], string>;
    constructor(_query?: string | Partial<Record<FilterFields[number], string>>, defaults?: Partial<Record<FilterFields[number], string>>);
    get query(): string | Partial<Record<FilterFields[number], string>>;
    get(property: FilterFields[number], defaultValue?: string): string;
    protected parseQueryString(value?: string | Partial<Record<FilterFields[number], string>>): Record<FilterFields[number], string>;
}

declare const A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES: {
    /**
     * Enable logging of 200 responses
     */
    readonly SERVER_IGNORE_LOG_200: "SERVER_IGNORE_LOG_200";
    /**
     * Enable logging of 404 responses
     */
    readonly SERVER_IGNORE_LOG_404: "SERVER_IGNORE_LOG_404";
    /**
     * Enable logging of 500 responses
     */
    readonly SERVER_IGNORE_LOG_500: "SERVER_IGNORE_LOG_500";
    /**
     * Enable logging of 400 responses
     */
    readonly SERVER_IGNORE_LOG_400: "SERVER_IGNORE_LOG_400";
    /**
     * Enable logging of default responses
     */
    readonly SERVER_IGNORE_LOG_DEFAULT: "SERVER_IGNORE_LOG_DEFAULT";
};

type A_SERVER_TYPES__ServerLoggerRouteParams = {
    method: string;
    url: string;
    status: number;
    responseTime: number;
};
type A_SERVER_TYPES__ServerLoggerEnvVariables = Array<keyof typeof A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES> | A_TYPES__ConceptENVVariables;

declare class A_ServerMiddleware extends A_Component {
}

type A_SERVER_TYPES__ProxyConfigConstructor = Record<string, string | Partial<A_SERVER_TYPES__ProxyConfigConstructorConfig>>;
type A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    hostname: string;
    protocol: 'http' | 'https' | string;
    port: number;
    path: string;
    method: A_ServerRouteHttpMethodNames;
    headers: Record<string, string>;
};
type A_SERVER_TYPES__RoutesConfig = {
    route: A_ServerRoute;
    protocol: 'http' | 'https' | string;
    hostname: string;
    port: number;
    headers: Record<string, string>;
};

declare class A_ProxyConfig extends A_Fragment {
    protected readonly _configs: Array<A_SERVER_TYPES__RoutesConfig>;
    constructor(
    /**
     * Setup proxy configs, where key is the path to match, and value is either a full URL or a partial config object
     */
    configs?: A_SERVER_TYPES__ProxyConfigConstructor);
    /**
     * Returns all configured proxy configs
     *
     */
    get configs(): Array<A_SERVER_TYPES__RoutesConfig>;
    /**
     * Checks if a given path is configured in the proxy
     *
     * @param path
     * @returns
     */
    has(path: string): boolean;
    /**
     * Returns the proxy configuration for a given path, if exists
     *
     * @param path
     * @returns
     */
    config(path: string): A_SERVER_TYPES__RoutesConfig | undefined;
}

declare class A_ServerProxy extends A_Component {
    load(logger: A_Logger, config: A_ProxyConfig): Promise<void>;
    onRequest(req: A_Request, res: A_Response, proxyConfig: A_ProxyConfig, logger: A_Logger, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
}

declare const PROXY_CONFIG_DEFAULTS: A_SERVER_TYPES__ProxyConfigConstructorConfig;

declare const A_ServerRouterMetaKeys: {
    readonly ROUTES: "_A_ServerRouterMeta_ROUTES";
    readonly ROUTES_CONFIGS: "_A_ServerRouterMeta_ROUTES_CONFIGS";
};

type A_ServerRouterRouteDefinition = {
    component: A_Component;
    handler: string;
    route: A_ServerRoute;
};
type A_ServerRouterMetaStructure = {
    [A_ServerRouterMetaKeys.ROUTES]: Map<string, A_ServerRouterRouteDefinition>;
    [A_ServerRouterMetaKeys.ROUTES_CONFIGS]: Array<A_ServerRoute>;
} & A_TYPES__ComponentMeta;
type A_ServerRouterMetaKeyNames = typeof A_ServerRouterMetaKeys[keyof typeof A_ServerRouterMetaKeys];
type A_ServerRouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
};

declare class A_ServerRouterMeta extends A_ComponentMeta<A_ServerRouterMetaStructure> {
    get routes(): Array<A_ServerRoute>;
    get definitions(): Map<string, A_ServerRouterRouteDefinition>;
    addRoute(regexp: RegExp, route: A_ServerRouterRouteDefinition): void;
    removeRoute(route: A_ServerRoute): void;
}

declare class A_ServerRouter extends A_Component {
    /**
     * Allows to define a custom route for POST requests
     *
     * @param path
     * @returns
     */
    static Post(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for GET requests
     *
     * @param path
     * @returns
     */
    static Get(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PUT requests
     *
     * @param path
     * @returns
     */
    static Put(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DELETE requests
     *
     * @param path
     * @returns
     */
    static Delete(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PATCH requests
     *
     * @param path
     * @returns
     */
    static Patch(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DEFAULT requests
     *
     * @param path
     * @returns
     */
    static Default(path: string | A_ServerRoute | RegExp | A_TYPES__Required<Partial<A_ServerRouterRouteConfig>, ['path']>): <TTarget extends _adaas_a_concept.A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Private method to have the same signature for all route methods
     *
     * @param method
     * @param path
     * @returns
     */
    private static defineRoute;
    protected load(logger: A_ServerLogger): Promise<void>;
    identifyRoute(request: A_Request, response: A_Response, scope: A_Scope, config: A_Config, logger: A_Logger, route: A_ServerRoute): Promise<void>;
}

/**
 *
 * This decorator should allow to set a default meta type for the class, this helps to avoid
 * the need to create custom meta classes for each class.
 *
 * @returns
 */
declare function A_ServerRouterDefineDecorator(route: A_ServerRoute): <TTarget extends A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;

interface A_StaticAlias {
    alias: string;
    path: string;
    directory: string;
    enabled?: boolean;
}
interface A_StaticDirectoryConfig {
    path: string;
    directory: string;
    alias?: string;
}
declare class A_StaticConfig extends A_Fragment {
    readonly directories: Array<string>;
    private _aliases;
    private _directoryConfigs;
    constructor(
    /**
     * Setup directories to serve static files from, comma separated
     */
    directories?: string[], 
    /**
     * Custom directory configurations with aliases
     */
    directoryConfigs?: A_StaticDirectoryConfig[]);
    private initializeDefaultAliases;
    private initializeCustomAliases;
    /**
     * Add a custom static file alias
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     */
    addAlias(alias: string, directory: string, path?: string): void;
    /**
     * Remove a static file alias
     * @param aliasPath - The path of the alias to remove
     */
    removeAlias(aliasPath: string): boolean;
    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     */
    setAliasEnabled(aliasPath: string, enabled: boolean): boolean;
    /**
     * Get all configured aliases
     */
    getAliases(): A_StaticAlias[];
    /**
     * Get enabled aliases only
     */
    getEnabledAliases(): A_StaticAlias[];
    /**
     * Find the best matching alias for a given request path
     * @param requestPath - The request path to match
     */
    findMatchingAlias(requestPath: string): A_StaticAlias | null;
    /**
     * Check if an alias exists
     * @param aliasPath - The path to check
     */
    hasAlias(aliasPath: string): boolean;
    /**
     * Get a specific alias by path
     * @param aliasPath - The path of the alias
     */
    getAlias(aliasPath: string): A_StaticAlias | undefined;
    /**
     * Add multiple aliases at once
     * @param aliases - Array of alias configurations
     */
    addAliases(aliases: A_StaticDirectoryConfig[]): void;
    /**
     * Clear all aliases
     */
    clearAliases(): void;
    /**
     * Update an existing alias
     * @param aliasPath - The path of the alias to update
     * @param updates - Partial updates to apply
     */
    updateAlias(aliasPath: string, updates: Partial<A_StaticAlias>): boolean;
    /**
     * Get statistics about configured aliases
     */
    getStats(): {
        total: number;
        enabled: number;
        disabled: number;
        directories: string[];
    };
    /**
     * Checks if a given path is configured in the proxy (legacy method)
     * @deprecated Use findMatchingAlias instead
     * @param path
     * @returns
     */
    has(path: string): boolean;
    /**
     * Gets the directory for a given path if configured (legacy method)
     *
     * @param path
     * @returns
     */
    get(path: string): string | undefined;
}

declare class A_StaticLoader extends A_Component {
    private _fsPolyfill;
    private _pathPolyfill;
    load(logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
    [A_HttpServerFeatures.onRequest](req: A_Request, res: A_Response, logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
    /**
     * Add a custom static file alias through the config
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    addAlias(alias: string, directory: string, config: A_StaticConfig, logger?: A_Logger, path?: string): void;
    /**
     * Remove a static file alias through the config
     * @param aliasPath - The path of the alias to remove
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    removeAlias(aliasPath: string, config: A_StaticConfig, logger?: A_Logger): boolean;
    /**
     * Get all configured aliases from config
     * @param config - Static config instance
     */
    getAliases(config: A_StaticConfig): A_StaticAlias[];
    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     * @param config - Static config instance
     * @param logger - Logger instance for logging
     */
    setAliasEnabled(aliasPath: string, enabled: boolean, config: A_StaticConfig, logger?: A_Logger): boolean;
    protected getMimeType(ext: string): string;
    protected safeFilePath(staticDir: string, reqUrl: string, host: string | undefined, pathPolyfill: any, fsPolyfill: any): string;
    protected serveFile(filePath: string, res: A_Response, logger: A_Logger, fsPolyfill: any, pathPolyfill: any): Promise<void>;
    protected getCacheControl(ext: string): string;
}

type A_SERVER_TYPES__StaticLoader_Init = {
    /**
     * Path to the static files directory
     */
    staticFilesPath: string;
};

export { A_HttpRequestData, A_HttpServer, A_HttpServerError, type A_HttpServerError_Init, type A_HttpServerError_Serialized, type A_HttpServerFeatureNames, A_HttpServerFeatures, A_HttpServerRequestContext, type A_HttpServerRequestMethod, A_ProxyConfig, A_Request, A_RequestEnvVariables, A_RequestEnvVariablesArray, type A_RequestEnvVariablesType, A_RequestError, type A_RequestFeatureNames, A_RequestFeatures, A_RequestHelper, type A_Request_BodyType, A_Request_Event, type A_Request_EventCallback, type A_Request_FileUpload, type A_Request_Init, type A_Request_Listener, type A_Request_Methods, type A_Request_Options, type A_Request_ParsedBody, type A_Request_Serialized, type A_Request_SessionData, type A_Request_ValidationResult, A_Response, A_ResponseError, type A_ResponseFeatureNames, A_ResponseFeatures, type A_Response_CacheOptions, type A_Response_CompressionOptions, type A_Response_Constructor, type A_Response_CookieOptions, type A_Response_DownloadOptions, type A_Response_Listener, type A_Response_Options, type A_Response_SendResponseObject, type A_Response_Serialized, type A_Response_StreamOptions, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, type A_SERVER_TYPES__A_EntityListCacheEntry, type A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListEvent, type A_SERVER_TYPES__A_EntityListPagination, type A_SERVER_TYPES__A_EntityListPaginationSerialized, type A_SERVER_TYPES__A_EntityListSerialized, type A_SERVER_TYPES__ProxyConfigConstructor, type A_SERVER_TYPES__ProxyConfigConstructorConfig, type A_SERVER_TYPES__RoutesConfig, type A_SERVER_TYPES__ServerConstructor, type A_SERVER_TYPES__ServerError_Init, type A_SERVER_TYPES__ServerError_Serialized, type A_SERVER_TYPES__ServerLoggerEnvVariables, type A_SERVER_TYPES__ServerLoggerRouteParams, type A_SERVER_TYPES__StaticLoader_Init, A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES, A_Server, A_ServerController, A_ServerEntityList, A_ServerEntityListCacheState, A_ServerEntityListPagination, A_ServerError, A_ServerListQueryFilter, A_ServerLogger, A_ServerMiddleware, A_ServerProxy, A_ServerRoute, type A_ServerRouteHttpMethodNames, A_ServerRouteHttpMethods, A_ServerRouteProtocols, A_ServerRouter, A_ServerRouterDefineDecorator, A_ServerRouterMeta, type A_ServerRouterMetaKeyNames, A_ServerRouterMetaKeys, type A_ServerRouterMetaStructure, type A_ServerRouterRouteConfig, type A_ServerRouterRouteDefinition, type A_StaticAlias, A_StaticConfig, type A_StaticDirectoryConfig, A_StaticLoader, type A_TYPES__ServerENVVariables, type A_serverRouteProtocolNames, PROXY_CONFIG_DEFAULTS };
