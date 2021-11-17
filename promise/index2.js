/**
 * 实现promise
 */
function MyPromise(executor) {
  // 因为开发者调用resolve的环境不确定，所以将this进行保存
  const self = this

  this.status = 'pending' // 'pending' | 'fulfilled' | 'rejected'
  this.value = null
  this.reason = null

  this.onFulfilledFuncs = []
  this.onRejectedFuncs = []

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }

    // setTimeout模拟任务队列
    setTimeout(() => {
      if (self.status === 'pending') {
        self.value = value
        self.status = 'fulfilled'
        self.onFulfilledFuncs.forEach(func => func(self.value))
      }
    })
  }

  function reject(reason) {
    setTimeout(() => {
      if (self.status === 'pending') {
        self.reason = reason
        self.status = 'rejected'
        self.onRejectedFuncs.forEach(func => func(self.reason))
      }
    })
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === 'fulfilled') {
    onFulfilled(this.value)
  }
  if (this.status === 'rejected') {
    onRejected(this.reason)
  }
  if (this.status === 'pending') {
    this.onFulfilledFuncs.push(onFulfilled)
    this.onRejectedFuncs.push(onRejected)
  }
}
