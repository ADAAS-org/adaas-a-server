'use strict';

var aConcept = require('@adaas/a-concept');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var AServer_error = require('../../lib/A-Server/A-Server.error');
var aLogger = require('@adaas/a-utils/a-logger');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
class A_CommandController extends aConcept.A_Component {
  async handleCommand(req, res, scope, container, logger) {
    const commandName = req.params.command;
    const CommandConstructor = scope.resolveConstructor(commandName);
    if (!CommandConstructor) {
      res.status(404);
      throw new AServer_error.A_ServerError({
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
  AServerRouter_component.A_ServerRouter.Post({
    path: "/:command",
    version: "v1",
    prefix: "a-command"
  }),
  __decorateParam(0, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(1, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(3, aConcept.A_Inject(aConcept.A_Container)),
  __decorateParam(4, aConcept.A_Inject(aLogger.A_Logger))
], A_CommandController.prototype, "handleCommand");

exports.A_CommandController = A_CommandController;
//# sourceMappingURL=A-CommandController.component.js.map
//# sourceMappingURL=A-CommandController.component.js.map