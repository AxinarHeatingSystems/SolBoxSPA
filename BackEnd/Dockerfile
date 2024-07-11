
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
RUN npm install

CMD ["npm", "run", "start"]

# EXPOSE 4000

