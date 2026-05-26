import { A_TYPES__Fragment_Serialized, A_Fragment } from '@adaas/a-concept';
import { A_SERVER_TYPES__A_EntityListPagination } from './A-EntityList.types.js';

type A_SERVER_TYPES__A_EntityListPaginationSerialized = A_SERVER_TYPES__A_EntityListPagination & A_TYPES__Fragment_Serialized;
declare class A_ServerEntityListPagination extends A_Fragment<A_SERVER_TYPES__A_EntityListPaginationSerialized> {
    protected _total: number;
    protected _page: number;
    protected _pageSize: number;
    constructor(init?: Partial<A_SERVER_TYPES__A_EntityListPagination>);
    get total(): number;
    get page(): number;
    get pageSize(): number;
    update(data: Partial<A_SERVER_TYPES__A_EntityListPagination>): void;
    fromJSON(serialized: A_SERVER_TYPES__A_EntityListPaginationSerialized): void;
    toJSON(): A_SERVER_TYPES__A_EntityListPaginationSerialized;
}

export { type A_SERVER_TYPES__A_EntityListPaginationSerialized, A_ServerEntityListPagination };
