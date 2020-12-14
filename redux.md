### 前言

Redux是一个管理状态的容器，是一种状态管理方案，它可以配合任何一种前端框架使用。大多数情况下，我们都是在React基础上使用Redux的。React-Redux库提供了Provider和connect等组件，使得我们能够比较优雅地在React中使用Redux。

本文只针对Redux，对于React-Redux或许会另开一篇做分析。

### 正文

注：以下出现的Redux源码都是经过简化的

#### Store

Redux做的事情非常简单，就是提供一个地方来存储状态，当状态被改变时发送通知。这个储存状态的地方，在概念上称为store。我们可以通过createStore方法来实现一个store。

首先来看下Redux中的createStore方法。

```javascript
function createStore(reducer, initialState) {
  // 初始状态
  let state = initialState
  // 订阅的函数
  let listeners = []

  // 订阅
  function subscribe(listener) {
    listeners.push(listener)

    // 取消订阅
    return function unsubscribe() {
        const index = listeners.indexOf(listener)
        listeners.splice(index, 1)
    }
  }

  // 改变状态
  function dispatch(action) {
    // 更新state
    state = reducer(state, action)
    // 触发订阅函数
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  // 获取state
  function getState() {
    return state
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}
```

我们可以看到，store不仅保存了状态数据，还提供了改变状态和监听动作的方法。

Redux使用发布-订阅模式来实现状态的改变后通知。在这里，state用于保存状态；subscribe方法将需要订阅的函数保存到listeners中；dispatch方法用于改变状态，并且调用listeners中已订阅的函数。

实际使用过程中，我们首先会调用createStore方法来创建一个store，createStore接收两个参数reducer和initialState。initialState顾名思义就是初始的状态，比如0、'Jack'，也可以是一个对象，比如{ count: 1 }。那么reducer是啥呢？

#### Reducer & Action

createStore中的dispatch方法。
```javascript
function dispatch(action) {
  state = reducer(state, action)
  // ...
}
```
我们可以看到，当我们调用dispatch去改变状态时，并不是随意地赋值给state，而是经过的reducer的一层处理。

Reducer使状态的改变变得可控，最终的状态变得可预期。打个比方，将Reducer看作一个工厂，它提供几条生产线，我们只需将原料和需要走哪条生产线告诉Reducer就行了。而原料和预定的线路就包含在Action中。

下面是一个简单的例子。

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'INCREASE':
      return state + 1
    case 'DECREASE':
      return state - 1
    default:
      return state
  }
}

const action = { type: 'INCREASE' }

const store = createStore(0, reducer)

store.dispatch(action)

console.log(store.getState()) // 1
```
可以看到，有了reducer和action，我们就不会随意地将状态改为任意值，而是从Reducer这个工厂中选择一条生产线，将状态进行加工，得到最终的状态。所谓可预期。

综上所述，包括store、reducer以及action，便是Redux的核心内容。


#### combineReducers

在实际项目中，状态肯定不止一个，几十上百个的都很常见。如果这么多的状态只用一个reducer方法来处理，那我们肯定是无法接受的。Redux提供了一个combineReducers方法，用来整合多个reducer方法。这样，我们就可以将状态拆分开来进行管理。以下是简化后的combineReducers源码。

```javascript
function combineReducers(reducers = {}) {
  // 状态名的数组集合
  const keys = Object.keys(reducers)

  // 返回经整合的reducer方法
  return function combination(state, action) {
    const nextState = {}

    // 遍历每个状态并作更新
    keys.forEach(key => {
      const reducer = reducers[key]
      const previousStateForKey = state[key]  // 旧状态
      const nextStateForKey = reducer(previousStateForKey, action)  // 调用对应的reducer得到新的状态

      nextState[key] = nextStateForKey
    })

    return nextState
  }
}
```

举一个简单的例子。

```javascript
function count(state, action) {
  switch (action.type) {
    case 'INCREASE':
      return state + 1
    case 'DECREASE':
      return state - 1
    default:
      return state
  }
}

function name(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return action.name
    default:
      return state
  }
}

const reducer = combineReducers({ count, name })
```