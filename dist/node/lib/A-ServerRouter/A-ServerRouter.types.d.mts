import { A_Component, A_TYPES__ComponentMeta } from '@adaas/a-concept';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.mjs';
import { A_ServerRouterMetaKeys } from './A-ServerRouter.constants.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

type A_ServerRouterRouteDefinition = {
    component: A_Component;
    handler: string;
    route: A_ServerRoute;
};
type A_ServerRouterMetaStructure = {
    [A_ServerRouterMetaKeys.ROUTES]: Map<string, A_ServerRouterRouteDefinition>;
    [A_ServerRouterMetaKeys.ROUTES_CONFIGS]: Array<A_ServerRoute>;
} & A_TYPES__ComponentMeta;
type A_ServerRouterMetaKeyNames = typeof A_ServerRouterMetaKeys[keyof typeof A_ServerRouterMetaKeys];
type A_ServerRouterRouteConfig = {
    path: string | RegExp;
    version: string;
    prefix: string;
};

export type { A_ServerRouterMetaKeyNames, A_ServerRouterMetaStructure, A_ServerRouterRouteConfig, A_ServerRouterRouteDefinition };
