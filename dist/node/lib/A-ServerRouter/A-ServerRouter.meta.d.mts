import { A_ComponentMeta } from '@adaas/a-concept';
import { A_ServerRouterMetaStructure, A_ServerRouterRouteDefinition } from './A-ServerRouter.types.mjs';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.mjs';
import './A-ServerRouter.constants.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_ServerRouterMeta extends A_ComponentMeta<A_ServerRouterMetaStructure> {
    get routes(): Array<A_ServerRoute>;
    get definitions(): Map<string, A_ServerRouterRouteDefinition>;
    addRoute(regexp: RegExp, route: A_ServerRouterRouteDefinition): void;
    removeRoute(route: A_ServerRoute): void;
}

export { A_ServerRouterMeta };
