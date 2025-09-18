import { A_Entity } from "@adaas/a-concept";
import { A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListPagination, A_SERVER_TYPES__A_EntityListSerialized } from "./A_EntityList.entity.types";
/**
 * A-EntityList
 *
 * Entity that represents a list of entities with pagination of particular type
 */
export declare class A_EntityList<EntityType extends A_Entity = A_Entity> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListSerialized> {
    protected _entityConstructor: new (...args: any[]) => EntityType;
    protected _items: Array<EntityType>;
    protected _pagination: A_SERVER_TYPES__A_EntityListPagination;
    /**
     * Returns the entity constructor used for the list
     */
    get entityConstructor(): new (...args: any[]) => EntityType;
    /**
     * Returns the list of items contained in the entity list
     */
    get items(): Array<EntityType>;
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
    fromList(items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    /**
     * Serializes the EntityList to a JSON object
     *
     * @returns
     */
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType>;
}
