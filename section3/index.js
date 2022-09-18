const stream = require('stream')

class HelloReadableStream extends stream.Readable {
  constructor(options) {
    super(options)
    this.languages = ['JavaScript', 'Python', 'Java', 'C#']
  }

  _read(size) {
    console.log('_read()')
    let language
    while ((language = this.languages.shift())) {
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log('読み込み中断')
        return
      }
    }
    console.log('読み込み完了')
    this.push(null)
  }
}

class LineTransformStream extends stream.Transform {
  remaining = ''
  constructor(options) {
    super({ readableObjectMode: true, ...options })
  }

  _transform(chunk, _encoding, callback) {
    console.log('_transform()')
    const lines = (chunk + this.remaining).split(/\n/)
    this.remaining = lines.pop()
    for (const line of lines) {
      this.push({ message: line, delay: line.length * 100 })
    }
    callback()
  }

  _flush(callback) {
    console.log('_flush()')
    this.push({
      message: this.remaining,
      delay: this.remaining.length * 100,
    })
    callback()
  }
}

class DelayLogStream extends stream.Writable {
  constructor(options) {
    super({ objectMode: true, ...options })
  }

  _write(chunk, _encoding, callback) {
    console.log('_write()')
    const { message, delay } = chunk
    setTimeout(() => {
      console.log(message)
      callback()
    }, delay)
  }
}

new HelloReadableStream()
  .pipe(new LineTransformStream())
  .pipe(new DelayLogStream())
  .on('finish', () => console.log('完了'))
