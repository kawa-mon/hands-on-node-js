function parseJSONAsync(json) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(JSON.parse(json))
      } catch (err) {
        reject(err)
      }
    }, 1000)
  )
}

const cache = {}
function parseJSONAsyncWithCache(json) {
  let cached = cache[json]
  if (!cached) {
    cached = parseJSONAsync(json)
    cache[json] = cached
  }
  return cached
}

parseJSONAsyncWithCache('{"messsage": "Hello", "to": "World"}')
  .then((result) => console.log('1回目の結果', result))
  .then(() => {
    const promise = parseJSONAsyncWithCache(
      '{"messsage": "Hello", "to": "World"}'
    )
    console.log('2回目の呼び出し完了')
    return promise
  })
  .then((result) => console.log('3回目の結果', result))

console.log('1回目の呼び出し完了')
