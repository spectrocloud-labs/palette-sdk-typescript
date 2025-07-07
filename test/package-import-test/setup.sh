#!/bin/bash
# Copyright (c) Spectro Cloud
# SPDX-License-Identifier: Apache-2.0

set -e

echo "🚀 Setting up package import test..."

# Navigate to test directory
cd "$(dirname "$0")"

echo "📦 Installing palette-sdk-typescript from local path..."
npm install

echo "🧪 Running package import test..."
npm test

echo "✅ Package import test setup complete!" 