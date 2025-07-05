/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Test to retrieve all cluster profiles using the Palette SDK
 */

import {
  v1ClusterProfilesFilterSummary,
  v1ClusterProfilesMetadata,
} from "../generated/index";
import type { V1ClusterProfilesSummary } from "../generated/index";
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

async function testGetClusterProfiles() {
  console.log("🚀 Starting cluster profiles test...\n");

  try {
    console.log("✅ API functions imported successfully");

    // Configure the request
    const config = {
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    };

    console.log("📡 Retrieving cluster profiles...");

    // Call the API to get all cluster profiles
    // Using an empty filter to get all profiles
    const response = await v1ClusterProfilesFilterSummary(
      {}, // empty filter spec to get all profiles
      {}, // no additional parameters
      config
    );

    console.log("✅ API call successful!");
    console.log(`Status: ${response.status}`);

    // Parse the response data
    const data: V1ClusterProfilesSummary = response.data;

    console.log("\n📊 Cluster Profiles Summary:");
    console.log(`Total profiles found: ${data.items?.length || 0}`);

    if (data.items && data.items.length > 0) {
      console.log("\n📋 Cluster Profiles:");
      data.items.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.metadata?.name || "Unnamed"}`);
        console.log(`   UID: ${profile.metadata?.uid || "N/A"}`);
        console.log(`   Version: ${profile.specSummary?.version || "N/A"}`);
        console.log(
          `   Created: ${profile.metadata?.creationTimestamp || "N/A"}`
        );
        console.log("");
      });
    } else {
      console.log("No cluster profiles found in the default project.");
    }

    // Display pagination info if available
    if (data.listmeta) {
      console.log("📄 Pagination Info:");
      if (data.listmeta.count !== undefined) {
        console.log(`   Count: ${data.listmeta.count}`);
      }
      if (data.listmeta.limit !== undefined) {
        console.log(`   Limit: ${data.listmeta.limit}`);
      }
      if (data.listmeta.offset !== undefined) {
        console.log(`   Offset: ${data.listmeta.offset}`);
      }
    }

    console.log("\n🎉 Test completed successfully!");
  } catch (error: any) {
    console.error("❌ Test failed:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    }

    process.exit(1);
  }
}

// Alternative test using the metadata endpoint (simpler response)
async function testGetClusterProfilesMetadata() {
  console.log("\n🔍 Testing cluster profiles metadata endpoint...\n");

  try {
    // Configure the request
    const config = {
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    };

    console.log("📡 Retrieving cluster profiles metadata...");

    // Call the metadata API
    const response = await v1ClusterProfilesMetadata(config);

    console.log("✅ Metadata API call successful!");
    console.log(`Status: ${response.status}`);

    const data = response.data;

    console.log("\n📊 Cluster Profiles Metadata:");
    console.log(`Total profiles found: ${data.items?.length || 0}`);

    if (data.items && data.items.length > 0) {
      console.log("\n📋 Profile Names:");
      data.items.forEach((profile, index) => {
        console.log(
          `${index + 1}. ${profile.metadata?.name || "Unnamed"} (${profile.metadata?.uid || "N/A"})`
        );
      });
    } else {
      console.log("No cluster profiles found in the default project.");
    }

    console.log("\n🎉 Metadata test completed successfully!");
  } catch (error: any) {
    console.error("❌ Metadata test failed:", error.message);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the tests
async function runTests() {
  console.log("🧪 Running Cluster Profiles Tests\n");
  console.log("=".repeat(50));

  await testGetClusterProfiles();
  await testGetClusterProfilesMetadata();

  console.log("\n" + "=".repeat(50));
  console.log("✨ All tests completed!");
}

// Execute the tests
runTests().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
