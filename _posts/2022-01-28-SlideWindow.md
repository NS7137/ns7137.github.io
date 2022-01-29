---
layout: post
title: Sliding Window
author: ns7137
description: 滑动窗口,搬运自labuladong
---

# 滑动窗口算法框架

- 时间复杂度O(N)

```c++
void slidingWindow(string s, string t) {
    unordered_map<char, int> need, window;
    for (char c: t) need[c]++;
    int left = 0, right = 0;
    int valid = 0;
    while (right < s.size()) {
        // c 是将移入窗口的字符
        char c = s[right];
        // 右移窗口
        right++;
        // 进行窗口内数据的一系列更新
        
        // debug 输出位置
        printf("window:[%d, %d)\n", left, right);
        
        // 判断左侧窗口是否要收缩
        while (window needs shrink) {
            // d 是将移出窗口的字符
            char d = s[left];
            // 左移窗口
            left++;
            // 进行窗口内数据的一系列更新
        }
    }
}
```

- [76 最小覆盖子串](https://github.com/NS7137/leetcode-golang/blob/master/76minWindow/minWindow.go)

- [567 字符串的排列](https://github.com/NS7137/leetcode-golang/blob/master/567permutationInString/checkInClusion.go)

- [438 找到字符串中所有字母异位词](https://github.com/NS7137/leetcode-golang/blob/master/438findAnagrams/findAnagrams.go)

- [3 无重复字符的最长字串](https://github.com/NS7137/leetcode-golang/blob/master/3longestSubstringWithoutRepeatingCharacters/lengthOfLongestSubstrings.go)

