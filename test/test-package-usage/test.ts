/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  ClusterProfilesFilterSpec,
  ClusterProfilesFilterSummaryParams,
  clusterProfilesFilterSummaryResponse,
} from "palette-sdk-typescript";

import { setupConfig } from "palette-sdk-typescript";
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

const client = setupConfig({
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY || "",
    "Content-Type": "application/json",
    ProjectUID: process.env.PALETTE_PROJECT_UID || "",
  },
});

const filterSpec: ClusterProfilesFilterSpec = {
  filter: {},
  sort: [],
};

// Define query parameters with proper typing
const queryParams: ClusterProfilesFilterSummaryParams = {};

// Call the API using the client wrapper with full type safety
const response: clusterProfilesFilterSummaryResponse =
  await client.clusterProfilesFilterSummary(filterSpec, queryParams);
if (response && response.data && Array.isArray(response.data.items)) {
  if (response.data.items.length === 0) {
    throw new Error(
      "FAIL: No cluster profiles found - test environment should have at least one cluster profile"
    );
  }

  if (response.data.items.length > 1) {
    console.log("PASS: More than one cluster profile found");
  }
}
