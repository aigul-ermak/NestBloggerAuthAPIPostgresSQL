# Use Node.js version 20 base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Enable Corepack and prepare the correct Yarn version
RUN corepack enable && corepack prepare yarn@4.4.0 --activate

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Run the application in production mode
CMD ["yarn", "start:prod"]

