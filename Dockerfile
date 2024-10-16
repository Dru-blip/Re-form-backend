FROM node:20-alpine


WORKDIR /home/src

COPY package.*json ./

RUN npm install

COPY . .

RUN npx prisma db push
RUN npm run build

CMD [ "npm","run","start:prod" ]