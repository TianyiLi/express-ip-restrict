import { start, close } from './lib/server'
global.Promise = require('bluebird')
start()
  .then((res) => {
    console.log(res)
  })
process.on('SIGINT', () => {
  close()
})