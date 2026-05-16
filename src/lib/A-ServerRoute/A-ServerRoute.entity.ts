import { A_Route } from '@adaas/a-utils/a-route';
import { A_ServerRouteHttpMethodNames } from './A-ServerRoute.types';



export class A_ServerRoute extends A_Route {

    public url!: string;
    public method!: A_ServerRouteHttpMethodNames;


    constructor(
        url: string | RegExp,
        method: A_ServerRouteHttpMethodNames
    )
    constructor(
        url: string | RegExp,
    )
    constructor(
        param1: string | RegExp,
        param2?: A_ServerRouteHttpMethodNames
    ) {
        super(param1);
        this.url = param1 instanceof RegExp ? param1.source : param1;
        this.method = param2 || 'GET';
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

