/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  clusterProfilesFilterSummary,
  spectroClustersMetadataGet,
  spectroClustersFiltersWorkspace,
  type ClusterProfilesFilterSpec,
  type ClusterProfilesFilterSummaryParams,
  type ClusterProfilesSummary,
  type SpectroClustersMetadata,
  type SpectroClustersSummary,
} from "palette-sdk-typescript";

import dotenvx from "@dotenvx/dotenvx";

const result = dotenvx.config({
  ignore: ["MISSING_ENV_FILE"],
  path: ["../.env", "../../.env", ".env"],
});

if (result.error) {
  console.error(
    "dotenvx encountered an error loading environment variables: ",
    result.error.message
  );
} else {
  console.log(
    `Loaded ${Object.keys(result.parsed || {}).length} environment variables`
  );
}

const config = {
  headers: {
    ApiKey: process.env.PALETTE_API_KEY || "",
    "Content-Type": "application/json",
    ProjectUID: process.env.PALETTE_DEFAULT_PROJECT_UID || "",
  },
};

const filterSpec: ClusterProfilesFilterSpec = {
  filter: {},
  sort: [],
};

// Define query parameters with proper typing
const queryParams: ClusterProfilesFilterSummaryParams = {};

// Call the API using the client functions with full type safety
const response: ClusterProfilesSummary = await clusterProfilesFilterSummary(
  filterSpec,
  queryParams,
  config
);
if (response && Array.isArray(response.items)) {
  if (response.items.length === 0) {
    throw new Error(
      "FAIL: No cluster profiles found - test environment should have at least one cluster profile"
    );
  }

  if (response.items.length > 1) {
    console.log("PASS: More than one cluster profile found");
    console.log(response.items);
  }
}

// Get basic metadata for all clusters - Method 1: Using spectroClustersMetadataGet
try {
  console.log("\n=== Testing spectroClustersMetadataGet ===");
  const metadataResponse: SpectroClustersMetadata =
    await spectroClustersMetadataGet(
      {}, // no filter params
      config
    );
  console.log(
    `Found ${metadataResponse.items?.length || 0} clusters (metadata)`
  );
  if (metadataResponse.items && metadataResponse.items.length > 0) {
    console.log("First cluster metadata:", metadataResponse.items[0]);
  }
} catch (error) {
  console.error("FAIL: spectroClustersMetadataGet", error);
}

// Get clusters using workspace filter - Method 2: Using spectroClustersFiltersWorkspace
try {
  console.log("\n=== Testing spectroClustersFiltersWorkspace ===");
  const workspaceResponse: SpectroClustersSummary =
    await spectroClustersFiltersWorkspace(
      undefined, // no filter params
      config
    );
  console.log(
    `Found ${workspaceResponse.items?.length || 0} clusters (workspace filtered)`
  );
  if (workspaceResponse.items && workspaceResponse.items.length > 0) {
    console.log("First cluster summary:", workspaceResponse.items[0]);
  }
} catch (error) {
  console.error("FAIL: spectroClustersFiltersWorkspace", error);
}
