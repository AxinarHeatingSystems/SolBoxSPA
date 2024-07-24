
FROM node:20

WORKDIR /usr/src/app
RUN npm install --force
COPY package*.json ./
COPY . .

CMD ["npm", "run", "start"]

# EXPOSE 4000

