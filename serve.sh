#!/bin/bash

# Simple script to serve the RVNUG website locally

# Check if Python 3 is installed
if command -v python3 &>/dev/null; then
    echo "Starting server with Python 3..."
    python3 -m http.server 8080
# Check if Python 2 is installed
elif command -v python &>/dev/null; then
    echo "Starting server with Python..."
    python -m SimpleHTTPServer 8080
# Check if Node.js is installed
elif command -v npx &>/dev/null; then
    echo "Starting server with npx serve..."
    npx serve -l 8080
else
    echo "Error: No suitable server found."
    echo "Please install Python 3, Python 2, or Node.js to run a local server."
    exit 1
fi 