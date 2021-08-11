/**
 * 实现简易的Promise
 * 遗留问题：
 * 1.前一个then调用onRejected时，后面的then仍会调用onFulfilled
 * 2.js原生Promise产生的then是微任务
 */
class MyPromise {
  constructor(callback) {
    this.state = 'pending'
    this.result = null

    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []

    this._resolve = this._resolve.bind(this)
    this._reject = this._reject.bind(this)

    try {
      callback(this._resolve, this._reject)
    } catch (error) {
      this._reject(error)
    }
  }

  _resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'
      this.result = value

      this.fulfilledCallbacks.reduce((result, cb) => cb(result), this.result)
    }
  }

  _reject(value) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.result = value

      this.rejectedCallbacks.reduce((result, cb) => cb(result), this.result)
    }
  }

  then(onFulfilled, onRejected) {
    // 用const无法在thenPromise内部使用自身变量
    let thenPromise

    thenPromise = new MyPromise((resolve, reject) => {
      const handle = cb => {
        try {
          const result = cb(this.result)

          if (result === thenPromise) {
            throw new Error('不能返回自身')
          } else if (result instanceof MyPromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (err) {
          reject(err)
        }
      }

      if (this.state === 'fulfilled') {
        handle(onFulfilled)
      } else if (this.state === 'rejected') {
        handle(onRejected)
      } else {
        this.fulfilledCallbacks.push(handle.bind(this, onFulfilled))
        this.rejectedCallbacks.push(handle.bind(this, onRejected))
      }
    })

    return thenPromise
  }
}
