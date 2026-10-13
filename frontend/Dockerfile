ARG NODE_VERSION=24.19.0-trixie-slim

# installs the locked dependencies and builds the standalone server.
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# runs the standalone server as the non-root node user.
FROM node:${NODE_VERSION}
WORKDIR /app
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build --chown=node:node /app/public ./public

RUN mkdir .next && chown node:node .next
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]