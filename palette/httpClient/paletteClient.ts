/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PaletteConfig } from "./customClient";
import * as PaletteAPI from "../index";

export interface PaletteClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Create a type that includes only the actual API functions (exclude types, classes, etc.)
export type PaletteAPIFunctions = {
  [K in keyof typeof PaletteAPI as (typeof PaletteAPI)[K] extends (
    ...args: any[]
  ) => any
    ? K
    : never]: (typeof PaletteAPI)[K];
};

class PaletteClientInternal {
  private config: PaletteConfig;

  constructor(config: PaletteClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      headers: config.headers || {},
      timeout: config.timeout,
    };
  }

  private createProxy(): PaletteAPIFunctions {
    // Create a proxy that intercepts all method calls
    const proxy = new Proxy({} as any, {
      get: (target, prop: string | symbol) => {
        // If it's a string property and exists in the generated API
        if (typeof prop === "string" && prop in PaletteAPI) {
          const originalFunction = (PaletteAPI as any)[prop];
          if (typeof originalFunction === "function") {
            return (...args: any[]) => {
              // All generated functions have RequestInit options as the last parameter
              // We need to ensure the paletteConfig is injected into the options parameter

              // Clone the arguments array and add our paletteConfig to the options
              const newArgs = [...args];

              // Add the options parameter with paletteConfig
              // The options parameter is always the last parameter
              newArgs.push({
                paletteConfig: this.config,
              });

              return originalFunction(...newArgs);
            };
          }
        }

        // Return undefined for non-existent properties
        return undefined;
      },
    });

    return proxy as PaletteAPIFunctions;
  }

  public getClient(): PaletteAPIFunctions {
    return this.createProxy();
  }
}

/**
 * Creates a pre-configured Palette client that automatically injects
 * authentication and configuration into all API calls.
 *
 * @param config - The configuration object containing baseURL, headers, etc.
 * @returns A proxy object that provides access to all Palette API functions
 *
 * @example
 * ```typescript
 * const palette = setupConfig({
 *   baseURL: "https://api.spectrocloud.com",
 *   headers: {
 *     ApiKey: process.env.PALETTE_API_KEY,
 *     "Content-Type": "application/json",
 *   },
 * });
 *
 * // Now you can call any API method directly
 * const clusters = await palette.spectroClustersGet("");
 * ```
 */
export function setupConfig(config: PaletteClientConfig): PaletteAPIFunctions {
  const client = new PaletteClientInternal(config);
  return client.getClient();
}

// Re-export the PaletteConfig type for convenience
export type { PaletteConfig } from "./customClient";
