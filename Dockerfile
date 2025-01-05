# Stage 1: Build
FROM node:18 as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy necessary config files
COPY --from=build /usr/src/app/.env .env

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]