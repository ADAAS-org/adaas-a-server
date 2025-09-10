import { A_Entity, A_TYPES__Entity_JSON } from "@adaas/a-concept";
import { A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListPagination, A_SERVER_TYPES__A_EntityListSerialized } from "./A_EntityList.entity.types";
/**
 * A-EntityList
 *
 * Entity that represents a list of entities with pagination of particular type
 */
export declare class A_EntityList<SerializedEntityType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListSerialized> {
    protected _entityConstructor: {
        new (...args: any[]): A_Entity<any, SerializedEntityType>;
    };
    protected _items: Array<A_Entity>;
    protected _pagination: A_SERVER_TYPES__A_EntityListPagination;
    /**
     * Returns the entity constructor used for the list
     */
    get entityConstructor(): {
        new (...args: any[]): A_Entity<any, SerializedEntityType>;
    };
    /**
     * Returns the list of items contained in the entity list
     */
    get items(): Array<A_Entity>;
    /**
     * Returns pagination information about the entity list
     */
    get pagination(): A_SERVER_TYPES__A_EntityListPagination;
    /**
     * Creates a new instance of A_EntityList
     *
     * @param newEntity
     */
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor): void;
    /**
     * Allows to convert Repository Response data to EntityList instance
     *
     * [!] This method does not load the data from the repository, it only converts the data to the EntityList instance
     *
     * @param items
     * @param pagination
     */
    fromList(items: Array<A_Entity> | Array<SerializedEntityType>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    /**
     * Serializes the EntityList to a JSON object
     *
     * @returns
     */
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized;
}
