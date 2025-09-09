import { A_Fragment } from "@adaas/a-concept";
export declare class A_StaticConfig extends A_Fragment {
    readonly directories: Array<string>;
    constructor(
    /**
     * Setup directories to serve static files from, comma separated
     */
    directories?: string[]);
    /**
     * Checks if a given path is configured in the proxy
     *
     * @param path
     * @returns
     */
    has(path: string): false | string;
}
