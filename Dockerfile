# ---- build ----
FROM node:22 AS builder

WORKDIR /build

ENV BACKEND_URL https://bjsh98db-backend.onrender.com/:path*

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm config set registry https://registry.npmmirror.com

RUN pnpm install

COPY . .

RUN pnpm build

# ---- run ----
FROM node:22 AS runner

ENV NODE_ENV=production
ENV PORT=10000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

COPY --from=builder /build/.next/standalone .

COPY --from=builder /build/.next/static .next/static

COPY --from=builder /build/public public

EXPOSE 10000

CMD ["node", "server.js"]
