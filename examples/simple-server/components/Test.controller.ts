import { A_Component, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_Router } from "@adaas/a-server/components/A-Router/A-Router.component";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_CONSTANTS_A_Command_Features, A_Logger } from "@adaas/a-utils";
import { SignInCommand } from "../commands/SignIn.command";


export class TestController extends A_Component {



    // @A_Feature.Define({
    //     name: 'test',
    //     invoke: false,
    // })
    @A_Router.Get({
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
    @A_Router.Get('/test')
    async test2(
        @A_Inject(A_Request) request: A_Request,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Logger) logger: A_Logger
    ) {

        logger.log('red', 'TestController.test2', request.query);

        response.add('test', 'test');
    }




    @A_Feature.Extend({
        name: A_CONSTANTS_A_Command_Features.EXECUTE,
        scope: [SignInCommand]
    })
    signIn() {
        console.log('!!!!!!!!!!!!!!!!!!!!!!Sign-in feature extended in TestController');

    }
}