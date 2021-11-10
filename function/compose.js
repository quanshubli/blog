// 面向过程实现compose
function compose1() {
  const funcs = Array.prototype.slice.call(arguments)
  return function (...args) {
    if (funcs.length < 1) {
      return args
    }

    let i = funcs.length - 1
    let result = funcs[i].apply(this, args)

    while (--i >= 0) {
      result = funcs[i].call(this, result)
    }

    return result
  }
}

// reduce实现compose
function compose2(...funcs) {
  return funcs.reduce((a, b) => (...args) => b(a(...args)))
}

