import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    testTimeout: 30_000,

    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },

    // Resolve baseUrl-style absolute imports (e.g. "src/lib/A-Server/...")
    modulePaths: ['<rootDir>'],

    moduleNameMapper: {
        // Wildcard subpath aliases (match tsconfig paths)
        "^@adaas/a-server/channels/(.*)$": ["<rootDir>/src/channels/$1"],
        "^@adaas/a-server/constants/(.*)$": ["<rootDir>/src/constants/$1"],
        "^@adaas/a-server/controllers/(.*)$": ["<rootDir>/src/controllers/$1"],
        "^@adaas/a-server/helpers/(.*)$": ["<rootDir>/src/helpers/$1"],
        "^@adaas/a-server/middlewares/(.*)$": ["<rootDir>/src/middlewares/$1"],
        "^@adaas/a-server/repositories/(.*)$": ["<rootDir>/src/repositories/$1"],

        // Direct lib subpath wildcard aliases (match tsconfig paths)
        "^@adaas/a-server/request/(.*)$": ["<rootDir>/src/lib/A-Request/$1"],
        "^@adaas/a-server/response/(.*)$": ["<rootDir>/src/lib/A-Response/$1"],
        "^@adaas/a-server/server/(.*)$": ["<rootDir>/src/lib/A-Server/$1"],
        "^@adaas/a-server/controller/(.*)$": ["<rootDir>/src/lib/A-ServerController/$1"],
        "^@adaas/a-server/entity-list/(.*)$": ["<rootDir>/src/lib/A-ServerEntityList/$1"],
        "^@adaas/a-server/list-query/(.*)$": ["<rootDir>/src/lib/A-ServerListQuery/$1"],
        "^@adaas/a-server/logger/(.*)$": ["<rootDir>/src/lib/A-ServerLogger/$1"],
        "^@adaas/a-server/middleware/(.*)$": ["<rootDir>/src/lib/A-ServerMiddleware/$1"],
        "^@adaas/a-server/proxy/(.*)$": ["<rootDir>/src/lib/A-ServerProxy/$1"],
        "^@adaas/a-server/route/(.*)$": ["<rootDir>/src/lib/A-ServerRoute/$1"],
        "^@adaas/a-server/router/(.*)$": ["<rootDir>/src/lib/A-ServerRouter/$1"],
        "^@adaas/a-server/static/(.*)$": ["<rootDir>/src/lib/A-ServerStatic/$1"],
    }

};
export default config;