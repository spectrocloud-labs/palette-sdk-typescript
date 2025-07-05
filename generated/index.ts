/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

// Main index file - exports all SDK functions
export * from "./apiKeys/apiKeys";
export * from "./appDeployments/appDeployments";
export * from "./appProfiles/appProfiles";
export * from "./audits/audits";
export * from "./auth/auth";
export * from "./cloudaccounts/cloudaccounts";
export * from "./cloudconfigs/cloudconfigs";
export * from "./clouds/clouds";
export * from "./clustergroups/clustergroups";
export * from "./clusterprofiles/clusterprofiles";
export * from "./dashboard/dashboard";
export * from "./datasinks/datasinks";
export * from "./edgehosts/edgehosts";
export * from "./events/events";
export * from "./features/features";
export * from "./filters/filters";
export * from "./metrics/metrics";
export * from "./notifications/notifications";
export * from "./overlords/overlords";
export * from "./packs/packs";
export * from "./pcg/pcg";
export * from "./permissions/permissions";
export * from "./projects/projects";
export * from "./registries/registries";
export * from "./roles/roles";
export * from "./services/services";
export * from "./spectroclusters/spectroclusters";
export * from "./system/system";
export * from "./teams/teams";
export * from "./tenants/tenants";
export * from "./users/users";
export * from "./workspaces/workspaces";
export * from "./schemas";

// Export the client wrapper
export { setupConfig, PaletteClient } from "./httpClient/paletteClient";
export type { PaletteClientConfig, PaletteConfig } from "./httpClient/paletteClient";
