---
layout: post
title: lecture4. Django Basic
author: ns7137
description: cs50-web notes
---

# Start a project

```bash
django-admin startproject lecture4
```

- 自动生成的文件目录

```markdown
lecture4
-lecture4
	- __init__.py 	# 一个空文件，告诉 Python 这个目录应该被认为是一个 Python 包
	- settings.py 	# 项目配置
	- urls.py 	# 总路由
	- wsgi.py 	# 网关接口,作为项目运行在 WSGI 兼容的Web服务器上的入口
	- asgi.py 	# 与ASGI兼容的web服务器为您的项目提供服务的入口
manage.py 		# django交互所有命名
```

- 本地启动server

```bash
python manage.py runserver  #http://127.0.0.1:8000/		默认页面
```

# Create an App

- 通过manage.py来自动生成app目录

```bash
python manage.py startapp hello
```

- hello目录会在project中生成

```markdown
hello
	- migrations
	- __init__.py
	- admin.py 		# 管理工具
	- apps.py 		# 应用的配置
	- models.py 		# 数据模型
	- tests.py 		# 编写测试文档
	- views.py 		# 用户保存响应各种请求的函数或者类的视图文件
lecture4
db.sqlite3
manage.py
```

## settings.py

- 再看setting文件，默认的INSTALLED_APPS的配置
- 将新建的hello，加入其中，使其生效

```python
# Application definition

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'hello' #添加自定义app
]
```

## views.py

- 用于保存响应各种请求的函数或者类

```python
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# 定义了一个index函数，作用返回一个HttpResponse，内容是Hello, world!
def index(request):
	return HttpResponse("Hello, world!")
```

## urls.py
- 在views中定义了函数，需要在某个视图中展示，先要定义它的目录路径
- 在hello目录中新建一个app自己的urls.py

```python
from django.urls import path
# 从当前模块引入views
from . import views

urlpatterns = [
	# 参数 是否有前缀层级，渲染哪个视图，定义一个名称给模板中使用
	path("", views.index, name="index")
]
```

- 回到项目目录的urls.py

```python
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
	path('admin/', admin.site.urls),
	# 添加hello的path，从hello应用的urls.py中引入
	path('hello/', include("hello.urls"))
]
```

- 通过启动本地server，在浏览器中查看结果。即最后展现的hello中index页面的url地址为: http://127.0.0.1:8000/hello/

## path 传参

- 遇到有传参的函数，可以通过path的第一个属性传参

```python
from django.shortcuts import render
from django.http import HttpResponse

def greet(request, name):
	# 响应时，同时可以对传参 字符串处理 此处首字母大写
	return HttpResponse(f"Hello, {name.capitalize()}")
```

```python
from django.urls import path
from . import views

urlpatterns = [
	# 即在当前hello/ 层级下 添加此传参的string
	# 本地url为 http://127.0.0.1:8000/hello/xxx # xxx为传递的参数
	path("<str:name>", views.greet, name="greet")
]
```

# Templates

- 渲染页面可以通过模板渲染，将模板放在templates目录中

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
	return render(request,"hello/index.html")
```

- 在项目目录新建一个templates文件夹，在templates目录下新建对应app的目录hello,将渲染页面建立在对应的app目录之下

```markdown
templates
- hello
	- index.html
```

- 然后编辑index.html，确定响应的的内容

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Hello!</title>
	</head>
	<body>
		<h1>Hello, world!</h1>
	</body>
</html>
```

- 当需要通过render向模板传属性值时，属性值以 dict 形式传递

```python
from django.shortcuts import render
from django.http import HttpResponse

def greet(request, name):
	# 属性值以 dict形式传递
	return render(request,"hello/greet.html",{"name":name.capitalize()})
```

- 在templates/hello 目录下新建greet.html

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Greet</title>
	</head>
	<body>
		<h1>Hello, {{ name }}!</h1>
	</body>
</html>
```

# 小结一下建app的流程

1. 首先通过 python manage.py startapp newyear 新建一个app目录
2. 然后在项目setting.py中，把新建app名称添加到INSTALLED_APPS列表当中去
3. 之后在项目urls.py中，把新建app的访问路径添加到urlpatterns的列表当中去,其path()的参数为
	- 参数1 app的根目录 "newyear/"
	- 参数2 app渲染视图的urls采用 include("newyear.urls")
4. 接着添加app自己的urls.py，其中的urlpatterns列表为app自己视图的urls,其中path()的参数为
	- 参数1 视图的根目录 "" 空表示app的根目录，如需在url中传参，则以 <paramType:paramName>形式表示
	- 参数2 视图对应的views.py中的函数
	- 参数3 视图在templates中的传递变量
5. 再者在view.py中定义视图所需的函数，返回值可以直接通过HttpReponse()响应，但一般通过渲染视图到模板的方式

```python
import datetime

from django.shortcuts import render

def index(request):
	now = datetime.datetime.now()
	return render(request, "newyear/index.html", {"newyear" : now.month == 1 and now.day == 1})
```

6. 最后在项目中的templates目录中新增app的目录newyear，在app的目录中新增对应index.html的模板文件

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Is it New Year?</title>
	</head>
	<body>
		{% if newyear %}
			<h1>YES</h1>
		{% else %}
			<h1>NO</h1>
		{% endif %}
	</body>
</html>
```

7. 启动服务器，在浏览器中访问结果

```bash
python manage.py runserver

# 浏览器newyear的视图本地地址 http://127.0.0.1:8000/newyear/
```


# 添加static目录

- 为页面添加样式css的文件放在项目目录下static中对应app的目录下static/newyear/style.css
- 当模板中视图文件加载css文件时，使用相应的加载静态文件表达式，使得服务器能找到static中样式的准确位置

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Is it New Year?</title>
		<link rel="stylesheet" href="{% static 'newyear/style.css' %}">
	</head>
	<body>
		{% if newyear %}
			<h1>YES</h1>
		{% else %}
			<h1>NO</h1>
		{% endif %}
	</body>
</html>
```

# 参数传递

- 在视图view.py定义函数时，需要向模板传递多个参数时，可以使用list，tuple，set，dict，或者类多种形式将数据封装后，或经过逻辑处理后，再向视图层传递

```python
from django.shortcuts import render

tasks = ["foo","bar","baz"]
def index(request):
	return render(request, "tasks/index.html", {"tasks" : tasks})
```

- 在视图中接收数据时，使用for loop表达式对接收的属性遍历取值

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Tasks</title>
	</head>
	<body>
		<ul>
			{% for task in tasks %}
				<li>{{ task }}</li>
			{% endfor %}
		</ul>
	</body>
</html>
```

# 数据页面展示与表单的提交

- 视图层定义了一个表单，填写数据后将数据提交并在另一个视图展示
- 在view.py中定义了这样的视图函数，当然不要忘记添加urlpatterns的操作

```python
from django.shortcuts import render

def add(request):
	return render(request, "tasks/add.html")
```

- add.html是一个表单，用于提交数据

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Tasks</title>
	</head>
	<body>
		<h1>Add Task</h1>
		<form>
			<input type="text" name="task">
			<input type="submit">
		</form>
	</body>
</html>
```

- layout.html是一个用于展示 其他页面的模板。其中需要用到表达式来接收页面内容。这样其他页面重复的部分就可以省略。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Tasks</title>
	</head>
	<body>
		{% block body %}
		{% endblock %}
	</body>
</html>
```

- 表达式的部分就是用来接收其他页面不同的部分，这样之前表单的页面就可以更改为，只保留需要的部分，用表达式将layout页面引入
- 如果从tasks的index视图链接到add视图，这里就用到了urlpatterns中的name属性，这样就不需要在更改urlpatterns中path后再来修改视图层的链接了，表达式会直接通过urlpatterns来找对应name属性的path

```html
{% extends "tasks/layout.html" %}

{% block body %}
	<h1>Tasks</h1>
	<ul>
		{% for task in tasks %}
			<li>{{ task }}</li>
		{% empty %}
			<li>No tasks.</li>
		{% endfor %}
	</ul>
	<a href="{% url 'add' %}">Add a New Task</a>
{% endblock %}
```

- 同样的对add页面的操作，但当遇到name的属性值相同的时候，server就无法区分链接的是哪个具体的页面，所以就需要在app各自urls.py的定义时加上 app_name = "tasks" 的变量，在视图中用冒号表示其命名空间
- 数据提交时，需要告诉form把填写的数据提交到哪里 form标签的action属性
- 同时为了安全，需要加上csrf_token，可以在setting.py中查看到django配置了MIDDLEWARE

```html
{% extends "tasks/layout.html" %}

{% block body %}
	<h1>Add Task</h1>
	<form action="{% url 'tasks: add' %}" method="post">
		{% csrf_token %}
		<input type="text" name="task">
		<input type="submit">
	</form>
	<a href="{% url 'tasks:index' %}">View Tasks</a>
{% endblock %}
```

- 这里把接收到的name值以post形式，提交回add视图，让对应的add函数处理
- django提供了forms模块，在views.py中，可以定义一个类，用这类来传参，并在页面用表达式调用数据生成视图表单
- 这里的"form"属性对应的就是NewTaskForm这个类，类中定义了一个标签为New Task的CharField用于接收数据，存入名为task的变量中。
- 这样改的好处就是当想要改变视图表单想要以哪种方式接收数据时，就不同更改页面代码，而且依然可以在py文件中检查输入数据的有效性

```python
from django import forms
from django.shortcuts import render

tasks = ["foo","bar","baz"]

class NewTaskForm(forms.Form):
	task = forms.CharField(lable="New Task")
	# 定义了一个接收整数的域，并限定了其取值范围
	priority = forms.IntegerField(label="Priority",min_value=1,max_value=10)

def index(request):
	return render(request, "tasks/index.html", {"tasks" : tasks})

def add(request):
	return render(request, "tasks/add.html", {"form" : NewTaskForm})
```

- add的视图可以更改为

```html
{% extends "tasks/layout.html" %}

{% block body %}
	<h1>Add Task</h1>
	<form action="{% url 'tasks: add' %}" method="post">
		{% csrf_token %}
		{{ form }}
		<input type="submit">
	</form>
	<a href="{% url 'tasks:index' %}">View Tasks</a>
{% endblock %}
```

- 接收数据区别对待get与post

```python
from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

def add(request):
	# 判断结束方式
	if request.method == "POST":
		# 以post方式接收全部数据
		form = NewTaskForm(request.POST)
		# 判断数据有效性
		if form.is_valid():
			# 有效则接收数据并添加在原数据列表后
			task = form.cleaned_data["task"]
			
			# 这里使用session后改成
			# request.session["tasks"] += [task]
			tasks.append(task)


			# 成功添加后，重定向，但不适用硬编码把url写死
			# 采用逆向工程 给一个命名空间对应的url名字，从urls中server自己找
			return HttpResponseRedirect(reverse("task:index"))
		else:
			# 如果无效返回原表单
			return render(request, "tasks/add.html", {"form" : form})
	# 如果以请求方式，就返回一个空表单
	return render(request, "tasks/add.html", {"form" : NewTaskForm})
```

- 因为tasks列表目前是全局变量，所以它的生命周期存在于整个应用活动期间，所有人都能看到其值，直到server重启或关闭
- 所以需要更改其生命周期，以及限定权限，一般以一次session会话为存储期限与id来区分使用对象，来实现数据不共享以及存储期限
- 在首次访问页面时生成其sessionId

```python

class NewTaskForm(forms.Form):
	task = forms.CharField(lable="New Task")
	# 定义了一个接收整数的域，并限定了其取值范围
	# priority = forms.IntegerField(label="Priority",min_value=1,max_value=10)

def index(request):
	if "tasks" not in request.session:
		# 把所有用tasks的地方全部改成 request.session["tasks"]
		request.session["tasks"] = []
	return render(request, "tasks/index.html", {"tasks" : request.session["tasks"]})
```

- 启动服务前，需要运行 python manage.py migrate 来生成许多default table，转移data into database
