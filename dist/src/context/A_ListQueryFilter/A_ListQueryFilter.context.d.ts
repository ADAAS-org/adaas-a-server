import { A_Fragment } from "@adaas/a-concept";
export declare class A_ListQueryFilter<FilterFields extends string[]> extends A_Fragment {
    protected _query: string | Partial<Record<FilterFields[number], string>>;
    protected defaults: Partial<Record<FilterFields[number], string>>;
    protected parsedQuery: Record<FilterFields[number], string>;
    constructor(_query?: string | Partial<Record<FilterFields[number], string>>, defaults?: Partial<Record<FilterFields[number], string>>);
    get query(): string | Partial<Record<FilterFields[number], string>>;
    get(property: FilterFields[number], defaultValue?: string): string;
    protected parseQueryString(value?: string | Partial<Record<FilterFields[number], string>>): Record<FilterFields[number], string>;
}
