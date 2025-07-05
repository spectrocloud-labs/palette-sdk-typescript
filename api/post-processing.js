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

const GENERATED_DIR = path.join(__dirname, "../generated");
const GENERATED_SCHEMAS_INDEX = path.join(GENERATED_DIR, "schemas/index.ts");

console.log("🔧 Post-processing generated code to fix duplicate exports...\n");

/**
 * Fix duplicate exports in the schemas index file
 */
function fixDuplicateExports() {
  const schemasIndexPath = path.join(__dirname, "../generated/schemas/index.ts");
  const schemasDir = path.join(__dirname, "../generated/schemas");

  if (!fs.existsSync(schemasIndexPath)) {
    console.log("⚠️  Schemas index file not found");
    return true;
  }

  // Get all actual schema files (without .ts extension)
  const actualFiles = fs.readdirSync(schemasDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => f.replace('.ts', ''));

  let content = fs.readFileSync(schemasIndexPath, "utf8");
  
  // Filter out all export lines first
  const nonExportLines = content.split('\n').filter(line => !line.trim().startsWith('export * from'));
  
  // Create new export lines only for files that actually exist
  const validExports = actualFiles.map(fileName => `export * from "./${fileName}";`);
  
  // Combine non-export lines with valid export lines
  const newContent = [...nonExportLines, ...validExports].join('\n');
  
  // Write the corrected content
  fs.writeFileSync(schemasIndexPath, newContent, "utf8");
  console.log(`✅ Fixed schemas index: regenerated exports for ${actualFiles.length} files`);

  return true;
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
 * Fix syntax errors in all generated client files (tags-split mode)
 */
function fixClientFiles() {
  const generatedDir = path.join(__dirname, "../generated");

  if (!fs.existsSync(generatedDir)) {
    console.log("⚠️  Generated directory not found");
    return true;
  }

  let fixedFiles = 0;

  // Get all TypeScript files in the generated directory (excluding schemas)
  const files = fs
    .readdirSync(generatedDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts");

  files.forEach((filename) => {
    const filePath = path.join(generatedDir, filename);
    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;

    // Fix common syntax errors in client files
    // 1. Remove extra closing braces at the end of files
    content = content.replace(/;\s*\n\s*}\s*$/, ";\n");

    // 2. Fix any incomplete function declarations
    content = content.replace(/\n\s*\n\s*}\s*$/, "\n");

    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      fixedFiles++;
    }
  });

  if (fixedFiles > 0) {
    console.log(`✅ Fixed syntax errors in ${fixedFiles} client files`);
  } else {
    console.log("✅ No syntax errors found in client files");
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
 * Convert kebab-case directory names to camelCase
 */
function convertDirectoriesToCamelCase() {
  const generatedDir = path.join(__dirname, "../generated");

  if (!fs.existsSync(generatedDir)) {
    console.log("⚠️  Generated directory not found");
    return true;
  }

  let renamedDirs = 0;

  // Get all directories in the generated folder (excluding schemas)
  const items = fs.readdirSync(generatedDir);
  
  for (const item of items) {
    const itemPath = path.join(generatedDir, item);
    
    if (fs.statSync(itemPath).isDirectory() && item !== "schemas") {
      // Convert kebab-case to camelCase
      const camelCaseName = item.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      
      if (camelCaseName !== item) {
        const newPath = path.join(generatedDir, camelCaseName);
        
        try {
          fs.renameSync(itemPath, newPath);
          console.log(`📁 Renamed directory: ${item} → ${camelCaseName}`);
          renamedDirs++;
        } catch (error) {
          console.log(`❌ Failed to rename directory ${item}: ${error.message}`);
          return false;
        }
      }
    }
  }

  if (renamedDirs > 0) {
    console.log(`✅ Successfully renamed ${renamedDirs} directories to camelCase`);
  } else {
    console.log("✅ All directories already in camelCase format");
  }

  return true;
}

/**
 * Create main index file that exports all functions from directories
 */
function createMainIndexFile() {
  const generatedDir = path.join(__dirname, "../generated");
  const mainIndexPath = path.join(generatedDir, "index.ts");
  
  if (!fs.existsSync(generatedDir)) {
    console.log("⚠️  Generated directory not found");
    return false;
  }

  // Get all directories in the generated folder (excluding schemas)
  const directories = fs
    .readdirSync(generatedDir)
    .filter((item) => {
      const itemPath = path.join(generatedDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== "schemas";
    })
    .sort();

  if (directories.length === 0) {
    console.log("⚠️  No functional directories found");
    return false;
  }

  // Create export statements for each directory
  const exports = directories.map((dir) => {
    // Convert kebab-case to camelCase for consistent imports
    const moduleName = dir.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    return `export * from "./${dir}/${dir}";`;
  });

  // Add schemas export
  exports.push('export * from "./schemas";');

  const content = `/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

// Main index file - exports all SDK functions
${exports.join('\n')}
`;

  fs.writeFileSync(mainIndexPath, content, "utf8");
  console.log(`✅ Created main index file with exports from ${directories.length} directories`);
  console.log(`   Directories: ${directories.join(', ')}`);
  
  return true;
}

/**
 * Rename directories and files from kebab-case to camelCase, and fix all imports
 */
function renameDirectoriesToCamelCase() {
  const generatedDir = path.join(__dirname, "../generated");
  
  if (!fs.existsSync(generatedDir)) {
    console.log("⚠️  Generated directory not found");
    return false;
  }

  // Get all directories in the generated folder (excluding schemas)
  const directories = fs
    .readdirSync(generatedDir)
    .filter((item) => {
      const itemPath = path.join(generatedDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== "schemas";
    });

  let renamedDirCount = 0;
  let renamedFileCount = 0;
  const fileRenamingMap = new Map(); // Track old -> new file mappings for import fixing

  // Step 1: Rename directories and files
  directories.forEach((dirName) => {
    // Convert kebab-case to camelCase
    const camelCaseDirName = dirName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    
    const oldDirPath = path.join(generatedDir, dirName);
    const newDirPath = path.join(generatedDir, camelCaseDirName);
    
    // Rename directory if needed
    if (dirName !== camelCaseDirName) {
      try {
        fs.renameSync(oldDirPath, newDirPath);
        console.log(`✅ Renamed directory: ${dirName} → ${camelCaseDirName}`);
        renamedDirCount++;
      } catch (error) {
        console.log(`❌ Failed to rename directory ${dirName}: ${error.message}`);
        return;
      }
    }
    
    // Now rename files inside the directory
    const currentDirPath = newDirPath;
    if (fs.existsSync(currentDirPath)) {
      const files = fs.readdirSync(currentDirPath).filter(file => file.endsWith('.ts'));
      
      files.forEach((fileName) => {
        const camelCaseFileName = fileName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        
        if (fileName !== camelCaseFileName) {
          const oldFilePath = path.join(currentDirPath, fileName);
          const newFilePath = path.join(currentDirPath, camelCaseFileName);
          
          try {
            fs.renameSync(oldFilePath, newFilePath);
            console.log(`✅ Renamed file: ${camelCaseDirName}/${fileName} → ${camelCaseDirName}/${camelCaseFileName}`);
            renamedFileCount++;
            
            // Track the mapping for import fixing
            const oldImportPath = `./${camelCaseDirName}/${fileName.replace('.ts', '')}`;
            const newImportPath = `./${camelCaseDirName}/${camelCaseFileName.replace('.ts', '')}`;
            fileRenamingMap.set(oldImportPath, newImportPath);
          } catch (error) {
            console.log(`❌ Failed to rename file ${fileName}: ${error.message}`);
          }
        }
      });
    }
  });

  // Step 2: Fix imports in the main index file
  const mainIndexPath = path.join(generatedDir, "index.ts");
  if (fs.existsSync(mainIndexPath)) {
    let indexContent = fs.readFileSync(mainIndexPath, "utf8");
    let importsFixed = 0;
    
    // Fix import statements
    fileRenamingMap.forEach((newPath, oldPath) => {
      const oldImportPattern = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (oldImportPattern.test(indexContent)) {
        indexContent = indexContent.replace(oldImportPattern, newPath);
        importsFixed++;
      }
    });
    
    // Also fix any remaining kebab-case directory references
    const kebabToCamelImportPattern = /from\s+['"]\.\/([a-z-]+)\/([a-z-]+)['"]/g;
    indexContent = indexContent.replace(kebabToCamelImportPattern, (match, dirName, fileName) => {
      const camelCaseDir = dirName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      const camelCaseFile = fileName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      return match.replace(`${dirName}/${fileName}`, `${camelCaseDir}/${camelCaseFile}`);
    });
    
    fs.writeFileSync(mainIndexPath, indexContent);
    console.log(`✅ Fixed imports in main index file`);
  }

  if (renamedDirCount > 0 || renamedFileCount > 0) {
    console.log(`✅ Successfully renamed ${renamedDirCount} directories and ${renamedFileCount} files to camelCase`);
  } else {
    console.log("✅ All directories and files already in camelCase");
  }

  return true;
}



/**
 * Fix imports in main index file
 */
function fixMainIndexImports() {
  const mainIndexPath = path.join(__dirname, "../generated/index.ts");
  
  if (!fs.existsSync(mainIndexPath)) {
    console.log("⚠️  Main index file not found");
    return true;
  }

  let content = fs.readFileSync(mainIndexPath, "utf8");
  const originalContent = content;

  // Fix the schemas import from '../schemas' to './schemas'
  content = content.replace('export * from "../schemas";', 'export * from "./schemas";');

  if (content !== originalContent) {
    fs.writeFileSync(mainIndexPath, content, "utf8");
    console.log("✅ Fixed schemas import in main index file");
  } else {
    console.log("✅ Main index file schemas import already correct");
  }

  return true;
}

/**
 * Main execution
 */
function main() {
  try {
    const success1 = fixSchemaFiles();
    const success2 = fixClientFiles();
    const success3 = fixDuplicateExports();
    const success4 = addLicenseHeaders();
    const success5 = createMainIndexFile();
    const success6 = renameDirectoriesToCamelCase();
    const success7 = fixMainIndexImports();


    if (success1 && success2 && success3 && success4 && success5 && success6 && success7) {
      console.log("\n🎉 Post-processing completed successfully!");
      console.log(
        "The generated TypeScript code should now compile without duplicate export errors."
      );
      console.log(
        "Functions are now organized by functional areas (tags-split mode) with camelCase directories."
      );
      console.log("License headers have been added to all files.");

      console.log("\n📁 Generated structure:");
      console.log("  • Functions organized into 32+ functional directories");
      console.log("  • Clean function names without v1 prefixes (handled by Orval transformer)");
      console.log("  • Clean schema types without v1 prefixes (handled by Orval transformer)");
      console.log("  • CamelCase directory naming");
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
