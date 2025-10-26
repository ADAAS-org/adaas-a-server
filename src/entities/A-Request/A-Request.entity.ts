import type { IncomingHttpHeaders, IncomingMessage } from "http";
import { A_Context, A_Entity, A_IdentityHelper, ASEID, } from '@adaas/a-concept';
import {
    A_SERVER_TYPES__RequestConstructor,
    A_SERVER_TYPES__RequestEvent,
    A_SERVER_TYPES__RequestMethods,
    A_SERVER_TYPES__RequestSerialized
} from "./A-Request.entity.types";
import { A_Route } from '../A-Route/A-Route.entity';
import { A_ServerError } from "@adaas/a-server/components/A-ServerError/A-ServerError.class";


export class A_Request<
    _ReqBodyType = any,
    _ResponseType = any,
    _ParamsType extends Record<string, string> = any,
    _QueryType = any,
>
    extends A_Entity<
        A_SERVER_TYPES__RequestConstructor,
        A_SERVER_TYPES__RequestSerialized
    > {

    static get namespace(): string {
        return 'a-server';
    }

    req!: IncomingMessage;

    body: _ReqBodyType = {} as _ReqBodyType;
    params: _ParamsType = {} as _ParamsType;
    query: _QueryType = {} as _QueryType;
    response?: _ResponseType;

    error?: A_ServerError;

    /**
     * Duration of the request in milliseconds
     */
    duration: number = 0;

    fromNew(newEntity: A_SERVER_TYPES__RequestConstructor): void {
        this.req = newEntity.request;

        this.aseid = new ASEID({
            concept: A_Context.root.name,
            scope: newEntity.scope,
            entity: (this.constructor as typeof A_Request).entity,
            id: newEntity.id
        });
    }

    get startedAt(): Date | undefined {
        const timeId = A_IdentityHelper.parseTimeId(this.aseid.id.split('-')[0]);

        return timeId ? new Date(timeId.timestamp) : undefined;
    }



    // Getter for request URL
    public get url(): string {
        return this.req.url!;
    }

    // Getter for request method
    public get method(): A_SERVER_TYPES__RequestMethods {
        return (String(this.req.method).toUpperCase() as A_SERVER_TYPES__RequestMethods) || 'DEFAULT';
    }

    get headers(): IncomingHttpHeaders {
        return this.req.headers;
    }


    get route(): A_Route {
        return new A_Route(this.url, this.method);
    }


    pipe(
        destination: NodeJS.WritableStream,
        options?: { end?: boolean | undefined; }
    ): NodeJS.WritableStream {
        return this.req.pipe(destination, options);
    }



    async init(): Promise<void> {
        this.req.on('error', async (err) => {
            this.error = new A_ServerError(err);
            await this.call(A_SERVER_TYPES__RequestEvent.Error);
        });

        this.params = this.extractParams(this.url) as _ParamsType;
        this.query = this.extractQuery(this.url) as _QueryType;
    }


    extractParams(url: string): Record<string, string> {
        // Remove query string (anything after ?)
        const cleanUrl = url.split('?')[0];

        const urlSegments = cleanUrl.split('/').filter(Boolean);
        const maskSegments = this.url.split('/').filter(Boolean);

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



    parseBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.req.on('data', chunk => body += chunk);
            this.req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    reject(err);
                }
            });
            this.req.on('error', reject);
        });
    }

} 