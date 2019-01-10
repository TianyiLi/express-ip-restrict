import express from 'express'
import { createStorage } from './memory-store'

let ipTable = createStorage()
let defaultOptions = {
  ms: 60 * 1000,
  maxConnections: 60,
  statusCode: 429,
  message: 'Error'
}
let opt = {}

/**
 * 
 * @param {string} ip 
 */
function ipIsRestrict (ip) {
  let result = false
  let obj = ipTable.find(ip)
  if (!obj) {
    ipTable.create(ip)
    obj = ipTable.find(ip)
  }
  if (!obj.isOvertime(opt.ms) && obj.connections >= opt.maxConnections) {
    result = true
  } else {
    if (obj.isOvertime(opt.ms)) {
      obj.reset()
    }
    obj.increase()
    result = false
  }
  return result
}

function getConnections (ip) {
  return ipTable.find(ip).connections
}

function createIPRestrict (options = defaultOptions) {
  opt = Object.assign({}, defaultOptions, options)
  /**
   * 
   * @param {express.Request} request 
   * @param {express.Response} response 
   * @param {express.NextFunction} next 
   */
  function onRequest (request, response, next) {
    if (ipIsRestrict(request.ip)) {
      response.status(opt.statusCode)
        .send('Error')
    } else {
      next()
    }
    response.on('finish', () => {
      if (response.statusCode >= 400 && response.statusCode !== opt.statusCode) {
        ipTable.decrease(request.ip)
      }
      return true
    })
  }
  return onRequest
}

export {
  createIPRestrict,
  getConnections,
  ipIsRestrict,
  ipTable
}