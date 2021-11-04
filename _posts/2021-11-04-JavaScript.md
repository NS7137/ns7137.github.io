---
layout: post
title: lecture6. JavaScript Basic
author: ns7137
description: cs50-web notes
---

# Hello, world

- JavaScript的code都写在script标签中，可以放在head中也可以放在body里

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			alert('Hello,world!');
		</script>
	</head>
	<body>

	</body>
</html>
```

# 事件

- 当某一事件发生后，得到响应，监听机制。 如按键点击事件发生时出发调用函数hello(). [hello.html](/assets/lecture6/hello.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			function hello() {
				alert('Hello,world!');
			}
		</script>
	</head>
	<body>
		<h1>Hello!</h1>
		<button onclick="hello()">Click Here</button>
	</body>
</html>
```

- 更改当前变量的值. [counter](/assets/lecture6/counter.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			let counter = 0;

			function count() {
				counter++;
				document.querySelector('h1').innerHTML = counter;
			}
		</script>
	</head>
	<body>
		<h1>0</h1>
		<button onclick="count()">Count</button>
	</body>
</html>
```

- 向页面标签内文本传值覆盖原值并显示. [hello_goodbye](/assets/lecture6/hello_goodbye.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			//将Googbye!显示在h1标签中，代替Hello!
			function hello() {
				//const 常量
				const heading = document.querySelector('h1');
				//条件判断，使得值在2者中切换
				if (heading.innerHTML === 'Hello!') {
					heading.innerHTML = 'Googbye!';
				} else {
					heading.innerHTML = 'Hello!';
				}
			}
		</script>
	</head>
	<body>
		<h1>Hello!</h1>
		<button onclick="hello()">Click Here</button>
	</body>
</html>
```

## 格式化字符串

- 显示字符串时，代码方式

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			let counter = 0;

			function count() {
				counter++;
				document.querySelector('h1').innerHTML = counter;

				// ``代替引号，格式化内容加${}
				if(counter % 10 === 0){
					alert(`Count is now ${counter}`)
				}
			}
		</script>
	</head>
	<body>
		<h1>0</h1>
		<button onclick="count()">Count</button>
	</body>
</html>
```

## 在script标签中定义触发事件

- 通过DOM操作，找到对应标签，通过代码处理响应事件

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			let counter = 0;

			function count() {
				counter++;
				document.querySelector('h1').innerHTML = counter;

				// ``代替引号，格式化内容加${}
				if(counter % 10 === 0){
					alert(`Count is now ${counter}`)
				}
			}

			//找到标签，定义事件，但到这行button还未被加载，所以会报错
			//解决方法，把script定义放在body最后
			//或者添加监听，当页面全部加载后再调用响应事件
			document.addEventListener('DOMContentLoaded', function(){
				// document.querySelector('button').onclick = count;
				document.querySelector('button').addEventListener('click',count);
			});
		</script>
	</head>
	<body>
		<h1>0</h1>
		<button>Count</button>
	</body>
</html>
```

## 把javascript作为单独js文件导入使用

- 把代码保存在js文件中，使用时在script标签中引用到html中. [counter_in_js](/assets/lecture6/counter_in_js.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script src="counter.js"></script>
	</head>
	<body>
		<h1>0</h1>
		<button>Count</button>
	</body>
</html>
```

# DOM 操作

- querySelector 返回第一个
	- document.querySelector('tag')
	- document.querySelector('#id')
	- document.querySelector('.class')

- 例如表单标签 [form](/assets/lecture6/form.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello</title>
		<script>
			
			document.addEventListener('DOMContentLoaded', function() {
				
				document.querySelector('form').onsubmit = function(){
					//表单提交事件触发后 获取到id为name的值
					const name = document.querySelector('#name').value;
					alert(`Hello, ${name}!`);
				};
			});

		</script>
	</head>
	<body>
		<h1>Hello!</h1>
		<form>
			<input autofocus id="name" placeholder="Name" type="text" name="name">
			<input type="submit">
		</form>
	</body>
</html>
```

- 通过dom操作修改css样式 [change_color](/assets/lecture6/change_color.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Colors</title>
		<script>
			
			document.addEventListener('DOMContentLoaded',function(){

				//change font color to red
				document.querySelector('#red').onclick = function(){
					document.querySelector('#hello').style.color = 'red';
				}

				document.querySelector('#blue').onclick = function(){
					document.querySelector('#hello').style.color = 'blue';
				}

				document.querySelector('#green').onclick = function(){
					document.querySelector('#hello').style.color = 'green';
				}
			});

		</script>
	</head>
	<body>
		<h1 id="hello">Hello!</h1>
		<button id="red">Red</button>
		<button id="blue">Blue</button>
		<button id="green">Green</button>
	</body>
</html>
```

- data-前缀设置我们需要的自定义属性,来进行一些数据的存放，取值时从dataset中获取
- 定义data属性，并querySelectorAll 返回的是一个list,用[forEach](/assets/lecture6/change_color_foreach.html)遍历并将button作为参数，当某个button响应事件出发，更改样式为该button在dataset中的取值

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Colors</title>
		<script>
			
			document.addEventListener('DOMContentLoaded',function(){

				document.querySelectorAll('button').forEach(function(button){
					button.onclick = function(){
						document.querySelector('#hello').style.color = button.dataset.color;
					};
				});

			});

		</script>
	</head>
	<body>
		<h1 id="hello">Hello!</h1>
		<button data-color="red">Red</button>
		<button data-color="blue">Blue</button>
		<button data-color="green">Green</button>
	</body>
</html>
```

- 另一种定义function的方法，用()=> ，类似于lambda

```javascript
document.addEventListener('DOMContentLoaded',()=>{

	document.querySelectorAll('button').forEach(button=>{
		button.onclick = ()=>{
			document.querySelector('#hello').style.color = button.dataset.color;
		};
	});
});
```

- 对[select](/assets/lecture6/change_color_select.html)的操作，onchange 事件，this获取其中value的值

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Colors</title>
		<script>
			
			document.addEventListener('DOMContentLoaded',()=>{

				document.querySelector('select').onchange = ()=>{
					document.querySelector('#hello').style.color = this.value;
				};

			});

		</script>
	</head>
	<body>
		<h1 id="hello">Hello!</h1>
		<select>
			<option value="black">Black</option>
			<option value="red">Red</option>
			<option value="blue">Blue</option>
			<option value="green">Green</option>
		</select>
	</body>
</html>
```

## Events

- onclick
- onmouseover
- onkeydown
- onkeyup
- onload
- onblur
- ...

## 向页面动态添加内容

- make a [tasks.html](/assets/lecture6/tasks.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Tasks</title>
		<script>
			//获取到提交的内容，在console打印
			document.addEventListener('DOMContentLoaded',()=>{

				//By default, submit button is disabled
				document.querySelector('#submit').disabled = true;
				//输入后且值长度大于0，可用
				document.querySelector('#task').onkeyup = ()=>{
					if (document.querySelector('#task').value.length>0) {
						document.querySelector('#submit').disabled = false;
					} else {
						document.querySelector('#submit').disabled = true;
					}
				}

				document.querySelector('form').onsubmit = ()=>{
					const task = document.querySelector('#task').value;
					// console.log(task);

					//向页面添加获取到的内容
					const li = document.createElement('li');
					li.innerHTML = task;
					//将li标签插入到ul中
					document.querySelector('#tasks').append(li);
					//每次提交后清空
					document.querySelector('#task').value = '';
					//提交后submit不可用
					document.querySelector('#submit').disabled = true;

					//Stop form from submitting
					return false;
				}
			});

		</script>
	</head>
	<body>
		<h1>Tasks</h1>
		<ul id="tasks">
		</ul>
		<form>
			<input id="task" placeholder="New Task" type="text" name="task">			
			<input id="submit" type="submit">
		</form>
	</body>
</html>
```

- setInterval(func(),times)函数可以在设定间隔时间重复调用函数

## Local Storage

- 存储浏览器本地变量,在每次刷新浏览器时，变量的值不会被重置. [local_storage](/assets/lecture6/local_storage.html)
- localStorage.getItem(key)
- localStorage.setItem(key,value)

```js
if(!localStorage.getItem('counter')){
	localStorage.setItem('counter',0);
}

function count() {
	let counter = localStorage.getItem('counter');
	counter++;
	document.querySelector('h1').innerHTML = counter;
	localStorage.setItem('counter',counter);
}

document.addEventListener('DOMContentLoaded',function(){
	document.querySelector('h1').innerHTML = localStorage.getItem('counter');
	document.querySelector('button').onclick = count;
});
````

# 使用JSON作为数据交互的API

- 从地址获取数据并转换为json格式，进行数据处理
- 异步处理

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Currency Exchange</title>
		<script>
			document.addEventListener('DOMContentLoaded',function(){

				//获取form提交
				document.querySelector('form').onsubmit = function() {
					//从地址获取数据
					fetch('https://api.exchangeratesapi.io/latest?base=USD')
					//获取到response数据，将其转换为json数据返回
					.then(response=>
						return response.json())
					.then(data=>{
						//处理获取到的json数据
						// console.log(data);
						const currency = document.querySelector('#currency').value.toUpperCase();
						const rate = data.rates[currency];

						//判断有效性
						if(rate !== undefined){
							document.querySelector('#result').innerHTML = `1 USD is equal to ${rate.toFixed(3)} ${currency}.`;
						} else {
							document.querySelector('#result').innerHTML = 'Invalid currency.'
						}
					})
					.catch(error=>{ //处理错误信息
						console.log('Error:', error);
					});

					//在本页面处理信息
					return false;
				}
			});
		</script>
	</head>
	<body>
		<form>
			<input id="currency" placeholder="Currency" type="text" name="currency">
			<input type="submit" name="Convert">
		</form>
		<div id="result">
			
		</div>
	</body>
</html>
```






