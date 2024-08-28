FROM node:16-alpine

LABEL maintainer=brian@toimc.com

# 创建一个工作目录
WORKDIR /app

COPY . .

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && apk update


RUN apk --no-cache add --virtual builds-deps build-base python3 alpine-sdk 
RUN apk add --upgrade --no-cache vips-dev --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/ 
RUN npm rebuild bcrypt --build-from-source 
RUN apk del builds-deps

EXPOSE 3000 3001

VOLUME [ "/app/public" ]

CMD [ "node", "dist/server.bundle.js" ]s