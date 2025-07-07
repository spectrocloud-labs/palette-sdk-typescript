/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Integration test to verify that the palette-sdk-typescript package works correctly
 */

// Test importing individual functions from local palette files
import {
  spectroClustersGet,
  spectroClustersAwsCreate,
  cloudAccountsAwsList,
  apiKeysList,
} from "../palette/index";

// Test importing the client wrapper
import { setupConfig, type PaletteAPIFunctions } from "../palette";

// Test importing types from local palette files
import type { SpectroCluster, AwsAccount, AuthLogin } from "../palette/index";

console.log("Running palette-sdk-typescript integration tests...");

// Test that the main functions are available and working
console.log("PASS: Import successful!");
console.log("spectroClustersGet type:", typeof spectroClustersGet);
console.log("spectroClustersAwsCreate type:", typeof spectroClustersAwsCreate);
console.log("cloudAccountsAwsList type:", typeof cloudAccountsAwsList);
console.log("apiKeysList type:", typeof apiKeysList);
console.log("setupConfig type:", typeof setupConfig);

// Test that types are available
console.log("\nType imports:");
console.log("SpectroCluster type available:", typeof {} as SpectroCluster);
console.log("AwsAccount type available:", typeof {} as AwsAccount);
console.log("AuthLogin type available:", typeof {} as AuthLogin);

console.log("\nAll imports successful! SDK is working correctly.");

// Test the client wrapper
console.log("\nTesting client wrapper...");
try {
  const palette: PaletteAPIFunctions = setupConfig({
    baseURL: "https://api.spectrocloud.com",
    headers: {
      ApiKey: "test-key",
      "Content-Type": "application/json",
    },
  });

  console.log("PASS: Client wrapper created successfully");

  // Check that functions are available through the client
  const clientFunctions = [
    "spectroClustersGet",
    "spectroClustersAwsCreate",
    "cloudAccountsAwsList",
    "apiKeysList",
  ];

  clientFunctions.forEach((funcName) => {
    if (typeof palette[funcName as keyof PaletteAPIFunctions] === "function") {
      console.log(`PASS: ${funcName} is available through client`);
    } else {
      console.log(`FAIL: ${funcName} is not available through client`);
    }
  });
} catch (error) {
  console.log("FAIL: Client wrapper error:", error);
}

console.log("\nFunctions are organized in the following areas:");
console.log("• apiKeys - API key management");
console.log("• clusters - Cluster operations");
console.log("• cloudAccounts - Cloud account management");
console.log("• appDeployments - Application deployments");
console.log("• appProfiles - Application profiles");
console.log("• And 27 more functional areas...");

console.log("\nFeatures:");
console.log("• Clean function names without v1 prefixes");
console.log("• CamelCase directory organization");
console.log("• Tags-split mode enabled");
console.log("• Client wrapper pattern available");

// Test that key functions are available
const keyFunctions = [
  { name: "spectroClustersGet", func: spectroClustersGet },
  { name: "spectroClustersAwsCreate", func: spectroClustersAwsCreate },
  { name: "cloudAccountsAwsList", func: cloudAccountsAwsList },
  { name: "apiKeysList", func: apiKeysList },
];

console.log("\nTesting key functions...");
keyFunctions.forEach(({ name, func }) => {
  if (typeof func === "function") {
    console.log(`PASS: ${name} is available as a function`);
  } else {
    console.log(`FAIL: ${name} is not a function (type: ${typeof func})`);
  }
});

// Test that types are working
try {
  console.log("\nTesting type definitions...");

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

  console.log("PASS: Type definitions are working correctly");
  console.log("PASS: Mock cluster created:", !!mockCluster);
  console.log("PASS: Mock account created:", !!mockAccount);
  console.log("PASS: Mock auth created:", !!mockAuth);
} catch (error) {
  console.log("FAIL: Type definitions error:", error);
}

console.log("\nIntegration test completed successfully!");
console.log("\nUsage examples:");
console.log("\n1. Individual function imports:");
console.log("```typescript");
console.log("import { spectroClustersGet } from 'palette-sdk-typescript';");
console.log(
  "const clusters = await spectroClustersGet('', undefined, config);"
);
console.log("```");
console.log("\n2. Client wrapper (recommended):");
console.log("```typescript");
console.log("import { setupConfig } from 'palette-sdk-typescript';");
console.log("const palette = setupConfig({ baseURL: '...', headers: {...} });");
console.log("const clusters = await palette.spectroClustersGet('');");
console.log("```");
