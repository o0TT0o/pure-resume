# Use Node.js 24 official image
FROM node:24-slim

# Set working directory
WORKDIR /app

# Install system dependencies (required by Puppeteer)
RUN apt-get update \
    && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Pandoc (for Word export)
RUN apt-get update \
    && apt-get install -y pandoc \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Use npm mirror (controlled by BUILD_ARG)
ARG USE_CN_MIRROR=false
RUN if [ "$USE_CN_MIRROR" = "true" ]; then \
      npm config set registry https://registry.npmmirror.com; \
    fi

# Configure Puppeteer to skip Chromium download (controlled by BUILD_ARG)
ARG SKIP_CHROMIUM_DOWNLOAD=false
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=$SKIP_CHROMIUM_DOWNLOAD
ARG PUPPETEER_EXECUTABLE_PATH=
ENV PUPPETEER_EXECUTABLE_PATH=$PUPPETEER_EXECUTABLE_PATH

# Install dependencies (explicitly use package-lock.json)
RUN npm ci --only=production

# If skipping Chromium download, install via system package manager
RUN if [ "$SKIP_CHROMIUM_DOWNLOAD" = "true" ]; then \
      apt-get update \
      && apt-get install -y chromium \
      && rm -rf /var/lib/apt/lists/*; \
    fi

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data \
    /app/languages \
    /app/templates \
    /app/logs \
    /app/uploads \
    /app/backup \
    /app/public/images

# Set permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/server.js"]
