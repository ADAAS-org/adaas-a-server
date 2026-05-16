import { A_TYPES__MetaLinkedComponentConstructors, A_Component } from '@adaas/a-concept';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

/**
 *
 * This decorator should allow to set a default meta type for the class, this helps to avoid
 * the need to create custom meta classes for each class.
 *
 * @returns
 */
declare function A_ServerRouterDefineDecorator(route: A_ServerRoute): <TTarget extends A_TYPES__MetaLinkedComponentConstructors>(target: A_Component, propertyKey: string, descriptor: PropertyDescriptor) => any;

export { A_ServerRouterDefineDecorator };
