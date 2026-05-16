import type { IncomingHttpHeaders, IncomingMessage } from "http";
import {
    A_Context,
    A_Entity,
    A_Error,
    A_Feature,
    A_IdentityHelper,
    A_Inject,
    A_Scope,
    ASEID,
} from '@adaas/a-concept';
import {
    A_Request_BodyType,
    A_Request_FileUpload,
    A_Request_Init,
    A_Request_Listener,
    A_Request_Options,
    A_Request_Serialized,
    A_RequestFeatureNames,
} from "./A-Request.types";
import { A_HttpServerError } from "@adaas/a-server/server/A-HttpServer.error";
import { A_HttpServerRequestMethod } from "@adaas/a-server/server/A-HttpServer.types";
import { A_RequestFeatures } from "./A-Request.constants";
import { A_RequestHelper } from "./A-Request.helper";
import { A_RequestEnvVariables, A_RequestEnvVariablesType } from "./A-Request.env";
import { A_HttpServerRequestContext } from "./A-HttpServerRequest.context";
import { A_HttpRequestData } from "./A-HttpRequestData.context";
import { A_RequestError } from "./A-Request.error";
import { A_ScheduleObject } from "@adaas/a-utils/a-schedule";
import { A_Config } from "@adaas/a-utils/a-config";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";



export class A_Request<
    _ReqBodyType = any,
    _ParamsType extends Record<string, string> = any,
    _QueryType = any,
>
    extends A_Entity<
        A_Request_Init,
        A_Request_Serialized<_ReqBodyType, _ParamsType, _QueryType>
    > {

    static get concept(): string {
        return 'a-server';
    }

    // =============================================
    // Core Properties
    // =============================================

    /**
     * Request processing status
     */
    protected _listeners: Map<A_RequestFeatureNames, Set<A_Request_Listener>> = new Map();

    // =============================================
    // Cookie Management
    // =============================================
    /**
     * Parsed cookies from request headers
     */
    private _cookies!: Record<string, string>;

    // ============================================
    // Data Management 
    // ============================================
    /**
     * Request body type
     */
    private _bodyType?: A_Request_BodyType;
    /**
     * Request body data
     */
    private _body!: _ReqBodyType;
    private _req!: IncomingMessage;

    private _timeout: A_ScheduleObject | undefined;

    // =============================================
    // File Upload Handling
    // =============================================
    /**
     * Uploaded files from multipart requests
     */
    private _files!: A_Request_FileUpload[];

    // =============================================
    // Request Metadata
    // =============================================

    /**
     * User agent string from request headers
     */
    private _userAgent?: string;

    /**
     * Content length in bytes
     */
    private _contentLength?: number;

    // =============================================
    // Configuration
    // =============================================
    /**
     * Request processing configuration options
     */
    private _options!: Required<A_Request_Options>

    private _routeDefinition?: A_ServerRoute;


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
    constructor(params: A_Request_Init, options?: A_Request_Options) {
        super(params);
        this._options = {
            maxBodySize: 10 * 1024 * 1024, // 10MB default
            timeout: 30000, // 30 seconds
            encoding: 'utf8',
            parseCookies: true,
            parseQuery: true,
            parseBody: true,
            enableFileUploads: false,
            strictValidation: false,
            ...(options || {})
        }
    }

    /**
     * Creates A_Request entity from initialization data
     * 
     * @param newEntity 
     */
    fromNew(newEntity: A_Request_Init): void {
        this.aseid = new ASEID({
            concept: (this.constructor as typeof A_Request).concept,
            scope: newEntity.scope,
            entity: (this.constructor as typeof A_Request).entity,
            shard: newEntity.shard,
            id: newEntity.id
        });

        this._req = newEntity.request;
    }


    /**
     * Core HTTP request object from Node.js
     */
    get original(): IncomingMessage {
        return this._req;
    }
    /**
     * Parsed request body data
     */
    get body(): _ReqBodyType {
        return this._body;
    }
    /**
     * URL route parameters (e.g., /users/:id)
     */
    get params(): _ParamsType {

        console.log('Extracting params using route definition:', this.url);
        console.log('Extracting params using route definition:', this._routeDefinition?.path);

        return A_RequestHelper.extractParams(this.url,
            this._routeDefinition?.path || ''

        ) as _ParamsType;
    }
    /**
     * Query string parameters
     */
    get query(): _QueryType {
        return A_RequestHelper.extractQuery(this.url) as _QueryType;
    }
    /**
     * Gets the parsed cookies
     */
    get cookies(): Record<string, string> {
        if (!this._cookies) {
            this._cookies = A_RequestHelper.parseCookies(this.headers['cookie']);
        }

        return this._cookies;
    }
    /**
     * Gets the request URL
     */
    get url(): string {
        return this.original.url!;
    }
    /**
     * Gets the HTTP method
     */
    get method(): A_HttpServerRequestMethod {
        return (String(this.original.method).toUpperCase() as A_HttpServerRequestMethod) || 'DEFAULT';
    }
    /**
     * Gets the request headers
     */
    get headers(): IncomingHttpHeaders {
        return this.original.headers;
    }
    /**
     * Gets the timestamp when the request was started
     */
    get startedAt(): Date | undefined {
        const timeId = A_IdentityHelper.parseTimeId(this.aseid.id.split('-')[0]);
        return timeId ? new Date(timeId.timestamp) : undefined;
    }
    /**
     * Gets uploaded files
     */
    get files(): A_Request_FileUpload[] {
        return this._files || [];
    }
    /**
     * Gets user agent string
     */
    get userAgent(): string | undefined {
        return this.headers?.['user-agent'] || ''
    }
    /**
     * Gets content length
     */
    get contentLength(): number {
        return this.headers?.['content-length'] ? parseInt(this.headers['content-length'], 10) : 0;
    }
    /**
     * Check if request is secure (HTTPS)
     */
    get isSecure(): boolean {
        return this.original.socket && 'encrypted' in this.original.socket;
    }
    /**
     * Check if request is from mobile device
     */
    get isMobile(): boolean {
        const userAgent = this._userAgent?.toLowerCase() || '';
        return /mobile|android|iphone|ipad|phone/i.test(userAgent);
    }
    /**
     * Get request size in bytes
     */
    get size(): number {
        return this._contentLength || 0;
    }
    /**
     * Gets content type from headers
     */
    get contentType(): string | undefined {
        return this.headers['content-type'] || undefined;
    }















    /**
     * Pipes request stream to destination
     */
    pipe(
        destination: NodeJS.WritableStream,
        options?: { end?: boolean | undefined; }
    ): NodeJS.WritableStream {
        return this.original.pipe(destination, options);
    }
    /**
     * Get a file by field name
     */
    getFile(fieldName: string): A_Request_FileUpload | undefined {
        return this._files?.find(file => file.fieldName === fieldName);
    }

    /**
     * Get all files for a specific field name
     */
    getFiles(fieldName: string): A_Request_FileUpload[] {
        return this._files?.filter(file => file.fieldName === fieldName) || [];
    }

    /**
     * Check if request has any files
     */
    hasFiles(): boolean {
        return this._files && this._files.length > 0;
    }

    /**
     * Check if request has a file with specific field name
     */
    hasFile(fieldName: string): boolean {
        return this._files?.some(file => file.fieldName === fieldName) || false;
    }

    /**
     * Get total size of all uploaded files
     */
    getTotalFileSize(): number {
        return this._files?.reduce((total, file) => total + file.size, 0) || 0;
    }

    /**
     * Get a cookie value
     */
    getCookie(name: string): string | undefined {
        return this._cookies[name];
    }
    /**
     * Check if request has a specific cookie
     */
    hasCookie(name: string): boolean {
        return name in this._cookies;
    }
    /**
     * Check if request accepts specific content type
     */
    accepts(contentType: string): boolean {
        const acceptHeader = this.headers.accept || '';
        return acceptHeader.includes(contentType) || acceptHeader.includes('*/*');
    }
    /**
     * Get request fingerprint for caching/identification
     */
    getFingerprint(): string {
        const components = [
            this.method,
            this.url,
            this._userAgent,
            JSON.stringify(this.body)
        ];

        return Buffer.from(components.join('|')).toString('base64');
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
    on(event: A_RequestFeatureNames, listener: A_Request_Listener) {
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
    off(event: A_RequestFeatureNames, listener: A_Request_Listener) {
        this._listeners.get(event)?.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     * 
     * @param event 
     */
    emit(event: A_RequestFeatureNames) {
        this._listeners.get(event)?.forEach(async listener => {
            listener(this);
        });
    }

    /**
     * Allows to use a route definition for this request
     * 
     * @param route 
     */
    useRoute(route: A_ServerRoute): void {
        this._routeDefinition = route;
    }


    clearTimeout(): void {
        this._timeout?.clear();
    }

    /**
     * Initialize the request - parse cookies, query, body etc.
     */
    async load(): Promise<void> {

        // this.original.on('close', this.handleClose.bind(this));

        try {

            await this.call(A_RequestFeatures.onInit);

            await new Promise<void>((resolve, reject) => {
                const onData = this.handleData.bind(this);
                const onEnd = () => {
                    cleanup();
                    resolve();
                };
                const onError = (err: Error) => {
                    cleanup();
                    reject(err);
                };

                const cleanup = () => {
                    this.original.off('data', onData);
                    this.original.off('end', onEnd);
                    this.original.off('error', onError);
                };

                this.original.on('data', onData);
                this.original.on('end', onEnd);
                this.original.on('error', onError);
            });

            await this.handleEnd();

        } catch (error) {

            const targetError = error instanceof A_HttpServerError
                ? error
                : new A_HttpServerError({
                    status: 500,
                    description: 'An error occurred while processing the request.',
                    originalError: error
                });

            await this.fail(targetError);
        }

        this.original.on('error', err => {
            this.fail(new A_HttpServerError({
                status: 500,
                description: `Request error: ${err.message}`,
                originalError: err
            }));
        });
    }


    async validate(): Promise<void> {
        try {
            await this.call(A_RequestFeatures.onValidate);
        } catch (error) {
            const targetError = error instanceof A_HttpServerError
                ? error
                : new A_HttpServerError({
                    status: 400,
                    description: ` Request Validation Failed: ${error instanceof A_Error ? error.message : 'Invalid request.'}`,
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
    async destroy(): Promise<any> {
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
    async fail(err?: A_HttpServerError): Promise<void> {
        console.log('Request failed with error:', this.method, this.url, err?.message);

        if (err)
            A_Context
                .scope(this)
                .register(err);

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
    protected async handleData(data: Buffer): Promise<void> {
        const chunk = new A_HttpRequestData(data);

        const scope = new A_Scope({
            name: `${this.aseid.toString()}-data-chunk`,
            fragments: [chunk],
        })
        .inherit(A_Context.scope(this));

        try {

            scope.inherit(A_Context.scope(this));

            await this.call(A_RequestFeatures.onData, scope);

            scope.destroy();

        } catch (error) {

            scope.destroy();

            await this.fail(new A_HttpServerError({
                status: 500,
                description: `Request data chunk error: ${error instanceof A_Error ? error.message : 'Unable to process request data chunk.'}`,
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
    protected async handleClose(): Promise<void> {
        try {
            await this.call(A_RequestFeatures.onClose);
        } catch (error) {

            await this.fail(new A_HttpServerError({
                status: 499,
                description: `Request closed error: ${error instanceof A_Error ? error.message : 'Request was closed.'}`,
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
    protected async handleEnd(): Promise<void> {
        try {

            await this.call(A_RequestFeatures.onEnd);

        } catch (error) {
            await this.fail(new A_HttpServerError({
                status: 500,
                description: `Request processing error: ${error instanceof A_Error ? error.message : 'Unable to process request.'}`,
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
    protected async handleTimeout(): Promise<void> {
        try {
            await this.call(A_RequestFeatures.onTimeout);

            throw new A_HttpServerError({
                status: 503,
                description: `Request processing take too long and timed out. Current timeout is set to ${this._options.timeout} ms.`,
            })

        } catch (error) {

            const targetError = error instanceof A_HttpServerError
                ? error
                : new A_HttpServerError({
                    status: 503,
                    description: `Request timeout error: ${error instanceof A_Error ? error.message : 'Request timed out.'}`,
                    originalError: error
                });

            await this.fail(targetError);
        }
    }




    // ======================================================================================
    // A-Request Feature Extensions
    // ======================================================================================

    @A_Feature.Extend()
    /**
     * Hook called during initialization
     * 
     * Default Behavior: Starts request processing timer and sets up timeout handling.
     */
    async [A_RequestFeatures.onInit](
        @A_Inject(A_Config) config: A_Config<['A_SERVER_REQUEST_TIMEOUT']>,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {

        context.startProcessing();

        const ms = Number(config?.get('A_SERVER_REQUEST_TIMEOUT')
            || A_RequestEnvVariables.A_SERVER_REQUEST_TIMEOUT);

        this._timeout = new A_ScheduleObject(ms, this.handleTimeout.bind(this), { resolveOnClear: true });
    }


    @A_Feature.Extend({
        before: /.*/
    })
    /**
     * Hook called on receiving data chunk
     * 
     * Default Behavior: Accumulates data chunks into context buffers and checks for max body size.
     */
    async [A_RequestFeatures.onData](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        @A_Inject(A_HttpRequestData) chunk: A_HttpRequestData,
        ...args: any[]
    ): Promise<void> {

        if (context.length + chunk.length > this._options.maxBodySize!) {
            throw new A_RequestError(
                A_RequestError.RequestBodyParsingError,
                `Request body too large. Max size is ${this._options.maxBodySize} bytes.`
            );
        }

        context.buffers.push(chunk.data);
        if (!context.data)
            context.data = '';

        context.data += chunk.toString(this._options.encoding as BufferEncoding);
    }

    @A_Feature.Extend({
        before: /.*/
    })
    /**
     * Hook called on request timeout
     * 
     * Default Behavior: Stops request processing and emits timeout event.
     * 
     * @param context 
     * @param args 
     */
    async [A_RequestFeatures.onTimeout](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {
        context.stopProcessing();

        this._timeout?.clear();

        this.emit(A_RequestFeatures.onTimeout);
    }

    @A_Feature.Extend({
        before: /.*/
    })
    /**
     * Hook called on request close
     */
    async [A_RequestFeatures.onClose](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {

        this.emit(A_RequestFeatures.onClose);
    }


    @A_Feature.Extend({
        after: /.*/
    })
    /**
     * Hook called on request error
     */
    async [A_RequestFeatures.onError](
        @A_Inject(A_Error) error: A_Error,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {
        context.stopProcessing();

        this.emit(A_RequestFeatures.onError);
    }

    @A_Feature.Extend()
    /**
     * Hook called to parse request data
     */
    async [A_RequestFeatures.onEnd](
        @A_Inject(A_Config) config: A_Config<A_RequestEnvVariablesType>,
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {

        const { data, type } = A_RequestHelper.parseRequestBody(context);

        this._body = data;
        this._bodyType = type;
    }



    @A_Feature.Extend()
    /**
     * Hook called to validate request data
     */
    async [A_RequestFeatures.onValidate](
        @A_Inject(A_HttpServerRequestContext) context: A_HttpServerRequestContext,
        ...args: any[]
    ): Promise<void> {
        // Validate file uploads if multipart data detected
        if (!!this.contentType && this.contentType.includes('multipart/form-data') && !this._options.enableFileUploads) {
            throw new A_HttpServerError({
                status: 400,
                description: 'File uploads detected but not enabled. Set enableFileUploads: true in options.',
            });
        }
    }


    /**
     * Serialize request for logging/debugging
     */
    toJSON(): A_Request_Serialized {
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
            totalFileSize: this.getTotalFileSize(),
        };
    }
}