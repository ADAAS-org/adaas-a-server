import { A_Fragment, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";
import { A_SERVER_TYPES__A_EntityListPagination } from "./A-EntityList.types";


export type A_SERVER_TYPES__A_EntityListPaginationSerialized =
    A_SERVER_TYPES__A_EntityListPagination & A_TYPES__Fragment_Serialized;


export class A_ServerEntityListPagination extends A_Fragment<A_SERVER_TYPES__A_EntityListPaginationSerialized> {

    protected _total: number = 0;
    protected _page: number = 1;
    protected _pageSize: number = 10;

    constructor(init?: Partial<A_SERVER_TYPES__A_EntityListPagination>) {
        super();
        if (init) {
            if (init.total !== undefined) this._total = init.total;
            if (init.page !== undefined) this._page = init.page;
            if (init.pageSize !== undefined) this._pageSize = init.pageSize;
        }
    }

    get total(): number { return this._total; }
    get page(): number { return this._page; }
    get pageSize(): number { return this._pageSize; }

    update(data: Partial<A_SERVER_TYPES__A_EntityListPagination>): void {
        if (data.total !== undefined) this._total = data.total;
        if (data.page !== undefined) this._page = data.page;
        if (data.pageSize !== undefined) this._pageSize = data.pageSize;
    }

    fromJSON(serialized: A_SERVER_TYPES__A_EntityListPaginationSerialized): void {
        this._total = serialized.total;
        this._page = serialized.page;
        this._pageSize = serialized.pageSize;
    }

    toJSON(): A_SERVER_TYPES__A_EntityListPaginationSerialized {
        return {
            name: this.name,
            total: this._total,
            page: this._page,
            pageSize: this._pageSize,
        };
    }
}
