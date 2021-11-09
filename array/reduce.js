Array.prototype.myReduce = function (callback, initialValue) {
  if (!this || this.length <= 0) {
    return initialValue
  }

  let result = initialValue === undefined ? this[0] : initialValue
  let i = initialValue === undefined ? 1 : 0

  for (; i < this.length; i++) {
    result = callback(result, this[i], i, this)
  }

  return result
}

/**
 * 通过reduce实现runPromiseInSequene
 */
function runPromiseInSequeue(promises, initialValue) {
  return promises.reduce(
    (chain, promise) => chain.then(promise),
    Promise.resolve(initialValue)
  )
}

/**
 * 通过reduce实现柯里化
 * curry(a, b, c)(v) -> c(b(a(v)))
 */
function curry() {
  const funcs = Array.prototype.slice.call(arguments)
  return function (arg) {
    return funcs.reduce((accArg, func) => func(accArg), arg)
  }
}
