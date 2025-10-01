import { A_Component, A_Config, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept"
import { A_EntityFactory } from "@adaas/a-server/context/A-EntityFactory/A-EntityFactory.context";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_Router } from "../A-Router/A-Router.component";
import { A_EntityList } from "@adaas/a-server/entities/A_EntityList/A_EntityList.entity";
import { A_ListQueryFilter } from "@adaas/a-server/context/A_ListQueryFilter/A_ListQueryFilter.context";



export class A_ListingController extends A_Component {

    @A_Feature.Define({
        name: 'listEntities',
        invoke: false
    })
    @A_Router.Get({
        path: '/:type',
        version: 'v1',
        prefix: 'a-list'
    })
    async list(
        @A_Inject(A_Request) request: A_Request<any, any, { type: string }>,
        @A_Inject(A_Response) response: A_Response,
        @A_Inject(A_EntityFactory) factory: A_EntityFactory,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Config) config: A_Config<['A_LIST_ITEMS_PER_PAGE', 'A_LIST_PAGE']>
    ) {

        const constructor = factory.resolveByName(request.params.type);

        if (constructor) {

            const entityList = new A_EntityList({
                name: request.params.type,
                scope: scope.name,
                constructor
            });

            scope.register(entityList);

            const queryFilter = new A_ListQueryFilter(request.query, {
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
}