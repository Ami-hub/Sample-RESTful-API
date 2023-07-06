FROM node:18-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src

COPY tsconfig.json ./

RUN npm run build

RUN rm -rf ./src

CMD [ "npm", "run", "start" ]