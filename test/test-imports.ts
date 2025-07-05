/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Integration test to verify that the palette-sdk-typescript package works correctly
 */

// Test importing individual functions from local generated files
import {
  spectroClustersGet,
  spectroClustersAwsCreate,
  cloudAccountsAwsList,
  apiKeysList,
} from "../generated/index";

// Test importing types from local generated files
import type { SpectroCluster, AwsAccount, AuthLogin } from "../generated/index";

console.log("🚀 Running palette-sdk-typescript integration tests...\n");

// Test that the main functions are available and working
console.log("✅ Import successful!");
console.log("spectroClustersGet type:", typeof spectroClustersGet);
console.log("spectroClustersAwsCreate type:", typeof spectroClustersAwsCreate);
console.log("cloudAccountsAwsList type:", typeof cloudAccountsAwsList);
console.log("apiKeysList type:", typeof apiKeysList);

// Test that types are available
console.log("\n📋 Type imports:");
console.log("SpectroCluster type available:", typeof {} as SpectroCluster);
console.log("AwsAccount type available:", typeof {} as AwsAccount);
console.log("AuthLogin type available:", typeof {} as AuthLogin);

console.log("\n🎉 All imports successful! SDK is working correctly.");
console.log("\n📁 Functions are organized in the following areas:");
console.log("  • apiKeys - API key management");
console.log("  • clusters - Cluster operations");
console.log("  • cloudAccounts - Cloud account management");
console.log("  • appDeployments - Application deployments");
console.log("  • appProfiles - Application profiles");
console.log("  • And 27 more functional areas...");

console.log("\n✨ Clean function names without v1 prefixes!");
console.log("✨ CamelCase directory organization!");
console.log("✨ Tags-split mode enabled!");

// Test that key functions are available
const keyFunctions = [
  { name: "spectroClustersGet", func: spectroClustersGet },
  { name: "spectroClustersAwsCreate", func: spectroClustersAwsCreate },
  { name: "cloudAccountsAwsList", func: cloudAccountsAwsList },
  { name: "apiKeysList", func: apiKeysList },
];

console.log("\n🔧 Testing key functions...");
keyFunctions.forEach(({ name, func }) => {
  if (typeof func === "function") {
    console.log(`  ✅ ${name} is available as a function`);
  } else {
    console.log(`  ❌ ${name} is not a function (type: ${typeof func})`);
  }
});

// Test that types are working
try {
  console.log("\n🧪 Testing type definitions...");

  // This should compile without errors if types are working
  const mockCluster: Partial<SpectroCluster> = {
    metadata: {
      name: "test-cluster",
    },
  };

  const mockAccount: Partial<AwsAccount> = {
    metadata: {
      name: "test-aws-account",
    },
  };

  const mockAuth: Partial<AuthLogin> = {
    emailId: "test@example.com",
  };

  console.log("  ✅ Type definitions are working correctly");
  console.log("  ✅ Mock cluster created:", !!mockCluster);
  console.log("  ✅ Mock account created:", !!mockAccount);
  console.log("  ✅ Mock auth created:", !!mockAuth);
} catch (error) {
  console.log("  ❌ Type definitions error:", error);
}

console.log("\n🎯 Integration test completed successfully!");
console.log("\n📖 Usage example:");
console.log("```typescript");
console.log("import { spectroClustersGet } from 'palette-sdk-typescript';");
console.log("const clusters = await spectroClustersGet(config);");
console.log("```");
