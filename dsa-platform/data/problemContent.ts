// Re-export the interface and generated content as base
export type { ProblemContent } from "./problemContent.generated";
import { PROBLEM_CONTENT as GENERATED_CONTENT } from "./problemContent.generated";
import { PYTHON_SOLUTIONS } from "./pythonSolutions";

// Rich overrides — merge generated base with high-quality entries below
const RICH_OVERRIDES: Record<string, import("./problemContent.generated").ProblemContent> = {
  "two-sum": {
    statement: "Given an array of integers nums and an integer target, find the indices of the two numbers in the array that add up to target. Assume each input has exactly one valid answer, and you may not use the same array element twice; return the two indices in any order.",
    examples: [{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]","explanation":"nums[0] + nums[1] = 2 + 7 = 9."},{"input":"nums = [3,2,4], target = 6","output":"[1,2]"},{"input":"nums = [3,3], target = 6","output":"[0,1]"}],
    constraints: ["2 <= nums.length <= 10^4","-10^9 <= nums[i] <= 10^9","-10^9 <= target <= 10^9","Exactly one valid answer exists"],
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
    lineByLine: [
      "`unordered_map<int, int> seen; // val -> index` — maps a value to its index for O(1) complement lookups.",
      "`for (int i = 0; i < (int)nums.size(); i++)` — walk the array once.",
      "`int complement = target - nums[i];` — value needed earlier in the array to hit target.",
      "`if (seen.count(complement)) return {seen[complement], i};` — complement already seen, so we found the pair.",
      "`seen[nums[i]] = i;` — otherwise record this value for a later element to find.",
      "`return {};` — unreachable, but required to satisfy the return type.",
    ],
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
    statement: "You are given an integer array nums. Determine whether any value appears more than once in the array, and return true if so; otherwise return false if every element is distinct.",
    examples: [{"input":"nums = [1,2,3,1]","output":"true","explanation":"The value 1 appears at indices 0 and 3."},{"input":"nums = [1,2,3,4]","output":"false","explanation":"All elements are distinct."},{"input":"nums = [1,1,1,3,3,4,3,2,4,2]","output":"true"}],
    constraints: ["1 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9"],
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
    lineByLine: [
      "`unordered_set<int> seen;` — remembers every value visited so far.",
      "`for (int x : nums)` — walk each element once.",
      "`if (seen.count(x)) return true;` — already recorded, so this is a duplicate.",
      "`seen.insert(x);` — otherwise record it for future comparison.",
      "`return false;` — no repeats found, all elements are distinct.",
    ],
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
    statement: "Given two strings s and t, determine whether t is an anagram of s, meaning t can be formed by rearranging all of the letters of s exactly once with no letters added or removed. Return true if t is an anagram of s, and false otherwise.",
    examples: [{"input":"s = \"anagram\", t = \"nagaram\"","output":"true"},{"input":"s = \"rat\", t = \"car\"","output":"false"}],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4","s and t consist of lowercase English letters"],
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
    lineByLine: [
      "`if (s.size() != t.size()) return false;` — anagrams must have equal length.",
      "`int count[26] = {};` — net character balance between s and t.",
      "`for (int i = 0; i < (int)s.size(); i++)` — walk both strings in lockstep.",
      "`count[s[i] - 'a']++; count[t[i] - 'a']--;` — add from s, remove from t.",
      "`for (int c : count) if (c != 0) return false;` — a nonzero counter means letter counts differ.",
      "`return true;` — every counter balanced to zero, so they're anagrams.",
    ],
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
    statement: "Given an array of strings strs, group the strings that are anagrams of each other into separate lists, and return the collection of these groups. Groups and the strings within each group may be returned in any order.",
    examples: [{"input":"strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]","output":"[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"},{"input":"strs = [\"\"]","output":"[[\"\"]]"},{"input":"strs = [\"a\"]","output":"[[\"a\"]]"}],
    constraints: ["1 <= strs.length <= 10^4","0 <= strs[i].length <= 100","strs[i] consists of lowercase English letters"],
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
    lineByLine: [
      "`unordered_map<string, vector<string>> groups;` — maps sorted-string key to strings sharing it.",
      "`for (const string& s : strs)` — process each input string once.",
      "`string key = s; sort(key.begin(), key.end());` — sorted characters form a fingerprint shared by all anagrams.",
      "`groups[key].push_back(s);` — file the original string under its fingerprint.",
      "`for (auto& [key, group] : groups) result.push_back(group);` — collect each bucket as one group.",
      "`return result;` — the final grouping of anagrams.",
    ],
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
    statement: "Given a string, find the length of the longest contiguous substring in which no character repeats.",
    examples: [{"input":"s = \"abcabcbb\"","output":"3","explanation":"The longest substring without repeating characters is \"abc\"."},{"input":"s = \"bbbbb\"","output":"1"},{"input":"s = \"pwwkew\"","output":"3","explanation":"The answer is \"wke\", with length 3."}],
    constraints: ["0 <= s.length <= 5 * 10^4","s consists of English letters, digits, symbols, and spaces"],
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
    lineByLine: [
      "`unordered_map<char, int> lastSeen;` — most recent index each character appeared at.",
      "`int result = 0, left = 0;` — best window length and start of current window.",
      "`for (int right = 0; right < (int)s.size(); right++)` — grow the window one character at a time.",
      "`char c = s[right];` — the character just added to the window.",
      "`if (lastSeen.count(c) && lastSeen[c] >= left) left = lastSeen[c] + 1;` — duplicate inside window, jump left past it.",
      "`lastSeen[c] = right;` — update c's last-seen index.",
      "`result = max(result, right - left + 1);` — window is duplicate-free, check if it's the longest yet.",
      "`return result;` — longest duplicate-free window found.",
    ],
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
    statement: "Given an array where each element is the price of a stock on that day, find the single best day to buy and a later day to sell in order to maximize profit. Return the maximum profit achievable, or 0 if no profit is possible.",
    examples: [{"input":"prices = [7,1,5,3,6,4]","output":"5","explanation":"Buy on day 2 at price 1 and sell on day 5 at price 6 for a profit of 5."},{"input":"prices = [7,6,4,3,1]","output":"0","explanation":"Prices only decrease, so no profitable transaction is possible."},{"input":"prices = [2,4,1]","output":"2"}],
    constraints: ["1 <= prices.length <= 10^5","0 <= prices[i] <= 10^4"],
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
    lineByLine: [
      "`int minPrice = INT_MAX, maxProfit = 0;` — cheapest buy price so far; 0 profit is always valid.",
      "`for (int price : prices)` — scan prices in chronological order.",
      "`minPrice = min(minPrice, price);` — a new low becomes the best day to have bought.",
      "`maxProfit = max(maxProfit, price - minPrice);` — profit from selling today at the lowest buy price so far.",
      "`return maxProfit;` — best buy-then-sell profit found, or 0 if prices only fell.",
    ],
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
    statement: "Given a string s consisting only of the bracket characters '(', ')', '{', '}', '[', and ']', determine whether every opening bracket is closed by the same type of bracket in the correct order. Return true if the string is valid, false otherwise.",
    examples: [{"input":"s = \"()[]{}\"","output":"true"},{"input":"s = \"(]\"","output":"false"},{"input":"s = \"([)]\"","output":"false","explanation":"The brackets close out of order, so it is invalid even though each type appears in matching pairs."}],
    constraints: ["1 <= s.length <= 10^4","s consists only of the characters '()[]{}'"],
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
    lineByLine: [
      "`stack<char> st;` — tracks the most recently opened, still-unclosed bracket.",
      "`unordered_map<char, char> match = {{')', '('}, {']', '['}, {'}', '{'}};` — maps each closer to its required opener.",
      "`if (c == '(' || c == '[' || c == '{') st.push(c);` — opening brackets go on the stack until closed.",
      "`if (st.empty() || st.top() != match[c]) return false;` — no opener left, or wrong type or order.",
      "`st.pop(); return st.empty();` — pop on a match, and require the stack empty at the end.",
    ],
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
    statement: "Given an array of integers sorted in ascending order and a target value, search for the target in the array using an algorithm that runs in logarithmic time. Return the index of the target if found, or -1 otherwise.",
    examples: [{"input":"nums = [-1,0,3,5,9,12], target = 9","output":"4","explanation":"9 exists in nums and its index is 4."},{"input":"nums = [-1,0,3,5,9,12], target = 2","output":"-1","explanation":"2 does not exist in nums so -1 is returned."}],
    constraints: ["1 <= nums.length <= 10^4","-10^4 < nums[i], target < 10^4","All the integers in nums are unique","nums is sorted in ascending order"],
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
    lineByLine: [
      "`int left = 0, right = (int)nums.size() - 1;` — window starts as the whole array.",
      "`while (left <= right)` — keep going until the window is empty.",
      "`int mid = left + (right - left) / 2;` — avoids overflow versus (left+right)/2.",
      "`if (nums[mid] == target) return mid;` — found it directly.",
      "`else if (nums[mid] < target) left = mid + 1;` — too small, target must be to the right.",
      "`else right = mid - 1;` — too large, target must be to the left.",
      "`return -1;` — window emptied without a match.",
    ],
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
    statement: "Given the head of a singly linked list, reverse the list and return the head of the reversed list.",
    examples: [{"input":"head = [1,2,3,4,5]","output":"[5,4,3,2,1]"},{"input":"head = [1,2]","output":"[2,1]"},{"input":"head = []","output":"[]"}],
    constraints: ["the number of nodes is in the range [0, 5000]","-5000 <= Node.val <= 5000"],
    intuition:
      "We need to make each node point backward. Keep track of previous node. For each current node, save its next, point it to prev, advance prev to current, advance current to saved next.",
    recognize: [
      "Problem says \"reverse\", \"reorder\", or asks you to change link direction.",
      "You're given the head of a singly linked list — no random access, no indices.",
      "O(1) extra space is expected — rules out just dumping into an array and rebuilding.",
      "→ These clues say: walk once, rewire pointers as you go.",
    ],
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
    lineByLine: [
      "`ListNode* prev = nullptr; ListNode* curr = head;` — prev trails curr, starting at null for the new tail.",
      "`while (curr)` — loop until curr falls off the end.",
      "`ListNode* next = curr->next;` — save it before overwriting curr's pointer.",
      "`curr->next = prev;` — flip the arrow backward.",
      "`prev = curr; curr = next;` — advance both pointers one step.",
      "`return prev;` — the old tail is now the new head.",
    ],
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
    statement: "You are climbing a staircase that requires n steps to reach the top, and on each move you may advance either 1 or 2 steps. Return the number of distinct sequences of moves that reach exactly the top.",
    examples: [{"input":"n = 2","output":"2","explanation":"The two ways are: 1 step + 1 step, or 2 steps."},{"input":"n = 3","output":"3","explanation":"The three ways are: 1+1+1, 1+2, and 2+1."},{"input":"n = 1","output":"1"}],
    constraints: ["1 <= n <= 45"],
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
    lineByLine: [
      "`if (n <= 2) return n;` — 1 or 2 steps have exactly n ways.",
      "`int prev2 = 1, prev1 = 2;` — seed ways(1) and ways(2) before the loop.",
      "`for (int i = 3; i <= n; i++)` — build each answer from the two before it.",
      "`int curr = prev1 + prev2;` — last move was a 1-step or a 2-step.",
      "`prev2 = prev1; prev1 = curr;` — slide the window forward one step.",
      "`return prev1;` — holds ways(n) using O(1) space.",
    ],
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
    statement: "You are a robber planning to rob houses arranged in a single row, where nums[i] is the amount of money stored in house i, but robbing two directly adjacent houses on the same night will trigger the alarm. Return the maximum total amount of money you can steal without robbing two adjacent houses.",
    examples: [{"input":"nums = [1,2,3,1]","output":"4","explanation":"Rob house 0 (1) and house 2 (3) for a total of 4."},{"input":"nums = [2,7,9,3,1]","output":"12","explanation":"Rob houses 0, 2, and 4 for 2 + 9 + 1 = 12."},{"input":"nums = [5]","output":"5"}],
    constraints: ["1 <= nums.length <= 100","0 <= nums[i] <= 400"],
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
    lineByLine: [
      "`int prev2 = 0, prev1 = 0;` — best total through i-2 and i-1, both start at 0.",
      "`for (int amount : nums)` — process houses left to right.",
      "`int curr = max(prev2 + amount, prev1);` — rob this house or skip it, take the max.",
      "`prev2 = prev1; prev1 = curr;` — shift the window forward one house.",
      "`return prev1;` — best achievable total over the whole row.",
    ],
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
    statement: "You are given a 2D grid of '1's (land) and '0's (water). An island is formed by land cells connected horizontally or vertically, and is surrounded by water. Return the total number of distinct islands in the grid.",
    examples: [{"input":"grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]","output":"3"},{"input":"grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]","output":"1"}],
    constraints: ["1 <= grid.length, grid[i].length <= 300","grid[i][j] is '0' or '1'"],
    intuition:
      "Grid has '1' (land) and '0' (water). An island is a group of connected '1's (4-directional). Walk the grid; when we find an unvisited '1', it's a new island — flood-fill (DFS/BFS) to mark all connected land as visited.",
    recognize: [
      "Input is a 2D grid with binary cell states ('1' land, '0' water) and connectivity is explicitly 4-directional — that grid + adjacency combo is the classic flood-fill setup.",
      "You need a COUNT of separate connected groups, not their sizes or any single group's shape.",
      "No weights, no order dependency — just \"is this cell reachable from that cell through land\", which is what DFS/BFS answers by marking visited cells.",
      "→ These clues say: scan every cell, and each time you hit an unvisited land cell, flood-fill (DFS or BFS) to mark its whole island, incrementing a counter once per flood-fill.",
    ],
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
    lineByLine: [
      "`int m = grid.size(), n = grid[0].size();` — cache dimensions for bounds checks.",
      "`if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') return;` — stop at grid edge or water/visited land.",
      "`grid[i][j] = '0'; // mark visited` — sink this cell so it's never counted again.",
      "`dfs(grid, i+1, j); dfs(grid, i-1, j); dfs(grid, i, j+1); dfs(grid, i, j-1);` — flood into all 4 neighbors.",
      "`int count = 0;` — tracks islands found so far.",
      "`for (int i ...) for (int j ...)` — scan every cell once as a potential island start.",
      "`if (grid[i][j] == '1') { count++; dfs(grid, i, j); }` — new land found: count it, then sink the whole island.",
      "`return count;` — every island was sunk exactly once, so count is the answer.",
    ],
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
    statement: "You are given an array coins representing distinct coin denominations, each available in unlimited supply, and an integer amount representing a target sum. Return the minimum number of coins needed to make up exactly that amount; if the amount cannot be made up by any combination of the coins, return -1.",
    examples: [{"input":"coins = [1,2,5], amount = 11","output":"3","explanation":"11 can be made with 5 + 5 + 1, which uses 3 coins."},{"input":"coins = [2], amount = 3","output":"-1","explanation":"It is impossible to make an odd amount using only coins of value 2."},{"input":"coins = [1], amount = 0","output":"0"}],
    constraints: ["1 <= coins.length <= 12","1 <= coins[i] <= 2^31 - 1","0 <= amount <= 10^4","all values in coins are unique"],
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
    lineByLine: [
      "`vector<int> dp(amount + 1, amount + 1);` — amount+1 acts as a safe 'impossible' sentinel.",
      "`dp[0] = 0;` — base case: zero coins make amount 0.",
      "`for (int i = 1; i <= amount; i++)` — build up every amount from smallest to largest.",
      "`for (int coin : coins)` — try each denomination as the last coin used.",
      "`if (coin <= i)` — skip coins bigger than the remaining amount.",
      "`dp[i] = min(dp[i], dp[i - coin] + 1);` — take this coin plus the best way to make the rest.",
      "`return dp[amount] > amount ? -1 : dp[amount];` — still at the sentinel means unreachable.",
    ],
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
    statement: "Given the root of a binary tree, produce its mirror image by swapping the left and right subtree of every node, and return the root of the transformed tree.",
    examples: [{"input":"root = [4,2,7,1,3,6,9]","output":"[4,7,2,9,6,3,1]"},{"input":"root = [2,1,3]","output":"[2,3,1]"},{"input":"root = []","output":"[]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 100]","-100 <= Node.val <= 100"],
    intuition:
      "Swap left and right children for every node. Recurse down. The key insight: after swapping children, recursively invert each subtree.",
    recognize: [
      "\"Mirror image\" / \"swap left and right\" applies to every node, not just the root — a hint the same operation must recurse down the whole tree.",
      "No ordering property (not a BST) — you just need structural swap, no comparisons.",
      "Return type is a tree, and the fix is local to each node (swap two pointers) — no value needs to bubble up from children.",
      "→ These clues say: DFS as a void-ish recursion that swaps left/right at each node, then recurses into both.",
    ],
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
    lineByLine: [
      "`if (!root) return nullptr;` — empty subtree has nothing to mirror.",
      "`swap(root->left, root->right);` — swap this node's two children.",
      "`invertTree(root->left); invertTree(root->right);` — recurse so the swap propagates down both subtrees.",
      "`return root;` — hand back the now-mirrored node.",
    ],
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
    statement: "Given an integer array, find a contiguous, non-empty subarray whose elements sum to the largest possible value. Return that maximum sum.",
    examples: [{"input":"nums = [-2,1,-3,4,-1,2,1,-5,4]","output":"6","explanation":"The subarray [4,-1,2,1] has the largest sum, 6."},{"input":"nums = [1]","output":"1"},{"input":"nums = [5,4,-1,7,8]","output":"23","explanation":"The entire array sums to 23, which is the maximum."}],
    constraints: ["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"],
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
    lineByLine: [
      "`int curr = nums[0], best = nums[0];` — curr tracks best sum ending here, best tracks the overall max.",
      "`for (int i = 1; i < (int)nums.size(); i++)` — extend the scan one element at a time.",
      "`curr = max(nums[i], curr + nums[i]);` — extend the running subarray, or restart fresh if it's dragging the sum down.",
      "`best = max(best, curr);` — update the global best since the max subarray could end anywhere.",
      "`return best;` — best now holds the maximum sum over all contiguous subarrays.",
    ],
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
    statement: "Given an array of integers where every element appears exactly twice except for a single element that appears only once, find and return that unique element. Your solution should run in linear time using constant extra space.",
    examples: [{"input":"nums = [2,2,1]","output":"1"},{"input":"nums = [4,1,2,1,2]","output":"4"}],
    constraints: ["1 <= nums.length <= 3 * 10^4","-3 * 10^4 <= nums[i] <= 3 * 10^4","Each element appears twice except for one which appears exactly once"],
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
    lineByLine: [
      "`int result = 0;` — start with the XOR identity element; XORing 0 with any value returns that value unchanged.",
      "`for (int x : nums) result ^= x;` — XOR every element into result. Since a ^ a = 0, every number that appears exactly twice cancels itself out over the course of the loop, regardless of order.",
      "`return result;` — after all pairs have cancelled, only the single unpaired number survives in result.",
    ],
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
    statement: "Given the head of a singly linked list, determine whether the list contains a cycle, i.e. whether some node can be reached again by repeatedly following the next pointer. Return true if a cycle exists, otherwise false.",
    examples: [{"input":"head = [3,2,0,-4], pos = 1","output":"true","explanation":"The tail connects to the node at index 1, forming a cycle."},{"input":"head = [1,2], pos = 0","output":"true"},{"input":"head = [1], pos = -1","output":"false","explanation":"pos = -1 means there is no cycle."}],
    constraints: ["the number of nodes is in the range [0, 10^4]","-10^5 <= Node.val <= 10^5","pos is -1 or a valid index representing where the tail connects to"],
    intuition:
      "Floyd's cycle detection: slow pointer moves 1 step, fast pointer moves 2 steps. If there's a cycle, fast will eventually lap slow and they'll meet. If no cycle, fast reaches null.",
    recognize: [
      "Asks only whether a cycle exists — a yes/no question, not where it starts or its length.",
      "Singly linked list with no size given upfront, so you can't just check if you've walked more than n nodes.",
      "Constant space is the natural expectation here (no set of visited nodes mentioned) — that pushes away from a hash-set-of-visited-nodes approach.",
      "→ These clues say: slow/fast pointers (Floyd's), since they detect a loop in O(1) space without tracking visited nodes.",
    ],
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
    lineByLine: [
      "`ListNode* slow = head; ListNode* fast = head;` — both start together, gap grows each step.",
      "`while (fast && fast->next)` — stop before dereferencing null.",
      "`slow = slow->next; fast = fast->next->next;` — hare closes the gap by one node per loop if a cycle exists.",
      "`if (slow == fast) return true;` — hare lapped tortoise, so a loop exists.",
      "`return false;` — fast hit the end, so the list terminates.",
    ],
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
    statement: "Design and implement a Trie (prefix tree) data structure that supports three operations: inserting a lowercase English word, checking whether an exact word has previously been inserted, and checking whether any inserted word begins with a given prefix. All operations should run efficiently regardless of how many words have been stored.",
    examples: [{"input":"insert(\"apple\"); search(\"apple\"); search(\"app\"); startsWith(\"app\"); insert(\"app\"); search(\"app\")","output":"true, false, true, true","explanation":"After inserting \"apple\", searching for the exact word \"app\" fails, but \"app\" is a valid prefix; once \"app\" is inserted, searching for it succeeds."}],
    constraints: ["1 <= word.length, prefix.length <= 2000","word and prefix consist only of lowercase English letters","At most 3 * 10^4 total calls will be made to insert, search, and startsWith"],
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
    lineByLine: [
      "`unordered_map<char, TrieNode*> children; bool isEnd = false;` — children map letters to nodes, isEnd marks a complete word.",
      "`Trie() : root(new TrieNode()) {}` — root represents the empty prefix.",
      "`for (char c : word) { ...create if missing... curr = curr->children[c]; }` — walk letter by letter, creating branches only when new.",
      "`curr->isEnd = true;` — mark the final node so search can tell a full word from just a prefix.",
      "`... return curr->isEnd;` — search walks the same path and requires isEnd true.",
      "`... return true;` (startsWith) — same walk but ignores isEnd since a prefix need not be a full word.",
    ],
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
    statement: "Given an array of distinct integers, return every possible subset of the array (the power set), without including any duplicate subset. The subsets may be returned in any order.",
    examples: [{"input":"nums = [1,2,3]","output":"[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"},{"input":"nums = [0]","output":"[[],[0]]"}],
    constraints: ["1 <= nums.length <= 10","-10 <= nums[i] <= 10","All the numbers in nums are unique"],
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
    lineByLine: [
      "`vector<vector<int>> result = {{}};` — start with just the empty subset.",
      "`for (int num : nums)` — process one number at a time, doubling the result set each step.",
      "`int n = result.size();` — snapshot the size before appending, so we only copy pre-existing subsets.",
      "`result.push_back(result[i]); result.back().push_back(num);` — copy each existing subset and add num to it.",
      "`return result;` — after all numbers, result holds every include/exclude combination.",
    ],
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
    statement: "You are given a 2D grid of 0s (water) and 1s (land), where land cells connected horizontally or vertically form an island. Return the area (number of cells) of the largest island in the grid, or 0 if there are no islands.",
    examples: [{"input":"grid = [[0,0,1,0,0],[0,0,1,1,1],[0,1,1,0,0],[0,1,0,0,0]]","output":"6"},{"input":"grid = [[0,0,0],[0,0,0]]","output":"0"}],
    constraints: ["1 <= grid.length, grid[i].length <= 50","grid[i][j] is 0 or 1"],
    intuition:
      "Same as number of islands, but instead of counting islands, compute the area of each (by counting cells during DFS). Track the maximum.",
    recognize: [
      "Same grid/adjacency setup as number-of-islands, but now you need a SIZE per island, not just a count — the DFS needs a return value instead of just a side effect.",
      "\"Largest island\" means comparing sums across all islands, so each flood-fill must report how many cells it touched.",
      "Marking visited cells (e.g., flipping 1 to 0) as you go still applies, since you can't double-count cells within the same island.",
      "→ These clues say: DFS that returns 1 + the sum of its neighbors' recursive results (island area), tracking a running max across all flood-fills.",
    ],
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
    lineByLine: [
      "`if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != 1) return 0;` — out of bounds or non-land contributes 0 area.",
      "`grid[i][j] = 0;` — sink this cell so it's never recounted.",
      "`return 1 + dfs(grid, i+1, j) + ...;` — this cell plus area reachable from each neighbor.",
      "`int maxArea = 0;` — running largest island seen.",
      "`for (int i ...) for (int j ...) maxArea = max(maxArea, dfs(grid, i, j));` — dfs each cell; visited/water returns 0, new island returns its size.",
      "`return maxArea;` — largest island area found across the grid.",
    ],
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
    statement: "Given two strings ransomNote and magazine, determine whether ransomNote can be constructed by using the letters from magazine, where each letter in magazine may be used at most once. Return true if it is possible, otherwise return false.",
    examples: [{"input":"ransomNote = \"a\", magazine = \"b\"","output":"false"},{"input":"ransomNote = \"aa\", magazine = \"ab\"","output":"false","explanation":"magazine only has one 'a', but ransomNote needs two."},{"input":"ransomNote = \"aa\", magazine = \"aab\"","output":"true"}],
    constraints: ["1 <= ransomNote.length, magazine.length <= 10^5","ransomNote and magazine consist of lowercase English letters"],
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
    lineByLine: [
      "`vector<int> cnt(26, 0);` — one counter per letter, magazine supply minus note spending.",
      "`for (char c : magazine) cnt[c - 'a']++;` — tally letters the magazine supplies.",
      "`for (char c : ransomNote) { cnt[c - 'a']--; ... }` — spend one letter from the magazine's supply.",
      "`if (cnt[c - 'a'] < 0) return false;` — negative means not enough of that letter.",
      "`return true;` — every letter the note needed was covered.",
    ],
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
    statement: "You are given an array of non-negative integers where each value represents the height of a vertical line drawn at that index on the x-axis. Choose two of these lines that, together with the x-axis, form a container, and return the maximum amount of water the container can hold. Note that the container cannot be tilted.",
    examples: [{"input":"height = [1,8,6,2,5,4,8,3,7]","output":"49","explanation":"Lines at index 1 (height 8) and index 8 (height 7) give width 7 and height min(8,7)=7, so area = 49, which is the maximum possible."},{"input":"height = [1,1]","output":"1"},{"input":"height = [4,3,2,1,4]","output":"16"}],
    constraints: ["2 <= height.length <= 10^5","0 <= height[i] <= 10^4"],
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
    lineByLine: [
      "`int l = 0, r = (int)height.size() - 1, best = 0;` — start at the widest container since width only shrinks.",
      "`while (l < r)` — shrink the window one wall at a time until it closes.",
      "`best = max(best, min(height[l], height[r]) * (r - l));` — water is capped by the shorter wall.",
      "`if (height[l] < height[r]) l++; else r--;` — move the shorter wall; it's the only one that can improve things.",
      "`return best;` — largest area seen across all pairs checked.",
    ],
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
    statement: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of every element of nums except nums[i]. You must solve it without using the division operator, and in O(n) time.",
    examples: [{"input":"nums = [1,2,3,4]","output":"[24,12,8,6]"},{"input":"nums = [-1,1,0,-3,3]","output":"[0,0,9,0,0]"}],
    constraints: ["2 <= nums.length <= 10^5","-30 <= nums[i] <= 30","The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer"],
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
    lineByLine: [
      "`vector<int> res(n, 1);` — output starts at 1 so multiplying does nothing yet.",
      "`int left = 1;` — running product of elements to the left of the current index.",
      "`for (int i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }` — stamp prefix product, then fold nums[i] in.",
      "`int right = 1;` — running product of elements to the right, built scanning backward.",
      "`for (int i = n - 1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }` — multiply in the suffix product.",
      "`return res;` — product of the array excluding nums[i], no division used.",
    ],
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
    statement: "Given an integer array nums, find all unique triplets of distinct indices [i, j, k] such that nums[i] + nums[j] + nums[k] equals zero, and return the list of value triplets with no duplicate triplets included. The triplets and their values may be returned in any order.",
    examples: [{"input":"nums = [-1,0,1,2,-1,-4]","output":"[[-1,-1,2],[-1,0,1]]"},{"input":"nums = [0,1,1]","output":"[]","explanation":"No triplet in the array sums to 0."},{"input":"nums = [0,0,0]","output":"[[0,0,0]]"}],
    constraints: ["3 <= nums.length <= 3000","-10^5 <= nums[i] <= 10^5"],
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
    lineByLine: [
      "`sort(nums.begin(), nums.end());` — enables the two-pointer squeeze and puts duplicates adjacent.",
      "`for (int i = 0; i < (int)nums.size() - 2; i++)` — fix each element in turn as the triplet's smallest value.",
      "`if (i > 0 && nums[i] == nums[i-1]) continue;` — already tried this value as the fixed element, skip it.",
      "`int l = i + 1, r = (int)nums.size() - 1;` — two-pointer squeeze over everything after i.",
      "`if (s == 0) { ...; while (l<r && nums[l]==nums[l+1]) l++; while (l<r && nums[r]==nums[r-1]) r--; l++; r--; }` — record the triplet, skip duplicate values at both pointers, then advance.",
      "`else if (s < 0) l++; else r--;` — sum too small grows left, too large shrinks right.",
      "`return res;` — every unique zero-sum triplet found.",
    ],
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
    statement: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, and an integer target, find two numbers in the array that add up to target. Return their indices (1-indexed) as an array of length two, using each element at most once; exactly one valid solution is guaranteed to exist, and you should aim to use only constant extra space.",
    examples: [{"input":"numbers = [2,7,11,15], target = 9","output":"[1,2]","explanation":"numbers[0] + numbers[1] = 2 + 7 = 9, so the 1-indexed answer is [1,2]."},{"input":"numbers = [2,3,4], target = 6","output":"[1,3]"},{"input":"numbers = [-1,0], target = -1","output":"[1,2]"}],
    constraints: ["2 <= numbers.length <= 3 * 10^4","-1000 <= numbers[i] <= 1000","numbers is sorted in non-decreasing order","-1000 <= target <= 1000","Exactly one valid answer exists"],
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
    lineByLine: [
      "`int l = 0, r = (int)numbers.size() - 1;` — sorted array, so start at both extremes.",
      "`if (s == target) return {l + 1, r + 1};` — found it, convert to 1-indexed.",
      "`else if (s < target) l++; else r--;` — too small grows left, too big shrinks right.",
      "`return {};` — unreachable, guaranteed a solution exists.",
    ],
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
    statement: "Given a string s, consider only alphanumeric characters and ignore case to determine whether it reads the same forwards and backwards. Return true if s is a palindrome under these rules, and false otherwise.",
    examples: [{"input":"s = \"A man, a plan, a canal: Panama\"","output":"true","explanation":"After removing non-alphanumeric characters and lowercasing, it becomes \"amanaplanacanalpanama\", which is a palindrome."},{"input":"s = \"race a car\"","output":"false"},{"input":"s = \" \"","output":"true","explanation":"After removing non-alphanumeric characters, the string is empty, which is trivially a palindrome."}],
    constraints: ["1 <= s.length <= 2 * 10^5","s consists only of printable ASCII characters"],
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
    lineByLine: [
      "`int l = 0, r = (int)s.size() - 1;` — pointers start at both ends.",
      "`while (l < r && !isalnum(s[l])) l++; while (l < r && !isalnum(s[r])) r--;` — skip punctuation and spaces on both sides.",
      "`if (tolower(s[l]) != tolower(s[r])) return false;` — compare case-insensitively, any mismatch fails.",
      "`l++; r--;` — matched, so move both pointers inward.",
      "`return true;` — every character matched its mirror position.",
    ],
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
    statement: "Given an unsorted array of integers nums, find the length of the longest run of consecutive integers that can be formed using elements from the array. The elements of the run do not need to appear in order within nums, and your algorithm should run in O(n) time.",
    examples: [{"input":"nums = [100,4,200,1,3,2]","output":"4","explanation":"The longest consecutive sequence is 1, 2, 3, 4."},{"input":"nums = [0,3,7,2,5,8,4,6,0,1]","output":"9","explanation":"The longest consecutive sequence is 0,1,2,3,4,5,6,7,8."}],
    constraints: ["0 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9"],
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
    lineByLine: [
      "`unordered_set<int> s(nums.begin(), nums.end());` — dedupe into a set for O(1) membership tests.",
      "`for (int n : s)` — consider every distinct value as a potential run start.",
      "`if (s.count(n - 1)) continue;` — n-1 exists, so n isn't the start of its run.",
      "`int streak = 1;` — n is the first element of its run.",
      "`while (s.count(n + streak)) streak++;` — extend the run while the next integer is present.",
      "`best = max(best, streak);` — track the longest run found so far.",
      "`return best;` — length of the longest consecutive run.",
    ],
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
    statement: "Given an integer array nums, move all zeros in the array to the end while preserving the relative order of the non-zero elements. This must be done in-place without making a copy of the array.",
    examples: [{"input":"nums = [0,1,0,3,12]","output":"[1,3,12,0,0]"},{"input":"nums = [0]","output":"[0]"}],
    constraints: ["1 <= nums.length <= 10^4","-2^31 <= nums[i] <= 2^31 - 1"],
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
    lineByLine: [
      "`int insert = 0;` — tracks the next slot where a non-zero value belongs.",
      "`if (nums[i] != 0) swap(nums[insert++], nums[i]);` — swap non-zero into place, preserving relative order.",
    ],
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
    statement: "Given a string of uppercase letters and an integer k, you may change at most k characters of the string to any other uppercase letter. Return the length of the longest substring that can be made to consist of a single repeating letter after performing at most k such changes.",
    examples: [{"input":"s = \"ABAB\", k = 2","output":"4","explanation":"Replace the two 'A's or the two 'B's to get a string like \"AAAA\" or \"BBBB\"."},{"input":"s = \"AABABBA\", k = 1","output":"4","explanation":"Replace one 'B' in \"AABA\" to get \"AAAA\", length 4."},{"input":"s = \"ABBB\", k = 2","output":"4"}],
    constraints: ["1 <= s.length <= 10^5","s consists of only uppercase English letters","0 <= k <= s.length"],
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
    lineByLine: [
      "`int cnt[26] = {}, maxCnt = 0, left = 0, ans = 0;` — cnt tracks letter frequencies in the window; maxCnt is the best 'most frequent letter' count seen.",
      "`for (int r = 0; r < (int)s.size(); r++)` — expand the window one character at a time.",
      "`maxCnt = max(maxCnt, ++cnt[s[r] - 'A']);` — count s[r] and track the largest block of one letter.",
      "`while ((r - left + 1) - maxCnt > k) cnt[s[left++] - 'A']--;` — too many replacements needed, shrink from the left.",
      "`ans = max(ans, r - left + 1);` — current window is achievable with at most k replacements.",
      "`return ans;` — the longest window achieved during the scan.",
    ],
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
    statement: "Given two strings s1 and s2, determine whether s2 contains a contiguous substring that is a permutation (any reordering) of s1.",
    examples: [{"input":"s1 = \"ab\", s2 = \"eidbaooo\"","output":"true","explanation":"\"ba\" is a substring of s2 and is a permutation of \"ab\"."},{"input":"s1 = \"ab\", s2 = \"eidboaoo\"","output":"false"},{"input":"s1 = \"adc\", s2 = \"dcda\"","output":"true"}],
    constraints: ["1 <= s1.length, s2.length <= 10^4","s1 and s2 consist of lowercase English letters only"],
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
    lineByLine: [
      "`if (s1.size() > s2.size()) return false;` — s2 can't hold a window as long as s1.",
      "`int need[26] = {}, have[26] = {};` — need is s1's frequency signature; have is the sliding window's.",
      "`for (char c : s1) need[c - 'a']++;` — build the target frequency profile once.",
      "`int k = s1.size();` — window size is fixed at s1's length.",
      "`for (int i = 0; i < (int)s2.size(); i++)` — slide the window across s2.",
      "`have[s2[i] - 'a']++;` — bring the new right-edge character into the count.",
      "`if (i >= k) have[s2[i - k] - 'a']--;` — evict the character that fell off the left edge.",
      "`if (memcmp(need, have, sizeof(need)) == 0) return true;` — matching profile means this window is a permutation of s1.",
      "`return false;` — no window ever matched.",
    ],
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
    statement: "Given two strings s and t, find the smallest contiguous substring of s that contains every character of t, including duplicates, in any order. Return an empty string if no such window exists.",
    examples: [{"input":"s = \"ADOBECODEBANC\", t = \"ABC\"","output":"\"BANC\"","explanation":"\"BANC\" is the smallest substring of s containing 'A', 'B', and 'C'."},{"input":"s = \"a\", t = \"a\"","output":"\"a\""},{"input":"s = \"a\", t = \"aa\"","output":"\"\"","explanation":"s only has one 'a', so it cannot contain two copies required by t."}],
    constraints: ["1 <= s.length, t.length <= 10^5","s and t consist of uppercase and lowercase English letters","It is guaranteed a valid answer, if one exists, is unique"],
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
    lineByLine: [
      "`unordered_map<char,int> need, have;` — need is t's required frequency; have is the window's running count.",
      "`for (char c : t) need[c]++;` — build t's requirement up front.",
      "`int formed = 0, req = need.size(), l = 0, best = INT_MAX, bl = 0;` — formed is how many distinct chars currently meet their required count.",
      "`for (int r = 0; r < (int)s.size(); r++)` — grow the window from the right.",
      "`have[s[r]]++; if (need.count(s[r]) && have[s[r]] == need[s[r]]) formed++;` — count s[r], and mark one more requirement satisfied if it just hit target.",
      "`while (formed == req)` — window is valid, so try shrinking it to find the smallest one.",
      "`if (r - l + 1 < best) { best = r - l + 1; bl = l; }` — record the smallest valid window seen.",
      "`if (need.count(s[l]) && --have[s[l]] < need[s[l]]) formed--;` — removing s[l] would break a requirement, so the window becomes invalid.",
      "`have[s[l++]]--; ...` — evict s[l] from the window and advance l.",
      "`return best == INT_MAX ? \"\" : s.substr(bl, best);` — empty string if no valid window found, else the smallest one.",
    ],
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
    statement: "Given an integer array nums and a window size k, a window of size k slides from the very left of the array to the very right, moving one position at a time. For each position of the window, return the maximum value contained inside it, producing an output array of these maximums.",
    examples: [{"input":"nums = [1,3,-1,-3,5,3,6,7], k = 3","output":"[3,3,5,5,6,7]"},{"input":"nums = [1], k = 1","output":"[1]"},{"input":"nums = [9,11], k = 2","output":"[11]"}],
    constraints: ["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","1 <= k <= nums.length"],
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
    lineByLine: [
      "`deque<int> dq;` — stores indices in decreasing value order; front is always the window's max.",
      "`for (int i = 0; i < (int)nums.size(); i++)` — advance the right edge one element at a time.",
      "`if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();` — front index fell out of the window, remove it.",
      "`while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();` — smaller trailing values can never be the max again, discard them.",
      "`dq.push_back(i);` — add the current index; it survives since smaller ones were evicted.",
      "`if (i >= k - 1) res.push_back(nums[dq.front()]);` — window is full size k, record its max.",
      "`return res;` — the max of every window position.",
    ],
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
    statement: "There are cards arranged in a row, each with a point value. In each of k moves you may take exactly one card from either the beginning or the end of the remaining row. Return the maximum total number of points you can collect after making exactly k moves.",
    examples: [{"input":"cardPoints = [1,2,3,4,5,6,1], k = 3","output":"12","explanation":"Taking the three rightmost cards (6, 1) plus one more from an optimal end selection sums to 12; concretely taking [4,5,6] or the equivalent rightmost run gives the max total of 12."},{"input":"cardPoints = [2,2,2], k = 2","output":"4"},{"input":"cardPoints = [9,7,7,9,7,7,9], k = 7","output":"55","explanation":"k equals the total number of cards, so all cards must be taken."}],
    constraints: ["1 <= cardPoints.length <= 10^5","1 <= cardPoints[i] <= 10^4","1 <= k <= cardPoints.length"],
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
    lineByLine: [
      "`int n = cardPoints.size(), windowSize = n - k;` — reframe as minimizing the (n-k)-card leftover in the middle.",
      "`for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];` — sum of the initial leftover window (first n-k cards).",
      "`int minWindow = windowSum;` — track the minimum-sum leftover window found.",
      "`for (int i = windowSize; i < n; i++) { windowSum += cardPoints[i] - cardPoints[i - windowSize]; minWindow = min(minWindow, windowSum); }` — slide the window, tracking the smallest sum.",
      "`int total = 0; for (int x : cardPoints) total += x;` — total value of all cards.",
      "`return total - minWindow;` — total minus the smallest leftover equals the max taken from the ends.",
    ],
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
    statement: "Design an algorithm to encode a list of strings into a single string, and a corresponding decode function that reconstructs the original list of strings from the encoded string. Your encoding scheme must handle strings that contain any characters, including delimiters you might otherwise use, so that decode(encode(strs)) always equals strs.",
    examples: [{"input":"strs = [\"lint\",\"code\",\"love\",\"you\"]","output":"[\"lint\",\"code\",\"love\",\"you\"]","explanation":"encode(strs) produces some single string, and decoding that string returns the original list unchanged."},{"input":"strs = [\"we\",\"say\",\":\",\"yes\"]","output":"[\"we\",\"say\",\":\",\"yes\"]"}],
    constraints: ["1 <= strs.length <= 200","0 <= strs[i].length <= 200","strs[i] can contain any possible character out of 256 valid ASCII characters"],
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
    lineByLine: [
      "`string encode(vector<string>& strs)` — pack the whole list into one unambiguous string.",
      "`for (auto& s : strs) res += to_string(s.size()) + '#' + s;` — prefix each string with its length so embedded '#' can't be mistaken for the delimiter.",
      "`vector<string> decode(string s)` — reverse the process, reading one length-prefixed chunk at a time.",
      "`int j = i; while (s[j] != '#') j++;` — find the '#' ending the length prefix.",
      "`int len = stoi(s.substr(i, j - i));` — parse the digits as the next string's length.",
      "`res.push_back(s.substr(j + 1, len));` — extract exactly `len` characters after the '#'.",
      "`i = j + 1 + len;` — advance to the start of the next length prefix.",
      "`return res;` — the reconstructed list, identical to what was encoded.",
    ],
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
    statement: "Given a 9x9 Sudoku board partially filled with digits and empty cells marked '.', determine whether the currently filled cells satisfy Sudoku rules: each row, each column, and each of the nine 3x3 sub-boxes must not contain the same digit 1-9 more than once. You only need to validate the filled cells according to these rules, not check whether the board is solvable.",
    examples: [{"input":"board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]","output":"true"},{"input":"board = [[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]","output":"false","explanation":"The top-left 3x3 box now contains the digit 8 twice (row 0 and row 3, column 0)."}],
    constraints: ["board.length == 9","board[i].length == 9","board[i][j] is a digit '1'-'9' or '.'"],
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
    lineByLine: [
      "`unordered_set<char> rows[9], cols[9], boxes[9];` — one 'seen digits' set per row, column, and 3x3 box.",
      "`for (int i = 0; i < 9; i++) for (int j = 0; j < 9; j++)` — visit every cell once.",
      "`char c = board[i][j]; if (c == '.') continue;` — empty cells impose no constraint.",
      "`int box = (i / 3) * 3 + j / 3;` — maps (row, col) to one of the nine boxes, indexed 0-8.",
      "`if (rows[i].count(c) || cols[j].count(c) || boxes[box].count(c)) return false;` — digit already placed in this row, column, or box.",
      "`rows[i].insert(c); cols[j].insert(c); boxes[box].insert(c);` — mark the digit seen in all three groups.",
      "`return true;` — every filled cell passed all three checks.",
    ],
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
    statement: "You are given an n x n 2D matrix representing an image. Rotate the matrix by 90 degrees clockwise, modifying it directly without allocating another matrix.",
    examples: [{"input":"matrix = [[1,2,3],[4,5,6],[7,8,9]]","output":"[[7,4,1],[8,5,2],[9,6,3]]"},{"input":"matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]","output":"[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]"}],
    constraints: ["n == matrix.length == matrix[i].length","1 <= n <= 20","-1000 <= matrix[i][j] <= 1000","You must rotate the matrix in place, using O(1) extra space"],
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
    lineByLine: [
      "`for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);` — transpose across the main diagonal.",
      "`for (auto& row : matrix) reverse(row.begin(), row.end());` — reverse every row; transpose plus row-reverse equals a 90-degree clockwise rotation.",
    ],
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
    statement: "Given an m x n matrix, return all of its elements ordered as if you were traversing the matrix in a clockwise spiral, starting from the top-left corner and working inward.",
    examples: [{"input":"matrix = [[1,2,3],[4,5,6],[7,8,9]]","output":"[1,2,3,6,9,8,7,4,5]"},{"input":"matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]","output":"[1,2,3,4,8,12,11,10,9,5,6,7]"}],
    constraints: ["m == matrix.length","n == matrix[i].length","1 <= m, n <= 10","-100 <= matrix[i][j] <= 100"],
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
    lineByLine: [
      "`int top = 0, bot = matrix.size()-1, l = 0, r = matrix[0].size()-1;` — four boundaries marking the unvisited rectangle.",
      "`while (top <= bot && l <= r)` — keep spiraling while an unvisited rectangle remains.",
      "`for (int i = l; i <= r; i++) res.push_back(matrix[top][i]); top++;` — sweep the top row, then retire it.",
      "`for (int i = top; i <= bot; i++) res.push_back(matrix[i][r]); r--;` — sweep the right column, then retire it.",
      "`if (top <= bot) { for (int i = r; i >= l; i--) res.push_back(matrix[bot][i]); bot--; }` — sweep the bottom row, guarded against a single row already consumed.",
      "`if (l <= r) { for (int i = bot; i >= top; i--) res.push_back(matrix[i][l]); l++; }` — sweep the left column, guarded against a single column.",
      "`return res;` — all elements in clockwise spiral order.",
    ],
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
    statement: "Given an m x n matrix, if an element is 0, set its entire row and its entire column to 0. Perform the transformation directly on the input matrix.",
    examples: [{"input":"matrix = [[1,1,1],[1,0,1],[1,1,1]]","output":"[[1,0,1],[0,0,0],[1,0,1]]"},{"input":"matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]","output":"[[0,0,0,0],[0,4,5,0],[0,3,1,0]]"}],
    constraints: ["m == matrix.length","n == matrix[0].length","1 <= m, n <= 200","-2^31 <= matrix[i][j] <= 2^31 - 1","Try to solve it using O(1) additional space"],
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
    lineByLine: [
      "`bool firstRow = false, firstCol = false;` — row 0 and col 0 become marker storage, so save their original zero-state first.",
      "`for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;` (and the firstCol loop) — record zero-state before overwriting.",
      "`for (int i = 1; ...) for (int j = 1; ...) if (matrix[i][j] == 0) { matrix[i][0] = matrix[0][j] = 0; }` — use row 0/col 0 as flags for zero cells in the interior.",
      "`for (int i = 1; ...) for (int j = 1; ...) if (!matrix[i][0] || !matrix[0][j]) matrix[i][j] = 0;` — read the markers and zero out flagged cells, only after all markers are set.",
      "`if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;` — apply row 0's saved state last.",
      "`if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;` — apply col 0's saved state last.",
    ],
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
    statement: "Given two strings s and t, determine whether s is a subsequence of t, meaning s can be obtained from t by deleting some (possibly zero) characters without changing the relative order of the remaining characters. Return true if s is a subsequence of t, otherwise false.",
    examples: [{"input":"s = \"abc\", t = \"ahbgdc\"","output":"true"},{"input":"s = \"axc\", t = \"ahbgdc\"","output":"false"}],
    constraints: ["0 <= s.length <= 100","0 <= t.length <= 10^4","s and t consist only of lowercase English letters"],
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
    lineByLine: [
      "`int i = 0, j = 0;` — i tracks matched progress through s, j scans t.",
      "`if (s[i] == t[j]) i++;` — match found, advance s to look for its next character.",
      "`j++;` — always advance j; unmatched characters of t are just skipped.",
      "`return i == (int)s.size();` — s fully matched means it's a valid subsequence.",
    ],
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
    statement: "Evaluate an arithmetic expression given as an array of tokens written in Reverse Polish (postfix) Notation, where tokens are integers or the operators +, -, *, /. Return the integer result of the expression, using integer division that truncates toward zero.",
    examples: [{"input":"tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]","output":"9","explanation":"(2 + 1) * 3 = 9."},{"input":"tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]","output":"6","explanation":"13 / 5 truncates to 2, then 4 + 2 = 6."},{"input":"tokens = [\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]","output":"22"}],
    constraints: ["1 <= tokens.length <= 10^4","Each token is either an operator ('+', '-', '*', '/') or an integer in the range [-200, 200]","The expression is always a valid RPN expression","Division between two integers always truncates toward zero, and the answer fits in a 32-bit integer"],
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
    lineByLine: [
      "`stack<long long> st;` — holds pending operands; long long avoids overflow.",
      "`long long b = st.top(); st.pop(); long long a = st.top(); st.pop();` — b is the second operand, a is the first; order matters for - and /.",
      "`if (t == \"+\") st.push(a + b); ... else st.push(a / b);` — apply the op, push the result as a new operand.",
      "`else st.push(stoll(t));` — a plain number is pushed as a new operand.",
      "`return st.top();` — valid RPN always reduces to one final value.",
    ],
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
    statement: "Design a stack that supports push, pop, top, and retrieving the minimum element, all in constant time. Implement the MinStack class with these operations.",
    examples: [{"input":"[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]","output":"[null,null,null,null,-3,null,0,-2]","explanation":"After pushing -2, 0, -3, getMin returns -3. After popping -3, top is 0 and getMin is now -2."}],
    constraints: ["-2^31 <= val <= 2^31 - 1","Methods pop, top, and getMin will always be called on a non-empty stack","At most 3 * 10^4 calls will be made to push, pop, top, and getMin"],
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
    lineByLine: [
      "`stack<int> st, minSt;` — st holds values, minSt holds the running min at each level.",
      "`minSt.push(minSt.empty() ? val : min(val, minSt.top()));` — cache the min including this value, so no recompute later.",
      "`void pop() { st.pop(); minSt.pop(); }` — pop both together so minSt stays in sync with st.",
      "`int getMin() { return minSt.top(); }` — O(1) since the min was cached at push time.",
    ],
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
    statement: "Given an array of daily temperatures, return an array where each position holds the number of days you would have to wait after that day to reach a strictly warmer temperature. If there is no future day with a warmer temperature, put 0 in that position.",
    examples: [{"input":"temperatures = [73,74,75,71,69,72,76,73]","output":"[1,1,4,2,1,1,0,0]"},{"input":"temperatures = [30,40,50,60]","output":"[1,1,1,0]"},{"input":"temperatures = [30,60,90]","output":"[1,1,0]"}],
    constraints: ["1 <= temperatures.length <= 10^5","30 <= temperatures[i] <= 100"],
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
    lineByLine: [
      "`vector<int> ans(n, 0);` — 0 is already correct for a day that never finds a warmer one.",
      "`stack<int> st;` — holds indices of days still waiting, temperatures non-increasing bottom to top.",
      "`while (!st.empty() && temperatures[st.top()] < temperatures[i])` — today is warmer, so the waiting day found its answer.",
      "`int j = st.top(); st.pop(); ans[j] = i - j;` — days waited is the gap between the two indices.",
      "`st.push(i);` — today waits on the stack for its own future warmer day.",
      "`return ans;` — each day resolved once, amortized O(1) per element.",
    ],
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
    statement: "Given an encoded string containing digits, letters, and square brackets in the pattern k[encoded_string] (meaning the enclosed string is repeated k times), decode it fully and return the resulting string. Encodings may be nested.",
    examples: [{"input":"s = \"3[a]2[bc]\"","output":"\"aaabcbc\""},{"input":"s = \"3[a2[c]]\"","output":"\"accaccacc\"","explanation":"2[c] expands to \"cc\", then 3[a\"cc\"] expands to \"acc\" repeated 3 times."},{"input":"s = \"2[abc]3[cd]ef\"","output":"\"abcabccdcdcdef\""}],
    constraints: ["1 <= s.length <= 30","s consists of lowercase English letters, digits, and square brackets '[]'","s is guaranteed to be a valid encoding","All integers in s are between 1 and 300"],
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
    lineByLine: [
      "`stack<pair<string,int>> st; string curr; int k = 0;` — curr builds the current level; the stack remembers outer context.",
      "`if (isdigit(c)) k = k * 10 + (c - '0');` — accumulate multi-digit repeat counts.",
      "`else if (c == '[') { st.push({curr, k}); curr = \"\"; k = 0; }` — save the outer string and count, start fresh inside.",
      "`else if (c == ']') { ...; curr = prev + rep; }` — repeat the inner string cnt times and glue onto the outer string.",
      "`else curr += c;` — an ordinary letter is appended at the current level.",
      "`return curr;` — all brackets resolved, curr holds the decoded result.",
    ],
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
    statement: "Given an integer n representing the number of pairs of parentheses, generate all combinations of well-formed (properly matched and nested) parentheses that can be made using exactly n pairs. Return them as an array of strings in any order.",
    examples: [{"input":"n = 3","output":"[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"},{"input":"n = 1","output":"[\"()\"]"}],
    constraints: ["1 <= n <= 8"],
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
    lineByLine: [
      "`function<void(string,int,int)> bt = [&](string s, int open, int close) {` — backtracking closure tracking how many of each bracket placed.",
      "`if ((int)s.size() == 2 * n) { res.push_back(s); return; }` — full length reached means a well-formed sequence.",
      "`if (open < n) bt(s + \"(\", open + 1, close);` — add '(' if we haven't used all n yet.",
      "`if (close < open) bt(s + \")\", open, close + 1);` — add ')' only if there's an unmatched '(' to close.",
      "`return res;` — every generated path obeyed both rules, so no invalid ones ever appear.",
    ],
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
    statement: "Cars are positioned along a one-lane road, each with a starting position and speed, all heading toward the same target position. A faster car that catches up to a slower one merges into its fleet and thereafter travels at the slower car's speed. Given position, speed, and target, return the number of distinct fleets that will eventually arrive at the target.",
    examples: [{"input":"target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]","output":"3","explanation":"The cars at positions 10 and 8 form one fleet, the car at 0 forms its own fleet, and the cars at 5 and 3 form another fleet, giving 3 fleets total."},{"input":"target = 10, position = [3], speed = [3]","output":"1"}],
    constraints: ["1 <= target <= 10^6","0 <= n == position.length == speed.length <= 10^5","0 <= position[i] < target","All values in position are unique","0 < speed[i] <= 10^6"],
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
    lineByLine: [
      "`sort(cars.rbegin(), cars.rend());` — process the car closest to the target first, since a fleet's leader must be known first.",
      "`stack<double> st;` — holds arrival time of each known distinct fleet.",
      "`double t = (double)(target - p) / s;` — time for this car to reach target unblocked.",
      "`if (st.empty() || t > st.top())` — arrives strictly later than the fleet ahead, so it can never catch up.",
      "`st.push(t);` — forms a new fleet (otherwise it merges into the fleet ahead and isn't pushed).",
      "`return st.size();` — one entry per distinct fleet that never merged.",
    ],
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
    statement: "Given an array of integers representing asteroids in a row, where the absolute value indicates size and the sign indicates direction (positive moves right, negative moves left), simulate collisions: when two asteroids meet, the smaller one explodes, and equal-sized asteroids both explode. Return the state of the asteroids after all collisions are resolved.",
    examples: [{"input":"asteroids = [5,10,-5]","output":"[5,10]","explanation":"The 10 and -5 collide, and since 10 is larger, -5 explodes, leaving 5 and 10 which never collide."},{"input":"asteroids = [8,-8]","output":"[]","explanation":"The two asteroids are equal in size, so both explode."},{"input":"asteroids = [10,2,-5]","output":"[10]","explanation":"2 and -5 collide and -5 wins, becoming -5, which then collides with 10 and explodes."}],
    constraints: ["2 <= asteroids.length <= 10^4","-1000 <= asteroids[i] <= 1000","asteroids[i] != 0"],
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
    lineByLine: [
      "`stack<int> st;` — holds asteroids moving right or at rest; only these can collide with a left-mover.",
      "`while (alive && a < 0 && !st.empty() && st.top() > 0)` — collision only when incoming moves left into a right-mover.",
      "`if (st.top() < -a) st.pop();` — smaller asteroid on the stack explodes, keep checking below it.",
      "`else if (st.top() == -a) { st.pop(); alive = false; }` — equal sizes destroy each other.",
      "`else alive = false;` — stack's asteroid is bigger, the incoming one explodes.",
      "`if (alive) st.push(a);` — push only if it survived every collision.",
      "`... reverse(res.begin(), res.end());` — stack order is reversed, so flip it back to left-to-right.",
    ],
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
    statement: "You are given two non-empty linked lists representing two non-negative integers, where each node holds a single digit and the digits are stored in reverse order (the ones digit first). Add the two numbers together and return the sum as a new linked list, also in reverse-digit order.",
    examples: [{"input":"l1 = [2,4,3], l2 = [5,6,4]","output":"[7,0,8]","explanation":"342 + 465 = 807, represented in reverse order as [7,0,8]."},{"input":"l1 = [0], l2 = [0]","output":"[0]"},{"input":"l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]","output":"[8,9,9,9,0,0,0,1]","explanation":"9999999 + 9999 = 10009998, whose reverse-digit representation is [8,9,9,9,0,0,0,1]."}],
    constraints: ["the number of nodes in each list is in the range [1, 100]","0 <= Node.val <= 9","the numbers do not have leading zeros, except the number 0 itself"],
    intuition: "Simulate column-by-column addition with carry. Walk both lists simultaneously. Sum = l1->val + l2->val + carry. New digit = sum % 10. New carry = sum / 10. Continue until both lists exhausted AND carry is 0.",
    recognize: [
      "Numbers are stored as linked lists with digits in reverse order — that's exactly how you'd add on paper, ones digit first.",
      "Lists can be different lengths and a final carry can create an extra node (9999999 + 9999 needs 8 digits).",
      "No mention of converting to integers first — and for huge lists that would overflow anyway.",
      "→ These clues say: simulate grade-school addition digit-by-digit with a carry variable.",
    ],
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
    lineByLine: [
      "`ListNode dummy(0); ListNode* cur = &dummy;` — dummy head avoids a special case for the first result node.",
      "`int carry = 0;` — the overflow digit, like carrying a 1 in grade-school addition.",
      "`while (l1 || l2 || carry)` — keep going while either list has digits or a carry remains.",
      "`if (l1) { sum += l1->val; l1 = l1->next; }` / `if (l2) { ... }` — add this digit if present, else treat it as 0.",
      "`carry = sum / 10;` — anything at or above 10 spills into the next column.",
      "`cur->next = new ListNode(sum % 10); cur = cur->next;` — append the ones digit and advance the tail.",
      "`return dummy.next;` — skip past the dummy to return the real head.",
    ],
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
    statement: "You are given the heads of two singly linked lists, list1 and list2, each already sorted in non-decreasing order. Merge the two lists into a single sorted linked list by splicing together their nodes, and return the head of the merged list.",
    examples: [{"input":"list1 = [1,2,4], list2 = [1,3,4]","output":"[1,1,2,3,4,4]"},{"input":"list1 = [], list2 = []","output":"[]"},{"input":"list1 = [], list2 = [0]","output":"[0]"}],
    constraints: ["the number of nodes in each list is in the range [0, 50]","-100 <= Node.val <= 100","both list1 and list2 are sorted in non-decreasing order"],
    intuition: "Two pointers, one per list. Compare front nodes, attach smaller to result, advance that pointer. Attach remaining list after loop.",
    recognize: [
      "Both inputs are already sorted linked lists — sorted input is the tell for a merge-style two-pointer walk.",
      "You need to splice existing nodes into one list, not just report a merged sequence.",
      "Expected O(1) extra space beyond the output rules out copying into an array, sorting, and rebuilding.",
      "→ These clues say: two pointers, always attach the smaller front node, walk both lists once.",
    ],
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
    lineByLine: [
      "`ListNode dummy(0); ListNode* cur = &dummy;` — dummy node avoids special-casing the first merged node.",
      "`while (l1 && l2)` — compare only while both lists still have candidates.",
      "`if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }` — splice in the smaller front node, reusing it in place.",
      "`else { cur->next = l2; l2 = l2->next; }` — symmetric case for list2.",
      "`cur->next = l1 ? l1 : l2;` — the remaining list is already sorted, attach it as-is.",
      "`return dummy.next;` — return the real head, skipping the dummy.",
    ],
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
    statement: "Given the head of a singly linked list, remove the n-th node counted from the end of the list and return the head of the resulting list. Aim to do it in a single pass.",
    examples: [{"input":"head = [1,2,3,4,5], n = 2","output":"[1,2,3,5]"},{"input":"head = [1], n = 1","output":"[]"},{"input":"head = [1,2], n = 1","output":"[1]"}],
    constraints: ["the number of nodes in the list is sz","1 <= sz <= 30","0 <= Node.val <= 100","1 <= n <= sz"],
    intuition: "Two-pointer gap trick. Advance fast pointer n+1 steps ahead of slow. When fast reaches null, slow is right before the node to remove.",
    recognize: [
      "\"nth from the end\" on a singly linked list — you can't count backward or index directly.",
      "Explicitly asks for a single pass, ruling out \"count length first, then walk again\".",
      "Removing the head itself is a valid case (n equals list length), hinting you need a dummy node to avoid a special case.",
      "→ These clues say: two pointers with an n+1 gap, walk both together to find the node just before the target.",
    ],
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
    lineByLine: [
      "`ListNode dummy(0, head); ListNode* fast = &dummy, *slow = &dummy;` — dummy before head avoids a special case when removing the head itself.",
      "`for (int i = 0; i <= n; i++) fast = fast->next;` — push fast n+1 steps ahead of slow.",
      "`while (fast) { fast = fast->next; slow = slow->next; }` — advance both in lockstep until fast falls off the end.",
      "`slow->next = slow->next->next;` — slow now sits before the target, so unlink it.",
      "`return dummy.next;` — handles the removed-head case correctly.",
    ],
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
    statement: "Given the head of a singly linked list containing nodes L0, L1, ..., Ln-1, Ln, reorder it in place to become L0, Ln, L1, Ln-1, L2, Ln-2, and so on, without altering the node values. You may not simply rearrange the values in the nodes; the actual node links must be changed.",
    examples: [{"input":"head = [1,2,3,4]","output":"[1,4,2,3]"},{"input":"head = [1,2,3,4,5]","output":"[1,5,2,4,3]"}],
    constraints: ["the number of nodes is in the range [1, 5 * 10^4]","1 <= Node.val <= 1000"],
    intuition: "Three-step: 1) Find middle. 2) Reverse second half. 3) Merge two halves alternately.",
    recognize: [
      "Target order (L0, Ln, L1, Ln-1, ...) alternates front and back of the list — that back-to-front pairing is the signature of \"reverse the second half and merge\".",
      "It's a singly linked list, so you can't jump straight to Ln without walking or reversing.",
      "\"In place\" and \"actual node links must be changed\" rule out copying values into an array and rewriting.",
      "→ These clues say: find the middle, reverse the second half, then interleave the two halves.",
    ],
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
    lineByLine: [
      "`while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }` — fast moves twice as fast, so slow lands at the middle.",
      "`ListNode* prev = nullptr, *cur = slow->next; slow->next = nullptr;` — sever the list at slow into two halves.",
      "`while (cur) { ...; }` — standard in-place reversal of the second half.",
      "`ListNode* l1 = head, *l2 = prev;` — l1 walks the front half, l2 walks the reversed back half.",
      "`while (l2) { ...; l1 = n1; l2 = n2; }` — splice l2 after l1, weaving front and back together.",
    ],
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
    statement: "Given the head of a singly linked list, determine whether the sequence of values it represents reads the same forwards and backwards. Return true if the list is a palindrome, otherwise false.",
    examples: [{"input":"head = [1,2,2,1]","output":"true"},{"input":"head = [1,2]","output":"false"}],
    constraints: ["the number of nodes is in the range [1, 10^5]","0 <= Node.val <= 9"],
    intuition: "Find middle, reverse second half, compare with first half. O(1) space. Optionally restore the list afterward.",
    recognize: [
      "\"Reads the same forwards and backwards\" on a linked list — but you can't index from the end like an array.",
      "No stated O(1) space would let you just copy values into an array and use two pointers; if O(1) space is expected here, that shortcut is off the table.",
      "Comparing forwards vs backwards is the same shape as reverse-linked-list, just applied to half the list and compared against the other half.",
      "→ These clues say: find the middle, reverse the second half in place, then compare the two halves node by node.",
    ],
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
    lineByLine: [
      "`ListNode* prev = nullptr; while (head) { ...; } return prev;` — the standard in-place reverse helper, reused on the second half.",
      "`while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }` — slow/fast finds the midpoint in one pass.",
      "`ListNode* right = reverse(slow);` — reverse the back half so it now reads front-to-back, mirroring the first half.",
      "`while (tmp) { if (left->val != tmp->val) { ok = false; break; } ... }` — compare the two halves pairwise.",
      "`reverse(right);` — restore the list's original order before returning.",
      "`return ok;` — true only if every pair matched.",
    ],
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
    statement: "Given the head of a linked list and an integer k, reverse the nodes of the list k at a time and return the modified head. If the number of remaining nodes at the end is fewer than k, leave that final group in its original order. Nodes themselves (not just their values) must be rearranged.",
    examples: [{"input":"head = [1,2,3,4,5], k = 2","output":"[2,1,4,3,5]","explanation":"The last group [5] has fewer than k nodes so it stays as is."},{"input":"head = [1,2,3,4,5], k = 3","output":"[3,2,1,4,5]"},{"input":"head = [1,2,3,4,5,6], k = 3","output":"[3,2,1,6,5,4]"}],
    constraints: ["The number of nodes is n","1 <= k <= n <= 5000","0 <= Node.val <= 1000"],
    intuition: "Iteratively reverse chunks of k nodes. For each group: check k nodes exist, reverse them, relink to previous group's tail and next group's head.",
    recognize: [
      "It's reverse-linked-list generalized: reverse in fixed-size chunks of k instead of the whole list.",
      "Explicitly says a trailing group smaller than k stays untouched — so you must check group size before committing to reverse it.",
      "Nodes must actually be relinked, and each group's tail has to reconnect to the next group's (possibly reversed) head.",
      "→ These clues say: for each group, verify k nodes remain, reverse that group in place, then stitch groups together.",
    ],
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
    lineByLine: [
      "`while (cur && k-- > 0) cur = cur->next; return cur;` — null means fewer than k nodes remain, leave the group untouched.",
      "`ListNode* kth = getKth(groupPrev, k); if (!kth) break;` — stop once a full group of k no longer exists.",
      "`ListNode* groupNext = kth->next;` — remember where this group ends so it can reattach later.",
      "`ListNode* prev = groupNext, *cur = groupPrev->next;` — reverse-linked-list, but prev starts at groupNext not null.",
      "`while (cur != groupNext) { ...; }` — reverse just this group, stopping at the boundary.",
      "`ListNode* tmp = groupPrev->next;` — the group's old head, now its tail after reversal.",
      "`groupPrev->next = kth; groupPrev = tmp;` — attach new head, advance groupPrev to the new tail.",
    ],
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
    statement: "You are given a linked list where each node has an additional random pointer that can point to any node in the list, or to null. Construct a deep copy of the list, where the new list consists of entirely new nodes with the same val values, and every next and random pointer points to nodes within the copied list rather than the original.",
    examples: [{"input":"head = [[7,null],[13,0],[11,4],[10,2],[1,0]]","output":"[[7,null],[13,0],[11,4],[10,2],[1,0]]","explanation":"Each pair is [val, random_index], where random_index is the index of the node the random pointer targets, or null."},{"input":"head = [[1,1],[2,1]]","output":"[[1,1],[2,1]]"},{"input":"head = []","output":"[]"}],
    constraints: ["the number of nodes is in the range [0, 1000]","-10^4 <= Node.val <= 10^4","Node.random is null or points to some node in the list"],
    intuition: "Three-pass approach using the original list as a hash map. 1) Interleave clones between originals. 2) Set random pointers. 3) Separate lists.",
    recognize: [
      "Each node has a random pointer to an arbitrary node — copying next alone isn't enough, you need a way to translate old-node references into new-node references.",
      "\"Deep copy\" and \"new nodes\" rule out just returning the same list or shallow-copying pointers.",
      "A hash map from old node to new node solves it trivially in O(n) space, so the recognizable twist is when O(1) extra space is asked for.",
      "→ These clues say: either map old→new nodes with a hash map, or interleave clones directly into the original list to avoid the map.",
    ],
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
    lineByLine: [
      "`for (Node* cur = head; cur; cur = cur->next->next)` — walk only the originals, skipping each inserted clone.",
      "`clone->next = cur->next; cur->next = clone;` — interleave clones so 'clone of X' is always X->next.",
      "`if (cur->random) cur->next->random = cur->random->next;` — clone's random is the original random's clone.",
      "`res->next = cur->next;` — attach the clone to the result list.",
      "`cur->next = cur->next->next;` — unweave, restoring the original list's next pointer.",
      "`return dummy.next;` — head of the fully separated deep copy.",
    ],
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
    statement: "You are given the head of a singly linked list. Swap every pair of adjacent nodes (exchange their positions, not just their values) and return the head of the modified list. If the list has an odd number of nodes, the final node is left in place.",
    examples: [{"input":"head = [1,2,3,4]","output":"[2,1,4,3]","explanation":"Nodes 1-2 swap and nodes 3-4 swap."},{"input":"head = [1,2,3]","output":"[2,1,3]","explanation":"Nodes 1-2 swap; node 3 has no partner so it stays."},{"input":"head = []","output":"[]"}],
    constraints: ["The number of nodes is in the range [0, 100]","0 <= Node.val <= 100","You may not modify the values in the list's nodes (only the node positions may be changed)"],
    intuition: "Recursively (or iteratively) swap every two adjacent nodes. For recursive: swap first two, recurse on rest, relink.",
    recognize: [
      "\"Swap every pair of adjacent nodes\" with the rule that node positions (not values) must change — a values-only swap would be a giveaway shortcut the problem forbids.",
      "The pattern repeats identically on every pair, which is a strong hint the same operation recurses cleanly on the remainder of the list.",
      "Odd node count leaves one node untouched — a base case you must handle explicitly.",
      "→ These clues say: swap the first pair, recurse (or iterate) on the rest, then relink the pair to the recursed result.",
    ],
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
    lineByLine: [
      "`if (!head || !head->next) return head;` — no partner left, return unchanged.",
      "`ListNode* second = head->next;` — the node that becomes the front of this pair.",
      "`head->next = swapPairs(second->next);` — recurse on the rest first, then attach it after head (now the pair's second node).",
      "`second->next = head;` — complete the swap, exchanging positions not values.",
      "`return second;` — new head of this pair, linked into the caller one level up.",
    ],
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
    statement: "Given the root of a binary tree, return the values of its nodes grouped level by level, from top to bottom, where each level is listed left to right as its own list.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"[[3],[9,20],[15,7]]"},{"input":"root = [1]","output":"[[1]]"},{"input":"root = []","output":"[]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 2000]","-1000 <= Node.val <= 1000"],
    intuition: "BFS with level separation. Track queue size at start of each level to know when one level ends and next begins.",
    recognize: [
      "Output is explicitly grouped \"level by level\" — that grouping is the signature of breadth-first traversal, not depth-first.",
      "\"Top to bottom\" order with each level left to right matches exactly how a queue processes nodes if you know where one level ends and the next begins.",
      "No mention of needing the deepest path or an accumulated sum — just structural grouping by depth.",
      "→ These clues say: BFS with a queue, snapshotting the queue size at the start of each level to know where to cut.",
    ],
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
    lineByLine: [
      "`if (!root) return {};` — empty tree has no levels.",
      "`queue<TreeNode*> q; q.push(root);` — BFS uses a FIFO queue to keep left-to-right order.",
      "`while (!q.empty())` — process one more level each iteration.",
      "`int sz = q.size();` — nodes queued before children are added is the current level's width.",
      "`vector<int> level;` — collects this level's values.",
      "`for (int i = 0; i < sz; i++)` — process only this level's nodes, not next level's children.",
      "`auto node = q.front(); q.pop();` — dequeue next node, left to right.",
      "`level.push_back(node->val);` — record its value in this level.",
      "`if (node->left) q.push(node->left); if (node->right) q.push(node->right);` — enqueue children for the next level.",
      "`res.push_back(level);` — append the completed level.",
      "`return res;` — levels top to bottom, each left to right.",
    ],
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
    statement: "Given the root of a binary tree, imagine standing on the right side of it. Return the values of the nodes you can see, ordered from the topmost level to the bottommost — that is, the rightmost node visible at each depth.",
    examples: [{"input":"root = [1,2,3,null,5,null,4]","output":"[1,3,4]"},{"input":"root = [1,null,3]","output":"[1,3]"},{"input":"root = []","output":"[]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 100]","-100 <= Node.val <= 100"],
    intuition: "BFS level order. For each level, the last node is visible from the right. Add last node of each level to result.",
    recognize: [
      "\"Standing on the right side\" and \"one value per depth\" means exactly one node per level makes it into the answer — a level-by-level structure again.",
      "The visible node is whichever is rightmost at that depth, which is just \"last node processed in that level\" if you traverse left-to-right per level.",
      "This is level-order-traversal with only the last element of each level kept, not a completely different traversal.",
      "→ These clues say: BFS level-by-level, record the last node's value in each level.",
    ],
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
    lineByLine: [
      "`if (!root) return {};` — no tree, nothing visible.",
      "`queue<TreeNode*> q; q.push(root);` — standard level-order BFS setup.",
      "`int sz = q.size();` — width of the current level before children are pushed.",
      "`for (int i = 0; i < sz; i++)` — walk this level left to right.",
      "`auto node = q.front(); q.pop();` — dequeue in left-to-right order.",
      "`if (i == sz - 1) res.push_back(node->val);` — last node processed is the rightmost at this depth.",
      "`if (node->left) q.push(node->left); if (node->right) q.push(node->right);` — enqueue children left then right, preserving order.",
      "`return res;` — rightmost value from each level, top to bottom.",
    ],
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
    statement: "Given the root of a binary tree, return its maximum depth, defined as the number of nodes along the longest path from the root down to the farthest leaf node.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"3"},{"input":"root = [1,null,2]","output":"2"},{"input":"root = []","output":"0"}],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]","-100 <= Node.val <= 100"],
    intuition: "Recursively, max depth = 1 + max(depth(left), depth(right)). Base: null node has depth 0.",
    recognize: [
      "\"Longest path from root to farthest leaf\" wants a single number describing the whole tree's height, computed by combining children's answers.",
      "Each subtree's own max depth is exactly the sub-problem, and the final answer at any node is 1 + the bigger of its two children's depths.",
      "No comparison or constraint between left and right values needed — just their depths.",
      "→ These clues say: DFS that returns a value up the call stack (height), combining left and right results at every node.",
    ],
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
    lineByLine: [
      "`if (!root) return 0;` — empty subtree contributes 0 depth.",
      "`return 1 + max(maxDepth(root->left), maxDepth(root->right));` — deeper child's depth plus this node itself.",
    ],
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
    statement: "Given the root of a binary tree, return its minimum depth, defined as the number of nodes along the shortest path from the root down to the nearest leaf node (a node with no children).",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"2"},{"input":"root = [2,null,3,null,4,null,5,null,6]","output":"5","explanation":"The tree is a single chain of right children, so the only leaf is at depth 5."},{"input":"root = []","output":"0"}],
    constraints: ["The number of nodes in the tree is in the range [0, 10^5]","-1000 <= Node.val <= 1000"],
    intuition: "Min depth is to nearest leaf. Can't just take min(left, right) — if one subtree is null, it's not a path to a leaf. Must handle null subtrees specially.",
    recognize: [
      "\"Shortest path to the nearest leaf\" (not just nearest null child) — the example with a one-sided chain to depth 5 shows a missing child does NOT count as a shortcut leaf.",
      "This looks like max-depth-tree's twin, but a naive min(left, right) breaks the moment one child is null while the other has a long subtree.",
      "A leaf is explicitly defined as a node with no children — so a node with only one child is not yet a leaf.",
      "→ These clues say: DFS returning a value up the call stack, but special-case a missing child by forcing the path through the existing side instead of taking min(0, other).",
    ],
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
    lineByLine: [
      "`if (!root) return 0;` — empty subtree has depth 0.",
      "`if (!root->left) return 1 + minDepth(root->right);` — no left child, so the only real leaf path goes right.",
      "`if (!root->right) return 1 + minDepth(root->left);` — no right child, so the only real leaf path goes left.",
      "`return 1 + min(minDepth(root->left), minDepth(root->right));` — both children exist, take whichever reaches a leaf sooner.",
    ],
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
    statement: "Given the root of a binary tree, return the length (measured in number of edges) of the longest path between any two nodes in the tree. This path may or may not pass through the root.",
    examples: [{"input":"root = [1,2,3,4,5]","output":"3","explanation":"The longest path is 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3), which has 3 edges."},{"input":"root = [1,2]","output":"1"},{"input":"root = [1]","output":"0"}],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]","-100 <= Node.val <= 100"],
    intuition: "Diameter through any node = left height + right height. Compute height recursively; at each node update global max diameter as left_height + right_height.",
    recognize: [
      "\"Longest path between any two nodes\" — explicitly may NOT pass through the root, so a single top-down root-to-leaf measurement can't be the answer.",
      "The path's length at any node is a combination of its left AND right subtree heights together, not just one side — that's different from a depth question.",
      "The example shows the answer path doesn't have to end at a leaf on both sides in a simple way — it's the widest \"V\" shape at some node.",
      "→ These clues say: DFS that computes height bottom-up, but at every node also updates a running global max of left_height + right_height.",
    ],
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
    lineByLine: [
      "`int ans = 0;` — global best diameter, since height() already returns height, not diameter.",
      "`if (!node) return 0;` — empty subtree has height 0.",
      "`int l = height(node->left), r = height(node->right);` — height of each child, needed for the bend at this node.",
      "`ans = max(ans, l + r);` — a path bending at this node spans l + r edges; update the global best.",
      "`return 1 + max(l, r);` — parent only needs a straight height, not a bend, so return the deeper side plus 1.",
      "`height(root); return ans;` — visiting every node updates ans, which ends up holding the true max.",
    ],
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
    statement: "Given the root of a binary tree, determine whether it is height-balanced, meaning that for every node in the tree, the heights of its left and right subtrees differ by no more than 1.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"true"},{"input":"root = [1,2,2,3,3,null,null,4,4]","output":"false","explanation":"The subtree rooted at the leftmost node 2 has left and right subtree heights that differ by more than 1."},{"input":"root = []","output":"true"}],
    constraints: ["The number of nodes in the tree is in the range [0, 5000]","-10^4 <= Node.val <= 10^4"],
    intuition: "Bottom-up check. At each node, compute height of subtrees. If heights differ by > 1, return -1 (sentinel for 'unbalanced'). Propagate -1 up to short-circuit.",
    recognize: [
      "\"For every node\" the left/right heights must differ by at most 1 — a condition checked at EVERY node, not just the root, so a plain height computation isn't enough on its own.",
      "Computing height naively at every node and comparing separately would cost O(n^2) on a skewed tree — the problem doesn't say n is tiny, so that inefficiency is a smell.",
      "You need both a height value AND a pass/fail signal to propagate up simultaneously.",
      "→ These clues say: DFS returning a value up the call stack, overloading the return with a sentinel (-1) to short-circuit as soon as any subtree fails.",
    ],
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
    lineByLine: [
      "`if (!node) return 0;` — empty subtree has height 0, trivially balanced.",
      "`int l = check(node->left), r = check(node->right);` — return value doubles as height, or -1 meaning already unbalanced.",
      "`if (l == -1 || r == -1 || abs(l - r) > 1) return -1;` — a child failed or this node's heights diverge: short-circuit unbalanced.",
      "`return 1 + max(l, r);` — both sides balanced, so report a real height upward.",
      "`return check(root) != -1;` — true unless the -1 sentinel fired anywhere in the tree.",
    ],
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
    statement: "Given the roots of two binary trees, determine whether the two trees are structurally identical and every corresponding pair of nodes holds the same value.",
    examples: [{"input":"p = [1,2,3], q = [1,2,3]","output":"true"},{"input":"p = [1,2], q = [1,null,2]","output":"false","explanation":"Node 2 is a left child in p but a right child in q."},{"input":"p = [1,2,1], q = [1,1,2]","output":"false"}],
    constraints: ["The number of nodes in both trees is in the range [0, 100]","-10^4 <= Node.val <= 10^4"],
    intuition: "Recursively compare: both null → true, one null → false, values differ → false, else recurse on children.",
    recognize: [
      "Two separate trees are compared node-for-node, not one tree searched for a pattern — a direct pairwise walk down both structures at once.",
      "\"Structurally identical\" plus \"same value\" means both shape (null vs non-null in matching positions) and value have to match at every corresponding node.",
      "The example with values [1,2] vs [1,null,2] shows identical values in different positions must fail — so shape matters as much as value.",
      "→ These clues say: recurse on both trees simultaneously, short-circuit false on any structural or value mismatch, true only if both are null.",
    ],
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
    lineByLine: [
      "`if (!p && !q) return true;` — both sides ran out at the same point, structures match here.",
      "`if (!p || !q || p->val != q->val) return false;` — structural mismatch or differing value, short-circuit false.",
      "`return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);` — identical only if both left and right subtrees also match.",
    ],
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
    statement: "Given the root of a binary tree, determine whether it is a mirror of itself, meaning the tree looks the same when reflected across the vertical line through the root.",
    examples: [{"input":"root = [1,2,2,3,4,4,3]","output":"true"},{"input":"root = [1,2,2,null,3,null,3]","output":"false","explanation":"The inner values 3 and 3 are positioned asymmetrically, one on the far right of the left subtree and one on the far right of the right subtree."},{"input":"root = [1]","output":"true"}],
    constraints: ["The number of nodes in the tree is in the range [1, 1000]","-100 <= Node.val <= 100"],
    intuition: "Tree is symmetric if left subtree mirrors right subtree. Check recursively: outer children match, inner children match.",
    recognize: [
      "\"Mirror of itself\" across a single tree means you're really comparing the left subtree against the right subtree as if one were reflected — same-tree's logic but crossed.",
      "The failing example has matching values but in swapped positions on each side — proving it's about crossed structural comparison, not just same-tree on left vs right.",
      "You compare left->left against right->right (outer pair) AND left->right against right->left (inner pair) — a crossed pairing, not a straight one.",
      "→ These clues say: recurse two pointers starting at root->left and root->right, but cross the recursive calls (outer-outer, inner-inner) instead of matching straight across.",
    ],
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
    lineByLine: [
      "`if (!l && !r) return true;` — both pointers ran off the tree at mirrored positions, shapes match here.",
      "`if (!l || !r || l->val != r->val) return false;` — asymmetric shape or differing values, not a mirror.",
      "`return mirror(l->left, r->right) && mirror(l->right, r->left);` — cross the pairing: outer edges must mirror outer, inner mirror inner.",
      "`return mirror(root->left, root->right);` — compare the two halves that must reflect each other.",
    ],
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
    statement: "Given the roots of two binary trees root and subRoot, determine whether subRoot appears as an exact subtree somewhere within root — that is, whether there is a node in root such that the subtree rooted at that node is structurally identical to subRoot with matching values.",
    examples: [{"input":"root = [3,4,5,1,2], subRoot = [4,1,2]","output":"true"},{"input":"root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]","output":"false","explanation":"The subtree at node 4 has an extra node 0, so it does not match subRoot exactly."},{"input":"root = [1,1], subRoot = [1]","output":"true"}],
    constraints: ["The number of nodes in root is in the range [1, 2000]","The number of nodes in subRoot is in the range [1, 1000]","-10^4 <= Node.val <= 10^4"],
    intuition: "At every node of s, check if the subtree rooted there is identical to t. Use the isSameTree subroutine.",
    recognize: [
      "You're searching for subRoot as an exact match ANYWHERE inside root, not just comparing root to subRoot directly — that's a search, not a single comparison.",
      "The failing example shows an extra node deep inside disqualifies a match, so \"contains the same values somewhere\" isn't enough — full structural equality is required at the matching node.",
      "This reuses the same-tree check as a subroutine, just tried at every node instead of only the root.",
      "→ These clues say: DFS over root, and at each node run a full same-tree comparison against subRoot, recursing further if it fails.",
    ],
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
    lineByLine: [
      "`bool same(TreeNode* a, TreeNode* b)` — same-tree helper: exact structural and value match.",
      "`if (!root) return false;` — ran out of tree without a match, subRoot isn't here.",
      "`if (same(root, subRoot)) return true;` — check exact match starting at this node.",
      "`return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);` — not a match here, try both subtrees.",
    ],
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
    statement: "An array of n unique integers, originally sorted in ascending order, has been rotated between 1 and n times. Given the rotated array nums, return the minimum element. Your algorithm must run in O(log n) time.",
    examples: [{"input":"nums = [3,4,5,1,2]","output":"1"},{"input":"nums = [4,5,6,7,0,1,2]","output":"0"},{"input":"nums = [11,13,15,17]","output":"11"}],
    constraints: ["n == nums.length","1 <= n <= 5000","-5000 <= nums[i] <= 5000","all values in nums are unique","nums was originally sorted ascending then rotated between 1 and n times"],
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
    lineByLine: [
      "`int l = 0, r = (int)nums.size() - 1;` — window over the whole array; each step discards the half without the minimum.",
      "`if (nums[mid] > nums[r]) l = mid + 1;` — mid bigger than the rightmost means the rotation point is to the right, discard up to mid.",
      "`else r = mid;` — mid to r is sorted with no drop, so the minimum is mid or further left.",
      "`return nums[l];` — once l==r, that index holds the minimum.",
    ],
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
    statement: "An array of unique integers, originally sorted in ascending order, has been rotated at some unknown pivot. Given the rotated array nums and a target value, return the index of target in nums, or -1 if it is not present. The solution must run in O(log n) time.",
    examples: [{"input":"nums = [4,5,6,7,0,1,2], target = 0","output":"4"},{"input":"nums = [4,5,6,7,0,1,2], target = 3","output":"-1"},{"input":"nums = [1], target = 0","output":"-1"}],
    constraints: ["1 <= nums.length <= 5000","-10^4 <= nums[i] <= 10^4","all values in nums are unique","nums is an ascending array rotated at some pivot","-10^4 <= target <= 10^4"],
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
    lineByLine: [
      "`if (nums[mid] == target) return mid;` — direct hit.",
      "`if (nums[l] <= nums[mid])` — checks whether the left half (l to mid) is the genuinely sorted one.",
      "`if (nums[l] <= target && target < nums[mid]) r = mid - 1;` — target falls in the sorted left half, search there.",
      "`else l = mid + 1;` — target isn't in the sorted left half, so it must be in the right half.",
      "`else { ...target in (mid, r]... }` — symmetric case when the right half is the sorted one.",
      "`return -1;` — window emptied without a match.",
    ],
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
    statement: "Given an m x n matrix in which each row is sorted in ascending order and the first number of each row is greater than the last number of the previous row, determine whether a given target value exists anywhere in the matrix. Return true or false. The algorithm should run in O(log(m*n)) time by treating the matrix as a single sorted sequence.",
    examples: [{"input":"matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3","output":"true"},{"input":"matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13","output":"false"}],
    constraints: ["m == matrix.length","n == matrix[i].length","1 <= m, n <= 100","-10^4 <= matrix[i][j] <= 10^4","-10^4 <= target <= 10^4"],
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
    lineByLine: [
      "`int lo = 0, hi = m * n - 1;` — treat the matrix as one flat sorted array of m*n elements.",
      "`int val = matrix[mid / n][mid % n];` — row is mid divided by width, column is the remainder.",
      "`else if (val < target) lo = mid + 1; else hi = mid - 1;` — standard binary search narrowing.",
      "`return false;` — window exhausted without a match.",
    ],
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
    statement: "Koko has n piles of bananas, where piles[i] is the number of bananas in the i-th pile, and h hours until the guards return. Each hour she chooses one pile and eats up to k bananas from it; if the pile has fewer than k bananas she finishes that pile and moves on without eating more that hour. Return the minimum integer eating speed k such that she can finish all the piles within h hours.",
    examples: [{"input":"piles = [3,6,7,11], h = 8","output":"4"},{"input":"piles = [30,11,23,4,20], h = 5","output":"30"},{"input":"piles = [30,11,23,4,20], h = 6","output":"23"}],
    constraints: ["1 <= piles.length <= 10^4","piles.length <= h <= 10^9","1 <= piles[i] <= 10^9"],
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
    lineByLine: [
      "`int lo = 1, hi = *max_element(piles.begin(), piles.end());` — binary search over the eating speed, not array indices.",
      "`hours += (p + mid - 1) / mid;` — ceil(p / mid) hours to finish that pile at this speed, integer-only.",
      "`if (hours <= h) hi = mid;` — fast enough, try an even slower speed since feasibility is monotonic.",
      "`else lo = mid + 1;` — too slow, only faster speeds can work.",
      "`return lo;` — smallest speed where total hours stays within the limit.",
    ],
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
    statement: "You have n versions numbered 1 to n, and you know that once a version is bad, all following versions are also bad. Given a way to check whether a given version is bad (via a provided isBadVersion API), find and return the first bad version while minimizing the number of API calls.",
    examples: [{"input":"n = 5, bad = 4","output":"4","explanation":"Calling isBadVersion(3) returns false and isBadVersion(4) returns true, so 4 is the first bad version."},{"input":"n = 1, bad = 1","output":"1"}],
    constraints: ["1 <= bad <= n <= 2^31 - 1","isBadVersion is consistent: it returns false for all versions before bad and true from bad onward"],
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
    lineByLine: [
      "`int lo = 1, hi = n;` — the first bad version lies somewhere in [1, n].",
      "`if (isBadVersion(mid)) hi = mid;` — first bad is at mid or before, keep mid in the window.",
      "`else lo = mid + 1;` — mid is good, first bad must be strictly after it.",
      "`return lo;` — left-boundary binary search: where the predicate flips false to true.",
    ],
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
    statement: "Given a sorted array of distinct integers and a target value, return the index of the target if it is found in the array. If not found, return the index where it would be inserted to keep the array sorted.",
    examples: [{"input":"nums = [1,3,5,6], target = 5","output":"2","explanation":"5 is found at index 2."},{"input":"nums = [1,3,5,6], target = 2","output":"1","explanation":"2 is not present, but it would be inserted at index 1 to keep nums sorted."},{"input":"nums = [1,3,5,6], target = 7","output":"4","explanation":"7 is larger than every element, so it would be inserted at the end, index 4."}],
    constraints: ["1 <= nums.length <= 10^4","-10^4 <= nums[i] <= 10^4","nums contains distinct values sorted in ascending order","-10^4 <= target <= 10^4"],
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
    lineByLine: [
      "`int lo = 0, hi = nums.size();` — hi is n, not n-1, since target might insert after every element.",
      "`if (nums[mid] < target) lo = mid + 1;` — too small, target belongs after mid.",
      "`else hi = mid;` — nums[mid] >= target, mid is a candidate insertion point.",
      "`return lo;` — first index where nums[i] >= target, the insertion point or existing index.",
    ],
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
    statement: "Design a time-based key-value store that supports storing multiple values for the same key at different timestamps, and retrieving the value associated with a key at a certain timestamp. Implement set(key, value, timestamp) to store the value at the given timestamp, and get(key, timestamp) to return the value whose recorded timestamp is the largest one less than or equal to the given timestamp, or an empty string if none exists. Timestamps passed to set for a given key are strictly increasing.",
    examples: [{"input":"[\"TimeMap\",\"set\",\"get\",\"get\",\"set\",\"get\",\"get\"]\n[[],[\"foo\",\"bar\",1],[\"foo\",1],[\"foo\",3],[\"foo\",\"bar2\",4],[\"foo\",4],[\"foo\",5]]","output":"[null,null,\"bar\",\"bar\",null,\"bar2\",\"bar2\"]","explanation":"At timestamp 3 the most recent set at or before it is (\"bar\",1); at timestamp 5 it is (\"bar2\",4)."}],
    constraints: ["1 <= key.length, value.length <= 100","1 <= timestamp <= 10^7","all timestamps of set calls for the same key are strictly increasing","at most 2 * 10^5 calls total to set and get"],
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
    lineByLine: [
      "`unordered_map<string, vector<pair<int,string>>> data;` — each key's history stays sorted since timestamps only increase.",
      "`void set(...) { data[key].push_back({timestamp, value}); }` — appending preserves the sorted invariant.",
      "`if (!data.count(key)) return \"\";` — no history for this key.",
      "`int lo = 0, hi = (int)v.size() - 1, ans = -1;` — ans tracks the largest timestamp found so far that's <= query.",
      "`if (v[mid].first <= timestamp) { ans = mid; lo = mid + 1; }` — qualifies, keep searching right for a larger valid one.",
      "`else hi = mid - 1;` — too far in the future, discard it and everything after.",
      "`return ans == -1 ? \"\" : v[ans].second;` — empty if nothing qualified, else the latest qualifying value.",
    ],
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
    statement: "There are a given number of courses labeled from 0 to numCourses - 1, and a list of prerequisite pairs where [a, b] means course b must be completed before course a. Determine whether it is possible to finish all courses given these prerequisites (i.e., whether the prerequisite graph has no cycle).",
    examples: [{"input":"numCourses = 2, prerequisites = [[1,0]]","output":"true"},{"input":"numCourses = 2, prerequisites = [[1,0],[0,1]]","output":"false","explanation":"Course 0 requires course 1 and course 1 requires course 0, forming a cycle."}],
    constraints: ["1 <= numCourses <= 2000","0 <= prerequisites.length <= 5000","prerequisites[i].length == 2","All pairs prerequisites[i] are unique"],
    intuition: "Detect cycle in directed graph. Circular dependency = impossible. DFS with 3 states: 0=unvisited, 1=in current path, 2=done. Hitting state 1 again = cycle.",
    recognize: [
      "\"b must be completed before a\" is a directed edge (b → a), and prerequisites naturally form a dependency graph, not an undirected one.",
      "\"Determine whether it is possible to finish all courses\" given circular dependencies is exactly asking whether the directed graph has a cycle.",
      "A course requiring itself indirectly (course 0 needs 1, 1 needs 0) is the concrete failure case shown — that's a cycle through the current DFS path, not just any previously-visited node.",
      "→ These clues say: DFS cycle detection on a directed graph using three states (unvisited / in current recursion path / fully done) — revisiting an in-path node means a cycle.",
    ],
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
    lineByLine: [
      "`bool hasCycle(int u, vector<vector<int>>& adj, vector<int>& state)` — state[u]: 0=unvisited, 1=in current path, 2=done and safe.",
      "`if (state[u] == 1) return true;` — reaching a node still on the current path means we looped back, a cycle.",
      "`if (state[u] == 2) return false;` — already proven safe, skip re-exploring.",
      "`state[u] = 1;` — mark in-progress before recursing into neighbors.",
      "`for (int v : adj[u]) if (hasCycle(v, adj, state)) return true;` — propagate a cycle found in any neighbor.",
      "`state[u] = 2; return false;` — all neighbors safe, so this node is safe too.",
      "`for (auto& e : prereqs) adj[e[1]].push_back(e[0]);` — edge points from prerequisite to the course it unlocks.",
      "`for (int i = 0; i < n; i++) if (hasCycle(i, adj, state)) return false;` — try every node since the graph may be disconnected.",
    ],
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
    statement: "There are a given number of courses labeled from 0 to numCourses - 1, and a list of prerequisite pairs where [a, b] means course b must be completed before course a. Return a valid order in which to take all the courses, or an empty array if no valid order exists because of a cycle.",
    examples: [{"input":"numCourses = 2, prerequisites = [[1,0]]","output":"[0,1]"},{"input":"numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]","output":"[0,1,2,3]","explanation":"Course 0 first, then 1 and 2 in either order, then 3; [0,2,1,3] is also valid."},{"input":"numCourses = 1, prerequisites = []","output":"[0]"}],
    constraints: ["1 <= numCourses <= 2000","0 <= prerequisites.length <= 5000","prerequisites[i].length == 2","All pairs prerequisites[i] are unique"],
    intuition: "Topological sort. Same DFS cycle detection, but push node to order AFTER processing all its neighbors (post-order). Reverse post-order = topological order.",
    recognize: [
      "It's course-schedule but now asking for an actual VALID ORDER, not just a yes/no — that upgrades cycle detection into topological sorting.",
      "Multiple valid orders can exist for the same prerequisites (the example accepts either [0,1,2,3] or [0,2,1,3]) — a hallmark of topological sort, which isn't unique.",
      "A cycle still means impossible (return empty), so whatever cycle-detection machinery solves course-schedule has to be reused here, just extended to record an order.",
      "→ These clues say: same 3-state DFS cycle detection, but record each node in post-order (after all its dependencies are processed) and reverse that list for the final order.",
    ],
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
    lineByLine: [
      "`bool dfs(int u, ...)` — same 3-state cycle detection as course-schedule, but also builds `order`.",
      "`if (state[u] == 1) return false;` — looping to an in-progress node means a cycle, path invalid.",
      "`if (state[u] == 2) return true;` — already processed and safe, skip.",
      "`state[u] = 1; for (int v : adj[u]) if (!dfs(v, adj, state, order)) return false;` — mark in-progress, fail if any neighbor has a cycle.",
      "`state[u] = 2; order.push_back(u);` — record u only after all its dependencies are fully processed (post-order).",
      "`for (int i = 0; i < n; i++) if (!state[i] && !dfs(i, adj, state, order)) return {};` — try every node; any cycle means no valid order exists.",
      "`reverse(order.begin(), order.end());` — post-order lists last-finished first, so reverse it into a valid teaching order.",
      "`return order;` — a valid topological sort.",
    ],
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
    statement: "Given a reference to a node in a connected undirected graph, where each node stores a value and a list of neighbor references, produce a deep copy (clone) of the entire graph and return the reference to the corresponding cloned starting node.",
    examples: [{"input":"adjList = [[2,4],[1,3],[2,4],[1,3]]","output":"[[2,4],[1,3],[2,4],[1,3]]","explanation":"Node 1's neighbors are 2 and 4, node 2's neighbors are 1 and 3, etc.; the cloned graph has identical structure with new node objects."},{"input":"adjList = [[]]","output":"[[]]","explanation":"A single node with no neighbors."}],
    constraints: ["The number of nodes is in the range [0, 100]","1 <= Node.val <= 100","Node.val is unique for each node","There are no repeated edges and no self-loops","The graph is connected"],
    intuition: "DFS with memoization. Map original to clone. First visit: create clone, record, then recursively clone all neighbors.",
    recognize: [
      "The graph can have cycles (neighbors point back to each other), so a plain recursive copy without tracking visited nodes would loop forever.",
      "\"Deep copy\" means every node and its full neighbor list must be recreated, not referenced — that's the hint you need a mapping from original node to its clone, created before recursing into neighbors.",
      "It's a general graph, not a tree, so there's no guaranteed single root-to-leaf path — you need one lookup structure keyed by original node identity.",
      "→ These clues say: DFS with a hashmap from original node to clone; check/create the clone entry BEFORE recursing into neighbors, so cycles terminate correctly.",
    ],
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
    lineByLine: [
      "`unordered_map<Node*, Node*> visited;` — maps each original node to its clone, breaking cycles.",
      "`if (!node) return nullptr;` — nothing to clone for a null slot.",
      "`if (visited.count(node)) return visited[node];` — clone already exists, reuse it instead of recursing again.",
      "`Node* clone = new Node(node->val); visited[node] = clone;` — register the clone before recursing so cycles resolve safely.",
      "`for (Node* nb : node->neighbors) clone->neighbors.push_back(dfs(nb));` — clone each neighbor and wire it into this clone's list.",
      "`return clone;` — hand back this node's clone to the caller.",
    ],
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
    statement: "You are given an m x n grid of heights representing a terrain, where the Pacific Ocean touches the top and left edges and the Atlantic Ocean touches the bottom and right edges. Water can flow from a cell to an adjacent cell with equal or lower height. Return the list of coordinates from which water can reach both oceans.",
    examples: [{"input":"heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]","output":"[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"},{"input":"heights = [[1]]","output":"[[0,0]]","explanation":"The single cell touches both oceans by definition."}],
    constraints: ["1 <= heights.length, heights[i].length <= 200","0 <= heights[i][j] <= 10^5"],
    intuition: "Reverse direction: start from ocean boundaries and flood inward (uphill). BFS from all Pacific edges, BFS from all Atlantic edges. Intersection = cells that reach both.",
    recognize: [
      "Asking \"which cells can reach BOTH oceans\" naively means checking a flow path from every single cell, which is expensive — a sign to flip the direction of the search.",
      "Each ocean touches a fixed, known set of border cells (top+left, bottom+right) — a natural multi-source starting set rather than one cell at a time.",
      "\"Equal or lower height\" downhill from a cell becomes \"equal or higher height\" when the search is reversed (flowing uphill from the ocean inward) — this reversal is what makes multi-source BFS/DFS from each ocean work.",
      "→ These clues say: run multi-source BFS/DFS from each ocean's border cells with the flow condition reversed, then intersect the two reachable sets.",
    ],
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
    lineByLine: [
      "`void bfs(vector<vector<int>>& h, queue<pair<int,int>> q, vector<vector<bool>>& vis)` — q is pre-seeded with one ocean's border cells, vis accumulates that ocean's reachable set.",
      "`if (nx<0||ny<0||nx>=m||ny>=n||vis[nx][ny]||h[nx][ny]<h[x][y]) continue;` — reversed flow: walking inland from the ocean requires the neighbor be equal or higher.",
      "`vis[nx][ny]=true; q.push({nx,ny});` — mark reachable from this ocean, keep expanding.",
      "`for (int i=0;i<m;i++){pac[i][0]=atl[i][n-1]=true;pq.push({i,0});aq.push({i,n-1});}` — seed Pacific from the left column, Atlantic from the right column.",
      "`for (int j=0;j<n;j++){pac[0][j]=atl[m-1][j]=true;pq.push({0,j});aq.push({m-1,j});}` — seed Pacific from the top row, Atlantic from the bottom row.",
      "`bfs(h,pq,pac); bfs(h,aq,atl);` — run each ocean's reachability search independently.",
      "`if (pac[i][j]&&atl[i][j]) res.push_back({i,j});` — cell qualifies only if both oceans can reach it.",
    ],
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
    statement: "You are given a grid where each cell is 0 (empty), 1 (a fresh orange), or 2 (a rotten orange). Every minute, any fresh orange adjacent (up, down, left, right) to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if that is impossible.",
    examples: [{"input":"grid = [[2,1,1],[1,1,0],[0,1,1]]","output":"4"},{"input":"grid = [[2,1,1],[0,1,1],[1,0,1]]","output":"-1","explanation":"The orange in the bottom-left corner is isolated by zeros and can never rot."},{"input":"grid = [[0,2]]","output":"0"}],
    constraints: ["1 <= grid.length, grid[i].length <= 10","grid[i][j] is 0, 1, or 2"],
    intuition: "Multi-source BFS from all rotten oranges simultaneously. Each BFS level = 1 minute. Track fresh count — if any remain after BFS, return -1.",
    recognize: [
      "Multiple rotten oranges can exist simultaneously and all spread at the same time each minute — that's multiple starting points expanding in lockstep, the definition of multi-source BFS.",
      "\"Minutes until no fresh orange remains\" wants a time/level count, and BFS's natural level-by-level expansion IS elapsed time here.",
      "The -1 case (\"impossible\") means some fresh oranges are unreachable — detectable simply by checking if any fresh count remains after the BFS finishes.",
      "→ These clues say: multi-source BFS starting from every rotten orange at once, incrementing minutes per BFS level, checking leftover fresh count at the end.",
    ],
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
    lineByLine: [
      "`if (grid[i][j]==2) q.push({i,j}); else if (grid[i][j]==1) fresh++;` — seed BFS with every rotten orange at once, count fresh oranges to check later.",
      "`while (!q.empty()&&fresh>0) { mins++; ... }` — one loop iteration processes one wave of rot, each wave is one minute.",
      "`for (int sz=q.size();sz>0;sz--) { auto [x,y]=q.front();q.pop(); ... }` — snapshot queue size so this loop processes exactly this minute's oranges.",
      "`if (nx<0||ny<0||nx>=m||ny>=n||grid[nx][ny]!=1) continue;` — only spread to cells that are actually fresh.",
      "`grid[nx][ny]=2; fresh--; q.push({nx,ny});` — rot this neighbor, decrement fresh count, queue it to spread next.",
      "`return fresh==0?mins:-1;` — all rotted means return elapsed minutes, leftover fresh means some are isolated.",
    ],
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
    statement: "You are given an m x n grid where each cell is either -1 (a wall), 0 (a gate), or a very large number representing an empty room. Fill each empty room with the distance to its nearest gate, moving only through empty rooms (walls block movement); rooms that cannot reach any gate keep their large value. Modify the grid in place.",
    examples: [{"input":"rooms = [[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]","output":"[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]"},{"input":"rooms = [[-1]]","output":"[[-1]]"}],
    constraints: ["1 <= rooms.length, rooms[i].length <= 250","rooms[i][j] is -1, 0, or 2^31 - 1"],
    intuition: "Multi-source BFS from all gates (value 0) simultaneously. Distance flows outward — each room gets shortest distance to nearest gate naturally.",
    recognize: [
      "\"Distance to its NEAREST gate\" with potentially many gates is a multi-source shortest-path question, same family as rotting-oranges.",
      "Walls block movement entirely (not just add cost), so this is unweighted shortest path through open cells only — BFS finds that in one pass instead of Dijkstra.",
      "Modifying the grid in place with the running distance also serves as the visited marker, avoiding a separate visited structure.",
      "→ These clues say: multi-source BFS starting from every gate simultaneously, writing distance = parent's distance + 1 as rooms are first visited.",
    ],
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
    lineByLine: [
      "`for (int i=0;i<m;i++) for (int j=0;j<n;j++) if (rooms[i][j]==0) q.push({i,j});` — seed BFS with every gate at once so the first wave to reach a room is from the nearest gate.",
      "`while (!q.empty()) { auto [x,y]=q.front();q.pop(); ... }` — plain BFS expansion, distance stored per-cell instead of by level.",
      "`if (nx<0||ny<0||nx>=m||ny>=n||rooms[nx][ny]!=INT_MAX) continue;` — skip out-of-bounds, walls, and already-computed rooms, reusing the grid as the visited-set.",
      "`rooms[nx][ny]=rooms[x][y]+1; q.push({nx,ny});` — first visit is always the shortest path, so lock in the distance now.",
    ],
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
    statement: "Given an array of distinct positive integers and a target integer, find all unique combinations where the chosen numbers sum exactly to the target. The same number from the array may be reused an unlimited number of times in a combination, and combinations that use the same numbers in a different order should only be counted once.",
    examples: [{"input":"candidates = [2,3,6,7], target = 7","output":"[[2,2,3],[7]]","explanation":"2+2+3 = 7 and 7 = 7 are the only combinations that sum to the target."},{"input":"candidates = [2,3,5], target = 8","output":"[[2,2,2,2],[2,3,3],[3,5]]"}],
    constraints: ["1 <= candidates.length <= 30","2 <= candidates[i] <= 40","All elements of candidates are distinct","1 <= target <= 40"],
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
    lineByLine: [
      "`function<void(int,int)> bt=[&](int i,int rem){` — i is the earliest usable candidate, rem is sum still needed.",
      "`if (rem==0){res.push_back(cur);return;}` — hit the target exactly, save this combination.",
      "`if (rem<0||i>=(int)candidates.size()) return;` — overshot the target or ran out of candidates, abandon.",
      "`cur.push_back(candidates[i]); bt(i,rem-candidates[i]); cur.pop_back();` — reuse candidates[i] again by recursing at the same index.",
      "`bt(i+1,rem);` — skip further copies of candidates[i], move on to the next index.",
      "`bt(0,target); return res;` — start the search with the full target and all candidates.",
    ],
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
    statement: "Given a collection of candidate numbers (which may contain duplicates) and a target value, find all unique combinations where the chosen numbers sum to the target. Each number from the input may be used at most once per combination, and the result must not contain duplicate combinations.",
    examples: [{"input":"candidates = [10,1,2,7,6,1,5], target = 8","output":"[[1,1,6],[1,2,5],[1,7],[2,6]]"},{"input":"candidates = [2,5,2,1,2], target = 5","output":"[[1,2,2],[5]]"}],
    constraints: ["1 <= candidates.length <= 100","1 <= candidates[i] <= 50","1 <= target <= 30"],
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
    lineByLine: [
      "`sort(c.begin(),c.end());` — groups duplicates together, enabling the skip below and early loop exit.",
      "`function<void(int,int)> bt=[&](int start,int rem){` — start is the earliest index still pickable, rem is sum left.",
      "`if (rem==0){res.push_back(cur);return;}` — exact match found, record this combination.",
      "`for (int j=start;j<(int)c.size()&&c[j]<=rem;j++){` — try each candidate from start on, stop once it would overshoot.",
      "`if (j>start&&c[j]==c[j-1]) continue;` — skip a repeated value only when it isn't the first pick at this level.",
      "`cur.push_back(c[j]); bt(j+1,rem-c[j]); cur.pop_back();` — include c[j] once, recurse past it, then undo.",
      "`bt(0,target); return res;` — start the search over the full sorted array and target.",
    ],
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
    statement: "You are given an array of distinct integers. Return every possible ordering (permutation) of the array's elements, in any order.",
    examples: [{"input":"nums = [1,2,3]","output":"[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"},{"input":"nums = [0,1]","output":"[[0,1],[1,0]]"},{"input":"nums = [1]","output":"[[1]]"}],
    constraints: ["1 <= nums.length <= 6","-10 <= nums[i] <= 10","All the integers of nums are unique"],
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
    lineByLine: [
      "`vector<bool> used(n,false);` — tracks which indices are already placed in the current permutation.",
      "`if ((int)cur.size()==n){res.push_back(cur);return;}` — all n elements placed, save this complete ordering.",
      "`for (int i=0;i<n;i++){ if (used[i]) continue;` — scan every index each call since order matters, not just subset.",
      "`used[i]=true; cur.push_back(nums[i]); bt();` — place nums[i] and recurse to fill the remaining positions.",
      "`cur.pop_back(); used[i]=false;` — backtrack: remove nums[i] so it can be tried in a different position.",
      "`bt(); return res;` — start empty; res collects all n! orderings.",
    ],
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
    statement: "Given a string of digits from 2 through 9, using the same letter mapping found on a telephone keypad, return every possible letter combination that the digits could represent. Return the combinations in any order.",
    examples: [{"input":"digits = \"23\"","output":"[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"},{"input":"digits = \"\"","output":"[]"},{"input":"digits = \"2\"","output":"[\"a\",\"b\",\"c\"]"}],
    constraints: ["0 <= digits.length <= 4","digits[i] is a digit in the range ['2','9']"],
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
    lineByLine: [
      "`if (digits.empty()) return {};` — no combinations exist for an empty input, handle it explicitly.",
      "`vector<string> phone={\"\",\"\",\"abc\",...,\"wxyz\"};` — index directly by digit value, 0/1 slots unused.",
      "`function<void(int,string)> bt=[&](int i,string s){` — i is the digit being expanded, s is the built prefix.",
      "`if (i==(int)digits.size()){res.push_back(s);return;}` — every digit has contributed a letter, s is complete.",
      "`for (char c:phone[digits[i]-'0']) bt(i+1,s+c);` — branch per letter, passing s+c by value needs no manual undo.",
      "`bt(0,\"\"); return res;` — start expanding from digit 0 with nothing chosen yet.",
    ],
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
    statement: "The n-queens puzzle asks you to place n chess queens on an n x n board so that no two queens threaten each other (no shared row, column, or diagonal). Return all distinct board arrangements that satisfy this, each represented as a list of strings where 'Q' marks a queen and '.' marks an empty square.",
    examples: [{"input":"n = 4","output":"[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]"},{"input":"n = 1","output":"[[\"Q\"]]"}],
    constraints: ["1 <= n <= 9"],
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
    lineByLine: [
      "`unordered_set<int> cols,diag,anti;` — tracks attacked columns and both diagonals (row-col, row+col).",
      "`if (row==n){res.push_back(board);return;}` — a queen placed safely in every row means a valid solution.",
      "`for (int col=0;col<n;col++){ if (cols.count(col)||diag.count(row-col)||anti.count(row+col)) continue;` — try only columns not already attacked.",
      "`board[row][col]='Q'; cols.insert(col);diag.insert(row-col);anti.insert(row+col); bt(row+1);` — place the queen and recurse to the next row.",
      "`board[row][col]='.'; cols.erase(col);diag.erase(row-col);anti.erase(row+col);` — backtrack, clearing this placement's attack lines.",
      "`bt(0); return res;` — start placing queens from row 0 with no constraints yet.",
    ],
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
    statement: "Given a 2D grid of letters and a target word, determine whether the word can be traced out by moving between horizontally or vertically adjacent cells, where the same cell may not be reused within one path. Return true if such a path spelling the word exists, false otherwise.",
    examples: [{"input":"board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"","output":"true"},{"input":"board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"","output":"true"},{"input":"board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"","output":"false","explanation":"The letter 'B' cannot be reused, so no valid path spells ABCB."}],
    constraints: ["1 <= board.length, board[i].length <= 6","1 <= word.length <= 15","board and word consist of only lowercase and uppercase English letters"],
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
    lineByLine: [
      "`if (k==(int)w.size()) return true;` — every character has already been matched, the full word is spelled.",
      "`if (i<0||j<0||i>=(int)b.size()||j>=(int)b[0].size()||b[i][j]!=w[k]) return false;` — off the board or the letter doesn't match w[k].",
      "`char tmp=b[i][j]; b[i][j]='#';` — mark the cell used so recursive calls can't walk back onto it.",
      "`bool ok=dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);` — try extending the path in all 4 directions.",
      "`b[i][j]=tmp; return ok;` — backtrack: restore the letter so other branches can reuse this cell.",
      "`for (int i...) for (int j...) if (dfs(board,word,i,j,0)) return true;` — the word could start anywhere, try every cell.",
    ],
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
    statement: "Given a string s, split it into one or more substrings such that every substring is a palindrome. Return every possible such partitioning of s.",
    examples: [{"input":"s = \"aab\"","output":"[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]"},{"input":"s = \"a\"","output":"[[\"a\"]]"}],
    constraints: ["1 <= s.length <= 16","s consists of only lowercase English letters"],
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
    lineByLine: [
      "`dp[i][j]=s[i]==s[j]&&(j-i<=2||dp[i+1][j-1]);` — s[i..j] is a palindrome if ends match and the inner part is too.",
      "`function<void(int)> bt=[&](int start){` — start marks how much of the string is already partitioned.",
      "`if (start==n){res.push_back(cur);return;}` — the whole string is consumed by palindromic pieces, save it.",
      "`for (int end=start;end<n;end++){ if (!dp[start][end]) continue;` — try every next piece, skip non-palindromes via the table.",
      "`cur.push_back(s.substr(start,end-start+1)); bt(end+1); cur.pop_back();` — take this piece, recurse on the rest, then undo.",
      "`bt(0); return res;` — start with nothing partitioned yet.",
    ],
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
    statement: "This is a variation of the classic house-robbing problem where the houses are arranged in a circle, so the first and last houses are also considered adjacent. Given the array nums of money stored in each house, return the maximum amount you can rob without robbing two adjacent houses, taking the circular arrangement into account.",
    examples: [{"input":"nums = [2,3,2]","output":"3","explanation":"Robbing houses 0 and 2 is not allowed since they are adjacent in the circle, so the best choice is house 1 alone."},{"input":"nums = [1,2,3,1]","output":"4","explanation":"Rob houses 0 and 2 for 1 + 3 = 4; house 3 cannot also be robbed since it is adjacent to house 0."},{"input":"nums = [1,2,3]","output":"3"}],
    constraints: ["1 <= nums.length <= 100","0 <= nums[i] <= 1000"],
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
    lineByLine: [
      "`int rob(vector<int>& nums, int l, int r)` — plain House Robber I over just range [l, r].",
      "`int prev2 = 0, prev1 = 0; for (int i = l; i <= r; i++)` — same rolling DP, scoped to start at l.",
      "`int curr = max(prev2 + nums[i], prev1); prev2 = prev1; prev1 = curr;` — rob or skip this house, slide forward.",
      "`if (n == 1) return nums[0];` — only one house, no adjacency to worry about.",
      "`return max(rob(nums, 0, n-2), rob(nums, 1, n-1));` — circle forbids robbing both ends, so try excluding each end and take the better.",
    ],
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
    statement: "You are given an array of non-negative integers where each value represents the maximum number of steps you can advance forward from that position. Starting at index 0, determine whether it is possible to reach the last index.",
    examples: [{"input":"nums = [2,3,1,1,4]","output":"true","explanation":"Jump 1 step from index 0 to index 1, then 3 steps to the last index."},{"input":"nums = [3,2,1,0,4]","output":"false","explanation":"Every path gets stuck at index 3, whose value is 0, so index 4 is unreachable."}],
    constraints: ["1 <= nums.length <= 10^4","0 <= nums[i] <= 10^5"],
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
    lineByLine: [
      "`int maxReach = 0;` — the farthest index reachable using jumps decided so far.",
      "`for (int i = 0; i < (int)nums.size(); i++) {` — walk forward one index at a time.",
      "`if (i > maxReach) return false;` — this index is beyond anything reachable, we're stuck.",
      "`maxReach = max(maxReach, i + nums[i]);` — from i, update how far a jump could reach.",
      "`return true;` — no unreachable index was ever found, so the end is covered.",
    ],
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
    statement: "Given an array of non-negative integers where each value is the farthest you may jump forward from that index, and assuming the last index is always reachable from index 0, return the minimum number of jumps needed to reach the last index.",
    examples: [{"input":"nums = [2,3,1,1,4]","output":"2","explanation":"Jump from index 0 to index 1 (value 3), then from index 1 to index 4."},{"input":"nums = [2,3,0,1,4]","output":"2","explanation":"Jump from index 0 to index 1, then directly from index 1 to index 4 since its value is 3."}],
    constraints: ["1 <= nums.length <= 10^4","0 <= nums[i] <= 1000","It is guaranteed the last index is reachable"],
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
    lineByLine: [
      "`int jumps = 0, curEnd = 0, farthest = 0;` — curEnd bounds the current jump's range, farthest is the best next reach.",
      "`for (int i = 0; i < (int)nums.size() - 1; i++) {` — stop one short of the last index, no jump needed once reachable.",
      "`farthest = max(farthest, i + nums[i]);` — track the best next-level reach from anywhere in the current range.",
      "`if (i == curEnd) { jumps++; curEnd = farthest; }` — range exhausted, commit to a jump and extend to the farthest seen.",
      "`return jumps;` — jumps counts how many times we were forced to advance the range.",
    ],
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
    statement: "There are n gas stations arranged in a circle, each with a given amount of gas and a given cost to travel to the next station. Starting with an empty tank at some station, determine the index of the unique station from which you can complete the full circuit, or return -1 if no such station exists.",
    examples: [{"input":"gas = [1,2,3,4,5], cost = [3,4,5,1,2]","output":"3","explanation":"Starting at station 3, the tank never goes negative while completing the loop."},{"input":"gas = [2,3,4], cost = [3,4,3]","output":"-1","explanation":"Total gas (9) is less than total cost (10), so completing the circuit is impossible from any station."}],
    constraints: ["n == gas.length == cost.length","1 <= n <= 10^5","0 <= gas[i], cost[i] <= 10^4"],
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
    lineByLine: [
      "`int total = 0, tank = 0, start = 0;` — total checks feasibility overall, tank tracks the current candidate's fuel.",
      "`int diff = gas[i] - cost[i]; total += diff; tank += diff;` — net gas at this station feeds both running totals.",
      "`if (tank < 0) { start = i + 1; tank = 0; }` — a negative tank means no station up to i could start the circuit either, try i+1.",
      "`return total >= 0 ? start : -1;` — enough total gas means `start` is the answer, otherwise no station works.",
    ],
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
    statement: "You are running a lemonade stand where each lemonade costs $5. Customers arrive one at a time (given as an array of bills, each either $5, $10, or $20) and pay with one bill each; you must give back the correct change using only the bills you currently hold, starting with no money at all. Determine whether you can serve every customer in order while always being able to provide exact change.",
    examples: [{"input":"bills = [5,5,5,10,20]","output":"true","explanation":"Each customer can be given correct change using the $5 and $10 bills collected so far."},{"input":"bills = [5,5,10,10,20]","output":"false","explanation":"By the time the second $10 customer and the $20 customer arrive, there aren't enough $5 bills left to make change."},{"input":"bills = [5,5,10]","output":"true"}],
    constraints: ["1 <= bills.length <= 10^5","bills[i] is either 5, 10, or 20"],
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
    lineByLine: [
      "`int five = 0, ten = 0;` — only $5 and $10 counts matter for change; $20 bills are never usable as change.",
      "`if (b == 5) five++;` — a $5 payment needs no change, just adds to the till.",
      "`else if (b == 10) { if (!five) return false; five--; ten++; }` — a $10 payment needs one $5 back, fail if none.",
      "`if (ten && five) { ten--; five--; }` — for $20, prefer one $10+$5 as change to conserve scarce $5 bills.",
      "`else if (five >= 3) five -= 3;` — fall back to three $5s only when no $10 is available.",
      "`else return false;` — neither change combination is available, this customer can't be served.",
      "`return true;` — every customer received exact change using only currently held bills.",
    ],
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
    statement: "You are given an array where each element is the stock price on that day. You may buy and sell the stock any number of times, but you must sell before you buy again, and you cannot hold more than one share at a time. Return the maximum total profit achievable.",
    examples: [{"input":"prices = [7,1,5,3,6,4]","output":"7","explanation":"Buy on day 2 (price 1), sell on day 3 (price 5) for profit 4, then buy on day 4 (price 3) and sell on day 5 (price 6) for profit 3."},{"input":"prices = [1,2,3,4,5]","output":"4","explanation":"Buy on day 1 and sell on day 5, or accumulate the same total by buying/selling each consecutive day."},{"input":"prices = [7,6,4,3,1]","output":"0","explanation":"Prices only fall, so no transaction is profitable."}],
    constraints: ["1 <= prices.length <= 3 * 10^4","0 <= prices[i] <= 10^4"],
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
    lineByLine: [
      "`int profit = 0;` — accumulates every profitable single-day trade found along the way.",
      "`for (...) if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];` — capture every upward move as its own tiny trade.",
      "`return profit;` — the total of all upward steps equals the maximum achievable profit.",
    ],
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
    statement: "You are given a list of non-overlapping intervals sorted by start time, along with a new interval to add. Insert the new interval into the list, merging any intervals that overlap as a result, and return the final sorted list of non-overlapping intervals.",
    examples: [{"input":"intervals = [[1,3],[6,9]], newInterval = [2,5]","output":"[[1,5],[6,9]]","explanation":"The new interval [2,5] overlaps [1,3], merging into [1,5]."},{"input":"intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]","output":"[[1,2],[3,10],[12,16]]","explanation":"The new interval merges with [3,5], [6,7], and [8,10] into one interval [3,10]."}],
    constraints: ["0 <= intervals.length <= 10^4","intervals is sorted by start time and non-overlapping","0 <= starti <= endi <= 10^5"],
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
    lineByLine: [
      "`while (...intervals[i][1] < newInterval[0]) res.push_back(intervals[i++]);` — copy intervals that end before newInterval starts.",
      "`while (i < n && intervals[i][0] <= newInterval[1])` — keep absorbing intervals that overlap newInterval.",
      "`newInterval[0] = min(...); newInterval[1] = max(...); i++;` — grow newInterval to cover the absorbed interval.",
      "`res.push_back(newInterval);` — commit the fully merged interval once nothing more overlaps.",
      "`while (i < n) res.push_back(intervals[i++]);` — append the remaining untouched intervals.",
    ],
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
    statement: "Given an array of meeting time intervals, each with a start and end time, determine whether a single person could attend every meeting without any two meetings overlapping in time.",
    examples: [{"input":"intervals = [[0,30],[5,10],[15,20]]","output":"false","explanation":"The interval [0,30] overlaps with both [5,10] and [15,20]."},{"input":"intervals = [[7,10],[2,4]]","output":"true","explanation":"The two meetings don't overlap once sorted: [2,4] ends before [7,10] begins."}],
    constraints: ["0 <= intervals.length <= 10^4","0 <= starti < endi <= 10^6"],
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
    lineByLine: [
      "`sort(intervals.begin(), intervals.end());` — after sorting, only adjacent pairs can overlap.",
      "`for (int i = 1; i < (int)intervals.size(); i++)` — compare each meeting to the one before it.",
      "`if (intervals[i][0] < intervals[i-1][1]) return false;` — starting before the previous ends means a conflict.",
      "`return true;` — no consecutive overlap means no overlap anywhere.",
    ],
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
    statement: "Given an array of meeting time intervals, each with a start and end time, determine the minimum number of meeting rooms required so that all meetings can be held without conflicts.",
    examples: [{"input":"intervals = [[0,30],[5,10],[15,20]]","output":"2","explanation":"The meeting [0,30] overlaps with [5,10] and separately with [15,20], but the latter two never overlap each other, so 2 rooms suffice."},{"input":"intervals = [[7,10],[2,4]]","output":"1","explanation":"The meetings don't overlap, so they can share a single room."}],
    constraints: ["1 <= intervals.length <= 10^4","0 <= starti < endi <= 10^6"],
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
    lineByLine: [
      "`sort(intervals.begin(), intervals.end());` — process meetings in start-time order.",
      "`priority_queue<int, vector<int>, greater<int>> minHeap;` — min-heap of occupied rooms' end times, soonest-free on top.",
      "`if (!minHeap.empty() && minHeap.top() <= iv[0]) minHeap.pop();` — reuse a room if it's already free by this meeting's start.",
      "`minHeap.push(iv[1]);` — assign this meeting a room; heap size tracks rooms in use.",
      "`return minHeap.size();` — final size is the peak overlap, the minimum rooms needed.",
    ],
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
    statement: "Given a hand of cards represented as an array of integers and a group size, determine whether the cards can be rearranged into groups of that exact size where each group consists of consecutive values with no gaps.",
    examples: [{"input":"hand = [1,2,3,6,2,3,4,7,8], groupSize = 3","output":"true","explanation":"The cards can be split into the runs [1,2,3], [2,3,4], and [6,7,8]."},{"input":"hand = [1,2,3,4,5], groupSize = 4","output":"false","explanation":"The 5 cards cannot be evenly divided into groups of 4 consecutive values."}],
    constraints: ["1 <= hand.length <= 10^4","0 <= hand[i] <= 10^9","1 <= groupSize <= hand.length"],
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
    lineByLine: [
      "`if (hand.size() % groupSize != 0) return false;` — cards must split evenly into groups, an uneven total is impossible.",
      "`map<int,int> cnt; for (int c : hand) cnt[c]++;` — an ordered map keeps card values sorted ascending.",
      "`for (auto& [start, _] : cnt) { int freq = cnt[start]; if (!freq) continue;` — process smallest remaining card first, skip already-used values.",
      "`for (int i = 0; i < groupSize; i++) { if (cnt[start+i] < freq) return false; cnt[start+i] -= freq; }` — the smallest card must start `freq` runs, consume that many of each following value.",
      "`return true;` — every card was assigned into a consecutive run of the required size.",
    ],
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
    statement: "Given a string of lowercase letters, split it into as many contiguous parts as possible such that each letter appears in at most one part. Return the lengths of these parts in order.",
    examples: [{"input":"s = \"ababcbacadefegdehijhklij\"","output":"[9,7,8]","explanation":"The string splits into \"ababcbaca\", \"defegde\", and \"hijhklij\", each containing letters that don't appear in any other part."},{"input":"s = \"abac\"","output":"[4]","explanation":"Since 'a' reappears at the last position before 'c' finishes, the whole string forms a single part."},{"input":"s = \"eccbbbbdec\"","output":"[10]"}],
    constraints: ["1 <= s.length <= 500","s consists of lowercase English letters only"],
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
    lineByLine: [
      "`int last[26] = {}; for (...) last[s[i]-'a'] = i;` — precompute each letter's last index in the string.",
      "`int start = 0, end = 0;` — start begins the current partition, end is how far it must extend.",
      "`for (...) { end = max(end, last[s[i]-'a']);` — extend end to cover this character's last occurrence.",
      "`if (i == end) { res.push_back(end-start+1); start = end+1; }` — scan caught up to end, close the partition here.",
      "`return res;` — res holds the length of each maximal partition in order.",
    ],
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
    statement: "Given an array containing n distinct numbers taken from the range [0, n], find the one number in that range that is missing from the array.",
    examples: [{"input":"nums = [3,0,1]","output":"2","explanation":"n = 3, the range is [0,3], and 2 is the value not present in the array."},{"input":"nums = [0,1]","output":"2"},{"input":"nums = [9,6,4,2,3,5,7,0,1]","output":"8"}],
    constraints: ["n == nums.length","1 <= n <= 10^4","0 <= nums[i] <= n","All the numbers in nums are unique"],
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
    lineByLine: [
      "`int n = nums.size();` — the range [0, n] has n+1 values, one of which is missing.",
      "`n*(n+1)/2` — the sum of every integer from 0 to n if nothing were missing.",
      "`accumulate(nums.begin(), nums.end(), 0)` — the actual sum of numbers present.",
      "`return n*(n+1)/2 - accumulate(...);` — expected sum minus actual sum isolates the missing value.",
    ],
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
    statement: "Given an integer n, return an array ans of length n + 1 where ans[i] is the number of 1 bits in the binary representation of i, for every i from 0 to n.",
    examples: [{"input":"n = 2","output":"[0,1,1]","explanation":"0 -> 0, 1 -> 1, 2 -> 10, which has one 1 bit."},{"input":"n = 5","output":"[0,1,1,2,1,2]"}],
    constraints: ["0 <= n <= 10^5"],
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
    lineByLine: [
      "`vector<int> dp(n+1, 0);` — dp[i] holds the popcount of i; dp[0] = 0 is already correct.",
      "`for (int i = 1; i <= n; i++) dp[i] = dp[i>>1] + (i&1);` — drop the last bit (i>>1), reuse its known count, add back the dropped bit.",
      "`return dp;` — bit-count for every integer 0..n, built in O(n) total.",
    ],
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
    statement: "Given a 32-bit unsigned integer, return the number of bits set to 1 in its binary representation (its Hamming weight).",
    examples: [{"input":"n = 00000000000000000000000000001011","output":"3","explanation":"The binary form has three 1 bits."},{"input":"n = 00000000000000000000000010000000","output":"1"},{"input":"n = 11111111111111111111111111111101","output":"31"}],
    constraints: ["The input is a 32-bit unsigned binary representation of an integer","0 <= n <= 2^32 - 1"],
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
    lineByLine: [
      "`int cnt = 0;` — tallies how many 1 bits get cleared.",
      "`while (n) { n &= n-1; cnt++; }` — n & (n-1) clears the lowest set bit each iteration.",
      "`return cnt;` — total 1 bits cleared, the Hamming weight of n.",
    ],
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
    statement: "Given a 32-bit unsigned integer, reverse the order of its bits and return the resulting unsigned integer.",
    examples: [{"input":"n = 00000010100101000001111010011100","output":"964176192","explanation":"Reversing the 32 bits gives 00111001011110000010100101000000, which equals 964176192."},{"input":"n = 11111111111111111111111111111101","output":"3221225471","explanation":"Reversing the 32 bits gives 10111111111111111111111111111111, which equals 3221225471."}],
    constraints: ["The input is a binary string of exactly 32 characters","Represents an unsigned 32-bit integer"],
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
    lineByLine: [
      "`uint32_t res = 0;` — accumulates the bits of n in reverse order.",
      "`for (int i = 0; i < 32; i++)` — a fixed-width integer always has 32 bits.",
      "`res = (res << 1) | (n & 1);` — shift res left, insert n's lowest bit at the bottom.",
      "`n >>= 1;` — drop the bit just consumed so the next iteration reads the next one.",
      "`return res;` — every bit of n placed in mirrored position, yielding the reversal.",
    ],
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
    statement: "Given an integer n, determine whether it is a power of two (that is, whether it can be written as 2 raised to some non-negative integer exponent). Return true if so, false otherwise.",
    examples: [{"input":"n = 1","output":"true","explanation":"2^0 = 1."},{"input":"n = 16","output":"true","explanation":"2^4 = 16."},{"input":"n = 3","output":"false"}],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
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
    lineByLine: [
      "`n > 0` — powers of two are positive; also excludes n=0, which would pass the bit trick vacuously.",
      "`(n & (n-1)) == 0` — a power of two has exactly one set bit, which n-1 clears, so the AND is zero only then.",
    ],
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
    statement: "Given two integers a and b, return their sum without using the '+' or '-' operators, relying instead on bitwise operations.",
    examples: [{"input":"a = 1, b = 2","output":"3"},{"input":"a = 2, b = 3","output":"5"}],
    constraints: ["-1000 <= a, b <= 1000"],
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
    lineByLine: [
      "`while (b)` — repeat until there's no carry left to add.",
      "`int carry = (a & b) << 1;` — AND finds shared 1 bits, shifted left to the position they carry into.",
      "`a = a ^ b;` — XOR adds a and b at each bit, ignoring carries.",
      "`b = carry;` — the carry becomes the new value to fold in next iteration.",
      "`return a;` — once the carry reaches 0, a holds the full sum.",
    ],
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
    statement: "A message made only of digits was encoded by mapping the letters 'A' to 'Z' to the numbers '1' to '26'. Given the encoded string s, return the number of distinct ways it can be decoded back into letters; if s contains an invalid arrangement of digits (such as a leading zero that can't map to any letter), return 0.",
    examples: [{"input":"s = \"12\"","output":"2","explanation":"\"12\" can be decoded as \"AB\" (1 2) or \"L\" (12)."},{"input":"s = \"226\"","output":"3","explanation":"\"226\" can be decoded as \"BZ\" (2 26), \"VF\" (22 6), or \"BBF\" (2 2 6)."},{"input":"s = \"06\"","output":"0","explanation":"A leading zero cannot be decoded on its own or combined validly, so there are no valid decodings."}],
    constraints: ["1 <= s.length <= 100","s consists only of digit characters '0'-'9'"],
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
    lineByLine: [
      "`vector<int> dp(n+1, 0); dp[0] = 1;` — dp[i] counts decodings of the first i chars; empty prefix has 1 way.",
      "`dp[1] = s[0] != '0' ? 1 : 0;` — first char alone is decodable only if not '0'.",
      "`for (int i = 2; i <= n; i++)` — build each answer from decoding the last 1 or 2 digits.",
      "`int one = ...; int two = ...;` — extract the last digit and last two digits as candidate letters.",
      "`if (one >= 1) dp[i] += dp[i-1];` — last digit alone is a valid letter, extend that count.",
      "`if (two >= 10 && two <= 26) dp[i] += dp[i-2];` — last two digits form a valid letter, add that count too.",
      "`return dp[n];` — total decodings of the whole string.",
    ],
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
    statement: "A robot sits at the top-left corner of an m x n grid and wants to reach the bottom-right corner. At every step the robot may only move one cell to the right or one cell down. Count the total number of distinct paths from the start to the destination.",
    examples: [{"input":"m = 3, n = 7","output":"28"},{"input":"m = 3, n = 2","output":"3","explanation":"The three paths are Down-Down-Right, Down-Right-Down, and Right-Down-Down."},{"input":"m = 1, n = 1","output":"1"}],
    constraints: ["1 <= m, n <= 100","The answer fits comfortably in a 32-bit integer"],
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
    lineByLine: [
      "`vector<vector<int>> dp(m, vector<int>(n, 1));` — first row/col each have exactly one path, so seed them at 1.",
      "`for (int i = 1; i < m; i++) for (int j = 1; j < n; j++)` — only interior cells need real computation.",
      "`dp[i][j] = dp[i-1][j] + dp[i][j-1];` — paths to (i,j) come only from above or from the left.",
      "`return dp[m-1][n-1];` — accumulated count of every distinct path to the destination.",
    ],
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
    statement: "Given an m x n grid filled with non-negative integers, find a path from the top-left cell to the bottom-right cell that minimizes the sum of all numbers along it. From any cell you may only move either down or right.",
    examples: [{"input":"grid = [[1,3,1],[1,5,1],[4,2,1]]","output":"7","explanation":"The path 1 -> 3 -> 1 -> 1 -> 1 minimizes the sum."},{"input":"grid = [[1,2,3],[4,5,6]]","output":"12"}],
    constraints: ["1 <= m, n <= 200","0 <= grid[i][j] <= 100"],
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
    lineByLine: [
      "`if (!i && !j) continue;` — skip the start cell, it has no predecessor to add from.",
      "`int up = ...; int left = ...;` — missing edge neighbors are forced to INT_MAX so min() ignores them.",
      "`grid[i][j] += min(up, left);` — add the cheaper of the two predecessors, reusing grid as the dp table.",
      "`return grid[m-1][n-1];` — holds the minimum path sum for the whole grid.",
    ],
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
    statement: "Given two strings text1 and text2, return the length of their longest common subsequence, that is, the longest sequence of characters that appears in both strings in the same relative order but not necessarily contiguously. If no common subsequence exists, return 0.",
    examples: [{"input":"text1 = \"abcde\", text2 = \"ace\"","output":"3","explanation":"The longest common subsequence is \"ace\"."},{"input":"text1 = \"abc\", text2 = \"abc\"","output":"3"},{"input":"text1 = \"abc\", text2 = \"def\"","output":"0"}],
    constraints: ["1 <= text1.length, text2.length <= 1000","text1 and text2 consist of lowercase English characters only"],
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
    lineByLine: [
      "`vector<vector<int>> dp(m+1, vector<int>(n+1, 0));` — dp[i][j] is LCS length of the first i and j chars; empty prefixes give 0.",
      "`for (int i = 1; i <= m; i++) for (int j = 1; j <= n; j++)` — fill in order since each cell needs smaller indices only.",
      "`s1[i-1]==s2[j-1] ? dp[i-1][j-1]+1` — matching chars extend the LCS found without either of them.",
      "`: max(dp[i-1][j],dp[i][j-1]);` — otherwise take the better of dropping either character.",
      "`return dp[m][n];` — full comparison of text1 vs text2.",
    ],
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
    statement: "Given an integer array nums, find the length of the longest strictly increasing subsequence, where a subsequence is formed by deleting zero or more elements without changing the relative order of the remaining ones.",
    examples: [{"input":"nums = [10,9,2,5,3,7,101,18]","output":"4","explanation":"One longest increasing subsequence is [2,3,7,101], which has length 4."},{"input":"nums = [0,1,0,3,2,3]","output":"4","explanation":"One longest increasing subsequence is [0,1,2,3]."},{"input":"nums = [7,7,7,7]","output":"1"}],
    constraints: ["1 <= nums.length <= 2500","-10^4 <= nums[i] <= 10^4"],
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
    lineByLine: [
      "`vector<int> tails;` — tails[k] holds the smallest ending value for an increasing subsequence of length k+1.",
      "`auto it = lower_bound(tails.begin(), tails.end(), n);` — binary search the sorted tails for the first value >= n.",
      "`if (it == tails.end()) tails.push_back(n);` — n beats every tail, so it extends the longest subsequence found.",
      "`else *it = n;` — otherwise n lowers that length's ending value, giving future numbers a smaller bar to beat.",
      "`return tails.size();` — grows only on a genuinely longer subsequence, so it equals the LIS length.",
    ],
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
    statement: "Given a string s, find and return the longest contiguous substring of s that reads the same forwards and backwards. If multiple substrings of the same maximum length qualify, returning any one of them is acceptable.",
    examples: [{"input":"s = \"babad\"","output":"\"bab\"","explanation":"\"aba\" is also a valid answer of the same length."},{"input":"s = \"cbbd\"","output":"\"bb\""},{"input":"s = \"a\"","output":"\"a\""}],
    constraints: ["1 <= s.length <= 1000","s consists only of digits and English letters"],
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
    lineByLine: [
      "`int n = s.size(), start = 0, maxLen = 1;` — track best (start, length); any single char is a palindrome of length 1.",
      "`auto expand = [&](int l, int r)` — grows outward from a candidate center, updating the running best.",
      "`while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }` — expand while both sides stay in bounds and match.",
      "`if (r - l - 1 > maxLen) { maxLen = r-l-1; start = l+1; }` — loop overshoots by one, so record the true span if it's longer.",
      "`for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }` — try both odd-length and even-length centers at each index.",
      "`return s.substr(start, maxLen);` — describes the overall longest palindrome found.",
    ],
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
    statement: "Given a string s, count how many contiguous substrings of s are palindromes, counting substrings that occur at different positions separately even if the text is identical.",
    examples: [{"input":"s = \"abc\"","output":"3","explanation":"The palindromic substrings are \"a\", \"b\", and \"c\"."},{"input":"s = \"aaa\"","output":"6","explanation":"The palindromic substrings are \"a\", \"a\", \"a\", \"aa\", \"aa\", and \"aaa\"."},{"input":"s = \"aba\"","output":"4"}],
    constraints: ["1 <= s.length <= 1000","s consists of lowercase English letters"],
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
    lineByLine: [
      "`int n = s.size(), cnt = 0;` — cnt accumulates the count of palindromic substrings across all centers.",
      "`while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; cnt++; }` — each successful mirrored expansion step is itself one palindrome.",
      "`for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }` — try both odd-length and even-length centers at each index.",
      "`return cnt;` — running total of all palindromic substrings found.",
    ],
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
    statement: "Given two strings word1 and word2, return the minimum number of single-character insert, delete, or replace operations required to transform word1 into word2.",
    examples: [{"input":"word1 = \"horse\", word2 = \"ros\"","output":"3","explanation":"horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')."},{"input":"word1 = \"intention\", word2 = \"execution\"","output":"5"}],
    constraints: ["0 <= word1.length, word2.length <= 500","word1 and word2 consist of lowercase English letters"],
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
    lineByLine: [
      "`dp[i][0]=i; dp[0][j]=j;` — converting to/from an empty string takes that many deletions/insertions.",
      "`for (int i=1;i<=m;i++) for (int j=1;j<=n;j++)` — fill so each cell's three dependencies are already computed.",
      "`w1[i-1]==w2[j-1] ? dp[i-1][j-1]` — matching characters need no operation, cost carries over unchanged.",
      "`: 1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});` — otherwise pick the cheapest of delete, insert, or replace.",
      "`return dp[m][n];` — full word1-to-word2 transformation cost.",
    ],
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
    statement: "You are given an integer amount and an array coins representing distinct coin denominations, each available in unlimited supply. Count the number of different combinations of coins (order does not matter) that sum exactly to amount.",
    examples: [{"input":"amount = 5, coins = [1,2,5]","output":"4","explanation":"The combinations are 5, 2+2+1, 2+1+1+1, and 1+1+1+1+1."},{"input":"amount = 3, coins = [2]","output":"0"},{"input":"amount = 0, coins = [7]","output":"1"}],
    constraints: ["1 <= coins.length <= 300","1 <= coins[i] <= 5000","all coin values are distinct","0 <= amount <= 5000"],
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
    lineByLine: [
      "`vector<int> dp(amount+1, 0); dp[0] = 1;` — dp[i] counts combinations summing to i; one way to make 0 (no coins).",
      "`for (int coin : coins)` — process one whole denomination at a time so combinations aren't double-counted as different orderings.",
      "`for (int i = coin; i <= amount; i++) dp[i] += dp[i-coin];` — forward direction allows this coin to be reused within a combination.",
      "`return dp[amount];` — total distinct combinations summing to amount.",
    ],
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
    statement: "Given an integer array nums that may contain both positive and negative numbers as well as zeros, find the contiguous non-empty subarray whose elements multiply together to give the largest product, and return that product.",
    examples: [{"input":"nums = [2,3,-2,4]","output":"6","explanation":"The subarray [2,3] has the largest product, 6."},{"input":"nums = [-2,0,-1]","output":"0","explanation":"The subarray [0] gives the largest possible product since any subarray spanning across it includes a negative value or a zero."},{"input":"nums = [-2,3,-4]","output":"24"}],
    constraints: ["1 <= nums.length <= 2 * 10^4","-10 <= nums[i] <= 10","the product of any prefix or suffix of nums fits within a 32-bit integer"],
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
    lineByLine: [
      "`int maxP=nums[0], minP=nums[0], res=nums[0];` — track both max and min product ending here, since a negative can flip min into the new max.",
      "`if (nums[i]<0) swap(maxP,minP);` — a negative number flips which running product becomes larger, so swap before combining.",
      "`maxP=max(nums[i],maxP*nums[i]);` — best product ending here is this number alone or extending the previous max.",
      "`minP=min(nums[i],minP*nums[i]);` — track the smallest running product as a candidate for a future sign flip.",
      "`res=max(res,maxP);` — update the global best after every position.",
    ],
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
    statement: "Given a string s and a dictionary of strings wordDict, determine whether s can be split into a sequence of one or more space-free segments such that every segment appears in wordDict. The same dictionary word may be reused as many times as needed. Return true or false.",
    examples: [{"input":"s = \"leetcode\", wordDict = [\"leet\",\"code\"]","output":"true","explanation":"\"leetcode\" splits into \"leet\" and \"code\", both of which are in the dictionary."},{"input":"s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]","output":"false","explanation":"No combination of dictionary words can be concatenated to form \"catsandog\"."},{"input":"s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]","output":"true"}],
    constraints: ["1 <= s.length <= 300","1 <= wordDict.length <= 1000","1 <= wordDict[i].length <= 20","s and wordDict[i] consist of lowercase English letters","all strings in wordDict are unique"],
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
    lineByLine: [
      "`unordered_set<string> dict(wordDict.begin(), wordDict.end());` — hash set gives O(L) dictionary lookup per substring.",
      "`vector<bool> dp(n+1, false); dp[0] = true;` — dp[i] means the first i chars are segmentable; empty prefix trivially is.",
      "`for (int i = 1; i <= n; i++) for (int j = 0; j < i; j++)` — try every split point j for the last word in the segmentation.",
      "`if (dp[j] && dict.count(s.substr(j, i-j))) { dp[i]=true; break; }` — valid split if the prefix works and the remainder is a dictionary word.",
      "`return dp[n];` — answers the question for the entire string.",
    ],
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
    statement: "Given a non-empty array of positive integers nums, determine whether the array can be divided into two subsets such that the sum of elements in both subsets is exactly equal. Return true if such a partition exists, or false otherwise.",
    examples: [{"input":"nums = [1,5,11,5]","output":"true","explanation":"The array can be split into [1,5,5] and [11], both summing to 11."},{"input":"nums = [1,2,3,5]","output":"false","explanation":"The total sum is 11, which is odd, so it cannot be split into two equal-sum subsets."},{"input":"nums = [1,2,5]","output":"false"}],
    constraints: ["1 <= nums.length <= 200","1 <= nums[i] <= 100"],
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
    lineByLine: [
      "`int sum = accumulate(...); if (sum & 1) return false;` — an odd total can never split into two equal halves.",
      "`int target = sum / 2; vector<bool> dp(target+1, false); dp[0] = true;` — reframe as 0/1 knapsack: can a subset sum to target?",
      "`for (int n : nums) for (int j = target; j >= n; j--) dp[j] = dp[j] || dp[j-n];` — go downward so each number is used at most once per subset.",
      "`return dp[target];` — some subset hitting target means the rest sums to the other half too.",
    ],
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
    statement: "Given an array of non-negative integers nums and an integer target, you must assign either a '+' or a '-' sign in front of every number and then compute the resulting expression's sum. Count how many distinct sign assignments make this sum equal target.",
    examples: [{"input":"nums = [1,1,1,1,1], target = 3","output":"5","explanation":"There are 5 ways to assign signs so the expression evaluates to 3, e.g. -1+1+1+1+1 = 3."},{"input":"nums = [1], target = 1","output":"1"}],
    constraints: ["1 <= nums.length <= 20","0 <= nums[i] <= 1000","0 <= sum(nums) <= 1000","-1000 <= target <= 1000"],
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
    lineByLine: [
      "`int total = ...; int S = total + target;` — algebra: P - N = target and P + N = total gives P = (total+target)/2.",
      "`if (S < 0 || S & 1) return 0;` — P must be a non-negative whole number or no valid split exists.",
      "`int cap = S / 2; vector<int> dp(cap+1, 0); dp[0] = 1;` — reframe as subset sum: dp[j] counts subsets summing to j.",
      "`for (int n : nums) for (int j = cap; j >= n; j--) dp[j] += dp[j-n];` — 0/1 knapsack, each number used at most once.",
      "`return dp[cap];` — subsets summing to P equal the ways to choose which numbers get '+'.",
    ],
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
    statement: "Given an array prices where prices[i] is the price of a stock on day i, find the maximum profit achievable with as many buy/sell transactions as desired, under two rules: you may hold at most one share at a time, and after selling a share you must wait one full day (a cooldown) before buying again.",
    examples: [{"input":"prices = [1,2,3,0,2]","output":"3","explanation":"Buy on day 0, sell on day 1, cooldown on day 2, buy on day 3, sell on day 4: profit = (2-1) + (2-0) = 3."},{"input":"prices = [1]","output":"0"}],
    constraints: ["1 <= prices.length <= 5000","0 <= prices[i] <= 1000"],
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
    lineByLine: [
      "`int hold = INT_MIN, sold = 0, cool = 0;` — best profit for each state; hold starts at -infinity since you can't hold before buying.",
      "`int prevSold = sold;` — save yesterday's sold value since hold and cool both need it, not today's.",
      "`sold = hold + p;` — sell today's share, banking the previous hold profit plus this sale.",
      "`hold = max(hold, cool - p);` — keep holding, or buy today coming from cool (never same-day as a sale).",
      "`cool = max(cool, prevSold);` — stay rested, or enter cooldown the day after a sale.",
      "`return max(sold, cool);` — final answer can't end mid-hold, so only sold/cool states count.",
    ],
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
    statement: "Given an array of points on the 2D plane and an integer k, return the k points that are closest to the origin (0, 0), using ordinary Euclidean distance. The answer may be returned in any order.",
    examples: [{"input":"points = [[1,3],[-2,2]], k = 1","output":"[[-2,2]]","explanation":"The distance of (1,3) from the origin is sqrt(10) while (-2,2) is sqrt(8), so (-2,2) is closer."},{"input":"points = [[3,3],[5,-1],[-2,4]], k = 2","output":"[[3,3],[-2,4]]"}],
    constraints: ["1 <= k <= points.length <= 10^4","-10^4 <= points[i][0], points[i][1] <= 10^4"],
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
    lineByLine: [
      "`priority_queue<pair<int,int>> pq;` — max-heap keyed by squared distance, paired index recovers the point later.",
      "`int d = ...;` — squared distance skips an unnecessary sqrt, comparisons give the same order.",
      "`pq.push({d, i}); if ((int)pq.size() > k) pq.pop();` — cap the heap at k by evicting the current farthest point.",
      "`while (!pq.empty()) { res.push_back(...); pq.pop(); }` — drain the heap; what's left is the k closest points.",
    ],
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
    statement: "Given an integer array and an integer k, find the k-th largest element in the array when the elements are ranked in sorted order (the k-th largest, counting duplicates as separate entries, not the k-th distinct value).",
    examples: [{"input":"nums = [3,2,1,5,6,4], k = 2","output":"5","explanation":"Sorted descending: [6,5,4,3,2,1]; the 2nd element is 5."},{"input":"nums = [3,2,3,1,2,4,5,5,6], k = 4","output":"4"}],
    constraints: ["1 <= k <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"],
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
    lineByLine: [
      "`priority_queue<int, vector<int>, greater<int>> minHeap;` — min-heap holding the k largest numbers seen so far.",
      "`minHeap.push(n); if ((int)minHeap.size() > k) minHeap.pop();` — insert, then evict the smallest whenever the heap exceeds k.",
      "`return minHeap.top();` — smallest of the k largest is, by definition, the k-th largest.",
    ],
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
    statement: "Design a class that keeps track of the k-th largest value in a continuously growing stream of integers. The constructor receives k and an initial array of numbers, and an add method inserts a new number into the stream and returns the current k-th largest element.",
    examples: [{"input":"[\"KthLargest\",\"add\",\"add\",\"add\",\"add\"], k = 3, nums = [4,5,8,2], values to add = [3,5,10,9]","output":"[null,4,5,5,8]","explanation":"After construction the 3rd largest of {4,5,8,2} is 4; adding 3,5,10,9 one at a time updates the 3rd largest to 4, 5, 5, and 8 respectively."},{"input":"[\"KthLargest\",\"add\"], k = 1, nums = [], values to add = [-3]","output":"[null,-3]"}],
    constraints: ["1 <= k <= 10^4","0 <= nums.length <= 10^4","-10^4 <= nums[i] <= 10^4","-10^4 <= value to add <= 10^4","At least k elements will exist in the stream before a call needing the k-th largest"],
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
    lineByLine: [
      "`priority_queue<int,vector<int>,greater<int>> pq; int K;` — same min-heap-of-k-largest trick, kept as persistent state across calls.",
      "`KthLargest(...) { for (int n : nums) { pq.push(n); if (...>k) pq.pop(); } }` — seed the heap with the initial array, trimmed to size k.",
      "`pq.push(val); if ((int)pq.size()>K) pq.pop();` — add the new value, evict the smallest if oversized.",
      "`return pq.top();` — smallest of the k largest values seen is the current k-th largest.",
    ],
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
    statement: "You are given the weights of a collection of stones. Repeatedly pick the two heaviest stones and smash them together: if they have equal weight both are destroyed, otherwise the lighter one is destroyed and the heavier one's weight is reduced by the lighter one's weight and put back. Return the weight of the single stone left at the end, or 0 if none remain.",
    examples: [{"input":"stones = [2,7,4,1,8,1]","output":"1","explanation":"Smashing repeatedly: (8,7)->1, (4,2)->2, (2,1)->1, (1,1)->0, leaving a single stone of weight 1."},{"input":"stones = [1]","output":"1"}],
    constraints: ["1 <= stones.length <= 30","1 <= stones[i] <= 1000"],
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
    lineByLine: [
      "`priority_queue<int> pq(stones.begin(), stones.end());` — max-heap gives O(log n) access to the current heaviest stone.",
      "`while (pq.size() > 1)` — keep smashing while at least two stones remain.",
      "`int x = pq.top(); pq.pop(); int y = pq.top(); pq.pop();` — pull the two heaviest stones for this round.",
      "`if (x != y) pq.push(x - y);` — survivor's reduced weight goes back in; equal stones both vanish.",
      "`return pq.empty() ? 0 : pq.top();` — either everything canceled out, or one stone remains.",
    ],
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
    statement: "You are given a list of CPU tasks, each labeled with a letter, and a non-negative cooldown integer n meaning that the same task letter must be separated by at least n intervals of time. Each interval the CPU can either run one task or sit idle. Return the minimum number of intervals needed to finish all the given tasks.",
    examples: [{"input":"tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2","output":"8","explanation":"One valid ordering is A -> B -> idle -> A -> B -> idle -> A -> B, which takes 8 intervals."},{"input":"tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 0","output":"6","explanation":"With no cooldown required, tasks can run back-to-back in any order."}],
    constraints: ["1 <= tasks.length <= 10^4","tasks[i] is an uppercase English letter","0 <= n <= 100"],
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
    lineByLine: [
      "`int cnt[26] = {}; for (char c : tasks) cnt[c-'A']++;` — tally frequency per letter, since scheduling only depends on counts.",
      "`int maxFreq = *max_element(cnt, cnt+26);` — the most frequent task forces maxFreq-1 cooldown gaps.",
      "`int maxCount = count(cnt, cnt+26, maxFreq);` — ties for top frequency each fill one gap per round.",
      "`return max((int)tasks.size(), (maxFreq-1)*(n+1)+maxCount);` — idle-based formula vs. no-idle length, whichever is bigger.",
    ],
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
    statement: "Design a data structure that supports adding integers from a stream one at a time and, at any point, efficiently returning the median of all numbers added so far.",
    examples: [{"input":"addNum(1); addNum(2); findMedian(); addNum(3); findMedian()","output":"[null, null, 1.5, null, 2.0]","explanation":"After adding 1 and 2, the median of [1,2] is 1.5; after adding 3, the median of [1,2,3] is 2.0."}],
    constraints: ["-10^5 <= num <= 10^5","At most 5 * 10^4 calls will be made to addNum and findMedian combined","findMedian is only called after at least one number has been added"],
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
    lineByLine: [
      "`priority_queue<int> lo; priority_queue<int,vector<int>,greater<int>> hi;` — lo (max-heap) holds the lower half, hi (min-heap) the upper half.",
      "`lo.push(num); hi.push(lo.top()); lo.pop();` — insert into lo first, then move its max to hi, keeping the partition correct.",
      "`if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }` — rebalance if hi grew too large, keeping sizes within one.",
      "`return lo.size() > hi.size() ? lo.top() : (lo.top()+hi.top())/2.0;` — odd count returns lo's extra top; even count averages both tops.",
    ],
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
    statement: "You are given an array of k linked lists, each sorted in ascending order. Merge all of the lists into a single sorted linked list and return its head.",
    examples: [{"input":"lists = [[1,4,5],[1,3,4],[2,6]]","output":"[1,1,2,3,4,4,5,6]","explanation":"Merging the three lists and sorting all values yields this list."},{"input":"lists = []","output":"[]"},{"input":"lists = [[]]","output":"[]"}],
    constraints: ["k == lists.length","0 <= k <= 10^4","0 <= lists[i].length <= 500","-10^4 <= lists[i][j] <= 10^4","lists[i] is sorted in ascending order","The sum of lists[i].length will not exceed 10^4"],
    intuition: "Min-heap of (value, list_index, element_index). Always extract minimum across all lists. Push next element from same list.",
    recognize: [
      "It's merge-two-sorted generalized to k lists — the pairwise compare-and-attach trick doesn't scale cleanly once k grows.",
      "k can be up to 10^4, so comparing all k list-heads with a linear scan every step is too slow — you need the minimum in better than O(k) per pop.",
      "Each individual list is already sorted, which is what lets you always trust \"the next candidate from this list\" once its current head is consumed.",
      "→ These clues say: min-heap holding one head per list, repeatedly pop the smallest and push its successor.",
    ],
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
    lineByLine: [
      "`priority_queue<T, vector<T>, greater<T>> pq;` — min-heap keyed by value, finds the global smallest in O(log k).",
      "`for (auto l : lists) if (l) pq.push({l->val, l});` — seed the heap with each list's current head.",
      "`auto [v, node] = pq.top(); pq.pop();` — the true minimum across all lists is always at the top.",
      "`cur->next = node; cur = cur->next;` — attach the extracted node, advance the tail.",
      "`if (node->next) pq.push({node->next->val, node->next});` — replace the consumed node with its list's next candidate.",
      "`return dummy.next;` — real head of the fully merged, sorted list.",
    ],
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
    statement: "Design a data structure that implements a Least Recently Used (LRU) cache with a fixed capacity. Implement get(key), which returns the value for the key if present (or -1 otherwise) and marks it as recently used, and put(key, value), which inserts or updates the value and, if inserting exceeds capacity, evicts the least recently used entry. Both operations must run in average O(1) time.",
    examples: [{"input":"[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]","output":"[null,null,null,1,null,-1,null,-1,3,4]","explanation":"Capacity is 2; inserting a third key (3) evicts key 2 since key 1 was just accessed, and later inserting key 4 evicts key 1."}],
    constraints: ["1 <= capacity <= 3000","0 <= key <= 10^4","0 <= value <= 10^5","at most 2 * 10^5 calls total to get and put"],
    intuition: "Combine hashmap (O(1) lookup) with doubly-linked list (O(1) insertion/deletion). Most recently used at head, least recently used at tail. On access/put: move to head. On eviction: remove tail.",
    recognize: [
      "Both get and put must run in O(1) — that rules out a plain array or map-only solution, since eviction needs to find \"the oldest\" without scanning.",
      "\"Least recently used\" eviction requires reordering on every access, not just on insert — a structure that's fast to look up (hashmap) alone can't reorder in O(1).",
      "At most 2*10^5 total calls signals the design must avoid any O(n) step per operation.",
      "→ These clues say: hashmap for O(1) lookup paired with a doubly linked list for O(1) reordering and eviction.",
    ],
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
    lineByLine: [
      "`struct Node { int k,v; Node *prev,*next; };` — stores its own key too, so eviction can remove it from the map.",
      "`unordered_map<int,Node*> mp;` — key to node, O(1) lookup with no list walking.",
      "`Node *head, *tail;` — dummy sentinels so head/tail never need null-checks.",
      "`void remove(Node* n) { n->prev->next=n->next; n->next->prev=n->prev; }` — unlink n in O(1).",
      "`void addFront(Node* n) { ...; }` — insert n right after the head sentinel, the MRU spot.",
      "`int get(int k){ ...; remove(mp[k]); addFront(mp[k]); return mp[k]->v; }` — a hit counts as a use, so move it to the front.",
      "`if (mp.count(k)){mp[k]->v=v;remove(mp[k]);addFront(mp[k]);return;}` — updating also counts as recent use.",
      "`Node* n=new Node{k,v};mp[k]=n;addFront(n);` — a new key is inserted at the front and registered.",
      "`if ((int)mp.size()>cap){mp.erase(tail->prev->k);remove(tail->prev);}` — tail->prev is always LRU, so evict it.",
    ],
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
    statement: "Given the root of a binary search tree and an integer k, return the k-th smallest value stored in the tree (1-indexed, so k = 1 returns the smallest value).",
    examples: [{"input":"root = [3,1,4,null,2], k = 1","output":"1","explanation":"The sorted (in-order) values are [1,2,3,4], so the 1st smallest is 1."},{"input":"root = [5,3,6,2,4,null,null,1], k = 3","output":"3","explanation":"The sorted values are [1,2,3,4,5,6], so the 3rd smallest is 3."},{"input":"root = [2,1], k = 2","output":"2"}],
    constraints: ["The number of nodes in the tree is n","1 <= k <= n <= 10^4","0 <= Node.val <= 10^4"],
    intuition: "Inorder traversal of BST gives sorted sequence. k-th element in inorder = kth smallest. Perform inorder, count down.",
    recognize: [
      "It's a binary search TREE, and you need the k-th smallest — the BST's ordering property is the whole reason a special traversal order gives you sorted values for free.",
      "Asking for the k-th value rather than the min or max rules out a simple leftmost/rightmost walk.",
      "No need to build a full sorted array first if you can stop early once you've counted k visits.",
      "→ These clues say: inorder traversal (left, root, right) visits BST nodes in sorted order — walk it and stop at the k-th visit.",
    ],
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
    lineByLine: [
      "`int ans;` — stores the answer once found, since we need to short-circuit.",
      "`void inorder(TreeNode* node, int& k)` — k passed by reference so the whole tree shares one decrementing counter.",
      "`if (!node || k == 0) return;` — stop once off the tree or answer already found.",
      "`inorder(node->left, k);` — visit smaller values first, guaranteeing sorted-order visitation.",
      "`if (--k == 0) { ans = node->val; return; }` — k hitting 0 means this is the k-th smallest value.",
      "`inorder(node->right, k);` — only if not found yet, continue into larger values.",
      "`inorder(root, k); return ans;` — after the traversal, ans holds the k-th smallest value.",
    ],
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
    statement: "Given the root of a binary tree, determine whether it satisfies the binary search tree property: for every node, all values in its left subtree are strictly less than the node's value, all values in its right subtree are strictly greater, and both subtrees are themselves valid binary search trees.",
    examples: [{"input":"root = [2,1,3]","output":"true"},{"input":"root = [5,1,4,null,null,3,6]","output":"false","explanation":"The right subtree of 5 contains a node with value 3, which is less than 5, violating the BST property."},{"input":"root = [1,1]","output":"false","explanation":"Values must be strictly greater in the right subtree, so a duplicate value is invalid."}],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]","-2^31 <= Node.val <= 2^31 - 1"],
    intuition: "Pass valid range [min, max] down recursively. Root (-∞, +∞). Left subtree (-∞, root.val). Right subtree (root.val, +∞). Any violation → invalid.",
    recognize: [
      "The property is global, not just \"left child < node < right child\" — the failing example [5,1,4,null,null,3,6] has a locally-fine-looking 4>3 relationship that's still invalid because 3 violates the ancestor 5.",
      "\"All values in left subtree\" (not just the immediate child) signals a naive check against only direct children is insufficient.",
      "Strict inequality plus duplicate values being invalid means bounds must be exclusive, not inclusive.",
      "→ These clues say: DFS carrying a (min, max) range downward, narrowing it at every step rather than comparing only parent-child pairs.",
    ],
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
    lineByLine: [
      "`bool validate(TreeNode* node, long lo, long hi)` — lo/hi are the open range this value must fall in; `long` avoids overflow at INT_MIN/INT_MAX.",
      "`if (!node) return true;` — empty subtree trivially satisfies any range.",
      "`if (node->val <= lo || node->val >= hi) return false;` — strict bounds enforce both no-duplicates and every ancestor's constraint.",
      "`return validate(node->left, lo, node->val) && validate(node->right, node->val, hi);` — tighten hi going left, tighten lo going right, carrying ancestor bounds down.",
      "`return validate(root, LONG_MIN, LONG_MAX);` — root starts with the widest possible range.",
    ],
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
    statement: "Given the root of a binary search tree and two nodes p and q that both exist in the tree, find and return their lowest common ancestor — the deepest node that has both p and q as descendants (a node is allowed to be a descendant of itself).",
    examples: [{"input":"root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8","output":"6","explanation":"6 is the lowest node that is an ancestor of both 2 and 8."},{"input":"root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4","output":"2","explanation":"2 is an ancestor of 4, and a node can be its own ancestor."},{"input":"root = [2,1], p = 2, q = 1","output":"2"}],
    constraints: ["The number of nodes in the tree is in the range [2, 10^5]","-10^9 <= Node.val <= 10^9","All Node.val are unique","p and q are distinct nodes that both exist in the BST"],
    intuition: "BST property: if both p and q are less than root, LCA is in left subtree. If both greater, in right. If split (one each side, or one equals root), root is LCA.",
    recognize: [
      "It's specifically a binary search tree (not a generic binary tree) — that ordering lets you decide direction by comparing values, no need to search both subtrees.",
      "\"Deepest node with both as descendants\" is exactly the point where p and q's paths from the root diverge — in a BST that's detectable by value comparison alone.",
      "No parent pointers given, and values are unique, so a single top-down walk following BST comparisons suffices — no need to find both paths and compare them.",
      "→ These clues say: walk down from root, go left if both values are smaller, right if both are larger, and stop at the first split (or match) — that node is the LCA.",
    ],
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
    lineByLine: [
      "`while (root)` — walk down using BST ordering to decide direction with simple comparisons.",
      "`if (p->val < root->val && q->val < root->val) root = root->left;` — both smaller, so the LCA is entirely in the left subtree.",
      "`else if (p->val > root->val && q->val > root->val) root = root->right;` — both larger, so the LCA is in the right subtree.",
      "`else return root;` — p and q split here, or this node is one of them: this is the LCA.",
    ],
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
    statement: "Given the root of a binary tree, a node X in the tree is called good if the path from the root to X does not contain any node with a value greater than X's value. Return the total number of good nodes in the tree.",
    examples: [{"input":"root = [3,1,4,3,null,1,5]","output":"4","explanation":"Nodes 3 (root), 4, 5, and the second 3 are all good; the 1s are not since a 3 or 4 precedes them."},{"input":"root = [3,3,null,4,2]","output":"3"},{"input":"root = [1]","output":"1"}],
    constraints: ["The number of nodes in the tree is in the range [1, 10^5]","0 <= Node.val <= 10^4"],
    intuition: "DFS passing the maximum value seen so far on the path from root. A node is 'good' if its value >= that maximum.",
    recognize: [
      "\"Good\" depends on the path from root to X, not the whole tree — so each node's answer depends on info coming DOWN from its ancestors, not up from its children.",
      "You need to know the max value seen so far along the current path — that's state that must be threaded through the recursion as a parameter, not returned upward.",
      "Counting good nodes across the whole tree, not just checking one node, means the DFS needs to accumulate a running total.",
      "→ These clues say: DFS as an accumulator that passes maxSoFar down as a parameter, comparing each node against it before recursing further.",
    ],
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
    lineByLine: [
      "`function<int(TreeNode*,int)> dfs=[&](TreeNode* n,int mx)->int{` — lambda threading mx (max value seen so far) down as a parameter.",
      "`if (!n) return 0;` — empty subtree contributes 0 good nodes.",
      "`int good=(n->val>=mx)?1:0;` — good exactly when no ancestor exceeded this node's value.",
      "`int nm=max(mx,n->val);` — update the bar children must clear.",
      "`return good+dfs(n->left,nm)+dfs(n->right,nm);` — this node's status plus good nodes found in each subtree.",
      "`return dfs(root,INT_MIN);` — root has no ancestors, so it always counts as good.",
    ],
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
    statement: "Given the root of a binary tree, a path is any sequence of nodes connected by parent-child edges where each node appears at most once, and it does not need to pass through the root. Return the maximum possible sum of node values along any such path.",
    examples: [{"input":"root = [1,2,3]","output":"6","explanation":"The path 2 -> 1 -> 3 gives the maximum sum."},{"input":"root = [-10,9,20,null,null,15,7]","output":"42","explanation":"The path 15 -> 20 -> 7 gives the maximum sum, without using the root."}],
    constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4]","-1000 <= Node.val <= 1000"],
    intuition: "At each node, max path sum through it = node.val + max(0, left contribution) + max(0, right contribution). For the recursive return: only one branch (left or right) can extend upward.",
    recognize: [
      "\"Does not need to pass through the root\" and \"any sequence of nodes connected by parent-child edges\" — this is diameter-tree's shape again, but summing values instead of counting edges.",
      "Negative values are allowed, so a branch might hurt more than help — you can't just always take a subtree's contribution, you must clamp negative contributions to 0.",
      "A path can \"bend\" at one node (using both children) but a value returned to the parent can only extend through ONE side, since a path can't fork twice.",
      "→ These clues say: DFS returning a value up the call stack (best single-branch extension), while separately tracking a global max that allows combining both children at each node.",
    ],
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
    lineByLine: [
      "`int ans = INT_MIN;` — global best, since dfs's return value serves a different purpose; INT_MIN handles all-negative trees.",
      "`if (!node) return 0;` — empty subtree contributes nothing; 0 means don't extend through this side.",
      "`int l = max(0, dfs(node->left)), r = max(0, dfs(node->right));` — clamp negative branches to 0, since a hurting branch shouldn't be taken.",
      "`ans = max(ans, node->val + l + r);` — a path bending at this node uses both children; record it since it can never extend further up.",
      "`return node->val + max(l, r);` — parent gets only a straight extension through the better single side.",
      "`dfs(root); return ans;` — after the full traversal, ans holds the true global maximum.",
    ],
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
    statement: "Design an algorithm to convert a binary tree into a single string (serialization) and to reconstruct the exact same tree structure from that string (deserialization). Implement both a serialize function and a deserialize function; they only need to work correctly with each other.",
    examples: [{"input":"root = [1,2,3,null,null,4,5]","output":"[1,2,3,null,null,4,5]","explanation":"After serializing the tree and then deserializing the resulting string, the reconstructed tree matches the original."},{"input":"root = []","output":"[]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]","-1000 <= Node.val <= 1000","Your serialized format may be any encoding of your choosing"],
    intuition: "Preorder DFS serialization. Use '#' for null nodes, ',' as delimiter. Deserialize by reading tokens and reconstructing preorder.",
    recognize: [
      "\"Reconstruct the exact same tree structure\" — values alone (like a level-order array) aren't enough unless you also encode where the nulls are, since shape must round-trip perfectly.",
      "\"Your serialized format may be any encoding of your choosing\" is a hint you get to pick a traversal order that makes reconstruction unambiguous — a bare inorder or postorder alone wouldn't be.",
      "Preorder (root first) naturally supports single-pass reconstruction: the first token read is always the next subtree's root.",
      "→ These clues say: preorder DFS with explicit null markers for serialization, then a single forward pass consuming tokens in the same order to rebuild.",
    ],
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
    lineByLine: [
      "`if (!root) return \"#\";` — null must be explicitly encoded so deserialization can tell it apart from end of input.",
      "`return to_string(root->val)+\",\"+serialize(root->left)+\",\"+serialize(root->right);` — preorder so the next unread token is always the current subtree's root.",
      "`TreeNode* des(istringstream& ss)` — stream passed by reference so the read position advances across recursive calls.",
      "`string t; getline(ss, t, ',');` — pull the next token: a value or the null marker.",
      "`if (t==\"#\") return nullptr;` — null marker means empty here.",
      "`TreeNode* n=new TreeNode(stoi(t)); n->left=des(ss); n->right=des(ss); return n;` — consume left subtree's tokens first, then right's, matching serialization order.",
      "`istringstream ss(data); return des(ss);` — wrap the string as a stream and rebuild from the first token.",
    ],
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
    statement: "Given the root of a binary tree, compute the average value of the nodes at each depth level. Return the averages as an array ordered from the root level downward.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"[3.0,14.5,11.0]","explanation":"Level 0 has only 3, level 1 has 9 and 20 (avg 14.5), level 2 has 15 and 7 (avg 11.0)."},{"input":"root = [5]","output":"[5.0]"}],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]","-2^31 <= Node.val <= 2^31 - 1"],
    intuition: "BFS level by level. For each level, compute average of all node values.",
    recognize: [
      "\"Average value of the nodes at each depth level\" needs a sum and count grouped strictly by depth — the same level-by-level grouping as level-order-traversal.",
      "Order in the output is root level downward, matching exactly how a queue would emit levels in a BFS.",
      "No need to retain the actual node values afterward — only a running sum and count per level, so you don't even need to collect a full list like plain level-order does.",
      "→ These clues say: BFS with a queue-size snapshot per level, but accumulate sum/count per level instead of a full list.",
    ],
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
    lineByLine: [
      "`if (root) q.push(root);` — guard against a null root so the queue stays empty.",
      "`int sz=q.size(); double sum=0;` — snapshot this level's width, reset sum for this level.",
      "`for (int i=0;i<sz;i++){ auto n=q.front();q.pop(); sum+=n->val; ... }` — accumulate this level's values while queuing children for the next.",
      "`res.push_back(sum/sz);` — level total divided by node count; `double` avoids integer truncation.",
    ],
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
    statement: "Given the root of a binary tree, return every root-to-leaf path as a string, with node values joined by the arrow symbol \"->\". The order of paths does not need to match any particular sequence.",
    examples: [{"input":"root = [1,2,3,null,5]","output":"[\"1->2->5\",\"1->3\"]"},{"input":"root = [1]","output":"[\"1\"]"}],
    constraints: ["The number of nodes in the tree is in the range [1, 100]","-100 <= Node.val <= 100"],
    intuition: "DFS collecting path string. At leaf, add to result. Pass path by value for automatic backtracking.",
    recognize: [
      "You need EVERY root-to-leaf path reported, not just whether one exists or its sum — that's an enumeration problem, not a single yes/no check like path-sum.",
      "\"Order does not need to match any particular sequence\" hints DFS is fine (no requirement to match BFS's left-to-right level order).",
      "Building a path string incrementally and only recording it at a leaf mirrors the standard root-to-leaf DFS accumulator pattern.",
      "→ These clues say: DFS passing the path built so far down as a parameter (by value, so branches don't interfere), recording it only when a leaf is reached.",
    ],
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
    lineByLine: [
      "`function<void(TreeNode*,string)> dfs=[&](TreeNode* n,string p){` — p passed by value, so each branch gets its own copy and backtracking is automatic.",
      "`if (!n) return;` — nothing to add for a null node.",
      "`p += (p.empty()?\"->\":\"\")... (n->val);` — add the arrow only if a prefix already exists, then append this node's value.",
      "`if (!n->left&&!n->right) res.push_back(p);` — no children means p is a complete root-to-leaf path.",
      "`dfs(n->left,p); dfs(n->right,p);` — recurse into both children with independent path copies.",
      "`dfs(root,\"\"); return res;` — start from an empty path and collect every leaf's path.",
    ],
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
    statement: "Given the root of a binary tree and an integer targetSum, determine whether the tree has a root-to-leaf path such that the values along that path add up exactly to targetSum.",
    examples: [{"input":"root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22","output":"true","explanation":"The path 5 -> 4 -> 11 -> 2 sums to 22."},{"input":"root = [1,2,3], targetSum = 5","output":"false"},{"input":"root = [], targetSum = 0","output":"false"}],
    constraints: ["The number of nodes in the tree is in the range [0, 5000]","-1000 <= Node.val <= 1000","-1000 <= targetSum <= 1000"],
    intuition: "DFS with running sum. At each node subtract its value from target. At leaf check if remainder == 0.",
    recognize: [
      "Specifically \"root-to-leaf\" (must end exactly at a leaf) and \"add up exactly to targetSum\" — not any subpath, not an approximate match, so you're checking one committed root-to-leaf sum against an exact target.",
      "Only a yes/no answer is required — no need to enumerate or return the paths themselves, unlike binary-tree-paths.",
      "Subtracting the node's value from the remaining target as you descend avoids recomputing the full sum at each leaf.",
      "→ These clues say: DFS as a void-ish boolean check, threading the remaining target down and testing remaining == 0 only at leaves.",
    ],
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
    lineByLine: [
      "`if (!root) return false;` — ran off the tree without a matching leaf.",
      "`targetSum -= root->val;` — subtract this node's value from the remaining target.",
      "`if (!root->left && !root->right) return targetSum == 0;` — leaf reached; valid only if the running subtraction hit exactly 0.",
      "`return hasPathSum(root->left, targetSum) || hasPathSum(root->right, targetSum);` — not a leaf yet, succeed if either subtree finds a match.",
    ],
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
    statement: "You are given two integer arrays representing the preorder and inorder traversal of a binary tree with unique node values. Reconstruct the original binary tree from these two traversals and return its root.",
    examples: [{"input":"preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]","output":"[3,9,20,null,null,15,7]","explanation":"The first value in preorder (3) is the root; it splits inorder into left subtree [9] and right subtree [15,20,7]."},{"input":"preorder = [-1], inorder = [-1]","output":"[-1]"}],
    constraints: ["1 <= preorder.length <= 3000","inorder.length == preorder.length","-3000 <= preorder[i], inorder[i] <= 3000","All values in preorder and inorder are unique","inorder is guaranteed to be a valid inorder traversal of the tree described by preorder"],
    intuition: "Preorder[0] = root. Find root in inorder — left part is left subtree, right part is right subtree. Recurse with proper index ranges. Use hashmap for O(1) inorder lookup.",
    recognize: [
      "You're given BOTH preorder and inorder — that specific pair is what makes reconstruction unique; preorder alone tells you nothing about where left/right subtrees split.",
      "\"All node values are unique\" is what lets you find the root's position in inorder unambiguously via direct lookup.",
      "Preorder's first element is always the current subtree's root, and its position in inorder splits the rest into left/right subtree ranges — a self-similar recursive split.",
      "→ These clues say: recursively pick preorder[0] as root, locate it in inorder (hashmap for O(1)) to get subtree sizes, and recurse on the resulting index ranges.",
    ],
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
    lineByLine: [
      "`for (int i=0;i<(int)in.size();i++) inIdx[in[i]]=i;` — precompute value to index for O(1) root lookup in inorder.",
      "`function<TreeNode*(int,int,int,int)> build=[&](int ps,int pe,int is,int ie)->TreeNode*{` — build the subtree spanning pre[ps..pe] and in[is..ie].",
      "`if (ps>pe) return nullptr;` — empty range, no subtree here.",
      "`TreeNode* root=new TreeNode(pre[ps]);` — preorder's first element is always this subtree's root.",
      "`int mid=inIdx[pre[ps]], leftSz=mid-is;` — root's position in inorder splits left subtree size from right.",
      "`root->left=build(ps+1,ps+leftSz,is,mid-1);` — left subtree's preorder and inorder slices.",
      "`root->right=build(ps+leftSz+1,pe,mid+1,ie);` — remaining elements form the right subtree.",
      "`return build(0,pre.size()-1,0,in.size()-1);` — reconstruct starting from the full arrays.",
    ],
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
    statement: "Given a string representing a number in Roman numeral form (using symbols I, V, X, L, C, D, M), convert it to its equivalent integer value, accounting for subtractive notation such as IV meaning 4.",
    examples: [{"input":"s = \"III\"","output":"3"},{"input":"s = \"LVIII\"","output":"58","explanation":"L = 50, V = 5, III = 3, summing to 58."},{"input":"s = \"MCMXCIV\"","output":"1994","explanation":"M = 1000, CM = 900, XC = 90, IV = 4, summing to 1994."}],
    constraints: ["1 <= s.length <= 15","s contains only the characters 'I','V','X','L','C','D','M'","The input is guaranteed to be a valid Roman numeral representing a value between 1 and 3999"],
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
    lineByLine: [
      "`unordered_map<char,int> m={{'I',1},...,{'M',1000}};` — standard value of each Roman numeral symbol.",
      "`int res=0;` — accumulates the total value as we scan.",
      "`for (int i=0;i<(int)s.size()-1;i++)` — process every character except the last, looking ahead each time.",
      "`res += m[s[i]] < m[s[i+1]] ? -m[s[i]] : m[s[i]];` — smaller-before-larger means a subtractive pair, so subtract; otherwise add.",
      "`return res + m[s.back()];` — the last character is always added at face value.",
    ],
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
    statement: "A number is defined as happy if repeatedly replacing it with the sum of the squares of its digits eventually reaches 1. If instead this process enters a cycle that never includes 1, the number is not happy. Given an integer, determine whether it is happy.",
    examples: [{"input":"n = 19","output":"true","explanation":"1^2+9^2=82, 8^2+2^2=68, 6^2+8^2=100, 1^2+0^2+0^2=1, so the sequence reaches 1."},{"input":"n = 2","output":"false","explanation":"The sequence of sums enters a repeating cycle that never reaches 1."}],
    constraints: ["1 <= n <= 2^31 - 1"],
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
    lineByLine: [
      "`int sq(int n){...}` — computes the next term: sum of squared digits.",
      "`int slow=n, fast=sq(n);` — treat repeated sq() calls as an implicit linked list; slow trails fast by one step.",
      "`while (slow!=fast){slow=sq(slow);fast=sq(sq(fast));}` — slow moves one step, fast moves two, meeting if the sequence cycles.",
      "`return slow==1;` — happy only if they meet at 1.",
    ],
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
    statement: "You are given a non-empty array of digits representing a non-negative integer, where each element is a single digit and the most significant digit comes first (no leading zeros, except the number zero itself). Add one to the number represented by the array and return the resulting digits in the same format.",
    examples: [{"input":"digits = [1,2,3]","output":"[1,2,4]","explanation":"The array represents 123, and 123 + 1 = 124."},{"input":"digits = [4,3,2,1]","output":"[4,3,2,2]","explanation":"The array represents 4321, and 4321 + 1 = 4322."},{"input":"digits = [9]","output":"[1,0]","explanation":"9 + 1 = 10, which requires an extra digit."}],
    constraints: ["1 <= digits.length <= 100","0 <= digits[i] <= 9","digits does not contain any leading zero, except for the number 0 itself"],
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
    lineByLine: [
      "`for (int i=digits.size()-1;i>=0;i--)` — process digits right to left, mirroring how carrying works.",
      "`if (digits[i]<9){digits[i]++;return digits;}` — no overflow, increment and we're done.",
      "`digits[i]=0;` — this digit was 9, rolls over to 0 with a carry to the next digit.",
      "`digits.insert(digits.begin(),1);` — every digit was 9 (all-9s case), so prepend a leading 1.",
      "`return digits;` — the incremented digit array.",
    ],
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
    statement: "Implement a function that computes x raised to the power n (x^n), where x is a floating-point base and n is a signed integer that may be negative, zero, or positive.",
    examples: [{"input":"x = 2.00000, n = 10","output":"1024.00000"},{"input":"x = 2.10000, n = 3","output":"9.26100"},{"input":"x = 2.00000, n = -2","output":"0.25000","explanation":"2^-2 = 1 / 2^2 = 1/4 = 0.25."}],
    constraints: ["-100.0 < x < 100.0","-2^31 <= n <= 2^31 - 1","n is an integer","Either x is not zero or n > 0","-10^4 <= x^n <= 10^4"],
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
    lineByLine: [
      "`long long N = n;` — widen to 64-bit since negating INT_MIN would overflow a 32-bit int.",
      "`if (N < 0) { x = 1/x; N = -N; }` — x^(-n) equals (1/x)^n, so flip to a positive exponent.",
      "`double res = 1;` — identity value, representing x^0.",
      "`while (N) { if (N & 1) res *= x; x *= x; N >>= 1; }` — fast exponentiation: fold in x when the current bit is set, square x, shift N right.",
      "`return res;` — x raised to the power n, computed in O(log n).",
    ],
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
    statement: "Given a signed 32-bit integer x, reverse the digits of x and return the result. If the reversed value falls outside the range of a signed 32-bit integer, return 0 instead.",
    examples: [{"input":"x = 123","output":"321"},{"input":"x = -123","output":"-321"},{"input":"x = 120","output":"21"}],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
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
    lineByLine: [
      "`int rev=0;` — accumulates the reversed number one digit at a time.",
      "`while (x){ int d=x%10; x/=10; ...}` — peel off x's last digit; C++ % and / preserve sign for negatives.",
      "`if (rev>INT_MAX/10||(rev==INT_MAX/10&&d>7)) return 0;` — check overflow before it happens, using INT_MAX's last digit (7).",
      "`if (rev<INT_MIN/10||(rev==INT_MIN/10&&d<-8)) return 0;` — symmetric check for negative overflow, using INT_MIN's last digit (-8).",
      "`rev=rev*10+d;` — shift left and append the new digit.",
      "`return rev;` — the fully reversed number, or 0 if it would overflow.",
    ],
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
    statement: "Given an array of non-negative integers describing an elevation map where each bar has width 1, compute how much rainwater the terrain can trap after it rains, assuming water outside the leftmost and rightmost bars drains away.",
    examples: [{"input":"height = [0,1,0,2,1,0,1,3,2,1,2,1]","output":"6"},{"input":"height = [4,2,0,3,2,5]","output":"9"},{"input":"height = [1,0,1]","output":"1"}],
    constraints: ["1 <= height.length <= 2 * 10^4","0 <= height[i] <= 10^5"],
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
    lineByLine: [
      "`int l=0,r=height.size()-1,maxL=0,maxR=0,water=0;` — maxL/maxR track the tallest wall seen so far from each side.",
      "`if(height[l]<=height[r])` — process the shorter side, since the other side already guarantees a wall at least this tall.",
      "`maxL=max(maxL,height[l]); water+=maxL-height[l++];` — water above this bar is the running max minus its own height.",
      "`else { maxR=max(maxR,height[r]); water+=maxR-height[r--]; }` — symmetric case from the right.",
      "`return water;` — total water trapped.",
    ],
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
    statement: "Given an array of integers representing the heights of bars in a histogram, where each bar has width 1 and the bars are adjacent, find the area of the largest rectangle that can be formed using contiguous bars. Return that maximum area.",
    examples: [{"input":"heights = [2,1,5,6,2,3]","output":"10","explanation":"The largest rectangle is formed by the bars of height 5 and 6, giving an area of 2 * 5 = 10."},{"input":"heights = [2,4]","output":"4"}],
    constraints: ["1 <= heights.length <= 10^5","0 <= heights[i] <= 10^4"],
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
    lineByLine: [
      "`heights.push_back(0);` — sentinel forces every remaining bar on the stack to pop at the end.",
      "`stack<int> st;` — holds indices in strictly increasing height order, each waiting for its right boundary.",
      "`while (!st.empty() && heights[i] < heights[st.top()])` — current bar is shorter, so the stacked bar's rectangle is finally bounded.",
      "`int h = heights[st.top()]; st.pop();` — height of the rectangle being closed off.",
      "`int w = st.empty()?i:i-st.top()-1;` — width from the new top-of-stack (left boundary) to i (right boundary).",
      "`maxA = max(maxA, h*w);` — this bar's maximal rectangle is now fully known, compare against the best.",
      "`st.push(i);` — the current bar waits for some future shorter bar to close it off.",
      "`return maxA;` — largest rectangle found, each bar measured exactly once.",
    ],
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
    statement: "Given a string containing only the characters '(', ')', and '*', where '*' can be treated as either '(', ')', or an empty string, determine whether the string can be interpreted so that the parentheses are validly balanced.",
    examples: [{"input":"s = \"()\"","output":"true"},{"input":"s = \"(*)\"","output":"true","explanation":"The '*' can be treated as an empty string, leaving a balanced \"()\"."},{"input":"s = \"(*))\"","output":"true","explanation":"Treating the '*' as '(' gives \"(())\", which is balanced."}],
    constraints: ["1 <= s.length <= 100","s[i] is '(', ')', or '*'"],
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
    lineByLine: [
      "`int lo=0,hi=0;` — track the range of possible open-paren counts, since '*' is ambiguous.",
      "`if(c=='('){lo++;hi++;}` — an actual '(' raises both bounds by one.",
      "`else if(c==')'){lo--;hi--;}` — an actual ')' lowers both bounds by one.",
      "`else{lo--;hi++;}` — a '*' could close, open, or vanish, so it widens the range on both ends.",
      "`if(hi<0) return false;` — even the most generous reading can't stay non-negative, unrecoverable.",
      "`lo=max(lo,0);` — clamp lo at 0, since a '*' could always be reinterpreted to avoid going negative.",
      "`return lo==0;` — valid only if 0 is achievable within the final [lo,hi] range.",
    ],
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
    statement: "Given an m x n board containing 'X' and 'O' characters, capture all regions of 'O' that are fully surrounded by 'X' on all sides by flipping those 'O' cells to 'X'. A region touching the border of the board is not considered surrounded and should be left unchanged. Modify the board in place.",
    examples: [{"input":"board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]","output":"[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]","explanation":"The bottom-left 'O' touches the border (via the region path) so it stays; the enclosed region is flipped to 'X'."},{"input":"board = [[\"X\"]]","output":"[[\"X\"]]"}],
    constraints: ["1 <= board.length, board[i].length <= 200","board[i][j] is 'X' or 'O'"],
    intuition: "Any 'O' connected to border is safe. DFS/BFS from all border 'O's, mark them. Then flip all remaining 'O' to 'X', restore marked to 'O'.",
    recognize: [
      "\"Surrounded on all sides\" but explicitly excluding regions touching the border is an inverted condition — easier to find what's SAFE (border-connected) than to prove every region is fully enclosed.",
      "The example shows an 'O' region connected (even indirectly, through other O's) to the border surviving, which rules out just checking each O's four immediate neighbors.",
      "Flood-filling from the border inward naturally marks exactly the safe cells, leaving everything else as capturable by elimination.",
      "→ These clues say: DFS/BFS from every border 'O' to mark all border-connected regions as safe, then flip every unmarked 'O' to 'X' and restore the marked ones.",
    ],
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
    lineByLine: [
      "`if(r<0||r>=(int)b.size()||c<0||c>=(int)b[0].size()||b[r][c]!='O') return;` — stop at bounds or non-O cells; only unmarked O's spread.",
      "`b[r][c]='S';` — mark border-connected cells with a third state distinct from 'O' and 'X'.",
      "`dfs(b,r+1,c);dfs(b,r-1,c);dfs(b,r,c+1);dfs(b,r,c-1);` — spread the safe marking to all connected O cells.",
      "`for(int i=0;i<m;i++){dfs(board,i,0);dfs(board,i,n-1);}` — flood-fill from the leftmost and rightmost columns.",
      "`for(int j=0;j<n;j++){dfs(board,0,j);dfs(board,m-1,j);}` — flood-fill from the top and bottom rows.",
      "`board[i][j]=(board[i][j]=='S')?'O':'X';` — restore safe cells to 'O', flip everything else (enclosed O's included) to 'X'.",
    ],
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
    statement: "You are given a list of variable pairs and corresponding real-valued results representing known equations of the form a / b = value. Given a list of queries, each asking for the value of a / b for some pair of variables, compute the answer for each query by chaining known equations together, treating each variable relationship as a weighted, directed connection. If a query's answer cannot be derived from the given equations (either variable is unknown or no chain connects them), return -1.0 for that query.",
    examples: [{"input":"equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]","output":"[6.00000,0.50000,-1.00000,1.00000,-1.00000]","explanation":"a/c = (a/b)*(b/c) = 2*3 = 6; b/a = 1/2 = 0.5; \"e\" and \"x\" never appear so those queries are unanswerable, while a/a = 1."}],
    constraints: ["1 <= equations.length <= 20","equations[i].length == 2","1 <= variable name length <= 5","values.length == equations.length and 0.0 < values[i] <= 20.0","1 <= queries.length <= 20"],
    intuition: "Build weighted directed graph: a/b=val → edge a→b weight val, b→a weight 1/val. For each query BFS from source to target, multiply edge weights along path.",
    recognize: [
      "Equations like a/b=2 chain together (a/c = a/b * b/c) — that chaining is literally graph traversal where each edge weight is a division ratio.",
      "Each equation a/b=val gives you both directions for free (b/a = 1/val), so the graph must be built as directed edges both ways with reciprocal weights.",
      "Variables not appearing in any equation, or two variables with no connecting chain, must return -1 — that's just \"node not in graph\" or \"no path exists.\"",
      "→ These clues say: build a weighted directed graph from the equations (and their reciprocals), then for each query DFS/BFS from the source variable to the target, multiplying edge weights along the path.",
    ],
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
    lineByLine: [
      "`g[eq[i][0]][eq[i][1]]=vals[i]; g[eq[i][1]][eq[i][0]]=1.0/vals[i];` — each equation gives two directed edges: val forward, its reciprocal backward.",
      "`auto bfs=[&](string s,string t)->double{ if(!g.count(s)||!g.count(t)) return -1; ... }` — an unknown variable has no edges, so no chain can reach it.",
      "`if(s==t) return 1;` — a variable divided by itself is always 1.",
      "`q.push({s,1.0}); vis.insert(s);` — BFS state tracks the accumulated product along the path so far.",
      "`for(auto& [nb,w]:g[node]){ if(nb==t) return prod*w; if(!vis.count(nb)){vis.insert(nb);q.push({nb,prod*w});} }` — extend the chain by multiplying in each edge's weight; stop as soon as the target is reached.",
      "`return -1;` — exhausted all reachable variables without finding the target.",
      "`for(auto& query:queries) res.push_back(bfs(query[0],query[1]));` — answer each query with its own BFS.",
    ],
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
    statement: "There are n nodes labeled from 1 to n connected by directed, weighted edges given as times[i] = [u, v, w], meaning it takes w time units for a signal to travel from node u to node v. Starting a signal from a given source node k, determine the minimum time needed for the signal to reach every node in the network. Return that minimum time, or -1 if some node is unreachable.",
    examples: [{"input":"times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2","output":"2","explanation":"From node 2, node 1 is reached in 1 unit, node 3 in 1 unit, and node 4 via node 3 in 2 units; the maximum of these is 2."},{"input":"times = [[1,2,1]], n = 2, k = 1","output":"1"},{"input":"times = [[1,2,1]], n = 2, k = 2","output":"-1","explanation":"Node 1 is unreachable from node 2 since the only edge is directed from 1 to 2."}],
    constraints: ["1 <= n <= 100","1 <= times.length <= 6000","1 <= u, v <= n and u != v","1 <= w <= 100","All pairs (u, v) are distinct"],
    intuition: "Single source shortest path from k. Dijkstra with min-heap. Answer = max dist among all nodes. If any unreachable: -1.",
    recognize: [
      "Edges are directed AND weighted (w time units) — that combination is the classic setup for single-source shortest path from k, not plain BFS (which only handles unweighted/uniform edges).",
      "\"Minimum time for the signal to reach EVERY node\" (the slowest one) means you need shortest distance to all nodes, then take the max — not just distance to one target.",
      "\"Return -1 if some node is unreachable\" is a direct hint to check for any distance left at infinity after the algorithm finishes.",
      "→ These clues say: Dijkstra's algorithm from source k with a min-heap, then report the maximum finite distance across all nodes (or -1 if any remain unreachable).",
    ],
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
    lineByLine: [
      "`for(auto& t:times) g[t[0]].push_back({t[1],t[2]});` — build a directed weighted adjacency list.",
      "`vector<int> dist(n+1,INT_MAX); dist[k]=0;` — dist[v] is the shortest time to reach v from source k.",
      "`priority_queue<...,greater<>> pq; pq.push({0,k});` — min-heap by distance, popping the closest unprocessed node first.",
      "`auto [d,u]=pq.top();pq.pop(); if(d>dist[u]) continue;` — skip stale entries superseded by a shorter path already found.",
      "`for(auto [v,w]:g[u]) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push({dist[v],v});}` — relax: update v if reaching it via u is cheaper.",
      "`int ans=*max_element(dist.begin()+1,dist.end());` — reaching every node is bottlenecked by the farthest one, so take the max distance.",
      "`return ans==INT_MAX?-1:ans;` — any node still unreachable means the signal never reaches everyone.",
    ],
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
    statement: "A tree with n nodes originally had exactly n-1 edges, but one extra edge was added, creating exactly one cycle and turning it into a graph with n edges. Given the list of edges in the order they were added, find and return the one edge that can be removed so the remaining graph is again a valid tree; if more than one such edge could be removed, return the one that appears last in the input.",
    examples: [{"input":"edges = [[1,2],[1,3],[2,3]]","output":"[2,3]","explanation":"Removing edge [2,3] breaks the only cycle and leaves a valid tree."},{"input":"edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]","output":"[1,4]","explanation":"Edge [1,4] is the last edge added that completes a cycle among nodes 1-2-3-4."},{"input":"edges = [[1,2],[2,3],[1,3]]","output":"[1,3]"}],
    constraints: ["n == edges.length","3 <= n <= 1000","edges[i].length == 2","1 <= edges[i][0] < edges[i][1] <= n","there are no repeated edges"],
    intuition: "Union-Find. Add edges one by one. If both endpoints already same component: that edge creates cycle — return it.",
    recognize: [
      "\"n nodes, n edges, exactly one cycle, edges given in the order they were added\" — that framing (find the LAST edge completing a cycle) is a direct fit for processing edges in order and checking connectivity incrementally.",
      "\"If more than one could be removed, return the one that appears last\" tells you to process edges left to right and stop at the first one that creates a cycle, rather than analyzing the whole graph at once.",
      "This is graph-valid-tree's cycle-detection core, just returning the offending edge instead of a boolean.",
      "→ These clues say: Union-Find, adding edges one at a time in input order; the first edge whose endpoints are already in the same component is the answer.",
    ],
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
    lineByLine: [
      "`int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}` — find x's component root, path-compressing for future lookups.",
      "`bool unite(int a,int b){ a=find(a);b=find(b); if(a==b) return false; ... }` — already same component means this edge would create a cycle.",
      "`if(rnk[a]<rnk[b]) swap(a,b); parent[b]=a; if(rnk[a]==rnk[b]) rnk[a]++;` — union by rank keeps future find() calls fast.",
      "`iota(parent.begin(),parent.end(),0);` — every node starts as its own component.",
      "`for(auto& e:edges) if(!unite(e[0],e[1])) return e;` — process edges in order; the first one whose endpoints are already connected is the cycle-closer.",
    ],
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
    statement: "Given the coordinates of a set of points on a 2D plane, you must connect all points together using edges so that there is a path between every pair of points, where the cost of an edge between two points equals the Manhattan distance between them. Return the minimum total cost required to connect all the points.",
    examples: [{"input":"points = [[0,0],[2,2],[3,10],[5,2],[7,0]]","output":"20","explanation":"A minimum spanning tree over these points using Manhattan distances totals 20."},{"input":"points = [[3,12],[-2,5],[-4,1]]","output":"18"}],
    constraints: ["1 <= points.length <= 1000","-10^6 <= xi, yi <= 10^6","All pairs (xi, yi) are distinct"],
    intuition: "MST on complete graph with Manhattan distance edges. Prim's without heap is O(n²) — efficient for dense graphs. Always add cheapest unvisited node reachable from current MST.",
    recognize: [
      "\"Connect all points with a path between every pair\" at minimum total cost is literally minimum spanning tree — the points are nodes, and there's an implicit edge (Manhattan distance) between every pair.",
      "No explicit edge list is given — it's a COMPLETE graph (every pair of points connectable), which with n up to 1000 means O(n^2) edges, too many to build explicitly for a heap-based Prim's/Kruskal's efficiently.",
      "Since the graph is dense, comparing all unvisited nodes directly each round (O(n) per step, O(n^2) total) beats maintaining a heap of O(n^2) edges.",
      "→ These clues say: Prim's algorithm without a heap — repeatedly pick the cheapest unvisited node reachable from the growing tree, updating costs in O(n) per iteration.",
    ],
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
    lineByLine: [
      "`vector<int> cost(n,INT_MAX); cost[0]=0;` — cost[i] is the cheapest edge connecting node i to the MST so far.",
      "`for(int i=0;i<n;i++){ ... }` — add one node to the MST per iteration, n times total.",
      "`int u=-1; for(int j=0;j<n;j++) if(!vis[j]&&(u==-1||cost[j]<cost[u])) u=j;` — linear scan for the cheapest unvisited node, since the graph is dense.",
      "`vis[u]=true; total+=cost[u];` — commit u to the tree, adding its cheapest connecting edge to the total.",
      "`for(int v=0;v<n;v++) if(!vis[v]){ int d=abs(pts[u][0]-pts[v][0])+abs(pts[u][1]-pts[v][1]); cost[v]=min(cost[v],d); }` — update each remaining point's best cost using the newly added node.",
      "`return total;` — sum of cheapest edges used to attach every point, the MST cost.",
    ],
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
    statement: "You are given an n x n grid where each cell holds a distinct elevation value. Starting at the top-left cell at time 0, you may move to an adjacent cell (up, down, left, or right) at time t only if the elevation of that cell is at most t, since water is rising uniformly and fills every cell whose elevation is no greater than the current time. Return the minimum time at which it becomes possible to reach the bottom-right cell.",
    examples: [{"input":"grid = [[0,2],[1,3]]","output":"3","explanation":"At time 3, all four cells (elevations 0,1,2,3) are accessible, allowing a path from top-left to bottom-right."},{"input":"grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]","output":"16","explanation":"Following the spiral of increasing elevations, the bottom-right cell first becomes reachable once time reaches 16."}],
    constraints: ["1 <= n <= 50","0 <= grid[i][j] < n^2","Every integer in the range [0, n^2 - 1] appears exactly once in grid"],
    intuition: "Minimax path: minimize the maximum cell value along path from (0,0) to (n-1,n-1). Dijkstra where cost = max(cost_so_far, cell_value).",
    recognize: [
      "The \"cost\" of a path isn't a sum of edge weights — it's the single highest elevation you must wait for along the way, since water rises uniformly and you're blocked until time reaches that height.",
      "You want the minimum over all paths of that path's maximum cell value — a minimax path problem, a variant that looks like shortest path but isn't a straightforward sum.",
      "Grid cells with distinct elevations and 4-directional movement give a natural graph, but the relaxation rule differs from normal Dijkstra: combine via max(), not addition.",
      "→ These clues say: Dijkstra's algorithm with a modified relaxation — new cost = max(current path cost, next cell's elevation) — instead of summing edge weights.",
    ],
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
    lineByLine: [
      "`vector<vector<int>> dist(n,vector<int>(n,INT_MAX)); dist[0][0]=grid[0][0];` — dist[r][c] is the lowest bottleneck elevation along the best path to (r,c).",
      "`pq.push({grid[0][0],0,0});` — min-heap by bottleneck value, expanding the cheapest-to-reach cell first.",
      "`auto [t,r,c]=pq.top();pq.pop(); if(r==n-1&&c==n-1) return t;` — popping the destination guarantees its bottleneck is minimal.",
      "`if(t>dist[r][c]) continue;` — stale heap entry already improved elsewhere.",
      "`int nt=max(t,grid[nr][nc]);` — new bottleneck is the max of the path so far and this cell's elevation, not a sum.",
      "`if(nt<dist[nr][nc]){dist[nr][nc]=nt;pq.push({nt,nr,nc});}` — only re-explore if this offers a strictly lower bottleneck.",
      "`return -1;` — defensive fallback; unreachable never actually happens on a full grid.",
    ],
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
    statement: "There are n cities connected by flights, each given as [from, to, price] representing a one-way flight and its cost. Given a source city, a destination city, and a maximum number of intermediate stops allowed, find the cheapest total price to travel from the source to the destination using at most that many stops. Return -1 if no such route exists within the stop limit.",
    examples: [{"input":"n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1","output":"700","explanation":"With at most 1 stop, the path 0 -> 1 -> 3 costs 100 + 600 = 700. The cheaper path 0 -> 1 -> 2 -> 3 (cost 400) uses 2 stops, exceeding the limit of k = 1, so it is not allowed."},{"input":"n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1","output":"200","explanation":"With at most 1 stop, the path 0 -> 1 -> 2 costs 100 + 100 = 200, which is cheaper than the direct flight at 500."},{"input":"n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0","output":"500","explanation":"With 0 stops allowed, only the direct flight 0 -> 2 is usable."}],
    constraints: ["1 <= n <= 100","0 <= flights.length <= (n * (n - 1) / 2)","0 <= from, to < n and from != to","1 <= price <= 10^4","0 <= src, dst, k < n"],
    intuition: "Bellman-Ford limited to k+1 rounds (k stops = k+1 edges). Use copy of previous round's distances to prevent same-round chaining.",
    recognize: [
      "\"Cheapest\" WITH a cap on stops rules out plain Dijkstra, since Dijkstra optimizes for cheapest ignoring hop count — the example explicitly shows a cheaper 2-stop route being disallowed in favor of a costlier 1-stop route.",
      "A limit on the number of edges used (k stops = k+1 edges) is exactly what bounding the number of relaxation rounds in Bellman-Ford controls.",
      "Using a single mutable distance array during relaxation would let a single round's update chain through multiple edges (violating the stop cap) — you need a fresh snapshot copy each round to prevent that.",
      "→ These clues say: Bellman-Ford relaxation capped at exactly k+1 rounds, copying the distance array before each round so updates don't chain within the same round.",
    ],
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
    lineByLine: [
      "`vector<int> dist(n,INT_MAX); dist[src]=0;` — dist[i] is the cheapest known price to reach city i so far.",
      "`for(int i=0;i<=k;i++){ vector<int> tmp=dist; ... dist=tmp; }` — exactly k+1 rounds, since k stops means at most k+1 flight legs.",
      "`vector<int> tmp=dist;` — snapshot before updating, so this round only reads prices from prior rounds.",
      "`if(dist[f[0]]!=INT_MAX&&dist[f[0]]+f[2]<tmp[f[1]]) tmp[f[1]]=dist[f[0]]+f[2];` — relax only using last round's known prices, enforcing one hop per round.",
      "`return dist[dst]==INT_MAX?-1:dist[dst];` — cheapest price within the stop budget, or -1 if unreachable within it.",
    ],
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
    statement: "Design a data structure that stores a collection of words and supports adding new words as well as searching for a word, where the search query may contain the wildcard character '.' that can match any single letter. Implement addWord to insert a word into the structure, and search to return true if some previously added word matches the given query pattern.",
    examples: [{"input":"addWord(\"bad\"); addWord(\"dad\"); addWord(\"mad\"); search(\"pad\"); search(\"bad\"); search(\".ad\"); search(\"b..\")","output":"false, true, true, true","explanation":"\"pad\" was never added so it fails. \"bad\" matches exactly. \".ad\" matches \"bad\", \"dad\", or \"mad\" since '.' matches any letter. \"b..\" matches \"bad\"."}],
    constraints: ["1 <= word.length <= 25","word consists of lowercase English letters and possibly '.'","At most 2 * 10^4 calls will be made to addWord and search","There are at most 2 dots in any search query"],
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
    lineByLine: [
      "`struct Node { Node* ch[26]={}; bool end=false; };` — trie node using a fixed 26-slot array for O(1) child lookup.",
      "`bool dfs(Node* n, const string& w, int i)` — recursive walk that branches on the wildcard case.",
      "`if(!n) return false;` — fell off the trie, no word matches here.",
      "`if(i==(int)w.size()) return n->end;` — query consumed; match only if a word actually ends here.",
      "`if(w[i]=='.') { for(auto c:n->ch) if(dfs(c,w,i+1)) return true; return false; }` — wildcard tries every child branch.",
      "`return dfs(n->ch[w[i]-'a'],w,i+1);` — a normal letter has only one possible branch to descend into.",
      "`void addWord(string w){ ... cur->end=true; }` — standard trie insertion, flag the final node as a word.",
    ],
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
    statement: "Given an m x n grid of letters and a list of words, determine which words can be formed by tracing a path through adjacent grid cells (horizontally or vertically neighboring), without reusing the same cell more than once within a single word. Return all words from the list that can be found in the grid, in any order.",
    examples: [{"input":"board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]","output":"[\"eat\",\"oath\"]","explanation":"\"oath\" traces down the first column and across, \"eat\" traces through adjacent cells; \"pea\" and \"rain\" cannot be traced."},{"input":"board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]","output":"[]","explanation":"\"abcb\" would require reusing the cell containing 'b', which is not allowed."}],
    constraints: ["1 <= m, n <= 12","board[i][j] is a lowercase English letter","1 <= words.length <= 3 * 10^4","1 <= words[i].length <= 10","All words[i] are unique"],
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
    lineByLine: [
      "`struct T{T*ch[26]={};string word;};` — each node stores the full word if one ends here, so a hit reports it directly.",
      "`void ins(const string& w)` — insert every dictionary word up front so the DFS can prune against trie paths.",
      "`if(r<0||...||b[r][c]=='#') return;` — stop if off the board or the cell was already used in this path.",
      "`char ch=b[r][c]; T* nx=n->ch[ch-'a']; if(!nx) return;` — prune immediately if no word's prefix matches this letter.",
      "`if(!nx->word.empty()){res.push_back(nx->word);nx->word=\"\";}` — record the found word, then clear it to avoid duplicates.",
      "`b[r][c]='#'; dfs(...4 directions...); b[r][c]=ch;` — mark the cell used, recurse, then restore it for other paths.",
      "`for(auto& w:words) ins(w); ... dfs(board,i,j,root,res);` — build the trie once, then DFS from every board cell.",
    ],
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
    statement: "You are given a list of triplets, each with three integers, and a target triplet. You may pick any subset of the triplets and repeatedly merge them by taking the elementwise maximum, and you want to know if some sequence of merges can produce exactly the target triplet. Return true if it is achievable, otherwise false.",
    examples: [{"input":"triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]","output":"true","explanation":"Merging triplet [2,5,3] (valid since 2<=2,5<=7,3<=5) with [1,7,5] (valid since all coordinates <= target) gives elementwise max [2,7,5]."},{"input":"triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,6]","output":"false","explanation":"Any triplet with a value exceeding the target's on some coordinate (like 8 > 7) cannot be used, and the remaining valid triplets never reach a third coordinate of 6."},{"input":"triplets = [[3,4,5],[4,4,5],[5,5,5]], target = [5,5,5]","output":"true"}],
    constraints: ["1 <= triplets.length <= 10^5","triplets[i].length == target.length == 3","1 <= triplets[i][j], target[j] <= 1000"],
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
    lineByLine: [
      "`vector<int> best(3,0);` — tracks the best elementwise-max achievable using only safe-to-merge triplets.",
      "`if(t[0]>target[0]||t[1]>target[1]||t[2]>target[2]) continue;` — a triplet exceeding target anywhere would push that coordinate past target, discard it.",
      "`for(int i=0;i<3;i++) best[i]=max(best[i],t[i]);` — folding in any valid triplet via max only helps or does nothing.",
      "`return best==target;` — target is reachable only if every coordinate hits it exactly.",
    ],
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
    statement: "You are given a list of intervals and a list of query points. For each query, find the size (end minus start plus one) of the smallest interval that fully contains that query point, or -1 if no interval contains it. Return the answers as an array in the order of the queries.",
    examples: [{"input":"intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]","output":"[3,3,1,4]","explanation":"For query 4, the interval [4,4] has size 1 and contains 4, which is the smallest containing interval."},{"input":"intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]","output":"[2,-1,4,6]","explanation":"No interval contains 19, so the answer for that query is -1."}],
    constraints: ["1 <= intervals.length <= 5 * 10^4","1 <= queries.length <= 5 * 10^4","1 <= starti <= endi <= 10^7","1 <= queries[j] <= 10^7"],
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
    lineByLine: [
      "`sort(intervals.begin(),intervals.end());` — sort by start so a single forward pointer can sweep without backtracking.",
      "`vector<int> idx(n);iota(...); sort(idx.begin(),idx.end(),...);` — sort query indices by value while remembering original position for the answer.",
      "`priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;` — min-heap of (size, end) for started intervals; smallest size on top.",
      "`while(i<...&&intervals[i][0]<=q) { pq.push(...); i++; }` — add every interval whose start has now been reached.",
      "`while(!pq.empty()&&pq.top().second<q) pq.pop();` — lazily purge intervals that already expired before this query.",
      "`ans[qi]=pq.empty()?-1:pq.top().first;` — top of the heap is the smallest still-containing interval, or -1.",
    ],
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
    statement: "Given two strings s and t, count the number of distinct ways to pick a subsequence from s (by deleting some, possibly zero, characters without reordering the rest) so that the resulting sequence equals t exactly.",
    examples: [{"input":"s = \"rabbbit\", t = \"rabbit\"","output":"3","explanation":"There are 3 ways to choose which of the three 'b' characters in s to keep so the remaining letters spell 'rabbit'."},{"input":"s = \"babgbag\", t = \"bag\"","output":"5"}],
    constraints: ["1 <= s.length, t.length <= 1000","s and t consist of English letters"],
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
    lineByLine: [
      "`vector<vector<long>> dp(m+1,vector<long>(n+1,0));` — dp[i][j] counts embeddings of t[0..j-1] in s[0..i-1]; long avoids overflow.",
      "`for(int i=0;i<=m;i++) dp[i][0]=1;` — deleting everything gives exactly one way to form an empty target.",
      "`dp[i][j]=dp[i-1][j]+(s[i-1]==t[j-1]?dp[i-1][j-1]:0);` — skip s[i-1] always, plus use it as a match when the chars agree.",
      "`return dp[m][n];` — total distinct subsequences of s equal to t.",
    ],
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
    statement: "Given three strings s1, s2, and s3, determine whether s3 can be formed by interleaving the characters of s1 and s2 while preserving the original left-to-right order of characters within each of s1 and s2.",
    examples: [{"input":"s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"","output":"true"},{"input":"s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"","output":"false"},{"input":"s1 = \"\", s2 = \"\", s3 = \"\"","output":"true"}],
    constraints: ["0 <= s1.length, s2.length <= 100","0 <= s3.length <= 200","s1, s2, and s3 consist of lowercase English letters"],
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
    lineByLine: [
      "`if(m+n!=(int)s3.size()) return false;` — an interleaving must use every char once, so lengths must add up.",
      "`vector<vector<bool>> dp(m+1,vector<bool>(n+1,false)); dp[0][0]=true;` — dp[i][j] means s3's first i+j chars can be formed this way.",
      "`for(int i=1;i<=m;i++) dp[i][0]=...;` — with nothing from s2, s1's prefix must match s3 directly.",
      "`for(int j=1;j<=n;j++) dp[0][j]=...;` — symmetric base case using only s2.",
      "`dp[i][j]=(dp[i-1][j]&&s1[i-1]==s3[i+j-1])||(dp[i][j-1]&&s2[j-1]==s3[i+j-1]);` — next char of s3 came from s1 or from s2.",
      "`return dp[m][n];` — whether the full s1 and s2 can interleave into the full s3.",
    ],
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
    statement: "There are n balloons in a row, each with a number painted on it, given in an array nums. Bursting balloon i earns nums[left] * nums[i] * nums[right] coins, where left and right are the indices of the balloons currently adjacent to it (treat both ends of the row as bordered by an imaginary balloon of value 1). After a balloon bursts, its former neighbors become adjacent to each other. Determine the maximum total coins obtainable by bursting all the balloons in some order.",
    examples: [{"input":"nums = [3,1,5,8]","output":"167","explanation":"Bursting in the order 1, 5, 3, 8 yields 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15+120+24+8 = 167."},{"input":"nums = [1,5]","output":"10"}],
    constraints: ["1 <= nums.length <= 300","0 <= nums[i] <= 100"],
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
    lineByLine: [
      "`nums.insert(nums.begin(),1); nums.push_back(1);` — pad both ends with a virtual value-1 balloon for the neighbor formula.",
      "`for(int len=1;len<=n-2;len++) for(int l=1;l+len-1<=n-2;l++)` — interval DP: process subranges in increasing length order.",
      "`for(int k=l;k<=r;k++)` — ask which balloon k is burst LAST in [l,r], so both sides are cleared independently first.",
      "`dp[l][r]=max(dp[l][r],nums[l-1]*nums[k]*nums[r+1]+dp[l][k-1]+dp[k+1][r]);` — best coins over every choice of last-burst balloon k.",
      "`return dp[1][n-2];` — after padding, this cell covers exactly the original balloons.",
    ],
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
    statement: "Given an input string s and a pattern p that may contain the special characters '.' (matches any single character) and '*' (matches zero or more occurrences of the preceding character), determine whether the pattern matches the entire string s, not just a substring of it.",
    examples: [{"input":"s = \"aa\", p = \"a\"","output":"false","explanation":"\"a\" does not match the whole string \"aa\"."},{"input":"s = \"aa\", p = \"a*\"","output":"true","explanation":"'*' lets 'a' repeat, matching \"aa\"."},{"input":"s = \"ab\", p = \".*\"","output":"true","explanation":"\".*\" matches any sequence, including \"ab\"."}],
    constraints: ["1 <= s.length <= 20","1 <= p.length <= 30","s consists of lowercase English letters","p consists of lowercase English letters, '.', and '*'","every '*' in p is preceded by a valid character to repeat"],
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
    lineByLine: [
      "`bool match(char s,char p){return p=='.'||s==p;}` — a char matches if equal, or if the pattern char is '.'.",
      "`vector<vector<bool>> dp(m+1,vector<bool>(n+1,false)); dp[0][0]=true;` — dp[i][j] means s's first i chars match p's first j chars.",
      "`for(int j=2;j<=n;j++) if(p[j-1]=='*') dp[0][j]=dp[0][j-2];` — empty s matches a '*' prefix only by using it zero times.",
      "`if(p[j-1]=='*')` — '*' modifies the preceding character, so it needs special handling.",
      "`dp[i][j]=dp[i][j-2]||(j>=2&&dp[i-1][j]&&match(s[i-1],p[j-2]));` — use the star zero times, or one more time if the preceding char matches.",
      "`else dp[i][j]=dp[i-1][j-1]&&match(s[i-1],p[j-1]);` — ordinary char: match one-to-one and carry the earlier result.",
      "`return dp[m][n];` — whether the entire s matches the entire p.",
    ],
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
    statement: "Design a simplified version of Twitter that supports posting a tweet, following and unfollowing another user, and retrieving the 10 most recent tweet ids in a user's news feed (their own tweets plus tweets from users they follow), ordered from most recent to least recent.",
    examples: [{"input":"postTweet(1,5); getNewsFeed(1); follow(1,2); postTweet(2,6); getNewsFeed(1); unfollow(1,2); getNewsFeed(1)","output":"[null, [5], null, null, [6,5], null, [5]]","explanation":"User 1 posts tweet 5, then follows user 2 who posts tweet 6, making the feed [6,5]; after unfollowing, the feed reverts to [5]."}],
    constraints: ["1 <= userId, followerId, followeeId <= 500","0 <= tweetId <= 10^4","All tweet ids are unique","At most 3 * 10^4 calls will be made in total to postTweet, getNewsFeed, follow, and unfollow"],
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
    lineByLine: [
      "`unordered_map<int,vector<pair<int,int>>> tweets;` — each user's tweets in posting order, tagged with a global timestamp.",
      "`void postTweet(int u,int t){tweets[u].push_back({time++,t});}` — later tweets always compare as more recent.",
      "`follows[u].insert(u);` — temporarily self-follow so the merge treats own tweets and followees uniformly.",
      "`for(int f:follows[u]) { ... pq.push({v.back()...}); }` — merge-k-sorted-lists: seed the heap with each followee's newest tweet.",
      "`while(!pq.empty()&&(int)res.size()<10) { ...; if(i>0) pq.push(...); }` — pop the most recent tweet, push that user's next one back, stop at 10.",
      "`follows[u].erase(u);` — undo the temporary self-follow.",
    ],
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
    statement: "Given an array of n + 1 integers where every value lies between 1 and n inclusive, there is exactly one number that is repeated (though it may appear more than twice). Find and return that repeated number without modifying the array and using only O(1) extra space.",
    examples: [{"input":"nums = [1,3,4,2,2]","output":"2"},{"input":"nums = [3,1,3,4,2]","output":"3"},{"input":"nums = [3,3,3,3,3]","output":"3"}],
    constraints: ["1 <= n <= 10^5","nums.length == n + 1","1 <= nums[i] <= n","exactly one integer in nums repeats, possibly more than once"],
    intuition: "Floyd's cycle detection. Array as linked list: index i → nums[i]. Duplicate = two indices pointing to same value = cycle. Find cycle entry = duplicate.",
    recognize: [
      "n+1 integers all in range [1, n] — pigeonhole guarantees a repeat, and every value can be treated as a valid array index.",
      "\"Without modifying the array\" rules out sorting or marking visited indices, and \"O(1) extra space\" rules out a hash set.",
      "Explicit ban on extra space is unusual for a \"find the duplicate\" problem — that's the tell to look past the obvious hash-set solution.",
      "→ These clues say: treat nums[i] as a pointer to index nums[i], turning the array into an implicit linked list, and find the cycle entry with Floyd's algorithm.",
    ],
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
    lineByLine: [
      "`int slow=nums[0],fast=nums[nums[0]];` — treat index i as pointing to nums[i], forming a cycle.",
      "`while(slow!=fast){slow=nums[slow];fast=nums[nums[fast]];}` — Floyd's phase 1, fast gains on slow until they meet.",
      "`slow=0;` — phase 2: start to cycle entrance equals meeting point to entrance.",
      "`while(slow!=fast){slow=nums[slow];fast=nums[fast];}` — advance both one step until they meet at the entry.",
      "`return slow;` — the meeting point in phase 2 is the duplicate number.",
    ],
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
    statement: "The Tribonacci sequence is defined by T0 = 0, T1 = 1, T2 = 1, and each following term equal to the sum of the previous three terms. Given an integer n, return the value of Tn.",
    examples: [{"input":"n = 4","output":"4","explanation":"T3 = 0+1+1 = 2, and T4 = 1+1+2 = 4."},{"input":"n = 25","output":"1389537"},{"input":"n = 0","output":"0"}],
    constraints: ["0 <= n <= 37","the answer is guaranteed to fit within a 32-bit integer"],
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
    lineByLine: [
      "`if(n==0) return 0; if(n<=2) return 1;` — handle the base cases directly (T0=0, T1=T2=1).",
      "`int a=0,b=1,c=1;` — seed the three most recent values as T(0), T(1), T(2).",
      "`for(int i=3;i<=n;i++){int t=a+b+c;a=b;b=c;c=t;}` — sum the last three, then slide the window forward.",
      "`return c;` — holds T(n) after the loop.",
    ],
    timeComplexity: "O(n)",
    timeExplanation: "Single loop.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: ["n=0 → 0. n=1,2 → 1."],
    memoryTrick: "\"Fibonacci + one more. Three vars, shift window each step.\"",
  },

  "min-cost-climbing": {
    statement: "You are given an array cost where cost[i] is the price paid to step on stair i; once you pay for a step you may climb either 1 or 2 steps forward, and you may start from index 0 or index 1. Return the minimum total cost needed to reach a position past the last stair (index cost.length).",
    examples: [{"input":"cost = [10,15,20]","output":"15","explanation":"Start at index 1, pay 15, then take two steps to go past the top, skipping index 2 entirely."},{"input":"cost = [1,100,1,1,1,100,1,1,100,1]","output":"6","explanation":"Starting at index 0 and always hopping 2 steps over the expensive 100-cost stairs yields total cost 6."},{"input":"cost = [0,0,0,1]","output":"0"}],
    constraints: ["2 <= cost.length <= 1000","0 <= cost[i] <= 999"],
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
    lineByLine: [
      "`for(int i=2;i<n;i++) cost[i]+=min(cost[i-1],cost[i-2]);` — reuse cost as the dp table: min cost to reach stair i via a 1- or 2-step hop.",
      "`return min(cost[n-1],cost[n-2]);` — finish from the last stair or skip it via a 2-step hop from the one before, take the cheaper.",
    ],
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place.",
    edgeCases: ["n=2 — min(cost[0],cost[1])."],
    memoryTrick: "\"Cost to step = cost[i] + min(prev, prev-prev). Top = min of last two.\"",
  },

  "reconstruct-itinerary": {
    statement: "Given a list of airline tickets, each represented as a [from, to] pair of airport codes, reconstruct the itinerary that uses every ticket exactly once, starting from \"JFK\". If multiple valid itineraries exist, return the one that is lexicographically smallest when the airport codes are read as a sequence. You may assume the given tickets always form a valid itinerary that uses all of them.",
    examples: [{"input":"tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]","output":"[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]"},{"input":"tickets = [[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]","output":"[\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]","explanation":"This route uses all five tickets and is lexicographically smaller than the alternative starting \"JFK\",\"SFO\",\"ATL\",...."}],
    constraints: ["1 <= tickets.length <= 300","tickets[i].length == 2","Airport codes are three uppercase English letters","All tickets form at least one valid Eulerian itinerary starting at JFK"],
    intuition: "Eulerian path via Hierholzer's. DFS with sorted adjacency (multiset). Post-order append builds reverse path. Reverse at end.",
    recognize: [
      "\"Uses every ticket exactly once\" (not every airport once) is the signature of an Eulerian path — traversing every EDGE exactly once, as opposed to a Hamiltonian path over nodes.",
      "\"Lexicographically smallest\" among multiple valid full-usage itineraries hints that greedily picking the smallest next airport doesn't always work directly (you can get stuck), which is why the classic greedy DFS needs post-order backtracking, not a naive forward-only greedy walk.",
      "All tickets are guaranteed to form a valid itinerary, so you don't need to search for validity — you need the specific construction algorithm (Hierholzer's) that always finds an Eulerian path when one exists.",
      "→ These clues say: DFS over a sorted (multiset) adjacency list, appending nodes to the result in POST-order (only once you've exhausted all edges from that node) and reversing at the end — Hierholzer's algorithm.",
    ],
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
    lineByLine: [
      "`unordered_map<string,multiset<string>> g; for(auto& t:tickets) g[t[0]].insert(t[1]);` — a multiset per airport keeps destinations sorted, so the smallest is always found first.",
      "`stack<string> st; st.push(\"JFK\");` — an explicit stack lets Hierholzer's backtrack from dead ends without separate undo logic.",
      "`string cur=st.top(); if(g[cur].empty()){res.push_back(cur);st.pop();}` — record cur only once all its tickets are used, so unfinished nodes never commit early.",
      "`else{st.push(*g[cur].begin());g[cur].erase(g[cur].begin());}` — greedily follow the smallest unused destination, consuming that ticket.",
      "`reverse(res.begin(),res.end());` — nodes are recorded post-order (dead ends first), so reverse to get the correct start-to-end order.",
    ],
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
    statement: "Given a number of nodes labeled from 0 to n-1 and a list of undirected edges, determine whether these edges form a valid tree, meaning the graph is fully connected and contains no cycles.",
    examples: [{"input":"n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]","output":"true"},{"input":"n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]","output":"false","explanation":"The edges 1-2, 2-3, and 1-3 form a cycle."}],
    constraints: ["1 <= n <= 2000","0 <= edges.length <= 5000","edges[i].length == 2","There are no self-loops or duplicate edges"],
    intuition: "Tree = n-1 edges + no cycle + connected. Check edge count first (quick reject). Union-Find for cycle detection.",
    recognize: [
      "\"Fully connected and contains no cycles\" is literally the definition of a tree — two separate conditions to verify, not one.",
      "A graph with n nodes is a tree if and only if it has exactly n-1 edges AND is connected — that arithmetic fact turns \"is this a tree\" into a cheap pre-check plus a cycle/connectivity check.",
      "Undirected edges with no self-loops or duplicates is exactly the setup Union-Find handles well: union each edge, and if the two endpoints are already in the same set, that's a cycle.",
      "→ These clues say: quick-reject if edge count != n-1, otherwise Union-Find every edge and fail if any edge connects two nodes already in the same component.",
    ],
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
    lineByLine: [
      "`if((int)edges.size()!=n-1) return false;` — a valid tree on n nodes has exactly n-1 edges, so mismatch rejects immediately.",
      "`par.resize(n);iota(par.begin(),par.end(),0);` — each node starts as its own component.",
      "`int a=find(e[0]),b=find(e[1]); if(a==b) return false;` — same root means this edge would create a cycle.",
      "`par[a]=b;` — otherwise merge the two components.",
      "`return true;` — every edge merged separate components without a cycle, and n-1 edges already guarantees connectivity.",
    ],
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
    statement: "You are given an integer n representing nodes labeled from 0 to n-1, and a list of undirected edges connecting pairs of these nodes. Determine and return the total number of connected components in the resulting graph.",
    examples: [{"input":"n = 5, edges = [[0,1],[1,2],[3,4]]","output":"2","explanation":"Nodes 0,1,2 form one component and nodes 3,4 form another."},{"input":"n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]","output":"1","explanation":"All five nodes are connected in a single chain."},{"input":"n = 4, edges = []","output":"4","explanation":"With no edges, every node is its own component."}],
    constraints: ["1 <= n <= 2000","0 <= edges.length <= n * (n - 1) / 2","edges[i].length == 2","0 <= edges[i][0], edges[i][1] < n","there are no duplicate edges and no self-loops"],
    intuition: "Union-Find. Start with n components. Each union of different components reduces count by 1.",
    recognize: [
      "\"Total number of connected components\" over an undirected graph with no direction or weights is a pure grouping question — DFS/BFS from each unvisited node, or Union-Find, both fit.",
      "Every node starts as its own isolated component (n components with no edges) — a natural Union-Find initialization.",
      "Each edge either merges two separate components (count drops by 1) or connects two nodes already together (no-op) — that increment/no-op pattern is Union-Find's core operation.",
      "→ These clues say: Union-Find starting with n singleton components, decrementing the count each time an edge merges two previously separate sets.",
    ],
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
    lineByLine: [
      "`par.resize(n);iota(par.begin(),par.end(),0); int comps=n;` — every node starts as its own isolated component.",
      "`int a=find(e[0]),b=find(e[1]); if(a!=b){par[a]=b;comps--;}` — different components merge into one, dropping the count by 1; same component is a redundant edge.",
      "`return comps;` — however many distinct groups remain after all edges.",
    ],
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
    statement: "You are given a directed acyclic graph of n nodes labeled 0 to n-1, represented as an adjacency list graph where graph[i] is the list of nodes reachable directly from node i. Return every possible path that starts at node 0 and ends at node n-1, with each path given as a list of node indices in the order visited.",
    examples: [{"input":"graph = [[1,2],[3],[3],[]]","output":"[[0,1,3],[0,2,3]]","explanation":"Both paths start at node 0 and end at node 3 (the last node)."},{"input":"graph = [[1,2],[2],[]]","output":"[[0,1,2],[0,2]]"},{"input":"graph = [[1],[]]","output":"[[0,1]]"}],
    constraints: ["2 <= n <= 15","0 <= graph[i][j] < n","graph[i][j] != i (no self-loops)","all values in graph[i] are unique","the graph is a DAG (no cycles)"],
    intuition: "DFS from node 0, collecting all paths to n-1. DAG so no visited set needed. Backtrack after each call.",
    recognize: [
      "You need EVERY path from source to target, not just whether one exists or the shortest one — enumeration, not reachability or shortest-path.",
      "It's explicitly a DAG (no cycles), which is exactly what lets you skip a visited-set — no path can loop back on itself, so plain DFS with backtracking terminates safely.",
      "Small n (<=15) signals an exponential number of paths is expected and acceptable, not something that needs a polynomial shortcut.",
      "→ These clues say: DFS with backtracking from node 0, recording the path whenever node n-1 is reached, no visited-tracking needed since the graph is acyclic.",
    ],
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
    lineByLine: [
      "`vector<int> path={0};` — path always starts at the fixed source, node 0.",
      "`function<void(int)> dfs=[&](int node){ if(node==n-1){res.push_back(path);return;} ... }` — reaching the target means the current path is a complete valid answer.",
      "`for(int nb:graph[node]){path.push_back(nb);dfs(nb);path.pop_back();}` — backtracking: extend, recurse, then pop; no visited-set needed since the DAG has no cycles.",
      "`dfs(0); return res;` — collect every distinct source-to-target path.",
    ],
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
    statement: "You are given a list of words from an alien language, listed in the order they would appear in that language's dictionary, using an unknown ordering of the English alphabet. Determine a valid ordering of the letters used, consistent with how the given words are sorted, and return that ordering as a string. If the given word list contains a contradiction (no valid ordering exists), or contains an invalid case such as a longer word appearing before a shorter word that is its own prefix, return an empty string.",
    examples: [{"input":"words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]","output":"\"wertf\"","explanation":"Comparing adjacent words gives constraints t<f, w<e, r<t, e<r, yielding the order w, e, r, t, f."},{"input":"words = [\"z\",\"x\"]","output":"\"zx\""},{"input":"words = [\"z\",\"x\",\"z\"]","output":"\"\"","explanation":"The constraints z<x and x<z contradict each other, so no valid ordering exists."}],
    constraints: ["1 <= words.length <= 100","1 <= words[i].length <= 100","words[i] consists of lowercase English letters","All characters used belong to the alien alphabet being reconstructed"],
    intuition: "Extract char ordering by comparing adjacent words. Build directed graph. Topo sort (Kahn's BFS). Cycle = invalid alphabet.",
    recognize: [
      "You're asked to reconstruct an ORDERING of letters consistent with given constraints — that's exactly what topological sort produces from a set of \"comes before\" relationships.",
      "Each adjacent pair of dictionary-sorted words gives you exactly one letter-ordering constraint (the first position where they differ) — a natural way to build a directed graph edge by edge.",
      "\"Contradiction → no valid ordering\" is precisely a cycle in the constraint graph, and the invalid-prefix case (longer word before its own shorter prefix) is a special malformed input that must be checked separately before building the graph.",
      "→ These clues say: build a directed graph from first-differing-character pairs between adjacent words, then topologically sort it (Kahn's BFS); a cycle or leftover unprocessed nodes means no valid ordering.",
    ],
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
    lineByLine: [
      "`for(auto& w:words) for(char c:w) indeg[c]=0;` — register every character as a node so isolated letters still appear in the output.",
      "`for(int i=0;i<(int)words.size()-1;i++){ auto& a=words[i]; auto& b=words[i+1]; ... }` — only adjacent word pairs give ordering constraints directly.",
      "`for(int j=0;j<(int)l;j++) if(a[j]!=b[j]){ if(!adj[a[j]].count(b[j])){adj[a[j]].insert(b[j]);indeg[b[j]]++;} found=true;break; }` — the first differing character is the only valid ordering signal, so add that edge and stop.",
      "`if(!found&&a.size()>b.size()) return \"\";` — a longer word can never precede its own prefix, so this is invalid.",
      "`for(auto& [c,d]:indeg) if(!d) q.push(c);` — Kahn's: start from letters with no unresolved prerequisites.",
      "`while(!q.empty()){char c=q.front();q.pop();res+=c;for(char nb:adj[c]) if(!--indeg[nb]) q.push(nb);}` — output a free letter, then free up anything it was blocking.",
      "`return res.size()==indeg.size()?res:\"\";` — all characters placed means success; missing ones were stuck in a cycle.",
    ],
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
    statement: "Given an m x n integer matrix, find the length of the longest path of cells such that each next cell is reachable by moving up, down, left, or right, and each successive cell holds a strictly greater value than the previous one.",
    examples: [{"input":"matrix = [[9,9,4],[6,6,8],[2,1,1]]","output":"4","explanation":"The longest increasing path is 1 -> 2 -> 6 -> 9."},{"input":"matrix = [[3,4,5],[3,2,6],[2,2,1]]","output":"4"}],
    constraints: ["1 <= m, n <= 200","0 <= matrix[i][j] <= 2^31 - 1"],
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
    lineByLine: [
      "`if(memo[r][c]) return memo[r][c];` — reuse an already-computed answer instead of re-exploring, turning DFS into O(m×n).",
      "`int dirs[]={0,1,0,-1,0};` — compact way to generate the 4 (dr,dc) direction pairs from consecutive elements.",
      "`if(...&&g[nr][nc]>g[r][c]) best=max(best,1+dfs(g,nr,nc));` — only recurse into strictly greater neighbors; strict increase means no cycles, so no visited set is needed.",
      "`return memo[r][c]=best;` — best starts at 1 (the cell alone) and grows via increasing neighbors; cache before returning.",
      "`for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans=max(ans,dfs(matrix,i,j));` — try every cell as a starting point, keep the best.",
    ],
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
    statement: "Given a beginWord, an endWord, and a dictionary wordList, find the length of the shortest transformation sequence from beginWord to endWord such that only one letter is changed at each step and every intermediate word produced must exist in wordList. Return 0 if no such transformation sequence exists; note that beginWord itself is not required to be in wordList but endWord must be.",
    examples: [{"input":"beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]","output":"5","explanation":"One shortest sequence is hit -> hot -> dot -> dog -> cog, which has 5 words."},{"input":"beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]","output":"0","explanation":"endWord \"cog\" is not in wordList, so no valid transformation exists."},{"input":"beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]","output":"2"}],
    constraints: ["1 <= beginWord.length <= 10","endWord.length == beginWord.length","1 <= wordList.length <= 5000","wordList[i].length == beginWord.length","beginWord, endWord, and wordList[i] consist of lowercase English letters","beginWord != endWord"],
    intuition: "BFS from beginWord. Each step try changing each character to a-z, check if in wordList. Shortest BFS path = minimum transformations.",
    recognize: [
      "\"Shortest transformation sequence\" (a length, not the sequence itself) with each step being a fixed unit cost (one letter changed) — shortest path in an unweighted graph is the tell for BFS, not DFS.",
      "There's no explicit graph given — words are nodes and edges are implicit (\"one letter changed\"), so you generate neighbors on the fly by trying all 26 letters at each position instead of using a prebuilt adjacency list.",
      "Words consumed once should not be revisited (marking as visited by removing from the set), since BFS already guarantees the first time you reach a word is via the shortest path.",
      "→ These clues say: BFS over an implicit word graph, generating each word's neighbors by trying every single-letter substitution and checking dictionary membership, tracking steps as BFS depth.",
    ],
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
    lineByLine: [
      "`unordered_set<string> ws(wordList.begin(),wordList.end());` — O(1) membership checks for the many candidate words tried per step.",
      "`if(!ws.count(end)) return 0;` — endWord missing from wordList means no sequence can end there.",
      "`queue<pair<string,int>> q; q.push({begin,1});` — BFS state is (word, path length so far); beginWord is step 1.",
      "`for(int i=0;i<(int)w.size();i++){ char orig=w[i]; for(char c='a';c<='z';c++){ ... } w[i]=orig; }` — generate every one-letter-edit neighbor on the fly, restoring the original character after each position.",
      "`if(w==end) return step+1;` — BFS reaches end via increasing step count, so the first hit is the shortest sequence.",
      "`if(ws.count(w)){ws.erase(w);q.push({w,step+1});}` — a valid neighbor becomes a new frontier node; erasing marks it visited.",
      "`return 0;` — queue emptied without reaching endWord.",
    ],
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
    statement: "Given a triangular arrangement of numbers as a list of rows, find the minimum possible sum of a path that starts at the top and ends at the bottom row. From a number at index i in a row, the next step in the path may go to index i or index i + 1 in the row directly below.",
    examples: [{"input":"triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]","output":"11","explanation":"The minimum path is 2 + 3 + 5 + 1 = 11."},{"input":"triangle = [[-10]]","output":"-10"}],
    constraints: ["1 <= triangle.length <= 200","triangle[i].length == i + 1","-10^4 <= triangle[i][j] <= 10^4"],
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
    lineByLine: [
      "`for(int i=n-2;i>=0;i--)` — work bottom-up so each row reuses the row below, already resolved.",
      "`for(int j=0;j<=i;j++)` — process every valid position in row i.",
      "`triangle[i][j]+=min(triangle[i+1][j],triangle[i+1][j+1]);` — add the cheaper of the two reachable cells below.",
      "`return triangle[0][0];` — apex absorbs the best path sum from top to bottom.",
    ],
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
    statement: "Given an integer n, count how many prime numbers exist that are strictly less than n.",
    examples: [{"input":"n = 10","output":"4","explanation":"The primes less than 10 are 2, 3, 5, and 7."},{"input":"n = 0","output":"0"},{"input":"n = 1","output":"0"}],
    constraints: ["0 <= n <= 5 * 10^6"],
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
    lineByLine: [
      "`if(n<2) return 0;` — no primes exist below 2.",
      "`vector<bool> sieve(n,true); sieve[0]=sieve[1]=false;` — assume every index prime, then rule out 0 and 1.",
      "`for(int i=2;(long long)i*i<n;i++)` — only need factors up to sqrt(n) to catch every composite.",
      "`if(sieve[i]) for(int j=i*i;j<n;j+=i) sieve[j]=false;` — cross off i's multiples starting at i*i, since smaller multiples were already crossed off.",
      "`return count(sieve.begin(),sieve.end(),true);` — every index still true is prime.",
    ],
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
    statement: "Given two non-negative integers represented as strings, return their product, also as a string, computed without converting the inputs directly into built-in big-integer types.",
    examples: [{"input":"num1 = \"2\", num2 = \"3\"","output":"\"6\""},{"input":"num1 = \"123\", num2 = \"456\"","output":"\"56088\""}],
    constraints: ["1 <= num1.length, num2.length <= 200","num1 and num2 consist of digits only","num1 and num2 do not contain any leading zero, except the number 0 itself"],
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
    lineByLine: [
      "`int m=num1.size(),n=num2.size(); vector<int> res(m+n,0);` — a product of m and n digit numbers has at most m+n digits.",
      "`for(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--)` — multiply every pair of digits, like grade-school long multiplication.",
      "`int mul=(num1[i]-'0')*(num2[j]-'0');` — the raw product of these two digits.",
      "`int p1=i+j,p2=i+j+1,sum=mul+res[p2];` — p2 is the ones position for this partial product, p1 is where it carries into.",
      "`res[p2]=sum%10; res[p1]+=sum/10;` — keep the ones digit at p2, add the carry into p1.",
      "`for(int d:res) if(!(s.empty()&&!d)) s+=to_string(d);` — build the digit string, skipping leading zeros.",
      "`return s.empty()?\"0\":s;` — if every digit was a skipped leading zero, the product is 0.",
    ],
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
    statement: "You are given an undirected graph with n nodes, a list of edges, and a success probability for each edge indicating the likelihood a signal successfully traverses that edge. Given a start node and an end node, find the path between them that maximizes the product of the success probabilities along its edges, and return that maximum probability. Return 0 if no path connects the two nodes.",
    examples: [{"input":"n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2","output":"0.25000","explanation":"The path 0 -> 1 -> 2 has probability 0.5 * 0.5 = 0.25, which exceeds the direct edge's probability of 0.2."},{"input":"n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start = 0, end = 2","output":"0.30000","explanation":"The direct edge 0 -> 2 with probability 0.3 beats the two-edge path's probability of 0.25."}],
    constraints: ["2 <= n <= 10^4","0 <= edges.length <= 2 * 10^4","edges[i].length == 2 and succProb.length == edges.length","0 <= succProb[i] <= 1","0 <= start, end < n and start != end"],
    intuition: "Modified Dijkstra: maximize probability instead of minimize cost. Max-heap by probability. Multiply probabilities along path (all <= 1). Stop early when target reached.",
    recognize: [
      "You're combining edge weights by MULTIPLICATION (probabilities along a path) rather than addition, and looking to maximize rather than minimize — that flips normal shortest-path assumptions.",
      "The example shows a two-edge path beating a direct edge in one case but losing in another — so you genuinely need to explore multiple paths and compare products, not just take the direct edge.",
      "Since all probabilities are between 0 and 1, \"greedily take the biggest available multiplier next\" (extract-max) is still safe here just like extract-min is safe for normal Dijkstra, because probabilities only shrink as you add edges.",
      "→ These clues say: Dijkstra's algorithm with the min-heap swapped for a max-heap and the relaxation rule swapped from addition to multiplication.",
    ],
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
    lineByLine: [
      "`g[edges[i][0]].push_back({edges[i][1],prob[i]}); g[edges[i][1]].push_back({edges[i][0],prob[i]});` — undirected, so each edge is added to both endpoints' lists.",
      "`vector<double> dist(n,0); dist[s]=1.0;` — dist[v] is the best probability found so far from s to v; start reaches itself with certainty.",
      "`priority_queue<pair<double,int>> pq; pq.push({1.0,s});` — a max-heap by default, expanding the highest-probability frontier node next.",
      "`auto [p,u]=pq.top();pq.pop(); if(u==e) return p;` — popping the end node off a max-heap guarantees its probability is the best possible.",
      "`if(p<dist[u]) continue;` — stale entry already beaten by a better path.",
      "`for(auto [v,w]:g[u]) if(dist[u]*w>dist[v]){dist[v]=dist[u]*w;pq.push({dist[v],v});}` — relax by multiplying instead of adding; probabilities only shrink, so greedy extract-max stays valid.",
      "`return 0;` — max-heap emptied without reaching e, no path exists.",
    ],
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
    statement: "You are given a number of nodes labeled from 0 to n-1 and a list of bidirectional edges connecting them, along with a source node and a destination node. Determine whether there is a path (through zero or more edges) that connects the source to the destination.",
    examples: [{"input":"n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2","output":"true"},{"input":"n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5","output":"false"}],
    constraints: ["1 <= n <= 2 * 10^5","0 <= edges.length <= 2 * 10^5","edges[i].length == 2","0 <= source, destination <= n - 1","There are no duplicate edges and no self-loops"],
    intuition: "Simple BFS/DFS or Union-Find. Check if source and destination are in same connected component.",
    recognize: [
      "Edges are bidirectional and the question is purely reachability (\"is there a path\"), not shortest path or path count — the simplest possible graph question.",
      "No weights, no direction, no need to output the actual path — just true/false.",
      "\"Zero or more edges\" explicitly covers source == destination as a trivial true case.",
      "→ These clues say: build an adjacency list and run BFS/DFS from source (or Union-Find over all edges), checking if destination is reachable / in the same component.",
    ],
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
    lineByLine: [
      "`if(s==d) return true;` — zero edges is a valid path from a node to itself.",
      "`for(auto& e:edges){g[e[0]].push_back(e[1]);g[e[1]].push_back(e[0]);}` — bidirectional, so each edge adds both directions.",
      "`vector<bool> vis(n,false); queue<int> q; q.push(s); vis[s]=true;` — standard BFS setup from the source.",
      "`for(int v:g[u]){ if(v==d) return true; if(!vis[v]){vis[v]=true;q.push(v);} }` — stop immediately if destination found, otherwise queue unvisited neighbors.",
      "`return false;` — BFS exhausted without reaching destination.",
    ],
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
    statement: "You are given a list of root words that form a dictionary, and a sentence made up of space-separated words. For every word in the sentence that has one of the roots as a prefix, replace it with that root; if a word can be formed from several roots, use the shortest matching root. Words with no matching root remain unchanged. Return the resulting sentence.",
    examples: [{"input":"dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"","output":"\"the cat was rat by the bat\"","explanation":"\"cattle\" starts with \"cat\", \"rattled\" starts with \"rat\", and \"battery\" starts with \"bat\"."},{"input":"dictionary = [\"a\",\"b\",\"c\"], sentence = \"aadsfasf absbs bbab cadsfafs\"","output":"\"a a b c\"","explanation":"Every word in the sentence begins with one of the single-letter roots, so each is shortened to that root."}],
    constraints: ["1 <= dictionary.length <= 1000","1 <= dictionary[i].length <= 100","dictionary[i] and sentence consist of lowercase English letters and spaces","1 <= sentence.length <= 10^6","The number of words in sentence is in the range [1, 1000]"],
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
    lineByLine: [
      "`void ins(const string& w)` — insert every dictionary root into the trie once up front.",
      "`string rep(const string& w)` — for one sentence word, walk the trie following w's letters.",
      "`int c=w[i]-'a';if(!n->ch[c]) break;` — no branch for the next letter means no root matches further, stop walking.",
      "`n=n->ch[c];if(n->end) return w.substr(0,i+1);` — return immediately at the first matched root, guaranteeing the shortest one wins.",
      "`return w;` — no root matched, keep the word unchanged.",
      "`for(auto& r:dict) ins(r); ... res+=rep(word);` — build the trie, then replace each sentence word and rejoin with spaces.",
    ],
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
    statement: "You are given a binary string s and two integers minJump and maxJump. Starting at index 0 (guaranteed s[0] == '0'), you may jump from index i to index j only if i + minJump <= j <= i + maxJump and s[j] == '0'. Determine whether it is possible to reach the last index of the string.",
    examples: [{"input":"s = \"011010\", minJump = 2, maxJump = 3","output":"true","explanation":"Jump from 0 to 3 (s[3]='0'), then from 3 to 5 (s[5]='0'), the last index."},{"input":"s = \"01101110\", minJump = 2, maxJump = 3","output":"false"},{"input":"s = \"0000000000\", minJump = 1, maxJump = 1","output":"true"}],
    constraints: ["2 <= s.length <= 10^5","s[i] is either '0' or '1'","s[0] == '0'","1 <= minJump <= maxJump < s.length"],
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
    lineByLine: [
      "`vector<bool> reach(n,false); reach[0]=true;` — reach[i] means index i is landable; index 0 is the start.",
      "`int pre=0;` — running count of reachable positions inside the sliding jump window, avoiding an O(maxJ-minJ) recheck per i.",
      "`if(i>=minJ&&reach[i-minJ]) pre++;` — the window's near edge gains a new position as i advances, count it if reachable.",
      "`if(i>maxJ&&reach[i-maxJ-1]) pre--;` — the window's far edge loses a position, remove its contribution.",
      "`if(pre>0&&s[i]=='0') reach[i]=true;` — i is reachable if some position in range is reachable and i itself isn't blocked.",
      "`return reach[n-1];` — whether the last index ended up reachable.",
    ],
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
    statement: "Given two integers left and right that define an inclusive range, return the bitwise AND of all integers in that range.",
    examples: [{"input":"left = 5, right = 7","output":"4","explanation":"5 & 6 & 7 = 4."},{"input":"left = 0, right = 0","output":"0"},{"input":"left = 1, right = 2147483647","output":"0"}],
    constraints: ["0 <= left <= right <= 2^31 - 1"],
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
    lineByLine: [
      "`int shift=0;` — counts how many low-order bits differ between m and n.",
      "`while(m!=n){m>>=1;n>>=1;shift++;}` — ANDing the whole range only keeps bits identical throughout it; shifting strips differing low bits until m equals n, leaving the shared prefix.",
      "`return m<<shift;` — shift the common prefix back, padding stripped bits with 0.",
    ],
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
    statement: "You are given an integer array nums of length n and an array multipliers of length m (m <= n). You perform exactly m operations; on the i-th operation you remove either the leftmost or the rightmost remaining element of nums, multiply it by multipliers[i], add the result to your running score, and that element is gone for future operations. Return the maximum score achievable after all m operations.",
    examples: [{"input":"nums = [1,2,3], multipliers = [3,2,1]","output":"14","explanation":"Take 3 from the right (3*3=9), then 2 from the right (2*2=4), then 1 from the remaining (1*1=1): total 9+4+1=14."},{"input":"nums = [-5,-3,-3,-2,7,1], multipliers = [-10,-5,3,4,6]","output":"102"}],
    constraints: ["1 <= m <= 300","m <= n <= 10^5","-1000 <= nums[i], multipliers[i] <= 1000"],
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
    lineByLine: [
      "`vector<vector<int>> dp(m+1,vector<int>(m+1,0));` — dp[i][left] is the best score from step i on, given left picks taken so far; right is derivable as i-left.",
      "`for(int i=m-1;i>=0;i--) for(int left=i;left>=0;left--)` — fill backward since step i depends on the already-computed step i+1.",
      "`int right=i-left;` — recovers right-picks from step and left-count, keeping the table 2D instead of 3D.",
      "`dp[i][left]=max(...);` — pick leftmost or rightmost remaining element, take the better continuation.",
      "`return dp[0][0];` — the answer starting at step 0 with no picks made yet.",
    ],
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
    statement: "Design a data structure that supports adding points on a 2D plane (duplicates allowed) and, given a query point, counting how many axis-aligned squares with positive area can be formed using the query point together with three previously added points. Implement `add(point)` to insert a point, and `count(point)` to return the number of such squares, treating points added multiple times as distinct occurrences.",
    examples: [{"input":"add([3,10]); add([11,2]); add([3,2]); count([11,10]); count([14,8]); add([11,2]); count([11,10])","output":"1, 0, 2","explanation":"After the first three adds, (11,10) completes exactly one square with (3,10), (11,2), (3,2). (14,8) completes none. After adding (11,2) again, (11,10) can now form the same square in two ways since (11,2) exists twice."}],
    constraints: ["point.length == 2","0 <= x, y <= 1000","At most 3000 calls in total will be made to add and count"],
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
    lineByLine: [
      "`unordered_map<int,unordered_map<int,int>> cnt;` — cnt[x][y] counts how many times (x,y) was added.",
      "`unordered_map<int,vector<int>> xToY;` — all y-values added at a given x, for fast candidate lookup.",
      "`void add(vector<int> p){...}` — record the new point in both structures.",
      "`int px=p[0],py=p[1],ans=0;` — query coordinates; ans accumulates valid squares.",
      "`for(int py2:xToY[px])` — only points sharing x=px can anchor a square with the query point.",
      "`if(py2==py) continue;` — a square needs positive area, so skip the identical point.",
      "`int side=abs(py2-py);` — vertical distance fixes the square's side length.",
      "`for(int px2:{px+side,px-side})` — the square can extend left or right of the shared x.",
      "`ans+=cnt[px][py2]*cnt[px2][py]*cnt[px2][py2];` — multiply the counts of the three other corners needed.",
      "`return ans;` — total squares completable using the query point.",
    ],
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
    statement: "Given a list of words, find the longest word that can be built one character at a time by other words present in the same list, meaning every prefix of that word obtained by removing its last letter(s) down to a single character must also appear in the list. If multiple words of the same maximum length qualify, return the lexicographically smallest one; if none qualify, return an empty string.",
    examples: [{"input":"words = [\"w\",\"wo\",\"wor\",\"worl\",\"world\"]","output":"\"world\"","explanation":"\"world\" can be built up step by step: \"w\" -> \"wo\" -> \"wor\" -> \"worl\" -> \"world\", each prefix present in the list."},{"input":"words = [\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]","output":"\"apple\"","explanation":"Both \"apple\" and \"apply\" can be fully built from shorter list entries, and \"apple\" is lexicographically smaller."}],
    constraints: ["1 <= words.length <= 1000","1 <= words[i].length <= 30","words[i] consists of lowercase English letters","All words[i] are unique"],
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
    lineByLine: [
      "`sort(...length then lex...);` — process shorter prefixes before longer words, and lex-smaller before ties.",
      "`unordered_set<string> built={\"\"};` — seed with empty string so single-char words can extend from it.",
      "`if(built.count(w.substr(0,w.size()-1))){` — buildable only if the word minus its last char is already confirmed buildable.",
      "`built.insert(w); if(w.size()>ans.size()) ans=w;` — mark it buildable and update the best if strictly longer.",
      "`return ans;` — the longest fully-buildable word, lex-smallest on ties, or empty if none qualify.",
    ],
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
    statement: "Given a string text and a list of words, find every pair of indices [i, j] such that the substring of text starting at i and ending at j (inclusive) exactly matches one of the given words. Return the list of matching index pairs sorted in ascending order, first by starting index and then by ending index.",
    examples: [{"input":"text = \"thestoryofleetcodeandme\", words = [\"story\",\"fleet\",\"leetcode\"]","output":"[[3,7],[9,13],[10,17]]","explanation":"text[3..7] = \"story\", text[9..13] = \"fleet\", and text[10..17] = \"leetcode\"."},{"input":"text = \"ababa\", words = [\"aba\",\"ab\"]","output":"[[0,1],[0,2],[2,3],[2,4]]","explanation":"\"ab\" occurs at [0,1] and [2,3]; \"aba\" occurs at [0,2] and [2,4]."}],
    constraints: ["1 <= text.length <= 100","1 <= words.length <= 20","1 <= words[i].length <= 50","text and words[i] consist of lowercase English letters","All words[i] are unique"],
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
    lineByLine: [
      "`for(auto& w:words){...}n->end=true;` — insert every dictionary word into a shared trie up front.",
      "`for(int i=0;i<(int)text.size();i++)` — try every position as a possible start of a matching word.",
      "`for(int j=i;j<(int)text.size();j++)` — extend the substring one char at a time, walking the trie in lockstep.",
      "`int c=text[j]-'a'; if(!n->ch[c]) break;` — no branch for the next char means stop extending from this start.",
      "`n=n->ch[c]; if(n->end) res.push_back({i,j});` — record the pair whenever a complete word is reached; overlaps are fine.",
      "`return res;` — pairs come out already sorted by start then end due to loop order.",
    ],
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
    statement: "Given two strings s and t of the same length, determine whether s is isomorphic to t: every character in s can be replaced consistently to get t, meaning there must be a one-to-one mapping between characters (no character maps to more than one character, and no two characters map to the same character), while character order stays the same. Return true if such a mapping exists, otherwise false.",
    examples: [{"input":"s = \"egg\", t = \"add\"","output":"true","explanation":"'e'->'a' and 'g'->'d' forms a valid one-to-one mapping."},{"input":"s = \"foo\", t = \"bar\"","output":"false","explanation":"'o' would need to map to both 'a' and 'r'."},{"input":"s = \"paper\", t = \"title\"","output":"true"}],
    constraints: ["1 <= s.length <= 5 * 10^4","t.length == s.length","s and t consist of any valid ASCII characters"],
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
    lineByLine: [
      "`unordered_map<char, char> st, ts;` — st maps s-char to t-char; ts maps t-char to s-char, needed for a true bijection.",
      "`for (int i = 0; i < (int)s.size(); i++)` — walk both strings together.",
      "`if (st.count(s[i]) && st[s[i]] != t[i]) return false;` — this s-char already maps elsewhere, inconsistent.",
      "`if (ts.count(t[i]) && ts[t[i]] != s[i]) return false;` — two s-chars trying to map to the same t-char.",
      "`st[s[i]] = t[i]; ts[t[i]] = s[i];` — record both directions of the mapping.",
      "`return true;` — no contradiction found, so a valid bijective mapping exists.",
    ],
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
    statement: "Find all combinations of exactly k distinct numbers, chosen from 1 through 9, that add up to a given number n. Each number may appear at most once in a combination, and only strictly increasing (duplicate-free) combinations should be returned.",
    examples: [{"input":"k = 3, n = 7","output":"[[1,2,4]]"},{"input":"k = 3, n = 9","output":"[[1,2,6],[1,3,5],[2,3,4]]"},{"input":"k = 4, n = 1","output":"[]"}],
    constraints: ["2 <= k <= 9","1 <= n <= 60"],
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
    lineByLine: [
      "`void bt(int start, int k, int rem, vector<int>& path) {` — start enforces increasing digits, k is picks left, rem is sum needed.",
      "`if (k == 0 && rem == 0) { res.push_back(path); return; }` — k digits chosen summing to n, a valid combination.",
      "`if (k == 0 || rem <= 0) return;` — either out of picks with sum left, or sum hit zero too early.",
      "`for (int i = start; i <= 9; i++) { if (i > rem) break;` — larger digits only overshoot further, so stop trying.",
      "`path.push_back(i); bt(i + 1, k - 1, rem - i, path); path.pop_back();` — use digit i, recurse past it, then undo.",
      "`bt(1, k, n, path);` — start the search from digit 1, needing k digits summing to n.",
    ],
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
    statement: "Given an array of intervals, find the minimum number of intervals you must remove so that none of the remaining intervals overlap with each other.",
    examples: [{"input":"intervals = [[1,2],[2,3],[3,4],[1,3]]","output":"1","explanation":"Removing [1,3] leaves [1,2], [2,3], [3,4], which don't overlap."},{"input":"intervals = [[1,2],[1,2],[1,2]]","output":"2","explanation":"You need to remove two of the three identical intervals to leave just one."},{"input":"intervals = [[1,2],[2,3]]","output":"0","explanation":"The intervals only touch at an endpoint and don't overlap, so nothing needs removing."}],
    constraints: ["1 <= intervals.length <= 10^5","-5 * 10^4 <= starti < endi <= 5 * 10^4"],
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
    lineByLine: [
      "`sort(...by end...);` — the interval that ends soonest leaves the most room for the rest, so keep it on conflicts.",
      "`int prevEnd = intervals[0][1];` — after sorting by end, the first interval has the earliest end and is kept.",
      "`if (intervals[i][0] < prevEnd) { count++; }` — overlaps the kept interval, so discard it and leave prevEnd unchanged.",
      "`else { prevEnd = intervals[i][1]; }` — no overlap, keep this interval and update prevEnd.",
      "`return count;` — tally of discarded intervals is the minimum removals needed.",
    ],
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
    statement: "Given an integer array that may contain duplicate values, return all possible subsets (the power set) without including any duplicate subset. Subsets may be returned in any order.",
    examples: [{"input":"nums = [1,2,2]","output":"[[],[1],[1,2],[1,2,2],[2],[2,2]]"},{"input":"nums = [0]","output":"[[],[0]]"}],
    constraints: ["1 <= nums.length <= 10","-10 <= nums[i] <= 10"],
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
    lineByLine: [
      "`sort(nums.begin(), nums.end());` — groups equal values adjacently so the duplicate check below works.",
      "`res.push_back(path);` — every partial path is already a valid subset, so record it immediately.",
      "`for (int i = start; i < (int)nums.size(); i++) { if (i > start && nums[i] == nums[i-1]) continue;` — skip a repeated value unless it's the first pick at this level.",
      "`path.push_back(nums[i]); bt(nums, i + 1, path); path.pop_back();` — include nums[i], recurse past it, then undo.",
      "`bt(nums, 0, path);` — start with an empty subset and every index available.",
    ],
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
    statement: "Given an array of intervals where each interval has a start and end value, merge all overlapping intervals and return an array of the resulting non-overlapping intervals that cover all the input ranges.",
    examples: [{"input":"intervals = [[1,3],[2,6],[8,10],[15,18]]","output":"[[1,6],[8,10],[15,18]]","explanation":"Intervals [1,3] and [2,6] overlap and merge into [1,6]."},{"input":"intervals = [[1,4],[4,5]]","output":"[[1,5]]","explanation":"Intervals that merely touch at an endpoint are considered overlapping and get merged."}],
    constraints: ["1 <= intervals.length <= 10^4","0 <= starti <= endi <= 10^4"],
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
    lineByLine: [
      "`sort(intervals.begin(), intervals.end());` — sorting by start makes intervals that should merge sit adjacent.",
      "`res.push_back(intervals[0]);` — seed the result with the earliest-starting interval.",
      "`if (intervals[i][0] <= last[1])` — overlaps or touches the last merged interval, using <= to merge touching ranges.",
      "`last[1] = max(last[1], intervals[i][1]);` — extend the merged end, taking max in case this one is nested inside.",
      "`else { res.push_back(intervals[i]); }` — no overlap, start a new merged group.",
      "`return res;` — final list of merged, non-overlapping intervals.",
    ],
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
    statement: "Given an integer array nums and an integer k, return the k most frequently occurring elements in the array. The result may be returned in any order, and it is guaranteed that the answer is unique.",
    examples: [{"input":"nums = [1,1,1,2,2,3], k = 2","output":"[1,2]"},{"input":"nums = [1], k = 1","output":"[1]"}],
    constraints: ["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4","k is between 1 and the number of distinct elements in nums","The test cases guarantee that the answer is unique"],
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
    lineByLine: [
      "`unordered_map<int, int> freq; for (int n : nums) freq[n]++;` — count how many times each value occurs.",
      "`vector<vector<int>> bucket(nums.size() + 1);` — index the bucket array by frequency, not by value.",
      "`for (auto& [val, cnt] : freq) bucket[cnt].push_back(val);` — drop each value into the bucket matching its frequency.",
      "`for (int i = (int)bucket.size() - 1; i >= 0 && (int)res.size() < k; i--)` — walk buckets high to low, stop once k collected.",
      "`for (int v : bucket[i]) res.push_back(v);` — collect every value at that frequency level.",
      "`return res;` — the k most frequent elements, found without sorting.",
    ],
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
    statement: "Given two sorted arrays nums1 and nums2 of sizes m and n respectively, return the median of the combined sorted array. The overall run time complexity should be O(log(m + n)).",
    examples: [{"input":"nums1 = [1,3], nums2 = [2]","output":"2.00000","explanation":"The merged array is [1,2,3], whose median is 2."},{"input":"nums1 = [1,2], nums2 = [3,4]","output":"2.50000","explanation":"The merged array is [1,2,3,4], whose median is (2 + 3) / 2 = 2.5."}],
    constraints: ["nums1.length == m","nums2.length == n","0 <= m, n <= 1000","1 <= m + n <= 2000","-10^6 <= nums1[i], nums2[i] <= 10^6"],
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
    lineByLine: [
      "`if (A.size() > B.size()) return findMedianSortedArrays(B, A);` — binary search on the smaller array bounds it to O(log(min(m,n))).",
      "`int half = (m + n) / 2;` — how many elements belong in the combined left half of the merged array.",
      "`int i = L + (R - L) / 2; int j = half - i;` — pick a cut i in A, derive the matching cut j in B so i+j is always half.",
      "`int Aleft = i > 0 ? A[i-1] : INT_MIN; int Aright = i < m ? A[i] : INT_MAX;` — boundary values around A's cut, with sentinels for the edges.",
      "`int Bleft = j > 0 ? B[j-1] : INT_MIN; int Bright = j < n ? B[j] : INT_MAX;` — same boundary values for B's cut.",
      "`if (Aleft <= Bright && Bleft <= Aright)` — valid partition: everything on the left is <= everything on the right.",
      "`if ((m + n) % 2 == 1) return min(Aright, Bright);` — odd total, the median is the smallest of the two right-side firsts.",
      "`return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0;` — even total, average the boundary values.",
      "`} else if (Aleft > Bright) { R = i - 1; }` — too many elements taken from A, shrink i.",
      "`else { L = i + 1; }` — too few elements taken from A, grow i.",
    ],
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
    statement: "Given an unsorted integer array nums, find the smallest positive integer that does not appear in the array. Your algorithm must run in O(n) time while using only O(1) extra space (in-place modification of the input array is allowed).",
    examples: [{"input":"nums = [1,2,0]","output":"3"},{"input":"nums = [3,4,-1,1]","output":"2"},{"input":"nums = [7,8,9,11,12]","output":"1"}],
    constraints: ["1 <= nums.length <= 10^5","-2^31 <= nums[i] <= 2^31 - 1"],
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
    lineByLine: [
      "`int n = nums.size();` — the answer is guaranteed to be in [1, n+1].",
      "`for (int i = 0; i < n; i++)` — visit every index, placing the value that belongs there.",
      "`while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i]) swap(nums[i], nums[nums[i]-1]);` — swap an in-range value to its home index x-1, repeating as needed.",
      "`for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;` — first index not holding i+1 reveals the smallest missing positive.",
      "`return n + 1;` — every index held its expected value, so 1..n are all present.",
    ],
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
    statement: "Given an integer array, produce a new array where each position holds the count of elements to its right in the original array that are strictly smaller than the element at that position.",
    examples: [{"input":"nums = [5,2,6,1]","output":"[2,1,1,0]","explanation":"To the right of 5 there are 2 smaller values (2 and 1); to the right of 2 there is 1 (1); to the right of 6 there is 1 (1); 1 has none to its right."},{"input":"nums = [-1,-1]","output":"[0,0]"},{"input":"nums = [2,0,1]","output":"[2,0,0]"}],
    constraints: ["1 <= nums.length <= 10^5","-10^4 <= nums[i] <= 10^4"],
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
    lineByLine: [
      "`vector<int> counts;` — counts[originalIndex] accumulates how many smaller elements ended up to its right.",
      "`int i = l, j = mid, rightCount = 0;` — rightCount tallies how many right-half elements already merged in ahead of the current left element.",
      "`if (arr[j].first < arr[i].first) { tmp.push_back(arr[j++]); rightCount++; }` — right element is smaller, pull it in and bump rightCount.",
      "`else { counts[...] += rightCount; tmp.push_back(arr[i++]); }` — left element placed, rightCount smaller elements are already to its right.",
      "`while (i < mid) { counts[arr[i].second] += rightCount; tmp.push_back(arr[i++]); }` — remaining left elements all get the full rightCount.",
      "`copy(tmp.begin(), tmp.end(), arr.begin() + l);` — write the merged range back so higher recursion levels see it sorted.",
      "`for (int i = 0; i < n; i++) arr[i] = {nums[i], i};` — pair each value with its original index before sorting.",
      "`return counts;` — final tally, one entry per original position.",
    ],
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
    statement: "Given strings s and t, find the minimum-length contiguous substring W of s such that t appears in W as a subsequence (characters in the same relative order, not necessarily adjacent). Return an empty string if no such W exists.",
    examples: [{"input":"s = \"abcdebdde\", t = \"bde\"","output":"\"bcde\"","explanation":"\"bcde\" contains 'b','d','e' in order and is shorter than the other candidate \"bdde\"."},{"input":"s = \"fgrqsqsnodwmxzkzxwqegkndaa\", t = \"kzxwq\"","output":"\"kzxwq\""},{"input":"s = \"abc\", t = \"ac\"","output":"\"ac\""}],
    constraints: ["1 <= s.length <= 2 * 10^4","1 <= t.length <= 100","s and t consist of lowercase English letters"],
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
    lineByLine: [
      "`int si = 0, best = INT_MAX, bStart = 0;` — si scans forward through s; best/bStart track the shortest valid window.",
      "`while (si < (int)s.size())` — keep searching for new windows until s is exhausted.",
      "`int ti = 0; while (...) { if (s[si] == t[ti]) ti++; si++; }` — forward pass: greedily match t as a subsequence, giving some valid window ending.",
      "`if (ti < (int)t.size()) break;` — t couldn't be fully matched, no more windows exist.",
      "`int end = si; ti = (int)t.size() - 1; while (ti >= 0) { if (s[--si] == t[ti]) ti--; }` — backward pass finds the latest possible start, making the window minimal.",
      "`if (end - si < best) { best = end - si; bStart = si; }` — compare this window's length against the best so far.",
      "`si++;` — move past this window's start before searching for the next candidate.",
      "`return best == INT_MAX ? \"\" : s.substr(bStart, best);` — empty string if no window found, else the shortest one.",
    ],
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
    statement: "Given a 2D binary matrix filled with '0's and '1's, find the largest rectangle containing only '1's and return its area.",
    examples: [{"input":"matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]","output":"6","explanation":"The largest rectangle of all 1's spans rows 1-2 and columns 2-4, giving an area of 2 * 3 = 6."},{"input":"matrix = [[\"0\"]]","output":"0"}],
    constraints: ["rows == matrix.length, cols == matrix[i].length","1 <= rows, cols <= 200","matrix[i][j] is '0' or '1'"],
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
    lineByLine: [
      "`int largestRect(vector<int>& h)` — the largest-rectangle-in-histogram algorithm, reused as a subroutine.",
      "`h.push_back(0); ... h.pop_back();` — sentinel forces all bars to resolve, removed after so heights isn't left mutated.",
      "`while (!st.empty() && h[st.top()] > h[i]) { ... }` — shorter bar means the stacked bar's rectangle can now be finalized.",
      "`vector<int> heights(n, 0);` — heights[j] tracks consecutive 1s stacked above column j, like histogram bars.",
      "`heights[j] = matrix[i][j] == '1' ? heights[j] + 1 : 0;` — a '1' extends the run, a '0' resets it to 0.",
      "`res = max(res, largestRect(heights));` — largest all-1s rectangle with bottom edge on this row.",
      "`return res;` — every rectangle's bottom edge is some row, so checking all rows covers every case.",
    ],
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
    statement: "Design a data structure that implements a Least Frequently Used (LFU) cache with a fixed positive capacity. It should support get(key), which returns the value if present or -1 otherwise while incrementing that key's use count, and put(key, value), which inserts or updates the key-value pair. When the cache is full and a new key must be inserted, evict the key with the lowest use count; if there is a tie, evict the least recently used among them. Both operations must run in O(1) average time.",
    examples: [{"input":"[\"LFUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"get\",\"put\",\"get\",\"get\",\"get\"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]","output":"[null,null,null,1,null,-1,3,null,-1,3,4]","explanation":"Capacity 2. Inserting key 3 evicts key 2 (least frequently used); inserting key 4 evicts key 1 since keys 1 and 3 tie in frequency but 1 was used less recently."}],
    constraints: ["0 <= capacity <= 10^4","0 <= key <= 10^5","0 <= value <= 10^9","At most 2 * 10^5 calls total will be made to get and put"],
    intuition:
      "LFU evicts the Least Frequently Used key (ties broken by LRU). Needs O(1) get and put. Use two hash maps: key→{value, freq} and freq→ordered set (doubly linked list) of keys. Track minFreq to know which bucket to evict from.",
    recognize: [
      "It's LRU-cache plus a second dimension: eviction now depends on use count first, and only falls back to recency as a tiebreaker.",
      "\"Both operations must run in O(1) average time\" rules out scanning for the minimum frequency on every put — a plain min-heap by frequency would cost O(log n).",
      "A tie in frequency needs an ordering within the tie — that's a second axis (recency) layered on top of frequency buckets.",
      "→ These clues say: group keys into per-frequency doubly linked lists (LRU order inside each), track the current minimum frequency, and evict from that bucket's tail.",
    ],
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
    lineByLine: [
      "`unordered_map<int, pair<int,int>> key2vf;` — key to {value, frequency}, O(1) lookup for both.",
      "`unordered_map<int, list<int>> freq2keys;` — buckets keys by use-count, each bucket LRU-ordered.",
      "`unordered_map<int, list<int>::iterator> key2it;` — each key's position in its bucket, for O(1) erase.",
      "`int f = key2vf[key].second; freq2keys[f].erase(key2it[key]);` — remove the key from its stale frequency bucket.",
      "`if (freq2keys[f].empty()) { ...; if (minFreq == f) minFreq++; }` — bucket died, so bump minFreq if it was the min.",
      "`key2vf[key].second++; freq2keys[f+1].push_front(key); ...` — bump frequency, reinsert at front of the next bucket.",
      "`int get(int key) { ...; touch(key); ... }` — a hit counts as a use, so bump frequency and reorder.",
      "`if (!cap) return;` — capacity 0 means every put is a no-op.",
      "`if (key2vf.count(key)) { ...; touch(key); return; }` — updating an existing key also counts as a use.",
      "`int evict = freq2keys[minFreq].back(); ...` — at capacity, evict the LRU key from the lowest-frequency bucket.",
      "`key2vf[key] = {value, 1}; freq2keys[1].push_front(key); ...; minFreq = 1;` — new keys start at frequency 1.",
    ],
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
    statement: "Given the root of a binary tree, find the subtree (a node together with all of its descendants) that is a valid binary search tree and whose node values sum to the maximum possible amount. Return that maximum sum; if no subtree is a valid BST other than possibly empty ones, treat the sum as 0.",
    examples: [{"input":"root = [5,4,8,3,null,6,3]","output":"7","explanation":"The subtree rooted at the node with value 4 (containing 4 and 3) is the largest valid BST subtree, summing to 7; the subtree rooted at 8 is invalid because its right child (3) is not greater than 8."},{"input":"root = [4,2,6,1,3,5,7]","output":"28","explanation":"The entire tree is already a valid BST, so its full sum is the answer."}],
    constraints: ["The number of nodes in the tree is in the range [1, 4 * 10^4]","-4 * 10^4 <= Node.val <= 4 * 10^4"],
    intuition:
      "Find the maximum sum of all keys in any BST subtree of the binary tree. Post-order DFS: at each node, determine if its subtree is a valid BST and compute its sum. Return up min, max, sum, and isValid to the parent.",
    recognize: [
      "It's a general binary tree, not a BST — you must discover WHICH subtrees happen to be valid BSTs, combining validate-bst's logic with an aggregated sum.",
      "Deciding validity at a node needs its children's min/max/validity/sum already computed — that's four pieces of information that must flow upward from children to parent.",
      "The failing example shows a subtree can look locally fine but be invalid due to a value violating the range set by nodes further down — same trap as validate-bst.",
      "→ These clues say: post-order DFS returning a bundle (isBST, min, max, sum) so each node can check the BST property using its children's reported ranges, updating a global max sum along the way.",
    ],
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
    lineByLine: [
      "`int ans = 0;` — global best sum found so far, defaulting to 0 for 'no valid BST subtree'.",
      "`array<int,4> dfs(TreeNode* node)` — returns {isBST, minVal, maxVal, sum} for this subtree, all needed by the parent.",
      "`if (!node) return {1, INT_MAX, INT_MIN, 0};` — an empty subtree is a valid BST; sentinels ensure they never constrain a real comparison.",
      "`auto [lv, lmin, lmax, lsum] = dfs(node->left); auto [rv, rmin, rmax, rsum] = dfs(node->right);` — resolve both children first, post-order.",
      "`if (lv && rv && lmax < node->val && node->val < rmin)` — valid only if both children are BSTs and this value fits strictly between their ranges.",
      "`int sum = lsum + rsum + node->val; ans = max(ans, sum);` — valid subtree is a candidate; update the global max.",
      "`return {1, min(lmin, node->val), max(rmax, node->val), sum};` — report this subtree's range up to the parent.",
      "`return {0, 0, 0, 0};` — invalid; parent will reject based on isBST alone.",
      "`dfs(root); return ans;` — traversal populates ans as a side effect; return the global maximum.",
    ],
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
    statement: "You are given k sorted lists of integers. Find the smallest range [a, b] such that it contains at least one number from each of the k lists. If multiple ranges have the same smallest length, return the one with the smallest starting value.",
    examples: [{"input":"nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]","output":"[20,24]","explanation":"The range [20,24] includes 24 from list 1, 20 from list 2, and 22 from list 3, and no smaller range covers all three lists."},{"input":"nums = [[1,2,3],[1,2,3],[1,2,3]]","output":"[1,1]"}],
    constraints: ["k == nums.length","1 <= k <= 3500","1 <= nums[i].length <= 50","-10^5 <= nums[i][j] <= 10^5","nums[i] is sorted in non-decreasing order"],
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
    lineByLine: [
      "`priority_queue<T, vector<T>, greater<T>> pq;` — min-heap seeded with the first element of every list, top is always the current minimum.",
      "`int curMax = INT_MIN; for (...) curMax = max(...);` — track the current max across all heap elements, since the range must span min to max.",
      "`while ((int)pq.size() == (int)nums.size())` — keep going only while every list still has a representative in the heap.",
      "`if (curMax - val < rR - rL) { rL = val; rR = curMax; }` — [val, curMax] covers all lists now; keep it if narrower than the best so far.",
      "`if (ei + 1 < (int)nums[li].size()) { pq.push(...); curMax = max(...); }` — advance the list that held the minimum, the only way to shrink the range.",
      "`return {rL, rR};` — the narrowest range found while all k lists were represented.",
    ],
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
    statement: "You are given a 9x9 Sudoku board that is partially filled in, with empty cells marked '.'. Fill in the empty cells in place so that every row, every column, and every 3x3 sub-box contains each of the digits 1 through 9 exactly once, producing the unique valid solution.",
    examples: [{"input":"board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]","output":"[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]","explanation":"Each row, column, and 3x3 box now contains 1-9 exactly once."}],
    constraints: ["board.length == 9, board[i].length == 9","board[i][j] is a digit '1'-'9' or '.'","It is guaranteed that the input board has exactly one solution"],
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
    lineByLine: [
      "`if (b[r][i] == d) return false; if (b[i][c] == d) return false;` — digit d can't repeat in row r or column c.",
      "`if (b[3*(r/3)+i/3][3*(c/3)+i%3] == d) return false;` — walks the 9 cells of the 3x3 box containing (r,c).",
      "`for (int r...) for (int c...) if (b[r][c] == '.') {` — scan row-major for the first still-empty cell.",
      "`for (char d = '1'; d <= '9'; d++) { if (isValid(b, r, c, d)) { b[r][c] = d; if (solve(b)) return true; b[r][c] = '.'; } }` — try each digit, recurse, undo if it leads to a dead end.",
      "`return false;` — every digit failed at this cell, backtrack further.",
      "`return true;` — no empty cell left, the board is completely filled.",
    ],
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
    statement: "There are n servers numbered 0 to n-1 connected by a list of undirected connections, forming a network that may contain redundant links. A connection is called critical if removing it would split the network into two or more disconnected pieces. Return all critical connections in any order.",
    examples: [{"input":"n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]","output":"[[1,3]]","explanation":"Nodes 0,1,2 form a cycle so none of those edges are critical, but [1,3] is the only link to node 3."},{"input":"n = 2, connections = [[0,1]]","output":"[[0,1]]","explanation":"The single edge is the only connection, so removing it disconnects the network."},{"input":"n = 5, connections = [[0,1],[1,2],[2,0],[1,3],[3,4]]","output":"[[1,3],[3,4]]"}],
    constraints: ["1 <= n <= 10^5","n - 1 <= connections.length <= 10^5","0 <= connections[i][0], connections[i][1] <= n - 1","there are no self-loops or repeated connections","the network is guaranteed to be connected"],
    intuition:
      "Find all bridges (edges whose removal disconnects the graph). Use Tarjan's bridge-finding algorithm: DFS with discovery time and low-link values. An edge (u,v) is a bridge if low[v] > disc[u] — meaning v can't reach back to u or earlier without using the edge (u,v).",
    recognize: [
      "\"Removing it would split the network\" is asking for graph bridges specifically — edges that are NOT part of any cycle.",
      "The example shows edges inside a cycle (0-1, 1-2, 2-0) are safe, while the single edge to node 3 (not part of any cycle) is critical — cycles provide alternate routes, so an edge only matters if it's the sole connection.",
      "n up to 10^5 rules out testing each edge individually by removing it and re-running a full connectivity check (that would be O(E × (V+E))) — you need to find all bridges in one traversal.",
      "→ These clues say: Tarjan's bridge-finding DFS, tracking discovery time and low-link value per node, flagging an edge (u,v) as a bridge when low[v] > disc[u].",
    ],
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
    lineByLine: [
      "`int timer = 0;` — global counter assigning each node its discovery order.",
      "`disc[u] = low[u] = timer++;` — disc is when u was found; low is the earliest time reachable from u's subtree, including via one back-edge.",
      "`if (disc[v] == -1) { dfs(v, u, adj, disc, low, res); low[u] = min(low[u], low[v]); if (low[v] > disc[u]) res.push_back({u, v}); }` — tree edge: recurse, then bridge test low[v] > disc[u] means v's subtree has no way back except through this edge.",
      "`else if (v != parent) { low[u] = min(low[u], disc[v]); }` — back edge to an ancestor, pulling u's low value down.",
      "`for (auto& e : connections) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }` — undirected, add both directions.",
      "`vector<int> disc(n, -1), low(n, 0); dfs(0, -1, adj, disc, low, res);` — start DFS from node 0; the graph is guaranteed connected.",
      "`return res;` — every edge flagged as a bridge is a critical connection.",
    ],
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
    statement: "There are children standing in a line, each with a given rating value. You must give each child at least one candy, and any child with a higher rating than an immediate neighbor must receive more candy than that neighbor. Return the minimum total number of candies required.",
    examples: [{"input":"ratings = [1,0,2]","output":"5","explanation":"One optimal distribution is candies = [2,1,2]."},{"input":"ratings = [1,2,2]","output":"4","explanation":"One optimal distribution is candies = [1,2,1]; the two equal ratings need not differ in candy count."}],
    constraints: ["1 <= ratings.length <= 2 * 10^4","0 <= ratings[i] <= 2 * 10^4"],
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
    lineByLine: [
      "`vector<int> candy(n, 1);` — every child gets at least 1 candy as the baseline.",
      "`for (int i = 1; i < n; i++) if (ratings[i] > ratings[i-1]) candy[i] = candy[i-1] + 1;` — left pass enforces the left-neighbor rule.",
      "`for (int i = n-2; i >= 0; i--) if (ratings[i] > ratings[i+1]) candy[i] = max(candy[i], candy[i+1] + 1);` — right pass enforces the right-neighbor rule without undoing the left pass.",
      "`return accumulate(candy.begin(), candy.end(), 0);` — sum of per-child candy gives the minimum valid total.",
    ],
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
    statement: "You are given the working schedules of several employees, where each employee's schedule is a list of non-overlapping intervals sorted by start time. Return a sorted list of finite intervals representing the common free time shared by all employees, excluding any unbounded gaps before the first or after the last interval.",
    examples: [{"input":"schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]","output":"[[3,4]]","explanation":"Merging every employee's busy intervals gives [1,3] and [4,10]; the only gap between them is [3,4]."},{"input":"schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]","output":"[[5,6],[7,9]]","explanation":"Merging all busy intervals gives [1,5], [6,7], [9,12], leaving gaps [5,6] and [7,9]."}],
    constraints: ["1 <= schedule.length <= 50","0 <= schedule[i].length <= 50","0 <= starti < endi <= 10^8","Each employee's own intervals are sorted and non-overlapping"],
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
    lineByLine: [
      "`for (auto& emp : schedule) for (auto& iv : emp) all.push_back(iv);` — flatten every employee's schedule since only the union of busy time matters.",
      "`sort(all.begin(), all.end(), ...);` — sort all busy intervals by start so mergeable ones become adjacent.",
      "`Interval cur = all[0];` — track a running merged busy block starting from the earliest interval.",
      "`if (all[i].start <= cur.end) cur.end = max(cur.end, all[i].end);` — extend the merged block if the next interval overlaps it.",
      "`else { res.push_back({cur.end, all[i].start}); cur = all[i]; }` — a real gap exists, record it as free time and start a new block.",
      "`return res;` — every gap between merged busy blocks, excluding time before the first or after the last.",
    ],
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
    statement: "Given a string containing an arithmetic expression with non-negative integers, plus signs, minus signs, parentheses, and spaces, evaluate and return its integer result without using a built-in expression evaluator.",
    examples: [{"input":"s = \"1 + 1\"","output":"2"},{"input":"s = \" 2-1 + 2 \"","output":"3"},{"input":"s = \"(1+(4+5+2)-3)+(6+8)\"","output":"23"}],
    constraints: ["1 <= s.length <= 3 * 10^5","s consists of digits, '+', '-', '(', ')', and ' '","s represents a valid expression","'+' is never used as a unary operator","'-' may be used as a unary operator, only in front of a number or a parenthesized expression"],
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
    lineByLine: [
      "`stack<int> stk; int result = 0, sign = 1, num = 0;` — result is the current sub-expression's value, sign applies to the next number, stack saves outer context on '('.",
      "`if (isdigit(c)) num = num * 10 + (c - '0');` — build a multi-digit number one character at a time.",
      "`else if (c == '+' || c == '-') { result += sign * num; num = 0; sign = (c == '+') ? 1 : -1; }` — fold the finished number into result using the pending sign, then remember the new sign.",
      "`else if (c == '(') { stk.push(result); stk.push(sign); result = 0; sign = 1; }` — save outer result and sign, start fresh for the inner expression.",
      "`else if (c == ')') { result += sign * num; num = 0;` — finalize any pending number into the inner result.",
      "`result *= stk.top(); stk.pop();  // outer sign` — apply the sign that preceded the '(' to the whole parenthesized value.",
      "`result += stk.top(); stk.pop();  // outer result` — resume the outer expression from where it left off.",
      "`return result + sign * num;` — fold in any final pending number for the answer.",
    ],
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
    statement: "You are given an m x n classroom represented by a grid of seats, where each cell is either a usable seat ('.') or a broken seat ('#') that cannot be assigned. Seat as many students as possible in usable seats so that no student can cheat: a student can see the answers of another student sitting immediately to their left, immediately to their right, or diagonally in front-left or front-right (the row directly above or below). Return the maximum number of students that can take the exam simultaneously under these constraints.",
    examples: [{"input":"seats = [[\"#\",\".\",\"#\",\"#\",\".\",\"#\"],[\".\",\"#\",\"#\",\"#\",\"#\",\".\"],[\"#\",\".\",\"#\",\"#\",\".\",\"#\"]]","output":"4","explanation":"One valid arrangement seats students at (0,1), (1,0), (1,5), and (2,4) with no two able to see each other."},{"input":"seats = [[\".\",\"#\"],[\"#\",\".\"]]","output":"2","explanation":"Neither seat can see the other since diagonal seats are staggered by the broken cells, so both usable seats can be filled."},{"input":"seats = [[\".\",\".\"],[\".\",\".\"]]","output":"2","explanation":"Placing two students diagonally, e.g. (0,0) and (1,1), avoids any line of sight."}],
    constraints: ["1 <= m <= 8","1 <= n <= 8","seats[i][j] is '.' or '#'"],
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
    lineByLine: [
      "`vector<int> rowMask(m); for ... if (seats[i][j] == '.') rowMask[i] |= (1 << j);` — encode each row's usable seats as a bitmask for fast validity checks.",
      "`vector<vector<int>> dp(m, vector<int>(1 << n, -1));` — dp[row][mask] is max students seatable through this row with this pattern; -1 marks invalid.",
      "`if ((mask & rowMask[0]) != mask) continue;` — mask must only use usable seats.",
      "`if (mask & (mask >> 1)) continue;` — no two adjacent students in the row.",
      "`dp[0][mask] = __builtin_popcount(mask);` — a valid first-row pattern seats as many students as it has set bits.",
      "`for (int i = 1; i < m; i++)` — build row by row, since validity depends on the row above.",
      "`if ((mask & rowMask[i]) != mask || (mask & (mask >> 1))) continue;` — same intra-row checks for row i.",
      "`for (int prev = 0; prev < (1 << n); prev++) { if (dp[i-1][prev] < 0) continue;` — combine with every valid pattern from row i-1.",
      "`if (mask & (prev << 1)) continue; if (mask & (prev >> 1)) continue;` — reject diagonal front-left/front-right cheating between rows.",
      "`dp[i][mask] = max(dp[i][mask], dp[i-1][prev] + __builtin_popcount(mask));` — take the best valid transition.",
      "`return *max_element(dp[m-1].begin(), dp[m-1].end());` — best total across all valid final-row patterns.",
    ],
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
    statement: "Design an autocomplete system that is initialized with a set of historical sentences and how many times each was typed before. The system receives one character at a time; for each character except a special end-of-input symbol '#', it should return the top 3 historical sentences that start with everything typed so far, ranked by typing frequency (most frequent first, ties broken lexicographically). When '#' is typed, the current input is treated as a completed new sentence, added to (or having its frequency incremented in) the historical set, and the input buffer resets for the next query.",
    examples: [{"input":"sentences = [\"i love you\",\"island\",\"iroman\",\"i love leetcode\"], times = [5,3,2,2]; then type 'i'","output":"[\"i love you\",\"island\",\"i love leetcode\"]","explanation":"These are the sentences starting with \"i\" ranked by recorded frequency (5, 3, 2), with \"i love leetcode\" and \"iroman\" tied at 2 and \"i love leetcode\" preferred lexicographically for the third slot."},{"input":"after 'i' type ' ' then 'a'","output":"[]","explanation":"No historical sentence starts with \"i a\", so no suggestions are returned."}],
    constraints: ["1 <= sentences.length <= 100","1 <= sentences[i].length <= 100","1 <= times[i] <= 50","Total characters typed across all input calls is at most 5000","Characters are lowercase English letters, spaces, or the terminating '#'"],
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
    lineByLine: [
      "`unordered_map<char, TrieNode*> children; unordered_map<string, int> counts;` — each node caches every sentence passing through it, avoiding a DFS per keystroke.",
      "`void insert(TrieNode* node, const string& s, int c)` — at every node along the path, record that sentence s contributed c to its counts.",
      "`AutocompleteSystem(...) { for (...) insert(root, sentences[i], times[i]); }` — seed the trie with the initial sentences and frequencies.",
      "`if (c == '#') { insert(root, prefix, 1); prefix = \"\"; cur = root; return {}; }` — finalize the typed sentence, insert it, and reset for the next query.",
      "`prefix += c; if (cur && cur->children.count(c)) cur = cur->children[c]; else { cur = nullptr; return {}; }` — advance the pointer if this path exists, else remember it's dead.",
      "`for (auto& [s, cnt] : cur->counts) cands.push_back({cnt, s});` sorted by frequency desc, lex asc — matches the ranking rule.",
      "`for (int i = 0; i < min(3,(int)cands.size()); i++) res.push_back(cands[i].second);` — return the top 3, or fewer if not enough exist.",
    ],
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
    statement: "Given an m x n grid of 0s (open cells) and 1s (obstacles), and an integer k representing how many obstacles you are allowed to remove along your route, find the minimum number of moves needed to travel from the top-left cell to the bottom-right cell, moving only up, down, left, or right between adjacent cells. Return -1 if reaching the destination is not possible even after eliminating up to k obstacles.",
    examples: [{"input":"grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1","output":"6","explanation":"The shortest route requires passing through exactly one obstacle, which is allowed since k = 1."},{"input":"grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1","output":"-1","explanation":"Reaching the bottom-right cell would require eliminating more than 1 obstacle."}],
    constraints: ["1 <= m, n <= 40","1 <= k <= m * n","grid[i][j] is 0 or 1","grid[0][0] == 0 and grid[m-1][n-1] == 0"],
    intuition:
      "Find shortest path from top-left to bottom-right in grid, allowed to eliminate at most k obstacles. BFS with state (row, col, remaining_k). A 3D visited array prevents revisiting same (position, k_remaining) state.",
    recognize: [
      "\"Minimum number of moves\" with uniform-cost steps is shortest path in an unweighted grid — the base pattern is BFS, same family as rotting-oranges/walls-gates.",
      "The twist is a BUDGET (k obstacle removals) that changes what \"visited\" means: the same cell can be revisited productively if you arrive with a different amount of budget remaining.",
      "Plain 2D visited (row, col) would wrongly block a later visit to the same cell that still has more remaining budget and could lead to a shorter or only path — that's the tell you need a third dimension in your state.",
      "→ These clues say: BFS where each state is (row, col, obstacles_remaining), with a 3D visited array keyed on all three, since the same position with different remaining budget is a genuinely different state.",
    ],
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
    lineByLine: [
      "`if (m == 1 && n == 1) return 0;` — already at the destination.",
      "`vector<vector<vector<bool>>> vis(m, vector<vector<bool>>(n, vector<bool>(k+1, false)));` — visited is 3D (row, col, budget remaining), since the same cell with different budget is a different state.",
      "`q.push({0, 0, k, 0}); vis[0][0][k] = true;` — start with full budget and 0 steps.",
      "`int nk = rem - grid[nr][nc];` — subtracting the cell's value costs one unit of budget only when it's an obstacle.",
      "`if (nk < 0) continue;` — this move would exceed the removal budget.",
      "`if (nr == m-1 && nc == n-1) return steps + 1;` — BFS's increasing step order guarantees the first arrival is minimal.",
      "`if (!vis[nr][nc][nk]) { vis[nr][nc][nk] = true; q.push({nr, nc, nk, steps+1}); }` — enqueue only new (position, budget) states.",
      "`return -1;` — every reachable state was exhausted without hitting the destination.",
    ],
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
    statement: "Given an array of integers, return a new array of the same length where each element is the sum of itself and all preceding elements in the original array (the running/prefix sum).",
    examples: [{"input":"nums = [1,2,3,4]","output":"[1,3,6,10]"},{"input":"nums = [1,1,1,1,1]","output":"[1,2,3,4,5]"},{"input":"nums = [3,1,2,10,1]","output":"[3,4,6,16,17]"}],
    constraints: ["1 <= nums.length <= 1000","-10^6 <= nums[i] <= 10^6"],
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
    lineByLine: [
      "`for (int i = 1; i < nums.size(); i++)` — nums[0]'s running sum is just itself, start at index 1.",
      "`nums[i] += nums[i-1];` — add the already-accumulated sum before it, turning each slot into a running total.",
      "`return nums;` — the array now holds the running sum, computed in place.",
    ],
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification.",
    edgeCases: ["Single element — already the running sum.", "All zeros — all running sums are zero."],
    memoryTrick: "\"prefix[i] = prefix[i-1] + nums[i]. Each position stores the SUM UP TO HERE. Difference of two prefix sums = range sum. This single idea powers dozens of LC problems.\"",
  },

  "find-pivot-index": {
    statement: "Given an array of integers, find the leftmost index such that the sum of all elements strictly to its left equals the sum of all elements strictly to its right (both sums are 0 if there are no elements on that side). Return that index, or -1 if no such index exists.",
    examples: [{"input":"nums = [1,7,3,6,5,6]","output":"3","explanation":"Left sum at index 3 is 1+7+3=11 and right sum is 5+6=11."},{"input":"nums = [1,2,3]","output":"-1"},{"input":"nums = [2,1,-1]","output":"0","explanation":"Left sum is 0 (empty) and right sum is 1+(-1)=0."}],
    constraints: ["1 <= nums.length <= 10^4","-1000 <= nums[i] <= 1000"],
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
    lineByLine: [
      "`int total = accumulate(nums.begin(), nums.end(), 0);` — precompute the whole sum once, so rightSum can be derived without a suffix array.",
      "`int leftSum = 0;` — running sum of everything strictly left of the current index.",
      "`for (int i = 0; i < nums.size(); i++) { if (leftSum == total - leftSum - nums[i]) return i;` — rightSum = total - leftSum - nums[i], compare it to leftSum directly.",
      "`leftSum += nums[i];` — update leftSum only after checking i, since it must exclude the current element.",
      "`return -1;` — no index satisfied the pivot condition.",
    ],
    timeComplexity: "O(n)",
    timeExplanation: "Two passes: one for total, one for scan.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only leftSum and total variables.",
    edgeCases: ["Pivot at index 0 — leftSum is 0, rightSum must equal 0.", "Pivot at last index — rightSum is 0.", "Multiple pivots — return leftmost (first found)."],
    memoryTrick: "\"rightSum = total - leftSum - nums[i]. No need to store a rightSum array. Check equality, then add to leftSum. Prefix sum from left, suffix from the right — both computed on-the-fly.\"",
  },

  "range-sum-query": {
    statement: "Design a data structure that is initialized with an integer array and can efficiently answer many queries asking for the sum of the elements between two given indices, inclusive. The array itself does not change between queries.",
    examples: [{"input":"nums = [-2,0,3,-5,2,-1]; sumRange(0,2)","output":"1","explanation":"-2+0+3 = 1."},{"input":"nums = [-2,0,3,-5,2,-1]; sumRange(2,5)","output":"-1","explanation":"3+(-5)+2+(-1) = -1."},{"input":"nums = [-2,0,3,-5,2,-1]; sumRange(0,5)","output":"-3"}],
    constraints: ["1 <= nums.length <= 10^4","-10^5 <= nums[i] <= 10^5","0 <= i <= j < nums.length","up to 10^4 calls to sumRange"],
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
    lineByLine: [
      "`prefix.resize(nums.size() + 1, 0);` — size n+1 with prefix[0]=0 means prefix[i] is 'sum of the first i elements', no off-by-one cases.",
      "`for (int i = 0; i < nums.size(); i++) prefix[i+1] = prefix[i] + nums[i];` — build the running total once so every query is just a subtraction.",
      "`return prefix[right+1] - prefix[left];` — sum through right minus sum before left gives the range sum.",
    ],
    timeComplexity: "O(n) build, O(1) query",
    timeExplanation: "Precompute once, queries are subtraction.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Prefix array of size n+1.",
    edgeCases: ["left == right — single element sum = prefix[l+1] - prefix[l] = nums[l].", "left == 0 — prefix[0] = 0, so result = prefix[right+1]."],
    memoryTrick: "\"Always use 1-indexed prefix with prefix[0]=0. Then sum(l,r) = prefix[r+1] - prefix[l] with NO special cases. 1-indexing kills all boundary bugs.\"",
  },

  "subarray-sum-equals-k": {
    statement: "Given an array of integers and a target integer k, count how many contiguous subarrays have a sum exactly equal to k.",
    examples: [{"input":"nums = [1,1,1], k = 2","output":"2","explanation":"The subarrays [1,1] (indices 0-1) and [1,1] (indices 1-2) both sum to 2."},{"input":"nums = [1,2,3], k = 3","output":"2","explanation":"[1,2] and [3] both sum to 3."},{"input":"nums = [1,-1,0], k = 0","output":"3"}],
    constraints: ["1 <= nums.length <= 2 * 10^4","-1000 <= nums[i] <= 1000","-10^7 <= k <= 10^7"],
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
    lineByLine: [
      "`unordered_map<int,int> seen{{0,1}};` — seeds the empty prefix, so a subarray starting at index 0 can still match.",
      "`int running = 0, count = 0;` — running is the prefix sum so far, count tallies subarrays found.",
      "`for (int num : nums) { running += num;` — extend the prefix sum with the current element.",
      "`count += seen.count(running - k) ? seen[running - k] : 0;` — an earlier prefix of running-k means the subarray between sums to k.",
      "`seen[running]++;` — record this prefix after counting, so a subarray never matches itself.",
      "`return count;` — total subarrays summing to exactly k.",
    ],
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
    statement: "Given an array of integers and a positive integer k, count how many contiguous, non-empty subarrays have a sum that is divisible by k.",
    examples: [{"input":"nums = [4,5,0,-2,-3,1], k = 5","output":"7","explanation":"The subarrays with sums divisible by 5 are [4,5,0,-2,-3], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], and [-2,-3]."},{"input":"nums = [5], k = 9","output":"0"},{"input":"nums = [5,10], k = 5","output":"3"}],
    constraints: ["1 <= nums.length <= 3 * 10^4","-10^4 <= nums[i] <= 10^4","2 <= k <= 10^4"],
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
    lineByLine: [
      "`unordered_map<int,int> rem{{0,1}};` — seed the empty prefix's remainder so subarrays from index 0 can match.",
      "`int running = 0, count = 0;` — running tracks the prefix sum's remainder mod k, count tallies matches.",
      "`running = ((running + num) % k + k) % k;` — same remainder means a divisible gap; the double-mod keeps it non-negative.",
      "`count += rem[running];` — every earlier prefix sharing this remainder marks a valid start point.",
      "`rem[running]++;` — record this remainder after counting, preserving i < j ordering.",
      "`return count;` — total divisible subarrays across all ending positions.",
    ],
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
    statement: "Given an array of non-negative integers and an integer k, determine whether the array has a contiguous subarray of length at least 2 whose sum is a multiple of k. A sum of 0 counts as a multiple of every k, including when k is 0 and both elements involved are 0.",
    examples: [{"input":"nums = [23,2,4,6,7], k = 6","output":"true","explanation":"The subarray [2,4] sums to 6, which is a multiple of 6."},{"input":"nums = [23,2,6,4,7], k = 6","output":"true","explanation":"The subarray [23,2,6,4,7] sums to 42, a multiple of 6."},{"input":"nums = [23,2,6,4,7], k = 13","output":"false"}],
    constraints: ["1 <= nums.length <= 10^5","0 <= nums[i] <= 10^9","0 <= sum(nums[i]) <= 2^31 - 1","0 <= k <= 2^31 - 1"],
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
    lineByLine: [
      "`unordered_map<int,int> seen{{0,-1}};` — seed remainder 0 at index -1 (the empty prefix) so the gap check works from index 0.",
      "`int running = 0; for (int i = 0; i < nums.size(); i++) { running = (running + nums[i]) % k;` — track the prefix sum's remainder mod k; inputs are non-negative here.",
      "`if (seen.count(running)) { if (i - seen[running] >= 2) return true; }` — the same remainder recurring means the subarray between sums to a multiple of k, gap of 2 satisfies the length requirement.",
      "`} else { seen[running] = i; }` — store only the first occurrence, maximizing the possible gap.",
      "`return false;` — no repeated remainder with a large enough gap was found.",
    ],
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
    statement: "You start with an integer array of a given length, all initialized to 0. You are given a list of update operations, each specifying a start index, an end index, and a value to add to every element in that inclusive range. Apply all updates and return the resulting array.",
    examples: [{"input":"length = 5, updates = [[1,3,2],[2,4,3],[0,2,-2]]","output":"[-2,0,3,5,3]"},{"input":"length = 3, updates = [[0,2,1]]","output":"[1,1,1]"},{"input":"length = 4, updates = []","output":"[0,0,0,0]"}],
    constraints: ["1 <= length <= 2 * 10^4","0 <= updates.length <= 500","updates[i].length == 3","0 <= startIdx <= endIdx < length","-1000 <= inc <= 1000"],
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
    lineByLine: [
      "`vector<int> diff(length + 1, 0);` — the extra slot lets a range ending at the last index write its cancel marker safely.",
      "`for (auto& u : updates) { diff[u[0]] += u[2]; diff[u[1] + 1] -= u[2]; }` — mark where the effect starts and where it stops, making each update O(1).",
      "`vector<int> result(length); result[0] = diff[0];` — index 0's value is just whatever deltas start there.",
      "`for (int i = 1; i < length; i++) result[i] = result[i-1] + diff[i];` — prefix-summing the diff array reconstructs real values, carrying additions forward and canceling at end+1.",
      "`return result;` — the fully reconstructed array after applying every update.",
    ],
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
    statement: "A car travels along a straight route and can carry at most a given capacity of passengers at any point in time. You are given a list of planned trips, each specifying the number of passengers to pick up, the pickup location, and the drop-off location along the route. Determine whether it is possible to complete all the trips without ever exceeding the car's capacity.",
    examples: [{"input":"trips = [[2,1,5],[3,3,7]], capacity = 4","output":"false","explanation":"Between positions 3 and 5 both trips overlap, requiring 2+3=5 seats, which exceeds capacity 4."},{"input":"trips = [[2,1,5],[3,3,7]], capacity = 5","output":"true"},{"input":"trips = [[2,1,5],[3,5,7]], capacity = 3","output":"true","explanation":"The trips do not overlap (the first ends where the second begins), so at most 3 passengers are ever on board."}],
    constraints: ["1 <= trips.length <= 1000","trips[i].length == 3","1 <= numPassengers <= 100","0 <= fromLoc < toLoc <= 1000","1 <= capacity <= 10^5"],
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
    lineByLine: [
      "`int diff[1001] = {};` — a difference array indexed by location, fixed-size since locations are bounded by 1000.",
      "`diff[t[1]] += t[0]; diff[t[2]] -= t[0];` — passengers board at `from`, and exit at `to` so they're not counted at the drop-off point.",
      "`int passengers = 0; for (int loc = 0; loc <= 1000; loc++) { passengers += diff[loc];` — sweep locations, accumulating the diff array reconstructs occupancy at each point.",
      "`if (passengers > capacity) return false;` — occupancy exceeds capacity at this location, the plan is infeasible.",
      "`return true;` — occupancy never exceeded capacity anywhere along the route.",
    ],
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
    statement: "You are given two arrays, nums1 and nums2, of distinct integers, where nums1 is a subset of nums2. For each element of nums1, find the first element to its right in nums2 that is strictly greater; if none exists, use -1. Return the results as an array in the order of nums1.",
    examples: [{"input":"nums1 = [4,1,2], nums2 = [1,3,4,2]","output":"[-1,3,-1]","explanation":"For 4, there is no greater element to its right in nums2. For 1, the next greater element is 3. For 2, there is no element to its right."},{"input":"nums1 = [2,4], nums2 = [1,2,3,4]","output":"[3,-1]"}],
    constraints: ["1 <= nums1.length <= nums2.length <= 1000","0 <= nums1[i], nums2[i] <= 10^4","All integers in nums1 and nums2 are unique","All elements of nums1 also appear in nums2"],
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
    lineByLine: [
      "`unordered_map<int,int> nextGreater;` — value to its next-greater value in nums2, computed once.",
      "`stack<int> st;  // monotonic decreasing` — values still waiting for something bigger to their right.",
      "`while (!st.empty() && st.top() < num) { nextGreater[st.top()] = num; st.pop(); }` — num resolves every smaller waiter below it.",
      "`st.push(num);` — num waits on the stack for its own future bigger element.",
      "`while (!st.empty()) { nextGreater[st.top()] = -1; st.pop(); }` — leftover elements never found one, so answer is -1.",
      "`for (int num : nums1) result.push_back(nextGreater[num]);` — nums1 is a subset of nums2, so every lookup is O(1).",
      "`return result;` — answers in nums1's original order.",
    ],
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
    statement: "Given a circular integer array nums (where the element after the last one wraps around to the first), find the next greater element for every element, searching forward and wrapping around the array once if needed. Return -1 for positions where no greater element exists even after wrapping.",
    examples: [{"input":"nums = [1,2,1]","output":"[2,-1,2]","explanation":"For the first 1, the next greater is 2. For 2, no greater element exists anywhere. For the last 1, wrapping around finds 2 at the start."},{"input":"nums = [1,2,3,4,3]","output":"[2,3,4,-1,4]"}],
    constraints: ["1 <= nums.length <= 10^4","-10^9 <= nums[i] <= 10^9"],
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
    lineByLine: [
      "`vector<int> result(n, -1);` — defaults to -1, correct if no greater element ever turns up.",
      "`stack<int> st;  // stores indices` — indices, so answers write back to the right original position.",
      "`for (int i = 0; i < 2 * n; i++)` — go around the array twice to simulate wrapping, without duplicating it.",
      "`while (!st.empty() && nums[st.top()] < nums[i % n])` — this wrapped element resolves whatever's waiting on the stack.",
      "`result[st.top()] = nums[i % n]; st.pop();` — record the answer, remove it from the stack.",
      "`if (i < n) st.push(i);` — only push new indices in the first pass; the second pass only resolves leftovers.",
      "`return result;` — anything never popped has no greater element anywhere in the array.",
    ],
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
    statement: "You and a friend take turns removing stones from a pile that starts with n stones, and you always go first. On each turn a player must remove 1, 2, or 3 stones, and whoever removes the last stone wins the game. Assuming both players play optimally, return true if you can guarantee a win, or false otherwise.",
    examples: [{"input":"n = 4","output":"false","explanation":"Whatever you take (1, 2, or 3), your friend can take the remaining stones and win."},{"input":"n = 1","output":"true","explanation":"You take the single stone and win immediately."},{"input":"n = 8","output":"true"}],
    constraints: ["1 <= n <= 2^31 - 1"],
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
    lineByLine: [
      "`return n % 4 != 0;` — a multiple of 4 is a loss: any of 1-3 taken leaves the opponent a clean sweep.",
      "`// dp[i] = any move leading to dp[i-move]==false` — general game-theory template; n%4 is its closed form for moves {1,2,3}.",
    ],
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
    statement: "Alice and Bob play a game with an even number of piles of stones arranged in a row, given as an array piles. Players alternate turns, Alice moving first, and on each turn a player removes the entire pile from either the beginning or the end of the remaining row, adding its stones to their own score. Assuming both players play to maximize their own total and all pile sizes are distinct, return true if Alice can win the game.",
    examples: [{"input":"piles = [5,3,4,5]","output":"true","explanation":"Alice can pick piles to guarantee a total of at least 13 stones out of 17."},{"input":"piles = [3,7,2,3]","output":"true"}],
    constraints: ["2 <= piles.length <= 500","piles.length is even","1 <= piles[i] <= 500"],
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
    lineByLine: [
      "`return true; // n is always even per problem constraints` — first player can always take all odd- or all even-indexed piles, whichever sums larger.",
      "`for (int i = 0; i < n; i++) dp[i][i] = piles[i];` — dp[i][j] is the best score advantage over piles[i..j]; a single pile means take it outright.",
      "`for (int len = 2; len <= n; len++) for (int i = 0; i <= n - len; i++)` — build up from smaller sub-rows to larger ones.",
      "`dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]);` — take the left or right pile, subtracting the opponent's best advantage on what's left.",
      "`return dp[0][n-1] > 0;` — a positive advantage over the whole row means the first player wins.",
    ],
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
    statement: "Given a sorted integer array nums in non-decreasing order, remove the duplicate elements in-place so that each unique value appears only once, keeping their relative order. Return the number k of unique elements, with the first k slots of nums holding those unique values (the content beyond index k does not matter).",
    examples: [{"input":"nums = [1,1,2]","output":"2, nums = [1,2,_]","explanation":"The function returns k = 2, with the first two elements of nums being 1 and 2."},{"input":"nums = [0,0,1,1,1,2,2,3,3,4]","output":"5, nums = [0,1,2,3,4,_,_,_,_,_]"}],
    constraints: ["1 <= nums.length <= 3 * 10^4","-100 <= nums[i] <= 100","nums is sorted in non-decreasing order"],
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
    lineByLine: [
      "`if (nums.empty()) return 0;` — nothing to remove in an empty array.",
      "`int write = 1;` — nums[0] is always kept; write marks where the next unique value lands.",
      "`for (int read = 1; read < nums.size(); read++)` — read scans every element once.",
      "`if (nums[read] != nums[read - 1])` — sorted array, so duplicates of a value sit consecutively.",
      "`nums[write++] = nums[read];` — copy the new unique value in, advance write.",
      "`return write;` — final write position is the count of unique values.",
      "`if (write < k || nums[write - k] != x) nums[write++] = x;` — keep x unless it'd be the (k+1)-th copy in a row.",
    ],
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
    statement: "Given an array nums containing n integers where each value is 0, 1, or 2, representing the colors red, white, and blue respectively, sort the array in-place so that elements of the same color are grouped together in the order red, white, then blue, without using a library sort function.",
    examples: [{"input":"nums = [2,0,2,1,1,0]","output":"[0,0,1,1,2,2]"},{"input":"nums = [2,0,1]","output":"[0,1,2]"}],
    constraints: ["1 <= nums.length <= 300","nums[i] is 0, 1, or 2","Follow up: can you solve it in one pass using only constant extra space?"],
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
    lineByLine: [
      "`int low = 0, mid = 0, high = nums.size() - 1;` — [0,low) holds 0s, [low,mid) holds 1s, (high,n-1] holds 2s.",
      "`while (mid <= high)` — keep classifying until the unexamined middle region is empty.",
      "`if (nums[mid] == 0) { swap(nums[low++], nums[mid++]); }` — swap into the 0-region; the swapped-back value is always a 1, safe to skip past.",
      "`else if (nums[mid] == 1) { mid++; }` — a 1 is already in the right place, just move on.",
      "`else { swap(nums[mid], nums[high--]); }` — send this 2 to the high boundary; don't advance mid, the incoming value is still unknown.",
    ],
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
    statement: "You are given an array of integers nums sorted in non-decreasing order, along with a target value. Return the indices of the first and last occurrence of target in the array as a two-element array. If target does not appear in nums, return [-1, -1]. Your solution should run in O(log n) time.",
    examples: [{"input":"nums = [5,7,7,8,8,10], target = 8","output":"[3,4]","explanation":"8 first appears at index 3 and last appears at index 4."},{"input":"nums = [5,7,7,8,8,10], target = 6","output":"[-1,-1]","explanation":"6 is not present in nums."},{"input":"nums = [], target = 0","output":"[-1,-1]"}],
    constraints: ["0 <= nums.length <= 10^5","-10^9 <= nums[i] <= 10^9","nums is sorted in non-decreasing order","-10^9 <= target <= 10^9"],
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
    lineByLine: [
      "`return {findBound(nums, target, true), findBound(nums, target, false)};` — leftmost and rightmost are each their own binary search.",
      "`int lo = 0, hi = nums.size() - 1, bound = -1;` — bound records the best match found so far.",
      "`if (nums[mid] == target) { bound = mid; ... }` — record the match, but keep searching for a further one.",
      "`if (isLeft) hi = mid - 1;` — for leftmost, keep narrowing left after a match.",
      "`else lo = mid + 1;` — for rightmost, keep narrowing right after a match.",
      "`} else if (nums[mid] < target) { lo = mid + 1; } else { hi = mid - 1; }` — no match yet, narrow toward where target could be.",
      "`return bound;` — -1 if never matched, else the most extreme matching index.",
    ],
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
    statement: "You are given an undirected graph on n nodes described by an adjacency list graph, where graph[u] lists the neighbors of node u. Determine whether the graph's nodes can be split into two groups such that every edge connects a node from one group to a node in the other group, and return true or false accordingly.",
    examples: [{"input":"graph = [[1,3],[0,2],[1,3],[0,2]]","output":"true","explanation":"Nodes {0,2} and {1,3} form two groups with every edge going between them."},{"input":"graph = [[1,2],[0,2],[0,1]]","output":"false","explanation":"Nodes 0, 1, 2 form an odd cycle (triangle), which cannot be 2-colored."},{"input":"graph = [[1],[0]]","output":"true"}],
    constraints: ["graph.length == n","1 <= n <= 100","0 <= graph[u].length < n","graph[u] does not contain u itself and has no duplicate entries","the graph is undirected: if v is in graph[u], then u is in graph[v]"],
    intuition: "A graph is bipartite if it can be 2-colored: every edge connects vertices of different colors. Equivalent to: graph has no odd-length cycles. Use BFS/DFS: try to color each vertex, if a neighbor has the same color as current — not bipartite. Handle disconnected graphs by checking each unvisited vertex.",
    recognize: [
      "\"Split into two groups so every edge crosses between them\" is exactly the definition of 2-coloring a graph — every edge must connect two different colors.",
      "The failing example is a triangle (odd cycle) — odd-length cycles are the concrete obstruction to 2-coloring, since you can't alternate colors around an odd loop without a clash.",
      "The graph may be disconnected (isolated components), so a single BFS/DFS from one start node isn't enough — every unvisited vertex needs its own check.",
      "→ These clues say: BFS/DFS coloring each vertex the opposite color of its parent, failing as soon as two adjacent vertices share a color, restarting from any unvisited vertex to cover all components.",
    ],
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
    lineByLine: [
      "`vector<int> color(n, -1);` — -1 means uncolored; 0 or 1 marks which group a node is in.",
      "`for (int start = 0; start < n; start++) { if (color[start] != -1) continue; ... }` — try every node as a start, since the graph may be disconnected.",
      "`q.push(start); color[start] = 0;` — arbitrarily assign this component's first node to group 0.",
      "`if (color[neighbor] == -1) { color[neighbor] = 1 - color[node]; q.push(neighbor); }` — an uncolored neighbor must go in the opposite group.",
      "`else if (color[neighbor] == color[node]) { return false; }` — two adjacent same-colored nodes means an odd cycle, no valid bipartition.",
      "`return true;` — every component colored without conflict.",
    ],
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
    statement: "Given an integer array sorted in non-decreasing order, remove elements in place so that each unique value appears at most twice, preserving the relative order of the remaining elements. Return the new length of the array; the first that many positions of the array must hold the resulting elements (the values beyond that length are irrelevant).",
    examples: [{"input":"nums = [1,1,1,2,2,3]","output":"5, nums = [1,1,2,2,3,_]","explanation":"Each value appears at most twice in the first 5 positions."},{"input":"nums = [0,0,1,1,1,1,2,3,3]","output":"7, nums = [0,0,1,1,2,3,3,_,_]"},{"input":"nums = [1,1,1,1]","output":"2, nums = [1,1,_,_]"}],
    constraints: ["1 <= nums.length <= 3 * 10^4","-10^4 <= nums[i] <= 10^4","nums is sorted in non-decreasing order"],
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
    lineByLine: [
      "`if ((int)nums.size() <= 2) return nums.size();` — 2 or fewer elements can never break the 'at most 2' rule.",
      "`int write = 2;` — the first two elements are always kept.",
      "`for (int read = 2; read < (int)nums.size(); read++)` — start scanning from the third element.",
      "`if (nums[read] != nums[write - 2])` — compare against two slots back in the written prefix, keep unless it'd be a third copy.",
      "`nums[write] = nums[read]; write++;` — keep this element, copy it in and advance write.",
      "`return write;` — the new length, with every value appearing at most twice.",
    ],
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
    statement: "You are given two sorted integer arrays nums1 and nums2, along with integers m and n indicating the number of valid elements in each. nums1 has a total length of m + n, where the first m elements hold its actual values and the last n elements are placeholders set to 0; merge nums2 into nums1 in-place so that nums1 becomes a single sorted array.",
    examples: [{"input":"nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3","output":"[1,2,2,3,5,6]"},{"input":"nums1 = [1], m = 1, nums2 = [], n = 0","output":"[1]","explanation":"Nothing needs to be merged since nums2 is empty."},{"input":"nums1 = [0], m = 0, nums2 = [1], n = 1","output":"[1]","explanation":"nums1 has no valid elements, so the result is just nums2."}],
    constraints: ["nums1.length == m + n","nums2.length == n","0 <= m, n <= 200","1 <= m + n <= 200","-10^9 <= nums1[i], nums2[j] <= 10^9"],
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
    lineByLine: [
      "`int i = m - 1, j = n - 1, k = m + n - 1;` — i, j track the largest unplaced candidate; k is the next back slot to fill.",
      "`while (j >= 0)` — only nums2 needs placing; leftover nums1 elements are already in position.",
      "`if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];` — the larger candidate belongs in this back slot.",
      "`else nums1[k--] = nums2[j--];` — filling from the back means nothing gets overwritten before it's read.",
    ],
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
    statement: "Given an array of integers representing a permutation, rearrange it in place into the lexicographically next greater permutation of its elements. If no such permutation exists (the array is the highest possible permutation), rearrange it into the lowest possible order (sorted ascending). The rearrangement must be done in place using only constant extra memory.",
    examples: [{"input":"nums = [1,2,3]","output":"[1,3,2]"},{"input":"nums = [3,2,1]","output":"[1,2,3]","explanation":"3,2,1 is the largest permutation, so it wraps around to the smallest."},{"input":"nums = [1,1,5]","output":"[1,5,1]"}],
    constraints: ["1 <= nums.length <= 100","0 <= nums[i] <= 100"],
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
    lineByLine: [
      "`int n = nums.size(), i = n - 2;` — start one before the last index.",
      "`while (i >= 0 && nums[i] >= nums[i + 1]) i--;` — walk left to the rightmost pivot where nums[i] < nums[i+1].",
      "`if (i >= 0)` — if i hit -1, the array is fully descending, the last permutation.",
      "`int j = n - 1; while (nums[j] <= nums[i]) j--;` — find the smallest value right of i that's still bigger than it.",
      "`swap(nums[i], nums[j]);` — gives the smallest possible increase to the prefix.",
      "`reverse(nums.begin() + i + 1, nums.end());` — the descending suffix becomes ascending, the smallest arrangement.",
    ],
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
    statement: "You are given an array representing a row of fruit trees, where each value denotes the type of fruit at that position. You have exactly two baskets, and each basket can hold only a single type of fruit with no limit on quantity. Starting from any tree, collect fruit by moving strictly to the right, stopping as soon as you'd need a third fruit type. Return the maximum number of fruits you can collect this way.",
    examples: [{"input":"fruits = [1,2,1]","output":"3","explanation":"All three fruits can be collected using two baskets."},{"input":"fruits = [0,1,2,2]","output":"3","explanation":"Collecting [1,2,2] uses only two fruit types."},{"input":"fruits = [1,2,3,2,2]","output":"4","explanation":"Collecting [2,3,2,2] uses only two fruit types."}],
    constraints: ["1 <= fruits.length <= 10^5","0 <= fruits[i] <= 10^5"],
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
    lineByLine: [
      "`unordered_map<int,int> count;` — tallies each fruit type in the window; key count must stay <= 2.",
      "`for (int right = 0; right < (int)fruits.size(); right++)` — grow the window one tree at a time.",
      "`count[fruits[right]]++;` — add the new tree's fruit type to the tally.",
      "`while (count.size() > 2) { ...; left++; }` — a third type snuck in, shrink from the left until only 2 remain.",
      "`best = max(best, right - left + 1);` — window is valid now, so its length is a candidate.",
      "`return best;` — the most fruit collectible with two baskets.",
    ],
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
    statement: "Given a binary array and an integer k, you may flip at most k of the 0s in the array to 1s. Return the length of the longest contiguous run of 1s achievable after performing at most k such flips.",
    examples: [{"input":"nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2","output":"6","explanation":"Flip the two 0s at indices 5 and 10 (or similar) to get a run of six consecutive 1s starting at index 5."},{"input":"nums = [0,0,1,1,1,0,0], k = 0","output":"3"},{"input":"nums = [1,1,1,0,0,0,1,1,1,1,0], k = 0","output":"4"}],
    constraints: ["1 <= nums.length <= 10^5","nums[i] is either 0 or 1","0 <= k <= nums.length"],
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
    lineByLine: [
      "`int left = 0, zeros = 0, best = 0;` — zeros counts 0s in the window; window is flippable when zeros <= k.",
      "`for (int right = 0; right < (int)nums.size(); right++)` — grow the window one element at a time.",
      "`if (nums[right] == 0) zeros++;` — a new zero would need one of our k flips.",
      "`while (zeros > k) { if (nums[left] == 0) zeros--; left++; }` — too many flips needed, shrink from the left.",
      "`best = max(best, right - left + 1);` — window has at most k zeros now, so it's a valid candidate.",
      "`return best;` — the longest run of 1s achievable after k flips.",
    ],
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
    statement: "Given an array of positive integers nums and an integer k, count the number of contiguous subarrays whose product of all elements is strictly less than k. Return that count.",
    examples: [{"input":"nums = [10,5,2,6], k = 100","output":"8","explanation":"The 8 subarrays with product < 100 are [10], [5], [2], [6], [10,5], [5,2], [2,6], and [5,2,6]."},{"input":"nums = [1,2,3], k = 0","output":"0","explanation":"No product can be less than 0 since all elements are positive."},{"input":"nums = [1,1,1], k = 2","output":"6","explanation":"Every possible subarray has a product of 1, which is less than 2."}],
    constraints: ["1 <= nums.length <= 3 * 10^4","1 <= nums[i] <= 1000","0 <= k <= 10^6"],
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
    lineByLine: [
      "`if (k <= 1) return 0;` — every nums[i] >= 1, so no product can be strictly less than 1.",
      "`long long product = 1;` — running product of the window; long long avoids overflow.",
      "`for (int right = 0; right < (int)nums.size(); right++)` — grow the window one element at a time.",
      "`product *= nums[right];` — fold the new element into the running product.",
      "`while (product >= k) { product /= nums[left]; left++; }` — shrink from the left until product is under k.",
      "`count += right - left + 1;` — every subarray ending at right and starting from left..right is also valid, add them all.",
      "`return count;` — total count of subarrays with product strictly less than k.",
    ],
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
    statement: "A peak element in an array is one that is strictly greater than both of its neighbors, where elements outside the array bounds are considered to be negative infinity. Given an array nums where no two adjacent elements are equal, return the index of any one peak element. Your algorithm should run in O(log n) time.",
    examples: [{"input":"nums = [1,2,3,1]","output":"2","explanation":"3 is a peak element and its index is 2."},{"input":"nums = [1,2,1,3,5,6,4]","output":"5","explanation":"Index 1 (value 2) or index 5 (value 6) are both valid peak indices."}],
    constraints: ["1 <= nums.length <= 1000","-2^31 <= nums[i] <= 2^31 - 1","nums[i] != nums[i + 1] for all valid i"],
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
    lineByLine: [
      "`int lo = 0, hi = nums.size() - 1;` — a peak must exist somewhere, since the edges count as -infinity.",
      "`while (lo < hi)` — narrow until one index remains, which must be a peak.",
      "`if (nums[mid] < nums[mid + 1]) lo = mid + 1;` — uphill slope, so a peak lies strictly to the right.",
      "`else hi = mid;` — flat or downhill, so mid could itself be the peak, keep it in the window.",
      "`return lo;` — collapses onto an index strictly greater than both neighbors.",
    ],
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
    statement: "A conveyor belt has packages, given as an array weights, that must be shipped from port A to port B in the given order over exactly days days. Each day the ship loads consecutive packages (without reordering) whose total weight does not exceed the ship's capacity. Return the least weight capacity of the ship that still allows all packages to be shipped within days days.",
    examples: [{"input":"weights = [1,2,3,4,5,6,7,8,9,10], days = 5","output":"15"},{"input":"weights = [3,2,2,4,1,4], days = 3","output":"6"},{"input":"weights = [1,2,3,1,1], days = 4","output":"3"}],
    constraints: ["1 <= days <= weights.length <= 5 * 10^4","1 <= weights[i] <= 500"],
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
    lineByLine: [
      "`int lo = *max_element(weights.begin(), weights.end());` — capacity can't be smaller than the heaviest package.",
      "`int hi = accumulate(weights.begin(), weights.end(), 0);` — shipping everything in one day always works at this capacity.",
      "`while (lo < hi)` — binary search over candidate capacities.",
      "`if (load + w > mid) { daysNeeded++; load = 0; } load += w;` — greedily start a new day once the current one would overflow.",
      "`if (daysNeeded <= days) hi = mid;` — feasible, try a smaller capacity.",
      "`else lo = mid + 1;` — not enough days at this capacity, need more room.",
      "`return lo;` — smallest capacity that still fits within the day limit.",
    ],
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
    statement: "Given an integer array nums and an integer k, split nums into k non-empty contiguous subarrays so as to minimize the largest sum among these k subarrays. Return that minimized largest sum.",
    examples: [{"input":"nums = [7,2,5,10,8], k = 2","output":"18","explanation":"Splitting into [7,2,5] and [10,8] gives sums 14 and 18; 18 is the smallest possible largest sum."},{"input":"nums = [1,2,3,4,5], k = 2","output":"9","explanation":"Splitting into [1,2,3] and [4,5] gives sums 6 and 9, the minimum possible largest sum."},{"input":"nums = [1,4,4], k = 3","output":"4"}],
    constraints: ["1 <= nums.length <= 1000","0 <= nums[i] <= 10^6","1 <= k <= min(50, nums.length)"],
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
    lineByLine: [
      "`int lo = *max_element(nums.begin(), nums.end());` — the max subarray sum can't be smaller than the biggest single element.",
      "`int hi = accumulate(nums.begin(), nums.end(), 0);` — one giant subarray always works at this cap.",
      "`while (lo < hi)` — binary search over candidate max-sum caps.",
      "`if (sum + x > mid) { parts++; sum = 0; } sum += x;` — greedily start a new part once the running sum would exceed the cap.",
      "`if (parts <= m) hi = mid;` — this cap fits within m parts, try a smaller cap.",
      "`else lo = mid + 1;` — too many parts needed, the cap is too restrictive.",
      "`return lo;` — smallest achievable max-subarray-sum using at most m parts.",
    ],
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
    statement: "Given the head of a singly linked list and two integers left and right marking a 1-indexed range, reverse the nodes of the list from position left to position right, then return the head of the resulting list. Do this in a single pass without detaching the list into separate pieces conceptually.",
    examples: [{"input":"head = [1,2,3,4,5], left = 2, right = 4","output":"[1,4,3,2,5]","explanation":"Nodes at positions 2 through 4 (2,3,4) are reversed in place."},{"input":"head = [5], left = 1, right = 1","output":"[5]"},{"input":"head = [3,5], left = 1, right = 2","output":"[5,3]"}],
    constraints: ["The number of nodes in the list is n","1 <= n <= 500","-500 <= Node.val <= 500","1 <= left <= right <= n"],
    intuition:
      "Reverse only the sublist between positions left and right. Walk to the node just before 'left' (call it 'prev'), then repeatedly move the node right after prev's reversed section to the front of that section — a technique called 'head insertion' — for exactly (right - left) iterations.",
    recognize: [
      "It's a partial reversal — only positions left..right flip, while the nodes before and after stay untouched and connected.",
      "\"Single pass\" and \"without detaching the list into separate pieces\" push away from splitting into three lists, reversing the middle, and reattaching.",
      "left can be 1 (reversal starts at the head), which is the classic case that needs a dummy node to avoid special-casing the head.",
      "→ These clues say: walk to just before left, then repeatedly pull the next node forward and splice it right after that fixed point (head-insertion reversal).",
    ],
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
    lineByLine: [
      "`ListNode dummy(0); dummy.next = head; ListNode* prev = &dummy;` — dummy handles left=1 with no special case.",
      "`for (int i = 1; i < left; i++) prev = prev->next;` — walk prev to just before position left.",
      "`ListNode* curr = prev->next;` — curr stays put and becomes the tail of the reversed section.",
      "`for (int i = 0; i < right - left; i++)` — one iteration per node that needs to move.",
      "`ListNode* toMove = curr->next;` — the next node to relocate to the front of the section.",
      "`curr->next = toMove->next;` — unlink toMove, closing the gap it leaves.",
      "`toMove->next = prev->next; prev->next = toMove;` — head-insertion: splice toMove in right after prev.",
      "`return dummy.next;` — real head, whether or not the reversal started at position 1.",
    ],
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
    statement: "Given the root of a binary tree, return its nodes' values grouped level by level, but alternate the direction of each level: left-to-right, then right-to-left, then left-to-right again, and so on.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"[[3],[20,9],[15,7]]","explanation":"Level 0 goes left-to-right, level 1 is reversed to right-to-left, level 2 goes left-to-right again."},{"input":"root = [1]","output":"[[1]]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 2000]","-100 <= Node.val <= 100"],
    intuition:
      "Standard BFS level-order traversal, but alternate the direction each level is read/stored: left-to-right, then right-to-left, then left-to-right again.",
    recognize: [
      "It's level-order-traversal's exact grouping, with only the READING direction of alternate levels flipped — nodes are still discovered left-to-right by the queue regardless.",
      "The alternation is by level index (even vs odd), not by node value or depth-independent logic, so you need to know which level you're on.",
      "You don't need to change how children get enqueued — only how the collected values for that level get placed or reversed before output.",
      "→ These clues say: normal BFS level-order, but reverse (or index backwards into) every other level's result before appending it.",
    ],
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
    lineByLine: [
      "`bool leftToRight = true;` — tracks this level's read direction, flips every level.",
      "`int size = q.size();` — level-snapshot trick, same as plain level-order.",
      "`vector<int> level(size);` — pre-sized since values write to computed indices, not push_back order.",
      "`int idx = leftToRight ? i : size - 1 - i;` — nodes always dequeue left to right; this line reverses the output placement without a separate reverse call.",
      "`level[idx] = node->val;` — place this node's value at its computed position.",
      "`if (node->left) q.push(node->left); if (node->right) q.push(node->right);` — children always enqueue left then right regardless of zigzag.",
      "`result.push_back(level); leftToRight = !leftToRight;` — commit this level, flip direction for the next.",
    ],
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
    statement: "Given the root of a binary tree and a target integer, find all root-to-leaf paths where the sum of the node values along the path equals the target. Return the list of such paths, each represented as a list of node values.",
    examples: [{"input":"root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22","output":"[[5,4,11,2],[5,8,4,5]]"},{"input":"root = [1,2,3], targetSum = 5","output":"[]"}],
    constraints: ["The number of nodes in the tree is in the range [0, 5000]","-1000 <= Node.val <= 1000","-1000 <= targetSum <= 1000"],
    intuition:
      "DFS from root to leaf, tracking the running path and remaining sum needed. At a leaf, if the remaining sum equals the leaf's value, the current path is a valid answer — record a COPY of it (backtracking will mutate the path afterward).",
    recognize: [
      "It's path-sum but asking for ALL qualifying paths as lists of values, not just a yes/no — that upgrades a boolean DFS into one that builds and records paths.",
      "\"Root-to-leaf\" and \"sum of the node values along the path equals the target\" is the same exact-match condition as path-sum, just with multiple valid answers possible.",
      "Because the same path vector is reused and mutated across branches, you need to undo (pop) whatever you pushed before trying the sibling branch — otherwise paths bleed into each other.",
      "→ These clues say: DFS with backtracking — push the node onto a shared path, recurse, check the leaf condition, then pop before returning.",
    ],
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
    lineByLine: [
      "`vector<int> path;` — a single shared vector reused across recursion, explicitly pushed and popped rather than passed by value.",
      "`void dfs(TreeNode* node, long remaining, vector<int>& path, vector<vector<int>>& result)` — remaining tracks target minus accumulated sum; path and result shared by reference.",
      "`if (!node) return;` — nothing past the end of a branch.",
      "`path.push_back(node->val); remaining -= node->val;` — commit this node and update the remaining target.",
      "`if (!node->left && !node->right && remaining == 0) { result.push_back(path); }` — leaf reached with sum matching target; push a copy since path keeps changing.",
      "`else { dfs(node->left, remaining, path, result); dfs(node->right, remaining, path, result); }` — not a qualifying leaf yet, keep extending both children.",
      "`path.pop_back(); // backtrack` — remove this node so the parent's next sibling branch starts clean.",
    ],
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
    statement: "Given the root of a binary tree, group its nodes by vertical column, where the root is at column 0, a left child is one column to the left of its parent, and a right child is one column to the right. Return the node values ordered from the leftmost column to the rightmost, with each column's values listed top to bottom.",
    examples: [{"input":"root = [3,9,20,null,null,15,7]","output":"[[9],[3,15],[20],[7]]","explanation":"Column -1 has 9, column 0 has 3 then 15, column 1 has 20, and column 2 has 7."},{"input":"root = [1]","output":"[[1]]"}],
    constraints: ["The number of nodes in the tree is in the range [1, 1000]","0 <= Node.val <= 1000","When two nodes share the same row and column, order them by ascending value"],
    intuition:
      "Assign each node a (column, row) coordinate: root is (0,0), left child is (col-1, row+1), right child is (col+1, row+1). Group nodes by column; within a column, order by row, and for same row+column, order by value.",
    recognize: [
      "\"Group by vertical column\" with left = one column left, right = one column right — that's a coordinate system (col, row) layered onto the tree, not a standard traversal order.",
      "The tie-break rule (\"same row and column, order by ascending value\") is an explicit sign there's a third sort key beyond just column and depth.",
      "Output order is leftmost-to-rightmost column, top-to-bottom within a column — an ordering that only makes sense once every node has been assigned coordinates first, then sorted.",
      "→ These clues say: DFS/BFS assigning (col, row) to every node, bucket by column, then sort each bucket by (row, value).",
    ],
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
    lineByLine: [
      "`map<int, vector<pair<int,int>>> cols;` — ordered map so columns come out leftmost-to-rightmost by iterating.",
      "`function<void(TreeNode*,int,int)> dfs = [&](TreeNode* node, int col, int row) {` — assigns each node its (col, row) coordinate, root at (0,0).",
      "`if (!node) return;` — nothing to record for an empty branch.",
      "`cols[col].push_back({row, node->val});` — bucket this node's (row, value) under its column.",
      "`dfs(node->left, col - 1, row + 1); dfs(node->right, col + 1, row + 1);` — left child is one column left, right child one column right, both one row deeper.",
      "`dfs(root, 0, 0);` — kick off coordinate assignment from the root.",
      "`for (auto& [col, nodes] : cols) { sort(nodes.begin(), nodes.end()); ... }` — sort each column by (row, val), matching the tie-break rule.",
      "`for (auto& [row, val] : nodes) colVals.push_back(val);` — strip out just the values in sorted order.",
      "`result.push_back(colVals);` — map iteration already visits columns left to right.",
    ],
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
    statement: "Given the root of a binary tree, return its boundary values traced in an anti-clockwise direction starting from the root: the root itself, followed by the left edge of the tree (excluding leaves), then all leaf nodes left to right, then the right edge of the tree traversed bottom-up (excluding leaves). Avoid listing any node more than once.",
    examples: [{"input":"root = [20,8,22,4,12,null,25,null,null,10,14]","output":"[20,8,4,10,14,25,22]","explanation":"Left boundary contributes 8, the leaves left-to-right are 4,10,14,25, and the right boundary (bottom-up) contributes 22."},{"input":"root = [1,null,2,3,4]","output":"[1,3,4,2]"}],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]","-1000 <= Node.val <= 1000","The root is never counted twice even if it is also a leaf"],
    intuition:
      "The boundary = left edge (top to bottom, excluding leaves) + all leaves (left to right) + right edge (bottom to top, excluding leaves). Handle each piece with a separate simple traversal, then concatenate, being careful not to double-count nodes that are both edge and leaf.",
    recognize: [
      "The output is described as three distinct pieces stitched together (root, left edge, leaves, right edge reversed) — a strong hint this isn't one traversal but several simple ones concatenated.",
      "\"Excluding leaves\" on both edges plus \"avoid listing any node more than once\" flags the overlap case: a node that's both an edge node and a leaf must only appear once, in the leaves section.",
      "The right edge is explicitly bottom-up while everything else reads top-down or left-to-right — an asymmetry that only makes sense if you build the right side separately and reverse it.",
      "→ These clues say: three separate simple walks — left spine (skip leaves), all leaves (DFS), right spine reversed (skip leaves) — concatenated with the root.",
    ],
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
    lineByLine: [
      "`bool isLeaf(TreeNode* n) { return !n->left && !n->right; }` — shared helper avoiding double-counting an edge node that's also a leaf.",
      "`TreeNode* curr = node->left ? node->left : node->right;` (in addLeftBoundary) — start below the root, falling back right if there's no left child.",
      "`while (curr) { if (!isLeaf(curr)) res.push_back(curr->val); curr = curr->left ? curr->left : curr->right; }` — trace the top-down left edge, skipping leaves (handled separately).",
      "`void addLeaves(TreeNode* node, ...)` — plain DFS recording every childless node, visiting leaves left to right.",
      "`TreeNode* curr = node->right ? node->right : node->left; vector<int> temp; ...` (in addRightBoundary) — mirror of the left walk, collected into a temp vector since this edge needs bottom-up order.",
      "`for (int i = temp.size() - 1; i >= 0; i--) res.push_back(temp[i]);` — reverse temp to get bottom-to-top order.",
      "`if (!isLeaf(root)) res.push_back(root->val);` — record the root only if it isn't itself a leaf, to avoid double-counting.",
      "`addLeftBoundary(root, res); addLeaves(root, res); addRightBoundary(root, res);` — concatenate left edge, leaves, right edge in that order.",
    ],
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
    statement: "Given an array of integers in which every element appears exactly three times except for one element that appears only once, find and return that single element. Aim for linear time and constant extra space.",
    examples: [{"input":"nums = [2,2,3,2]","output":"3"},{"input":"nums = [0,1,0,1,0,1,99]","output":"99"}],
    constraints: ["1 <= nums.length <= 3 * 10^4","-2^31 <= nums[i] <= 2^31 - 1","Each element in nums appears exactly three times except for one element which appears once"],
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
    lineByLine: [
      "`int ones = 0, twos = 0;` — per bit, (ones,twos) encodes a mod-3 counter: (0,0)=seen 0, (1,0)=seen 1, (0,1)=seen 2, cycling back on the 3rd.",
      "`ones = (ones ^ n) & ~twos;` — advance ones' bits where n has a 1, but exclude bits already in the 'seen twice' state.",
      "`twos = (twos ^ n) & ~ones;` — advance twos similarly, using the just-updated ones to keep the state machine consistent.",
      "`return ones;` — triples cycle back to (0,0) and drop out, leaving only the unique number's bits in ones.",
    ],
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
    statement: "Given an integer array in which exactly two elements appear only once and every other element appears exactly twice, find the two elements that appear once and return them in any order.",
    examples: [{"input":"nums = [1,2,1,3,4,2]","output":"[3,4]","explanation":"3 and 4 are the elements that appear only once; 4 and 3 would also be an accepted order."},{"input":"nums = [-1,0]","output":"[-1,0]"}],
    constraints: ["2 <= nums.length <= 3 * 10^4","-2^31 <= nums[i] <= 2^31 - 1","Each integer in nums will appear twice, only two integers will appear once"],
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
    lineByLine: [
      "`int xorAll = 0; for (int n : nums) xorAll ^= n;` — paired numbers cancel, leaving unique1 XOR unique2.",
      "`int diffBit = xorAll & (-xorAll);` — isolates the lowest set bit, a position where the two unique numbers must differ.",
      "`int a = 0, b = 0; for (int n : nums) { if (n & diffBit) a ^= n; else b ^= n; }` — split by that bit; each pair stays together and cancels, unique numbers land in different groups.",
      "`return {a, b};` — the two numbers that appeared only once.",
    ],
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
    statement: "Design a first-in-first-out queue using only two stacks as the underlying storage. Implement push (add to back), pop (remove from front), peek (view front), and empty (check if the queue has no elements), using only standard stack push/pop/top/isEmpty operations.",
    examples: [{"input":"[\"MyQueue\",\"push\",\"push\",\"peek\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]","output":"[null,null,null,1,1,false]","explanation":"After pushing 1 and 2, peek returns 1 (the front), pop removes and returns 1, and the queue still has 2 in it so empty returns false."}],
    constraints: ["1 <= x <= 9","At most 100 calls will be made to push, pop, peek, and empty","All calls to pop and peek are valid (the queue is non-empty)"],
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
    lineByLine: [
      "`stack<int> inStack, outStack;` — inStack takes pushes, outStack's top holds the oldest element once filled.",
      "`void transfer() { if (outStack.empty()) { ...; } }` — moving inStack into outStack reverses order, only done when outStack runs dry.",
      "`void push(int x) { inStack.push(x); }` — pushes always go to inStack, O(1).",
      "`int pop() { transfer(); ...; }` — transfer if needed, then pop the true front from outStack's top.",
      "`int peek() { transfer(); return outStack.top(); }` — same as pop but just reads the front.",
      "`bool empty() { return inStack.empty() && outStack.empty(); }` — empty only when both stacks are empty.",
    ],
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
    statement: "You are given n items, each with a weight and a value, and a knapsack with weight capacity W. Each item can either be taken once or left behind (it cannot be split or repeated). Determine the maximum total value that can be packed into the knapsack without exceeding its capacity.",
    examples: [{"input":"weights = [1,3,4,5], values = [1,4,5,7], capacity = 7","output":"9","explanation":"Taking the items with weight 3 and weight 4 gives value 4 + 5 = 9 using exactly 7 capacity."},{"input":"weights = [2,3,4,5], values = [3,4,5,6], capacity = 5","output":"7"}],
    constraints: ["1 <= n <= 1000","1 <= weights[i], values[i] <= 1000","1 <= capacity <= 1000"],
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
    lineByLine: [
      "`vector<int> dp(W + 1, 0);` — dp[w] is the best value achievable with capacity w so far, a space-optimized 2D table.",
      "`for (int i = 0; i < n; i++)` — process items one at a time.",
      "`for (int w = W; w >= weights[i]; w--)` — loop capacity backward so each item is used at most once.",
      "`dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);` — skip this item, or take it plus the best value from remaining capacity.",
      "`return dp[W];` — best value achievable using the full capacity.",
    ],
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
    statement: "You are given an array p of n+1 integers describing a chain of n matrices, where the i-th matrix has dimensions p[i-1] x p[i]. Matrix multiplication is associative, so the matrices can be grouped in different orders using parentheses; the number of scalar multiplications needed differs depending on the grouping. Return the minimum total number of scalar multiplications required to compute the full product of the chain.",
    examples: [{"input":"p = [40,20,30,10,30]","output":"26000","explanation":"The optimal parenthesization is ((A1(A2A3))A4), costing 26000 scalar multiplications."},{"input":"p = [10,20,30]","output":"6000"}],
    constraints: ["2 <= p.length <= 100","1 <= p[i] <= 500"],
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
    lineByLine: [
      "`int n = dims.size() - 1;` — n+1 dimension entries describe exactly n matrices in the chain.",
      "`vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));` — dp[i][j] is min cost to multiply matrices i..j; a single matrix costs 0.",
      "`for (int len = 2; len <= n; len++) for (int i = 1; i <= n - len + 1; i++)` — solve shorter chains before longer ones.",
      "`for (int k = i; k < j; k++)` — try every split point k dividing the chain into two multiplied groups.",
      "`int cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];` — cost of both sub-chains plus the final multiply combining them.",
      "`dp[i][j] = min(dp[i][j], cost);` — keep the cheapest split for this sub-chain.",
      "`return dp[1][n];` — minimum cost to multiply the entire chain.",
    ],
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
    statement: "Given an array prices where prices[i] is the stock price on day i, find the maximum profit achievable using at most two buy-sell transactions in total. You must sell a share before buying again, and you may hold at most one share at any time.",
    examples: [{"input":"prices = [3,3,5,0,0,3,1,4]","output":"6","explanation":"Buy on day 3 (price 0), sell on day 5 (price 3), profit 3; then buy on day 6 (price 1), sell on day 7 (price 4), profit 3; total 6."},{"input":"prices = [1,2,3,4,5]","output":"4"},{"input":"prices = [7,6,4,3,1]","output":"0"}],
    constraints: ["1 <= prices.length <= 10^5","0 <= prices[i] <= 1000"],
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
    lineByLine: [
      "`long buy1 = LONG_MIN, sell1 = 0, buy2 = LONG_MIN, sell2 = 0;` — four running best-profits, one per stage; buys start at -infinity since you can't hold before buying.",
      "`buy1 = max(buy1, -(long)price);` — best position after a first buy: skip, or buy today at -price.",
      "`sell1 = max(sell1, buy1 + price);` — best profit after a first sell: skip, or sell today's share.",
      "`buy2 = max(buy2, sell1 - price);` — same-day sell1 funds buy2, allowing sell-then-rebuy on the same day.",
      "`sell2 = max(sell2, buy2 + price);` — best total profit after both transactions.",
      "`return (int)sell2;` — fewer than 2 transactions is covered since buy2 can mirror sell1 for a net-zero change.",
    ],
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
    statement: "Given an integer k and an array prices where prices[i] is the stock price on day i, find the maximum profit achievable using at most k buy-sell transactions in total. You may hold at most one share at any time and must sell before buying again.",
    examples: [{"input":"k = 2, prices = [2,4,1]","output":"2","explanation":"Buy on day 0 (price 2), sell on day 1 (price 4), profit 2. A second transaction would not help."},{"input":"k = 2, prices = [3,2,6,5,0,3]","output":"7","explanation":"Buy at 2, sell at 6 (profit 4); buy at 0, sell at 3 (profit 3); total 7."}],
    constraints: ["1 <= k <= 100","1 <= prices.length <= 1000","0 <= prices[i] <= 1000"],
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
    lineByLine: [
      "`if (k >= n / 2) { ... }` — enough transactions to trade every profitable move, so fall back to the greedy.",
      "`vector<long> buy(k, LONG_MIN), sell(k, 0);` — generalizes Best Time III's four variables into arrays of size k for each transaction stage.",
      "`for (int j = 0; j < k; j++) { long prevSell = (j == 0) ? 0 : sell[j - 1]; ... }` — the j-th buy is funded by the (j-1)-th sell, or starts fresh at j==0.",
      "`buy[j] = max(buy[j], prevSell - price);` — keep the existing best, or buy today funded by the prior sell.",
      "`sell[j] = max(sell[j], buy[j] + price);` — keep the existing best, or sell today using what was invested in buy[j].",
      "`return (int)sell[k - 1];` — fewer than k transactions is covered since any buy[j] can mirror the prior sell for a net-zero change.",
    ],
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
