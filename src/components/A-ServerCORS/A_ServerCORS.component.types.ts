


export type A_SERVER_TYPES__CorsConfig = {
    origin: string;                // Allowed origin(s), e.g., '*', 'https://example.com'
    methods: string[];             // Allowed HTTP methods, e.g., ['GET', 'POST']
    headers: string[];             // Allowed headers, e.g., ['Content-Type', 'Authorization']
    credentials: boolean;          // Whether credentials are allowed
    maxAge: number;                // Max age for preflight requests, in seconds
}