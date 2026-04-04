# Backend Dockerfile
FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "src/index.js"]