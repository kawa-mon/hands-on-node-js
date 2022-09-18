const fs = require('fs')

const fileWriteStream = fs.createWriteStream('section3/dest.txt')
fileWriteStream.write('Hello\n')
fileWriteStream.write('World\n')
fileWriteStream.end()
fs.readFileSync('section3/dest.txt', 'utf8')
