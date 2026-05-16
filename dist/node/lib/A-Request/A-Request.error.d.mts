import { A_Error } from '@adaas/a-concept';

declare class A_RequestError extends A_Error {
    static readonly RequestBodyParsingError = "Unable to parse request body";
    static readonly FileUploadError = "File upload error";
    static readonly RequestTimeoutError = "Request timed out";
    static readonly InvalidRequestError = "Invalid request";
    static readonly MissingParametersError = "Missing required parameters";
}

export { A_RequestError };
