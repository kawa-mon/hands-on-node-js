function* tryCatchGeneratorFunc() {
  try {
    yield 1
  } catch (err) {
    console.log('エラーをキャッチ', err)
    yield 2
  }
}

const tryCatchGenerator = tryCatchGeneratorFunc()
console.log(tryCatchGenerator.next())
console.log(tryCatchGenerator.throw(new Error('エラー')))
console.log(tryCatchGenerator.next())
