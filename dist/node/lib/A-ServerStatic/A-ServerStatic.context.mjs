import '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class A_StaticConfig extends A_Fragment {
  constructor(directories = [], directoryConfigs = []) {
    super();
    this._aliases = /* @__PURE__ */ new Map();
    this._directoryConfigs = [];
    this.directories = directories;
    this._directoryConfigs = directoryConfigs;
    this.initializeDefaultAliases();
    this.initializeCustomAliases();
  }
  initializeDefaultAliases() {
    this.directories.forEach((dir, index) => {
      const alias = {
        alias: `/static${index > 0 ? index : ""}`,
        path: `/static${index > 0 ? index : ""}`,
        directory: dir,
        enabled: true
      };
      this._aliases.set(alias.path, alias);
    });
  }
  initializeCustomAliases() {
    this._directoryConfigs.forEach((config) => {
      const alias = {
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
  addAlias(alias, directory, path) {
    const staticAlias = {
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
  removeAlias(aliasPath) {
    return this._aliases.delete(aliasPath);
  }
  /**
   * Enable or disable an alias
   * @param aliasPath - The path of the alias
   * @param enabled - Whether to enable or disable
   */
  setAliasEnabled(aliasPath, enabled) {
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
  getAliases() {
    return Array.from(this._aliases.values());
  }
  /**
   * Get enabled aliases only
   */
  getEnabledAliases() {
    return Array.from(this._aliases.values()).filter((alias) => alias.enabled !== false);
  }
  /**
   * Find the best matching alias for a given request path
   * @param requestPath - The request path to match
   */
  findMatchingAlias(requestPath) {
    let bestMatch = null;
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
  hasAlias(aliasPath) {
    return this._aliases.has(aliasPath);
  }
  /**
   * Get a specific alias by path
   * @param aliasPath - The path of the alias
   */
  getAlias(aliasPath) {
    return this._aliases.get(aliasPath);
  }
  /**
   * Add multiple aliases at once
   * @param aliases - Array of alias configurations
   */
  addAliases(aliases) {
    aliases.forEach((config) => {
      this.addAlias(config.alias || config.path, config.directory, config.path);
    });
  }
  /**
   * Clear all aliases
   */
  clearAliases() {
    this._aliases.clear();
  }
  /**
   * Update an existing alias
   * @param aliasPath - The path of the alias to update
   * @param updates - Partial updates to apply
   */
  updateAlias(aliasPath, updates) {
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
  getStats() {
    const aliases = this.getAliases();
    const enabled = aliases.filter((a) => a.enabled !== false);
    const disabled = aliases.filter((a) => a.enabled === false);
    const directories = [...new Set(aliases.map((a) => a.directory))];
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
  has(path) {
    const alias = this.findMatchingAlias(path);
    return alias ? !!alias.directory : false;
  }
  /**
   * Gets the directory for a given path if configured (legacy method)
   * 
   * @param path 
   * @returns 
   */
  get(path) {
    const alias = this.findMatchingAlias(path);
    return alias ? alias.directory : void 0;
  }
}

export { A_StaticConfig };
//# sourceMappingURL=A-ServerStatic.context.mjs.map
//# sourceMappingURL=A-ServerStatic.context.mjs.map