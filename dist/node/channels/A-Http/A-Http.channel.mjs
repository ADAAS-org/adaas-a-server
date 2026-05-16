import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_ServerError } from '@adaas/a-server/server/A-Server.error';
import { A_HTTPChannelError } from './A-Http.channel.error';
import { A_ServerRoute } from '@adaas/a-server/route/A-ServerRoute.entity';
import { A_ChannelRequest, A_Channel } from '@adaas/a-utils/a-channel';
import { A_Inject, A_Scope } from '@adaas/a-concept';

class A_HTTPChannel extends A_Channel {
  async onBeforeRequest(context, scope) {
    const { method, url, data, config } = context.params;
    const fullUrl = this.buildURL(url, config?.params);
    const route = new A_ServerRoute(fullUrl, method);
    scope.register(route);
    context.params.config = context.params.config || {};
    context.params.config.headers = {
      "Content-Type": "application/json",
      ...config?.headers
    };
  }
  async onRequest(context, route) {
    const options = {
      method: route.method,
      headers: context.params.config?.headers || {}
    };
    if (context.params.data && route.method !== "GET") {
      options.body = JSON.stringify(context.params.data);
    }
    const response = await fetch(route.url, options);
    if (!response.ok) {
      throw new A_ServerError({
        status: response.status,
        title: response.statusText,
        description: `HTTP request to ${route.url} failed with status ${response.status}`
      });
    }
    switch (context.params.config?.params?.responseType) {
      case "text":
        context.succeed({
          data: await response.text()
        });
        break;
      case "blob":
        context.succeed(await response.blob());
        break;
      default:
        context.succeed(await response.json());
        break;
    }
  }
  async post(url, body, config) {
    return this.request({
      method: "POST",
      url,
      data: body,
      config
    });
  }
  async get(url, params, config) {
    return this.request({
      method: "GET",
      url,
      config: {
        ...config,
        params
      }
    });
  }
  async put(url, body, config) {
    return this.request({
      method: "PUT",
      url,
      data: body,
      config
    });
  }
  async delete(url, params, config) {
    return this.request({
      method: "DELETE",
      url,
      data: params,
      config
    });
  }
  buildURL(path = "", params = {}) {
    if (!this.baseUrl)
      throw new A_HTTPChannelError(
        A_HTTPChannelError.HttpRequestError,
        "Base URL is not set for HTTP Channel"
      );
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }
}
__decorateClass([
  __decorateParam(0, A_Inject(A_ChannelRequest)),
  __decorateParam(1, A_Inject(A_Scope))
], A_HTTPChannel.prototype, "onBeforeRequest", 1);
__decorateClass([
  __decorateParam(0, A_Inject(A_ChannelRequest)),
  __decorateParam(1, A_Inject(A_ServerRoute))
], A_HTTPChannel.prototype, "onRequest", 1);

export { A_HTTPChannel };
//# sourceMappingURL=A-Http.channel.mjs.map
//# sourceMappingURL=A-Http.channel.mjs.map