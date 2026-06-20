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

  "container-water": {
    intuition: "Two-pointer from both ends. The water height is limited by the shorter wall. To potentially find more water, move the shorter pointer inward — moving the taller one can only make things worse.",
    approach: [
      "Place left pointer at index 0, right pointer at last index.",
      "Compute area = min(height[left], height[right]) × (right − left).",
      "Update maxArea if larger.",
      "Move the pointer at the shorter wall inward (it's the bottleneck).",
      "Repeat until pointers meet.",
    ],
    cppSolution: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, best = 0;
        while (l < r) {
            best = max(best, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, two pointers meet in middle.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two pointers and a max variable.",
    edgeCases: [
      "Two elements — only one possible container.",
      "All same height — area decreases as width shrinks; picks largest first.",
    ],
    memoryTrick: "\"Move the short wall inward — the tall wall can't help if the short one limits you.\"",
  },

  "product-except-self": {
    intuition: "For each index i, the answer is (product of all elements left of i) × (product of all elements right of i). Compute prefix products left-to-right, then multiply suffix products right-to-left — no division needed.",
    approach: [
      "Initialize result array with all 1s.",
      "Left pass: result[i] = product of all elements before i. Running left product, multiply into result[i] then update.",
      "Right pass: running right product, multiply into result[i] then update.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        int left = 1;
        for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes through array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Output array doesn't count as extra space per problem rules.",
    edgeCases: [
      "Array contains zero — output is zero for all non-zero positions, product-of-others for the zero position.",
      "Two zeros — entire output is zeros.",
    ],
    memoryTrick: "\"Left pass fills prefix, right pass multiplies suffix in-place. Two runners: one going right, one left.\"",
  },

  "three-sum": {
    intuition: "Sort the array, then for each element use two pointers on the rest. Sorting lets us skip duplicates and use the two-pointer squeeze trick from Two Sum II.",
    approach: [
      "Sort the array.",
      "For each index i (skip duplicates: if i > 0 && nums[i] == nums[i-1], continue):",
      "  — Set left = i+1, right = n-1.",
      "  — While left < right: compute sum = nums[i] + nums[left] + nums[right].",
      "  — If sum == 0: add to result, skip duplicate lefts and rights, advance both pointers.",
      "  — If sum < 0: left++. If sum > 0: right--.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = (int)nums.size() - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Outer loop O(n), inner two-pointer O(n) each = O(n²).",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space beyond output.",
    edgeCases: [
      "All zeros — [0,0,0] is valid, dedupe handled.",
      "No valid triplet — return empty.",
    ],
    memoryTrick: "\"Sort + fix one + two pointers on rest. Duplicate skipping: skip when current == previous at same level.\"",
  },

  "two-sum-ii": {
    intuition: "Array is sorted. Use two pointers from both ends. If sum too big move right inward, if too small move left outward. Guaranteed one solution.",
    approach: [
      "left = 0, right = n-1.",
      "While left < right: sum = numbers[left] + numbers[right].",
      "If sum == target: return {left+1, right+1} (1-indexed).",
      "If sum < target: left++. If sum > target: right--.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l = 0, r = (int)numbers.size() - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return {l + 1, r + 1};
            else if (s < target) l++;
            else r--;
        }
        return {};
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, pointers meet in middle.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers only.",
    edgeCases: [
      "Minimum array size (2 elements) — single check.",
      "Answer at ends — found immediately.",
    ],
    memoryTrick: "\"Sorted = two pointer. Sum too big? Shrink right. Sum too small? Grow left.\"",
  },

  "valid-palindrome": {
    intuition: "Two pointers from both ends. Skip non-alphanumeric characters, compare lowercased chars. If any mismatch, not palindrome.",
    approach: [
      "left = 0, right = n-1.",
      "While left < right: skip non-alphanumeric on both sides.",
      "Compare tolower(s[left]) with tolower(s[right]).",
      "If different: return false. Else advance both.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = (int)s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each character visited at most once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two pointers.",
    edgeCases: [
      "Empty string or all non-alphanumeric — true (vacuously palindrome).",
      "Single character — true.",
      "Mixed case: 'A' == 'a' after tolower.",
    ],
    memoryTrick: "\"Skip junk, compare letters only. isalnum + tolower are your filters.\"",
  },

  "longest-consecutive": {
    intuition: "Put all numbers in a hash set. For each number that is the START of a sequence (n-1 not in set), count how long the consecutive run is. This ensures O(n) — each number is the start of at most one sequence.",
    approach: [
      "Insert all numbers into unordered_set.",
      "For each number n: if (n-1) is in the set, skip (not a sequence start).",
      "Otherwise count streak: while (n+streak) is in set, increment streak.",
      "Update maxStreak.",
      "Return maxStreak.",
    ],
    cppSolution: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int best = 0;
        for (int n : s) {
            if (s.count(n - 1)) continue;
            int streak = 1;
            while (s.count(n + streak)) streak++;
            best = max(best, streak);
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each number is counted in exactly one streak.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Hash set stores all n numbers.",
    edgeCases: [
      "Empty array — return 0.",
      "All same number — streak = 1.",
      "Duplicates — set deduplication handles them.",
    ],
    memoryTrick: "\"Only start counting from sequence beginnings (n-1 missing). Skips re-counting middle/end elements.\"",
  },

  "move-zeroes": {
    intuition: "Two-pointer in-place. One pointer (insert) tracks where next non-zero goes. Walk the array — when non-zero found, swap it to insert position, advance both.",
    approach: [
      "insert = 0.",
      "For each i: if nums[i] != 0, swap(nums[insert], nums[i]), insert++.",
      "After loop, all non-zeros at front in order, zeros at end.",
    ],
    cppSolution: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int insert = 0;
        for (int i = 0; i < (int)nums.size(); i++)
            if (nums[i] != 0) swap(nums[insert++], nums[i]);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place.",
    edgeCases: [
      "No zeros — insert pointer walks same as i, swapping with itself.",
      "All zeros — insert stays 0, no swaps.",
    ],
    memoryTrick: "\"Insert pointer is the next empty seat. Non-zero jumps to it. Zeros fall to back naturally.\"",
  },

  "longest-repeating-replacement": {
    intuition: "Sliding window. Key insight: window is valid if (window size − count of most frequent char) ≤ k. We can replace the minority chars. Expand right always, shrink left when invalid.",
    approach: [
      "left = 0, maxCount = 0, freq map.",
      "For each right: increment freq[s[right]], update maxCount = max(maxCount, freq[s[right]]).",
      "While (right - left + 1) - maxCount > k: decrement freq[s[left]], left++.",
      "Update answer = max(ans, right - left + 1).",
    ],
    cppSolution: `class Solution {
public:
    int characterReplacement(string s, int k) {
        int cnt[26] = {}, maxCnt = 0, left = 0, ans = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            maxCnt = max(maxCnt, ++cnt[s[r] - 'A']);
            while ((r - left + 1) - maxCnt > k) cnt[s[left++] - 'A']--;
            ans = max(ans, r - left + 1);
        }
        return ans;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each character added and removed at most once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed 26-char frequency array.",
    edgeCases: [
      "k >= n — entire string valid, return n.",
      "All same chars — maxCount = window size, always valid.",
    ],
    memoryTrick: "\"Window valid when (size - dominant char count) ≤ k. Minority chars are the ones we replace.\"",
  },

  "permutation-in-string": {
    intuition: "Fixed-size sliding window of length len(s1). Check if character frequencies in window match s1's frequencies. Slide window across s2.",
    approach: [
      "Count frequencies of s1 chars in array need[26].",
      "Maintain window frequency have[26] for window of size len(s1) in s2.",
      "Slide: at each step add s2[r], remove s2[r - s1.size()] if window too big.",
      "Compare need == have each step.",
    ],
    cppSolution: `class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.size() > s2.size()) return false;
        int need[26] = {}, have[26] = {};
        for (char c : s1) need[c - 'a']++;
        int k = s1.size();
        for (int i = 0; i < (int)s2.size(); i++) {
            have[s2[i] - 'a']++;
            if (i >= k) have[s2[i - k] - 'a']--;
            if (memcmp(need, have, sizeof(need)) == 0) return true;
        }
        return false;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, each comparison O(26) = O(1).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two fixed-size 26-element arrays.",
    edgeCases: [
      "s1 longer than s2 — return false immediately.",
      "s2 == s1 — window exactly matches.",
    ],
    memoryTrick: "\"Fixed window = anagram check. Slide and compare freq arrays.\"",
  },

  "min-window-substring": {
    intuition: "Sliding window with variable size. Expand right to include needed chars, contract left to minimize window once all chars are covered. Track 'formed' count — how many unique chars satisfy required frequency.",
    approach: [
      "Build need map from t. formed = 0, required = need.size().",
      "Expand r: add s[r] to window, if window[s[r]] == need[s[r]] increment formed.",
      "While formed == required: update answer, contract l: remove s[l] from window, if window[s[l]] < need[s[l]] decrement formed.",
      "Return best window.",
    ],
    cppSolution: `class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char,int> need, have;
        for (char c : t) need[c]++;
        int formed = 0, req = need.size(), l = 0, best = INT_MAX, bl = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            have[s[r]]++;
            if (need.count(s[r]) && have[s[r]] == need[s[r]]) formed++;
            while (formed == req) {
                if (r - l + 1 < best) { best = r - l + 1; bl = l; }
                if (need.count(s[l]) && --have[s[l]] < need[s[l]]) formed--;
                have[s[l++]]--;
                if (!have.count(s[l-1]) || have[s[l-1]] == 0) have.erase(s[l-1]);
            }
        }
        return best == INT_MAX ? "" : s.substr(bl, best);
    }
};`,
    timeComplexity: "O(|s| + |t|)",
    timeExplanation: "Each char in s added and removed at most once.",
    spaceComplexity: "O(|s| + |t|)",
    spaceExplanation: "Two hashmaps bounded by unique chars in s and t.",
    edgeCases: [
      "t not in s — return empty string.",
      "t longer than s — impossible, return \"\".",
      "Duplicate chars in t — need map counts multiplicity.",
    ],
    memoryTrick: "\"Expand until covered, shrink until broken. 'formed' tracks when all t-chars are satisfied.\"",
  },

  "sliding-window-max": {
    intuition: "Use a monotonic deque (decreasing). Back of deque is always the index of the current max. When sliding, pop front if out of window, pop back if new element is larger (they're useless now).",
    approach: [
      "Use deque storing indices. Maintain decreasing order of values.",
      "For each i: pop front if deque front < i - k + 1 (out of window).",
      "Pop back while nums[back] <= nums[i] (current element dominates).",
      "Push i to back.",
      "When i >= k-1: result.push_back(nums[deque.front()]).",
    ],
    cppSolution: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> res;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) res.push_back(nums[dq.front()]);
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each element added and removed from deque at most once.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Deque holds at most k indices.",
    edgeCases: [
      "k = 1 — each element is its own window max.",
      "k = n — single window, max of entire array.",
    ],
    memoryTrick: "\"Monotonic deque = decreasing queue. New element kills smaller predecessors. Front is always the king of the window.\"",
  },

  "max-points-cards": {
    intuition: "You take k cards from left or right end. Total = fixed sum of k cards. Equivalently: maximize sum of k cards from ends = total_sum − minimize sum of middle (n−k) subarray. Use sliding window of size n−k.",
    approach: [
      "Compute totalSum of all k cards you'd take from left initially.",
      "Slide a window of size (n−k) across the middle, tracking minimum window sum.",
      "Answer = totalSum − minWindowSum.",
    ],
    cppSolution: `class Solution {
public:
    int maxScore(vector<int>& cardPoints, int k) {
        int n = cardPoints.size(), windowSize = n - k;
        int windowSum = 0;
        for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
        int minWindow = windowSum;
        for (int i = windowSize; i < n; i++) {
            windowSum += cardPoints[i] - cardPoints[i - windowSize];
            minWindow = min(minWindow, windowSum);
        }
        int total = 0;
        for (int x : cardPoints) total += x;
        return total - minWindow;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant extra variables.",
    edgeCases: [
      "k = n — take all cards, return total sum.",
      "k = 0 — return 0 (no cards taken).",
    ],
    memoryTrick: "\"Taking k from ends = leaving n−k in middle. Maximize taken = minimize left-behind window.\"",
  },

  "encode-decode-strings": {
    intuition: "Encode each string as its length followed by '#' followed by the string. Decode by reading length, skipping '#', reading that many chars.",
    approach: [
      "Encode: for each s, append to_string(s.size()) + '#' + s.",
      "Decode: parse length (read until '#'), then read exactly that many chars for the string.",
    ],
    cppSolution: `class Codec {
public:
    string encode(vector<string>& strs) {
        string res;
        for (auto& s : strs) res += to_string(s.size()) + '#' + s;
        return res;
    }
    vector<string> decode(string s) {
        vector<string> res;
        int i = 0;
        while (i < (int)s.size()) {
            int j = i;
            while (s[j] != '#') j++;
            int len = stoi(s.substr(i, j - i));
            res.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each character processed once in both encode and decode.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Output string/array proportional to total chars.",
    edgeCases: [
      "Empty string in list — encoded as '0#', decoded back to empty string.",
      "String containing '#' — length prefix makes '#' unambiguous as delimiter.",
    ],
    memoryTrick: "\"Length + '#' prefix. '5#hello' → read 5, skip '#', take 5 chars. '#' in data doesn't confuse because we read by count.\"",
  },

  "valid-sudoku": {
    intuition: "Each row, column, and 3×3 box must contain digits 1-9 with no repetition. Use sets (or bit arrays) to track seen digits. Box index = (row/3)*3 + col/3.",
    approach: [
      "Three 9-element arrays of sets: rows[9], cols[9], boxes[9].",
      "For each cell (i,j): if '.', skip.",
      "Box index = (i/3)*3 + j/3.",
      "If digit already in rows[i], cols[j], or boxes[box]: return false.",
      "Otherwise add digit to all three.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        unordered_set<char> rows[9], cols[9], boxes[9];
        for (int i = 0; i < 9; i++)
            for (int j = 0; j < 9; j++) {
                char c = board[i][j];
                if (c == '.') continue;
                int box = (i / 3) * 3 + j / 3;
                if (rows[i].count(c) || cols[j].count(c) || boxes[box].count(c))
                    return false;
                rows[i].insert(c); cols[j].insert(c); boxes[box].insert(c);
            }
        return true;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "Board is always 9×9 = 81 cells — fixed size.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed 27 sets with at most 9 chars each.",
    edgeCases: [
      "Partially filled board — only non-'.' cells are checked.",
      "Box index formula (i/3)*3 + j/3 maps 9 boxes correctly.",
    ],
    memoryTrick: "\"Three constraints: row, col, box. Box index = (row/3)*3 + col/3. If any duplicate → invalid.\"",
  },

  "rotate-image": {
    intuition: "Rotate 90° clockwise = transpose then reverse each row. Transpose: swap matrix[i][j] with matrix[j][i]. Reverse rows: standard reversal.",
    approach: [
      "Transpose: for i in [0,n): for j in [i+1,n): swap(matrix[i][j], matrix[j][i]).",
      "Reverse each row: for each row, reverse(row.begin(), row.end()).",
    ],
    cppSolution: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(matrix[i][j], matrix[j][i]);
        for (auto& row : matrix)
            reverse(row.begin(), row.end());
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Every cell visited twice.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place rotation.",
    edgeCases: [
      "1×1 matrix — trivially unchanged.",
      "2×2 — verify: [[1,2],[3,4]] → [[3,1],[4,2]].",
    ],
    memoryTrick: "\"Transpose + reverse rows = 90° CW. Counter-clockwise = reverse rows first, then transpose.\"",
  },

  "spiral-matrix": {
    intuition: "Maintain four boundaries: top, bottom, left, right. Traverse right → down → left → up, shrinking the boundary after each direction.",
    approach: [
      "top=0, bottom=m-1, left=0, right=n-1.",
      "While top<=bottom and left<=right:",
      "  — Left→right along top row, then top++.",
      "  — Top→bottom along right col, then right--.",
      "  — Right→left along bottom row (if top<=bottom), then bottom--.",
      "  — Bottom→top along left col (if left<=right), then left++.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int top = 0, bot = matrix.size()-1, l = 0, r = matrix[0].size()-1;
        while (top <= bot && l <= r) {
            for (int i = l; i <= r; i++) res.push_back(matrix[top][i]); top++;
            for (int i = top; i <= bot; i++) res.push_back(matrix[i][r]); r--;
            if (top <= bot) { for (int i = r; i >= l; i--) res.push_back(matrix[bot][i]); bot--; }
            if (l <= r) { for (int i = bot; i >= top; i--) res.push_back(matrix[i][l]); l++; }
        }
        return res;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited exactly once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Output array excluded, only boundary variables.",
    edgeCases: [
      "Single row — only rightward pass, top++ makes top > bot immediately.",
      "Single column — only downward pass.",
    ],
    memoryTrick: "\"Four walls closing in. Right→Down→Left→Up, shrink wall after each direction.\"",
  },

  "set-matrix-zeroes": {
    intuition: "If cell (i,j) is 0, mark entire row i and col j as zero. Naively scanning and modifying causes cascading false zeros. Solution: first record which rows/cols need zeroing, then apply.",
    approach: [
      "Scan matrix: collect set of zero rows and zero cols.",
      "Second pass: if row in zeroRows or col in zeroCols, set to 0.",
      "O(1) space variant: use first row and first col as markers (handle them carefully).",
    ],
    cppSolution: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstRow = false, firstCol = false;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstCol = true;
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) { matrix[i][0] = matrix[0][j] = 0; }
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (!matrix[i][0] || !matrix[0][j]) matrix[i][j] = 0;
        if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Two passes through the matrix.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Using first row/col as markers.",
    edgeCases: [
      "First row/col contains zero — need firstRow/firstCol flags to avoid overwriting markers.",
      "No zeros — matrix unchanged.",
    ],
    memoryTrick: "\"Use first row+col as scratch markers. But save whether first row/col themselves had zeros before using them.\"",
  },

  "is-subsequence": {
    intuition: "Walk both strings with two pointers. When chars match advance both; otherwise advance only the t pointer. If s pointer reaches end, s is a subsequence.",
    approach: [
      "i = 0 (pointer in s), j = 0 (pointer in t).",
      "While i < s.size() and j < t.size(): if s[i] == t[j], i++. Always j++.",
      "Return i == s.size().",
    ],
    cppSolution: `class Solution {
public:
    bool isSubsequence(string s, string t) {
        int i = 0, j = 0;
        while (i < (int)s.size() && j < (int)t.size()) {
            if (s[i] == t[j]) i++;
            j++;
        }
        return i == (int)s.size();
    }
};`,
    timeComplexity: "O(|t|)",
    timeExplanation: "Walk t once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers.",
    edgeCases: [
      "Empty s — trivially true (empty string is subsequence of anything).",
      "s longer than t — impossible, returns false.",
    ],
    memoryTrick: "\"Hungry pointer in s eats matching chars from t. If s pointer finishes, success.\"",
  },

  "reverse-polish": {
    intuition: "Stack-based evaluation. Numbers push onto stack. Operators pop two operands, compute, push result. Final stack top is the answer.",
    approach: [
      "For each token:",
      "  — If number: push to stack.",
      "  — If operator: pop b then a (order matters for - and /), push a op b.",
      "Return stack.top().",
    ],
    cppSolution: `class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<long long> st;
        for (auto& t : tokens) {
            if (t == "+" || t == "-" || t == "*" || t == "/") {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                if (t == "+") st.push(a + b);
                else if (t == "-") st.push(a - b);
                else if (t == "*") st.push(a * b);
                else st.push(a / b);
            } else st.push(stoll(t));
        }
        return st.top();
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each token processed once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack holds at most n/2 numbers.",
    edgeCases: [
      "Negative numbers in input — stoll handles them.",
      "Pop order: b = top (second operand), a = next (first operand). Matters for subtraction and division.",
    ],
    memoryTrick: "\"Stack calculator. Number → push. Operator → pop two, compute, push back. Pop b before a.\"",
  },

  "min-stack": {
    intuition: "Maintain two stacks: main stack and a min-tracking stack. Min stack stores the current minimum at each level. When pushing x, push min(x, minStack.top()) to minStack.",
    approach: [
      "push(x): main.push(x), minStack.push(min(x, minStack.empty() ? x : minStack.top())).",
      "pop(): main.pop(), minStack.pop().",
      "top(): return main.top().",
      "getMin(): return minStack.top().",
    ],
    cppSolution: `class MinStack {
    stack<int> st, minSt;
public:
    void push(int val) {
        st.push(val);
        minSt.push(minSt.empty() ? val : min(val, minSt.top()));
    }
    void pop() { st.pop(); minSt.pop(); }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "All operations constant time.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Two stacks of size n.",
    edgeCases: [
      "Push same value multiple times — minStack tracks correctly since it stores current min per level.",
    ],
    memoryTrick: "\"Shadow stack tracks min. Each push records 'what's the min including me'. Pop both together.\"",
  },

  "daily-temperatures": {
    intuition: "Monotonic stack (decreasing). For each temperature, pop all stack entries with smaller temperatures — those found their 'next warmer day'. Push current index. Unpopped entries never find a warmer day.",
    approach: [
      "Initialize answer array with zeros, stack of indices.",
      "For each i: while stack not empty and temps[stack.top()] < temps[i]: pop j, set ans[j] = i - j.",
      "Push i onto stack.",
      "Return ans.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
                int j = st.top(); st.pop();
                ans[j] = i - j;
            }
            st.push(i);
        }
        return ans;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each index pushed and popped at most once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack holds indices.",
    edgeCases: [
      "Strictly decreasing temps — nothing popped, all answers stay 0.",
      "Last day — never popped (no future), stays 0.",
    ],
    memoryTrick: "\"Waiting list for warmer weather. Hotter day arrives → resolve all waiting colder days.\"",
  },

  "decode-string": {
    intuition: "Use a stack. When encountering '[', push current string and count onto stack. When ']', pop and repeat current string count times. Build string character by character.",
    approach: [
      "curr = \"\", k = 0, stack of (string, int).",
      "Digit: k = k*10 + digit.",
      "'[': push (curr, k), reset curr = \"\", k = 0.",
      "']': pop (prev, count), curr = prev + curr*count.",
      "Letter: curr += c.",
      "Return curr.",
    ],
    cppSolution: `class Solution {
public:
    string decodeString(string s) {
        stack<pair<string,int>> st;
        string curr;
        int k = 0;
        for (char c : s) {
            if (isdigit(c)) k = k * 10 + (c - '0');
            else if (c == '[') { st.push({curr, k}); curr = ""; k = 0; }
            else if (c == ']') {
                auto [prev, cnt] = st.top(); st.pop();
                string rep;
                for (int i = 0; i < cnt; i++) rep += curr;
                curr = prev + rep;
            } else curr += c;
        }
        return curr;
    }
};`,
    timeComplexity: "O(n × max_k)",
    timeExplanation: "Total output length can be exponential in k values.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack depth bounded by nesting level.",
    edgeCases: [
      "Multi-digit k (e.g., '10[a]') — handled by k = k*10 + digit.",
      "Nested: '2[3[a]]' → '2[aaa]' → 'aaaaaa'.",
    ],
    memoryTrick: "\"Stack saves 'what came before the bracket'. On ']', pop and repeat current string k times, prepend saved.\"",
  },

  "generate-parentheses": {
    intuition: "Backtracking with two counters: open (# of '(' added) and close (# of ')' added). Rule: can add '(' if open < n. Can add ')' if close < open. Recursion builds valid combos.",
    approach: [
      "Recurse with (current_string, open_count, close_count).",
      "Base: if len == 2n, add to result.",
      "If open < n: add '(' and recurse.",
      "If close < open: add ')' and recurse.",
    ],
    cppSolution: `class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res;
        function<void(string,int,int)> bt = [&](string s, int open, int close) {
            if ((int)s.size() == 2 * n) { res.push_back(s); return; }
            if (open < n) bt(s + "(", open + 1, close);
            if (close < open) bt(s + ")", open, close + 1);
        };
        bt("", 0, 0);
        return res;
    }
};`,
    timeComplexity: "O(4ⁿ / √n)",
    timeExplanation: "Catalan number of valid combinations.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion depth 2n.",
    edgeCases: [
      "n=1 — returns ['()'].",
      "n=0 — returns [''].",
    ],
    memoryTrick: "\"Two rules: open < n (can open bracket), close < open (can close bracket). Violate either = invalid.\"",
  },

  "car-fleet": {
    intuition: "Sort cars by starting position descending (closest to target first). Calculate time for each car to reach target. If a car behind reaches target faster than car ahead, it merges into that fleet.",
    approach: [
      "Pair positions and speeds, sort by position descending.",
      "For each car compute time = (target - pos) / speed.",
      "Use a stack: if time > stack top, it's a new fleet (push). Otherwise merges with fleet ahead (skip).",
      "Stack size = number of fleets.",
    ],
    cppSolution: `class Solution {
public:
    int carFleet(int target, vector<int>& position, vector<int>& speed) {
        int n = position.size();
        vector<pair<int,int>> cars(n);
        for (int i = 0; i < n; i++) cars[i] = {position[i], speed[i]};
        sort(cars.rbegin(), cars.rend());
        stack<double> st;
        for (auto& [p, s] : cars) {
            double t = (double)(target - p) / s;
            if (st.empty() || t > st.top()) st.push(t);
        }
        return st.size();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorting dominates.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack of arrival times.",
    edgeCases: [
      "Single car — one fleet.",
      "All cars same speed — each arrives at same time, forms one fleet.",
    ],
    memoryTrick: "\"Sort closest-to-target first. Slower car ahead = blocker. Faster car behind merges into it (can't pass).\"",
  },

  "asteroid-collision": {
    intuition: "Stack simulation. Positive asteroids move right, negative move left. Collision only when positive asteroid is on stack and incoming asteroid is negative. Larger absolute value wins; equal = both destroyed.",
    approach: [
      "For each asteroid a:",
      "  — If a > 0 or stack empty or stack top < 0: push (no collision).",
      "  — Else simulate collision: while stack top > 0 and -a > stack.top(): pop (destroyed). If stack.top() == -a: pop both (alive=false). If stack.top() > -a: a destroyed (alive=false).",
      "  — If alive: push a.",
      "Return stack contents.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        stack<int> st;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !st.empty() && st.top() > 0) {
                if (st.top() < -a) st.pop();
                else if (st.top() == -a) { st.pop(); alive = false; }
                else alive = false;
            }
            if (alive) st.push(a);
        }
        vector<int> res;
        while (!st.empty()) { res.push_back(st.top()); st.pop(); }
        reverse(res.begin(), res.end());
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each asteroid pushed and popped at most once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack holds survivors.",
    edgeCases: [
      "Two asteroids same size opposite direction — both destroyed.",
      "All positive or all negative — no collisions.",
    ],
    memoryTrick: "\"Stack of rightward asteroids. Leftward incoming destroys smaller ones. Equal = mutual destruction.\"",
  },

  "add-two-numbers": {
    intuition: "Simulate column-by-column addition with carry. Walk both lists simultaneously. Sum = l1->val + l2->val + carry. New digit = sum % 10. New carry = sum / 10. Continue until both lists exhausted AND carry is 0.",
    approach: [
      "Dummy head node for easy result construction.",
      "carry = 0, iterate while l1 || l2 || carry.",
      "sum = carry + (l1 ? l1->val : 0) + (l2 ? l2->val : 0).",
      "Append new node with sum % 10, carry = sum / 10.",
      "Advance l1, l2 if not null.",
      "Return dummy.next.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* cur = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = carry;
            if (l1) { sum += l1->val; l1 = l1->next; }
            if (l2) { sum += l2->val; l2 = l2->next; }
            carry = sum / 10;
            cur->next = new ListNode(sum % 10);
            cur = cur->next;
        }
        return dummy.next;
    }
};`,
    timeComplexity: "O(max(m, n))",
    timeExplanation: "Walk longer list length.",
    spaceComplexity: "O(max(m, n))",
    spaceExplanation: "Result list has max(m,n)+1 nodes.",
    edgeCases: [
      "Lists different lengths — shorter list treated as 0 after exhaustion.",
      "Final carry — e.g., 9+1=10 produces extra node '1'.",
    ],
    memoryTrick: "\"Column addition on linked lists. Carry is the 'overflow' digit. Loop while either list has digits OR carry remains.\"",
  },

  "merge-two-sorted": {
    intuition: "Two pointers, one per list. Compare front nodes, attach smaller to result, advance that pointer. Attach remaining list after loop.",
    approach: [
      "Dummy head for easy construction.",
      "While both l1 and l2 non-null: attach smaller, advance that pointer.",
      "Attach remaining non-null list.",
      "Return dummy.next.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* cur = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
            else { cur->next = l2; l2 = l2->next; }
            cur = cur->next;
        }
        cur->next = l1 ? l1 : l2;
        return dummy.next;
    }
};`,
    timeComplexity: "O(m + n)",
    timeExplanation: "Each node visited once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place relinking, no new nodes.",
    edgeCases: [
      "One or both lists empty — works correctly, attaches non-null.",
      "Equal values — either pointer chosen, stable.",
    ],
    memoryTrick: "\"Two queues, always pick smaller front. Attach remaining tail when one runs out.\"",
  },

  "remove-nth-node": {
    intuition: "Two-pointer gap trick. Advance fast pointer n+1 steps ahead of slow. When fast reaches null, slow is right before the node to remove.",
    approach: [
      "Dummy head pointing to head.",
      "fast = dummy, slow = dummy.",
      "Advance fast n+1 times.",
      "While fast != null: advance both.",
      "slow->next = slow->next->next.",
      "Return dummy.next.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* fast = &dummy, *slow = &dummy;
        for (int i = 0; i <= n; i++) fast = fast->next;
        while (fast) { fast = fast->next; slow = slow->next; }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,
    timeComplexity: "O(L)",
    timeExplanation: "Single pass through list.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers.",
    edgeCases: [
      "Remove head (n = list length) — dummy node handles this naturally.",
      "Single element list, n=1 — removes it, returns null.",
    ],
    memoryTrick: "\"Fast starts n+1 ahead. When fast falls off, slow is before the target. Skip target: slow->next = slow->next->next.\"",
  },

  "reorder-list": {
    intuition: "Three-step: 1) Find middle. 2) Reverse second half. 3) Merge two halves alternately.",
    approach: [
      "Find middle using slow/fast pointers.",
      "Reverse second half in-place.",
      "Merge: alternate nodes from first half and reversed second half.",
    ],
    cppSolution: `class Solution {
public:
    void reorderList(ListNode* head) {
        // Find middle
        ListNode* slow = head, *fast = head;
        while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
        // Reverse second half
        ListNode* prev = nullptr, *cur = slow->next;
        slow->next = nullptr;
        while (cur) { ListNode* nx = cur->next; cur->next = prev; prev = cur; cur = nx; }
        // Merge
        ListNode* l1 = head, *l2 = prev;
        while (l2) {
            ListNode* n1 = l1->next, *n2 = l2->next;
            l1->next = l2; l2->next = n1;
            l1 = n1; l2 = n2;
        }
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Three linear passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place pointer manipulation.",
    edgeCases: [
      "Even/odd length — middle detection handles both.",
      "Two nodes — reorder is trivial, no change.",
    ],
    memoryTrick: "\"Find middle → reverse tail → weave. Like folding a list in half and interleaving.\"",
  },

  "palindrome-linked-list": {
    intuition: "Find middle, reverse second half, compare with first half. O(1) space. Optionally restore the list afterward.",
    approach: [
      "Find middle with slow/fast pointers.",
      "Reverse from middle+1 to end.",
      "Compare left half and reversed right half node by node.",
    ],
    cppSolution: `class Solution {
    ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) { auto nx = head->next; head->next = prev; prev = head; head = nx; }
        return prev;
    }
public:
    bool isPalindrome(ListNode* head) {
        ListNode* slow = head, *fast = head;
        while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
        ListNode* right = reverse(slow);
        ListNode* left = head, *tmp = right;
        bool ok = true;
        while (tmp) { if (left->val != tmp->val) { ok = false; break; } left = left->next; tmp = tmp->next; }
        reverse(right);
        return ok;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Three linear passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place reverse.",
    edgeCases: [
      "Single node — palindrome.",
      "Two nodes — compare directly.",
      "Even length — slow stops at second-of-middle, correct.",
    ],
    memoryTrick: "\"Middle → reverse tail → compare. Like checking palindrome from both ends simultaneously.\"",
  },

  "reverse-k-group": {
    intuition: "Iteratively reverse chunks of k nodes. For each group: check k nodes exist, reverse them, relink to previous group's tail and next group's head.",
    approach: [
      "Dummy head. prev = dummy.",
      "Find kth node from current. If fewer than k remain, stop.",
      "Reverse k nodes: standard reverse, returns new head and old head (new tail).",
      "Link prev->next to new head, new tail to next group.",
      "Advance prev to new tail.",
    ],
    cppSolution: `class Solution {
    ListNode* getKth(ListNode* cur, int k) {
        while (cur && k-- > 0) cur = cur->next;
        return cur;
    }
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode* groupPrev = &dummy;
        while (true) {
            ListNode* kth = getKth(groupPrev, k);
            if (!kth) break;
            ListNode* groupNext = kth->next;
            ListNode* prev = groupNext, *cur = groupPrev->next;
            while (cur != groupNext) { auto nx = cur->next; cur->next = prev; prev = cur; cur = nx; }
            ListNode* tmp = groupPrev->next;
            groupPrev->next = kth;
            groupPrev = tmp;
        }
        return dummy.next;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node reversed once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place.",
    edgeCases: [
      "Last group < k nodes — left as-is.",
      "k=1 — no reversal, return original.",
    ],
    memoryTrick: "\"Find kth node → reverse group using groupNext as sentinel → relink → repeat.\"",
  },

  "copy-list-random": {
    intuition: "Three-pass approach using the original list as a hash map. 1) Interleave clones between originals. 2) Set random pointers. 3) Separate lists.",
    approach: [
      "Pass 1: for each node, insert clone right after it: A→A'→B→B'→...",
      "Pass 2: for each original node A, if A.random = X, set A'.random = X.next (X's clone).",
      "Pass 3: detach clones by relinking.",
    ],
    cppSolution: `class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        for (Node* cur = head; cur; cur = cur->next->next) {
            Node* clone = new Node(cur->val);
            clone->next = cur->next;
            cur->next = clone;
        }
        for (Node* cur = head; cur; cur = cur->next->next)
            if (cur->random) cur->next->random = cur->random->next;
        Node dummy(0);
        Node* res = &dummy, *cur = head;
        while (cur) {
            res->next = cur->next;
            cur->next = cur->next->next;
            res = res->next; cur = cur->next;
        }
        return dummy.next;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Three passes, each O(n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra map — uses interleaving trick.",
    edgeCases: [
      "Node with null random — clone's random stays null.",
      "Random points to self — works since clone is right next to original.",
    ],
    memoryTrick: "\"Weave clones into original list. Clone's random = original's random's next. Then separate.\"",
  },

  "swap-pairs": {
    intuition: "Recursively (or iteratively) swap every two adjacent nodes. For recursive: swap first two, recurse on rest, relink.",
    approach: [
      "Base: if head null or head->next null, return head.",
      "second = head->next.",
      "head->next = swapPairs(second->next).",
      "second->next = head.",
      "Return second.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* second = head->next;
        head->next = swapPairs(second->next);
        second->next = head;
        return second;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion stack depth n/2.",
    edgeCases: [
      "Odd length — last single node unchanged.",
      "Single node — returned as-is.",
    ],
    memoryTrick: "\"Swap head with next, recurse on rest. Second becomes new head of pair.\"",
  },

  "level-order-traversal": {
    intuition: "BFS with level separation. Track queue size at start of each level to know when one level ends and next begins.",
    approach: [
      "Queue starting with root.",
      "While queue not empty: sz = queue.size(), process exactly sz nodes (one full level).",
      "Collect values in level vector, enqueue children.",
      "Append level to result.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        if (!root) return {};
        vector<vector<int>> res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int sz = q.size();
            vector<int> level;
            for (int i = 0; i < sz; i++) {
                auto node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            res.push_back(level);
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Queue holds one full level at most.",
    edgeCases: [
      "Empty tree — return empty.",
      "Single node — one level with one element.",
    ],
    memoryTrick: "\"Snapshot queue size before processing level. That size = nodes in current level.\"",
  },

  "right-side-view": {
    intuition: "BFS level order. For each level, the last node is visible from the right. Add last node of each level to result.",
    approach: [
      "BFS with level separation.",
      "For each level, push last node's val to result.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        if (!root) return {};
        vector<int> res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                auto node = q.front(); q.pop();
                if (i == sz - 1) res.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "BFS visits every node once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Queue holds widest level.",
    edgeCases: [
      "Left-skewed tree — left child is rightmost visible at each level.",
      "Single node — that node is the right view.",
    ],
    memoryTrick: "\"BFS + last node per level. The rightmost visible = last in queue for that level.\"",
  },

  "max-depth-tree": {
    intuition: "Recursively, max depth = 1 + max(depth(left), depth(right)). Base: null node has depth 0.",
    approach: [
      "If root is null: return 0.",
      "Return 1 + max(maxDepth(root->left), maxDepth(root->right)).",
    ],
    cppSolution: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack depth h (tree height).",
    edgeCases: [
      "Empty tree — returns 0.",
      "Single node — returns 1.",
      "Skewed tree — O(n) recursion stack.",
    ],
    memoryTrick: "\"Deepest leaf determines depth. Ask left and right: 'how deep are you?' Take bigger + 1.\"",
  },

  "min-depth-tree": {
    intuition: "Min depth is to nearest leaf. Can't just take min(left, right) — if one subtree is null, it's not a path to a leaf. Must handle null subtrees specially.",
    approach: [
      "If root null: return 0.",
      "If left null: return 1 + minDepth(right).",
      "If right null: return 1 + minDepth(left).",
      "Return 1 + min(minDepth(left), minDepth(right)).",
    ],
    cppSolution: `class Solution {
public:
    int minDepth(TreeNode* root) {
        if (!root) return 0;
        if (!root->left) return 1 + minDepth(root->right);
        if (!root->right) return 1 + minDepth(root->left);
        return 1 + min(minDepth(root->left), minDepth(root->right));
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node in worst case.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Only left subtree exists — must go through it (no leaf on right).",
      "Single node — depth 1 (it is a leaf).",
    ],
    memoryTrick: "\"Leaf = both children null. If one child missing, the node can't count as a leaf path — go down the existing side.\"",
  },

  "diameter-tree": {
    intuition: "Diameter through any node = left height + right height. Compute height recursively; at each node update global max diameter as left_height + right_height.",
    approach: [
      "DFS returns height of subtree.",
      "At each node: diameter_through = height(left) + height(right), update global max.",
      "Return 1 + max(left_h, right_h) as height.",
    ],
    cppSolution: `class Solution {
    int ans = 0;
    int height(TreeNode* node) {
        if (!node) return 0;
        int l = height(node->left), r = height(node->right);
        ans = max(ans, l + r);
        return 1 + max(l, r);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        height(root);
        return ans;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited once.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Empty tree — 0.",
      "Single node — 0 (no edges).",
      "Diameter doesn't pass through root — global max catches it.",
    ],
    memoryTrick: "\"Diameter = widest path. At each node it's left_height + right_height. Track max globally while computing heights.\"",
  },

  "balanced-tree": {
    intuition: "Bottom-up check. At each node, compute height of subtrees. If heights differ by > 1, return -1 (sentinel for 'unbalanced'). Propagate -1 up to short-circuit.",
    approach: [
      "Helper returns height or -1 if unbalanced.",
      "If null: return 0.",
      "left = helper(left), right = helper(right).",
      "If either is -1 or |left - right| > 1: return -1.",
      "Return 1 + max(left, right).",
    ],
    cppSolution: `class Solution {
    int check(TreeNode* node) {
        if (!node) return 0;
        int l = check(node->left), r = check(node->right);
        if (l == -1 || r == -1 || abs(l - r) > 1) return -1;
        return 1 + max(l, r);
    }
public:
    bool isBalanced(TreeNode* root) { return check(root) != -1; }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited once (bottom-up short-circuit).",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Empty tree — balanced.",
      "Skewed tree — immediately returns -1 at unbalanced node.",
    ],
    memoryTrick: "\"-1 propagates upward like a virus. Once unbalanced subtree found, everything above gets -1 too.\"",
  },

  "same-tree": {
    intuition: "Recursively compare: both null → true, one null → false, values differ → false, else recurse on children.",
    approach: [
      "If both null: return true.",
      "If one null or values differ: return false.",
      "Return sameTree(p->left, q->left) && sameTree(p->right, q->right).",
    ],
    cppSolution: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q || p->val != q->val) return false;
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit all nodes in worst case.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion depth.",
    edgeCases: [
      "Both empty — true.",
      "One empty, one not — false.",
    ],
    memoryTrick: "\"Three checks: both null (equal), one null or val diff (not equal), recurse both sides.\"",
  },

  "symmetric-tree": {
    intuition: "Tree is symmetric if left subtree mirrors right subtree. Check recursively: outer children match, inner children match.",
    approach: [
      "Helper isMirror(left, right).",
      "If both null: true. If one null: false. If vals differ: false.",
      "Return isMirror(left->left, right->right) && isMirror(left->right, right->left).",
    ],
    cppSolution: `class Solution {
    bool mirror(TreeNode* l, TreeNode* r) {
        if (!l && !r) return true;
        if (!l || !r || l->val != r->val) return false;
        return mirror(l->left, r->right) && mirror(l->right, r->left);
    }
public:
    bool isSymmetric(TreeNode* root) {
        return mirror(root->left, root->right);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited once.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion depth.",
    edgeCases: [
      "Single node — symmetric.",
      "All same values — check structure too (handled by null checks).",
    ],
    memoryTrick: "\"Mirror check: left-left pairs with right-right, left-right pairs with right-left. Cross-comparison.\"",
  },

  "subtree-of-another": {
    intuition: "At every node of s, check if the subtree rooted there is identical to t. Use the isSameTree subroutine.",
    approach: [
      "If s is null: return false.",
      "If isSameTree(s, t): return true.",
      "Return isSubtree(s->left, t) || isSubtree(s->right, t).",
    ],
    cppSolution: `class Solution {
    bool same(TreeNode* a, TreeNode* b) {
        if (!a && !b) return true;
        if (!a || !b || a->val != b->val) return false;
        return same(a->left, b->left) && same(a->right, b->right);
    }
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        if (same(root, subRoot)) return true;
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "For each of m nodes in s, potentially O(n) same-tree check.",
    spaceComplexity: "O(max(h_s, h_t))",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "t larger than s — never matches, returns false.",
      "t matches a subtree deep in s — DFS finds it.",
    ],
    memoryTrick: "\"At every node in s, try starting a full match with t. Like searching for a pattern anywhere in a tree.\"",
  },

  "find-min-rotated": {
    intuition: "Rotated sorted array has one 'break point' where the min lives. Binary search: if mid > right, min is in right half. Otherwise min is in left half (including mid).",
    approach: [
      "left = 0, right = n-1.",
      "While left < right: mid = (left+right)/2.",
      "If nums[mid] > nums[right]: min is right of mid → left = mid+1.",
      "Else: min is at mid or left of it → right = mid.",
      "Return nums[left].",
    ],
    cppSolution: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = (int)nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Halve search space each step.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Pointers only.",
    edgeCases: [
      "Not rotated — nums[mid] <= nums[right] always, r shrinks to 0.",
      "Two elements — handled directly.",
    ],
    memoryTrick: "\"Compare mid with right. If mid > right, break is in right half. Else min is at mid or left.\"",
  },

  "search-rotated": {
    intuition: "One half of the rotated array is always sorted. Use that property: if left half sorted, check if target falls in that range; else search right half. Mirror for right half sorted.",
    approach: [
      "l=0, r=n-1. While l<=r: mid = (l+r)/2.",
      "If nums[mid] == target: return mid.",
      "If left half sorted (nums[l] <= nums[mid]): if target in [nums[l], nums[mid]), r=mid-1, else l=mid+1.",
      "Else right half sorted: if target in (nums[mid], nums[r]], l=mid+1, else r=mid-1.",
    ],
    cppSolution: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = (int)nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Binary search.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Pointers only.",
    edgeCases: [
      "Not rotated — left half always sorted, standard binary search behavior.",
      "Target not present — returns -1.",
    ],
    memoryTrick: "\"One half always sorted. Check which, see if target fits in it. Narrow to that half.\"",
  },

  "search-2d-matrix": {
    intuition: "Matrix rows are sorted, first element of each row > last of previous row. Treat as 1D sorted array: index i maps to row i/n, col i%n.",
    approach: [
      "lo=0, hi=m*n-1.",
      "Binary search: mid=(lo+hi)/2, val=matrix[mid/n][mid%n].",
      "If equal: found. If val<target: lo=mid+1. If val>target: hi=mid-1.",
    ],
    cppSolution: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
};`,
    timeComplexity: "O(log(m×n))",
    timeExplanation: "Flatten and binary search.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Pointers only.",
    edgeCases: [
      "1×1 matrix — single check.",
      "Target < first or > last element — boundary conditions handle it.",
    ],
    memoryTrick: "\"Matrix as 1D: row=mid/n, col=mid%n. Then standard binary search.\"",
  },

  "koko-bananas": {
    intuition: "Binary search on the answer (eating speed k). For each candidate speed, check feasibility. Answer is minimum valid k.",
    approach: [
      "lo=1, hi=max(piles).",
      "For each mid: hours = sum of ceil(pile/mid) for each pile.",
      "If hours <= h: valid, try lower speed (hi=mid). Else lo=mid+1.",
      "Return lo.",
    ],
    cppSolution: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int lo = 1, hi = *max_element(piles.begin(), piles.end());
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    timeComplexity: "O(n log m)",
    timeExplanation: "Binary search on [1, max_pile], check O(n) each.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra storage.",
    edgeCases: [
      "h == piles.size() — must eat each pile in one hour, answer = max pile.",
      "Single pile — answer is pile/h rounded up.",
    ],
    memoryTrick: "\"Binary search on speed not on array index. Feasibility = can finish in h hours?\"",
  },

  "first-bad-version": {
    intuition: "First bad version makes all subsequent bad. Binary search: if mid is bad, answer is at mid or left. If good, answer is right of mid.",
    approach: [
      "lo=1, hi=n.",
      "While lo < hi: mid = lo+(hi-lo)/2.",
      "If isBadVersion(mid): hi=mid. Else: lo=mid+1.",
      "Return lo.",
    ],
    cppSolution: `class Solution {
public:
    int firstBadVersion(int n) {
        int lo = 1, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (isBadVersion(mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Halve each step.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers.",
    edgeCases: [
      "Version 1 is bad — returns 1.",
      "All good except last — returns n.",
    ],
    memoryTrick: "\"Left boundary binary search. Bad → go left (hi=mid). Good → go right (lo=mid+1).\"",
  },

  "search-insert-position": {
    intuition: "Standard lower_bound: find first index where nums[i] >= target. That's either where target is or where it should be inserted.",
    approach: [
      "lo=0, hi=n (n allows insertion after last).",
      "While lo < hi: mid=(lo+hi)/2.",
      "If nums[mid] < target: lo=mid+1. Else: hi=mid.",
      "Return lo.",
    ],
    cppSolution: `class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int lo = 0, hi = nums.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Binary search.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Pointers only.",
    edgeCases: [
      "Target < all — returns 0.",
      "Target > all — returns n.",
    ],
    memoryTrick: "\"Lower bound. hi starts at n so insertion after end is possible.\"",
  },

  "time-based-key-value": {
    intuition: "Each key stores (timestamp, value) pairs. Since timestamps are strictly increasing, the list is sorted. Binary search for largest timestamp <= query timestamp.",
    approach: [
      "Store map<string, vector<pair<int,string>>>.",
      "set: push_back({timestamp, value}).",
      "get: binary search for largest timestamp <= given. Return \"\" if none.",
    ],
    cppSolution: `class TimeMap {
    unordered_map<string, vector<pair<int,string>>> data;
public:
    void set(string key, string value, int timestamp) {
        data[key].push_back({timestamp, value});
    }
    string get(string key, int timestamp) {
        if (!data.count(key)) return "";
        auto& v = data[key];
        int lo = 0, hi = (int)v.size() - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (v[mid].first <= timestamp) { ans = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return ans == -1 ? "" : v[ans].second;
    }
};`,
    timeComplexity: "O(log n) get, O(1) set",
    timeExplanation: "Set appends. Get binary searches sorted timestamp list.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stores all set calls.",
    edgeCases: [
      "Query before all timestamps — return \"\".",
      "Key not set — return \"\".",
    ],
    memoryTrick: "\"Sorted by insert order → binary search. Find rightmost entry with timestamp ≤ query.\"",
  },

  "course-schedule": {
    intuition: "Detect cycle in directed graph. Circular dependency = impossible. DFS with 3 states: 0=unvisited, 1=in current path, 2=done. Hitting state 1 again = cycle.",
    approach: [
      "Build adjacency list from prerequisites.",
      "DFS each unvisited node. State 1 = visiting.",
      "If reach state-1 node: cycle → return false.",
      "Mark state 2 when done.",
    ],
    cppSolution: `class Solution {
    bool hasCycle(int u, vector<vector<int>>& adj, vector<int>& state) {
        if (state[u] == 1) return true;
        if (state[u] == 2) return false;
        state[u] = 1;
        for (int v : adj[u]) if (hasCycle(v, adj, state)) return true;
        state[u] = 2;
        return false;
    }
public:
    bool canFinish(int n, vector<vector<int>>& prereqs) {
        vector<vector<int>> adj(n);
        for (auto& e : prereqs) adj[e[1]].push_back(e[0]);
        vector<int> state(n, 0);
        for (int i = 0; i < n; i++)
            if (hasCycle(i, adj, state)) return false;
        return true;
    }
};`,
    timeComplexity: "O(V + E)",
    timeExplanation: "DFS each node and edge once.",
    spaceComplexity: "O(V + E)",
    spaceExplanation: "Adjacency list + state array.",
    edgeCases: [
      "No prerequisites — always true.",
      "Self-loop — immediate cycle.",
    ],
    memoryTrick: "\"White/gray/black. Gray = on current path. Hitting gray again = back edge = cycle.\"",
  },

  "course-schedule-ii": {
    intuition: "Topological sort. Same DFS cycle detection, but push node to order AFTER processing all its neighbors (post-order). Reverse post-order = topological order.",
    approach: [
      "Same 3-state DFS.",
      "After all neighbors done: order.push_back(node).",
      "If cycle: return empty.",
      "Reverse order and return.",
    ],
    cppSolution: `class Solution {
    bool dfs(int u, vector<vector<int>>& adj, vector<int>& state, vector<int>& order) {
        if (state[u] == 1) return false;
        if (state[u] == 2) return true;
        state[u] = 1;
        for (int v : adj[u]) if (!dfs(v, adj, state, order)) return false;
        state[u] = 2; order.push_back(u);
        return true;
    }
public:
    vector<int> findOrder(int n, vector<vector<int>>& prereqs) {
        vector<vector<int>> adj(n);
        for (auto& e : prereqs) adj[e[1]].push_back(e[0]);
        vector<int> state(n, 0), order;
        for (int i = 0; i < n; i++)
            if (!state[i] && !dfs(i, adj, state, order)) return {};
        reverse(order.begin(), order.end());
        return order;
    }
};`,
    timeComplexity: "O(V + E)",
    timeExplanation: "DFS on all nodes and edges.",
    spaceComplexity: "O(V + E)",
    spaceExplanation: "Adjacency list + arrays.",
    edgeCases: [
      "Cycle — return [].",
      "No edges — any order valid.",
    ],
    memoryTrick: "\"Post-order DFS reversed = topological order. Add to result AFTER processing all deps.\"",
  },

  "clone-graph": {
    intuition: "DFS with memoization. Map original to clone. First visit: create clone, record, then recursively clone all neighbors.",
    approach: [
      "visited map: Node* → Node*.",
      "DFS(node): if null return null. If in visited return visited[node].",
      "Create clone, visited[node]=clone.",
      "For each neighbor: clone->neighbors.push_back(DFS(nb)).",
      "Return clone.",
    ],
    cppSolution: `class Solution {
    unordered_map<Node*, Node*> visited;
    Node* dfs(Node* node) {
        if (!node) return nullptr;
        if (visited.count(node)) return visited[node];
        Node* clone = new Node(node->val);
        visited[node] = clone;
        for (Node* nb : node->neighbors)
            clone->neighbors.push_back(dfs(nb));
        return clone;
    }
public:
    Node* cloneGraph(Node* node) { return dfs(node); }
};`,
    timeComplexity: "O(V + E)",
    timeExplanation: "Visit each node and edge once.",
    spaceComplexity: "O(V)",
    spaceExplanation: "Map and recursion stack.",
    edgeCases: [
      "Null input — return null.",
      "Single node no neighbors — cloned with empty list.",
    ],
    memoryTrick: "\"Map old→new before recursing neighbors. Prevents infinite loop on cycles.\"",
  },

  "pacific-atlantic": {
    intuition: "Reverse direction: start from ocean boundaries and flood inward (uphill). BFS from all Pacific edges, BFS from all Atlantic edges. Intersection = cells that reach both.",
    approach: [
      "Pacific: top row + left col. Atlantic: bottom row + right col.",
      "Multi-source BFS from each set. Can move to neighbor if height >= current.",
      "Intersection of both reachable sets = answer.",
    ],
    cppSolution: `class Solution {
    void bfs(vector<vector<int>>& h, queue<pair<int,int>> q, vector<vector<bool>>& vis) {
        int m=h.size(), n=h[0].size(), dx[]={0,0,1,-1}, dy[]={1,-1,0,0};
        while (!q.empty()) {
            auto [x,y]=q.front(); q.pop();
            for (int d=0;d<4;d++) {
                int nx=x+dx[d],ny=y+dy[d];
                if (nx<0||ny<0||nx>=m||ny>=n||vis[nx][ny]||h[nx][ny]<h[x][y]) continue;
                vis[nx][ny]=true; q.push({nx,ny});
            }
        }
    }
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
        int m=h.size(), n=h[0].size();
        vector<vector<bool>> pac(m,vector<bool>(n)),atl(m,vector<bool>(n));
        queue<pair<int,int>> pq,aq;
        for (int i=0;i<m;i++){pac[i][0]=atl[i][n-1]=true;pq.push({i,0});aq.push({i,n-1});}
        for (int j=0;j<n;j++){pac[0][j]=atl[m-1][j]=true;pq.push({0,j});aq.push({m-1,j});}
        bfs(h,pq,pac); bfs(h,aq,atl);
        vector<vector<int>> res;
        for (int i=0;i<m;i++) for (int j=0;j<n;j++)
            if (pac[i][j]&&atl[i][j]) res.push_back({i,j});
        return res;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited at most twice.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Two visited matrices.",
    edgeCases: [
      "1×1 — touches both oceans, always in result.",
      "All same height — all border cells and reachable ones included.",
    ],
    memoryTrick: "\"Flood uphill from both oceans. Overlap = reachable by both.\"",
  },

  "rotting-oranges": {
    intuition: "Multi-source BFS from all rotten oranges simultaneously. Each BFS level = 1 minute. Track fresh count — if any remain after BFS, return -1.",
    approach: [
      "Enqueue all rotten (2) oranges, count fresh (1) oranges.",
      "BFS: spread to adjacent fresh. fresh-- on each rot. mins++.",
      "After BFS: fresh==0 ? return mins : -1.",
    ],
    cppSolution: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m=grid.size(),n=grid[0].size(),fresh=0,mins=0;
        queue<pair<int,int>> q;
        for (int i=0;i<m;i++) for (int j=0;j<n;j++) {
            if (grid[i][j]==2) q.push({i,j});
            else if (grid[i][j]==1) fresh++;
        }
        int dx[]={0,0,1,-1},dy[]={1,-1,0,0};
        while (!q.empty()&&fresh>0) {
            mins++;
            for (int sz=q.size();sz>0;sz--) {
                auto [x,y]=q.front();q.pop();
                for (int d=0;d<4;d++){
                    int nx=x+dx[d],ny=y+dy[d];
                    if (nx<0||ny<0||nx>=m||ny>=n||grid[nx][ny]!=1) continue;
                    grid[nx][ny]=2; fresh--; q.push({nx,ny});
                }
            }
        }
        return fresh==0?mins:-1;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited once.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Queue.",
    edgeCases: [
      "No fresh — return 0.",
      "Isolated fresh — return -1.",
    ],
    memoryTrick: "\"All rotten start together (multi-source BFS). Levels = minutes. Fresh orphans = -1.\"",
  },

  "walls-gates": {
    intuition: "Multi-source BFS from all gates (value 0) simultaneously. Distance flows outward — each room gets shortest distance to nearest gate naturally.",
    approach: [
      "Enqueue all gate positions.",
      "BFS: for each INF neighbor, set distance = current + 1, enqueue.",
      "Walls (-1) never updated.",
    ],
    cppSolution: `class Solution {
public:
    void wallsAndGates(vector<vector<int>>& rooms) {
        int m=rooms.size(),n=rooms[0].size();
        queue<pair<int,int>> q;
        for (int i=0;i<m;i++) for (int j=0;j<n;j++)
            if (rooms[i][j]==0) q.push({i,j});
        int dx[]={0,0,1,-1},dy[]={1,-1,0,0};
        while (!q.empty()) {
            auto [x,y]=q.front();q.pop();
            for (int d=0;d<4;d++){
                int nx=x+dx[d],ny=y+dy[d];
                if (nx<0||ny<0||nx>=m||ny>=n||rooms[nx][ny]!=INT_MAX) continue;
                rooms[nx][ny]=rooms[x][y]+1; q.push({nx,ny});
            }
        }
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell visited once.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Queue.",
    edgeCases: [
      "No gates — all INF rooms stay INF.",
      "Room surrounded by walls — stays INF.",
    ],
    memoryTrick: "\"BFS from all gates at once. Distance ripples outward. First arrival = shortest path.\"",
  },

  "combination-sum": {
    intuition: "Backtracking where same element can be reused. Two choices at each index: use it again (recurse at same index) or skip it (recurse at index+1).",
    approach: [
      "bt(index, remaining):",
      "If remaining == 0: record. If < 0 or index >= n: return.",
      "Include: push candidates[index], bt(index, rem-candidates[index]), pop.",
      "Exclude: bt(index+1, remaining).",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> res;
        vector<int> cur;
        function<void(int,int)> bt=[&](int i,int rem){
            if (rem==0){res.push_back(cur);return;}
            if (rem<0||i>=(int)candidates.size()) return;
            cur.push_back(candidates[i]); bt(i,rem-candidates[i]); cur.pop_back();
            bt(i+1,rem);
        };
        bt(0,target); return res;
    }
};`,
    timeComplexity: "O(n^(t/m))",
    timeExplanation: "t=target, m=min candidate.",
    spaceComplexity: "O(t/m)",
    spaceExplanation: "Max recursion depth.",
    edgeCases: [
      "No valid combination — return [].",
      "Single large candidate > target — skip branch.",
    ],
    memoryTrick: "\"Reuse = same index. No-reuse = next index. Two branches at every step.\"",
  },

  "combination-sum-ii": {
    intuition: "Each element used once, skip duplicates at same level. Sort first. In loop: if j > start and candidates[j] == candidates[j-1], skip.",
    approach: [
      "Sort candidates.",
      "bt(start, remaining): loop j from start.",
      "Skip: j > start && candidates[j] == candidates[j-1].",
      "Include: push, bt(j+1, rem-candidates[j]), pop.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& c, int target) {
        sort(c.begin(),c.end());
        vector<vector<int>> res; vector<int> cur;
        function<void(int,int)> bt=[&](int start,int rem){
            if (rem==0){res.push_back(cur);return;}
            for (int j=start;j<(int)c.size()&&c[j]<=rem;j++){
                if (j>start&&c[j]==c[j-1]) continue;
                cur.push_back(c[j]); bt(j+1,rem-c[j]); cur.pop_back();
            }
        };
        bt(0,target); return res;
    }
};`,
    timeComplexity: "O(2^n)",
    timeExplanation: "Each element included or excluded.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion depth.",
    edgeCases: [
      "All duplicates — only one valid set per unique combination.",
    ],
    memoryTrick: "\"Sort + skip same val at same depth level. j > start is key — allows same value deeper in tree.\"",
  },

  "permutations": {
    intuition: "Backtracking. Pick each unused element, add to path, recurse, undo. Boolean used[] tracks current permutation members.",
    approach: [
      "bt(): if path.size()==n, record.",
      "For each i not used: used[i]=true, push, recurse, pop, used[i]=false.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        int n=nums.size();
        vector<vector<int>> res; vector<int> cur; vector<bool> used(n,false);
        function<void()> bt=[&](){
            if ((int)cur.size()==n){res.push_back(cur);return;}
            for (int i=0;i<n;i++){
                if (used[i]) continue;
                used[i]=true; cur.push_back(nums[i]); bt();
                cur.pop_back(); used[i]=false;
            }
        };
        bt(); return res;
    }
};`,
    timeComplexity: "O(n × n!)",
    timeExplanation: "n! permutations each O(n) to copy.",
    spaceComplexity: "O(n)",
    spaceExplanation: "used[] + recursion depth.",
    edgeCases: [
      "Single element — one permutation.",
      "Duplicates in input — this generates duplicates; use next_permutation approach to deduplicate.",
    ],
    memoryTrick: "\"Pick any unused, mark, recurse, unmark. Full decision tree with n! leaves.\"",
  },

  "letter-combinations": {
    intuition: "Backtracking. Map each digit to letters. For each digit expand all partial strings by each letter of that digit.",
    approach: [
      "Map: 2→abc, 3→def, ..., 9→wxyz.",
      "bt(index, current): if index==digits.size(), record current.",
      "For each letter in phone[digits[index]-'0']: bt(index+1, current+letter).",
    ],
    cppSolution: `class Solution {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        vector<string> phone={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
        vector<string> res;
        function<void(int,string)> bt=[&](int i,string s){
            if (i==(int)digits.size()){res.push_back(s);return;}
            for (char c:phone[digits[i]-'0']) bt(i+1,s+c);
        };
        bt(0,""); return res;
    }
};`,
    timeComplexity: "O(4^n × n)",
    timeExplanation: "n=digits length, up to 4 letters per digit.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion depth.",
    edgeCases: [
      "Empty input — return [].",
      "Digit '7','9' — 4 letters each.",
    ],
    memoryTrick: "\"Phone keypad tree. Each digit adds one level with 3-4 branches.\"",
  },

  "n-queens": {
    intuition: "Place one queen per row. Track cols, diagonals (row-col), anti-diagonals (row+col) in sets. All three must be free.",
    approach: [
      "bt(row): if row==n, record board.",
      "For each col: if col not in cols, row-col not in diag, row+col not in anti:",
      "Place queen, add to sets, bt(row+1), remove from sets.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n,string(n,'.'));
        unordered_set<int> cols,diag,anti;
        function<void(int)> bt=[&](int row){
            if (row==n){res.push_back(board);return;}
            for (int col=0;col<n;col++){
                if (cols.count(col)||diag.count(row-col)||anti.count(row+col)) continue;
                board[row][col]='Q'; cols.insert(col);diag.insert(row-col);anti.insert(row+col);
                bt(row+1);
                board[row][col]='.'; cols.erase(col);diag.erase(row-col);anti.erase(row+col);
            }
        };
        bt(0); return res;
    }
};`,
    timeComplexity: "O(n!)",
    timeExplanation: "Decreasing choices each row.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Three sets + board.",
    edgeCases: [
      "n=1 — [[\"Q\"]].",
      "n=2,3 — no solution, return [].",
    ],
    memoryTrick: "\"Column, diagonal (row-col), anti-diagonal (row+col). Three attacks, all must be clear.\"",
  },

  "word-search": {
    intuition: "DFS from each cell. Match word char by char. Mark visited with '#'. Unmark on backtrack.",
    approach: [
      "For each cell: if matches word[0], start DFS.",
      "DFS(i,j,k): if k==word.size() return true.",
      "Mark '#', try 4 dirs for k+1, unmark.",
    ],
    cppSolution: `class Solution {
    bool dfs(vector<vector<char>>& b,string& w,int i,int j,int k){
        if (k==(int)w.size()) return true;
        if (i<0||j<0||i>=(int)b.size()||j>=(int)b[0].size()||b[i][j]!=w[k]) return false;
        char tmp=b[i][j]; b[i][j]='#';
        bool ok=dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
        b[i][j]=tmp; return ok;
    }
public:
    bool exist(vector<vector<char>>& board,string word){
        for (int i=0;i<(int)board.size();i++)
            for (int j=0;j<(int)board[0].size();j++)
                if (dfs(board,word,i,j,0)) return true;
        return false;
    }
};`,
    timeComplexity: "O(m×n×4^L)",
    timeExplanation: "L=word length, 4 branches each step.",
    spaceComplexity: "O(L)",
    spaceExplanation: "Recursion depth.",
    edgeCases: [
      "Same cell used twice — '#' prevents it.",
      "Word longer than grid — can't complete.",
    ],
    memoryTrick: "\"Mark '#' to block revisit. Unmark on backtrack. 4-directional DFS matching word index.\"",
  },

  "palindrome-partitioning": {
    intuition: "Backtracking with DP palindrome precomputation. At each position try all substrings — if palindrome, recurse on rest. O(1) palindrome check via DP table.",
    approach: [
      "Precompute dp[i][j] = true if s[i..j] is palindrome.",
      "bt(start): if start==n, record current partition.",
      "For each end from start: if dp[start][end], push substring, bt(end+1), pop.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n=s.size();
        vector<vector<bool>> dp(n,vector<bool>(n,false));
        for (int i=n-1;i>=0;i--)
            for (int j=i;j<n;j++)
                dp[i][j]=s[i]==s[j]&&(j-i<=2||dp[i+1][j-1]);
        vector<vector<string>> res; vector<string> cur;
        function<void(int)> bt=[&](int start){
            if (start==n){res.push_back(cur);return;}
            for (int end=start;end<n;end++){
                if (!dp[start][end]) continue;
                cur.push_back(s.substr(start,end-start+1));
                bt(end+1); cur.pop_back();
            }
        };
        bt(0); return res;
    }
};`,
    timeComplexity: "O(n × 2^n)",
    timeExplanation: "2^n partitions, DP precompute O(n²).",
    spaceComplexity: "O(n²)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "Single char — one partition.",
      "All same char — many partitions.",
    ],
    memoryTrick: "\"DP for O(1) palindrome check. Backtrack over partitions. Check palindrome before branching.\"",
  },

  "house-robber-ii": {
    intuition: "Houses arranged in circle — first and last are adjacent, can't rob both. Split into two subproblems: rob houses [0..n-2] and [1..n-1]. Take max of both. Each subproblem is standard House Robber I.",
    approach: [
      "If n==1: return nums[0].",
      "rob(nums, start, end): standard DP on that range.",
      "Return max(rob(0, n-2), rob(1, n-1)).",
    ],
    cppSolution: `class Solution {
    int rob(vector<int>& nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int curr = max(prev2 + nums[i], prev1);
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(rob(nums, 0, n-2), rob(nums, 1, n-1));
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two variables each pass.",
    edgeCases: [
      "n=1 — return nums[0].",
      "n=2 — return max(nums[0], nums[1]).",
    ],
    memoryTrick: "\"Circle breaks adjacency between first/last. Solve twice: include first or include last. Take max.\"",
  },

  "jump-game": {
    intuition: "Greedy: track the farthest reachable index. At each step, if current index > farthest reachable, stuck. Otherwise update farthest.",
    approach: [
      "maxReach = 0.",
      "For i from 0 to n-1: if i > maxReach, return false.",
      "maxReach = max(maxReach, i + nums[i]).",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int maxReach = 0;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (i > maxReach) return false;
            maxReach = max(maxReach, i + nums[i]);
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "Single element — already at end, return true.",
      "All zeros except first — stuck if first is 0.",
    ],
    memoryTrick: "\"Expanding horizon. If you fall behind the horizon, you're stuck. Otherwise you're fine.\"",
  },

  "jump-game-ii": {
    intuition: "Greedy BFS-like. Track current jump range end and farthest reachable within current range. When you reach the end of current range, take a jump and update range to farthest.",
    approach: [
      "jumps=0, curEnd=0, farthest=0.",
      "For i from 0 to n-2: farthest = max(farthest, i+nums[i]).",
      "If i == curEnd: jumps++, curEnd = farthest.",
      "Return jumps.",
    ],
    cppSolution: `class Solution {
public:
    int jump(vector<int>& nums) {
        int jumps = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < (int)nums.size() - 1; i++) {
            farthest = max(farthest, i + nums[i]);
            if (i == curEnd) { jumps++; curEnd = farthest; }
        }
        return jumps;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "n=1 — already at end, 0 jumps.",
      "Straightforward array — each jump extends as far as possible.",
    ],
    memoryTrick: "\"BFS levels = jumps. curEnd = current level boundary. When reached, take jump, extend to farthest.\"",
  },

  "gas-station": {
    intuition: "If total gas >= total cost, solution exists. Start from 0, track running tank. When tank < 0, reset start to next station (current start can't work).",
    approach: [
      "total = 0, tank = 0, start = 0.",
      "For each i: total += gas[i]-cost[i], tank += gas[i]-cost[i].",
      "If tank < 0: start = i+1, tank = 0.",
      "Return total >= 0 ? start : -1.",
    ],
    cppSolution: `class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < (int)gas.size(); i++) {
            int diff = gas[i] - cost[i];
            total += diff; tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total >= 0 ? start : -1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "No solution — total < 0.",
      "Single station — trivially works if gas >= cost.",
    ],
    memoryTrick: "\"Running deficit → current start is invalid, reset. If total sum >= 0, start found at reset point.\"",
  },

  "lemonade-change": {
    intuition: "Greedy. Track counts of $5 and $10 bills. For $20 payment: prefer to give $10+$5 (saves more $5s). Never have $20 as change — pass $20 through.",
    approach: [
      "Track five=0, ten=0.",
      "Customer pays $5: five++.",
      "Customer pays $10: if five==0 return false. five--, ten++.",
      "Customer pays $20: if ten>0 && five>0: ten--, five--. Else if five>=3: five-=3. Else return false.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool lemonadeChange(vector<int>& bills) {
        int five = 0, ten = 0;
        for (int b : bills) {
            if (b == 5) five++;
            else if (b == 10) { if (!five) return false; five--; ten++; }
            else {
                if (ten && five) { ten--; five--; }
                else if (five >= 3) five -= 3;
                else return false;
            }
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two counters.",
    edgeCases: [
      "All $5 customers — always works.",
      "$10 before any $5 — immediately fails.",
    ],
    memoryTrick: "\"$5 bills are precious — use $10 first for $20 change. Preserve $5s.\"",
  },

  "best-time-stock-ii": {
    intuition: "Unlimited transactions. Collect every upward move. If prices[i] > prices[i-1], add the difference to profit. Equivalently: sum all positive differences.",
    approach: [
      "profit = 0.",
      "For i from 1 to n-1: if prices[i] > prices[i-1], profit += prices[i] - prices[i-1].",
      "Return profit.",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        for (int i = 1; i < (int)prices.size(); i++)
            if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];
        return profit;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "Monotonically decreasing — no profit.",
      "Single day — no transactions possible.",
    ],
    memoryTrick: "\"Take every gain. Every upward step is profit. Like buying and selling every day it goes up.\"",
  },

  "insert-interval": {
    intuition: "Three phases: add all intervals that end before newInterval starts. Merge all overlapping intervals with newInterval. Add remaining intervals.",
    approach: [
      "Phase 1: while intervals[i].end < newInterval.start: add intervals[i], i++.",
      "Phase 2: while intervals[i].start <= newInterval.end: merge (expand newInterval). i++.",
      "Add merged newInterval.",
      "Phase 3: add remaining intervals.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int i = 0, n = intervals.size();
        while (i < n && intervals[i][1] < newInterval[0]) res.push_back(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);
        while (i < n) res.push_back(intervals[i++]);
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Result array.",
    edgeCases: [
      "New interval before all — phase 1 empty, phase 2 empty.",
      "New interval overlaps all — all merged into one.",
    ],
    memoryTrick: "\"Before, overlap, after. Three phases. Overlap = expand newInterval left/right.\"",
  },

  "meeting-rooms": {
    intuition: "Sort by start time. If any meeting starts before previous ends, overlap exists.",
    approach: [
      "Sort intervals by start time.",
      "For i from 1 to n-1: if intervals[i][0] < intervals[i-1][1]: return false.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        for (int i = 1; i < (int)intervals.size(); i++)
            if (intervals[i][0] < intervals[i-1][1]) return false;
        return true;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorting dominates.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place sort.",
    edgeCases: [
      "Single meeting — no conflict.",
      "Adjacent meetings (end == start) — not overlapping.",
    ],
    memoryTrick: "\"Sort then check consecutive pairs. If next starts before current ends = conflict.\"",
  },

  "meeting-rooms-ii": {
    intuition: "Min-heap of end times. Tracks earliest-ending room. If new meeting starts after earliest end, reuse that room. Else need new room. Heap size at end = min rooms needed.",
    approach: [
      "Sort by start time.",
      "Min-heap (priority_queue with greater) of end times.",
      "For each meeting: if heap.top() <= start, pop (reuse room).",
      "Push end time.",
      "Return heap.size().",
    ],
    cppSolution: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        priority_queue<int, vector<int>, greater<int>> minHeap;
        for (auto& iv : intervals) {
            if (!minHeap.empty() && minHeap.top() <= iv[0]) minHeap.pop();
            minHeap.push(iv[1]);
        }
        return minHeap.size();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sort + heap ops each O(log n).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Heap of end times.",
    edgeCases: [
      "All non-overlapping — heap never grows beyond 1.",
      "All same time — heap grows to n.",
    ],
    memoryTrick: "\"Heap of room end times. If earliest-ending room is free (end <= new start), reclaim it.\"",
  },

  "hand-of-straights": {
    intuition: "Greedy: always form groups starting from smallest card. If can't complete a group, return false. Use sorted map to process cards in order.",
    approach: [
      "If hand.size() % groupSize != 0: return false.",
      "Sort/count cards in ordered map.",
      "For each smallest remaining card, try to form group of size groupSize.",
      "Decrement counts; if any goes negative: return false.",
    ],
    cppSolution: `class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize != 0) return false;
        map<int,int> cnt;
        for (int c : hand) cnt[c]++;
        for (auto& [start, _] : cnt) {
            int freq = cnt[start];
            if (!freq) continue;
            for (int i = 0; i < groupSize; i++) {
                if (cnt[start+i] < freq) return false;
                cnt[start+i] -= freq;
            }
        }
        return true;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorted map iteration.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Count map.",
    edgeCases: [
      "hand.size() % groupSize != 0 — impossible.",
      "All cards same value — can't form consecutive groups.",
    ],
    memoryTrick: "\"Greedy from smallest. Take all copies of smallest card, form that many groups extending upward.\"",
  },

  "partition-labels": {
    intuition: "Each character's last occurrence determines the partition end. Walk the string: expand current partition end to max last occurrence of characters seen. When current index = partition end, cut.",
    approach: [
      "Precompute last[c] = last index of char c.",
      "start=0, end=0.",
      "For each i: end = max(end, last[s[i]]).",
      "If i == end: partition size = end-start+1, start=end+1.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> partitionLabels(string s) {
        int last[26] = {};
        for (int i = 0; i < (int)s.size(); i++) last[s[i]-'a'] = i;
        vector<int> res;
        int start = 0, end = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            end = max(end, last[s[i]-'a']);
            if (i == end) { res.push_back(end-start+1); start = end+1; }
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "26-char last array.",
    edgeCases: [
      "All unique chars — each char is its own partition.",
      "All same char — one partition.",
    ],
    memoryTrick: "\"Expand end to last occurrence of every char seen. Partition ends when current index = end.\"",
  },

  "missing-number": {
    intuition: "Expected sum 0+1+...+n = n*(n+1)/2. Subtract actual sum. Difference is missing number. Alternatively use XOR: XOR all indices and all values, mismatched pair cancels.",
    approach: [
      "expected = n*(n+1)/2.",
      "actual = sum of nums.",
      "Return expected - actual.",
    ],
    cppSolution: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        return n*(n+1)/2 - accumulate(nums.begin(), nums.end(), 0);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass for sum.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two variables.",
    edgeCases: [
      "Missing 0 — sum formula catches it.",
      "Missing n — last element absent.",
    ],
    memoryTrick: "\"Expected sum minus actual sum = missing. Arithmetic sum formula n*(n+1)/2.\"",
  },

  "counting-bits": {
    intuition: "DP: for even n, bits(n) = bits(n/2). For odd n, bits(n) = bits(n/2) + 1. Equivalently bits(n) = bits(n>>1) + (n&1).",
    approach: [
      "dp[0] = 0.",
      "For i from 1 to n: dp[i] = dp[i>>1] + (i&1).",
      "Return dp.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> dp(n+1, 0);
        for (int i = 1; i <= n; i++) dp[i] = dp[i>>1] + (i&1);
        return dp;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Output array.",
    edgeCases: [
      "n=0 — return [0].",
    ],
    memoryTrick: "\"Right shift = divide by 2. Last bit = i&1. Bits(n) = Bits(n/2) + last bit.\"",
  },

  "number-1-bits": {
    intuition: "Brian Kernighan: n & (n-1) clears the lowest set bit. Count how many times until n = 0.",
    approach: [
      "count = 0.",
      "While n != 0: n &= (n-1), count++.",
      "Return count.",
    ],
    cppSolution: `class Solution {
public:
    int hammingWeight(uint32_t n) {
        int cnt = 0;
        while (n) { n &= n-1; cnt++; }
        return cnt;
    }
};`,
    timeComplexity: "O(k)",
    timeExplanation: "k = number of set bits.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One counter.",
    edgeCases: [
      "n=0 — returns 0.",
      "All 1s (0xFFFFFFFF) — returns 32.",
    ],
    memoryTrick: "\"n & (n-1) flips the lowest '1' to '0'. Count flips until zero.\"",
  },

  "reverse-bits": {
    intuition: "Process bit by bit. Extract LSB of n, shift result left, OR in that bit, shift n right. Repeat 32 times.",
    approach: [
      "result = 0.",
      "For i in 0..31: result = (result << 1) | (n & 1), n >>= 1.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>= 1;
        }
        return res;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "Always 32 iterations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "n=0 — returns 0.",
      "n=1 — returns 1 shifted to MSB position.",
    ],
    memoryTrick: "\"Extract LSB, shift into result. Like reversing array but with bits.\"",
  },

  "power-of-two": {
    intuition: "Power of two has exactly one set bit. n & (n-1) == 0 checks this (clears the one set bit to 0). Also n must be > 0.",
    approach: [
      "Return n > 0 && (n & (n-1)) == 0.",
    ],
    cppSolution: `class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n-1)) == 0;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "Single bitwise operation.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space.",
    edgeCases: [
      "n=0 — not a power of two.",
      "n=1 — 2^0, returns true.",
      "Negative numbers — n>0 guard handles.",
    ],
    memoryTrick: "\"Power of 2 = single '1' bit. n&(n-1) kills that bit. Result must be 0.\"",
  },

  "sum-two-integers": {
    intuition: "Simulate addition with XOR (sum without carry) and AND shifted left (carry). Repeat until carry is 0.",
    approach: [
      "While b != 0: carry = (a & b) << 1. a = a ^ b. b = carry.",
      "Return a.",
    ],
    cppSolution: `class Solution {
public:
    int getSum(int a, int b) {
        while (b) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "At most 32 iterations for 32-bit integers.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "Adding 0 — returns a immediately.",
      "Negative numbers — two's complement, XOR/AND work correctly.",
    ],
    memoryTrick: "\"XOR = sum without carry. AND<<1 = carry. Repeat until no carry.\"",
  },

  "decode-ways": {
    intuition: "DP. dp[i] = ways to decode s[0..i-1]. If s[i-1] is valid single digit (1-9): dp[i] += dp[i-1]. If s[i-2..i-1] is valid two-digit (10-26): dp[i] += dp[i-2].",
    approach: [
      "dp[0]=1 (empty string), dp[1]=s[0]!='0' ? 1 : 0.",
      "For i from 2 to n:",
      "  one = s[i-1]-'0'. If one in 1-9: dp[i] += dp[i-1].",
      "  two = stoi(s.substr(i-2,2)). If two in 10-26: dp[i] += dp[i-2].",
      "Return dp[n].",
    ],
    cppSolution: `class Solution {
public:
    int numDecodings(string s) {
        int n = s.size();
        vector<int> dp(n+1, 0);
        dp[0] = 1;
        dp[1] = s[0] != '0' ? 1 : 0;
        for (int i = 2; i <= n; i++) {
            int one = s[i-1] - '0';
            int two = stoi(s.substr(i-2, 2));
            if (one >= 1) dp[i] += dp[i-1];
            if (two >= 10 && two <= 26) dp[i] += dp[i-2];
        }
        return dp[n];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single DP pass.",
    spaceComplexity: "O(n)",
    spaceExplanation: "DP array (reducible to O(1) with two vars).",
    edgeCases: [
      "Leading '0' — dp[1]=0, impossible decode.",
      "'0' in middle — only valid if preceded by 1 or 2.",
      "'27' — can't be two-digit (>26), only '2'+'7'.",
    ],
    memoryTrick: "\"One-char decode (1-9) or two-char decode (10-26). Both must be valid. dp[i] sums both options.\"",
  },

  "unique-paths": {
    intuition: "Robot moves right or down only. dp[i][j] = ways to reach (i,j) = dp[i-1][j] + dp[i][j-1]. First row and column all 1s (only one path).",
    approach: [
      "dp[m][n], initialize all 1s in first row and col.",
      "For i from 1 to m-1: for j from 1 to n-1: dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "Return dp[m-1][n-1].",
    ],
    cppSolution: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 1));
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
        return dp[m-1][n-1];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill entire grid.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP grid (reducible to O(n) with rolling array).",
    edgeCases: [
      "1×1 grid — one path (stay).",
      "1×n or m×1 — only one path.",
    ],
    memoryTrick: "\"Each cell = sum of cell above + cell left. Pascal's triangle in 2D.\"",
  },

  "minimum-path-sum": {
    intuition: "DP: dp[i][j] = minimum cost path to (i,j) = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
    approach: [
      "Initialize dp[0][0] = grid[0][0].",
      "Fill first row and col (only one path).",
      "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m-1][n-1].",
    ],
    cppSolution: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (!i && !j) continue;
                int up = i ? grid[i-1][j] : INT_MAX;
                int left = j ? grid[i][j-1] : INT_MAX;
                grid[i][j] += min(up, left);
            }
        return grid[m-1][n-1];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill entire grid.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Modify grid in-place.",
    edgeCases: [
      "1×1 — return grid[0][0].",
      "Single row/col — only one path.",
    ],
    memoryTrick: "\"Each cell accumulates cost from best parent. Modify in-place = O(1) space.\"",
  },

  "longest-common-subsequence": {
    intuition: "DP: dp[i][j] = LCS length for s1[0..i-1] and s2[0..j-1]. If chars match: dp[i][j] = dp[i-1][j-1] + 1. Else: max(dp[i-1][j], dp[i][j-1]).",
    approach: [
      "dp[m+1][n+1] initialized to 0.",
      "For i 1..m, j 1..n:",
      "  If s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]+1.",
      "  Else: dp[i][j]=max(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    int longestCommonSubsequence(string s1, string s2) {
        int m = s1.size(), n = s2.size();
        vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = s1[i-1]==s2[j-1] ? dp[i-1][j-1]+1 : max(dp[i-1][j],dp[i][j-1]);
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill entire DP table.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "No common chars — LCS = 0.",
      "One is substring of other — LCS = shorter length.",
    ],
    memoryTrick: "\"Match → diagonal + 1. No match → take better of skip-left or skip-up.\"",
  },

  "longest-increasing-subsequence": {
    intuition: "DP: dp[i] = length of LIS ending at index i. For each i, dp[i] = max(dp[j]+1) for all j < i where nums[j] < nums[i]. O(n²). Patience sorting gives O(n log n).",
    approach: [
      "tails array (patience sorting): for each num, binary search for first tail >= num.",
      "If found: replace. If not found: append.",
      "tails.size() = LIS length.",
    ],
    cppSolution: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int n : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), n);
            if (it == tails.end()) tails.push_back(n);
            else *it = n;
        }
        return tails.size();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Binary search per element.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Tails array.",
    edgeCases: [
      "All decreasing — LIS = 1.",
      "All increasing — LIS = n.",
    ],
    memoryTrick: "\"Patience sort: each num either extends longest tail or replaces the first tail that's too big. Size = LIS.\"",
  },

  "longest-palindromic-substr": {
    intuition: "Expand around center. For each index (and each gap between indices), expand outward as long as chars match. Track max expansion.",
    approach: [
      "For each i: expand around i (odd length) and between i,i+1 (even length).",
      "Expansion: l=i,r=i (or i,i+1). While l>=0 && r<n && s[l]==s[r]: l--, r++.",
      "Length = r-l-1. Update best if longer.",
    ],
    cppSolution: `class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size(), start = 0, maxLen = 1;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }
            if (r - l - 1 > maxLen) { maxLen = r-l-1; start = l+1; }
        };
        for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }
        return s.substr(start, maxLen);
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "n centers, O(n) expansion each.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two indices.",
    edgeCases: [
      "Single char — palindrome of length 1.",
      "All same chars — entire string is palindrome.",
    ],
    memoryTrick: "\"Expand from center. Two center types: single char (odd) and gap (even). Track best expansion.\"",
  },

  "palindromic-substrings": {
    intuition: "Same expand-around-center. Count each expansion as a palindrome found.",
    approach: [
      "For each i: expand odd (center i) and even (center i,i+1).",
      "Every expansion step counts as one palindrome.",
    ],
    cppSolution: `class Solution {
public:
    int countSubstrings(string s) {
        int n = s.size(), cnt = 0;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; cnt++; }
        };
        for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }
        return cnt;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "n centers, O(n) each.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Counter only.",
    edgeCases: [
      "Single char — count = 1.",
      "All same chars 'aaa' — 6 palindromes: a,a,a,aa,aa,aaa.",
    ],
    memoryTrick: "\"Count palindromes = count expansion steps. Every center expansion = one more palindrome.\"",
  },

  "edit-distance": {
    intuition: "DP: dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]. If chars match: dp[i][j] = dp[i-1][j-1]. Else: 1 + min(delete, insert, replace).",
    approach: [
      "dp[m+1][n+1]. dp[i][0]=i, dp[0][j]=j.",
      "If word1[i-1]==word2[j-1]: dp[i][j]=dp[i-1][j-1].",
      "Else: dp[i][j]=1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
      "  (delete, insert, replace respectively).",
    ],
    cppSolution: `class Solution {
public:
    int minDistance(string w1, string w2) {
        int m=w1.size(), n=w2.size();
        vector<vector<int>> dp(m+1, vector<int>(n+1));
        for (int i=0;i<=m;i++) dp[i][0]=i;
        for (int j=0;j<=n;j++) dp[0][j]=j;
        for (int i=1;i<=m;i++)
            for (int j=1;j<=n;j++)
                dp[i][j]=w1[i-1]==w2[j-1] ? dp[i-1][j-1]
                    : 1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill entire DP table.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "One empty string — edit distance = length of other.",
      "Identical strings — 0.",
    ],
    memoryTrick: "\"Three operations = three neighbors: up (delete), left (insert), diagonal (replace/match). Take min+1, or diagonal if match.\"",
  },

  "coin-change-ii": {
    intuition: "Count ways to make amount using coins with unlimited use. DP: dp[i] = number of ways to make amount i. For each coin, update dp[i] += dp[i-coin] for all i >= coin.",
    approach: [
      "dp[amount+1] = {1, 0, 0, ...}.",
      "For each coin: for i from coin to amount: dp[i] += dp[i-coin].",
      "Return dp[amount].",
    ],
    cppSolution: `class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> dp(amount+1, 0);
        dp[0] = 1;
        for (int coin : coins)
            for (int i = coin; i <= amount; i++)
                dp[i] += dp[i-coin];
        return dp[amount];
    }
};`,
    timeComplexity: "O(amount × coins)",
    timeExplanation: "Outer loop coins, inner loop amount.",
    spaceComplexity: "O(amount)",
    spaceExplanation: "DP array.",
    edgeCases: [
      "Amount = 0 — dp[0]=1 (one way: no coins).",
      "No coins that divide amount — dp[amount] stays 0.",
    ],
    memoryTrick: "\"Process one coin at a time to avoid counting permutations as separate combos. Outer=coins, inner=amounts.\"",
  },

  "max-product-subarray": {
    intuition: "Two running products: maxProd and minProd (min because negative × negative = positive). At each step update both using current element and previous max/min. Track global max.",
    approach: [
      "maxP = minP = res = nums[0].",
      "For i from 1 to n-1:",
      "  If nums[i] < 0: swap(maxP, minP).",
      "  maxP = max(nums[i], maxP * nums[i]).",
      "  minP = min(nums[i], minP * nums[i]).",
      "  res = max(res, maxP).",
    ],
    cppSolution: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxP=nums[0], minP=nums[0], res=nums[0];
        for (int i=1;i<(int)nums.size();i++){
            if (nums[i]<0) swap(maxP,minP);
            maxP=max(nums[i],maxP*nums[i]);
            minP=min(nums[i],minP*nums[i]);
            res=max(res,maxP);
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "Single element — return it.",
      "Zero in array — resets both maxP and minP.",
      "Two negatives — their product is positive, minP tracks this.",
    ],
    memoryTrick: "\"Track both max and min (neg×neg=pos). Negative num flips max/min roles.\"",
  },

  "word-break": {
    intuition: "DP: dp[i] = true if s[0..i-1] can be segmented using wordDict. For each i, try all j < i: if dp[j] && s[j..i-1] is in dict, dp[i] = true.",
    approach: [
      "Set from wordDict for O(1) lookup.",
      "dp[0] = true.",
      "For i from 1 to n: for j from 0 to i-1: if dp[j] && dict.count(s.substr(j,i-j)): dp[i]=true.",
      "Return dp[n].",
    ],
    cppSolution: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<bool> dp(n+1, false);
        dp[0] = true;
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && dict.count(s.substr(j, i-j))) { dp[i]=true; break; }
        return dp[n];
    }
};`,
    timeComplexity: "O(n² × L)",
    timeExplanation: "n² substrings, each lookup O(L) in hash set.",
    spaceComplexity: "O(n + W)",
    spaceExplanation: "DP array + dictionary set.",
    edgeCases: [
      "String in dict as one word — dp[n] = true from j=0.",
      "No valid segmentation — all dp[i] stay false except dp[0].",
    ],
    memoryTrick: "\"dp[i] asks: can I reach position i? Try all split points j. If dp[j] true and s[j..i] in dict, yes.\"",
  },

  "partition-equal-subset": {
    intuition: "Find if subset sums to total/2. If total is odd, impossible. 0/1 knapsack DP: dp[j] = can we achieve sum j using elements so far.",
    approach: [
      "If total sum is odd: return false.",
      "target = sum / 2.",
      "dp[target+1] = {true, false, ...}.",
      "For each num: iterate j from target down to num: dp[j] |= dp[j-num].",
      "Return dp[target].",
    ],
    cppSolution: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum & 1) return false;
        int target = sum / 2;
        vector<bool> dp(target+1, false);
        dp[0] = true;
        for (int n : nums)
            for (int j = target; j >= n; j--)
                dp[j] = dp[j] || dp[j-n];
        return dp[target];
    }
};`,
    timeComplexity: "O(n × target)",
    timeExplanation: "n items × target capacity.",
    spaceComplexity: "O(target)",
    spaceExplanation: "1D DP array.",
    edgeCases: [
      "Odd sum — immediately false.",
      "Single element — only if 0 which is impossible (positive nums).",
    ],
    memoryTrick: "\"Subset sum = 0/1 knapsack. Iterate backwards to prevent reusing same element. Reach target = found partition.\"",
  },

  "target-sum": {
    intuition: "DFS with memoization or DP. The number of ways to assign +/- to reach target. DP: dp[sum+offset] = count of ways. Or use subset-sum: S(+) - S(-) = target, S(+) + S(-) = total → S(+) = (total+target)/2.",
    approach: [
      "Convert to subset sum: find subsets summing to (total+target)/2.",
      "If (total+target) odd or negative: return 0.",
      "dp[capacity+1] count ways. dp[0]=1.",
      "For each num: for j down to num: dp[j] += dp[j-num].",
    ],
    cppSolution: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        int S = total + target;
        if (S < 0 || S & 1) return 0;
        int cap = S / 2;
        vector<int> dp(cap+1, 0);
        dp[0] = 1;
        for (int n : nums)
            for (int j = cap; j >= n; j--)
                dp[j] += dp[j-n];
        return dp[cap];
    }
};`,
    timeComplexity: "O(n × (sum+target))",
    timeExplanation: "DP table of size (sum+target)/2.",
    spaceComplexity: "O(sum+target)",
    spaceExplanation: "DP array.",
    edgeCases: [
      "(total+target) odd or total+target < 0 — impossible.",
      "target > total — can't reach.",
    ],
    memoryTrick: "\"Algebra trick: positive subset = (total+target)/2. Count subsets = count ways.\"",
  },

  "buy-sell-cooldown": {
    intuition: "State machine DP. Three states: holding (can sell), sold (must cooldown next day), cooldown (can buy). Transitions: holding→sold (sell), sold→cooldown (forced), cooldown→holding (buy) or stay.",
    approach: [
      "hold = max profit when holding a stock.",
      "sold = max profit day after selling.",
      "cool = max profit in cooldown/rest state.",
      "For each price: newHold = max(hold, cool-price). newSold = hold+price. newCool = max(cool, sold).",
      "Return max(sold, cool) at end.",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int hold = INT_MIN, sold = 0, cool = 0;
        for (int p : prices) {
            int prevSold = sold;
            sold = hold + p;
            hold = max(hold, cool - p);
            cool = max(cool, prevSold);
        }
        return max(sold, cool);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three state variables.",
    edgeCases: [
      "Single price — no transactions, return 0.",
      "All decreasing — never profitable to buy.",
    ],
    memoryTrick: "\"Three states: holding, just-sold, cooldown. Sold→cooldown (forced). Cooldown→buy or stay. Track best profit per state.\"",
  },

  "k-closest-points": {
    intuition: "Max-heap of size k. Maintain k smallest distances. If new point closer than heap max, swap. Result is heap contents.",
    approach: [
      "Max-heap (priority_queue) storing (dist², x, y).",
      "For each point: compute dist².",
      "If heap.size() < k: push. Else if dist² < heap.top().dist²: pop, push.",
      "Return heap contents.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        priority_queue<pair<int,int>> pq;
        for (int i = 0; i < (int)points.size(); i++) {
            int d = points[i][0]*points[i][0] + points[i][1]*points[i][1];
            pq.push({d, i});
            if ((int)pq.size() > k) pq.pop();
        }
        vector<vector<int>> res;
        while (!pq.empty()) { res.push_back(points[pq.top().second]); pq.pop(); }
        return res;
    }
};`,
    timeComplexity: "O(n log k)",
    timeExplanation: "n insertions into heap of size k.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Heap of size k.",
    edgeCases: [
      "k == n — return all points.",
      "All same distance — any k valid.",
    ],
    memoryTrick: "\"Max-heap of k smallest. When heap full and new point is closer, evict the farthest.\"",
  },

  "kth-largest-array": {
    intuition: "Quickselect (average O(n)) or min-heap of size k. Heap approach: maintain heap of k largest seen. Top = kth largest.",
    approach: [
      "Min-heap of size k.",
      "For each num: push. If size > k: pop min.",
      "Return heap.top().",
    ],
    cppSolution: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;
        for (int n : nums) {
            minHeap.push(n);
            if ((int)minHeap.size() > k) minHeap.pop();
        }
        return minHeap.top();
    }
};`,
    timeComplexity: "O(n log k)",
    timeExplanation: "n insertions, heap size k.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Heap of size k.",
    edgeCases: [
      "k=1 — return max element.",
      "k=n — return min element.",
    ],
    memoryTrick: "\"Min-heap of k largest. Top = smallest of the k largest = kth largest.\"",
  },

  "kth-largest-stream": {
    intuition: "Maintain min-heap of size k. Top of heap is always the kth largest. On add: push, if size > k, pop. Return top.",
    approach: [
      "Init: build min-heap from vals, trim to size k.",
      "add(val): push val. If size > k: pop. Return top.",
    ],
    cppSolution: `class KthLargest {
    priority_queue<int,vector<int>,greater<int>> pq;
    int K;
public:
    KthLargest(int k, vector<int>& nums) : K(k) {
        for (int n : nums) { pq.push(n); if ((int)pq.size()>k) pq.pop(); }
    }
    int add(int val) {
        pq.push(val);
        if ((int)pq.size()>K) pq.pop();
        return pq.top();
    }
};`,
    timeComplexity: "O(log k) per add",
    timeExplanation: "Heap push/pop.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Heap of size k.",
    edgeCases: [
      "Initial list empty — heap builds up as add called.",
      "Initial list larger than k — trim on construction.",
    ],
    memoryTrick: "\"Min-heap of k = window of top-k. Top = kth largest. Trim on overflow.\"",
  },

  "last-stone-weight": {
    intuition: "Repeatedly smash the two heaviest stones. Max-heap gives constant-time access to heaviest.",
    approach: [
      "Build max-heap.",
      "While heap.size() > 1: pop two heaviest (x, y with x >= y).",
      "  If x != y: push (x-y) back.",
      "Return heap.empty() ? 0 : heap.top().",
    ],
    cppSolution: `class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        priority_queue<int> pq(stones.begin(), stones.end());
        while (pq.size() > 1) {
            int x = pq.top(); pq.pop();
            int y = pq.top(); pq.pop();
            if (x != y) pq.push(x - y);
        }
        return pq.empty() ? 0 : pq.top();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "n stones, log n per heap op.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Heap.",
    edgeCases: [
      "All same weight — all cancel out, return 0.",
      "Single stone — return it.",
    ],
    memoryTrick: "\"Max-heap for heaviest. Smash two biggest. If different, put remainder back.\"",
  },

  "task-scheduler": {
    intuition: "Most frequent task determines idle time. Sort tasks by frequency. The formula: result = max(n+1 frames × (maxFreq-1) + tasks with maxFreq, total tasks).",
    approach: [
      "Count task frequencies.",
      "maxFreq = max frequency.",
      "maxCount = number of tasks with maxFreq.",
      "slots = (maxFreq-1)*(n+1) + maxCount.",
      "Return max(slots, tasks.size()).",
    ],
    cppSolution: `class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int cnt[26] = {};
        for (char c : tasks) cnt[c-'A']++;
        int maxFreq = *max_element(cnt, cnt+26);
        int maxCount = count(cnt, cnt+26, maxFreq);
        return max((int)tasks.size(), (maxFreq-1)*(n+1)+maxCount);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Count pass + find max.",
    spaceComplexity: "O(1)",
    spaceExplanation: "26-element count array.",
    edgeCases: [
      "n=0 — no cooldown, return tasks.size().",
      "All same task — formula gives (maxFreq-1)*(n+1)+1.",
    ],
    memoryTrick: "\"Most frequent task dictates schedule. Frames of (n+1) with top task anchoring each frame. Extra tasks at end.\"",
  },

  "find-median-stream": {
    intuition: "Two heaps: max-heap for lower half, min-heap for upper half. Keep sizes balanced (|maxH| - |minH| <= 1). Median is top of larger heap or average of both tops.",
    approach: [
      "addNum: push to maxH. Move maxH.top() to minH. If minH.size() > maxH.size(): move minH.top() to maxH.",
      "findMedian: if maxH.size() > minH.size(): return maxH.top(). Else return (maxH.top()+minH.top())/2.0.",
    ],
    cppSolution: `class MedianFinder {
    priority_queue<int> lo;
    priority_queue<int,vector<int>,greater<int>> hi;
public:
    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
    }
    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : (lo.top()+hi.top())/2.0;
    }
};`,
    timeComplexity: "O(log n) add, O(1) find",
    timeExplanation: "Heap operations.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Two heaps.",
    edgeCases: [
      "Odd count — median is top of larger heap.",
      "Even count — average of both tops.",
    ],
    memoryTrick: "\"Lo=max-heap (lower half), hi=min-heap (upper half). Balance sizes. Median = tops.\"",
  },

  "merge-k-sorted": {
    intuition: "Min-heap of (value, list_index, element_index). Always extract minimum across all lists. Push next element from same list.",
    approach: [
      "Dummy head. Min-heap initialized with first element of each list.",
      "While heap not empty: pop minimum node, append to result.",
      "If that node has next: push next to heap.",
      "Return dummy.next.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        using T = pair<int, ListNode*>;
        priority_queue<T, vector<T>, greater<T>> pq;
        for (auto l : lists) if (l) pq.push({l->val, l});
        ListNode dummy(0), *cur = &dummy;
        while (!pq.empty()) {
            auto [v, node] = pq.top(); pq.pop();
            cur->next = node; cur = cur->next;
            if (node->next) pq.push({node->next->val, node->next});
        }
        return dummy.next;
    }
};`,
    timeComplexity: "O(N log k)",
    timeExplanation: "N = total nodes, k = number of lists.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Heap of size k.",
    edgeCases: [
      "Empty lists array — return null.",
      "Some lists null — filtered at init.",
    ],
    memoryTrick: "\"Min-heap tournament. k contestants (list heads). Always advance winner's next candidate.\"",
  },

  "lru-cache": {
    intuition: "Combine hashmap (O(1) lookup) with doubly-linked list (O(1) insertion/deletion). Most recently used at head, least recently used at tail. On access/put: move to head. On eviction: remove tail.",
    approach: [
      "Doubly linked list with dummy head and tail.",
      "HashMap: key → node.",
      "get(key): if not found return -1. Move node to head, return val.",
      "put(key, val): if exists update and move to head. Else create, add to head. If over capacity, remove tail (also from map).",
    ],
    cppSolution: `class LRUCache {
    struct Node { int k,v; Node *prev,*next; };
    int cap; unordered_map<int,Node*> mp;
    Node *head, *tail;
    void remove(Node* n) { n->prev->next=n->next; n->next->prev=n->prev; }
    void addFront(Node* n) { n->next=head->next; n->prev=head; head->next->prev=n; head->next=n; }
public:
    LRUCache(int cap):cap(cap){
        head=new Node(); tail=new Node();
        head->next=tail; tail->prev=head;
    }
    int get(int k){
        if (!mp.count(k)) return -1;
        remove(mp[k]); addFront(mp[k]); return mp[k]->v;
    }
    void put(int k,int v){
        if (mp.count(k)){mp[k]->v=v;remove(mp[k]);addFront(mp[k]);return;}
        Node* n=new Node{k,v};mp[k]=n;addFront(n);
        if ((int)mp.size()>cap){mp.erase(tail->prev->k);remove(tail->prev);}
    }
};`,
    timeComplexity: "O(1) both operations",
    timeExplanation: "Hashmap O(1), linked list O(1) with pointers.",
    spaceComplexity: "O(capacity)",
    spaceExplanation: "Map and list hold capacity nodes.",
    edgeCases: [
      "Capacity 1 — every put evicts previous.",
      "Get on non-existent key — return -1.",
    ],
    memoryTrick: "\"DLL + HashMap. MRU at head, LRU at tail. Access = move to head. Evict = remove tail.\"",
  },

  "kth-smallest-bst": {
    intuition: "Inorder traversal of BST gives sorted sequence. k-th element in inorder = kth smallest. Perform inorder, count down.",
    approach: [
      "Inorder DFS (left → root → right).",
      "Decrement k on each visit. When k == 0: record answer.",
    ],
    cppSolution: `class Solution {
    int ans;
    void inorder(TreeNode* node, int& k) {
        if (!node || k == 0) return;
        inorder(node->left, k);
        if (--k == 0) { ans = node->val; return; }
        inorder(node->right, k);
    }
public:
    int kthSmallest(TreeNode* root, int k) {
        inorder(root, k);
        return ans;
    }
};`,
    timeComplexity: "O(H + k)",
    timeExplanation: "H = height to get to leftmost, then k steps.",
    spaceComplexity: "O(H)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "k=1 — leftmost (minimum) node.",
      "k=n — rightmost (maximum) node.",
    ],
    memoryTrick: "\"Inorder BST = sorted. k-th visit = k-th smallest.\"",
  },

  "validate-bst": {
    intuition: "Pass valid range [min, max] down recursively. Root (-∞, +∞). Left subtree (-∞, root.val). Right subtree (root.val, +∞). Any violation → invalid.",
    approach: [
      "validate(node, minVal, maxVal):",
      "If null: return true.",
      "If node.val <= minVal || node.val >= maxVal: return false.",
      "Return validate(left, minVal, node.val) && validate(right, node.val, maxVal).",
    ],
    cppSolution: `class Solution {
    bool validate(TreeNode* node, long lo, long hi) {
        if (!node) return true;
        if (node->val <= lo || node->val >= hi) return false;
        return validate(node->left, lo, node->val) && validate(node->right, node->val, hi);
    }
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Duplicate values — strict inequality, duplicates make invalid BST.",
      "INT_MIN/INT_MAX as node values — use LONG_MIN/LONG_MAX as bounds.",
    ],
    memoryTrick: "\"Each node has a valid range. Ranges narrow as you go deeper. Use long to handle INT boundaries.\"",
  },

  "lowest-common-ancestor": {
    intuition: "BST property: if both p and q are less than root, LCA is in left subtree. If both greater, in right. If split (one each side, or one equals root), root is LCA.",
    approach: [
      "While root not null:",
      "If p.val < root.val && q.val < root.val: root = root.left.",
      "Else if p.val > root.val && q.val > root.val: root = root.right.",
      "Else: return root (split point or one of them is root).",
    ],
    cppSolution: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        while (root) {
            if (p->val < root->val && q->val < root->val) root = root->left;
            else if (p->val > root->val && q->val > root->val) root = root->right;
            else return root;
        }
        return nullptr;
    }
};`,
    timeComplexity: "O(h)",
    timeExplanation: "h = tree height.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Iterative, no recursion.",
    edgeCases: [
      "One of p,q is the LCA — returned when root equals one of them.",
      "p and q on opposite sides — root is the split = LCA.",
    ],
    memoryTrick: "\"BST: if both left go left, both right go right, else split = LCA.\"",
  },

  "count-good-nodes": {
    intuition: "DFS passing the maximum value seen so far on the path from root. A node is 'good' if its value >= that maximum.",
    approach: [
      "DFS(node, maxSoFar):",
      "If null: return 0.",
      "good = (node->val >= maxSoFar) ? 1 : 0.",
      "newMax = max(maxSoFar, node->val).",
      "Return good + DFS(left, newMax) + DFS(right, newMax).",
    ],
    cppSolution: `class Solution {
public:
    int goodNodes(TreeNode* root) {
        function<int(TreeNode*,int)> dfs=[&](TreeNode* n,int mx)->int{
            if (!n) return 0;
            int good=(n->val>=mx)?1:0;
            int nm=max(mx,n->val);
            return good+dfs(n->left,nm)+dfs(n->right,nm);
        };
        return dfs(root,INT_MIN);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Single node — always good (maxSoFar = INT_MIN).",
      "Monotonically decreasing path — only root is good.",
    ],
    memoryTrick: "\"Pass max-so-far down the path. Good node = value >= inherited max.\"",
  },

  "max-path-sum": {
    intuition: "At each node, max path sum through it = node.val + max(0, left contribution) + max(0, right contribution). For the recursive return: only one branch (left or right) can extend upward.",
    approach: [
      "DFS returns max path sum extending upward from this node.",
      "At each node: leftGain = max(0, DFS(left)), rightGain = max(0, DFS(right)).",
      "Update global max: ans = max(ans, node->val + leftGain + rightGain).",
      "Return node->val + max(leftGain, rightGain).",
    ],
    cppSolution: `class Solution {
    int ans = INT_MIN;
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int l = max(0, dfs(node->left)), r = max(0, dfs(node->right));
        ans = max(ans, node->val + l + r);
        return node->val + max(l, r);
    }
public:
    int maxPathSum(TreeNode* root) { dfs(root); return ans; }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node once.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "All negative — path is single most-negative-least node.",
      "Path doesn't go through root — global max catches it.",
    ],
    memoryTrick: "\"Track global max (can fork). Return to parent max of one branch only (can't fork going up).\"",
  },

  "serialize-deserialize": {
    intuition: "Preorder DFS serialization. Use '#' for null nodes, ',' as delimiter. Deserialize by reading tokens and reconstructing preorder.",
    approach: [
      "Serialize: DFS, append node val or '#' for null, separated by ','.",
      "Deserialize: split by ',', use index counter, recursively build preorder.",
    ],
    cppSolution: `class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val)+","+serialize(root->left)+","+serialize(root->right);
    }
    TreeNode* des(istringstream& ss) {
        string t; getline(ss, t, ',');
        if (t=="#") return nullptr;
        TreeNode* n=new TreeNode(stoi(t));
        n->left=des(ss); n->right=des(ss); return n;
    }
    TreeNode* deserialize(string data) {
        istringstream ss(data); return des(ss);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit each node once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Serialized string + recursion stack.",
    edgeCases: [
      "Empty tree — serialize to '#', deserialize back to null.",
      "Single node — 'val,#,#'.",
    ],
    memoryTrick: "\"Preorder + null markers = unique reconstruction. '#' = null placeholder. Read tokens = rebuild preorder.\"",
  },

  "average-of-levels": {
    intuition: "BFS level by level. For each level, compute average of all node values.",
    approach: [
      "BFS with level separation (queue size snapshot).",
      "Collect level sum and count, compute average.",
    ],
    cppSolution: `class Solution {
public:
    vector<double> averageOfLevels(TreeNode* root) {
        vector<double> res;
        queue<TreeNode*> q;
        if (root) q.push(root);
        while (!q.empty()) {
            int sz=q.size(); double sum=0;
            for (int i=0;i<sz;i++){
                auto n=q.front();q.pop(); sum+=n->val;
                if (n->left) q.push(n->left);
                if (n->right) q.push(n->right);
            }
            res.push_back(sum/sz);
        }
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit every node.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Queue max width.",
    edgeCases: [
      "Single node — one level average.",
      "Unbalanced tree — works correctly.",
    ],
    memoryTrick: "\"BFS + average = level order with running sum/count.\"",
  },

  "binary-tree-paths": {
    intuition: "DFS collecting path string. At leaf, add to result. Pass path by value for automatic backtracking.",
    approach: [
      "DFS(node, path).",
      "At leaf: append path to result.",
      "Recurse: DFS(left, path+'->'+left.val), DFS(right, ...).",
    ],
    cppSolution: `class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> res;
        function<void(TreeNode*,string)> dfs=[&](TreeNode* n,string p){
            if (!n) return;
            p += (p.empty()?"":"->")+to_string(n->val);
            if (!n->left&&!n->right) res.push_back(p);
            dfs(n->left,p); dfs(n->right,p);
        };
        dfs(root,""); return res;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "n nodes, string copy O(n) each.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion stack + path string.",
    edgeCases: [
      "Single node — one path: ['val'].",
      "Skewed tree — one path to the single leaf.",
    ],
    memoryTrick: "\"Pass path by value → auto backtrack. At leaf → record. Simplifies vs explicit backtracking.\"",
  },

  "path-sum": {
    intuition: "DFS with running sum. At each node subtract its value from target. At leaf check if remainder == 0.",
    approach: [
      "If null: return false.",
      "remaining = targetSum - node->val.",
      "If leaf (no children) and remaining == 0: return true.",
      "Return pathSum(left, remaining) || pathSum(right, remaining).",
    ],
    cppSolution: `class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;
        targetSum -= root->val;
        if (!root->left && !root->right) return targetSum == 0;
        return hasPathSum(root->left, targetSum) || hasPathSum(root->right, targetSum);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Visit each node.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack.",
    edgeCases: [
      "Empty tree — return false.",
      "Sum uses negative values — arithmetic handles correctly.",
    ],
    memoryTrick: "\"Chip away at target. At leaf, if nothing left, path found.\"",
  },

  "construct-tree-preorder": {
    intuition: "Preorder[0] = root. Find root in inorder — left part is left subtree, right part is right subtree. Recurse with proper index ranges. Use hashmap for O(1) inorder lookup.",
    approach: [
      "Build inorder index map.",
      "build(preStart, preEnd, inStart, inEnd):",
      "root = new TreeNode(preorder[preStart]).",
      "mid = inorder index of root value.",
      "leftSize = mid - inStart.",
      "Recurse for left and right with adjusted ranges.",
    ],
    cppSolution: `class Solution {
    unordered_map<int,int> inIdx;
public:
    TreeNode* buildTree(vector<int>& pre, vector<int>& in) {
        for (int i=0;i<(int)in.size();i++) inIdx[in[i]]=i;
        function<TreeNode*(int,int,int,int)> build=[&](int ps,int pe,int is,int ie)->TreeNode*{
            if (ps>pe) return nullptr;
            TreeNode* root=new TreeNode(pre[ps]);
            int mid=inIdx[pre[ps]], leftSz=mid-is;
            root->left=build(ps+1,ps+leftSz,is,mid-1);
            root->right=build(ps+leftSz+1,pe,mid+1,ie);
            return root;
        };
        return build(0,pre.size()-1,0,in.size()-1);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node created once, O(1) lookup.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Index map + recursion stack.",
    edgeCases: [
      "Single element — root only.",
      "Left-skewed — preorder = inorder reversed.",
    ],
    memoryTrick: "\"Preorder tells root. Inorder tells split. Left size = mid - inStart. Recurse with adjusted boundaries.\"",
  },

  "roman-to-integer": {
    intuition: "Map each Roman numeral to its value. Walk left to right. If current value < next value, subtract current (subtractive pair like IV=4). Else add.",
    approach: [
      "Map: I=1,V=5,X=10,L=50,C=100,D=500,M=1000.",
      "For i from 0 to n-2: if val[s[i]] < val[s[i+1]]: result -= val[s[i]]. Else: result += val[s[i]].",
      "Always add last character.",
    ],
    cppSolution: `class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char,int> m={{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
        int res=0;
        for (int i=0;i<(int)s.size()-1;i++)
            res += m[s[i]] < m[s[i+1]] ? -m[s[i]] : m[s[i]];
        return res + m[s.back()];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed-size map.",
    edgeCases: [
      "Single char — return its value.",
      "All subtractive pairs — all negated except last.",
    ],
    memoryTrick: "\"Smaller before larger = subtract. Otherwise add. Process all but last, then add last.\"",
  },

  "happy-number": {
    intuition: "Repeatedly replace number with sum of squares of digits. Eventually hits 1 (happy) or enters cycle. Floyd's cycle detection catches cycle without HashSet.",
    approach: [
      "sumSquares(n): extract digits, sum squares.",
      "Fast/slow pointers: slow=sumSquares(n), fast=sumSquares(sumSquares(n)).",
      "Loop until slow==fast. If slow==1: return true. Else false.",
    ],
    cppSolution: `class Solution {
    int sq(int n){int s=0;while(n){int d=n%10;s+=d*d;n/=10;}return s;}
public:
    bool isHappy(int n) {
        int slow=n, fast=sq(n);
        while (slow!=fast){slow=sq(slow);fast=sq(sq(fast));}
        return slow==1;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Digits reduce quickly; cycle detection O(cycle length).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Floyd's — no HashSet.",
    edgeCases: [
      "n=1 — immediately happy.",
      "n=4 — enters cycle: 4→16→37→58→89→145→42→20→4.",
    ],
    memoryTrick: "\"Sum-of-digit-squares is linked list. Floyd detects cycle. Cycle on 1 = happy.\"",
  },

  "plus-one": {
    intuition: "Add 1 from last digit. If becomes 10, set 0 and carry. If carry propagates through all digits, prepend 1.",
    approach: [
      "Walk from end to start.",
      "If digit < 9: increment and return.",
      "Else set 0 and continue.",
      "If loop ends: prepend 1 (all-9s case).",
    ],
    cppSolution: `class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        for (int i=digits.size()-1;i>=0;i--){
            if (digits[i]<9){digits[i]++;return digits;}
            digits[i]=0;
        }
        digits.insert(digits.begin(),1);
        return digits;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass worst case.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place except all-9s case.",
    edgeCases: [
      "[9,9,9] → [1,0,0,0].",
      "[1,2,9] → [1,3,0].",
    ],
    memoryTrick: "\"Carry propagation. digit<9 = no carry, done. digit=9 = zero + carry forward. All 9s = prepend 1.\"",
  },

  "pow-x-n": {
    intuition: "Fast exponentiation (binary). Even n: x^n = (x²)^(n/2). Odd n: x^n = x × x^(n-1). O(log n). Handle negative n.",
    approach: [
      "If n < 0: x = 1/x, n = -n. Use long long for n.",
      "result = 1.",
      "While n > 0: if n odd: result *= x. x *= x. n >>= 1.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    double myPow(double x, int n) {
        long long N = n;
        if (N < 0) { x = 1/x; N = -N; }
        double res = 1;
        while (N) {
            if (N & 1) res *= x;
            x *= x; N >>= 1;
        }
        return res;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Halve exponent each step.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Iterative.",
    edgeCases: [
      "n=INT_MIN — negate causes overflow; use long long.",
      "x=0,n=0 — 0^0=1 by convention.",
    ],
    memoryTrick: "\"Square x, halve n. Odd n = multiply result. Log n steps.\"",
  },

  "reverse-integer": {
    intuition: "Extract digits right to left, build reversed number. Before each step check if adding next digit would overflow 32-bit int bounds.",
    approach: [
      "rev = 0.",
      "While x != 0: digit = x%10. x /= 10.",
      "If rev > INT_MAX/10 or rev < INT_MIN/10: return 0.",
      "rev = rev*10 + digit.",
      "Return rev.",
    ],
    cppSolution: `class Solution {
public:
    int reverse(int x) {
        int rev=0;
        while (x){
            int d=x%10; x/=10;
            if (rev>INT_MAX/10||(rev==INT_MAX/10&&d>7)) return 0;
            if (rev<INT_MIN/10||(rev==INT_MIN/10&&d<-8)) return 0;
            rev=rev*10+d;
        }
        return rev;
    }
};`,
    timeComplexity: "O(log x)",
    timeExplanation: "Number of digits.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "Negative x — % in C++ keeps sign, works correctly.",
      "x=1000 → reversed=1 (trailing zeros drop).",
    ],
    memoryTrick: "\"Check overflow BEFORE multiplying. INT_MAX last digit is 7, INT_MIN is -8.\"",
  },

  "trapping-rain-water": {
    intuition: "Two-pointer. Water at each index = min(maxLeft, maxRight) - height[i]. Track running maxLeft and maxRight from each side. Process the smaller-max side first.",
    approach: [
      "l=0, r=n-1, maxL=0, maxR=0, water=0.",
      "While l < r: if height[l] <= height[r]: maxL=max(maxL,height[l]). water+=maxL-height[l]. l++. Else: same for right side.",
    ],
    cppSolution: `class Solution {
public:
    int trap(vector<int>& height) {
        int l=0,r=height.size()-1,maxL=0,maxR=0,water=0;
        while(l<r){
            if(height[l]<=height[r]){
                maxL=max(maxL,height[l]);
                water+=maxL-height[l++];
            } else {
                maxR=max(maxR,height[r]);
                water+=maxR-height[r--];
            }
        }
        return water;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Four variables.",
    edgeCases: [
      "Monotonically increasing/decreasing — no water trapped.",
      "Single valley — trapped = min(left peak, right peak) - valley.",
    ],
    memoryTrick: "\"Process smaller-max side. That side's water bounded by its own running max (taller side guaranteed >= it).\"",
  },

  "largest-rectangle-histogram": {
    intuition: "Monotonic stack of indices (increasing heights). When shorter bar found, pop and calculate area using popped bar as height. Width = i to left stack element.",
    approach: [
      "Append 0-height sentinel to force all pops at end.",
      "For each bar: while stack not empty and height < height[stack.top()]: pop, compute area.",
      "  Width = i - stack.top() - 1 (or i if stack empty).",
      "Push current index.",
    ],
    cppSolution: `class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        heights.push_back(0);
        stack<int> st;
        int maxA=0;
        for (int i=0;i<(int)heights.size();i++){
            while (!st.empty()&&heights[i]<heights[st.top()]){
                int h=heights[st.top()]; st.pop();
                int w=st.empty()?i:i-st.top()-1;
                maxA=max(maxA,h*w);
            }
            st.push(i);
        }
        return maxA;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each index pushed/popped once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack.",
    edgeCases: [
      "All same height — one rectangle spans all.",
      "Decreasing heights — sentinel 0 forces all pops.",
    ],
    memoryTrick: "\"Stack = pending bars waiting for right boundary. Shorter bar = right boundary of all taller pending bars.\"",
  },

  "valid-parenthesis-string": {
    intuition: "Track range [lo, hi] of possible open-paren counts. '(' increments both. ')' decrements both. '*' expands range (lo--, hi++). Clamp lo at 0. If hi < 0: invalid. End: lo must be 0.",
    approach: [
      "lo=0, hi=0.",
      "For each c: '(' → lo++,hi++. ')' → lo--,hi--. '*' → lo--,hi++.",
      "lo = max(lo, 0).",
      "If hi < 0: return false.",
      "Return lo == 0.",
    ],
    cppSolution: `class Solution {
public:
    bool checkValidString(string s) {
        int lo=0,hi=0;
        for (char c:s){
            if(c=='('){lo++;hi++;}
            else if(c==')'){lo--;hi--;}
            else{lo--;hi++;}
            if(hi<0) return false;
            lo=max(lo,0);
        }
        return lo==0;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two counters.",
    edgeCases: [
      "All '*' — lo stays 0 (clamped), hi grows, lo==0 at end.",
      "'(*' — lo=0,hi=2. Valid.",
    ],
    memoryTrick: "\"Track possible open-count range [lo,hi]. '*' expands it. ')' shrinks it. Clamp lo at 0. End: lo==0.\"",
  },

  "surrounded-regions": {
    intuition: "Any 'O' connected to border is safe. DFS/BFS from all border 'O's, mark them. Then flip all remaining 'O' to 'X', restore marked to 'O'.",
    approach: [
      "For each border cell with 'O': DFS to mark connected 'O's as 'S'.",
      "Scan grid: 'O' → 'X'. 'S' → 'O'. 'X' stays 'X'.",
    ],
    cppSolution: `class Solution {
    void dfs(vector<vector<char>>& b,int r,int c){
        if(r<0||r>=(int)b.size()||c<0||c>=(int)b[0].size()||b[r][c]!='O') return;
        b[r][c]='S';
        dfs(b,r+1,c);dfs(b,r-1,c);dfs(b,r,c+1);dfs(b,r,c-1);
    }
public:
    void solve(vector<vector<char>>& board) {
        int m=board.size(),n=board[0].size();
        for(int i=0;i<m;i++){dfs(board,i,0);dfs(board,i,n-1);}
        for(int j=0;j<n;j++){dfs(board,0,j);dfs(board,m-1,j);}
        for(int i=0;i<m;i++) for(int j=0;j<n;j++)
            board[i][j]=(board[i][j]=='S')?'O':'X';
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Visit every cell.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DFS stack worst case.",
    edgeCases: [
      "All 'O' on border — nothing flipped.",
      "Single 'O' not on border — flipped.",
    ],
    memoryTrick: "\"Save border-connected O's (mark S). Then flip everything O→X. Restore S→O.\"",
  },

  "evaluate-division": {
    intuition: "Build weighted directed graph: a/b=val → edge a→b weight val, b→a weight 1/val. For each query BFS from source to target, multiply edge weights along path.",
    approach: [
      "Build adj: adj[a][b]=val, adj[b][a]=1/val.",
      "For each query (a,b): BFS from a to b, tracking product.",
      "If a or b unknown, or no path: return -1.",
    ],
    cppSolution: `class Solution {
public:
    vector<double> calcEquation(vector<vector<string>>& eq, vector<double>& vals, vector<vector<string>>& queries) {
        unordered_map<string,unordered_map<string,double>> g;
        for(int i=0;i<(int)eq.size();i++){
            g[eq[i][0]][eq[i][1]]=vals[i];
            g[eq[i][1]][eq[i][0]]=1.0/vals[i];
        }
        auto bfs=[&](string s,string t)->double{
            if(!g.count(s)||!g.count(t)) return -1;
            if(s==t) return 1;
            unordered_set<string> vis;
            queue<pair<string,double>> q;
            q.push({s,1.0}); vis.insert(s);
            while(!q.empty()){
                auto [node,prod]=q.front();q.pop();
                for(auto& [nb,w]:g[node]){
                    if(nb==t) return prod*w;
                    if(!vis.count(nb)){vis.insert(nb);q.push({nb,prod*w});}
                }
            }
            return -1;
        };
        vector<double> res;
        for(auto& query:queries) res.push_back(bfs(query[0],query[1]));
        return res;
    }
};`,
    timeComplexity: "O((V+E) × Q)",
    timeExplanation: "BFS per query.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Graph storage.",
    edgeCases: [
      "a==b — return 1.0 if a exists.",
      "Unknown variable — return -1.",
    ],
    memoryTrick: "\"Weighted graph. Division = path product of edge weights. BFS accumulates product.\"",
  },

  "network-delay-time": {
    intuition: "Single source shortest path from k. Dijkstra with min-heap. Answer = max dist among all nodes. If any unreachable: -1.",
    approach: [
      "Build adjacency list.",
      "Dijkstra from k: min-heap (dist, node). dist[k]=0, others INF.",
      "Relax neighbors, skip stale entries.",
      "Return max of dist[], or -1 if any INF.",
    ],
    cppSolution: `class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int,int>>> g(n+1);
        for(auto& t:times) g[t[0]].push_back({t[1],t[2]});
        vector<int> dist(n+1,INT_MAX); dist[k]=0;
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;
        pq.push({0,k});
        while(!pq.empty()){
            auto [d,u]=pq.top();pq.pop();
            if(d>dist[u]) continue;
            for(auto [v,w]:g[u]) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push({dist[v],v});}
        }
        int ans=*max_element(dist.begin()+1,dist.end());
        return ans==INT_MAX?-1:ans;
    }
};`,
    timeComplexity: "O((V+E) log V)",
    timeExplanation: "Dijkstra with binary heap.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Graph + dist array.",
    edgeCases: [
      "Disconnected — dist stays INF, return -1.",
      "Single node — dist[k]=0, return 0.",
    ],
    memoryTrick: "\"Dijkstra from k. Signal propagation = shortest path. Answer = slowest node (max dist).\"",
  },

  "redundant-connection": {
    intuition: "Union-Find. Add edges one by one. If both endpoints already same component: that edge creates cycle — return it.",
    approach: [
      "Union-Find with path compression + rank.",
      "For each edge (u,v): if find(u)==find(v): return {u,v}.",
      "Else union(u,v).",
    ],
    cppSolution: `class Solution {
    vector<int> parent, rnk;
    int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}
    bool unite(int a,int b){
        a=find(a);b=find(b);
        if(a==b) return false;
        if(rnk[a]<rnk[b]) swap(a,b);
        parent[b]=a; if(rnk[a]==rnk[b]) rnk[a]++;
        return true;
    }
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n=edges.size();
        parent.resize(n+1);rnk.resize(n+1,0);
        iota(parent.begin(),parent.end(),0);
        for(auto& e:edges) if(!unite(e[0],e[1])) return e;
        return {};
    }
};`,
    timeComplexity: "O(n α(n))",
    timeExplanation: "n edges, near-O(1) per union-find op.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent + rank arrays.",
    edgeCases: [
      "Always exactly one redundant edge (guaranteed).",
    ],
    memoryTrick: "\"Union-Find: same component = cycle edge. Return immediately.\"",
  },

  "min-cost-connect-points": {
    intuition: "MST on complete graph with Manhattan distance edges. Prim's without heap is O(n²) — efficient for dense graphs. Always add cheapest unvisited node reachable from current MST.",
    approach: [
      "minCost[i] = min cost to connect node i to MST. Start: minCost[0]=0, rest INF.",
      "n times: pick unvisited u with min cost. Mark visited. Update minCost[v] for all unvisited v.",
      "Sum = total MST cost.",
    ],
    cppSolution: `class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& pts) {
        int n=pts.size();
        vector<int> cost(n,INT_MAX); cost[0]=0;
        vector<bool> vis(n,false);
        int total=0;
        for(int i=0;i<n;i++){
            int u=-1;
            for(int j=0;j<n;j++) if(!vis[j]&&(u==-1||cost[j]<cost[u])) u=j;
            vis[u]=true; total+=cost[u];
            for(int v=0;v<n;v++) if(!vis[v]){
                int d=abs(pts[u][0]-pts[v][0])+abs(pts[u][1]-pts[v][1]);
                cost[v]=min(cost[v],d);
            }
        }
        return total;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Prim's without heap on dense graph.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Cost and visited arrays.",
    edgeCases: [
      "Single point — cost = 0.",
      "Two points — cost = Manhattan distance.",
    ],
    memoryTrick: "\"Prim's = greedy MST. Closest unconnected point to current tree. Manhattan distance = edge weight.\"",
  },

  "swim-rising-water": {
    intuition: "Minimax path: minimize the maximum cell value along path from (0,0) to (n-1,n-1). Dijkstra where cost = max(cost_so_far, cell_value).",
    approach: [
      "dist[i][j] = min bottleneck value to reach cell.",
      "Min-heap: (maxVal, r, c). Start (grid[0][0], 0, 0).",
      "Relax: new_cost = max(dist[r][c], grid[nr][nc]).",
      "Return dist[n-1][n-1].",
    ],
    cppSolution: `class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n=grid.size();
        vector<vector<int>> dist(n,vector<int>(n,INT_MAX));
        dist[0][0]=grid[0][0];
        priority_queue<tuple<int,int,int>,vector<tuple<int,int,int>>,greater<>> pq;
        pq.push({grid[0][0],0,0});
        int dirs[]={0,1,0,-1,0};
        while(!pq.empty()){
            auto [t,r,c]=pq.top();pq.pop();
            if(r==n-1&&c==n-1) return t;
            if(t>dist[r][c]) continue;
            for(int d=0;d<4;d++){
                int nr=r+dirs[d],nc=c+dirs[d+1];
                if(nr<0||nr>=n||nc<0||nc>=n) continue;
                int nt=max(t,grid[nr][nc]);
                if(nt<dist[nr][nc]){dist[nr][nc]=nt;pq.push({nt,nr,nc});}
            }
        }
        return -1;
    }
};`,
    timeComplexity: "O(n² log n)",
    timeExplanation: "Dijkstra on n² nodes.",
    spaceComplexity: "O(n²)",
    spaceExplanation: "Dist grid.",
    edgeCases: [
      "1×1 grid — return grid[0][0].",
    ],
    memoryTrick: "\"Minimax path. Dijkstra with max-relaxation instead of sum-relaxation.\"",
  },

  "cheapest-flights": {
    intuition: "Bellman-Ford limited to k+1 rounds (k stops = k+1 edges). Use copy of previous round's distances to prevent same-round chaining.",
    approach: [
      "dist = INF everywhere. dist[src] = 0.",
      "k+1 times: tmp = copy of dist. For each edge (u,v,w): if dist[u]+w < tmp[v]: tmp[v]=dist[u]+w.",
      "dist = tmp.",
      "Return dist[dst] == INF ? -1 : dist[dst].",
    ],
    cppSolution: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> dist(n,INT_MAX); dist[src]=0;
        for(int i=0;i<=k;i++){
            vector<int> tmp=dist;
            for(auto& f:flights)
                if(dist[f[0]]!=INT_MAX&&dist[f[0]]+f[2]<tmp[f[1]])
                    tmp[f[1]]=dist[f[0]]+f[2];
            dist=tmp;
        }
        return dist[dst]==INT_MAX?-1:dist[dst];
    }
};`,
    timeComplexity: "O(k × E)",
    timeExplanation: "k+1 rounds, E edges each.",
    spaceComplexity: "O(V)",
    spaceExplanation: "dist and tmp arrays.",
    edgeCases: [
      "src==dst — return 0.",
      "No path within k stops — return -1.",
    ],
    memoryTrick: "\"Bellman-Ford capped at k+1 rounds. Copy prevents chaining beyond allowed stops.\"",
  },

  "add-search-words": {
    intuition: "Trie for insertion. DFS for search — '.' matches any child, letter matches exact child. Backtrack through trie for wildcard.",
    approach: [
      "Trie with isEnd flag.",
      "addWord: standard trie insert.",
      "search: DFS from root. For '.': recurse all non-null children. For letter: recurse if child exists.",
    ],
    cppSolution: `class WordDictionary {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root=new Node();
    bool dfs(Node* n, const string& w, int i){
        if(!n) return false;
        if(i==(int)w.size()) return n->end;
        if(w[i]=='.'){
            for(auto c:n->ch) if(dfs(c,w,i+1)) return true;
            return false;
        }
        return dfs(n->ch[w[i]-'a'],w,i+1);
    }
public:
    void addWord(string w){
        Node* cur=root;
        for(char c:w){int i=c-'a';if(!cur->ch[i])cur->ch[i]=new Node();cur=cur->ch[i];}
        cur->end=true;
    }
    bool search(string w){ return dfs(root,w,0); }
};`,
    timeComplexity: "O(M) add, O(26^M) worst search",
    timeExplanation: "All wildcards = DFS all 26 branches at each level.",
    spaceComplexity: "O(total chars)",
    spaceExplanation: "Trie nodes.",
    edgeCases: [
      "All wildcards — must explore entire trie.",
      "Exact match — O(M) search.",
    ],
    memoryTrick: "\"Trie + DFS. Letter = go down. Wildcard '.' = try all 26 children.\"",
  },

  "word-search-ii": {
    intuition: "Build Trie from all words. DFS from each board cell, matching Trie path. When Trie node has word ending, record it. Clear word after found to deduplicate.",
    approach: [
      "Build Trie from words.",
      "DFS(board, r, c, TrieNode): mark cell '#'. For each neighbor: if char in trie children, recurse.",
      "On isEnd: add word to result, clear to avoid duplicates.",
      "Restore cell after recursion.",
    ],
    cppSolution: `class Solution {
    struct T{T*ch[26]={};string word;};
    T* root=new T();
    void ins(const string& w){T*n=root;for(char c:w){int i=c-'a';if(!n->ch[i])n->ch[i]=new T();n=n->ch[i];}n->word=w;}
    void dfs(vector<vector<char>>& b,int r,int c,T* n,vector<string>& res){
        if(r<0||r>=(int)b.size()||c<0||c>=(int)b[0].size()||b[r][c]=='#') return;
        char ch=b[r][c]; T* nx=n->ch[ch-'a'];
        if(!nx) return;
        if(!nx->word.empty()){res.push_back(nx->word);nx->word="";}
        b[r][c]='#';
        dfs(b,r+1,c,nx,res);dfs(b,r-1,c,nx,res);dfs(b,r,c+1,nx,res);dfs(b,r,c-1,nx,res);
        b[r][c]=ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board,vector<string>& words){
        for(auto& w:words) ins(w);
        vector<string> res;
        for(int i=0;i<(int)board.size();i++) for(int j=0;j<(int)board[0].size();j++) dfs(board,i,j,root,res);
        return res;
    }
};`,
    timeComplexity: "O(M × 4 × 3^(L-1))",
    timeExplanation: "M = board cells, L = word length.",
    spaceComplexity: "O(W × L)",
    spaceExplanation: "Trie storage.",
    edgeCases: [
      "Empty words — return empty.",
      "Word not on board — DFS prunes via trie.",
    ],
    memoryTrick: "\"Trie prunes DFS: only follow prefixes that exist. Clear word after found to deduplicate.\"",
  },

  "merge-triplets": {
    intuition: "Skip any triplet that exceeds target in any component (it can't help). From remaining valid triplets, take max per component. Check if result equals target.",
    approach: [
      "For each triplet: if any triplet[i] > target[i]: skip.",
      "Else update best[i] = max(best[i], triplet[i]) for each i.",
      "Return best == target.",
    ],
    cppSolution: `class Solution {
public:
    bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
        vector<int> best(3,0);
        for(auto& t:triplets){
            if(t[0]>target[0]||t[1]>target[1]||t[2]>target[2]) continue;
            for(int i=0;i<3;i++) best[i]=max(best[i],t[i]);
        }
        return best==target;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "No valid triplet achieves target[i] for some i — false.",
      "Single triplet equals target — true.",
    ],
    memoryTrick: "\"Skip over-budget triplets. Merge valid by max. Result must equal target exactly.\"",
  },

  "min-interval-query": {
    intuition: "Sort queries and intervals by start. Min-heap of (size, end) for active intervals. For each query: add intervals starting <= query. Remove expired. Heap top = smallest active.",
    approach: [
      "Sort intervals by start. Sort query indices by query value.",
      "Min-heap (size, end). i=0 pointer into intervals.",
      "For each query: push all intervals with start <= query. Pop expired (end < query). ans[qi] = heap empty ? -1 : heap.top().size.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        sort(intervals.begin(),intervals.end());
        int n=queries.size();
        vector<int> idx(n);iota(idx.begin(),idx.end(),0);
        sort(idx.begin(),idx.end(),[&](int a,int b){return queries[a]<queries[b];});
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;
        int i=0; vector<int> ans(n);
        for(int qi:idx){
            int q=queries[qi];
            while(i<(int)intervals.size()&&intervals[i][0]<=q){
                pq.push({intervals[i][1]-intervals[i][0]+1,intervals[i][1]});i++;
            }
            while(!pq.empty()&&pq.top().second<q) pq.pop();
            ans[qi]=pq.empty()?-1:pq.top().first;
        }
        return ans;
    }
};`,
    timeComplexity: "O((n+q) log n)",
    timeExplanation: "Sort + heap ops.",
    spaceComplexity: "O(n+q)",
    spaceExplanation: "Heap + index array.",
    edgeCases: [
      "Query not in any interval — return -1.",
      "Multiple intervals contain query — return smallest size.",
    ],
    memoryTrick: "\"Sweep queries left to right. Add intervals as start reached. Remove expired. Top = smallest containing.\"",
  },

  "distinct-subsequences": {
    intuition: "DP: dp[i][j] = ways to embed t[0..j-1] in s[0..i-1]. Match: dp[i][j] = dp[i-1][j-1] + dp[i-1][j] (use current char or skip). No match: dp[i][j] = dp[i-1][j].",
    approach: [
      "dp[0][j]=0. dp[i][0]=1.",
      "If s[i-1]==t[j-1]: dp[i][j]=dp[i-1][j-1]+dp[i-1][j].",
      "Else: dp[i][j]=dp[i-1][j].",
    ],
    cppSolution: `class Solution {
public:
    int numDistinct(string s, string t) {
        int m=s.size(),n=t.size();
        vector<vector<long>> dp(m+1,vector<long>(n+1,0));
        for(int i=0;i<=m;i++) dp[i][0]=1;
        for(int i=1;i<=m;i++)
            for(int j=1;j<=n;j++)
                dp[i][j]=dp[i-1][j]+(s[i-1]==t[j-1]?dp[i-1][j-1]:0);
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill DP table.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "t longer than s — answer 0.",
      "s == t — answer 1.",
    ],
    memoryTrick: "\"Match: use (diagonal) + skip (up). No match: skip only (up). Count embeddings of t in s.\"",
  },

  "interleaving-string": {
    intuition: "DP: dp[i][j] = can s1[0..i-1] and s2[0..j-1] interleave to form s3[0..i+j-1]. Two ways to reach dp[i][j]: use s1[i-1] or use s2[j-1].",
    approach: [
      "dp[m+1][n+1]. dp[0][0]=true.",
      "Init row and col with single-string match.",
      "dp[i][j]=(dp[i-1][j]&&s1[i-1]==s3[i+j-1])||(dp[i][j-1]&&s2[j-1]==s3[i+j-1]).",
    ],
    cppSolution: `class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        int m=s1.size(),n=s2.size();
        if(m+n!=(int)s3.size()) return false;
        vector<vector<bool>> dp(m+1,vector<bool>(n+1,false));
        dp[0][0]=true;
        for(int i=1;i<=m;i++) dp[i][0]=dp[i-1][0]&&s1[i-1]==s3[i-1];
        for(int j=1;j<=n;j++) dp[0][j]=dp[0][j-1]&&s2[j-1]==s3[j-1];
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
            dp[i][j]=(dp[i-1][j]&&s1[i-1]==s3[i+j-1])||(dp[i][j-1]&&s2[j-1]==s3[i+j-1]);
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill DP table.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "len(s1)+len(s2) != len(s3) — immediately false.",
      "One string empty — reduces to simple match.",
    ],
    memoryTrick: "\"dp[i][j] = consumed i from s1 and j from s2. Reached via s1 or via s2.\"",
  },

  "burst-balloons": {
    intuition: "Interval DP. Think of LAST balloon burst in range [l,r]. If k is last burst: coins = nums[l-1]*nums[k]*nums[r+1] + dp[l][k-1] + dp[k+1][r]. Add sentinel 1s at boundaries.",
    approach: [
      "Pad nums with 1 on both ends.",
      "dp[l][r] = max coins from bursting all in [l,r].",
      "For each length, all ranges, all k as last burst.",
    ],
    cppSolution: `class Solution {
public:
    int maxCoins(vector<int>& nums) {
        nums.insert(nums.begin(),1); nums.push_back(1);
        int n=nums.size();
        vector<vector<int>> dp(n,vector<int>(n,0));
        for(int len=1;len<=n-2;len++)
            for(int l=1;l+len-1<=n-2;l++){
                int r=l+len-1;
                for(int k=l;k<=r;k++)
                    dp[l][r]=max(dp[l][r],nums[l-1]*nums[k]*nums[r+1]+dp[l][k-1]+dp[k+1][r]);
            }
        return dp[1][n-2];
    }
};`,
    timeComplexity: "O(n³)",
    timeExplanation: "Three nested loops.",
    spaceComplexity: "O(n²)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "Single balloon — just burst it: 1*nums[0]*1.",
    ],
    memoryTrick: "\"Think LAST burst, not first. Last burst uses sentinel neighbors. Interval DP.\"",
  },

  "regular-expression-matching": {
    intuition: "DP: dp[i][j] = s[0..i-1] matches p[0..j-1]. If p[j-1]='*': zero use (dp[i][j-2]) OR one-more use (dp[i-1][j] if s[i-1] matches p[j-2]). Else match/dot: dp[i-1][j-1].",
    approach: [
      "dp[m+1][n+1]. dp[0][0]=true.",
      "Init: dp[0][j]=true if p[j-1]='*' and dp[0][j-2]=true.",
      "Fill with cases above.",
    ],
    cppSolution: `class Solution {
    bool match(char s,char p){return p=='.'||s==p;}
public:
    bool isMatch(string s, string p) {
        int m=s.size(),n=p.size();
        vector<vector<bool>> dp(m+1,vector<bool>(n+1,false));
        dp[0][0]=true;
        for(int j=2;j<=n;j++) if(p[j-1]=='*') dp[0][j]=dp[0][j-2];
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
            if(p[j-1]=='*')
                dp[i][j]=dp[i][j-2]||(j>=2&&dp[i-1][j]&&match(s[i-1],p[j-2]));
            else
                dp[i][j]=dp[i-1][j-1]&&match(s[i-1],p[j-1]);
        }
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Fill DP table.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "'.*' matches any string.",
      "'a*' can match empty — dp[0][2]=true.",
    ],
    memoryTrick: "\"'*' = zero (skip x*) or more (extend). dp[i][j-2] = zero. dp[i-1][j] = one more.\"",
  },

  "design-twitter": {
    intuition: "Each user has tweet list (timestamp, tweetId). Followees in sets. getNewsFeed: max-heap merge over all followees' tweet lists, pull top 10.",
    approach: [
      "tweets[userId] = list of (time, tweetId).",
      "follows[userId] = set of followees.",
      "getNewsFeed: include self. Max-heap over heads. Pull up to 10, push next from same user.",
    ],
    cppSolution: `class Twitter {
    int time=0;
    unordered_map<int,vector<pair<int,int>>> tweets;
    unordered_map<int,unordered_set<int>> follows;
public:
    void postTweet(int u,int t){tweets[u].push_back({time++,t});}
    vector<int> getNewsFeed(int u){
        vector<int> res;
        using T=tuple<int,int,int,int>;
        priority_queue<T> pq;
        follows[u].insert(u);
        for(int f:follows[u]){
            auto& v=tweets[f];
            if(!v.empty()) pq.push({v.back().first,v.back().second,f,(int)v.size()-1});
        }
        while(!pq.empty()&&(int)res.size()<10){
            auto [t,tw,f,i]=pq.top();pq.pop();
            res.push_back(tw);
            if(i>0) pq.push({tweets[f][i-1].first,tweets[f][i-1].second,f,i-1});
        }
        follows[u].erase(u);
        return res;
    }
    void follow(int u,int f){follows[u].insert(f);}
    void unfollow(int u,int f){follows[u].erase(f);}
};`,
    timeComplexity: "O(k log k) feed",
    timeExplanation: "k = followees, heap of size k, pull 10.",
    spaceComplexity: "O(tweets + follows)",
    spaceExplanation: "All stored data.",
    edgeCases: [
      "Follow yourself — temp insert self, then erase.",
      "Fewer than 10 total tweets — return all.",
    ],
    memoryTrick: "\"Merge-k-sorted over followee tweets. Max-heap by timestamp. Include self temporarily.\"",
  },

  "find-duplicate-number": {
    intuition: "Floyd's cycle detection. Array as linked list: index i → nums[i]. Duplicate = two indices pointing to same value = cycle. Find cycle entry = duplicate.",
    approach: [
      "Phase 1: slow=nums[0], fast=nums[nums[0]]. Move until slow==fast.",
      "Phase 2: slow=0. Move both one step until slow==fast.",
      "Return slow.",
    ],
    cppSolution: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow=nums[0],fast=nums[nums[0]];
        while(slow!=fast){slow=nums[slow];fast=nums[nums[fast]];}
        slow=0;
        while(slow!=fast){slow=nums[slow];fast=nums[fast];}
        return slow;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes, Floyd's cycle.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers.",
    edgeCases: [
      "Duplicate appears more than twice — still finds it.",
      "n+1 numbers in [1,n] range guarantees cycle.",
    ],
    memoryTrick: "\"Array as linked list. Duplicate = two roads to same node = cycle. Floyd finds cycle entry.\"",
  },

  "nth-tribonacci": {
    intuition: "T(0)=0, T(1)=1, T(2)=1, T(n)=T(n-1)+T(n-2)+T(n-3). Rolling three variables.",
    approach: [
      "a=0,b=1,c=1.",
      "For i from 3 to n: next=a+b+c. a=b,b=c,c=next.",
      "Return c (handle n<3 base cases).",
    ],
    cppSolution: `class Solution {
public:
    int tribonacci(int n) {
        if(n==0) return 0;
        if(n<=2) return 1;
        int a=0,b=1,c=1;
        for(int i=3;i<=n;i++){int t=a+b+c;a=b;b=c;c=t;}
        return c;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single loop.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: ["n=0 → 0. n=1,2 → 1."],
    memoryTrick: "\"Fibonacci + one more. Three vars, shift window each step.\"",
  },

  "min-cost-climbing": {
    intuition: "dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Modify in-place. Top = beyond last step = min of last two.",
    approach: [
      "For i from 2 to n-1: cost[i] += min(cost[i-1], cost[i-2]).",
      "Return min(cost[n-1], cost[n-2]).",
    ],
    cppSolution: `class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int n=cost.size();
        for(int i=2;i<n;i++) cost[i]+=min(cost[i-1],cost[i-2]);
        return min(cost[n-1],cost[n-2]);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place.",
    edgeCases: ["n=2 — min(cost[0],cost[1])."],
    memoryTrick: "\"Cost to step = cost[i] + min(prev, prev-prev). Top = min of last two.\"",
  },

  "reconstruct-itinerary": {
    intuition: "Eulerian path via Hierholzer's. DFS with sorted adjacency (multiset). Post-order append builds reverse path. Reverse at end.",
    approach: [
      "Build adjacency: multiset per airport.",
      "Iterative DFS from JFK: while adj[cur] not empty, push smallest to stack. When no neighbors, pop to result.",
      "Reverse result.",
    ],
    cppSolution: `class Solution {
public:
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        unordered_map<string,multiset<string>> g;
        for(auto& t:tickets) g[t[0]].insert(t[1]);
        vector<string> res;
        stack<string> st;
        st.push("JFK");
        while(!st.empty()){
            string cur=st.top();
            if(g[cur].empty()){res.push_back(cur);st.pop();}
            else{st.push(*g[cur].begin());g[cur].erase(g[cur].begin());}
        }
        reverse(res.begin(),res.end());
        return res;
    }
};`,
    timeComplexity: "O(E log E)",
    timeExplanation: "E edges, sorted multiset insertions.",
    spaceComplexity: "O(E)",
    spaceExplanation: "Adjacency + stack.",
    edgeCases: [
      "Dead-end branches — Hierholzer's backtracks automatically.",
    ],
    memoryTrick: "\"Post-order DFS = Hierholzer's. Dead ends appended last = first in reversed path. Sorted adj = lexicographic.\"",
  },

  "graph-valid-tree": {
    intuition: "Tree = n-1 edges + no cycle + connected. Check edge count first (quick reject). Union-Find for cycle detection.",
    approach: [
      "If edges.size() != n-1: return false.",
      "Union-Find: for each edge, if same component → cycle → false.",
      "Return true.",
    ],
    cppSolution: `class Solution {
    vector<int> par;
    int find(int x){return par[x]==x?x:par[x]=find(par[x]);}
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if((int)edges.size()!=n-1) return false;
        par.resize(n);iota(par.begin(),par.end(),0);
        for(auto& e:edges){
            int a=find(e[0]),b=find(e[1]);
            if(a==b) return false;
            par[a]=b;
        }
        return true;
    }
};`,
    timeComplexity: "O(n α(n))",
    timeExplanation: "n union-find ops.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent array.",
    edgeCases: [
      "n=1, edges=[] — valid tree.",
      "Disconnected — caught by n-1 edge count.",
    ],
    memoryTrick: "\"n-1 edges + no cycle = tree. Check count first, then union-find.\"",
  },

  "num-connected-components": {
    intuition: "Union-Find. Start with n components. Each union of different components reduces count by 1.",
    approach: [
      "components = n.",
      "For each edge: if different component → union, components--.",
      "Return components.",
    ],
    cppSolution: `class Solution {
    vector<int> par;
    int find(int x){return par[x]==x?x:par[x]=find(par[x]);}
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        par.resize(n);iota(par.begin(),par.end(),0);
        int comps=n;
        for(auto& e:edges){
            int a=find(e[0]),b=find(e[1]);
            if(a!=b){par[a]=b;comps--;}
        }
        return comps;
    }
};`,
    timeComplexity: "O(n + E α(n))",
    timeExplanation: "n init + E union ops.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent array.",
    edgeCases: [
      "No edges — n components.",
      "All connected — 1 component.",
    ],
    memoryTrick: "\"Start with n islands. Each bridge merges two = one less. Count remaining.\"",
  },

  "all-paths-source-target": {
    intuition: "DFS from node 0, collecting all paths to n-1. DAG so no visited set needed. Backtrack after each call.",
    approach: [
      "DFS(node, path): if node==n-1: add path to result.",
      "For each neighbor: push, recurse, pop.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
        int n=graph.size();
        vector<vector<int>> res;
        vector<int> path={0};
        function<void(int)> dfs=[&](int node){
            if(node==n-1){res.push_back(path);return;}
            for(int nb:graph[node]){path.push_back(nb);dfs(nb);path.pop_back();}
        };
        dfs(0); return res;
    }
};`,
    timeComplexity: "O(2^n × n)",
    timeExplanation: "Up to 2^n paths of length n.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Path + recursion stack.",
    edgeCases: [
      "Single node — [0] if n-1==0.",
      "No path — empty result.",
    ],
    memoryTrick: "\"DAG = no cycles = no visited needed. Pure backtracking.\"",
  },

  "alien-dictionary": {
    intuition: "Extract char ordering by comparing adjacent words. Build directed graph. Topo sort (Kahn's BFS). Cycle = invalid alphabet.",
    approach: [
      "Build graph: compare adjacent word pairs, first differing char = edge.",
      "Invalid: word1 is prefix of shorter word2.",
      "Kahn's BFS topo sort. Not all chars processed = cycle = return ''.",
    ],
    cppSolution: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char,unordered_set<char>> adj;
        unordered_map<char,int> indeg;
        for(auto& w:words) for(char c:w) indeg[c]=0;
        for(int i=0;i<(int)words.size()-1;i++){
            auto& a=words[i]; auto& b=words[i+1];
            int l=min(a.size(),b.size()); bool found=false;
            for(int j=0;j<(int)l;j++) if(a[j]!=b[j]){
                if(!adj[a[j]].count(b[j])){adj[a[j]].insert(b[j]);indeg[b[j]]++;}
                found=true;break;
            }
            if(!found&&a.size()>b.size()) return "";
        }
        queue<char> q;
        for(auto& [c,d]:indeg) if(!d) q.push(c);
        string res;
        while(!q.empty()){char c=q.front();q.pop();res+=c;for(char nb:adj[c]) if(!--indeg[nb]) q.push(nb);}
        return res.size()==indeg.size()?res:"";
    }
};`,
    timeComplexity: "O(C)",
    timeExplanation: "C = total chars across all words.",
    spaceComplexity: "O(U²)",
    spaceExplanation: "U = unique chars, adj matrix worst case.",
    edgeCases: [
      "['abc','ab'] — b is prefix of longer a: invalid.",
      "Cycle — return ''.",
    ],
    memoryTrick: "\"Adjacent words → edges. Topo sort → order. Cycle or incomplete = invalid.\"",
  },

  "longest-increasing-path-matrix": {
    intuition: "DFS + memoization. memo[i][j] = longest increasing path from (i,j). Recurse to strictly greater neighbors. No visited array needed (increasing = no cycles).",
    approach: [
      "memo[m][n] = 0.",
      "dfs(r,c): if memo[r][c]: return it. Try 4 dirs, recurse if neighbor > current. memo[r][c] = 1 + max valid neighbors.",
      "Answer = max over all cells.",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> memo;
    int dfs(vector<vector<int>>& g, int r, int c){
        if(memo[r][c]) return memo[r][c];
        int dirs[]={0,1,0,-1,0};
        int best=1;
        for(int d=0;d<4;d++){
            int nr=r+dirs[d],nc=c+dirs[d+1];
            if(nr>=0&&nr<(int)g.size()&&nc>=0&&nc<(int)g[0].size()&&g[nr][nc]>g[r][c])
                best=max(best,1+dfs(g,nr,nc));
        }
        return memo[r][c]=best;
    }
public:
    int longestIncreasingPath(vector<vector<int>>& matrix) {
        int m=matrix.size(),n=matrix[0].size();
        memo.assign(m,vector<int>(n,0));
        int ans=0;
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans=max(ans,dfs(matrix,i,j));
        return ans;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Each cell computed once via memo.",
    spaceComplexity: "O(m × n)",
    spaceExplanation: "Memo table.",
    edgeCases: [
      "All same value — path length 1 everywhere.",
      "Strictly increasing row — full row length.",
    ],
    memoryTrick: "\"DFS + memo. Increasing = no cycles = safe memoization. Each cell independent.\"",
  },

  "word-ladder": {
    intuition: "BFS from beginWord. Each step try changing each character to a-z, check if in wordList. Shortest BFS path = minimum transformations.",
    approach: [
      "Set from wordList for O(1) lookup.",
      "BFS queue: (word, steps). Start (beginWord, 1).",
      "For each word, each position, try all 26 letters. If new word in set: add to queue, remove from set (visited).",
      "Return steps when endWord reached. 0 if not found.",
    ],
    cppSolution: `class Solution {
public:
    int ladderLength(string begin, string end, vector<string>& wordList) {
        unordered_set<string> ws(wordList.begin(),wordList.end());
        if(!ws.count(end)) return 0;
        queue<pair<string,int>> q;
        q.push({begin,1});
        while(!q.empty()){
            auto [w,step]=q.front();q.pop();
            for(int i=0;i<(int)w.size();i++){
                char orig=w[i];
                for(char c='a';c<='z';c++){
                    w[i]=c;
                    if(w==end) return step+1;
                    if(ws.count(w)){ws.erase(w);q.push({w,step+1});}
                }
                w[i]=orig;
            }
        }
        return 0;
    }
};`,
    timeComplexity: "O(M² × N)",
    timeExplanation: "N words, M length, 26 variations per position.",
    spaceComplexity: "O(M × N)",
    spaceExplanation: "Queue + set.",
    edgeCases: [
      "endWord not in wordList — return 0.",
      "beginWord == endWord — return 1.",
    ],
    memoryTrick: "\"BFS over word graph. Neighbors = 1-letter edits. Shortest path = fewest transforms. Erase visited from set.\"",
  },

  "triangle": {
    intuition: "Bottom-up DP. Start from second-to-last row. Each cell = triangle[i][j] + min(triangle[i+1][j], triangle[i+1][j+1]). Work up to apex. Modify in-place or use 1D array.",
    approach: [
      "For i from n-2 down to 0: for j from 0 to i: triangle[i][j] += min(triangle[i+1][j], triangle[i+1][j+1]).",
      "Return triangle[0][0].",
    ],
    cppSolution: `class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        int n=triangle.size();
        for(int i=n-2;i>=0;i--)
            for(int j=0;j<=i;j++)
                triangle[i][j]+=min(triangle[i+1][j],triangle[i+1][j+1]);
        return triangle[0][0];
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Fill every cell.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification.",
    edgeCases: [
      "Single row — return that value.",
    ],
    memoryTrick: "\"Bottom-up: each cell absorbs best child. Apex = answer.\"",
  },

  "count-primes": {
    intuition: "Sieve of Eratosthenes. Mark all composites by iterating multiples of each prime. Count remaining unmarked numbers up to n.",
    approach: [
      "sieve[n] = {true}. sieve[0]=sieve[1]=false.",
      "For i from 2 to sqrt(n): if sieve[i]: mark i*i, i*i+i, ... as false.",
      "Count trues.",
    ],
    cppSolution: `class Solution {
public:
    int countPrimes(int n) {
        if(n<2) return 0;
        vector<bool> sieve(n,true);
        sieve[0]=sieve[1]=false;
        for(int i=2;(long long)i*i<n;i++)
            if(sieve[i]) for(int j=i*i;j<n;j+=i) sieve[j]=false;
        return count(sieve.begin(),sieve.end(),true);
    }
};`,
    timeComplexity: "O(n log log n)",
    timeExplanation: "Sieve complexity.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Boolean sieve array.",
    edgeCases: [
      "n < 2 — return 0.",
      "n=2 — no primes less than 2, return 0.",
    ],
    memoryTrick: "\"Start at i*i (smaller multiples already marked). Count unmarked = primes.\"",
  },

  "multiply-strings": {
    intuition: "Grade-school multiplication. Digit at num1[i] × num2[j] contributes to result positions [i+j] and [i+j+1]. Build result array, handle carries, convert to string.",
    approach: [
      "result[m+n] = {0}.",
      "For i from m-1 to 0: for j from n-1 to 0: mul = (num1[i]-'0')*(num2[j]-'0'). p1=i+j, p2=i+j+1.",
      "sum = mul + result[p2]. result[p2]=sum%10. result[p1]+=sum/10.",
      "Skip leading zeros.",
    ],
    cppSolution: `class Solution {
public:
    string multiply(string num1, string num2) {
        int m=num1.size(),n=num2.size();
        vector<int> res(m+n,0);
        for(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--){
            int mul=(num1[i]-'0')*(num2[j]-'0');
            int p1=i+j,p2=i+j+1,sum=mul+res[p2];
            res[p2]=sum%10; res[p1]+=sum/10;
        }
        string s;
        for(int d:res) if(!(s.empty()&&!d)) s+=to_string(d);
        return s.empty()?"0":s;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "Every pair of digits multiplied.",
    spaceComplexity: "O(m + n)",
    spaceExplanation: "Result array.",
    edgeCases: [
      "Either input is '0' — result is '0'.",
      "Single digits — standard multiplication.",
    ],
    memoryTrick: "\"num1[i]*num2[j] lands at positions [i+j] and [i+j+1]. Add into array, handle carry inline.\"",
  },

  "path-max-probability": {
    intuition: "Modified Dijkstra: maximize probability instead of minimize cost. Max-heap by probability. Multiply probabilities along path (all <= 1). Stop early when target reached.",
    approach: [
      "Build adj: (neighbor, prob).",
      "dist[n] = {0}. dist[start] = 1.0.",
      "Max-heap (prob, node). Push (1.0, start).",
      "Relax: new_prob = dist[u] * edge_prob. If greater than dist[v]: update and push.",
      "Return dist[end].",
    ],
    cppSolution: `class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges, vector<double>& prob, int s, int e) {
        vector<vector<pair<int,double>>> g(n);
        for(int i=0;i<(int)edges.size();i++){
            g[edges[i][0]].push_back({edges[i][1],prob[i]});
            g[edges[i][1]].push_back({edges[i][0],prob[i]});
        }
        vector<double> dist(n,0); dist[s]=1.0;
        priority_queue<pair<double,int>> pq;
        pq.push({1.0,s});
        while(!pq.empty()){
            auto [p,u]=pq.top();pq.pop();
            if(u==e) return p;
            if(p<dist[u]) continue;
            for(auto [v,w]:g[u]) if(dist[u]*w>dist[v]){dist[v]=dist[u]*w;pq.push({dist[v],v});}
        }
        return 0;
    }
};`,
    timeComplexity: "O((V+E) log V)",
    timeExplanation: "Dijkstra with max-heap.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Graph + dist.",
    edgeCases: [
      "No path — return 0.",
      "s == e — return 1.0.",
    ],
    memoryTrick: "\"Dijkstra but maximize (multiply probabilities). Max-heap. Product replaces sum.\"",
  },

  "find-path-exists": {
    intuition: "Simple BFS/DFS or Union-Find. Check if source and destination are in same connected component.",
    approach: [
      "BFS from source. If destination reached: return true.",
      "Or Union-Find: union all edges, check if find(source)==find(destination).",
    ],
    cppSolution: `class Solution {
public:
    bool validPath(int n, vector<vector<int>>& edges, int s, int d) {
        if(s==d) return true;
        vector<vector<int>> g(n);
        for(auto& e:edges){g[e[0]].push_back(e[1]);g[e[1]].push_back(e[0]);}
        vector<bool> vis(n,false);
        queue<int> q; q.push(s); vis[s]=true;
        while(!q.empty()){
            int u=q.front();q.pop();
            for(int v:g[u]){
                if(v==d) return true;
                if(!vis[v]){vis[v]=true;q.push(v);}
            }
        }
        return false;
    }
};`,
    timeComplexity: "O(V+E)",
    timeExplanation: "BFS traversal.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Graph + visited.",
    edgeCases: [
      "s==d — return true immediately.",
      "No edges — only true if s==d.",
    ],
    memoryTrick: "\"BFS from source. Hit destination = path exists.\"",
  },

  "replace-words": {
    intuition: "Build Trie from all roots. For each word in sentence, walk Trie. If prefix (root) found: replace word with that root. Else keep word.",
    approach: [
      "Insert all roots into Trie.",
      "For each word: walk Trie char by char. If isEnd at any point: that's the shortest root, use it.",
      "Rejoin words into sentence.",
    ],
    cppSolution: `class Solution {
    struct T{T*ch[26]={};bool end=false;};
    T* root=new T();
    void ins(const string& w){T*n=root;for(char c:w){int i=c-'a';if(!n->ch[i])n->ch[i]=new T();n=n->ch[i];}n->end=true;}
    string rep(const string& w){
        T*n=root;
        for(int i=0;i<(int)w.size();i++){
            int c=w[i]-'a';if(!n->ch[c]) break;
            n=n->ch[c];if(n->end) return w.substr(0,i+1);
        }
        return w;
    }
public:
    string replaceWords(vector<string>& dict, string sentence) {
        for(auto& r:dict) ins(r);
        string res,word;
        istringstream ss(sentence);
        while(ss>>word){if(!res.empty())res+=' ';res+=rep(word);}
        return res;
    }
};`,
    timeComplexity: "O(D×L + S)",
    timeExplanation: "D roots of avg length L inserted; S = total sentence chars.",
    spaceComplexity: "O(D×L)",
    spaceExplanation: "Trie storage.",
    edgeCases: [
      "No root is prefix of word — keep word.",
      "Multiple roots match — Trie gives shortest automatically.",
    ],
    memoryTrick: "\"Trie finds shortest matching prefix. isEnd = found root, replace immediately.\"",
  },

  "jump-game-vii": {
    intuition: "BFS/sliding window. From each reachable position i, can jump to [i+minJump, i+maxJump] where s[pos]=='0'. Track rightmost reached to avoid re-checking positions. Use prefix sum of reachable positions for O(n) range checks.",
    approach: [
      "reach = 0 (rightmost pos reachable so far checked).",
      "BFS queue. For each i popped: for j from max(i+minJump, reach+1) to min(i+maxJump, n-1): if s[j]=='0': push j, update reach.",
      "Return n-1 in reachable set.",
    ],
    cppSolution: `class Solution {
public:
    bool canReach(string s, int minJ, int maxJ) {
        int n=s.size();
        vector<bool> reach(n,false);
        reach[0]=true;
        int pre=0; // count of reachable positions in window
        for(int i=1;i<n;i++){
            if(i>=minJ&&reach[i-minJ]) pre++;
            if(i>maxJ&&reach[i-maxJ-1]) pre--;
            if(pre>0&&s[i]=='0') reach[i]=true;
        }
        return reach[n-1];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass with sliding window prefix count.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Reachable array.",
    edgeCases: [
      "s[0]!='0' — impossible (start must be '0').",
      "s[n-1]!='0' — impossible.",
    ],
    memoryTrick: "\"Sliding window of reachable positions. pre = count reachable in [i-maxJ, i-minJ]. pre>0 and s[i]='0' = reachable.\"",
  },

  "bitwise-and-numbers-range": {
    intuition: "Common prefix of m and n in binary. Right-shift both until equal (find common prefix length), then shift result back left. Bits that differ get ANDed to 0.",
    approach: [
      "shift = 0.",
      "While m != n: m >>= 1, n >>= 1, shift++.",
      "Return m << shift.",
    ],
    cppSolution: `class Solution {
public:
    int rangeBitwiseAnd(int m, int n) {
        int shift=0;
        while(m!=n){m>>=1;n>>=1;shift++;}
        return m<<shift;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "At most 32 shifts.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One counter.",
    edgeCases: [
      "m=0 — return 0.",
      "m=n — return m (no shifting).",
    ],
    memoryTrick: "\"AND of range = common prefix. Strip differing bits by right-shifting until equal. Restore with left shift.\"",
  },

  "max-score-multiplication": {
    intuition: "DP: at step i, can pick from left or right end. dp[left][i] where i = number of picks = left picks + right picks. right = i - left. dp[left][i] = max(pick from left, pick from right).",
    approach: [
      "m = multipliers.size(), n = nums.size().",
      "dp[left][i]: at step i with 'left' picks from left end.",
      "For i from m-1 down to 0: for left from i down to 0: right = i - left.",
      "dp[left][i] = max(mults[i]*nums[left]+dp[left+1][i+1], mults[i]*nums[n-1-right]+dp[left][i+1]).",
    ],
    cppSolution: `class Solution {
public:
    int maximumScore(vector<int>& nums, vector<int>& mults) {
        int n=nums.size(),m=mults.size();
        vector<vector<int>> dp(m+1,vector<int>(m+1,0));
        for(int i=m-1;i>=0;i--)
            for(int left=i;left>=0;left--){
                int right=i-left;
                dp[i][left]=max(mults[i]*nums[left]+dp[i+1][left+1],
                                mults[i]*nums[n-1-right]+dp[i+1][left]);
            }
        return dp[0][0];
    }
};`,
    timeComplexity: "O(m²)",
    timeExplanation: "m steps, up to m left choices each.",
    spaceComplexity: "O(m²)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "m=1 — pick max of nums[0] or nums[n-1] times mults[0].",
    ],
    memoryTrick: "\"left+right=i always. Only need left count. DP bottom-up, step i, left choices.\"",
  },

  "detect-squares": {
    intuition: "For each query point (px,py), iterate all points with same x=px. For each such point (px,py2), try to form square: need (px2,py) and (px2,py2) where px2=px+(py2-py) or px2=px-(py2-py). Count combinations.",
    approach: [
      "Store points in map: cnt[(x,y)] = count. Also xToYs[x] = list of y values.",
      "count(px,py): for each py2 in xToYs[px] where py2!=py: side=|py2-py|. For each px2 in {px+side, px-side}: answer += cnt[(px,py2)]*cnt[(px2,py)]*cnt[(px2,py2)].",
    ],
    cppSolution: `class DetectSquares {
    unordered_map<int,unordered_map<int,int>> cnt;
    unordered_map<int,vector<int>> xToY;
public:
    void add(vector<int> p){
        cnt[p[0]][p[1]]++;
        xToY[p[0]].push_back(p[1]);
    }
    int count(vector<int> p){
        int px=p[0],py=p[1],ans=0;
        for(int py2:xToY[px]){
            if(py2==py) continue;
            int side=abs(py2-py);
            for(int px2:{px+side,px-side})
                ans+=cnt[px][py2]*cnt[px2][py]*cnt[px2][py2];
        }
        return ans;
    }
};`,
    timeComplexity: "O(n) add, O(n) count",
    timeExplanation: "count iterates all y's for given x.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Point storage.",
    edgeCases: [
      "Same point added multiple times — count multiplied.",
      "No valid square — returns 0.",
    ],
    memoryTrick: "\"Fix diagonal: same x as query + any other y. Two choices for fourth x (left/right). Multiply counts.\"",
  },

  "longest-word-dictionary": {
    intuition: "Sort words by length (then lexicographically). Use set to track buildable words. A word is buildable if word[:-1] is already in set. Greedily find longest.",
    approach: [
      "Sort by length ascending, then lex.",
      "Set with '' (empty). For each word: if word[:-1] in set: add to set, update answer.",
      "Return longest answer (sort ensures lex-smallest wins on ties).",
    ],
    cppSolution: `class Solution {
public:
    string longestWord(vector<string>& words) {
        sort(words.begin(),words.end(),[](const string& a,const string& b){
            return a.size()!=b.size()?a.size()<b.size():a<b;
        });
        unordered_set<string> built={""};
        string ans;
        for(auto& w:words){
            if(built.count(w.substr(0,w.size()-1))){
                built.insert(w);
                if(w.size()>ans.size()) ans=w;
            }
        }
        return ans;
    }
};`,
    timeComplexity: "O(n × L log n)",
    timeExplanation: "Sort + hash set lookups with substr.",
    spaceComplexity: "O(n × L)",
    spaceExplanation: "Set of words.",
    edgeCases: [
      "No word buildable from scratch — return ''.",
      "Multiple same-length answers — sort ensures lex-smallest chosen.",
    ],
    memoryTrick: "\"Build incrementally. Word valid if its prefix (without last char) already built. Sort ensures prefixes processed first.\"",
  },

  "index-pairs-string": {
    intuition: "Build Trie from all words. For each start index in text, walk Trie. Whenever isEnd encountered, record [start, current_index].",
    approach: [
      "Insert all words into Trie.",
      "For i from 0 to len(text)-1: walk Trie from root starting at text[i]. At each step if isEnd: add [i, i+j].",
    ],
    cppSolution: `class Solution {
    struct T{T*ch[26]={};bool end=false;};
    T* root=new T();
public:
    vector<vector<int>> indexPairs(string text, vector<string>& words) {
        for(auto& w:words){T*n=root;for(char c:w){int i=c-'a';if(!n->ch[i])n->ch[i]=new T();n=n->ch[i];}n->end=true;}
        vector<vector<int>> res;
        for(int i=0;i<(int)text.size();i++){
            T*n=root;
            for(int j=i;j<(int)text.size();j++){
                int c=text[j]-'a'; if(!n->ch[c]) break;
                n=n->ch[c]; if(n->end) res.push_back({i,j});
            }
        }
        return res;
    }
};`,
    timeComplexity: "O(W×L + T²)",
    timeExplanation: "W words of length L in trie; T² worst case scan.",
    spaceComplexity: "O(W×L)",
    spaceExplanation: "Trie storage.",
    edgeCases: [
      "No word matches — empty result.",
      "Overlapping matches — all recorded.",
    ],
    memoryTrick: "\"For each start, walk trie. Record every word endpoint found.\"",
  },

  "isomorphic-strings": {
    intuition: "Isomorphic means there's a consistent one-to-one character mapping from s to t. Key insight: the mapping must be a bijection — not just s[i] always maps to the same t[i], but also t[i] always maps back to the same s[i]. Without the reverse check, 'foo' → 'bar' would pass (f→b, o→a, o→r fails) but 'ab' → 'aa' would wrongly pass (a→a, b→a: two letters mapping to same letter is NOT isomorphic).",
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
