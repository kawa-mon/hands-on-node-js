const cache = {}

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

const toBeFulfilled = parseJSONAsync('{"foo":1}')
const toBeRejected = parseJSONAsync('不正なJSON')
console.log('********** Promise生成直後 **********')
console.log(toBeFulfilled)
console.log(toBeRejected)
setTimeout(() => {
  console.log('********** 1秒後 **********')
  console.log(toBeFulfilled)
  console.log(toBeRejected)
}, 1000)
