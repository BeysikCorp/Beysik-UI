FROM node:18 AS build
WORKDIR /beysik-ui
COPY . .
RUN npm install
RUN vite build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
