# Use Node.js to build and run the app
FROM node:22

# Set working folder
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Open the port
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev", "--", "--host"]