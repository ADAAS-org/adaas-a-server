import { defineConfig } from "tsup";
import { resolve } from "path";
import { existsSync } from "fs";
import type { Plugin } from "esbuild";

/**
 * Custom esbuild plugin that prevents esbuild's built-in `native-node-modules`
 * plugin from intercepting TypeScript source files that use `.node` in their
 * filename convention (e.g. `AreComponent.node.ts`).
 *
 * Esbuild treats any import path ending in `.node` as a native binary addon.
 * This plugin intercepts those paths first, checks if a matching `.ts` source
 * file exists, and resolves it directly — leaving native binary imports
 * (where no `.ts` counterpart exists) for the native-node-modules plugin.
 */
const tsNodeFilesPlugin: Plugin = {
  name: "are-ts-node-files",
  setup(build) {
    build.onResolve({ filter: /\.node$/ }, (args) => {
      const tsPath = resolve(args.resolveDir, args.path + ".ts");
      if (existsSync(tsPath)) {
        return { path: tsPath };
      }
      return null;
    });
  },
};

export default defineConfig([
  /**
   * ============================
   * Browser build
   * ============================
   *
   * Single bundled ESM output for browser consumers.
   */
  {
    entry: [
      "src/index.ts", // Main entry point for browser build
    ],

    // Output directory for browser bundle
    outDir: "dist/browser",

    tsconfig: ".conf/tsconfig.browser.json",

    bundle: true, // Bundle all modules into one file

    // Browser consumers expect ESM
    format: ["esm"],

    // Tells esbuild this is browser-safe code
    platform: "browser",

    // Mark Node.js built-ins as external so the browser bundle doesn't try to
    // resolve them (e.g. 'stream' used in A-Response for piping — irrelevant
    // for browser consumers).
    external: ["stream", "http", "https", "net", "tls", "crypto", "path", "fs", "os", "url", "zlib", "events", "buffer"],

    // Reasonable baseline for modern browsers
    target: "es2020",

    // Smaller bundles
    treeshake: true,

    // Useful for debugging in bundlers
    sourcemap: true,

    // Emit .d.ts files
    dts: true,

    esbuildPlugins: [tsNodeFilesPlugin],
  },

  /**
   * ============================
   * Node build
   * ============================
   *
   * Individual CJS + ESM files preserved for direct imports.
   */
  {
    entry: [
      "src/**/*.ts"
    ],

    // Output directory for node bundle
    outDir: "dist/node",

    tsconfig: ".conf/tsconfig.node.json",

    bundle: false, // Don't bundle node build, keep imports as-is

    clean: true,

    // Support both module systems
    format: ["cjs", "esm"],

    // Enables Node globals and resolution
    platform: "node",

    // Node 16+ safe baseline
    target: "es2020",

    treeshake: true,
    sourcemap: true,

    // Emit .d.ts files (shared shape)
    dts: true,

    esbuildPlugins: [tsNodeFilesPlugin],
  },
]);
