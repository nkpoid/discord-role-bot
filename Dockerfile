# Build
FROM node:16-slim as build
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build


# Run
FROM gcr.io/distroless/nodejs:16
WORKDIR /app

COPY --from=build /app/dist/index.js index.js

CMD [ "index.js" ]
