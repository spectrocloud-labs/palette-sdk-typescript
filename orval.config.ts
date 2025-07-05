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
      target: "./palette/client.ts",
      client: "fetch",
      baseUrl: "https://api.spectrocloud.com",
      schemas: "./palette/schemas",
      mode: "tags-split",
      prettier: true,
      override: {
        // This is what allows us to improve the user experience by adding the paletteConfig to the request
        // That way a user can init the client and then use the client to make requests without having to pass the paletteConfig to each request
        // const palette = setupConfig({
        //   baseURL: "https://api.spectrocloud.com",
        //   headers: {
        //     ApiKey: process.env.PALETTE_API_KEY,
        //     "Content-Type": "application/json",
        //     ProjectUID: process.env.PROJECT_UID,
        //   },
        // });
        // const clusters = await palette.spectroClustersGet("");
        mutator: {
          path: "./palette/httpClient/customClient.ts",
          name: "customInstance",
        },
      },
    },
  },
});
