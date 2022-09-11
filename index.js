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

function* asyncWithGeneratorFunc(json) {
  try {
    const result = yield parseJSONAsync(json)
    console.log('パース結果', result)
  } catch (err) {
    console.log('エラーをキャッチ', err)
  }
}

function handleAsyncWithGenerator(generator, resolved) {
  const { done, value } = generator.next(resolved)
  if (done) {
    return Promise.resolve(value)
  }
  return value.then(
    (resolved) => handleAsyncWithGenerator(generator, resolved),
    (err) => generator.throw(err)
  )
}

handleAsyncWithGenerator(asyncWithGeneratorFunc('{"foo":1}'))
handleAsyncWithGenerator(asyncWithGeneratorFunc('不正なJSON'))
