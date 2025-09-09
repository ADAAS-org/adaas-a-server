import { A_Entity, A_Fragment } from "@adaas/a-concept";
import { createServer, Server } from "http";
import { A_SERVER_TYPES__ServerConstructor } from "./A_Server.context.types";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";


export class A_Server extends A_Fragment {

    public port: number;
    public version: string;
    protected _routes: A_Route[] = [];

    constructor(
        params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
            'port',
            'name'
        ]>
    ) {
        super(params);

        this.port = params.port;
        this.name = params.name;
        this.version = params.version || 'v1';

        this._routes = params.routes || this._routes;
    }


    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_Route[] {
        return this._routes
    }

}


