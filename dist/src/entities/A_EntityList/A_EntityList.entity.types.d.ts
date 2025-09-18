import { A_Entity, A_TYPES__Entity_JSON } from "@adaas/a-concept";
export type A_SERVER_TYPES__A_EntityListConstructor = {
    name: string;
    scope: string;
    constructor: {
        new (...args: any[]): A_Entity;
    };
};
export declare enum A_SERVER_TYPES__A_EntityListEvent {
    Load = "load"
}
export type A_SERVER_TYPES__A_EntityListSerialized<EntityTypes extends A_Entity = A_Entity> = {
    items: Array<ReturnType<EntityTypes['toJSON']>>;
    type: string;
    pagination: A_SERVER_TYPES__A_EntityListPagination;
} & A_TYPES__Entity_JSON;
export type A_SERVER_TYPES__A_EntityListPagination = {
    total: number;
    page: number;
    pageSize: number;
};
