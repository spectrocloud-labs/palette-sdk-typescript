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
 * Fix duplicate exports in the schemas index file
 */
function fixDuplicateExports() {
  const schemasIndexPath = path.join(__dirname, "../palette/schemas/index.ts");
  const schemasDir = path.join(__dirname, "../palette/schemas");

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
  const paletteDir = path.join(__dirname, "../palette");

  if (!fs.existsSync(paletteDir)) {
    console.log("⚠️  Palette directory not found");
    return true;
  }

  let fixedFiles = 0;

  // Get all TypeScript files in the palette directory (excluding schemas)
  const files = fs
    .readdirSync(paletteDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts");

  files.forEach((filename) => {
    const filePath = path.join(paletteDir, filename);
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
 * Create main index file with exports from all directories
 */
function createMainIndexFile() {
  const paletteDir = path.join(__dirname, "../palette");
  const mainIndexPath = path.join(paletteDir, "index.ts");
  
  if (!fs.existsSync(paletteDir)) {
    console.log("⚠️  Palette directory not found");
    return false;
  }

  // Get all directories in the palette folder (excluding schemas and httpClient)
  const directories = fs
    .readdirSync(paletteDir)
    .filter((item) => {
      const itemPath = path.join(paletteDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== "schemas" && item !== "httpClient";
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

  // Add client wrapper exports from httpClient directory
  exports.push('');
  exports.push('// Export the client wrapper');
  exports.push('export { setupConfig } from "./httpClient/paletteClient";');
  exports.push('export type {');
  exports.push('  PaletteClientConfig,');
  exports.push('  PaletteConfig,');
  exports.push('  PaletteAPIFunctions,');
  exports.push('} from "./httpClient/paletteClient";');

  const content = `/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

// Main index file - exports all SDK functions
${exports.join('\n')}
`;

  fs.writeFileSync(mainIndexPath, content, "utf8");
  console.log(`✅ Created main index file with exports from ${directories.length} directories + client wrapper`);
  console.log(`   Directories: ${directories.join(', ')}`);
  
  return true;
}

/**
 * Rename directories and files from kebab-case to camelCase, and fix all imports
 */
function renameDirectoriesToCamelCase() {
  const paletteDir = path.join(__dirname, "../palette");
  
  if (!fs.existsSync(paletteDir)) {
    console.log("⚠️  Palette directory not found");
    return false;
  }

  // Get all directories in the palette folder (excluding schemas)
  const directories = fs
    .readdirSync(paletteDir)
    .filter((item) => {
      const itemPath = path.join(paletteDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== "schemas";
    });

  let renamedDirCount = 0;
  let renamedFileCount = 0;
  const fileRenamingMap = new Map(); // Track old -> new file mappings for import fixing

  // Step 1: Rename directories and files
  directories.forEach((dirName) => {
    // Convert kebab-case to camelCase
    const camelCaseDirName = dirName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    
    const oldDirPath = path.join(paletteDir, dirName);
    const newDirPath = path.join(paletteDir, camelCaseDirName);
    
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
  const mainIndexPath = path.join(paletteDir, "index.ts");
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
  const mainIndexPath = path.join(__dirname, "../palette/index.ts");
  
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
    const success8 = runEslint();

    if (success1 && success2 && success3 && success4 && success5 && success6 && success7 && success8) {
      console.log("\n🎉 Post-processing completed successfully!");
      console.log("License headers have been added to all files.");
      console.log("ESLint has validated all generated files for type errors.");
    } else {
      console.log("\n❌ Post-processing completed with some issues");
      if (!success8) {
        console.log("⚠️  ESLint found type errors in generated files. Please review the output above.");
      }
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Post-processing failed:", error);
    process.exit(1);
  }
}

main();
