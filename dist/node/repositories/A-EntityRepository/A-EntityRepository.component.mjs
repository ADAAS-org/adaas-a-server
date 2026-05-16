import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Caller, A_Scope, A_TYPES__EntityFeatures } from '@adaas/a-concept';
import { A_HTTPChannel } from '@adaas/a-server/channels/A-Http/A-Http.channel';
import { A_ServerEntityList } from '@adaas/a-server/entity-list/A-EntityList.entity';
import { A_CommandFeatures } from '@adaas/a-utils/a-command';
import { A_Manifest } from '@adaas/a-utils/a-manifest';

class A_EntityRepository extends A_HTTPChannel {
  async execute(command, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(command.constructor, "load").for(command.constructor))
      return;
    const response = await this.post(`/a-command/v1/${command.aseid.entity}`, command.toJSON());
    command.fromJSON(response.data);
  }
  async list(entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await this.get(`/a-list/v1/${entity.aseid.entity}`);
    entity.fromJSON(response.data);
  }
  async load(entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "load").for(entity.constructor))
      return;
    const response = await this.get(`/a-entity/v1/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
  async save(entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "save").for(entity.constructor))
      return;
    const response = await this.post(`/a-entity/v1/${entity.aseid.toString()}`, entity.toJSON());
    entity.fromJSON(response.data);
  }
  async destroy(entity, scope) {
    if (scope.has(A_Manifest) && !scope.resolve(A_Manifest).isAllowed(entity.constructor, "destroy").for(entity.constructor))
      return;
    const response = await this.delete(`/a-entity/v1/${entity.aseid.toString()}`);
    entity.fromJSON(response.data);
  }
}
__decorateClass([
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityRepository.prototype, "execute", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.LOAD,
    scope: [A_ServerEntityList]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityRepository.prototype, "list", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.LOAD,
    scope: [A_ServerEntityList]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityRepository.prototype, "load", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.SAVE,
    scope: [A_ServerEntityList]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityRepository.prototype, "save", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_TYPES__EntityFeatures.DESTROY,
    scope: [A_ServerEntityList]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Scope))
], A_EntityRepository.prototype, "destroy", 1);

export { A_EntityRepository };
//# sourceMappingURL=A-EntityRepository.component.mjs.map
//# sourceMappingURL=A-EntityRepository.component.mjs.map