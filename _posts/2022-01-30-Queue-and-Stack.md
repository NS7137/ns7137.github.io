---
layout: post
title: Queue and Stack
author: ns7137
description: 队列和栈实现, 搬运自labuladong
---

# 栈实现队列

- 使用两个栈实现队列功能，s1 s2，一个栈s1用于入队列，查看获取元素时，当s2为空，把s1里元素出栈压入s2，便可在s2中做到查看元素时先进先出顺序，s2不为空时可直接查看获取元素。

```java
class MyQueue {
	private Stack<Integer> s1, s2;

	public MyQueue() {
		s1 = new Stack<>();
		s2 = new Stack<>();
	}

	// 添加元素到队尾
	public void push(int x) {
		// 入队列时只需要把元素压入s1即可
		s1.push(x);
	}

	// 删除队头的元素并返回
	public int pop() {
		// 只需操作s2 先调用peek 保证s2非空
		peek();
		return s2.pop();
	}

	// 返回队头元素
	public int peek() {
		// s2作为中转，只要s2为空时，把s1的元素取出压入s2
		// 这时s2中元素就是先进先出顺序
		if (s2.isEmpty()) {
			while (!s1.isEmpty()) {
				s2.push(s1.pop());
			}
		}
		return s2.peek();
	}

	// 判断队列是否为空
	public boolean empty() {
		// 两个栈都为空，则队列为空
		return s1.isEmpty() && s2.isEmpty();
	}
}
```

# 队列实现栈

- 只需一个队列作为底层数据结构，实现简单粗暴

```java
class MyStack {
	private Queue<Integer> q;
	int top_elem;

	public MyStack() {
		q = new LinkedList<>();
		top_elem = 0;
	}

	// 添加元素到栈顶
	public void push(int x) {
		// x 是队列的队尾，是栈的栈顶
		q.offer(x);
		top_elem = x;
	}

	//  删除栈顶元素并返回
	public int pop() {
		// 把队列前面的都取出来再加入队尾，让之前队尾元素排到队头
		int size = q.size();
		// 留下队尾2个元素
		while (size > 2) {
			q.offer(q.poll());
			size--;
		}
		// 记录新的队尾元素
		top_elem = q.peek();
		q.offer(q.poll());
		// 之前的队尾元素已经到了队头
		return q.poll();

	}

	// 返回栈顶元素
	public int top() {
		return top_elem;
	}

	public boolean empty() {
		return q.isEmpty();
	}
}
```