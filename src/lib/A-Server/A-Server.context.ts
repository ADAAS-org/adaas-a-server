import { A_Fragment, A_TYPES__Required } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerConstructor } from "./A-Server.types";
import { A_ServerRoute } from "@adaas/a-server/route/A-ServerRoute.entity";


export class A_Server extends A_Fragment {

    public port: number;
    public version: string;
    protected _routes: A_ServerRoute[] = [];

    constructor(
        params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
            'port',
            'name'
        ]>
    ) {
        super(params);

        this.port = params.port;
        this._name = params.name;
        this.version = params.version || 'v1';

        this._routes = params.routes || this._routes;
    }


    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_ServerRoute[] {
        return this._routes
    }

}


