'use strict';

var aConcept = require('@adaas/a-concept');

class A_ServerEntityListCacheState extends aConcept.A_Fragment {
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

exports.A_ServerEntityListCacheState = A_ServerEntityListCacheState;
//# sourceMappingURL=A-EntityListCacheState.context.js.map
//# sourceMappingURL=A-EntityListCacheState.context.js.map