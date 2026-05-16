import { A_Fragment, A_TYPES__Required } from '@adaas/a-concept';
import { A_SERVER_TYPES__ServerConstructor } from './A-Server.types.mjs';
import { A_ServerRoute } from '../A-ServerRoute/A-ServerRoute.entity.mjs';
import '@adaas/a-utils/a-route';
import '../A-ServerRoute/A-ServerRoute.types.mjs';
import '../A-ServerRoute/A-ServerRoute.constants.mjs';

declare class A_Server extends A_Fragment {
    port: number;
    version: string;
    protected _routes: A_ServerRoute[];
    constructor(params: A_TYPES__Required<Partial<A_SERVER_TYPES__ServerConstructor>, [
        'port',
        'name'
    ]>);
    /**
     * A list of routes that the server will listen to
     */
    get routes(): A_ServerRoute[];
}

export { A_Server };
