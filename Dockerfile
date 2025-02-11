FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV PORT=1234

EXPOSE 1234

CMD ["npm", "run", "start:dist"]
