# Frontend Dockerfile (Expo Web)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Prebuild to generate native directories
RUN npx expo prebuild --platform web --clean

# Build web
RUN npx expo export --platform web

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]