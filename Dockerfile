FROM node:22-alpine AS builder
RUN apk add --no-cache git
RUN corepack enable pnpm
WORKDIR /app
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3001
