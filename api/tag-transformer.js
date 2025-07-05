/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * OpenAPI transformer to add meaningful tags based on endpoint paths
 * This enables tags-split mode to organize generated code into logical folders
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract meaningful tag from endpoint path
 * @param {string} path - The endpoint path
 * @returns {string} - The extracted tag
 */
function extractTagFromPath(path) {
  // Remove /v1/ prefix and split by /
  const segments = path.replace(/^\/v1\//, '').split('/');
  const firstSegment = segments[0];
  
  // Map common patterns to meaningful tags (using camelCase)
  const tagMap = {
    'apiKeys': 'apiKeys',
    'appDeployments': 'appDeployments', 
    'appProfiles': 'appProfiles',
    'appTiers': 'appTiers',
    'audits': 'audits',
    'auth': 'auth',
    'cloudaccounts': 'cloudAccounts',
    'cloudconfigs': 'cloudConfigs',
    'clustergroups': 'clusterGroups',
    'clusterprofiles': 'clusterProfiles',
    'spectroclusters': 'clusters',
    'clusters': 'clusters',
    'dashboard': 'dashboard',
    'datasinks': 'dataSinks',
    'edgehosts': 'edgeHosts',
    'events': 'events',
    'features': 'features',
    'filters': 'filters',
    'metrics': 'metrics',
    'notifications': 'notifications',
    'overlords': 'overlords',
    'packs': 'packs',
    'pcg': 'pcg',
    'permissions': 'permissions',
    'projects': 'projects',
    'registries': 'registries',
    'roles': 'roles',
    'services': 'services',
    'system': 'system',
    'teams': 'teams',
    'tenants': 'tenants',
    'users': 'users',
    'workspaces': 'workspaces',
    'clouds': 'clouds'
  };

  // Return mapped tag or use the first segment as fallback (converted to camelCase)
  if (tagMap[firstSegment]) {
    return tagMap[firstSegment];
  }
  
  // Convert kebab-case or snake_case to camelCase as fallback
  return firstSegment.replace(/[-_]([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Transform OpenAPI spec to add meaningful tags
 * @param {Object} spec - The OpenAPI specification
 * @returns {Object} - The transformed specification
 */
function transformSpec(spec) {
  if (!spec.paths) {
    console.log('⚠️  No paths found in OpenAPI spec');
    return spec;
  }

  let transformedEndpoints = 0;
  
  // Iterate through all paths and operations
  for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (typeof operation === 'object' && operation !== null) {
        const meaningfulTag = extractTagFromPath(pathKey);
        
        // Replace existing tags with meaningful tag
        operation.tags = [meaningfulTag];
        transformedEndpoints++;
      }
    }
  }

  console.log(`✅ Added meaningful tags to ${transformedEndpoints} endpoints`);
  return spec;
}

/**
 * Main execution when called directly
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: node tag-transformer.js <input-file> <output-file>');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;
  
  try {
    console.log('🏷️  Adding meaningful tags to OpenAPI spec...');
    
    // Read input file
    const inputData = fs.readFileSync(inputFile, 'utf8');
    const spec = JSON.parse(inputData);
    
    // Transform the spec
    const transformedSpec = transformSpec(spec);
    
    // Write output file
    fs.writeFileSync(outputFile, JSON.stringify(transformedSpec, null, 2));
    
    console.log(`📝 Transformed spec written to ${outputFile}`);
  } catch (error) {
    console.error('❌ Error transforming OpenAPI spec:', error.message);
    process.exit(1);
  }
}

module.exports = { transformSpec, extractTagFromPath }; 