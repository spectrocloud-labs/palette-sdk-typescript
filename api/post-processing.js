#!/usr/bin/env node
/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * Post-processing script to fix duplicate exports in generated TypeScript code
 * This script removes duplicate exports that differ only in casing, which cause
 * TypeScript compilation errors on case-sensitive file systems.
 * 
 * Updated to handle tags-split mode where code is organized by functional areas.
 */

const fs = require("fs");
const path = require("path");

const PALETTE_DIR = path.join(__dirname, "../palette");
const PALETTE_SCHEMAS_INDEX = path.join(PALETTE_DIR, "schemas/index.ts");

console.log("🔧 Post-processing generated code to fix duplicate exports...\n");

/**
 * Fix syntax errors and import casing issues in all schema files
 */
function fixSchemaFiles() {
  const schemasDir = path.join(__dirname, "../palette/schemas");

  if (!fs.existsSync(schemasDir)) {
    console.log("⚠️  Palette schemas directory not found");
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

    // Fix UrlEncodedBase64 imports - this is a simple string type that doesn't generate a separate file
    // Remove the import statement
    content = content.replace(/import\s+type\s*{\s*UrlEncodedBase64\s*}\s+from\s+[\"']\.\/urlEncodedBase64[\"'];\s*\n/g, '');
    
    // Replace UrlEncodedBase64 type usage with string
    content = content.replace(/:\s*UrlEncodedBase64(\s*[;,}|\]])/g, ': string$1');
    content = content.replace(/\?\s*:\s*UrlEncodedBase64(\s*[;,}|\]])/g, '?: string$1');
    content = content.replace(/:\s*UrlEncodedBase64\[\]/g, ': string[]');
    content = content.replace(/\?\s*:\s*UrlEncodedBase64\[\]/g, '?: string[]');
    content = content.replace(/Array<UrlEncodedBase64>/g, 'Array<string>');
    content = content.replace(/=\s*UrlEncodedBase64(\s*[;,}|\]])/g, '= string$1');

    // APIEndpoint is correctly exported as APIEndpoint from aPIEndpoint.ts - no changes needed

    // Fix index signature compatibility with optional properties
    // Fix the specific pattern that causes TS2411 errors
    content = content.replace(
      /\[key: string\]: \{ \[key: string\]: unknown \};/g,
      '[key: string]: unknown;'
    );

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
 * Run ESLint on generated files to catch type errors and fix issues
 */
function runEslint() {
  const { execSync } = require('child_process');
  
  try {
    console.log("🔍 Running ESLint on generated files...");
    
    // Run ESLint with --fix to automatically fix issues
    execSync('npm run lint', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log("✅ ESLint completed successfully");
    return true;
  } catch (error) {
    console.error("❌ ESLint found issues:", error.message);
    console.error("⚠️  Please review the ESLint output above for type errors in generated files");
    
    return false;
  }
}


/**
 * Create main index file with exports from client and schemas
 */
function createMainIndexFile() {
  const paletteDir = path.join(__dirname, "../palette");
  const mainIndexPath = path.join(paletteDir, "index.ts");
  
  if (!fs.existsSync(paletteDir)) {
    console.log("⚠️  Palette directory not found");
    return false;
  }

  // Check if client.ts exists
  const clientPath = path.join(paletteDir, "client.ts");
  const schemasPath = path.join(paletteDir, "schemas");
  
  if (!fs.existsSync(clientPath)) {
    console.log("⚠️  client.ts not found");
    return false;
  }

  if (!fs.existsSync(schemasPath)) {
    console.log("⚠️  schemas directory not found");
    return false;
  }

  const content = `/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

// Export all API client functions
export * from "./client";

// Export all schemas/types
export * from "./schemas";
`;

  fs.writeFileSync(mainIndexPath, content, "utf8");
  console.log("✅ Created main index file with exports from client and schemas");
  
  return true;
}



/**
 * Main execution
 */
function main() {
  try {
    const success1 = fixSchemaFiles();
    const success2 = createMainIndexFile();
    const success3 = addLicenseHeaders();
    const success4 = runEslint();

    if (success1 && success2 && success3 && success4) {

      console.log("\n🎉 Post-processing completed successfully!");
      console.log("License headers have been added to all files.");
      console.log("ESLint has validated all generated files for type errors.");
    } else {
      console.log("\n❌ Post-processing completed with some issues");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Post-processing failed:", error);
    process.exit(1);
  }
}

main();
