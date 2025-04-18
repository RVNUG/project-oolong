# Project Oolong - RVNUG Website

This project uses Gatsby v2 from January 2020 and requires a specific Node.js environment.

## Getting Started with GitHub Codespaces (Recommended)

The easiest way to run this legacy project is to use GitHub Codespaces or VS Code Remote Containers, which will provide a preconfigured environment with Node.js 10 and Python 2.7:

1. Click the green "Code" button on the GitHub repository
2. Select "Open with Codespaces"
3. Click "New codespace"

Once the codespace is ready, run:

```bash
gatsby develop --host 0.0.0.0
```

The site will be available at the URL shown in the terminal (typically on port 8000).

## Alternative Docker Setup

An alternative approach is to use the Docker setup included in this repository.

### Prerequisites

- Docker and Docker Compose

### Running with Docker

```bash
# Start the development server
./run.sh start

# Once running, you can access:
# - The site at http://localhost:8000
# - The GraphQL explorer at http://localhost:9000/___graphql
```

### Other Docker Commands

```bash
# Build the site
./run.sh build

# Clean the Gatsby cache
./run.sh clean

# Open a shell inside the container
./run.sh shell
```

## Technical Details

### Environment

- Node.js 10.13.0 (required for this legacy project)
- Python 2.7 (required for node-gyp and node-sass)
- Gatsby 2.x

## Troubleshooting

If you encounter issues:

1. Try using GitHub Codespaces as mentioned above
2. Try cleaning the Gatsby cache: `gatsby clean`
3. Check that you're using Node.js 10.x and Python 2.7

## License

MIT
