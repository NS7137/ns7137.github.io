---
layout: post
title: React Redux again
author: ns7137
description: review redux
---

# store的整个创建过程

## 极简store

- redux 中 createStore 方法

```js
import { createStore } from 'redux'

const hello = () => ('hello')
const store = createStore(hello)
console.log(store.getState())

// 基本的就是存储各类对象
```

- 打印store可以看到stroe中的 成员变量 都是函数，最常用的dispatch和getState
    - f dispatch(action)
    - f getState()
    - f replaceReduce(nextReducer)
    - f subscribe(listener)

### store 创建

- 所以store的创建需要一个Reducer处理, 通过reducer处理 改变state的各种action 并将处理后的state返回给store，交由app中各组件使用
- action 是一个object，并不是做什么，而是描述怎么做
- 使用action去操作state的是 store中的dispatch方法

```js
// reducer 需要一个初始值, 和怎么处理状态的各种action
const defaultState = {
    welcome : 'Hi',
    otherState: 'some stuff'
}

const greeting = (state = defaultState, action) => {

    // 各种action
    switch(action.type) {
        case 'GREEN_ME':
            return {welcome: 'Hello Scott'}
        case 'GREET_WORLD':
            return {welcome: 'Hello World'}
        default:
            return state
    }
};

const store = createStore(greeting);
console.log(store.getState())   // 返回默认{welcome : 'Hi',otherState: 'some stuff'}

store.dispatch({
    type: 'GREET_ME'
})
console.log(store.getState());  // 返回{welcome: 'Hello Scott'}
```

## action里的两个属性

- action 对象 除了action.type区分动作之外，另一个属性action.payload，该动作携带的属性的状态

```js
const greeting = (state = defaultState, action) => {

    // 各种action
    switch(action.type) {
        case 'GREEN_NAME':
            return { welcome: `Hello ${action.name}` }
        case 'GREET_WORLD':
            return { welcome: 'Hello World' }
        default:
            return state
    }
};

const store = createStore(greeting);

const name = 'something coming back from an api'

store.dispatch({
    type: 'GREET_NAME',
    name
})
```

## stroe小结

- 通过createStore()来创建store对象
- 参数1为需要处理返回数据的Reducers
- 每个action是一个对象，是一个动作的描述，动作的类型，和处理的数据
- 真正处理数据的是reducer
- reducer需要一个初始的state和action作为参数
- 通过switch判断是哪种类型的action，不同action对数据做不同的处理
- 调用action则通过store.dispatch({type,payload}) 调用

# redux react-redux

## 组件中传递store

- react 通过 react-redux 来连接redux
- 实际就是通过其中的Provider在最外层App传递store属性给各组件
- 然后使用connect 来连接 UI和action 成为带有状态变化的容器

```jsx
import React from 'react'
import { Provider } from 'react-redux'
import store from './store'


const App = () => (
    <Provider store={store}>
        <Router>
            <Routes>
                <Route>
                </Route>
            </Routes>
        </Router>
    </Provider>
)
```

## 汇总reducer

- rootReducer 汇总所有reducers，将汇总的rootReducer,交给store

```js
import { combineReducers } from 'redux'
import message from './reducer'

const rootReducer = combineReducers({
    message,
})

export default rootReducer;
```

- reducer 通过action处理state，修改状态

```js
const initialState = {
    messageVisibility: false
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case 'TOGGLE_ME':
            return {
                ...state,
                messageVisibility: !state.messageVisibility
            }
        default:
            return state;
    }
}
```

- 将rootReducer交给store，创建store
- 在需要使用redux devtools 时，也需要传递给store，作为第3个参数

```js
// store的createStore 三个参数
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-loger'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'


const initailState = {};

// logger 用来控制台打印具体信息
// thunk 用来使得能在redux中action能返回一个函数
const middleware = [logger,thunk];

// 第二参数为初始state，第三个参数 applyMiddleware 放在devtools中
const store = createStore(rootReducer，initailState，composeWithDevTools(applyMiddleware(...middleware)))

export default store;
```

## 创建redux 容器

- 使用connect 作为关联 组件 与 映射状态和映射操作状态的方法

```jsx
import React from 'react'
import {connect} from 'react-redux'
import { toggleMessage } from './actions'
import { bindActionCreators } from 'redux'

const Toggle = ({messageVisibility, toggleMessage}) => (

    <div>
        {messageVisibility &&
            <p>You will be seeing this if redux aciton is toggled</p>
        }
    {/*简单的状态更改可以直接使用dispatch调用action,
        一般通过action文件操作
    */}
{/*        <button onClick={() => dispatch({
            type: 'TOGGLE_MESSAGE'
        })}>Toggle Me</button>*/}

    {/*绑定action后可以不加dispatch*/}
        <button onClick={() => dispatch(toggleMessage())}>Toggle Me</button>
        <button onClick={toggleMessage}>Toggle Me</button>
    </div>
)

// 关联需要处理的reducer中的状态
// 状态的映射，store中哪个reducer中的哪个状态
const mapStateToProps = state => ({
    messageVisibility: state.message.messageVisibility
})

// 绑定action
const mapDispatchToProps = dispatch => bindActionCreators({
    toggleMessage
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Toggle)

```

- 通过分发actions 处理事件，在需要处理时 dispatch(xxx())
- action中type，建议使用常量，用一个文件存储所有常量

```js
export function toggleMessage() {
    return {
        type: 'TOGGLE_MESSAGE',
    }
}
```

## thunk 使得action返回一个函数

- action 原本只能返回一个对象，带有type和payload属性
- 现在thunk可以让action返回一个函数，函数的返回值还是一个函数，调用了store的dispath分发了action

```js
export function getMovies() {
    return async function(dispatch) {
        const res = await fetch("xxx")
        const movies = await res.json()
        return dispatch({
            type: 'GET_MOVIES',
            payload: movies.results
        })
    }
}
```

- reducer 是一个用来改变状态的异步函数，关联了action，用action中payload的值更新state

```js
const initialState = {
    movies: [],
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case 'GET_MOVIES':
            return {
                ...state,
                movies: payload,
            }
        default:
            return state;
    }
}
```

## redux-localstorage-simple

- 可以在加载时，设置获取数据判断，在状态中加一个时间，每次加载计算有效时间，超过时效就从uri获取，否则从本地加载

```js
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import {save, load} from 'redux-localstorage-simple'
import logger from 'redux-loger'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

const middleware = [logger,thunk];

// 第二个参数是一个初始化状态
// 使用load从localstorage中加载状态
// 状态改变时，save到localstorage
const store = createStore(

    rootReducer,
    load(),
    composeWithDevTools(applyMiddleware(...middleware,save()))

);
```
