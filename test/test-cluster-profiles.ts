/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Test to verify cluster profile functions using the Palette SDK client wrapper
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
  console.log("🧪 Running Cluster Profiles Tests");
  console.log("==================================================");
  console.log("🚀 Starting cluster profiles test...");
  console.log("");

  try {
    // Create a pre-configured client
    const palette = setupConfig({
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Client created successfully");

    // Test that cluster profile functions are available through the client
    const functions = [
      "clusterProfilesFilterSummary",
      "clusterProfilesMetadata",
      "clusterProfilesCreate",
      "clusterProfilesBulkDelete",
    ];

    for (const funcName of functions) {
      if (typeof (palette as any)[funcName] === "function") {
        console.log(`✅ ${funcName} is available through client`);
      } else {
        throw new Error(`${funcName} is not available through client`);
      }
    }

    // Test a simple API call to verify the client works
    console.log("");
    console.log("🔍 Testing API call through client...");

    const metadataResponse = await (palette as any).clusterProfilesMetadata();
    if (metadataResponse && metadataResponse.data) {
      console.log("✅ clusterProfilesMetadata call successful");
      console.log(
        `   Response contains: ${Object.keys(metadataResponse.data).join(", ")}`
      );
    } else {
      throw new Error("clusterProfilesMetadata call failed");
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
