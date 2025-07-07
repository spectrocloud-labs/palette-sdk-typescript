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
  "test-cluster-profiles.ts",
  "test-client-wrapper.ts",
  "cluster-profiles-simple.ts",
  "test-package-import-simulation.ts",
];

console.log("Running palette-sdk-typescript integration tests...");

let allPassed = true;

for (const testFile of testFiles) {
  console.log(`\nRunning ${testFile}...`);

  try {
    const testPath = path.join(__dirname, testFile);
    execSync(
      `npx ts-node --transpile-only --project test/tsconfig.json ${testPath}`,
      {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      }
    );
    console.log(`PASS: ${testFile}`);
  } catch (error) {
    console.error(`FAIL: ${testFile}`);
    allPassed = false;
  }
}

console.log("\n" + "=".repeat(50));
if (allPassed) {
  console.log("All tests passed!");
  process.exit(0);
} else {
  console.log("Some tests failed");
  process.exit(1);
}
