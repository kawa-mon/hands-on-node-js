const fs = require('fs')

const readStream = fs.createReadStream('section3/src.txt')
readStream
  .on('readable', () => {
    console.log('readable')
    let chunk
    while ((chunk = readStream.read()) !== null) {
      console.log(`chunk: ${chunk.toString()}`)
    }
  })
  .on('end', () => {
    console.log('end')
  })
