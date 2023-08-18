FROM node:current-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src

COPY tsconfig.json ./

RUN npm run build

RUN rm -rf ./src

CMD [ "npm", "run", "start" ]