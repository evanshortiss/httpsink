'use strict';

const http = require('http');
const log = require('barelog');
const { nanoid } = require('nanoid');
const hostname = require('os').hostname();

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
    const recv = new Date().toJSON();
    const uuid = nanoid();
    const { method, url } = req;
    let bodyBytesSize = 0;

    log(`(recv ${uuid}) ${req.method} ${req.url}`);

    req.on('data', (chunk) => {
      bodyBytesSize += Buffer.byteLength(chunk);
    });

    req.on('error', (e) => {
      log(`Error occurred for request - (${uuid}) ${req.method} ${req.url}:`);
      log(e);
    });

    req.on('end', () => {
      log(`(resp ${uuid}) ${req.method} ${req.url}`);
      res.setHeader('content-type', 'application/json');
      res.setHeader('connection', 'close');
      res.writeHead(200);
      res.end(
        JSON.stringify({
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          method,
          url,
          uuid,
          recv,
          resp: new Date().toJSON(),
          bodyBytesSize,
          totalBytesSize: req.socket.bytesRead,
          hostname
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
