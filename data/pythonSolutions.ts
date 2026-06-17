// Python solutions for all problems
export const PYTHON_SOLUTIONS: Record<string, string> = {
  // ── Rich override problems ─────────────────────────────────────────────
  "two-sum": `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}  # val -> index
        for i, n in enumerate(nums):
            complement = target - n
            if complement in seen:
                return [seen[complement], i]
            seen[n] = i
        return []`,

  "contains-duplicate": `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        seen = set()
        for x in nums:
            if x in seen:
                return True
            seen.add(x)
        return False`,

  "valid-anagram": `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = [0] * 26
        for a, b in zip(s, t):
            count[ord(a) - ord('a')] += 1
            count[ord(b) - ord('a')] -= 1
        return all(c == 0 for c in count)`,

  "group-anagrams": `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups: dict[str, list[str]] = {}
        for s in strs:
            key = ''.join(sorted(s))
            groups.setdefault(key, []).append(s)
        return list(groups.values())`,

  "longest-substring": `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_seen: dict[str, int] = {}
        result = left = 0
        for right, c in enumerate(s):
            if c in last_seen and last_seen[c] >= left:
                left = last_seen[c] + 1
            last_seen[c] = right
            result = max(result, right - left + 1)
        return result`,

  "best-time-stock": `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,

  "valid-parentheses": `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        match = {')': '(', ']': '[', '}': '{'}
        for c in s:
            if c in '([{':
                stack.append(c)
            else:
                if not stack or stack[-1] != match[c]:
                    return False
                stack.pop()
        return not stack`,

  "binary-search": `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,

  "reverse-linked-list": `class Solution:
    def reverseList(self, head):
        prev, curr = None, head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,

  "climbing-stairs": `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev2, prev1 = 1, 2
        for _ in range(3, n + 1):
            prev2, prev1 = prev1, prev1 + prev2
        return prev1`,

  "house-robber": `class Solution:
    def rob(self, nums: list[int]) -> int:
        prev2 = prev1 = 0
        for amount in nums:
            prev2, prev1 = prev1, max(prev2 + amount, prev1)
        return prev1`,

  "number-of-islands": `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        def dfs(i, j):
            if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
                return
            grid[i][j] = '0'
            dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)

        count = 0
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        return count`,

  "coin-change": `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] <= amount else -1`,

  "invert-binary-tree": `class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,

  "max-subarray": `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        curr = best = nums[0]
        for n in nums[1:]:
            curr = max(n, curr + n)
            best = max(best, curr)
        return best`,

  "single-number": `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0
        for n in nums:
            result ^= n
        return result`,

  "linked-list-cycle": `class Solution:
    def hasCycle(self, head) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False`,

  "implement-trie": `class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for c in word:
            if c not in curr.children:
                return False
            curr = curr.children[c]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for c in prefix:
            if c not in curr.children:
                return False
            curr = curr.children[c]
        return True`,

  "subsets": `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = [[]]
        for num in nums:
            result += [subset + [num] for subset in result]
        return result`,

  "max-area-island": `class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        def dfs(i, j):
            if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != 1:
                return 0
            grid[i][j] = 0
            return 1 + dfs(i+1,j) + dfs(i-1,j) + dfs(i,j+1) + dfs(i,j-1)

        return max(dfs(i, j) for i in range(len(grid)) for j in range(len(grid[0])))`,

  // ── Generated file problems ────────────────────────────────────────────
  "add-two-numbers": `class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = ListNode(0)
        cur, carry = dummy, 0
        while l1 or l2 or carry:
            s = carry
            if l1: s += l1.val; l1 = l1.next
            if l2: s += l2.val; l2 = l2.next
            carry, s = divmod(s, 10)
            cur.next = ListNode(s)
            cur = cur.next
        return dummy.next`,

  "asteroid-collision": `class Solution:
    def asteroidCollision(self, asteroids: list[int]) -> list[int]:
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()
                elif stack[-1] == -a:
                    stack.pop(); alive = False
                else:
                    alive = False
            if alive:
                stack.append(a)
        return stack`,

  "average-of-levels": `class Solution:
    def averageOfLevels(self, root) -> list[float]:
        if not root: return []
        from collections import deque
        result, q = [], deque([root])
        while q:
            level_sum, level_len = 0, len(q)
            for _ in range(level_len):
                node = q.popleft()
                level_sum += node.val
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            result.append(level_sum / level_len)
        return result`,

  "balanced-tree": `class Solution:
    def isBalanced(self, root) -> bool:
        def height(node):
            if not node: return 0
            l, r = height(node.left), height(node.right)
            if l == -1 or r == -1 or abs(l - r) > 1: return -1
            return 1 + max(l, r)
        return height(root) != -1`,

  "binary-tree-paths": `class Solution:
    def binaryTreePaths(self, root) -> list[str]:
        if not root: return []
        if not root.left and not root.right:
            return [str(root.val)]
        return [str(root.val) + '->' + path
                for child in [root.left, root.right] if child
                for path in self.binaryTreePaths(child)]`,

  "car-fleet": `class Solution:
    def carFleet(self, target: int, position: list[int], speed: list[int]) -> int:
        pairs = sorted(zip(position, speed), reverse=True)
        stack = []
        for pos, spd in pairs:
            time = (target - pos) / spd
            if not stack or time > stack[-1]:
                stack.append(time)
        return len(stack)`,

  "clone-graph": `class Solution:
    def cloneGraph(self, node):
        if not node: return None
        clones = {}
        def dfs(n):
            if n in clones: return clones[n]
            clone = Node(n.val)
            clones[n] = clone
            clone.neighbors = [dfs(nb) for nb in n.neighbors]
            return clone
        return dfs(node)`,

  "combination-sum": `class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        def bt(start, path, rem):
            if rem == 0: result.append(path[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] <= rem:
                    path.append(candidates[i])
                    bt(i, path, rem - candidates[i])
                    path.pop()
        bt(0, [], target)
        return result`,

  "combination-sum-ii": `class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        result = []
        def bt(start, path, rem):
            if rem == 0: result.append(path[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] > rem: break
                if i > start and candidates[i] == candidates[i-1]: continue
                path.append(candidates[i])
                bt(i+1, path, rem - candidates[i])
                path.pop()
        bt(0, [], target)
        return result`,

  "combination-sum-iii": `class Solution:
    def combinationSum3(self, k: int, n: int) -> list[list[int]]:
        result = []
        def bt(start, path, rem):
            if len(path) == k and rem == 0: result.append(path[:]); return
            if len(path) == k or rem <= 0: return
            for i in range(start, 10):
                path.append(i)
                bt(i+1, path, rem - i)
                path.pop()
        bt(1, [], n)
        return result`,

  "construct-tree-preorder": `class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]):
        if not preorder: return None
        root = TreeNode(preorder[0])
        mid = inorder.index(preorder[0])
        root.left = self.buildTree(preorder[1:mid+1], inorder[:mid])
        root.right = self.buildTree(preorder[mid+1:], inorder[mid+1:])
        return root`,

  "container-water": `class Solution:
    def maxArea(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        result = 0
        while left < right:
            result = max(result, min(height[left], height[right]) * (right - left))
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return result`,

  "copy-list-random": `class Solution:
    def copyRandomList(self, head):
        old_to_new = {None: None}
        cur = head
        while cur:
            old_to_new[cur] = Node(cur.val)
            cur = cur.next
        cur = head
        while cur:
            old_to_new[cur].next = old_to_new[cur.next]
            old_to_new[cur].random = old_to_new[cur.random]
            cur = cur.next
        return old_to_new[head]`,

  "count-good-nodes": `class Solution:
    def goodNodes(self, root) -> int:
        def dfs(node, max_so_far):
            if not node: return 0
            good = 1 if node.val >= max_so_far else 0
            new_max = max(max_so_far, node.val)
            return good + dfs(node.left, new_max) + dfs(node.right, new_max)
        return dfs(root, float('-inf'))`,

  "daily-temperatures": `class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        result = [0] * len(temperatures)
        stack = []  # indices
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                result[j] = i - j
            stack.append(i)
        return result`,

  "decode-string": `class Solution:
    def decodeString(self, s: str) -> str:
        stack, cur_str, cur_num = [], '', 0
        for c in s:
            if c.isdigit():
                cur_num = cur_num * 10 + int(c)
            elif c == '[':
                stack.append((cur_str, cur_num))
                cur_str, cur_num = '', 0
            elif c == ']':
                prev_str, num = stack.pop()
                cur_str = prev_str + cur_str * num
            else:
                cur_str += c
        return cur_str`,

  "design-twitter": `class Twitter:
    def __init__(self):
        import heapq
        self.time = 0
        self.tweets: dict[int, list] = {}  # userId -> [(time, tweetId)]
        self.following: dict[int, set] = {}

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.setdefault(userId, []).append((self.time, tweetId))
        self.time -= 1

    def getNewsFeed(self, userId: int) -> list[int]:
        import heapq
        heap = []
        users = self.following.get(userId, set()) | {userId}
        for u in users:
            for tweet in self.tweets.get(u, [])[-10:]:
                heap.append(tweet)
        return [t for _, t in heapq.nsmallest(10, heap)]

    def follow(self, followerId: int, followeeId: int) -> None:
        self.following.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following.get(followerId, set()).discard(followeeId)`,

  "diameter-tree": `class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        self.ans = 0
        def depth(node):
            if not node: return 0
            l, r = depth(node.left), depth(node.right)
            self.ans = max(self.ans, l + r)
            return 1 + max(l, r)
        depth(root)
        return self.ans`,

  "encode-decode-strings": `class Codec:
    def encode(self, strs: list[str]) -> str:
        return ''.join(f'{len(s)}#{s}' for s in strs)

    def decode(self, s: str) -> list[str]:
        result, i = [], 0
        while i < len(s):
            j = s.index('#', i)
            length = int(s[i:j])
            result.append(s[j+1:j+1+length])
            i = j + 1 + length
        return result`,

  "find-duplicate-number": `class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = fast = nums[0]
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow`,

  "find-median-stream": `class MedianFinder:
    def __init__(self):
        import heapq
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num: int) -> None:
        import heapq
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,

  "find-min-rotated": `class Solution:
    def findMin(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]`,

  "first-bad-version": `class Solution:
    def firstBadVersion(self, n: int) -> int:
        left, right = 1, n
        while left < right:
            mid = (left + right) // 2
            if isBadVersion(mid):
                right = mid
            else:
                left = mid + 1
        return left`,

  "generate-parentheses": `class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        result = []
        def bt(s, open_cnt, close_cnt):
            if len(s) == 2 * n:
                result.append(s); return
            if open_cnt < n:
                bt(s + '(', open_cnt + 1, close_cnt)
            if close_cnt < open_cnt:
                bt(s + ')', open_cnt, close_cnt + 1)
        bt('', 0, 0)
        return result`,

  "is-subsequence": `class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for c in t:
            if i < len(s) and c == s[i]:
                i += 1
        return i == len(s)`,

  "isomorphic-strings": `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        return len(set(zip(s, t))) == len(set(s)) == len(set(t))`,

  "k-closest-points": `class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        import heapq
        return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)`,

  "koko-bananas": `class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        import math
        left, right = 1, max(piles)
        while left < right:
            mid = (left + right) // 2
            if sum(math.ceil(p / mid) for p in piles) <= h:
                right = mid
            else:
                left = mid + 1
        return left`,

  "kth-largest-array": `class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        import heapq
        return heapq.nlargest(k, nums)[-1]`,

  "kth-largest-stream": `class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        import heapq
        self.k = k
        self.heap = heapq.nlargest(k, nums)
        heapq.heapify(self.heap)

    def add(self, val: int) -> int:
        import heapq
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,

  "kth-smallest-bst": `class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack, n = [], root
        while stack or n:
            while n:
                stack.append(n); n = n.left
            n = stack.pop()
            k -= 1
            if k == 0: return n.val
            n = n.right`,

  "largest-rectangle-histogram": `class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack, result = [], 0
        for i, h in enumerate(heights + [0]):
            start = i
            while stack and stack[-1][1] > h:
                idx, ht = stack.pop()
                result = max(result, ht * (i - idx))
                start = idx
            stack.append((start, h))
        return result`,

  "last-stone-weight": `class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        import heapq
        heap = [-s for s in stones]
        heapq.heapify(heap)
        while len(heap) > 1:
            a, b = -heapq.heappop(heap), -heapq.heappop(heap)
            if a != b:
                heapq.heappush(heap, -(a - b))
        return -heap[0] if heap else 0`,

  "letter-combinations": `class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits: return []
        phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
                 '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
        result = []
        def bt(i, path):
            if i == len(digits): result.append(path); return
            for c in phone[digits[i]]:
                bt(i+1, path+c)
        bt(0, '')
        return result`,

  "level-order-traversal": `class Solution:
    def levelOrder(self, root) -> list[list[int]]:
        if not root: return []
        from collections import deque
        result, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            result.append(level)
        return result`,

  "longest-consecutive": `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        best = 0
        for n in num_set:
            if n - 1 not in num_set:
                length = 1
                while n + length in num_set:
                    length += 1
                best = max(best, length)
        return best`,

  "longest-repeating-replacement": `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count: dict[str, int] = {}
        result = left = max_count = 0
        for right, c in enumerate(s):
            count[c] = count.get(c, 0) + 1
            max_count = max(max_count, count[c])
            while (right - left + 1) - max_count > k:
                count[s[left]] -= 1
                left += 1
            result = max(result, right - left + 1)
        return result`,

  "lowest-common-ancestor": `class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root == p or root == q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        return root if left and right else left or right`,

  "lru-cache": `class LRUCache:
    def __init__(self, capacity: int):
        from collections import OrderedDict
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,

  "max-depth-tree": `class Solution:
    def maxDepth(self, root) -> int:
        if not root: return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,

  "max-path-sum": `class Solution:
    def maxPathSum(self, root) -> int:
        self.ans = float('-inf')
        def gain(node):
            if not node: return 0
            l = max(gain(node.left), 0)
            r = max(gain(node.right), 0)
            self.ans = max(self.ans, node.val + l + r)
            return node.val + max(l, r)
        gain(root)
        return self.ans`,

  "max-points-cards": `class Solution:
    def maxScore(self, cardPoints: list[int], k: int) -> int:
        total = sum(cardPoints[:k])
        result = total
        for i in range(1, k + 1):
            total += cardPoints[-i] - cardPoints[k - i]
            result = max(result, total)
        return result`,

  "median-two-sorted": `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        A, B = nums1, nums2
        if len(A) > len(B): A, B = B, A
        m, n = len(A), len(B)
        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = (m + n + 1) // 2 - i
            A_left = A[i-1] if i > 0 else float('-inf')
            A_right = A[i] if i < m else float('inf')
            B_left = B[j-1] if j > 0 else float('-inf')
            B_right = B[j] if j < n else float('inf')
            if A_left <= B_right and B_left <= A_right:
                if (m + n) % 2:
                    return float(max(A_left, B_left))
                return (max(A_left, B_left) + min(A_right, B_right)) / 2
            elif A_left > B_right:
                hi = i - 1
            else:
                lo = i + 1
        return 0.0`,

  "merge-k-sorted": `class Solution:
    def mergeKLists(self, lists):
        import heapq
        dummy = ListNode(0)
        cur = dummy
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        while heap:
            val, i, node = heapq.heappop(heap)
            cur.next = node
            cur = cur.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`,

  "merge-two-sorted": `class Solution:
    def mergeTwoLists(self, l1, l2):
        dummy = ListNode(0)
        cur = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                cur.next = l1; l1 = l1.next
            else:
                cur.next = l2; l2 = l2.next
            cur = cur.next
        cur.next = l1 or l2
        return dummy.next`,

  "min-depth-tree": `class Solution:
    def minDepth(self, root) -> int:
        if not root: return 0
        if not root.left and not root.right: return 1
        if not root.left: return 1 + self.minDepth(root.right)
        if not root.right: return 1 + self.minDepth(root.left)
        return 1 + min(self.minDepth(root.left), self.minDepth(root.right))`,

  "min-stack": `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        self.min_stack.append(min(val, self.min_stack[-1] if self.min_stack else val))

    def pop(self) -> None:
        self.stack.pop(); self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,

  "min-window-substring": `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        from collections import Counter
        need = Counter(t)
        have, required = 0, len(need)
        window: dict[str, int] = {}
        result, res_len = '', float('inf')
        left = 0
        for right, c in enumerate(s):
            window[c] = window.get(c, 0) + 1
            if c in need and window[c] == need[c]:
                have += 1
            while have == required:
                if right - left + 1 < res_len:
                    res_len = right - left + 1
                    result = s[left:right+1]
                window[s[left]] -= 1
                if s[left] in need and window[s[left]] < need[s[left]]:
                    have -= 1
                left += 1
        return result`,

  "move-zeroes": `class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        insert = 0
        for n in nums:
            if n != 0:
                nums[insert] = n; insert += 1
        for i in range(insert, len(nums)):
            nums[i] = 0`,

  "n-queens": `class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result = []
        cols, diag, anti = set(), set(), set()
        board = [['.' for _ in range(n)] for _ in range(n)]
        def bt(row):
            if row == n:
                result.append([''.join(r) for r in board]); return
            for col in range(n):
                if col in cols or row-col in diag or row+col in anti: continue
                cols.add(col); diag.add(row-col); anti.add(row+col)
                board[row][col] = 'Q'
                bt(row+1)
                board[row][col] = '.'
                cols.remove(col); diag.remove(row-col); anti.remove(row+col)
        bt(0)
        return result`,

  "pacific-atlantic": `class Solution:
    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:
        m, n = len(heights), len(heights[0])
        def bfs(starts):
            from collections import deque
            visited = set(starts)
            q = deque(starts)
            while q:
                r, c = q.popleft()
                for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                    nr, nc = r+dr, c+dc
                    if 0 <= nr < m and 0 <= nc < n and (nr,nc) not in visited and heights[nr][nc] >= heights[r][c]:
                        visited.add((nr,nc)); q.append((nr,nc))
            return visited
        pac = bfs([(r,0) for r in range(m)] + [(0,c) for c in range(n)])
        atl = bfs([(r,n-1) for r in range(m)] + [(m-1,c) for c in range(n)])
        return [[r,c] for r,c in pac & atl]`,

  "palindrome-linked-list": `class Solution:
    def isPalindrome(self, head) -> bool:
        vals = []
        while head:
            vals.append(head.val); head = head.next
        return vals == vals[::-1]`,

  "palindrome-partitioning": `class Solution:
    def partition(self, s: str) -> list[list[str]]:
        result = []
        def bt(start, path):
            if start == len(s): result.append(path[:]); return
            for end in range(start+1, len(s)+1):
                sub = s[start:end]
                if sub == sub[::-1]:
                    path.append(sub)
                    bt(end, path)
                    path.pop()
        bt(0, [])
        return result`,

  "path-sum": `class Solution:
    def hasPathSum(self, root, targetSum: int) -> bool:
        if not root: return False
        if not root.left and not root.right: return root.val == targetSum
        return self.hasPathSum(root.left, targetSum-root.val) or \
               self.hasPathSum(root.right, targetSum-root.val)`,

  "permutation-in-string": `class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        from collections import Counter
        if len(s1) > len(s2): return False
        need = Counter(s1)
        window = Counter(s2[:len(s1)])
        if window == need: return True
        for i in range(len(s1), len(s2)):
            window[s2[i]] += 1
            window[s2[i-len(s1)]] -= 1
            if window[s2[i-len(s1)]] == 0:
                del window[s2[i-len(s1)]]
            if window == need: return True
        return False`,

  "permutations": `class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        def bt(path, remaining):
            if not remaining: result.append(path[:]); return
            for i, n in enumerate(remaining):
                path.append(n)
                bt(path, remaining[:i] + remaining[i+1:])
                path.pop()
        bt([], nums)
        return result`,

  "product-except-self": `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        result = [1] * n
        prefix = 1
        for i in range(n):
            result[i] = prefix; prefix *= nums[i]
        suffix = 1
        for i in range(n-1, -1, -1):
            result[i] *= suffix; suffix *= nums[i]
        return result`,

  "ransom-note": `class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        from collections import Counter
        mag = Counter(magazine)
        for c in ransomNote:
            if mag[c] <= 0: return False
            mag[c] -= 1
        return True`,

  "remove-nth-node": `class Solution:
    def removeNthFromEnd(self, head, n: int):
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            slow = slow.next; fast = fast.next
        slow.next = slow.next.next
        return dummy.next`,

  "reorder-list": `class Solution:
    def reorderList(self, head) -> None:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next; fast = fast.next.next
        prev, curr = None, slow.next
        slow.next = None
        while curr:
            nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
        first, second = head, prev
        while second:
            tmp1, tmp2 = first.next, second.next
            first.next = second; second.next = tmp1
            first = tmp1; second = tmp2`,

  "reverse-k-group": `class Solution:
    def reverseKGroup(self, head, k: int):
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            kth = self.get_kth(group_prev, k)
            if not kth: break
            group_next = kth.next
            prev, curr = kth.next, group_prev.next
            while curr != group_next:
                nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
            tmp = group_prev.next
            group_prev.next = kth; group_prev = tmp
        return dummy.next

    def get_kth(self, curr, k):
        while curr and k > 0:
            curr = curr.next; k -= 1
        return curr`,

  "reverse-polish": `class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        ops = {'+': lambda a,b: a+b, '-': lambda a,b: a-b,
               '*': lambda a,b: a*b, '/': lambda a,b: int(a/b)}
        for t in tokens:
            if t in ops:
                b, a = stack.pop(), stack.pop()
                stack.append(ops[t](a, b))
            else:
                stack.append(int(t))
        return stack[0]`,

  "right-side-view": `class Solution:
    def rightSideView(self, root) -> list[int]:
        if not root: return []
        from collections import deque
        result, q = [], deque([root])
        while q:
            for _ in range(len(q) - 1):
                node = q.popleft()
                if node.left: q.append(node.left)
                if node.right: q.append(node.right)
            node = q.popleft()
            result.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        return result`,

  "rotting-oranges": `class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        from collections import deque
        m, n = len(grid), len(grid[0])
        q = deque()
        fresh = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2: q.append((i, j, 0))
                elif grid[i][j] == 1: fresh += 1
        minutes = 0
        while q:
            r, c, t = q.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2; fresh -= 1; minutes = t+1; q.append((nr,nc,t+1))
        return minutes if fresh == 0 else -1`,

  "same-tree": `class Solution:
    def isSameTree(self, p, q) -> bool:
        if not p and not q: return True
        if not p or not q or p.val != q.val: return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)`,

  "search-2d-matrix": `class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1
        while left <= right:
            mid = (left + right) // 2
            val = matrix[mid // n][mid % n]
            if val == target: return True
            elif val < target: left = mid + 1
            else: right = mid - 1
        return False`,

  "search-insert-position": `class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < target: left = mid + 1
            else: right = mid
        return left`,

  "search-rotated": `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target: return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]: right = mid - 1
                else: left = mid + 1
            else:
                if nums[mid] < target <= nums[right]: left = mid + 1
                else: right = mid - 1
        return -1`,

  "serialize-deserialize": `class Codec:
    def serialize(self, root) -> str:
        if not root: return 'N'
        return str(root.val) + ',' + self.serialize(root.left) + ',' + self.serialize(root.right)

    def deserialize(self, data: str):
        vals = iter(data.split(','))
        def dfs():
            v = next(vals)
            if v == 'N': return None
            node = TreeNode(int(v))
            node.left = dfs(); node.right = dfs()
            return node
        return dfs()`,

  "sliding-window-max": `class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        from collections import deque
        dq, result = deque(), []
        for i, n in enumerate(nums):
            while dq and nums[dq[-1]] < n: dq.pop()
            dq.append(i)
            if dq[0] < i - k + 1: dq.popleft()
            if i >= k - 1: result.append(nums[dq[0]])
        return result`,

  "subsets-ii": `class Solution:
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        def bt(start, path):
            result.append(path[:])
            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i-1]: continue
                path.append(nums[i]); bt(i+1, path); path.pop()
        bt(0, [])
        return result`,

  "subtree-of-another": `class Solution:
    def isSubtree(self, root, subRoot) -> bool:
        def same(a, b):
            if not a and not b: return True
            if not a or not b or a.val != b.val: return False
            return same(a.left, b.left) and same(a.right, b.right)
        if not root: return False
        return same(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`,

  "surrounded-regions": `class Solution:
    def solve(self, board: list[list[str]]) -> None:
        m, n = len(board), len(board[0])
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != 'O': return
            board[i][j] = 'S'
            for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]: dfs(i+di, j+dj)
        for i in range(m): dfs(i, 0); dfs(i, n-1)
        for j in range(n): dfs(0, j); dfs(m-1, j)
        for i in range(m):
            for j in range(n):
                board[i][j] = 'O' if board[i][j] == 'S' else 'X'`,

  "swap-pairs": `class Solution:
    def swapPairs(self, head):
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next = b; a.next = b.next; b.next = a
            prev = a
        return dummy.next`,

  "symmetric-tree": `class Solution:
    def isSymmetric(self, root) -> bool:
        def mirror(a, b):
            if not a and not b: return True
            if not a or not b or a.val != b.val: return False
            return mirror(a.left, b.right) and mirror(a.right, b.left)
        return mirror(root.left, root.right)`,

  "task-scheduler": `class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        from collections import Counter
        counts = sorted(Counter(tasks).values())
        max_count = counts[-1]
        idle = (max_count - 1) * (n - counts.count(max_count))
        return max(len(tasks), len(tasks) + idle)`,

  "three-sum": `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        for i, n in enumerate(nums):
            if i > 0 and n == nums[i-1]: continue
            left, right = i+1, len(nums)-1
            while left < right:
                s = n + nums[left] + nums[right]
                if s == 0:
                    result.append([n, nums[left], nums[right]])
                    while left < right and nums[left] == nums[left+1]: left += 1
                    while left < right and nums[right] == nums[right-1]: right -= 1
                    left += 1; right -= 1
                elif s < 0: left += 1
                else: right -= 1
        return result`,

  "time-based-key-value": `class TimeMap:
    def __init__(self):
        self.store: dict[str, list] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store: return ''
        vals = self.store[key]
        left, right = 0, len(vals) - 1
        result = ''
        while left <= right:
            mid = (left + right) // 2
            if vals[mid][0] <= timestamp:
                result = vals[mid][1]; left = mid + 1
            else:
                right = mid - 1
        return result`,

  "top-k-frequent": `class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        from collections import Counter
        return [x for x, _ in Counter(nums).most_common(k)]`,

  "trapping-rain-water": `class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = result = 0
        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max: left_max = height[left]
                else: result += left_max - height[left]
                left += 1
            else:
                if height[right] >= right_max: right_max = height[right]
                else: result += right_max - height[right]
                right -= 1
        return result`,

  "two-sum-ii": `class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            s = numbers[left] + numbers[right]
            if s == target: return [left+1, right+1]
            elif s < target: left += 1
            else: right -= 1
        return []`,

  "valid-palindrome": `class Solution:
    def isPalindrome(self, s: str) -> bool:
        filtered = [c.lower() for c in s if c.isalnum()]
        return filtered == filtered[::-1]`,

  "valid-sudoku": `class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        for i in range(9):
            for j in range(9):
                v = board[i][j]
                if v == '.': continue
                box = (i//3)*3 + j//3
                if v in rows[i] or v in cols[j] or v in boxes[box]:
                    return False
                rows[i].add(v); cols[j].add(v); boxes[box].add(v)
        return True`,

  "validate-bst": `class Solution:
    def isValidBST(self, root, lo=float('-inf'), hi=float('inf')) -> bool:
        if not root: return True
        if root.val <= lo or root.val >= hi: return False
        return self.isValidBST(root.left, lo, root.val) and \
               self.isValidBST(root.right, root.val, hi)`,

  "word-search": `class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        def bt(r, c, i):
            if i == len(word): return True
            if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[i]: return False
            tmp, board[r][c] = board[r][c], '#'
            found = bt(r+1,c,i+1) or bt(r-1,c,i+1) or bt(r,c+1,i+1) or bt(r,c-1,i+1)
            board[r][c] = tmp
            return found
        return any(bt(i, j, 0) for i in range(m) for j in range(n))`,

  // ── DP problems ────────────────────────────────────────────────────────
  "house-robber-ii": `class Solution:
    def rob(self, nums: list[int]) -> int:
        def rob_linear(arr):
            prev2 = prev1 = 0
            for x in arr:
                prev2, prev1 = prev1, max(prev2 + x, prev1)
            return prev1
        if len(nums) == 1: return nums[0]
        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`,

  "missing-number": `class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)`,

  "counting-bits": `class Solution:
    def countBits(self, n: int) -> list[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp`,

  "number-1-bits": `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count`,

  "reverse-bits": `class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for _ in range(32):
            result = (result << 1) | (n & 1)
            n >>= 1
        return result`,

  "power-of-two": `class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0`,

  "sum-two-integers": `class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        while b & mask:
            carry = (a & b) << 1
            a = a ^ b
            b = carry
        return a if b == 0 else a & mask`,

  "jump-game": `class Solution:
    def canJump(self, nums: list[int]) -> bool:
        max_reach = 0
        for i, n in enumerate(nums):
            if i > max_reach: return False
            max_reach = max(max_reach, i + n)
        return True`,

  "jump-game-ii": `class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = cur_end = cur_far = 0
        for i in range(len(nums) - 1):
            cur_far = max(cur_far, i + nums[i])
            if i == cur_end:
                jumps += 1; cur_end = cur_far
        return jumps`,

  "gas-station": `class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        if sum(gas) < sum(cost): return -1
        tank = start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                tank = 0; start = i + 1
        return start`,

  "lemonade-change": `class Solution:
    def lemonadeChange(self, bills: list[int]) -> bool:
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
        return True`,

  "best-time-stock-ii": `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))`,

  "buy-sell-cooldown": `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        hold = float('-inf')
        sold = cooldown = 0
        for p in prices:
            prev_sold = sold
            sold = hold + p
            hold = max(hold, cooldown - p)
            cooldown = max(cooldown, prev_sold)
        return max(sold, cooldown)`,

  "decode-ways": `class Solution:
    def numDecodings(self, s: str) -> int:
        dp = {len(s): 1}
        def dfs(i):
            if i in dp: return dp[i]
            if s[i] == '0': return 0
            res = dfs(i + 1)
            if i + 1 < len(s) and int(s[i:i+2]) <= 26:
                res += dfs(i + 2)
            dp[i] = res
            return res
        return dfs(0)`,

  "unique-paths": `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for _ in range(m - 1):
            for j in range(1, n):
                dp[j] += dp[j-1]
        return dp[-1]`,

  "minimum-path-sum": `class Solution:
    def minPathSum(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        for i in range(m):
            for j in range(n):
                if i == 0 and j == 0: continue
                elif i == 0: grid[i][j] += grid[i][j-1]
                elif j == 0: grid[i][j] += grid[i-1][j]
                else: grid[i][j] += min(grid[i-1][j], grid[i][j-1])
        return grid[-1][-1]`,

  "triangle": `class Solution:
    def minimumTotal(self, triangle: list[list[int]]) -> int:
        dp = triangle[-1][:]
        for row in reversed(triangle[:-1]):
            for j in range(len(row)):
                dp[j] = row[j] + min(dp[j], dp[j+1])
        return dp[0]`,

  "longest-common-subsequence": `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n+1) for _ in range(m+1)]
        for i in range(1, m+1):
            for j in range(1, n+1):
                if text1[i-1] == text2[j-1]:
                    dp[i][j] = 1 + dp[i-1][j-1]
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        return dp[m][n]`,

  "longest-increasing-subsequence": `class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        import bisect
        tails = []
        for n in nums:
            pos = bisect.bisect_left(tails, n)
            if pos == len(tails): tails.append(n)
            else: tails[pos] = n
        return len(tails)`,

  "longest-palindromic-substr": `class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ''
        for i in range(len(s)):
            for l, r in [(i, i), (i, i+1)]:
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    l -= 1; r += 1
                if r - l - 1 > len(res):
                    res = s[l+1:r]
        return res`,

  "palindromic-substrings": `class Solution:
    def countSubstrings(self, s: str) -> int:
        count = 0
        for i in range(len(s)):
            for l, r in [(i, i), (i, i+1)]:
                while l >= 0 and r < len(s) and s[l] == s[r]:
                    count += 1; l -= 1; r += 1
        return count`,

  "edit-distance": `class Solution:
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
        return dp[n]`,

  "distinct-subsequences": `class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [0] * (n+1); dp[0] = 1
        for c in s:
            for j in range(n, 0, -1):
                if c == t[j-1]: dp[j] += dp[j-1]
        return dp[n]`,

  "interleaving-string": `class Solution:
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
        return dp[m][n]`,

  "partition-equal-subset": `class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2: return False
        target = total // 2
        dp = {0}
        for n in nums:
            dp = dp | {x + n for x in dp if x + n <= target}
        return target in dp`,

  "target-sum": `class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        dp: dict[int, int] = {0: 1}
        for n in nums:
            new_dp: dict[int, int] = {}
            for total, cnt in dp.items():
                new_dp[total + n] = new_dp.get(total + n, 0) + cnt
                new_dp[total - n] = new_dp.get(total - n, 0) + cnt
            dp = new_dp
        return dp.get(target, 0)`,

  "coin-change-ii": `class Solution:
    def change(self, amount: int, coins: list[int]) -> int:
        dp = [0] * (amount + 1); dp[0] = 1
        for coin in coins:
            for i in range(coin, amount + 1):
                dp[i] += dp[i - coin]
        return dp[amount]`,

  "max-product-subarray": `class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        result = max(nums)
        cur_min = cur_max = 1
        for n in nums:
            if n == 0: cur_min = cur_max = 1; continue
            tmp = cur_max * n
            cur_max = max(n, cur_max * n, cur_min * n)
            cur_min = min(n, tmp, cur_min * n)
            result = max(result, cur_max)
        return result`,

  "word-break": `class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        dp = [False] * (len(s) + 1); dp[0] = True
        for i in range(1, len(s) + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True; break
        return dp[len(s)]`,

  "regular-expression-matching": `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        dp = [[False] * (n+1) for _ in range(m+1)]
        dp[0][0] = True
        for j in range(2, n+1):
            if p[j-1] == '*': dp[0][j] = dp[0][j-2]
        for i in range(1, m+1):
            for j in range(1, n+1):
                if p[j-1] == '*':
                    dp[i][j] = dp[i][j-2]
                    if p[j-2] in (s[i-1], '.'):
                        dp[i][j] |= dp[i-1][j]
                elif p[j-1] in (s[i-1], '.'):
                    dp[i][j] = dp[i-1][j-1]
        return dp[m][n]`,

  "burst-balloons": `class Solution:
    def maxCoins(self, nums: list[int]) -> int:
        nums = [1] + nums + [1]
        n = len(nums)
        dp = [[0] * n for _ in range(n)]
        for length in range(2, n):
            for left in range(0, n - length):
                right = left + length
                for k in range(left+1, right):
                    dp[left][right] = max(dp[left][right],
                        dp[left][k] + nums[left]*nums[k]*nums[right] + dp[k][right])
        return dp[0][n-1]`,

  // ── Graph problems ─────────────────────────────────────────────────────
  "course-schedule": `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        for a, b in prerequisites: graph[b].append(a)
        visited = [0] * numCourses  # 0=unvisited, 1=visiting, 2=done
        def dfs(v):
            if visited[v] == 1: return False
            if visited[v] == 2: return True
            visited[v] = 1
            if not all(dfs(u) for u in graph[v]): return False
            visited[v] = 2; return True
        return all(dfs(i) for i in range(numCourses))`,

  "course-schedule-ii": `class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = [[] for _ in range(numCourses)]
        for a, b in prerequisites: graph[b].append(a)
        visited = [0] * numCourses; order = []
        def dfs(v):
            if visited[v] == 1: return False
            if visited[v] == 2: return True
            visited[v] = 1
            if not all(dfs(u) for u in graph[v]): return False
            visited[v] = 2; order.append(v); return True
        if not all(dfs(i) for i in range(numCourses)): return []
        return order[::-1]`,

  "walls-gates": `class Solution:
    def wallsAndGates(self, rooms: list[list[int]]) -> None:
        from collections import deque
        INF = 2147483647
        m, n = len(rooms), len(rooms[0])
        q = deque([(i,j) for i in range(m) for j in range(n) if rooms[i][j] == 0])
        dist = 0
        while q:
            dist += 1
            for _ in range(len(q)):
                r, c = q.popleft()
                for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                    nr, nc = r+dr, c+dc
                    if 0 <= nr < m and 0 <= nc < n and rooms[nr][nc] == INF:
                        rooms[nr][nc] = dist; q.append((nr,nc))`,

  "graph-valid-tree": `class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        if len(edges) != n - 1: return False
        graph = [[] for _ in range(n)]
        for a, b in edges: graph[a].append(b); graph[b].append(a)
        visited = set()
        def dfs(v, parent):
            visited.add(v)
            return all(dfs(u, v) for u in graph[v] if u != parent)
        return dfs(0, -1) and len(visited) == n`,

  "num-connected-components": `class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        parent = list(range(n))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        def union(a, b):
            pa, pb = find(a), find(b)
            if pa == pb: return 0
            parent[pa] = pb; return 1
        return n - sum(union(a, b) for a, b in edges)`,

  "all-paths-source-target": `class Solution:
    def allPathsSourceTarget(self, graph: list[list[int]]) -> list[list[int]]:
        target = len(graph) - 1
        result = []
        def dfs(node, path):
            if node == target: result.append(path[:]); return
            for nb in graph[node]:
                path.append(nb); dfs(nb, path); path.pop()
        dfs(0, [0])
        return result`,

  "find-path-exists": `class Solution:
    def validPath(self, n: int, edges: list[list[int]], source: int, destination: int) -> bool:
        if source == destination: return True
        graph = [[] for _ in range(n)]
        for a, b in edges: graph[a].append(b); graph[b].append(a)
        visited = set([source])
        stack = [source]
        while stack:
            v = stack.pop()
            if v == destination: return True
            for u in graph[v]:
                if u not in visited: visited.add(u); stack.append(u)
        return False`,

  "evaluate-division": `class Solution:
    def calcEquation(self, equations: list[list[str]], values: list[float], queries: list[list[str]]) -> list[float]:
        from collections import defaultdict
        graph = defaultdict(dict)
        for (a, b), v in zip(equations, values):
            graph[a][b] = v; graph[b][a] = 1/v
        def bfs(src, dst):
            if src not in graph or dst not in graph: return -1
            visited, q = {src}, [(src, 1)]
            for node, prod in q:
                if node == dst: return prod
                for nb, w in graph[node].items():
                    if nb not in visited: visited.add(nb); q.append((nb, prod*w))
            return -1
        return [bfs(s, d) for s, d in queries]`,

  "word-ladder": `class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        from collections import deque
        word_set = set(wordList)
        if endWord not in word_set: return 0
        q = deque([(beginWord, 1)])
        visited = {beginWord}
        while q:
            word, length = q.popleft()
            if word == endWord: return length
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in word_set and new_word not in visited:
                        visited.add(new_word); q.append((new_word, length+1))
        return 0`,

  "alien-dictionary": `class Solution:
    def alienOrder(self, words: list[str]) -> str:
        from collections import defaultdict, deque
        adj = {c: set() for w in words for c in w}
        for i in range(len(words)-1):
            w1, w2 = words[i], words[i+1]
            if len(w1) > len(w2) and w1[:len(w2)] == w2: return ''
            for c1, c2 in zip(w1, w2):
                if c1 != c2: adj[c1].add(c2); break
        visited = {}; result = []
        def dfs(c):
            if c in visited: return visited[c]
            visited[c] = False
            for nb in adj[c]:
                if not dfs(nb): return False
            visited[c] = True; result.append(c); return True
        for c in adj:
            if not dfs(c): return ''
        return ''.join(result[::-1])`,

  "network-delay-time": `class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        import heapq
        from collections import defaultdict
        graph = defaultdict(list)
        for u, v, w in times: graph[u].append((v, w))
        dist = {i: float('inf') for i in range(1, n+1)}; dist[k] = 0
        heap = [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if d > dist[u]: continue
            for v, w in graph[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w; heapq.heappush(heap, (dist[v], v))
        mx = max(dist.values())
        return mx if mx < float('inf') else -1`,

  "reconstruct-itinerary": `class Solution:
    def findItinerary(self, tickets: list[list[str]]) -> list[str]:
        from collections import defaultdict
        import heapq
        graph = defaultdict(list)
        for a, b in tickets: heapq.heappush(graph[a], b)
        result = []
        def dfs(airport):
            while graph[airport]: dfs(heapq.heappop(graph[airport]))
            result.append(airport)
        dfs('JFK')
        return result[::-1]`,

  "redundant-connection": `class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        parent = list(range(len(edges) + 1))
        def find(x):
            while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
            return x
        for a, b in edges:
            pa, pb = find(a), find(b)
            if pa == pb: return [a, b]
            parent[pa] = pb
        return []`,

  "min-cost-connect-points": `class Solution:
    def minCostConnectPoints(self, points: list[list[int]]) -> int:
        import heapq
        n = len(points)
        visited = set(); heap = [(0, 0)]; cost = 0
        while len(visited) < n:
            c, i = heapq.heappop(heap)
            if i in visited: continue
            visited.add(i); cost += c
            for j in range(n):
                if j not in visited:
                    d = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1])
                    heapq.heappush(heap, (d, j))
        return cost`,

  "swim-rising-water": `class Solution:
    def swimInWater(self, grid: list[list[int]]) -> int:
        import heapq
        n = len(grid)
        visited = set([(0,0)])
        heap = [(grid[0][0], 0, 0)]
        while heap:
            t, r, c = heapq.heappop(heap)
            if r == c == n-1: return t
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < n and 0 <= nc < n and (nr,nc) not in visited:
                    visited.add((nr,nc)); heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))
        return -1`,

  "path-max-probability": `class Solution:
    def maxProbability(self, n: int, edges: list[list[int]], succProb: list[float], start: int, end: int) -> float:
        import heapq
        from collections import defaultdict
        graph = defaultdict(list)
        for (a,b), p in zip(edges, succProb):
            graph[a].append((b,p)); graph[b].append((a,p))
        heap = [(-1.0, start)]; prob = [0.0] * n; prob[start] = 1.0
        while heap:
            p, u = heapq.heappop(heap)
            if -p < prob[u]: continue
            for v, w in graph[u]:
                if prob[u] * w > prob[v]:
                    prob[v] = prob[u] * w; heapq.heappush(heap, (-prob[v], v))
        return prob[end]`,

  "cheapest-flights": `class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        prices = [float('inf')] * n; prices[src] = 0
        for _ in range(k + 1):
            tmp = prices[:]
            for u, v, w in flights:
                if prices[u] + w < tmp[v]: tmp[v] = prices[u] + w
            prices = tmp
        return -1 if prices[dst] == float('inf') else prices[dst]`,

  // ── Trie problems ──────────────────────────────────────────────────────
  "add-search-words": `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for c in word: node = node.setdefault(c, {})
        node['#'] = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word): return '#' in node
            c = word[i]
            if c == '.':
                return any(dfs(v, i+1) for k, v in node.items() if k != '#' and isinstance(v, dict))
            return c in node and dfs(node[c], i+1)
        return dfs(self.root, 0)`,

  "word-search-ii": `class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = {}
        for w in words:
            node = root
            for c in w: node = node.setdefault(c, {})
            node['#'] = w
        m, n = len(board), len(board[0])
        result = []
        def dfs(i, j, node):
            c = board[i][j]
            if c not in node: return
            child = node[c]
            if '#' in child: result.append(child['#']); del child['#']
            board[i][j] = '#'
            for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
                ni, nj = i+di, j+dj
                if 0 <= ni < m and 0 <= nj < n: dfs(ni, nj, child)
            board[i][j] = c
        for i in range(m):
            for j in range(n): dfs(i, j, root)
        return result`,

  "replace-words": `class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        root = {}
        for word in dictionary:
            node = root
            for c in word: node = node.setdefault(c, {})
            node['#'] = word
        def replace(word):
            node = root
            for c in word:
                if c not in node: return word
                node = node[c]
                if '#' in node: return node['#']
            return word
        return ' '.join(replace(w) for w in sentence.split())`,

  "longest-word-dictionary": `class Solution:
    def longestWord(self, words: list[str]) -> str:
        word_set = set(words)
        result = ''
        for w in sorted(words):
            if len(w) == 1 or w[:-1] in word_set:
                if len(w) > len(result) or (len(w) == len(result) and w < result):
                    result = w
        return result`,

  "index-pairs-string": `class Solution:
    def indexPairs(self, text: str, words: list[str]) -> list[list[int]]:
        result = []
        for word in words:
            start = 0
            while True:
                idx = text.find(word, start)
                if idx == -1: break
                result.append([idx, idx + len(word) - 1]); start = idx + 1
        result.sort()
        return result`,

  // ── Interval problems ──────────────────────────────────────────────────
  "insert-interval": `class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []; i = 0; n = len(intervals)
        while i < n and intervals[i][1] < newInterval[0]:
            result.append(intervals[i]); i += 1
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1]); i += 1
        result.append(newInterval)
        return result + intervals[i:]`,

  "meeting-rooms": `class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        intervals.sort()
        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i-1][1]: return False
        return True`,

  "meeting-rooms-ii": `class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        import heapq
        intervals.sort()
        heap = []
        for start, end in intervals:
            if heap and heap[0] <= start: heapq.heappop(heap)
            heapq.heappush(heap, end)
        return len(heap)`,

  "hand-of-straights": `class Solution:
    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:
        from collections import Counter
        if len(hand) % groupSize: return False
        count = Counter(hand)
        for card in sorted(count):
            if count[card] > 0:
                n = count[card]
                for i in range(card, card + groupSize):
                    if count[i] < n: return False
                    count[i] -= n
        return True`,

  "partition-labels": `class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {c: i for i, c in enumerate(s)}
        result = []; start = end = 0
        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end:
                result.append(end - start + 1); start = i + 1
        return result`,

  "merge-triplets": `class Solution:
    def mergeTriplets(self, triplets: list[list[int]], target: list[int]) -> bool:
        good = [0, 0, 0]
        for t in triplets:
            if t[0] <= target[0] and t[1] <= target[1] and t[2] <= target[2]:
                good = [max(good[i], t[i]) for i in range(3)]
        return good == target`,

  "min-interval-query": `class Solution:
    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:
        import heapq
        intervals.sort()
        heap = []; result = {}
        i = 0
        for q in sorted(queries):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(heap, (r-l+1, r)); i += 1
            while heap and heap[0][1] < q: heapq.heappop(heap)
            result[q] = heap[0][0] if heap else -1
        return [result[q] for q in queries]`,

  // ── Math problems ───────────────────────────────────────────────────────
  "roman-to-integer": `class Solution:
    def romanToInt(self, s: str) -> int:
        val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
        result = 0
        for i in range(len(s)):
            if i+1 < len(s) and val[s[i]] < val[s[i+1]]:
                result -= val[s[i]]
            else:
                result += val[s[i]]
        return result`,

  "happy-number": `class Solution:
    def isHappy(self, n: int) -> bool:
        seen = set()
        while n != 1:
            if n in seen: return False
            seen.add(n)
            n = sum(int(d)**2 for d in str(n))
        return True`,

  "plus-one": `class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        for i in range(len(digits)-1, -1, -1):
            if digits[i] < 9: digits[i] += 1; return digits
            digits[i] = 0
        return [1] + digits`,

  "count-primes": `class Solution:
    def countPrimes(self, n: int) -> int:
        if n < 2: return 0
        sieve = [True] * n; sieve[0] = sieve[1] = False
        for i in range(2, int(n**0.5)+1):
            if sieve[i]:
                for j in range(i*i, n, i): sieve[j] = False
        return sum(sieve)`,

  "pow-x-n": `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0: x, n = 1/x, -n
        result = 1
        while n:
            if n % 2: result *= x
            x *= x; n //= 2
        return result`,

  "multiply-strings": `class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == '0' or num2 == '0': return '0'
        m, n = len(num1), len(num2)
        pos = [0] * (m + n)
        for i in range(m-1, -1, -1):
            for j in range(n-1, -1, -1):
                mul = int(num1[i]) * int(num2[j])
                p1, p2 = i+j, i+j+1
                total = mul + pos[p2]
                pos[p2] = total % 10; pos[p1] += total // 10
        return ''.join(map(str, pos)).lstrip('0') or '0'`,

  "rotate-image": `class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        n = len(matrix)
        matrix[:] = [list(row) for row in zip(*matrix[::-1])]`,

  "spiral-matrix": `class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        result = []
        while matrix:
            result += matrix.pop(0)
            matrix = list(zip(*matrix))[::-1]
        return result`,

  "set-matrix-zeroes": `class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        rows, cols = set(), set()
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 0: rows.add(i); cols.add(j)
        for i in range(m):
            for j in range(n):
                if i in rows or j in cols: matrix[i][j] = 0`,

  "detect-squares": `class DetectSquares:
    def __init__(self):
        from collections import defaultdict
        self.point_count: dict[tuple, int] = defaultdict(int)
        self.points: list[list[int]] = []

    def add(self, point: list[int]) -> None:
        self.point_count[tuple(point)] += 1
        self.points.append(point)

    def count(self, point: list[int]) -> int:
        px, py = point; result = 0
        for x3, y3 in self.points:
            if abs(px - x3) != abs(py - y3) or px == x3 or py == y3: continue
            result += self.point_count[(px, y3)] * self.point_count[(x3, py)]
        return result`,

  // ── Miscellaneous ──────────────────────────────────────────────────────
  "nth-tribonacci": `class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0: return 0
        if n <= 2: return 1
        a, b, c = 0, 1, 1
        for _ in range(n - 2):
            a, b, c = b, c, a + b + c
        return c`,

  "min-cost-climbing": `class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        a = b = 0
        for i in range(2, len(cost) + 1):
            a, b = b, min(b + cost[i-1], a + cost[i-2])
        return b`,

  "max-score-multiplication": `class Solution:
    def maximumScore(self, nums: list[int], multipliers: list[int]) -> int:
        n, m = len(nums), len(multipliers)
        dp = [[0] * (m + 1) for _ in range(m + 1)]
        for i in range(m - 1, -1, -1):
            for left in range(i, -1, -1):
                right = n - 1 - (i - left)
                mul = multipliers[i]
                dp[i][left] = max(mul * nums[left] + dp[i+1][left+1],
                                  mul * nums[right] + dp[i+1][left])
        return dp[0][0]`,

  "longest-increasing-path-matrix": `class Solution:
    def longestIncreasingPath(self, matrix: list[list[int]]) -> int:
        m, n = len(matrix), len(matrix[0])
        memo: dict[tuple, int] = {}
        def dfs(i, j):
            if (i, j) in memo: return memo[(i, j)]
            best = 1
            for di, dj in [(1,0),(-1,0),(0,1),(0,-1)]:
                ni, nj = i+di, j+dj
                if 0 <= ni < m and 0 <= nj < n and matrix[ni][nj] > matrix[i][j]:
                    best = max(best, 1 + dfs(ni, nj))
            memo[(i, j)] = best; return best
        return max(dfs(i, j) for i in range(m) for j in range(n))`,

  "jump-game-vii": `class Solution:
    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:
        if s[-1] == '1': return False
        prev_count = 0; reachable = {0}
        for i in range(1, len(s)):
            if i >= minJump and i - minJump in reachable: prev_count += 1
            if i > maxJump and i - maxJump - 1 in reachable: prev_count -= 1
            if prev_count > 0 and s[i] == '0': reachable.add(i)
        return len(s) - 1 in reachable`,

  "bitwise-and-numbers-range": `class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left != right:
            left >>= 1; right >>= 1; shift += 1
        return left << shift`,

  "reverse-integer": `class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        rev = int(str(abs(x))[::-1]) * sign
        return rev if -(2**31) <= rev <= 2**31 - 1 else 0`,

  "valid-parenthesis-string": `class Solution:
    def checkValidString(self, s: str) -> bool:
        lo = hi = 0
        for c in s:
            if c == '(': lo += 1; hi += 1
            elif c == ')': lo -= 1; hi -= 1
            else: lo -= 1; hi += 1
            if hi < 0: return False
            lo = max(lo, 0)
        return lo == 0`,
};
