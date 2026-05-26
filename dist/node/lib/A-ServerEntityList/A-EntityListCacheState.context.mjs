import '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class A_ServerEntityListCacheState extends A_Fragment {
  set(ttlMs) {
    this._timestamp = Date.now();
    this._ttl = ttlMs;
  }
  invalidate() {
    this._timestamp = void 0;
    this._ttl = void 0;
  }
  isValid() {
    if (this._timestamp === void 0 || this._ttl === void 0) return false;
    return Date.now() - this._timestamp < this._ttl;
  }
  toJSON() {
    return { name: this.name };
  }
}

export { A_ServerEntityListCacheState };
//# sourceMappingURL=A-EntityListCacheState.context.mjs.map
//# sourceMappingURL=A-EntityListCacheState.context.mjs.map