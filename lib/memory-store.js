/**
 * @param {string} ip 
 */
function IPObject(ip) {
  this.ip = ip
  this.connections = 0
  this.timestamp = new Date().valueOf()
}

/**
 * @param {number} ms 
 */
IPObject.prototype.isOvertime = function (ms) {
  return new Date().valueOf() - this.timestamp > ms
}
IPObject.prototype.increase = function () {
  this.connections += 1
}
IPObject.prototype.decrease = function () {
  this.connections -= 1
}
IPObject.prototype.reset = function () {
  this.timestamp = new Date().valueOf()
  this.connections = 0
}

export class Storage {
  constructor () {
    /**
     * @type {{[x:string]:IPObject}}
     */
    this.ipTable = {}
    this.max = 255
  }

  /**
   * @param {string} ip 
   */
  find (ip) {
    return this.ipTable[ip]
  }
  /**
   * @param {string} ip 
   */
  create (ip) {
    this.ipTable[ip] = new IPObject(ip)
    return true
  }

  /**
   * @param {string} ip 
   */
  increase (ip) {
    this.ipTable[ip].increase()
  }
  /**
   * @param {string} ip 
   */
  decrease (ip) {
    this.ipTable[ip].decrease()
  }

  reachMax () {
    return Object.keys(this.ipTable).length >= this.max
  }
  /**
   * @param {string} ip 
   */
  reset (ip) {
    this.ipTable[ip].reset()
  }
  /**
   * @param {string} ip 
   */
  clear (ip) {
    delete this.ipTable[ip]
  }

  clearAll () {
    this.ipTable = {}
  }
}

export function createStorage () {
  return new Storage()
}