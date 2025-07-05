/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Transformer function to remove duplicate urlEncodedBase64 schema
 * This prevents Orval from generating both URLEncodedBase64 and urlEncodedBase64 schemas
 * @param {Object} spec - The OpenAPI specification object
 * @returns {Object} - The modified OpenAPI specification
 */
module.exports = function removeDuplicateSchema(spec) {
  if (spec.components && spec.components.schemas) {
    // Remove the lowercase version to prevent duplication
    // Keep only URLEncodedBase64 (uppercase) for consistency
    if (spec.components.schemas.urlEncodedBase64) {
      console.log('🔧 Removing duplicate urlEncodedBase64 schema from OpenAPI spec');
      delete spec.components.schemas.urlEncodedBase64;
    }
  }
  
  return spec;
}; 