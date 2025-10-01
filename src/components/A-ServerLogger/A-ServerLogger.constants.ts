export const A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES = {
    // ----------------------------------------------------------
    // A-ServerLogger Environment Variables
    // ----------------------------------------------------------
    // These environment variables are used by A-Concept core to configure the application
    // ----------------------------------------------------------
    /**
     * Enable logging of 200 responses
     */
    SERVER_IGNORE_LOG_200: 'SERVER_IGNORE_LOG_200',
    /**
     * Enable logging of 404 responses
     */
    SERVER_IGNORE_LOG_404: 'SERVER_IGNORE_LOG_404',
    /**
     * Enable logging of 500 responses
     */
    SERVER_IGNORE_LOG_500: 'SERVER_IGNORE_LOG_500',
    /**
     * Enable logging of 400 responses
     */
    SERVER_IGNORE_LOG_400: 'SERVER_IGNORE_LOG_400',
    /**
     * Enable logging of default responses
     */
    SERVER_IGNORE_LOG_DEFAULT: 'SERVER_IGNORE_LOG_DEFAULT',
} as const