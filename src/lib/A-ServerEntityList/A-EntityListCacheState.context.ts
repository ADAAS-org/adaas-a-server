import { A_Fragment, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";


export class A_ServerEntityListCacheState extends A_Fragment<A_TYPES__Fragment_Serialized> {

    protected _timestamp?: number;
    protected _ttl?: number;

    set(ttlMs: number): void {
        this._timestamp = Date.now();
        this._ttl = ttlMs;
    }

    invalidate(): void {
        this._timestamp = undefined;
        this._ttl = undefined;
    }

    isValid(): boolean {
        if (this._timestamp === undefined || this._ttl === undefined) return false;
        return (Date.now() - this._timestamp) < this._ttl;
    }

    toJSON(): A_TYPES__Fragment_Serialized {
        return { name: this.name };
    }
}
