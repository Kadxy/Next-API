FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code (excluding .env for security)
COPY . .
# Remove .env file from image for security
RUN rm -f .env

# Generate Prisma clients for Linux platform
RUN pnpm run prisma:generate

# Build the application
RUN pnpm run build

# Manually copy Prisma engines to dist (ensure Linux binaries are available)
RUN cp -r prisma/main/generated dist/prisma/main/ || true
RUN cp -r prisma/detail/generated dist/prisma/detail/ || true



# Expose port
EXPOSE 9527

# Start the application
CMD ["node", "dist/src/main.js"]
