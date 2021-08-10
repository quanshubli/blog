/**
 * 实现简易的Promise
 * 定时器问题待解决
 */
class MyPromise {
  constructor(callback) {
    this.state = 'pending'
    this.result = null

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
    }
  }

  _reject(value) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.result = value
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.result)
    } else if (this.state === 'rejected') {
      onRejected(this.result)
    }
  }
}

const promise = new MyPromise((resolve, reject) => {
  // throw new Error('throw error')
  // resolve('成功')
  // reject('失败')
  setTimeout(() => {
    resolve('成功')
  }, 1000)
}).then(console.log, console.log)
