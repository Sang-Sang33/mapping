
FROM node:14.18.3 as builder

# ENV PROJECT_ENV production
# ENV NODE_ENV production

# http-server 不变动也可以利用缓存
WORKDIR /source

COPY . .
# ADD package.json /source

RUN rm -rf yarn.lock
RUN rm -rf dist
RUN rm -rf node_modules

RUN yarn config set registry https://registry.npmmirror.com && yarn install && yarn build

COPY . /source


# 选择更小体积的基础镜像
FROM cym1102/nginxwebui:latest

COPY --from=builder /source/dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
