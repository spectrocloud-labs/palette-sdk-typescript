/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Simple test script to retrieve cluster profiles from Palette API
 */

import dotenvx from "@dotenvx/dotenvx";
import { setupConfig } from "../palette";

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

// Environment variables
const API_KEY = process.env.PALETTE_API_KEY;
const BASE_URL = process.env.PALETTE_BASE_URL || "https://api.spectrocloud.com";

if (!API_KEY) {
  console.error("❌ PALETTE_API_KEY environment variable is required");
  process.exit(1);
}

async function testClusterProfiles() {
  console.log("🔍 Testing cluster profiles function availability...");

  // Create a pre-configured client
  const palette = setupConfig({
    baseURL: BASE_URL,
    headers: {
      ApiKey: API_KEY,
      "Content-Type": "application/json",
      // ProjectUID: process.env.PALETTE_DEFAULT_PROJECT_UID,
    },
  });

  // Test that the function is available
  if (typeof (palette as any).clusterProfilesFilterSummary === "function") {
    console.log("✅ clusterProfilesFilterSummary is available as a function");
  } else {
    console.error(
      "❌ clusterProfilesFilterSummary is not available as a function"
    );
    process.exit(1);
  }

  console.log("🔍 Retrieving cluster profiles from Palette API...");

  try {
    // Call the API using the client wrapper
    const response = await (palette as any).clusterProfilesFilterSummary(
      {
        // Filter criteria (empty object means get all)
        metadata: {
          annotations: {},
          labels: {},
        },
      },
      {
        // Query parameters (empty object means use defaults)
      }
    );

    if (response && response.data && Array.isArray(response.data.items)) {
      console.log(
        `\n✅ Found ${response.data.items.length} cluster profiles:\n`
      );

      // Display the cluster profiles
      response.data.items.forEach((profile: any, index: number) => {
        console.log(`${index + 1}. ${profile.metadata.name}`);
        console.log(`   UID: ${profile.metadata.uid}`);
        console.log(`   Version: ${profile.specSummary?.version || "N/A"}`);
        console.log(`   Created: ${profile.metadata.creationTimestamp}`);
        console.log("");
      });

      console.log("✅ Cluster profiles test completed successfully");
      return true;
    } else {
      console.error("❌ Unexpected response format:", response);
      return false;
    }
  } catch (error) {
    console.error("❌ Error retrieving cluster profiles:", error);
    return false;
  }
}

// Run the test
testClusterProfiles()
  .then((success) => {
    if (success) {
      console.log("✅ Test completed successfully");
      process.exit(0);
    } else {
      console.log("❌ Test failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
