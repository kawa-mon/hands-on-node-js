const fs = require('fs')
const crypto = require('crypto')

function copyFileWithStream(src, dest, cb) {
  fs.createReadStream(src)
    .pipe(crypto.createHash('sha256'))
    .pipe(fs.createWriteStream(dest))
    .on('finish', cb)
}

fs.writeFileSync('section3/src.txt', 'Hello, World!')
copyFileWithStream('section3/src.txt', 'section3/dest.txt', () =>
  console.log('コピー完了')
)
