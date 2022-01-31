---
layout: post
title: Find Median
author: ns7137
description: 数据流的中位数, 搬运自labuladong
---

# 数据流的中位数

- 使用两个优先级队列，将有序数组抽象成一个倒三角形，宽度视为元素大小，那么倒三角的中部就是中位数元素。一切为二，小倒三角是个大顶堆，梯形就是个小顶堆，中位数通过它们的堆顶元素计算出来。
- 梯形小顶堆，放较大元素，large。小倒三角大顶堆，放较小元素，small。两个堆中的元素之差不能超过1。

```java
class MedianFinder {
	private PriorityQueue<Integer> large;
	private PriorityQueue<Integer> small;

	public MedianFinder() {
		// 小顶堆
		large = new PriorityQueue<>();
		// 大顶堆
		small = new PriorityQueue<>((a, b) -> {
			return b - a;
		});
	}

	public double findMedian() {
		// 如果元素不一样多，多的那个堆的堆顶元素就是中位数
		if (large.size() < small.size()) {
			return small.peek();
		} else if (large.size() > small.size()) {
			return large.peek();
		}
		// 如果元素一样多，两个堆堆顶元素的平均数是中位数
		return (large.peek() + small.peek()) / 2.0;
	}

	// 1.添加元素时，两个堆中元素之差不能超过1
	// 2.大顶堆元素总是比小顶堆元素小
	public void addNum(int num) {
		// 往large放，先入small，再从small取堆顶放入large，保证条件2
		if (small.size() >= large.size()) {
			small.offer(num);
			large.offer(small.poll());
		} else { // 同理
			large.offer(num);
			small.offer(large.poll());
		}
	}
}
```