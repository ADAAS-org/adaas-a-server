import { A_SERVER_TYPES__CorsConfig } from "./A_ServerCORS.component.types";



export const A_SERVER_DEFAULTS__CorsConfig: A_SERVER_TYPES__CorsConfig = {
    origin: '*',  // Default to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type'],
    credentials: false,
    maxAge: 0
};
