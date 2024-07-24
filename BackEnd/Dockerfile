
FROM node:20

RUN npm install --force

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

CMD ["npm", "run", "start"]

# EXPOSE 4000

