import { A_Component, A_Entity, A_Feature, A_Inject, A_Scope, A_TYPES__EntityBaseMethod } from "@adaas/a-concept";
import { A_ServerContainer } from "@adaas/a-server/containers/A-Service/A-Service.container";
import { A_SERVER_TYPES__ServerFeature } from "@adaas/a-server/containers/A-Service/A-Service.container.types";
import { MemoryStore } from "examples/microservices-server/context/MemoryStore.context";



export class SimpleMemoryRepository extends A_Component {

    // --------------------------------------------------------------
    // -------------- Server Base Methods Extensions ----------------
    // --------------------------------------------------------------

    @A_Feature.Extend({
        name: A_SERVER_TYPES__ServerFeature.beforeStart,
        scope: [A_ServerContainer]
    })
    addStoreOnServerStartup(
        @A_Inject(A_Scope) scope: A_Scope,
    ) {
        scope.register(new MemoryStore());
    }


    // --------------------------------------------------------------
    // -------------- Entity Base Methods Extensions ----------------
    // --------------------------------------------------------------


    @A_Feature.Extend({
        name: A_TYPES__EntityBaseMethod.SAVE
    })
    async save(
        @A_Inject(MemoryStore) store: MemoryStore,
        @A_Inject(A_Entity) entity: A_Entity
    ) {
        await store.save(entity);
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityBaseMethod.LOAD
    })
    async load(
        @A_Inject(MemoryStore) store: MemoryStore,
        @A_Inject(A_Entity) entity: A_Entity
    ) {
        const dbEntity = await store.get<any>(entity.aseid.toString());

        if (dbEntity)
            entity.fromJSON(dbEntity)

        return store.entities.get(entity.aseid.toString());
    }


    @A_Feature.Extend({
        name: A_TYPES__EntityBaseMethod.DESTROY
    })
    async destroy(
        @A_Inject(MemoryStore) store: MemoryStore,
        @A_Inject(A_Entity) entity: A_Entity
    ) {
        await store.destroy(entity.aseid.toString());
    }
}