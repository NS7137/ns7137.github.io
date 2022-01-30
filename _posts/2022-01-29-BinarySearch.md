---
layout: post
title: Binary Search
author: ns7137
description: 二分查找,搬运自labuladong
---

# 二分查找框架

- 不要出现else，而是把所有情况用else if写清楚，这样可以清楚的展现所有细节

```java
int binarySearch(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1; // 注意
    
    // 终止条件 left == right + 1
    while (left <= right) {
        int mid = left + (right - left)/2;
        if (nums[mid] == target)
            // 直接返回
            return mid;
        else if (nums[mid] < target)
            left = mid + 1;
        else if (nums[mid] > target)
            right = mid - 1;
    }
    return -1;
}
```

- 为什么while循环的条件中是<=，而不是<
  - 因为初始化right时是nums.length-1，即最后一个元素的索引，而不是nums.length
  - 二者出现在不同二分查找中，前者相当于闭区间，后者相当于左闭右开区间

# 寻找左侧边界

```java
int left_bound(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            // 别返回，收缩右边界
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    // 最后检查 left 越界情况
    if (left >= nums.length || nums[left] != target)
        return -1;
    return left;
}
```

# 寻找右侧边界

```java
int right_bound(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            // 别返回，收缩左边界
            left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    // 最后检查 right 越界情况
    if (right < 0 || nums[right] != target)
        return -1;
    return right;
}
```

# 二分问题的泛化

- 把直接访问nums[mid]套一层函数f
- 确定x，f(x)，target分别是什么，并写出函数f的代码
- 找到x的取值范围作为二分搜索的区间，初始化left和right
- 根据要求，确定使用搜索左侧还是右侧的二分搜索

```java
// 函数 f 关于自变量x的单调函数
int f(int x) {
    // ...
}

// 主函数，在f(x)==target的约束下求 x 的最值
int solution(int[] nums, int target) {
    if (nums.length==0) return -1;
    // 自变量x的最小值是多少
    int left = ...;
    // 自变量x的最大值是多少
    int right = ... + 1;
    
    while(left < right){
        int mid = left + (right-left) / 2;
        if (f(mid) == target) {
            //题目求左边界还是右边界?
            //...
        } else if (f(mid)<target) {
            // 如何让f(x)大一点
        } else if (f(mid)>target) {
            // 如何让f(x)小一点
        }
    }
    return left;
}
```



- [704 二分查找](https://github.com/NS7137/leetcode-golang/blob/master/704binarySearch/binarySearch.go)
- [34 在排序数组中查找元素的第一个和最后一个位置](https://github.com/NS7137/leetcode-golang/blob/master/34searchRange/searchRange.go)
- [875 爱吃香蕉的珂珂](https://github.com/NS7137/leetcode-golang/blob/master/875kokoEatingBananas/minEatingSpeed.go)
- [1011 在 D 天内送达包裹的能力](https://github.com/NS7137/leetcode-golang/blob/master/1011shipWithinDays/shipWithinDays.go)