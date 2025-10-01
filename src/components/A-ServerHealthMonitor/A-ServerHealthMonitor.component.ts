import { A_Component, A_Config, A_Inject, A_Logger } from "@adaas/a-concept";
import { A_Router } from "../A-Router/A-Router.component";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";



export class A_ServerHealthMonitor extends A_Component {



    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    @A_Router.Get({
        path: '/health',
        version: 'v1',
    })
    async get(
        @A_Inject(A_Config) config: A_Config<['VERSION_PATH', 'EXPOSED_PROPERTIES']>,
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Logger) logger: A_Logger
    ): Promise<any> {
        const packageJSON = await import(`${config.get('A_CONCEPT_ROOT_FOLDER')}/package.json`);
        const exposedProperties: Array<string> = config.get('EXPOSED_PROPERTIES')?.split(',') || [
            'name',
            'version',
            'description',
        ];

        exposedProperties.forEach(prop => response.add(prop, packageJSON[prop]));
    }
}