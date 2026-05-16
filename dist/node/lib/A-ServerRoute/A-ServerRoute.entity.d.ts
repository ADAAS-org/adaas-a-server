import { A_Route } from '@adaas/a-utils/a-route';
import { A_ServerRouteHttpMethodNames } from './A-ServerRoute.types.js';
import './A-ServerRoute.constants.js';

declare class A_ServerRoute extends A_Route {
    url: string;
    method: A_ServerRouteHttpMethodNames;
    constructor(url: string | RegExp, method: A_ServerRouteHttpMethodNames);
    constructor(url: string | RegExp);
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}

export { A_ServerRoute };
