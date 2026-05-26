import {
    A_Context, A_Entity, A_Scope,
    A_TYPES__Entity_Constructor,
    ASEID,
} from "@adaas/a-concept";
import {
    A_SERVER_TYPES__A_EntityListConstructor,
    A_SERVER_TYPES__A_EntityListPagination,
    A_SERVER_TYPES__A_EntityListSerialized
} from "./A-EntityList.types";
import { A_ServerEntityListPagination } from "./A-EntityListPagination.context";
import { A_ServerEntityListCacheState } from "./A-EntityListCacheState.context";



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
export class A_ServerEntityList<
    EntityType extends A_Entity = A_Entity,
> extends A_Entity<
    A_SERVER_TYPES__A_EntityListConstructor<EntityType>,
    A_SERVER_TYPES__A_EntityListSerialized<EntityType>
> {

    static get scope(): string {
        return 'a-server';
    }

    protected _entityConstructor!: A_TYPES__Entity_Constructor<EntityType>;

    /**
     * Ordered item references for O(1) positional access.
     * The list's own scope is the authoritative store (enables @A_Inject and
     * feature chains on items); this array mirrors the same items in order.
     */
    protected _items: Array<EntityType> = [];

    /** Lazily allocated private scope — pagination and cache state live here. */
    private _ownScope?: A_Scope;


    // ── Getters ──────────────────────────────────────────────────────────────

    /**
     * The list's own scope, created on first access and bound to this entity
     * via A_Context.allocate.  Items, pagination and cache state are registered
     * here so they participate in feature chains and @A_Inject resolution.
     */
    get ownScope(): A_Scope {
        if (!this._ownScope) {
            this._ownScope = A_Context.allocate(
                this,
                new A_Scope({ name: `${this.aseid.id}-scope` })
            );
        }
        return this._ownScope;
    }

    get entityConstructor(): A_TYPES__Entity_Constructor<EntityType> {
        return this._entityConstructor;
    }

    get items(): Array<EntityType> {
        return this._items;
    }

    /** Pagination state — lives as a Fragment in the list's own scope. */
    get pagination(): A_ServerEntityListPagination {
        return this.ownScope.resolveFlatOnce(A_ServerEntityListPagination)!;
    }

    private get cacheState(): A_ServerEntityListCacheState {
        return this.ownScope.resolveFlatOnce(A_ServerEntityListCacheState)!;
    }

    /** Total number of items currently held in memory. */
    get length(): number {
        return this._items.length;
    }


    // ── Initialisation ───────────────────────────────────────────────────────

    fromNew(newEntity: A_SERVER_TYPES__A_EntityListConstructor<EntityType>): void {
        this.aseid = this.generateASEID({
            concept: A_Context.root.name,
            entity: 'a-list.' + newEntity.entity.name,
        });

        this._entityConstructor = newEntity.entity;

        // Initialise state Fragments in the list's own scope
        this.ownScope.register(new A_ServerEntityListPagination(newEntity.pagination));
        this.ownScope.register(new A_ServerEntityListCacheState());
    }


    /**
     * Populate the list from raw repository data.
     * Items are registered in the list's own scope so they participate in
     * feature chains and @A_Inject resolution.
     */
    fromList(
        items: Array<EntityType> | Array<ReturnType<EntityType['toJSON']>>,
        pagination?: A_SERVER_TYPES__A_EntityListPagination
    ) {
        // Deregister previous items from own scope
        this._items.forEach(item => {
            try { this.ownScope.deregister(item); } catch { /* already gone */ }
        });

        this._items = items.map(item => {
            const entity = item instanceof A_Entity
                ? item as EntityType
                : new this._entityConstructor(item as any);
            this.ownScope.register(entity);
            return entity;
        });

        if (pagination) {
            this.pagination.update(pagination);
        }
    }


    // ── Collection access ────────────────────────────────────────────────────

    /** Return the item at `index`, or `undefined` if out of range. */
    at(index: number): EntityType | undefined {
        return this._items[index];
    }

    /** Replace the item at `index` in place. Accepts a live entity or a plain serialised object. */
    replace(index: number, item: EntityType | ReturnType<EntityType['toJSON']>): this {
        const next = item instanceof A_Entity
            ? item as EntityType
            : new this._entityConstructor(item as any);
        try { this.ownScope.deregister(this._items[index]); } catch { /* ok */ }
        this.ownScope.register(next);
        this._items[index] = next;
        return this;
    }

    /** Append an item to the end of the list. */
    push(item: EntityType | ReturnType<EntityType['toJSON']>): this {
        const next = item instanceof A_Entity
            ? item as EntityType
            : new this._entityConstructor(item as any);
        this.ownScope.register(next);
        this._items.push(next);
        return this;
    }

    /** Prepend an item to the beginning of the list. */
    unshift(item: EntityType | ReturnType<EntityType['toJSON']>): this {
        const next = item instanceof A_Entity
            ? item as EntityType
            : new this._entityConstructor(item as any);
        this.ownScope.register(next);
        this._items.unshift(next);
        return this;
    }

    /** Remove the item at `index` from the list. */
    remove(index: number): this {
        const [removed] = this._items.splice(index, 1);
        if (removed) {
            try { this.ownScope.deregister(removed); } catch { /* ok */ }
        }
        return this;
    }

    /** Return the first item that satisfies `predicate`, or `undefined`. */
    find(predicate: (item: EntityType, index: number) => boolean): EntityType | undefined {
        return this._items.find(predicate);
    }

    /** Return all items that satisfy `predicate` without mutating the list. */
    filter(predicate: (item: EntityType, index: number) => boolean): EntityType[] {
        return this._items.filter(predicate);
    }


    // ── Caching ──────────────────────────────────────────────────────────────

    /**
     * Mark this list as cached for `ttlMs` milliseconds from now.
     * Callers can check `isCached()` to decide whether to skip `load()`.
     */
    setCache(ttlMs: number): this {
        this.cacheState.set(ttlMs);
        return this;
    }

    /** Returns `true` if the cache is still valid. */
    isCached(): boolean {
        return this.cacheState.isValid();
    }

    /** Invalidate the cache so the next `load()` call fetches fresh data. */
    invalidateCache(): this {
        this.cacheState.invalidate();
        return this;
    }


    // ── Serialisation ────────────────────────────────────────────────────────

    toJSON(): A_SERVER_TYPES__A_EntityListSerialized<EntityType> {
        const { total, page, pageSize } = this.pagination;
        return {
            ...super.toJSON(),
            items: this._items.map(i => i.toJSON()) as ReturnType<EntityType['toJSON']>[],
            type: (this._entityConstructor as any).entity ?? 'unknown',
            pagination: { total, page, pageSize },
        };
    }
}

