FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn compile

# ─── Production image ────────────────────────────────────────────────────────

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-engines --production

COPY --from=builder /app/dist ./dist
COPY emails ./emails

EXPOSE 5000

CMD ["node", "dist/server"]
