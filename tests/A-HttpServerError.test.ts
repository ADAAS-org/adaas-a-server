import { A_HttpServerError } from '../src/lib/A-Server/A-HttpServer.error';

describe('A_HttpServerError', () => {
    describe('Constructor Pattern 1: Status Code + Description', () => {
        it('should automatically set title based on status code', () => {
            // Test 404 error
            const error404 = new A_HttpServerError(404, 'The requested resource was not found');
            
            expect(error404.status).toBe(404);
            expect(error404.title).toBe('Not Found');
            expect(error404.description).toBe('The requested resource was not found');
            expect(error404.message).toContain('Not Found');
            expect(error404.message).toContain('The requested resource was not found');
        });

        it('should handle various HTTP status codes correctly', () => {
            // Test 500 error
            const error500 = new A_HttpServerError(500, 'Database connection failed');
            expect(error500.status).toBe(500);
            expect(error500.title).toBe('Internal Server Error');
            expect(error500.description).toBe('Database connection failed');

            // Test 401 error
            const error401 = new A_HttpServerError(401, 'Invalid credentials provided');
            expect(error401.status).toBe(401);
            expect(error401.title).toBe('Unauthorized');
            expect(error401.description).toBe('Invalid credentials provided');

            // Test 429 error
            const error429 = new A_HttpServerError(429, 'Rate limit exceeded');
            expect(error429.status).toBe(429);
            expect(error429.title).toBe('Too Many Requests');
            expect(error429.description).toBe('Rate limit exceeded');
        });

        it('should handle unknown status codes', () => {
            const unknownError = new A_HttpServerError(999, 'Custom error');
            expect(unknownError.status).toBe(999);
            expect(unknownError.title).toBe('Unknown Error');
            expect(unknownError.description).toBe('Custom error');
        });
    });

    describe('Constructor Pattern 2: Configuration Object', () => {
        it('should automatically set title when status is provided without title', () => {
            const error = new A_HttpServerError({
                status: 500,
                description: 'An unexpected error occurred'
            });

            expect(error.status).toBe(500);
            expect(error.title).toBe('Internal Server Error');
            expect(error.description).toBe('An unexpected error occurred');
        });

        it('should respect explicit title when provided', () => {
            const error = new A_HttpServerError({
                title: 'Custom Error Title',
                status: 400,
                description: 'Custom error description'
            });

            expect(error.status).toBe(400);
            expect(error.title).toBe('Custom Error Title');
            expect(error.description).toBe('Custom error description');
        });

        it('should handle original error object', () => {
            const originalError = new Error('Original error message');
            const error = new A_HttpServerError({
                status: 500,
                description: 'Wrapper error description',
                originalError
            });

            expect(error.status).toBe(500);
            expect(error.title).toBe('Internal Server Error');
            expect(error.description).toBe('Wrapper error description');
            expect(error.originalError).toBe(originalError);
        });

        it('should default to status 500 when not provided', () => {
            const error = new A_HttpServerError({
                title: 'Custom Error',
                description: 'Something went wrong'
            });

            expect(error.status).toBe(500);
            expect(error.title).toBe('Custom Error');
            expect(error.description).toBe('Something went wrong');
        });

        it('should handle all optional fields', () => {
            const originalError = new Error('Database error');
            const error = new A_HttpServerError({
                status: 503,
                description: 'Service temporarily unavailable',
                code: 'SERVICE_UNAVAILABLE',
                link: 'https://docs.example.com/errors/503',
                originalError
            });

            expect(error.status).toBe(503);
            expect(error.title).toBe('Service Unavailable');
            expect(error.description).toBe('Service temporarily unavailable');
            expect(error.code).toBe('SERVICE_UNAVAILABLE');
            expect(error.link).toBe('https://docs.example.com/errors/503');
            expect(error.originalError).toBe(originalError);
        });
    });

    describe('Constructor Pattern 3: Error Object', () => {
        it('should wrap Error objects with default status 500', () => {
            const originalError = new Error('Database connection timeout');
            const httpError = new A_HttpServerError(originalError);

            expect(httpError.status).toBe(500);
            expect(httpError.originalError).toBe(originalError);
            expect(httpError.message).toBe(originalError.message);
        });

        it('should handle custom Error subclasses', () => {
            class CustomError extends Error {
                code = 'CUSTOM_CODE';
                constructor(message: string) {
                    super(message);
                    this.name = 'CustomError';
                }
            }

            const customError = new CustomError('Custom error occurred');
            const httpError = new A_HttpServerError(customError);

            expect(httpError.status).toBe(500);
            expect(httpError.originalError).toBe(customError);
            expect(httpError.message).toBe('Custom error occurred');
        });
    });

    describe('Serialization', () => {
        it('should serialize to JSON correctly', () => {
            const error = new A_HttpServerError(404, 'Resource not found');
            const serialized = error.toJSON();

            expect(serialized.status).toBe(404);
            expect(serialized.title).toBe('Not Found');
            expect(serialized.description).toBe('Resource not found');
            expect(typeof serialized.aseid).toBe('string');
            expect(typeof serialized.code).toBe('string');
        });

        it('should include original error in serialization', () => {
            const originalError = new Error('Original error');
            const error = new A_HttpServerError({
                status: 500,
                description: 'Server error',
                originalError
            });
            const serialized = error.toJSON();

            expect(serialized.status).toBe(500);
            expect(serialized.originalError).toBe('Original error');
        });
    });

    describe('Error Inheritance', () => {
        it('should be instance of Error', () => {
            const error = new A_HttpServerError(500, 'Server error');
            expect(error).toBeInstanceOf(Error);
        });

        it('should have proper error stack', () => {
            const error = new A_HttpServerError(404, 'Not found');
            expect(error.stack).toBeDefined();
            expect(typeof error.stack).toBe('string');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty description', () => {
            const error = new A_HttpServerError(404, '');
            expect(error.status).toBe(404);
            expect(error.title).toBe('Not Found');
            // A_Error sets a default description if empty string is provided
            expect(error.description).toBeDefined();
        });

        it('should throw error for invalid constructor parameters', () => {
            expect(() => {
                // @ts-ignore - Testing invalid usage
                new A_HttpServerError('invalid');
            }).toThrow('Invalid parameters provided to A_HttpServerError constructor');
        });
    });

    describe('Static Constants', () => {
        it('should provide static error constants', () => {
            expect(A_HttpServerError.NotFoundErrorStatus).toBe(404);
            expect(A_HttpServerError.NotFoundError).toBe('Resource Not Found');
            expect(A_HttpServerError.InternalServerErrorStatus).toBe(500);
            expect(A_HttpServerError.InternalServerError).toBe('Internal Server Error');
        });
    });
});