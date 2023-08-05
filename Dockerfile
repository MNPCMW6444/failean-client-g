FROM node:lts as BUILDER
WORKDIR /app
ARG CODEARTIFACT_TOKEN
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY src /app/src
COPY website /app/website
COPY server.js /app/server.js
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set @failean:registry https://failean-988253048728.d.codeartifact.us-east-1.amazonaws.com/npm/failean/ && \
    echo "//failean-988253048728.d.codeartifact.us-east-1.amazonaws.com/npm/failean/:_authToken=${CODEARTIFACT_TOKEN}" > .npmrc
RUN npm run prod
RUN npm run clean:prod
RUN npm i --omit=dev
RUN rm -rf .npmrc
FROM node:slim
WORKDIR /app
COPY package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/website /app/website
COPY --from=builder /app/src/manifiestJSONData.js /app/src/manifiestJSONData.js
COPY server.js /app/server.js
CMD ["node", "./server.js"]
EXPOSE 5999