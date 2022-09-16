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

async function asyncFunc(json) {
  try {
    const result = await parseJSONAsync(json)
    console.log('パース結果', result)
  } catch (err) {
    console.log('エラーをキャッチ', err)
  }
}

asyncFunc('{"foo":1}')
asyncFunc('不正なJSON')
