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

# Configure Python and Node.js are installed via features in devcontainer.json
# This Dockerfile can be extended for additional customizations