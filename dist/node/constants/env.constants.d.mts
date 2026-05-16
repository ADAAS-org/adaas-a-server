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

export { A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES, A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, type A_TYPES__ServerENVVariables };
