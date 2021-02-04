'use strict';

const http = require('http');
const log = require('barelog');
const { nanoid } = require('nanoid');

/**
 * @typedef {Object} SinkHoleOptions
 * @property {Number} port
 * @property {String} host
 */

/**
 * Initialise a sinkhole server with the given options.
 * @param {SinkHoleOptions} options
 * @returns {Promise<http.Server>}
 */
module.exports = (options) => {
  if (!options) {
    options = {
      host: 'localhost',
      port: 8080
    };
  }

  let { port = 8080, host = 'localhost' } = options;

  const server = http.createServer((req, res) => {
    const uuid = nanoid();
    const { method, url } = req;
    let bytesRead = 0;
    let recv = new Date().toJSON();

    log(`(recv ${uuid}) ${req.method} ${req.url}`);

    req.on('data', (chunk) => {
      bytesRead += Buffer.byteLength(chunk);
    });

    req.on('error', (e) => {
      log(`Error occurred for request - (${uuid}) ${req.method} ${req.url}:`);
      log(e);
    });

    req.on('end', () => {
      log(`(resp ${uuid}) ${req.method} ${req.url}`);
      res.writeHead(200);
      res.end(
        JSON.stringify({
          method,
          path: url,
          uuid,
          recv,
          resp: new Date().toJSON(),
          bytesRead
        })
      );
    });
  });

  return new Promise((resolve, reject) => {
    try {
      server.listen(port, host, () => resolve(server));
    } catch (e) {
      reject(e);
    }
  });
};
