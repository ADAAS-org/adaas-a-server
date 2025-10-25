import { A_SERVER_TYPES__ProxyConfigConstructorConfig } from "./A_ProxyConfig.types";

export const PROXY_CONFIG_DEFAULTS: A_SERVER_TYPES__ProxyConfigConstructorConfig = {
    path: '/',
    hostname: 'localhost',
    port: 80,
    method: 'GET',
    headers: {},
    protocol: 'http'
};
