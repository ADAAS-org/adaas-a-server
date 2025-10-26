import { A_Component, A_Entity, A_Scope } from "@adaas/a-concept";
import { A_HTTPChannel } from "../../channels/A-Http/A-Http.channel";
import { A_EntityList } from "../../entities/A_EntityList/A_EntityList.entity";
export declare class A_EntityRepository extends A_Component {
    list(channel: A_HTTPChannel, entity: A_EntityList, scope: A_Scope): Promise<void>;
    load(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    save(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    destroy(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
}
