FROM node:22-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY shared-core /shared-core
COPY site-2/package.json ./

RUN npm install file:/shared-core && npm install

COPY site-2 .

ENV SHARED_CORE_PATH=/shared-core
ENV PRODUCTS_DB_PATH=/shared-core/data/products.sqlite

EXPOSE 3001

CMD ["npm", "run", "dev"]
