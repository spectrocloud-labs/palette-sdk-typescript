# Palette SDK TypeScript

A TypeScript SDK for the Spectro Cloud Palette API. This package provides a comprehensive set of functions to manage Kubernetes clusters, applications, and cloud resources through the Palette API.

> [!WARNING]
> This is an experimental SDK and subject to change.

## Features

- **Complete API Coverage**: All Palette API endpoints are supported
- **Comprehensive TypeScript Support**: Full type definitions for all API requests and responses.
- **No Type Casting Required**: Clean, typed API calls without `any` casting
- **Fetch-based**: Built on the modern Fetch API
- **Tree-shakable**: Import only the functions you need
- **Client Pattern**: Pre-configured client for simplified usage

## Installation

```bash
npm install palette-sdk-typescript
```

> [!IMPORTANT]
> This package is published as TypeScript source code. You'll need TypeScript in your project to use it. If you're using JavaScript, you may need to configure your build tools to handle TypeScript files.

- Node.js 22 or higher
- TypeScript 5.5 or higher
- A Palette API key and project UID

## Getting Started

### Authentication

To use the Palette API, you need an API key. Check the [Create API Key](https://docs.spectrocloud.com/user-management/authentication/api-key/create-api-key/) guide for more information.

Set the API key as an environment variable:

```bash
export PALETTE_API_KEY="your-api-key-here"
export PROJECT_UID="your-project-uid-here"
```

### Usage

The recommended way to use the SDK is with the pre-configured client pattern:

```typescript
import { setupConfig, type PaletteAPIFunctions } from "palette-sdk-typescript";

// Create a pre-configured client with full typing support
const palette: PaletteAPIFunctions = setupConfig({
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
});

// Now you can call any API method directly without passing config each time
const clusters = await palette.spectroClustersGet("");
const cluster = await palette.spectroClustersGet("cluster-uid");
```

If a project UID is not specified, then the Palette API will use the tenant scope. Keep this in mind when using the SDK. There may be some cases where you want to use the tenant scope.

### Advanced Configuration

You can customize the HTTP client behavior when creating the client:

```typescript
import { setupConfig, type PaletteAPIFunctions } from "palette-sdk-typescript";

const palette: PaletteAPIFunctions = setupConfig({
  baseURL: "https://api.spectrocloud.com",
  timeout: 30000,
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
});

// All API calls will use the configured timeout and headers
const clusters = await palette.spectroClustersGet("");

// You can also pass additional RequestInit options to individual calls
const cluster = await palette.spectroClustersGet("cluster-uid", undefined, {
  signal: AbortSignal.timeout(10000), // Override timeout for this specific call
});
```

### Alternative: Individual Function Imports

If you prefer to import individual functions, you can still do so:

```typescript
import {
  spectroClustersGet,
  spectroClustersAwsCreate,
  cloudAccountsAwsList,
} from "palette-sdk-typescript";

// Set up authentication config
const config = {
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
};

// Pass config to each function call
const clusters = await spectroClustersGet("", undefined, config);
const awsAccounts = await cloudAccountsAwsList(config);
```

### Import Examples

```typescript
// Primary: Import the client setup function and types
import { setupConfig, type PaletteAPIFunctions } from "palette-sdk-typescript";

// Alternative: Import specific functions you need
import {
  spectroClustersGet,
  cloudAccountsAwsList,
  clusterProfilesGet,
} from "palette-sdk-typescript";

// Import types
import type {
  PaletteAPIFunctions,
  SpectroCluster,
  AwsAccount,
  ClusterProfile,
} from "palette-sdk-typescript";

// You can also import everything if needed
import * as PaletteSDK from "palette-sdk-typescript";
```

## TypeScript Support

The SDK includes TypeScript definitions:

```typescript
import {
  setupConfig,
  type PaletteAPIFunctions,
  type SpectroCluster,
  type AwsCloudAccount,
} from "palette-sdk-typescript";

// Create typed client with full API method typing
const palette: PaletteAPIFunctions = setupConfig({
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
});

// Typed responses
const clusters: SpectroCluster[] = await palette.spectroClustersGet("");

// Typed request bodies
const cloudAccount: AwsCloudAccount = {
  metadata: {
    name: "my-aws-account",
    uid: "account-uid",
  },
  spec: {
    credentialType: "secret",
    // ... AWS account specification
  },
};

const newAccount = await palette.cloudAccountsAwsCreate(cloudAccount);
```

## Error Handling

The SDK uses the Fetch API for HTTP requests, so you can handle errors using standard JavaScript error handling:

```typescript
import { setupConfig, type PaletteAPIFunctions } from "palette-sdk-typescript";

const palette: PaletteAPIFunctions = setupConfig({
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
});

try {
  const clusters = await palette.spectroClustersGet("");
  console.log("Found clusters:", clusters.length);
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error("API Error:", error.response.status, error.response.data);
  } else if (error.request) {
    // Request was made but no response received
    console.error("Network Error:", error.message);
  } else {
    // Something else happened
    console.error("Error:", error.message);
  }
}
```

## Contributing

This SDK is generated from the Palette OpenAPI specification. To contribute:

1. Fork the repository
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

### Requirements

- Node.js 22 or higher
- Python 3.10 or higher
- Make
- [Copywrite](https://github.com/hashicorp/copywrite)
- Docker

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:

- **SDK Issues**: Open an issue on GitHub
- **API Documentation**: Visit the [Palette API Documentation](https://docs.spectrocloud.com/api/)
- **Palette Support**: Contact Spectro Cloud support

## Related Projects

- [Palette Terraform Provider](https://github.com/spectrocloud/terraform-provider-spectrocloud)
- [Palette CLI](https://github.com/spectrocloud/palette-cli)
- [Palette Go SDK](https://github.com/spectrocloud/palette-sdk-go)
