# Stage 1: Base
FROM node:22-alpine AS base
RUN npm install -g pnpm

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
# Install only production dependencies
RUN pnpm install --only=production

# Stage 3: Builder
FROM dependencies AS builder
COPY ./dist ./dist

# Stage 4: Production
# The final, lean production image.
FROM node:22-alpine AS production

# Copy production dependencies and built files from previous stages
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Security: Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port your application listens on
EXPOSE 3000

# Start the application
CMD ["node", "dist/servers/BoilerplateServer.js"]
