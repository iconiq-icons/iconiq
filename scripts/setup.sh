#!/bin/bash
set -e

# Check Node.js version
NODE_VERSION=$(node -v)
if [[ ! "$NODE_VERSION" =~ ^v22 ]]; then
  echo "Warning: You are using Node.js $NODE_VERSION. This project is optimized for Node.js v22.x LTS."
  echo "Consider upgrading to the LTS version for best compatibility."
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "pnpm is not installed, installing pnpm v10.11.0..."
  npm install -g pnpm@10.11.0
fi

# Check pnpm version
PNPM_VERSION=$(pnpm --version)
if [[ "$PNPM_VERSION" != "10.11.0"* ]]; then
  echo "Current pnpm version is $PNPM_VERSION, but we need 10.11.0. Installing..."
  npm install -g pnpm@10.11.0
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Setup Git hooks
echo "Setting up Git hooks..."
pnpm husky init

echo "Setup complete! You can now run 'pnpm dev' to start development."
