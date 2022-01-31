---
layout: post
title: Monotonic Stack
author: ns7137
description: 单调栈实现 next greater element, 搬运自labuladong
---

# 单调栈模板

- 数据入栈之前与栈内元素比较大小，栈内元素值只会单调增或单调减

## Next Greater Number

```c++
// nums = [2,1,2,4,4] 返回 [4,2,4,-1,-1]
vector<int> nextGreaterElement(vector<int>& nums) {
	vector<int> res(nums.size()); // 存放结果数组
	stack<int> s;
	// 倒着往栈里放
	for (int i = nums.size()-1; i >=0; i--){
		// 判定大小
		while (!s.empty() && s.top() <= nums[i]) {
			// 小的出栈，直到栈顶大或空
			s.pop();
		}
		// nums[i] 后的下一个 大值
		res[i] = s.empty()? -1 : s.top();
		s.push(nums[i]);
	}
	return res;
}
```

- java 单调栈加哈希 倒序遍历入栈

```java
//nums1 中数字 x 的 下一个更大元素 是指 x 在 nums2 中对应位置 右侧 的 第一个 比 x 大的元素。
//两个没有重复元素 的数组 nums1 和 nums2 ，下标从 0 开始计数，其中nums1 是 nums2 的子集。
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> map = new HashMap<Integer, Integer>();
    Deque<Integer> stack = new ArrayDeque<Integer>();
    for (int i = nums2.length - 1; i >= 0; --i) {
        int num = nums2[i];
        while (!stack.isEmpty() && num >= stack.peek()) {
            stack.pop();
        }
        map.put(num, stack.isEmpty() ? -1 : stack.peek());
        stack.push(num);
    }
    int[] res = new int[nums1.length];
    for (int i = 0; i < nums1.length; ++i) {
        res[i] = map.get(nums1[i]);
    }
    return res;
}
```

- 问题变形，处理环形数组，通过%求模

```c++
// %求模，将数组长度翻倍
// [2,1,2,4,3] 返回 [4,2,4,-1,4]
vector<int> nextGreaterElements(vector<int>& nums) {
	int n = nums.size();
	vector<int> res(n);
	stack<int> s;
	// 假装数组长度翻倍
	for (int i = 2*n - 1; i >= 0; i--) {
		// 索引求模
		while(!s.empty() && s.top() <= nums[i%n]) {
			s.pop();
		}
		res[i%n] = s.empty() ? -1 : s.top();
		s.push(nums[i%n]);
	}
	return res;
}
```

# 滑动窗口最大值

- 实现单调逻辑

```java
// 单调队列
class MonotonicQueue {

	// 双链表，支持头尾增删
	private LinkedList<Integer> q = new LinkedList<>();

	// 队尾添加元素
	public void push(int n) {
		// 将小于自己的元素都删除
		while(!q.isEmpty() && q.getLast() < n) {
			q.pollLast();
		}
		// 将 n 加入尾部
		q.addLast(n);
	}

	// 返回队列中最大值
	int max() {
		// 队头元素最大
		return q.getFirst();
	}

	// 队头元素 如果是n，删除
	void pop(int n) {
		// 因为有可能要出队列的元素已经在push过程中不存在了
		if (n==q.getFirst()) {
			q.pollFirst();
		}
	}

}
```

- 一个数组上滑动的大小为k的窗口中的最大值的结果集

```java
int[] maxSlidingWindow(int[] nums, int k) {
	MonotonicQueue window = new MonotonicQueue();
	List<Integer> res = new ArrayList<>();

	for (int i = 0; i < nums.length; i++) {
		if (i < k - 1) {
			// 先填满窗口前 k-1
			window.push(nums[i]);
		} else {
			// 窗口向前滑动，加入新元素
			window.push(nums[i]);
			// 记录当前最大值
			res.add(window.max());
			// 移除旧元素
			window.pop(nums[i-k+1]);
		}
	}
	// 转成int[] 返回
	int[] arr = new int[res.size()];
	for (int i = 0; i < res.size(); i++) {
		arr[i] = res.get(i);
	}
	return arr;
}
```

# 去除重复字母

- 去重，顺序不能打乱，并字典序最小

```java
String removeDulicateLetters(String s) {
	// 存放结果
	Stack<Character> stk = new Stack<>();
	// 布尔数组初始值false，记录栈中是否存在某字母
	boolean[] inStack = new boolean[256];

	// 维护一个计数器，统计字符串中字符数量
	int[] count = new int[256];
	for (int i = 0; i<s.length(); i++) {
		count[s.charAt(i)]++;
	}

	for (char c : s.toCharArray()) {
		// 每遍历过一个字符，对应计数减一
		count[c]--;
		// 如果字符c存在栈中，跳过
		if (inStack[c]) continue;
		// 不存在，则插入栈顶并标记存在
		// 插入之前和之前的元素比较大小，把大的出栈
		while (!stk.isEmpty() && stk.peek() > c) {
			// 如之后不存在栈顶元素了，则停止pop
			if (count[stk.peek()] == 0) {
				break;
			}

			// 否则，弹出栈顶元素，标记为不存在
			inStack[stk.pop()] = false;
		}
		stk.push(c);
		inStack[c] = true;
	}
	StringBuilder sb = new StringBuilder();
	while(!stk.empty()) {
		sb.append(stk.pop());
	}
	// 栈中元素插入顺序是反的，需要reverse一下
	return sb.reverse().toString();
}
```