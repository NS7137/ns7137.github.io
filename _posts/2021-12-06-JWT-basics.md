---
layout: post
title: JWT Basics
author: ns7137
description: json web token
---

# JWT

- 3个部分组成
- header 一个json字符串,包含当前令牌名称,以及加密算法
- payload 自定义的信息
- signature 当前的密钥
	- 需要加密后的header和加密后的payload使用.连接组成的字符串，然后通过header中声明的加密方式进行加盐secret组合加密

# Login 时操作

- 登陆时生成token，客户端保存token到localStorage，localStorage.setItem('token', data.token)

```js
const login = async (req, res) => {
    const { username, password } = req.body

    // mongoose
    // Joi
    // check in the controller

    if (!username || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    // normally provided by DB!!!
    const id = new Date().getDate()

    // keep payload small
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })

    res.status(200).json({ msg: 'user created', token })
}
```

# 访问需要auth的route加auth中间件

```js
const express = require('express')
const router = express.Router()

const { login, dashboard } = require('../controllers/main')
const authMiddleware = require('../middleware/auth')

// 在dashboard 之前 auth
router.route('/dashboard').get(authMiddleware, dashboard)
router.route('/login').post(login)

module.exports = router
```

# auth中间件

```js
// 把认证单独提取出来，作为中间件
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
    // 判断是否携带 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided')
    }

    // 获取 token
    const token = authHeader.split(' ')[1]

    // 使用secret 解密 token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, username } = decoded
        // 传递 user
        req.user = { id, username }
    } catch (err) {
        throw new UnauthenticatedError('Not authorized to access this route')
    }
    next()
}

module.exports = authenticationMiddleware
```

# errors 自定义

- 将未认证与BadRequest单独定义类
- 用http-status-codes定义状态码

```js
class CustomAPIError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = CustomAPIError

=================================================
const CustomAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')

class BadRequest extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequest

===================================================
const CustomAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedError

```
