'use strict';

var aConcept = require('@adaas/a-concept');

class A_ServerError extends aConcept.A_Error {
  constructor() {
    super(...arguments);
    this.status = 500;
  }
  fromConstructor(params) {
    super.fromConstructor(params);
    if (params.status) {
      this.status = params.status;
    }
  }
  toJSON() {
    return {
      ...super.toJSON(),
      status: this.status
    };
  }
}

exports.A_ServerError = A_ServerError;
//# sourceMappingURL=A-Server.error.js.map
//# sourceMappingURL=A-Server.error.js.map