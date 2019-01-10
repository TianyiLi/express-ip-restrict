import { createStorage, Storage } from '../lib/memory-store'
import { deepEqual, equal } from 'assert';
const ip = '127.0.0.1'
describe('Memory store test', () => {
  /**
   * @type {Storage}
   */
  let storage = createStorage()
  afterEach(() => {
    storage.clearAll()
  })
  it('ipdata create should be success', () => {
    storage.create(ip)
  })
  it('should store the data correct', () => {
    storage.create(ip)
    equal(storage.find(ip).connections, 0)
    equal(storage.find(ip).timestamp - new Date().valueOf() < 60000, true)
  })
  it('increase should be work', () => {
    storage.create(ip)
    storage.increase(ip)
    equal(storage.find(ip).connections, 1)
    equal(storage.find(ip).timestamp - new Date().valueOf() < 60000, true)
  })
  it('clear should be work', () => {
    storage.create(ip)
    storage.increase(ip)
    storage.clear(ip)
    deepEqual(storage.find(ip), undefined)
  })
  it('multiple storage is ok', () => {
    storage.create(ip)
    storage.increase(ip)
    storage.create('8.8.8.8')
    storage.increase('8.8.8.8')
    storage.increase('8.8.8.8')
    equal(storage.find(ip).connections, 1)
    equal(storage.find('8.8.8.8').connections, 2)
  })
})