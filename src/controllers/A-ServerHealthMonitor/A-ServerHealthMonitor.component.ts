import { A_Component, A_Inject } from "@adaas/a-concept";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_Config } from "@adaas/a-utils/a-config";
import { A_ServerLogger } from "@adaas/a-server/logger/A-ServerLogger.component";



export class A_ServerHealthMonitor extends A_Component {


    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    @A_ServerRouter.Get({
        path: '/',
        prefix: 'health',
        version: 'v1',
    })
    async get(
        @A_Inject(A_Config) config: A_Config<['VERSION_PATH', 'EXPOSED_PROPERTIES']>,
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_ServerLogger) logger: A_ServerLogger
    ): Promise<any> {
        const packageJSON = await import(`${config.get('A_CONCEPT_ROOT_FOLDER')}/package.json`,
            { with: { type: 'json' } });


        const exposedProperties: Array<string> = config.get('EXPOSED_PROPERTIES')?.split(',') || [
            'name',
            'version',
            'description',
        ];

        exposedProperties.forEach(prop => response.add(prop, packageJSON.default[prop]));
    }
}