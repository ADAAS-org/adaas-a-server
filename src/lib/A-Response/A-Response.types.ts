import { ServerResponse } from "http";
import type { A_Response } from "./A-Response.entity";
import { A_TYPES__Entity_Serialized } from "@adaas/a-concept";
import { A_ResponseFeatures } from "./A-Response.constants";


export type A_Response_Constructor = {
    /**
     * Should correspond to Request id
     */
    id: string,
    scope: string,
    shard: string,
    response: ServerResponse,
}


export type A_Response_Serialized<T extends any> = {
    status: number;
    headersSent: boolean;
    size: number;
    data: T;
    redirectURL?: string;
} & A_TYPES__Entity_Serialized;

export type A_Response_SendResponseObject<_ResponseType = any> = Record<string, _ResponseType>;

// Enhanced types for comprehensive response processing

/**
 * Cookie configuration for setting response cookies
 */
export type A_Response_CookieOptions = {
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    expires?: Date;
    sameSite?: 'strict' | 'lax' | 'none';
    signed?: boolean;
};


export type A_ResponseFeatureNames = typeof A_ResponseFeatures[keyof typeof A_ResponseFeatures];


/**
 * Response streaming options
 */
export type A_Response_StreamOptions = {
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
export type A_Response_CompressionOptions = {
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
export type A_Response_DownloadOptions = {
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
export type A_Response_CacheOptions = {
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
export type A_Response_Options = {
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
export type A_Response_Listener = (res?: A_Response) => void; 