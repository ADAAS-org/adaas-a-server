import { A_Channel } from '@adaas/a-utils/a-channel';

declare class A_WebsocketsChannel extends A_Channel {
    request(params: any): Promise<any>;
}

export { A_WebsocketsChannel };
