
// pickup - transform RSS feed to JSON

var sax = require('sax')
  , Transform = require('stream').Transform

module.exports = function () {
  var state = {
    channel:false
  , title:false
  , subtitle:false
  , link:false
  , description:false
  , item:false
  , items:false
  }

  var parser = sax.parser(true)
    , channel = Object.create(null)
    , item = null
    , name = null

  var CHANNEL = 'channel'
    , ITEM = 'item'
    , TITLE = 'title'
    , DESCRIPTION = 'description'
    , LINK = 'link'
    , SUBTITLE = 'itunes:subtitle'

  var channelMap = {
    'title':'title'
  , 'description':'description'
  , 'link':'link'
  }

  var itemMap = {
    'title':'title'
  , 'itunes:subtitle':'subtitle'
  , 'itunes:author':'author'
  , 'itunes:summary':'summary'
  }

  parser.ontext = function (t) {
    var pair = state.item ? [item, itemMap] : [channel, channelMap]
      , key = pair[1][name]
      , target = pair[0]

    if (key && !target[key]) {
      target[key] = t
    }
  }

  parser.onopentag = function (node) {
    name = node.name

    if (node.name === CHANNEL) {
      stream.push('{ "channel":')
      state.channel = true
    }

    if (node.name === ITEM) {
      if (!state.items) {
        stream.push(JSON.stringify(channel) + ',"items":[')
        stream.emit(CHANNEL, channel)
      } else {
        stream.push(',')
      }
      state.channel = false
      state.items = true
      state.item = true
      item = Object.create(null)
    }

    state.title = node.name === TITLE
    state.description = node.name === DESCRIPTION
    state.link = node.name === LINK
    state.subtitle = node.name === SUBTITLE
  }

  parser.onclosetag = function (name) {
    switch (name) {
      case TITLE:
        state.title = false
        break
      case ITEM:
        state.item = false
        stream.push(JSON.stringify(item))
        stream.emit(ITEM, item)
        item = null
        break
      case CHANNEL:
        stream.push(']}')
        Object.keys(state).forEach(function (key) {
          state[key] = false
        })
        channel = null
        item = null
        break
    }
  }

  var stream = new Transform({
    highWaterMark: 10
  })

  stream._transform = function (chunk, encoding, callback) {
    if (parser.write(chunk.toString())) {
      callback()
    }
  }

  return stream
}
