/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Test to verify that the built package exports work correctly
 * This simulates how the package would be used when installed via npm
 */

import { setupConfig } from "../dist/index.js";
import type {
  ClusterProfilesFilterSpec,
  ClusterProfilesFilterSummaryParams,
  clusterProfilesFilterSummaryResponse,
} from "../dist/index.js";

async function testBuiltPackage() {
  console.log("Testing built package imports...");

  // Test that setupConfig is available
  if (typeof setupConfig !== "function") {
    throw new Error("setupConfig is not a function");
  }
  console.log("✅ setupConfig imported successfully");

  // Test that types are available
  const filterSpec: ClusterProfilesFilterSpec = {
    filter: {},
    sort: [],
  };
  console.log("✅ ClusterProfilesFilterSpec type available");

  const queryParams: ClusterProfilesFilterSummaryParams = {};
  console.log("✅ ClusterProfilesFilterSummaryParams type available");

  // Test client creation
  const client = setupConfig({
    baseURL: "https://api.spectrocloud.com",
    headers: {
      ApiKey: "test-key",
      "Content-Type": "application/json",
      ProjectUID: "test-project",
    },
  });

  if (!client) {
    throw new Error("Client creation failed");
  }
  console.log("✅ Client created successfully");

  // Test that client has expected methods
  if (typeof client.clusterProfilesFilterSummary !== "function") {
    throw new Error("clusterProfilesFilterSummary not available on client");
  }
  console.log("✅ clusterProfilesFilterSummary method available");

  console.log("🎉 All built package tests passed!");
}

testBuiltPackage().catch((error) => {
  console.error("❌ Built package test failed:", error);
  process.exit(1);
});
