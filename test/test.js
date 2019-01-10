import axios from 'axios'
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

sequenceTasks(range(80).map(ele => {
  return () => axios.get('http://localhost:8080/', {
    validateStatus (code) {
      return code < 500
    }
  }).then(res => res.data)
})).then((res) => {
  console.log(res)
})