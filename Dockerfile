# Stage 1: Build
FROM node:18 as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the entire application and the public directory
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies using yarn
RUN yarn install --production

# Copy built application and public directory
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/public ./public

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
