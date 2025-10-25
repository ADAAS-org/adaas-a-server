import { A_Component, A_Scope } from "@adaas/a-concept";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_EntityFactory } from "../../context/A-EntityFactory/A-EntityFactory.context";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_EntityController extends A_Component {
    load(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
    create(request: A_Request<any, any, {
        aseid: string;
    }>, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    update(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    delete(request: A_Request<any, any, {
        aseid: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
    callEntity(request: A_Request<any, any, {
        aseid: string;
        action: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope): Promise<void>;
}
