import { A_Component,  A_Feature, A_Inject, A_Scope } from "@adaas/a-concept"
import { A_Config } from "@adaas/a-utils/a-config";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_ServerEntityList } from "@adaas/a-server/entity-list/A-EntityList.entity";
import { A_ServerListQueryFilter } from "@adaas/a-server/list-query/A-ServerListQueryFilter.context";



export class A_ListingController extends A_Component {

    // @A_Feature.Define({
    //     name: 'listEntities',
    //     invoke: false
    // })
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
}