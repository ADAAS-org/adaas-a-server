import { A_Error } from '@adaas/a-concept';
import { A_HttpServerError_Init, A_HttpServerError_Serialized } from './A-HttpServer.types.js';
import './A-HttpServer.constants.js';

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

export { A_HttpServerError };
