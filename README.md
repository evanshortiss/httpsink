# HTTP Sink

A trivial HTTP Sinkhole. Always returns a 200 OK and JSON response body with
request details.

## Usage

### CLI

Start a sinkhole on port 8080 using npx:

```bash
# Listen on the default localhost:8080
npx httpsink
```

Alternatively install the module globally, then start a sinkhole:

```bash
npm install -g httpsink

# Listen on port 3000 on a public interface
httpsink --port 3000 --host '0.0.0.0'
```

### Docker via Pre-built Image

Exposes the sinkhole on port 8080:

```bash
docker run --rm -p 8080:8080 quay.io/evanshortiss/httpsink
```

You can specify a version tag if desired.

### Docker via npx

Uses npx to download the latest version of `httpsink`, and exposes the sinkhole on port 8080:

```bash
docker run -p 8080:8080 --rm --entrypoint /bin/sh node:14-alpine -c 'npx httpsink --host "0.0.0.0" --port 8080'
```


### Module

```js
const sinkhole = require('httpsink')

async function main () {
  // Create a sinkhole that listens on port 8080
  const server = await sinkhole({
    port: 8080
  })

  // ...sometime later call server.close() when you're done
  server.close()
}

main()
```

### Response Format

Each request receives the same response format:

```js
{
  // IP the server determines to be the origin of your request
  "ip": "127.0.0.1",

  // Unique ID generated for this request
  "uuid": "pDo-u-eOpxiVH_15aSV05",

  // When the server started processing the request
  "recv": "2021-02-04T19:25:03.740Z",

  // When the server sent the response
  "resp": "2021-02-04T19:25:03.744Z",

  // Bytes read for a request that sends a body
  "bodyBytesSize": 0

  // Bytes read for the entire HTTP transmission
  "totalBytesSize": 124

  // Method and URL that was requested
  "method":"POST",
  "url":"/json-test"
}
```
