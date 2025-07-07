/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Package Import Test
 * This test simulates importing palette-sdk-typescript as if it were installed from npm.
 * It verifies that the setupConfig export is available and functional, catching any
 * circular dependency issues that would prevent proper package usage.
 */

console.log("============================================================");
console.log("🧪 Testing real package import (npm install simulation)...");
console.log("============================================================");

async function testPackageImport() {
  try {
    console.log("🔍 Importing palette-sdk-typescript as installed package...");

    // Import the package as it would be used by consumers
    const { setupConfig } = require("palette-sdk-typescript");

    console.log("✅ setupConfig imported successfully:", typeof setupConfig);

    if (typeof setupConfig !== "function") {
      throw new Error(
        `Expected setupConfig to be a function, got ${typeof setupConfig}`
      );
    }

    // Test that setupConfig can be called without circular dependency issues
    console.log("🔧 Testing setupConfig functionality...");
    const client = setupConfig({
      baseURL: "https://api.spectrocloud.com",
      headers: {
        ApiKey: "test-key",
        "Content-Type": "application/json",
      },
    });

    console.log(
      "✅ setupConfig executed successfully, client type:",
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

    console.log(`✅ Client contains ${functionNames.length} API functions`);

    // Test a few specific functions that should exist
    const expectedFunctions = [
      "spectroClustersGet",
      "clusterProfilesFilterSummary",
      "apiKeysList",
      "cloudAccountsAwsList",
    ];

    const missingFunctions = [];
    for (const funcName of expectedFunctions) {
      if (typeof client[funcName] !== "function") {
        missingFunctions.push(funcName);
      }
    }

    if (missingFunctions.length > 0) {
      throw new Error(
        `Missing expected functions: ${missingFunctions.join(", ")}`
      );
    }

    console.log("✅ Key API functions are available through client");

    // Test that we can also import individual functions
    console.log("🔍 Testing individual function imports...");
    const {
      spectroClustersGet,
      clusterProfilesFilterSummary,
    } = require("palette-sdk-typescript");

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

    console.log("✅ Individual function imports work correctly");

    console.log("\n🎉 Package import test completed successfully!");
    console.log("✅ No circular dependency issues detected");
    console.log("✅ setupConfig export is working correctly");
    console.log("✅ Client wrapper pattern is functional");
    console.log("✅ Individual function exports are working");
    console.log("✅ Package can be imported like a real npm package");

    return true;
  } catch (error) {
    console.error("❌ Package import test failed:");
    console.error("Error:", error.message);
    console.error("\n🚨 This indicates a circular dependency or export issue!");
    console.error(
      "💡 The setupConfig function may not be properly exported from the main index."
    );
    console.error(
      "💡 Or there may be issues with the package.json main entry point."
    );

    // Print the stack trace for debugging
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }

    throw error;
  }
}

// Run the test
testPackageImport()
  .then(() => {
    console.log("\n✅ Package import test passed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Package import test failed!");
    process.exit(1);
  });
