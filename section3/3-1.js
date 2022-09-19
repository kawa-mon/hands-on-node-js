const events = require('events')

const eventEmitter = new events.EventEmitter()
const eventIterable = events.on(eventEmitter, 'event')
console.log(eventEmitter.listeners('event'))
;(async () => {
  for await (const _a of eventIterable) {
  }
})().catch((err) => console.error('for await...ofでエラー', err))

eventEmitter.emit('error', new Error('エラー'))
console.log(eventEmitter.listeners('event'))
