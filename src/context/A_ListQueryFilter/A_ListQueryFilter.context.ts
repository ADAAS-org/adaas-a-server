import { A_Fragment } from "@adaas/a-concept";



export class A_ListQueryFilter<FilterFields extends string[]> extends A_Fragment {

    protected parsedQuery!: Record<FilterFields[number], string>;

    constructor(
        protected _query: string | Partial<Record<FilterFields[number], string>> = {},
        protected defaults: Partial<Record<FilterFields[number], string>> = {}
    ) {
        super();
        this.parsedQuery = this.parseQueryString(_query);
    }


    get query() {
        return this._query;
    }


    get(property: FilterFields[number], defaultValue: string = '') {
        return this.parsedQuery[property] || this.defaults[property] || defaultValue;
    }

    protected parseQueryString(value: string | Partial<Record<FilterFields[number], string>> = {}): Record<FilterFields[number], string> {
        if (typeof value === 'string') {
            return value.split('&').reduce((acc, part) => {
                const [key, val] = part.split('=');
                acc[decodeURIComponent(key)] = decodeURIComponent(val || '');
                return acc;
            }, {}) as Record<FilterFields[number], string>;
        }
        return value as Record<FilterFields[number], string>;
    }
}