
FROM node:16.15.0 as builder

WORKDIR /source

COPY . .
# ADD package.json /source

RUN rm -rf node_modules && npm install pnpm -g && pnpm install && pnpm build:web

COPY . /source


# 选择更小体积的基础镜像
FROM cym1102/nginxwebui:latest

COPY --from=builder /source/apps/fcu-web/dist/ /usr/share/nginx/html/fcu-web/
COPY --from=builder /source/apps/mapping-web/dist/ /usr/share/nginx/html/mapping-web/
COPY --from=builder /source/apps/wcs-web/dist/ /usr/share/nginx/html/wcs-web/
COPY default.conf /etc/nginx/conf.d/default.conf
