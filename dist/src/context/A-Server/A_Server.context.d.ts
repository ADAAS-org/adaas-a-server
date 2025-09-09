import { A_Fragment } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerConstructor } from "./A_Server.context.types";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Route } from "../../entities/A-Route/A-Route.entity";
export declare class A_Server extends A_Fragment {
    port: number;
    version: string;
    protected _routes: A_Route[];
    constructor(params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
        'port',
        'name'
    ]>);
    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_Route[];
}
