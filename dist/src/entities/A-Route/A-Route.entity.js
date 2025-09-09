"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Route = void 0;
class A_Route {
    constructor(param1, param2) {
        this.path = param1 instanceof RegExp ? param1.source : param1;
        this.method = param2 || 'GET';
    }
    get params() {
        var _a;
        return ((_a = this.path
            .match(/:([^\/]+)/g)) === null || _a === void 0 ? void 0 : _a.map((param) => param.slice(1)))
            || [];
    }
    extractParams(url) {
        // Remove query string (anything after ?)
        const cleanUrl = url.split('?')[0];
        const urlSegments = cleanUrl.split('/').filter(Boolean);
        const maskSegments = this.path.split('/').filter(Boolean);
        const params = {};
        for (let i = 0; i < maskSegments.length; i++) {
            const maskSegment = maskSegments[i];
            const urlSegment = urlSegments[i];
            if (maskSegment.startsWith(':')) {
                const paramName = maskSegment.slice(1); // Remove ':' from mask
                params[paramName] = urlSegment;
            }
            else if (maskSegment !== urlSegment) {
                // If static segments don’t match → fail
                return {};
            }
        }
        return params;
    }
    toString() {
        // path can be like /api/v1/users/:id
        // and because of that :id we need to replace it with regex that matches chars and numbers only   
        return `${this.method}::${this.path}`;
        // .replace(/\/:([^\/]+)/g, '\\/([^\/]+)')
    }
    toRegExp() {
        return new RegExp(`^${this.method}::${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }
    toAFeatureExtension(extensionScope = []) {
        return new RegExp(`^${extensionScope.length
            ? `(${extensionScope.join('|')})`
            : '.*'}\\.${this.method}::${this.path.replace(/\/:([^\/]+)/g, '/([^/]+)')}$`);
    }
}
exports.A_Route = A_Route;
//# sourceMappingURL=A-Route.entity.js.map