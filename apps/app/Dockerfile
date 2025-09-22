# Use the official nginx image as base
FROM nginx:alpine

# Copy the built static files from the out folder to nginx html directory
COPY out/ /usr/share/nginx/html/

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
