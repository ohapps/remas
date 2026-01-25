# Stage 1: Build the application
FROM node:16 AS build-stage
WORKDIR /app
COPY package*.json ./
# For faster builds, use npm ci if package-lock exists
RUN npm install
COPY . .

# Build Arguments for environment variables
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_SENTRY_DSN

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# How to build with environment variables:
# docker build \
#   --build-arg REACT_APP_GOOGLE_MAPS_API_KEY=your_key \
#   -t remas-web .