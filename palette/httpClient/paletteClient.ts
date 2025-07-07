/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PaletteConfig } from "./customClient";
// Import API functions directly to avoid circular dependency
import * as apiKeys from "../apiKeys/apiKeys";
import * as appDeployments from "../appDeployments/appDeployments";
import * as appProfiles from "../appProfiles/appProfiles";
import * as audits from "../audits/audits";
import * as auth from "../auth/auth";
import * as cloudaccounts from "../cloudaccounts/cloudaccounts";
import * as cloudconfigs from "../cloudconfigs/cloudconfigs";
import * as clouds from "../clouds/clouds";
import * as clustergroups from "../clustergroups/clustergroups";
import * as clusterprofiles from "../clusterprofiles/clusterprofiles";
import * as dashboard from "../dashboard/dashboard";
import * as datasinks from "../datasinks/datasinks";
import * as edgehosts from "../edgehosts/edgehosts";
import * as events from "../events/events";
import * as features from "../features/features";
import * as filters from "../filters/filters";
import * as metrics from "../metrics/metrics";
import * as notifications from "../notifications/notifications";
import * as overlords from "../overlords/overlords";
import * as packs from "../packs/packs";
import * as pcg from "../pcg/pcg";
import * as permissions from "../permissions/permissions";
import * as projects from "../projects/projects";
import * as registries from "../registries/registries";
import * as roles from "../roles/roles";
import * as services from "../services/services";
import * as spectroclusters from "../spectroclusters/spectroclusters";
import * as system from "../system/system";
import * as teams from "../teams/teams";
import * as tenants from "../tenants/tenants";
import * as users from "../users/users";
import * as workspaces from "../workspaces/workspaces";

// Combine all API modules
const PaletteAPI = {
  ...apiKeys,
  ...appDeployments,
  ...appProfiles,
  ...audits,
  ...auth,
  ...cloudaccounts,
  ...cloudconfigs,
  ...clouds,
  ...clustergroups,
  ...clusterprofiles,
  ...dashboard,
  ...datasinks,
  ...edgehosts,
  ...events,
  ...features,
  ...filters,
  ...metrics,
  ...notifications,
  ...overlords,
  ...packs,
  ...pcg,
  ...permissions,
  ...projects,
  ...registries,
  ...roles,
  ...services,
  ...spectroclusters,
  ...system,
  ...teams,
  ...tenants,
  ...users,
  ...workspaces,
};

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
