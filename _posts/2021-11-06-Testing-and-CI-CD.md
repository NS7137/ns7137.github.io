---
layout: post
title: lecture8. Testing and CI/CD
author: ns7137
description: cs50-web notes
---

# assert

- 判断函数是否正确

```python
def square(x):
	return x * x

# 可以使用print测试
print(square(10) == 100)

# 代替print，正确时不会打印，错误时给出AssertionError
assert square(10) == 100
```

- is prime

```python
import math

def is_prime(n):
	if n < 2:
		return False
	for in range(2,int(math.sqrt(n))):
		if n % i == 0:
			return False
	return True

def test_prime(n,expected):
	if is_prime(n) != expected:
		print(f"ERROR on is_prime({n}), expected {expected}")
```

# unittest

- 用于python写测试文件的类，断言未通过的会指明错误位置，打印方法doc并打印错误信息

```python
import unittest

from prime import is_prime

# 写个类测试is_prime
class Tests(unittest.TestCase):

	def test_1(self):
		"""Check that 1 is not prime"""
		self.assertFalse(is_prime(1))

	def test_2(self):
		"""Check that 2 is prime"""
		self.assertTrue(is_prime(2))

if __name__="__main__":
	unittest.main()
```

- 之前Flight类中，增加如何判单航班有效

```python
def is_valid_flight(self):
	# 是否有效 起始不等于终点 且 时间大于等于零
	return self.origin != self.destination and self.duration >= 0
```

## unittest Methods

- assertEqual
- assertNotEqual
- assertTrue
- assertFalse
- assertIn
- assertNotIn
- ...

# Django Testing

- 与unittest类似，编写完测试类，通过python manage.py test调用

```python
from django.test import Client, TestCase
from .models import Airport, Flight, Passenger

class FlightTestCase(TestCase):

	def setUp(self):

		a1 = Airport.objects.create(code="AAA",city="City A")
		a2 = Airport.objects.create(code="BBB",city="City B")

		Flight.objects.create(origin=a1,destination=a2,duration=100)
		Flight.objects.create(origin=a1,destination=a1,duration=200)
		Flight.objects.create(origin=a1,destination=a2,duration=-100)

	def test_departures_count(self):
		a = Airport.objects.get(code="AAA")
		self.assertEqual(a.departures.count(),3)

	def test_arrivals_count(self):
		a = Airport.objects.get(code="AAA")
		self.assertEqual(a.arrivals.count(),1)

	def test_valid_flight(self):
		a1 = Airport.objects.get(code="AAA")
		a2 = Airport.objects.get(code="BBB")
		f = Flight.objects.get(origin=a1,destination=a2,duration=100)
		self.assertTrue(f.is_valid_flight())

	def test_invalid_flight_destination(self):
		a1 = Airport.objects.get(code="AAA")
		f = Flight.objects.get(origin=a1,destination=a1)
		self.assertFalse(f.is_valid_flight())

	def test_invalid_flight_duration(self):
		a1 = Airport.objects.get(code="AAA")
		a2 = Airport.objects.get(code="BBB")
		f = Flight.objects.get(origin=a1,destination=a2,duration=-100)
		self.assertFalse(f.is_valid_flight())
```

- 测试web

```python
# 测试页面是否加载正常，是否有3个航班
def test_index(self):
	c = Client()
	response = c.get("/flights/")
	self.assertEqual(response.status_code,200)
	self.assertEqual(response.context["flights"].count(),3)


def test_valid_flight_page(self):
	a1 = Airport.objects.get(code="AAA")
	f = Flight.objects.get(origin=a1,destination=a1)

	c = Client()
	response = c.get(f"/flights/{f.id}")
	self.assertEqual(response.status_code,200)

def test_invalid_flight_page(self):
	max_id = Flight.objects.all().aggregate(Max("id"))["id_max"]

	c = Client()
	response = c.get(f"/flights/{max_id + 1}")
	self.assertEqual(response.status_code, 404)

def test_flight_page_passengers(self):
	f = Flight.objects.get(pk=1)
	p = Passenger.objects.create(first="Alice",last="Adams")
	f.passengers.add(p)

	c = Client()
	response = c.get(f"/flights/{f.id}")
	self.assertEqual(response.status_code,200)
	self.assertEqual(response.context["passengers"].count(),1)

def test_flight_page_non_passenger(self):
	f = Flight.objects.get(pk=1)
	p = Passenger.objects.create(first="Alice",last="Adams")

	c = Client()
	response = c.get(f"/flights/{f.id}")
	self.assertEqual(response.status_code,200)
	self.assertEqual(response.context["passengers"].count(),1)
```

# Browser Testing 

- 编辑待测试页面

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Counter</title>
		<script>
			document.addEventListener('DOMContentLoaded',()=>{
				let counter = 0;

				document.querySelector('#increase').onclick = ()=>{
					counter++;
					document.querySelector('h1').innerHTML = counter;
				}

				document.querySelector('#decrease').onclick = ()=>{
					counter--;
					document.querySelector('h1').innerHTML = counter;
				}
			})
		</script>
	</head>
	<body>
		<h1>0</h1>
		<button id="increase">+</button>
		<button id="decrease">-</button>
	</body>
</html>
```

- selenium模拟浏览器测试页面js方法

```python
import os
import pathlib
import unittest

from selenium import webdriver

def file_uri(filename):
	return pathlib.Path(os.path.abspath(filename)).as_uri()

driver = webdriver.Chrome()

class WebpageTests(unittest.TestCase):

	def test_title(self):
		driver.get(file_uri("counter.html"))
		self.assertEqual(driver.title,"Counter")

	def test_increase(self):
		driver.get(file_uri("counter.html"))
		increase = driver.find_element_by_id("increase")
		increase.click()
		self.assertEqual(driver.find_element_by_tag_name("h1").text, "1")

	def test_decrease(self):
		driver.get(file_uri("counter.html"))
		decrease = driver.find_element_by_id("decrease")
		decrease.click()
		self.assertEqual(driver.find_element_by_tag_name("h1").text, "-1")

	def test_multiple_increase(self):
		driver.get(file_uri("counter.html"))
		increase = driver.find_element_by_id("increase")
		for i in range(3):
			increase.click()
		self.assertEqual(driver.find_element_by_tag_name("h1").text, "3")

# 以下python命令行 参考
from tests import *
# 告诉浏览器打开哪个页面，让驱动获取打开
uri = file_uri(counter.html)
driver.get(uri)
# 检查页面标题
driver.title
# 整个页面的内容
driver.page_source
# 找到测试按键
increase = driver.find_element_by_id("increase")
decrease = driver.find_element_by_id("decrease")
# 模拟交互
increase.click()
decrease.click()

for i in range(25):
	increase.click()
```

# CI/CD

- Continuous Integration 持续集成
	- Frequent merges to main branch
	- Automated unit testing

- Continuous Delivery 持续交付
	- Short release schedules

- Continuous Deployment 最后阶段 持续部署
	- 自动将应用发布到生成环境
	- 依赖精心设计的测试自动化

- 所有的CI/CD关联步骤都有助于降低应用的部署风险，更便于小件的方式而非一次性发布对应用的更改。

# GitHub Actions

- workflow 持续集成一次运行的过程
- job 一个workflow由一个或多个jobs构成
- step 每个job由多个step构成
- action 每个step可以依次执行一个或多个命令
	- actions/setup-node@74bc508 # 指向一个 commit
 	- actions/setup-node@v1.0    # 指向一个标签
	- actions/setup-node@master  # 指向一个分支

## workflow 文件

- 放在代码仓库.github/workflows
- yaml格式

```yaml
name: Testing
on: push # 每当push时触发workflow

jobs:
	test_project:
		runs-on: ubuntu-latest	# 指定虚拟机环境
		steps:
		- uses: actions/checkout@v2 	# 指向一个标签
		- name: Run Django unit tests 	# 步骤名称
		  run: # 运行的命令或action
		  	pip3 install --user django
		  	python3 manage.py test
```

# Docker 环境容器

- 使用Dockerfile 创建一个Django运行环境

```Dockerfile
FROM python:3 	# another dock image, base use python3
COPY . /usr/src/app 	# 从当前目录copy到
WORKDIR /usr/src/app 	# cd /usr/src/app 进入工作目录
RUN pip install -r requirements.txt 	# 安装package
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"] 	# 启动容器时，run command ，端口8000
```

- 根据不同的技术栈配置不同容器的运行环境

- docker-compose 管理容器，用于定义和运行多容器Docker
	- 将管理的容器分三层：工程，服务，容器
	- 运行目录下所有文件docker-compose.yml组成一个工程，一个工程包含多个服务，每个服务中定义了容器运行的镜像、参数、依赖，一个服务可以包括多个容器实例

```yaml
version: '3'	# 指定文件的写法格式

services:		# 多个容器集合 此处2个一个db一个web
	db:
		image: postrges 	# 指定镜像

	web:
		build: .	# 配置构建时，Compose会利用它自动构建镜像，可以是路径，也可以是对象，用于指定Dockerfile参数
		volumes: 	# 卷挂载路径
			- .:/urs/src/app
		ports: 		# 对外暴露的端口 宿主端口:容器端口
			- "8000:8000"
```

- 常用命令

	- ps：列出所有运行容器
	- logs：查看服务日志输出
	- port：打印绑定的公共端口
	- build：构建或重新构建服务
	- start：启动指定服务已存在的容器
	- stop：停止已运行的服务的容器
	- rm：删除指定服务的容器
	- up：构建、启动容器
	- kill：通过sigkill信号来停止指定服务容器
	- pull：下载服务镜像
	- scale：设置指定服务运行的个数，service=num形式指定
	- run：在一个服务上执行一个命令

- 进入到容器，通过docker ps 查看存在的容器
- docker exec -it containerid bash -l # 以交互模式进入容器

