import { A_Fragment } from "@adaas/a-concept";
import { A_SERVER_TYPES__ServerMethod } from "@adaas/a-server/containers/A-Service/A-Service.container.types";
import { A_SERVER_TYPES__HttpChannelRequestParams } from "@adaas/a-server/channels/A-Http/A-Http.channel.types";





export class A_HTTPChannel_RequestContext<
    T extends any = any
> extends A_Fragment {
    url: string;
    method: A_SERVER_TYPES__ServerMethod;
    data?: any;
    config?: Partial<A_SERVER_TYPES__HttpChannelRequestParams['config']>;

    constructor(params: A_SERVER_TYPES__HttpChannelRequestParams) {
        super();

        const {
            method,
            url,
            data,
            config,
        } = params;

        this.url = url;
        this.method = method;
        this.data = data;
        this.config = config;
    }

    result?: T;
    error?: any;

}
