import { A_Fragment, A_TYPES__Fragment_Serialized } from '@adaas/a-concept';

declare class A_ServerEntityListCacheState extends A_Fragment<A_TYPES__Fragment_Serialized> {
    protected _timestamp?: number;
    protected _ttl?: number;
    set(ttlMs: number): void;
    invalidate(): void;
    isValid(): boolean;
    toJSON(): A_TYPES__Fragment_Serialized;
}

export { A_ServerEntityListCacheState };
