# Base image
FROM node:20-alpine AS base

# Set working directory for the API
WORKDIR /apps/eps/attendance-api

# Copy package.json and package-lock.json for installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
FROM base AS deps
RUN npm ci

# Copy all files and build the application
FROM deps AS build
COPY . .
COPY .env .env
RUN npm run build

# Runtime image
FROM base AS runtime
COPY --from=deps /apps/eps/attendance-api/node_modules ./node_modules
COPY --from=build /apps/eps/attendance-api/dist ./dist
COPY --from=build /apps/eps/attendance-api/.env .env

# Set environment variables
ENV NODE_ENV=production
ARG PORT
ENV PORT=${PORT}

# Expose the port
EXPOSE ${PORT}

# Start the Express server
CMD ["node", "./dist/main.js"]
