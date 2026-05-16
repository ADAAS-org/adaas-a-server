import { A_HttpServerRequestContext } from './A-HttpServerRequest.context.mjs';
import { b as A_Request_BodyType, e as A_Request_FileUpload } from '../../A-Request.entity-r905O60G.mjs';
import 'http';
import '@adaas/a-utils/a-operation';
import '@adaas/a-concept';
import '../A-Server/A-HttpServer.error.mjs';
import '../A-Server/A-HttpServer.types.mjs';
import '../A-Server/A-HttpServer.constants.mjs';
import './A-Request.constants.mjs';
import './A-Request.env.mjs';
import './A-HttpRequestData.context.mjs';
import '@adaas/a-utils/a-execution';
import '@adaas/a-utils/a-config';
import '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

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

export { A_RequestHelper };
