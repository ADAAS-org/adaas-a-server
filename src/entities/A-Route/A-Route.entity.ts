import crypto from 'crypto';
import { A_Context, A_Entity } from "@adaas/a-concept";
import { ASEID } from "@adaas/a-utils";
import { A_SERVER_TYPES__RequestMethods } from '../A-Request/A-Request.entity.types';



export class A_Route {

    public path!: string;
    public method!: A_SERVER_TYPES__RequestMethods;


    constructor(
        path: string | RegExp,
        method: A_SERVER_TYPES__RequestMethods
    )
    constructor(
        path: string | RegExp,
    )
    constructor(
        param1: string | RegExp,
        param2?: A_SERVER_TYPES__RequestMethods
    ) {

        this.path = param1 instanceof RegExp ? param1.source : param1;
        this.method = param2 || 'GET';

    }


    get params(): string[] {
        return this.path
            .match(/:([^\/]+)/g)
            ?.map((param) => param.slice(1))
            || [];
    }


   extractParams(url: string): Record<string, string> {
    // Remove query string (anything after ?)
    const cleanUrl = url.split('?')[0];

    const urlSegments = cleanUrl.split('/').filter(Boolean);
    const maskSegments = this.path.split('/').filter(Boolean);

    const params: Record<string, string> = {};

    for (let i = 0; i < maskSegments.length; i++) {
        const maskSegment = maskSegments[i];
        const urlSegment = urlSegments[i];

        if (maskSegment.startsWith(':')) {
            const paramName = maskSegment.slice(1); // Remove ':' from mask
            params[paramName] = urlSegment;
        } else if (maskSegment !== urlSegment) {
            // If static segments don’t match → fail
            return {};
        }
    }

    return params;
}



    toString(): string {
        // path can be like /api/v1/users/:id
        // and because of that :id we need to replace it with regex that matches chars and numbers only   
        return `${this.method}::${this.path}`;

        // .replace(/\/:([^\/]+)/g, '\\/([^\/]+)')
    }

    toRegExp(): RegExp {
        return new RegExp(`^${this.method}::${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }

    toAFeatureExtension(extensionScope: Array<string> = []): RegExp {
        return new RegExp(`^${extensionScope.length
                ? `(${extensionScope.join('|')})`
                : '.*'
            }\\.${this.method}::${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }
}

