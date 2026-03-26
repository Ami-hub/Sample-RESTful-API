FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine AS runner

WORKDIR /app

ARG PORT=3000

ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

USER node

EXPOSE $PORT

CMD ["node", "dist/startServer.js"]
