FROM node:lts-alpine

WORKDIR /app/frontend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .


# Serve the React app
EXPOSE 3000
CMD ["npm", "start"]