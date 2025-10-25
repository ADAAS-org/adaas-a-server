import { A_Component, A_Context, A_Feature, A_Inject, A_Scope, A_TYPES__Entity_Constructor, ASEID } from "@adaas/a-concept";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Router } from "../A-Router/A-Router.component";
import { A_EntityFactory } from "@adaas/a-server/context/A-EntityFactory/A-EntityFactory.context";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_ServerError } from "../A-ServerError/A-ServerError.class";
import { A_Manifest } from "@adaas/a-utils";



export class A_EntityController extends A_Component {

    // =======================================================
    // ================ Method Definition=====================
    // =======================================================
    @A_Feature.Define({
        name: 'getEntity',
        invoke: false
    })
    @A_Router.Get({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async load(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        // Check if the scope has a manifest and if the entity is allowed to save
        // if (
        //     scope.has(A_Manifest) && !scope.resolve(A_Manifest)
        //         .isAllowed(entity.constructor, 'save')
        //         .for(entity.constructor as A_TYPES__Entity_Constructor)
        // )
        //     return;


        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.load', 'Invalid ASEID');
            return;
        }


        const aseid = new ASEID(request.params.aseid);

        const constructor = scope.resolveConstructor(aseid.entity);


        if (constructor) {
            const entity = new constructor(request.params.aseid);

            scope.register(entity);

            await entity.load();

            return response.status(200).json(entity.toJSON());
        }
        else
            throw new A_ServerError({
                title: 'Entity Not Found',
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
                status: 404,
            });
    }



    @A_Router.Post({
        path: '/',
        version: 'v1',
        prefix: 'a-entity'
    })
    async create(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_EntityFactory) factory: A_EntityFactory,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        const constructor = factory.resolve(request.params.aseid);

        if (constructor) {
            const entity = new constructor(request.body);

            scope.register(entity);

            await entity.save();
        }
    }



    @A_Router.Put({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async update(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_EntityFactory) factory: A_EntityFactory,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.update', 'Invalid ASEID');
            return;
        }

        const constructor = factory.resolve(request.params.aseid);


        if (constructor) {
            const entity = new constructor(request.body);

            scope.register(entity);

            await entity.save();
        }
    }


    @A_Router.Delete({
        path: '/:aseid',
        version: 'v1',
        prefix: 'a-entity'
    })
    async delete(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_EntityFactory) factory: A_EntityFactory,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.delete', 'Invalid ASEID');
            return;
        }

        const constructor = factory.resolve(request.params.aseid);

        if (constructor) {
            const entity = new constructor(request.params.aseid);

            scope.register(entity);

            await entity.destroy();
        }
    }



    // @A_Feature.Define({
    //     name: 'callEntity',
    //     invoke: false
    // })
    @A_Router.Post({
        path: '/:aseid/:action',
        version: 'v1',
        prefix: 'a-entity'
    })
    async callEntity(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string, action: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_EntityFactory) factory: A_EntityFactory,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.callEntity', 'Invalid ASEID');
            return;
        }

        const constructor = factory.resolve(request.params.aseid);

        if (!constructor) {
            response.add('A_EntityController.callEntity', 'Entity not found');
            return;
        }

        const meta = A_Context.meta(constructor);

        const targetFeature = meta.features().find(f => f.name === `${constructor.name}.${request.params.action}`);

        if (!targetFeature) {
            response.add('A_EntityController.callEntity', 'Feature not found');
            return;
        }

        const entity = new constructor(request.params.aseid);

        scope.register(entity);

        await entity.load(scope);

        await entity[targetFeature.handler](scope);

        response.add('result', scope.toJSON());
        response.add('entity', entity);
        response.add('type', entity.aseid.entity);
    }
}