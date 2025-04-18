FROM node:10-buster

# Set working directory
WORKDIR /app

# Install system dependencies including Python 2.7
RUN apt-get update && apt-get install -y \
    python2.7 \
    make \
    g++ \
    && ln -sf /usr/bin/python2.7 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Gatsby CLI
RUN npm install -g gatsby-cli@2.12.52

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./

# Set environment variables to disable/skip image processing packages
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV GATSBY_DISABLE_SHARP=1
ENV npm_config_sharp_binary_host="https://npmmirror.com/mirrors/sharp"
ENV npm_config_sharp_libvips_binary_host="https://npmmirror.com/mirrors/sharp-libvips"
ENV NODE_ENV=development

# Install dependencies but skip optional dependencies (which includes sharp)
RUN npm install --no-optional

# Copy the rest of the application
COPY . .

# Expose Gatsby's development port
EXPOSE 8000

# Command to start Gatsby development server
CMD ["gatsby", "develop", "--host", "0.0.0.0"] 