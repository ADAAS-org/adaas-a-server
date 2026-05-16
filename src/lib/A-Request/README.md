# A_Request - Comprehensive HTTP Request Processing

## Overview

The `A_Request` class is a comprehensive wrapper around Node.js `IncomingMessage` that provides advanced HTTP request processing capabilities. It extends the base `A_Entity` class and offers features like automatic body parsing, cookie and session management, file upload handling, request validation, and performance tracking.

## Key Features

- 🚀 **High Performance**: Efficient request processing with performance metrics
- 📦 **Body Parsing**: Automatic parsing of JSON, form-data, multipart, and raw content
- 🍪 **Cookie Management**: Built-in cookie parsing and secure cookie handling
- 📊 **Session Support**: Session management with customizable storage
- 📁 **File Uploads**: Multipart file upload processing with validation
- ✅ **Request Validation**: Schema-based request validation with detailed error reporting
- ⏱️ **Performance Tracking**: Request timing, parsing metrics, and performance insights
- 🛡️ **Security**: Built-in security features and input sanitization
- 🔧 **Type Safety**: Full TypeScript support with generic types for request/response data

## Installation

```bash
npm install @adaas/a-server
```

## Basic Usage

### Simple Request Processing

```typescript
import { A_Request } from '@adaas/a-server';
import { IncomingMessage } from 'http';

// Create request instance
const request = new A_Request({
    id: 'req-123',
    request: incomingMessage, // Node.js IncomingMessage
    scope: 'api'
});

// Initialize request processing
await request.init();

// Access parsed data
console.log('Method:', request.method);
console.log('URL:', request.url);
console.log('Headers:', request.headers);
console.log('Body:', request.body);
console.log('Parameters:', request.params);
console.log('Query:', request.query);
```

### Typed Request Processing

```typescript
interface UserCreateRequest {
    name: string;
    email: string;
    age: number;
}

interface UserParams {
    userId: string;
}

interface UserQuery {
    include?: string;
    sort?: string;
}

const request = new A_Request<UserCreateRequest, any, UserParams, UserQuery>({
    id: 'req-456',
    request: incomingMessage,
    scope: 'users'
});

await request.init();

// Fully typed access
const userName: string = request.body.name;
const userId: string = request.params.userId;
const sortOrder: string | undefined = request.query.sort;
```

## Advanced Features

### Request Configuration

```typescript
const options = {
    maxBodySize: 50 * 1024 * 1024, // 50MB
    timeout: 60000, // 60 seconds
    encoding: 'utf8',
    parseCookies: true,
    parseQuery: true,
    parseBody: true,
    enableSession: true,
    enableFileUploads: true,
    strictValidation: false
};

const request = new A_Request({
    id: 'req-789',
    request: incomingMessage,
    scope: 'api'
}, options);
```

### Body Parsing

The A_Request class automatically detects and parses different content types:

#### JSON Requests

```typescript
// Content-Type: application/json
await request.init();
const userData = request.body; // Parsed JSON object
```

#### Form Data

```typescript
// Content-Type: application/x-www-form-urlencoded
await request.init();
const formData = request.body; // Parsed form data
```

#### Multipart Data with File Uploads

```typescript
// Content-Type: multipart/form-data
const options = { enableFileUploads: true };
const request = new A_Request(params, options);
await request.init();

// Access form fields
const userName = request.body.name;

// Access uploaded files
const uploadedFiles = request.files;
uploadedFiles.forEach(file => {
    console.log('Field:', file.fieldName);
    console.log('Filename:', file.filename);
    console.log('Size:', file.size);
    console.log('Type:', file.mimetype);
    console.log('Data:', file.buffer);
});
```

### Cookie Management

```typescript
await request.init();

// Get all cookies
const cookies = request.cookies;

// Get specific cookie
const sessionId = request.getCookie('sessionId');

// Check if cookie exists
if (request.hasCookie('preferences')) {
    const prefs = request.getCookie('preferences');
}

// Set cookies (for response)
request.setCookie('newCookie', 'value', {
    httpOnly: true,
    secure: true,
    maxAge: 3600
});
```

### Session Management

```typescript
const options = { enableSession: true };
const request = new A_Request(params, options);
await request.init();

// Get session data
const session = request.session;
console.log('Session ID:', session.id);
console.log('Created:', session.createdAt);

// Get specific session value
const userId = request.getSession('userId');

// Set session value
request.setSession('userId', '12345');
request.setSession('preferences', { theme: 'dark' });

// Destroy session
request.destroySession();
```

### Request Validation

```typescript
const schema = {
    required: ['name', 'email'],
    fields: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 50
        },
        email: {
            type: 'string',
            minLength: 5,
            maxLength: 100
        },
        age: {
            type: 'number'
        }
    }
};

await request.init();
const validation = await request.validate(schema);

if (!validation.isValid) {
    console.log('Validation errors:', validation.errors);
    console.log('Warnings:', validation.warnings);
} else {
    console.log('Request is valid!');
}

// Quick validation check
if (!request.isValid) {
    console.log('Request has validation errors:', request.validationErrors);
}
```

### Performance Monitoring

```typescript
await request.init();

// Get processing metrics
console.log('Processing time:', request.processingTime, 'ms');
console.log('Client IP:', request.clientIp);
console.log('User Agent:', request.userAgent);
console.log('Content Length:', request.contentLength);
console.log('Body parsed:', request.isBodyParsed);

// Get comprehensive metrics
const metrics = request.metrics;
console.log('Start time:', metrics.startTime);
console.log('Bytes written:', metrics.bytesWritten);
```

### Request Metadata

```typescript
// Request information
console.log('Request method:', request.method);
console.log('Request URL:', request.url);
console.log('Is secure (HTTPS):', request.isSecure);
console.log('Is mobile device:', request.isMobile);
console.log('Request size:', request.size, 'bytes');

// Generate request fingerprint
const fingerprint = request.getFingerprint();
console.log('Request fingerprint:', fingerprint);

// Check content type acceptance
if (request.accepts('application/json')) {
    console.log('Client accepts JSON');
}
```

### Error Handling

```typescript
try {
    await request.init();
    
    if (request.error) {
        console.log('Request error:', request.error.message);
        console.log('Error code:', request.error.code);
        console.log('Status:', request.error.status);
    }
    
    if (request.bodyParsingError) {
        console.log('Body parsing failed:', request.bodyParsingError.message);
    }
    
} catch (error) {
    console.log('Request initialization failed:', error);
}
```

### Stream Processing

```typescript
// Pipe request to another stream
const writeStream = fs.createWriteStream('/tmp/upload.dat');
request.pipe(writeStream);

// Handle large requests
request.req.on('data', (chunk) => {
    console.log('Received chunk:', chunk.length, 'bytes');
});

request.req.on('end', () => {
    console.log('Request complete');
});
```

## URL Parameter Extraction

The A_Request class provides intelligent URL parameter extraction:

```typescript
// URL: /users/123/posts/456?sort=date&limit=10
// Route pattern: /users/:userId/posts/:postId

await request.init();

// Extracted parameters
console.log(request.params.userId); // "123"
console.log(request.params.postId); // "456"

// Query parameters
console.log(request.query.sort);     // "date"
console.log(request.query.limit);    // "10"
```

## Route Information

```typescript
// Get route information
const route = request.route;
console.log('Route URL:', route.url);
console.log('Route method:', route.method);
```

## Debugging and Logging

```typescript
// Comprehensive request serialization
const requestData = request.toJSON();
console.log('Request data:', {
    method: requestData.method,
    url: requestData.url,
    headers: requestData.headers,
    params: requestData.params,
    query: requestData.query,
    cookies: requestData.cookies,
    files: requestData.files,
    clientIp: requestData.clientIp,
    userAgent: requestData.userAgent,
    processingTime: requestData.processingTime,
    isValid: requestData.isValid,
    validationErrors: requestData.validationErrors
});
```

## Best Practices

### 1. Always Initialize

```typescript
// ✅ Good
const request = new A_Request(params);
await request.init(); // Always call init()

// ❌ Bad
const request = new A_Request(params);
console.log(request.body); // Body not parsed yet
```

### 2. Handle Errors Gracefully

```typescript
// ✅ Good
try {
    await request.init();
    if (request.error) {
        return handleError(request.error);
    }
    // Process request...
} catch (error) {
    return handleError(error);
}
```

### 3. Use Type Safety

```typescript
// ✅ Good - Typed request
interface CreateUserRequest {
    name: string;
    email: string;
}

const request = new A_Request<CreateUserRequest>(params);
await request.init();
const name: string = request.body.name; // Type safe

// ❌ Bad - Untyped access
const name = request.body.name; // Could be undefined
```

### 4. Validate Input

```typescript
// ✅ Good
await request.init();
const validation = await request.validate(schema);
if (!validation.isValid) {
    return response.status(400).json({
        errors: validation.errors
    });
}
```

### 5. Configure Appropriately

```typescript
// ✅ Good - Configure for your use case
const options = {
    maxBodySize: 10 * 1024 * 1024, // 10MB for API
    enableFileUploads: false, // Disable if not needed
    enableSession: true, // Enable for user endpoints
    strictValidation: true // Enable for production
};
```

## Security Considerations

### 1. Body Size Limits

```typescript
const options = {
    maxBodySize: 1024 * 1024, // 1MB limit
};
```

### 2. Input Validation

```typescript
// Always validate input data
const validation = await request.validate(strictSchema);
if (!validation.isValid) {
    throw new Error('Invalid input');
}
```

### 3. File Upload Security

```typescript
// Validate file uploads
request.files.forEach(file => {
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type');
    }
    
    // Check file size
    if (file.size > maxFileSize) {
        throw new Error('File too large');
    }
});
```

### 4. Cookie Security

```typescript
request.setCookie('sessionId', sessionId, {
    httpOnly: true,    // Prevent XSS
    secure: true,      // HTTPS only
    sameSite: 'strict' // CSRF protection
});
```

## Performance Tips

### 1. Configure Parsing Options

```typescript
// Disable unnecessary features
const options = {
    parseCookies: false,    // If cookies not needed
    parseBody: false,       // If body not needed
    enableSession: false,   // If sessions not needed
    enableFileUploads: false // If file uploads not needed
};
```

### 2. Monitor Performance

```typescript
console.log('Processing time:', request.processingTime);
console.log('Body parsed in:', request.bodyParsingTime);
console.log('Request size:', request.size);
```

### 3. Use Streaming for Large Data

```typescript
// For large requests, use streaming
request.pipe(processingStream);
```

## API Reference

### Constructor

```typescript
new A_Request<BodyType, ResponseType, ParamsType, QueryType>(
    params: A_SERVER_TYPES__RequestConstructor,
    options?: A_SERVER_TYPES__RequestOptions
)
```

### Properties

- `body: BodyType` - Parsed request body
- `params: ParamsType` - URL parameters
- `query: QueryType` - Query string parameters
- `cookies: Record<string, string>` - Parsed cookies
- `files: A_SERVER_TYPES__FileUpload[]` - Uploaded files
- `session: A_SERVER_TYPES__SessionData` - Session data
- `headers: IncomingHttpHeaders` - Request headers
- `method: A_SERVER_TYPES__RequestMethods` - HTTP method
- `url: string` - Request URL
- `clientIp: string` - Client IP address
- `userAgent: string` - User agent string
- `contentLength: number` - Content length in bytes
- `isBodyParsed: boolean` - Whether body has been parsed
- `isValid: boolean` - Whether request passed validation
- `validationErrors: string[]` - Validation error messages
- `processingTime: number` - Processing time in milliseconds
- `isSecure: boolean` - Whether request is HTTPS
- `isMobile: boolean` - Whether request is from mobile device
- `size: number` - Request size in bytes

### Methods

- `init(): Promise<void>` - Initialize request processing
- `validate(schema: any): Promise<A_SERVER_TYPES__ValidationResult>` - Validate request
- `setCookie(name: string, value: string, options?: CookieOptions): void` - Set cookie
- `getCookie(name: string): string | undefined` - Get cookie value
- `hasCookie(name: string): boolean` - Check if cookie exists
- `getSession(key?: string): any` - Get session data
- `setSession(key: string, value: any): void` - Set session data
- `destroySession(): void` - Destroy session
- `accepts(contentType: string): boolean` - Check content type acceptance
- `getFingerprint(): string` - Get request fingerprint
- `pipe(destination: WritableStream): WritableStream` - Pipe request stream
- `toJSON(): any` - Serialize for debugging

## Contributing

When contributing to A_Request:

1. Ensure all features have comprehensive tests
2. Update documentation for new features
3. Follow TypeScript best practices
4. Consider performance implications
5. Add security validation where appropriate

## License

MIT License - see LICENSE file for details.