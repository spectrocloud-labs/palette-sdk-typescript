/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  palette: {
    input: "./openapi/openapi.yaml",
    output: {
      target: "./generated/client.ts",
      client: "axios",
      schemas: "./generated/schemas",
    },
    hooks: {
      afterAllFilesWrite: "node api/post-processing-dup.js",
    },
  },
};
