# 第一階段：構建階段
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY build.js ./
COPY prisma/schema.prisma ./prisma/

RUN npm install
RUN npx prisma generate
RUN ls -lh /app/node_modules/.prisma/client

COPY src ./src
RUN npm run build

# 第二階段：運行階段
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/schema.prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# 安裝必要依賴並檢查引擎檔案
RUN npm install --production --no-optional @prisma/client prisma \
    && npm install pm2 --global --no-optional \
    && npm cache clean --force \
    && ls -lh /app/node_modules/.prisma/client

ENV PORT=4321
EXPOSE 4321

CMD ["pm2-runtime", "start", "dist/index.js"]