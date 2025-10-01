import { A_TYPES__ConceptENVVariables } from "@adaas/a-concept/dist/src/constants/env.constants";
export type A_SERVER_TYPES__ServerLoggerRouteParams = {
    method: string;
    url: string;
    status: number;
    responseTime: number;
};
export type A_SERVER_TYPES__ServerLoggerEnvVariables = Array<'SERVER_IGNORE_LOG_200' | 'SERVER_IGNORE_LOG_404' | 'SERVER_IGNORE_LOG_500' | 'SERVER_IGNORE_LOG_400' | 'SERVER_IGNORE_LOG_DEFAULT'> | A_TYPES__ConceptENVVariables;
