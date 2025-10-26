import { A_Fragment } from "@adaas/a-concept";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";

export interface A_StaticAlias {
    alias: string;
    path: string;
    directory: string;
    enabled?: boolean;
}

export interface A_StaticDirectoryConfig {
    path: string;
    directory: string;
    alias?: string;
}

export class A_StaticConfig extends A_Fragment {

    readonly directories: Array<string>;
    private _aliases: Map<string, A_StaticAlias> = new Map();
    private _directoryConfigs: A_StaticDirectoryConfig[] = [];

    constructor(
        /**
         * Setup directories to serve static files from, comma separated
         */
        directories: string[] = [],
        /**
         * Custom directory configurations with aliases
         */
        directoryConfigs: A_StaticDirectoryConfig[] = []
    ) {
        super();

        this.directories = directories;
        this._directoryConfigs = directoryConfigs;
        
        // Initialize default aliases from directories
        this.initializeDefaultAliases();
        
        // Initialize custom aliases from directoryConfigs
        this.initializeCustomAliases();
    }

    private initializeDefaultAliases(): void {
        this.directories.forEach((dir, index) => {
            const alias: A_StaticAlias = {
                alias: `/static${index > 0 ? index : ''}`,
                path: `/static${index > 0 ? index : ''}`,
                directory: dir,
                enabled: true
            };
            this._aliases.set(alias.path, alias);
        });
    }

    private initializeCustomAliases(): void {
        this._directoryConfigs.forEach((config) => {
            const alias: A_StaticAlias = {
                alias: config.alias || config.path,
                path: config.path,
                directory: config.directory,
                enabled: true
            };
            this._aliases.set(alias.path, alias);
        });
    }

    /**
     * Add a custom static file alias
     * @param alias - The URL path alias (e.g., '/assets')
     * @param directory - The local directory path
     * @param path - Optional custom path (defaults to alias)
     */
    public addAlias(alias: string, directory: string, path?: string): void {
        const staticAlias: A_StaticAlias = {
            alias,
            path: path || alias,
            directory,
            enabled: true
        };
        
        this._aliases.set(staticAlias.path, staticAlias);
    }

    /**
     * Remove a static file alias
     * @param aliasPath - The path of the alias to remove
     */
    public removeAlias(aliasPath: string): boolean {
        return this._aliases.delete(aliasPath);
    }

    /**
     * Enable or disable an alias
     * @param aliasPath - The path of the alias
     * @param enabled - Whether to enable or disable
     */
    public setAliasEnabled(aliasPath: string, enabled: boolean): boolean {
        const alias = this._aliases.get(aliasPath);
        if (alias) {
            alias.enabled = enabled;
            return true;
        }
        return false;
    }

    /**
     * Get all configured aliases
     */
    public getAliases(): A_StaticAlias[] {
        return Array.from(this._aliases.values());
    }

    /**
     * Get enabled aliases only
     */
    public getEnabledAliases(): A_StaticAlias[] {
        return Array.from(this._aliases.values()).filter(alias => alias.enabled !== false);
    }

    /**
     * Find the best matching alias for a given request path
     * @param requestPath - The request path to match
     */
    public findMatchingAlias(requestPath: string): A_StaticAlias | null {
        let bestMatch: A_StaticAlias | null = null;
        let longestMatch = 0;

        for (const alias of this.getEnabledAliases()) {
            if (requestPath.startsWith(alias.path) && alias.path.length > longestMatch) {
                bestMatch = alias;
                longestMatch = alias.path.length;
            }
        }

        return bestMatch;
    }

    /**
     * Check if an alias exists
     * @param aliasPath - The path to check
     */
    public hasAlias(aliasPath: string): boolean {
        return this._aliases.has(aliasPath);
    }

    /**
     * Get a specific alias by path
     * @param aliasPath - The path of the alias
     */
    public getAlias(aliasPath: string): A_StaticAlias | undefined {
        return this._aliases.get(aliasPath);
    }

    /**
     * Add multiple aliases at once
     * @param aliases - Array of alias configurations
     */
    public addAliases(aliases: A_StaticDirectoryConfig[]): void {
        aliases.forEach(config => {
            this.addAlias(config.alias || config.path, config.directory, config.path);
        });
    }

    /**
     * Clear all aliases
     */
    public clearAliases(): void {
        this._aliases.clear();
    }

    /**
     * Update an existing alias
     * @param aliasPath - The path of the alias to update
     * @param updates - Partial updates to apply
     */
    public updateAlias(aliasPath: string, updates: Partial<A_StaticAlias>): boolean {
        const alias = this._aliases.get(aliasPath);
        if (alias) {
            Object.assign(alias, updates);
            return true;
        }
        return false;
    }

    /**
     * Get statistics about configured aliases
     */
    public getStats(): {
        total: number;
        enabled: number;
        disabled: number;
        directories: string[];
    } {
        const aliases = this.getAliases();
        const enabled = aliases.filter(a => a.enabled !== false);
        const disabled = aliases.filter(a => a.enabled === false);
        const directories = [...new Set(aliases.map(a => a.directory))];

        return {
            total: aliases.length,
            enabled: enabled.length,
            disabled: disabled.length,
            directories
        };
    }

    /**
     * Checks if a given path is configured in the proxy (legacy method)
     * @deprecated Use findMatchingAlias instead
     * @param path 
     * @returns 
     */
    has(path: string): false | string {
        const alias = this.findMatchingAlias(path);
        return alias ? alias.directory : false;
    }
}