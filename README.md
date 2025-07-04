# Palette SDK TypeScript

A TypeScript SDK for the Spectro Cloud Palette API. This package provides a comprehensive set of functions to manage Kubernetes clusters, applications, and cloud resources through the Palette API.

## Features

- **Complete API Coverage**: All Palette API endpoints are supported
- **TypeScript Support**: Full type definitions for all API requests and responses
- **Axios-based**: Built on the reliable Axios HTTP client
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
import { init } from "palette-sdk-typescript";

// Initialize the API client
const api = init();

// Set up authentication config
const config = {
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
  },
};

// Get all clusters
const clusters = await api.v1SpectroClustersGet(config);

// Get cluster details
const cluster = await api.v1SpectroClustersUidGet("cluster-uid", config);

// Create a new AWS cluster
const newCluster = await api.v1SpectroClustersAwsCreate(
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
import { init } from "palette-sdk-typescript";

// Initialize the API client
const api = init();

// Configuration with authentication
const config = {
  baseURL: "https://api.spectrocloud.com",
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
  },
};

// List all clusters
const clusters = await api.v1SpectroClustersGet(config);

// Get cluster by UID
const cluster = await api.v1SpectroClustersUidGet("cluster-uid", config);

// Create AWS cluster
const awsCluster = await api.v1SpectroClustersAwsCreate(clusterSpec, config);

// Create Azure cluster
const azureCluster = await api.v1SpectroClustersAzureCreate(
  clusterSpec,
  config
);

// Delete cluster
await api.v1SpectroClustersDelete("cluster-uid", config);
```

### Advanced Configuration

You can customize the HTTP client behavior by passing additional Axios configuration options:

```typescript
import { init } from "palette-sdk-typescript";

const api = init();

const clusters = await api.v1SpectroClustersGet({
  baseURL: "https://api.spectrocloud.com",
  timeout: 30000,
  headers: {
    ApiKey: process.env.PALETTE_API_KEY,
    "Content-Type": "application/json",
  },
  // Any other Axios config options
  maxRetries: 3,
  retryDelay: 1000,
});
```

## API Reference

The SDK provides access to all Palette API endpoints. The main client function `init()` returns an object with 900+ API functions organized by resource type:

- **Clusters**: `v1SpectroClustersGet`, `v1SpectroClustersAwsCreate`, `v1SpectroClustersAzureCreate`, etc.
- **Cloud Accounts**: `v1CloudAccountsAwsList`, `v1CloudAccountsAzureList`, etc.
- **App Profiles**: `v1AppProfilesGet`, `v1AppProfilesCreate`, etc.
- **Cluster Profiles**: `v1ClusterProfilesGet`, `v1ClusterProfilesCreate`, etc.
- **Users & Teams**: `v1UsersGet`, `v1TeamsGet`, etc.
- **Projects**: `v1ProjectsGet`, `v1ProjectsCreate`, etc.
- **And many more...**

## TypeScript Support

The SDK includes comprehensive TypeScript definitions:

```typescript
import {
  init,
  V1SpectroCluster,
  V1AwsCloudAccount,
} from "palette-sdk-typescript";

const api = init();

// Typed responses
const clusters: V1SpectroCluster[] = await api.v1SpectroClustersGet(config);

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

The SDK uses Axios for HTTP requests, so you can handle errors using standard Axios error handling:

```typescript
try {
  const clusters = await api.v1SpectroClustersGet(config);
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
