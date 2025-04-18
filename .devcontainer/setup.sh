#!/bin/bash
set -e

echo "Setting up Gatsby 2 environment..."

# Install specific versions of global packages
npm install -g gatsby-cli@2.12.52
npm install -g yarn@1.22.19

# Install project dependencies with legacy peer deps
npm install --legacy-peer-deps

# Print versions
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Yarn version: $(yarn -v)"
echo "Gatsby CLI version: $(gatsby --version)"

echo "Gatsby environment setup complete!" 