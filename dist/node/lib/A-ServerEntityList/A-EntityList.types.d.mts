import { A_Entity, A_TYPES__Entity_Constructor, A_TYPES__Entity_Serialized } from '@adaas/a-concept';

type A_SERVER_TYPES__A_EntityListConstructor<T extends A_Entity = A_Entity> = {
    /** User-facing: the entity class (e.g. `User`). Name and scope are derived from its statics. */
    entity: A_TYPES__Entity_Constructor<T>;
    /** Initial pagination request parameters. Defaults to page 1, pageSize 10. */
    pagination?: {
        page?: number;
        pageSize?: number;
    };
};
declare enum A_SERVER_TYPES__A_EntityListEvent {
    Load = "load"
}
type A_SERVER_TYPES__A_EntityListSerialized<EntityTypes extends A_Entity = A_Entity> = {
    items: Array<ReturnType<EntityTypes['toJSON']>>;
    type: string;
    pagination: A_SERVER_TYPES__A_EntityListPagination;
} & A_TYPES__Entity_Serialized;
type A_SERVER_TYPES__A_EntityListPagination = {
    total: number;
    page: number;
    pageSize: number;
};
type A_SERVER_TYPES__A_EntityListCacheEntry = {
    timestamp: number;
    ttl: number;
};

export { type A_SERVER_TYPES__A_EntityListCacheEntry, type A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListEvent, type A_SERVER_TYPES__A_EntityListPagination, type A_SERVER_TYPES__A_EntityListSerialized };
