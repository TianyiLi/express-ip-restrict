import express from 'express'
import { createIPRestrict, getConnections } from './ip-restrict'
import { Server } from 'http';

/**
 * @type {Server}
 */
let server
export function start () {
  if (server) return false
  const app = express()
  const ipRestrict = createIPRestrict()
  app.use(ipRestrict)
  app.get('/', (request, response) => {
    response.setHeader('Content-type', 'text/plain')
    response.write(`${getConnections(request.ip)}`)
    response.end()
  })
  return new Promise((resolve, reject) => {
    server = app.listen(8080, () => {
      resolve('ok')
    })
  })
}
export function close () {
  if (!server) return false
  
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve('close')
    })
  })
}
