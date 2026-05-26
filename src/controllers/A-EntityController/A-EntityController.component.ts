import { A_Component, A_Context, A_Feature, A_Inject, A_Scope, ASEID } from "@adaas/a-concept";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_HttpServerError } from "../../lib/A-Server/A-HttpServer.error";



export class A_EntityController extends A_Component {

    // =======================================================
    // ================ Method Definition=====================
    // =======================================================

    @A_Feature.Define({
        name: 'getEntity',
        invoke: false
    })
    @A_ServerRouter.Get({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async load(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid))
            throw new A_HttpServerError({
                status: 400,
                description: `Invalid ASEID: "${request.params.aseid}"`,
            });

        const aseid = new ASEID(request.params.aseid);

        const constructor = scope.resolveConstructor(aseid.entity);

        if (!constructor)
            throw new A_HttpServerError({
                status: 404,
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
            });

        const entity = new constructor(request.params.aseid);

        scope.register(entity);

        await entity.load();

        return response.status(200).send(entity.toJSON());
    }



    @A_ServerRouter.Post({
        path: '/',
        version: 'v1',
        prefix: 'a-entity'
    })
    async create(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        const constructor = scope.resolveConstructor(request.params.aseid);

        if (!constructor)
            throw new A_HttpServerError({
                status: 404,
                description: `Entity type "${request.params.aseid}" not registered`,
            });

        const entity = new constructor(request.body);

        scope.register(entity);

        await entity.save();
    }



    @A_ServerRouter.Put({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async update(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid))
            throw new A_HttpServerError({
                status: 400,
                description: `Invalid ASEID: "${request.params.aseid}"`,
            });

        const constructor = scope.resolveConstructor(request.params.aseid);

        if (!constructor)
            throw new A_HttpServerError({
                status: 404,
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
            });

        const entity = new constructor(request.body);

        scope.register(entity);

        await entity.save();
    }


    @A_ServerRouter.Delete({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async delete(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid))
            throw new A_HttpServerError({
                status: 400,
                description: `Invalid ASEID: "${request.params.aseid}"`,
            });

        const constructor = scope.resolveConstructor(request.params.aseid);

        if (!constructor)
            throw new A_HttpServerError({
                status: 404,
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
            });

        const entity = new constructor(request.params.aseid);

        scope.register(entity);

        await entity.destroy();
    }



    // @A_Feature.Define({
    //     name: 'callEntity',
    //     invoke: false
    // })
    @A_ServerRouter.Post({
        path: '/:aseid/:action',
        version: 'v1',
        prefix: 'a-entity'
    })
    async callEntity(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string, action: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid))
            throw new A_HttpServerError({
                status: 400,
                description: `Invalid ASEID: "${request.params.aseid}"`,
            });

        const constructor = scope.resolveConstructor(request.params.aseid);

        if (!constructor)
            throw new A_HttpServerError({
                status: 404,
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
            });

        const meta = A_Context.meta(constructor);

        const targetFeature = meta.features().find(f => f.name === `${constructor.name}.${request.params.action}`);

        if (!targetFeature)
            throw new A_HttpServerError({
                status: 404,
                description: `Feature "${request.params.action}" not found on entity`,
            });

        const entity = new constructor(request.params.aseid);

        scope.register(entity);

        await entity.load(scope);

        await entity[targetFeature.handler](scope);

        response.add('result', scope.toJSON());
        response.add('entity', entity);
        response.add('type', entity.aseid.entity);
    }
}