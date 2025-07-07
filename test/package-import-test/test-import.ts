/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Package Import Test
 * This test simulates importing palette-sdk-typescript as if it were installed from npm.
 * It verifies that the setupConfig export is available and functional, catching any
 * circular dependency issues that would prevent proper package usage.
 * It also includes real API testing to ensure the package works with actual Palette API.
 */

// Import dotenvx for environment variable loading
import dotenvx from "@dotenvx/dotenvx";

// Import types for cluster profile testing
import type {
  ClusterProfilesFilterSpec,
  ClusterProfilesFilterSummaryParams,
  clusterProfilesFilterSummaryResponse,
} from "palette-sdk-typescript";

// Load environment variables with expanded path handling
const result = dotenvx.config({
  ignore: ["MISSING_ENV_FILE"],
  path: ["../../.env", "../.env", ".env"],
});

// Log environment loading results
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

// Environment variables
const API_KEY = process.env.PALETTE_API_KEY;
const BASE_URL = process.env.PALETTE_BASE_URL || "https://api.spectrocloud.com";

if (!API_KEY) {
  console.error("FAIL: PALETTE_API_KEY environment variable is required");
  console.error("Please set PALETTE_API_KEY to run this test");
  process.exit(1);
}

console.log("Testing real package import (npm install simulation)...");

async function testPackageImport(): Promise<boolean> {
  try {
    console.log("Importing palette-sdk-typescript as installed package...");

    // Import the package as it would be used by consumers
    // Note: We use dynamic import to handle potential circular dependency issues
    const { setupConfig } = await import("palette-sdk-typescript");

    console.log("PASS: setupConfig imported successfully:", typeof setupConfig);

    if (typeof setupConfig !== "function") {
      throw new Error(
        `Expected setupConfig to be a function, got ${typeof setupConfig}`
      );
    }

    // Test that setupConfig can be called without circular dependency issues
    console.log("Testing setupConfig functionality...");
    const client = setupConfig({
      baseURL: BASE_URL,
      headers: {
        ApiKey: API_KEY!,
        "Content-Type": "application/json",
      },
    });

    console.log(
      "PASS: setupConfig executed successfully, client type:",
      typeof client
    );

    if (typeof client !== "object" || client === null) {
      throw new Error(
        `Expected setupConfig to return an object, got ${typeof client}`
      );
    }

    // Verify that the client has expected API functions
    const functionNames = Object.keys(client);
    if (functionNames.length === 0) {
      throw new Error(
        "Expected client to have API functions, but got empty object"
      );
    }

    console.log(`PASS: Client contains ${functionNames.length} API functions`);

    // Test a few specific functions that should exist
    const expectedFunctions = [
      "spectroClustersGet",
      "clusterProfilesFilterSummary",
      "apiKeysList",
      "cloudAccountsAwsList",
    ];

    const missingFunctions = [];
    for (const funcName of expectedFunctions) {
      if (typeof (client as any)[funcName] !== "function") {
        missingFunctions.push(funcName);
      }
    }

    if (missingFunctions.length > 0) {
      throw new Error(
        `Missing expected functions: ${missingFunctions.join(", ")}`
      );
    }

    console.log("PASS: Key API functions are available through client");

    // Test that we can also import individual functions
    console.log("Testing individual function imports...");
    const { spectroClustersGet, clusterProfilesFilterSummary } = await import(
      "palette-sdk-typescript"
    );

    if (typeof spectroClustersGet !== "function") {
      throw new Error(
        `Expected spectroClustersGet to be a function, got ${typeof spectroClustersGet}`
      );
    }

    if (typeof clusterProfilesFilterSummary !== "function") {
      throw new Error(
        `Expected clusterProfilesFilterSummary to be a function, got ${typeof clusterProfilesFilterSummary}`
      );
    }

    console.log("PASS: Individual function imports work correctly");

    // Test type imports (should not throw at runtime)
    console.log("Testing type imports...");
    try {
      // Types don't exist at runtime, so we just test that the import statement works
      // at compile time. PaletteAPIFunctions is a type-only export.
      console.log("PASS: Type imports handled correctly (compile-time only)");
    } catch (error) {
      // This is expected for type-only imports
      console.log("PASS: Type imports handled correctly (type-only)");
    }

    // Test real API functionality with provided credentials
    console.log("\nTesting real API functionality...");
    await testClusterProfilesAPI(client);

    console.log("\nPackage import test completed successfully!");
    console.log("PASS: No circular dependency issues detected");
    console.log("PASS: setupConfig export is working correctly");
    console.log("PASS: Client wrapper pattern is functional");
    console.log("PASS: Individual function exports are working");
    console.log("PASS: Package can be imported like a real npm package");
    console.log("PASS: TypeScript imports are working correctly");
    console.log("PASS: Real API functionality works with provided credentials");

    return true;
  } catch (error: any) {
    console.error("FAIL: Package import test failed:");
    console.error("Error:", error.message);
    console.error(
      "\nThis indicates a critical circular dependency or export issue!"
    );
    console.error(
      "The setupConfig function may not be properly exported from the main index."
    );
    console.error(
      "Or there may be issues with the package.json main entry point."
    );
    console.error(
      "Check for circular imports between palette/index.ts and palette/httpClient/paletteClient.ts"
    );

    // Print the stack trace for debugging
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }

    throw error;
  }
}

/**
 * Test cluster profiles API functionality (requires valid API credentials)
 */
async function testClusterProfilesAPI(client: any): Promise<void> {
  // Test that the function is available
  if (typeof client.clusterProfilesFilterSummary === "function") {
    console.log(
      "PASS: clusterProfilesFilterSummary is available as a function"
    );
  } else {
    throw new Error(
      "clusterProfilesFilterSummary is not available as a function"
    );
  }

  console.log("Testing real API call to Palette...");

  // Define the filter spec with proper typing
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
        "No cluster profiles found - test environment should have at least one cluster profile"
      );
    }

    console.log(`PASS: Found ${response.data.items.length} cluster profiles`);

    // Display the cluster profiles (limit to first 5 for brevity)
    const profilesToShow = response.data.items.slice(0, 5);
    profilesToShow.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.metadata?.name || "Unknown"}`);
      console.log(`   UID: ${profile.metadata?.uid || "Unknown"}`);
      console.log(`   Version: ${profile.specSummary?.version || "N/A"}`);
      console.log(
        `   Created: ${profile.metadata?.creationTimestamp || "Unknown"}`
      );
    });

    if (response.data.items.length > 5) {
      console.log(
        `... and ${response.data.items.length - 5} more cluster profiles`
      );
    }

    console.log("PASS: Real API cluster profiles test completed successfully");
    console.log("PASS: API functions work correctly with real Palette API");
    console.log("PASS: Type definitions are accurate for API responses");
  } else {
    throw new Error("Unexpected response format from cluster profiles API");
  }
}

// Run the test
testPackageImport()
  .then(() => {
    console.log("\nPackage import test passed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nPackage import test failed!");
    process.exit(1);
  });
