# Palette SDK TypeScript

A TypeScript SDK for the Spectro Cloud Palette API. This package provides a comprehensive set of functions to manage Kubernetes clusters, applications, and cloud resources through the Palette API.

## Features

- **Complete API Coverage**: All Palette API endpoints are supported
- **TypeScript Support**: Full type definitions for all API requests and responses
- **Fetch-based**: Built on the modern Fetch API
- **Tree-shakable**: Import only the functions you need
- **Modern**: Written in TypeScript with ES6+ features

## Installation

```bash
npm install palette-sdk-typescript
```

> [!IMPORTANT]
> This package is published as TypeScript source code. You'll need TypeScript in your project to use it. If you're using JavaScript, you may need to configure your build tools to handle TypeScript files.

- Node.js 16 or higher
- TypeScript 4.5 or higher (if using TypeScript)
- A Palette API key

## Getting Started

### Basic Usage

```typescript
import {
  v1SpectroClustersGet,
  v1SpectroClustersUidGet,
  v1SpectroClustersAwsCreate,
} from "palette-sdk-typescript";

// Set up authentication config
const config = {
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
  },
};

// Get all clusters
const clusters = await v1SpectroClustersGet(config);

// Get cluster details
const cluster = await v1SpectroClustersUidGet("cluster-uid", config);

// Create a new AWS cluster
const newCluster = await v1SpectroClustersAwsCreate(
  {
    metadata: {
      name: "my-cluster",
      // ... other metadata
    },
    spec: {
      // ... cluster specification
    },
  },
  config
);
```

### Authentication

To use the Palette API, you need an API key. You can generate one from the Palette console:

1. Log in to your Palette console
2. Navigate to **User Menu → My API Keys**
3. Click **Add New API Key**
4. Copy the generated API key

Set the API key as an environment variable:

```bash
export PALETTE_API_KEY="your-api-key-here"
```

### Cluster Management

```typescript
import {
  v1SpectroClustersGet,
  v1SpectroClustersUidGet,
  v1SpectroClustersAwsCreate,
  v1SpectroClustersAzureCreate,
  v1SpectroClustersDelete,
} from "palette-sdk-typescript";

// Configuration with authentication
// Add ProjectUID to the headers to specify the project to use. Otherwise API calls will default to the tenant scope and could result in bad request or no results.
const config = {
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
    ProjectUID: process.env.PROJECT_UID,
  },
};

// List all clusters
const clusters = await v1SpectroClustersGet(config);

// Get cluster by UID
const cluster = await v1SpectroClustersUidGet("cluster-uid", config);

// Create AWS cluster
const awsCluster = await v1SpectroClustersAwsCreate(clusterSpec, config);

// Create Azure cluster
const azureCluster = await v1SpectroClustersAzureCreate(clusterSpec, config);

// Delete cluster
await v1SpectroClustersDelete("cluster-uid", config);
```

### Advanced Configuration

You can customize the HTTP client behavior by passing additional Fetch configuration options:

```typescript
import { v1SpectroClustersGet } from "palette-sdk-typescript";

const clusters = await v1SpectroClustersGet({
  baseURL: "https://api.spectrocloud.com",
  timeout: 30000,
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
  },
  // Any other RequestInit options
  signal: AbortSignal.timeout(30000),
});
```

## API Reference

The SDK provides access to all Palette API endpoints. You can import individual functions as needed:

- **Clusters**: `v1SpectroClustersGet`, `v1SpectroClustersAwsCreate`, `v1SpectroClustersAzureCreate`, etc.
- **Cloud Accounts**: `v1CloudAccountsAwsList`, `v1CloudAccountsAzureList`, etc.
- **App Profiles**: `v1AppProfilesGet`, `v1AppProfilesCreate`, etc.
- **Cluster Profiles**: `v1ClusterProfilesGet`, `v1ClusterProfilesCreate`, etc.
- **Users & Teams**: `v1UsersGet`, `v1TeamsGet`, etc.
- **Projects**: `v1ProjectsGet`, `v1ProjectsCreate`, etc.
- **And many more...**

### Import Examples

```typescript
// Import specific functions you need
import {
  v1SpectroClustersGet,
  v1CloudAccountsAwsList,
  v1ClusterProfilesGet,
} from "palette-sdk-typescript";

// Import types
import type {
  V1SpectroCluster,
  V1AwsCloudAccount,
  V1ClusterProfile,
} from "palette-sdk-typescript";

// You can also import everything if needed
import * as PaletteSDK from "palette-sdk-typescript";
```

## TypeScript Support

The SDK includes comprehensive TypeScript definitions:

```typescript
import {
  v1SpectroClustersGet,
  V1SpectroCluster,
  V1AwsCloudAccount,
} from "palette-sdk-typescript";

// Typed responses
const clusters: V1SpectroCluster[] = await v1SpectroClustersGet(config);

// Typed request bodies
const cloudAccount: V1AwsCloudAccount = {
  metadata: {
    name: "my-aws-account",
    uid: "account-uid",
  },
  spec: {
    // ... AWS account specification
  },
};
```

## Error Handling

The SDK uses the Fetch API for HTTP requests, so you can handle errors using standard JavaScript error handling:

```typescript
import { v1SpectroClustersGet } from "palette-sdk-typescript";

try {
  const clusters = await v1SpectroClustersGet(config);
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
