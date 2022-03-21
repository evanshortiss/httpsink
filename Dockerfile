# Second stage copies the application to the minimal image
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal

COPY package*.json .

RUN npm ci --only=production

ENV SINK_PORT=8080
ENV SINK_HOST="0.0.0.0"

COPY bin/ bin/
COPY index.js .

# Expose the http port
EXPOSE $SINK_PORT

# Run script uses standard ways to run the application
CMD node bin/httpsink.js --host ${SINK_HOST} --port ${SINK_PORT}