import { A_SERVER_TYPES__RequestMethods } from '../A-Request/A-Request.entity.types';
export declare class A_Route {
    url: string;
    method: A_SERVER_TYPES__RequestMethods;
    constructor(url: string | RegExp, method: A_SERVER_TYPES__RequestMethods);
    constructor(url: string | RegExp);
    /**
     * returns path only without query and hash
     */
    get path(): string;
    get params(): string[];
    extractParams(url: string): Record<string, string>;
    extractQuery(url: string): Record<string, string>;
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}
