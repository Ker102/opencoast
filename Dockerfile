FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY shared/package.json shared/tsconfig.json ./shared/
COPY api/package.json api/tsconfig.json ./api/
COPY web/package.json ./web/
RUN npm ci
COPY shared/src ./shared/src
COPY api/src ./api/src
COPY api/db ./api/db
RUN npm run build -w shared && npm run build -w api
ENV NODE_ENV=production
USER node
EXPOSE 8080
CMD ["npm","run","start","-w","api"]
