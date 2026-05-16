import { A_ChannelFeatures } from '@adaas/a-utils/a-channel';

export const A_SERVER_CONSTANTS__A_HttpChannel_Lifecycle = {
    onAfterRequest: A_ChannelFeatures.onAfterRequest,
    onError: A_ChannelFeatures.onError,
    onBeforeRequest: A_ChannelFeatures.onBeforeRequest,
} as const;
