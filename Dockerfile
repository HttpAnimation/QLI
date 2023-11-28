# Use the official Node.js image as a base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Node.js application
CMD ["node", "server.js"]
