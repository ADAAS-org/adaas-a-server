import '../../chunk-EQQGB2QZ.mjs';
import { A_Error } from '@adaas/a-concept';

class A_ServerError extends A_Error {
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

export { A_ServerError };
//# sourceMappingURL=A-Server.error.mjs.map
//# sourceMappingURL=A-Server.error.mjs.map