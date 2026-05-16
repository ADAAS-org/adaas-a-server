import { A_Component, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_Request } from "src/lib/A-Request/A-Request.entity";
import { SignInCommand } from "../commands/SignIn.command";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_CommandFeatures } from "@adaas/a-utils/a-command";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";


export class TestController extends A_Component {



    // @A_Feature.Define({
    //     name: 'test',
    //     invoke: false,
    // })
    @A_ServerRouter.Get({
        path: '/test',
        version: 'v1',
        prefix: 'test'
    })
    async test(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Logger) logger: A_Logger
    ) {

        logger.log('red', 'TestController.test', request.query);

        response.add('test', 'test');
    }


    @A_Feature.Extend({
        name: 'test',
    })
    @A_ServerRouter.Get('/test')
    async test2(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Logger) logger: A_Logger
    ) {

        logger.log('red', 'TestController.test2', request.query);

        response.add('test', 'test');
    }




    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [SignInCommand]
    })
    signIn() {
        console.log('!!!!!!!!!!!!!!!!!!!!!!Sign-in feature extended in TestController');

    }
}