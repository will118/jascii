FROM node:13.5.0-alpine3.11

RUN apk add libcaca

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]
