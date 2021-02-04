#!/usr/bin/env node
'use strict';

const meow = require('meow');
const sinkhole = require('../index');
const log = require('barelog');

const cli = meow(
  `
	Usage
	  $ httpsink

	Options
    --port, -p  Specify a port to listen on. Defaults to 8080
    --host, -h  Specify a host to listen on. Defaults to localhost

	Examples
	  $ httpsink --port 3000 --host '0.0.0.0'
`,
  {
    flags: {
      port: {
        type: 'number',
        alias: 'p'
      },
      host: {
        type: 'string',
        alias: 'h'
      }
    }
  }
);

sinkhole(cli.flags)
  .then((server) => {
    log(`HTTP Sinkhole listening on port ${server.address().port}...\n`);
  })
  .catch((e) => {
    log(`Server was unable to start listening. Reason:\n`);
    log(e);
  });
