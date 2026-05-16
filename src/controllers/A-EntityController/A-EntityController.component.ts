import { A_Component, A_Context, A_Feature, A_Inject, A_Scope, A_TYPES__Entity_Constructor, ASEID } from "@adaas/a-concept";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ServerError } from "../../lib/A-Server/A-Server.error";
import { A_ServerListQueryFilter } from "@adaas/a-server/list-query/A-ServerListQueryFilter.context";
import { A_ServerEntityList } from "@adaas/a-server/entity-list/A-EntityList.entity";
import { A_Config } from "@adaas/a-utils/a-config";



export class A_EntityController extends A_Component {

    // =======================================================
    // ================ Method Definition=====================
    // =======================================================
    @A_ServerRouter.Get({
        path: '/:type',
        version: 'v1',
        prefix: 'a-list'
    })
    async list(
        @A_Inject(A_Request) request: A_Request<any, any, { type: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Config) config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>
    ) {

        const constructor = scope.resolveConstructor(request.params.type);

        if (constructor) {

            const entityList = new A_ServerEntityList({
                name: request.params.type,
                scope: scope.name,
                constructor
            });

            scope.register(entityList);

            const queryFilter = new A_ServerListQueryFilter(request.query, {
                itemsPerPage: String(config.get('A_LIST_ITEMS_PER_PAGE') || '10'),
                page: String(config.get('A_LIST_PAGE') || '1')
            });

            const queryScope = new A_Scope({
                fragments: [queryFilter]
            }).inherit(scope);

            await entityList.load(queryScope);

            response.add('items', entityList.items);
            response.add('pagination', entityList.pagination);
        }
    }


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
        // Check if the scope has a manifest and if the entity is allowed to save
        // if (
        //     scope.has(A_Manifest) && !scope.resolve(A_Manifest)
        //         .isAllowed(entity.constructor, 'save')
        //         .for(entity.constructor as A_TYPES__Entity_Constructor)
        // )
        //     return;


        console.log('Request params:', request.params);


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

            return response.status(200).send(entity.toJSON());
        }
        else
            throw new A_ServerError({
                title: 'Entity Not Found',
                description: `Entity constructor for ASEID ${request.params.aseid} not found`,
                status: 404,
            });
    }



    @A_ServerRouter.Post({
        path: '/',
        version: 'v1',
        prefix: 'a-entity'
    })
    async create(
        @A_Inject(A_Request) request: A_Request<any, any, { aseid: string }>,
        @A_Inject(A_Scope) scope: A_Scope
    ) {
        const constructor = scope.resolveConstructor(request.params.aseid);

        if (constructor) {
            const entity = new constructor(request.body);

            scope.register(entity);

            await entity.save();
        }
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
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.update', 'Invalid ASEID');
            return;
        }

        const constructor = scope.resolveConstructor(request.params.aseid);

        if (constructor) {
            const entity = new constructor(request.body);

            scope.register(entity);

            await entity.save();
        }
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
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.delete', 'Invalid ASEID');
            return;
        }

        const constructor = scope.resolveConstructor(request.params.aseid);

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
        if (!ASEID.isASEID(request.params.aseid)) {
            response.add('A_EntityController.callEntity', 'Invalid ASEID');
            return;
        }

        const constructor = scope.resolveConstructor(request.params.aseid);

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