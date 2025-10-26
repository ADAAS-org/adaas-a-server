import { A_Component, A_Fragment, A_Error, A_TYPES__Entity_Serialized, A_TYPES__Error_Init, A_TYPES__Error_Serialized, A_Entity, A_Scope, A_Container, ASEID, A_TYPES__ComponentMeta } from '@adaas/a-concept';
import { A_Channel, A_Logger, A_Config, A_Polyfill } from '@adaas/a-utils';
import * as http from 'http';
import { IncomingMessage, IncomingHttpHeaders, ServerResponse } from 'http';
import { A_TYPES__Required } from '@adaas/a-concept/dist/src/types/A_Common.types';
import { A_TYPES__ConceptENVVariables } from '@adaas/a-concept/dist/src/constants/env.constants';

type A_SERVER_TYPES__ServerFeatures = [
    A_SERVER_TYPES__ServerFeature.beforeStart,
    A_SERVER_TYPES__ServerFeature.afterStart,
    A_SERVER_TYPES__ServerFeature.beforeStop,
    A_SERVER_TYPES__ServerFeature.afterStop,
    A_SERVER_TYPES__ServerFeature.onRequest
];
declare enum A_SERVER_TYPES__ServerFeature {
    beforeStart = "beforeStart",
    afterStart = "afterStart",
    beforeStop = "beforeStop",
    afterStop = "afterStop",
    beforeRequest = "beforeRequest",
    onRequest = "onRequest",
    afterRequest = "afterRequest"
}
type A_SERVER_TYPES__ServerConstructor$1 = {
    name: string;
    version: string;
    controllers: Array<A_Component>;
    entities: Array<A_Fragment>;
    extensions: Array<A_Component>;
};
declare enum A_SERVER_TYPES__ServerMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    CONNECT = "CONNECT",
    TRACE = "TRACE",
    DEFAULT = "DEFAULT"
}

type A_SERVER_TYPES__HttpChannelSendParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_SERVER_TYPES__ServerMethod;
    /**
     * Request URL
     */
    url: string;
    /**
     * Request Body or Query Parameters
     */
    data?: any;
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>;
};
type A_SERVER_TYPES__HttpChannelRequestParams<M extends Record<string, any> = any> = {
    /**
     * HTTP Method
     */
    method: A_SERVER_TYPES__ServerMethod;
    /**
     * Request URL
     */
    url: string;
    /**
     * Request Body or Query Parameters
     */
    data?: any;
    /**
     * Request Configuration
     */
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig<M>>;
};
type A_SERVER_TYPES__HttpChannelRequestConfig<M extends Record<string, any> = any> = {
    /**
     * Response Type
     */
    responseType: "json" | "text" | "blob";
    /**
     * Request Headers
     */
    headers: Record<string, string>;
    /**
     * Query Parameters
     */
    params: Record<string, any>;
    /**
     * Metadata
     */
    meta: M;
    /**
     * Throw on Error
     */
    throwOnError: boolean;
};

declare class A_HTTPChannel_RequestContext<T extends any = any> extends A_Fragment {
    url: string;
    method: A_SERVER_TYPES__ServerMethod;
    data?: any;
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestParams['config']>;
    constructor(params: A_SERVER_TYPES__HttpChannelRequestParams);
    result?: T;
    error?: any;
}

declare class A_HTTPChannel extends A_Channel {
    protected baseUrl?: string;
    connect(): Promise<void>;
    /**
     * Allows to send an HTTP request without expecting a response
     *
     * @param params
     */
    send(params: A_SERVER_TYPES__HttpChannelSendParams): Promise<void>;
    /**
     * Makes an HTTP request
     *
     * @param params
     * @returns
     */
    request<T = any, M extends Record<string, any> = any>(
    /**
     * Provide request parameters
     */
    params: A_SERVER_TYPES__HttpChannelRequestParams<M>): Promise<A_HTTPChannel_RequestContext<T>>;
    post<T, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    get<T, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    put<T, M extends Record<string, any> = any>(url: string, body?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    delete<T, M extends Record<string, any> = any>(url: string, params?: any, config?: Partial<A_SERVER_TYPES__HttpChannelRequestConfig>): Promise<A_HTTPChannel_RequestContext<T>>;
    protected buildURL(path?: string, params?: Record<string, any>): string;
}

declare class A_HTTPChannelError extends A_Error {
    static readonly HttpRequestError = "HTTP Channel Request Error";
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

type A_SERVER_TYPES__RequestConstructor = {
    /**
     * Should correspond to Response id
     */
    id: string;
    request: IncomingMessage;
    scope: string;
};
type A_SERVER_TYPES__RequestSerialized = {} & A_TYPES__Entity_Serialized;
type A_SERVER_TYPES__RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | 'DEFAULT';
declare enum A_SERVER_TYPES__RequestEvent {
    Error = "error",
    Finish = "finish",
    Data = "data",
    End = "end",
    Close = "close"
}
type A_SERVER_TYPES__RequestEventCallback = (request: A_Request) => void;

declare class A_Route {
    url: string;
    method: A_SERVER_TYPES__RequestMethods;
    constructor(url: string | RegExp, method: A_SERVER_TYPES__RequestMethods);
    constructor(url: string | RegExp);
    /**
     * returns path only without query and hash
     */
    get path(): string;
    get params(): string[];
    extractParams(url: string): Record<string, string>;
    extractQuery(url: string): Record<string, string>;
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}

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

declare class A_ServerError extends A_Error<A_SERVER_TYPES__ServerError_Init, A_SERVER_TYPES__ServerError_Serialized> {
    status: number;
    protected fromConstructor(params: A_SERVER_TYPES__ServerError_Init): void;
    toJSON(): A_SERVER_TYPES__ServerError_Serialized;
}

declare class A_Request<_ReqBodyType = any, _ResponseType = any, _ParamsType extends Record<string, string> = any, _QueryType = any> extends A_Entity<A_SERVER_TYPES__RequestConstructor, A_SERVER_TYPES__RequestSerialized> {
    static get namespace(): string;
    req: IncomingMessage;
    body: _ReqBodyType;
    params: _ParamsType;
    query: _QueryType;
    response?: _ResponseType;
    error?: A_ServerError;
    /**
     * Duration of the request in milliseconds
     */
    duration: number;
    fromNew(newEntity: A_SERVER_TYPES__RequestConstructor): void;
    get startedAt(): Date | undefined;
    get url(): string;
    get method(): A_SERVER_TYPES__RequestMethods;
    get headers(): IncomingHttpHeaders;
    get route(): A_Route;
    pipe(destination: NodeJS.WritableStream, options?: {
        end?: boolean | undefined;
    }): NodeJS.WritableStream;
    init(): Promise<void>;
    extractParams(url: string): Record<string, string>;
    extractQuery(url: string): Record<string, string>;
    parseBody(): Promise<any>;
}

type A_SERVER_TYPES__ResponseConstructor = {
    /**
     * Should correspond to Request id
     */
    id: string;
    scope: string;
    response: ServerResponse;
};
declare enum A_SERVER_TYPES__ResponseEvent {
    Error = "error",
    Finish = "finish",
    Data = "data",
    End = "end",
    Close = "close"
}
type A_SERVER_TYPES__ResponseSerialized = A_TYPES__Entity_Serialized;
type A_SERVER_TYPES__SendResponseObject<_ResponseType = any> = Record<string, _ResponseType>;

declare class A_Response<_ResponseType = any> extends A_Entity<A_SERVER_TYPES__ResponseConstructor, A_SERVER_TYPES__ResponseSerialized> {
    /**
     * Duration of the request in milliseconds
     */
    duration: number;
    private res;
    private data;
    error?: A_ServerError;
    fromNew(newEntity: A_SERVER_TYPES__ResponseConstructor): void;
    get headersSent(): boolean;
    get original(): ServerResponse<http.IncomingMessage>;
    get statusCode(): number;
    init(): Promise<void>;
    failed(error: A_ServerError | A_Error | Error | any): void;
    send(data?: string | object): void;
    destroy(error: Error | unknown, scope?: A_Scope): Promise<any>;
    json(data?: object): void;
    status(code: number): this;
    writeHead(statusCode: number, headers?: Record<string, string> | IncomingHttpHeaders | any): void;
    setHeader(key: string, value: string): void;
    getHeader(key: string): string | number | string[] | undefined;
    add(key: string, data: _ResponseType): void;
    toResponse(): A_SERVER_TYPES__SendResponseObject<_ResponseType>;
}

/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
declare class A_Service extends A_Container {
    private server;
    port: number;
    load(): Promise<void>;
    protected listen(): Promise<void>;
    protected close(): Promise<void>;
    start(): Promise<void>;
    beforeStart(): Promise<void>;
    afterStart(): Promise<void>;
    stop(): Promise<void>;
    beforeRequest(scope: A_Scope): Promise<void>;
    afterRequest(scope: A_Scope): Promise<void>;
    onRequest(request: IncomingMessage, response: ServerResponse): Promise<void>;
    protected convertToAServer(request: IncomingMessage, response: ServerResponse): Promise<{
        req: A_Request;
        res: A_Response;
    }>;
    protected generateRequestId(method: string, url: string): Promise<string>;
    beforeStop(): Promise<void>;
    afterStop(): Promise<void>;
}

type A_SERVER_TYPES__ServerConstructor = {
    name: string;
    version: string;
    routes: A_Route[];
    port: number;
};

declare class A_Server extends A_Fragment {
    port: number;
    version: string;
    protected _routes: A_Route[];
    constructor(params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
        'port',
        'name'
    ]>);
    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_Route[];
}

type A_SERVER_TYPES__ProxyConfigConstructor = Record<string, string | Partial<A_SERVER_TYPES__ProxyConfigConstructorConfig>>;
type A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    hostname: string;
    protocol: 'http' | 'https' | string;
    port: number;
    path: string;
    method: A_SERVER_TYPES__RequestMethods;
    headers: Record<string, string>;
};
type A_SERVER_TYPES__RoutesConfig = {
    route: A_Route;
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
    has(path: string): false | string;
}

declare class A_ListQueryFilter<FilterFields extends string[]> extends A_Fragment {
    protected _query: string | Partial<Record<FilterFields[number], string>>;
    protected defaults: Partial<Record<FilterFields[number], string>>;
    protected parsedQuery: Record<FilterFields[number], string>;
    constructor(_query?: string | Partial<Record<FilterFields[number], string>>, defaults?: Partial<Record<FilterFields[number], string>>);
    get query(): string | Partial<Record<FilterFields[number], string>>;
    get(property: FilterFields[number], defaultValue?: string): string;
    protected parseQueryString(value?: string | Partial<Record<FilterFields[number], string>>): Record<FilterFields[number], string>;
}

type A_SERVER_TYPES__AEntityFactoryConstructor1 = {
    [Key in string]: typeof A_Entity;
};
type A_SERVER_TYPES__AEntityFactoryConstructor2 = Array<typeof A_Entity>;

declare class A_EntityFactory extends A_Fragment {
    private _entities;
    constructor(map: A_SERVER_TYPES__AEntityFactoryConstructor1);
    constructor(entities: A_SERVER_TYPES__AEntityFactoryConstructor2);
    constructor(map: A_SERVER_TYPES__AEntityFactoryConstructor1, entities: A_SERVER_TYPES__AEntityFactoryConstructor2);
    protected _setEntities(entities?: A_SERVER_TYPES__AEntityFactoryConstructor2 | A_SERVER_TYPES__AEntityFactoryConstructor1): void;
    add(key: string, entity: typeof A_Entity): void;
    add(entity: typeof A_Entity): void;
    has(aseid: ASEID): boolean;
    has(
    /**
     * The name of the entity
     */
    entity: string): boolean;
    has(
    /**
     * The ASEID of the entity
     */
    aseid: string): boolean;
    /**
     * Resolves the entity constructor by the entity name
     *
     * @param entity
     */
    resolve(entity: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolve(aseid: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolve(aseid: ASEID): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolveByName(name: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
}

type A_SERVER_TYPES__A_EntityListConstructor = {
    name: string;
    scope: string;
    constructor: {
        new (...args: any[]): A_Entity;
    };
};
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

/**
 * A-EntityList
 *
 * Entity that represents a list of entities with pagination of particular type
 */
declare class A_EntityList<EntityType extends A_Entity = A_Entity> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListSerialized> {
    static get scope(): string;
    protected _entityConstructor: new (...args: ConstructorParameters<typeof A_Entity>) => EntityType;
    protected _items: Array<EntityType>;
    protected _pagination: A_SERVER_TYPES__A_EntityListPagination;
    /**
     * Returns the entity constructor used for the list
     */
    get entityConstructor(): new (...args: ConstructorParameters<typeof A_Entity>) => EntityType;
    /**
     * Returns the list of items contained in the entity list
     */
    get items(): Array<EntityType>;
    /**
     * Returns pagination information about the entity list
     */
    get pagination(): A_SERVER_TYPES__A_EntityListPagination;
    /**
     * Creates a new instance of A_EntityList
     *
     * @param newEntity
     */
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor): void;
    /**
     * Allows to convert Repository Response data to EntityList instance
     *
     * [!] This method does not load the data from the repository, it only converts the data to the EntityList instance
     *
     * @param items
     * @param pagination
     */
    fromList(items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    /**
     * Serializes the EntityList to a JSON object
     *
     * @returns
     */
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType>;
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

declare class A_ServerLogger extends A_Logger {
    protected config: A_Config<A_SERVER_TYPES__ServerLoggerEnvVariables>;
    onRequestEnd(request: A_Request, response: A_Response): Promise<void>;
    onRequestError(request: A_Request): Promise<void>;
    logStart(container: A_Service): void;
    logStop(server: A_Server): void;
    metrics(): void;
    routes(routes: Array<A_Route>): void;
    /**
     * Logs the route information based on status code
     *
     * @param route
     */
    route(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log200(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log404(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log500(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    log400(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
    logDefault(route: A_SERVER_TYPES__ServerLoggerRouteParams): void;
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

declare class A_EntityController extends A_Component {
    list(request: A_Request<any, any, {
        type: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope, config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>): Promise<void>;
    load(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    create(request: A_Request<any, any, {
        aseid: string;
    }>, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    update(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    delete(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    callEntity(request: A_Request<any, any, {
        aseid: string;
        action: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
}

declare enum A_SERVER_TYPES__RouterMethod {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    DEFAULT = "DEFAULT"
}
type A_TYPES__ARouterComponentMeta = {
    [A_SERVER_TYPES__ARouterComponentMetaKey.ROUTES]: Map<string, A_TYPES__ARouterDefineRoute>;
} & A_TYPES__ComponentMeta;
type A_TYPES__ARouterDefineRoute = {
    component: A_Component;
    handler: string;
    route: A_Route;
};
declare enum A_SERVER_TYPES__ARouterComponentMetaKey {
    ROUTES = "ROUTES"
}
type A_SERVER_TYPES__ARouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
};

declare class A_Router extends A_Component {
    /**
     * Allows to define a custom route for POST requests
     *
     * @param path
     * @returns
     */
    static Post(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for GET requests
     *
     * @param path
     * @returns
     */
    static Get(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PUT requests
     *
     * @param path
     * @returns
     */
    static Put(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DELETE requests
     *
     * @param path
     * @returns
     */
    static Delete(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for PATCH requests
     *
     * @param path
     * @returns
     */
    static Patch(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Allows to define a custom route for DEFAULT requests
     *
     * @param path
     * @returns
     */
    static Default(path: string | A_Route | RegExp | A_TYPES__Required<Partial<A_SERVER_TYPES__ARouterRouteConfig>, ['path']>): (target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;
    static routes: Array<A_Route>;
    /**
     * Private method to have the same signature for all route methods
     *
     * @param method
     * @param path
     * @returns
     */
    private static defineRoute;
    protected load(logger: A_ServerLogger): Promise<void>;
    identifyRoute(request: A_Request, response: A_Response, scope: A_Scope, config: A_Config, logger: A_Logger): Promise<void>;
}

declare class A_ServerHealthMonitor extends A_Component {
    get(config: A_Config<['VERSION_PATH', 'EXPOSED_PROPERTIES']>, request: A_Request, response: A_Response, logger: A_Logger): Promise<any>;
}

declare class A_ServerProxy extends A_Component {
    load(logger: A_Logger, config: A_ProxyConfig): Promise<void>;
    onRequest(req: A_Request, res: A_Response, proxyConfig: A_ProxyConfig, logger: A_Logger, polyfill: A_Polyfill): Promise<void>;
}

declare class A_ServerCORS extends A_Component {
    private config;
    init(config: A_Config<['ORIGIN', 'METHODS', 'HEADERS', 'CREDENTIALS', 'MAX_AGE']>): Promise<void>;
    apply(aReq: A_Request, aRes: A_Response): void;
}

declare class A_StaticLoader extends A_Component {
    private _fsPolyfill;
    private _pathPolyfill;
    load(logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
    onRequest(req: A_Request, res: A_Response, logger: A_Logger, config: A_StaticConfig, polyfill: A_Polyfill): Promise<void>;
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

declare class A_Controller extends A_Component {
    callEntityMethod(request: A_Request<any, any, {
        component: string;
        operation: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}

declare class A_ListingController extends A_Component {
    list(request: A_Request<any, any, {
        type: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope, config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>): Promise<void>;
}

declare class A_CommandController extends A_Component {
    handleCommand(req: A_Request<any, any, {
        command: string;
    }>, res: A_Response, scope: A_Scope, container: A_Container): Promise<void>;
}

declare class A_EntityRepository extends A_Component {
    list(channel: A_HTTPChannel, entity: A_EntityList, scope: A_Scope): Promise<void>;
    load(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    save(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    destroy(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
}

type A_SERVER_TYPES__CorsConfig = {
    origin: string;
    methods: string[];
    headers: string[];
    credentials: boolean;
    maxAge: number;
};

declare enum A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle {
    onAfterRequest = "onAfterHttpChannelRequest",
    onError = "onHttpChannelError",
    onBeforeRequest = "onBeforeHttpChannelRequest"
}

export { A_CommandController, A_Controller, A_EntityController, A_EntityFactory, A_EntityList, A_EntityRepository, A_HTTPChannel, A_HTTPChannelError, A_HTTPChannel_RequestContext, A_ListQueryFilter, A_ListingController, A_ProxyConfig, A_Request, A_Response, A_Route, A_Router, A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, type A_SERVER_TYPES__AEntityFactoryConstructor1, type A_SERVER_TYPES__AEntityFactoryConstructor2, A_SERVER_TYPES__ARouterComponentMetaKey, type A_SERVER_TYPES__ARouterRouteConfig, type A_SERVER_TYPES__CorsConfig, type A_SERVER_TYPES__HttpChannelRequestConfig, type A_SERVER_TYPES__HttpChannelRequestParams, type A_SERVER_TYPES__HttpChannelSendParams, type A_SERVER_TYPES__ProxyConfigConstructor, type A_SERVER_TYPES__ProxyConfigConstructorConfig, type A_SERVER_TYPES__RequestConstructor, A_SERVER_TYPES__RequestEvent, type A_SERVER_TYPES__RequestEventCallback, type A_SERVER_TYPES__RequestMethods, type A_SERVER_TYPES__RequestSerialized, type A_SERVER_TYPES__ResponseConstructor, A_SERVER_TYPES__ResponseEvent, type A_SERVER_TYPES__ResponseSerialized, A_SERVER_TYPES__RouterMethod, type A_SERVER_TYPES__RoutesConfig, type A_SERVER_TYPES__SendResponseObject, type A_SERVER_TYPES__ServerConstructor$1 as A_SERVER_TYPES__ServerConstructor, type A_SERVER_TYPES__ServerError_Init, type A_SERVER_TYPES__ServerError_Serialized, A_SERVER_TYPES__ServerFeature, type A_SERVER_TYPES__ServerFeatures, A_SERVER_TYPES__ServerMethod, A_Server, A_ServerCORS, A_ServerError, A_ServerHealthMonitor, A_ServerLogger, A_ServerProxy, A_Service, A_StaticConfig, A_StaticLoader, type A_TYPES__ARouterComponentMeta, type A_TYPES__ARouterDefineRoute, type A_TYPES__ServerENVVariables };
