import { A_Component, A_Container, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_HttpServerError } from "../A-Server/A-HttpServer.error";



export class A_ServerController extends A_Component {


    @A_ServerRouter.Post({
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

        if (!scope.has(request.params.component))
            throw new A_HttpServerError({
                status: 404,
                description: `Component "${request.params.component}" not found`,
            });

        if (!request.params.operation || typeof request.params.operation !== 'string')
            throw new A_HttpServerError({
                status: 400,
                description: 'Missing or invalid "operation" parameter',
            });

        const possibleComponent = scope.resolve(request.params.component);

        if (
            !possibleComponent
            ||
            ![A_Component, A_Container]
                .some(c => possibleComponent instanceof c)
        )
            throw new A_HttpServerError({
                status: 404,
                description: `"${request.params.component}" is not a valid component`,
            });

        const component = possibleComponent as A_Component | A_Container;

        const meta = A_Context.meta(component);

        const targetFeature = meta.features().find(f => f.name === `${component.constructor.name}.${request.params.operation}`);

        if (!targetFeature)
            throw new A_HttpServerError({
                status: 404,
                description: `Operation "${request.params.operation}" not found on component "${request.params.component}"`,
            });

        await component.call(request.params.operation, scope);
    }
}