---
layout: post
title: Graph Theory
author: ns7137
description: 图论基础, 搬运自labuladong
---

- 一幅图由节点和边构成
- 邻接表和邻接矩阵来实现
	- 邻接表直观，占用空间少，无法判断两个节点是否相邻
	- 邻接矩阵可直接判断两个节点是否相邻，效率高，占用更多空间
- 图与多叉树最大区别，图可能包含环，遍历时需要visited数组辅助

# 图遍历框架

```java
// 记录被遍历过的节点
boolean[] visited;
// 记录从起点到当前节点的路径
boolean[] onPath;

void traverse(Graph graph, int s) {
	if (visited[s]) return;
	// 经过节点s， 标记已遍历
	visited[s] = true;
	// 做选择: 标记节点s在路径上
	onPath[s] = true;
	for (int neighbor : graph.neighbors(s)) {
		traverse(graph, neighbor);
	}
	// 撤销选择: 节点s离开路径
	onPath[s] = false;
}
```

## 所有可能的路径

```java
// 记录所有路径
List<List<Integer>> res = new LinkedList<>();

public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
	// 维护递归过程中经过的路径
	LinkedList<Integer> path = new LinkedList<>();
	traverse(graph, 0, path);
	return res;
}

void tarverse(int[][] graph, int s, LinkedList<Integer> path) {
	// 添加节点s到路径
	path.addLast(s);

	int n = graph.length;
	if (s == n-1) {
		// 到达终点
		res.add(new LinkedList<>(path));
		path.removeLast();
		return;
	}

	// 递归每个相邻节点
	for (int v : graph[s]) {
		traverse(graph, v, path);
	}

	// 从路径移出节点s
	path.removeLast();
}
```

## 有向图的环检测

```java
// 课程表，选课依赖问题，是否存在循环依赖

// 记录一次traverse 递归经过的节点
boolean[] onPath;
// 记录遍历过的节点，防止走回头路
boolean[] visited;
// 记录图中是否有环
boolean[] hasCycle = false;

boolean canFinish(int numCourses, int[][] prerequisites) {
	List<Integer>[] graph = buildGraph(numCourses, prerequisites);

	visited = new boolean[numCourses];
	onPath = new boolean[numCourses];

	// 遍历所有节点
	for (int i=0; i<numCourses; i++) {
		traverse(graph, i);
	}

	// 只要没环就可以完成
	return !hasCycle;
}

// 建图函数
List<Integer>[] buildGraph(int numCourses, int[][] prerequisites) {
	// 图中共 numCourses 个节点
	List<Integer>[] graph = new LinkedList[numCourses];
	for (int i=0; i< numCourses; i++) {
		graph[i] = new LinkedList<>();
	}
	for (int[] edge : prerequisites) {
		int from = edge[1];
		int to = edge[0];
		// from 指向 to 有向边
		graph[from].add(to);
	}
	return graph;
}

void traverse(List<Integer>[] graph, int s) {
	if (onPath[s]) {
		// 出现环
		hasCycle = true;
	}
	if (visited[s] || hasCycle) {
		// 访问过，或出现环，终止
		return;
	}
	// 前序
	visited[s] = true;
	onPath[s] = true;
	for (int t : graph[s]) {
		traverse(graph, t);
	}
	// 后序
	onPath[s] = false;
}
```

## 拓扑排序

- 直观的说就是，把图拉平，所有箭头方向都是一致的。所以有向图中存在环无法进行拓扑排序。有向无环图，一定可以拓扑排序。
- 后序遍历的结果进行反转，就是拓扑排序的结果。一个任务必须等到所有的依赖任务都完成之后才开始执行。

```java
// 记录后序遍历结果
List<Integer> postorder = new ArrayList<>();
// 记录是否存在环
boolean hasCycle = false;
boolean[] visited, onPath;

// 主函数
public int[] findOrder(int numCourses, int[][] prerequisites) {
	List<Integer>[] graph = buildGraph(numCourses, prerequisites);
	visited = new boolean[numCourses];
	onPath = new boolean[numCourses];
	// 遍历图
	for (int i=0; i<numCourses; i++) {
		traverse(graph, i);
	}
	// 有环图无法拓扑排序
	if (hasCycle) {
		return new int[]{};
	}
	// 逆后序遍历结果为拓扑排序结果
	Collections.reverse(postorder);
	int[] res = new int[numCourses];
	for (int i=0; i<numCourses; i++) {
		res[i] = postorder.get(i);
	}
	return res;
}

void traverse(List<Integer>[] graph, int s) {
	if (onPath[s]) {
		// 出现环
		hasCycle = true;
	}
	if (visited[s] || hasCycle) {
		// 访问过，或出现环，终止
		return;
	}
	// 前序
	visited[s] = true;
	onPath[s] = true;
	for (int t : graph[s]) {
		traverse(graph, t);
	}
	// 后序
	postorder.add(s);
	onPath[s] = false;
}

// 建图函数
List<Integer>[] buildGraph(int numCourses, int[][] prerequisites) {
	// 图中共 numCourses 个节点
	List<Integer>[] graph = new LinkedList[numCourses];
	for (int i=0; i< numCourses; i++) {
		graph[i] = new LinkedList<>();
	}
	for (int[] edge : prerequisites) {
		int from = edge[1];
		int to = edge[0];
		graph[from].add(to);
	}
	return graph;
}
```

# 二分图判定

- 双色问题，如果能成功将图染色，那么这图就是二分图，反之则不是。
- 遍历一遍图，一边遍历一边染色，用两种颜色给所有节点染色，且相邻节点的颜色都不相同。

```java
// 记录图是否二分
private boolean ok = true;
// 记录图节点的颜色
private boolean[] color;
// 记录图中节点是否被访问
private boolean[] visited;

// 主函数，输入邻接表，判断二分
public boolean isBipartite(int[][] graph) {
	int n = graph.length;
	color = new boolean[n];
	visited = new boolean[n];

	// 因为图不一定联通，存在多个子图，所以把每个节点都作为起点进行遍历
	for (int v=0; v<n; v++) {
		if (!visited[v]) {
			traverse(graph, v);
		}
	}
	return ok;
}

// DFS 遍历
private void traverse(int[][] graph, int v) {
	// 如果确定不是二分，返回
	if (!ok) return;

	visited[v] = true;
	for (int w : graph[v]) {
		if (!visited[w]) {
			// 相邻 w 没有被访问过，涂上与节点 v 不同的颜色
			color[w] = !color[v];
			// 继续遍历 w
			traverse(graph, w);
		} else {
			// 相邻 w 被访问过，根据颜色判断二分
			if (color[w] == color[v]) {
				// 相同则不是二分
				ok = false;
			}
		}
	}
}

// BFS 遍历
private void bfs(int[][] graph, int start) {
	Queue<Integer> q = new LinkedList<>();
	visited[start] = true;
	q.offer(start);

	while(!q.isEmpty() && ok) {
		int v = q.poll();
		// 从节点v向所有相邻节点扩散
		for (int w : graph[v]) {
			if (!visited[w]) {
				// 染色
				color[w] = !color[v];
				// 标记并放入队列
				visited[w] = true;
				q.offer(w);
			} else {
				if (color[w] == color[v]) {
					// 颜色相同，不是二分
					ok = false;
				}
			}
		}
	}
}
```

# Union-Find 并查集

- 动态连通性问题。连接两个节点，两个节点是否连通，连通分量是多少。
	- 自反性: 自身视为与自己连通
	- 对称性: 两个节点互为连通
	- 传递性: 导电，abc 两两连通
- 很多复杂dfs问题都可以用Union-Find解决，问题转化成图的动态连通性问题。

```java
class UF {
	// 连通分量个数
	private int count;
	// 存储一棵树
	private int[] parent;
	// 记录树的重量
	private int[] size;

	// n 初始化节点个数
	public UF(int n) {
		this.count = n;
		parent = new int[n];
		size = new int[n];
		for (int i=0; i<n; i++) {
			// 初始化父节点为自身
			parent[i] = i;
			// 初始重量1
			size[i] = 1;
		}
	}

	// 连接两节点
	public void union(int p, int q) {
		int rootP = find(p);
		int rootQ = find(q);
		if (rootP == rootQ) return;

		// 小树接到大树下面
		if (size[rootP] > size[rootQ]) {
			parent[rootQ] = rootP;
			size[rootP] += size[rootQ];
		} else {
			parent[rootP] = rootQ;
			size[rootQ] += size[rootP];
		}
		// 两个连通分量合并成一个，数量-1
		count--;
	}

	// 判断两节点是否连通
	public boolean connected(int p, int q) {
		int rootP = find(p);
		int rootQ = find(q);
		return rootP == rootQ;
	}

	// 返回节点 x 的连通分量根节点
	private int find(int x) {
		while(parent[x] != x) {
			// 路径压缩 最终树高不会超过3
			parent[x] = parent[parent[x]];
			x = parent[x];
		}
	}

	// 返回图中连通分量个数
	public int count() {
		return count;
	}
}
```

# Kruskal 最小生成树

- 所有可能的生成树中，权重和最小的那棵生成树就叫最小生成树。一般在无向加权图中计算。
- Union-Find在Kruskal中主要作用保证最小生成树的合法性。生成的是棵树(不包含环)

## 以图判树

```java
// 输入的若干条边是否能构造一棵树
boolean validTree(int n, int[][] edges) {
	// 初始化
	UF uf = new UF(n);
	// 遍历所有边, 组成边的节点两两连接
	for (int[] edge : edges) {
		int u = edge[0];
		int v = edge[1];
		// 若两个节点已经在同一个连通分量中，会产生环
		if (uf.connected(u,v)) {
			return false;
		}
		uf.union(u, v);
	}
	// 保证最后形成一棵树，即连通分量为1
	return uf.count() == 1;
}
```

## Kruskal

- 包含图中所有节点，形成的结构是树结构(不存在环)，权重和最小。
- 贪心思路，所有边权重从小到大排序，从权重最小边开始遍历，如果和mst中其他边不形成环，则是最小生成树一部分，加入mst集合。

```java
// 力扣第 1135 题「最低成本联通所有城市」
// n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]
int minimumCost(int n, int[][] connections) {
	// 编号1...n
	UF uf = new UF(n+1);
	// 权重从小到大
	Arrays.sort(connections, (a, b)->(a[2]-b[2]));
	// 最小生成树的权重之和
	int mst = 0;
	for (int[] edge : connections) {
		int u = edge[0];
		int v = edge[1];
		int weight = edge[2];
		// 产生环则不加入mst
		if (uf.connected(u, v)) {
			continue;
		}
		// 不产生环加入mst
		mst += weight;
		uf.union(u, v);
	}
	// 保证所有节点连通, 0未被使用，连通分量个数为2
	return uf.count() == 2 ? mst : -1;
}
```

```java
// 力扣第 1584 题「连接所有点的最小费用」
// points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
int minCostConnectPoints(int[][] points) {
	int n = points.length;
	// 生成边及权重
	List<int[]> edges = new ArrayList<>();
	for (int i=0; i<n; i++) {
		for (int j=i+1; j<n; j++) {
			int xi = points[i][0], yi = points[i][1];
			int xj = points[j][0], yj = points[j][1];
			// 用坐标点在points中索引表示坐标点
			edges.add(new int[] {
				i, j, Math.abs(xi-xj)+Math.abs(yi-yj)
			});
		}
	}
	// 将边按权重从小到大
	Collections.sort(edges, (a, b)->{
		return a[2]-b[2];
	});
	// Kruskal
	int mst = 0;
	UF uf = new UF(n);
	for (int[] edge : edges) {
		int u = edge[0];
		int v = edge[1];
		int weight = edge[2];
		if (uf.connected(u, v)) {
			continue;
		}
		mst += weight;
		uf.union(u, v);
	}
	return uf.count() == 1 ? mst : -1;
}
```

# Prim 最小生成树

- 也是贪心思想来生成树的权重尽可能小，切分定理。
- 使用BFS和visited布尔数组避免成环。
- 不需要优先边排序，而是利用优先级队列动态排序。

## 切分定理

- 将图分为两个不重叠且非空的节点集合，切中的边叫横切边，权重最小的那条横切边一定是构成最小生成树的一条边。
- 每次切分一定可以找到最小生成树中的一条边，每次把权重最小的横切边加入最小生成树，直到把构成最小生成树的所有边都切出来为止。
- 每次多切一个邻节点，cut({A,B,C}) = cut({A,B}) + cut({C}), 重复的边通过布尔数组辅助，防止重复计算横切边。

## Prim

```java
class Prim {
	// 存 横切边 的优先级队列
	private PriorityQueue<int[]> pq;
	// 记录哪些节点已成为最小生成树一部分
	private boolean[] inMST；
	// 记录最小生成树的权重和
	private int weightSum = 0;

	// graph邻接表
	// graph[s] 记录节点s所有相邻的边
	// 三元组int[]{from,to,weight} 表示一条边
	private List<int[]>[] graph;

	public Prim(List<int[]>[] graph) {
		this.graph = graph;
		this.pq = new PriorityQueue<>((a,b)->{
			// 按边权重从小到大排序
			return a[2]-b[2];
		});
		int n = graph.length;
		this.inMST = new boolean[n];

		// 从节点0开始切分
		inMST[0] = true;
		cut(0);
		// 不断切分，向最小生成树中添加
		while(!pq.isEmpty()) {
			int[] edge = pq.poll();
			int to = edge[1];
			int weight = edge[2];
			if(inMST[to]){
				// 节点to已经在mst中，跳过
				continue;
			}
			// 边 加入mst
			weightSum += weight;
			inMST[to] = true;
			// 节点to加入后，进行新一轮切分，产生更多横切边
			cut(to);
		}
	}

	// 将s的横切边加入优先级队列
	private void cut(int s) {
		for (int[] edge : graph[s]) {
			int to = edge[1];
			if (inMST[to]) {
				continue;
			}
			// 加入横切边队列
			pq.offer(edge);
		}
	}

	// 最小生成树的权重和
	public int weightSum() {
		return weightSum;
	}

	// 判断最小生成树是否包含图中的所有节点
	public boolean allConnected() {
		for (int i=0; i<inMST.length; i++) {
			if (!inMST[i]) {
				return false;
			}
		}
		return true;
	}
}
```