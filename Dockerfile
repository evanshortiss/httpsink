FROM registry.access.redhat.com/ubi8/nodejs-18-minimal

COPY package*.json .

RUN npm ci --only=production

ENV SINK_PORT=8080
ENV SINK_HOST="0.0.0.0"

COPY bin/ bin/
COPY index.js .

EXPOSE $SINK_PORT

CMD node bin/httpsink.js --host ${SINK_HOST} --port ${SINK_PORT}
