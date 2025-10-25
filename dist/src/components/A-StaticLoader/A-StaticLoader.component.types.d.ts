import { A_Component } from "@adaas/a-concept";
import { A_Request } from "../../entities/A-Request/A-Request.entity";
import { A_Response } from "../../entities/A-Response/A-Response.entity";
import { A_Logger } from "@adaas/a-utils";
export declare class A_StaticLoader extends A_Component {
    onRequest(req: A_Request, res: A_Response, logger: A_Logger): Promise<void>;
    protected getMimeType(ext: string): string;
    protected safeFilePath(staticDir: string, reqUrl: string, host?: string): string;
    protected serveFile(filePath: string, res: A_Response): Promise<void>;
}
