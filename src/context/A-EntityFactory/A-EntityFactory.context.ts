import { A_Entity, A_Fragment, ASEID } from "@adaas/a-concept"
import { A_SERVER_TYPES__AEntityFactoryConstructor1, A_SERVER_TYPES__AEntityFactoryConstructor2 } from "./A-EntityFactory.context.types";


export class A_EntityFactory extends A_Fragment {


    private _entities: Map<string, { new(...args: any[]): any }> = new Map();


    constructor(
        map: A_SERVER_TYPES__AEntityFactoryConstructor1
    )
    constructor(
        entities: A_SERVER_TYPES__AEntityFactoryConstructor2
    )
    constructor(
        map: A_SERVER_TYPES__AEntityFactoryConstructor1,
        entities: A_SERVER_TYPES__AEntityFactoryConstructor2
    )
    constructor(
        param1: A_SERVER_TYPES__AEntityFactoryConstructor1 | A_SERVER_TYPES__AEntityFactoryConstructor2,
        param2?: A_SERVER_TYPES__AEntityFactoryConstructor2
    ) {
        super();

        this._setEntities(param1);
        this._setEntities(param2);
    }


    protected _setEntities(
        entities: A_SERVER_TYPES__AEntityFactoryConstructor2 | A_SERVER_TYPES__AEntityFactoryConstructor1 = []
    ) {
        if (Array.isArray(entities)) {
            entities.forEach((entity) => {
                this._entities.set(entity.entity, entity);
            });
        } else {
            Object.keys(entities).forEach((key) => {
                this._entities.set(key, entities[key]);
            });
        }
    }


    add(
       key: string,
       entity: typeof A_Entity
    ): void
    add(
        entity: typeof A_Entity
    ): void
    add(
        param1: string | typeof A_Entity,
        param2?: typeof A_Entity
    ): void {
        switch (true) {
            case typeof param1 === 'string' && !!param2:
                this._entities.set(param1, param2);

                break;

            case typeof param1 !== 'string':
                this._entities.set(param1.entity, param1);

                break;
        }
    }
   


    has(
        aseid: ASEID
    ): boolean
    has(
        /**
         * The name of the entity
         */
        entity: string
    ): boolean
    has(
        /**
         * The ASEID of the entity
         */
        aseid: string
    ): boolean
    has(
        param1: string | ASEID
    ): boolean {
        let name: string;

        switch (true) {
            case param1 instanceof ASEID:
                name = param1.entity;

                break;

            case !(param1 instanceof ASEID) && ASEID.isASEID(param1):
                name = new ASEID(param1).entity;

                break;

            default:
                name = param1;

                break;
        }

        return this._entities.has(name);
    }


    /**
     * Resolves the entity constructor by the entity name
     * 
     * @param entity 
     */
    resolve(
        entity: string
    ): { new(...args: any[]): A_Entity } | undefined
    resolve(
        aseid: string
    ): { new(...args: any[]): A_Entity } | undefined
    resolve(
        aseid: ASEID
    ): { new(...args: any[]): A_Entity } | undefined
    resolve(
        param1: string | ASEID
    ): { new(...args: any[]): A_Entity } | undefined {

        let name: string;

        switch (true) {
            case param1 instanceof ASEID:
                name = param1.entity;

                break;

            case typeof param1 === 'string' && ASEID.isASEID(param1):

                name = new ASEID(param1).entity;

                break;

            default:
                name = param1;

                break;
        }

        return this._entities.get(name);
    }



    resolveByName(
        name: string
    ): { new(...args: any[]): A_Entity } | undefined {
        return this._entities.get(name);
    }

}