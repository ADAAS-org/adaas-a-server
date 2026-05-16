'use strict';

var AServer_error = require('@adaas/a-server/server/A-Server.error');
var AHttp_channel_error = require('./A-Http.channel.error');
var AServerRoute_entity = require('@adaas/a-server/route/A-ServerRoute.entity');
var aChannel = require('@adaas/a-utils/a-channel');
var aConcept = require('@adaas/a-concept');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
class A_HTTPChannel extends aChannel.A_Channel {
  async onBeforeRequest(context, scope) {
    const { method, url, data, config } = context.params;
    const fullUrl = this.buildURL(url, config?.params);
    const route = new AServerRoute_entity.A_ServerRoute(fullUrl, method);
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
      throw new AServer_error.A_ServerError({
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
      throw new AHttp_channel_error.A_HTTPChannelError(
        AHttp_channel_error.A_HTTPChannelError.HttpRequestError,
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
  __decorateParam(0, aConcept.A_Inject(aChannel.A_ChannelRequest)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope))
], A_HTTPChannel.prototype, "onBeforeRequest");
__decorateClass([
  __decorateParam(0, aConcept.A_Inject(aChannel.A_ChannelRequest)),
  __decorateParam(1, aConcept.A_Inject(AServerRoute_entity.A_ServerRoute))
], A_HTTPChannel.prototype, "onRequest");

exports.A_HTTPChannel = A_HTTPChannel;
//# sourceMappingURL=A-Http.channel.js.map
//# sourceMappingURL=A-Http.channel.js.map