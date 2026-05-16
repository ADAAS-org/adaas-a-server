import { A_Caller, A_Entity, A_Feature, A_Inject, A_Scope, A_TYPES__Entity_Constructor, A_TYPES__EntityFeatures } from "@adaas/a-concept";
import { A_HTTPChannel } from "@adaas/a-server/channels/A-Http/A-Http.channel";
import { A_ServerEntityList } from "@adaas/a-server/entity-list/A-EntityList.entity";
import { A_Command, A_CommandFeatures, A_TYPES__Command_Serialized } from "@adaas/a-utils/a-command";
import { A_Manifest } from "@adaas/a-utils/a-manifest";




export class A_EntityRepository extends A_HTTPChannel {


    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
    })
    async execute(
        @A_Inject(A_Caller) command: A_Command,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to load
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)!
                .isAllowed(command.constructor, 'load')
                .for(command.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await this.post<A_TYPES__Command_Serialized>(`/a-command/v1/${command.aseid.entity}`, command.toJSON());

        command.fromJSON(response.data!);
    }

    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: [A_ServerEntityList]
    })
    async list(
        @A_Inject(A_Caller) entity: A_ServerEntityList,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to load
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)!
                .isAllowed(entity.constructor, 'load')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await this.get(`/a-list/v1/${entity.aseid.entity}`);

        entity.fromJSON(response.data);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: [A_ServerEntityList]
    })
    async load(
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to load
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)!
                .isAllowed(entity.constructor, 'load')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await this.get(`/a-entity/v1/${entity.aseid.toString()}`);

        entity.fromJSON(response.data);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.SAVE,
        scope: [A_ServerEntityList]
    })
    async save(
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to save
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)!
                .isAllowed(entity.constructor, 'save')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await this.post(`/a-entity/v1/${entity.aseid.toString()}`, entity.toJSON());

        entity.fromJSON(response.data);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.DESTROY,
        scope: [A_ServerEntityList]
    })
    async destroy(
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to destroy
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)!
                .isAllowed(entity.constructor, 'destroy')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await this.delete(`/a-entity/v1/${entity.aseid.toString()}`);

        entity.fromJSON(response.data);
    }


}