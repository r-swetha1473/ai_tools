# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend code only
COPY server.js ./

# Expose the backend port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
