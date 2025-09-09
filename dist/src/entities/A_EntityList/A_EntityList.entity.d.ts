import { A_Entity, A_TYPES__Entity_JSON } from "@adaas/a-concept";
import { A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListPagination, A_SERVER_TYPES__A_EntityListSerialized } from "./A_EntityList.entity.types";
/**
 * A-EntityList
 *
 * Entity that represents a list of entities with pagination of particular type
 */
export declare class A_EntityList<SerializedEntityType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListSerialized> {
    protected _items: Array<A_Entity>;
    protected _pagination: A_SERVER_TYPES__A_EntityListPagination;
    protected _entityConstructor: {
        new (...args: any[]): A_Entity<any, SerializedEntityType>;
    };
    get items(): Array<A_Entity>;
    get pagination(): A_SERVER_TYPES__A_EntityListPagination;
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor): void;
    fromList(items: Array<A_Entity> | Array<SerializedEntityType>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized;
}
