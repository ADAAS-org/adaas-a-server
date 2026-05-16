import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Scope, A_Component, A_Container, A_Context } from '@adaas/a-concept';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';

class A_ServerController extends A_Component {
  async callEntityMethod(request, response, scope) {
    if (!scope.has(request.params.component))
      return;
    if (!request.params.operation || typeof request.params.operation !== "string")
      return;
    const possibleComponent = scope.resolve(request.params.component);
    if (!possibleComponent || ![A_Component, A_Container].some((c) => possibleComponent instanceof c))
      return;
    const component = possibleComponent;
    const meta = A_Context.meta(component);
    const targetFeature = meta.features().find((f) => f.name === `${component.constructor.name}.${request.params.operation}`);
    if (!targetFeature)
      return;
    await component.call(request.params.operation, scope);
  }
}
__decorateClass([
  A_ServerRouter.Post({
    path: "/:component/:operation",
    version: "v1",
    prefix: "a-component"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope))
], A_ServerController.prototype, "callEntityMethod", 1);

export { A_ServerController };
//# sourceMappingURL=A-ServerController.component.mjs.map
//# sourceMappingURL=A-ServerController.component.mjs.map