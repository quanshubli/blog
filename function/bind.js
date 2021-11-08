/**
 * 实现bind
 * 1.参数
 * 2.当生成的函数作为构造函数，通过new实例化后，this与之前传入的对象无关；
 * 3.length属性(未解决)
 */
Function.prototype.myBind = function () {
  const _this = this
  const prevArgs = Array.prototype.slice.call(arguments, 1)

  return function bound () {
    const nextArgs = Array.prototype.slice.call(arguments)
    const finalArgs = prevArgs.concat(nextArgs)

    // 如果生成的函数通过new调用，this指向bound自己
    // 如果直接调用，那么this为undefined
    if (this instanceof bound) {
      return new _this(finalArgs)
    }

    return _this.apply(finalArgs)
  }
}
