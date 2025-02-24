# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the server runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]