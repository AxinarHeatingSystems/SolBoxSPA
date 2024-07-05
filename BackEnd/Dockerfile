
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "prod"]

# EXPOSE 4000

