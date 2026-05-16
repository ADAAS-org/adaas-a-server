import type { IncomingMessage } from "http";
import { A_Request } from "./A-Request.entity";
import { A_TYPES__Entity_Serialized } from "@adaas/a-concept";
import { A_HttpServerRequestMethod } from "@adaas/a-server/server/A-HttpServer.types";
import { A_RequestFeatures } from "./A-Request.constants";


// =============================================
// Core Request Types
// =============================================
/**
 * Constructor parameters for A_Request entity
 */
export type A_Request_Init = {
    /**
     * Unique identifier for the request (should correspond to Response id)
     */
    id: string;

    /**
     * ASEID Shard for the request.  
     * it's some sort of request fingerprint
     */
    shard: string
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
export type A_Request_Serialized<
    _ReqBodyType = any,
    _ParamsType extends Record<string, string> = any,
    _QueryType = any,
> = A_TYPES__Entity_Serialized & {
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
}

/**
 * Supported HTTP request methods
 */
export type A_Request_Methods =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD'
    | 'CONNECT'
    | 'TRACE'
    | 'DEFAULT'; // Default is used for routes that do not have a method specified

/**
 * Request lifecycle events
 */
export enum A_Request_Event {
    Error = 'error',
    Finish = 'finish',
    Data = 'data',
    End = 'end',
    Close = 'close',
}


export type A_RequestFeatureNames = typeof A_RequestFeatures[keyof typeof A_RequestFeatures];

/**
 * Request event callback function type
 */
export type A_Request_EventCallback = (request: A_Request) => void;


// =============================================
// Body Parsing Types
// =============================================

/**
 * Supported body content types for parsing
 */
export type A_Request_BodyType = 'json' | 'form' | 'multipart' | 'raw' | 'text';

/**
 * Result of body parsing operation
 */
export type A_Request_ParsedBody = {
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



// =============================================
// Session Management Types
// =============================================

/**
 * Session data structure for user session management
 */
export type A_Request_SessionData = {
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


// =============================================
// File Upload Types
// =============================================

/**
 * File upload information for multipart requests
 */
export type A_Request_FileUpload = {
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


// =============================================
// Validation Types
// =============================================

/**
 * Request validation result with detailed feedback
 */
export type A_Request_ValidationResult = {
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


// =============================================
// Configuration Types
// =============================================

/**
 * Request processing configuration options
 */
export type A_Request_Options = {
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
export type A_Request_Listener = (req?: A_Request) => void;