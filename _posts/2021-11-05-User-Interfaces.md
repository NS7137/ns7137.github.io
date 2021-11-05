---
layout: post
title: lecture7. User Interfaces
author: ns7137
description: cs50-web notes
---

# Single-Page Applications

- three in one [singlepage](/assets/lecture7/singlepage.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Single Page</title>
		<style>
			div {
				display: none; /*将div隐藏*/
			}
		</style>
		<script>
			
			function showPage(page) {

				//每次只显示一个div，再显示先把所有都隐藏
				document.querySelectorAll('div').forEach(div=>{
					div.style.display = 'none';
				})
				//通过id定位div
				document.querySelector(`#${page}`).style.display = 'block';
			}

			//将函数与button绑定
			document.addEventListener('DOMContentLoaded',function(){
				document.querySelectorAll('button').forEach(button=>{
					//遍历每个button，当onclick事件触发，就调用方法，
					//将当前button的dataset的page值作为showPage的参数
					button.onclick = function(){
						showPage(this.dataset.page)
					}
				});
			});

		</script>
	</head>
	<body>
	<!-- 用dataset存储每个button对应的div id -->
		<button data-page="page1">Page 1</button>
		<button data-page="page2">Page 2</button>
		<button data-page="page3">Page 3</button>
		<div id="page1">
			<h1>This is page 1.</h1>
		</div>
		<div id="page2">
			<h1>This is page 2.</h1>
		</div>
		<div id="page3">
			<h1>This is page 3.</h1>
		</div>
	</body>
</html>
```

## singlepage with django

- 建一个singlepage1的django app
- urls的配置 一个index和一个路径为sections后加整型参数

```python
from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("sections/<int:num>", views.section, name="section")
]
```

- views的函数定义

```python
from django.http import Http404, HttpResponse
from django.shortcuts import render

def index(request):
	return render(request, "singlepage/index.html")

texts = ["这是section1的内容","这是section2的内容","这是section3的内容"]

def section(request, num):
	if 1 <= num <= 3:
		return HttpResponse(texts[num - 1])
	else:
		return Http404("No such section")
```

- 在对应templates中index.html，定义showSection函数

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Single Page</title>
		<script>
			
			function showSection(section){
				//从地址获取数据
				fetch(`/sections/${section}`)
				.then(response=>response.text())
				.then(text=>{
					console.log(text);
					document.querySelector('#content').innerHTML = text;
				});
			}

			document.addEventListener('DOMContentLoaded',function(){
				document.querySelectorAll('button').forEach(button=>{
					button.onclick = function(){
						showSection(this.dataset.section);
					}
				})
			});

		</script>
	</head>
	<body>
		<h1>Hello!</h1>
		<button data-section="1">Section 1</button>
		<button data-section="2">Section 2</button>
		<button data-section="3">Section 3</button>
		<div id="content">
			
		</div>

	</body>
</html>
```

## 历史记录点

- 使用回退，前进

```js
//监听历史记录点
window.onpopstate = function(event){
	console.log(event.state.section);
	showSection(event.state.section);
}

function showSection(section){

	fetch(`/sections/${section}`)
	.then(response=>response.text())
	.then(text=>{
		console.log(text);
		document.querySelector('#content').innerHTML = text;
	})
}

document.addEventListener('DOMContentLoaded',function(){
	document.querySelectorAll('button').forEach(button=>{
		button.onclick = function(){
			const section = this.dataset.section;
			//创建一条新的历史记录
			//当前state,title,url
			history.pushState({section: section}, "", `section${section}`);
			showSection(section);
		}
	})
})
```

# window的一些属性

- window.innerWidth 	# 显示区的高度
- window.innerHeight	# 显示区的宽度
- window.scrollY 		# 文档在垂直方向已滚动的像素值
- document.body.offsetHeight # 整个文档的高度
- 可以计算出end of the page, scrollY + innerHeight = offsetHeight，用户是否到达文档底端

## [Scroll](/assets/lecture7/scroll.html)

- 推测合适到底

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Scroll</title>
	</head>
		<script>
			
			window.onscroll = ()=>{
				// 判断是否达到page低端
				if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
					document.querySelector('body').style.background = 'skyblue';
				} else {
					document.querySelector('body').style.background = 'white';
				}
			}
		</script>
	<body>
		<p>1</p>
<!-- 100行... -->
		<p>100</p>
	</body>
</html>
```

# infinit scroll

- 建新django app，posts
- urls，index和posts

```python
from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("posts", views.posts, name="posts")
]
```
- views做了什么，需要返回输入开始到结束的posts列表，以JSON格式

```python
import time
from django.http import JsonResponse
from django.shortcuts import render

def index(request):
	return render(request, "posts/index.html")

def posts(request):
	# 需要提供2个参数，表示开始和结束
	start = int(request.GET.get("start") or 0)
	end = int(request.GET.get("end") or (start + 9))

	# 生成posts列表
	data = []
	for i in range(start, end+1):
		data.append(f"Post #{i}")

	# 延迟响应时间
	time.sleep(1)


```

- index页面

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Posts</title>
		<script>
			//初始值
			let counter = 1;

			//每次20posts 一加载
			const quantity = 20;

			//页面初次加载，渲染20条posts
			document.addEventListener('DOMContentLoaded', load);

			//到达页面底端就加载后20posts
			window.onscroll = () => {
				if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
					load();
				}
			}

			//加载下一组posts
			function load(){

				//设置起始和结束 更新起始
				const start = counter;
				const end = start + quantity - 1;
				counter = end + 1;

				//获取新posts 并 添加posts
				fetch('/posts?start=${start}&end=${end}')
				.then(response=>response.json())
				.then(data=>{
					data.posts.forEach(add_post);
				})
			};

			//添加新的post内容到dom
			function add_post(contents) {

				const post = document.createElement('div');
				post.className = 'post';
				post.innerHTML = contents;

				document.querySelector('#posts').append(post);
			};

		</script>
	</head>
	<body>
		<div id="posts">
		</div>
	</body>
</html>
```

# Animate

- 使用css 实现一些animation，通过js控制动画效果

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Animate</title>
		<style>
			
			@keyframes grow {
				from {
					font-size: 20px;
				}

				to {
					font-size: 100px;
				}
			}

			@keyframes mvoe {
				from {
					left: 0%;
				}

				to {
					left: 50%;
				}
			}

			@keyframes mvoeback {
				0% {
					left: 0%;
				}

				50% {
					left: 50%;
				}

				100% {
					left: 0%;
				}
			}

			h1 {
				position: relative; /*关联位置 使用位置百分比*/
				animation-name: moveback; /*选择名为xx的效果*/
				animation-duration: 2s;
				animation-fill-mode: forwards;
				animation-iteration-count: infinite; /*设置次数或infinite*/
			}
		</style>
		<script>
			document.addEventListener('DOMContentLoaded',function(){
				const h1 = document.querySelector('h1');
				h1.style.animationPlayState = 'paused';

				document.querySelector('button').onclick = ()=> {
					if (h1.style.animationPlayState === 'paused') {
						h1.style.animationPlayState = 'running';
					} else {
						h1.style.animationPlayState = 'paused';
					}
				}
			})
		</script>
	</head>
	<body>
		<button>Click Here!</button>
		<h1>Welcome!</h1>
	</body>
</html>
```

- 隐藏效果

```js
//点击事件
document.addEventListener('click',event=>{
	//然后判断是否是需要隐藏的button
	const element = event.target;
	if (element.className === 'hide') {
		//移除了hide这个元素的父元素包含了这个button
		// element.parentElement.remove();
		//使用动画效果
		element.parentElement.style.animationPlayState = 'running';
		//在动画效果结束后，移除
		element.parentElement.addEventListener('animationend',()=>{
			element.parentElement.remove();
		})

	}
}) 
```

- 给父标签post一个动画效果

```html
<style>
/*通过设置内外高度与边距，可以实现shrink效果*/
	@keyframes hide {

		0% {
			opacity: 1;
			height: 100%;
			line-height: 100%;
			padding: 20px;
			margin-bottom: 10px;
		}

		75% {
			opacity: 0;
			height: 100%;
			line-height: 100%;
			padding: 20px;
			margin-bottom: 10px;
		}

		100% {
			opacity: 0;
			height: 0px;
			line-height: 0px;
			padding: 0px;
			margin-bottom: 0px;
		}
	}


	.post {
		background-color: greenyellow;
		padding: 20px;
		margin-bottom: 10px;

		animation-name: hide;
		animation-duration: 2s;
		animation-fill-mode: forwards;
		animation-play-state: paused;
	}
</style>
```

# React

- 3个package，react，react-dom，babel
- react 处理页面属性
- react-dom 将react组件插入dom中
- babel translate code from one to another

## react 示例

- 带参数的方法重用 [react](/assets/lecture7/react.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>React</title>
		<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
		<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
		<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	</head>
	<body>
		<div id="app"></div>

		<script type="text/babel">
			/*方法重用，且带参数*/
			function Hello(props){
				return(
					<h1>Hello,{props.name}!</h1>
				);
			}

			function App(){
				return (
					/*传参*/
					<div>
						<Hello name="Harry"/>
						<Hello name="Ron"/>
						<Hello name="Hermione"/>
					</div>
				);
			}

			ReactDOM.render(<App />, document.querySelector('#app'));
		</script>
	</body>
</html>
```

- 用react改写[counter](/assets/lecture7/counter.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Counter</title>
		<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
		<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
		<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
	</head>
	<body>
		<div id="app"></div>

		<script type="text/babel">


			function App(){
				//hock 初始值，返回这个值，并要设置成什么值
				const [count,setCount] = React.useState(0);

				function updateCount(){
					//使用useState的方法
					setCount(count+1);
				}

				return (
					<div>
						<div>{count}</div>
						<button onClick={updateCount}>Count</button>
					</div>
				);
			}

			ReactDOM.render(<App />, document.querySelector('#app'));
		</script>
	</body>
</html>
```

- 提交后判断，输入的值是否正确,并在到达一定分数后判断获胜 [addition](/assets/lecture7/addition.html)

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Addition</title>
		<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
		<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
		<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

		<style>
			#app{
				text-align: center;
				font-family: sans-serif;
			}

			#problem{
				font-size: 72px;
			}

			.incorrect{
				color: red;
			}

			#winner {
				font-size: 72px;
				color: limegreen;
			}
		</style>
	</head>
	<body>
		<div id="app"></div>

		<script type="text/babel">


			function App(){

				//const [num1, setNum1] = React.useState(1);
				//const [num2, setNum2] = React.useState(2);

				//useState除了数值，也可以是JSON
				//response记录填写的值
				//并添加一个分数，判断是否正确
				const [state, setState] = React.useState({
					num1:1,
					num2:2,
					response:"",
					score:0,
					incorrect:false
				});

				function inputKeyPress(event) {
					if(event.key === "Enter"){
						const answer = parseInt(state.response)
						if(state.num1 + state.num2 === answer){
							// User got question right
							//当正确更新需要计算的数，随机
							//判断完后清空input
							setState({
								...state,
								num1: Math.ceil(Math.random()*10),
								num2: Math.ceil(Math.random()*10),
								score: state.score + 1,
								response:"",
								incorrect:false

							})
						} else {
							// User get question wrong
							setState({
								...state,
								score: state.score - 1,
								response:"",
								incorrect:true
							})

						}
					}
				}

				function updateResponse(event) {

					setState({
						//num1和num2不变，只对response更新
						//num1: state.num1,
						//num2: state.num2,
						...state, //表示所有值都不变，除了
						response: event.target.value
					});

				}

				if (state.score === 10) {
					return(
						<div id="winner">
							You Won!
						</div>
					);
				}
				

				return(

					<div>
						<div className={state.incorrect?"incorrect":""} id="problem"> {state.num1} + {state.num2} </div>
						<input autoFocus={true} onKeyPress={inputKeyPress} onChange={updateResponse} value={state.response}/>
						<div>Score:{state.score}</div>
					</div>
				);
			}

			ReactDOM.render(<App />, document.querySelector('#app'));
		</script>
	</body>
</html>
```