import { A_Entity, A_TYPES__Entity_Constructor, A_Scope } from '@adaas/a-concept';
import { A_SERVER_TYPES__A_EntityListConstructor, A_SERVER_TYPES__A_EntityListSerialized, A_SERVER_TYPES__A_EntityListPagination } from './A-EntityList.types.mjs';
import { A_ServerEntityListPagination } from './A-EntityListPagination.context.mjs';

/**
 * A-EntityList
 *
 * Typed, paginated list of A-Concept entities.
 *
 * Construction (user-facing):
 *   new A_ServerEntityList<User>({ entity: User, pagination: { page: 1, pageSize: 20 } })
 *
 * Construction (controller-internal, backward-compat):
 *   new A_ServerEntityList({ name: 'user', scope: 'my-scope', constructor: User })
 */
declare class A_ServerEntityList<EntityType extends A_Entity = A_Entity> extends A_Entity<A_SERVER_TYPES__A_EntityListConstructor<EntityType>, A_SERVER_TYPES__A_EntityListSerialized<EntityType>> {
    static get scope(): string;
    protected _entityConstructor: A_TYPES__Entity_Constructor<EntityType>;
    /**
     * Ordered item references for O(1) positional access.
     * The list's own scope is the authoritative store (enables @A_Inject and
     * feature chains on items); this array mirrors the same items in order.
     */
    protected _items: Array<EntityType>;
    /** Lazily allocated private scope — pagination and cache state live here. */
    private _ownScope?;
    /**
     * The list's own scope, created on first access and bound to this entity
     * via A_Context.allocate.  Items, pagination and cache state are registered
     * here so they participate in feature chains and @A_Inject resolution.
     */
    get ownScope(): A_Scope;
    get entityConstructor(): A_TYPES__Entity_Constructor<EntityType>;
    get items(): Array<EntityType>;
    /** Pagination state — lives as a Fragment in the list's own scope. */
    get pagination(): A_ServerEntityListPagination;
    private get cacheState();
    /** Total number of items currently held in memory. */
    get length(): number;
    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor<EntityType>): void;
    /**
     * Populate the list from raw repository data.
     * Items are registered in the list's own scope so they participate in
     * feature chains and @A_Inject resolution.
     */
    fromList(items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>, pagination?: A_SERVER_TYPES__A_EntityListPagination): void;
    /** Return the item at `index`, or `undefined` if out of range. */
    at(index: number): EntityType | undefined;
    /** Replace the item at `index` in place. Accepts a live entity or a plain serialised object. */
    replace(index: number, item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Append an item to the end of the list. */
    push(item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Prepend an item to the beginning of the list. */
    unshift(item: EntityType | ReturnType<EntityType['toJSON']>): this;
    /** Remove the item at `index` from the list. */
    remove(index: number): this;
    /** Return the first item that satisfies `predicate`, or `undefined`. */
    find(predicate: (item: EntityType, index: number) => boolean): EntityType | undefined;
    /** Return all items that satisfy `predicate` without mutating the list. */
    filter(predicate: (item: EntityType, index: number) => boolean): EntityType[];
    /**
     * Mark this list as cached for `ttlMs` milliseconds from now.
     * Callers can check `isCached()` to decide whether to skip `load()`.
     */
    setCache(ttlMs: number): this;
    /** Returns `true` if the cache is still valid. */
    isCached(): boolean;
    /** Invalidate the cache so the next `load()` call fetches fresh data. */
    invalidateCache(): this;
    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType>;
}

export { A_ServerEntityList };
