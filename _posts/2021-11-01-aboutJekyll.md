---
layout: post
title: jekyll tutorial notes
description: 一些简单的目录层级视图
---

# in the beginning

It's a note took after watching the video thomasjbradley's Jekyll tutorial

# about jekyll
Transform plain text into static websites and blogs

# installation
- MacOS先安装xcode-lelect
	```bash
	xcode-select --install
	```

- 用Homebrew安装jekyll
	```bash
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
	```

- brew ruby
	```bash
	brew install ruby

	# 查看是否成功
	which gem
	```
- install jekyll
	```bash
	gem install jekyll

	which jekyll
	jekyll -v
	```
# setting up on Github
- 建库，然后新建一个branch，名字为gh-pages，把master给删了，因为用不到
- clone到本地,新建一个index.html/index.md
- push后就可以通过[username].github.io/[repository name] 访问到index主页
- 或者通过库的setting项中，GitHub Pages生成的地址访问

# 配置jekyll
- yml文件_config.yml
	```yml
	markdown: redcarpet # md解析器 或者其他 kramdown
	baseurl: /[repository name] # 一般为 /仓库名
	exclude: ['README.md'] # 不包含哪些文件或文件夹
	```

# 启动和停止
- 在仓库主目录文件夹下通过terminal启动
	```bash
	jekyll serve --watch --baseurl "" # 在本地以 / 为根目录baseurl
	```
- 通过localhost:4000 本地访问
- 通过ctrl-c停止

# the _site folder
- 初次启动会自动生成_site文件夹
- 里面会更新渲染的website的最终版本，即页面最终呈现的
- 但_site 也只是暂时的文件夹，github上并不需要上传
- 在.gitignore文件中添加忽略

# the_layouts folder
- 一个提供视图的文件夹，把公共部分放在默认文件中，其余展示页保留独有的，并include默认页
- 比如:default.html
	```html
	<<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Jekyll</title>
	</head>
	<body>

		<!-- 用来装载需要展示的部分 -->
		{{ content }}

	</body>
	</html>
	```
- 在独有的展示页中 载入默认页,比如 index.html
	```html
	---
	layout: default
	---
	<h1>Hello Jekyll</h1>
	<p>To be contained in default page</p>
	```

# creating navigation
- news.html 加入到主页导航功能范例
	```html
	---
	layout: default
	---
	<h1>News</h1>
	```
- 在default页中需要添加上链接，以下是对default.html的更新，就是加a标签把所有需要跳转的页面都加到主页
- 但是添加时考虑到上传github后非本地访问，需要添加site的根目录路径，即在yml中配置的baseurl，访问的方法为 site.baseurl 既可
	```html
	<<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Jekyll</title>
	</head>
	<body>
		<header>
			<h1>Jekyllsome</h1>
			<nav>
				<ul>
					<li><a href="{{site.baseurl}}/index.html">Home</a></li>
					<li><a href="{{site.baseurl}}/news.html">News</a></li>
				</ul>
			</nav>
		</header>
		<!-- 用来装载需要展示的部分 -->
		{{ content }}

	</body>
	</html>
	```

# includes 文件夹
- 同样我们也可以通过includes功能像包含default页来处理导航页
- 建一个 \_includes文件夹 把nav.html 放在其中
	```html
	<nav>
		<ul>
			<li><a href="{{site.baseurl}}/index.html">Home</a></li>
			<li><a href="{{site.baseurl}}/news.html">News</a></li>
		</ul>
	</nav>
	```
- 然后处理default.html 来包含nav.html
	```html
	<<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Jekyll</title>
	</head>
	<body>
		<header>
			<h1>Jekyllsome</h1>
			{% include nva.html %}
		</header>
		<!-- 用来装载需要展示的部分 -->
		{{ content }}

	</body>
	</html>
	```

# adding CSS
- 建一个css文件夹common.css，同样link中地址需要加上根目录
	```html
	<link href="{{site.baseurl}}/css/common.css" rel="stylesheet">
	```

# if endif 语句
- 可以在class属性中添加if endif语句，辅助判断操作
- 比如通过css高亮本页 nav项
	```html
	<nav>
		<ul>
			<li><a href="{{site.baseurl}}/index.html" class="{% if page.url == '/index.html' %} current {% endif %}">Home</a></li>
			<li><a href="{{site.baseurl}}/news.html" class="{% if page.url == '/news.html' %} current {% endif %}">News</a></li>
		</ul>
	</nav>
	```

# include parameters
- 通过 include  来传递信息，可以在其中添加属性来传值
	```html
	<header>
		<h1>Jekyllsome</h1>
		{% include nva.html navclass='nav-top' %}
	</header>

	<footer>
		{% include nva.html navclass='nav-bottom' %}
		<p>2021 Jekyll</p>
	</footer>
	```
- 然后在被包含页的class属性中添加 此属性名，可以通过此属性名来区分具体include的标签位置，然后就可以在css文件中通过.nav-top和.nav-bottom来分别设置样式
	```html
	<nav>
		<ul class="nav {{include.navclass}}">
			<li><a href="{{site.baseurl}}/index.html" class="{% if page.url == '/index.html' %} current {% endif %}">Home</a></li>
			<li><a href="{{site.baseurl}}/news.html" class="{% if page.url == '/news.html' %} current {% endif %}">News</a></li>
		</ul>
	</nav>
	```

# looping over posts
- 所有需要展示的内容放在_posts文件夹中，同样在所需要view的页面可以通过site.posts的方式找到其文件路径
- posts的命名格式 yyyy-mm-dd-xxx-xxx-xxx.md 以 "-" 分割的MARKUP文件
- posts的文件中 文件头部定义 文件信息例如:
	```markdown
	---
	layout: news [comment]:在哪个布局中显示md
	title: 文章标题
	date: xxxx-xx-xx
	meta: 或者description
	description:
	source:
	category: news [comment]:分类tag
	---
	```
- 在展示页面对posts文件夹中的文件进行遍历，提取每个属性对应posts的头部layout信息
	```html
	---
	layout: default
	---
	<h1>News</h1>
	<ul>
		{% for news in site.posts %}
		<li>
			<a href="">{{news.title}}</a>
			<p>{{news.meta}}</p>
		</li>
		<% endfor %>
	</ul>
	```

# post categories
- 在posts中的文件layout的category属性，其实是目录管理，每个分类对应posts目录中另一个子目录
- 所以除了通过site.posts查找还可通过site.categories查找目录，site.categories.news 即分类为news的目录中的posts
	```html
	---
	layout: default
	---
	<h1>News</h1>
	<ul>
		{% for news in site.categories.news %}
		<li>
			<a href="">{{news.title}}</a>
			<p>{{news.meta}}</p>
		</li>
		<% endfor %>
	</ul>
	```

# limiting the post loop
- 如果在index主页定义了展示分类为最近添加posts
- 并可以在for loop 中定义展示的posts上限 通过 limit属性
	```html
	---
	layout: default
	---
	<h1>Hello Jekyll</h1>
	<p>To be contained in default page</p>

	<h2>Recently Posts</h2>

	<ul>
		{% for news in site.categories.recently-posts limit:5 %}
		<li>
			<a href="">{{news.title}}</a>
			<p>{{news.meta}}</p>
		</li>
		{% endfor %}
	</ul>
	```

# if endif 中 contains or关键字
- 如果if判断包含多个目标文件，就用contains描述
- 可以将其更改为
	```html
	<nav>
		<ul>
			<li><a href="{{site.baseurl}}/index.html" class="{% if page.url == '/index.html' %} current {% endif %}">Home</a></li>
			<li><a href="{{site.baseurl}}/news.html" class="{% if page.url contains 'news' or 'recently-posts' %} current {% endif %}">News</a></li>
		</ul>
	</nav>
	```

# using posts for ordered content
- 如果需要展示的内容是要有序的，是否想起其posts的命名规则，时间，0000-01-01-postsname.md
- 例如有个planet-types目录，里面存放的是各种星体的介绍
- jekyll 默认展示排序是按文件名倒序，编号大的放在前面，所以决定遍历展示顺序的关键就是文件的名称,日期倒序展示
	```html
	---
	layout: default
	---
	<h1>Hello Jekyll</h1>
	<p>To be contained in default page</p>

	<h2>Types of Planets</h2>

	<ol>
	{% for planet in site.categories.planet-types %}
		<li>
			<a href="#">{{ planet.title }}</a>
			{{ planet.content }}
		</li>
	{% endfor %}
	</ol>
	
	<h2>Recently Posts</h2>
	
	<ul>
		{% for news in site.categories.recently-posts limit:5 %}
		<li>
			<a href="">{{news.title}}</a>
			<p>{{news.meta}}</p>
		</li>
		{% endfor %}
	</ul>
	```

# data files
- 另一种使用yml方式替代md文件展示并按编辑顺序遍历。
- 在根目录建_data 文件目录，建一个对应posts目录的yml文件，比如planet-types.yml。实际上是用data中yml的文件来代替md文件，所以对应的posts目录内容就重复了，可以删除
- 然后进行配置yml文件，既把md中的内容，按照你需要展示的循序照搬到yml中，格式如下
	```yml
	- title: Dwarf
	  folder: dwarf
	  content: 'A **dwarf planet** is a planetary-mass object that is neither a planet nor a satelite.'

  	- title: Terrestrial
  	  folder: terrestrial
  	  content: 'A **terrestrial planet**, **telluric planet** or **rocky planet** is a planet that is comprosed primarily of silicate rocks or metals' 

  	- title: Gas Giant
  	  folder: gas-giant
  	  content: 'A **gas giant** is a large planet that is not primarily composed of rock or other solid matter.' 
	```
- 在展示页面遍历的时候需要定义以markdownify方式展示
	```html
	---
	layout: default
	---
	<h1>Hello Jekyll</h1>
	<p>To be contained in default page</p>

	<h2>Types of Planets</h2>

	<ol>
	{% for planet in site.data.planet-types %}
		<li>
			<a href="#">{{ planet.title }}</a>
			{{ planet.content | markdownify }}
		</li>
	{% endfor %}
	</ol>
	<h2>Recently Posts</h2>
	
	<ul>
		{% for news in site.categories.recently-posts limit:5 %}
		<li>
			<a href="">{{news.title}}</a>
			<p>{{news.meta}}</p>
		</li>
		{% endfor %}
	</ul>
	```

# putting pages inside folders
- 定义目录层级，可以根据不同层级目录下的index页面进行不同folder下的展示。即每个目录下可以定义自己独有的index。
- 例如在site根目录，新建一个planets的目录在其中新建一个index.html文件，同样使用default模板
	```html
	---
	layout: default
	---

	<h1>Planets</h1>
	```

# looping over pages
- 比如在之前planets下还有其他的子目录，子目录中保存着需要在planets目录层级下展示的页面，如果只需要遍历指定目录的pages，需要怎么做
- 而如果在for loop中遍历 用site.pages会遍历此站点的所有pages，包括不在planets目录下的也都会展示出来
- 在md文件layout信息里加type属性进行目录分类，遍历时进行if else判断
	```markdown
	---
	layout: planet
	title: Pluto
	meta:
	type: dwarf
	image: pluto.jpg
	---
	```
- for loop遍历时
	```html
	---
	layout: default
	---

	<h1>Planets</h1>

	<h2>Dwarf</h2>

	<ul>
		{% for planet in site.pages %}
			{% if planet.type == 'dawrf' %}
			<li>
				{{ planet.title }}
			</li>
			{% endif %}
		{% endfor %}
	</ul>
	```

# includes with page loops
- 当遍历pages的操作重复时，可以提取出来，用作include文件
- 将命名后文件放入_includes文件夹中，比如planet-list.html
	```html
	<ul>
		{% for planet in site.pages %}
			{% if planet.type == include.type %}
			<li>
				{{ planet.title }}
			</li>
			{% endif %}
		{% endfor %}
	</ul>
	```
- 在使用时在包含页面使用 include  命令导入，同样在用到判断时，对属性进行赋值
	```html
	---
	layout: default
	---

	<h1>Planets</h1>

	<h2>Dwarf</h2>
	{% include planet-list.html type = 'dwarf' %}
	
	<h2>Terrestrial</h2>
	{% include planet-list.html type = 'terrestrial' %}

	<h2>Gas Giants</h2>
	{% include planet-list.html type = 'gas-giant' %}
	```

# advanced nested layouts for specific content types
- 嵌套展示，将展示的内容放到新的layout页面进行展示
- 比如 planet-list.html 模板更改为 同时加载图片并给图片添上跳转链接到planet.html的视图
	```html
	<ul>
		{% for planet in site.pages %}
			{% if planet.type == include.type %}
			<li>
				<!-- planet.url为if判断成立的type对应的目录层级的page路径 -->
				<a href="{{site.baseurl}}{{planet.url}}">
				<!-- 图片名为pages中layout信息中image属性对应的名字 -->
					<img src="{{site.baseurl}}/img/planets/{{planet.image}}" alt="Photo of {{page.title}}">
					<h3>{{ planet.title }}</h3>
					<p>{{ planet.meta }}</p>
				</a>
			</li>
			{% endif %}
		{% endfor %}
	</ul>
	```
- 例如之前pages信息，layout为planet，image为pluto.jpg
	```markdown
	---
	layout: planet
	title: Pluto
	meta:
	type: dwarf
	discoverer: Clyde W. Tombaugh
	discovered: 1930-02-18
	orbit: 247 years
	radius: 1161 km
	tilt: 119°
	image: pluto.jpg
	source: http://en.wikipedia.org/wiki/Pluto
	---
	```
- 将对应新建的planet.html放入_layouts中即可完成页面跳转
- 即planet.html也使用default模板，将自己需要展示的内容放入default.html中加载。也可以自定义不同的展示样式，将以提供的信息进行展示
	```html
	---
	layout: default
	---

	<h1>{{ page.title }}</h1>

	<img src="{{site.baseurl}}/img/planets/{{planet.image}}" alt="Photo of {{page.title}}">

	<dl>
		<dt>Discover:</dt><dd>{{ page.discoverer }}</dd>
		<dt>Discovered:</dt><dd>{{ page.discovered }}</dd>
		<dt>Orbit Period:</dt><dd>{{ page.orbit }}</dd>
		<dt>Mean Radius:</dt><dd>{{ page.radius }}</dd>
		<dt>Axial Tilt:</dt><dd>{{ page.tilt }}</dd>
	</dl>
	{{ content }}
	```

# page sub-folders
- 为各个子目录添加各自的index,比如planets下的dwarf
	```html
	---
	layout: default
	---

	<h1>Dwarf</h1>
	{% include planet-list.html type = 'dwarf' %}
	```
- 在主页空余的单独链接，添加地址，找寻folder时，需要在之前data目录中yml文件各个layout信息中添加folder属性，指明属于哪个子文件夹
	```html
	---
	layout: default
	---
	<h1>Hello Jekyll</h1>
	<p>To be contained in default page</p>

	<h2>Types of Planets</h2>

	<ol>
	{% for planet in site.data.planet-types %}
		<li>
			<a href="{{site.baseurl}}/planets/{{planet.folder}}">{{ planet.title }}</a>
			{{ planet.content | markdownify }}
		</li>
	{% endfor %}
	</ol>
	
	<h2>Recently Posts</h2>
	
	<ul>
	    {% for news in site.categories.recently-posts limit:5 %}
	    <li>
	        <a href="{{site.baseurl}}{{news.url}}">{{news.title}}</a>
	        <p>{{news.meta}}</p>
	    </li>
	    {% endfor %}
	</ul>
	```

# 小结
- Jekyll除了html定义页面也可以使用liquid定义页面，和html类似
- 在Jekyll中定义目录层级时，可以使用categories, type, folder属性信息，都表示是目录
- 为了展示时分清层级，在每个子目录下都建一个index视图文件，展示本层的pages信息
- 灵活运用if else和for loop，加 include  来展示自己视图 ，当然加点css是理所应当的