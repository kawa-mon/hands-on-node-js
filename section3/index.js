const events = require('events')

const eventAEmitter = new events.EventEmitter()
const eventAIterable = events.on(eventAEmitter, 'eventA')
console.log(eventAEmitter.listeners('eventA'))
;(async () => {
  for await (const a of eventAIterable) {
    if (a[0] === 'end') {
      break
    }
    console.log('eventA', a)
  }
})()

eventAEmitter.emit('eventA', 'Hello')
eventAEmitter.emit('eventA', 'Hello', 'World')
eventAEmitter.emit('eventA', 'end')
setTimeout(() => {
  console.log(eventAEmitter.listeners('eventA'))
}, 100)
