FROM alpine:3.8

RUN apk add nodejs-current npm python2 build-base git
RUN npm install -g http-server

WORKDIR /tmp

RUN git clone https://github.com/ForgeRock/end-user-ui.git

WORKDIR /tmp/end-user-ui

RUN git checkout 6.5.1 && npm install && npm run build

WORKDIR /tmp/end-user-ui/dist

EXPOSE 8888

CMD ["http-server", "-p", "8888"]
