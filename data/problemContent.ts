// Re-export the interface and generated content as base
export type { ProblemContent } from "./problemContent.generated";
import { PROBLEM_CONTENT as GENERATED_CONTENT } from "./problemContent.generated";
import { PYTHON_SOLUTIONS } from "./pythonSolutions";

// Rich overrides — merge generated base with high-quality entries below
const RICH_OVERRIDES: Record<string, import("./problemContent.generated").ProblemContent> = {
  "two-sum": {
    intuition:
      "Brute force checks every pair in O(n²). The insight: if we need a + b = target, then b = target - a. Store each number in a hash map as we walk the array. For each number, instantly check if its complement already exists.",
    approach: [
      "Create an empty hash map (value → index).",
      "Iterate through the array with index i.",
      "Compute complement = target − nums[i].",
      "If complement is in the map, return [map[complement], i].",
      "Otherwise, store nums[i] → i in the map and continue.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen; // val -> index
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement))
                return {seen[complement], i};
            seen[nums[i]] = i;
        }
        return {}; // guaranteed to have solution
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the array. Each hash map lookup is O(1) average.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Hash map stores at most n elements.",
    edgeCases: [
      "Same element used twice — problem says each element used once, but check if complement index ≠ current index if allowing same value.",
      "Negative numbers — hash map handles negatives fine.",
      "Duplicate values with different indices — map stores latest index, but we check before storing so it's correct.",
    ],
    memoryTrick: "\"Store what you've SEEN, check if complement was already SEEN.\" Think of it as: walk through the array, and for each person, check if their missing puzzle piece is already in your backpack before adding them.",
  },

  "contains-duplicate": {
    intuition:
      "We need to know if any value appears more than once. Hash set membership check is O(1). Walk the array: if element is already in set, we found a duplicate. Otherwise add it.",
    approach: [
      "Create an empty hash set.",
      "For each number in the array:",
      "  — If number is in the set, return true (duplicate found).",
      "  — Otherwise insert number into the set.",
      "If loop completes without finding duplicate, return false.",
    ],
    cppSolution: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int x : nums) {
            if (seen.count(x)) return true;
            seen.insert(x);
        }
        return false;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass through array, each set operation O(1) amortized.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Set stores up to n distinct elements.",
    edgeCases: [
      "Array with single element — no duplicates possible, returns false.",
      "All same elements — returns true on second element.",
      "Very large values (INT_MIN/MAX) — unordered_set handles these.",
    ],
    memoryTrick: "\"Bouncer at a club — if you've been here before, you're a duplicate. Seen set = guest list.\"",
  },

  "valid-anagram": {
    intuition:
      "Two strings are anagrams if they contain the same characters with the same frequencies. Sort both and compare — O(n log n). Better: count character frequencies using array of size 26 or hash map, then compare counts.",
    approach: [
      "If lengths differ, return false immediately.",
      "Create frequency array of size 26 (for lowercase letters).",
      "For each character in s, increment count. For each character in t, decrement count.",
      "If any count is nonzero at the end, strings are not anagrams.",
    ],
    cppSolution: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int count[26] = {};
        for (int i = 0; i < (int)s.size(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        for (int c : count)
            if (c != 0) return false;
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear passes through the strings.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed array of size 26 regardless of input size.",
    edgeCases: [
      "Empty strings — both empty → anagram (true). One empty → false (different lengths).",
      "Unicode characters — use unordered_map instead of size-26 array.",
      "Different lengths — early return saves work.",
    ],
    memoryTrick: "\"Increment for s, decrement for t. If perfectly balanced (all zeros), they're anagrams.\" Like a scale that must balance.",
  },

  "group-anagrams": {
    intuition:
      "Anagrams share the same sorted string. Use sorted string as hash map key. Group all strings with the same key together.",
    approach: [
      "Create hash map: sorted_string → list of original strings.",
      "For each string, sort its characters to get the key.",
      "Append the original string to map[key].",
      "Return all values of the map.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [key, group] : groups)
            result.push_back(group);
        return result;
    }
};`,
    timeComplexity: "O(n · k log k)",
    timeExplanation: "n strings, each sorted in O(k log k) where k = max string length.",
    spaceComplexity: "O(n · k)",
    spaceExplanation: "Storing all strings in the map.",
    edgeCases: [
      "Single character strings — sorted key = same character, groups correctly.",
      "Empty string — valid input, sorted key = empty string, grouped together.",
    ],
    memoryTrick: "\"Sort each string to get its 'DNA fingerprint'. Same DNA = same group.\"",
  },

  "longest-substring": {
    intuition:
      "Track a window [left, right] with no repeating characters. When we add a character that already exists in the window, shrink left until the duplicate is removed. Use hash map to store last seen index of each character for O(1) jump.",
    approach: [
      "Use hash map to store last index of each character.",
      "Maintain left pointer of current valid window.",
      "For each right pointer position:",
      "  — If char seen and its last index >= left, move left past it.",
      "  — Update last index of current char.",
      "  — Update result = max(result, right - left + 1).",
    ],
    cppSolution: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int result = 0, left = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            char c = s[right];
            if (lastSeen.count(c) && lastSeen[c] >= left)
                left = lastSeen[c] + 1;
            lastSeen[c] = right;
            result = max(result, right - left + 1);
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each character processed once. Hash map O(1) operations.",
    spaceComplexity: "O(min(n, charset))",
    spaceExplanation: "Hash map stores at most charset size entries (128 for ASCII).",
    edgeCases: [
      "Empty string — returns 0.",
      "All same characters — window shrinks every step, result = 1.",
      "No repeating characters — result = full string length.",
    ],
    memoryTrick: "\"Sliding window = stretchy rubber band. When duplicate found, snap left forward past the old copy.\"",
  },

  "best-time-stock": {
    intuition:
      "We want max(prices[j] - prices[i]) where j > i. Equivalently: track the minimum price seen so far, and for each day, compute profit if we sold today. Keep track of maximum profit seen.",
    approach: [
      "Initialize minPrice = infinity, maxProfit = 0.",
      "For each price in the array:",
      "  — If price < minPrice, update minPrice (found cheaper buy day).",
      "  — Else compute profit = price - minPrice, update maxProfit if larger.",
      "Return maxProfit.",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through prices array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two variables maintained.",
    edgeCases: [
      "Prices monotonically decreasing — maxProfit stays 0 (never profitable).",
      "Single price — no transaction possible, returns 0.",
      "All same prices — profit = 0.",
    ],
    memoryTrick: "\"Track the valley (minimum). Every peak you see, check if valley → peak is best profit so far.\"",
  },

  "valid-parentheses": {
    intuition:
      "Every closing bracket must match the most recently opened bracket. Stack perfectly models this LIFO requirement: push opening brackets, pop when we see closing bracket and verify match.",
    approach: [
      "Create a stack.",
      "For each character:",
      "  — If opening bracket ('(', '[', '{'), push onto stack.",
      "  — If closing bracket, check if stack is empty (mismatch) or top doesn't match → return false.",
      "  — If match, pop the stack.",
      "At end, stack must be empty (all brackets closed).",
    ],
    cppSolution: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> match = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{')
                st.push(c);
            else {
                if (st.empty() || st.top() != match[c])
                    return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, each character processed once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack can hold up to n/2 opening brackets.",
    edgeCases: [
      "Empty string — stack empty → returns true.",
      "Only closing brackets — stack empty on first pop attempt → false.",
      "Unmatched opening brackets — stack not empty at end → false.",
      "Interleaved types like '([)]' — top of stack won't match → false.",
    ],
    memoryTrick: "\"Stack = your open bracket history. Closing bracket = check if it closes the most recent open one.\"",
  },

  "binary-search": {
    intuition:
      "Array is sorted. At each step, compare middle element with target. If equal, found. If target > mid, answer is in right half. If target < mid, answer is in left half. Each step halves the search space.",
    approach: [
      "Initialize left = 0, right = n-1.",
      "While left <= right:",
      "  — Compute mid = left + (right-left)/2 (avoids overflow).",
      "  — If nums[mid] == target, return mid.",
      "  — If nums[mid] < target, set left = mid+1.",
      "  — Else set right = mid-1.",
      "Return -1 if not found.",
    ],
    cppSolution: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = (int)nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Search space halves each iteration. At most log₂(n) iterations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only left, right, mid variables.",
    edgeCases: [
      "Single element array — works correctly.",
      "Target at leftmost/rightmost position — works correctly.",
      "Overflow with mid = (left+right)/2 — use left+(right-left)/2 instead.",
      "Duplicate elements — problem guarantees unique elements.",
    ],
    memoryTrick: "\"Open the dictionary in the middle. Too far right? Check left half. Too far left? Check right half.\"",
  },

  "reverse-linked-list": {
    intuition:
      "We need to make each node point backward. Keep track of previous node. For each current node, save its next, point it to prev, advance prev to current, advance current to saved next.",
    approach: [
      "Initialize prev = nullptr, curr = head.",
      "While curr is not null:",
      "  — Save next = curr->next.",
      "  — Reverse the pointer: curr->next = prev.",
      "  — Move prev = curr.",
      "  — Move curr = next.",
      "Return prev (new head).",
    ],
    cppSolution: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit each node exactly once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only three pointers regardless of list length.",
    edgeCases: [
      "Empty list (head = null) — prev stays null, returns null correctly.",
      "Single node — after one iteration, prev = head, curr = null, returns head.",
    ],
    memoryTrick: "\"Three pointers: prev, curr, next. It's like: save next, flip arrow, move everyone forward.\" Draw it: → → → becomes ← ← ←.",
  },

  "climbing-stairs": {
    intuition:
      "To reach step n, you can come from step n-1 (1 step) or step n-2 (2 steps). So ways(n) = ways(n-1) + ways(n-2). This is exactly the Fibonacci sequence! ways(1)=1, ways(2)=2.",
    approach: [
      "Base cases: dp[1] = 1, dp[2] = 2.",
      "For i from 3 to n: dp[i] = dp[i-1] + dp[i-2].",
      "Return dp[n].",
      "Space optimization: only need last two values, use two variables.",
    ],
    cppSolution: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single loop from 3 to n.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two variables instead of full dp array.",
    edgeCases: [
      "n=1 — returns 1 (only one way).",
      "n=2 — returns 2 (1+1 or 2).",
    ],
    memoryTrick: "\"Fibonacci in disguise. Each step = sum of last two steps. The staircase is building Fibonacci tower.\"",
  },

  "house-robber": {
    intuition:
      "Can't rob adjacent houses. For each house, decide: rob it (gain + skip previous) or skip it (take whatever was best up to previous). dp[i] = max(dp[i-2] + nums[i], dp[i-1]).",
    approach: [
      "If empty array, return 0.",
      "Track two values: prev2 = best up to 2 houses ago, prev1 = best up to 1 house ago.",
      "For each house: curr = max(prev2 + amount, prev1).",
      "Shift: prev2 = prev1, prev1 = curr.",
      "Return prev1.",
    ],
    cppSolution: `class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int amount : nums) {
            int curr = max(prev2 + amount, prev1);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through nums.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two variables instead of dp array.",
    edgeCases: [
      "Single house — robs it, returns nums[0].",
      "Two houses — returns max of both.",
    ],
    memoryTrick: "\"Skip or rob: always choose max. It's greedy on a 2-step decision tree. Think: two buckets, pour into whichever is bigger.\"",
  },

  "number-of-islands": {
    intuition:
      "Grid has '1' (land) and '0' (water). An island is a group of connected '1's (4-directional). Walk the grid; when we find an unvisited '1', it's a new island — flood-fill (DFS/BFS) to mark all connected land as visited.",
    approach: [
      "Initialize count = 0.",
      "Iterate every cell (i, j).",
      "If grid[i][j] == '1':",
      "  — Increment count.",
      "  — DFS from (i,j): mark cell as visited ('0' or '#'), recurse on 4 neighbors.",
      "Return count.",
    ],
    cppSolution: `class Solution {
    void dfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;
        grid[i][j] = '0'; // mark visited
        dfs(grid, i+1, j);
        dfs(grid, i-1, j);
        dfs(grid, i, j+1);
        dfs(grid, i, j-1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int i = 0; i < (int)grid.size(); i++)
            for (int j = 0; j < (int)grid[0].size(); j++)
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
        return count;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited at most once.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Recursion stack depth in worst case (all land).",
    edgeCases: [
      "Empty grid — return 0.",
      "All water — return 0.",
      "All land — one island, return 1.",
    ],
    memoryTrick: "\"Find land, flood-fill it (drown it), count how many times you had to flood. Each flood = one island.\"",
  },

  "coin-change": {
    intuition:
      "Find minimum coins to make amount. Greedy doesn't always work (e.g., coins=[1,3,4], amount=6 → greedy gives 4+1+1=3 but 3+3=2 is better). Use DP: dp[i] = min coins to make amount i.",
    approach: [
      "Initialize dp array of size amount+1 with INT_MAX (impossible).",
      "Base case: dp[0] = 0.",
      "For each amount from 1 to amount:",
      "  — For each coin denomination c:",
      "    — If c <= i and dp[i-c] != INT_MAX: dp[i] = min(dp[i], dp[i-c]+1).",
      "Return dp[amount] == INT_MAX ? -1 : dp[amount].",
    ],
    cppSolution: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int coin : coins)
                if (coin <= i)
                    dp[i] = min(dp[i], dp[i - coin] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
    timeComplexity: "O(amount × coins)",
    timeExplanation: "Two nested loops.",
    spaceComplexity: "O(amount)",
    spaceExplanation: "dp array of size amount+1.",
    edgeCases: [
      "Amount = 0 — returns 0.",
      "No valid combination — dp[amount] stays amount+1, return -1.",
      "Coin equals amount — dp[amount] = 1.",
    ],
    memoryTrick: "\"Build up from amount=0. Each cell = minimum coins to reach that exact amount. Fill the piggy bank one coin at a time.\"",
  },

  "invert-binary-tree": {
    intuition:
      "Swap left and right children for every node. Recurse down. The key insight: after swapping children, recursively invert each subtree.",
    approach: [
      "Base case: if root is null, return null.",
      "Swap root->left and root->right.",
      "Recursively invert root->left.",
      "Recursively invert root->right.",
      "Return root.",
    ],
    cppSolution: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node exactly once.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack depth = tree height h.",
    edgeCases: [
      "Empty tree — returns null.",
      "Single node — no children to swap, returns root.",
      "Skewed tree — O(n) recursion stack.",
    ],
    memoryTrick: "\"Mirror image. At every node, swap left↔right, then mirror each half. Like reflecting in a pond.\"",
  },

  "max-subarray": {
    intuition:
      "Kadane's algorithm: at each position, decide — should I extend the existing subarray or start fresh? If current sum + nums[i] < nums[i], the current sum is dragging us down. Start fresh from nums[i].",
    approach: [
      "Initialize currentSum = nums[0], maxSum = nums[0].",
      "For i from 1 to n-1:",
      "  — currentSum = max(nums[i], currentSum + nums[i]).",
      "  — maxSum = max(maxSum, currentSum).",
      "Return maxSum.",
    ],
    cppSolution: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int curr = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            curr = max(nums[i], curr + nums[i]);
            best = max(best, curr);
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two variables.",
    edgeCases: [
      "All negative numbers — returns the least negative (single element).",
      "Single element — returns that element.",
    ],
    memoryTrick: "\"Is the past helping or hurting? If current sum < 0, it's dead weight — cut it and start fresh.\"",
  },

  "single-number": {
    intuition:
      "XOR properties: a XOR a = 0, a XOR 0 = a. If every number appears twice except one, XOR all numbers together — pairs cancel out (→ 0), leaving only the single number.",
    approach: [
      "Initialize result = 0.",
      "XOR every number in the array with result.",
      "Pairs cancel (XOR with themselves = 0), single number remains.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int result = 0;
        for (int x : nums) result ^= x;
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, XOR is O(1).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only one variable.",
    edgeCases: [
      "Single element array — XOR with 0 returns that element.",
      "Negative numbers — XOR works at bit level, handles negatives.",
    ],
    memoryTrick: "\"XOR is a toggle. Each pair toggles itself back to 0. Unpaired number is left standing.\" Like voting: each pair cancels the other's vote.",
  },

  "linked-list-cycle": {
    intuition:
      "Floyd's cycle detection: slow pointer moves 1 step, fast pointer moves 2 steps. If there's a cycle, fast will eventually lap slow and they'll meet. If no cycle, fast reaches null.",
    approach: [
      "Initialize slow = head, fast = head.",
      "While fast and fast->next are not null:",
      "  — slow = slow->next (1 step).",
      "  — fast = fast->next->next (2 steps).",
      "  — If slow == fast, cycle detected, return true.",
      "Return false (fast reached end, no cycle).",
    ],
    cppSolution: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Fast pointer traverses at most 2n steps before meeting or exiting.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two pointers.",
    edgeCases: [
      "Empty list — fast is null, loop doesn't execute, returns false.",
      "Single node no cycle — fast->next is null, returns false.",
      "Single node with self-loop — slow == fast after one step.",
    ],
    memoryTrick: "\"Tortoise and Hare on a circular track. If there's a loop, the hare will lap the tortoise. If linear, hare falls off the end.\"",
  },

  "implement-trie": {
    intuition:
      "Trie stores strings letter by letter in a tree. Each path from root to an isEnd node represents a word. Insert: walk/create nodes for each letter. Search: walk nodes, check isEnd. StartsWith: walk nodes, return true if all exist.",
    approach: [
      "Each node has children map (char → node) and isEnd flag.",
      "Insert: for each char, create node if missing, walk to child, mark last node isEnd.",
      "Search: for each char, if node missing return false, walk down, return isEnd of last.",
      "StartsWith: same as search but return true if all chars exist (regardless of isEnd).",
    ],
    cppSolution: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}

    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c))
                curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return curr->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return true;
    }
};`,
    timeComplexity: "O(L) per operation",
    timeExplanation: "L = length of word/prefix. Each character processed once.",
    spaceComplexity: "O(total characters × 26)",
    spaceExplanation: "Each node stores up to 26 children.",
    edgeCases: [
      "Search for word not inserted — returns false.",
      "Search prefix of existing word — startsWith true, search false (isEnd not set).",
    ],
    memoryTrick: "\"Trie = phone autocomplete tree. Each letter is a branch. Full word = reached a marked stop.\"",
  },

  "subsets": {
    intuition:
      "Every element has two choices: include or exclude. This gives 2^n subsets. Backtracking: at each index, decide include/exclude, recurse, undo. Alternative: iterative bit manipulation.",
    approach: [
      "Start with result = [[]] (empty subset).",
      "For each num in nums:",
      "  — For each existing subset in result:",
      "    — Add a new subset = existing + [num].",
      "  — Add all new subsets to result.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result = {{}};
        for (int num : nums) {
            int n = result.size();
            for (int i = 0; i < n; i++) {
                result.push_back(result[i]);
                result.back().push_back(num);
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(n × 2^n)",
    timeExplanation: "2^n subsets, each up to n elements.",
    spaceComplexity: "O(n × 2^n)",
    spaceExplanation: "Storing all subsets.",
    edgeCases: [
      "Empty array — returns [[]] (just the empty set).",
      "Single element — returns [[], [element]].",
    ],
    memoryTrick: "\"Each new number doubles the result. Take everything you have, copy it, add the new number to copies.\"",
  },

  "max-area-island": {
    intuition:
      "Same as number of islands, but instead of counting islands, compute the area of each (by counting cells during DFS). Track the maximum.",
    approach: [
      "For each unvisited '1', run DFS and count cells visited — that's the island area.",
      "Mark visited cells to avoid double-counting.",
      "Track maximum area seen across all islands.",
    ],
    cppSolution: `class Solution {
    int dfs(vector<vector<int>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != 1) return 0;
        grid[i][j] = 0;
        return 1 + dfs(grid, i+1, j) + dfs(grid, i-1, j)
                 + dfs(grid, i, j+1) + dfs(grid, i, j-1);
    }
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int maxArea = 0;
        for (int i = 0; i < (int)grid.size(); i++)
            for (int j = 0; j < (int)grid[0].size(); j++)
                maxArea = max(maxArea, dfs(grid, i, j));
        return maxArea;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited once.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "No land — returns 0.",
      "All land — one island with area m×n.",
    ],
    memoryTrick: "\"DFS returns 1 + size of all 4 neighbors. Think of it as asking each neighbor: how big is your island chunk?\"",
  },

  "ransom-note": {
    intuition:
      "You need to build the ransom note using only letters from the magazine — each magazine letter can be used at most once. This is a frequency-counting problem: count how many of each letter the magazine has, then verify the ransom note never requires more of any letter than the magazine provides.",
    approach: [
      "Create a frequency array of size 26 (one slot per lowercase letter), initialized to 0.",
      "Walk through the magazine: for each character, increment its count (cnt[c - 'a']++).",
      "Walk through the ransom note: for each character, decrement its count (cnt[c - 'a']--).",
      "If the count drops below 0, that letter is used more times than available — return false.",
      "If we finish without any negative count, return true.",
    ],
    cppSolution: `class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        vector<int> cnt(26, 0);
        for (char c : magazine)
            cnt[c - 'a']++;
        for (char c : ransomNote) {
            cnt[c - 'a']--;
            if (cnt[c - 'a'] < 0) return false;
        }
        return true;
    }
};`,
    timeComplexity: "O(m + n)",
    timeExplanation: "One pass through magazine (length m) and one pass through ransomNote (length n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed-size array of 26 integers — never grows with input size.",
    edgeCases: [
      "Ransom note longer than magazine — guaranteed false (not enough letters).",
      "Empty ransom note — trivially true, loop never executes.",
      "Repeated letters — cnt tracks exact counts, handles all repetitions correctly.",
      "Magazine has all same letter — e.g. magazine=\"aaa\", note=\"ab\" → false because 'b' count goes negative.",
    ],
    memoryTrick: "\"Magazine is your wallet. Each letter is a dollar. Ransom note is your shopping list. If you ever go into debt (negative count), you can't afford it.\"",
  },

  "isomorphic-strings": {
    intuition:
      "Isomorphic means there's a consistent one-to-one character mapping from s to t. Key insight: the mapping must be a bijection — not just s[i] always maps to the same t[i], but also t[i] always maps back to the same s[i]. Without the reverse check, 'foo' → 'bar' would pass (f→b, o→a, o→r fails) but 'ab' → 'aa' would wrongly pass (a→a, b→a: two letters mapping to same letter is NOT isomorphic).",
    approach: [
      "Create two maps: st (s char → t char) and ts (t char → s char).",
      "Walk both strings simultaneously at index i.",
      "If st already maps s[i] but st[s[i]] ≠ t[i] — inconsistent forward mapping, return false.",
      "If ts already maps t[i] but ts[t[i]] ≠ s[i] — inconsistent reverse mapping (collision), return false.",
      "Otherwise record both mappings: st[s[i]] = t[i] and ts[t[i]] = s[i].",
      "If we complete the loop without contradiction, return true.",
    ],
    cppSolution: `class Solution {
public:
    bool isIsomorphic(string s, string t) {
        unordered_map<char, char> st, ts;
        for (int i = 0; i < (int)s.size(); i++) {
            if (st.count(s[i]) && st[s[i]] != t[i]) return false;
            if (ts.count(t[i]) && ts[t[i]] != s[i]) return false;
            st[s[i]] = t[i];
            ts[t[i]] = s[i];
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through both strings of length n.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Maps store at most 256 distinct ASCII characters — bounded constant regardless of input length.",
    edgeCases: [
      "\"paper\" / \"title\" → true (p↔t, a↔i, e↔l, r↔e).",
      "\"foo\" / \"bar\" → false (o maps to a first, then tries to map to r — contradiction).",
      "\"ab\" / \"aa\" → false (ts catches it: 'a' in t already maps back to 'a' in s, but now s[1]='b' ≠ 'a').",
      "Single character strings — always true.",
      "Both strings empty — trivially true.",
    ],
    memoryTrick: "\"It's a marriage contract — must be faithful both ways. s commits to t AND t commits back to s. One-sided loyalty fails: two people can't marry the same person.\"",
  },
};

// Merged: generated base + rich overrides + python solutions
const withPython = Object.fromEntries(
  Object.entries({ ...GENERATED_CONTENT, ...RICH_OVERRIDES }).map(([id, content]) => [
    id,
    { ...content, pythonSolution: PYTHON_SOLUTIONS[id] ?? content.pythonSolution },
  ])
);
export const PROBLEM_CONTENT = withPython;
