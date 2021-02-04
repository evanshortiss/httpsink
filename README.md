# HTTP Sink

A trivial HTTP Sinkhole.

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

### Reponse Format

Each request receives the same response format:

```js
{
  // Unique ID generated for this request
  "uuid": "pDo-u-eOpxiVH_15aSV05",

  // When the server started processing the request
  "recv": "2021-02-04T19:25:03.740Z",

  // When the server sent the response
  "resp": "2021-02-04T19:25:03.744Z",

  // Bytes read for a request that sends a body
  "bytesRead": 0

  // Method and path that was requested
  "method":"POST",
  "path":"/json-test"
}
```
