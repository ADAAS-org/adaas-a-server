import '../../chunk-EQQGB2QZ.mjs';
import { A_Entity, A_Context, A_Scope } from '@adaas/a-concept';
import { A_ServerEntityListPagination } from './A-EntityListPagination.context';
import { A_ServerEntityListCacheState } from './A-EntityListCacheState.context';

class A_ServerEntityList extends A_Entity {
  constructor() {
    super(...arguments);
    /**
     * Ordered item references for O(1) positional access.
     * The list's own scope is the authoritative store (enables @A_Inject and
     * feature chains on items); this array mirrors the same items in order.
     */
    this._items = [];
  }
  static get scope() {
    return "a-server";
  }
  // ── Getters ──────────────────────────────────────────────────────────────
  /**
   * The list's own scope, created on first access and bound to this entity
   * via A_Context.allocate.  Items, pagination and cache state are registered
   * here so they participate in feature chains and @A_Inject resolution.
   */
  get ownScope() {
    if (!this._ownScope) {
      this._ownScope = A_Context.allocate(
        this,
        new A_Scope({ name: `${this.aseid.id}-scope` })
      );
    }
    return this._ownScope;
  }
  get entityConstructor() {
    return this._entityConstructor;
  }
  get items() {
    return this._items;
  }
  /** Pagination state — lives as a Fragment in the list's own scope. */
  get pagination() {
    return this.ownScope.resolveFlatOnce(A_ServerEntityListPagination);
  }
  get cacheState() {
    return this.ownScope.resolveFlatOnce(A_ServerEntityListCacheState);
  }
  /** Total number of items currently held in memory. */
  get length() {
    return this._items.length;
  }
  // ── Initialisation ───────────────────────────────────────────────────────
  fromNew(newEntity) {
    this.aseid = this.generateASEID({
      concept: A_Context.root.name,
      entity: "a-list." + newEntity.entity.name
    });
    this._entityConstructor = newEntity.entity;
    this.ownScope.register(new A_ServerEntityListPagination(newEntity.pagination));
    this.ownScope.register(new A_ServerEntityListCacheState());
  }
  /**
   * Populate the list from raw repository data.
   * Items are registered in the list's own scope so they participate in
   * feature chains and @A_Inject resolution.
   */
  fromList(items, pagination) {
    this._items.forEach((item) => {
      try {
        this.ownScope.deregister(item);
      } catch {
      }
    });
    this._items = items.map((item) => {
      const entity = item instanceof A_Entity ? item : new this._entityConstructor(item);
      this.ownScope.register(entity);
      return entity;
    });
    if (pagination) {
      this.pagination.update(pagination);
    }
  }
  // ── Collection access ────────────────────────────────────────────────────
  /** Return the item at `index`, or `undefined` if out of range. */
  at(index) {
    return this._items[index];
  }
  /** Replace the item at `index` in place. Accepts a live entity or a plain serialised object. */
  replace(index, item) {
    const next = item instanceof A_Entity ? item : new this._entityConstructor(item);
    try {
      this.ownScope.deregister(this._items[index]);
    } catch {
    }
    this.ownScope.register(next);
    this._items[index] = next;
    return this;
  }
  /** Append an item to the end of the list. */
  push(item) {
    const next = item instanceof A_Entity ? item : new this._entityConstructor(item);
    this.ownScope.register(next);
    this._items.push(next);
    return this;
  }
  /** Prepend an item to the beginning of the list. */
  unshift(item) {
    const next = item instanceof A_Entity ? item : new this._entityConstructor(item);
    this.ownScope.register(next);
    this._items.unshift(next);
    return this;
  }
  /** Remove the item at `index` from the list. */
  remove(index) {
    const [removed] = this._items.splice(index, 1);
    if (removed) {
      try {
        this.ownScope.deregister(removed);
      } catch {
      }
    }
    return this;
  }
  /** Return the first item that satisfies `predicate`, or `undefined`. */
  find(predicate) {
    return this._items.find(predicate);
  }
  /** Return all items that satisfy `predicate` without mutating the list. */
  filter(predicate) {
    return this._items.filter(predicate);
  }
  // ── Caching ──────────────────────────────────────────────────────────────
  /**
   * Mark this list as cached for `ttlMs` milliseconds from now.
   * Callers can check `isCached()` to decide whether to skip `load()`.
   */
  setCache(ttlMs) {
    this.cacheState.set(ttlMs);
    return this;
  }
  /** Returns `true` if the cache is still valid. */
  isCached() {
    return this.cacheState.isValid();
  }
  /** Invalidate the cache so the next `load()` call fetches fresh data. */
  invalidateCache() {
    this.cacheState.invalidate();
    return this;
  }
  // ── Serialisation ────────────────────────────────────────────────────────
  toJSON() {
    const { total, page, pageSize } = this.pagination;
    return {
      ...super.toJSON(),
      items: this._items.map((i) => i.toJSON()),
      type: this._entityConstructor.entity ?? "unknown",
      pagination: { total, page, pageSize }
    };
  }
}

export { A_ServerEntityList };
//# sourceMappingURL=A-EntityList.entity.mjs.map
//# sourceMappingURL=A-EntityList.entity.mjs.map