---
layout: post
title: Prefix Sum and Difference
author: ns7137
description: 前缀和与差分数组,搬运自labuladong
---

# 前缀和数组

- 适用于原始数组不会被修改的情况下，频繁查询某个区间的累加和

```java
class PrefixSum {
    //前缀和数组
    private int[] prefix;
    
    // 输入一个数组，构造前缀和
    public PrefixSum(int[] nums) {
        prefix = new int[nums.length + 1];
        // 计算 nums 累加和
        for (int i = 1; i<prefix.length; i++) {
            prefix[i] = prefix[i-1] + nums[i-1];
        }
    }
    
    // 查询闭区间 [i,j] 的累加和
    public int query(int i, int j) {
        return prefix[j + 1] - prefix[i];
    }
}
```

- [303 区域和检索 - 数组不可变](https://github.com/NS7137/leetcode-golang/blob/master/303rangeSumQuery/rangesumquery.go)
- [304 二维区域和检索 - 矩阵不可变](https://github.com/NS7137/leetcode-golang/blob/master/304rangeSumQuery2D/rangesumquery2d.go)
- [560 和为 K 的子数组](https://github.com/NS7137/leetcode-golang/blob/master/560subarraySumEqualsK/subarraySumEqualsK.go)

# 差分数组

- 可以快速进行区间增减的操作

```java
class Difference {
    // 差分数组
    private int[] diff;
    
    // 输入一个数组，区间操作将在这个数组上进行
    public Difference(int[] nums) {
        assert nums.length > 0;
        diff = new int[nums.length];
        // 根据初始数组构造差分数组
        diff[0] = nums[0];
        for (int i = 1; i<nums.length; i++) {
            diff[i] = nums[i] - nums[i-1];
        }
    }
    
    // 闭区间[i,j] 增加 val (可以是负数)
    public void increment(int i, int j, int val) {
        diff[i] += val;
        // 当j+1>=diff.length时，说明对nums[i]及以后整个数组都进行修改，就不需要再给diff数组减val了
        if ( j + 1 < diff.length) {
            diff[j + 1] -= val;
        }
    }
    
    // 返回结果数组
    public int[] result() {
        int[] res = new int[diff.length];
        // 根据差分数组构造结果数组
        res[0] = diff[0];
        for (int i=1; i<diff.length; i++) {
            res[i] = res[i - 1] + diff[i];
        }
        return res;
    }
}
```

- [370 区间加法](https://github.com/NS7137/leetcode-golang/blob/master/370rangeAdditon/rangeaddition.go)
- [1109 航班预订统计](https://github.com/NS7137/leetcode-golang/blob/master/1109corporateFlightBookings/flightBookings.go)
- [1094 拼车](https://github.com/NS7137/leetcode-golang/blob/master/1094carPooling/carPooling.go)