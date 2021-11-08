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
