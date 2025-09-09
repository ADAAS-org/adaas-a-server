import { A_Component, A_Scope } from "@adaas/a-concept";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
export declare class A_Controller extends A_Component {
    callEntityMethod(request: A_Request<any, any, {
        component: string;
        operation: string;
    }>, response: A_Response, scope: A_Scope): Promise<void>;
}
