'use strict';

var aConcept = require('@adaas/a-concept');

const _A_HttpServerError = class _A_HttpServerError extends aConcept.A_Error {
  /**
   * Gets the appropriate title for a given HTTP status code
   */
  static getHttpStatusTitle(status) {
    return this.HTTP_STATUS_TITLES[status] || "Unknown Error";
  }
  constructor(param1, param2) {
    switch (true) {
      // Pattern: new A_HttpServerError(404, 'The requested resource was not found')
      case (typeof param1 === "number" && typeof param2 === "string"):
        super({
          title: _A_HttpServerError.getHttpStatusTitle(param1),
          description: param2
        });
        this.status = param1;
        break;
      // Pattern: new A_HttpServerError(someErrorObject)
      case param1 instanceof Error:
        super(param1);
        this.status = 500;
        break;
      // Pattern: new A_HttpServerError({ status: 500, description: '...', originalError: ... })
      case (typeof param1 === "object" && param1 !== null && !(param1 instanceof Error)):
        const params = param1;
        if ("title" in params && params.title) {
          super(params);
          this.status = params.status || 500;
        } else {
          const title = params.status ? _A_HttpServerError.getHttpStatusTitle(params.status) : "Internal Server Error";
          super({
            title,
            description: params.description,
            code: params.code,
            scope: params.scope,
            link: params.link,
            originalError: params.originalError
          });
          this.status = params.status || 500;
        }
        break;
      default:
        throw new Error("Invalid parameters provided to A_HttpServerError constructor");
    }
  }
  fromConstructor(params) {
    super.fromConstructor(params);
    if (params.status) {
      this.status = params.status;
    }
  }
  toJSON() {
    return {
      ...super.toJSON(),
      status: this.status
    };
  }
};
_A_HttpServerError.NotFoundErrorStatus = 404;
_A_HttpServerError.NotFoundError = "Resource Not Found";
_A_HttpServerError.InternalServerErrorStatus = 500;
_A_HttpServerError.InternalServerError = "Internal Server Error";
/**
 * HTTP status code to title mapping
 */
_A_HttpServerError.HTTP_STATUS_TITLES = {
  // 4xx Client Errors
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  // 5xx Server Errors
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};
let A_HttpServerError = _A_HttpServerError;

exports.A_HttpServerError = A_HttpServerError;
//# sourceMappingURL=A-HttpServer.error.js.map
//# sourceMappingURL=A-HttpServer.error.js.map