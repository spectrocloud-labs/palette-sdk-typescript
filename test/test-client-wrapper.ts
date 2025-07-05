/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

import { setupConfig } from "../generated";
import dotenvx from "@dotenvx/dotenvx";

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

const API_KEY = process.env.PALETTE_API_KEY;
const BASE_URL = process.env.PALETTE_BASE_URL || "https://api.spectrocloud.com";

if (!API_KEY) {
  console.error("❌ PALETTE_API_KEY environment variable is required");
  process.exit(1);
}

async function testClientWrapper() {
  console.log("🧪 Testing the setupConfig client pattern...");

  try {
    // Test the new client pattern
    const palette = setupConfig({
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Client created successfully");

    // Test that the client has the expected functions
    console.log("🔍 Testing client function availability...");

    // Check if functions are available on the client
    if (typeof (palette as any).clusterProfilesFilterSummary === "function") {
      console.log("✅ clusterProfilesFilterSummary is available");
    } else {
      console.log("❌ clusterProfilesFilterSummary is not available");
      return false;
    }

    // Test making an API call with the client
    console.log("🔍 Testing API call with client...");
    const response = await (palette as any).clusterProfilesFilterSummary(
      {
        // Filter criteria
        metadata: {
          annotations: {},
          labels: {},
        },
      },
      {
        // Query parameters
      }
    );

    if (response && response.data && Array.isArray(response.data.items)) {
      console.log(
        `✅ API call successful! Found ${response.data.items.length} cluster profiles`
      );
    } else {
      console.log("❌ API call failed or returned unexpected data");
      return false;
    }

    // Test another function to ensure the proxy works for multiple functions
    console.log("🔍 Testing another function...");

    if (typeof (palette as any).clusterProfilesMetadata === "function") {
      console.log("✅ clusterProfilesMetadata is also available");

      // Test calling it
      const metadataResponse = await (palette as any).clusterProfilesMetadata();
      if (metadataResponse && metadataResponse.data) {
        console.log("✅ clusterProfilesMetadata call successful");
      } else {
        console.log("❌ clusterProfilesMetadata call failed");
        return false;
      }
    } else {
      console.log("❌ clusterProfilesMetadata is not available");
      return false;
    }

    console.log("🎉 All client wrapper tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Error testing client wrapper:", error);
    return false;
  }
}

export { testClientWrapper };

// Run the test if this file is executed directly
if (require.main === module) {
  testClientWrapper()
    .then((success) => {
      if (success) {
        console.log("✅ Client wrapper test completed successfully");
        process.exit(0);
      } else {
        console.log("❌ Client wrapper test failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Test failed:", error);
      process.exit(1);
    });
}
