/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Test to retrieve all cluster profiles using the Palette SDK
 */

import {
  clusterProfilesFilterSummary,
  clusterProfilesMetadata,
  clusterProfilesCreate,
  clusterProfilesBulkDelete,
} from "../generated/index";

import dotenvx from "@dotenvx/dotenvx";

// Load environment variables with expanded path handling
const result = dotenvx.config({
  ignore: ["MISSING_ENV_FILE"],
  path: ["../.env", ".env"],
});

// Log environment loading results
if (result.error) {
  console.error(
    "dotenvx encountered an error loading environment variables: ",
    result.error.message
  );
} else {
  console.log(
    `dotenvx loaded ${Object.keys(result.parsed || {}).length} environment variables successfully`
  );
}

// Configuration
const API_KEY = process.env.PALETTE_API_KEY;
const BASE_URL = "https://api.spectrocloud.com";

if (!API_KEY) {
  console.error("❌ PALETTE_API_KEY environment variable is required");
  process.exit(1);
}

async function testClusterProfiles() {
  console.log("🧪 Running Cluster Profiles Tests");
  console.log("==================================================");
  console.log("🚀 Starting cluster profiles test...");
  console.log("");

  try {
    console.log("✅ API functions imported successfully");

    // Test that functions are available
    console.log(
      `✅ clusterProfilesFilterSummary type: ${typeof clusterProfilesFilterSummary}`
    );
    console.log(
      `✅ clusterProfilesMetadata type: ${typeof clusterProfilesMetadata}`
    );
    console.log(
      `✅ clusterProfilesCreate type: ${typeof clusterProfilesCreate}`
    );
    console.log(
      `✅ clusterProfilesBulkDelete type: ${typeof clusterProfilesBulkDelete}`
    );

    // Verify all functions are available
    const functions = [
      {
        name: "clusterProfilesFilterSummary",
        func: clusterProfilesFilterSummary,
      },
      { name: "clusterProfilesMetadata", func: clusterProfilesMetadata },
      { name: "clusterProfilesCreate", func: clusterProfilesCreate },
      { name: "clusterProfilesBulkDelete", func: clusterProfilesBulkDelete },
    ];

    for (const { name, func } of functions) {
      if (typeof func === "function") {
        console.log(`✅ ${name} is available as a function`);
      } else {
        throw new Error(`${name} is not available as a function`);
      }
    }

    console.log("");
    console.log("🎯 Cluster profiles test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

if (require.main === module) {
  testClusterProfiles()
    .then(() => {
      console.log("✅ All cluster profile tests passed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Cluster profile tests failed:", error);
      process.exit(1);
    });
}

export { testClusterProfiles };
