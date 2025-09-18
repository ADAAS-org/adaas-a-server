import {
    A_Context, A_Entity,
    A_TYPES__Entity_JSON
} from "@adaas/a-concept";
import {
    A_SERVER_TYPES__A_EntityListConstructor,
    A_SERVER_TYPES__A_EntityListPagination,
    A_SERVER_TYPES__A_EntityListSerialized
} from "./A_EntityList.entity.types";
import { ASEID } from "@adaas/a-utils";



/**
 * A-EntityList
 * 
 * Entity that represents a list of entities with pagination of particular type
 */
export class A_EntityList<
    EntityType extends A_Entity = A_Entity,
> extends A_Entity<
    A_SERVER_TYPES__A_EntityListConstructor,
    A_SERVER_TYPES__A_EntityListSerialized
> {
    protected _entityConstructor!: new (...args: any[]) => EntityType;
    protected _items: Array<EntityType> = [];
    protected _pagination: A_SERVER_TYPES__A_EntityListPagination = {
        total: 0,
        page: 1,
        pageSize: 10
    };


    /**
     * Returns the entity constructor used for the list
     */
    get entityConstructor(): new (...args: any[]) => EntityType {
        return this._entityConstructor;
    }

    /**
     * Returns the list of items contained in the entity list
     */
    get items(): Array<EntityType> {
        return this._items;
    }

    /**
     * Returns pagination information about the entity list
     */
    get pagination(): A_SERVER_TYPES__A_EntityListPagination {
        return this._pagination;
    }




    /**
     * Creates a new instance of A_EntityList
     * 
     * @param newEntity 
     */
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor): void {
        this.aseid = new ASEID({
            namespace: A_Context.root.name,
            scope: 'default',
            entity: 'a-list' + (newEntity.name ? `.${newEntity.name}` : ''),
            id: (new Date()).getTime().toString(),
        });

        this._entityConstructor = newEntity.constructor as new (...args: any[]) => EntityType;
    }



    /**
     * Allows to convert Repository Response data to EntityList instance
     * 
     * [!] This method does not load the data from the repository, it only converts the data to the EntityList instance
     * 
     * @param items 
     * @param pagination 
     */
    fromList(
        items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>,
        pagination?: A_SERVER_TYPES__A_EntityListPagination
    ) {
        this._items = items.map(item => {
            if (item instanceof A_Entity) {
                return item as EntityType;
            } else {
                const entity = new this._entityConstructor(item);
                return entity;
            }
        });

        if (pagination) {
            this._pagination = {
                total: pagination.total,
                page: pagination.page,
                pageSize: pagination.pageSize
            }
        }
    }



    /**
     * Serializes the EntityList to a JSON object
     * 
     * @returns 
     */
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType> {
        return {
            ...super.toJSON(),
            items: this._items.map(i => i.toJSON()) as ReturnType<EntityType['toJSON']>[],
            pagination: this._pagination
        }
    }
}
