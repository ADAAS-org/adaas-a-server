import { A_ChannelError } from '@adaas/a-utils/a-channel';

declare class A_HTTPChannelError extends A_ChannelError {
    static readonly HttpRequestError = "HTTP Channel Request Error";
}

export { A_HTTPChannelError };
