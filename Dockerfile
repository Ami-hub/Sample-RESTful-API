FROM node:current-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

FROM node:current-alpine AS runner

ARG PORT=3000

ENV NODE_ENV=production
ENV PORT=$PORT

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

EXPOSE $PORT

CMD ["node", "dist/startServer.js"]