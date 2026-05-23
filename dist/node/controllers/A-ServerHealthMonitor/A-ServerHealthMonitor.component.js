'use strict';

var aConcept = require('@adaas/a-concept');
var AServerRouter_component = require('@adaas/a-server/router/A-ServerRouter.component');
var ARequest_entity = require('@adaas/a-server/request/A-Request.entity');
var AResponse_entity = require('@adaas/a-server/response/A-Response.entity');
var aConfig = require('@adaas/a-utils/a-config');
var AServerLogger_component = require('@adaas/a-server/logger/A-ServerLogger.component');
var fs = require('fs');
var path = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);

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
class A_ServerHealthMonitor extends aConcept.A_Component {
  async get(config, request, response, logger) {
    const rootFolder = config.get("A_CONCEPT_ROOT_FOLDER") || aConcept.A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER || process.cwd();
    const pkgPath = path__default.default.join(rootFolder, "package.json");
    const packageJSON = JSON.parse(fs__default.default.readFileSync(pkgPath, "utf-8"));
    const exposedProperties = config.get("EXPOSED_PROPERTIES")?.split(",") || [
      "name",
      "version",
      "description"
    ];
    exposedProperties.forEach((prop) => response.add(prop, packageJSON[prop]));
  }
}
__decorateClass([
  AServerRouter_component.A_ServerRouter.Get({
    path: "/",
    prefix: "health",
    version: "v1"
  }),
  __decorateParam(0, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(1, aConcept.A_Inject(ARequest_entity.A_Request)),
  __decorateParam(2, aConcept.A_Inject(AResponse_entity.A_Response)),
  __decorateParam(3, aConcept.A_Inject(AServerLogger_component.A_ServerLogger))
], A_ServerHealthMonitor.prototype, "get");

exports.A_ServerHealthMonitor = A_ServerHealthMonitor;
//# sourceMappingURL=A-ServerHealthMonitor.component.js.map
//# sourceMappingURL=A-ServerHealthMonitor.component.js.map