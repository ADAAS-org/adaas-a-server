'use strict';

var aExecution = require('@adaas/a-utils/a-execution');

class A_HttpRequestData extends aExecution.A_ExecutionContext {
  constructor(data) {
    super(
      "a-http-request-data"
    );
    this._meta.set("data", data);
  }
  get length() {
    return this.data?.length || 0;
  }
  get data() {
    return this._meta.get("data");
  }
  toString(encoding = "utf-8") {
    return this.data.toString(encoding);
  }
}

exports.A_HttpRequestData = A_HttpRequestData;
//# sourceMappingURL=A-HttpRequestData.context.js.map
//# sourceMappingURL=A-HttpRequestData.context.js.map