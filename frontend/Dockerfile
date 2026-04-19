# Use Node.js image for building
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Use a lean runtime image
FROM node:20-slim
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app ./

# Cloud Run expects the app to listen on the port defined by the PORT environment variable
ENV PORT 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
