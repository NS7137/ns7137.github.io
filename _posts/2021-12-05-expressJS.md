---
layout: post
title: NodeJS http and ExpressJS
author: ns7137
description: req and res
---
# http 请求响应

- 使用http模块，创建server服务监听端口
- 使用fs模块读取响应页面文件
- res.writeHead编辑不同文件响应头
- 通过res.wirte将文件响应到页面

```js
// 原始 http req res
const http = require('http')
const { readFileSync } = require('fs')

const homePage = readFileSync('./nodejs-express/public/index.html')
const homeStyles = readFileSync('./nodejs-express/public/styles.css')
const homeImage = readFileSync('./nodejs-express/public/logo.svg')
const homeLogic = readFileSync('./nodejs-express/public/browser-app.js')

const server = http.createServer((req, res) => {
    const url = req.url
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' })
        // res.write('<h1>Home Page</h1>')
        res.write(homePage)
        res.end()
    } else if (url === '/about') {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write('<h1>About Page</h1>')
        res.end()
    } else if (url === '/styles.css') {
        res.writeHead(200, { 'content-type': 'text/css' })
        res.write(homeStyles)
        res.end()
    } else if (url === '/logo.svg') {
        res.writeHead(200, { 'content-type': 'image/svg+xml' })
        res.write(homeImage)
        res.end()
    } else if (url === '/browser-app.js') {
        res.writeHead(200, { 'content-type': 'text/javascript' })
        res.write(homeLogic)
        res.end()
    }
    else {
        res.writeHead(404, { 'content-type': 'text/html' })
        res.write('<h1>404 Page</h1>')
        res.end()
    }
})

server.listen(5000)
```

# express 请求响应

- express 模块创建 创建app
- app.use 设置静态文件位置，express会根据文件位置响应页面

```js
const express = require('express')
const path = require('path')
const app = express()

// setup static and middleware
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//     // res.status(200).send('Home Page')
//     // 渲染页面可以通过sendFile 也可以将html放到 静态文件目录里
//     res.sendFile(path.resolve(__dirname, './index.html'))

// })

app.get('/about', (req, res) => {
    res.status(200).send('About Page')
})

app.all('*', (req, res) => {
    res.status(404).send('<h1>resource not found</h1>')
})

app.listen(5000, () => {
    console.log('server is listening on port 5000...')
})

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen
```

# express 获取地址栏参数

- req.params 和 req.query 两种
- 获取到的请求参数都是string，与number比较都需要强转

```js
// path 参数
// xxx/api/products/1
app.get('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const singleProduct = products.find(product => product.id === Number(productId))
    if (!singleProduct) {
        res.status(404).send('Product Does Not Exist')
    }
    res.json(singleProduct)
})


// ? search方式
// xxxx/api/v1/query?search=a&limit=1
app.get('/api/v1/query', (req, res) => {
    console.log(req.query)
    const { search, limit } = req.query
    let sortedProducts = [...products]

    if (search) {
        sortedProducts = sortedProducts.filter(product => {
            return product.name.startsWith(search)
        })
    }
    if (limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit))
    }
    if (sortedProducts.length < 1) {
        // res.status(202).send('no products muched your search')
        return res.status(200).json({ success: true, data: [] })
    }
    res.status(200).send(sortedProducts)
})
```

# express 中间件

- 定义和使用中间件的不同方式

```js
const express = require('express')
const app = express()
// 模块方式导入中间件
const logger = require('./logger')
const authorize = require('./authorize')

// req => middleware => res

// 同一文件中定义中间件
// const logger = (req, res, next) => {
//     const method = req.method
//     const url = req.url
//     const time = new Date().getFullYear();
//     console.log(method, url, time)
//     next()
// }


// use方式配置中间件
// app.use(logger)
// 限制中间件的使用路径，以api为根目录
// app.use('/api', logger)

// 配置多个中间件，将会按顺序执行
app.use([logger, authorize])

// 直接手动配置logger中间件
app.get('/', logger, (req, res) => {
    // 通过中间件传递处理过的请求信息
    console.log(req.user)
    res.send('Home')
})

app.get('/about', (req, res) => {
    res.send('About')
})

app.get('/api/products', (req, res) => {
    res.send('Products')
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000....')
})
```

- 中间件中处理请求信息

```js
const authorize = (req, res, next) => {
    // 中间件中处理请求信息
    const { user } = req.query;
    if (user === 'john') {
        req.user = { name: 'john', id: 3 }
        next()
    } else {
        res.status(401).send('Unauthorize')
    }
}
module.exports = authorize
```

## use vs route

- use 给左右请求响应路径加中间件，通用的中间件
- route 给特定请求加需要的中间件处理请求信息

# 从表单获取响应数据

- 用到parse from data 中间件
- 服务端通过 req.body 获取 提交数据
- 然后res.json({}) 把响应数据以json格式响应给页面
- 客户端通过axios或fetch 接收数据，并展示到页面

```js
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())
```

## routes

- 路由按访问路径分组


```js
// 分组文件中 通过router定义访问路径
const express = require('express')
const router = express.Router()

const { people } = require('../data')

router.get('/', (req, res) => {
    res.status(200).json({ success: true, data: people })
})

router.post('/', (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ success: false, msg: 'please provide name value' })
    }
    res.status(201).send({ success: true, person: name })
})

router.put('/:id', (req, res) => {
    // 从地址栏获取请求参数
    const { id } = req.params
    // 从form 获取响应 数据
    const { name } = req.body
    // 是否找到
    const person = people.find(person => person.id === Number(id))

    if (!person) {
        res.status(404).json({ success: false, msg: `no person with id ${id}` })
    }

    // 处理提交到数据更新
    const newPeople = people.map(people => {
        if (person.id === Number(id)) {
            person.name = name
        }
        return person
    })

    res.status(200).json({ success: true, data: newPeople })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const person = people.find(person => person.id === Number(id))
    if (!person) {
        res.status(404).json({ success: false, msg: `no person with id ${id}` })
    }

    const newPeople = people.filter(person => person.id !== Number(id))
    return res.status(200).json({ success: true, data: newPeople })

})

module.exports = router
```

- 在启动文件中引入并定义base路径app.use('api/people',people)

```js
const people = require('./routes/people')

app.use('/api/people', people)
```

## controllers

- 使用controller 处理请求响应分组

```js
const getPeople = (req, res) => {
    res.status(200).json({ success: true, data: people })
}

const createPerson = (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ success: false, msg: 'please provide name value' })
    }
    res.status(201).send({ success: true, person: name })
}

const updatePerson = (req, res) => {
    // 从地址栏获取请求参数
    const { id } = req.params
    // 从form 获取响应 数据
    const { name } = req.body
    // 是否找到
    const person = people.find(person => person.id === Number(id))

    if (!person) {
        res.status(404).json({ success: false, msg: `no person with id ${id}` })
    }

    // 处理提交到数据更新
    const newPeople = people.map(people => {
        if (person.id === Number(id)) {
            person.name = name
        }
        return person
    })

    res.status(200).json({ success: true, data: newPeople })
}

const deletePerson = (req, res) => {
    const { id } = req.params
    const person = people.find(person => person.id === Number(id))
    if (!person) {
        res.status(404).json({ success: false, msg: `no person with id ${id}` })
    }

    const newPeople = people.filter(person => person.id !== Number(id))
    return res.status(200).json({ success: true, data: newPeople })

}

module.exports = {
    getPeople,
    createPerson,
    updatePerson,
    deletePerson
}
```

- routes 里的文件就非常干净，并且可以重新定义为

```js
const express = require('express')
const { createPerson, getPeople, updatePerson, deletePerson } = require('../controllers/people')
const router = express.Router()

// router.get('/', getPeople)
// router.post('/', createPerson)
// router.put('/:id', updatePerson)
// router.delete('/:id', deletePerson)

router.route('/').get(getPeople).post(createPerson)
router.route('/:id').put(updatePerson).delete(deletePerson)

module.exports = router
```