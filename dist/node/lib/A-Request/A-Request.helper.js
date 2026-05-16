'use strict';

var ARequest_error = require('./A-Request.error');

class A_RequestHelper {
  /**
   * Extract URL parameters from a URL using a route pattern
   * @param url - The actual URL to extract parameters from
   * @param routePattern - The route pattern with parameters (e.g., "/users/:id/posts/:postId")
   * @returns Object containing extracted parameters
   */
  static extractParams(url, routePattern) {
    const cleanUrl = url.split("?")[0];
    const cleanPattern = routePattern.split("?")[0];
    const urlSegments = cleanUrl.split("/").filter(Boolean);
    const patternSegments = cleanPattern.split("/").filter(Boolean);
    const params = {};
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const urlSegment = urlSegments[i];
      if (patternSegment.startsWith(":")) {
        const paramName = patternSegment.slice(1);
        if (urlSegment) {
          params[paramName] = decodeURIComponent(urlSegment);
        }
      } else if (patternSegment !== urlSegment) {
        return {};
      }
    }
    return params;
  }
  /**
   * Extract query parameters from URL
   * @param url - The URL to extract query parameters from
   * @returns Object containing query parameters
   */
  static extractQuery(url) {
    const query = {};
    const queryString = url.split("?")[1];
    if (!queryString) return query;
    const cleanQuery = queryString.split("#")[0];
    for (const pair of cleanQuery.split("&")) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return query;
  }
  /**
   * Parse cookies from Cookie header
   */
  static parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      const value = rest.join("=");
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }
  /**
   * Parse request body based on Content-Type
   * 
   * 
   * @param context - The HTTP server request context
   * @returns Parsed body data and detected body type
   */
  static parseRequestBody(context) {
    let parsedBody;
    let bodyType;
    switch (true) {
      case (!!context.contentType && context.contentType.includes("application/json")):
        parsedBody = JSON.parse(context.data);
        bodyType = "json";
        break;
      case (!!context.contentType && context.contentType.includes("application/x-www-form-urlencoded")):
        parsedBody = A_RequestHelper.parseFormUrlEncoded(context.data);
        bodyType = "form";
        break;
      case (!!context.contentType && context.contentType.includes("multipart/form-data")):
        const multipartResult = A_RequestHelper.parseMultipartData(Buffer.concat(context.buffers), context.contentType);
        parsedBody = {
          ...multipartResult.fields,
          _files: multipartResult.files
        };
        bodyType = "multipart";
        break;
      case (!!context.contentType && context.contentType.includes("text/")):
        parsedBody = context.data;
        bodyType = "text";
        break;
      default:
        parsedBody = Buffer.concat(context.buffers);
        bodyType = "raw";
        break;
    }
    return {
      data: parsedBody,
      type: bodyType
    };
  }
  /**
   * Parse URL-encoded form data (application/x-www-form-urlencoded)
   * @param body - The URL-encoded body string
   * @returns Object containing form data
   */
  static parseFormUrlEncoded(body) {
    const result = {};
    if (!body) return result;
    const pairs = body.split("&");
    for (const pair of pairs) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      const decodedKey = decodeURIComponent(key.replace(/\+/g, " "));
      const decodedValue = decodeURIComponent(value.replace(/\+/g, " "));
      if (decodedKey in result) {
        const existing = result[decodedKey];
        if (Array.isArray(existing)) {
          existing.push(decodedValue);
        } else {
          result[decodedKey] = [existing, decodedValue];
        }
      } else {
        result[decodedKey] = decodedValue;
      }
    }
    return result;
  }
  /**
   * Parse multipart form data (for file uploads and form data)
   * @param buffer - The raw buffer containing multipart data
   * @param contentType - The content type header
   * @returns Object containing fields and files
   */
  static parseMultipartData(buffer, contentType) {
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      throw new ARequest_error.A_RequestError(
        ARequest_error.A_RequestError.RequestBodyParsingError,
        "Missing boundary in multipart/form-data content type"
      );
    }
    const boundary = "--" + boundaryMatch[1];
    const textData = buffer.toString();
    const parts = textData.split(boundary).filter((part) => part.trim() && !part.includes("--"));
    const fields = {};
    const files = [];
    parts.forEach((part) => {
      const [headers, content] = part.split("\r\n\r\n");
      if (!headers || content === void 0) return;
      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
      if (nameMatch) {
        const fieldName = nameMatch[1];
        const cleanContent = content.replace(/\r\n$/, "");
        if (filenameMatch) {
          const file = {
            fieldName,
            filename: filenameMatch[1],
            encoding: "binary",
            mimetype: contentTypeMatch?.[1] || "application/octet-stream",
            size: Buffer.byteLength(cleanContent),
            buffer: Buffer.from(cleanContent, "binary")
          };
          files.push(file);
        } else {
          fields[fieldName] = cleanContent;
        }
      }
    });
    return { fields, files };
  }
}

exports.A_RequestHelper = A_RequestHelper;
//# sourceMappingURL=A-Request.helper.js.map
//# sourceMappingURL=A-Request.helper.js.map