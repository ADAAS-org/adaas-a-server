import { A_Context, A_Entity, A_Feature, A_Scope, A_TYPES__Entity_JSON } from "@adaas/a-concept";
import { A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListEvent, A_SERVER_TYPES__A_EntityListPagination, A_SERVER_TYPES__A_EntityListSerialized } from "./A_EntityList.entity.types";
import { ASEID } from "@adaas/a-utils";



/**
 * A-EntityList
 * 
 * Entity that represents a list of entities with pagination of particular type
 */
export class A_EntityList<SerializedEntityType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON> extends A_Entity<
    A_SERVER_TYPES__A_EntityListConstructor,
    A_SERVER_TYPES__A_EntityListSerialized
> {

    protected _items: Array<A_Entity> = [];


    protected _pagination: A_SERVER_TYPES__A_EntityListPagination = {
        total: 0,
        page: 1,
        pageSize: 10
    };

    protected _entityConstructor!: { new(...args: any[]): A_Entity<any, SerializedEntityType> };


    get items(): Array<A_Entity> {
        return this._items;
    }

    get pagination(): A_SERVER_TYPES__A_EntityListPagination {
        return this._pagination;
    }


    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor): void {
        this.aseid = new ASEID({
            namespace: A_Context.root.name,
            scope: 'default',
            entity: 'a-list' + (newEntity.name ? `.${newEntity.name}` : ''),
            id: (new Date()).getTime().toString(),
        });

        this._entityConstructor = newEntity.constructor as { new(...args: any[]): A_Entity<any, SerializedEntityType> };
    }




    fromList(
        items: Array< A_Entity> | Array<SerializedEntityType>,
        pagination?: A_SERVER_TYPES__A_EntityListPagination
    ) {
        this._items = items.map(item => {
            if (item instanceof A_Entity) {
                return item;
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




    toJSON(): A_SERVER_TYPES__A_EntityListSerialized {
        return {
            ...super.toJSON(),
            items: this._items.map(i => i.toJSON()),
            pagination: this._pagination
        }
    }
}
