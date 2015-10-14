FROM node:0.12.0

MAINTAINER Cai Guanhao (caiguanhao@gmail.com)

WORKDIR /x2s

RUN python2.7 -c 'from urllib import urlopen; from json import loads; \
    print(loads(urlopen("http://ip-api.com/json").read().decode("utf-8" \
    ).strip())["countryCode"])' > /tmp/country

RUN test "$(cat /tmp/country)" = "CN" && { \
    (echo "registry = https://registry.npm.taobao.org" && \
    echo "disturl = https://npm.taobao.org/dist") \
    > ~/.npmrc; \
    } || true

ENV NODE_ENV production

ADD package.json /x2s/package.json

RUN npm --loglevel http install

CMD ["npm", "run", "start"]

ADD . /x2s
