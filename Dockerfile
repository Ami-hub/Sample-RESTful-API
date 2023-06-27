FROM node:17

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY src ./src

COPY tsconfig.json ./

RUN npm run build

RUN rm -rf ./src

CMD [ "npm", "run", "start" ]