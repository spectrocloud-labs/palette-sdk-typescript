/**
 * Copyright (c) Spectro Cloud
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from "orval";

export default defineConfig({
  palette: {
    input: {
      target: "./api/palette-apis-spec-tagged.json",
      override: {
        transformer: "./api/transformer.js",
      },
    },
    output: {
      target: "./generated/client.ts",
      client: "fetch",
      baseUrl: "https://api.spectrocloud.com",
      schemas: "./generated/schemas",
      mode: "tags-split",
      prettier: true,
    },
  },
});
