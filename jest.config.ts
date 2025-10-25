import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,

    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        "@adaas/a-server/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@adaas/a-server/decorators/(.*)": ["<rootDir>/src/decorators/$1"],
        "@adaas/a-server/types/(.*)": ["<rootDir>/src/types/$1"],
        "@adaas/a-server/helpers/(.*)": ["<rootDir>/src/helpers/$1"],
        "@adaas/a-server/defaults/(.*)": ["<rootDir>/src/defaults/$1"],

        "@adaas/a-server/context/(.*)": ["<rootDir>/src/context/$1"],
        "@adaas/a-server/components/(.*)": ["<rootDir>/src/components/$1"],
        "@adaas/a-server/containers/(.*)": ["<rootDir>/src/containers/$1"],
        "@adaas/a-server/entities/(.*)": ["<rootDir>/src/entities/$1"],
        "@adaas/a-server/channels/(.*)": ["<rootDir>/src/channels/$1"],
    }

};
export default config;