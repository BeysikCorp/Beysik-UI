FROM node:18 AS build
WORKDIR /beysik-ui
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /beysik-ui/dist /usr/share/nginx/html
EXPOSE 8001
