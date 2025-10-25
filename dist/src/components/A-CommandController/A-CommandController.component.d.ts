import { A_Component, A_Container, A_Scope } from "@adaas/a-concept";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_CommandController extends A_Component {
    handleCommand(req: A_Request<any, any, {
        command: string;
    }>, res: A_Response, scope: A_Scope, container: A_Container): Promise<void>;
}
