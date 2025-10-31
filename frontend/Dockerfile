FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# npm ci misses some platform-specific native binaries on musl (npm bug #4828),
# so install them explicitly after the clean install.
RUN npm ci \
    && npm install --no-save @rollup/rollup-linux-x64-musl @swc/core-linux-x64-musl

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
