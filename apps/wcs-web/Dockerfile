
FROM node:14.18.3 as builder

WORKDIR /source

COPY . .
# ADD package.json /source

RUN rm -rf dist && rm -rf node_modules && yarn config set registry https://registry.npmmirror.com && yarn add antd@4.24.7 && yarn install && yarn build

COPY . /source


# 选择更小体积的基础镜像
FROM cym1102/nginxwebui:latest

COPY --from=builder /source/dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
