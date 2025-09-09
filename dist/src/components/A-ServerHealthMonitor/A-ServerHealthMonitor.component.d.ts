import { A_Component, A_Config, A_Logger } from "@adaas/a-concept";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_ServerHealthMonitor extends A_Component {
    get(config: A_Config<'VERSION_PATH' | 'EXPOSED_PROPERTIES'>, request: A_Request, response: A_Response, logger: A_Logger): Promise<any>;
}
