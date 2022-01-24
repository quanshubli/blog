// 通过babel等工具，将jsx语法转换成调用createElement方法，生成React节点对象
// const dom = <div>123</div>
// const dom = createElement('div', null, '123')
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(item =>
        typeof item === 'object'
          ? item
          : createTextElement(item)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

// 递归的缺点:
// 递归无法中断，对于比较结构深的节点树，递归需要花费大量时间，长期占用浏览器主线程，造成页面的卡顿。

// 一个节点对应一个fiber，一个fiber就是一个任务单元

// render创建root fiber，将其作为nextUnitOfWork，剩下的交给performUnitOfWork
function render(element, container) {
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type)

  const { children, ...restProps } = element.props

  Object.keys(restProps).forEach(key => {
    dom[key] = restProps[key]
  })

  children.forEach(item => {
    render(item, dom)
  })

  container.appendChild(dom)
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false

  while (nextUnitOfWork && !shouldYield) {
    // performUnitOfWork做优化，并返回下一个任务单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // deadline.timeRemaining()返回一个时间，表示当前闲置周期的预估剩余毫秒数
    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

/**
 * 做3件事：
 * 1.将节点加入DOM
 * 2.创建该节点下的字节点的fiber
 * 3.选择下一个任务单元
 */
function performUnitOfWork(nextUnitOfWork) {

}

const Didact = {
  createElement,
  render
}
