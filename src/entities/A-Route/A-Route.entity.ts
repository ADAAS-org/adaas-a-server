import { A_SERVER_TYPES__RequestMethods } from '../A-Request/A-Request.entity.types';



export class A_Route {

    public url!: string;
    public method!: A_SERVER_TYPES__RequestMethods;


    constructor(
        url: string | RegExp,
        method: A_SERVER_TYPES__RequestMethods
    )
    constructor(
        url: string | RegExp,
    )
    constructor(
        param1: string | RegExp,
        param2?: A_SERVER_TYPES__RequestMethods
    ) {

        this.url = param1 instanceof RegExp ? param1.source : param1;
        this.method = param2 || 'GET';

    }


    /**
     * returns path only without query and hash
     */
    get path(): string {
        const p =  this.url.split('?')[0].split('#')[0];

        //  ensure that last char is not /
        return p.endsWith('/') ? p.slice(0, -1) : p;
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

    extractQuery(url: string): Record<string, string> {
        const query: Record<string, string> = {};

        // Take only the part after "?"
        const queryString = url.split('?')[1];
        if (!queryString) return query;

        // Remove fragment (#...) if present
        const cleanQuery = queryString.split('#')[0];

        // Split into key=value pairs
        for (const pair of cleanQuery.split('&')) {
            if (!pair) continue;
            const [key, value = ''] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value);
        }

        return query;
    }



    toString(): string {
        // path can be like /api/v1/users/:id
        // and because of that :id we need to replace it with regex that matches chars and numbers only   
        return `${this.method}::${this.path }`;

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

