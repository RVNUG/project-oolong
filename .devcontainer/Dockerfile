FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Update and install essential packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    git \
    wget \
    curl \
    ca-certificates \
    gnupg \
    lsb-release \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install Playwright dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install Python dependencies and Playwright
RUN pip3 install --no-cache-dir playwright \
    && playwright install-deps

# Configure Python and Node.js are installed via features in devcontainer.json
# This Dockerfile can be extended for additional customizations