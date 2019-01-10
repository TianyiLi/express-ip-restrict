import axios from 'axios'
import { start, close } from '../lib/server'
import { equal, throws, fail, deepEqual } from 'assert'
import { ipTable } from '../lib/ip-restrict'
const range = (length, start = 0) => Array.from({ length }, (v, i) => start + i)
function sequenceTasks (tasks) {
  function recordValue (results, value) {
    results.push(value)
    return results
  }
  var pushValue = recordValue.bind(null, [])
  return tasks.reduce(function (promise, task) {
    return promise.then(task).then(pushValue)
  }, Promise.resolve())
}

describe('Server test', () => {
  before(async () => {
    await start()
  })
  after(async () => {
    await close()
  })
  it('Should get correct response', async () => {
    let data = await axios.get('http://localhost:8080/').then(res => res.data)
    equal(data, 1)
  })
  it('61 times tests', async () => {
    ipTable.clearAll()
    let pF = range(60, 1)
      .map(i => {
        return () => axios.get('http://localhost:8080/')
          .then(data => {
            return {
              data: data.data,
              status: data.status
            }
          })
      })
    let responseResult = await sequenceTasks(pF)
    deepEqual(responseResult, range(60, 1).map(i => ({ data: i, status: 200 })))
    await axios.get('http://localhost:8080/')
      .then(res => {
        fail('Should not ok')
      }).catch(error => {
        if (error.response) {
          equal(error.response.status, 429)
          equal(error.response.data, 'Error')
        } else {
          fail(error.message)
        }
      })
  })
})