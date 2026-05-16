import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Component } from '@adaas/a-concept';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_ServerLogger } from '@adaas/a-server/logger/A-ServerLogger.component';

class A_ServerHealthMonitor extends A_Component {
  async get(config, request, response, logger) {
    const packageJSON = await import(`${config.get("A_CONCEPT_ROOT_FOLDER")}/package.json`);
    const exposedProperties = config.get("EXPOSED_PROPERTIES")?.split(",") || [
      "name",
      "version",
      "description"
    ];
    exposedProperties.forEach((prop) => response.add(prop, packageJSON.default[prop]));
  }
}
__decorateClass([
  A_ServerRouter.Get({
    path: "/",
    prefix: "health",
    version: "v1"
  }),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Request)),
  __decorateParam(2, A_Inject(A_Response)),
  __decorateParam(3, A_Inject(A_ServerLogger))
], A_ServerHealthMonitor.prototype, "get", 1);

export { A_ServerHealthMonitor };
//# sourceMappingURL=A-ServerHealthMonitor.component.mjs.map
//# sourceMappingURL=A-ServerHealthMonitor.component.mjs.map