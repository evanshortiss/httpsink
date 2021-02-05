'use strict';

const test = require('tape');
const http = require('http');
const sinkhole = require('../index');
const { randomBytes } = require('crypto');

test('create a sinkhole listening on 127.0.0.1:8080', (t) => {
  sinkhole()
    .then((server) => {
      t.ok(server);
      t.equal(server.address().port, 8080);
      t.equal(server.address().address, '127.0.0.1');

      server.close((err) => t.end(err));
    })
    .catch((e) => t.end(e));
});

test('create a sinkhole listening on 0.0.0.0:3000', (t) => {
  const opts = {
    host: '0.0.0.0',
    port: 3000
  };

  sinkhole(opts)
    .then((server) => {
      t.ok(server);
      t.equal(server.address().port, opts.port);
      t.equal(server.address().address, opts.host);

      server.close((err) => t.end(err));
    })
    .catch((e) => t.end(e));
});

test('sinkhole response format and time calculation', (t) => {
  sinkhole()
    .then((server) => {
      const requestByteCount = 50;
      const requestDurationMs = 25;
      const { address, port } = server.address();
      console.log(`http://${address}:${port}/`);

      const request = http.request(
        {
          host: address,
          port,
          method: 'POST'
        },
        (res) => {
          let chunks = '';

          res.setEncoding('utf8');
          res.on('data', (chunk) => (chunks += chunk));
          res.on('end', () => {
            const {
              uuid,
              ip,
              recv,
              resp,
              bodyBytesSize,
              totalBytesSize,
              method,
              url
            } = JSON.parse(chunks);

            t.isEqual(ip, '127.0.0.1');
            t.isEqual(method, 'POST');
            t.isEqual(url, '/');
            t.isEqual(typeof uuid, 'string');
            t.isEqual(typeof recv, 'string');
            t.isEqual(typeof resp, 'string');
            t.isEqual(typeof bodyBytesSize, 'number');
            t.isEqual(typeof totalBytesSize, 'number');

            // Verify the request duration was close to the specified duration
            // Timers are not accurate, so give 15% leeway. Yes, 15% variance!
            const time = new Date(resp).getTime() - new Date(recv).getTime();
            t.ok(time >= requestDurationMs * 0.85);

            // Bytes read should be equal to those sent
            t.isEqual(bodyBytesSize, requestByteCount);

            server.close((err) => t.end(err));
          });
        }
      );

      // Write a specific number of random bytes
      request.write(randomBytes(requestByteCount));

      // End the request and let the server respond after a delay
      setTimeout(() => request.end(), requestDurationMs);
    })
    .catch((e) => t.end(e));
});
