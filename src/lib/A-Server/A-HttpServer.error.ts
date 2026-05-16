import { A_Error } from '@adaas/a-concept';
import { A_HttpServerError_Init, A_HttpServerError_Serialized } from './A-HttpServer.types';


export class A_HttpServerError extends A_Error<A_HttpServerError_Init, A_HttpServerError_Serialized> {

    static readonly NotFoundErrorStatus: number = 404;
    static readonly NotFoundError = 'Resource Not Found';

    static readonly InternalServerErrorStatus: number = 500;
    static readonly InternalServerError = 'Internal Server Error';

    /**
     * HTTP status code to title mapping
     */
    private static readonly HTTP_STATUS_TITLES: Record<number, string> = {
        // 4xx Client Errors
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Payload Too Large',
        414: 'URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable',
        417: 'Expectation Failed',
        418: 'I\'m a teapot',
        421: 'Misdirected Request',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Too Early',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        451: 'Unavailable For Legal Reasons',

        // 5xx Server Errors
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    };

    status!: number;

    /**
     * Gets the appropriate title for a given HTTP status code
     */
    private static getHttpStatusTitle(status: number): string {
        return this.HTTP_STATUS_TITLES[status] || 'Unknown Error';
    }

    constructor(
        /**
         * A_Error Constructor params with required title
         */
        params: A_HttpServerError_Init
    )
    constructor(
        /**
         * Simplified params with optional title - will auto-generate from status
         */
        params: { status?: number; description?: string; code?: string; scope?: string; link?: string; originalError?: Error | unknown }
    )
    constructor(
        /**
         * HTTP Status Code of the error
         */
        status: number,
        /**
         * Error description
         */
        description: string
    )
    constructor(
        /**
         * Original JS Error
         */
        error: Error
    )
    constructor(
        param1: A_HttpServerError_Init | { status?: number; description?: string; code?: string; scope?: string; link?: string; originalError?: Error | unknown } | Error | number,
        param2?: string
    ) {
        // Handle the different constructor overloads
        switch (true) {
            // Pattern: new A_HttpServerError(404, 'The requested resource was not found')
            case typeof param1 === 'number' && typeof param2 === 'string':
                super({
                    title: A_HttpServerError.getHttpStatusTitle(param1),
                    description: param2
                });
                this.status = param1;
                break;

            // Pattern: new A_HttpServerError(someErrorObject)
            case param1 instanceof Error:
                super(param1);
                this.status = 500; // Default status for Error objects
                break;

            // Pattern: new A_HttpServerError({ status: 500, description: '...', originalError: ... })
            case typeof param1 === 'object' && param1 !== null && !(param1 instanceof Error):
                const params = param1 as any;
                
                // If title is provided, use the full A_Error init
                if ('title' in params && params.title) {
                    super(params as A_HttpServerError_Init);
                    this.status = params.status || 500;
                } else {
                    // Auto-generate title from status
                    const title = params.status ? A_HttpServerError.getHttpStatusTitle(params.status) : 'Internal Server Error';
                    super({
                        title: title,
                        description: params.description,
                        code: params.code,
                        scope: params.scope,
                        link: params.link,
                        originalError: params.originalError
                    });
                    this.status = params.status || 500;
                }
                break;

            default:
                // Fallback for any other case
                throw new Error('Invalid parameters provided to A_HttpServerError constructor');
        }
    }


    protected fromConstructor(params: A_HttpServerError_Init): void {
        super.fromConstructor(params);
        if (params.status) {
            this.status = params.status;
        }
    }


    toJSON(): A_HttpServerError_Serialized {
        return {
            ...super.toJSON(),
            status: this.status
        }
    }
}

