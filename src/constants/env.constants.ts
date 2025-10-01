export const A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES = {
    // ----------------------------------------------------------
    // A-Server Environment Variables
    // ----------------------------------------------------------
    // These environment variables are used by A-Server to configure the application
    // ----------------------------------------------------------
    /**
     * Port for the server to listen on
     * [!] Default is 3000
     * @default 3000
     */
    A_SERVER_PORT: 'A_SERVER_PORT',

} as const;

export type A_TYPES__ServerENVVariables = (typeof A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES][];



export const A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = [
    A_SERVER_CONSTANTS__DEFAULT_ENV_VARIABLES.A_SERVER_PORT,
] as const;




