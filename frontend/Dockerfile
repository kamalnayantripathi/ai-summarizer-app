# Frontend Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Vite app
RUN npm run build

# Expose the preview port
EXPOSE 4173

# Serve the production build using Vite's built-in preview server
CMD ["npm", "run", "preview", "--", "--host"]
