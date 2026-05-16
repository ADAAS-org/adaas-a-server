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

export { A_RequestEnvVariables, A_RequestEnvVariablesArray, type A_RequestEnvVariablesType };
