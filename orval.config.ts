/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  palette: {
    input: "./openapi/openapi.yaml",
    output: {
      target: "./generated/client.ts",
      client: "fetch",
      baseUrl: "https://api.spectrocloud.com",
      schemas: "./generated/schemas",
      prettier: true,
    },
    hooks: {
      afterAllFilesWrite: "node api/post-processing-dup.js",
    },
  },
};
