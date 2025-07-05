/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Simple test script to retrieve cluster profiles from Palette API
 */

import dotenvx from "@dotenvx/dotenvx";
import { ClusterProfilesFilterSummary } from "../generated/index";

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

async function testClusterProfilesSimple() {
  try {
    console.log("🔍 Testing cluster profiles function availability...");

    // Test that the function is importable and callable
    console.log(
      `✅ ClusterProfilesFilterSummary type: ${typeof ClusterProfilesFilterSummary}`
    );

    if (typeof ClusterProfilesFilterSummary === "function") {
      console.log("✅ ClusterProfilesFilterSummary is available as a function");
    } else {
      throw new Error(
        "ClusterProfilesFilterSummary is not available as a function"
      );
    }

    if (!API_KEY) {
      console.log("⚠️  PALETTE_API_KEY not found - skipping API call test");
      console.log("✅ Function availability test passed");
      return;
    }

    console.log("🔍 Retrieving cluster profiles from Palette API...\n");

    // Configure the request
    const config = {
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
        // ProjectUID: process.env.PALETTE_DEFAULT_PROJECT_UID,
      },
      timeout: 10000,
    };

    // Get cluster profiles using the filter summary endpoint
    const response = await ClusterProfilesFilterSummary({}, {}, config);

    const profiles = response.data.items || [];

    console.log(`✅ Found ${profiles.length} cluster profiles:\n`);

    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.metadata?.name || "Unnamed"}`);
      console.log(`   UID: ${profile.metadata?.uid || "N/A"}`);
      console.log(`   Version: ${profile.specSummary?.version || "N/A"}`);
      console.log(
        `   Created: ${profile.metadata?.creationTimestamp || "N/A"}`
      );
      console.log("");
    });

    if (profiles.length === 0) {
      console.log("No cluster profiles found in the default project.");
    }

    console.log("✅ Cluster profiles test completed successfully");
  } catch (error: any) {
    console.error("❌ Error retrieving cluster profiles:");
    console.error(error.message);

    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(
        `Response: ${JSON.stringify(error.response.data, null, 2)}`
      );
    }
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testClusterProfilesSimple()
    .then(() => {
      console.log("✅ Test completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test failed:", error);
      process.exit(1);
    });
}

export { testClusterProfilesSimple };
