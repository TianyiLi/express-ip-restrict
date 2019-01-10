import { createIPRestrict, getConnections, ipTable, ipIsRestrict } from '../lib/ip-restrict'
import { equal } from 'assert';

const IP = '127.0.0.1'
const TIMES = 2 * 1000
const range = (length, start = 0) => Array.from({ length }, (v, i) => start + i)
function MockResponse () {
  this.statusCode = 200
  this.responseString = ''
  this.onFinished = function () { }
}

MockResponse.prototype.status = function (statusCode) {
  this.statusCode = statusCode
  return this
}
MockResponse.prototype.send = function (str) {
  this.responseString = str
  return this
}
MockResponse.prototype.on = function (event, cb) {
  this.onFinished = cb
}

describe('IP restriction test', () => {
  let ipRestrict = createIPRestrict()
  let mockResponse = new MockResponse()
  afterEach(() => {
    mockResponse = new MockResponse()
    ipTable.clearAll()
    ipRestrict = createIPRestrict()
  })

  it('should be pass, connection amount should correct', () => {
    ipRestrict({ ip: IP }, mockResponse, () => {
      equal(mockResponse.statusCode, 200)
      equal(getConnections(IP), 1)
    })
  })
  it('after 61 times request should response error', () => {
    range(61, 1)
      .forEach(i => {
        ipRestrict({ ip: IP }, mockResponse, () => {
          if (i !== 61) {
            equal(mockResponse.statusCode, 200)
            equal(getConnections(IP), i)
          } else {
            equal(mockResponse.statusCode, 429)
            equal(getConnections(IP), 60)
            equal(mockResponse.responseString, 'Error')
          }
        })
      })
  })
  it('set the maximum requests to 20, and the reset times to 2 sec', function (done) {
    this.timeout(3000)
    ipRestrict = createIPRestrict({
      ms: TIMES,
      maxConnections: 20
    })
    range(21, 1)
      .forEach(i => {
        ipRestrict({ ip: IP }, mockResponse, () => {
          if (i !== 21) {
            equal(mockResponse.statusCode, 200)
            equal(mockResponse.responseString, '')
            equal(getConnections(IP), i)
          } else {
            equal(mockResponse.statusCode, 429)
            equal(getConnections(IP), 20)
            equal(mockResponse.responseString, 'Error')
          }
        })
      })
    equal(ipIsRestrict(IP), true)
    setTimeout(() => {
      equal(ipIsRestrict(IP), false)
      done()
    }, TIMES + 500)
  })
  it('on finished but response status is bigger than 400 but not 429', (done) => {
    ipRestrict({ ip: IP }, mockResponse, () => {
      mockResponse.statusCode = 404
      setImmediate(() => {
        mockResponse.onFinished()
        equal(ipTable.find(IP).connections, 0)
        done()
      })
    })
  })
})