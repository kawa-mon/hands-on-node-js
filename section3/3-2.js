const events = require('events')

const eventEmitter = new events.EventEmitter()
const eventPromise = events.once(eventEmitter, 'event')
eventPromise.catch((err) => console.error('Promiseインスタンスの拒否', err))
eventEmitter.emit('error', new Error('エラー'))
