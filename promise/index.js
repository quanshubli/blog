/**
 * 实现简易的Promise
 * 遗留问题：
 * 1.js原生Promise产生的then是微任务，暂时用setTimeout模拟
 */
class MyPromise {
  constructor(callback) {
    this.state = 'pending' // 'pending' | 'fulfilled' | 'rejected'
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

  static catch(callback) {
    return this.then(null, callback)
  }

  static resolve(value) {
    return new MyPromise(resolve => {
      resolve(value)
    })
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value)
    })
  }

  static all(handlers) {
    return new MyPromise((resolve, reject) => {
      try {
        const len = handlers.length
        let flag = 0
        const result = new Array(len)

        const addResultItem = (value, index) => {
          result[index] = value
          if (++flag === len) {
            resolve(result)
          }
        }

        handlers.forEach((handler, index) => {
          if (handler instanceof MyPromise) {
            handler.then(value => {
              addResultItem(value, index)
            }, reject)
          } else if (typeof handler === 'function') {
            addResultItem(handler(), index)
          } else {
            addResultItem(handler, index)
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  static race(handlers) {
    return new MyPromise((resolve, reject) => {
      try {
        handlers.forEach(handler => {
          if (handler instanceof MyPromise) {
            handler.then(resolve, reject)
          } else if (typeof handler === 'function') {
            resolve(handler())
          } else {
            resolve(handler)
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  _resolve(value) {
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.result = value

        this.fulfilledCallbacks.forEach(item => item(this.result))
      }
    })
  }

  _reject(value) {
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.result = value

        this.rejectedCallbacks.forEach(item => item(this.result))
      }
    })
  }

  then(onFulfilled, onRejected) {
    // 如果传入的不是函数，则穿透到下一个then
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }

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
        setTimeout(() => {
          handle(onFulfilled)
        })
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          handle(onRejected)
        })
      } else {
        this.fulfilledCallbacks.push(handle.bind(this, onFulfilled))
        this.rejectedCallbacks.push(handle.bind(this, onRejected))
      }
    })

    return thenPromise
  }
}
