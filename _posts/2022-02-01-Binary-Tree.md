---
layout: post
title: Binary Tree
author: ns7137
description: 二叉树, 搬运自labuladong
---

# 二叉树的重要性

- 二叉树遍历框架

```java
void traverse(TreeNode root) {
	// 前序遍历
	traverse(root.left)
	// 中序遍历
	traverse(root.right)
	// 后序遍历
}
```

- 快速排序就是二叉树的前序遍历，归并排序就是二叉树的后序遍历

```java
// 快速排序的逻辑，对nums[lo..hi]排序，先找分界点p，通过交换元素使得nums[lo..p-1]小于nums[p]，且nums[p+1..hi]都大于nums[p]，然后递归去nums[lo..p-1]和nums[p+1..hi]中找新的分界点，最后整个数组被排序
void sort(int[] nums, int lo, int hi) {
	// 前序位置
	// 通过交换元素构建分界点p
	int p = partition(nums, lo, hi);

	sort(nums, lo, p-1);
	sort(nums, p+1, hi);
}


// 归并排序的逻辑，对nums[lo..hi]排序，先对nums[lo..mid]排序，再对nums[mid+1..hi]排序，最后把两个有序子数组合并，整个数组就排好序了。
void sort(int[] nums, int lo, int hi) {
	int mid = lo + (hi-lo)/2;
	sort(nums, lo, mid);
	sort(nums, mid+1, hi);

	// 后序位置
	// 合并两个排好序的子数组
	merge(nums, lo, mid, hi);
}
```

- 写树相关算法，先搞清楚当前root节点 该做什么 以及 什么时候做什么，然后根据函数定义递归调用子节点。难点是如何把要求细化成每个节点需要做的事情。

## 翻转二叉树

```java
TreeNode invertTree(TreeNode root) {
	// base case
	if (root == null) {
		return null;
	}

	// 前序，root节点需要交换它的左右子节点
	TreeNode tmp = root.left;
	root.left = root.right;
	root.right = tmp;

	// 让左右子节点继续翻转它们的子节点
	invertTree(root.left);
	invertTree(root.right);

	return root;
}
```

## 填充二叉树节点的右侧指针

```java
// 填充每个next指针，使其指向其下一个右侧节点
Node connect(Node root) {
	if (root == null) return null;
	connectTwoNode(root.left, root.right);
	return root;
}

// 辅助函数
void connectTwoNode(Node n1, Node n2) {
	if (n1 == null || n2 == null) {
		return
	}

	// 前序，将传入的两个节点连接
	n1.next = n2;

	// 连接相同父节点的两个子节点
	connectTwoNode(n1.left, n1.right);
	connectTwoNode(n2.left, n2.right);

	// 连接跨越父节点的两个子节点
	connectTwoNode(n1.right, n2.left);
}
```

## 将二叉树展开为链表

- 将root的左子树和右子树拉平。将root的右子树接到左子树下方，然后将整个左子树作为右子树。

```java
void flatten(TreeNode root) {
	// base case
	if (root == null) return;

	// 将root的左子树和右子树拉平
	flatten(root.left);
	flatten(root.right);

	// 后序
	// 1.左右子树已经被拉平成一条链表
	TreeNode left = root.left;
	TreeNode right = root.right;

	// 2.将左子树作为右子树
	root.left = null;
	root.right = left;

	// 3.将原先右子树接到当前右子树末端
	TreeNode p = root;
	while (p.right!=null){
		p = p.right;
	}
	p.right = right;
}
```

## 构建最大二叉树

```java
TreeNode constructMaximumBinaryTree(int[] nums) {
	return build(nums, 0, nums.length - 1);
}

TreeNode build(int[] nums, int lo, int hi) {
	// base case
	if (lo > hi) {
		return null;
	}

	// 找到数组中的最大值和对应的索引
	int index = -1, maxVal = Integer.MIN_VALUE;
	for (int i=lo; i<=hi; i++) {
		if (maxVal < nums[i]) {
			index = i;
			maxVal = nums[i];
		}
	}

	TreeNode root = new TreeNode(maxVal);
	//递归构造左右子树
	root.left = build(nums, lo, index - 1);
	root.right = build(nums, index + 1, hi);

	return root;
}
```

## 通过前序和中序遍历结果构造二叉树

- 确定根节点的值,前序遍历根节点值就是第一个值，可以通过根节点把中序遍历结果数组划分为两半，来构造左右子树。

```java
TreeNode buildTree(int[] preorder, int[] inorder) {
	return build(preorder, 0, preorder.length-1, inorder, 0, inorder.length-1);
}

TreeNode build(int[] preorder, int preStart, int preEnd, int[] inorder, int inStart, int inEnd) {
	// root节点对应的值就是前序遍历数组第一个元素
	int rootVal = preorder[preStart];
	// 获取 rootVal 在中序遍历数组中的索引
	int index = 0;
	for (int i=inStart; i<=inEnd; i++) {
		if (inorder[i] == rootVal) {
			index = i;
			break;
		}
	}

	int leftSize = index - inStart;

	TreeNode root = new TreeNode(rootVal);
	// 递归构造左右子树
	root.left = build(preorder, preStart+1, preStart + leftSize,
		inorder, inStart, index-1);
	root.right = build(preorder, preStart+leftSize+1, preEnd,
		inorder, index+1, inEnd);
	return root;

}
```

## 后序和中序遍历结果构造二叉树

- 同样后序遍历结果数组最后一个元素是根节点，通过根节点把中序遍历结果分两半，来构造左右子树

```java
TreeNode buildTree(int[] inorder, int[] postorder) {
	return build(inorder, 0, inorder.length-1, postorder, 0, postorder.length-1);
}

TreeNode build(int[] inorder, int inStart, int inEnd, int[] postorder, int postStart, int postEnd) {
	// root节点对应的值就是后序遍历数组的最后一个元素
	int rootVal = postorder[postEnd];
	// 获取rootVal在中序遍历数组中的索引
	int index = 0;
	for (int i=inStart; i<=inEnd; i++) {
		if (inorder[i] == rootVal) {
			index = i;
			break;
		}
	}

	TreeNode root = new TreeNode(rootVal);
	int leftSize = index - inStart;
	// 递归构造左右子树
	root.left = build(inorder, inStart, index - 1,
		postorder,postStart, postStart+leftSize-1);
	root.right = build(inorder, index+1, inEnd,
		postorder, postStart+leftSize,postEnd-1);
	return root;
}
```

## 寻找重复子树

- 以我为根的这棵二叉树(子树)长啥样?以其他节点为根的子树都长啥样?

```java
// 记录所有子树
HashMap<String, Integer> memo = new HashMap<>();
// 记录重复的子树根节点
LinkedList<TreeNode> res = new LinkedList<>();

// 主函数
List<TreeNode> findDuplicateSubtrees(TreeNode root) {
	traverse(root);
	return res;
}

// 辅助
String traverse(TreeNode root) {
	if (root == null) {
		return "#";
	}

	// 序列化成字符串
	String left = traverse(root.left);
	String right = traverse(root.right);

	String subTree = left + "," + right + "," + root.val;

	int freq = memo.getOrDefault(subTree, 0);
	// 多次重复也只会被加入结果集一次
	if (freq == 1) {
		res.add(root);
	}
	// 给子树对应的出现次数加一
	memo.put(subTree, freq+1);
	return subTree;
}
```

# 二叉树的序列化

## 前序遍历解法

```java
String SEP = ",";
String NULL = "#";

// 序列化
String serialize(TreeNode root) {
	StringBuilder sb = new StringBuilder();
	serialize(root, sb);
	return sb.toString();
}

// 辅助，将二叉树存入StringBuilder
void serialize(TreeNode root, StringBuilder sb) {
	if (root == null) {
		sb.append(NULL).append(SEP);
		return;
	}

	// 前序
	sb.append(root.val).append(SEP);

	serialize(root.left, sb);
	serialize(root.right, sb);
}

// 反序列化
TreeNode deserialize(String data) {
	// 字符串转列表
	LinkedList<String> nodes = new LinkedList<>();
	for (String s : data.split(SEP)) {
		nodes.addLast(s);
	}
	return deserialize(nodes);
}

// 辅助，通过nodes列表构造二叉树
TreeNode deserialize(LinkedList<String> nodes) {
	if (nodes.isEmpty()) return null;

	// 前序 根节点是第一个元素
	String first = nodes.removeFirst();
	if (first.equals(NULL)) return null;
	TreeNode root = new TreeNode(Integer.parseInt(first));

	root.left = deserialize(nodes);
	root.right = deserialize(nodes);

	return root;
}
```

## 后序遍历解法

```java
String SEP = ",";
String NULL = "#";

// 序列化
String serialize(TreeNode root) {
	StringBuilder sb = new StringBuilder();
	serialize(root, sb);
	return sb.toString();
}

void serialize(TreeNode root, StringBuilder sb) {
	if (root == null) {
		sb.append(NULL).append(SEP);
		return;
	}

	serialize(root.left, sb);
	serialize(root.right, sb);

	// 后序 拼接操作
	sb.append(root.val).append(SEP);
}

// 反序列化
TreeNode deserialize(String data) {
	LinkedList<String> nodes = new LinkedList<>();
	for (String s : data.split(SEP)) {
		nodes.addLast(s);
	}
	return deserialize(nodes);
}

TreeNode deserialize(LinkedList<String> nodes) {
	if (nodes.isEmpty()) return null;

	// 前序 从后往前取元素
	String last = nodes.removeLast();
	if (last.equals(NULL)) return null;
	TreeNode root = new TreeNode(Integer.parseInt(last));

	// 因为从后往前取元素，先构造右子树，后构造左子树
	root.right = deserialize(nodes);
	root.left = deserialize(nodes);

	return root;
}
```

## 中序遍历解法

- 可以序列化，但因root节点在两棵子树之间无法确切获取，也就无法反序列化

```java
String SEP = ",";
String NULL = "#";

// 序列化
String serialize(TreeNode root) {
	StringBuilder sb = new StringBuilder();
	serialize(root, sb);
	return sb.toString();
}

void serialize(TreeNode root, StringBuilder sb) {
	if (root == null) {
		sb.append(NULL).append(SEP);
		return;
	}

	serialize(root.left, sb);
	// 中序 拼接操作
	sb.append(root.val).append(SEP);
	serialize(root.right, sb);

}
```

## 层级遍历解法

```java
String SEP = ",";
String NULL = "#";

// 序列化
String serialize(TreeNode root) {
	if (root == null) return "";
	StringBuilder sb = new StringBuilder();
	// 初始化队列，将root入队
	Queue<TreeNode> q = new LinkedList<>();
	q.offer(root);

	while(!q.isEmpty()) {
		TreeNode cur = q.poll();

		// 层级遍历
		if (cur == null) {
			sb.append(NULL).append(SEP);
			continue;
		}
		sb.append(cur.val).append(SEP);

		q.offer(cur.left);
		q.offer(cur.right);
	}

	return sb.toString();
}

// 反序列化
TreeNode deserialize(String data) {
	if (data.isEmpty()) return null;
	String[] nodes = ddata.split(SEP);
	// 第一个元素就是root值
	TreeNode root = new TreeNode(Integer.parseInt(nodes[0]));

	// 队列q记录父节点，将root入队列
	Queue<TreeNode> q = new LinkedList<>();
	q.offer(root);

	for (int i=1; i<nodes.length; ) {
		// 队列中存的都是父节点
		TreeNode parent = q.poll();
		// 父节点对应的左侧子节点的值
		String left = nodes[i++];
		if (!left.equals(NULL)) {
			parent.left = new TreeNode(Integer.parseInt(left));
			q.offer(parent.left);
		} elst {
			parent.left = null;
		}
		// 父节点对应的右侧子节点的值
		String right = nodes[i++];
		if (!right.equals(NULL)) {
			parent.right = new TreeNode(Integer.parseInt(right));
			q.offer(parent.right);
		} elst {
			parent.right = null;
		}
	}
	return root;
}
```

# 二叉搜索树

- 左小右大，每个节点的左子树都比当前节点的值小，右子树都比当前节点的值大
- 中序遍历结果是有序的(升序)，改降序只需要改变递归顺序，先右后左

## BST第k小的元素

```java
// 记录结果
int res = 0;
// 记录当前元素排名
int rank = 0;

// 利用中序遍历的特性
int kthSmallest(TreeNode root, int k) {
	traverse(root, k);
	return res;
}

void traverse(TreeNode root, int k) {
	if (root == null) {
		return;
	}
	traverse(root.left, k);
	// 中序
	rank++;
	if (k==rank){
		// 找到第k小的元素
		res = root.val;
		return;
	}
	traverse(root.right, k);
}
```

## BST转化累加树

```java
TreeNode convertBST(TreeNode root) {
	traverse(root);
	return root;
}

//记录累加和
int sum = 0;
void traverse(TreeNode root) {
	if (root == null) {
		return;
	}

	traverse(root.right);
	// 维护累加和
	sum += root.maxVal;
	// 将BST转累加和树
	root.val = sum;
	traverse(root.left);
}
```

## 判断BST合法性

```java
boolean isValidBST(TreeNode root) {
	return isValidBST(root, null, null);
}

boolean isValidBST(TreeNode root, TreeNode min, TreeNode max) {
	// base case
	if (root == null) return true;
	// 若 root.val不符合max和min的限制，说明不合法
	if (min != null && root.val <= min.val) {
		return false;
	}
	if (max != null && root.val >= max.val) {
		return false;
	}
	// 限定左子树的最大值root.val 右子树最小值root.val
	return isValidBST(root.left, min, root) && isValidBST(root.right, root, max);
}
```

## 在BST中搜索元素

```java
// 要充分利用bst特性，左小右大
TreeNode searchBST(TreeNode root, int target) {
	if (root == null) {
		return null;
	}
	// 在左子树找
	if (root.val > target) {
		return searchBST(root.left, target);
	}
	if (root.val < target) {
		return searchBST(root.right, target);
	}
	return root;
}
```

## 在BST中插入一个元素

```java
// 在找的过程中，加入改的操作
TreeNode insertIntoBST(TreeNode root, int val) {
	// 找到空位插入新节点
	if (root == null) {
		return new TreeNode(val);
	}
	// 在左子树中插入
	if (root.val > val) {
		root.left = insertIntoBST(root.left, val);
	}
	if (root.val < val) {
		root.right = insertIntoBST(root.right, val);
	}
	return root;
}
```

## 在BST中删除一个元素

- 情况1 恰好是末端节点，两个子节点都为空，直接去世
- 情况2 只有一个非空子节点，让另一个子节点接替自己的位置
- 情况3 有两个子节点，为了不破坏BST性质，找到左子树中最大节点或右子树中最小节点来接替自己

```java
TreeNode deleteNode(TreeNode root, int key) {
	if (root == null) {
		return null;
	}
	if (root.val == key) {
		if (root.left == null) return root.right;
		if (root.right == null) return root.left;
		// 情况3 使用找右子树最小节点接替
		TreeNode minNode = getMin(root.right);
		// 删除右子树最小节点
		root.right = deleteNode(root.right, minNode.val);
		// 用右子树最小节点替换root
		minNode.left = root.left;
		minNode.right = root.right;
		root = minNode;
	} else if (root.val > key) {
		root.left = deleteNode(root.left, key);
	} else if (root.val < key) {
		root.right = deleteNode(root.right, key);
	}
	return root;
}

TreeNode getMin(TreeNode node) {
	while (node.left != null) {
		node = node.left;
	}
	return node;
}
```