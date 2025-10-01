import { A_Component, A_Config, A_Scope } from "@adaas/a-concept";
import { A_EntityFactory } from "../../context/A-EntityFactory/A-EntityFactory.context";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_ListingController extends A_Component {
    list(request: A_Request<any, any, {
        type: string;
    }>, response: A_Response, factory: A_EntityFactory, scope: A_Scope, config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>): Promise<void>;
}
