# Use the official Node.js image matching your environment
FROM node:22.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the development server port
EXPOSE 5173

# Command to start the development server
CMD ["npm", "run", "dev"]
