'use strict';

var aConcept = require('@adaas/a-concept');

class A_RequestError extends aConcept.A_Error {
}
A_RequestError.RequestBodyParsingError = "Unable to parse request body";
A_RequestError.FileUploadError = "File upload error";
A_RequestError.RequestTimeoutError = "Request timed out";
A_RequestError.InvalidRequestError = "Invalid request";
A_RequestError.MissingParametersError = "Missing required parameters";

exports.A_RequestError = A_RequestError;
//# sourceMappingURL=A-Request.error.js.map
//# sourceMappingURL=A-Request.error.js.map