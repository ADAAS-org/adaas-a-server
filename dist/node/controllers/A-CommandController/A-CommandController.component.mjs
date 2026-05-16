import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Scope, A_Container, A_Component } from '@adaas/a-concept';
import { A_ServerRouter } from '@adaas/a-server/router/A-ServerRouter.component';
import { A_Request } from '@adaas/a-server/request/A-Request.entity';
import { A_Response } from '@adaas/a-server/response/A-Response.entity';
import { A_ServerError } from '../../lib/A-Server/A-Server.error';
import { A_Logger } from '@adaas/a-utils/a-logger';

class A_CommandController extends A_Component {
  async handleCommand(req, res, scope, container, logger) {
    const commandName = req.params.command;
    const CommandConstructor = scope.resolveConstructor(commandName);
    if (!CommandConstructor) {
      res.status(404);
      throw new A_ServerError({
        title: "Command Not Found",
        description: `Command constructor for ${commandName} not found`,
        status: 404
      });
    }
    const command = new CommandConstructor(req.body);
    scope.register(command);
    await command.execute();
    const serialized = command.toJSON();
    return res.status(200).send(serialized);
  }
}
__decorateClass([
  A_ServerRouter.Post({
    path: "/:command",
    version: "v1",
    prefix: "a-command"
  }),
  __decorateParam(0, A_Inject(A_Request)),
  __decorateParam(1, A_Inject(A_Response)),
  __decorateParam(2, A_Inject(A_Scope)),
  __decorateParam(3, A_Inject(A_Container)),
  __decorateParam(4, A_Inject(A_Logger))
], A_CommandController.prototype, "handleCommand", 1);

export { A_CommandController };
//# sourceMappingURL=A-CommandController.component.mjs.map
//# sourceMappingURL=A-CommandController.component.mjs.map