import { A_Entity, A_Fragment, ASEID } from "@adaas/a-concept";
import { A_SERVER_TYPES__AEntityFactoryConstructor1, A_SERVER_TYPES__AEntityFactoryConstructor2 } from "./A-EntityFactory.context.types";
export declare class A_EntityFactory extends A_Fragment {
    private _entities;
    constructor(map: A_SERVER_TYPES__AEntityFactoryConstructor1);
    constructor(entities: A_SERVER_TYPES__AEntityFactoryConstructor2);
    constructor(map: A_SERVER_TYPES__AEntityFactoryConstructor1, entities: A_SERVER_TYPES__AEntityFactoryConstructor2);
    protected _setEntities(entities?: A_SERVER_TYPES__AEntityFactoryConstructor2 | A_SERVER_TYPES__AEntityFactoryConstructor1): void;
    add(key: string, entity: typeof A_Entity): void;
    add(entity: typeof A_Entity): void;
    has(aseid: ASEID): boolean;
    has(
    /**
     * The name of the entity
     */
    entity: string): boolean;
    has(
    /**
     * The ASEID of the entity
     */
    aseid: string): boolean;
    /**
     * Resolves the entity constructor by the entity name
     *
     * @param entity
     */
    resolve(entity: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolve(aseid: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolve(aseid: ASEID): {
        new (...args: any[]): A_Entity;
    } | undefined;
    resolveByName(name: string): {
        new (...args: any[]): A_Entity;
    } | undefined;
}
