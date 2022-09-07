const cache = {}

function parseJSONAsync(json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json))
    } catch (err) {
      callback(err)
    }
  }, 1000)
}

function parseJSONAsyncWithCache(json, callback) {
  const cached = cache[json]
  if (cached) {
    setTimeout(() => {
      callback(cached.err, cached.result)
    }, 0)
    return
  }
  parseJSONAsync(json, (err, result) => {
    cache[json] = { err, result }
    callback(err, result)
  })
}

parseJSONAsyncWithCache(
  '{"messsage": "Hello", "to": "World"}',
  (err, result) => {
    console.log('1回目の結果', err, result)
    parseJSONAsyncWithCache(
      '{"messsage": "Hello", "to": "World"}',
      (err, result) => {
        console.log('2回目の結果', err, result)
      }
    )
    console.log('2回目の呼び出し完了')
  }
)
console.log('1回目の呼び出し完了')
