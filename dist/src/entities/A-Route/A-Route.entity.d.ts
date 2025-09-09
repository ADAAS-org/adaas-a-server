import { A_SERVER_TYPES__RequestMethods } from '../A-Request/A-Request.entity.types';
export declare class A_Route {
    path: string;
    method: A_SERVER_TYPES__RequestMethods;
    constructor(path: string | RegExp, method: A_SERVER_TYPES__RequestMethods);
    constructor(path: string | RegExp);
    get params(): string[];
    extractParams(url: string): Record<string, string>;
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}
