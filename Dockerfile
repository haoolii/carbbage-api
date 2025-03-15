FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g pm2

ENV PORT=4321

EXPOSE 4321

CMD ["pm2-runtime", "npm", "--", "run", "start:dist"]

