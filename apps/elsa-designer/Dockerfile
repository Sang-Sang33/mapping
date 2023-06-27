
FROM node:14.18.3 as builder

WORKDIR /source

COPY . .

RUN rm -rf node_modules && npm config set registry https://registry.npmmirror.com && npm install && npm run build:web

COPY . /source


# 选择更小体积的基础镜像
FROM cym1102/nginxwebui:latest

COPY --from=builder /source/www/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

