import { A_Caller, A_Component, A_Entity, A_Feature, A_Inject, A_Scope, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_TYPES__EntityFeatures } from "@adaas/a-concept/dist/src/global/A-Entity/A-Entity.constants";
import { A_HTTPChannel } from "@adaas/a-server/channels/A-Http/A-Http.channel";
import { A_EntityList } from "@adaas/a-server/entities/A_EntityList/A_EntityList.entity";
import { A_Channel, A_Manifest } from "@adaas/a-utils";




export class A_EntityRepository extends A_Component {


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: {
            exclude: [A_EntityList]
        }
    })
    async load(
        @A_Inject(A_HTTPChannel) channel: A_HTTPChannel,
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to load
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)
                .isAllowed(entity.constructor, 'load')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await channel.get(`/a-entity/${entity.aseid.toString()}`);

        entity.fromJSON(response.data);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.SAVE,
        scope: {
            exclude: [A_EntityList]
        }
    })
    async save(
        @A_Inject(A_HTTPChannel) channel: A_HTTPChannel,
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to save
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)
                .isAllowed(entity.constructor, 'save')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await channel.post(`/a-entity/${entity.aseid.toString()}`, entity.toJSON());

        entity.fromJSON(response.data);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.DESTROY,
        scope: {
            exclude: [A_EntityList]
        }
    })
    async destroy(
        @A_Inject(A_HTTPChannel) channel: A_HTTPChannel,
        @A_Inject(A_Caller) entity: A_Entity,
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        // Check if the scope has a manifest and if the entity is allowed to destroy
        if (
            scope.has(A_Manifest) && !scope.resolve(A_Manifest)
                .isAllowed(entity.constructor, 'destroy')
                .for(entity.constructor as A_TYPES__Entity_Constructor)
        )
            return;

        const response = await channel.delete(`/a-entity/${entity.aseid.toString()}`);

        entity.fromJSON(response.data);
    }


}