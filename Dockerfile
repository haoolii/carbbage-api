FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "start:dist"]
