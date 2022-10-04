FROM node:16
WORKDIR /app

RUN npm install typescript -g \
    && npm install @angular/cli -g

WORKDIR /app/api
COPY api/package*.json ./
RUN npm install

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

WORKDIR /app

COPY . .

EXPOSE 4200
EXPOSE 5200

ENV NG_CLI_ANALYTICS=ci

CMD ["bash", "run.sh"]