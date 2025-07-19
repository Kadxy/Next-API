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

# Build the application (Prisma clients already in git)
RUN pnpm run build

# Expose port
EXPOSE 9527

# Start the application
CMD ["node", "dist/src/main.js"]
