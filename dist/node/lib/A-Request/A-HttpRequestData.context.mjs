import '../../chunk-EQQGB2QZ.mjs';
import { A_ExecutionContext } from '@adaas/a-utils/a-execution';

class A_HttpRequestData extends A_ExecutionContext {
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

export { A_HttpRequestData };
//# sourceMappingURL=A-HttpRequestData.context.mjs.map
//# sourceMappingURL=A-HttpRequestData.context.mjs.map