#!/bin/bash

# Script to set up Vitest testing environment

echo "Setting up Vitest testing environment..."

# Remove existing test-related dependencies
npm uninstall @testing-library/jest-dom @testing-library/react @testing-library/user-event vitest jsdom c8

# Install compatible versions
npm install --save-dev \
  @testing-library/jest-dom@^6.1.5 \
  @testing-library/react@^14.1.2 \
  @testing-library/user-event@^14.5.1 \
  jsdom@^22.1.0 \
  vitest@^0.34.6 \
  c8@^8.0.1

echo "Test dependencies installed. Now you can run tests with: npm test" 