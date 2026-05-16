'use strict';

var aConcept = require('@adaas/a-concept');
var aOperation = require('@adaas/a-utils/a-operation');

class A_HttpServerRequestContext extends aOperation.A_OperationContext {
  get _request() {
    return super.params.request;
  }
  get _response() {
    return super.params.response;
  }
  constructor(request2, response) {
    super("http-server-request", { request: request2, response });
    this._id = aConcept.A_IdentityHelper.generateTimeId();
  }
  get id() {
    return `[${this._request.method}]${this._request.url}-${this._id}`;
  }
  get buffers() {
    if (!this._meta.has("buffers")) {
      this._meta.set("buffers", []);
    }
    return this._meta.get("buffers");
  }
  get contentType() {
    return this._request.headers["content-type"] || void 0;
  }
  get data() {
    return this._meta.get("data");
  }
  set data(value) {
    this._meta.set("data", value);
  }
  get length() {
    return this.buffers.reduce((acc, buf) => acc + buf.length, 0);
  }
  get processingTime() {
    let endTime = this._endTime;
    if (!endTime) {
      endTime = process.hrtime();
    }
    const [seconds, nanoseconds] = process.hrtime(this._startTime);
    return seconds * 1e3 + nanoseconds / 1e6;
  }
  startProcessing() {
    this._startTime = process.hrtime();
  }
  stopProcessing() {
    this._endTime = process.hrtime();
  }
}

exports.A_HttpServerRequestContext = A_HttpServerRequestContext;
//# sourceMappingURL=A-HttpServerRequest.context.js.map
//# sourceMappingURL=A-HttpServerRequest.context.js.map