# A_Response - Comprehensive HTTP Response Processing

## Overview

The `A_Response` class is a comprehensive wrapper around Node.js `ServerResponse` that provides advanced HTTP response processing capabilities. It extends the base `A_Entity` class and offers features like response data accumulation, error collection, response streaming, template rendering, cookie management, response compression, and performance tracking.

## Key Features

- 🚀 **High Performance**: Efficient response processing with performance metrics
- 📊 **Data Accumulation**: Collect and organize response data from multiple sources
- 🛠️ **Error Collection**: Comprehensive error tracking and standardized error responses
- 🌊 **Response Streaming**: Stream large responses with progress tracking
- 🍪 **Cookie Management**: Secure cookie setting with advanced options
- 📦 **Response Compression**: Automatic gzip compression for large responses
- 📁 **File Downloads**: Streamlined file serving and download responses
- 🎯 **Response Validation**: Validate response data and headers
- ⏱️ **Performance Tracking**: Response timing, byte tracking, and performance insights
- 🛡️ **Security Headers**: Built-in security headers and CORS support
- 🔧 **Type Safety**: Full TypeScript support with generic types

## Installation

```bash
npm install @adaas/a-server
```

## Basic Usage

### Simple Response Handling

```typescript
import { A_Response } from '@adaas/a-server';
import { ServerResponse } from 'http';

// Create response instance
const response = new A_Response({
    id: 'res-123',
    response: serverResponse, // Node.js ServerResponse
    scope: 'api'
});

// Initialize response processing
await response.init();

// Add response data
response.add('message', 'Hello World');
response.add('timestamp', new Date());

// Send JSON response
response.status(200).json();
```

### Typed Response Processing

```typescript
interface UserResponse {
    id: string;
    name: string;
    email: string;
}

const response = new A_Response<UserResponse>({
    id: 'res-456',
    response: serverResponse,
    scope: 'users'
});

await response.init();

// Add typed data
response.add('user', {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
});

response.add('metadata', {
    requestId: 'req-456',
    timestamp: new Date()
});

// Send response
response.status(200).json();
```

## Advanced Features

### Response Configuration

```typescript
const options = {
    autoCompress: true,
    compressionThreshold: 1024, // 1KB
    enableCaching: true,
    defaultCacheMaxAge: 3600, // 1 hour
    enableMetrics: true,
    enableEtag: true,
    enableLastModified: true,
    charset: 'utf-8',
    defaultContentType: 'application/json',
    enableCookies: true,
    enableSessions: true
};

const response = new A_Response({
    id: 'res-789',
    response: serverResponse,
    scope: 'api'
}, options);
```

### Data Management

```typescript
await response.init();

// Add data
response.add('users', userList);
response.add('pagination', paginationInfo);
response.add('filters', activeFilters);

// Get data
const users = response.get('users');

// Check if data exists
if (response.has('pagination')) {
    const pagination = response.get('pagination');
}

// Remove data
response.remove('filters');

// Clear all data
response.clear();

// Convert to response object
const responseData = response.toResponse();
```

### Error Handling and Collection

```typescript
// Handle errors
try {
    // Process request...
} catch (error) {
    response.failed(error);
    return; // Response automatically sent with error details
}

// Add individual errors
response.addError({
    code: 'VALIDATION_ERROR',
    message: 'Invalid email format',
    statusCode: 400,
    timestamp: new Date()
});

// Add warnings
response.addWarning('User email not verified');

// Check error status
if (response.hasErrors) {
    console.log('Response has errors:', response.errors);
}

// Clear errors
response.clearErrors();
```

### Cookie Management

```typescript
await response.init();

// Set cookies
response.setCookie('sessionId', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 3600,
    sameSite: 'strict'
});

response.setCookie('preferences', JSON.stringify({ theme: 'dark' }), {
    path: '/',
    maxAge: 86400 // 24 hours
});

// Clear cookies
response.clearCookie('oldCookie', {
    path: '/',
    domain: '.example.com'
});

// Send response with cookies
response.status(200).json({ message: 'Cookies set' });
```

### Response Streaming

```typescript
// Stream array data
const largeDataArray = [/* thousands of items */];

await response.stream(largeDataArray, {
    chunkSize: 100,
    delay: 10, // 10ms between chunks
    transform: (item) => JSON.stringify(item) + '\n',
    onProgress: (bytesWritten, totalBytes) => {
        console.log(`Progress: ${bytesWritten}/${totalBytes} bytes`);
    },
    onComplete: () => {
        console.log('Streaming complete');
    },
    onError: (error) => {
        console.error('Streaming error:', error);
    }
});
```

```typescript
// Stream from readable stream
const fs = require('fs');
const fileStream = fs.createReadStream('/path/to/large-file.json');

await response.stream(fileStream, {
    onProgress: (bytesWritten) => {
        console.log(`Streamed ${bytesWritten} bytes`);
    }
});
```

### Response Compression

```typescript
// Automatic compression for large responses
response.add('largeData', massiveDataSet);
response.json(); // Automatically compressed if > threshold

// Manual compression
response.compressed({
    data: largeDataSet,
    message: 'Large dataset response'
}, {
    level: 6, // Compression level 1-9
    strategy: zlib.constants.Z_DEFAULT_STRATEGY
});
```

### File Downloads

```typescript
// Serve file download
response.download('/path/to/file.pdf', {
    filename: 'document.pdf',
    contentType: 'application/pdf',
    disposition: 'attachment',
    etag: true,
    lastModified: true,
    maxAge: 3600
});

// Inline file display
response.download('/path/to/image.jpg', {
    filename: 'photo.jpg',
    contentType: 'image/jpeg',
    disposition: 'inline'
});
```

### Response Caching

```typescript
// Set cache headers
response.cache({
    maxAge: 3600,        // 1 hour
    public: true,
    etag: true,
    lastModified: new Date()
});

// No cache
response.noCache();

// Custom cache control
response.cache({
    private: true,
    mustRevalidate: true,
    sMaxAge: 1800  // 30 minutes for proxies
});
```

### Response Validation

```typescript
// Validate response before sending
const validation = response.validate({
    requiredFields: ['data', 'message'],
    maxSize: 1024 * 1024, // 1MB
    allowedStatusCodes: [200, 201, 202]
});

if (!validation.isValid) {
    console.log('Response validation errors:', validation.errors);
    console.log('Warnings:', validation.warnings);
}
```

### Redirects

```typescript
// Temporary redirect (302)
response.redirect('/new-location');

// Permanent redirect (301)
response.redirect('/new-location', true);

// With custom status
response.status(303).redirect('/see-other');
```

### Custom Headers

```typescript
// Set headers
response
    .setHeader('X-API-Version', '2.0')
    .setHeader('X-Rate-Limit', '1000')
    .setHeader('Access-Control-Allow-Origin', 'https://example.com');

// Get headers
const apiVersion = response.getHeader('X-API-Version');

// Remove headers
response.removeHeader('X-Debug-Info');
```

### Performance Monitoring

```typescript
await response.init();

// Response metrics
console.log('Response duration:', response.duration);
console.log('Bytes written:', response.size);
console.log('Is finished:', response.isFinished);

// Detailed metrics
const metrics = response.metrics;
console.log('Start time:', metrics.startTime);
console.log('End time:', metrics.endTime);
console.log('Headers sent at:', metrics.headersSentAt);
console.log('First byte at:', metrics.firstByteAt);
console.log('Compression ratio:', metrics.compressionRatio);
```

## Response Types

### JSON Response

```typescript
// Simple JSON
response.json({ message: 'Success', data: [] });

// With status
response.status(201).json({ created: true });

// From accumulated data
response.add('users', userList);
response.add('count', userList.length);
response.json(); // Sends all accumulated data
```

### Text Response

```typescript
// Plain text
response.send('Hello World');

// With custom content type
response
    .setHeader('Content-Type', 'text/plain; charset=utf-8')
    .send('Plain text response');
```

### HTML Response

```typescript
// HTML response
response
    .setHeader('Content-Type', 'text/html')
    .send('<h1>Hello World</h1>');
```

### Binary Response

```typescript
// Binary data
const buffer = Buffer.from('binary data');
response
    .setHeader('Content-Type', 'application/octet-stream')
    .send(buffer);
```

## Error Response Patterns

### Standard Error Response

```typescript
// Automatic error formatting
response.failed(new Error('Something went wrong'));
// Sends: { error: { code: 'UNKNOWN_ERROR', message: '...', timestamp: '...' }, errors: [...], warnings: [...] }
```

### Custom Error Response

```typescript
response.addError({
    code: 'VALIDATION_FAILED',
    message: 'Email is required',
    statusCode: 400,
    timestamp: new Date()
});

response.addError({
    code: 'DUPLICATE_EMAIL',
    message: 'Email already exists',
    statusCode: 409,
    timestamp: new Date()
});

response.status(400).json({
    success: false,
    errors: response.errors,
    warnings: response.warnings
});
```

### Validation Error Response

```typescript
const validationErrors = [
    { field: 'email', message: 'Invalid email format' },
    { field: 'password', message: 'Password too short' }
];

validationErrors.forEach(error => {
    response.addError({
        code: 'VALIDATION_ERROR',
        message: `${error.field}: ${error.message}`,
        statusCode: 422,
        timestamp: new Date()
    });
});

response.status(422).json({
    message: 'Validation failed',
    errors: response.errors
});
```

## Security Features

### Security Headers

```typescript
// Automatically set security headers:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// X-Request-ID: <request-id>

// Additional security headers
response
    .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    .setHeader('Content-Security-Policy', "default-src 'self'")
    .setHeader('X-Content-Type-Options', 'nosniff');
```

### CORS Support

```typescript
// Basic CORS (automatically set)
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Access-Control-Allow-Headers: Content-Type, Authorization

// Custom CORS
response
    .setHeader('Access-Control-Allow-Origin', 'https://example.com')
    .setHeader('Access-Control-Allow-Credentials', 'true')
    .setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
```

### Secure Cookies

```typescript
response.setCookie('sessionId', sessionId, {
    httpOnly: true,     // Prevent XSS
    secure: true,       // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 3600        // 1 hour
});
```

## Best Practices

### 1. Always Initialize

```typescript
// ✅ Good
const response = new A_Response(params);
await response.init();

// ❌ Bad
const response = new A_Response(params);
response.json(); // Missing initialization
```

### 2. Check Headers Before Sending

```typescript
// ✅ Good
if (!response.headersSent) {
    response.json(data);
}

// ✅ Better - built-in check
response.json(data); // Automatically checks headers
```

### 3. Handle Errors Gracefully

```typescript
// ✅ Good
try {
    await processRequest();
    response.status(200).json({ success: true });
} catch (error) {
    response.failed(error); // Automatically formats error response
}
```

### 4. Use Data Accumulation

```typescript
// ✅ Good - Accumulate data from different sources
response.add('user', userData);
response.add('permissions', userPermissions);
response.add('preferences', userPreferences);
response.json(); // Sends all accumulated data

// ❌ Bad - Manual object building
const responseData = {
    user: userData,
    permissions: userPermissions,
    preferences: userPreferences
};
response.json(responseData);
```

### 5. Set Appropriate Status Codes

```typescript
// ✅ Good
response.status(201).json({ created: true }); // Created
response.status(204).send();                   // No Content
response.status(404).json({ error: 'Not Found' });
response.status(422).json({ validationErrors });

// ❌ Bad
response.json({ created: true }); // Uses default 200
```

### 6. Use Compression for Large Responses

```typescript
// ✅ Good - Automatic compression
const options = { autoCompress: true, compressionThreshold: 1024 };
const response = new A_Response(params, options);

// ✅ Manual compression for control
if (responseSize > 10240) { // 10KB
    response.compressed(largeData);
} else {
    response.json(largeData);
}
```

### 7. Set Appropriate Cache Headers

```typescript
// ✅ Good - API responses
response.cache({ private: true, maxAge: 300 }); // 5 minutes

// ✅ Good - Static content
response.cache({ public: true, maxAge: 86400 }); // 24 hours

// ✅ Good - No cache for sensitive data
response.noCache();
```

## Performance Tips

### 1. Stream Large Responses

```typescript
// ✅ For large datasets
await response.stream(largeDataArray);

// ❌ Don't load everything into memory
response.json(massiveDataSet);
```

### 2. Use Compression

```typescript
// Enable automatic compression
const options = { autoCompress: true, compressionThreshold: 1024 };
```

### 3. Monitor Performance

```typescript
// Track response performance
console.log('Response time:', response.duration);
console.log('Compression ratio:', response.metrics.compressionRatio);
```

### 4. Efficient Data Management

```typescript
// ✅ Use response data accumulation
response.add('key', data);

// ✅ Remove unnecessary data
response.remove('temporaryData');

// ✅ Clear when done
response.clear();
```

## Common Patterns

### API Response Pattern

```typescript
class APIResponse {
    static success(response: A_Response, data: any, message?: string) {
        response.add('success', true);
        response.add('data', data);
        if (message) response.add('message', message);
        response.add('timestamp', new Date().toISOString());
        return response.status(200).json();
    }
    
    static error(response: A_Response, error: Error, statusCode = 500) {
        response.failed(error);
        // Automatically handled by failed() method
    }
    
    static paginated(response: A_Response, data: any[], pagination: any) {
        response.add('data', data);
        response.add('pagination', pagination);
        response.add('total', pagination.total);
        return response.status(200).json();
    }
}

// Usage
APIResponse.success(response, userData, 'User retrieved successfully');
APIResponse.paginated(response, users, { page: 1, limit: 10, total: 100 });
```

### File Upload Response Pattern

```typescript
class FileResponse {
    static uploaded(response: A_Response, files: any[]) {
        response.add('uploaded', true);
        response.add('files', files.map(f => ({
            originalName: f.originalname,
            filename: f.filename,
            size: f.size,
            mimetype: f.mimetype
        })));
        response.add('count', files.length);
        return response.status(201).json();
    }
}
```

### Validation Error Pattern

```typescript
class ValidationResponse {
    static invalid(response: A_Response, validationErrors: any[]) {
        validationErrors.forEach(error => {
            response.addError({
                code: 'VALIDATION_ERROR',
                message: error.message,
                statusCode: 422,
                timestamp: new Date()
            });
        });
        
        response.status(422).json({
            message: 'Validation failed',
            errors: response.errors
        });
    }
}
```

## API Reference

### Constructor

```typescript
new A_Response<ResponseType>(
    params: A_SERVER_TYPES__ResponseConstructor,
    options?: A_SERVER_TYPES__ResponseOptions
)
```

### Properties

- `duration: number` - Response duration in milliseconds
- `statusCode: number` - HTTP status code
- `headersSent: boolean` - Whether headers have been sent
- `original: ServerResponse` - Original Node.js ServerResponse
- `errors: A_SERVER_TYPES__ResponseError[]` - Accumulated errors
- `warnings: string[]` - Warning messages
- `hasErrors: boolean` - Whether response has errors
- `isFinished: boolean` - Whether response is complete
- `size: number` - Response size in bytes
- `metrics: A_SERVER_TYPES__ResponseMetrics` - Performance metrics

### Methods

#### Core Methods
- `init(): Promise<void>` - Initialize response processing
- `send(data?: string | object): void` - Send response
- `json(data?: object): void` - Send JSON response
- `status(code: number): this` - Set status code

#### Data Management
- `add(key: string, data: ResponseType): this` - Add response data
- `get(key: string): ResponseType | undefined` - Get response data
- `has(key: string): boolean` - Check if data exists
- `remove(key: string): this` - Remove response data
- `clear(): this` - Clear all data

#### Error Handling
- `failed(error: Error | A_ServerError): void` - Handle error response
- `addError(error: A_SERVER_TYPES__ResponseError): void` - Add error
- `addWarning(message: string): void` - Add warning
- `clearErrors(): void` - Clear all errors

#### Headers and Cookies
- `setHeader(key: string, value: string | number | string[]): this` - Set header
- `getHeader(key: string): string | number | string[] | undefined` - Get header
- `removeHeader(key: string): this` - Remove header
- `setCookie(name: string, value: string, options?: CookieOptions): this` - Set cookie
- `clearCookie(name: string, options?: CookieOptions): this` - Clear cookie

#### Advanced Features
- `stream(data: Readable | any[], options?: StreamOptions): Promise<void>` - Stream response
- `compressed(data: any, options?: CompressionOptions): void` - Send compressed response
- `download(filePath: string, options?: DownloadOptions): void` - Send file download
- `redirect(url: string, permanent?: boolean): void` - Redirect response
- `cache(options: CacheOptions): this` - Set cache headers
- `noCache(): this` - Set no-cache headers
- `validate(schema?: any): A_SERVER_TYPES__ResponseValidation` - Validate response

#### Utility Methods
- `toResponse(): A_SERVER_TYPES__SendResponseObject<ResponseType>` - Convert to response object
- `toJSON(): any` - Serialize for debugging

## Contributing

When contributing to A_Response:

1. Ensure all features have comprehensive tests
2. Update documentation for new features
3. Follow TypeScript best practices
4. Consider performance implications
5. Add security validation where appropriate
6. Test streaming and compression features thoroughly

## License

MIT License - see LICENSE file for details.