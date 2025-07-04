/**
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

// Re-export the main client function with a clear name
export { init } from "./client";
