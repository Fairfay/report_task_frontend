FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=1096

RUN npm run build

CMD ["npm", "start", "--max-old-space-size=1096"]