
# pickup - transform feeds to JSON

The **pickup** [Node](http://nodejs.org/) package provides a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream to transform RSS 2.0 (including iTunes namespace extensions) and Atom 1.0 formatted XML to JSON.

[![Build Status](https://secure.travis-ci.org/michaelnisi/pickup.svg)](http://travis-ci.org/michaelnisi/pickup)

## Usage

### Command-line

To pipe Benjamen Walker's [Theory of Everything](http://toe.prx.org/) to **pickup** do:

```
$ curl -sS http://feeds.prx.org/toe | pickup
```

If you haven't yet, I recommend to install **[json](https://github.com/trentm/json)**, a command for working with JSON on the command-line:

```
$ npm install -g json
```

Now you can pipe **pickup** to **json** to see nicely formatted JSON:

```
$ curl -sS http://feeds.prx.org/toe | pickup | json
```

**json** lets you massage the data. Let's check Apple's latest PR:

```
$ curl -sS https://www.apple.com/pr/feeds/pr.rss | pickup \
    | json -ga entries | json -ga title | head -n 5
```

### Library

#### Transform from stdin to stdout

```js
var pickup = require('pickup')

process.stdin
  .pipe(pickup())
  .pipe(process.stdout)
```

You can run this example from the command-line:

```
$ curl -sS http://feeds.prx.org/toe | node example/stdin.js | json
```

#### Proxy server

```js
var http = require('http')
var pickup = require('pickup')

http.createServer(function (req, res) {
  http.get('http:/'.concat(req.url), function (feed) {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
```

To try the proxy server:

```
$ node example/proxy.js &
$ curl -sS http://localhost:8080/feeds.prx.org/toe | json
```

## types

### feed()

```js
- author String() | undefined
- copyright String() | undefined
- id String() | undefined
- image String() | undefined
- language String() | undefined
- link String() | undefined
- payment String() | undefined
- subtitle String() | undefined
- summary String() | undefined
- title String() | undefined
- ttl String() | undefined
- updated String() | undefined
```

### enclosure()

```js
- href String() | undefined
- length String() | undefined
- type String() | undefined
```

### entry()

```js
- author String() | undefined
- enclosure enclosure() | undefined
- duration String() | undefined
- id String() | undefined
- image String() | undefined
- link String() | undefined
- subtitle String() | undefined
- summary String() | undefined
- title String() | undefined
- updated String() | undefined
```

### Event:'feed'
```js
feed()
```
Emitted when the meta information of the feed gets available.

### Event:'entry'
```js
entry()
```
Emitted for each entry.

## exports

**pickup** exports a single function that returns a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream. Additionally to its [Stream](http://nodejs.org/api/stream.html) events (usually all you need) it emits `entry` events and a `feed` event which is emitted when information about the feed gets available. For each item in the input feed an `entry` event with the parsed data is emitted.

## Installation

With [npm](https://npmjs.org/package/pickup) do:

```
$ npm install pickup
```

To use the CLI (as above):

```
$ npm install -g pickup
```

## Contribute

Please create an issue if you encounter a feed that **pickup** fails to parse.

## License

[MIT License](https://raw.github.com/michaelnisi/pickup/master/LICENSE)
