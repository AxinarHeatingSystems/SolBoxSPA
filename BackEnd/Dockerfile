
FROM node:20

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY --chown=node:node . .

COPY . .

CMD ["npm", "run", "start"]

# EXPOSE 4000

