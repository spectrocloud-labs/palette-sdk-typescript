#!/usr/bin/env ts-node
/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Simple test runner that executes all test files
 */

import { execSync } from "child_process";
import * as path from "path";

const testFiles = [
  "test-imports.ts",
  "cluster-profiles-simple.ts",
  "test-cluster-profiles.ts",
  "test-client-wrapper.ts",
];

console.log("🧪 Running all palette-sdk-typescript tests...\n");

let allPassed = true;

for (const testFile of testFiles) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 Running ${testFile}...`);
  console.log("=".repeat(60));

  try {
    const testPath = path.join(__dirname, testFile);
    execSync(
      `npx ts-node --transpile-only --project test/tsconfig.json ${testPath}`,
      {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      }
    );
    console.log(`✅ ${testFile} passed`);
  } catch (error) {
    console.error(`❌ ${testFile} failed`);
    allPassed = false;
  }
}

console.log(`\n${"=".repeat(60)}`);
if (allPassed) {
  console.log("🎉 All tests passed!");
  process.exit(0);
} else {
  console.log("❌ Some tests failed");
  process.exit(1);
}
