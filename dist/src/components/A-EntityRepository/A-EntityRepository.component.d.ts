import { A_Component, A_Entity, A_Scope } from "@adaas/a-concept";
import { A_HTTPChannel } from "../../channels/A-Http/A-Http.channel";
export declare class A_EntityRepository extends A_Component {
    load(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    save(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
    destroy(channel: A_HTTPChannel, entity: A_Entity, scope: A_Scope): Promise<void>;
}
