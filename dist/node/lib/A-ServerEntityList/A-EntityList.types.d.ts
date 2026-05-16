import { A_TYPES__Entity_Constructor, A_Entity, A_TYPES__Entity_Serialized } from '@adaas/a-concept';

type A_SERVER_TYPES__A_EntityListConstructor = {
    name: string;
    scope: string;
    constructor: A_TYPES__Entity_Constructor;
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

export { type A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListEvent, type A_SERVER_TYPES__A_EntityListPagination, type A_SERVER_TYPES__A_EntityListSerialized };
