FROM registry.cn-shenzhen.aliyuncs.com/mwcloud/node:16.15.0 as base
WORKDIR /source
ENV NODE_OPTIONS="--max-old-space-size=10240"
ARG APPS=wcs-web,fcu-web,mapping-web,elsa-designer
# init
RUN npm install turbo@1.10.6 -g
RUN npm install pnpm -g
RUN pnpm config set registry https://registry.npmmirror.com
COPY . .
# https://turbo.build/repo/docs/reference/command-line-reference/prune
# RUN turbo prune --scope=$APP --docker
# RUN turbo prune $(echo $APPS | tr ',' ' --scope=' | sed -e 's/^/--scope=/') --docker
RUN scope_args=""
RUN for app in $(echo $APPS | tr ',' ' '); do \
    if [ "$app" != "elsa-designer" ]; then \
        scope_args="${scope_args} --scope=$app"; \
    fi; \
done && turbo prune $scope_args --docker

FROM base as builder
WORKDIR /source
ARG APPS
# install 
COPY .gitignore .gitignore
COPY --from=base /source/out/json/ .
COPY --from=base /source/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /source/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install
# # build app
COPY --from=base /source/out/full/ .
COPY turbo.json turbo.json
# RUN pnpm build --filter=${APP}...
# RUN pnpm build $(echo $APPS | tr ',' ' --filter=' | sed -e 's/^/--filter=/')
RUN filter_args=""
RUN for app in $(echo $APPS | tr ',' ' '); do filter_args="${filter_args} --filter=$app"; done && \
    pnpm build $filter_args
# build elsa
COPY --from=base /source/apps/elsa-designer/ ./apps/elsa-designer/
RUN for app in $(echo $APPS | tr ',' ' '); do \
    if [ "$app" != "elsa-designer" ]; then \
        pnpm build:elsa; \
        break; \
    fi; \
    done


# 选择更小体积的基础镜像
FROM registry.cn-shenzhen.aliyuncs.com/mwcloud/nginxwebui:latest
COPY --from=builder /source/dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
