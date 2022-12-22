FROM node:16-alpine
WORKDIR /usr/src/app
RUN mkdir docker-uploads
ARG EXPRESS_PORT
EXPOSE ${EXPRESS_PORT}
ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET}
ARG HASURA_GRAPHQL_V1_HOST
ENV HASURA_GRAPHQL_V1_HOST ${HASURA_GRAPHQL_V1_HOST}
ARG ACTION_SECRET
ENV ACTION_SECRET ${ACTION_SECRET}
RUN apk add yarn
COPY package.json yarn.lock ./
RUN yarn install
# COPY .env ./
COPY server.js ./
COPY express ./express
# CMD ["node", "server.js"]
CMD ["yarn", "service:dev"]