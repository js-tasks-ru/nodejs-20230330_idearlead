const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit
    this.allChunks = 0;
  }

  _transform(chunk, encoding, callback) {
    let chunkLength = chunk.length;
    this.allChunks += chunkLength;
    if (this.allChunks > this.limit) {
      callback(new LimitExceededError())
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;

