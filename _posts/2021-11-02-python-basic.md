---
layout: post
title: lecture3. Python Program Basic
author: ns7137
description: notes for cs50-web
---

# Hello World
- 简单的print

```py
print("Hello, World!")
```
- 命令行编译时

```bash
python hello.py
```

# Variables
- python是动态的强类型 解释性语言
- 定义变量不需要声明类型，编译器会自行判断

```py
a = 28		#int
b = 1.5		#float
c = "Hello!"	#str
d = True	#bool
e = None	#NoneType
```

# print的简单格式
- 从键盘输入传参

```py
name = input("Name: ")
print("Hello, " + name)
```
- 以fstr(format string)形式输出

```py
name = input("Name: ")
print(f"Hello, {name}")
```

# Conditions
- 需要注意的只是缩进，其他与if else没区别
- 从input返回的是str，需要强转为int

```py
n = input("Number: ")
n = int(n)

if n > 0:
	print("n is positive")
elif n < 0:
	print("n is negative")
else:
	print("n is zero")
```

# Sequences
- 每个str都能以list形式读取

```py
name = "Harry"

print(name[1]) #打印第一个字符 输出 a

#所以在list中的形式是
nameList = ['H','a','r','r','y']
print(name[1])
```
- list在python中的表现形式为方括号\[\]

```py
names = ["Harry", "Ron", "Hermione"]

print(names[2]) #打印第三个元素 输出Hermione
```
- 当想要多个元素表达为1个单独的unit，可以使用tuple

```py
coordinateX = 10.0
coordinateY = 20.0
#用tuple来代替单独声明定义
coordinate = (10.0,20.0)
```

# Data Structures
- list: sequence of mutable values
- tuple: sequence of immutable values
- set: collection of unique values
- dict: collection of key-value pairs

## List
- 可变序列

```py
# 定义一个list of names
names = ["Harry", "Ron", "Hermione","Ginny"]

# append()在list尾添加元素
names.append("Draco")

# sort() 对当前list中元素排序
names.sort()

print(names)
```

## Tuple
- 不可变序列，操作与list相似，唯独tuple中的元素是不可更改的

## Set
- 想要集合中元素是独一无二的，可以使用set集合

```py
# Create an empyt set
s = set()

# Add elements to set
s.add(1)
s.add(2)
s.add(3)
s.add(4)
s.add(3)

# 重复添加同一元素是无效的
print(s)

# 删除元素
s.remove(2)
print(s)

# 返回set中有多少元素
n = len(s)
print(f"The set has {n} elements.")
```

## Dict
- k-v 键值对，字典类型，一个键对应一个值，键不能重复

```py
# 创建一个dict
dict = {}

# 可以通过dict['key'] = value 形式添加，key不存在添加，存在则为修改对应key的值
dict['key1'] = 'value1'
dict['key2'] = 'value2'
dict['key3'] = 'value3'
dict['key2'] = 'value4'

print(dict)

# 直接创建键值以冒号分隔
houses = {"Harry":"Gryffindor", "Draco":"Slytherin"}
# 插入
houses["Hermione"] = "Gryffindor"
# 打印键值
print(houses["Hermione"])

```

# Loop
- for loop的表现形式

```py
for i in [0,1,2,3,4,5,6,7,8,9]:
	print(i)

# range
for i in range(10):
	print(i)

# 对定义的列表for loop
names = ["Harry", "Ron", "Hermione","Ginny"]

for name in names:
	print(name)

# 对字符串for loop
name = "Harry"

for character in name:
	print(character)
```

# Function
- 关键字 def 定义函数、方法

```py
# 定义一个乘方的函数functions.py
def square(x):
	return x * x

# 打印0~9的乘方
for i in range(10):
	print(f"The square of {i} is {square(i)}")
```

- 当其他文件需要使用定义的函数时，可以使用from 模块 import 函数 来导入,或者直接import 模块，模块即为py的文件名
- 在使用模块导入时，调用函数，需要在函数前加上模块名称

```py
# 在其他文件中使用square函数
from functions import square

for i in range(10):
	print(f"The square of {i} is {square(i)}")

import functions
for i in range(10):
	print(f"The square of {i} is {functions.square(i)}")
```

# Class
- 自定义对象，把数据和函数定义在一个对象中，即class类中

```py
class Point():
	# 初始化对象的函数，构造
	def __init__(self, input1, input2):
		# 将传值，存储在对象中的x,y成员变量中
		self.x = input1
		self.y = input2

# 使用时，通过定义的对象变量 用点取对象中的变量的值
p = Point(2,8)
print(p.x)
print(p.y)
```

- 可以为自定义对象添加自己存储数据的规则

```py
# 例如 定义航班，限定乘位
class Flight():
	def __init__(slef, capacity):
		self.capacity = capacity
		# 构造时添加乘客list
		self.passengers = []

	def add_passenger(self, name):
		# 在添加前检查是否超出capacity上限
		if not self.open_seats():
			return False
			# 每添加一位乘客就存入list中
		self.passengers.append(name)
		return True

	# 返回剩余多少capacity
	def open_seats(self):
		return self.capacity - len(self.passengers)

flight = Flight(3)

people = ["Harry", "Ron", "Hermione","Ginny"]
for person in people:
	success = flight.add_passenger(person)
	if success:
		print(f"Added {person} to flight successfully.")
	else:
		print(f"No available seats for {person} ")
```

# Decorators
- 为定义函数，在其基础上为其添加前后的处理逻辑

```py
# 定义decorator的函数,其参数是另一个函数,返回值是其内部的封装函数
def announce(f):
	# 封装的函数用于处理逻辑
	def wrapper():
		print("About to run the function...")
		f()
		print("Done with the function.")
	return wrapper

# 使用时用@在需要封装的函数上调用
@announce
def hello():
	print("Hello, world!")

hello()
```

# Lambda
- 函数表达式，用于简化代码
- 例如 当需要为复杂对象排序时

```py
# 一个list，每个元素是一个dict
people = [
	{"name":"Harry","house":"Gryffindor"},
	{"name":"Cho","house":"Ravenclaw"},
	{"name":"Draco","house":"Slytherin"},
]

# 定义返回键值的函数
def f(person):
	return person["name"]

# 需要知道排序的规则
people.sort(key=f)

print(people)
```

- 用lambda代替定义函数

```py
people.sort(key=lambda person: person["name"])
```

# Exceptions
- 当某段代码遇到某些传参而导致可遇见的异常或error时，可以对代码进行异常的处理，或给出明确的错误提示，提升其健壮性

```py
import sys

try:
	x = int(input("x: "))
	y = int(input("y: "))
except ValueError:
	print("Error: Invalid input, must integer.")
	sys.exit(1)

try:
	result = x / y
except ZeroDivisionError:
	print("Error: Cannot divide by 0.")
	sys.exit(1)

print(f"{x} / {y} = {result}")
```
