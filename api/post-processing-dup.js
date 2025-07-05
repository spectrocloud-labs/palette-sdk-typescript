#!/usr/bin/env node
/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * Post-processing script to fix duplicate exports in generated TypeScript code
 * This script removes duplicate exports that differ only in casing, which cause
 * TypeScript compilation errors on case-sensitive file systems.
 */

const fs = require("fs");
const path = require("path");

const GENERATED_SCHEMAS_INDEX = path.join(
  __dirname,
  "../generated/schemas/index.ts"
);

console.log("🔧 Post-processing generated code to fix duplicate exports...\n");

/**
 * Fix duplicate exports in the schemas index file
 */
function fixDuplicateExports() {
  if (!fs.existsSync(GENERATED_SCHEMAS_INDEX)) {
    console.log(
      "❌ Generated schemas index file not found:",
      GENERATED_SCHEMAS_INDEX
    );
    return false;
  }

  let content = fs.readFileSync(GENERATED_SCHEMAS_INDEX, "utf8");
  let originalContent = content;

  // Remove duplicate exports that differ only in casing
  const duplicatePatterns = [
    // URLEncodedBase64 vs urlEncodedBase64
    {
      keep: "uRLEncodedBase64",
      remove: "urlEncodedBase64",
    },
    // APIEndpoint vs ApiEndpoint
    {
      keep: "v1APIEndpoint",
      remove: "v1ApiEndpoint",
    },
    // SRIOV vs Sriov
    {
      keep: "v1VmInterfaceSRIOV",
      remove: "v1VmInterfaceSriov",
    },
  ];

  duplicatePatterns.forEach(({ keep, remove }) => {
    const removePattern = new RegExp(
      `export \\{ ${remove} \\} from "\\./[^"]+";\\s*\\n`,
      "g"
    );
    const beforeRemoval = content;
    content = content.replace(removePattern, "");

    if (content !== beforeRemoval) {
      console.log(`✅ Removed duplicate export: ${remove} (keeping ${keep})`);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(GENERATED_SCHEMAS_INDEX, content, "utf8");
    console.log("✅ Fixed duplicate exports in schemas index");
    return true;
  } else {
    console.log("✅ No duplicate exports found in schemas index");
    return true;
  }
}

/**
 * Fix syntax errors and import casing issues in all schema files
 */
function fixSchemaFiles() {
  const schemasDir = path.join(__dirname, "../generated/schemas");

  if (!fs.existsSync(schemasDir)) {
    console.log("⚠️  Generated schemas directory not found");
    return true;
  }

  let fixedFiles = 0;

  // Get all TypeScript files in the schemas directory
  const files = fs
    .readdirSync(schemasDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts");

  files.forEach((filename) => {
    const filePath = path.join(schemasDir, filename);
    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;

    // Fix common syntax errors
    // 1. Remove extra closing braces at the end of files
    content = content.replace(/;\s*\n\s*}\s*$/, ";\n");

    // 2. Fix import casing issues (e.g., v1VmInterfaceSriov -> v1VmInterfaceSRIOV)
    content = content.replace(/v1VmInterfaceSriov/g, "v1VmInterfaceSRIOV");

    // 3. Remove any trailing empty lines or malformed syntax
    content = content.replace(/\n\s*\n\s*}\s*$/, "\n");

    // 4. Fix incomplete interfaces - add missing closing brace if needed
    if (
      content.includes("export interface ") &&
      !content.trim().endsWith("}")
    ) {
      // Check if the interface declaration is incomplete
      const lines = content.split("\n");
      const lastNonEmptyLine = lines.filter((line) => line.trim()).pop();

      if (lastNonEmptyLine && !lastNonEmptyLine.trim().endsWith("}")) {
        content = content.trim() + "\n}\n";
      }
    }

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      fixedFiles++;
    }
  });

  if (fixedFiles > 0) {
    console.log(`✅ Fixed syntax errors in ${fixedFiles} schema files`);
  } else {
    console.log("✅ No syntax errors found in schema files");
  }

  return true;
}

/**
 * Fix the auto-generated function name to be more professional
 */
function fixFunctionName() {
  const clientFile = path.join(__dirname, "../generated/client.ts");

  if (!fs.existsSync(clientFile)) {
    console.log("❌ Generated client file not found:", clientFile);
    return false;
  }

  // With fetch client, we don't need to fix function names since individual functions are exported
  console.log("✅ Using fetch client - individual functions are exported directly");
  return true;
}

/**
 * Create the main index.ts file that serves as the entry point
 */
function createIndexFile() {
  const indexFile = path.join(__dirname, "../generated/index.ts");

  const indexContent = `/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Palette SDK TypeScript
 *
 * A TypeScript SDK for the Spectro Cloud Palette API
 *
 * @packageDocumentation
 */

// Export all client functions and types
export * from "./client";

// Export all schemas/types
export * from "./schemas";
`;

  fs.writeFileSync(indexFile, indexContent, "utf8");
  console.log("✅ Created main index.ts file with individual function exports");
  return true;
}

/**
 * Add license headers to all generated files using make license
 */
function addLicenseHeaders() {
  const { execSync } = require('child_process');
  
  try {
    console.log("📄 Adding license headers to generated files...");
    
    // Run make license
    execSync('make license', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log("✅ License headers added successfully");
    return true;
  } catch (error) {
    console.error("❌ License header addition failed:", error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  try {
    const success1 = fixDuplicateExports();
    const success2 = fixSchemaFiles();
    const success3 = fixFunctionName();
    const success4 = createIndexFile();
    const success5 = addLicenseHeaders();

    if (success1 && success2 && success3 && success4 && success5) {
      console.log("\n🎉 Post-processing completed successfully!");
      console.log(
        "The generated TypeScript code should now compile without duplicate export errors."
      );
      console.log(
        "Individual functions are now available for direct import."
      );
      console.log("License headers have been added to all files.");
      process.exit(0);
    } else {
      console.log("\n❌ Post-processing encountered errors");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Post-processing failed:", error.message);
    process.exit(1);
  }
}

main();
