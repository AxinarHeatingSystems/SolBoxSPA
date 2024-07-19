# build environment
FROM node:20
WORKDIR /app
COPY . .
RUN yarn cache clean --force
RUN yarn install --force
RUN yarn build

# production environment
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]