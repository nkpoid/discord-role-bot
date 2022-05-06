# build
FROM node:16-slim as build
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build


# package install
FROM node:16-slim as node_modules
WORKDIR /app

COPY . .
RUN yarn install --production


# Run
FROM gcr.io/distroless/nodejs:16
WORKDIR /app

COPY --from=build /app/dist dist/
COPY --from=node_modules /app/node_modules node_modules/

CMD [ "dist/index.js" ]
