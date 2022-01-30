---
layout: post
title: About LinkedList
author: ns7137
description: 单链表操作, 搬运自labuladong
---

# 单链表的套路

- 双指针的运用是非常广泛的，记得灵活运用呀。
- 虚拟头节点，占位符避免处理空指针

## 合并两个有序链表

```java
ListNode mergeTwoLists(ListNode l1, ListNode l2) {
	// 虚拟头节点，占位符避免处理空指针
	ListNode dummy = new ListNode(-1);
	ListNode p = dummy;
	ListNode p1 = l1, p2 = l2;

	while (p1 != null && p2 != null) {
		// 比较p1,p2 将值小的节点接到p
		if (p1.val > p2.val) {
			p.next = p2;
			p2 = p2.next;
		} else {
			p.next = p1;
			p1 = p1.next;
		}
		// p指针不断前进
		p = p.next;

		if (p1 != null) {
			p.next = p1;
		}

		if (p2 != null) {
			p.next = p2;
		}

		return dummy.next
	}
}
```

## 合并K个有序链表

- 用优先级队列，把链表节点放入最小堆，每次获得k个节点中的最小节点

```java
// 整体时间复杂度 O(NlogK)
ListNode mergeKLists(ListNode[] lists) {
	if (lists.length == 0) return null;
	// 虚拟头节点
	ListNode dummy = new ListNod(-1);
	ListNode p = dummy;
	// 优先级队列 最小堆
	PriorityQueue<ListNode> pq = new PriorityQueue<>(
		lists.length, (a,b)-> (a.val - b.val));
	// 将 k 个链表的头节点加入最小堆
	for (ListNode head : lists) {
		if (head != null)
			pq.add(head);
	}

	while (!pq.isEmpty()) {
		// 获取最小节点，接到结果链表中
		ListNode node = pq.poll();
		p.next = node;
		// 并将后续节点入队列
		if (node.next != null) {
			pq.add(node.next);
		}
		// p指针不断前进
		p = p.next;
	}

	return dummy.next;
}
```

## 寻找单链表的倒数第K个节点

- 在只知道头节点，不知道链表有几个节点的前提下，需要遍历2次，1次得到长度n，2次得到第n-k个节点
- 1次遍历的解法，快慢指针。p1从头先走k步，再p2从头与p1一起前进，直到p1为null遍历完列表，此时p2位置为n-k，即链表倒数第k个节点

```java
ListNode findFromEnd(ListNode head, int k) {
	ListNode p1 = head;
	// p1 先走 k 步
	for (int i=0; i<k; i++) {
		p1 = p1.next;
	}
	ListNode p2 = head;
	// p1 p2 同时走 n-k 步
	while (p1 != null) {
		p1 = p1.next;
		p2 = p2.next;
	}
	// p2 指向第 n-k 个节点
	return p2;
}
```

- [19 删除链表的倒数第 N 个结点](https://github.com/NS7137/leetcode-golang/blob/master/19removeNthNodeFromEndofList/removeNthFromEnd.go)

## 寻找单链表的中点

- 快慢指针，每当慢指针前进一步，块指针就前进两步，当快指针到末尾时，慢指针指向链表中点。当链表长度为偶数时，这个解法返回的是靠后的那个节点

```java
ListNode middleNode(ListNode head) {
	// 快慢指针初始化
	ListNode slow = head, fast = head;
	// 快指针走到末尾时停止
	while (fast != null && fast.next != null) {
		// 慢指针走一步，快指针走两步
		slow = slow.next;
		fast = fast.next.next;
	}
	// 慢指针指向中点
	return slow;
}
```

## 判断单链表是否包含环并找出环起点

- 依旧快慢指针，快指针遇空指针，说明没环，如果快慢相遇，快超过慢一圈，有环

```java
boolean hasCycle(ListNode head) {
	// 快慢指针初始化
	ListNode slow = head, fast = head;
	// 快指针走到末尾时停止
	while (fast != null && fast.next != null) {
		// 慢指针走一步，快指针走两步
		slow = slow.next;
		fast = fast.next.next;
		// 判断是否相遇
		if (slow == fast) {
			return true;
		}
	}
	return false;
}
```

- 快慢相遇时，慢走k步，那么快一定走了2k步。多走的k步其实就是快指针在环里转圈，所以k的值就是环长度的整数倍。假设相遇点距离环的起点距离为m，那么k-m为头节点head到环起点的距离。相遇点走k-m步后也到环起点。

```java
ListNode detectCycle(ListNode head) {
	// 快慢指针初始化
	ListNode slow = head, fast = head;
	// 快指针走到末尾时停止
	while (fast != null && fast.next != null) {
		// 慢指针走一步，快指针走两步
		slow = slow.next;
		fast = fast.next.next;
		// 快慢相遇时跳出循环
		if (slow == fast) break;
	}

	if (fast == null || fast.next == null) {
		// fast 遇到空指针说明没有环
		return null;
	}

	// 慢重新指向头节点
	slow = head;
	// 快慢同时前进 再次相遇就是环节点
	while (slow != fast) {
		slow = slow.next;
		fast = fast.next;
	}
	return slow;
}
```

## 判断两个单链表是否相交并找出交点

- 不使用额外空间，通过两个指针，p1遍历完A之后开始遍历B，p2遍历玩B之后遍历A，逻辑上两条链表接在了一起。这样可以让p1和p2同时进入公共部分，也就是同时到达相交节点。如果没有相交也能同时到达null

```java
ListNode getIntersectionNode(ListNode h1, ListNode h2) {
	// p1指向h1，p2指向h2
	ListNode p1 = h1, p2 = h2;
	while (p1 != p2) {
		// 各自前进遍历到末尾，转另一个链表
		if (p1 == null) p1 = h2;
		else p1 = p1.next;
		if (p2 == null) p2 = h1;
		else p2 = p2.next;
	}
	// null未相交
	return p1;
}
```

## 链表的递归思路

- 对于递归，最重要的就是明确递归函数的定义。不要跳进递归，而是利用明确的定义来实现算法逻辑。
- 递归操作并不高效，和迭代比，时间复杂度都是O(N)，但迭代空间复杂度是O(1)，而递归需要堆栈，空间复杂度是O(N)。考虑效率迭代更好。

### 递归反转整个链表

```java
ListNode reverse(ListNode head) {
	// base case 链表只有一个节点的时候反转也是它自己
	if (head == null || head.next == null) {
		return head;
	}
	// 得到除了head以外的已经反转了的头节点即原末节点
	ListNode last = reverse(head.next);
	// 剩下要做的就只是把反转后的尾节点指向head
	head.next.next = head;
	// head 指向空
	head.next = null;
	return last;
}
```

### 反转链表前N个节点 n<=链表长度

```java
// 定义一个后驱节点
ListNode successor = null;

Lis reverseN(ListNode head, int n) {
	// base case 反转一个元素，就是它本身，同时记录后驱节点
	if (n==1) {
		// 记录第n+1个节点
		successor = head.next;
		return head;
	}
	// 以head.next为起点，反转前 n-1个节点
	ListNode last = reverseN(head.next, n-1);
	head.next.next = head;
	// 反转之后的head节点和后驱的节点连起来
	head.next = successor;
	return last
}
```

### 反转链表的一部分

- m为1时，相当于反转前n个元素
- m不为1时，即从第m个元素开始反转。

```java
ListNode reverseBetween(ListNode head, int m, int n) {
	// base case
	if (m == 1) {
		// 相当于反转前n个元素
		reutrn reverseN(head, n);
	}
	// 前进到反转的起点出发base case
	head.next = reverseBetween(head.next, m-1, n-1);
	return head;
}
```