# build environment
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm cache clean --force  
RUN npm install --force
RUN npm run build

# production environment
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]