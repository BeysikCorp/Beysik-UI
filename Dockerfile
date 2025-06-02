FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --only=production
RUN npm install -g serve
EXPOSE 8001
CMD ["npx", "serve", "-s", "dist", "-l", "8001"]

