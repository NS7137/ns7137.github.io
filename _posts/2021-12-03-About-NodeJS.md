---
layout: post
title: About NodeJS
author: ns7137
description: nodejs
---

# 定义模块并导出

- module.exports

```js
const sum = (num1, num2) => num1 + num2;
const PI = 3.14;
class SomeMathObject {
    constructor() {
        console.log('object created');
    }
}

// 单独导出
// module.exports.sum = sum;
// module.exports.PI = PI;
// module.exports.SomeMathObject = SomeMathObject;

module.exports = {
    sum: sum,
    PI: PI,
    SomeMathObject: SomeMathObject
}
```

- 在别的文件中使用

```js
const tutorial = require('./tutorial');
console.log(tutorial);
console.log(tutorial.sum(1, 1));
console.log(tutorial.PI);
console.log(new tutorial.SomeMathObject())
```

# 事件触发模块 EventEmitter

- 先定义触发条件，触发时动作

```js
// 事件模块，触发
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// 定义一个事件触发
eventEmitter.on('tutorial', (num1, num2) => {
    console.log('tutorial event has occurred');
    console.log(num1 + num2);
});

// 触发 且带参数
eventEmitter.emit('tutorial', 1, 2);

// 定义类继承事件触发类
// 使得实例可以使用触发并
class Person extends EventEmitter {
    constructor(name) {
        super();
        this._name = name;
    }

    get name() {
        return this._name;
    }
}

let pedro = new Person('Pedro');
let christina = new Person('Christina');
christina.on('name', () => {
    console.log('my name is ' + christina.name);
})
pedro.on('name', () => {
    console.log('my name is ' + pedro.name);
})

pedro.emit('name');
christina.emit('name');
```

# readline 模块

- 从标准输出读写
- 继承自EventEmitter , 其实例能使用事件触发

```js
// readline 模块 
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let num1 = Math.floor(Math.random() * 10 + 1);
let num2 = Math.floor(Math.random() * 10 + 1);
let answer = num1 + num2;

rl.question(`What is ${num1} + ${num2}?\n`, (userInput) => {
    if (userInput.trim() === answer) {
        rl.close();
    }
    else {
        rl.setPrompt('Incorrect response please try again\n');
        rl.prompt();
        rl.on('line', (userInput) => {
            if (userInput.trim() == answer) {
                rl.close();
            }
            else {
                rl.setPrompt(`Your answer of ${userInput} is incorrect try again\n`);
                rl.prompt();
            }
        })
    }
})

rl.on('close', () => {
    console.log('Correct!!!!!');
})
```

# 文件系统 fs 模块

- 对文件的操作

```js
// file system module pt1
// create rename append delete
const fs = require('fs');

// create a file
fs.writeFile('example.md', "# this is an example", (err) => {
    if (err) console.log(err);
    else {
        console.log('File successfully created');
        // 第二个参数是解码方式
        fs.readFile('example.md', 'utf8', (err, file) => {
            if (err) console.log(err);
            else console.log(file)
        })
    }
})

// rename
fs.rename('example.md', 'example2.md', (err) => {
    if (err) console.log(err);
    else console.log('successfully rename the file');
})

// append
fs.appendFile('example2.md', '- Some data being appended\n', (err) => {
    if (err) console.log(err);
    else console.log('Successfully appended data to file');
})

// delete
fs.unlink('example2.md', (err) => {
    if (err) console.log(err);
    else console.log('Successfully deleted the file');
})
```

- 对文件夹的操作

```js
// file system module pt2
const fs = require('fs');

// create and delete folder
fs.mkdir('tutorial', (err) => {
    if (err) console.log(err);
    else {
        fs.rmdir('tutorial', err => {
            if (err) console.log(err);
            else {
                console.log('successfully deleted the folder');
            }
        })
    }
})

// create folder and files
fs.mkdir('tutorial', (err) => {
    if (err) console.log(err);
    else {
        fs.writeFile('./tutorial/example.txt', '123', err => {
            if (err) console.log(err);
            else {
                console.log('successfully created file');
            }
        })
    }
})

// delete folder with file
// 删文件夹之前先判断删除文件
fs.unlink('./tutorial/example.txt', err => {
    if (err) console.log(err);
    else {

        fs.rmdir('tutorial', err => {
            if (err) console.log(err);
            else {
                console.log('deleted folder')
            }
        })
    }
})

// 查看文件夹内文件list 并删除
fs.readdir('example', (err, files) => {
    if (err) console.log(err);
    else {
        for (let file of files) {
            fs.unlink('./example/' + file, (err) => {
                if (err) console.log(err)
                else {
                    console.log('successfully deleted file')
                }
            })
        }

        fs.rmdir('example', err => {
            if (err) console.log(err);
            else {
                console.log('deleted folder')
            }
        })
    }
})
```

# 读写文件使用 stream

- readable and writable streams

```js
// readable and  writable streams
const fs = require('fs');

// 使用stream 读写大数据文件是安全的，不要使用readFile writeFile 处理大数据文件
// 因为会加载进内存，导致buffer不够
// stream 会将文件切块 chunk，分chunk buffer
const readStream = fs.createReadStream('./example.txt', 'utf8');
const writeStream = fs.createWriteStream('./example2.txt');
readStream.on('data', chunk => {
    writeStream.write(chunk);
});
```

- pipe and zip

```js
// stream with pipe
const fs = require('fs');
const zlib = require('zlib');
const gzip = zlib.createGzip();
const gunzip = zlib.createGunzip();

// 流是一次性使用的
const readStream = fs.createReadStream('./example.txt', 'utf8'); //1
const writeStream = fs.createWriteStream('./example2.txt'); //1
// 通过pipe处理读写 传递stream
readStream.pipe(writeStream); //1


// pipe chain 处理读写 压缩
const readStream = fs.createReadStream('./example.txt', 'utf8'); //2
const writeStream = fs.createWriteStream('./example2.txt.gz'); //2
readStream.pipe(gzip).pipe(writeStream); //2


// 解压
const readStream = fs.createReadStream('./example2.txt.gz');
const writeStream = fs.createWriteStream('./uncompressed.txt');
readStream.pipe(gunzip).pipe(writeStream);
```

# http 模块

- 创建服务 请求及响应

```js
// http module 创建服务 请求响应
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Hello world from nodejs');
        res.end();
    }
    else {
        res.write('using some other domain');
        res.end();
    }
})

server.listen('3000');
```

- fs stream 将静态文件响应给页面

```js
const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
    // const readStream = fs.createReadStream('./static/index.html');
    // res.writeHead(200, { 'Content-type': 'text/html' });
    // const readStream = fs.createReadStream('./static/example.json');
    // res.writeHead(200, { 'Content-type': 'application/json' });
    const readStream = fs.createReadStream('./static/example.png');
    res.writeHead(200, { 'Content-type': 'image/png' });
    readStream.pipe(res);
}).listen(3000);
```

# express

- 开启服务

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});
```

- route 及 传参

```js
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/example', (req, res) => {
    res.send('hitting example route');
})

app.get('/example/:name/:age', (req, res) => {
    // route /param1/param2 方式传参
    console.log(req.params);
    // search ?param1=xxx&param2=xxx方式传参
    console.log(req.query);
    res.send(req.params.name + ":" + req.params.age);
})
```

- 处理静态文件

```js
const path = require('path');
// 前缀地址, + 以静态目录为根目录的路径
app.use('/public', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})
```

- body-parser 处理请求体

```js
const bodyParser = require('body-parser');

// 使用系统模块querystring来处理
app.use(bodyParser.urlencoded({ extended: false }));
// 页面通过ajax提交数据，使用json处理
app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log(req.body);
    // database work here
    res.send('successfully posted data');
})

app.post('/', (req, res) => {
    console.log(req.body);
    // some database call here
    res.json({ success: true });
})
```

```html
<script>
  $(document).ready(() => {
    $('#form').submit(e => {
      e.preventDefault();
      data = $('#form').serializeArray();
      $.ajax({
        url: '/',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: response => {
          console.log('successfully got response');
          console.log(response);
        }
      });
    });
  });
</script>
```

# Joi 数据认证

```js
const Joi = require('joi');

const arrayString = ['banana', 'bacon', 'cheese'];
const arrayObjects = [
    { example: 'example1' },
    { example: 'example2' },
    { example: 'example3' }
]

const userInput = {
    personalInfo: {
        streetAddress: '1234567',
        city: 'NY',
        state: 'US'
    },
    preferences: arrayObjects
};

const personalInfoSchema = Joi.object({
    streetAddress: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().length(2).required(),
})

// const preferencesSchema = Joi.array().items(Joi.string());
const preferencesSchema = Joi.array().items(Joi.object({
    example: Joi.string().trim().required()
}));

const schema = Joi.object({
    personalInfo: personalInfoSchema,
    preferences: preferencesSchema
})

const validate = schema.validate(userInput)

if (validate.error) {
    console.log(validate.error)
} else {
    console.log(validate.value)
}
```

# 使用 view 模板有很多种，默认jade

- 先set，访问渲染时传递数据

```js
app.set('view engine', 'ejs');

app.get('/:userQuery', (req, res) => {
    res.render('index', {
        data: {
            userQuery: req.params.userQuery,
            searchResults: [
                'book1',
                'book2',
                'book3'
            ],
            loggedIn: true,
            username: 'EJS'
        }
    });
})
```

- 页面读取时

```html
  <body>
    <h1 class="hello">You Search For : <%= data.userQuery %></h1>
    <% if(data.loggedIn){ %>
    <h2>You are login as : <%= data.username %></h2>
    <% } %>
    <ul>
      <% data.searchResults.forEach(result=>{ %>
      <li><%= result %></li>
      <% }) %>
    </ul>
  </body>
```

# 定义中间件

- 在请求和响应前添加中间操作

```js
// 中间件 middleware 对不同route处理
// 在请求响应前处理 请求响应数据
app.use((req, res, next) => {
    console.log(req.url, req.method)
    req.banana = 'banana';
    res.apple = 'apple';
    next();
})


app.get('/', (req, res) => {
    console.log(req.banana);
    console.log(res.apple);
    res.send('MiddleWare')
})
```

# express.Router() 定义api的不同路由

- 不同操作的路由

```js
const express = require('express');
const route = express.Router();

// middleware 只在people route中生效
route.use((req, res, next) => {
    console.log('middleware being used');
    next();
})

route.get('/', (req, res) => {
    res.send('/ being hit');
})

route.get('/example', (req, res) => {
    res.send('/example being hit');
})

module.exports = route;
````

- app 启动文件中 将其导入

```js
// people routes
const people = require('./routes/people')

// people 的根目录为 localhost:3000/people
app.use('/people', people);
```