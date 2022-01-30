---
layout: post
title: Fast and Slow Pointer
author: ns7137
description: 快慢指针，原地修改数组，搬运自labuladong
---

# 有序数组，链表去重

- 快慢指针，让慢指针走在后面，快指针走在前面探路，找到一个不重复的元素就告诉slow并让slow前进一步。当fast遍历完整个数组后，nums[0...slow]就是不重复元素

```java
int removeDuplicates(int[] nums) {
	if (nums.length == 0) {
		return 0;
	}
	int slow = 0, fast = 0;
	while (fast < nums.length) {
		if (nums[fast] != nums[slow]) {
			// 如果不同就慢前进并赋值
			slow++;
			// 维护nums[0...slow]无重复
			nums[slow] = nums[fast];
		}
		fast++;
	}
	// 数组长度为慢索引 +1
	return slow + 1;
}
```

- 链表去重，把赋值操作变为操作指针

```java
ListNode deleteDuplicates(ListNode head) {
	if (head == null) return null;
	ListNode slow = head, fast = head;
	while (fast != null) {
		if (fast.val != slow.val) {
			slow.next = fast;
			slow = slow.next;
		}
		fast = fast.next;
	}
	// 断开与后面重复元素的连接
	slow.next = null;
	reurn head;
}
```

- 原地移除所有数值等于val的元素

```java
int removeElement(int[] nums, int val) {
	if (nums.length == 0) {
		return 0;
	}
	int fast = 0, slow = 0;
	while (fast < nums.length) {
		if (nums[fast] != val) {
			// 保证nums[0...slow-1]不包含val，先赋值再slow++
			nums[slow] = nums[fast];
			slow++;
		}
		fast++;
	}
	return slow;
}
```

- 原地移动数组中的零，到末尾，相当于将零移除，再在末尾添加

```java
void moveZeroes(int[] nums) {
	// 去除nums中所有0，并返回去除0的数组长度
	int p = removeElement(nums, 0);
	// 将p之后的所有元素都赋值为0
	for (; p<nums.length; p++) {
		nums[p] = 0;
	}
}
```