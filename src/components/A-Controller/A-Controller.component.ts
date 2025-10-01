import { A_Component, A_Container, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_Router } from "../A-Router/A-Router.component";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";



export class A_Controller extends A_Component {


    @A_Feature.Define({
        name: 'callEntityMethod',
        invoke: false,
    })
    @A_Router.Post({
        path: '/:component/:operation',
        version: 'v1',
        prefix: 'a-component'
    })
    async callEntityMethod(
        @A_Inject(A_Request) request: A_Request<any, any, {
            component: string,
            operation: string
        }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {

        //  check step by step each parameter to ensure they are valid

        if (!scope.has(request.params.component))
            return

        if (!request.params.operation || typeof request.params.operation !== 'string')
            return;


        const possibleComponent = scope.resolve(request.params.component);

        if (
            !possibleComponent
            ||
            ![A_Component, A_Container]
                .some(c => possibleComponent instanceof c)
        )
            return;

        const component = possibleComponent as A_Component | A_Container;

        const meta = A_Context.meta(component);

        const targetFeature = meta.features().find(f => f.name === `${component.constructor.name}.${request.params.operation}`);

        if (!targetFeature)
            return;


        await component.call(request.params.operation, scope);
    }
}