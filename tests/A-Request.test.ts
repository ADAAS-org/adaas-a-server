import { A_Request_Init, A_Request_Options, A_Request, A_RequestHelper } from '../src';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

describe('A_Request Entity', () => {
    let mockIncomingMessage: Partial<IncomingMessage>;
    let mockSocket: Partial<Socket>;
    let requestParams: A_Request_Init;

    beforeEach(() => {
        mockSocket = {
            remoteAddress: '192.168.1.100',
            destroyed: false
        };

        mockIncomingMessage = {
            method: 'POST',
            url: '/api/users/123?sort=name&limit=10',
            headers: {
                'content-type': 'application/json',
                'content-length': '100',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'cookie': 'sessionId=abc123; preferences=dark',
                'x-forwarded-for': '203.0.113.45, 192.168.1.100'
            },
            socket: mockSocket as Socket,
            on: jest.fn(),
            off: jest.fn(),
            pipe: jest.fn().mockReturnValue(mockIncomingMessage),
            read: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            destroy: jest.fn()
        };

        requestParams = {
            id: 'test-request-123',
            shard: 'test-shard',
            request: mockIncomingMessage as IncomingMessage,
            scope: 'test-api'
        };
    });

    describe('Constructor and Initialization', () => {
        test('should create A_Request instance with basic parameters', () => {
            const request = new A_Request(requestParams);

            expect(request).toBeInstanceOf(A_Request);
            expect(request.aseid.id).toBe('test-request-123');
        });

        test('should create A_Request instance with options', () => {
            const options: A_Request_Options = {
                maxBodySize: 5 * 1024 * 1024,
                timeout: 10000,
                parseCookies: false,
                enableFileUploads: false
            };

            const request = new A_Request(requestParams, options);
            expect(request).toBeInstanceOf(A_Request);
        });

        test('should expose HTTP method and URL without calling load()', () => {
            const request = new A_Request(requestParams);

            expect(request.method).toBe('POST');
            expect(request.url).toBe('/api/users/123?sort=name&limit=10');
        });
    });

    describe('Basic Properties', () => {
        test('should return correct HTTP method', () => {
            const request = new A_Request(requestParams);
            expect(request.method).toBe('POST');
        });

        test('should return correct URL', () => {
            const request = new A_Request(requestParams);
            expect(request.url).toBe('/api/users/123?sort=name&limit=10');
        });

        test('should return correct headers', () => {
            const request = new A_Request(requestParams);

            expect(request.headers['content-type']).toBe('application/json');
            expect(request.headers['user-agent']).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        });

        test('should return user agent from headers', () => {
            const request = new A_Request(requestParams);
            expect(request.userAgent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        });

        test('should return content length from headers', () => {
            const request = new A_Request(requestParams);
            expect(request.contentLength).toBe(100);
        });

        test('should return content type from headers', () => {
            const request = new A_Request(requestParams);
            expect(request.contentType).toBe('application/json');
        });

        test('should return original IncomingMessage', () => {
            const request = new A_Request(requestParams);
            expect(request.original).toBe(mockIncomingMessage);
        });
    });

    describe('Cookie Parsing', () => {
        test('should parse cookies correctly', () => {
            const request = new A_Request(requestParams);

            expect(request.cookies.sessionId).toBe('abc123');
            expect(request.cookies.preferences).toBe('dark');
        });

        test('should return empty object when no cookies', () => {
            mockIncomingMessage.headers = {
                'content-type': 'application/json'
            };

            const request = new A_Request(requestParams);
            expect(request.cookies).toEqual({});
        });

        test('should handle getCookie and hasCookie methods', () => {
            const request = new A_Request(requestParams);
            // Access cookies getter first to initialise the private _cookies map
            void request.cookies;

            expect(request.getCookie('sessionId')).toBe('abc123');
            expect(request.getCookie('nonexistent')).toBeUndefined();
            expect(request.hasCookie('sessionId')).toBe(true);
            expect(request.hasCookie('nonexistent')).toBe(false);
        });
    });

    describe('Query Extraction via Getter', () => {
        test('should extract query parameters from url getter', () => {
            const request = new A_Request(requestParams);
            const query = request.query as Record<string, string>;

            expect(query.sort).toBe('name');
            expect(query.limit).toBe('10');
        });

        test('should return empty object when url has no query string', () => {
            mockIncomingMessage.url = '/api/users';
            const request = new A_Request(requestParams);

            expect(request.query).toEqual({});
        });
    });

    describe('A_RequestHelper Static Methods', () => {
        test('extractQuery should parse query string correctly', () => {
            const query = A_RequestHelper.extractQuery('/api/users?sort=name&limit=10&filter=active');
            expect(query.sort).toBe('name');
            expect(query.limit).toBe('10');
            expect(query.filter).toBe('active');
        });

        test('extractQuery should handle params with no values', () => {
            const query = A_RequestHelper.extractQuery('/api/users?flag&empty=');
            expect(query.flag).toBe('');
            expect(query.empty).toBe('');
        });

        test('extractQuery should return empty object for no query string', () => {
            const query = A_RequestHelper.extractQuery('/api/users');
            expect(query).toEqual({});
        });

        test('extractQuery should decode URL-encoded query parameters', () => {
            const query = A_RequestHelper.extractQuery('/api/search?q=hello%20world&type=user%2Badmin');
            expect(query.q).toBe('hello world');
            expect(query.type).toBe('user+admin');
        });

        test('extractParams should extract named URL parameters', () => {
            const params = A_RequestHelper.extractParams('/api/users/123', '/api/users/:id');
            expect(params.id).toBe('123');
        });

        test('extractParams should extract multiple named parameters', () => {
            const params = A_RequestHelper.extractParams('/api/users/42/posts/7', '/api/users/:userId/posts/:postId');
            expect(params.userId).toBe('42');
            expect(params.postId).toBe('7');
        });

        test('extractParams should return empty object for mismatched patterns', () => {
            const params = A_RequestHelper.extractParams('/api/items/456', '/api/users/:id');
            expect(params).toEqual({});
        });

        test('extractParams should return empty object with no route pattern', () => {
            const params = A_RequestHelper.extractParams('/api/users/123', '');
            expect(params).toEqual({});
        });
    });

    describe('File Handling', () => {
        test('should return empty files array by default', () => {
            const request = new A_Request(requestParams);

            expect(request.files).toHaveLength(0);
            // hasFiles() returns falsy (undefined) when _files is not yet initialised
            expect(request.hasFiles()).toBeFalsy();
        });

        test('should return undefined and empty array for non-existent file fields', () => {
            const request = new A_Request(requestParams);

            expect(request.getFile('nonexistent')).toBeUndefined();
            expect(request.getFiles('nonexistent')).toEqual([]);
            expect(request.hasFile('nonexistent')).toBe(false);
        });

        test('should return 0 total file size when no files uploaded', () => {
            const request = new A_Request(requestParams);
            expect(request.getTotalFileSize()).toBe(0);
        });
    });

    describe('Content Type and Metadata', () => {
        test('should check content type acceptance when Accept: */*', () => {
            mockIncomingMessage.headers = {
                'accept': 'application/json, text/html, */*'
            };

            const request = new A_Request(requestParams);

            expect(request.accepts('application/json')).toBe(true);
            expect(request.accepts('text/html')).toBe(true);
            expect(request.accepts('application/xml')).toBe(true); // */* accepts all
        });

        test('should return false for unaccepted content types', () => {
            mockIncomingMessage.headers = { 'accept': 'application/json' };

            const request = new A_Request(requestParams);

            expect(request.accepts('application/json')).toBe(true);
            expect(request.accepts('text/html')).toBe(false);
        });

        test('should detect secure connections when socket is encrypted', () => {
            (mockSocket as any).encrypted = true;

            const request = new A_Request(requestParams);
            expect(request.isSecure).toBe(true);
        });

        test('should return false for non-secure connections', () => {
            const request = new A_Request(requestParams);
            expect(request.isSecure).toBe(false);
        });
    });

    describe('Stream Operations', () => {
        test('should pipe request to destination', () => {
            const mockDestination = {
                write: jest.fn(),
                end: jest.fn()
            };

            mockIncomingMessage.pipe = jest.fn().mockReturnValue(mockDestination);

            const request = new A_Request(requestParams);
            const result = request.pipe(mockDestination as any);

            expect(mockIncomingMessage.pipe).toHaveBeenCalledWith(mockDestination, undefined);
            expect(result).toBe(mockDestination);
        });

        test('should pipe request with pipe options', () => {
            const mockDestination = {
                write: jest.fn(),
                end: jest.fn()
            };

            const pipeOptions = { end: false };
            mockIncomingMessage.pipe = jest.fn().mockReturnValue(mockDestination);

            const request = new A_Request(requestParams);
            request.pipe(mockDestination as any, pipeOptions);

            expect(mockIncomingMessage.pipe).toHaveBeenCalledWith(mockDestination, pipeOptions);
        });
    });

    describe('Fingerprint', () => {
        test('should generate a non-empty string fingerprint', () => {
            const request = new A_Request(requestParams);
            const fingerprint = request.getFingerprint();

            expect(typeof fingerprint).toBe('string');
            expect(fingerprint.length).toBeGreaterThan(0);
        });

        test('should generate different fingerprints for different URLs', () => {
            const requestA = new A_Request(requestParams);

            const differentMessage = {
                ...mockIncomingMessage,
                method: 'GET',
                url: '/api/other'
            } as Partial<IncomingMessage>;
            const requestB = new A_Request({
                ...requestParams,
                id: 'req-b',
                request: differentMessage as IncomingMessage
            });

            expect(requestA.getFingerprint()).not.toBe(requestB.getFingerprint());
        });
    });

    describe('Serialization', () => {
        test('should serialize to JSON with core request fields', () => {
            const request = new A_Request(requestParams);
            // Access cookies so _cookies private field is populated before toJSON
            void request.cookies;

            const json = request.toJSON();

            expect(json).toHaveProperty('method');
            expect(json).toHaveProperty('url');
            expect(json).toHaveProperty('headers');
            expect(json).toHaveProperty('params');
            expect(json).toHaveProperty('query');
            expect(json).toHaveProperty('userAgent');
            expect(json).toHaveProperty('filesCount');
            expect(json).toHaveProperty('totalFileSize');

            expect(json.method).toBe('POST');
            expect(json.url).toBe('/api/users/123?sort=name&limit=10');
        });

        test('toJSON should include parsed cookies when accessed prior', () => {
            const request = new A_Request(requestParams);
            void request.cookies; // trigger lazy parse

            const json = request.toJSON();
            expect(json.cookies).toBeDefined();
            expect((json.cookies as any).sessionId).toBe('abc123');
        });
    });
});