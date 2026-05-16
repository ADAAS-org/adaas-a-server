'use strict';

var aConcept = require('@adaas/a-concept');
var AHttp_channel = require('@adaas/a-server/channels/A-Http/A-Http.channel');
var AEntityList_entity = require('@adaas/a-server/entity-list/A-EntityList.entity');
var aCommand = require('@adaas/a-utils/a-command');
var aManifest = require('@adaas/a-utils/a-manifest');

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
class A_EntityRepository extends AHttp_channel.A_HTTPChannel {
  async execute(command, scope) {
    if (scope.has(aManifest.A_Manifest) && !scope.resolve(aManifest.A_Manifest).isAllowed(command.constructor, "load").for(command.constructor))
      return;
    const response = await this.post(`/a-command/v1/${command.aseid.entity}`, command.toJSON());
    command.fromJSON(response.data);
  }
  async list(entity, scope) {
    if (scope.has(aManifest.A_Manifest) && !scope.resolve(aManifest.A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await this.get(`/a-list/v1/${entity.aseid.entity}`);
    entity.fromJSON(response.data);
  }
  async load(entity, scope) {
    if (scope.has(aManifest.A_Manifest) && !scope.resolve(aManifest.A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await this.get(`/a-entity/v1/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
  async save(entity, scope) {
    if (scope.has(aManifest.A_Manifest) && !scope.resolve(aManifest.A_Manifest).isAllowed(entity.constructor, "save").for(entity.constructor))
      return;
    const response = await this.post(`/a-entity/v1/${entity.aseid.toString()}`, entity.toJSON());
    entity.fromJSON(response.data);
  }
  async destroy(entity, scope) {
    if (scope.has(aManifest.A_Manifest) && !scope.resolve(aManifest.A_Manifest).isAllowed(entity.constructor, "destroy").for(entity.constructor))
      return;
    const response = await this.delete(`/a-entity/v1/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
}
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityRepository.prototype, "execute");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aConcept.A_TYPES__EntityFeatures.LOAD,
    scope: [AEntityList_entity.A_ServerEntityList]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityRepository.prototype, "list");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aConcept.A_TYPES__EntityFeatures.LOAD,
    scope: [AEntityList_entity.A_ServerEntityList]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityRepository.prototype, "load");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aConcept.A_TYPES__EntityFeatures.SAVE,
    scope: [AEntityList_entity.A_ServerEntityList]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityRepository.prototype, "save");
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aConcept.A_TYPES__EntityFeatures.DESTROY,
    scope: [AEntityList_entity.A_ServerEntityList]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_EntityRepository.prototype, "destroy");

exports.A_EntityRepository = A_EntityRepository;
//# sourceMappingURL=A-EntityRepository.component.js.map
//# sourceMappingURL=A-EntityRepository.component.js.map