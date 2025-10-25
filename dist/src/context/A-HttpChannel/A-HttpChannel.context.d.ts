import { A_Fragment } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerMethod } from "../../containers/A-Service/A-Service.container.types";
import { A_SERVER_TYPES__HttpChannelRequestParams } from "../../channels/A-Http/A-Http.channel.types";
export declare class A_HTTPChannel_RequestContext<T extends any = any> extends A_Fragment {
    url: string;
    method: A_SERVER_TYPES__ServerMethod;
    data?: any;
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestParams['config']>;
    constructor(params: A_SERVER_TYPES__HttpChannelRequestParams);
    result?: T;
    error?: any;
}
