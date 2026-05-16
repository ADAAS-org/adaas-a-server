import { A_HttpServerRequestContext } from "./A-HttpServerRequest.context";
import { A_RequestError } from "./A-Request.error";
import { A_Request_BodyType, A_Request_FileUpload } from "./A-Request.types";

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
export class A_RequestHelper {

    /**
     * Extract URL parameters from a URL using a route pattern
     * @param url - The actual URL to extract parameters from
     * @param routePattern - The route pattern with parameters (e.g., "/users/:id/posts/:postId")
     * @returns Object containing extracted parameters
     */
    static extractParams(url: string, routePattern: string): Record<string, string> {
        // Remove query string (anything after ?)
        const cleanUrl = url.split('?')[0];
        const cleanPattern = routePattern.split('?')[0];

        const urlSegments = cleanUrl.split('/').filter(Boolean);
        const patternSegments = cleanPattern.split('/').filter(Boolean);

        const params: Record<string, string> = {};

        for (let i = 0; i < patternSegments.length; i++) {
            const patternSegment = patternSegments[i];
            const urlSegment = urlSegments[i];

            if (patternSegment.startsWith(':')) {
                const paramName = patternSegment.slice(1); // Remove ':' from pattern
                if (urlSegment) {
                    params[paramName] = decodeURIComponent(urlSegment);
                }
            } else if (patternSegment !== urlSegment) {
                // If static segments don't match → fail
                return {};
            }
        }

        return params;
    }



    /**
     * Extract query parameters from URL
     * @param url - The URL to extract query parameters from
     * @returns Object containing query parameters
     */
    static extractQuery<T = Record<string, string>>(url: string): T {
        const query: Record<string, string> = {};

        // Take only the part after "?"
        const queryString = url.split('?')[1];
        if (!queryString) return query as T;

        // Remove fragment (#...) if present
        const cleanQuery = queryString.split('#')[0];

        // Split into key=value pairs
        for (const pair of cleanQuery.split('&')) {
            if (!pair) continue;
            const [key, value = ''] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value);
        }

        return query as T;
    }


    /**
     * Parse cookies from Cookie header
     */
    static parseCookies(
        cookieHeader?: string
    ): Record<string, string> {
        const cookies: Record<string, string> = {};

        if (!cookieHeader) return {};

        cookieHeader.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            const value = rest.join('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });

        return cookies;
    }

    /**
     * Parse request body based on Content-Type
     * 
     * 
     * @param context - The HTTP server request context
     * @returns Parsed body data and detected body type
     */
    static parseRequestBody<T extends any = any>(
        context: A_HttpServerRequestContext
    ): {
        data: T;
        type: A_Request_BodyType;
    } {
        let parsedBody: any;
        let bodyType: A_Request_BodyType;

        switch (true) {
            case !!context.contentType && context.contentType.includes('application/json'):
                parsedBody = JSON.parse(context.data);
                bodyType = 'json';
                break;
            case !!context.contentType && context.contentType.includes('application/x-www-form-urlencoded'):
                parsedBody = A_RequestHelper.parseFormUrlEncoded(context.data) as T;
                bodyType = 'form';
                break;
            case !!context.contentType && context.contentType.includes('multipart/form-data'):
                const multipartResult = A_RequestHelper.parseMultipartData(Buffer.concat(context.buffers), context.contentType);
                // Return the entire multipart result (fields + files) as T
                parsedBody = {
                    ...multipartResult.fields,
                    _files: multipartResult.files
                } as T;
                bodyType = 'multipart';
                break;
            case !!context.contentType && context.contentType.includes('text/'):
                parsedBody = context.data as T;
                bodyType = 'text';
                break;
            default:
                parsedBody = Buffer.concat(context.buffers) as T;
                bodyType = 'raw';
                break;
        }


        return {
            data: parsedBody,
            type: bodyType
        };
    }

    /**
     * Parse URL-encoded form data (application/x-www-form-urlencoded)
     * @param body - The URL-encoded body string
     * @returns Object containing form data
     */
    static parseFormUrlEncoded(
        /**
         * The URL-encoded body string
         */
        body: string
    ): Record<string, string | string[]> {
        const result: Record<string, string | string[]> = {};

        if (!body) return result;

        const pairs = body.split('&');

        for (const pair of pairs) {
            if (!pair) continue;

            const [key, value = ''] = pair.split('=');
            const decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
            const decodedValue = decodeURIComponent(value.replace(/\+/g, ' '));

            // Handle multiple values for the same key (arrays)
            if (decodedKey in result) {
                const existing = result[decodedKey];
                if (Array.isArray(existing)) {
                    existing.push(decodedValue);
                } else {
                    result[decodedKey] = [existing, decodedValue];
                }
            } else {
                result[decodedKey] = decodedValue;
            }
        }

        return result;
    }

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
        contentType: string
    ): {
        fields: Record<string, string>;
        files: A_Request_FileUpload[];
    } {
        // Extract boundary
        const boundaryMatch = contentType.match(/boundary=(.+)/);
        if (!boundaryMatch) {
            throw new A_RequestError(
                A_RequestError.RequestBodyParsingError,
                'Missing boundary in multipart/form-data content type'
            )
        }

        const boundary = '--' + boundaryMatch[1];
        const textData = buffer.toString();
        const parts = textData.split(boundary).filter(part => part.trim() && !part.includes('--'));

        const fields: Record<string, string> = {};
        const files: A_Request_FileUpload[] = [];

        parts.forEach(part => {
            const [headers, content] = part.split('\r\n\r\n');
            if (!headers || content === undefined) return;

            const nameMatch = headers.match(/name="([^"]+)"/);
            const filenameMatch = headers.match(/filename="([^"]+)"/);
            const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);

            if (nameMatch) {
                const fieldName = nameMatch[1];
                const cleanContent = content.replace(/\r\n$/, '');

                if (filenameMatch) {
                    // It's a file upload
                    const file: A_Request_FileUpload = {
                        fieldName,
                        filename: filenameMatch[1],
                        encoding: 'binary',
                        mimetype: contentTypeMatch?.[1] || 'application/octet-stream',
                        size: Buffer.byteLength(cleanContent),
                        buffer: Buffer.from(cleanContent, 'binary')
                    };
                    files.push(file);
                } else {
                    // It's a regular field
                    fields[fieldName] = cleanContent;
                }
            }
        });

        return { fields, files };
    }

}