

export const A_RequestEnvVariables = {

    /**
     * Default request timeout in milliseconds
     */
    A_SERVER_REQUEST_TIMEOUT: 5000,

    /**
     * Maximum request body size in bytes
     */
    A_SERVER_REQUEST_MAX_BODY_SIZE: 10 * 1024 * 1024, // 10MB

    /**
     * Default request encoding
     */
    A_SERVER_REQUEST_DEFAULT_ENCODING: 'utf8',

    /**
     * Enable automatic cookie parsing
     */
    A_SERVER_REQUEST_PARSE_COOKIES: true,

    /**
     * Enable automatic query parameter parsing
     */
    A_SERVER_REQUEST_PARSE_QUERY: true,

    /**
     * Enable automatic body parsing
     */
    A_SERVER_REQUEST_PARSE_BODY: true,

    /**
     * Enable file upload handling
     */
    A_SERVER_REQUEST_ENABLE_FILE_UPLOADS: false,

} as const;


export const A_RequestEnvVariablesArray = Object.keys(A_RequestEnvVariables) as Array<keyof typeof A_RequestEnvVariables>;



/**
 * Array of all possible fields in A_RequestEnvVariables
 */
export type A_RequestEnvVariablesType = Array<keyof typeof A_RequestEnvVariables>;