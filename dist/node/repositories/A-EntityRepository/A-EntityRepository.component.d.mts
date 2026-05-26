import { A_Scope, A_Entity } from '@adaas/a-concept';
import { A_HTTPChannel } from '../../channels/A-Http/A-Http.channel.mjs';
import { A_ServerEntityList } from '../../lib/A-ServerEntityList/A-EntityList.entity.mjs';
import { A_Command } from '@adaas/a-utils/a-command';
import '../../channels/A-Http/A-Http.channel.types.mjs';
import '../../lib/A-Server/A-HttpServer.types.mjs';
import '../../lib/A-Server/A-HttpServer.constants.mjs';
import '../../channels/A-Http/A-Http.channel.constants.mjs';
import '@adaas/a-utils/a-channel';
import '../../lib/A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.mjs';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.mjs';
import '../../lib/A-ServerEntityList/A-EntityList.types.mjs';
import '../../lib/A-ServerEntityList/A-EntityListPagination.context.mjs';

declare class A_EntityRepository extends A_HTTPChannel {
    execute(command: A_Command, scope: A_Scope): Promise<void>;
    list(entity: A_ServerEntityList, scope: A_Scope): Promise<void>;
    load(entity: A_Entity, scope: A_Scope): Promise<void>;
    save(entity: A_Entity, scope: A_Scope): Promise<void>;
    destroy(entity: A_Entity, scope: A_Scope): Promise<void>;
}

export { A_EntityRepository };
