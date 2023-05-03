# Base image
FROM node:18.15.0

# Install pnpm globally
RUN npm i -g pnpm

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN pnpm i

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}




