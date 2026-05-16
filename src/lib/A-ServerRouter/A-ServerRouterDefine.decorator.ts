import { A_Component, A_Context, A_Feature_Define, A_Feature_Extend, A_TYPES__MetaLinkedComponentConstructors } from "@adaas/a-concept";
import { A_ServerRouterMeta } from "./A-ServerRouter.meta";
import { A_ServerRoute } from "../A-ServerRoute/A-ServerRoute.entity";
import { A_ServerRouter } from "./A-ServerRouter.component";

/**
 * 
 * This decorator should allow to set a default meta type for the class, this helps to avoid
 * the need to create custom meta classes for each class.
 * 
 * @returns 
 */
export function A_ServerRouterDefineDecorator(route: A_ServerRoute) {
    return function <TTarget extends A_TYPES__MetaLinkedComponentConstructors>(
        target: A_Component,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {

        const meta: A_ServerRouterMeta = A_Context.meta<A_ServerRouterMeta>(A_ServerRouter);

        const searchKey = route.toAFeatureExtension(['A_ServerRouter', 'A_Service']);

        meta.addRoute(searchKey, {
            component: target,
            handler: propertyKey,
            route
        });

        A_Feature_Define({
            name: searchKey.source,
            invoke: false
        })(target, propertyKey, descriptor)

        return A_Feature_Extend(searchKey)(target, propertyKey, descriptor);
    }
}