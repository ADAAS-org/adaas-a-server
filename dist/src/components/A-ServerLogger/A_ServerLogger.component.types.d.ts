import { A_TYPES__ConceptENVVariables } from "@adaas/a-concept/dist/src/constants/env.constants";
import { A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES } from "./A-ServerLogger.constants";
export type A_SERVER_TYPES__ServerLoggerRouteParams = {
    method: string;
    url: string;
    status: number;
    responseTime: number;
};
export type A_SERVER_TYPES__ServerLoggerEnvVariables = Array<keyof typeof A_SERVER__A_SERVER_LOGGER_ENV_VARIABLES> | A_TYPES__ConceptENVVariables;
