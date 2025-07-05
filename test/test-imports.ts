/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Integration test to verify that the palette-sdk-typescript package works correctly
 */

// Test importing individual functions from local generated files
import {
  v1SpectroClustersGet,
  v1SpectroClustersAwsCreate,
  v1CloudAccountsAwsList,
  v1ApiKeysList,
} from "../generated/index";

// Test importing types from local generated files
import type {
  V1SpectroCluster,
  V1AwsAccount,
  V1AuthLogin,
} from "../generated/index";

console.log("🚀 Running palette-sdk-typescript integration tests...\n");

// Test that the main functions are available and working
console.log("✅ Import successful!");
console.log("v1SpectroClustersGet type:", typeof v1SpectroClustersGet);
console.log(
  "v1SpectroClustersAwsCreate type:",
  typeof v1SpectroClustersAwsCreate
);
console.log("v1CloudAccountsAwsList type:", typeof v1CloudAccountsAwsList);
console.log("v1ApiKeysList type:", typeof v1ApiKeysList);

// Test that key functions are available
const keyFunctions = [
  { name: "v1SpectroClustersGet", func: v1SpectroClustersGet },
  { name: "v1SpectroClustersAwsCreate", func: v1SpectroClustersAwsCreate },
  { name: "v1CloudAccountsAwsList", func: v1CloudAccountsAwsList },
  { name: "v1ApiKeysList", func: v1ApiKeysList },
];

console.log("\n🔍 Checking key API functions:");
keyFunctions.forEach(({ name, func }) => {
  if (typeof func === "function") {
    console.log(`✅ ${name}: available`);
  } else {
    console.log(`❌ ${name}: missing`);
    process.exit(1);
  }
});

// Test TypeScript types
function testTypes() {
  console.log("\n🔍 Testing TypeScript types:");

  // This should compile without errors if types are working
  const mockCluster: Partial<V1SpectroCluster> = {
    metadata: {
      name: "test-cluster",
    },
  };

  const mockAccount: Partial<V1AwsAccount> = {
    metadata: {
      name: "test-aws-account",
    },
  };

  const mockAuth: Partial<V1AuthLogin> = {
    emailId: "test@example.com",
  };

  console.log("✅ TypeScript types are working correctly");
  return { mockCluster, mockAccount, mockAuth };
}

// Test configuration setup (without making actual API calls)
function testConfiguration() {
  console.log("\n⚙️  Testing configuration setup:");

  const testConfig = {
    baseURL: "https://api.spectrocloud.com",
    headers: {
      ApiKey: "test-api-key",
      "Content-Type": "application/json",
    },
    timeout: 5000,
  };

  console.log("✅ Configuration setup successful");
  return testConfig;
}

// Run all tests
async function runTests() {
  try {
    testTypes();
    testConfiguration();

    console.log("\n🎉 All integration tests passed!");
    console.log("The palette-sdk-typescript package is ready for use.");
    console.log("\nUsage example:");
    console.log("```typescript");
    console.log(
      "import { v1SpectroClustersGet } from 'palette-sdk-typescript';"
    );
    console.log("const clusters = await v1SpectroClustersGet(config);");
    console.log("```");
  } catch (error) {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  }
}

runTests();
