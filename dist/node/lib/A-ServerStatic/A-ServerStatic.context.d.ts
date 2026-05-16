import { A_Fragment } from '@adaas/a-concept';

interface A_StaticAlias {
    alias: string;
    path: string;
    directory: string;
    enabled?: boolean;
}
interface A_StaticDirectoryConfig {
    path: string;
    directory: string;
    alias?: string;
}
declare class A_StaticConfig extends A_Fragment {
    readonly directories: Array<string>;
    private _aliases;
    private _directoryConfigs;
    constructor(
    /**
     * Setup directories to serve static files from, comma separated
     */
    directories?: string[], 
    /**
     * Custom directory configurations with aliases
     */
    directoryConfigs?: A_StaticDirectoryConfig[]);
    private initializeDefaultAliases;
    private initializeCustomAliases;
    /**
     * Add a custom static file alias
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     */
    addAlias(alias: string, directory: string, path?: string): void;
    /**
     * Remove a static file alias
     * @param aliasPath - The path of the alias to remove
     */
    removeAlias(aliasPath: string): boolean;
    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     */
    setAliasEnabled(aliasPath: string, enabled: boolean): boolean;
    /**
     * Get all configured aliases
     */
    getAliases(): A_StaticAlias[];
    /**
     * Get enabled aliases only
     */
    getEnabledAliases(): A_StaticAlias[];
    /**
     * Find the best matching alias for a given request path
     * @param requestPath - The request path to match
     */
    findMatchingAlias(requestPath: string): A_StaticAlias | null;
    /**
     * Check if an alias exists
     * @param aliasPath - The path to check
     */
    hasAlias(aliasPath: string): boolean;
    /**
     * Get a specific alias by path
     * @param aliasPath - The path of the alias
     */
    getAlias(aliasPath: string): A_StaticAlias | undefined;
    /**
     * Add multiple aliases at once
     * @param aliases - Array of alias configurations
     */
    addAliases(aliases: A_StaticDirectoryConfig[]): void;
    /**
     * Clear all aliases
     */
    clearAliases(): void;
    /**
     * Update an existing alias
     * @param aliasPath - The path of the alias to update
     * @param updates - Partial updates to apply
     */
    updateAlias(aliasPath: string, updates: Partial<A_StaticAlias>): boolean;
    /**
     * Get statistics about configured aliases
     */
    getStats(): {
        total: number;
        enabled: number;
        disabled: number;
        directories: string[];
    };
    /**
     * Checks if a given path is configured in the proxy (legacy method)
     * @deprecated Use findMatchingAlias instead
     * @param path
     * @returns
     */
    has(path: string): boolean;
    /**
     * Gets the directory for a given path if configured (legacy method)
     *
     * @param path
     * @returns
     */
    get(path: string): string | undefined;
}

export { type A_StaticAlias, A_StaticConfig, type A_StaticDirectoryConfig };
