import { A_Component, A_Logger } from "@adaas/a-concept";
import { A_ProxyConfig } from "../../context/A_ProxyConfig/A_ProxyConfig.context";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
export declare class A_ServerProxy extends A_Component {
    load(logger: A_Logger, config: A_ProxyConfig): Promise<void>;
    onRequest(req: A_Request, res: A_Response, proxyConfig: A_ProxyConfig, logger: A_Logger): Promise<void>;
}
