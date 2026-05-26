'use strict';

var aConcept = require('@adaas/a-concept');

class A_ServerEntityListPagination extends aConcept.A_Fragment {
  constructor(init) {
    super();
    this._total = 0;
    this._page = 1;
    this._pageSize = 10;
    if (init) {
      if (init.total !== void 0) this._total = init.total;
      if (init.page !== void 0) this._page = init.page;
      if (init.pageSize !== void 0) this._pageSize = init.pageSize;
    }
  }
  get total() {
    return this._total;
  }
  get page() {
    return this._page;
  }
  get pageSize() {
    return this._pageSize;
  }
  update(data) {
    if (data.total !== void 0) this._total = data.total;
    if (data.page !== void 0) this._page = data.page;
    if (data.pageSize !== void 0) this._pageSize = data.pageSize;
  }
  fromJSON(serialized) {
    this._total = serialized.total;
    this._page = serialized.page;
    this._pageSize = serialized.pageSize;
  }
  toJSON() {
    return {
      name: this.name,
      total: this._total,
      page: this._page,
      pageSize: this._pageSize
    };
  }
}

exports.A_ServerEntityListPagination = A_ServerEntityListPagination;
//# sourceMappingURL=A-EntityListPagination.context.js.map
//# sourceMappingURL=A-EntityListPagination.context.js.map