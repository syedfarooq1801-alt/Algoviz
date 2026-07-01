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

  "combination-sum-iii": {
    intuition:
      "Find all combinations of exactly k numbers from 1–9 that sum to n. Classic backtracking: at each step choose the next number (must be > last chosen to avoid duplicates), recurse, then backtrack. Prune early when remaining sum goes negative or too few numbers remain.",
    approach: [
      "Backtrack(start, k, remaining, path):",
      "  Base case: k === 0 && remaining === 0 → add copy of path to results.",
      "  Base case: k === 0 || remaining <= 0 → return (pruning).",
      "  Loop i from start to 9:",
      "    Pruning: if i > remaining, break (numbers only get bigger).",
      "    Push i, recurse(i+1, k-1, remaining-i), pop i.",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> res;
    void bt(int start, int k, int rem, vector<int>& path) {
        if (k == 0 && rem == 0) { res.push_back(path); return; }
        if (k == 0 || rem <= 0) return;
        for (int i = start; i <= 9; i++) {
            if (i > rem) break; // prune: remaining numbers only larger
            path.push_back(i);
            bt(i + 1, k - 1, rem - i, path);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        vector<int> path;
        bt(1, k, n, path);
        return res;
    }
};`,
    timeComplexity: "O(C(9,k))",
    timeExplanation: "At most C(9,k) valid subsets of size k from digits 1-9. Pruning makes it much faster in practice.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Recursion depth = k (at most 9). Path array holds k elements.",
    edgeCases: [
      "k=1, n=5 → [[5]].",
      "n > 9+8+...+(9-k+1) → impossible, no results.",
      "k=9, n=45 → exactly one combination [1,2,3,4,5,6,7,8,9].",
      "Prune i > rem: if remaining sum is 3, no point trying i=4.",
    ],
    memoryTrick: "\"Pick k numbers from 1-9, no repeats. Sorted choices = next i always > last → start from i+1. Sum drops with each pick → prune when i > rem.\"",
  },

  "non-overlapping-intervals": {
    intuition:
      "Remove minimum intervals to make the rest non-overlapping. Greedy insight: always keep the interval that ends earliest — it leaves the most room for future intervals. Sort by end time. If next interval starts before current end, remove it (count it). Otherwise update current end.",
    approach: [
      "Sort intervals by end time.",
      "Track end of last kept interval (prevEnd = intervals[0][1]).",
      "For each subsequent interval [s, e]:",
      "  If s < prevEnd → overlap. Remove this interval (count++). Keep the one ending sooner (prevEnd unchanged since we sorted by end).",
      "  If s >= prevEnd → no overlap. Keep interval. prevEnd = e.",
      "Return count.",
    ],
    cppSolution: `class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(),
             [](const auto& a, const auto& b){ return a[1] < b[1]; }); // sort by end
        int count = 0;
        int prevEnd = intervals[0][1];
        for (int i = 1; i < (int)intervals.size(); i++) {
            if (intervals[i][0] < prevEnd) {
                count++; // overlap: remove current (it ends later since sorted)
            } else {
                prevEnd = intervals[i][1]; // no overlap: keep, update end
            }
        }
        return count;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorting dominates. Linear scan after is O(n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place sort (or O(log n) stack for sort). Scan uses only prevEnd variable.",
    edgeCases: [
      "No overlaps at all → return 0.",
      "All intervals same → keep one, remove n-1.",
      "[[1,2],[1,2],[1,2]] → remove 2.",
      "Touching intervals [1,2],[2,3] → not overlapping (start ≥ prevEnd → keep both).",
      "Single interval → return 0 (nothing to remove).",
    ],
    memoryTrick: "\"Earliest-end greedy. Sort by end. Overlap → remove current (it ends later). No overlap → move prevEnd forward. Count the removals.\" Same idea as activity selection problem.",
  },

  "subsets-ii": {
    intuition:
      "Generate all subsets of an array that may have duplicates, without duplicate subsets. Sort first so duplicates are adjacent. In backtracking, skip an element if it's the same as the previous one at the same recursion level — this eliminates duplicate subsets without needing a set.",
    approach: [
      "Sort nums.",
      "Backtrack(start, path):",
      "  Add copy of path to results immediately (every prefix is a valid subset).",
      "  Loop i from start to n-1:",
      "    Skip if i > start && nums[i] === nums[i-1] (duplicate at this level).",
      "    Push nums[i], recurse(i+1), pop.",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> res;
    void bt(vector<int>& nums, int start, vector<int>& path) {
        res.push_back(path);
        for (int i = start; i < (int)nums.size(); i++) {
            if (i > start && nums[i] == nums[i-1]) continue; // skip dup at same level
            path.push_back(nums[i]);
            bt(nums, i + 1, path);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<int> path;
        bt(nums, 0, path);
        return res;
    }
};`,
    timeComplexity: "O(n · 2^n)",
    timeExplanation: "Up to 2^n subsets, each taking O(n) to copy. Duplicate skipping reduces actual work but doesn't change worst-case bound.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion depth n, path array size n.",
    edgeCases: [
      "[1,2,2] → [],[1],[1,2],[1,2,2],[2],[2,2] — 6 subsets, not 8.",
      "All same elements [2,2,2] → [],[2],[2,2],[2,2,2] — 4 subsets.",
      "No duplicates → same as Subsets I.",
      "The skip condition is i > start (not i > 0) — only skip duplicates at the SAME recursion level, not across levels.",
    ],
    memoryTrick: "\"Sort → skip same neighbor at same level. i > start means we've already made one choice at this level; same number again would duplicate the subtree.\"",
  },

  "merge-intervals": {
    intuition:
      "Sort intervals by start time. Then walk through: if the current interval overlaps the last merged one (current.start ≤ merged.end), extend the end. Otherwise push a new interval. Overlap condition after sorting: current.start ≤ previous.end.",
    approach: [
      "Sort intervals by start value.",
      "Initialize result with the first interval.",
      "For each remaining interval:",
      "  — If current.start ≤ result.back().end → overlap. Extend: result.back().end = max(result.back().end, current.end).",
      "  — Otherwise no overlap. Push current interval to result.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end()); // sort by start
        vector<vector<int>> res;
        res.push_back(intervals[0]);
        for (int i = 1; i < (int)intervals.size(); i++) {
            auto& last = res.back();
            if (intervals[i][0] <= last[1]) {
                last[1] = max(last[1], intervals[i][1]); // extend
            } else {
                res.push_back(intervals[i]); // no overlap
            }
        }
        return res;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorting dominates. The merge pass is O(n).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Output array in worst case holds all n intervals (no merges happen).",
    edgeCases: [
      "Single interval — return as-is.",
      "All intervals overlap — collapses to one interval.",
      "Touching intervals [1,3] and [3,5] — condition ≤ (not <) merges them into [1,5].",
      "Intervals given in reverse order — sort handles it.",
      "[1,4] and [2,3] — fully contained: max(4,3)=4, stays [1,4].",
    ],
    memoryTrick: "\"Sort first, then greedy extend. If new start ≤ current end, they touch or overlap — stretch the end. Otherwise, start fresh.\"",
  },

  "top-k-frequent": {
    intuition:
      "Count frequencies with a hash map. To find top-k without full sort: use bucket sort. Create an array of size n+1 where index = frequency. Bucket[i] holds all numbers that appear exactly i times. Scan buckets from high to low, collect until you have k elements.",
    approach: [
      "Count frequency of each number using hash map.",
      "Create bucket array of size n+1 (max possible frequency).",
      "For each (num, freq) pair, add num to bucket[freq].",
      "Iterate bucket from index n down to 0, collecting numbers.",
      "Stop once k elements collected — return result.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;

        // bucket[i] = numbers that appear exactly i times
        vector<vector<int>> bucket(nums.size() + 1);
        for (auto& [val, cnt] : freq)
            bucket[cnt].push_back(val);

        vector<int> res;
        for (int i = (int)bucket.size() - 1; i >= 0 && (int)res.size() < k; i--)
            for (int v : bucket[i])
                res.push_back(v);

        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Frequency count O(n), bucket fill O(n), bucket scan O(n). Beats heap's O(n log k).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Frequency map + bucket array, both O(n).",
    edgeCases: [
      "k = 1 — return the single most frequent element.",
      "k = n — all elements qualify, but they may all have frequency 1.",
      "Multiple elements with same frequency — bucket holds them all; order within bucket doesn't matter.",
      "Negative numbers — hash map handles negatives.",
    ],
    memoryTrick: "\"Bucket sort by frequency. High-frequency buckets at the back. Walk backwards, fill until k.\" Avoids sorting entirely — O(n) not O(n log n).",
  },

  "median-two-sorted": {
    intuition:
      "Binary search on the smaller array. Pick a cut point i in array A (0..m) and derive cut j = (m+n)/2 - i in array B. A valid cut means A[i-1] ≤ B[j] AND B[j-1] ≤ A[i] — left halves are all ≤ right halves. Binary search i until this holds. Then read median from the 4 boundary elements.",
    approach: [
      "Ensure A is the smaller array (swap if needed) — binary search on smaller = fewer iterations.",
      "Binary search i in [0, m]. j = half - i where half = (m+n)/2.",
      "Boundary values: Aleft = A[i-1] or -∞, Aright = A[i] or +∞. Same for B.",
      "If Aleft ≤ Bright AND Bleft ≤ Aright → valid partition found.",
      "  — Even total: median = (max(Aleft,Bleft) + min(Aright,Bright)) / 2.0.",
      "  — Odd total: median = min(Aright, Bright).",
      "If Aleft > Bright → i too big → R = i - 1.",
      "If Bleft > Aright → i too small → L = i + 1.",
    ],
    cppSolution: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
        if (A.size() > B.size()) return findMedianSortedArrays(B, A);
        int m = A.size(), n = B.size(), half = (m + n) / 2;
        int L = 0, R = m;
        while (true) {
            int i = L + (R - L) / 2; // cut in A
            int j = half - i;         // cut in B
            int Aleft  = i > 0 ? A[i-1] : INT_MIN;
            int Aright = i < m ? A[i]   : INT_MAX;
            int Bleft  = j > 0 ? B[j-1] : INT_MIN;
            int Bright = j < n ? B[j]   : INT_MAX;
            if (Aleft <= Bright && Bleft <= Aright) {
                if ((m + n) % 2 == 1) return min(Aright, Bright);
                return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0;
            } else if (Aleft > Bright) {
                R = i - 1;
            } else {
                L = i + 1;
            }
        }
    }
};`,
    timeComplexity: "O(log(min(m, n)))",
    timeExplanation: "Binary search on the smaller array of size min(m,n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only boundary variables — no extra arrays.",
    edgeCases: [
      "One array empty — median is the median of the other array.",
      "Arrays of equal length — both cuts split evenly.",
      "All elements of A < all elements of B — i=0 or i=m immediately valid.",
      "Even vs odd total length — different median formulas.",
      "INT_MIN/INT_MAX sentinels — handle edge cuts where i=0 or i=m (no left/right element).",
    ],
    memoryTrick: "\"Binary search the CUT, not the value. Cut A at i, B at j=half-i. Valid cut: left side of A ≤ right side of B, and left side of B ≤ right side of A. Use ±∞ sentinels at boundaries.\"",
  },

  "first-missing-positive": {
    intuition:
      "Find the smallest missing positive integer in O(n) time and O(1) space. Key insight: the answer must be in [1, n+1]. Use the array itself as a hash map — place each number x at index x-1 if 1 ≤ x ≤ n. Then scan for the first index where nums[i] ≠ i+1.",
    approach: [
      "Ignore non-positives and numbers > n — they can't be the answer.",
      "For each valid number, swap nums[i] to its correct index (nums[i]-1) until the slot is already correct or out of range.",
      "Second pass: find first i where nums[i] ≠ i+1. Return i+1.",
      "If all match, return n+1.",
    ],
    cppSolution: `class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i])
                swap(nums[i], nums[nums[i]-1]);
        }
        for (int i = 0; i < n; i++)
            if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each element is swapped at most once to its correct position. Total swaps ≤ n.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space — uses the input array as the hash map.",
    edgeCases: [
      "[1] → return 2.",
      "[1,2,3] → all correct, return 4 (n+1).",
      "All negatives [−3,−1] → return 1.",
      "Duplicates [1,1] → second pass finds index 1 missing → return 2.",
    ],
    memoryTrick: "\"Park each car in its own spot: number x goes to index x-1. After parking, the first empty spot is the answer.\" The while loop swaps until the element is in place or out of range.",
  },

  "count-of-smaller-after-self": {
    intuition:
      "For each element, count how many elements to its right are strictly smaller. Brute force is O(n²). Use modified merge sort: during the merge step, when we pick from the right half, all remaining left-half elements are larger — add right-half index contribution to left-half counts.",
    approach: [
      "Pair each number with its original index: [(num, originalIdx)].",
      "Merge sort the pairs. During merge: when right[j] < left[i], all elements left[i..] are greater than right[j]. Add count of remaining left elements to counts[right[j].originalIdx].",
      "Actually: when we place a left element, count of right elements already placed before it = right-pointer position. Add to counts[left element original index].",
      "Return counts array.",
    ],
    cppSolution: `class Solution {
    vector<int> counts;
    void mergeSort(vector<pair<int,int>>& arr, int l, int r) {
        if (r - l <= 1) return;
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid, r);
        vector<pair<int,int>> tmp;
        int i = l, j = mid, rightCount = 0;
        while (i < mid && j < r) {
            if (arr[j].first < arr[i].first) {
                tmp.push_back(arr[j++]);
                rightCount++;
            } else {
                counts[arr[i].first] += rightCount;  // wait — store by original index
                tmp.push_back(arr[i++]);
            }
        }
        while (i < mid) { counts[arr[i].second] += rightCount; tmp.push_back(arr[i++]); }
        while (j < r) tmp.push_back(arr[j++]);
        copy(tmp.begin(), tmp.end(), arr.begin() + l);
    }
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        counts.assign(n, 0);
        vector<pair<int,int>> arr(n);
        for (int i = 0; i < n; i++) arr[i] = {nums[i], i};
        mergeSort(arr, 0, n);
        return counts;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Merge sort with O(log n) levels, O(n) work per level.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Temporary arrays during merge and the counts array.",
    edgeCases: [
      "[5,2,6,1] → [2,1,1,0].",
      "Single element → [0].",
      "All same [3,3,3] → [0,0,0] (strictly smaller).",
      "Descending [5,4,3,2,1] → [4,3,2,1,0].",
    ],
    memoryTrick: "\"Merge sort counts across the divide. When right element merges before a left element, that left element is bigger than everything merged from right so far. Track rightCount.\"",
  },

  "minimum-window-subsequence": {
    intuition:
      "Find the shortest contiguous substring of S that contains T as a subsequence (not substring). Two-pointer approach: forward scan to find where T ends in S, then backward scan from that point to tighten the window start.",
    approach: [
      "i = 0 (pointer in S), j = 0 (pointer in T).",
      "Forward: advance i through S matching T[j]. When j == len(T), we've found a valid window ending at i.",
      "Backward: from current i, reverse-match T back to tighten window start. When j == -1, we have the shortest window ending here.",
      "Record window if shortest. Reset j = 0, advance i from window start + 1.",
    ],
    cppSolution: `class Solution {
public:
    string minWindow(string s, string t) {
        int si = 0, best = INT_MAX, bStart = 0;
        while (si < (int)s.size()) {
            // forward: match t
            int ti = 0;
            while (si < (int)s.size() && ti < (int)t.size()) {
                if (s[si] == t[ti]) ti++;
                si++;
            }
            if (ti < (int)t.size()) break; // t not found
            // backward: tighten window
            int end = si;
            ti = (int)t.size() - 1;
            while (ti >= 0) {
                if (s[--si] == t[ti]) ti--;
            }
            if (end - si < best) { best = end - si; bStart = si; }
            si++; // advance past start to search for next window
        }
        return best == INT_MAX ? "" : s.substr(bStart, best);
    }
};`,
    timeComplexity: "O(|S| × |T|)",
    timeExplanation: "Each position in S can trigger a backward scan of up to |T| steps.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only pointer variables.",
    edgeCases: [
      "T longer than S → return \"\".",
      "T is a single character → find its first occurrence in S.",
      "T appears multiple times in S → return shortest window.",
      "S == T → return S.",
    ],
    memoryTrick: "\"Forward to find, backward to shrink. Two-phase two-pointer: find end of valid window, then reverse to tighten start.\"",
  },

  "maximal-rectangle": {
    intuition:
      "The classic histogram trick applied to a 2D matrix. For each row, compute the 'height' array — consecutive 1s above that cell including the cell itself. Then apply largest-rectangle-in-histogram on each row's heights.",
    approach: [
      "Initialize heights[n] = 0.",
      "For each row: update heights[j] = (matrix[i][j]=='1') ? heights[j]+1 : 0.",
      "Run largestRectangleArea(heights) on current heights — same monotonic stack algorithm.",
      "Track global max across all rows.",
    ],
    cppSolution: `class Solution {
    int largestRect(vector<int>& h) {
        stack<int> st;
        int res = 0;
        h.push_back(0);
        for (int i = 0; i < (int)h.size(); i++) {
            while (!st.empty() && h[st.top()] > h[i]) {
                int height = h[st.top()]; st.pop();
                int width = st.empty() ? i : i - st.top() - 1;
                res = max(res, height * width);
            }
            st.push(i);
        }
        h.pop_back();
        return res;
    }
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        int m = matrix.size(), n = matrix[0].size(), res = 0;
        vector<int> heights(n, 0);
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++)
                heights[j] = matrix[i][j] == '1' ? heights[j] + 1 : 0;
            res = max(res, largestRect(heights));
        }
        return res;
    }
};`,
    timeComplexity: "O(m × n)",
    timeExplanation: "m rows × (n to build heights + n for histogram) = O(m × n).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Heights array and monotonic stack both O(n).",
    edgeCases: [
      "All zeros → 0.",
      "All ones → m×n.",
      "Single row → largest histogram in that row.",
      "Single column → height of longest run of 1s.",
    ],
    memoryTrick: "\"Row by row, build histogram heights. Each row = new histogram problem. Reuse largest-rectangle-in-histogram on updated heights.\"",
  },

  "lfu-cache": {
    intuition:
      "LFU evicts the Least Frequently Used key (ties broken by LRU). Needs O(1) get and put. Use two hash maps: key→{value, freq} and freq→ordered set (doubly linked list) of keys. Track minFreq to know which bucket to evict from.",
    approach: [
      "freqMap: freq → doubly linked list of keys (order = LRU within same freq).",
      "keyMap: key → {value, freq, iterator in freqMap[freq]}.",
      "On get: increment key's freq, move from freqMap[freq] to freqMap[freq+1]. Update minFreq if needed.",
      "On put: if at capacity, evict from freqMap[minFreq].back(). Insert new key with freq=1, set minFreq=1.",
    ],
    cppSolution: `class LFUCache {
    int cap, minFreq;
    unordered_map<int, pair<int,int>> key2vf; // key → {val, freq}
    unordered_map<int, list<int>> freq2keys;  // freq → LRU list of keys
    unordered_map<int, list<int>::iterator> key2it; // key → iterator in freq list
    void touch(int key) {
        int f = key2vf[key].second;
        freq2keys[f].erase(key2it[key]);
        if (freq2keys[f].empty()) { freq2keys.erase(f); if (minFreq == f) minFreq++; }
        key2vf[key].second++;
        freq2keys[f+1].push_front(key);
        key2it[key] = freq2keys[f+1].begin();
    }
public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}
    int get(int key) {
        if (!key2vf.count(key)) return -1;
        touch(key);
        return key2vf[key].first;
    }
    void put(int key, int value) {
        if (!cap) return;
        if (key2vf.count(key)) { key2vf[key].first = value; touch(key); return; }
        if ((int)key2vf.size() == cap) {
            int evict = freq2keys[minFreq].back();
            freq2keys[minFreq].pop_back();
            key2vf.erase(evict); key2it.erase(evict);
        }
        key2vf[key] = {value, 1};
        freq2keys[1].push_front(key);
        key2it[key] = freq2keys[1].begin();
        minFreq = 1;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "All hash map and linked list operations are O(1). No linear scans.",
    spaceComplexity: "O(capacity)",
    spaceExplanation: "Three hash maps all bounded by capacity.",
    edgeCases: [
      "capacity = 0 → all puts are no-ops.",
      "Same key put twice → update value, increment freq.",
      "Tie in frequency → LRU among tied keys is evicted.",
      "get on non-existent key → return -1 without modifying minFreq.",
    ],
    memoryTrick: "\"LRU inside each frequency bucket. minFreq tells you which bucket to evict from. New keys always start at freq=1, so minFreq resets to 1 on every put of a new key.\"",
  },

  "maximum-sum-bst": {
    intuition:
      "Find the maximum sum of all keys in any BST subtree of the binary tree. Post-order DFS: at each node, determine if its subtree is a valid BST and compute its sum. Return up min, max, sum, and isValid to the parent.",
    approach: [
      "Post-order DFS returning (isBST, minVal, maxVal, sum).",
      "A subtree is BST if: left is BST, right is BST, left.maxVal < node.val < right.minVal.",
      "If current subtree is valid BST, update global max with current sum.",
      "Propagate min and max through the tree.",
    ],
    cppSolution: `class Solution {
    int ans = 0;
    // returns {isBST, minVal, maxVal, sum}
    array<int,4> dfs(TreeNode* node) {
        if (!node) return {1, INT_MAX, INT_MIN, 0};
        auto [lv, lmin, lmax, lsum] = dfs(node->left);
        auto [rv, rmin, rmax, rsum] = dfs(node->right);
        if (lv && rv && lmax < node->val && node->val < rmin) {
            int sum = lsum + rsum + node->val;
            ans = max(ans, sum);
            return {1, min(lmin, node->val), max(rmax, node->val), sum};
        }
        return {0, 0, 0, 0}; // invalid BST subtree
    }
public:
    int maxSumBST(TreeNode* root) {
        dfs(root);
        return ans;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each node visited exactly once in post-order traversal.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion stack depth = tree height h (O(log n) balanced, O(n) skewed).",
    edgeCases: [
      "All nodes form one valid BST → sum of all nodes.",
      "No valid BST subtree with positive sum → return 0 (single negative node subtrees).",
      "Single node → that node's value if positive.",
      "Left subtree invalid BST → propagate invalid upward.",
    ],
    memoryTrick: "\"Post-order: children report up whether they're valid BSTs and their min/max. Only combine if both children are valid and BST property holds at current node.\"",
  },

  "smallest-range-k-lists": {
    intuition:
      "Given k sorted lists, find the smallest range [a, b] such that there is at least one element from each list. Use a min-heap of size k — always expand the maximum element's range by advancing the pointer in that list.",
    approach: [
      "Push first element of each list into a min-heap: (value, listIdx, elementIdx).",
      "Track current max across all elements in heap.",
      "While heap has k elements: current range = [heap.top().val, currentMax]. Update best range.",
      "Pop min. If its list has more elements, push next. Update currentMax. If any list exhausted, stop.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> smallestRange(vector<vector<int>>& nums) {
        using T = tuple<int,int,int>; // val, listIdx, elemIdx
        priority_queue<T, vector<T>, greater<T>> pq;
        int curMax = INT_MIN;
        for (int i = 0; i < (int)nums.size(); i++) {
            pq.push({nums[i][0], i, 0});
            curMax = max(curMax, nums[i][0]);
        }
        int rL = 0, rR = INT_MAX;
        while ((int)pq.size() == (int)nums.size()) {
            auto [val, li, ei] = pq.top(); pq.pop();
            if (curMax - val < rR - rL) { rL = val; rR = curMax; }
            if (ei + 1 < (int)nums[li].size()) {
                pq.push({nums[li][ei+1], li, ei+1});
                curMax = max(curMax, nums[li][ei+1]);
            }
            // else: list exhausted, heap shrinks below k, loop ends
        }
        return {rL, rR};
    }
};`,
    timeComplexity: "O(n log k)",
    timeExplanation: "n = total elements across all lists. Each element pushed/popped once. Each heap op is O(log k).",
    spaceComplexity: "O(k)",
    spaceExplanation: "Heap holds exactly k elements at any time.",
    edgeCases: [
      "k=1 → range is [min, max] of that list's first element = [list[0], list[0]].",
      "All lists have one element → range must include all of them.",
      "Duplicate values across lists → still valid, range can be [x, x].",
    ],
    memoryTrick: "\"Sliding window on sorted lists: always advance the minimum because advancing the maximum can only widen the range. Stop when any list runs out.\"",
  },

  "sudoku-solver": {
    intuition:
      "Backtracking with constraint propagation. Try digits 1-9 at each empty cell. Prune immediately if digit violates row, column, or 3×3 box constraint. Backtrack when no digit works.",
    approach: [
      "Scan for first empty cell ('.'). If none → solved, return true.",
      "Try digits '1' to '9'. Check validity: not in same row, column, or 3×3 box.",
      "Place digit, recurse. If recursion returns true, done.",
      "If no digit works, reset cell to '.' and return false (backtrack).",
    ],
    cppSolution: `class Solution {
    bool isValid(vector<vector<char>>& b, int r, int c, char d) {
        for (int i = 0; i < 9; i++) {
            if (b[r][i] == d) return false;
            if (b[i][c] == d) return false;
            if (b[3*(r/3)+i/3][3*(c/3)+i%3] == d) return false;
        }
        return true;
    }
    bool solve(vector<vector<char>>& b) {
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                if (b[r][c] == '.') {
                    for (char d = '1'; d <= '9'; d++) {
                        if (isValid(b, r, c, d)) {
                            b[r][c] = d;
                            if (solve(b)) return true;
                            b[r][c] = '.';
                        }
                    }
                    return false;
                }
        return true;
    }
public:
    void solveSudoku(vector<vector<char>>& board) { solve(board); }
};`,
    timeComplexity: "O(9^m)",
    timeExplanation: "m = number of empty cells. Each cell tries up to 9 digits. With constraint pruning, practical runtime is much faster.",
    spaceComplexity: "O(m)",
    spaceExplanation: "Recursion stack depth = number of empty cells.",
    edgeCases: [
      "Board already solved → return immediately on first scan finding no '.'.",
      "Highly constrained board (few options) → fast due to early pruning.",
      "Multiple solutions technically don't exist in valid sudoku input.",
    ],
    memoryTrick: "\"Try, check, place, recurse, backtrack. The box index formula: row=3*(r/3)+i/3, col=3*(c/3)+i%3 — memorize or re-derive.\"",
  },

  "critical-connections": {
    intuition:
      "Find all bridges (edges whose removal disconnects the graph). Use Tarjan's bridge-finding algorithm: DFS with discovery time and low-link values. An edge (u,v) is a bridge if low[v] > disc[u] — meaning v can't reach back to u or earlier without using the edge (u,v).",
    approach: [
      "DFS from any node. Track disc[node] = discovery time, low[node] = min disc reachable via DFS subtree.",
      "For each neighbor v of u: if unvisited, recurse. After return: low[u] = min(low[u], low[v]). If low[v] > disc[u], edge (u,v) is a bridge.",
      "If already visited and v ≠ parent: low[u] = min(low[u], disc[v]) — back edge, not a bridge.",
    ],
    cppSolution: `class Solution {
    int timer = 0;
    void dfs(int u, int parent, vector<vector<int>>& adj,
             vector<int>& disc, vector<int>& low, vector<vector<int>>& res) {
        disc[u] = low[u] = timer++;
        for (int v : adj[u]) {
            if (disc[v] == -1) {
                dfs(v, u, adj, disc, low, res);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u]) res.push_back({u, v});
            } else if (v != parent) {
                low[u] = min(low[u], disc[v]);
            }
        }
    }
public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
        vector<vector<int>> adj(n), res;
        for (auto& e : connections) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<int> disc(n, -1), low(n, 0);
        dfs(0, -1, adj, disc, low, res);
        return res;
    }
};`,
    timeComplexity: "O(V + E)",
    timeExplanation: "Standard DFS visits each vertex and edge once.",
    spaceComplexity: "O(V + E)",
    spaceExplanation: "Adjacency list + disc/low arrays + recursion stack.",
    edgeCases: [
      "Graph with no bridges (all nodes in a cycle) → return empty.",
      "Tree (no cycles) → every edge is a bridge.",
      "Parallel edges between two nodes → not a bridge (can remove either).",
    ],
    memoryTrick: "\"Bridge condition: low[v] > disc[u]. If v can't reach back to u or earlier without the direct edge, that edge is critical. DFS order = discovery time; low = earliest ancestor reachable.\"",
  },

  "candy": {
    intuition:
      "Each child must get at least 1 candy. Children with higher ratings than their neighbors get more. Two-pass greedy: left-to-right ensures left neighbor constraint, right-to-left ensures right neighbor constraint. Take the max of both passes.",
    approach: [
      "Initialize candy[i] = 1 for all.",
      "Left to right: if ratings[i] > ratings[i-1], candy[i] = candy[i-1] + 1.",
      "Right to left: if ratings[i] > ratings[i+1], candy[i] = max(candy[i], candy[i+1] + 1).",
      "Return sum of candy array.",
    ],
    cppSolution: `class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        vector<int> candy(n, 1);
        for (int i = 1; i < n; i++)
            if (ratings[i] > ratings[i-1]) candy[i] = candy[i-1] + 1;
        for (int i = n-2; i >= 0; i--)
            if (ratings[i] > ratings[i+1]) candy[i] = max(candy[i], candy[i+1] + 1);
        return accumulate(candy.begin(), candy.end(), 0);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear passes through the array.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Candy array of size n.",
    edgeCases: [
      "Single child → 1 candy.",
      "All same ratings → all get 1 candy.",
      "Strictly increasing → 1,2,3,...,n.",
      "Peak in middle [1,3,2,1] → handle both sides of peak correctly.",
    ],
    memoryTrick: "\"Left pass: uphill slopes get more. Right pass: downhill slopes get more. Max of both passes at each position satisfies both neighbors.\"",
  },

  "employee-free-time": {
    intuition:
      "Given schedules of all employees (list of lists of intervals), find all time intervals when no employee is working. Flatten all intervals, sort by start, merge overlapping intervals, then gaps between merged intervals are free time.",
    approach: [
      "Collect all intervals from all employees into a single list.",
      "Sort by start time.",
      "Merge overlapping intervals (same as merge-intervals problem).",
      "Gaps between consecutive merged intervals are the free time.",
    ],
    cppSolution: `class Solution {
public:
    vector<Interval> employeeFreeTime(vector<vector<Interval>> schedule) {
        vector<Interval> all, res;
        for (auto& emp : schedule) for (auto& iv : emp) all.push_back(iv);
        sort(all.begin(), all.end(), [](const Interval& a, const Interval& b){ return a.start < b.start; });
        Interval cur = all[0];
        for (int i = 1; i < (int)all.size(); i++) {
            if (all[i].start <= cur.end) cur.end = max(cur.end, all[i].end); // merge
            else { res.push_back({cur.end, all[i].start}); cur = all[i]; }   // gap = free time
        }
        return res;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sorting n total intervals dominates.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Flattened intervals list.",
    edgeCases: [
      "One employee → free times are gaps in their schedule.",
      "All employees work same hours → no free time.",
      "No overlapping intervals at all → every gap between consecutive intervals is free time.",
    ],
    memoryTrick: "\"Flatten all employees into one timeline. Merge overlapping. Gaps = free time. Same as merge-intervals but report gaps, not merged intervals.\"",
  },

  "basic-calculator": {
    intuition:
      "Evaluate a string expression with +, -, and parentheses. Use a stack to save context (running result and sign) when entering parentheses. Process character by character.",
    approach: [
      "result = 0, sign = +1, num = 0.",
      "Digit: accumulate num.",
      "+ or -: apply previous sign×num to result. Reset num. Update sign.",
      "( : push {result, sign} onto stack. Reset result=0, sign=+1.",
      ") : finalize current num into result. Pop stack: result = popped_result + popped_sign × result.",
    ],
    cppSolution: `class Solution {
public:
    int calculate(string s) {
        stack<int> stk;
        int result = 0, sign = 1, num = 0;
        for (char c : s) {
            if (isdigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+' || c == '-') {
                result += sign * num;
                num = 0;
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                stk.push(result);
                stk.push(sign);
                result = 0; sign = 1;
            } else if (c == ')') {
                result += sign * num; num = 0;
                result *= stk.top(); stk.pop();   // outer sign
                result += stk.top(); stk.pop();   // outer result
            }
        }
        return result + sign * num;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the string, each character processed once.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack depth proportional to nesting depth (at most n/2).",
    edgeCases: [
      "No parentheses → just +/- chain.",
      "Nested parentheses (1+(2+(3))) → stack handles multiple levels.",
      "Leading/trailing spaces → ignored by the digit/operator check.",
      "Unary minus -(2+3) → stack stores sign=-1 before inner expression.",
    ],
    memoryTrick: "\"Stack saves {result, sign} when you enter '('. When you hit ')', close current expression, multiply by saved sign, add to saved result.\"",
  },

  "maximum-students-exam": {
    intuition:
      "Place maximum students in seats without cheating (no two adjacent in same row or diagonally adjacent between rows). Use bitmask DP: each row's valid placement is a bitmask. Enumerate valid row configurations satisfying intra-row and inter-row constraints.",
    approach: [
      "Row mask: 1 = broken seat (no student). Valid placement: no two adjacent 1-bits (no side-by-side) and no 1 on a broken seat.",
      "DP[row][mask] = max students placeable in rows 0..row with row having this placement mask.",
      "Transition: check diagonal constraints between row mask and previous row mask.",
      "Answer: max over all masks for the last row.",
    ],
    cppSolution: `class Solution {
public:
    int maxStudents(vector<vector<char>>& seats) {
        int m = seats.size(), n = seats[0].size();
        vector<int> rowMask(m);
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (seats[i][j] == '.') rowMask[i] |= (1 << j);
        vector<vector<int>> dp(m, vector<int>(1 << n, -1));
        for (int mask = 0; mask < (1 << n); mask++) {
            if ((mask & rowMask[0]) != mask) continue; // uses broken seats
            if (mask & (mask >> 1)) continue;           // adjacent students
            dp[0][mask] = __builtin_popcount(mask);
        }
        for (int i = 1; i < m; i++) {
            for (int mask = 0; mask < (1 << n); mask++) {
                if ((mask & rowMask[i]) != mask || (mask & (mask >> 1))) continue;
                for (int prev = 0; prev < (1 << n); prev++) {
                    if (dp[i-1][prev] < 0) continue;
                    // no diagonal cheating: check mask & (prev << 1) and mask & (prev >> 1)
                    if (mask & (prev << 1)) continue;
                    if (mask & (prev >> 1)) continue;
                    dp[i][mask] = max(dp[i][mask], dp[i-1][prev] + __builtin_popcount(mask));
                }
            }
        }
        return *max_element(dp[m-1].begin(), dp[m-1].end());
    }
};`,
    timeComplexity: "O(m × 4^n)",
    timeExplanation: "m rows, 2^n masks per row, 2^n prev masks to check = O(m × 4^n). n ≤ 8 so 4^8 = 65536 is manageable.",
    spaceComplexity: "O(m × 2^n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "All broken seats → 0 students.",
      "Single row → pick max non-adjacent valid seats.",
      "n=1 → each row has 0 or 1 valid seat.",
    ],
    memoryTrick: "\"Bitmask each row's students. Valid: no adjacent bits set, no bit on broken seat. Inter-row: no diagonal = no bit i of curr matches bit i±1 of prev. DP propagates row by row.\"",
  },

  "design-search-autocomplete": {
    intuition:
      "Design a search autocomplete system. On each character input, return top 3 historical queries by (frequency desc, lexicographic asc). Use a trie where each node stores a list of (sentence, count). On '#', save completed query.",
    approach: [
      "Trie node stores map<char, TrieNode*> and vector<pair<string,int>> topResults (or just traverse at query time).",
      "On input(c): if c=='#', insert current sentence with incremented count into trie. Else, advance current path pointer, return top 3 from current node's prefix.",
      "To find top 3: DFS from current trie node, collect all sentences, sort by count desc / lex asc, return top 3.",
    ],
    cppSolution: `class AutocompleteSystem {
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        unordered_map<string, int> counts;
    };
    TrieNode* root;
    TrieNode* cur;
    string prefix;
    void insert(TrieNode* node, const string& s, int c) {
        for (char ch : s) {
            if (!node->children.count(ch)) node->children[ch] = new TrieNode();
            node = node->children[ch];
            node->counts[s] += c;
        }
    }
public:
    AutocompleteSystem(vector<string>& sentences, vector<int>& times) {
        root = cur = new TrieNode();
        for (int i = 0; i < (int)sentences.size(); i++) insert(root, sentences[i], times[i]);
    }
    vector<string> input(char c) {
        if (c == '#') {
            insert(root, prefix, 1);
            prefix = ""; cur = root;
            return {};
        }
        prefix += c;
        if (cur && cur->children.count(c)) cur = cur->children[c];
        else { cur = nullptr; return {}; }
        vector<pair<int,string>> cands;
        for (auto& [s, cnt] : cur->counts) cands.push_back({cnt, s});
        sort(cands.begin(), cands.end(), [](auto& a, auto& b){
            return a.first != b.first ? a.first > b.first : a.second < b.second;
        });
        vector<string> res;
        for (int i = 0; i < min(3,(int)cands.size()); i++) res.push_back(cands[i].second);
        return res;
    }
};`,
    timeComplexity: "O(p × n) per query",
    timeExplanation: "p = prefix length, n = sentences at that node. Sorting n candidates is O(n log n).",
    spaceComplexity: "O(total characters × avg sentences per node)",
    spaceExplanation: "Trie stores all sentences at every prefix node — significant memory but O(1) traversal.",
    edgeCases: [
      "Empty history → return [] until '#' is pressed.",
      "Same query entered multiple times → count increments, appears first.",
      "Tie in count → lexicographic order.",
    ],
    memoryTrick: "\"Trie path = prefix. Each node caches all sentences passing through it with counts. '#' saves and resets. Input navigates trie, returns sorted top-3 from current node.\"",
  },

  "shortest-path-obstacle": {
    intuition:
      "Find shortest path from top-left to bottom-right in grid, allowed to eliminate at most k obstacles. BFS with state (row, col, remaining_k). A 3D visited array prevents revisiting same (position, k_remaining) state.",
    approach: [
      "BFS queue holds (row, col, k_remaining, steps).",
      "Mark visited[row][col][k] to avoid cycles.",
      "For each neighbor: if obstacle and k>0, push with k-1. If free, push with same k.",
      "First time we reach (m-1, n-1), return steps.",
    ],
    cppSolution: `class Solution {
public:
    int shortestPath(vector<vector<int>>& grid, int k) {
        int m = grid.size(), n = grid[0].size();
        if (m == 1 && n == 1) return 0;
        vector<vector<vector<bool>>> vis(m, vector<vector<bool>>(n, vector<bool>(k+1, false)));
        queue<tuple<int,int,int,int>> q; // row, col, k_rem, steps
        q.push({0, 0, k, 0});
        vis[0][0][k] = true;
        int dirs[][2] = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!q.empty()) {
            auto [r, c, rem, steps] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                int nk = rem - grid[nr][nc];
                if (nk < 0) continue;
                if (nr == m-1 && nc == n-1) return steps + 1;
                if (!vis[nr][nc][nk]) { vis[nr][nc][nk] = true; q.push({nr, nc, nk, steps+1}); }
            }
        }
        return -1;
    }
};`,
    timeComplexity: "O(m × n × k)",
    timeExplanation: "State space is m × n × (k+1). Each state visited at most once.",
    spaceComplexity: "O(m × n × k)",
    spaceExplanation: "3D visited array + BFS queue.",
    edgeCases: [
      "k >= m+n-2 (Manhattan distance): optimal path always exists, return m+n-2.",
      "No obstacles → standard BFS, return m+n-2.",
      "Start or end is an obstacle → k must be ≥ 1 for those.",
      "Grid 1×1 → return 0.",
    ],
    memoryTrick: "\"BFS with state = (position, obstacles_left). 3D visited. Key insight: same position with MORE obstacles remaining is strictly better — never revisit with fewer remaining.\"",
  },

  // ── Prefix Sum Pattern ─────────────────────────────────────────────────────

  "running-sum-1d": {
    intuition: "Build a prefix sum array where each element is the sum of all previous elements plus itself. This is the foundation — every prefix sum technique extends this O(n) precompute + O(1) query idea.",
    approach: [
      "Initialize result[0] = nums[0].",
      "For each i from 1 to n-1: result[i] = result[i-1] + nums[i].",
      "Return result.",
      "Or do it in-place: nums[i] += nums[i-1].",
    ],
    cppSolution: `vector<int> runningSum(vector<int>& nums) {
    for (int i = 1; i < nums.size(); i++)
        nums[i] += nums[i-1];
    return nums;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification.",
    edgeCases: ["Single element — already the running sum.", "All zeros — all running sums are zero."],
    memoryTrick: "\"prefix[i] = prefix[i-1] + nums[i]. Each position stores the SUM UP TO HERE. Difference of two prefix sums = range sum. This single idea powers dozens of LC problems.\"",
  },

  "find-pivot-index": {
    intuition: "Pivot index: left sum equals right sum. Total sum = leftSum + nums[i] + rightSum. So leftSum == total - leftSum - nums[i]. Scan left to right maintaining running leftSum — O(1) space, O(n) time.",
    approach: [
      "Compute total = sum of all elements.",
      "Initialize leftSum = 0. Iterate i from 0 to n-1.",
      "At each i: rightSum = total - leftSum - nums[i].",
      "If leftSum == rightSum: return i.",
      "Update leftSum += nums[i].",
      "Return -1 if no pivot found.",
    ],
    cppSolution: `int pivotIndex(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    int leftSum = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (leftSum == total - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes: one for total, one for scan.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only leftSum and total variables.",
    edgeCases: ["Pivot at index 0 — leftSum is 0, rightSum must equal 0.", "Pivot at last index — rightSum is 0.", "Multiple pivots — return leftmost (first found)."],
    memoryTrick: "\"rightSum = total - leftSum - nums[i]. No need to store a rightSum array. Check equality, then add to leftSum. Prefix sum from left, suffix from the right — both computed on-the-fly.\"",
  },

  "range-sum-query": {
    intuition: "Build prefix sum once in O(n). Answer any range query [left, right] in O(1) as prefix[right+1] - prefix[left]. The 1-indexed prefix array with prefix[0]=0 eliminates boundary conditions.",
    approach: [
      "Constructor: build prefix[n+1] where prefix[0]=0, prefix[i] = prefix[i-1] + nums[i-1].",
      "sumRange(l, r): return prefix[r+1] - prefix[l].",
      "That's it — O(n) build, O(1) per query.",
    ],
    cppSolution: `class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        prefix.resize(nums.size() + 1, 0);
        for (int i = 0; i < nums.size(); i++)
            prefix[i+1] = prefix[i] + nums[i];
    }
    int sumRange(int left, int right) {
        return prefix[right+1] - prefix[left];
    }
};`,
    timeComplexity: "O(n) build, O(1) query",
    timeExplanation: "Precompute once, queries are subtraction.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Prefix array of size n+1.",
    edgeCases: ["left == right — single element sum = prefix[l+1] - prefix[l] = nums[l].", "left == 0 — prefix[0] = 0, so result = prefix[right+1]."],
    memoryTrick: "\"Always use 1-indexed prefix with prefix[0]=0. Then sum(l,r) = prefix[r+1] - prefix[l] with NO special cases. 1-indexing kills all boundary bugs.\"",
  },

  "subarray-sum-equals-k": {
    intuition: "For every index j, we want to count indices i < j where prefix[j] - prefix[i] = k, i.e., prefix[i] = prefix[j] - k. Maintain a hash map of seen prefix sums and their counts. Check if (currentSum - k) exists in the map before adding currentSum.",
    approach: [
      "Initialize seen = {0: 1} (empty prefix has sum 0 — critical for subarrays starting at index 0).",
      "running = 0, count = 0.",
      "For each num: running += num.",
      "count += seen[running - k] (how many previous prefixes give us the target subarray).",
      "seen[running]++ (record this prefix).",
      "Return count.",
    ],
    cppSolution: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen{{0,1}};
    int running = 0, count = 0;
    for (int num : nums) {
        running += num;
        count += seen.count(running - k) ? seen[running - k] : 0;
        seen[running]++;
    }
    return count;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass with O(1) hash map operations.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Hash map stores at most n distinct prefix sums.",
    edgeCases: [
      "k = 0: subarrays summing to 0. seen{0:1} handles prefix[j] itself being 0.",
      "Negative numbers: hash map approach handles them naturally (unlike sliding window which can't).",
      "Multiple subarrays with same sum — counting (not just existence) via seen[prefix] increments.",
    ],
    memoryTrick: "\"seen{0:1} is the magic init. Without it, subarrays from index 0 are missed. Pattern: for each j, ask 'how many prior prefixes equal running-k?' Then add running to seen. Order matters — check before adding so i < j is guaranteed.\"",
  },

  "subarray-sums-divisible-k": {
    intuition: "Two prefix sums i and j have (prefix[j] - prefix[i]) % k == 0 iff prefix[j] % k == prefix[i] % k. Group prefixes by their remainder mod k. For each remainder r, if there are c prefixes with that remainder, there are c*(c-1)/2 valid pairs — or just count as you go.",
    approach: [
      "Initialize remainderCount = {0: 1}.",
      "running = 0, count = 0.",
      "For each num: running = (running + num) % k. Handle negative: running = ((running % k) + k) % k.",
      "count += remainderCount[running].",
      "remainderCount[running]++.",
      "Return count.",
    ],
    cppSolution: `int subarraysDivByK(vector<int>& nums, int k) {
    unordered_map<int,int> rem{{0,1}};
    int running = 0, count = 0;
    for (int num : nums) {
        running = ((running + num) % k + k) % k;  // handle negatives
        count += rem[running];
        rem[running]++;
    }
    return count;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(k)",
    spaceExplanation: "At most k distinct remainders.",
    edgeCases: [
      "Negative numbers: C++ modulo of negative is negative — use ((x % k) + k) % k to normalize.",
      "k = 1: every subarray divisible by 1, answer = n*(n+1)/2.",
      "running = 0 after mod: subarray from index 0 to here is divisible — rem{0:1} counts it.",
    ],
    memoryTrick: "\"Same prefix-sum + hashmap skeleton as Subarray Sum = K. Key swap: map by (prefix % k) instead of prefix value. ((x%k)+k)%k for negative-safe modulo. If same remainder seen before — those two indices bound a divisible subarray.\"",
  },

  "continuous-subarray-sum": {
    intuition: "Find a subarray of length ≥ 2 whose sum is a multiple of k. Equivalent: find two prefix sums with the same remainder mod k, at least 2 apart. Store the FIRST index where each remainder appeared — if same remainder seen again with gap ≥ 2, answer is true.",
    approach: [
      "Initialize seen = {0: -1} (remainder 0 seen before index 0).",
      "running = 0.",
      "For each i: running = (running + nums[i]) % k.",
      "If running in seen AND i - seen[running] >= 2: return true.",
      "If running NOT in seen: seen[running] = i (store first occurrence only).",
      "Return false.",
    ],
    cppSolution: `bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen{{0,-1}};  // remainder -> first index seen
    int running = 0;
    for (int i = 0; i < nums.size(); i++) {
        running = (running + nums[i]) % k;
        if (seen.count(running)) {
            if (i - seen[running] >= 2) return true;
        } else {
            seen[running] = i;  // only store first occurrence!
        }
    }
    return false;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(k)",
    spaceExplanation: "At most k distinct remainders stored.",
    edgeCases: [
      "seen{0:-1}: if running becomes 0 at index i, subarray nums[0..i] has length i+1 ≥ 2 if i ≥ 1.",
      "Don't update seen if remainder already present — you need the EARLIEST occurrence for maximum gap.",
      "k = 0: the problem usually guarantees k > 0, but handle by checking sum == 0 directly.",
    ],
    memoryTrick: "\"Sibling of Subarray Sums Divisible by K. Same mod-prefix idea but: (1) store FIRST index not count, (2) check gap ≥ 2, (3) init {0:-1} not {0:1}. The -1 init gives correct gap when whole prefix from index 0 is divisible.\"",
  },

  "range-addition": {
    intuition: "Difference array: store deltas, not values. For range update [l, r] += val: diff[l] += val, diff[r+1] -= val. Then recover original array by taking prefix sum of diff. Each update is O(1). Final recovery is O(n). Complement to prefix sum — prefix sum answers queries, difference array answers updates.",
    approach: [
      "Initialize diff[n+1] = all zeros.",
      "For each update [start, end, inc]: diff[start] += inc, diff[end+1] -= inc.",
      "Build result: result[0] = diff[0]. For i from 1 to n-1: result[i] = result[i-1] + diff[i].",
      "Return result.",
    ],
    cppSolution: `vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {
    vector<int> diff(length + 1, 0);
    for (auto& u : updates) {
        diff[u[0]] += u[2];
        diff[u[1] + 1] -= u[2];
    }
    vector<int> result(length);
    result[0] = diff[0];
    for (int i = 1; i < length; i++)
        result[i] = result[i-1] + diff[i];
    return result;
}`,
    timeComplexity: "O(n + q)",
    timeExplanation: "q updates each O(1), one O(n) recovery pass.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Difference array of size n+1.",
    edgeCases: [
      "Update ending at last index — diff[n] -= val, never accessed in recovery (size n+1 prevents OOB).",
      "Overlapping ranges — multiple deltas accumulate correctly.",
      "No updates — result is all zeros.",
    ],
    memoryTrick: "\"diff[l] += val starts the effect. diff[r+1] -= val cancels it. Take prefix sum to recover. Think of it as: 'add at start, undo at end+1.' O(1) per update, O(n) to materialize. Used in: Car Pooling, Corporate Flight Bookings, Paint House ranges.\"",
  },

  "car-pooling": {
    intuition: "Difference array on capacity. Each trip adds passengers at from and removes at to. Build capacity timeline, scan for any point exceeding capacity. Classic difference array application on an event-based timeline.",
    approach: [
      "Initialize diff[1001] = all zeros (max location is 1000).",
      "For each trip [num, from, to]: diff[from] += num, diff[to] -= num (passengers EXIT at 'to', not 'to+1').",
      "Scan diff from 0 to 1000. Maintain running sum. If running > capacity at any point: return false.",
      "Return true.",
    ],
    cppSolution: `bool carPooling(vector<vector<int>>& trips, int capacity) {
    int diff[1001] = {};
    for (auto& t : trips) {
        diff[t[1]] += t[0];   // board at from
        diff[t[2]] -= t[0];   // exit at to
    }
    int passengers = 0;
    for (int loc = 0; loc <= 1000; loc++) {
        passengers += diff[loc];
        if (passengers > capacity) return false;
    }
    return true;
}`,
    timeComplexity: "O(n + L)",
    timeExplanation: "n trips processed, L=1000 locations scanned.",
    spaceComplexity: "O(L)",
    spaceExplanation: "Fixed 1001-size array.",
    edgeCases: [
      "Passenger exits AT destination (to) — they're not on the car for that stop: diff[to] -= num (not to+1).",
      "Multiple trips at same location — differences accumulate correctly.",
      "capacity = 0 — any trip fails unless num = 0.",
    ],
    memoryTrick: "\"Passengers LEAVE at 'to' not 'to+1' — this problem's tricky detail. Use diff[to] -= num. Then prefix-sum scan: if passengers ever exceed capacity, false. Identical pattern: Corporate Flight Bookings (seat count), Meeting Room capacity timeline.\"",
  },

  // ── Stack — Next Greater Element ────────────────────────────────────────────

  "next-greater-element-i": {
    intuition: "For each element in nums1, find the next greater element in nums2. Build a hash map from element → next greater element using a monotonic decreasing stack on nums2, then look up each nums1 element. O(n+m) total.",
    approach: [
      "Build nextGreater map for nums2 using monotonic stack.",
      "Iterate nums2 left to right. Maintain a decreasing stack.",
      "When nums2[i] > stack.top(): the top's next greater is nums2[i]. Pop and record in map. Repeat.",
      "Push nums2[i] onto stack.",
      "Any elements left in stack have no next greater (-1).",
      "For each num in nums1: result.push_back(nextGreater[num] or -1).",
    ],
    cppSolution: `vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nextGreater;
    stack<int> st;  // monotonic decreasing
    for (int num : nums2) {
        while (!st.empty() && st.top() < num) {
            nextGreater[st.top()] = num;
            st.pop();
        }
        st.push(num);
    }
    // remaining elements have no next greater
    while (!st.empty()) { nextGreater[st.top()] = -1; st.pop(); }
    vector<int> result;
    for (int num : nums1) result.push_back(nextGreater[num]);
    return result;
}`,
    timeComplexity: "O(n + m)",
    timeExplanation: "Each element pushed and popped at most once.",
    spaceComplexity: "O(m)",
    spaceExplanation: "Stack and hash map proportional to nums2 size.",
    edgeCases: [
      "Element with no next greater — stack residual, map returns -1.",
      "nums1 element not in nums2 — guaranteed unique by problem.",
      "Decreasing sequence in nums2 — all end up in stack, all get -1.",
    ],
    memoryTrick: "\"Monotonic decreasing stack: push each element. When current > top, top found its answer. Pop, record, repeat. This 'deferred assignment' pattern solves all Next Greater variants. NGE I: precompute map. NGE II (circular): double the array. Daily Temps: same pattern, store indices.\"",
  },

  "next-greater-element-ii": {
    intuition: "Circular array: elements wrap around. Simulate by iterating 2n times (indices mod n). Use monotonic decreasing stack storing indices. After 2n iterations, any element still in stack has no next greater (-1). Key insight: second pass fills the gaps the first pass couldn't.",
    approach: [
      "Initialize result[n] = all -1. Stack stores indices.",
      "Iterate i from 0 to 2n-1. Use actual index = i % n.",
      "While stack not empty AND nums[stack.top()] < nums[i % n]: result[stack.top()] = nums[i % n]. Pop.",
      "Only push i % n onto stack during first n iterations (second pass only resolves, doesn't add new entries).",
      "Return result.",
    ],
    cppSolution: `vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // stores indices
    for (int i = 0; i < 2 * n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i % n]) {
            result[st.top()] = nums[i % n];
            st.pop();
        }
        if (i < n) st.push(i);  // only push in first pass
    }
    return result;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Each index pushed and popped at most once across 2n iterations.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Stack and result array.",
    edgeCases: [
      "All same elements — stack never pops, all result stays -1.",
      "Strictly increasing — last element is max, its NGE is nums[0]. Second pass handles it.",
      "Single element — NGE is -1 (same element circular, not strictly greater).",
    ],
    memoryTrick: "\"Circular = iterate 2n, index mod n. Push only in first n iterations. Second pass resolves remaining elements without adding new ones. Same monotonic stack as NGE I — just double the loop. Any element not resolved after 2n iterations = no NGE = -1.\"",
  },

  // ── DP — Game Theory ────────────────────────────────────────────────────────

  "nim-game": {
    intuition: "If n % 4 == 0, second player wins (copies your strategy, always leaves you with 0 mod 4). Otherwise first player wins by taking enough to leave opponent at 4k. Pure math insight — no actual DP needed. Gateway to game theory.",
    approach: [
      "If n % 4 == 0: return false (second player always wins).",
      "Else: return true (first player wins).",
      "Why: with n=4, any move leaves 1,2,3 for opponent who can finish. With n=5,6,7, you can leave opponent with 4. With n=8, opponent mirrors strategy back to 4 after your move.",
    ],
    cppSolution: `bool canWinNim(int n) {
    return n % 4 != 0;
}
// General game theory DP (for arbitrary move sets):
// dp[i] = true if current player wins with i stones
// dp[0] = false (no moves left, you lose)
// dp[i] = any move in moves that leads to dp[i - move] == false
// This generalizes to all combinatorial game problems`,
    timeComplexity: "O(1)",
    timeExplanation: "Single modulo operation.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No space needed.",
    edgeCases: [
      "n = 1, 2, 3: first player wins (take all).",
      "n = 4: second player wins.",
      "n = 1e9+4: check n % 4, works for all sizes.",
    ],
    memoryTrick: "\"Losing positions: 0, 4, 8, 12, ... (multiples of 4). Any other position can move to a losing position. Pattern: losing iff n % 4 == 0. This generalizes: if moves = {1,2,...,k}, losing iff n % (k+1) == 0. Memorize for all Nim-like problems.\"",
  },

  "stone-game": {
    intuition: "Alex (first player) always wins when n is even — mathematical proof. But the DP approach generalizes to Stone Game II, III, etc. DP: dp[i][j] = max score advantage (your score - opponent's) for stones[i..j]. On your turn you take either end; opponent plays optimally.",
    approach: [
      "dp[i][j] = best score difference (current player − opponent) over stones[i..j].",
      "Base case: dp[i][i] = stones[i] (only one stone, take it).",
      "Transition: dp[i][j] = max(stones[i] - dp[i+1][j], stones[j] - dp[i][j-1]).",
      "Answer: dp[0][n-1] > 0 means Alex wins.",
      "Math shortcut: n is even → Alex always wins (return true). But learn the DP for Stone Game II+.",
    ],
    cppSolution: `bool stoneGame(vector<int>& piles) {
    // Math: Alex always wins when n is even
    return true;  // n is always even per problem constraints
}

// General DP (needed for Stone Game II, III, IV, V...)
bool stoneGameDP(vector<int>& piles) {
    int n = piles.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) dp[i][i] = piles[i];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = max(piles[i] - dp[i+1][j],
                           piles[j] - dp[i][j-1]);
        }
    }
    return dp[0][n-1] > 0;
}`,
    timeComplexity: "O(n²) for DP, O(1) for math",
    timeExplanation: "DP fills n×n table.",
    spaceComplexity: "O(n²) for DP, O(1) for math",
    spaceExplanation: "2D DP table.",
    edgeCases: [
      "n = 2: first player takes max of two piles.",
      "All equal piles: first player's advantage depends on count parity.",
      "DP handles arbitrary pile values the math shortcut doesn't.",
    ],
    memoryTrick: "\"dp[i][j] = advantage of current player over piles[i..j]. Negative = opponent is winning. Take left: stones[i] − dp[i+1][j] (opponent now has advantage over i+1..j). Take right: stones[j] − dp[i][j-1]. Max of both. Same template for Predict Winner, Optimal Strategy for a Game.\"",
  },

  // ── 4 New Gap-Filling Problems ─────────────────────────────────────────────

  "remove-duplicates": {
    intuition: "Write pointer technique: maintain a slow pointer (write index) that only advances when a unique element is found. Fast pointer scans everything. In-place, O(1) space. Foundation of all in-place array modification problems.",
    approach: [
      "If array empty, return 0.",
      "Initialize write = 1 (first element always kept).",
      "Loop read from 1 to n-1: if nums[read] != nums[read-1], it's unique — copy to nums[write], advance write.",
      "Return write (count of unique elements).",
      "Pattern generalizes: 'allow k duplicates' → compare nums[write-k] instead of nums[write-1].",
    ],
    cppSolution: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int write = 1;
    for (int read = 1; read < nums.size(); read++) {
        if (nums[read] != nums[read - 1]) {
            nums[write++] = nums[read];
        }
    }
    return write;
}
// Generalized — allow at most k duplicates:
int removeDuplicatesII(vector<int>& nums, int k = 2) {
    int write = 0;
    for (int x : nums) {
        if (write < k || nums[write - k] != x)
            nums[write++] = x;
    }
    return write;
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification, only two index variables.",
    edgeCases: [
      "Empty array → return 0.",
      "All duplicates → write stays at 1, return 1.",
      "No duplicates → write equals n, all elements kept.",
      "Generalize to 'allow k duplicates': change condition to compare with nums[write-k].",
    ],
    memoryTrick: "\"Write pointer only advances on unique values. Read always advances. Same trick used in: move zeroes, partition arrays, filter in-place. The write index IS the answer count.\"",
  },

  "sort-colors": {
    intuition: "Dutch National Flag algorithm (Dijkstra). Three-way partition with three pointers: low, mid, high. All 0s go to [0, low), all 1s in [low, mid), all 2s in (high, n-1]. Process mid until it crosses high. Critical technique used in quicksort's partition and any 3-category sort.",
    approach: [
      "Init low = 0, mid = 0, high = n-1.",
      "While mid <= high: examine nums[mid].",
      "If 0: swap nums[mid] with nums[low], advance both low and mid.",
      "If 1: mid only — already in correct region.",
      "If 2: swap nums[mid] with nums[high], decrease high only (don't advance mid — swapped value needs examination).",
      "Loop ends when mid > high — all regions correctly partitioned.",
    ],
    cppSolution: `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {  // nums[mid] == 2
            swap(nums[mid], nums[high--]);
            // don't advance mid — nums[mid] is now the swapped value
        }
    }
}`,
    timeComplexity: "O(n)",
    timeExplanation: "Each element is touched at most twice (once by mid, possibly swapped by low or high).",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place. Three index variables only.",
    edgeCases: [
      "All same color → loop runs, no swaps, exits correctly.",
      "Already sorted → no swaps, O(n) scan.",
      "Two elements → works correctly.",
      "mid must NOT advance after a swap with high — the newly swapped value is unexamined.",
    ],
    memoryTrick: "\"low = boundary of 0s, high = boundary of 2s, mid = current. 0 pushes both low and mid forward. 2 pulls high backward. 1 just advances mid. The insight: after swapping with low, the swapped value must be 1 (low only points to 1s after first 0 is passed), so advancing mid is safe. After swapping with high, the swapped value is UNKNOWN — mid must stay.\"",
  },

  "find-first-last-position": {
    intuition: "Two binary searches: one finds the leftmost (first) occurrence, one finds the rightmost (last) occurrence. The left-boundary template and right-boundary template are the two fundamental binary search variants. Mastering this unlocks 20+ problems that require finding a boundary rather than an exact target.",
    approach: [
      "Write findLeft(target): standard binary search but when nums[mid] == target, don't stop — move right = mid - 1 to keep searching left.",
      "Write findRight(target): when nums[mid] == target, move left = mid + 1 to keep searching right.",
      "findLeft returns the first index where nums[idx] == target (or -1).",
      "findRight returns the last index where nums[idx] == target (or -1).",
      "Return [findLeft(target), findRight(target)].",
    ],
    cppSolution: `vector<int> searchRange(vector<int>& nums, int target) {
    return {findBound(nums, target, true), findBound(nums, target, false)};
}

int findBound(vector<int>& nums, int target, bool isLeft) {
    int lo = 0, hi = nums.size() - 1, bound = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            bound = mid;
            if (isLeft) hi = mid - 1;  // keep searching left
            else        lo = mid + 1;  // keep searching right
        } else if (nums[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return bound;
}
// Alternative: use lower_bound / upper_bound (C++ STL)
// lower_bound gives first position >= target
// upper_bound gives first position > target
// range = [lower_bound(target), upper_bound(target) - 1]`,
    timeComplexity: "O(log n)",
    timeExplanation: "Two separate binary searches, each O(log n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant extra space.",
    edgeCases: [
      "Target not in array → both return -1.",
      "Single occurrence → both findLeft and findRight return same index.",
      "All elements are target → [0, n-1].",
      "Empty array → return [-1, -1].",
    ],
    memoryTrick: "\"Left boundary: on match, go MORE LEFT (hi = mid-1). Right boundary: on match, go MORE RIGHT (lo = mid+1). Both store mid as current best. This template works for ANY monotonic predicate — first true, last false, etc. It's the most versatile binary search pattern.\"",
  },

  "is-graph-bipartite": {
    intuition: "A graph is bipartite if it can be 2-colored: every edge connects vertices of different colors. Equivalent to: graph has no odd-length cycles. Use BFS/DFS: try to color each vertex, if a neighbor has the same color as current — not bipartite. Handle disconnected graphs by checking each unvisited vertex.",
    approach: [
      "For each unvisited vertex, start BFS.",
      "Color the start vertex 0. Add to queue.",
      "For each vertex dequeued: color all unvisited neighbors with opposite color (1 - current_color).",
      "If a neighbor is already colored with SAME color as current — return false (not bipartite).",
      "If all vertices colored without conflict — return true.",
      "Must check each component (graph may be disconnected).",
    ],
    cppSolution: `bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1);  // -1 = unvisited

    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;  // already colored

        queue<int> q;
        q.push(start);
        color[start] = 0;

        while (!q.empty()) {
            int node = q.front(); q.pop();
            for (int neighbor : graph[node]) {
                if (color[neighbor] == -1) {
                    color[neighbor] = 1 - color[node];  // opposite color
                    q.push(neighbor);
                } else if (color[neighbor] == color[node]) {
                    return false;  // same color = odd cycle
                }
            }
        }
    }
    return true;
}`,
    timeComplexity: "O(V + E)",
    timeExplanation: "Standard BFS — each vertex and edge visited once.",
    spaceComplexity: "O(V)",
    spaceExplanation: "Color array + BFS queue, both proportional to number of vertices.",
    edgeCases: [
      "Disconnected graph → must BFS from each unvisited component.",
      "Graph with no edges → always bipartite.",
      "Graph with self-loops → not bipartite (self-loop = odd cycle of length 1).",
      "Tree (connected acyclic) → always bipartite.",
      "Odd cycle → not bipartite. Even cycle → bipartite.",
    ],
    memoryTrick: "\"2-coloring = bipartite check. If you can checkerboard the graph — it's bipartite. Odd cycle breaks checkerboard. BFS: color alternating. Same-color neighbor = conflict = odd cycle detected. This technique appears in: check if graph can be divided into two teams, scheduling problems, matching problems.\"",
  },

  "remove-duplicates-ii": {
    intuition:
      "Same write-pointer trick as removing all duplicates, but now each value is allowed to appear up to twice. Compare the candidate to the element TWO positions back in the write region — if it's different (or write index < 2), the value hasn't appeared twice yet, so it's safe to keep.",
    approach: [
      "If array length ≤ 2, return length as-is (nothing can violate 'at most 2').",
      "Initialize write = 2 (first two elements are always kept).",
      "For read from index 2 to end: if nums[read] != nums[write-2], copy nums[read] to nums[write], write++.",
      "Return write as the new length.",
    ],
    cppSolution: `class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if ((int)nums.size() <= 2) return nums.size();
        int write = 2;
        for (int read = 2; read < (int)nums.size(); read++) {
            if (nums[read] != nums[write - 2]) {
                nums[write] = nums[read];
                write++;
            }
        }
        return write;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass; each element is read once and written at most once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place overwrite, no extra data structure.",
    edgeCases: [
      "Array length 0, 1, or 2 — always valid, return length unchanged.",
      "All elements identical — result keeps only the first 2.",
      "No duplicates at all — write pointer copies every element, length unchanged.",
    ],
    memoryTrick: "\"Compare to write-2, not write-1 — that's what lets a value repeat exactly twice before blocking the third.\"",
  },

  "merge-sorted-array": {
    intuition:
      "Merging from the front requires shifting elements in nums1 to make room — O(n) per insert. Instead, merge from the BACK: the largest elements from both arrays land in the last empty slots first, so no shifting is ever needed.",
    approach: [
      "Set three pointers: i = m-1 (last real element of nums1), j = n-1 (last of nums2), k = m+n-1 (last slot overall).",
      "While j >= 0: if i >= 0 and nums1[i] > nums2[j], place nums1[i] at k, decrement i; else place nums2[j] at k, decrement j. Decrement k each time.",
      "Loop ends when j < 0 — any remaining nums1 elements are already in place.",
    ],
    cppSolution: `class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
};`,
    timeComplexity: "O(m + n)",
    timeExplanation: "Each element from both arrays is placed exactly once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Merges in-place using nums1's extra trailing capacity.",
    edgeCases: [
      "nums2 is empty (n=0) — loop never runs, nums1 already correct.",
      "nums1's real elements are all smaller than nums2's — nums2 gets copied wholesale once i < 0.",
      "m = 0 — nums1 is entirely empty space, becomes a copy of nums2.",
    ],
    memoryTrick: "\"Merge from the back when merging INTO an array with trailing space — front-merge shifts, back-merge doesn't.\"",
  },

  "next-permutation": {
    intuition:
      "The next lexicographic permutation is found by: (1) finding the rightmost position where the sequence stops increasing (scanning from the end), (2) swapping it with the smallest element to its right that's still bigger than it, (3) reversing everything after that position to get the smallest possible suffix.",
    approach: [
      "Scan from the right to find the first index i where nums[i] < nums[i+1] (the 'pivot'). If none exists, the array is the last permutation — reverse the whole array.",
      "Scan from the right again to find the first index j > i where nums[j] > nums[i].",
      "Swap nums[i] and nums[j].",
      "Reverse the subarray from i+1 to the end (it was non-increasing, reversing makes it the smallest arrangement).",
    ],
    cppSolution: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size(), i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear scans plus a linear reversal, all bounded by array length.",
    spaceComplexity: "O(1)",
    spaceExplanation: "All operations happen in-place.",
    edgeCases: [
      "Strictly decreasing array (e.g. [3,2,1]) — no pivot found, i ends at -1, whole array gets reversed to [1,2,3].",
      "Array with duplicates (e.g. [1,1,5]) — pivot search and swap still work correctly since comparisons use >= and <=.",
      "Single element array — nothing to do, loop conditions naturally skip.",
    ],
    memoryTrick: "\"Find rightmost ascent, swap with smallest bigger element to its right, reverse the tail. That's literally the algorithm for 'next' in dictionary order.\"",
  },

  "fruit-into-baskets": {
    intuition:
      "This is 'longest substring with at most 2 distinct characters' wearing a fruit costume. Maintain a sliding window with a frequency map; when the map exceeds 2 distinct fruit types, shrink from the left until it's back to 2.",
    approach: [
      "Use a hash map counting fruit type frequency inside the window [left, right].",
      "Expand right, incrementing the count for fruits[right].",
      "While the map has more than 2 distinct keys: decrement count for fruits[left], remove key if count hits 0, then left++.",
      "Track the max window length (right - left + 1) after every expansion.",
    ],
    cppSolution: `class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        unordered_map<int,int> count;
        int left = 0, best = 0;
        for (int right = 0; right < (int)fruits.size(); right++) {
            count[fruits[right]]++;
            while (count.size() > 2) {
                count[fruits[left]]--;
                if (count[fruits[left]] == 0) count.erase(fruits[left]);
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each element enters and leaves the window at most once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "The frequency map holds at most 3 keys at any point (bounded, not input-dependent).",
    edgeCases: [
      "All same fruit type — entire array is the answer.",
      "Only 2 distinct types total — entire array is the answer.",
      "Every fruit distinct — answer is 2 (can only hold 2 types).",
    ],
    memoryTrick: "\"'At most K distinct' is always: expand right, shrink left while map.size() > K. Fruit baskets = K=2 special case.\"",
  },

  "max-consecutive-ones-iii": {
    intuition:
      "We're allowed to flip at most K zeros to ones. That's equivalent to: find the longest window containing at most K zeros. Sliding window: expand right always; shrink left only when the zero count inside the window exceeds K.",
    approach: [
      "Track zeroCount inside window [left, right].",
      "Expand right; if nums[right] == 0, increment zeroCount.",
      "While zeroCount > k: if nums[left] == 0, decrement zeroCount; left++.",
      "Update best with (right - left + 1) after every step — window is always valid at this point.",
    ],
    cppSolution: `class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int left = 0, zeros = 0, best = 0;
        for (int right = 0; right < (int)nums.size(); right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > k) {
                if (nums[left] == 0) zeros--;
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass; left pointer only moves forward, never backtracks.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only a few counters needed.",
    edgeCases: [
      "k = 0 — reduces to 'longest run of consecutive 1s' with no flips allowed.",
      "k >= number of zeros in array — entire array becomes the answer.",
      "All zeros with k = array length — entire array flippable.",
    ],
    memoryTrick: "\"Same skeleton as Fruit Into Baskets — track a budget (zero count) instead of a distinct-count, shrink when budget is exceeded.\"",
  },

  "subarray-product-less-k": {
    intuition:
      "For a sliding window with product < k: every time the window is valid (product < k), ALL subarrays ending at 'right' and starting anywhere from left to right are valid too — that's (right - left + 1) new subarrays to count. Shrink from the left whenever product >= k.",
    approach: [
      "If k <= 1, return 0 immediately (no positive-integer array can have a product < 1).",
      "Maintain running product of window [left, right]; expand right by multiplying in nums[right].",
      "While product >= k: divide out nums[left], left++.",
      "Add (right - left + 1) to the count — this is the number of valid subarrays ending exactly at right.",
    ],
    cppSolution: `class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k <= 1) return 0;
        long long product = 1;
        int left = 0, count = 0;
        for (int right = 0; right < (int)nums.size(); right++) {
            product *= nums[right];
            while (product >= k) {
                product /= nums[left];
                left++;
            }
            count += right - left + 1;
        }
        return count;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Left pointer moves forward only; amortized O(1) per right step.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Just a running product and two pointers.",
    edgeCases: [
      "k <= 1 — answer is always 0 since all nums[i] >= 1 given constraints.",
      "All elements equal to 1 — every subarray qualifies if k > 1.",
      "Single element >= k — that element contributes 0 subarrays, window resets around it.",
    ],
    memoryTrick: "\"Counting subarrays with a window constraint: add (right - left + 1) each step — that's the count of NEW valid subarrays ending at right, not a running total to recompute.\"",
  },

  "find-peak-element": {
    intuition:
      "A peak is any element strictly greater than its neighbors — the array isn't necessarily sorted, but binary search still works because you can always move toward a peak: if mid's right neighbor is bigger, a peak must exist somewhere to the right (values only increase or you hit a peak); symmetric logic for the left.",
    approach: [
      "Binary search with low = 0, high = n-1.",
      "At mid, compare nums[mid] to nums[mid+1].",
      "If nums[mid] < nums[mid+1], a peak exists to the right — set low = mid + 1.",
      "Otherwise a peak exists at mid or to the left — set high = mid.",
      "Loop ends when low == high — that index is a peak.",
    ],
    cppSolution: `class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int lo = 0, hi = nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Binary search halves the search space each iteration.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only pointer variables used.",
    edgeCases: [
      "Single element array — trivially a peak (both 'neighbors' treated as -∞).",
      "Strictly increasing array — peak is the last element.",
      "Strictly decreasing array — peak is the first element.",
    ],
    memoryTrick: "\"Uphill slope (nums[mid] < nums[mid+1]) → peak is ahead, go right. Downhill or flat → peak is at mid or behind, go left (inclusive of mid).\"",
  },

  "capacity-ship-packages": {
    intuition:
      "'Minimize the maximum' problems are binary search on the ANSWER, not the input. Guess a capacity; check if it's feasible to ship everything within D days using a greedy simulation. If feasible, try a smaller capacity; if not, try bigger.",
    approach: [
      "Set search bounds: low = max(weights) (must fit the heaviest single package), high = sum(weights) (ship everything in one day).",
      "Binary search: for mid capacity, greedily simulate loading — add packages to the current day's load until adding one more would exceed mid, then start a new day.",
      "Count days needed for this capacity. If days <= D, this capacity works — try smaller (high = mid). Otherwise try bigger (low = mid + 1).",
      "Return low when the loop converges.",
    ],
    cppSolution: `class Solution {
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int lo = *max_element(weights.begin(), weights.end());
        int hi = accumulate(weights.begin(), weights.end(), 0);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int daysNeeded = 1, load = 0;
            for (int w : weights) {
                if (load + w > mid) { daysNeeded++; load = 0; }
                load += w;
            }
            if (daysNeeded <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    timeComplexity: "O(n log(sum - max))",
    timeExplanation: "Binary search over the capacity range, each check is an O(n) greedy simulation.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra storage beyond counters.",
    edgeCases: [
      "Single package — capacity must be at least that package's weight, days = 1.",
      "days == number of packages — capacity can be exactly the heaviest package (ship one per day).",
      "days = 1 — capacity must be the full sum.",
    ],
    memoryTrick: "\"Binary search the ANSWER when the question is 'minimize the max X such that Y constraint holds' — check feasibility with a greedy simulation, not the raw array.\"",
  },

  "split-array-largest-sum": {
    intuition:
      "Identical shape to Capacity to Ship Packages — 'split into m subarrays minimizing the largest subarray sum' is 'binary search on the answer + greedy feasibility check', just renamed. Guess a max-sum limit; count how many subarrays are needed to respect it.",
    approach: [
      "Binary search bounds: low = max(nums) (largest single element), high = sum(nums).",
      "For mid (candidate max sum), greedily partition: accumulate a running sum, start a new subarray whenever adding the next element would exceed mid.",
      "Count subarrays needed. If count <= m, mid is feasible — try smaller (high = mid). Else try bigger (low = mid + 1).",
    ],
    cppSolution: `class Solution {
public:
    int splitArray(vector<int>& nums, int m) {
        int lo = *max_element(nums.begin(), nums.end());
        int hi = accumulate(nums.begin(), nums.end(), 0);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int parts = 1, sum = 0;
            for (int x : nums) {
                if (sum + x > mid) { parts++; sum = 0; }
                sum += x;
            }
            if (parts <= m) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};`,
    timeComplexity: "O(n log(sum - max))",
    timeExplanation: "Binary search over possible sums, O(n) greedy check per guess.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only counters used during the greedy partition check.",
    edgeCases: [
      "m = 1 — answer is the full array sum (only one partition allowed).",
      "m >= array length — each element can be its own subarray, answer is max(nums).",
      "All elements equal — partitions split as evenly as possible.",
    ],
    memoryTrick: "\"Same greedy-feasibility binary search as Ship Packages — the pattern is 'minimize max partition sum', recognize it regardless of story dressing.\"",
  },

  "reverse-linked-list-ii": {
    intuition:
      "Reverse only the sublist between positions left and right. Walk to the node just before 'left' (call it 'prev'), then repeatedly move the node right after prev's reversed section to the front of that section — a technique called 'head insertion' — for exactly (right - left) iterations.",
    approach: [
      "Use a dummy node pointing to head to handle left = 1 cleanly.",
      "Advance a pointer 'prev' to the node just before position left.",
      "Let 'curr' = prev->next (the first node of the sublist to reverse).",
      "Repeat (right - left) times: take curr->next out, splice it in right after prev, i.e. move it to the front of the reversed section.",
      "curr itself ends up as the tail of the reversed section automatically.",
    ],
    cppSolution: `class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        ListNode dummy(0); dummy.next = head;
        ListNode* prev = &dummy;
        for (int i = 1; i < left; i++) prev = prev->next;
        ListNode* curr = prev->next;
        for (int i = 0; i < right - left; i++) {
            ListNode* toMove = curr->next;
            curr->next = toMove->next;
            toMove->next = prev->next;
            prev->next = toMove;
        }
        return dummy.next;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass to reach 'left', then O(right - left) splice operations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only pointer rewiring, no new nodes or recursion stack.",
    edgeCases: [
      "left == right — no reversal needed, list returned unchanged.",
      "left = 1 — dummy node handles reversing from the head cleanly, no special-casing.",
      "right = list length — reversal extends all the way to the tail.",
    ],
    memoryTrick: "\"Head-insertion reversal: repeatedly yank the node after curr and splice it right after prev. curr stays put as the new tail; prev->next keeps getting the newest reversed node.\"",
  },

  "zigzag-level-order": {
    intuition:
      "Standard BFS level-order traversal, but alternate the direction each level is read/stored: left-to-right, then right-to-left, then left-to-right again.",
    approach: [
      "BFS with a queue, processing one level at a time (track level size before dequeuing).",
      "For each level, collect values into a vector as usual.",
      "If the current level index is odd, reverse that level's vector before adding it to the result.",
      "Enqueue children as normal regardless of direction.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        while (!q.empty()) {
            int size = q.size();
            vector<int> level(size);
            for (int i = 0; i < size; i++) {
                TreeNode* node = q.front(); q.pop();
                int idx = leftToRight ? i : size - 1 - i;
                level[idx] = node->val;
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(level);
            leftToRight = !leftToRight;
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Every node visited exactly once during BFS.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Queue holds up to one level's worth of nodes; result stores all n values.",
    edgeCases: [
      "Empty tree — return empty result immediately.",
      "Single node — one level, direction doesn't matter, returns [[val]].",
      "Skewed tree (all left or all right children) — each level has exactly 1 node, zigzag has no visible effect but logic still works.",
    ],
    memoryTrick: "\"Zigzag = normal level-order BFS + placing each level's values at index (i or size-1-i) based on direction — no need to actually reverse, just index backwards on odd levels.\"",
  },

  "path-sum-ii": {
    intuition:
      "DFS from root to leaf, tracking the running path and remaining sum needed. At a leaf, if the remaining sum equals the leaf's value, the current path is a valid answer — record a COPY of it (backtracking will mutate the path afterward).",
    approach: [
      "DFS(node, remaining, path): add node->val to path.",
      "If node is a leaf and node->val == remaining, push a copy of path to results.",
      "Otherwise recurse into left and right children with remaining - node->val.",
      "After exploring both children, pop node->val from path (backtrack) before returning.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> result;
        vector<int> path;
        dfs(root, targetSum, path, result);
        return result;
    }
private:
    void dfs(TreeNode* node, long remaining, vector<int>& path, vector<vector<int>>& result) {
        if (!node) return;
        path.push_back(node->val);
        remaining -= node->val;
        if (!node->left && !node->right && remaining == 0) {
            result.push_back(path);
        } else {
            dfs(node->left, remaining, path, result);
            dfs(node->right, remaining, path, result);
        }
        path.pop_back(); // backtrack
    }
};`,
    timeComplexity: "O(n²) worst case",
    timeExplanation: "O(n) nodes visited; copying a path of length up to n at each leaf can cost O(n), giving O(n²) in a skewed tree.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion depth + path vector, both bounded by tree height/size.",
    edgeCases: [
      "Empty tree — return empty result.",
      "Negative values in the tree — remaining can go negative and later return to 0, so don't prune early on remaining < 0 unless certain all values are positive.",
      "Root itself is a leaf equal to target — single-node path recorded.",
    ],
    memoryTrick: "\"Push before recursing, check leaf condition, pop after — the pop is what makes this true backtracking instead of accumulating garbage across branches.\"",
  },

  "vertical-order-traversal": {
    intuition:
      "Assign each node a (column, row) coordinate: root is (0,0), left child is (col-1, row+1), right child is (col+1, row+1). Group nodes by column; within a column, order by row, and for same row+column, order by value.",
    approach: [
      "BFS or DFS while tracking (col, row, value) for every node.",
      "Group all nodes into a map keyed by column.",
      "Within each column's list, sort by (row, then value) — this correctly handles same-position ties.",
      "Output columns left to right (sorted by column key).",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        map<int, vector<pair<int,int>>> cols; // col -> (row, val)
        function<void(TreeNode*,int,int)> dfs = [&](TreeNode* node, int col, int row) {
            if (!node) return;
            cols[col].push_back({row, node->val});
            dfs(node->left, col - 1, row + 1);
            dfs(node->right, col + 1, row + 1);
        };
        dfs(root, 0, 0);
        vector<vector<int>> result;
        for (auto& [col, nodes] : cols) {
            sort(nodes.begin(), nodes.end());
            vector<int> colVals;
            for (auto& [row, val] : nodes) colVals.push_back(val);
            result.push_back(colVals);
        }
        return result;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "O(n) to visit all nodes; O(n log n) to sort within columns (map itself keeps columns ordered in O(log n) per insert).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Map stores all n nodes grouped by column.",
    edgeCases: [
      "Multiple nodes at the same (row, col) — sorting the pair (row, val) breaks ties by value, matching the problem's tie-break rule.",
      "Empty tree — return empty result.",
      "Skewed tree — columns can range widely; ordered map handles arbitrary negative/positive column keys correctly.",
    ],
    memoryTrick: "\"Coordinate the tree: left = col-1, right = col+1, down = row+1. Group by column, sort by (row, value) — that's the entire trick.\"",
  },

  "boundary-traversal-tree": {
    intuition:
      "The boundary = left edge (top to bottom, excluding leaves) + all leaves (left to right) + right edge (bottom to top, excluding leaves). Handle each piece with a separate simple traversal, then concatenate, being careful not to double-count nodes that are both edge and leaf.",
    approach: [
      "Add the root (if it's not itself a leaf).",
      "Traverse the left boundary top-down: keep going left if a left child exists, else go right, stopping before leaves.",
      "Traverse all leaves left to right via a simple DFS/inorder-ish scan (any node with no children).",
      "Traverse the right boundary bottom-up: keep going right if a right child exists, else left, then reverse the collected list before appending.",
    ],
    cppSolution: `class Solution {
public:
    bool isLeaf(TreeNode* n) { return !n->left && !n->right; }

    void addLeftBoundary(TreeNode* node, vector<int>& res) {
        TreeNode* curr = node->left ? node->left : node->right;
        while (curr) {
            if (!isLeaf(curr)) res.push_back(curr->val);
            curr = curr->left ? curr->left : curr->right;
        }
    }
    void addLeaves(TreeNode* node, vector<int>& res) {
        if (!node) return;
        if (isLeaf(node)) { res.push_back(node->val); return; }
        addLeaves(node->left, res);
        addLeaves(node->right, res);
    }
    void addRightBoundary(TreeNode* node, vector<int>& res) {
        TreeNode* curr = node->right ? node->right : node->left;
        vector<int> temp;
        while (curr) {
            if (!isLeaf(curr)) temp.push_back(curr->val);
            curr = curr->right ? curr->right : curr->left;
        }
        for (int i = temp.size() - 1; i >= 0; i--) res.push_back(temp[i]);
    }

    vector<int> boundaryTraversal(TreeNode* root) {
        vector<int> res;
        if (!root) return res;
        if (!isLeaf(root)) res.push_back(root->val);
        addLeftBoundary(root, res);
        addLeaves(root, res);
        addRightBoundary(root, res);
        return res;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each of the three passes visits at most all n nodes; leaves pass visits every node once.",
    spaceComplexity: "O(h)",
    spaceExplanation: "Recursion depth for the leaves pass; boundary walks use O(1) extra beyond the output.",
    edgeCases: [
      "Root is a leaf (single node) — only the root itself is the answer, avoid double-adding it.",
      "Tree with no left subtree — left boundary contributes nothing beyond root.",
      "Perfectly balanced tree — left/right boundary and leaves don't overlap, straightforward concatenation.",
    ],
    memoryTrick: "\"Boundary = root + left-spine (no leaves) + all-leaves + right-spine reversed (no leaves). Three simple walks, never a leaf counted twice.\"",
  },

  "single-number-ii": {
    intuition:
      "Every number appears exactly 3 times except one, which appears once. XOR cancels pairs, not triples — instead, track bit counts modulo 3. For each bit position, if the sum of that bit across all numbers isn't divisible by 3, the unique number has that bit set.",
    approach: [
      "Use two bitmasks: ones (bits seen exactly once so far, mod 3) and twos (bits seen exactly twice so far, mod 3).",
      "For each number n: update ones = (ones XOR n) AND (NOT twos); update twos = (twos XOR n) AND (NOT ones).",
      "This maintains a mod-3 counter per bit using only 2 bitmasks instead of an array of counts.",
      "After processing all numbers, 'ones' holds the unique number.",
    ],
    cppSolution: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ones = 0, twos = 0;
        for (int n : nums) {
            ones = (ones ^ n) & ~twos;
            twos = (twos ^ n) & ~ones;
        }
        return ones;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the array with O(1) bit operations per element.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two integer bitmasks used regardless of input size.",
    edgeCases: [
      "Array with exactly one element — that element is trivially the unique one.",
      "Negative numbers — two's-complement bit representation still works correctly with this mod-3 counting.",
      "Unique number is 0 — the bitmask logic still correctly isolates it as 0.",
    ],
    memoryTrick: "\"ones/twos state machine cycles bit-count 0→1→2→0 (mod 3) per bit, using AND-NOT to reset when hitting the 'twos' state — memorize the two update lines as a pair.\"",
  },

  "single-number-iii": {
    intuition:
      "Two numbers appear once, everyone else twice. XOR-ing everything cancels the pairs, leaving XOR of the two unique numbers. Since they're different, that XOR has at least one set bit — use ANY such bit to split all numbers into two groups (bit set / bit not set). Each unique number falls into a different group, and XOR-ing within each group isolates each one.",
    approach: [
      "XOR all numbers together to get xorAll = unique1 XOR unique2.",
      "Find any set bit in xorAll (commonly the lowest: diffBit = xorAll & (-xorAll)).",
      "Partition all numbers by whether they have that bit set; XOR each partition separately.",
      "The two partition XORs are exactly unique1 and unique2.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        int xorAll = 0;
        for (int n : nums) xorAll ^= n;
        int diffBit = xorAll & (-xorAll); // lowest set bit
        int a = 0, b = 0;
        for (int n : nums) {
            if (n & diffBit) a ^= n;
            else b ^= n;
        }
        return {a, b};
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear passes over the array (one to XOR all, one to partition and XOR each group).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only a few integer variables used.",
    edgeCases: [
      "Exactly two elements in the array — both are the unique numbers directly.",
      "Unique numbers differ only in the sign bit — diffBit correctly identifies any distinguishing bit, sign bit included.",
      "Order of returned pair — problem typically accepts either order, [a,b] or [b,a].",
    ],
    memoryTrick: "\"XOR all → get XOR of the two survivors. Their lowest differing bit partitions the array into 'has this bit' vs 'doesn't' — XOR each partition to isolate each survivor.\"",
  },

  "implement-queue-using-stacks": {
    intuition:
      "Two stacks simulate a queue: 'in-stack' receives pushes; 'out-stack' serves pops/peeks. When out-stack is empty and a pop/peek is requested, dump all of in-stack into out-stack — this reverses the order, turning stack (LIFO) behavior into queue (FIFO) behavior.",
    approach: [
      "push(x): always push onto inStack.",
      "pop()/peek(): if outStack is empty, pour all elements from inStack into outStack (reversing order). Then operate on outStack's top.",
      "This lazy-transfer means each element is moved from inStack to outStack at most once.",
    ],
    cppSolution: `class MyQueue {
    stack<int> inStack, outStack;
    void transfer() {
        if (outStack.empty()) {
            while (!inStack.empty()) {
                outStack.push(inStack.top());
                inStack.pop();
            }
        }
    }
public:
    void push(int x) { inStack.push(x); }
    int pop() {
        transfer();
        int val = outStack.top();
        outStack.pop();
        return val;
    }
    int peek() {
        transfer();
        return outStack.top();
    }
    bool empty() { return inStack.empty() && outStack.empty(); }
};`,
    timeComplexity: "O(1) amortized",
    timeExplanation: "Each element is pushed and popped from each stack at most once over its lifetime, so total work across n operations is O(n) — amortized O(1) per call.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Two stacks together hold at most n elements at any time.",
    edgeCases: [
      "pop/peek called when both stacks empty — undefined per problem constraints (assume valid calls only), but guard with empty() check in practice.",
      "Interleaved push/pop calls — transfer() only triggers when outStack is empty, preserving correct FIFO order across interleaving.",
      "Single element — push then pop returns it correctly via one transfer.",
    ],
    memoryTrick: "\"Two stacks, lazy transfer: only flip inStack into outStack when outStack runs dry. That single rule guarantees amortized O(1), not the transfer cost itself.\"",
  },

  "01-knapsack": {
    intuition:
      "Classic 0/1 knapsack: for each item, decide include or exclude to maximize value without exceeding weight capacity. dp[i][w] = best value using first i items with capacity w. Either skip item i (dp[i-1][w]) or take it (value[i] + dp[i-1][w-weight[i]], if it fits).",
    approach: [
      "Build dp[n+1][W+1], dp[0][*] = 0 (no items, no value regardless of capacity).",
      "For each item i (1-indexed) and each capacity w: dp[i][w] = dp[i-1][w] (skip).",
      "If weight[i-1] <= w: dp[i][w] = max(dp[i][w], value[i-1] + dp[i-1][w - weight[i-1]]) (take).",
      "Answer is dp[n][W]. Optimize to O(W) space by iterating w from high to low in a 1D array (prevents reusing an item twice).",
    ],
    cppSolution: `class Solution {
public:
    int knapsack(int W, vector<int>& weights, vector<int>& values, int n) {
        vector<int> dp(W + 1, 0);
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= weights[i]; w--) {
                dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        return dp[W];
    }
};`,
    timeComplexity: "O(n · W)",
    timeExplanation: "n items, each processed across up to W capacity values.",
    spaceComplexity: "O(W)",
    spaceExplanation: "1D DP array of size W+1 after space optimization (down from O(n·W) 2D table).",
    edgeCases: [
      "Capacity W = 0 — answer is 0, no item fits.",
      "All items weigh more than W — none can be taken, answer is 0.",
      "Single item that exactly fits W — take it, answer is its value.",
    ],
    memoryTrick: "\"0/1 knapsack: iterate capacity BACKWARDS (high to low) in the 1D optimization — that's what stops an item from being 'reused' within the same iteration, unlike unbounded knapsack which goes forward.\"",
  },

  "matrix-chain-multiplication": {
    intuition:
      "Matrix multiplication is associative but the number of scalar multiplications depends heavily on parenthesization. This is interval DP: dp[i][j] = minimum cost to multiply matrices i through j, trying every possible split point k and taking the best.",
    approach: [
      "Let dims[] be the dimension array (matrix i has dimensions dims[i-1] x dims[i]).",
      "dp[i][j] = min cost to multiply matrices i..j. Base case dp[i][i] = 0 (single matrix, no multiplication).",
      "For increasing chain length L from 2 to n: for each start i (end j = i+L-1), try every split k between i and j-1: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j]).",
      "Answer is dp[1][n-1] (using 1-indexed matrix positions).",
    ],
    cppSolution: `class Solution {
public:
    int matrixMultiplication(vector<int>& dims) {
        int n = dims.size() - 1; // number of matrices
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
        for (int len = 2; len <= n; len++) {
            for (int i = 1; i <= n - len + 1; i++) {
                int j = i + len - 1;
                dp[i][j] = INT_MAX;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
                    dp[i][j] = min(dp[i][j], cost);
                }
            }
        }
        return dp[1][n];
    }
};`,
    timeComplexity: "O(n³)",
    timeExplanation: "O(n²) (i,j) pairs, each trying O(n) split points k.",
    spaceComplexity: "O(n²)",
    spaceExplanation: "2D DP table sized (n+1) x (n+1) for the interval boundaries.",
    edgeCases: [
      "Only 1 matrix — no multiplication needed, cost is 0.",
      "2 matrices — only one possible order, cost is dims[0]*dims[1]*dims[2] directly.",
      "All matrices are square of the same size — cost still depends on order (grouping still matters), don't assume it's always the same.",
    ],
    memoryTrick: "\"Interval DP shape: iterate by LENGTH, not by start index — you need shorter subproblems (dp[i][k], dp[k+1][j]) fully solved before longer ones.\"",
  },

  "best-time-stock-iii": {
    intuition:
      "At most 2 transactions allowed. Track 4 states across the array: after 1st buy, after 1st sell, after 2nd buy, after 2nd sell — each state greedily maximized so far. Each state can only improve using the previous state's best value plus today's price.",
    approach: [
      "Initialize buy1 = -infinity, sell1 = 0, buy2 = -infinity, sell2 = 0.",
      "For each price: buy1 = max(buy1, -price); sell1 = max(sell1, buy1 + price); buy2 = max(buy2, sell1 - price); sell2 = max(sell2, buy2 + price).",
      "Order matters within one iteration — buy2 depends on this same day's sell1, meaning you can buy and sell on the same day for the second transaction (which is mathematically fine — it's equivalent to not doing that transaction).",
      "Answer is sell2 (0 or 1 transactions are subsumed since sell2 starts at 0 and only increases).",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        long buy1 = LONG_MIN, sell1 = 0, buy2 = LONG_MIN, sell2 = 0;
        for (int price : prices) {
            buy1 = max(buy1, -(long)price);
            sell1 = max(sell1, buy1 + price);
            buy2 = max(buy2, sell1 - price);
            sell2 = max(sell2, buy2 + price);
        }
        return (int)sell2;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass; 4 O(1) updates per price.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only 4 running variables tracked regardless of array size.",
    edgeCases: [
      "Prices strictly decreasing — no profitable transaction exists, all states stay at 0 or negative-buy, answer is 0.",
      "Fewer than 2 profitable opportunities — sell2 naturally equals sell1's best since 'not taking the 2nd transaction' is always an option (buy2 can mirror sell1).",
      "Empty or single-price array — answer is 0 (no transaction possible).",
    ],
    memoryTrick: "\"4 state variables in strict update order: buy1→sell1→buy2→sell2 — each builds on the immediately preceding state from the SAME iteration, letting profit chain through 2 transactions.\"",
  },

  "best-time-stock-iv": {
    intuition:
      "Generalizes 'Best Time III' from exactly 2 transactions to at most k. Maintain buy[] and sell[] arrays of size k, where buy[i] and sell[i] represent the best profit after completing the (i+1)-th buy/sell. Same recurrence, just looped k times instead of hardcoded twice.",
    approach: [
      "If k >= n/2, any number of transactions is effectively unlimited — solve as 'buy low sell high whenever profitable' (greedy, sum of all positive differences).",
      "Otherwise: initialize buy[0..k-1] = -infinity, sell[0..k-1] = 0.",
      "For each price: for j from 0 to k-1: buy[j] = max(buy[j], (j==0 ? 0 : sell[j-1]) - price); sell[j] = max(sell[j], buy[j] + price).",
      "Answer is sell[k-1].",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        int n = prices.size();
        if (n == 0) return 0;
        if (k >= n / 2) { // unlimited transactions case
            int profit = 0;
            for (int i = 1; i < n; i++)
                if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];
            return profit;
        }
        vector<long> buy(k, LONG_MIN), sell(k, 0);
        for (int price : prices) {
            for (int j = 0; j < k; j++) {
                long prevSell = (j == 0) ? 0 : sell[j - 1];
                buy[j] = max(buy[j], prevSell - price);
                sell[j] = max(sell[j], buy[j] + price);
            }
        }
        return (int)sell[k - 1];
    }
};`,
    timeComplexity: "O(n · k)",
    timeExplanation: "n prices, each updating k buy/sell state pairs.",
    spaceComplexity: "O(k)",
    spaceExplanation: "Two arrays of size k track the running best for each transaction count.",
    edgeCases: [
      "k = 0 — no transactions allowed, answer is 0.",
      "k very large (>= n/2) — must use the greedy unlimited-transaction shortcut, or the O(n·k) DP could be wasteful/incorrect if not capped.",
      "Empty prices array — answer is 0.",
    ],
    memoryTrick: "\"Best Time IV is Best Time III generalized to k slots — same buy/sell chaining, just looped, PLUS a greedy shortcut when k is large enough that the transaction limit stops mattering.\"",
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
