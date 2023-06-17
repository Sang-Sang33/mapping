
FROM node:16.15.0 as builder

WORKDIR /source

COPY . .
# ADD package.json /source

RUN rm -rf dist && rm -rf node_modules && npm install pnpm -g &&  pnpm config set registry https://registry.npmmirror.com  && pnpm install && pnpm build

COPY . /source


# 选择更小体积的基础镜像
FROM cym1102/nginxwebui:latest

COPY --from=builder /source/dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
