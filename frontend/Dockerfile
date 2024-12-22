FROM node:18-alpine as build
WORKDIR /app
COPY client-app/package*.json ./

RUN npm install --force

COPY client-app/ .

RUN npm run build


FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
