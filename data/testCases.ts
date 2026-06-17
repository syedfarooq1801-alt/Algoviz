// Test cases + Python harnesses for ~40 core problems.
// Python harnesses run via Pyodide (in-browser, no API key needed).
// {INPUT} in harnessTemplate is replaced with the test case JSON input.

export interface ProblemTestCase {
  id: string;
  label: string;
  input: string;    // JSON dict of named args matching harness
  expected: string; // expected stdout from Python json.dumps
  hidden?: boolean;
}

export interface ProblemRunner {
  problemId: string;
  pythonStarter: string;     // shown in editor
  preamble: string;          // injected before user code (TreeNode, ListNode defs)
  harnessTemplate: string;   // injected after user code; {INPUT} → test case JSON
  testCases: ProblemTestCase[];
}

// ─── Shared preambles ───────────────────────────────────────────────────────

const TREE_PREAMBLE = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right
def _bt(v):
    from collections import deque as _dq
    if not v or v[0] is None: return None
    r = TreeNode(v[0]); q = _dq([r]); i = 1
    while q and i < len(v):
        n = q.popleft()
        if i < len(v) and v[i] is not None: n.left = TreeNode(v[i]); q.append(n.left)
        i += 1
        if i < len(v) and v[i] is not None: n.right = TreeNode(v[i]); q.append(n.right)
        i += 1
    return r
def _st(r):
    from collections import deque as _dq
    if not r: return []
    res = []; q = _dq([r])
    while q:
        n = q.popleft()
        if n: res.append(n.val); q.append(n.left); q.append(n.right)
        else: res.append(None)
    while res and res[-1] is None: res.pop()
    return res`;

const LIST_PREAMBLE = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next
def _bl(v):
    if not v: return None
    h = ListNode(v[0]); c = h
    for x in v[1:]: c.next = ListNode(x); c = c.next
    return h
def _sl(h):
    r = []
    while h: r.append(h.val); h = h.next
    return r`;

const TREE_AND_LIST_PREAMBLE = TREE_PREAMBLE + "\n" + LIST_PREAMBLE;

// ─── Problem runners ────────────────────────────────────────────────────────

export const PROBLEM_RUNNERS: Record<string, ProblemRunner> = {

  // ── Arrays & Hashing ─────────────────────────────────────────────────────

  "two-sum": {
    problemId: "two-sum",
    pythonStarter: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, n in enumerate(nums):
            if target - n in seen:
                return [seen[target - n], i]
            seen[n] = i
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().twoSum(_d["nums"], _d["target"])
print(_j.dumps(sorted(_r)))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[2,7,11,15],"target":9}', expected: "[0, 1]" },
      { id: "tc2", label: "Example 2", input: '{"nums":[3,2,4],"target":6}', expected: "[1, 2]" },
      { id: "tc3", label: "Duplicates", input: '{"nums":[3,3],"target":6}', expected: "[0, 1]" },
      { id: "tc4", label: "Negative numbers", input: '{"nums":[-3,4,3,90],"target":0}', expected: "[0, 2]", hidden: true },
      { id: "tc5", label: "Large", input: '{"nums":[1,2,3,4,5,6,7,8,9,10],"target":19}', expected: "[8, 9]", hidden: true },
    ],
  },

  "contains-duplicate": {
    problemId: "contains-duplicate",
    pythonStarter: `from typing import List

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        return len(nums) != len(set(nums))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().containsDuplicate(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Has duplicate", input: '{"nums":[1,2,3,1]}', expected: "true" },
      { id: "tc2", label: "No duplicate", input: '{"nums":[1,2,3,4]}', expected: "false" },
      { id: "tc3", label: "Many dupes", input: '{"nums":[1,1,1,3,3,4,3,2,4,2]}', expected: "true" },
      { id: "tc4", label: "Single", input: '{"nums":[1]}', expected: "false", hidden: true },
    ],
  },

  "valid-anagram": {
    problemId: "valid-anagram",
    pythonStarter: `from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isAnagram(_d["s"], _d["t"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Anagram", input: '{"s":"anagram","t":"nagaram"}', expected: "true" },
      { id: "tc2", label: "Not anagram", input: '{"s":"rat","t":"car"}', expected: "false" },
      { id: "tc3", label: "Same char", input: '{"s":"a","t":"a"}', expected: "true" },
      { id: "tc4", label: "Different length", input: '{"s":"ab","t":"a"}', expected: "false", hidden: true },
      { id: "tc5", label: "Both empty", input: '{"s":"","t":""}', expected: "true", hidden: true },
    ],
  },

  "group-anagrams": {
    problemId: "group-anagrams",
    pythonStarter: `from typing import List
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for s in strs:
            groups[tuple(sorted(s))].append(s)
        return list(groups.values())
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().groupAnagrams(_d["strs"])
print(_j.dumps(sorted([sorted(g) for g in _r])))`,
    testCases: [
      { id: "tc1", label: "Classic", input: '{"strs":["eat","tea","tan","ate","nat","bat"]}', expected: '[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]' },
      { id: "tc2", label: "Single empty", input: '{"strs":[""]}', expected: '[[""]]' },
      { id: "tc3", label: "Single char", input: '{"strs":["a"]}', expected: '[["a"]]' },
      { id: "tc4", label: "All same", input: '{"strs":["ab","ba","ab"]}', expected: '[["ab", "ab", "ba"]]', hidden: true },
    ],
  },

  "product-except-self": {
    problemId: "product-except-self",
    pythonStarter: `from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n
        prefix = 1
        for i in range(n):
            res[i] = prefix
            prefix *= nums[i]
        suffix = 1
        for i in range(n - 1, -1, -1):
            res[i] *= suffix
            suffix *= nums[i]
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().productExceptSelf(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[1,2,3,4]}', expected: "[24, 12, 8, 6]" },
      { id: "tc2", label: "With zero", input: '{"nums":[-1,1,0,-3,3]}', expected: "[0, 0, 9, 0, 0]" },
      { id: "tc3", label: "Two elements", input: '{"nums":[1,1]}', expected: "[1, 1]" },
      { id: "tc4", label: "Two zeros", input: '{"nums":[0,0]}', expected: "[0, 0]", hidden: true },
    ],
  },

  "max-subarray": {
    problemId: "max-subarray",
    pythonStarter: `from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        cur = best = nums[0]
        for n in nums[1:]:
            cur = max(n, cur + n)
            best = max(best, cur)
        return best
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxSubArray(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Classic", input: '{"nums":[-2,1,-3,4,-1,2,1,-5,4]}', expected: "6" },
      { id: "tc2", label: "Single", input: '{"nums":[1]}', expected: "1" },
      { id: "tc3", label: "All positive", input: '{"nums":[5,4,-1,7,8]}', expected: "23" },
      { id: "tc4", label: "All negative", input: '{"nums":[-1,-2,-3]}', expected: "-1", hidden: true },
    ],
  },

  "best-time-stock": {
    problemId: "best-time-stock",
    pythonStarter: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for p in prices:
            min_price = min(min_price, p)
            max_profit = max(max_profit, p - min_price)
        return max_profit
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxProfit(_d["prices"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"prices":[7,1,5,3,6,4]}', expected: "5" },
      { id: "tc2", label: "Downtrend", input: '{"prices":[7,6,4,3,1]}', expected: "0" },
      { id: "tc3", label: "Three prices", input: '{"prices":[2,4,1]}', expected: "2" },
      { id: "tc4", label: "Single day", input: '{"prices":[1]}', expected: "0", hidden: true },
    ],
  },

  "longest-consecutive": {
    problemId: "longest-consecutive",
    pythonStarter: `from typing import List

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for n in s:
            if n - 1 not in s:
                cur = 1
                while n + cur in s:
                    cur += 1
                best = max(best, cur)
        return best
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().longestConsecutive(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[100,4,200,1,3,2]}', expected: "4" },
      { id: "tc2", label: "Long run", input: '{"nums":[0,3,7,2,5,8,4,6,0,1]}', expected: "9" },
      { id: "tc3", label: "Empty", input: '{"nums":[]}', expected: "0" },
      { id: "tc4", label: "Duplicates", input: '{"nums":[1,2,0,1]}', expected: "3", hidden: true },
    ],
  },

  // ── Two Pointers ──────────────────────────────────────────────────────────

  "valid-palindrome": {
    problemId: "valid-palindrome",
    pythonStarter: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = [c.lower() for c in s if c.isalnum()]
        return cleaned == cleaned[::-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isPalindrome(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Classic palindrome", input: '{"s":"A man, a plan, a canal: Panama"}', expected: "true" },
      { id: "tc2", label: "Not palindrome", input: '{"s":"race a car"}', expected: "false" },
      { id: "tc3", label: "Space only", input: '{"s":" "}', expected: "true" },
      { id: "tc4", label: "Numbers", input: '{"s":"0P"}', expected: "false", hidden: true },
    ],
  },

  "three-sum": {
    problemId: "three-sum",
    pythonStarter: `from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i, n in enumerate(nums):
            if i > 0 and n == nums[i - 1]: continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = n + nums[l] + nums[r]
                if s == 0:
                    res.append([n, nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]: l += 1
                    while l < r and nums[r] == nums[r - 1]: r -= 1
                    l += 1; r -= 1
                elif s < 0: l += 1
                else: r -= 1
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().threeSum(_d["nums"])
print(_j.dumps(sorted([sorted(x) for x in _r])))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[-1,0,1,2,-1,-4]}', expected: "[[-1, -1, 2], [-1, 0, 1]]" },
      { id: "tc2", label: "No triplets", input: '{"nums":[0,1,1]}', expected: "[]" },
      { id: "tc3", label: "All zeros", input: '{"nums":[0,0,0]}', expected: "[[0, 0, 0]]" },
      { id: "tc4", label: "Duplicates", input: '{"nums":[-2,0,0,2,2]}', expected: "[[-2, 0, 2]]", hidden: true },
    ],
  },

  "container-water": {
    problemId: "container-water",
    pythonStarter: `from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        best = 0
        while l < r:
            best = max(best, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]: l += 1
            else: r -= 1
        return best
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxArea(_d["height"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"height":[1,8,6,2,5,4,8,3,7]}', expected: "49" },
      { id: "tc2", label: "Two bars equal", input: '{"height":[1,1]}', expected: "1" },
      { id: "tc3", label: "Symmetric", input: '{"height":[4,3,2,1,4]}', expected: "16" },
      { id: "tc4", label: "Small", input: '{"height":[1,2,1]}', expected: "2", hidden: true },
    ],
  },

  // ── Sliding Window ────────────────────────────────────────────────────────

  "longest-substring": {
    problemId: "longest-substring",
    pythonStarter: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        l = best = 0
        for r, c in enumerate(s):
            if c in seen and seen[c] >= l:
                l = seen[c] + 1
            seen[c] = r
            best = max(best, r - l + 1)
        return best
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().lengthOfLongestSubstring(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "abcabcbb", input: '{"s":"abcabcbb"}', expected: "3" },
      { id: "tc2", label: "bbbbb", input: '{"s":"bbbbb"}', expected: "1" },
      { id: "tc3", label: "pwwkew", input: '{"s":"pwwkew"}', expected: "3" },
      { id: "tc4", label: "Empty", input: '{"s":""}', expected: "0", hidden: true },
      { id: "tc5", label: "Space", input: '{"s":" "}', expected: "1", hidden: true },
    ],
  },

  // ── Stack ─────────────────────────────────────────────────────────────────

  "valid-parentheses": {
    problemId: "valid-parentheses",
    pythonStarter: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}
        for c in s:
            if c in pairs:
                if not stack or stack[-1] != pairs[c]: return False
                stack.pop()
            else:
                stack.append(c)
        return not stack
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isValid(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "()", input: '{"s":"()"}', expected: "true" },
      { id: "tc2", label: "()[]{}", input: '{"s":"()[]{}"}', expected: "true" },
      { id: "tc3", label: "(]", input: '{"s":"(]"}', expected: "false" },
      { id: "tc4", label: "([)]", input: '{"s":"([)]"}', expected: "false" },
      { id: "tc5", label: "{[]}", input: '{"s":"{[]}"}', expected: "true" },
      { id: "tc6", label: "Unclosed", input: '{"s":"("}', expected: "false", hidden: true },
    ],
  },

  // ── Binary Search ─────────────────────────────────────────────────────────

  "binary-search": {
    problemId: "binary-search",
    pythonStarter: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target: return m
            elif nums[m] < target: l = m + 1
            else: r = m - 1
        return -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().search(_d["nums"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"nums":[-1,0,3,5,9,12],"target":9}', expected: "4" },
      { id: "tc2", label: "Not found", input: '{"nums":[-1,0,3,5,9,12],"target":2}', expected: "-1" },
      { id: "tc3", label: "Single element", input: '{"nums":[5],"target":5}', expected: "0" },
      { id: "tc4", label: "First element", input: '{"nums":[-1,0,3,5,9,12],"target":-1}', expected: "0", hidden: true },
    ],
  },

  "find-min-rotated": {
    problemId: "find-min-rotated",
    pythonStarter: `from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums) - 1
        while l < r:
            m = (l + r) // 2
            if nums[m] > nums[r]: l = m + 1
            else: r = m
        return nums[l]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findMin(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Rotated 5", input: '{"nums":[3,4,5,1,2]}', expected: "1" },
      { id: "tc2", label: "Rotated 7", input: '{"nums":[4,5,6,7,0,1,2]}', expected: "0" },
      { id: "tc3", label: "Sorted", input: '{"nums":[11,13,15,17]}', expected: "11" },
      { id: "tc4", label: "Two elements", input: '{"nums":[2,1]}', expected: "1", hidden: true },
    ],
  },

  "search-rotated": {
    problemId: "search-rotated",
    pythonStarter: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target: return m
            if nums[l] <= nums[m]:
                if nums[l] <= target < nums[m]: r = m - 1
                else: l = m + 1
            else:
                if nums[m] < target <= nums[r]: l = m + 1
                else: r = m - 1
        return -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().search(_d["nums"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found in right part", input: '{"nums":[4,5,6,7,0,1,2],"target":0}', expected: "4" },
      { id: "tc2", label: "Not found", input: '{"nums":[4,5,6,7,0,1,2],"target":3}', expected: "-1" },
      { id: "tc3", label: "Single not found", input: '{"nums":[1],"target":0}', expected: "-1" },
      { id: "tc4", label: "Found only element", input: '{"nums":[1],"target":1}', expected: "0", hidden: true },
    ],
  },

  // ── Intervals ─────────────────────────────────────────────────────────────

  "merge-intervals": {
    problemId: "merge-intervals",
    pythonStarter: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort()
        res = [intervals[0]]
        for s, e in intervals[1:]:
            if s <= res[-1][1]:
                res[-1][1] = max(res[-1][1], e)
            else:
                res.append([s, e])
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().merge(_d["intervals"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"intervals":[[1,3],[2,6],[8,10],[15,18]]}', expected: "[[1, 6], [8, 10], [15, 18]]" },
      { id: "tc2", label: "Touch merge", input: '{"intervals":[[1,4],[4,5]]}', expected: "[[1, 5]]" },
      { id: "tc3", label: "Single", input: '{"intervals":[[1,4]]}', expected: "[[1, 4]]" },
      { id: "tc4", label: "Subinterval", input: '{"intervals":[[1,4],[2,3]]}', expected: "[[1, 4]]", hidden: true },
    ],
  },

  "insert-interval": {
    problemId: "insert-interval",
    pythonStarter: `from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []
        for i, (s, e) in enumerate(intervals):
            if newInterval[1] < s:
                return res + [newInterval] + intervals[i:]
            elif newInterval[0] > e:
                res.append([s, e])
            else:
                newInterval = [min(newInterval[0], s), max(newInterval[1], e)]
        return res + [newInterval]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().insert(_d["intervals"], _d["newInterval"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Insert overlapping", input: '{"intervals":[[1,3],[6,9]],"newInterval":[2,5]}', expected: "[[1, 5], [6, 9]]" },
      { id: "tc2", label: "Multi-overlap", input: '{"intervals":[[1,2],[3,5],[6,7],[8,10],[12,16]],"newInterval":[4,8]}', expected: "[[1, 2], [3, 10], [12, 16]]" },
      { id: "tc3", label: "Empty intervals", input: '{"intervals":[],"newInterval":[5,7]}', expected: "[[5, 7]]" },
      { id: "tc4", label: "Fully contained", input: '{"intervals":[[1,5]],"newInterval":[2,3]}', expected: "[[1, 5]]", hidden: true },
    ],
  },

  // ── Dynamic Programming ───────────────────────────────────────────────────

  "climbing-stairs": {
    problemId: "climbing-stairs",
    pythonStarter: `class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().climbStairs(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=1", input: '{"n":1}', expected: "1" },
      { id: "tc2", label: "n=2", input: '{"n":2}', expected: "2" },
      { id: "tc3", label: "n=3", input: '{"n":3}', expected: "3" },
      { id: "tc4", label: "n=5", input: '{"n":5}', expected: "8" },
      { id: "tc5", label: "n=10", input: '{"n":10}', expected: "89", hidden: true },
    ],
  },

  "house-robber": {
    problemId: "house-robber",
    pythonStarter: `from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = prev1 = 0
        for n in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + n)
        return prev1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().rob(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[1,2,3,1]}', expected: "4" },
      { id: "tc2", label: "Example 2", input: '{"nums":[2,7,9,3,1]}', expected: "12" },
      { id: "tc3", label: "Two houses", input: '{"nums":[2,1]}', expected: "2" },
      { id: "tc4", label: "Adjacent pick", input: '{"nums":[1,2]}', expected: "2", hidden: true },
    ],
  },

  "house-robber-ii": {
    problemId: "house-robber-ii",
    pythonStarter: `from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        def rob_range(h):
            a = b = 0
            for n in h:
                a, b = b, max(b, a + n)
            return b
        if len(nums) == 1: return nums[0]
        return max(rob_range(nums[:-1]), rob_range(nums[1:]))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().rob(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Circular 3", input: '{"nums":[2,3,2]}', expected: "3" },
      { id: "tc2", label: "Example 2", input: '{"nums":[1,2,3,1]}', expected: "4" },
      { id: "tc3", label: "Three houses", input: '{"nums":[1,2,3]}', expected: "3" },
      { id: "tc4", label: "Single", input: '{"nums":[1]}', expected: "1", hidden: true },
    ],
  },

  "coin-change": {
    problemId: "coin-change",
    pythonStarter: `from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for c in coins:
            for a in range(c, amount + 1):
                dp[a] = min(dp[a], dp[a - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().coinChange(_d["coins"], _d["amount"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"coins":[1,2,5],"amount":11}', expected: "3" },
      { id: "tc2", label: "Impossible", input: '{"coins":[2],"amount":3}', expected: "-1" },
      { id: "tc3", label: "Zero amount", input: '{"coins":[1],"amount":0}', expected: "0" },
      { id: "tc4", label: "Large amount", input: '{"coins":[1,5,11],"amount":15}', expected: "3", hidden: true },
    ],
  },

  "longest-increasing-subsequence": {
    problemId: "longest-increasing-subsequence",
    pythonStarter: `from typing import List
import bisect

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        sub = []
        for n in nums:
            i = bisect.bisect_left(sub, n)
            if i == len(sub): sub.append(n)
            else: sub[i] = n
        return len(sub)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().lengthOfLIS(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[10,9,2,5,3,7,101,18]}', expected: "4" },
      { id: "tc2", label: "Example 2", input: '{"nums":[0,1,0,3,2,3]}', expected: "4" },
      { id: "tc3", label: "All same", input: '{"nums":[7,7,7,7,7,7,7]}', expected: "1" },
      { id: "tc4", label: "Already sorted", input: '{"nums":[1,2,3,4,5]}', expected: "5", hidden: true },
    ],
  },

  "jump-game": {
    problemId: "jump-game",
    pythonStarter: `from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0
        for i, n in enumerate(nums):
            if i > reach: return False
            reach = max(reach, i + n)
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canJump(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Can reach", input: '{"nums":[2,3,1,1,4]}', expected: "true" },
      { id: "tc2", label: "Cannot reach", input: '{"nums":[3,2,1,0,4]}', expected: "false" },
      { id: "tc3", label: "Single", input: '{"nums":[0]}', expected: "true" },
      { id: "tc4", label: "Jump over zero", input: '{"nums":[2,0,0]}', expected: "true", hidden: true },
    ],
  },

  "word-break": {
    problemId: "word-break",
    pythonStarter: `from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        dp = [False] * (len(s) + 1)
        dp[0] = True
        for i in range(1, len(s) + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True; break
        return dp[len(s)]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().wordBreak(_d["s"], _d["wordDict"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"s":"leetcode","wordDict":["leet","code"]}', expected: "true" },
      { id: "tc2", label: "Example 2", input: '{"s":"applepenapple","wordDict":["apple","pen"]}', expected: "true" },
      { id: "tc3", label: "Cannot break", input: '{"s":"catsandog","wordDict":["cats","dog","sand","and","cat"]}', expected: "false" },
      { id: "tc4", label: "Single char miss", input: '{"s":"a","wordDict":["b"]}', expected: "false", hidden: true },
    ],
  },

  "max-product-subarray": {
    problemId: "max-product-subarray",
    pythonStarter: `from typing import List

class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = cur_max = cur_min = nums[0]
        for n in nums[1:]:
            candidates = (n, cur_max * n, cur_min * n)
            cur_max, cur_min = max(candidates), min(candidates)
            res = max(res, cur_max)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxProduct(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"nums":[2,3,-2,4]}', expected: "6" },
      { id: "tc2", label: "With zero", input: '{"nums":[-2,0,-1]}', expected: "0" },
      { id: "tc3", label: "Two negatives", input: '{"nums":[2,-5,-2,-4,3]}', expected: "24" },
      { id: "tc4", label: "Single negative", input: '{"nums":[-2]}', expected: "-2", hidden: true },
    ],
  },

  "unique-paths": {
    problemId: "unique-paths",
    pythonStarter: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1] * n for _ in range(m)]
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
        return dp[m-1][n-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().uniquePaths(_d["m"], _d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "3x7", input: '{"m":3,"n":7}', expected: "28" },
      { id: "tc2", label: "3x2", input: '{"m":3,"n":2}', expected: "3" },
      { id: "tc3", label: "1x1", input: '{"m":1,"n":1}', expected: "1" },
      { id: "tc4", label: "7x3 symmetric", input: '{"m":7,"n":3}', expected: "28", hidden: true },
    ],
  },

  "decode-ways": {
    problemId: "decode-ways",
    pythonStarter: `class Solution:
    def numDecodings(self, s: str) -> int:
        if not s or s[0] == '0': return 0
        dp = [0] * (len(s) + 1)
        dp[0] = dp[1] = 1
        for i in range(2, len(s) + 1):
            if s[i-1] != '0': dp[i] += dp[i-1]
            two = int(s[i-2:i])
            if 10 <= two <= 26: dp[i] += dp[i-2]
        return dp[len(s)]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().numDecodings(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "12", input: '{"s":"12"}', expected: "2" },
      { id: "tc2", label: "226", input: '{"s":"226"}', expected: "3" },
      { id: "tc3", label: "Leading zero", input: '{"s":"06"}', expected: "0" },
      { id: "tc4", label: "10", input: '{"s":"10"}', expected: "1", hidden: true },
      { id: "tc5", label: "Single", input: '{"s":"1"}', expected: "1", hidden: true },
    ],
  },

  // ── Trees ─────────────────────────────────────────────────────────────────

  "max-depth-tree": {
    problemId: "max-depth-tree",
    pythonStarter: `from typing import Optional

# TreeNode is provided by the platform
class Solution:
    def maxDepth(self, root: Optional['TreeNode']) -> int:
        if not root: return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxDepth(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Depth 3", input: '{"root":[3,9,20,null,null,15,7]}', expected: "3" },
      { id: "tc2", label: "Right-skewed", input: '{"root":[1,null,2]}', expected: "2" },
      { id: "tc3", label: "Empty", input: '{"root":[]}', expected: "0" },
      { id: "tc4", label: "Perfect tree", input: '{"root":[1,2,3,4,5,6,7]}', expected: "3", hidden: true },
    ],
  },

  "invert-binary-tree": {
    problemId: "invert-binary-tree",
    pythonStarter: `from typing import Optional

# TreeNode is provided by the platform
class Solution:
    def invertTree(self, root: Optional['TreeNode']) -> Optional['TreeNode']:
        if not root: return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().invertTree(_bt(_d["root"]))
print(_j.dumps(_st(_r)))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"root":[4,2,7,1,3,6,9]}', expected: "[4, 7, 2, 9, 6, 3, 1]" },
      { id: "tc2", label: "Three nodes", input: '{"root":[2,1,3]}', expected: "[2, 3, 1]" },
      { id: "tc3", label: "Empty", input: '{"root":[]}', expected: "[]" },
      { id: "tc4", label: "Single", input: '{"root":[1]}', expected: "[1]", hidden: true },
    ],
  },

  "validate-bst": {
    problemId: "validate-bst",
    pythonStarter: `from typing import Optional

# TreeNode is provided by the platform
class Solution:
    def isValidBST(self, root: Optional['TreeNode']) -> bool:
        def check(node, lo, hi):
            if not node: return True
            if not (lo < node.val < hi): return False
            return check(node.left, lo, node.val) and check(node.right, node.val, hi)
        return check(root, float('-inf'), float('inf'))
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isValidBST(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Valid BST", input: '{"root":[2,1,3]}', expected: "true" },
      { id: "tc2", label: "Invalid (3 left of 5)", input: '{"root":[5,1,4,null,null,3,6]}', expected: "false" },
      { id: "tc3", label: "Equal values", input: '{"root":[2,2,2]}', expected: "false" },
      { id: "tc4", label: "Right duplicate", input: '{"root":[1,null,1]}', expected: "false", hidden: true },
    ],
  },

  "level-order-traversal": {
    problemId: "level-order-traversal",
    pythonStarter: `from typing import Optional, List
from collections import deque

# TreeNode is provided by the platform
class Solution:
    def levelOrder(self, root: Optional['TreeNode']) -> List[List[int]]:
        if not root: return []
        res, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                n = q.popleft()
                level.append(n.val)
                if n.left: q.append(n.left)
                if n.right: q.append(n.right)
            res.append(level)
        return res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().levelOrder(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Three levels", input: '{"root":[3,9,20,null,null,15,7]}', expected: "[[3], [9, 20], [15, 7]]" },
      { id: "tc2", label: "Single node", input: '{"root":[1]}', expected: "[[1]]" },
      { id: "tc3", label: "Empty", input: '{"root":[]}', expected: "[]" },
      { id: "tc4", label: "Complete tree", input: '{"root":[1,2,3,4,5]}', expected: "[[1], [2, 3], [4, 5]]", hidden: true },
    ],
  },

  "lowest-common-ancestor": {
    problemId: "lowest-common-ancestor",
    pythonStarter: `# TreeNode is provided by the platform
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root or root == p or root == q: return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        return root if left and right else left or right
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_root = _bt(_d["root"])
def _find(r, v):
    if not r: return None
    if r.val == v: return r
    return _find(r.left, v) or _find(r.right, v)
_p = _find(_root, _d["p"]); _q = _find(_root, _d["q"])
_r = Solution().lowestCommonAncestor(_root, _p, _q)
print(_j.dumps(_r.val if _r else None))`,
    testCases: [
      { id: "tc1", label: "LCA is root", input: '{"root":[6,2,8,0,4,7,9,null,null,3,5],"p":2,"q":8}', expected: "6" },
      { id: "tc2", label: "LCA is p", input: '{"root":[6,2,8,0,4,7,9,null,null,3,5],"p":2,"q":4}', expected: "2" },
      { id: "tc3", label: "Root and child", input: '{"root":[2,1],"p":2,"q":1}', expected: "2" },
    ],
  },

  // ── Linked List ───────────────────────────────────────────────────────────

  "reverse-linked-list": {
    problemId: "reverse-linked-list",
    pythonStarter: `from typing import Optional

# ListNode is provided by the platform
class Solution:
    def reverseList(self, head: Optional['ListNode']) -> Optional['ListNode']:
        prev = None
        while head:
            nxt = head.next
            head.next = prev
            prev = head
            head = nxt
        return prev
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().reverseList(_bl(_d["head"]))
print(_j.dumps(_sl(_r)))`,
    testCases: [
      { id: "tc1", label: "Five nodes", input: '{"head":[1,2,3,4,5]}', expected: "[5, 4, 3, 2, 1]" },
      { id: "tc2", label: "Two nodes", input: '{"head":[1,2]}', expected: "[2, 1]" },
      { id: "tc3", label: "Single", input: '{"head":[1]}', expected: "[1]" },
      { id: "tc4", label: "Empty", input: '{"head":[]}', expected: "[]", hidden: true },
    ],
  },

  "linked-list-cycle": {
    problemId: "linked-list-cycle",
    pythonStarter: `from typing import Optional

# ListNode is provided by the platform
class Solution:
    def hasCycle(self, head: Optional['ListNode']) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast: return True
        return False
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
vals = _d["head"]; pos = _d["pos"]
_h = _bl(vals)
if pos >= 0 and _h:
    nodes = []; cur = _h
    while cur: nodes.append(cur); cur = cur.next
    nodes[-1].next = nodes[pos]
_r = Solution().hasCycle(_h)
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Cycle at 1", input: '{"head":[3,2,0,-4],"pos":1}', expected: "true" },
      { id: "tc2", label: "Cycle at 0", input: '{"head":[1,2],"pos":0}', expected: "true" },
      { id: "tc3", label: "No cycle", input: '{"head":[1],"pos":-1}', expected: "false" },
      { id: "tc4", label: "Long no cycle", input: '{"head":[1,2,3,4,5],"pos":-1}', expected: "false", hidden: true },
    ],
  },

  "merge-two-sorted": {
    problemId: "merge-two-sorted",
    pythonStarter: `from typing import Optional

# ListNode is provided by the platform
class Solution:
    def mergeTwoLists(self, l1: Optional['ListNode'], l2: Optional['ListNode']) -> Optional['ListNode']:
        dummy = cur = ListNode()
        while l1 and l2:
            if l1.val <= l2.val: cur.next = l1; l1 = l1.next
            else: cur.next = l2; l2 = l2.next
            cur = cur.next
        cur.next = l1 or l2
        return dummy.next
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().mergeTwoLists(_bl(_d["l1"]), _bl(_d["l2"]))
print(_j.dumps(_sl(_r)))`,
    testCases: [
      { id: "tc1", label: "Example 1", input: '{"l1":[1,2,4],"l2":[1,3,4]}', expected: "[1, 1, 2, 3, 4, 4]" },
      { id: "tc2", label: "Both empty", input: '{"l1":[],"l2":[]}', expected: "[]" },
      { id: "tc3", label: "One empty", input: '{"l1":[],"l2":[0]}', expected: "[0]" },
      { id: "tc4", label: "Interleaved", input: '{"l1":[1],"l2":[2]}', expected: "[1, 2]", hidden: true },
    ],
  },

  // ── Graphs ────────────────────────────────────────────────────────────────

  "number-of-islands": {
    problemId: "number-of-islands",
    pythonStarter: `from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid: return 0
        rows, cols = len(grid), len(grid[0])
        count = 0
        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1": return
            grid[r][c] = "0"
            dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1":
                    dfs(r, c); count += 1
        return count
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().numIslands(_d["grid"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "One island", input: '{"grid":[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}', expected: "1" },
      { id: "tc2", label: "Three islands", input: '{"grid":[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}', expected: "3" },
      { id: "tc3", label: "Single cell", input: '{"grid":[["1"]]}', expected: "1" },
      { id: "tc4", label: "All water", input: '{"grid":[["0"]]}', expected: "0", hidden: true },
    ],
  },

  "course-schedule": {
    problemId: "course-schedule",
    pythonStarter: `from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        for a, b in prerequisites: adj[a].append(b)
        # 0=unvisited 1=visiting 2=done
        state = [0] * numCourses
        def dfs(u):
            if state[u] == 1: return False
            if state[u] == 2: return True
            state[u] = 1
            if not all(dfs(v) for v in adj[u]): return False
            state[u] = 2
            return True
        return all(dfs(i) for i in range(numCourses))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canFinish(_d["numCourses"], _d["prerequisites"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "No cycle", input: '{"numCourses":2,"prerequisites":[[1,0]]}', expected: "true" },
      { id: "tc2", label: "Has cycle", input: '{"numCourses":2,"prerequisites":[[1,0],[0,1]]}', expected: "false" },
      { id: "tc3", label: "No prereqs", input: '{"numCourses":1,"prerequisites":[]}', expected: "true" },
      { id: "tc4", label: "No cycle 5 courses", input: '{"numCourses":5,"prerequisites":[[1,4],[2,4],[3,1],[3,2]]}', expected: "true", hidden: true },
    ],
  },

  // ── Heap ─────────────────────────────────────────────────────────────────

  "top-k-frequent": {
    problemId: "top-k-frequent",
    pythonStarter: `from typing import List
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        return [x for x, _ in Counter(nums).most_common(k)]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().topKFrequent(_d["nums"], _d["k"])
print(_j.dumps(sorted(_r)))`,
    testCases: [
      { id: "tc1", label: "Top 2", input: '{"nums":[1,1,1,2,2,3],"k":2}', expected: "[1, 2]" },
      { id: "tc2", label: "Top 1", input: '{"nums":[1],"k":1}', expected: "[1]" },
      { id: "tc3", label: "Tied frequency", input: '{"nums":[1,1,2,2],"k":2}', expected: "[1, 2]" },
      { id: "tc4", label: "All unique", input: '{"nums":[1,2,3],"k":3}', expected: "[1, 2, 3]", hidden: true },
    ],
  },


  // ─── Arrays & Hashing (continued) ───────────────────────────────────────────

  "ransom-note": {
    problemId: "ransom-note",
    pythonStarter: `from collections import Counter

class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        mc = Counter(magazine)
        for c in ransomNote:
            if mc[c] <= 0: return False
            mc[c] -= 1
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canConstruct(_d["ransomNote"], _d["magazine"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Can't construct", input: '{"ransomNote":"a","magazine":"b"}', expected: "false" },
      { id: "tc2", label: "Not enough letters", input: '{"ransomNote":"aa","magazine":"ab"}', expected: "false" },
      { id: "tc3", label: "Possible", input: '{"ransomNote":"aa","magazine":"aab"}', expected: "true" },
      { id: "tc4", label: "Empty note", input: '{"ransomNote":"","magazine":"abc"}', expected: "true", hidden: true },
    ],
  },

  "isomorphic-strings": {
    problemId: "isomorphic-strings",
    pythonStarter: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        return len(set(zip(s,t))) == len(set(s)) == len(set(t))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isIsomorphic(_d["s"], _d["t"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "egg→add", input: '{"s":"egg","t":"add"}', expected: "true" },
      { id: "tc2", label: "foo→bar", input: '{"s":"foo","t":"bar"}', expected: "false" },
      { id: "tc3", label: "paper→title", input: '{"s":"paper","t":"title"}', expected: "true" },
      { id: "tc4", label: "badc→baba", input: '{"s":"badc","t":"baba"}', expected: "false", hidden: true },
    ],
  },

  "encode-decode-strings": {
    problemId: "encode-decode-strings",
    pythonStarter: `from typing import List

class Codec:
    def encode(self, strs: List[str]) -> str:
        return "".join(f"{len(s)}#{s}" for s in strs)
    def decode(self, s: str) -> List[str]:
        res, i = [], 0
        while i < len(s):
            j = s.index("#", i)
            n = int(s[i:j])
            res.append(s[j+1:j+1+n])
            i = j + 1 + n
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
c = Codec()
_r = c.decode(c.encode(_d["strs"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"strs":["lint","code","love","you"]}', expected: '["lint", "code", "love", "you"]' },
      { id: "tc2", label: "Special chars", input: '{"strs":["we","say",":","yes"]}', expected: '["we", "say", ":", "yes"]' },
      { id: "tc3", label: "Empty string", input: '{"strs":[""]}', expected: '[""]' },
    ],
  },

  "valid-sudoku": {
    problemId: "valid-sudoku",
    pythonStarter: `from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        for r in range(9):
            for c in range(9):
                v = board[r][c]
                if v == '.': continue
                b = (r//3)*3 + c//3
                if v in rows[r] or v in cols[c] or v in boxes[b]: return False
                rows[r].add(v); cols[c].add(v); boxes[b].add(v)
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isValidSudoku(_d["board"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Valid board", input: '{"board":[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', expected: "true" },
      { id: "tc2", label: "Invalid (dup in col)", input: '{"board":[["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', expected: "false" },
    ],
  },

  // ─── Two Pointers (continued) ────────────────────────────────────────────────

  "move-zeroes": {
    problemId: "move-zeroes",
    pythonStarter: `from typing import List

class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        j = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[j], nums[i] = nums[i], nums[j]
                j += 1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
nums = _d["nums"]
Solution().moveZeroes(nums)
print(_j.dumps(nums))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[0,1,0,3,12]}', expected: "[1, 3, 12, 0, 0]" },
      { id: "tc2", label: "Single zero", input: '{"nums":[0]}', expected: "[0]" },
      { id: "tc3", label: "No zeros", input: '{"nums":[1,2,3]}', expected: "[1, 2, 3]" },
      { id: "tc4", label: "All zeros", input: '{"nums":[0,0,0]}', expected: "[0, 0, 0]", hidden: true },
    ],
  },

  "is-subsequence": {
    problemId: "is-subsequence",
    pythonStarter: `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for c in t:
            if i < len(s) and c == s[i]: i += 1
        return i == len(s)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isSubsequence(_d["s"], _d["t"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"s":"abc","t":"ahbgdc"}', expected: "true" },
      { id: "tc2", label: "No", input: '{"s":"axc","t":"ahbgdc"}', expected: "false" },
      { id: "tc3", label: "Empty s", input: '{"s":"","t":"ahbgdc"}', expected: "true" },
      { id: "tc4", label: "Exact match", input: '{"s":"abc","t":"abc"}', expected: "true", hidden: true },
    ],
  },

  "two-sum-ii": {
    problemId: "two-sum-ii",
    pythonStarter: `from typing import List

class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target: return [l+1, r+1]
            elif s < target: l += 1
            else: r -= 1
        return []
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().twoSum(_d["numbers"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"numbers":[2,7,11,15],"target":9}', expected: "[1, 2]" },
      { id: "tc2", label: "Adjacent", input: '{"numbers":[2,3,4],"target":6}', expected: "[1, 3]" },
      { id: "tc3", label: "Negative", input: '{"numbers":[-1,0],"target":-1}', expected: "[1, 2]" },
    ],
  },

  "trapping-rain-water": {
    problemId: "trapping-rain-water",
    pythonStarter: `from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        lmax = rmax = res = 0
        while l < r:
            if height[l] < height[r]:
                if height[l] >= lmax: lmax = height[l]
                else: res += lmax - height[l]
                l += 1
            else:
                if height[r] >= rmax: rmax = height[r]
                else: res += rmax - height[r]
                r -= 1
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().trap(_d["height"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Valley", input: '{"height":[0,1,0,2,1,0,1,3,2,1,2,1]}', expected: "6" },
      { id: "tc2", label: "Plateau", input: '{"height":[4,2,0,3,2,5]}', expected: "9" },
      { id: "tc3", label: "Monotone", input: '{"height":[1,2,3,4,5]}', expected: "0" },
      { id: "tc4", label: "Single peak", input: '{"height":[3,0,2,0,4]}', expected: "7", hidden: true },
    ],
  },

  // ─── Sliding Window (continued) ──────────────────────────────────────────────

  "longest-repeating-replacement": {
    problemId: "longest-repeating-replacement",
    pythonStarter: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}; maxf = l = res = 0
        for r in range(len(s)):
            count[s[r]] = count.get(s[r], 0) + 1
            maxf = max(maxf, count[s[r]])
            if (r - l + 1) - maxf > k:
                count[s[l]] -= 1; l += 1
            res = max(res, r - l + 1)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().characterReplacement(_d["s"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "ABAB k=2", input: '{"s":"ABAB","k":2}', expected: "4" },
      { id: "tc2", label: "AABABBA k=1", input: '{"s":"AABABBA","k":1}', expected: "4" },
      { id: "tc3", label: "All same", input: '{"s":"AAAA","k":2}', expected: "4" },
      { id: "tc4", label: "k=0", input: '{"s":"ABCD","k":0}', expected: "1", hidden: true },
    ],
  },

  "permutation-in-string": {
    problemId: "permutation-in-string",
    pythonStarter: `from collections import Counter

class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2): return False
        c1, c2 = Counter(s1), Counter(s2[:len(s1)])
        if c1 == c2: return True
        for i in range(len(s1), len(s2)):
            c2[s2[i]] += 1
            c2[s2[i-len(s1)]] -= 1
            if c2[s2[i-len(s1)]] == 0: del c2[s2[i-len(s1)]]
            if c1 == c2: return True
        return False
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().checkInclusion(_d["s1"], _d["s2"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"s1":"ab","s2":"eidbaooo"}', expected: "true" },
      { id: "tc2", label: "Not found", input: '{"s1":"ab","s2":"eidboaoo"}', expected: "false" },
      { id: "tc3", label: "Same length", input: '{"s1":"ab","s2":"ab"}', expected: "true" },
      { id: "tc4", label: "s1 longer", input: '{"s1":"hello","s2":"oo"}', expected: "false", hidden: true },
    ],
  },

  "max-points-cards": {
    problemId: "max-points-cards",
    pythonStarter: `from typing import List

class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        n = len(cardPoints)
        win = sum(cardPoints[:n-k])
        min_win = win
        for i in range(n-k, n):
            win += cardPoints[i] - cardPoints[i-(n-k)]
            min_win = min(min_win, win)
        return sum(cardPoints) - min_win
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxScore(_d["cardPoints"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"cardPoints":[1,2,3,4,5,6,1],"k":3}', expected: "12" },
      { id: "tc2", label: "Take all", input: '{"cardPoints":[9,7,7,9,7,7,9],"k":7}', expected: "55" },
      { id: "tc3", label: "k=3", input: '{"cardPoints":[1,79,80,1,1,1,200,1],"k":3}', expected: "202" },
    ],
  },

  "min-window-substring": {
    problemId: "min-window-substring",
    pythonStarter: `from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not t: return ""
        need = Counter(t); have = {}
        formed = len(need); l = 0; res = (-1, -1); res_len = float("inf")
        for r, c in enumerate(s):
            have[c] = have.get(c, 0) + 1
            if c in need and have[c] == need[c]: formed -= 1
            while formed == 0:
                if r - l + 1 < res_len: res_len = r - l + 1; res = (l, r)
                have[s[l]] -= 1
                if s[l] in need and have[s[l]] < need[s[l]]: formed += 1
                l += 1
        return "" if res[0] == -1 else s[res[0]:res[1]+1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minWindow(_d["s"], _d["t"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"s":"ADOBECODEBANC","t":"ABC"}', expected: '"BANC"' },
      { id: "tc2", label: "Same string", input: '{"s":"a","t":"a"}', expected: '"a"' },
      { id: "tc3", label: "No window", input: '{"s":"a","t":"aa"}', expected: '""' },
    ],
  },

  "sliding-window-max": {
    problemId: "sliding-window-max",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        q = deque(); res = []
        for i, n in enumerate(nums):
            while q and nums[q[-1]] < n: q.pop()
            q.append(i)
            if q[0] == i - k: q.popleft()
            if i >= k - 1: res.append(nums[q[0]])
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxSlidingWindow(_d["nums"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "k=3", input: '{"nums":[1,3,-1,-3,5,3,6,7],"k":3}', expected: "[3, 3, 5, 5, 6, 7]" },
      { id: "tc2", label: "k=1", input: '{"nums":[1,3,1,2,0,5],"k":1}', expected: "[1, 3, 1, 2, 0, 5]" },
      { id: "tc3", label: "k=n", input: '{"nums":[1,2,3],"k":3}', expected: "[3]" },
    ],
  },

  // ─── Stack (continued) ───────────────────────────────────────────────────────

  "min-stack": {
    problemId: "min-stack",
    pythonStarter: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        m = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(m)

    def pop(self) -> None:
        self.stack.pop(); self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = MinStack(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "push": obj.push(args[0])
    elif op == "pop": obj.pop()
    elif op == "top": results.append(obj.top())
    elif op == "getMin": results.append(obj.getMin())
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic ops", input: '{"ops":["push","push","push","getMin","pop","top","getMin"],"args":[[-2],[0],[-3],[],[],[],[]]}', expected: "[-3, 0, -2]" },
      { id: "tc2", label: "Push and getMin", input: '{"ops":["push","push","getMin","pop","getMin"],"args":[[5],[3],[],[],[]]}', expected: "[3, 5]" },
    ],
  },

  "reverse-polish": {
    problemId: "reverse-polish",
    pythonStarter: `from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for t in tokens:
            if t in "+-*/":
                b, a = stack.pop(), stack.pop()
                if t == "+": stack.append(a + b)
                elif t == "-": stack.append(a - b)
                elif t == "*": stack.append(a * b)
                else: stack.append(int(a / b))
            else:
                stack.append(int(t))
        return stack[0]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().evalRPN(_d["tokens"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Addition+Mult", input: '{"tokens":["2","1","+","3","*"]}', expected: "9" },
      { id: "tc2", label: "Division", input: '{"tokens":["4","13","5","/","+"]}', expected: "6" },
      { id: "tc3", label: "Mixed", input: '{"tokens":["10","6","9","3","+","-11","*","/","*","17","+","5","+"]}', expected: "22" },
    ],
  },

  "generate-parentheses": {
    problemId: "generate-parentheses",
    pythonStarter: `from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        def bt(s, o, c):
            if len(s) == 2*n: res.append(s); return
            if o < n: bt(s+"(", o+1, c)
            if c < o: bt(s+")", o, c+1)
        bt("", 0, 0)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().generateParenthesis(_d["n"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=1", input: '{"n":1}', expected: '["()"]' },
      { id: "tc2", label: "n=2", input: '{"n":2}', expected: '["(())", "()()"]' },
      { id: "tc3", label: "n=3", input: '{"n":3}', expected: '["((()))", "(()())", "(())()", "()(())", "()()()"]' },
    ],
  },

  "daily-temperatures": {
    problemId: "daily-temperatures",
    pythonStarter: `from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures); stack = []
        for i, t in enumerate(temperatures):
            while stack and t > temperatures[stack[-1]]:
                j = stack.pop(); res[j] = i - j
            stack.append(i)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().dailyTemperatures(_d["temperatures"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"temperatures":[73,74,75,71,69,72,76,73]}', expected: "[1, 1, 4, 2, 1, 1, 0, 0]" },
      { id: "tc2", label: "Increasing", input: '{"temperatures":[30,40,50,60]}', expected: "[1, 1, 1, 0]" },
      { id: "tc3", label: "Decreasing", input: '{"temperatures":[60,50,40,30]}', expected: "[0, 0, 0, 0]" },
    ],
  },

  "car-fleet": {
    problemId: "car-fleet",
    pythonStarter: `from typing import List

class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pairs = sorted(zip(position, speed), reverse=True)
        stack = []
        for p, s in pairs:
            t = (target - p) / s
            if not stack or t > stack[-1]: stack.append(t)
        return len(stack)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().carFleet(_d["target"], _d["position"], _d["speed"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "3 fleets", input: '{"target":12,"position":[10,8,0,5,3],"speed":[2,4,1,1,3]}', expected: "3" },
      { id: "tc2", label: "1 car", input: '{"target":10,"position":[3],"speed":[3]}', expected: "1" },
      { id: "tc3", label: "1 fleet", input: '{"target":100,"position":[0,2,4],"speed":[4,2,1]}', expected: "1" },
    ],
  },

  "decode-string": {
    problemId: "decode-string",
    pythonStarter: `class Solution:
    def decodeString(self, s: str) -> str:
        stack = []; cur = ""; num = 0
        for c in s:
            if c.isdigit(): num = num * 10 + int(c)
            elif c == "[": stack.append((cur, num)); cur = ""; num = 0
            elif c == "]": prev, n = stack.pop(); cur = prev + n * cur
            else: cur += c
        return cur
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().decodeString(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"s":"3[a]2[bc]"}', expected: '"aaabcbc"' },
      { id: "tc2", label: "Nested", input: '{"s":"3[a2[c]]"}', expected: '"accaccacc"' },
      { id: "tc3", label: "Mixed", input: '{"s":"2[abc]3[cd]ef"}', expected: '"abcabccdcdcdef"' },
    ],
  },

  "asteroid-collision": {
    problemId: "asteroid-collision",
    pythonStarter: `from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []
        for a in asteroids:
            while stack and a < 0 < stack[-1]:
                if stack[-1] < -a: stack.pop(); continue
                elif stack[-1] == -a: stack.pop()
                break
            else:
                stack.append(a)
        return stack
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().asteroidCollision(_d["asteroids"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Right survives", input: '{"asteroids":[5,10,-5]}', expected: "[5, 10]" },
      { id: "tc2", label: "Both explode", input: '{"asteroids":[8,-8]}', expected: "[]" },
      { id: "tc3", label: "Left survives", input: '{"asteroids":[10,2,-5]}', expected: "[10]" },
      { id: "tc4", label: "No collision", input: '{"asteroids":[-2,-1,1,2]}', expected: "[-2, -1, 1, 2]", hidden: true },
    ],
  },

  "largest-rectangle-histogram": {
    problemId: "largest-rectangle-histogram",
    pythonStarter: `from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []; max_area = 0
        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                idx, ht = stack.pop()
                max_area = max(max_area, ht * (i - idx))
                start = idx
            stack.append((start, h))
        for i, h in stack:
            max_area = max(max_area, h * (len(heights) - i))
        return max_area
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().largestRectangleArea(_d["heights"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"heights":[2,1,5,6,2,3]}', expected: "10" },
      { id: "tc2", label: "Two bars", input: '{"heights":[2,4]}', expected: "4" },
      { id: "tc3", label: "Single", input: '{"heights":[1]}', expected: "1" },
      { id: "tc4", label: "Decreasing", input: '{"heights":[5,4,3,2,1]}', expected: "9", hidden: true },
    ],
  },


  // ─── Binary Search (continued) ───────────────────────────────────────────────

  "first-bad-version": {
    problemId: "first-bad-version",
    pythonStarter: `class Solution:
    def firstBadVersion(self, n: int) -> int:
        l, r = 1, n
        while l < r:
            m = (l + r) // 2
            if isBadVersion(m): r = m
            else: l = m + 1
        return l
`,
    preamble: `_BAD = [0]
def isBadVersion(v): return v >= _BAD[0]`,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_BAD[0] = _d["bad"]
_r = Solution().firstBadVersion(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"n":5,"bad":4}', expected: "4" },
      { id: "tc2", label: "First is bad", input: '{"n":1,"bad":1}', expected: "1" },
      { id: "tc3", label: "Last is bad", input: '{"n":10,"bad":10}', expected: "10" },
    ],
  },

  "search-insert-position": {
    problemId: "search-insert-position",
    pythonStarter: `from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums)
        while l < r:
            m = (l + r) // 2
            if nums[m] < target: l = m + 1
            else: r = m
        return l
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().searchInsert(_d["nums"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"nums":[1,3,5,6],"target":5}', expected: "2" },
      { id: "tc2", label: "Not found, insert mid", input: '{"nums":[1,3,5,6],"target":2}', expected: "1" },
      { id: "tc3", label: "Insert at end", input: '{"nums":[1,3,5,6],"target":7}', expected: "4" },
      { id: "tc4", label: "Insert at start", input: '{"nums":[1,3,5,6],"target":0}', expected: "0", hidden: true },
    ],
  },

  "search-2d-matrix": {
    problemId: "search-2d-matrix",
    pythonStarter: `from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        l, r = 0, m * n - 1
        while l <= r:
            mid = (l + r) // 2
            v = matrix[mid // n][mid % n]
            if v == target: return True
            elif v < target: l = mid + 1
            else: r = mid - 1
        return False
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().searchMatrix(_d["matrix"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"matrix":[[1,3,5,7],[10,11,16,20],[23,30,34,60]],"target":3}', expected: "true" },
      { id: "tc2", label: "Not found", input: '{"matrix":[[1,3,5,7],[10,11,16,20],[23,30,34,60]],"target":13}', expected: "false" },
      { id: "tc3", label: "Single cell found", input: '{"matrix":[[1]],"target":1}', expected: "true" },
    ],
  },

  "koko-bananas": {
    problemId: "koko-bananas",
    pythonStarter: `from typing import List
import math

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        while l < r:
            m = (l + r) // 2
            if sum(math.ceil(p/m) for p in piles) <= h: r = m
            else: l = m + 1
        return l
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minEatingSpeed(_d["piles"], _d["h"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"piles":[3,6,7,11],"h":8}', expected: "4" },
      { id: "tc2", label: "Larger", input: '{"piles":[30,11,23,4,20],"h":5}', expected: "30" },
      { id: "tc3", label: "h=n", input: '{"piles":[30,11,23,4,20],"h":6}', expected: "23" },
    ],
  },

  "time-based-key-value": {
    problemId: "time-based-key-value",
    pythonStarter: `import bisect

class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store: self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store: return ""
        lst = self.store[key]
        i = bisect.bisect_right(lst, (timestamp, chr(127))) - 1
        return lst[i][1] if i >= 0 else ""
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = TimeMap(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "set": obj.set(args[0], args[1], args[2])
    elif op == "get": results.append(obj.get(args[0], args[1]))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"ops":["set","get","get","set","get","get"],"args":[["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]]}', expected: '["bar", "bar", "bar2", "bar2"]' },
      { id: "tc2", label: "No prior set", input: '{"ops":["set","get"],"args":[["love","high",10],["love",5]]}', expected: '[""]' },
    ],
  },

  "median-two-sorted": {
    problemId: "median-two-sorted",
    pythonStarter: `from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2): nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        l, r = 0, m
        while l <= r:
            i = (l + r) // 2
            j = (m + n + 1) // 2 - i
            ml = nums1[i-1] if i > 0 else float("-inf")
            mr = nums1[i] if i < m else float("inf")
            nl = nums2[j-1] if j > 0 else float("-inf")
            nr = nums2[j] if j < n else float("inf")
            if ml <= nr and nl <= mr:
                if (m + n) % 2: return float(max(ml, nl))
                return (max(ml, nl) + min(mr, nr)) / 2.0
            elif ml > nr: r = i - 1
            else: l = i + 1
        return 0.0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findMedianSortedArrays(_d["nums1"], _d["nums2"])
print(_j.dumps(round(_r, 5)))`,
    testCases: [
      { id: "tc1", label: "Odd total", input: '{"nums1":[1,3],"nums2":[2]}', expected: "2.0" },
      { id: "tc2", label: "Even total", input: '{"nums1":[1,2],"nums2":[3,4]}', expected: "2.5" },
      { id: "tc3", label: "One empty", input: '{"nums1":[],"nums2":[1]}', expected: "1.0" },
      { id: "tc4", label: "Both single", input: '{"nums1":[1],"nums2":[1]}', expected: "1.0", hidden: true },
    ],
  },

  // ─── Linked List (continued) ─────────────────────────────────────────────────

  "palindrome-linked-list": {
    problemId: "palindrome-linked-list",
    pythonStarter: `class Solution:
    def isPalindrome(self, head) -> bool:
        vals = []
        while head: vals.append(head.val); head = head.next
        return vals == vals[::-1]
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isPalindrome(_bl(_d["head"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Palindrome", input: '{"head":[1,2,2,1]}', expected: "true" },
      { id: "tc2", label: "Not palindrome", input: '{"head":[1,2]}', expected: "false" },
      { id: "tc3", label: "Single", input: '{"head":[1]}', expected: "true" },
      { id: "tc4", label: "Odd palindrome", input: '{"head":[1,2,1]}', expected: "true", hidden: true },
    ],
  },

  "reorder-list": {
    problemId: "reorder-list",
    pythonStarter: `class Solution:
    def reorderList(self, head) -> None:
        if not head: return
        slow = fast = head
        while fast and fast.next: slow = slow.next; fast = fast.next.next
        prev, cur = None, slow.next; slow.next = None
        while cur: nxt = cur.next; cur.next = prev; prev = cur; cur = nxt
        l1, l2 = head, prev
        while l2:
            t1, t2 = l1.next, l2.next
            l1.next = l2; l2.next = t1
            l1, l2 = t1, t2
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
head = _bl(_d["head"])
Solution().reorderList(head)
print(_j.dumps(_sl(head)))`,
    testCases: [
      { id: "tc1", label: "4 nodes", input: '{"head":[1,2,3,4]}', expected: "[1, 4, 2, 3]" },
      { id: "tc2", label: "5 nodes", input: '{"head":[1,2,3,4,5]}', expected: "[1, 5, 2, 4, 3]" },
      { id: "tc3", label: "2 nodes", input: '{"head":[1,2]}', expected: "[1, 2]" },
    ],
  },

  "remove-nth-node": {
    problemId: "remove-nth-node",
    pythonStarter: `class Solution:
    def removeNthFromEnd(self, head, n: int):
        dummy = type(head)(0); dummy.next = head
        l, r = dummy, head
        for _ in range(n): r = r.next
        while r: l = l.next; r = r.next
        l.next = l.next.next
        return dummy.next
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().removeNthFromEnd(_bl(_d["head"]), _d["n"])
print(_j.dumps(_sl(_r)))`,
    testCases: [
      { id: "tc1", label: "Remove 2nd from end", input: '{"head":[1,2,3,4,5],"n":2}', expected: "[1, 2, 3, 5]" },
      { id: "tc2", label: "Remove only node", input: '{"head":[1],"n":1}', expected: "[]" },
      { id: "tc3", label: "Remove last", input: '{"head":[1,2],"n":1}', expected: "[1]" },
    ],
  },

  "copy-list-random": {
    problemId: "copy-list-random",
    pythonStarter: `class Solution:
    def copyRandomList(self, head):
        if not head: return None
        mp = {}
        cur = head
        while cur: mp[cur] = Node(cur.val); cur = cur.next
        cur = head
        while cur:
            if cur.next: mp[cur].next = mp[cur.next]
            if cur.random: mp[cur].random = mp[cur.random]
            cur = cur.next
        return mp[head]
`,
    preamble: `class Node:
    def __init__(self, x, next=None, random=None):
        self.val = int(x); self.next = next; self.random = random
def _blr(data):
    if not data: return None
    nodes = [Node(d[0]) for d in data]
    for i in range(len(nodes)-1): nodes[i].next = nodes[i+1]
    for i, d in enumerate(data):
        if d[1] is not None: nodes[i].random = nodes[d[1]]
    return nodes[0]
def _slr(head):
    ns = []; cur = head
    while cur: ns.append(cur); cur = cur.next
    idx = {id(n): i for i, n in enumerate(ns)}
    return [[n.val, idx[id(n.random)] if n.random else None] for n in ns]`,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = _slr(Solution().copyRandomList(_blr(_d["head"])))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"head":[[7,null],[13,0],[11,4],[10,2],[1,0]]}', expected: "[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]" },
      { id: "tc2", label: "Two nodes", input: '{"head":[[1,1],[2,1]]}', expected: "[[1, 1], [2, 1]]" },
      { id: "tc3", label: "Self ref", input: '{"head":[[3,null],[3,0],[3,null]]}', expected: "[[3, null], [3, 0], [3, null]]" },
    ],
  },

  "add-two-numbers": {
    problemId: "add-two-numbers",
    pythonStarter: `class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = type(l1)(0); cur = dummy; carry = 0
        while l1 or l2 or carry:
            v = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
            carry, v = divmod(v, 10)
            cur.next = type(l1)(v); cur = cur.next
            if l1: l1 = l1.next
            if l2: l2 = l2.next
        return dummy.next
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().addTwoNumbers(_bl(_d["l1"]), _bl(_d["l2"]))
print(_j.dumps(_sl(_r)))`,
    testCases: [
      { id: "tc1", label: "342+465=807", input: '{"l1":[2,4,3],"l2":[5,6,4]}', expected: "[7, 0, 8]" },
      { id: "tc2", label: "0+0=0", input: '{"l1":[0],"l2":[0]}', expected: "[0]" },
      { id: "tc3", label: "Carry propagation", input: '{"l1":[9,9,9,9,9,9,9],"l2":[9,9,9,9]}', expected: "[8, 9, 9, 9, 0, 0, 0, 1]" },
    ],
  },

  "find-duplicate-number": {
    problemId: "find-duplicate-number",
    pythonStarter: `from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = nums[0]
        while True:
            slow = nums[slow]; fast = nums[nums[fast]]
            if slow == fast: break
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]; fast = nums[fast]
        return slow
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findDuplicate(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[1,3,4,2,2]}', expected: "2" },
      { id: "tc2", label: "Duplicate 3", input: '{"nums":[3,1,3,4,2]}', expected: "3" },
      { id: "tc3", label: "All same", input: '{"nums":[2,2,2,2]}', expected: "2" },
    ],
  },

  "lru-cache": {
    problemId: "lru-cache",
    pythonStarter: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value
        self.cache.move_to_end(key)
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = LRUCache(_d["capacity"]); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "put": obj.put(args[0], args[1])
    elif op == "get": results.append(obj.get(args[0]))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic eviction", input: '{"capacity":2,"ops":["put","put","get","put","get","put","get","get","get"],"args":[[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]}', expected: "[1, -1, -1, 3, 4]" },
      { id: "tc2", label: "Cap 1", input: '{"capacity":1,"ops":["put","put","get"],"args":[[2,1],[3,2],[2]]}', expected: "[-1]" },
    ],
  },

  "swap-pairs": {
    problemId: "swap-pairs",
    pythonStarter: `class Solution:
    def swapPairs(self, head):
        dummy = type(head)(0) if head else None
        if not dummy: return None
        dummy.next = head; prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next = b; a.next = b.next; b.next = a
            prev = a
        return dummy.next
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_h = _bl(_d["head"])
if not _d["head"]:
    print(_j.dumps([]))
else:
    print(_j.dumps(_sl(Solution().swapPairs(_h))))`,
    testCases: [
      { id: "tc1", label: "Even length", input: '{"head":[1,2,3,4]}', expected: "[2, 1, 4, 3]" },
      { id: "tc2", label: "Odd length", input: '{"head":[1,2,3]}', expected: "[2, 1, 3]" },
      { id: "tc3", label: "Single", input: '{"head":[1]}', expected: "[1]" },
    ],
  },

  "merge-k-sorted": {
    problemId: "merge-k-sorted",
    pythonStarter: `import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = []
        for i, l in enumerate(lists):
            if l: heapq.heappush(heap, (l.val, i, l))
        dummy = type(lists[0])(0) if lists else None
        if not dummy: return None
        cur = dummy
        while heap:
            val, i, node = heapq.heappop(heap)
            cur.next = node; cur = cur.next
            if node.next: heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
heads = [_bl(lst) for lst in _d["lists"]]
_r = Solution().mergeKLists(heads)
print(_j.dumps(_sl(_r) if _r else []))`,
    testCases: [
      { id: "tc1", label: "3 lists", input: '{"lists":[[1,4,5],[1,3,4],[2,6]]}', expected: "[1, 1, 2, 3, 4, 4, 5, 6]" },
      { id: "tc2", label: "Empty input", input: '{"lists":[]}', expected: "[]" },
      { id: "tc3", label: "One empty list", input: '{"lists":[[]]}', expected: "[]" },
    ],
  },

  "reverse-k-group": {
    problemId: "reverse-k-group",
    pythonStarter: `class Solution:
    def reverseKGroup(self, head, k: int):
        dummy = ListNode(0); dummy.next = head; prev = dummy
        while True:
            node = prev
            for _ in range(k):
                node = node.next
                if not node: return dummy.next
            tail = prev.next; cur = tail; p = node.next
            for _ in range(k):
                nxt = cur.next; cur.next = p; p = cur; cur = nxt
            prev.next = p; tail.next = cur; prev = tail
`,
    preamble: LIST_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().reverseKGroup(_bl(_d["head"]), _d["k"])
print(_j.dumps(_sl(_r) if _r else []))`,
    testCases: [
      { id: "tc1", label: "k=2", input: '{"head":[1,2,3,4,5],"k":2}', expected: "[2, 1, 4, 3, 5]" },
      { id: "tc2", label: "k=3", input: '{"head":[1,2,3,4,5],"k":3}', expected: "[3, 2, 1, 4, 5]" },
      { id: "tc3", label: "k=1", input: '{"head":[1,2,3],"k":1}', expected: "[1, 2, 3]" },
    ],
  },

  // ─── Trees (continued) ───────────────────────────────────────────────────────

  "diameter-tree": {
    problemId: "diameter-tree",
    pythonStarter: `class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        self.res = 0
        def dfs(node):
            if not node: return 0
            l, r = dfs(node.left), dfs(node.right)
            self.res = max(self.res, l + r)
            return 1 + max(l, r)
        dfs(root)
        return self.res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().diameterOfBinaryTree(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[1,2,3,4,5]}', expected: "3" },
      { id: "tc2", label: "Single node", input: '{"root":[1]}', expected: "0" },
      { id: "tc3", label: "Linear chain", input: '{"root":[1,2,null,3,null,4]}', expected: "3" },
    ],
  },

  "balanced-tree": {
    problemId: "balanced-tree",
    pythonStarter: `class Solution:
    def isBalanced(self, root) -> bool:
        def dfs(node):
            if not node: return 0
            l, r = dfs(node.left), dfs(node.right)
            if l == -1 or r == -1 or abs(l - r) > 1: return -1
            return 1 + max(l, r)
        return dfs(root) != -1
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isBalanced(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Balanced", input: '{"root":[3,9,20,null,null,15,7]}', expected: "true" },
      { id: "tc2", label: "Unbalanced", input: '{"root":[1,2,2,3,3,null,null,4,4]}', expected: "false" },
      { id: "tc3", label: "Empty", input: '{"root":[]}', expected: "true" },
    ],
  },

  "same-tree": {
    problemId: "same-tree",
    pythonStarter: `class Solution:
    def isSameTree(self, p, q) -> bool:
        if not p and not q: return True
        if not p or not q or p.val != q.val: return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isSameTree(_bt(_d["p"]), _bt(_d["q"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Same", input: '{"p":[1,2,3],"q":[1,2,3]}', expected: "true" },
      { id: "tc2", label: "Different val", input: '{"p":[1,2],"q":[1,null,2]}', expected: "false" },
      { id: "tc3", label: "Different structure", input: '{"p":[1,2,1],"q":[1,1,2]}', expected: "false" },
    ],
  },

  "subtree-of-another": {
    problemId: "subtree-of-another",
    pythonStarter: `class Solution:
    def isSubtree(self, root, subRoot) -> bool:
        if not root: return False
        if self._same(root, subRoot): return True
        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)
    def _same(self, p, q):
        if not p and not q: return True
        if not p or not q or p.val != q.val: return False
        return self._same(p.left, q.left) and self._same(p.right, q.right)
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isSubtree(_bt(_d["root"]), _bt(_d["subRoot"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Is subtree", input: '{"root":[3,4,5,1,2],"subRoot":[4,1,2]}', expected: "true" },
      { id: "tc2", label: "Not subtree", input: '{"root":[3,4,5,1,2,null,null,null,null,0],"subRoot":[4,1,2]}', expected: "false" },
    ],
  },

  "symmetric-tree": {
    problemId: "symmetric-tree",
    pythonStarter: `class Solution:
    def isSymmetric(self, root) -> bool:
        def check(l, r):
            if not l and not r: return True
            if not l or not r or l.val != r.val: return False
            return check(l.left, r.right) and check(l.right, r.left)
        return check(root.left, root.right) if root else True
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isSymmetric(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Symmetric", input: '{"root":[1,2,2,3,4,4,3]}', expected: "true" },
      { id: "tc2", label: "Not symmetric", input: '{"root":[1,2,2,null,3,null,3]}', expected: "false" },
      { id: "tc3", label: "Single node", input: '{"root":[1]}', expected: "true" },
    ],
  },

  "path-sum": {
    problemId: "path-sum",
    pythonStarter: `class Solution:
    def hasPathSum(self, root, targetSum: int) -> bool:
        if not root: return False
        if not root.left and not root.right: return root.val == targetSum
        return self.hasPathSum(root.left, targetSum-root.val) or \
               self.hasPathSum(root.right, targetSum-root.val)
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().hasPathSum(_bt(_d["root"]), _d["targetSum"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"root":[5,4,8,11,null,13,4,7,2,null,null,null,1],"targetSum":22}', expected: "true" },
      { id: "tc2", label: "Not found", input: '{"root":[1,2,3],"targetSum":5}', expected: "false" },
      { id: "tc3", label: "Empty", input: '{"root":[],"targetSum":0}', expected: "false" },
    ],
  },

  "min-depth-tree": {
    problemId: "min-depth-tree",
    pythonStarter: `from collections import deque

class Solution:
    def minDepth(self, root) -> int:
        if not root: return 0
        q = deque([(root, 1)])
        while q:
            node, d = q.popleft()
            if not node.left and not node.right: return d
            if node.left: q.append((node.left, d+1))
            if node.right: q.append((node.right, d+1))
        return 0
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minDepth(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[3,9,20,null,null,15,7]}', expected: "2" },
      { id: "tc2", label: "Left skewed", input: '{"root":[2,null,3,null,4,null,5,null,6]}', expected: "5" },
      { id: "tc3", label: "Single", input: '{"root":[1]}', expected: "1" },
    ],
  },

  "right-side-view": {
    problemId: "right-side-view",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def rightSideView(self, root) -> List[int]:
        if not root: return []
        res = []; q = deque([root])
        while q:
            for _ in range(len(q)):
                node = q.popleft()
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(node.val)
        return res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().rightSideView(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[1,2,3,null,5,null,4]}', expected: "[1, 3, 4]" },
      { id: "tc2", label: "Single", input: '{"root":[1]}', expected: "[1]" },
      { id: "tc3", label: "Left only", input: '{"root":[1,2,null,3]}', expected: "[1, 2, 3]" },
    ],
  },

  "count-good-nodes": {
    problemId: "count-good-nodes",
    pythonStarter: `class Solution:
    def goodNodes(self, root) -> int:
        def dfs(node, mx):
            if not node: return 0
            good = 1 if node.val >= mx else 0
            mx = max(mx, node.val)
            return good + dfs(node.left, mx) + dfs(node.right, mx)
        return dfs(root, root.val)
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().goodNodes(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[3,1,4,3,null,1,5]}', expected: "4" },
      { id: "tc2", label: "All good", input: '{"root":[3,3,null,4,2]}', expected: "3" },
      { id: "tc3", label: "Single", input: '{"root":[1]}', expected: "1" },
    ],
  },

  "kth-smallest-bst": {
    problemId: "kth-smallest-bst",
    pythonStarter: `class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack = []; cur = root
        while True:
            while cur: stack.append(cur); cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0: return cur.val
            cur = cur.right
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().kthSmallest(_bt(_d["root"]), _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "k=1", input: '{"root":[3,1,4,null,2],"k":1}', expected: "1" },
      { id: "tc2", label: "k=3", input: '{"root":[5,3,6,2,4,null,null,1],"k":3}', expected: "3" },
      { id: "tc3", label: "k=2", input: '{"root":[3,1,4,null,2],"k":2}', expected: "2" },
    ],
  },

  "construct-tree-preorder": {
    problemId: "construct-tree-preorder",
    pythonStarter: `from typing import List

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]):
        if not preorder: return None
        root = TreeNode(preorder[0])
        mid = inorder.index(preorder[0])
        root.left = self.buildTree(preorder[1:mid+1], inorder[:mid])
        root.right = self.buildTree(preorder[mid+1:], inorder[mid+1:])
        return root
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
def _build(pre, ino):
    if not pre: return None
    root = TreeNode(pre[0])
    mid = ino.index(pre[0])
    root.left = _build(pre[1:mid+1], ino[:mid])
    root.right = _build(pre[mid+1:], ino[mid+1:])
    return root
_r = _st(Solution().buildTree(_d["preorder"], _d["inorder"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"preorder":[3,9,20,15,7],"inorder":[9,3,15,20,7]}', expected: "[3, 9, 20, null, null, 15, 7]" },
      { id: "tc2", label: "Single node", input: '{"preorder":[-1],"inorder":[-1]}', expected: "[-1]" },
    ],
  },

  "average-of-levels": {
    problemId: "average-of-levels",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def averageOfLevels(self, root) -> List[float]:
        res = []; q = deque([root])
        while q:
            s = 0; n = len(q)
            for _ in range(n):
                node = q.popleft()
                s += node.val
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            res.append(s / n)
        return res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = [round(x, 5) for x in Solution().averageOfLevels(_bt(_d["root"]))]
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[3,9,20,null,null,15,7]}', expected: "[3.0, 14.5, 11.0]" },
      { id: "tc2", label: "Single", input: '{"root":[1]}', expected: "[1.0]" },
      { id: "tc3", label: "Two levels", input: '{"root":[1,2,3]}', expected: "[1.0, 2.5]" },
    ],
  },

  "binary-tree-paths": {
    problemId: "binary-tree-paths",
    pythonStarter: `from typing import List

class Solution:
    def binaryTreePaths(self, root) -> List[str]:
        if not root: return []
        if not root.left and not root.right: return [str(root.val)]
        res = []
        for path in self.binaryTreePaths(root.left) + self.binaryTreePaths(root.right):
            res.append(str(root.val) + "->" + path)
        return res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().binaryTreePaths(_bt(_d["root"])))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[1,2,3,null,5]}', expected: '["1->2->5", "1->3"]' },
      { id: "tc2", label: "Single", input: '{"root":[1]}', expected: '["1"]' },
    ],
  },

  "max-path-sum": {
    problemId: "max-path-sum",
    pythonStarter: `class Solution:
    def maxPathSum(self, root) -> int:
        self.res = float("-inf")
        def dfs(node):
            if not node: return 0
            l = max(dfs(node.left), 0)
            r = max(dfs(node.right), 0)
            self.res = max(self.res, node.val + l + r)
            return node.val + max(l, r)
        dfs(root)
        return self.res
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxPathSum(_bt(_d["root"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"root":[1,2,3]}', expected: "6" },
      { id: "tc2", label: "Negative nodes", input: '{"root":[-3]}', expected: "-3" },
      { id: "tc3", label: "Mixed", input: '{"root":[-10,9,20,null,null,15,7]}', expected: "42" },
    ],
  },

  "serialize-deserialize": {
    problemId: "serialize-deserialize",
    pythonStarter: `from collections import deque

class Codec:
    def serialize(self, root) -> str:
        if not root: return "N"
        q = deque([root]); res = []
        while q:
            node = q.popleft()
            if node: res.append(str(node.val)); q.append(node.left); q.append(node.right)
            else: res.append("N")
        return ",".join(res)

    def deserialize(self, data: str):
        vals = data.split(","); i = 0
        if vals[0] == "N": return None
        root = TreeNode(int(vals[0])); q = deque([root]); i = 1
        while q:
            node = q.popleft()
            if i < len(vals) and vals[i] != "N": node.left = TreeNode(int(vals[i])); q.append(node.left)
            i += 1
            if i < len(vals) and vals[i] != "N": node.right = TreeNode(int(vals[i])); q.append(node.right)
            i += 1
        return root
`,
    preamble: TREE_PREAMBLE,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
c = Codec()
_r = _st(c.deserialize(c.serialize(_bt(_d["tree"]))))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Round trip", input: '{"tree":[1,2,3,null,null,4,5]}', expected: "[1, 2, 3, null, null, 4, 5]" },
      { id: "tc2", label: "Empty", input: '{"tree":[]}', expected: "[]" },
      { id: "tc3", label: "Single", input: '{"tree":[1]}', expected: "[1]" },
    ],
  },


  // ─── Heap / Priority Queue ───────────────────────────────────────────────────

  "kth-largest-stream": {
    problemId: "kth-largest-stream",
    pythonStarter: `import heapq

class KthLargest:
    def __init__(self, k: int, nums):
        self.k = k; self.heap = nums[:]
        heapq.heapify(self.heap)
        while len(self.heap) > k: heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k: heapq.heappop(self.heap)
        return self.heap[0]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = KthLargest(_d["k"], _d["nums"]); results = []
for v in _d["adds"]: results.append(obj.add(v))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"k":3,"nums":[4,5,8,2],"adds":[3,5,10,9,4]}', expected: "[4, 5, 8, 8, 8]" },
      { id: "tc2", label: "k=1", input: '{"k":1,"nums":[],"adds":[3,2,1]}', expected: "[3, 3, 3]" },
    ],
  },

  "last-stone-weight": {
    problemId: "last-stone-weight",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        h = [-s for s in stones]
        heapq.heapify(h)
        while len(h) > 1:
            a, b = -heapq.heappop(h), -heapq.heappop(h)
            if a != b: heapq.heappush(h, -(a - b))
        return -h[0] if h else 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().lastStoneWeight(_d["stones"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"stones":[2,7,4,1,8,1]}', expected: "1" },
      { id: "tc2", label: "One stone", input: '{"stones":[1]}', expected: "1" },
      { id: "tc3", label: "Two equal", input: '{"stones":[3,3]}', expected: "0" },
    ],
  },

  "k-closest-points": {
    problemId: "k-closest-points",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().kClosest(_d["points"], _d["k"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic k=2", input: '{"points":[[1,3],[-2,2]],"k":1}', expected: "[[-2, 2]]" },
      { id: "tc2", label: "k=2", input: '{"points":[[3,3],[5,-1],[-2,4]],"k":2}', expected: "[[-2, 4], [3, 3]]" },
      { id: "tc3", label: "All points", input: '{"points":[[0,1],[1,0]],"k":2}', expected: "[[0, 1], [1, 0]]" },
    ],
  },

  "kth-largest-array": {
    problemId: "kth-largest-array",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findKthLargest(_d["nums"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "k=2", input: '{"nums":[3,2,1,5,6,4],"k":2}', expected: "5" },
      { id: "tc2", label: "k=4", input: '{"nums":[3,2,3,1,2,4,5,5,6],"k":4}', expected: "4" },
      { id: "tc3", label: "k=1", input: '{"nums":[1],"k":1}', expected: "1" },
    ],
  },

  "task-scheduler": {
    problemId: "task-scheduler",
    pythonStarter: `from typing import List
from collections import Counter

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        cnt = Counter(tasks)
        max_cnt = max(cnt.values())
        max_tasks = sum(1 for v in cnt.values() if v == max_cnt)
        return max((max_cnt - 1) * (n + 1) + max_tasks, len(tasks))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().leastInterval(_d["tasks"], _d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"tasks":["A","A","A","B","B","B"],"n":2}', expected: "8" },
      { id: "tc2", label: "No cooldown", input: '{"tasks":["A","A","A","B","B","B"],"n":0}', expected: "6" },
      { id: "tc3", label: "Many types", input: '{"tasks":["A","A","A","A","A","A","B","C","D","E","F","G"],"n":2}', expected: "16" },
    ],
  },

  "design-twitter": {
    problemId: "design-twitter",
    pythonStarter: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)
        self.follows = defaultdict(set)

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int):
        heap = []
        users = self.follows[userId] | {userId}
        for u in users:
            for t in self.tweets[u][-10:]:
                heapq.heappush(heap, t)
        return [tid for _, tid in heapq.nlargest(10, heap)]

    def follow(self, followerId: int, followeeId: int) -> None:
        self.follows[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follows[followerId].discard(followeeId)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = Twitter(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "postTweet": obj.postTweet(args[0], args[1])
    elif op == "getNewsFeed": results.append(obj.getNewsFeed(args[0]))
    elif op == "follow": obj.follow(args[0], args[1])
    elif op == "unfollow": obj.unfollow(args[0], args[1])
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic feed", input: '{"ops":["postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"],"args":[[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]}', expected: "[[5], [6, 5], [5]]" },
    ],
  },

  "find-median-stream": {
    problemId: "find-median-stream",
    pythonStarter: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max heap (negated)
        self.large = []  # min heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        if self.small and self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large): return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = MedianFinder(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "addNum": obj.addNum(args[0])
    elif op == "findMedian": results.append(round(obj.findMedian(), 5))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"ops":["addNum","addNum","findMedian","addNum","findMedian"],"args":[[1],[2],[],[3],[]]}', expected: "[1.5, 2.0]" },
      { id: "tc2", label: "Single", input: '{"ops":["addNum","findMedian"],"args":[[6],[]]}', expected: "[6.0]" },
    ],
  },

  // ─── Backtracking ─────────────────────────────────────────────────────────────

  "subsets": {
    problemId: "subsets",
    pythonStarter: `from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = [[]]
        for n in nums:
            res += [s + [n] for s in res]
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted([sorted(s) for s in Solution().subsets(_d["nums"])])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "3 nums", input: '{"nums":[1,2,3]}', expected: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]" },
      { id: "tc2", label: "Single", input: '{"nums":[0]}', expected: "[[], [0]]" },
    ],
  },

  "combination-sum": {
    problemId: "combination-sum",
    pythonStarter: `from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        def bt(start, cur, rem):
            if rem == 0: res.append(cur[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] <= rem:
                    cur.append(candidates[i])
                    bt(i, cur, rem - candidates[i])
                    cur.pop()
        bt(0, [], target)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted([sorted(c) for c in Solution().combinationSum(_d["candidates"], _d["target"])])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"candidates":[2,3,6,7],"target":7}', expected: "[[2, 2, 3], [7]]" },
      { id: "tc2", label: "Multiple", input: '{"candidates":[2,3,5],"target":8}', expected: "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]" },
      { id: "tc3", label: "No solution", input: '{"candidates":[2],"target":3}', expected: "[]" },
    ],
  },

  "permutations": {
    problemId: "permutations",
    pythonStarter: `from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        res = []
        def bt(cur, rem):
            if not rem: res.append(cur[:]); return
            for i, n in enumerate(rem):
                cur.append(n)
                bt(cur, rem[:i] + rem[i+1:])
                cur.pop()
        bt([], nums)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().permute(_d["nums"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "3 nums", input: '{"nums":[1,2,3]}', expected: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]" },
      { id: "tc2", label: "Single", input: '{"nums":[0]}', expected: "[[0]]" },
    ],
  },

  "subsets-ii": {
    problemId: "subsets-ii",
    pythonStarter: `from typing import List

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort(); res = [[]]
        for i, n in enumerate(nums):
            if i == 0 or nums[i] != nums[i-1]: start = 0
            res += [s + [n] for s in res[start:]]
            start = len(res) - sum(1 for s in res if s and s[-1] == n)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted([sorted(s) for s in Solution().subsetsWithDup(_d["nums"])])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "With dup", input: '{"nums":[1,2,2]}', expected: "[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]" },
      { id: "tc2", label: "All same", input: '{"nums":[0]}', expected: "[[], [0]]" },
    ],
  },

  "combination-sum-ii": {
    problemId: "combination-sum-ii",
    pythonStarter: `from typing import List

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort(); res = []
        def bt(start, cur, rem):
            if rem == 0: res.append(cur[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] > rem: break
                if i > start and candidates[i] == candidates[i-1]: continue
                cur.append(candidates[i])
                bt(i+1, cur, rem - candidates[i])
                cur.pop()
        bt(0, [], target)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted([sorted(c) for c in Solution().combinationSum2(_d["candidates"], _d["target"])])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"candidates":[10,1,2,7,6,1,5],"target":8}', expected: "[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]" },
      { id: "tc2", label: "No solution", input: '{"candidates":[2,5,2,1,2],"target":5}', expected: "[[1, 2, 2], [5]]" },
    ],
  },

  "word-search": {
    problemId: "word-search",
    pythonStarter: `from typing import List

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])
        def dfs(r, c, i):
            if i == len(word): return True
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]: return False
            tmp, board[r][c] = board[r][c], "#"
            found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)
            board[r][c] = tmp
            return found
        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().exist(_d["board"], _d["word"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Found", input: '{"board":[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"word":"ABCCED"}', expected: "true" },
      { id: "tc2", label: "Not found", input: '{"board":[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"word":"ABCB"}', expected: "false" },
    ],
  },

  "palindrome-partitioning": {
    problemId: "palindrome-partitioning",
    pythonStarter: `from typing import List

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        def bt(start, cur):
            if start == len(s): res.append(cur[:]); return
            for end in range(start+1, len(s)+1):
                sub = s[start:end]
                if sub == sub[::-1]:
                    cur.append(sub); bt(end, cur); cur.pop()
        bt(0, [])
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().partition(_d["s"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "aab", input: '{"s":"aab"}', expected: '[["a", "a", "b"], ["aa", "b"]]' },
      { id: "tc2", label: "Single char", input: '{"s":"a"}', expected: '[["a"]]' },
    ],
  },

  "letter-combinations": {
    problemId: "letter-combinations",
    pythonStarter: `from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        if not digits: return []
        phone = {"2":"abc","3":"def","4":"ghi","5":"jkl","6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
        res = []
        def bt(i, cur):
            if i == len(digits): res.append(cur); return
            for c in phone[digits[i]]: bt(i+1, cur+c)
        bt(0, "")
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().letterCombinations(_d["digits"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "23", input: '{"digits":"23"}', expected: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]' },
      { id: "tc2", label: "Empty", input: '{"digits":""}', expected: "[]" },
      { id: "tc3", label: "Single", input: '{"digits":"2"}', expected: '["a", "b", "c"]' },
    ],
  },

  "combination-sum-iii": {
    problemId: "combination-sum-iii",
    pythonStarter: `from typing import List

class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        res = []
        def bt(start, cur, rem):
            if len(cur) == k and rem == 0: res.append(cur[:]); return
            if len(cur) == k or rem == 0: return
            for i in range(start, 10):
                cur.append(i); bt(i+1, cur, rem-i); cur.pop()
        bt(1, [], n)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted([sorted(c) for c in Solution().combinationSum3(_d["k"], _d["n"])])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "k=3,n=7", input: '{"k":3,"n":7}', expected: "[[1, 2, 4]]" },
      { id: "tc2", label: "k=3,n=9", input: '{"k":3,"n":9}', expected: "[[1, 2, 6], [1, 3, 5], [2, 3, 4]]" },
      { id: "tc3", label: "No solution", input: '{"k":4,"n":1}', expected: "[]" },
    ],
  },

  "n-queens": {
    problemId: "n-queens",
    pythonStarter: `from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        res = []; cols = set(); diag1 = set(); diag2 = set()
        board = [["."] * n for _ in range(n)]
        def bt(r):
            if r == n: res.append(["".join(row) for row in board]); return
            for c in range(n):
                if c in cols or (r-c) in diag1 or (r+c) in diag2: continue
                cols.add(c); diag1.add(r-c); diag2.add(r+c)
                board[r][c] = "Q"
                bt(r+1)
                board[r][c] = "."; cols.discard(c); diag1.discard(r-c); diag2.discard(r+c)
        bt(0)
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = len(Solution().solveNQueens(_d["n"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=4", input: '{"n":4}', expected: "2" },
      { id: "tc2", label: "n=1", input: '{"n":1}', expected: "1" },
      { id: "tc3", label: "n=5", input: '{"n":5}', expected: "10" },
    ],
  },

  // ─── Graphs (continued) ──────────────────────────────────────────────────────

  "find-path-exists": {
    problemId: "find-path-exists",
    pythonStarter: `from typing import List

class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        parent = list(range(n))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        for u, v in edges:
            pu, pv = find(u), find(v)
            if pu != pv: parent[pu] = pv
        return find(source) == find(destination)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().validPath(_d["n"], _d["edges"], _d["source"], _d["destination"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Path exists", input: '{"n":3,"edges":[[0,1],[1,2],[2,0]],"source":0,"destination":2}', expected: "true" },
      { id: "tc2", label: "No path", input: '{"n":6,"edges":[[0,1],[0,2],[3,5],[5,4],[4,3]],"source":0,"destination":5}', expected: "false" },
    ],
  },

  "clone-graph": {
    problemId: "clone-graph",
    pythonStarter: `from typing import Optional

class Solution:
    def cloneGraph(self, node):
        if not node: return None
        mp = {}
        def dfs(n):
            if n in mp: return mp[n]
            clone = Node(n.val)
            mp[n] = clone
            for nb in n.neighbors: clone.neighbors.append(dfs(nb))
            return clone
        return dfs(node)
`,
    preamble: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val; self.neighbors = neighbors if neighbors else []
def _build_graph(adj):
    if not adj: return None
    nodes = [Node(i+1) for i in range(len(adj))]
    for i, nbs in enumerate(adj):
        nodes[i].neighbors = [nodes[j-1] for j in nbs]
    return nodes[0]
def _serialize_graph(node):
    if not node: return []
    seen = {}; q = [node]
    while q:
        n = q.pop(0)
        if n.val not in seen:
            seen[n.val] = sorted([nb.val for nb in n.neighbors])
            q.extend(n.neighbors)
    return [seen[i+1] for i in range(len(seen))]`,
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
orig = _build_graph(_d["adj"])
clone = Solution().cloneGraph(orig)
print(_j.dumps(_serialize_graph(clone) if clone else []))`,
    testCases: [
      { id: "tc1", label: "4 nodes cycle", input: '{"adj":[[2,4],[1,3],[2,4],[1,3]]}', expected: "[[2, 4], [1, 3], [2, 4], [1, 3]]" },
      { id: "tc2", label: "Single node", input: '{"adj":[[]]}', expected: "[[]]" },
    ],
  },

  "max-area-island": {
    problemId: "max-area-island",
    pythonStarter: `from typing import List

class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0: return 0
            grid[r][c] = 0
            return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)
        return max((dfs(r, c) for r in range(rows) for c in range(cols) if grid[r][c]), default=0)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxAreaOfIsland([row[:] for row in _d["grid"]])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"grid":[[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]}', expected: "6" },
      { id: "tc2", label: "No island", input: '{"grid":[[0,0,0,0,0,0,0,0]]}', expected: "0" },
    ],
  },

  "pacific-atlantic": {
    problemId: "pacific-atlantic",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        rows, cols = len(heights), len(heights[0])
        def bfs(starts):
            q = deque(starts); vis = set(starts)
            while q:
                r, c = q.popleft()
                for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                    nr, nc = r+dr, c+dc
                    if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in vis and heights[nr][nc] >= heights[r][c]:
                        vis.add((nr,nc)); q.append((nr,nc))
            return vis
        pac = bfs([(r,0) for r in range(rows)] + [(0,c) for c in range(cols)])
        atl = bfs([(r,cols-1) for r in range(rows)] + [(rows-1,c) for c in range(cols)])
        return sorted([list(p) for p in pac & atl])
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().pacificAtlantic(_d["heights"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"heights":[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]}', expected: "[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]" },
      { id: "tc2", label: "Single cell", input: '{"heights":[[1]]}', expected: "[[0, 0]]" },
    ],
  },

  "surrounded-regions": {
    problemId: "surrounded-regions",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        rows, cols = len(board), len(board[0])
        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != "O": return
            board[r][c] = "S"
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]: dfs(r+dr, c+dc)
        for r in range(rows):
            if board[r][0] == "O": dfs(r, 0)
            if board[r][cols-1] == "O": dfs(r, cols-1)
        for c in range(cols):
            if board[0][c] == "O": dfs(0, c)
            if board[rows-1][c] == "O": dfs(rows-1, c)
        for r in range(rows):
            for c in range(cols):
                if board[r][c] == "O": board[r][c] = "X"
                elif board[r][c] == "S": board[r][c] = "O"
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
board = [row[:] for row in _d["board"]]
Solution().solve(board)
print(_j.dumps(board))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"board":[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]}', expected: '[["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]' },
      { id: "tc2", label: "All X", input: '{"board":[["X"]]}', expected: '[["X"]]' },
    ],
  },

  "rotting-oranges": {
    problemId: "rotting-oranges",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        q = deque(); fresh = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2: q.append((r,c,0))
                elif grid[r][c] == 1: fresh += 1
        time = 0
        while q:
            r, c, t = q.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2; fresh -= 1; q.append((nr,nc,t+1)); time = t+1
        return time if fresh == 0 else -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().orangesRotting([row[:] for row in _d["grid"]])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"grid":[[2,1,1],[1,1,0],[0,1,1]]}', expected: "4" },
      { id: "tc2", label: "Impossible", input: '{"grid":[[2,1,1],[0,1,1],[1,0,1]]}', expected: "-1" },
      { id: "tc3", label: "Already done", input: '{"grid":[[0,2]]}', expected: "0" },
    ],
  },

  "walls-gates": {
    problemId: "walls-gates",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def wallsAndGates(self, rooms: List[List[int]]) -> None:
        INF = 2147483647
        rows, cols = len(rooms), len(rooms[0])
        q = deque()
        for r in range(rows):
            for c in range(cols):
                if rooms[r][c] == 0: q.append((r,c))
        while q:
            r, c = q.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and rooms[nr][nc] == INF:
                    rooms[nr][nc] = rooms[r][c] + 1; q.append((nr,nc))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
rooms = [row[:] for row in _d["rooms"]]
Solution().wallsAndGates(rooms)
print(_j.dumps(rooms))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"rooms":[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]}', expected: "[[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]" },
    ],
  },

  "course-schedule-ii": {
    problemId: "course-schedule-ii",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites: graph[b].append(a); indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        res = []
        while q:
            node = q.popleft(); res.append(node)
            for nb in graph[node]:
                indeg[nb] -= 1
                if indeg[nb] == 0: q.append(nb)
        return res if len(res) == numCourses else []
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findOrder(_d["numCourses"], _d["prerequisites"])
if not _r:
    print(_j.dumps([]))
else:
    pos = {v:i for i,v in enumerate(_r)}
    valid = all(pos[a] > pos[b] for a,b in _d["prerequisites"])
    print(_j.dumps(_r if valid else []))`,
    testCases: [
      { id: "tc1", label: "Simple chain", input: '{"numCourses":2,"prerequisites":[[1,0]]}', expected: "[0, 1]" },
      { id: "tc2", label: "Cycle", input: '{"numCourses":2,"prerequisites":[[1,0],[0,1]]}', expected: "[]" },
      { id: "tc3", label: "4 courses", input: '{"numCourses":4,"prerequisites":[[1,0],[2,0],[3,1],[3,2]]}', expected: "[0, 1, 2, 3]" },
    ],
  },

  "graph-valid-tree": {
    problemId: "graph-valid-tree",
    pythonStarter: `from typing import List

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) != n - 1: return False
        parent = list(range(n))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        for u, v in edges:
            pu, pv = find(u), find(v)
            if pu == pv: return False
            parent[pu] = pv
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().validTree(_d["n"], _d["edges"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Valid tree", input: '{"n":5,"edges":[[0,1],[0,2],[0,3],[1,4]]}', expected: "true" },
      { id: "tc2", label: "Has cycle", input: '{"n":5,"edges":[[0,1],[1,2],[2,3],[1,3],[1,4]]}', expected: "false" },
    ],
  },

  "num-connected-components": {
    problemId: "num-connected-components",
    pythonStarter: `from typing import List

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        parent = list(range(n))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        count = n
        for u, v in edges:
            pu, pv = find(u), find(v)
            if pu != pv: parent[pu] = pv; count -= 1
        return count
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().countComponents(_d["n"], _d["edges"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "2 components", input: '{"n":5,"edges":[[0,1],[1,2],[3,4]]}', expected: "2" },
      { id: "tc2", label: "1 component", input: '{"n":5,"edges":[[0,1],[1,2],[2,3],[3,4]]}', expected: "1" },
    ],
  },

  "redundant-connection": {
    problemId: "redundant-connection",
    pythonStarter: `from typing import List

class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        parent = list(range(len(edges) + 1))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        for u, v in edges:
            pu, pv = find(u), find(v)
            if pu == pv: return [u, v]
            parent[pu] = pv
        return []
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findRedundantConnection(_d["edges"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"edges":[[1,2],[1,3],[2,3]]}', expected: "[2, 3]" },
      { id: "tc2", label: "Longer", input: '{"edges":[[1,2],[2,3],[3,4],[1,4],[1,5]]}', expected: "[1, 4]" },
    ],
  },

  "all-paths-source-target": {
    problemId: "all-paths-source-target",
    pythonStarter: `from typing import List

class Solution:
    def allPathsSourceTarget(self, graph: List[List[int]]) -> List[List[int]]:
        res = []
        def dfs(node, path):
            if node == len(graph) - 1: res.append(path[:]); return
            for nb in graph[node]: path.append(nb); dfs(nb, path); path.pop()
        dfs(0, [0])
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().allPathsSourceTarget(_d["graph"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"graph":[[1,2],[3],[3],[]]}', expected: "[[0, 1, 3], [0, 2, 3]]" },
      { id: "tc2", label: "Single path", input: '{"graph":[[4,3,1],[3,2,4],[3],[4],[]]}', expected: "[[0, 1, 2, 3, 4], [0, 1, 3, 4], [0, 1, 4], [0, 3, 4], [0, 4]]" },
    ],
  },

  "word-ladder": {
    problemId: "word-ladder",
    pythonStarter: `from typing import List
from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        wordSet = set(wordList)
        if endWord not in wordSet: return 0
        q = deque([(beginWord, 1)])
        while q:
            word, steps = q.popleft()
            for i in range(len(word)):
                for c in "abcdefghijklmnopqrstuvwxyz":
                    nw = word[:i] + c + word[i+1:]
                    if nw == endWord: return steps + 1
                    if nw in wordSet: wordSet.remove(nw); q.append((nw, steps+1))
        return 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().ladderLength(_d["beginWord"], _d["endWord"], _d["wordList"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog"]}', expected: "5" },
      { id: "tc2", label: "No path", input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log"]}', expected: "0" },
    ],
  },


  // ─── Dynamic Programming (continued) ────────────────────────────────────────

  "min-cost-climbing": {
    problemId: "min-cost-climbing",
    pythonStarter: `from typing import List

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        for i in range(2, n): cost[i] += min(cost[i-1], cost[i-2])
        return min(cost[-1], cost[-2])
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minCostClimbingStairs(_d["cost"][:])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"cost":[10,15,20]}', expected: "15" },
      { id: "tc2", label: "Longer", input: '{"cost":[1,100,1,1,1,100,1,1,100,1]}', expected: "6" },
    ],
  },

  "nth-tribonacci": {
    problemId: "nth-tribonacci",
    pythonStarter: `class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0: return 0
        if n <= 2: return 1
        a, b, c = 0, 1, 1
        for _ in range(n - 2): a, b, c = b, c, a + b + c
        return c
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().tribonacci(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=4", input: '{"n":4}', expected: "4" },
      { id: "tc2", label: "n=25", input: '{"n":25}', expected: "1389537" },
      { id: "tc3", label: "n=0", input: '{"n":0}', expected: "0" },
    ],
  },

  "longest-palindromic-substr": {
    problemId: "longest-palindromic-substr",
    pythonStarter: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        for i in range(len(s)):
            for l, r in [(i, i), (i, i+1)]:
                while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
                if r - l - 1 > len(res): res = s[l+1:r]
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().longestPalindrome(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "babad", input: '{"s":"babad"}', expected: '"bab"' },
      { id: "tc2", label: "cbbd", input: '{"s":"cbbd"}', expected: '"bb"' },
      { id: "tc3", label: "Single", input: '{"s":"a"}', expected: '"a"' },
    ],
  },

  "palindromic-substrings": {
    problemId: "palindromic-substrings",
    pythonStarter: `class Solution:
    def countSubstrings(self, s: str) -> int:
        count = 0
        for i in range(len(s)):
            for l, r in [(i, i), (i, i+1)]:
                while l >= 0 and r < len(s) and s[l] == s[r]: count += 1; l -= 1; r += 1
        return count
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().countSubstrings(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "abc", input: '{"s":"abc"}', expected: "3" },
      { id: "tc2", label: "aaa", input: '{"s":"aaa"}', expected: "6" },
    ],
  },

  "partition-equal-subset": {
    problemId: "partition-equal-subset",
    pythonStarter: `from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2: return False
        target = total // 2
        dp = {0}
        for n in nums:
            dp = {s + n for s in dp} | dp
            if target in dp: return True
        return False
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canPartition(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"nums":[1,5,11,5]}', expected: "true" },
      { id: "tc2", label: "No", input: '{"nums":[1,2,3,5]}', expected: "false" },
      { id: "tc3", label: "Two equal", input: '{"nums":[1,1]}', expected: "true" },
    ],
  },

  "jump-game-vii": {
    problemId: "jump-game-vii",
    pythonStarter: `class Solution:
    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:
        n = len(s)
        if s[-1] != "0": return False
        reach = pre = 0
        for i in range(1, n):
            if i >= minJump: pre += (s[i - minJump] == "0")
            if i > maxJump: pre -= (s[i - maxJump - 1] == "0")
            if pre > 0 and s[i] == "0": reach = i
        return reach == n - 1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canReach(_d["s"], _d["minJump"], _d["maxJump"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Reachable", input: '{"s":"011010","minJump":2,"maxJump":3}', expected: "true" },
      { id: "tc2", label: "Not reachable", input: '{"s":"01101110","minJump":2,"maxJump":3}', expected: "false" },
    ],
  },

  "minimum-path-sum": {
    problemId: "minimum-path-sum",
    pythonStarter: `from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        for r in range(rows):
            for c in range(cols):
                if r == 0 and c == 0: continue
                if r == 0: grid[r][c] += grid[r][c-1]
                elif c == 0: grid[r][c] += grid[r-1][c]
                else: grid[r][c] += min(grid[r-1][c], grid[r][c-1])
        return grid[-1][-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minPathSum([row[:] for row in _d["grid"]])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"grid":[[1,3,1],[1,5,1],[4,2,1]]}', expected: "7" },
      { id: "tc2", label: "Single row", input: '{"grid":[[1,2,3]]}', expected: "6" },
      { id: "tc3", label: "Single col", input: '{"grid":[[1],[2],[3]]}', expected: "6" },
    ],
  },

  "triangle": {
    problemId: "triangle",
    pythonStarter: `from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = triangle[-1][:]
        for row in range(len(triangle)-2, -1, -1):
            for i in range(len(triangle[row])):
                dp[i] = triangle[row][i] + min(dp[i], dp[i+1])
        return dp[0]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minimumTotal(_d["triangle"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"triangle":[[2],[3,4],[6,5,7],[4,1,8,3]]}', expected: "11" },
      { id: "tc2", label: "Single", input: '{"triangle":[[-10]]}', expected: "-10" },
    ],
  },

  "longest-common-subsequence": {
    problemId: "longest-common-subsequence",
    pythonStarter: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n+1) for _ in range(m+1)]
        for i in range(1, m+1):
            for j in range(1, n+1):
                if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
                else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        return dp[m][n]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().longestCommonSubsequence(_d["text1"], _d["text2"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"text1":"abcde","text2":"ace"}', expected: "3" },
      { id: "tc2", label: "Same", input: '{"text1":"abc","text2":"abc"}', expected: "3" },
      { id: "tc3", label: "No common", input: '{"text1":"abc","text2":"def"}', expected: "0" },
    ],
  },

  "edit-distance": {
    problemId: "edit-distance",
    pythonStarter: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = list(range(n+1))
        for i in range(1, m+1):
            prev = dp[0]; dp[0] = i
            for j in range(1, n+1):
                tmp = dp[j]
                if word1[i-1] == word2[j-1]: dp[j] = prev
                else: dp[j] = 1 + min(prev, dp[j], dp[j-1])
                prev = tmp
        return dp[n]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minDistance(_d["word1"], _d["word2"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "horse→ros", input: '{"word1":"horse","word2":"ros"}', expected: "3" },
      { id: "tc2", label: "intention→execution", input: '{"word1":"intention","word2":"execution"}', expected: "5" },
      { id: "tc3", label: "Same", input: '{"word1":"abc","word2":"abc"}', expected: "0" },
    ],
  },

  "buy-sell-cooldown": {
    problemId: "buy-sell-cooldown",
    pythonStarter: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        hold = sold = rest = 0
        hold = -prices[0]
        for p in prices[1:]:
            prev_hold, prev_sold = hold, sold
            hold = max(hold, rest - p)
            sold = prev_hold + p
            rest = max(rest, prev_sold)
        return max(sold, rest)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxProfit(_d["prices"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"prices":[1,2,3,0,2]}', expected: "3" },
      { id: "tc2", label: "Single", input: '{"prices":[1]}', expected: "0" },
    ],
  },

  "coin-change-ii": {
    problemId: "coin-change-ii",
    pythonStarter: `from typing import List

class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1
        for c in coins:
            for i in range(c, amount + 1):
                dp[i] += dp[i-c]
        return dp[amount]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().change(_d["amount"], _d["coins"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"amount":5,"coins":[1,2,5]}', expected: "4" },
      { id: "tc2", label: "No way", input: '{"amount":3,"coins":[2]}', expected: "0" },
      { id: "tc3", label: "Zero amount", input: '{"amount":0,"coins":[1,2,3]}', expected: "1" },
    ],
  },

  "target-sum": {
    problemId: "target-sum",
    pythonStarter: `from typing import List
from collections import defaultdict

class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        dp = defaultdict(int); dp[0] = 1
        for n in nums:
            ndp = defaultdict(int)
            for s, cnt in dp.items():
                ndp[s+n] += cnt; ndp[s-n] += cnt
            dp = ndp
        return dp[target]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findTargetSumWays(_d["nums"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[1,1,1,1,1],"target":3}', expected: "5" },
      { id: "tc2", label: "Single", input: '{"nums":[1],"target":1}', expected: "1" },
    ],
  },

  "interleaving-string": {
    problemId: "interleaving-string",
    pythonStarter: `class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3): return False
        dp = [[False] * (n+1) for _ in range(m+1)]
        dp[0][0] = True
        for i in range(1, m+1): dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
        for j in range(1, n+1): dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]
        for i in range(1, m+1):
            for j in range(1, n+1):
                dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or \
                            (dp[i][j-1] and s2[j-1] == s3[i+j-1])
        return dp[m][n]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isInterleave(_d["s1"], _d["s2"], _d["s3"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"s1":"aabcc","s2":"dbbca","s3":"aadbbcbcac"}', expected: "true" },
      { id: "tc2", label: "No", input: '{"s1":"aabcc","s2":"dbbca","s3":"aadbbbaccc"}', expected: "false" },
    ],
  },

  "longest-increasing-path-matrix": {
    problemId: "longest-increasing-path-matrix",
    pythonStarter: `from typing import List
from functools import lru_cache

class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        rows, cols = len(matrix), len(matrix[0])
        @lru_cache(None)
        def dfs(r, c):
            best = 1
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            return best
        return max(dfs(r, c) for r in range(rows) for c in range(cols))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().longestIncreasingPath(_d["matrix"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"matrix":[[9,9,4],[6,6,8],[2,1,1]]}', expected: "4" },
      { id: "tc2", label: "3x3", input: '{"matrix":[[3,4,5],[3,2,6],[2,2,1]]}', expected: "4" },
      { id: "tc3", label: "Single", input: '{"matrix":[[1]]}', expected: "1" },
    ],
  },

  "distinct-subsequences": {
    problemId: "distinct-subsequences",
    pythonStarter: `class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [0] * (n+1); dp[0] = 1
        for i in range(1, m+1):
            for j in range(n, 0, -1):
                if s[i-1] == t[j-1]: dp[j] += dp[j-1]
        return dp[n]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().numDistinct(_d["s"], _d["t"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "rabbbit→rabbit", input: '{"s":"rabbbit","t":"rabbit"}', expected: "3" },
      { id: "tc2", label: "babgbag→bag", input: '{"s":"babgbag","t":"bag"}', expected: "5" },
    ],
  },

  "burst-balloons": {
    problemId: "burst-balloons",
    pythonStarter: `from typing import List

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + nums + [1]
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for l in range(0, n - length):
                r = l + length
                for k in range(l+1, r):
                    dp[l][r] = max(dp[l][r], nums[l]*nums[k]*nums[r] + dp[l][k] + dp[k][r])
        return dp[0][n-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxCoins(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[3,1,5,8]}', expected: "167" },
      { id: "tc2", label: "Single", input: '{"nums":[1,5]}', expected: "10" },
    ],
  },

  "regular-expression-matching": {
    problemId: "regular-expression-matching",
    pythonStarter: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        dp = [[False]*(n+1) for _ in range(m+1)]
        dp[0][0] = True
        for j in range(2, n+1):
            if p[j-1] == "*": dp[0][j] = dp[0][j-2]
        for i in range(1, m+1):
            for j in range(1, n+1):
                if p[j-1] in {s[i-1], "."}:
                    dp[i][j] = dp[i-1][j-1]
                elif p[j-1] == "*":
                    dp[i][j] = dp[i][j-2] or (dp[i-1][j] and p[j-2] in {s[i-1], "."})
        return dp[m][n]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isMatch(_d["s"], _d["p"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "No match", input: '{"s":"aa","p":"a"}', expected: "false" },
      { id: "tc2", label: "Star match", input: '{"s":"aa","p":"a*"}', expected: "true" },
      { id: "tc3", label: "Dot star", input: '{"s":"ab","p":".*"}', expected: "true" },
      { id: "tc4", label: "Complex", input: '{"s":"aab","p":"c*a*b"}', expected: "true", hidden: true },
    ],
  },

  "max-score-multiplication": {
    problemId: "max-score-multiplication",
    pythonStarter: `from typing import List

class Solution:
    def maximumScore(self, nums: List[int], multipliers: List[int]) -> int:
        n, m = len(nums), len(multipliers)
        dp = [[0]*(m+1) for _ in range(m+1)]
        for i in range(m-1, -1, -1):
            for l in range(i, -1, -1):
                r = n - 1 - (i - l)
                mul = multipliers[i]
                dp[i][l] = max(mul * nums[l] + dp[i+1][l+1], mul * nums[r] + dp[i+1][l])
        return dp[0][0]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maximumScore(_d["nums"], _d["multipliers"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[1,2,3],"multipliers":[3,2,1]}', expected: "14" },
      { id: "tc2", label: "Larger", input: '{"nums":[-5,-3,-3,-2,7,1],"multipliers":[-10,-5,3,4,6]}', expected: "102" },
    ],
  },

  // ─── Greedy ──────────────────────────────────────────────────────────────────

  "lemonade-change": {
    problemId: "lemonade-change",
    pythonStarter: `from typing import List

class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        five = ten = 0
        for b in bills:
            if b == 5: five += 1
            elif b == 10:
                if not five: return False
                five -= 1; ten += 1
            else:
                if ten and five: ten -= 1; five -= 1
                elif five >= 3: five -= 3
                else: return False
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().lemonadeChange(_d["bills"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"bills":[5,5,5,10,20]}', expected: "true" },
      { id: "tc2", label: "No", input: '{"bills":[5,5,10,10,20]}', expected: "false" },
    ],
  },

  "best-time-stock-ii": {
    problemId: "best-time-stock-ii",
    pythonStarter: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        return sum(max(prices[i] - prices[i-1], 0) for i in range(1, len(prices)))
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxProfit(_d["prices"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Multiple txns", input: '{"prices":[7,1,5,3,6,4]}', expected: "7" },
      { id: "tc2", label: "Increasing", input: '{"prices":[1,2,3,4,5]}', expected: "4" },
      { id: "tc3", label: "Decreasing", input: '{"prices":[7,6,4,3,1]}', expected: "0" },
    ],
  },

  "jump-game-ii": {
    problemId: "jump-game-ii",
    pythonStarter: `from typing import List

class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = farthest = cur_end = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == cur_end:
                jumps += 1; cur_end = farthest
        return jumps
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().jump(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[2,3,1,1,4]}', expected: "2" },
      { id: "tc2", label: "Alternate", input: '{"nums":[2,3,0,1,4]}', expected: "2" },
      { id: "tc3", label: "Single", input: '{"nums":[1]}', expected: "0" },
    ],
  },

  "gas-station": {
    problemId: "gas-station",
    pythonStarter: `from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost): return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0: tank = 0; start = i + 1
        return start
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canCompleteCircuit(_d["gas"], _d["cost"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Station 3", input: '{"gas":[1,2,3,4,5],"cost":[3,4,5,1,2]}', expected: "3" },
      { id: "tc2", label: "No solution", input: '{"gas":[2,3,4],"cost":[3,4,3]}', expected: "-1" },
    ],
  },

  "hand-of-straights": {
    problemId: "hand-of-straights",
    pythonStarter: `from typing import List
from collections import Counter

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize: return False
        cnt = Counter(hand)
        for k in sorted(cnt):
            if cnt[k] > 0:
                n = cnt[k]
                for i in range(groupSize):
                    if cnt[k+i] < n: return False
                    cnt[k+i] -= n
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isNStraightHand(_d["hand"], _d["groupSize"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"hand":[1,2,3,6,2,3,4,7,8],"groupSize":3}', expected: "true" },
      { id: "tc2", label: "No", input: '{"hand":[1,2,3,4,5],"groupSize":4}', expected: "false" },
    ],
  },

  "merge-triplets": {
    problemId: "merge-triplets",
    pythonStarter: `from typing import List

class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        res = [0, 0, 0]
        for t in triplets:
            if t[0] <= target[0] and t[1] <= target[1] and t[2] <= target[2]:
                res = [max(res[i], t[i]) for i in range(3)]
        return res == target
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().mergeTriplets(_d["triplets"], _d["target"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Yes", input: '{"triplets":[[2,5,3],[1,8,4],[1,7,5]],"target":[2,7,5]}', expected: "true" },
      { id: "tc2", label: "No", input: '{"triplets":[[3,4,5],[4,5,6]],"target":[3,2,5]}', expected: "false" },
    ],
  },

  "partition-labels": {
    problemId: "partition-labels",
    pythonStarter: `from typing import List

class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {c: i for i, c in enumerate(s)}
        res = []; start = end = 0
        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end: res.append(end - start + 1); start = end + 1
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().partitionLabels(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"s":"ababcbacadefegdehijhklij"}', expected: "[9, 7, 8]" },
      { id: "tc2", label: "Single chars", input: '{"s":"eccbbbbdec"}', expected: "[10]" },
    ],
  },

  "valid-parenthesis-string": {
    problemId: "valid-parenthesis-string",
    pythonStarter: `class Solution:
    def checkValidString(self, s: str) -> bool:
        lo = hi = 0
        for c in s:
            if c == "(": lo += 1; hi += 1
            elif c == ")": lo -= 1; hi -= 1
            else: lo -= 1; hi += 1
            if hi < 0: return False
            lo = max(lo, 0)
        return lo == 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().checkValidString(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Valid", input: '{"s":"()"}', expected: "true" },
      { id: "tc2", label: "Star fills in", input: '{"s":"(*)"}', expected: "true" },
      { id: "tc3", label: "Complex", input: '{"s":"(*))"}', expected: "true" },
      { id: "tc4", label: "Invalid", input: '{"s":"((("}', expected: "false", hidden: true },
    ],
  },


  // ─── Intervals (continued) ───────────────────────────────────────────────────

  "meeting-rooms": {
    problemId: "meeting-rooms",
    pythonStarter: `from typing import List

class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        intervals.sort()
        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i-1][1]: return False
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().canAttendMeetings(_d["intervals"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Conflict", input: '{"intervals":[[0,30],[5,10],[15,20]]}', expected: "false" },
      { id: "tc2", label: "No conflict", input: '{"intervals":[[7,10],[2,4]]}', expected: "true" },
      { id: "tc3", label: "Empty", input: '{"intervals":[]}', expected: "true" },
    ],
  },

  "non-overlapping-intervals": {
    problemId: "non-overlapping-intervals",
    pythonStarter: `from typing import List

class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        count = 0; end = float("-inf")
        for s, e in intervals:
            if s >= end: end = e
            else: count += 1
        return count
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().eraseOverlapIntervals(_d["intervals"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "1 removal", input: '{"intervals":[[1,2],[2,3],[3,4],[1,3]]}', expected: "1" },
      { id: "tc2", label: "2 removals", input: '{"intervals":[[1,2],[1,2],[1,2]]}', expected: "2" },
      { id: "tc3", label: "No removal", input: '{"intervals":[[1,2],[2,3]]}', expected: "0" },
    ],
  },

  "meeting-rooms-ii": {
    problemId: "meeting-rooms-ii",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals: return 0
        intervals.sort()
        heap = []
        for s, e in intervals:
            if heap and heap[0] <= s: heapq.heapreplace(heap, e)
            else: heapq.heappush(heap, e)
        return len(heap)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minMeetingRooms(_d["intervals"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "2 rooms", input: '{"intervals":[[0,30],[5,10],[15,20]]}', expected: "2" },
      { id: "tc2", label: "1 room", input: '{"intervals":[[7,10],[2,4]]}', expected: "1" },
      { id: "tc3", label: "3 rooms", input: '{"intervals":[[1,4],[2,5],[3,6]]}', expected: "3" },
    ],
  },

  "min-interval-query": {
    problemId: "min-interval-query",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort(); heap = []
        res = {}
        for q in sorted(queries):
            for l, r in intervals:
                if l <= q: heapq.heappush(heap, (r - l + 1, r))
                else: break
            while heap and heap[0][1] < q: heapq.heappop(heap)
            res[q] = heap[0][0] if heap else -1
        return [res[q] for q in queries]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minInterval(_d["intervals"], _d["queries"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"intervals":[[1,4],[2,4],[3,6],[4,4]],"queries":[2,3,4,5]}', expected: "[3, 3, 1, 4]" },
      { id: "tc2", label: "No match", input: '{"intervals":[[2,3],[2,5],[1,8],[20,25]],"queries":[2,19,5,22]}', expected: "[2, -1, 4, 6]" },
    ],
  },

  // ─── Math & Geometry ─────────────────────────────────────────────────────────

  "roman-to-integer": {
    problemId: "roman-to-integer",
    pythonStarter: `class Solution:
    def romanToInt(self, s: str) -> int:
        vals = {"I":1,"V":5,"X":10,"L":50,"C":100,"D":500,"M":1000}
        res = 0
        for i in range(len(s)):
            if i+1 < len(s) and vals[s[i]] < vals[s[i+1]]: res -= vals[s[i]]
            else: res += vals[s[i]]
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().romanToInt(_d["s"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "III", input: '{"s":"III"}', expected: "3" },
      { id: "tc2", label: "LVIII", input: '{"s":"LVIII"}', expected: "58" },
      { id: "tc3", label: "MCMXCIV", input: '{"s":"MCMXCIV"}', expected: "1994" },
    ],
  },

  "happy-number": {
    problemId: "happy-number",
    pythonStarter: `class Solution:
    def isHappy(self, n: int) -> bool:
        seen = set()
        while n != 1:
            if n in seen: return False
            seen.add(n)
            n = sum(int(d)**2 for d in str(n))
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isHappy(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Happy 19", input: '{"n":19}', expected: "true" },
      { id: "tc2", label: "Not happy 2", input: '{"n":2}', expected: "false" },
      { id: "tc3", label: "Happy 1", input: '{"n":1}', expected: "true" },
    ],
  },

  "plus-one": {
    problemId: "plus-one",
    pythonStarter: `from typing import List

class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        for i in range(len(digits)-1, -1, -1):
            if digits[i] < 9: digits[i] += 1; return digits
            digits[i] = 0
        return [1] + digits
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().plusOne(_d["digits"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"digits":[1,2,3]}', expected: "[1, 2, 4]" },
      { id: "tc2", label: "Carry all", input: '{"digits":[9,9,9]}', expected: "[1, 0, 0, 0]" },
      { id: "tc3", label: "Single 9", input: '{"digits":[9]}', expected: "[1, 0]" },
    ],
  },

  "rotate-image": {
    problemId: "rotate-image",
    pythonStarter: `from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for i in range(n):
            for j in range(i+1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        for row in matrix: row.reverse()
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
m = [row[:] for row in _d["matrix"]]
Solution().rotate(m)
print(_j.dumps(m))`,
    testCases: [
      { id: "tc1", label: "3x3", input: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}', expected: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]" },
      { id: "tc2", label: "4x4", input: '{"matrix":[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]}', expected: "[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]" },
    ],
  },

  "spiral-matrix": {
    problemId: "spiral-matrix",
    pythonStarter: `from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []; t, b, l, r = 0, len(matrix)-1, 0, len(matrix[0])-1
        while t <= b and l <= r:
            for c in range(l, r+1): res.append(matrix[t][c]); t += 1
            for rw in range(t, b+1): res.append(matrix[rw][r]); r -= 1
            if t <= b:
                for c in range(r, l-1, -1): res.append(matrix[b][c]); b -= 1
            if l <= r:
                for rw in range(b, t-1, -1): res.append(matrix[rw][l]); l += 1
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().spiralOrder(_d["matrix"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "3x3", input: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}', expected: "[1, 2, 3, 6, 9, 8, 7, 4, 5]" },
      { id: "tc2", label: "3x4", input: '{"matrix":[[1,2,3,4],[5,6,7,8],[9,10,11,12]]}', expected: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]" },
    ],
  },

  "set-matrix-zeroes": {
    problemId: "set-matrix-zeroes",
    pythonStarter: `from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows, cols = set(), set()
        for r in range(len(matrix)):
            for c in range(len(matrix[0])):
                if matrix[r][c] == 0: rows.add(r); cols.add(c)
        for r in range(len(matrix)):
            for c in range(len(matrix[0])):
                if r in rows or c in cols: matrix[r][c] = 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
m = [row[:] for row in _d["matrix"]]
Solution().setZeroes(m)
print(_j.dumps(m))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"matrix":[[1,1,1],[1,0,1],[1,1,1]]}', expected: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]" },
      { id: "tc2", label: "Two zeros", input: '{"matrix":[[0,1,2,0],[3,4,5,2],[1,3,1,5]]}', expected: "[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]" },
    ],
  },

  "pow-x-n": {
    problemId: "pow-x-n",
    pythonStarter: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0: x = 1/x; n = -n
        res = 1.0
        while n:
            if n % 2: res *= x
            x *= x; n //= 2
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = round(Solution().myPow(_d["x"], _d["n"]), 5)
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "2^10", input: '{"x":2.0,"n":10}', expected: "1024.0" },
      { id: "tc2", label: "2.1^3", input: '{"x":2.10000,"n":3}', expected: "9.26100" },
      { id: "tc3", label: "Negative n", input: '{"x":2.0,"n":-2}', expected: "0.25" },
    ],
  },

  "multiply-strings": {
    problemId: "multiply-strings",
    pythonStarter: `class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if "0" in (num1, num2): return "0"
        res = [0] * (len(num1) + len(num2))
        for i in range(len(num1)-1, -1, -1):
            for j in range(len(num2)-1, -1, -1):
                p = int(num1[i]) * int(num2[j])
                res[i+j+1] += p
                res[i+j] += res[i+j+1] // 10
                res[i+j+1] %= 10
        return "".join(map(str, res)).lstrip("0") or "0"
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().multiply(_d["num1"], _d["num2"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "2×3", input: '{"num1":"2","num2":"3"}', expected: '"6"' },
      { id: "tc2", label: "123×456", input: '{"num1":"123","num2":"456"}', expected: '"56088"' },
    ],
  },

  "count-primes": {
    problemId: "count-primes",
    pythonStarter: `class Solution:
    def countPrimes(self, n: int) -> int:
        if n < 2: return 0
        sieve = [True] * n; sieve[0] = sieve[1] = False
        for i in range(2, int(n**0.5)+1):
            if sieve[i]:
                for j in range(i*i, n, i): sieve[j] = False
        return sum(sieve)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().countPrimes(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=10", input: '{"n":10}', expected: "4" },
      { id: "tc2", label: "n=0", input: '{"n":0}', expected: "0" },
      { id: "tc3", label: "n=1", input: '{"n":1}', expected: "0" },
      { id: "tc4", label: "n=20", input: '{"n":20}', expected: "8", hidden: true },
    ],
  },

  "detect-squares": {
    problemId: "detect-squares",
    pythonStarter: `from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.pts = defaultdict(int)
        self.xs = defaultdict(set)

    def add(self, point) -> None:
        self.pts[tuple(point)] += 1
        self.xs[point[0]].add(point[1])

    def count(self, point) -> int:
        px, py = point; res = 0
        for y in self.xs[px]:
            d = abs(py - y)
            if d == 0: continue
            for dx in [px + d, px - d]:
                res += self.pts[(dx, py)] * self.pts[(dx, y)] * self.pts[(px, y)]
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = DetectSquares(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "add": obj.add(args[0])
    elif op == "count": results.append(obj.count(args[0]))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"ops":["add","add","add","count","count","add","count"],"args":[[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]],[[11,2]],[[11,10]]]}', expected: "[1, 0, 2]" },
    ],
  },

  // ─── Bit Manipulation ────────────────────────────────────────────────────────

  "single-number": {
    problemId: "single-number",
    pythonStarter: `from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0
        for n in nums: res ^= n
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().singleNumber(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"nums":[2,2,1]}', expected: "1" },
      { id: "tc2", label: "Larger", input: '{"nums":[4,1,2,1,2]}', expected: "4" },
      { id: "tc3", label: "Single element", input: '{"nums":[1]}', expected: "1" },
    ],
  },

  "number-1-bits": {
    problemId: "number-1-bits",
    pythonStarter: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            count += n & 1
            n >>= 1
        return count
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().hammingWeight(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "11 (3 ones)", input: '{"n":11}', expected: "3" },
      { id: "tc2", label: "128 (1 one)", input: '{"n":128}', expected: "1" },
      { id: "tc3", label: "2147483645", input: '{"n":2147483645}', expected: "30" },
    ],
  },

  "counting-bits": {
    problemId: "counting-bits",
    pythonStarter: `from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1): dp[i] = dp[i >> 1] + (i & 1)
        return dp
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().countBits(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=2", input: '{"n":2}', expected: "[0, 1, 1]" },
      { id: "tc2", label: "n=5", input: '{"n":5}', expected: "[0, 1, 1, 2, 1, 2]" },
    ],
  },

  "reverse-bits": {
    problemId: "reverse-bits",
    pythonStarter: `class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().reverseBits(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "43261596", input: '{"n":43261596}', expected: "964176192" },
      { id: "tc2", label: "4294967293", input: '{"n":4294967293}', expected: "3221225471" },
    ],
  },

  "missing-number": {
    problemId: "missing-number",
    pythonStarter: `from typing import List

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().missingNumber(_d["nums"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Missing 2", input: '{"nums":[3,0,1]}', expected: "2" },
      { id: "tc2", label: "Missing 2 (2)", input: '{"nums":[0,1]}', expected: "2" },
      { id: "tc3", label: "Missing 8", input: '{"nums":[9,6,4,2,3,5,7,0,1]}', expected: "8" },
    ],
  },

  "power-of-two": {
    problemId: "power-of-two",
    pythonStarter: `class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().isPowerOfTwo(_d["n"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "n=1", input: '{"n":1}', expected: "true" },
      { id: "tc2", label: "n=16", input: '{"n":16}', expected: "true" },
      { id: "tc3", label: "n=3", input: '{"n":3}', expected: "false" },
      { id: "tc4", label: "n=0", input: '{"n":0}', expected: "false", hidden: true },
    ],
  },

  "sum-two-integers": {
    problemId: "sum-two-integers",
    pythonStarter: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        while b & mask:
            carry = (a & b) << 1
            a = (a ^ b) & mask
            b = carry & mask
        return a if a < 0x80000000 else ~(a ^ mask)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().getSum(_d["a"], _d["b"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "1+2=3", input: '{"a":1,"b":2}', expected: "3" },
      { id: "tc2", label: "2+3=5", input: '{"a":2,"b":3}', expected: "5" },
      { id: "tc3", label: "Negative", input: '{"a":-1,"b":1}', expected: "0" },
    ],
  },

  "reverse-integer": {
    problemId: "reverse-integer",
    pythonStarter: `class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        rev = int(str(abs(x))[::-1]) * sign
        return rev if -2**31 <= rev <= 2**31 - 1 else 0
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().reverse(_d["x"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "123", input: '{"x":123}', expected: "321" },
      { id: "tc2", label: "-123", input: '{"x":-123}', expected: "-321" },
      { id: "tc3", label: "Overflow", input: '{"x":1534236469}', expected: "0" },
    ],
  },

  "bitwise-and-numbers-range": {
    problemId: "bitwise-and-numbers-range",
    pythonStarter: `class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left != right: left >>= 1; right >>= 1; shift += 1
        return left << shift
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().rangeBitwiseAnd(_d["left"], _d["right"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "5&7=4", input: '{"left":5,"right":7}', expected: "4" },
      { id: "tc2", label: "0&0=0", input: '{"left":0,"right":0}', expected: "0" },
      { id: "tc3", label: "1&2147483647=0", input: '{"left":1,"right":2147483647}', expected: "0" },
    ],
  },

  // ─── Tries ───────────────────────────────────────────────────────────────────

  "implement-trie": {
    problemId: "implement-trie",
    pythonStarter: `class Trie:
    def __init__(self):
        self.children = {}
        self.end = False

    def insert(self, word: str) -> None:
        node = self
        for c in word:
            if c not in node.children: node.children[c] = Trie()
            node = node.children[c]
        node.end = True

    def search(self, word: str) -> bool:
        node = self
        for c in word:
            if c not in node.children: return False
            node = node.children[c]
        return node.end

    def startsWith(self, prefix: str) -> bool:
        node = self
        for c in prefix:
            if c not in node.children: return False
            node = node.children[c]
        return True
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = Trie(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "insert": obj.insert(args[0])
    elif op == "search": results.append(obj.search(args[0]))
    elif op == "startsWith": results.append(obj.startsWith(args[0]))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"ops":["insert","search","search","startsWith","insert","search"],"args":[["apple"],["apple"],["app"],["app"],["app"],["app"]]}', expected: "[true, false, true, true]" },
    ],
  },

  "add-search-words": {
    problemId: "add-search-words",
    pythonStarter: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node: node[c] = {}
            node = node[c]
        node["#"] = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word): return "#" in node
            c = word[i]
            if c == ".": return any(dfs(node[k], i+1) for k in node if k != "#")
            if c not in node: return False
            return dfs(node[c], i+1)
        return dfs(self.root, 0)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
obj = WordDictionary(); results = []
for op, args in zip(_d["ops"], _d["args"]):
    if op == "addWord": obj.addWord(args[0])
    elif op == "search": results.append(obj.search(args[0]))
print(_j.dumps(results))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"ops":["addWord","addWord","search","search","search","search"],"args":[["bad"],["dad"],["pad"],["bad"],[".ad"],["b.."]]}', expected: "[false, true, true, true]" },
    ],
  },

  "replace-words": {
    problemId: "replace-words",
    pythonStarter: `from typing import List

class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        roots = set(dictionary)
        words = sentence.split()
        res = []
        for word in words:
            found = False
            for i in range(1, len(word)+1):
                if word[:i] in roots: res.append(word[:i]); found = True; break
            if not found: res.append(word)
        return " ".join(res)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().replaceWords(_d["dictionary"], _d["sentence"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"dictionary":["cat","bat","rat"],"sentence":"the cattle was rattled by the battery"}', expected: '"the cat was rat by the bat"' },
      { id: "tc2", label: "No match", input: '{"dictionary":["a","b","c"],"sentence":"aadsfasf absbs bbab cadsfafs"}', expected: '"a a b c"' },
    ],
  },

  "longest-word-dictionary": {
    problemId: "longest-word-dictionary",
    pythonStarter: `from typing import List

class Solution:
    def longestWord(self, words: List[str]) -> str:
        words.sort(); built = {""}; res = ""
        for w in words:
            if w[:-1] in built:
                built.add(w)
                if len(w) > len(res): res = w
        return res
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().longestWord(_d["words"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"words":["w","wo","wor","worl","world"]}', expected: '"world"' },
      { id: "tc2", label: "Multiple candidates", input: '{"words":["a","banana","app","appl","ap","apply","apple"]}', expected: '"apple"' },
    ],
  },

  "index-pairs-string": {
    problemId: "index-pairs-string",
    pythonStarter: `from typing import List

class Solution:
    def indexPairs(self, text: str, words: List[str]) -> List[List[int]]:
        res = []
        for w in words:
            start = 0
            while True:
                idx = text.find(w, start)
                if idx == -1: break
                res.append([idx, idx + len(w) - 1])
                start = idx + 1
        return sorted(res)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().indexPairs(_d["text"], _d["words"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"text":"thestoryofleetcodeandme","words":["story","fleet","leetcode"]}', expected: "[[3, 7], [10, 13], [10, 17]]" },
      { id: "tc2", label: "Overlapping", input: '{"text":"ababa","words":["aba","ab"]}', expected: "[[0, 1], [0, 2], [2, 3], [2, 4]]" },
    ],
  },

  "word-search-ii": {
    problemId: "word-search-ii",
    pythonStarter: `from typing import List

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for w in words:
            node = root
            for c in w: node = node.setdefault(c, {})
            node["$"] = w
        rows, cols = len(board), len(board[0])
        res = set()
        def dfs(r, c, node):
            ch = board[r][c]
            if ch not in node: return
            nxt = node[ch]
            if "$" in nxt: res.add(nxt["$"])
            board[r][c] = "#"
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols: dfs(nr, nc, nxt)
            board[r][c] = ch
        for r in range(rows):
            for c in range(cols): dfs(r, c, root)
        return sorted(res)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = sorted(Solution().findWords([row[:] for row in _d["board"]], _d["words"]))
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"board":[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],"words":["oath","pea","eat","rain"]}', expected: '["eat", "oath"]' },
      { id: "tc2", label: "Not found", input: '{"board":[["a","b"],["c","d"]],"words":["abcb"]}', expected: "[]" },
    ],
  },

  // ─── Advanced Graphs ─────────────────────────────────────────────────────────

  "network-delay-time": {
    problemId: "network-delay-time",
    pythonStarter: `from typing import List
import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in times: graph[u].append((w, v))
        dist = {k: 0}; heap = [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if d > dist.get(u, float("inf")): continue
            for w, v in graph[u]:
                nd = d + w
                if nd < dist.get(v, float("inf")):
                    dist[v] = nd; heapq.heappush(heap, (nd, v))
        return max(dist.values()) if len(dist) == n else -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().networkDelayTime(_d["times"], _d["n"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"times":[[2,1,1],[2,3,1],[3,4,1]],"n":4,"k":2}', expected: "2" },
      { id: "tc2", label: "Unreachable", input: '{"times":[[1,2,1]],"n":2,"k":2}', expected: "-1" },
    ],
  },

  "min-cost-connect-points": {
    problemId: "min-cost-connect-points",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        visited = set(); heap = [(0, 0)]; cost = 0; edges = 0
        while edges < n:
            c, i = heapq.heappop(heap)
            if i in visited: continue
            visited.add(i); cost += c; edges += 1
            for j in range(n):
                if j not in visited:
                    d = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1])
                    heapq.heappush(heap, (d, j))
        return cost
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().minCostConnectPoints(_d["points"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"points":[[0,0],[2,2],[3,10],[5,2],[7,0]]}', expected: "20" },
      { id: "tc2", label: "Single", input: '{"points":[[3,12],[-2,5],[-4,1]]}', expected: "18" },
    ],
  },

  "cheapest-flights": {
    problemId: "cheapest-flights",
    pythonStarter: `from typing import List

class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        prices = [float("inf")] * n
        prices[src] = 0
        for _ in range(k + 1):
            tmp = prices[:]
            for u, v, w in flights:
                if prices[u] + w < tmp[v]: tmp[v] = prices[u] + w
            prices = tmp
        return prices[dst] if prices[dst] != float("inf") else -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findCheapestPrice(_d["n"], _d["flights"], _d["src"], _d["dst"], _d["k"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"n":4,"flights":[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],"src":0,"dst":3,"k":1}', expected: "700" },
      { id: "tc2", label: "No path", input: '{"n":3,"flights":[[0,1,100],[1,2,100],[0,2,500]],"src":0,"dst":2,"k":0}', expected: "500" },
    ],
  },

  "path-max-probability": {
    problemId: "path-max-probability",
    pythonStarter: `from typing import List
import heapq
from collections import defaultdict

class Solution:
    def maxProbability(self, n: int, edges: List[List[int]], succProb: List[float], start: int, end: int) -> float:
        graph = defaultdict(list)
        for i, (u, v) in enumerate(edges):
            graph[u].append((succProb[i], v))
            graph[v].append((succProb[i], u))
        prob = [0.0] * n; prob[start] = 1.0
        heap = [(-1.0, start)]
        while heap:
            p, u = heapq.heappop(heap)
            p = -p
            if p < prob[u]: continue
            for w, v in graph[u]:
                np = p * w
                if np > prob[v]: prob[v] = np; heapq.heappush(heap, (-np, v))
        return round(prob[end], 5)
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().maxProbability(_d["n"], _d["edges"], _d["succProb"], _d["start"], _d["end"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"n":3,"edges":[[0,1],[1,2],[0,2]],"succProb":[0.5,0.5,0.2],"start":0,"end":2}', expected: "0.25" },
      { id: "tc2", label: "Direct path", input: '{"n":3,"edges":[[0,1],[1,2],[0,2]],"succProb":[0.5,0.5,0.3],"start":0,"end":2}', expected: "0.3" },
    ],
  },

  "evaluate-division": {
    problemId: "evaluate-division",
    pythonStarter: `from typing import List
from collections import defaultdict, deque

class Solution:
    def calcEquation(self, equations: List[List[str]], values: List[float], queries: List[List[str]]) -> List[float]:
        graph = defaultdict(dict)
        for (a, b), v in zip(equations, values):
            graph[a][b] = v; graph[b][a] = 1/v
        def bfs(src, dst):
            if src not in graph or dst not in graph: return -1.0
            if src == dst: return 1.0
            q = deque([(src, 1.0)]); visited = {src}
            while q:
                node, prod = q.popleft()
                for nb, v in graph[node].items():
                    if nb == dst: return prod * v
                    if nb not in visited: visited.add(nb); q.append((nb, prod*v))
            return -1.0
        return [bfs(a, b) for a, b in queries]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = [round(x, 5) for x in Solution().calcEquation(_d["equations"], _d["values"], _d["queries"])]
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"equations":[["a","b"],["b","c"]],"values":[2.0,3.0],"queries":[["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]}', expected: "[6.0, 0.5, -1.0, 1.0, -1.0]" },
    ],
  },

  "reconstruct-itinerary": {
    problemId: "reconstruct-itinerary",
    pythonStarter: `from typing import List
from collections import defaultdict

class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        graph = defaultdict(list)
        for u, v in sorted(tickets, reverse=True): graph[u].append(v)
        res = []
        def dfs(node):
            while graph[node]: dfs(graph[node].pop())
            res.append(node)
        dfs("JFK")
        return res[::-1]
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().findItinerary(_d["tickets"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"tickets":[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]}', expected: '["JFK", "MUC", "LHR", "SFO", "SJC"]' },
      { id: "tc2", label: "Multiple routes", input: '{"tickets":[["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]}', expected: '["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]' },
    ],
  },

  "swim-rising-water": {
    problemId: "swim-rising-water",
    pythonStarter: `from typing import List
import heapq

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        visited = set([(0,0)]); heap = [(grid[0][0], 0, 0)]
        while heap:
            t, r, c = heapq.heappop(heap)
            if r == n-1 and c == n-1: return t
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<n and 0<=nc<n and (nr,nc) not in visited:
                    visited.add((nr,nc)); heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))
        return -1
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().swimInWater(_d["grid"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "2x2", input: '{"grid":[[0,2],[1,3]]}', expected: "3" },
      { id: "tc2", label: "5x5", input: '{"grid":[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]}', expected: "16" },
    ],
  },

  "alien-dictionary": {
    problemId: "alien-dictionary",
    pythonStarter: `from typing import List
from collections import defaultdict, deque

class Solution:
    def alienOrder(self, words: List[str]) -> str:
        adj = defaultdict(set)
        indeg = {c: 0 for w in words for c in w}
        for i in range(len(words)-1):
            w1, w2 = words[i], words[i+1]
            minLen = min(len(w1), len(w2))
            if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]: return ""
            for j in range(minLen):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:
                        adj[w1[j]].add(w2[j]); indeg[w2[j]] += 1
                    break
        q = deque([c for c in indeg if indeg[c] == 0]); res = ""
        while q:
            c = q.popleft(); res += c
            for nb in adj[c]:
                indeg[nb] -= 1
                if indeg[nb] == 0: q.append(nb)
        return res if len(res) == len(indeg) else ""
`,
    preamble: "",
    harnessTemplate: `
import json as _j
_d = _j.loads(r'''{INPUT}''')
_r = Solution().alienOrder(_d["words"])
print(_j.dumps(_r))`,
    testCases: [
      { id: "tc1", label: "Basic", input: '{"words":["wrt","wrf","er","ett","rftt"]}', expected: '"wertf"' },
      { id: "tc2", label: "Invalid", input: '{"words":["z","x","z"]}', expected: '""' },
      { id: "tc3", label: "Two chars", input: '{"words":["z","x"]}', expected: '"zx"' },
    ],
  },

};

// Utility: get runner for a problem id
export function getProblemRunner(id: string): ProblemRunner | null {
  return PROBLEM_RUNNERS[id] ?? null;
}

// Utility: build full Python code to run for one test case
export function buildTestCode(runner: ProblemRunner, userCode: string, testInput: string): string {
  const harness = runner.harnessTemplate.replace("{INPUT}", testInput);
  const parts = [runner.preamble, userCode, harness].filter(Boolean);
  return parts.join("\n\n");
}
