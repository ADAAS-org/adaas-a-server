import { A_Scope, A_Entity } from '@adaas/a-concept';
import { A_HTTPChannel } from '../../channels/A-Http/A-Http.channel.js';
import { A_ServerEntityList } from '../../lib/A-ServerEntityList/A-EntityList.entity.js';
import { A_Command } from '@adaas/a-utils/a-command';
import '../../channels/A-Http/A-Http.channel.types.js';
import '../../lib/A-Server/A-HttpServer.types.js';
import '../../lib/A-Server/A-HttpServer.constants.js';
import '../../channels/A-Http/A-Http.channel.constants.js';
import '@adaas/a-utils/a-channel';
import '../../lib/A-ServerRoute/A-ServerRoute.entity.js';
import '@adaas/a-utils/a-route';
import '../../lib/A-ServerRoute/A-ServerRoute.types.js';
import '../../lib/A-ServerRoute/A-ServerRoute.constants.js';
import '../../lib/A-ServerEntityList/A-EntityList.types.js';
import '../../lib/A-ServerEntityList/A-EntityListPagination.context.js';

declare class A_EntityRepository extends A_HTTPChannel {
    execute(command: A_Command, scope: A_Scope): Promise<void>;
    list(entity: A_ServerEntityList, scope: A_Scope): Promise<void>;
    load(entity: A_Entity, scope: A_Scope): Promise<void>;
    save(entity: A_Entity, scope: A_Scope): Promise<void>;
    destroy(entity: A_Entity, scope: A_Scope): Promise<void>;
}

export { A_EntityRepository };
