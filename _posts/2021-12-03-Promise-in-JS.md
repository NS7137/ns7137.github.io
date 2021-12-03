---
layout: post
title: Promise in JS
author: ns7137
---
# Promise

- 是一个构造函数，用来封装异步操作并获取成功或失败的结果
- 原先是在回调函数中处理结果，现在在异步任务后，then方法中处理返回信息

```js
const p = new Promise(function(resolve,reject)) {
    setTimeout(function () {
        // 成功时
        // let data = '成功'
        // resolve(data);

        // 失败时
        let err = '失败'
        reject(err)
    },1000)
}

// 调用promise对象的then方法
p.then(function(value) {
    console.log(value)
},function(reason){
    console.error(reason)
})
```

- 读取文件

```js
const fs = require('fs')

// 文件读取
fs.readFile('./resources/xxx.md',(err,data)=>{
    // 失败时，抛错误
    if(err) throw err;
    // 没出错，输出
    console.log(data.toString())
})

// promise 封装
const p = new Promise(function(resolve,reject){
    fs.readFile('./resources/xxx.md',(err,data)=>{
        // 失败改变p状态并传递err信息
        if(err) reject(err);
        // 成功情况
        resolve(data);
    })
})

// 处理失败或成功的信息
p.then(function(value){
    console.log(value.toString())
},function(reason){
    console.log('读取失败')
})
```

- AJAX请求

```js
// 用promise对象包裹  原生
const p = new Promise((resolve,reject)=>{
  
    // 创建对象
    const xhr = new XMLHttpRequest();
    // 初始化
    xhr.open('GET','https://api.xxx.xxx/xxx');
    // 发送
    xhr.send();
    // 绑定事件，处理响应结果
    xhr.onreadystatechange = function(){
        // 判断
        if(xhr.readyState === 4){
            // 判断响应状态码
            if(xhr.status >=200 && xhr.status < 300){
                // 成功
                resolve(xhr.response)
            } else{
                // 失败
                reject(xhr.status)
            }
        }
    }
})

// 指定回调
p.then((value)=>{
    console.log(value)
},(reason)=>{
    console.error(reason)
})
```

- then方法的返回结果是promise对象，对象状态是由回调函数的执行结果决定
    - 如果回调函数中返回的结果是非promise类型的属性，状态为成功，返回值为对象的成功的值
    - 如果不写return，返回结果为undefined，也是非promise类型，则为成功，返回值为undefined
    - 如果是一个promise对象，则返回结果为 这个promise对象的返回结果，值为这个promise返回值
    - 抛出错误，失败类型，值为抛出的值
    - then可以链式调用，改变回调地狱

- catch 指定失败

```js
const p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject('error')
    },1000)
})

p.catch(reason=>console.warn(reason))
```

# async 和 await

- async 返回结果是 promise 对象，和then一样
- promise 对象的结果由async函数执行的返回值决定
- await 必须写在 async 中，右侧为promise对象
- await 返回值是promise成功的值
- await 的promise失败了，就会抛异常，通过try-catch捕获处理

```js
const p = new Promise((resolve,reject)=>{
    resolve('success')
})

async function main(){
    try {
        let result = await p;
        console.log(result)
    } catch e {
        console.log(e)
    }
}

main()
```