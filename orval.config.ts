/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  palette: {
    input: {
      target: "./api/palette-apis-spec-tagged.json",
    },
    output: {
      target: "./generated/client.ts",
      client: "fetch",
      baseUrl: "https://api.spectrocloud.com",
      schemas: "./generated/schemas",
      mode: "tags-split",
      namingConvention: "camelCase",
      prettier: true,
    },
  },
};
