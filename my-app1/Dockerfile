FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This creates the 'dist' folder with optimized static files
RUN npm run build

# --- STAGE 2: SERVE WITH NGINX ---
FROM nginx:alpine

# Delete default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy our React build to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom configuration (File 3)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]