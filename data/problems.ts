export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  difficultyScore: number;
  pattern: string;
  leetcodeUrl: string;
  hasVisualization: boolean;
  tags: string[];
  companies: string[];
  frequency: "High" | "Medium" | "Low";
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  coreIntuition: string;
  recognitionSignals: string[];
  template: string;
  timeComplexity: string;
  spaceComplexity: string;
  realWorldAnalogy: string;
  icon: string;
  color: string;
  problems: Problem[];
  // Deep explanation fields
  keyInsights?: string[];
  commonMistakes?: string[];
  whenNotToUse?: string;
  thinkingProcess?: string[];
  decisionFramework?: string;
}

export const PATTERNS: Pattern[] = [
  {
    id: "arrays-hashing",
    title: "Arrays & Hashing",
    description: "Hash maps and hash sets let you trade O(n) space for O(1) lookup time, collapsing O(n²) brute-force into O(n). The pattern is universal: whenever you need to check membership, count frequencies, or group elements by some property, reach for a hash structure. Arrays provide O(1) indexed access; combining them with hashing covers the vast majority of 'find/count/group' interview problems.",
    coreIntuition: "Any time the brute force requires scanning backwards through already-seen data, you're paying O(n) per element = O(n²) total. A hash map pre-indexes that data so the backward scan collapses to O(1). The mental model: build the index first (or on the fly), then query it. Frequency maps answer 'how many times did X appear?'; hash sets answer 'have I seen X before?'; hash maps from value→index answer 'where did X appear?'.",
    recognitionSignals: [
      "Find if duplicates exist in array",
      "Two (or more) elements that sum to target",
      "Group/categorize elements by some shared property",
      "Count frequency of each element",
      "Check if two strings are anagrams or isomorphic",
      "Find elements that appear exactly once vs paired",
      "Longest sequence / streak in unsorted data",
      "Any 'have I seen X before?' question"
    ],
    template: `// Frequency map
unordered_map<int,int> freq;
for (int x : nums) freq[x]++;

// Seen set — O(1) duplicate detection
unordered_set<int> seen;
for (int x : nums) {
    if (seen.count(x)) return true;
    seen.insert(x);
}

// Value → index map (Two Sum)
unordered_map<int,int> idx;
for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (idx.count(complement)) return {idx[complement], i};
    idx[nums[i]] = i;
}`,
    timeComplexity: "O(n) — single pass with O(1) hash operations",
    spaceComplexity: "O(n) — hash structure stores up to n elements",
    realWorldAnalogy: "Index at back of a book. Instead of reading every page to find 'binary search', you look up the page number instantly. The hash map IS the index — built once, queried in O(1).",
    icon: "Hash",
    color: "blue",
    keyInsights: [
      "Hash maps convert O(n) search into O(1) lookup — this is the fundamental speed-up",
      "Build the map WHILE iterating, not before — this handles 'complement already seen' correctly",
      "For grouping problems, the KEY is the canonical form (sorted string for anagrams, frequency tuple for groups)",
      "Two-pass (build map, then query) vs one-pass (check then insert) — one-pass works when you check before inserting",
      "unordered_map average O(1), worst case O(n) due to hash collisions — in interviews, assume O(1)",
    ],
    commonMistakes: [
      "Using index as map value when you only need existence — use set instead of map",
      "Checking map AFTER inserting — this allows using same element twice (Two Sum bug)",
      "Off-by-one: `seen[nums[i]] = i` then `return {seen[complement], i}` returns correct indices only if you check before storing",
      "Forgetting that the same value at different indices is OK — store latest index, not just bool",
      "Using sorted array (O(n log n)) when hash set (O(n)) is sufficient",
    ],
    whenNotToUse: "When you need ORDER of elements (use sorted array + binary search), when memory is severely constrained (O(1) space required), or when problem guarantees sorted input (two pointers is better).",
    thinkingProcess: [
      "1. Can I precompute something about each element that lets me answer future queries in O(1)?",
      "2. What is the KEY I should store? (value, index, frequency, sorted form?)",
      "3. What is the VALUE I'm looking up? (complement, position, group?)",
      "4. Do I need to insert before or after checking? (before = allow same element, after = prevent self-reference)",
      "5. Is the result a single pair, a count, or all groups?",
    ],
    decisionFramework: "See 'find if X exists' or 'find two elements with property Y' → Hash Map/Set. See 'group by property' → map[canonical_form].push_back(element). See 'count frequency' → frequency map. See 'find missing/single' → XOR or sum formula (O(1) space) or hash set.",
    problems: [
      { id: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", difficultyScore: 3, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", hasVisualization: true, tags: ["Array", "Hash Set"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", difficultyScore: 3, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", hasVisualization: true, tags: ["String", "Hash Map"], companies: ["Amazon"], frequency: "High" },
      { id: "two-sum", title: "Two Sum", difficulty: "Easy", difficultyScore: 4, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/two-sum/", hasVisualization: true, tags: ["Array", "Hash Map"], companies: ["Amazon", "Google", "Apple", "Meta"], frequency: "High" },
      { id: "ransom-note", title: "Ransom Note", difficulty: "Easy", difficultyScore: 3, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/ransom-note/", hasVisualization: false, tags: ["String", "Hash Map", "Counting"], companies: ["Amazon"], frequency: "Medium" },
      { id: "isomorphic-strings", title: "Isomorphic Strings", difficulty: "Easy", difficultyScore: 4, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/isomorphic-strings/", hasVisualization: false, tags: ["String", "Hash Map"], companies: ["LinkedIn"], frequency: "Medium" },
      { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", difficultyScore: 5, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", hasVisualization: true, tags: ["String", "Hash Map"], companies: ["Amazon", "Meta"], frequency: "High" },
      { id: "top-k-frequent", title: "Top K Frequent Elements", difficulty: "Medium", difficultyScore: 5, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", hasVisualization: true, tags: ["Array", "Hash Map", "Bucket Sort"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "encode-decode-strings", title: "Encode and Decode Strings", difficulty: "Medium", difficultyScore: 5, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/encode-and-decode-strings/", hasVisualization: false, tags: ["String", "Design"], companies: ["Google", "Amazon"], frequency: "Medium" },
      { id: "product-except-self", title: "Product of Array Except Self", difficulty: "Medium", difficultyScore: 7, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", hasVisualization: true, tags: ["Array", "Prefix Product"], companies: ["Amazon", "Apple", "Microsoft"], frequency: "High" },
      { id: "valid-sudoku", title: "Valid Sudoku", difficulty: "Medium", difficultyScore: 6, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/valid-sudoku/", hasVisualization: false, tags: ["Array", "Hash Set", "Matrix"], companies: ["Amazon", "Apple"], frequency: "Medium" },
      { id: "longest-consecutive", title: "Longest Consecutive Sequence", difficulty: "Medium", difficultyScore: 7, pattern: "arrays-hashing", leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/", hasVisualization: true, tags: ["Array", "Hash Set"], companies: ["Google", "Amazon"], frequency: "High" },
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    description: "Two pointers eliminate the inner loop of brute-force pair-search by exploiting sorted order or structural symmetry. One pointer at each end converges inward; or both pointers move in the same direction at different speeds (slow/fast for cycles). The key invariant: after each step you provably eliminate at least one candidate, so the search space shrinks monotonically.",
    coreIntuition: "In a sorted array, if the sum of two elements is too large, the right pointer must move left (no larger right candidate can help). If too small, left must move right. This 'binary decision at each step' is what gives O(n) vs O(n²). Same logic: palindrome check compares characters from outside in — any mismatch is conclusive. The invariant 'I can safely move one pointer' is what you must prove for each problem.",
    recognitionSignals: [
      "Sorted array — find pair satisfying some condition",
      "Palindrome check on string or linked list",
      "Remove duplicates / move elements in-place",
      "Container / water trapped between heights",
      "Three-sum / k-sum problems",
      "Subsequence check (one pointer per string)",
      "Cycle detection in linked list (slow/fast)",
      "Partitioning array around pivot"
    ],
    template: `// Converging pointers (sorted array pair sum)
int left = 0, right = n - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return {left, right};
    else if (sum < target) left++;   // need bigger
    else right--;                     // need smaller
}

// Slow/fast pointers (cycle detection)
ListNode* slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true; // cycle!
}`,
    timeComplexity: "O(n) — each pointer moves at most n steps",
    spaceComplexity: "O(1) — only pointer variables",
    realWorldAnalogy: "Two people walking toward each other from opposite ends of a street to find each other. They cover the distance in half the time vs one person searching the whole street.",
    icon: "ArrowLeftRight",
    color: "green",
    keyInsights: [
      "Two pointers only work when you can PROVE that eliminating one candidate doesn't miss the answer",
      "For sorted arrays: sum too big → right must decrease. Sum too small → left must increase. This is the invariant.",
      "Slow/fast pointer gap creates a 'ruler' of fixed length — use for kth from end, middle of list",
      "Floyd's: fast pointer laps slow pointer in cycle. Meeting point is NOT cycle start — reset one to head to find start",
      "For palindrome: compare from outside in. First mismatch is definitive — no need to check further",
    ],
    commonMistakes: [
      "Using two pointers on UNSORTED array for pair-sum — must sort first",
      "For 3Sum: forgetting to SKIP DUPLICATES after sorting — same value at left/right produces duplicate triplets",
      "Container with water: moving the taller wall — always move the SHORTER wall (taller wall can't increase water)",
      "Slow/fast for cycle: checking slow==fast BEFORE moving (they start at same node) — move first, then check",
      "Palindrome: including non-alphanumeric characters — check isalnum() first",
    ],
    whenNotToUse: "When array is unsorted and sorting would change the answer. When you need to consider all pairs regardless of order (brute force may be necessary). When elements can't be compared with < / > (no total ordering).",
    thinkingProcess: [
      "1. Is the array sorted or can I sort it without losing information?",
      "2. Does the problem have a 'symmetric' or 'converging' structure (palindrome, pair sum)?",
      "3. Can I prove: if current sum/product is too big, I can safely move right pointer left?",
      "4. Is this a cycle detection problem? → Floyd's slow/fast",
      "5. Do I need fixed gap between pointers? → maintain k-step gap from the start",
    ],
    decisionFramework: "Sorted array pair/triple with property → converging two pointers. Palindrome check → outside-in two pointers. Find middle / kth from end → slow/fast with gap. Cycle detection → Floyd's. Remove duplicates in-place → slow (write) + fast (read) pointers.",
    problems: [
      { id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", difficultyScore: 3, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", hasVisualization: true, tags: ["String", "Two Pointers"], companies: ["Facebook", "Microsoft"], frequency: "High" },
      { id: "move-zeroes", title: "Move Zeroes", difficulty: "Easy", difficultyScore: 3, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/move-zeroes/", hasVisualization: true, tags: ["Array", "Two Pointers"], companies: ["Facebook", "Bloomberg"], frequency: "High" },
      { id: "is-subsequence", title: "Is Subsequence", difficulty: "Easy", difficultyScore: 3, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/is-subsequence/", hasVisualization: true, tags: ["String", "Two Pointers", "DP"], companies: ["Google", "Amazon"], frequency: "Medium" },
      { id: "two-sum-ii", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", difficultyScore: 4, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", hasVisualization: true, tags: ["Array", "Two Pointers", "Binary Search"], companies: ["Amazon"], frequency: "High" },
      { id: "three-sum", title: "3Sum", difficulty: "Medium", difficultyScore: 6, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/3sum/", hasVisualization: true, tags: ["Array", "Sorting", "Two Pointers"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "container-water", title: "Container With Most Water", difficulty: "Medium", difficultyScore: 6, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", hasVisualization: true, tags: ["Array", "Two Pointers", "Greedy"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", difficultyScore: 9, pattern: "two-pointers", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", hasVisualization: true, tags: ["Array", "Two Pointers", "Stack", "DP"], companies: ["Amazon", "Google", "Microsoft"], frequency: "High" },
    ]
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    description: "Sliding window turns O(n²) subarray/substring problems into O(n) by reusing work from the previous window instead of recomputing from scratch. The window has a left and right boundary; right expands by one each step, left advances when the window violates the constraint. The critical insight: you never need to move left backwards — each element enters and exits the window exactly once.",
    coreIntuition: "The window maintains exactly one 'valid' or 'candidate' state at all times. When adding the right element breaks validity, shrink from the left until valid again. The trick is that the window's aggregate (sum, character count, etc.) updates in O(1) as you slide — add the incoming element, remove the outgoing element. This is why it's O(n): each element is added once and removed once.",
    recognitionSignals: [
      "Longest/shortest subarray or substring with property",
      "Contiguous elements (subarray, not subsequence)",
      "Fixed window size — compute statistic for each window",
      "Variable window — constraint on window content",
      "Character frequency matching (anagram / permutation in string)",
      "Max/min sum subarray of size k",
      "String containing all characters of another string"
    ],
    template: `// Variable window — longest substring with constraint
int left = 0, result = 0;
unordered_map<char,int> window;
for (int right = 0; right < n; right++) {
    window[s[right]]++;                    // expand window
    while (window_violated(window)) {      // shrink until valid
        window[s[left]]--;
        if (window[s[left]] == 0) window.erase(s[left]);
        left++;
    }
    result = max(result, right - left + 1);
}

// Fixed window — sliding sum of size k
int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int maxSum = sum;
for (int i = k; i < n; i++) {
    sum += nums[i] - nums[i-k]; // add new, remove old
    maxSum = max(maxSum, sum);
}`,
    timeComplexity: "O(n) — each element enters and exits window once",
    spaceComplexity: "O(k) where k = window size or character set size",
    realWorldAnalogy: "Train moving through stations. You don't re-board everyone at each stop — passengers getting off from the back, new ones boarding at the front. The 'window' slides forward, updating its count in O(1).",
    icon: "RectangleHorizontal",
    color: "purple",
    keyInsights: [
      "Window validity is maintained by the left pointer — right always moves forward, left only advances when window is invalid",
      "Each element enters the window exactly once and exits exactly once → O(n) total regardless of nested loops",
      "The key state to track in the window: frequency map (char counts), deque (max in window), or simple sum",
      "For fixed-size windows: instead of recomputing, add incoming (nums[right]) and remove outgoing (nums[right-k])",
      "Permutation in String: use fixed window of size len(s1), compare frequency arrays — difference count (not full comparison) for O(1) check",
    ],
    commonMistakes: [
      "Shrinking window past the point where it's valid — left pointer should stop AS SOON AS window is valid again",
      "Not correctly updating window state when shrinking (decrement count, erase from map if count reaches 0)",
      "Using substring creation inside the loop — O(n²) total. Store indices, not substrings.",
      "Sliding Window Max: using sorted structures (O(log n) per op) when monotonic deque gives O(1)",
      "Forgetting to update 'result' AFTER shrinking — compute result at the end of each right iteration",
    ],
    whenNotToUse: "When elements are NOT contiguous (need subsequence, not subarray). When you need all pairs/combinations (backtracking). When window can have gaps. When the constraint involves non-consecutive elements.",
    thinkingProcess: [
      "1. Does the problem ask for a subarray or substring? (contiguous elements)",
      "2. Is the window size fixed or variable?",
      "3. What makes the window 'valid' or 'invalid'? (constraint condition)",
      "4. What aggregate do I need to maintain? (sum, frequency map, deque for max)",
      "5. When do I shrink? (when window becomes invalid) When do I update result? (when window is valid)",
    ],
    decisionFramework: "Fixed window size → slide by adding right element, removing left element, compute statistic. Variable window (longest valid) → expand right, shrink left when invalid, track max size. Variable window (shortest valid) → expand right until valid, shrink left while still valid, track min size.",
    problems: [
      { id: "best-time-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", difficultyScore: 5, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", hasVisualization: true, tags: ["Array", "Sliding Window", "DP"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "longest-substring", title: "Longest Substring Without Repeating Chars", difficulty: "Medium", difficultyScore: 6, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", hasVisualization: true, tags: ["String", "Sliding Window", "Hash Set"], companies: ["Amazon", "Microsoft", "Google"], frequency: "High" },
      { id: "longest-repeating-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium", difficultyScore: 7, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/", hasVisualization: true, tags: ["String", "Sliding Window"], companies: ["Google"], frequency: "Medium" },
      { id: "permutation-in-string", title: "Permutation in String", difficulty: "Medium", difficultyScore: 6, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/", hasVisualization: true, tags: ["String", "Sliding Window", "Hash Map"], companies: ["Amazon", "Microsoft"], frequency: "Medium" },
      { id: "max-points-cards", title: "Maximum Points You Can Obtain from Cards", difficulty: "Medium", difficultyScore: 6, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", hasVisualization: true, tags: ["Array", "Sliding Window", "Prefix Sum"], companies: ["Amazon"], frequency: "Medium" },
      { id: "min-window-substring", title: "Minimum Window Substring", difficulty: "Hard", difficultyScore: 9, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", hasVisualization: true, tags: ["String", "Sliding Window", "Hash Map"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "sliding-window-max", title: "Sliding Window Maximum", difficulty: "Hard", difficultyScore: 9, pattern: "sliding-window", leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/", hasVisualization: true, tags: ["Array", "Deque", "Sliding Window", "Monotonic Queue"], companies: ["Google", "Amazon"], frequency: "High" },
    ]
  },
  {
    id: "stack",
    title: "Stack",
    description: "Stack (LIFO) solves problems where you need to match or defer processing of elements until a later 'resolving' event arrives. Classic patterns: matching brackets (open waits for close), next greater element (smaller elements wait on stack until a larger one arrives), expression evaluation (operands wait for operator). The stack holds 'unresolved' state — things you've seen but can't yet act on.",
    coreIntuition: "Push when you encounter something that needs a future match or comparison. Pop when you find the resolving event (closing bracket, larger element, operator). If nothing ever resolves an item, it stays — which itself encodes information (e.g., unclosed brackets). Monotonic stacks maintain sorted order by popping elements that violate the invariant before pushing, giving O(n) 'next greater/smaller' queries.",
    recognitionSignals: [
      "Matching brackets / nested structure validation",
      "Next greater or smaller element queries",
      "Evaluate arithmetic expressions (infix/postfix/prefix)",
      "Undo/redo or history tracking",
      "Monotonic relationships — remove dominated elements",
      "Depth-first traversal (explicit stack instead of recursion)",
      "Largest rectangle / histogram area",
      "Decode/encode nested strings"
    ],
    template: `// Valid parentheses
stack<char> st;
for (char c : s) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
        if (st.empty() || !matches(st.top(), c)) return false;
        st.pop();
    }
}
return st.empty();

// Monotonic stack — next greater element
vector<int> result(n, -1);
stack<int> st; // stores indices
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[st.top()] < nums[i]) {
        result[st.top()] = nums[i]; // resolved!
        st.pop();
    }
    st.push(i);
}`,
    timeComplexity: "O(n) — each element pushed and popped at most once",
    spaceComplexity: "O(n) — worst case all elements on stack",
    realWorldAnalogy: "Stack of plates — always add/remove from top. Browser back button: each page pushed on visit, popped on back. Nested function calls: each call pushed, popped on return.",
    icon: "Layers",
    color: "orange",
    keyInsights: [
      "Stack = history of 'unresolved' decisions. Push when you can't resolve yet. Pop when you resolve.",
      "Monotonic stack: before pushing, pop everything that violates your invariant. Each element pushed/popped once → O(n)",
      "For 'next greater element': pop all SMALLER elements when larger arrives — they now have their answer",
      "Min Stack trick: pair each pushed value with the current minimum at time of push",
      "Histogram (largest rectangle): extend each bar as far left as possible — left boundary = last bar that's shorter",
    ],
    commonMistakes: [
      "Checking stack.top() without checking if stack is empty first — always guard with !st.empty()",
      "Monotonic stack direction: for 'next greater', pop when CURRENT > TOP. For 'next smaller', pop when CURRENT < TOP",
      "Daily temperatures: storing VALUES not INDICES — you need the index to compute 'days waited'",
      "Histogram: forgetting to process remaining elements in stack after loop (they have no 'next smaller' → right boundary = n)",
      "Car Fleet: forgetting to sort by position first — order matters",
    ],
    whenNotToUse: "When order doesn't matter and you just need global min/max (use variable). When you need random access to middle elements (use deque or array). When the problem requires checking ALL pairs, not just nearest.",
    thinkingProcess: [
      "1. Does each element need to 'wait' for a future matching element? → Stack",
      "2. Is there a 'nearest greater/smaller' query? → Monotonic stack",
      "3. Can I describe the invariant? (e.g., 'stack is always sorted ascending from bottom to top')",
      "4. What triggers a push? What triggers a pop?",
      "5. After the loop, what do remaining stack elements mean?",
    ],
    decisionFramework: "Matching/nesting (brackets, tags) → push openers, pop+verify on closers. Next greater/smaller → monotonic stack, pop when new element resolves old ones. Expression evaluation → two stacks (values + operators) or postfix notation. Track running minimum → paired min stack.",
    problems: [
      { id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", difficultyScore: 3, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", hasVisualization: true, tags: ["String", "Stack"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "min-stack", title: "Min Stack", difficulty: "Medium", difficultyScore: 5, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/min-stack/", hasVisualization: true, tags: ["Stack", "Design"], companies: ["Amazon", "Bloomberg"], frequency: "High" },
      { id: "reverse-polish", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", difficultyScore: 5, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", hasVisualization: true, tags: ["Array", "Stack", "Math"], companies: ["Amazon", "LinkedIn"], frequency: "Medium" },
      { id: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium", difficultyScore: 7, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/", hasVisualization: true, tags: ["String", "Backtracking", "Stack"], companies: ["Google", "Amazon"], frequency: "High" },
      { id: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium", difficultyScore: 6, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", hasVisualization: true, tags: ["Array", "Stack", "Monotonic Stack"], companies: ["Amazon"], frequency: "High" },
      { id: "car-fleet", title: "Car Fleet", difficulty: "Medium", difficultyScore: 7, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/car-fleet/", hasVisualization: true, tags: ["Array", "Stack", "Sorting"], companies: ["Google"], frequency: "Medium" },
      { id: "decode-string", title: "Decode String", difficulty: "Medium", difficultyScore: 7, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/decode-string/", hasVisualization: true, tags: ["String", "Stack", "Recursion"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "asteroid-collision", title: "Asteroid Collision", difficulty: "Medium", difficultyScore: 6, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/asteroid-collision/", hasVisualization: true, tags: ["Array", "Stack"], companies: ["Amazon", "Salesforce"], frequency: "Medium" },
      { id: "largest-rectangle-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard", difficultyScore: 9, pattern: "stack", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/", hasVisualization: true, tags: ["Array", "Stack", "Monotonic Stack"], companies: ["Amazon", "Google"], frequency: "High" },
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Binary search is not just for sorted arrays — it applies to any problem where the search space has a monotonic property (answers become 'too small' then 'too large', or some predicate flips from false to true at exactly one boundary). The generalization: if you can write a function isValid(x) that is monotonic, binary search finds the boundary. This covers 'minimize the maximum', 'find first bad version', 'capacity to ship packages'.",
    coreIntuition: "At each step, evaluate the midpoint. Based on whether it satisfies the condition, eliminate the entire left or right half. This works only when the search space is monotonic — you can provably rule out half the space with one comparison. The hardest part is defining boundaries (lo/hi), the condition, and which pointer moves. Convergence: lo ≤ hi terminates in O(log n) steps.",
    recognitionSignals: [
      "Array is sorted (or rotated sorted)",
      "Find first/last occurrence of value",
      "Find boundary where condition flips (false→true)",
      "Minimize maximum / maximize minimum",
      "Answer is in a bounded numeric range, try guessing",
      "Rotated or partially sorted arrays",
      "2D matrix treated as flattened sorted array",
      "Time-based or parametric search"
    ],
    template: `// Classic binary search
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2; // avoid overflow
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;

// Binary search on answer space — minimize X
// such that isValid(X) is true
int lo = minPossible, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (isValid(mid)) hi = mid;   // mid works, try smaller
    else lo = mid + 1;            // mid fails, need bigger
}
return lo;`,
    timeComplexity: "O(log n) — halves search space each step",
    spaceComplexity: "O(1) iterative, O(log n) recursive",
    realWorldAnalogy: "Dictionary lookup. Open to the middle — if the word comes before, ignore the right half. Repeat. Never re-scan a discarded half. Guessing a number 1-100: 'higher/lower' feedback lets you find it in 7 guesses.",
    icon: "Search",
    color: "cyan",
    keyInsights: [
      "Binary search works on ANY monotonic property, not just sorted arrays — the key is 'can I eliminate half?'",
      "Always use mid = lo + (hi - lo) / 2 to avoid integer overflow (not (lo+hi)/2)",
      "Two templates: lo<=hi with return inside loop (exact match), OR lo<hi with lo=hi as answer (boundary finding)",
      "For 'find leftmost/rightmost': don't return on match, continue shrinking — hi=mid or lo=mid+1",
      "Binary search on ANSWER: if you can write isValid(x) that's monotonic, binary search the answer space [min, max]",
    ],
    commonMistakes: [
      "Using wrong loop condition: lo<=hi for finding element, lo<hi for finding boundary",
      "Wrong pointer movement on match for boundary: must continue, not return",
      "Rotated array: forgetting the condition order — check which half is SORTED first, then check if target is in it",
      "Koko Eating: binary searching on ANSWER space (eating speed), not the array",
      "Overflow: (left+right)/2 overflows for large integers — always use left+(right-left)/2",
    ],
    whenNotToUse: "Unsorted array (use hash set for O(1) lookup). When you need all matches (not just one). When the monotonic property doesn't hold (greedy/DP might be needed). When n is small (linear search is simpler and fast enough).",
    thinkingProcess: [
      "1. Is the search space ordered/monotonic? Can I eliminate half at each step?",
      "2. Am I searching for an exact value, or a boundary (first true/false)?",
      "3. If searching answer space: what are my lo/hi bounds? What is my isValid() predicate?",
      "4. Which pointer moves on match? (both for exact, one for boundary)",
      "5. Off-by-one: does my algorithm work for arrays of size 1 and 2?",
    ],
    decisionFramework: "Sorted array exact search → classic binary search. First/last occurrence → boundary binary search (don't return on match). 'Find minimum valid X' → binary search on answer space with isValid(). Rotated sorted → check which half sorted, then decide. 2D matrix → treat as flattened 1D array.",
    problems: [
      { id: "binary-search", title: "Binary Search", difficulty: "Easy", difficultyScore: 3, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/binary-search/", hasVisualization: true, tags: ["Array", "Binary Search"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "first-bad-version", title: "First Bad Version", difficulty: "Easy", difficultyScore: 3, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/first-bad-version/", hasVisualization: true, tags: ["Binary Search", "Interactive"], companies: ["Facebook"], frequency: "Medium" },
      { id: "search-insert-position", title: "Search Insert Position", difficulty: "Easy", difficultyScore: 3, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/search-insert-position/", hasVisualization: true, tags: ["Array", "Binary Search"], companies: ["Amazon"], frequency: "Medium" },
      { id: "search-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium", difficultyScore: 5, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/", hasVisualization: true, tags: ["Array", "Binary Search", "Matrix"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "koko-bananas", title: "Koko Eating Bananas", difficulty: "Medium", difficultyScore: 6, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/", hasVisualization: true, tags: ["Array", "Binary Search"], companies: ["Amazon"], frequency: "Medium" },
      { id: "find-min-rotated", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", difficultyScore: 6, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", hasVisualization: true, tags: ["Array", "Binary Search"], companies: ["Microsoft", "Amazon"], frequency: "High" },
      { id: "search-rotated", title: "Search in Rotated Sorted Array", difficulty: "Medium", difficultyScore: 7, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/", hasVisualization: true, tags: ["Array", "Binary Search"], companies: ["Amazon", "Microsoft", "Google"], frequency: "High" },
      { id: "time-based-key-value", title: "Time Based Key-Value Store", difficulty: "Medium", difficultyScore: 7, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/", hasVisualization: false, tags: ["Hash Map", "Binary Search", "Design"], companies: ["Google"], frequency: "Medium" },
      { id: "median-two-sorted", title: "Median of Two Sorted Arrays", difficulty: "Hard", difficultyScore: 10, pattern: "binary-search", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", hasVisualization: true, tags: ["Array", "Binary Search", "Divide & Conquer"], companies: ["Google", "Amazon", "Apple"], frequency: "High" },
    ]
  },
  {
    id: "linked-list",
    title: "Linked List",
    description: "Linked list problems require careful pointer manipulation — changing .next pointers without losing references. Key techniques: dummy head node (eliminates edge cases for head removal), slow/fast pointers (find middle, detect cycles, find cycle start), in-place reversal (track prev/curr/next), and two-pointer gap maintenance (remove nth from end). Unlike arrays, no random access — everything requires traversal.",
    coreIntuition: "Always think about what happens to the pointer you're about to overwrite. Save it before overwriting. Dummy head makes every node have a predecessor — simplifies deletion and merging. Slow/fast: after n steps, fast is 2× ahead of slow, so when fast reaches end, slow is at middle. For cycle: if fast catches slow, cycle exists; to find cycle start, reset one pointer to head — they meet at cycle start.",
    recognitionSignals: [
      "Detect or find start of cycle",
      "Find middle of list (slow/fast)",
      "Reverse entire list or sublist",
      "Merge two sorted lists",
      "Remove kth node from end",
      "Palindrome check on list",
      "Deep copy list with random pointers",
      "Reorder list (L0→Ln→L1→Ln-1)"
    ],
    template: `// Reverse linked list — classic
ListNode* prev = nullptr, *curr = head;
while (curr) {
    ListNode* nxt = curr->next;
    curr->next = prev;
    prev = curr;
    curr = nxt;
}
return prev; // new head

// Find cycle + start
ListNode* slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next; fast = fast->next->next;
    if (slow == fast) {          // cycle detected
        slow = head;             // reset to find start
        while (slow != fast) { slow = slow->next; fast = fast->next; }
        return slow;             // cycle start
    }
}
return nullptr;`,
    timeComplexity: "O(n) for most operations",
    spaceComplexity: "O(1) for iterative in-place, O(n) for recursive",
    realWorldAnalogy: "Train cars linked by couplings. To reverse the train, unhook each car and re-attach in opposite order. Slow/fast pointers: two runners on circular track — faster one laps slower one exactly when cycle exists.",
    icon: "Link",
    color: "yellow",
    keyInsights: [
      "ALWAYS save next pointer before overwriting current->next — most linked list bugs come from losing this reference",
      "Dummy head node: gives every node (including head) a predecessor, eliminating 'what if we delete the head?' edge case",
      "Floyd's cycle: after slow==fast, reset ONE pointer to head. Move both one step at a time. They meet at cycle START.",
      "For 'remove nth from end': place fast pointer n+1 steps ahead, then move both until fast hits null — slow is at the node before target",
      "Palindrome LL: find middle (slow/fast), reverse second half, compare with first half — O(1) space",
    ],
    commonMistakes: [
      "Not saving curr->next before setting curr->next = prev → lost reference to rest of list",
      "Off-by-one in 'remove nth from end': gap must be n+1 so slow stops at node BEFORE the target, not AT it",
      "Reverse K group: hardest part is bookkeeping the tail of previous group pointing to head of next",
      "Cycle start: after detection, moving BOTH pointers from meeting point is wrong — one must reset to head",
      "Merge K sorted: naive O(kN) merge — use min-heap for O(N log k)",
    ],
    whenNotToUse: "When you need random access by index (use array). When you frequently need to search (array + binary search or hash map). When cache efficiency matters (arrays have better locality than linked lists).",
    thinkingProcess: [
      "1. Do I need a dummy head? (if I might delete/replace the head node: yes)",
      "2. What are my pointer roles? (prev, curr, next for reversal; slow, fast for cycle)",
      "3. Do I need to track where I am from the END? → fast pointer n steps ahead",
      "4. Is there a cycle? → Floyd's detection then Floyd's start-finding",
      "5. Draw 3-5 nodes and trace pointer movements step by step before coding",
    ],
    decisionFramework: "Reversal → prev/curr/next, iterate. Cycle detection → slow/fast. Find middle → slow at n/2 when fast at n. Remove kth from end → two pointers k apart. Merge sorted → dummy head + comparison at each step. Deep copy → hash map old→new node.",
    problems: [
      { id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", difficultyScore: 3, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", hasVisualization: true, tags: ["Linked List", "Recursion"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "merge-two-sorted", title: "Merge Two Sorted Lists", difficulty: "Easy", difficultyScore: 4, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", hasVisualization: true, tags: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy", difficultyScore: 4, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", hasVisualization: true, tags: ["Linked List", "Two Pointers", "Floyd"], companies: ["Amazon"], frequency: "High" },
      { id: "palindrome-linked-list", title: "Palindrome Linked List", difficulty: "Easy", difficultyScore: 5, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/palindrome-linked-list/", hasVisualization: true, tags: ["Linked List", "Two Pointers", "Recursion"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "reorder-list", title: "Reorder List", difficulty: "Medium", difficultyScore: 7, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/reorder-list/", hasVisualization: true, tags: ["Linked List", "Two Pointers", "Stack"], companies: ["Amazon"], frequency: "Medium" },
      { id: "remove-nth-node", title: "Remove Nth Node From End of List", difficulty: "Medium", difficultyScore: 5, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", hasVisualization: true, tags: ["Linked List", "Two Pointers"], companies: ["Amazon"], frequency: "High" },
      { id: "copy-list-random", title: "Copy List with Random Pointer", difficulty: "Medium", difficultyScore: 7, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/", hasVisualization: true, tags: ["Linked List", "Hash Map"], companies: ["Amazon", "Microsoft"], frequency: "Medium" },
      { id: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium", difficultyScore: 6, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/", hasVisualization: true, tags: ["Linked List", "Math", "Recursion"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "find-duplicate-number", title: "Find the Duplicate Number", difficulty: "Medium", difficultyScore: 8, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/find-the-duplicate-number/", hasVisualization: true, tags: ["Array", "Two Pointers", "Floyd", "Bit Manipulation"], companies: ["Google"], frequency: "Medium" },
      { id: "lru-cache", title: "LRU Cache", difficulty: "Medium", difficultyScore: 8, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/lru-cache/", hasVisualization: true, tags: ["Hash Map", "Linked List", "Design"], companies: ["Amazon", "Google", "Microsoft"], frequency: "High" },
      { id: "swap-pairs", title: "Swap Nodes in Pairs", difficulty: "Medium", difficultyScore: 6, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs/", hasVisualization: true, tags: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft"], frequency: "Medium" },
      { id: "merge-k-sorted", title: "Merge K Sorted Lists", difficulty: "Hard", difficultyScore: 9, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", hasVisualization: true, tags: ["Linked List", "Heap", "Divide & Conquer"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "reverse-k-group", title: "Reverse Nodes in K-Group", difficulty: "Hard", difficultyScore: 10, pattern: "linked-list", leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/", hasVisualization: true, tags: ["Linked List", "Recursion"], companies: ["Microsoft", "Amazon"], frequency: "Medium" },
    ]
  },
  {
    id: "trees",
    title: "Trees",
    description: "Tree problems decompose recursively: solve for the left subtree, solve for the right subtree, combine. DFS (recursive or stack) explores full depth; BFS (queue) processes level by level. BST property (left < root < right) enables binary-search-style traversal. The hardest tree problems require passing information both down (from parent to children via parameters) and up (from children to parent via return values).",
    coreIntuition: "Trust the recursion. Your function solves the problem for any subtree — just write it for a single node assuming it already works for subtrees. Base case: null node returns identity value. Recursive case: get left answer, get right answer, combine. For BST problems, the invariant gives you direction at each node — go left if target < node, right if target > node. For path problems, pass max-so-far downward as a parameter.",
    recognitionSignals: [
      "Any tree traversal (inorder gives sorted BST output)",
      "Height, depth, diameter, balance check",
      "Path sum — root to leaf or any path",
      "LCA — lowest common ancestor",
      "Level-order — BFS with level tracking",
      "Validate BST property",
      "Mirror / symmetric / same structure check",
      "Serialize / deserialize tree",
      "Construct tree from traversal arrays"
    ],
    template: `// Universal DFS pattern — post-order (solve leaves first)
int solve(TreeNode* root) {
    if (!root) return 0;           // base case
    int L = solve(root->left);     // solve left subtree
    int R = solve(root->right);    // solve right subtree
    // update global answer using L, R, root->val if needed
    globalAns = max(globalAns, L + R + root->val);
    return max(L, R) + 1;          // return value to parent
}

// BFS level order
queue<TreeNode*> q;
q.push(root);
while (!q.empty()) {
    int sz = q.size(); // current level size
    for (int i = 0; i < sz; i++) {
        TreeNode* node = q.front(); q.pop();
        if (node->left)  q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`,
    timeComplexity: "O(n) — visit each node once",
    spaceComplexity: "O(h) DFS recursion where h = height; O(n) BFS queue worst case",
    realWorldAnalogy: "Company org chart. Any operation on the company (count employees, find salary sum) = operation on CEO's left division + right division + CEO. The recursion IS the org chart structure.",
    icon: "GitBranch",
    color: "emerald",
    keyInsights: [
      "Information flows in TWO directions: DOWN (pass constraints from parent to children as parameters) and UP (return results from children to parent)",
      "Post-order (solve left, right, then current) is most common for tree DP — you need children's answers first",
      "Pre-order is for 'prefix problems' — you know something at the current node before going deeper (path sum validation)",
      "BST property gives O(h) lookup — valid BST must check range [min, max] not just left < root < right (neighbors only fails for cousins)",
      "BFS with level tracking: push level size BEFORE processing, loop exactly level_size times — this separates levels perfectly",
    ],
    commonMistakes: [
      "BST validation: comparing only with immediate children (fails for cases like [5,4,6,null,null,3,7] — 3 violates BST even though 3 < 6)",
      "Diameter: updating global answer inside recursive function but returning height — the answer and return value are DIFFERENT",
      "LCA: the case where one target is an ancestor of the other — handle by returning node as soon as it's found",
      "Serialization: forgetting null markers — deserialize won't know tree structure without them",
      "Max Path Sum: a path can't branch — you can only use ONE child's contribution upward (not both)",
    ],
    whenNotToUse: "When data is linear (use array + binary search). When you need O(1) lookup (use hash map). When the tree structure itself doesn't matter — if you'd flatten it to process, maybe you should use an array.",
    thinkingProcess: [
      "1. What do I need from each subtree? (height, max value, sum, count, etc.)",
      "2. What do I pass DOWN to children? (max value seen so far, remaining sum, allowed range)",
      "3. What do I compute at current node using left + right + current?",
      "4. What global answer gets updated during recursion (distinct from return value)?",
      "5. What's my base case? (null returns what? — 0 for height, INT_MIN for max, null for node)",
    ],
    decisionFramework: "Height/depth/balance → post-order, return height. Path sum → pre-order, pass remaining sum. BST → pass [min,max] range. Level-order → BFS with queue. Mirror/same → compare both trees recursively. Serialize → preorder with null markers. LCA → return node if found, propagate up.",
    problems: [
      { id: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy", difficultyScore: 3, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Google", "Amazon"], frequency: "High" },
      { id: "max-depth-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy", difficultyScore: 3, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon"], frequency: "High" },
      { id: "diameter-tree", title: "Diameter of Binary Tree", difficulty: "Easy", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS"], companies: ["Facebook"], frequency: "High" },
      { id: "balanced-tree", title: "Balanced Binary Tree", difficulty: "Easy", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/balanced-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "same-tree", title: "Same Tree", difficulty: "Easy", difficultyScore: 3, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/same-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "subtree-of-another", title: "Subtree of Another Tree", difficulty: "Easy", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/", hasVisualization: true, tags: ["Tree", "DFS", "Hash"], companies: ["Amazon"], frequency: "Medium" },
      { id: "symmetric-tree", title: "Symmetric Tree", difficulty: "Easy", difficultyScore: 4, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Microsoft", "Amazon"], frequency: "Medium" },
      { id: "path-sum", title: "Path Sum", difficulty: "Easy", difficultyScore: 4, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/path-sum/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "min-depth-tree", title: "Minimum Depth of Binary Tree", difficulty: "Easy", difficultyScore: 4, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/minimum-depth-of-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "lowest-common-ancestor", title: "Lowest Common Ancestor of BST", difficulty: "Medium", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BST"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", hasVisualization: true, tags: ["Tree", "BFS"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium", difficultyScore: 6, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/", hasVisualization: true, tags: ["Tree", "BFS", "DFS"], companies: ["Facebook", "Amazon"], frequency: "High" },
      { id: "count-good-nodes", title: "Count Good Nodes in Binary Tree", difficulty: "Medium", difficultyScore: 6, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS"], companies: ["Microsoft"], frequency: "Medium" },
      { id: "validate-bst", title: "Validate Binary Search Tree", difficulty: "Medium", difficultyScore: 6, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BST"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "kth-smallest-bst", title: "Kth Smallest Element in BST", difficulty: "Medium", difficultyScore: 6, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", hasVisualization: true, tags: ["Tree", "Inorder", "BST"], companies: ["Amazon"], frequency: "High" },
      { id: "construct-tree-preorder", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", difficultyScore: 8, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", hasVisualization: true, tags: ["Tree", "Divide & Conquer", "Hash Map"], companies: ["Amazon"], frequency: "Medium" },
      { id: "average-of-levels", title: "Average of Levels in Binary Tree", difficulty: "Medium", difficultyScore: 4, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/average-of-levels-in-binary-tree/", hasVisualization: true, tags: ["Tree", "BFS", "DFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "binary-tree-paths", title: "Binary Tree Paths", difficulty: "Medium", difficultyScore: 5, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-paths/", hasVisualization: false, tags: ["Tree", "DFS", "Backtracking"], companies: ["Google"], frequency: "Medium" },
      { id: "max-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", difficultyScore: 9, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", hasVisualization: true, tags: ["Tree", "DFS", "DP"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "serialize-deserialize", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", difficultyScore: 10, pattern: "trees", leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", hasVisualization: true, tags: ["Tree", "DFS", "BFS", "Design"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
    ]
  },
  {
    id: "heap",
    title: "Heap / Priority Queue",
    description: "A heap (priority queue) always gives you the minimum or maximum element in O(1), and insertion/deletion in O(log n). The critical use cases: top-K problems (maintain heap of size K), streaming median (two heaps — max-heap for lower half, min-heap for upper half), greedy scheduling (always process highest-priority task). Unlike sorting (O(n log n) upfront), heaps support dynamic insertion while maintaining access to the extreme.",
    coreIntuition: "If you need the 'best K' elements from a stream you can't sort, use a heap of size K. When a new element arrives: push it, then pop the worst (if size > K). After processing all elements, the heap contains exactly the K best. For median: maintain two heaps balanced ±1 in size; median is top of larger heap or average of both tops. Key: heap automatically reorganizes — you just push/pop.",
    recognitionSignals: [
      "Find or maintain Kth largest/smallest element",
      "Streaming data — need min/max at any point",
      "Merge K sorted lists/arrays",
      "Task scheduling with cooldown/priority",
      "Find median dynamically as numbers arrive",
      "Greedy: always process cheapest/cheapest next option",
      "Top-K frequent elements",
      "Design priority-based system (Twitter feed, etc.)"
    ],
    template: `// Min-heap of size K (keep K largest)
priority_queue<int, vector<int>, greater<int>> minHeap;
for (int x : nums) {
    minHeap.push(x);
    if (minHeap.size() > k) minHeap.pop(); // remove smallest
}
return minHeap.top(); // Kth largest

// Two-heap median
priority_queue<int> lo;               // max-heap (lower half)
priority_queue<int,vector<int>,greater<>> hi; // min-heap (upper half)
// Balance: |lo| == |hi| or |lo| == |hi| + 1
void addNum(int n) {
    lo.push(n);
    if (!hi.empty() && lo.top() > hi.top()) { hi.push(lo.top()); lo.pop(); }
    if (lo.size() > hi.size() + 1) { hi.push(lo.top()); lo.pop(); }
    if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
}`,
    timeComplexity: "O(n log k) for top-K; O(log n) per insertion",
    spaceComplexity: "O(k) for top-K heap",
    realWorldAnalogy: "Hospital ER triage. Patients arrive continuously; doctors always treat the most critical first. Heap = priority queue of patients. New patient: add to queue. Doctor free: remove highest-priority patient.",
    icon: "Triangle",
    color: "red",
    keyInsights: [
      "Heap invariant: parent is always smaller (min-heap) or larger (max-heap) than children — O(log n) push/pop",
      "For K largest: min-heap of size K — min-heap's top is the Kth largest (everything in heap ≥ heap top)",
      "For K smallest: max-heap of size K — max-heap's top is the Kth smallest",
      "Two-heap median: lo is max-heap (lower half), hi is min-heap (upper half). Invariant: |lo| == |hi| or |lo| == |hi|+1",
      "Task Scheduler with cooldown: greedy — always schedule the MOST FREQUENT remaining task. Use max-heap.",
    ],
    commonMistakes: [
      "K largest with MAX-heap of size n then popping k times → O(n log n), not O(n log k). Use min-heap of size K instead.",
      "Two heaps: pushing to wrong heap. Always push to lo first, then balance. Rule: lo's top must be ≤ hi's top.",
      "Forgetting heap API: C++ priority_queue pop() doesn't return value — call top() first, then pop().",
      "K closest points: Euclidean distance requires sqrt — but you can compare squared distances (sqrt is monotonic).",
      "Not considering O(n log k) vs O(n log n) — heap is for when k << n.",
    ],
    whenNotToUse: "When K == N (just sort). When elements don't arrive dynamically (sort the whole array). When you need ALL elements in sorted order (use sort). For offline queries where you can preprocess everything.",
    thinkingProcess: [
      "1. Am I looking for extremes (min, max, K-th) dynamically?",
      "2. Do I need the Kth from top? → min-heap of size K (counterintuitive!)",
      "3. Do I need the Kth from bottom? → max-heap of size K",
      "4. Do I need median of stream? → two heaps (max + min), balance to ±1 size",
      "5. Is this a greedy scheduling problem? → always pick best option (heap gives O(1) best)",
    ],
    decisionFramework: "Kth largest → min-heap size K. Kth smallest → max-heap size K. Streaming median → two heaps balanced ±1. Merge K sorted lists → min-heap of (value, list_index). Task scheduling with cooldown → max-heap + cooldown queue. K closest → max-heap size K (pop when > K).",
    problems: [
      { id: "kth-largest-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy", difficultyScore: 4, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", hasVisualization: true, tags: ["Heap", "Design", "Binary Search Tree"], companies: ["Amazon"], frequency: "High" },
      { id: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy", difficultyScore: 4, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/", hasVisualization: true, tags: ["Array", "Heap"], companies: ["Amazon"], frequency: "Medium" },
      { id: "k-closest-points", title: "K Closest Points to Origin", difficulty: "Medium", difficultyScore: 5, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/", hasVisualization: true, tags: ["Array", "Heap", "Sorting", "Quickselect"], companies: ["Amazon", "Facebook", "Google"], frequency: "High" },
      { id: "kth-largest-array", title: "Kth Largest Element in an Array", difficulty: "Medium", difficultyScore: 6, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", hasVisualization: true, tags: ["Array", "Heap", "Quickselect", "Sorting"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "task-scheduler", title: "Task Scheduler", difficulty: "Medium", difficultyScore: 7, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/task-scheduler/", hasVisualization: true, tags: ["Array", "Heap", "Greedy", "Counting"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "design-twitter", title: "Design Twitter", difficulty: "Medium", difficultyScore: 7, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/design-twitter/", hasVisualization: false, tags: ["Hash Map", "Heap", "Design", "Linked List"], companies: ["Twitter", "Amazon"], frequency: "Medium" },
      { id: "find-median-stream", title: "Find Median from Data Stream", difficulty: "Hard", difficultyScore: 9, pattern: "heap", leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/", hasVisualization: true, tags: ["Two Heaps", "Design", "Sorting"], companies: ["Amazon", "Google", "Microsoft"], frequency: "High" },
    ]
  },
  {
    id: "backtracking",
    title: "Backtracking",
    description: "Backtracking builds solutions incrementally, one decision at a time, abandoning (backtracking from) any partial solution that violates constraints. It's essentially DFS over a decision tree. Each node = a partial solution; each edge = one decision (include this element? use this candidate?). Pruning is what separates efficient backtracking from brute force — if you can prove a partial path can never lead to a valid solution, skip the entire subtree.",
    coreIntuition: "The backtracking template is: choose → explore → unchoose. Choose an option (add to current path), recursively explore with that choice, then unchoose (remove from path) to try next option. The invariant: when you unchoose, the state is exactly what it was before you chose — like the choice never happened. Pruning: skip choices that already violate constraints before recursing.",
    recognitionSignals: [
      "Find ALL solutions, not just one",
      "Generate all permutations of a sequence",
      "Generate all subsets or combinations",
      "Solve constraint satisfaction (N-Queens, Sudoku)",
      "Find all paths in grid / word search",
      "Partition into valid subsets",
      "Palindrome / valid partition of string",
      "Any 'enumerate all valid X' problem"
    ],
    template: `void backtrack(vector<int>& path, int start, vector<vector<int>>& res) {
    // Base case — valid complete solution
    if (path.size() == target_size) {
        res.push_back(path);
        return;
    }
    for (int i = start; i < candidates.size(); i++) {
        // Pruning — skip invalid choices early
        if (candidates[i] > remaining) break; // sorted, no point continuing
        if (i > start && candidates[i] == candidates[i-1]) continue; // skip duplicates

        path.push_back(candidates[i]);          // CHOOSE
        backtrack(path, i + 1, res);            // EXPLORE
        path.pop_back();                         // UNCHOOSE
    }
}`,
    timeComplexity: "O(2^n) for subsets, O(n!) for permutations, O(n * 2^n) with path copies",
    spaceComplexity: "O(n) recursion stack depth",
    realWorldAnalogy: "Solving a maze. At each junction, try each direction. If you hit a dead end, backtrack to the last junction and try a different direction. Keep a trail of where you've been — erase it as you backtrack.",
    icon: "RotateCcw",
    color: "violet",
    keyInsights: [
      "The CHOOSE → EXPLORE → UNCHOOSE pattern is sacred — always restore state after recursion",
      "For deduplication: SORT first, then skip if current element equals previous element at the SAME recursion level",
      "Subsets vs Combinations vs Permutations: subsets (include/exclude each), combinations (choose k from n), permutations (all orderings)",
      "Pruning is critical: if sorted and remaining candidate > remaining target, break (not continue) — nothing after will work",
      "For grid DFS (word search): mark current cell visited IN THE PATH, unmark when backtracking",
    ],
    commonMistakes: [
      "Forgetting to undo state: modifying a grid cell to 'visited' but not restoring it after recursion",
      "Duplicate subsets/combinations: not sorting + not skipping duplicates at same level",
      "Combination Sum: reusing elements is allowed → pass i (not i+1) to next recursion level",
      "Combination Sum II: each element used once → pass i+1, but sort and skip duplicates",
      "N-Queens: validating the board is O(n²) per placement. Use column/diagonal sets for O(1) validation.",
    ],
    whenNotToUse: "When only ONE solution needed (use DFS with early return, not full backtracking). When problem has optimal substructure (DP is exponentially faster). When constraints are too large (n>20 for permutations, n>30 for subsets — time limit exceeded).",
    thinkingProcess: [
      "1. Does the problem ask for ALL valid solutions? → Backtracking",
      "2. Can I define 'current state' and 'remaining choices' at each step?",
      "3. What's my pruning condition? (early termination when partial solution is already invalid)",
      "4. Are there duplicates in input that would create duplicate results? → Sort + skip",
      "5. Am I restoring state correctly after each recursive call?",
    ],
    decisionFramework: "Generate all subsets → include/exclude each element. Combinations of size k → start index moves forward. Permutations → use swap technique or visited array. Word search → DFS with cell marking. N-Queens → row by row, check col/diag sets. Palindrome partition → check if current prefix is palindrome, then recurse on suffix.",
    problems: [
      { id: "subsets", title: "Subsets", difficulty: "Medium", difficultyScore: 5, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/subsets/", hasVisualization: true, tags: ["Array", "Backtracking", "Bit Manipulation"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "combination-sum", title: "Combination Sum", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/combination-sum/", hasVisualization: true, tags: ["Array", "Backtracking"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "permutations", title: "Permutations", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/permutations/", hasVisualization: true, tags: ["Array", "Backtracking"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "subsets-ii", title: "Subsets II", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/subsets-ii/", hasVisualization: true, tags: ["Array", "Backtracking", "Sorting"], companies: ["Amazon"], frequency: "Medium" },
      { id: "combination-sum-ii", title: "Combination Sum II", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/combination-sum-ii/", hasVisualization: false, tags: ["Array", "Backtracking", "Sorting"], companies: ["Amazon"], frequency: "Medium" },
      { id: "word-search", title: "Word Search", difficulty: "Medium", difficultyScore: 7, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/word-search/", hasVisualization: true, tags: ["Array", "Backtracking", "DFS", "Matrix"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "Medium", difficultyScore: 7, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/palindrome-partitioning/", hasVisualization: true, tags: ["String", "Backtracking", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "letter-combinations", title: "Letter Combinations of a Phone Number", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", hasVisualization: true, tags: ["String", "Backtracking", "Hash Map"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "combination-sum-iii", title: "Combination Sum III", difficulty: "Medium", difficultyScore: 6, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/combination-sum-iii/", hasVisualization: false, tags: ["Array", "Backtracking"], companies: [], frequency: "Medium" },
      { id: "n-queens", title: "N-Queens", difficulty: "Hard", difficultyScore: 9, pattern: "backtracking", leetcodeUrl: "https://leetcode.com/problems/n-queens/", hasVisualization: true, tags: ["Array", "Backtracking"], companies: ["Amazon", "Uber"], frequency: "Medium" },
    ]
  },
  {
    id: "graphs",
    title: "Graphs",
    description: "Graphs model pairwise relationships between nodes. Most interview problems reduce to: (1) connected components — how many separate groups exist?, (2) shortest path — what's the minimum distance/steps between two nodes?, or (3) cycle detection — does the graph contain a cycle? BFS is optimal for unweighted shortest paths (explores layer by layer). DFS is optimal for connectivity and cycle detection. Union-Find is optimal for dynamic connectivity queries.",
    coreIntuition: "Grid problems ARE graph problems — each cell is a node, edges connect to 4 neighbors. For any DFS/BFS: mark nodes visited immediately on discovery (not on processing) to avoid re-queuing. For topological sort: nodes with no incoming edges are processed first; a cycle means topological sort is impossible. Union-Find: find parent with path compression, union by rank — nearly O(1) per operation amortized.",
    recognitionSignals: [
      "Count islands / connected regions in grid",
      "Shortest path in unweighted graph or grid",
      "Course prerequisites — detect cycle in DAG",
      "Connected components — how many separate groups",
      "Friend networks / social graphs",
      "Bipartite check (can we 2-color the graph?)",
      "Topological ordering of tasks",
      "Multi-source BFS (rotting oranges, walls & gates)"
    ],
    template: `// BFS shortest path (unweighted)
queue<int> q; q.push(src);
vector<int> dist(n, -1); dist[src] = 0;
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u])
        if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
}

// DFS for connected components / cycle
void dfs(int u, vector<bool>& vis, vector<vector<int>>& adj) {
    vis[u] = true;
    for (int v : adj[u])
        if (!vis[v]) dfs(v, vis, adj);
}

// Union-Find
int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
void unite(int x, int y) { parent[find(x)] = find(y); }`,
    timeComplexity: "O(V + E) for DFS/BFS; O(α(n)) per Union-Find op",
    spaceComplexity: "O(V + E) adjacency list; O(V) visited array",
    realWorldAnalogy: "City road map. BFS = ripple expanding from source, reaches nearest cities first. DFS = explorer following one road to its end before backtracking. Union-Find = groups of friends — connecting two groups merges them.",
    icon: "Share2",
    color: "indigo",
    keyInsights: [
      "BFS guarantees shortest path in UNWEIGHTED graph — it explores layer by layer (distance 1, then 2, then 3...)",
      "DFS guarantees connectivity check — it reaches all reachable nodes",
      "Mark nodes visited IMMEDIATELY when added to queue, not when processed — prevents re-queuing the same node",
      "Multi-source BFS: start all sources in queue simultaneously → finds minimum distance from any source",
      "Topological sort has two forms: Kahn's (BFS from 0-indegree nodes) and DFS (add to result after all children processed)",
    ],
    commonMistakes: [
      "Marking visited WHEN POPPED from queue → same node can be added to queue multiple times, causing O(V²) or worse",
      "Topological sort cycle detection: if result size < numNodes, there's a cycle (some nodes were never added)",
      "For grid BFS: using 4 directions but forgetting boundary checks or not checking if already visited",
      "Using DFS for shortest path in unweighted graph → DFS finds A path, not necessarily shortest",
      "Union-Find without path compression → O(n) per operation instead of O(α(n)) amortized",
    ],
    whenNotToUse: "When edges have weights (use Dijkstra or Bellman-Ford). When you need globally optimal path with constraints (DP). When graph is a tree (tree-specific algorithms are simpler). When n is tiny (simple recursion/brute force is fine).",
    thinkingProcess: [
      "1. Is this a grid? (cells = nodes, 4-directional adjacency = edges)",
      "2. Do I need shortest path (unweighted)? → BFS",
      "3. Do I need connectivity / cycle detection? → DFS or Union-Find",
      "4. Do I need ordering of dependencies? → Topological sort",
      "5. Are there multiple sources to expand from simultaneously? → Multi-source BFS",
    ],
    decisionFramework: "Count connected components → DFS/BFS from each unvisited node, or Union-Find. Shortest path unweighted → BFS. Detect cycle undirected → Union-Find (edge connects same component). Detect cycle directed → DFS with color (white/gray/black). Topological order → Kahn's BFS or DFS post-order. Multi-source min distance → multi-source BFS.",
    problems: [
      { id: "find-path-exists", title: "Find if Path Exists in Graph", difficulty: "Easy", difficultyScore: 3, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/find-if-path-exists-in-graph/", hasVisualization: true, tags: ["DFS", "BFS", "Union Find"], companies: ["Amazon"], frequency: "Medium" },
      { id: "number-of-islands", title: "Number of Islands", difficulty: "Medium", difficultyScore: 5, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", hasVisualization: true, tags: ["Array", "DFS", "BFS", "Union Find"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "clone-graph", title: "Clone Graph", difficulty: "Medium", difficultyScore: 6, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/clone-graph/", hasVisualization: true, tags: ["DFS", "BFS", "Hash Map"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "max-area-island", title: "Max Area of Island", difficulty: "Medium", difficultyScore: 5, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/max-area-of-island/", hasVisualization: true, tags: ["Array", "DFS", "BFS"], companies: ["Amazon"], frequency: "High" },
      { id: "pacific-atlantic", title: "Pacific Atlantic Water Flow", difficulty: "Medium", difficultyScore: 7, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/", hasVisualization: true, tags: ["Array", "DFS", "BFS"], companies: ["Amazon", "Google"], frequency: "Medium" },
      { id: "surrounded-regions", title: "Surrounded Regions", difficulty: "Medium", difficultyScore: 6, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/surrounded-regions/", hasVisualization: true, tags: ["Array", "DFS", "BFS", "Union Find"], companies: ["Google"], frequency: "Medium" },
      { id: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium", difficultyScore: 6, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/", hasVisualization: true, tags: ["Array", "BFS"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "walls-gates", title: "Walls and Gates", difficulty: "Medium", difficultyScore: 6, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/walls-and-gates/", hasVisualization: true, tags: ["Array", "BFS"], companies: ["Amazon", "Facebook"], frequency: "Medium" },
      { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", difficultyScore: 7, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/course-schedule/", hasVisualization: true, tags: ["DFS", "BFS", "Topological Sort"], companies: ["Amazon", "Apple"], frequency: "High" },
      { id: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium", difficultyScore: 7, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/", hasVisualization: true, tags: ["DFS", "BFS", "Topological Sort"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "graph-valid-tree", title: "Graph Valid Tree", difficulty: "Medium", difficultyScore: 7, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/graph-valid-tree/", hasVisualization: true, tags: ["DFS", "BFS", "Union Find"], companies: ["Amazon", "Google"], frequency: "Medium" },
      { id: "num-connected-components", title: "Number of Connected Components", difficulty: "Medium", difficultyScore: 6, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", hasVisualization: true, tags: ["DFS", "BFS", "Union Find"], companies: ["LinkedIn", "Amazon"], frequency: "Medium" },
      { id: "redundant-connection", title: "Redundant Connection", difficulty: "Medium", difficultyScore: 7, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/redundant-connection/", hasVisualization: true, tags: ["Union Find", "DFS", "BFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "all-paths-source-target", title: "All Paths From Source to Target", difficulty: "Medium", difficultyScore: 5, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/all-paths-from-source-to-target/", hasVisualization: true, tags: ["DFS", "BFS", "Backtracking"], companies: ["Amazon"], frequency: "Medium" },
      { id: "word-ladder", title: "Word Ladder", difficulty: "Hard", difficultyScore: 9, pattern: "graphs", leetcodeUrl: "https://leetcode.com/problems/word-ladder/", hasVisualization: true, tags: ["Hash Set", "BFS"], companies: ["Amazon", "LinkedIn"], frequency: "High" },
    ]
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "DP eliminates exponential brute force by recognizing that subproblems overlap — the same subproblem is solved multiple times in naive recursion. Cache the answer the first time (memoization) or build answers bottom-up (tabulation). The three steps: (1) define the subproblem and what dp[i] or dp[i][j] means, (2) write the recurrence (how bigger problems depend on smaller ones), (3) initialize base cases. 1D DP handles single-sequence problems; 2D DP handles two-sequence or grid problems.",
    coreIntuition: "If the brute force is exponential and you see repeated subproblems in the recursion tree, DP applies. The hardest part is defining the state. Once you have 'dp[i] = X given first i elements', the recurrence often follows from 'what's the last decision I made?' — include/exclude, take/skip, left/right. For 2D, dp[i][j] usually means 'answer for first i chars of s1 and first j chars of s2'.",
    recognitionSignals: [
      "Count number of ways to do X",
      "Minimum/maximum cost to achieve X",
      "Can we achieve X? (boolean DP)",
      "Optimal subsequence (LIS, LCS, edit distance)",
      "Knapsack-style include/exclude decisions",
      "Overlapping subproblems in recursion tree",
      "Grid path counting / minimum path",
      "String matching with wildcards or edits"
    ],
    template: `// 1D DP — Climbing Stairs / Fibonacci style
vector<int> dp(n + 1);
dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];

// 1D DP — Include/exclude (House Robber)
// dp[i] = max money robbing houses 0..i
dp[0] = nums[0]; dp[1] = max(nums[0], nums[1]);
for (int i = 2; i < n; i++)
    dp[i] = max(dp[i-1], dp[i-2] + nums[i]);

// 2D DP — LCS / Edit Distance style
// dp[i][j] = answer for s1[0..i-1], s2[0..j-1]
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
        else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);`,
    timeComplexity: "O(n) 1D, O(n²) 2D, O(n*amount) for knapsack",
    spaceComplexity: "O(n) 1D, O(n²) 2D — often reducible to O(n) rolling array",
    realWorldAnalogy: "Building a skyscraper. Each floor's cost = material cost + cost of building everything below. Don't rebuild from ground up for each floor — look up the pre-computed cost of the floor below.",
    icon: "Grid",
    color: "amber",
    keyInsights: [
      "The hardest part of DP is defining the STATE — dp[i] must mean something precise and complete",
      "Find the RECURRENCE by asking: 'what was the LAST decision made to reach state i?'",
      "1D DP: usually 'include or exclude current element' or 'extend or restart'",
      "2D DP: dp[i][j] usually = 'best answer using first i elements of s1 and first j elements of s2'",
      "Rolling array optimization: when dp[i] only depends on dp[i-1] and dp[i-2], use two variables instead of array",
    ],
    commonMistakes: [
      "Defining state too narrowly: dp[i] = 'answer ending at i' vs dp[i] = 'best answer for first i' — wrong definition causes wrong recurrence",
      "Wrong base cases: dp[0] should represent 'empty prefix' answer, not 'first element' answer",
      "For coin change: initializing unreachable states to INT_MAX and adding 1 causes overflow — use amount+1 as sentinel",
      "For LCS/edit distance: forgetting the diagonal dp[i-1][j-1] when characters match",
      "Thinking too hard before writing recurrence — write naive recursion first, then memoize",
    ],
    whenNotToUse: "When greedy works (provably optimal local choice). When problem is on a tree (tree DP is different). When n is tiny (backtracking). When the 'optimal substructure' property doesn't hold (some graph problems).",
    thinkingProcess: [
      "1. Write the brute force recursive solution first — identify overlapping subproblems",
      "2. Define dp[i] clearly: 'dp[i] = [what exactly?] for [what input?]'",
      "3. Write the recurrence: dp[i] depends on which previous states?",
      "4. Identify base cases: what are the smallest valid inputs?",
      "5. Determine order: must compute smaller problems before larger ones",
    ],
    decisionFramework: "Fibonacci/staircase → dp[i] = dp[i-1] + dp[i-2]. Include/exclude (knapsack, rob) → dp[i] = max(dp[i-1], dp[i-2]+val). Unbounded knapsack (coin change) → inner loop over coins for each amount. LCS/edit → 2D dp with match/no-match recurrence. Count paths in grid → dp[i][j] = dp[i-1][j] + dp[i][j-1]. LIS → dp[i] = max dp[j]+1 where j<i and arr[j]<arr[i].",
    problems: [
      // 1D DP — Easy
      { id: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", difficultyScore: 3, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", hasVisualization: true, tags: ["Math", "DP", "Memoization"], companies: ["Amazon", "Apple"], frequency: "High" },
      { id: "min-cost-climbing", title: "Min Cost Climbing Stairs", difficulty: "Easy", difficultyScore: 4, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "nth-tribonacci", title: "N-th Tribonacci Number", difficulty: "Easy", difficultyScore: 3, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/n-th-tribonacci-number/", hasVisualization: true, tags: ["Math", "DP", "Memoization"], companies: [], frequency: "Medium" },
      // 1D DP — Medium
      { id: "house-robber", title: "House Robber", difficulty: "Medium", difficultyScore: 5, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/house-robber/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon", "Airbnb"], frequency: "High" },
      { id: "house-robber-ii", title: "House Robber II", difficulty: "Medium", difficultyScore: 6, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "High" },
      { id: "longest-palindromic-substr", title: "Longest Palindromic Substring", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", hasVisualization: true, tags: ["String", "DP", "Expand Around Center"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "palindromic-substrings", title: "Palindromic Substrings", difficulty: "Medium", difficultyScore: 6, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/palindromic-substrings/", hasVisualization: true, tags: ["String", "DP", "Expand Around Center"], companies: ["Amazon"], frequency: "High" },
      { id: "decode-ways", title: "Decode Ways", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/decode-ways/", hasVisualization: true, tags: ["String", "DP"], companies: ["Amazon", "Facebook"], frequency: "High" },
      { id: "coin-change", title: "Coin Change", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/coin-change/", hasVisualization: true, tags: ["Array", "DP", "BFS"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "max-product-subarray", title: "Maximum Product Subarray", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon", "LinkedIn"], frequency: "High" },
      { id: "word-break", title: "Word Break", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/word-break/", hasVisualization: true, tags: ["String", "DP", "Hash Set", "Trie"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium", difficultyScore: 8, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", hasVisualization: true, tags: ["Array", "DP", "Binary Search"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "partition-equal-subset", title: "Partition Equal Subset Sum", difficulty: "Medium", difficultyScore: 8, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "jump-game-vii", title: "Jump Game VII", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/jump-game-vii/", hasVisualization: false, tags: ["String", "DP", "Prefix Sum", "Sliding Window"], companies: [], frequency: "Low" },
      // 2D DP — Medium
      { id: "unique-paths", title: "Unique Paths", difficulty: "Medium", difficultyScore: 5, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/unique-paths/", hasVisualization: true, tags: ["Math", "DP", "Combinatorics"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "minimum-path-sum", title: "Minimum Path Sum", difficulty: "Medium", difficultyScore: 6, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/minimum-path-sum/", hasVisualization: true, tags: ["Array", "DP", "Matrix"], companies: ["Amazon"], frequency: "High" },
      { id: "triangle", title: "Triangle", difficulty: "Medium", difficultyScore: 6, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/triangle/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium", difficultyScore: 8, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", hasVisualization: true, tags: ["String", "DP"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "edit-distance", title: "Edit Distance", difficulty: "Medium", difficultyScore: 9, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/edit-distance/", hasVisualization: true, tags: ["String", "DP"], companies: ["Amazon", "Google", "Microsoft"], frequency: "High" },
      { id: "buy-sell-cooldown", title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "coin-change-ii", title: "Coin Change II", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/coin-change-ii/", hasVisualization: true, tags: ["Array", "DP"], companies: ["Amazon"], frequency: "High" },
      { id: "target-sum", title: "Target Sum", difficulty: "Medium", difficultyScore: 7, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/target-sum/", hasVisualization: true, tags: ["Array", "DP", "Backtracking"], companies: ["Amazon"], frequency: "High" },
      { id: "interleaving-string", title: "Interleaving String", difficulty: "Medium", difficultyScore: 8, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/interleaving-string/", hasVisualization: false, tags: ["String", "DP"], companies: ["Google"], frequency: "Medium" },
      // 2D DP — Hard
      { id: "longest-increasing-path-matrix", title: "Longest Increasing Path in a Matrix", difficulty: "Hard", difficultyScore: 9, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", hasVisualization: true, tags: ["Array", "DP", "DFS", "Memoization"], companies: ["Google", "Amazon"], frequency: "Medium" },
      { id: "distinct-subsequences", title: "Distinct Subsequences", difficulty: "Hard", difficultyScore: 9, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/distinct-subsequences/", hasVisualization: true, tags: ["String", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "burst-balloons", title: "Burst Balloons", difficulty: "Hard", difficultyScore: 10, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/burst-balloons/", hasVisualization: false, tags: ["Array", "DP", "Divide & Conquer"], companies: ["Google"], frequency: "Medium" },
      { id: "regular-expression-matching", title: "Regular Expression Matching", difficulty: "Hard", difficultyScore: 10, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/regular-expression-matching/", hasVisualization: false, tags: ["String", "DP", "Recursion"], companies: ["Amazon", "Google", "Facebook"], frequency: "Medium" },
      { id: "max-score-multiplication", title: "Maximum Score from Performing Multiplication Operations", difficulty: "Hard", difficultyScore: 8, pattern: "dynamic-programming", leetcodeUrl: "https://leetcode.com/problems/maximum-score-from-performing-multiplication-operations/", hasVisualization: true, tags: ["Array", "DP"], companies: [], frequency: "Low" },
    ]
  },
  {
    id: "greedy",
    title: "Greedy",
    description: "Greedy algorithms make locally optimal choices at each step, hoping to find a global optimum. Unlike DP (which considers all choices), greedy commits to one choice and never looks back. The critical challenge: proving the greedy choice is safe. Most greedy proofs use exchange argument — show that any solution not following the greedy choice can be transformed into a greedy solution without getting worse.",
    coreIntuition: "Greedy works when the problem has 'optimal substructure' AND the 'greedy choice property' — taking the locally best option now doesn't foreclose a globally optimal solution. Red flag: if taking the greedy choice now might hurt you later, use DP instead. Common greedy patterns: always extend farthest reach (jump game), always merge/process by earliest endpoint (intervals), always use highest frequency first (task scheduler).",
    recognitionSignals: [
      "Jump game — can you reach the end?",
      "Gas station — circular feasibility",
      "Interval scheduling — greedy by end time",
      "Huffman / frequency-based optimization",
      "Always pick max/min available at each step",
      "Partition string into minimum pieces",
      "Stock trading — unlimited transactions",
      "Lemonade change — greedy coin assignment"
    ],
    template: `// Jump Game II — greedy reach tracking
int jumps = 0, curEnd = 0, farthest = 0;
for (int i = 0; i < n - 1; i++) {
    farthest = max(farthest, i + nums[i]); // max reach from here
    if (i == curEnd) {  // forced to jump — current range exhausted
        jumps++;
        curEnd = farthest;
    }
}
return jumps;

// Activity selection / non-overlapping intervals
sort(intervals, by end time);
int count = 0, lastEnd = INT_MIN;
for (auto& [s, e] : intervals) {
    if (s >= lastEnd) { count++; lastEnd = e; } // no overlap, take it
}`,
    timeComplexity: "O(n) or O(n log n) when sorting required",
    spaceComplexity: "O(1) after sorting",
    realWorldAnalogy: "Paying with cash — always use largest valid bills first to minimize coin count. Dijkstra is also greedy: always expand the currently cheapest known path.",
    icon: "Zap",
    color: "lime",
    keyInsights: [
      "Greedy correctness requires an EXCHANGE ARGUMENT proof: any solution not following greedy can be transformed to greedy without getting worse",
      "Jump Game: track 'max reach' — if current index > max reach, it's unreachable",
      "Gas Station: if total gas >= total cost, solution ALWAYS exists. The valid start is where cumulative sum hits minimum.",
      "Partition Labels: last occurrence of each character dictates the minimum partition boundary — extend boundary as you go",
      "Interval scheduling (max non-overlapping): greedy by EARLIEST END TIME — counterintuitively, not by earliest start",
    ],
    commonMistakes: [
      "Applying greedy without proof → coin change is the classic example where greedy FAILS for non-canonical coin systems",
      "Jump Game II: counting jumps at every step instead of only when forced (when i == curEnd)",
      "Gas Station: trying every starting point O(n²) when the greedy O(n) solution exists",
      "Partition Labels: using first occurrence as boundary instead of last occurrence",
      "Stock II: missing that ANY upward segment can be captured (sum of all positive differences = optimal)",
    ],
    whenNotToUse: "When local optimum doesn't guarantee global optimum (use DP). When you can prove a counterexample to the greedy approach. When the problem has dependencies between choices (use backtracking or DP).",
    thinkingProcess: [
      "1. Can I make a decision at each step that's provably optimal?",
      "2. Can I prove exchange argument? (swap any non-greedy choice with greedy → doesn't get worse)",
      "3. Is the greedy choice based on a sorted order? (sort by end time, start time, weight, etc.)",
      "4. What information do I need to track? (current reach, cumulative sum, last occurrence)",
      "5. If unsure, test a small counterexample — if greedy fails, DP might be needed",
    ],
    decisionFramework: "Jump game variants → track maximum reach greedily. Gas station → find where cumulative sum is minimum. Interval scheduling → sort by end time, take if non-overlapping. Kadane's (max subarray) → restart vs extend. Stock unlimited → capture all upward moves. Partition labels → use last occurrence map.",
    problems: [
      { id: "lemonade-change", title: "Lemonade Change", difficulty: "Easy", difficultyScore: 3, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/lemonade-change/", hasVisualization: true, tags: ["Array", "Greedy"], companies: [], frequency: "Medium" },
      { id: "best-time-stock-ii", title: "Best Time to Buy and Sell Stock II", difficulty: "Medium", difficultyScore: 4, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/", hasVisualization: true, tags: ["Array", "Greedy", "DP"], companies: ["Amazon"], frequency: "High" },
      { id: "max-subarray", title: "Maximum Subarray", difficulty: "Medium", difficultyScore: 5, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", hasVisualization: true, tags: ["Array", "DP", "Divide & Conquer"], companies: ["Amazon", "LinkedIn", "Microsoft"], frequency: "High" },
      { id: "jump-game", title: "Jump Game", difficulty: "Medium", difficultyScore: 5, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/jump-game/", hasVisualization: true, tags: ["Array", "Greedy", "DP"], companies: ["Amazon"], frequency: "High" },
      { id: "jump-game-ii", title: "Jump Game II", difficulty: "Medium", difficultyScore: 6, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/", hasVisualization: true, tags: ["Array", "Greedy", "DP"], companies: ["Amazon"], frequency: "High" },
      { id: "gas-station", title: "Gas Station", difficulty: "Medium", difficultyScore: 7, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/gas-station/", hasVisualization: true, tags: ["Array", "Greedy"], companies: ["Amazon"], frequency: "Medium" },
      { id: "hand-of-straights", title: "Hand of Straights", difficulty: "Medium", difficultyScore: 6, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/hand-of-straights/", hasVisualization: true, tags: ["Array", "Greedy", "Hash Map", "Sorting"], companies: ["Google"], frequency: "Medium" },
      { id: "merge-triplets", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", difficultyScore: 7, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", hasVisualization: true, tags: ["Array", "Greedy"], companies: [], frequency: "Low" },
      { id: "partition-labels", title: "Partition Labels", difficulty: "Medium", difficultyScore: 6, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/partition-labels/", hasVisualization: true, tags: ["String", "Greedy", "Hash Map"], companies: ["Amazon"], frequency: "Medium" },
      { id: "valid-parenthesis-string", title: "Valid Parenthesis String", difficulty: "Medium", difficultyScore: 7, pattern: "greedy", leetcodeUrl: "https://leetcode.com/problems/valid-parenthesis-string/", hasVisualization: true, tags: ["String", "Greedy", "DP"], companies: ["Amazon"], frequency: "Medium" },
    ]
  },
  {
    id: "intervals",
    title: "Intervals",
    description: "Interval problems involve ranges [start, end] that may overlap. Core operations: merge overlapping intervals, insert a new interval, count maximum concurrent intervals (meeting rooms), remove minimum intervals to eliminate all overlaps. Always sort by start time first. Overlap condition: interval A overlaps B when A.start <= B.end AND B.start <= A.end. To merge: if next.start <= curr.end, extend curr.end = max(curr.end, next.end).",
    coreIntuition: "After sorting by start time, you process intervals left to right with a simple 'does this overlap with my current interval?' check. Merge: extend end if overlap, otherwise finalize current and start new. For meeting rooms (max simultaneous): use min-heap of end times — if new interval starts after smallest end, pop (room freed); always push new end. For removing minimum intervals: greedy by earliest end time (keep intervals that end soonest).",
    recognitionSignals: [
      "Merge overlapping intervals into fewest intervals",
      "Insert interval into sorted non-overlapping list",
      "Count minimum rooms needed for all meetings",
      "Find minimum intervals to remove so none overlap",
      "Minimum arrows to burst balloons",
      "Intervals representing availability / blocking",
      "Meeting scheduling conflict detection"
    ],
    template: `// Merge intervals
sort(intervals.begin(), intervals.end()); // sort by start
vector<vector<int>> res = {intervals[0]};
for (auto& iv : intervals) {
    if (iv[0] <= res.back()[1])              // overlap
        res.back()[1] = max(res.back()[1], iv[1]);
    else res.push_back(iv);                  // no overlap
}

// Meeting rooms II — min heap of end times
sort(intervals.begin(), intervals.end());
priority_queue<int, vector<int>, greater<>> ends; // min-heap
for (auto& [s, e] : intervals) {
    if (!ends.empty() && s >= ends.top()) ends.pop(); // reuse room
    ends.push(e);
}
return ends.size(); // rooms needed`,
    timeComplexity: "O(n log n) due to sorting",
    spaceComplexity: "O(n) for output or heap",
    realWorldAnalogy: "Calendar scheduling. Merge: combine 'meeting 1-3pm' and 'meeting 2-4pm' into '1-4pm'. Meeting rooms: each concurrent meeting needs its own room — track when each room becomes free.",
    icon: "Calendar",
    color: "rose",
    keyInsights: [
      "ALWAYS sort by start time first — this is the prerequisite for all interval algorithms",
      "Overlap condition: A overlaps B iff A.start < B.end AND B.start < A.end (strict inequalities for touching)",
      "Merge: extend current end = max(curr.end, next.end) — don't just set to next.end (next might be fully contained)",
      "Meeting Rooms II (min rooms): at any moment, rooms needed = number of overlapping intervals = max simultaneous meetings",
      "Min arrows: sort by END. Greedy: each arrow at current interval's end bursts all overlapping intervals (those with start <= curr.end)",
    ],
    commonMistakes: [
      "Merge: setting result.back().end = next.end instead of max(result.back().end, next.end) — fails when next is fully contained in curr",
      "Meeting Rooms II: not using min-heap of end times → O(n²) naive approach",
      "Insert interval: handling the three cases (before, overlap, after) in wrong order",
      "Non-overlapping intervals: greedy by start time instead of end time — end time is correct",
      "Min arrows: forgetting to update arrow position to min of current interval ends (not max)",
    ],
    whenNotToUse: "When intervals have weights/priorities (use more complex scheduling). When you need to handle real-time insertions efficiently (interval tree). When intervals are in multiple dimensions.",
    thinkingProcess: [
      "1. Sort by start time first (or end time for scheduling optimization)",
      "2. Does the next interval overlap the current? (next.start <= curr.end)",
      "3. If merging: extend curr.end = max(curr.end, next.end)",
      "4. For room counting: use min-heap to track earliest end time of active meetings",
      "5. For min removal: greedy keep intervals with earliest end (more room for future intervals)",
    ],
    decisionFramework: "Merge overlapping → sort by start, extend end on overlap. Count rooms needed → min-heap of end times. Remove min intervals → greedy keep earliest-ending. Insert into non-overlapping → handle before/overlap/after cases. Min arrows → sort by end, advance arrow to next interval's end when needed.",
    problems: [
      { id: "meeting-rooms", title: "Meeting Rooms", difficulty: "Easy", difficultyScore: 4, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/meeting-rooms/", hasVisualization: false, tags: ["Array", "Sorting"], companies: ["Amazon", "Facebook"], frequency: "Medium" },
      { id: "insert-interval", title: "Insert Interval", difficulty: "Medium", difficultyScore: 6, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/insert-interval/", hasVisualization: false, tags: ["Array", "Greedy"], companies: ["Amazon", "Google"], frequency: "High" },
      { id: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", difficultyScore: 6, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", hasVisualization: true, tags: ["Array", "Sorting"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "non-overlapping-intervals", title: "Non-overlapping Intervals", difficulty: "Medium", difficultyScore: 6, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/", hasVisualization: false, tags: ["Array", "Greedy", "Sorting"], companies: ["Google"], frequency: "Medium" },
      { id: "meeting-rooms-ii", title: "Meeting Rooms II", difficulty: "Medium", difficultyScore: 7, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii/", hasVisualization: false, tags: ["Array", "Sorting", "Heap"], companies: ["Amazon", "Google", "Facebook"], frequency: "High" },
      { id: "min-interval-query", title: "Minimum Interval to Include Each Query", difficulty: "Hard", difficultyScore: 9, pattern: "intervals", leetcodeUrl: "https://leetcode.com/problems/minimum-interval-to-include-each-query/", hasVisualization: true, tags: ["Array", "Sorting", "Heap"], companies: ["Google"], frequency: "Low" },
    ]
  },
  {
    id: "math-geometry",
    title: "Math & Geometry",
    description: "Math and geometry problems use number theory, modular arithmetic, bit tricks, and 2D coordinate manipulation. Key patterns: matrix rotation uses the transpose-then-mirror trick; spiral traversal maintains four boundaries shrinking inward; prime sieve runs in O(n log log n); cycle detection in sequences uses Floyd's algorithm; power functions use fast exponentiation (O(log n) not O(n)).",
    coreIntuition: "Rotate 90° clockwise: transpose (swap matrix[i][j] and matrix[j][i]) then reverse each row. Spiral: maintain top/bottom/left/right pointers, traverse each boundary, shrink. Fast power: x^n = (x^(n/2))^2 if n even; x * x^(n-1) if odd — this gives O(log n). Happy number: detect cycle with Floyd's on the 'sum of squares of digits' sequence. Sieve of Eratosthenes: mark multiples of each prime as composite.",
    recognitionSignals: [
      "Rotate matrix 90/180/270 degrees in-place",
      "Spiral traversal of matrix",
      "Set rows/columns to zero based on cell value",
      "Detect cycle in sequence (happy number, linked list)",
      "Compute x^n efficiently (fast exponentiation)",
      "Count primes up to n (Sieve of Eratosthenes)",
      "Multiply large numbers as strings",
      "Convert between Roman and decimal numerals"
    ],
    template: `// Rotate matrix 90° clockwise in-place
// Step 1: Transpose
for (int i = 0; i < n; i++)
    for (int j = i+1; j < n; j++)
        swap(matrix[i][j], matrix[j][i]);
// Step 2: Reverse each row
for (int i = 0; i < n; i++)
    reverse(matrix[i].begin(), matrix[i].end());

// Fast power — O(log n)
double myPow(double x, int n) {
    if (n == 0) return 1;
    if (n < 0) { x = 1/x; n = -n; }
    double half = myPow(x, n/2);
    return n % 2 == 0 ? half*half : half*half*x;
}

// Sieve of Eratosthenes
vector<bool> isPrime(n+1, true);
isPrime[0] = isPrime[1] = false;
for (int i = 2; i*i <= n; i++)
    if (isPrime[i])
        for (int j = i*i; j <= n; j += i)
            isPrime[j] = false;`,
    timeComplexity: "O(n²) for matrix ops, O(log n) for fast power, O(n log log n) for sieve",
    spaceComplexity: "O(1) for in-place matrix, O(n) for sieve",
    realWorldAnalogy: "Rotating a physical photo: flip it face-down (transpose), then flip left-to-right (reverse rows). Fast power is like compound interest — double the exponent each step instead of multiplying one by one.",
    icon: "Calculator",
    color: "pink",
    keyInsights: [
      "Rotate 90° clockwise = Transpose then Reverse each row. Rotate 90° CCW = Reverse each row then Transpose.",
      "Spiral: maintain 4 boundaries (top, bottom, left, right), process one boundary at a time, shrink after each",
      "Set Matrix Zeroes: record which rows/columns need zeroing BEFORE modifying (or use first row/col as flags)",
      "Fast exponentiation: x^n = (x^(n/2))² is O(log n). Handles negative n by computing (1/x)^(-n).",
      "Sieve of Eratosthenes: only mark composites from p² (smaller multiples already marked by smaller primes)",
    ],
    commonMistakes: [
      "Rotate: doing it in wrong order (reverse then transpose gives CCW, not CW — order matters!)",
      "Set Matrix Zeroes: zeroing as you find zeros → corrupts future searches (use first pass to record, second pass to zero)",
      "Fast power: forgetting negative exponent case. Also: n could be INT_MIN, which overflows when negated.",
      "Happy Number: not detecting cycle → infinite loop. Use slow/fast pointer or hash set.",
      "Spiral: not terminating when top > bottom or left > right (for non-square matrices)",
    ],
    whenNotToUse: "Math/geometry tricks are problem-specific — there's no general 'always use this' rule. Recognize patterns (rotation = transpose+flip, spiral = shrinking boundaries) from problem structure.",
    thinkingProcess: [
      "1. Is this a matrix problem? → Identify the invariant (rotation preserves content, spiral visits each once)",
      "2. Can I compute this iteratively vs recursively? (fast power → recursive halving)",
      "3. Does the operation have a mathematical shortcut? (sum of squares of digits → cycle detection)",
      "4. Am I modifying the matrix in-place? → Need to record changes first, apply second",
      "5. What's the input size? (sieve for all primes up to n vs primality test for single number)",
    ],
    decisionFramework: "Rotate matrix → transpose then reverse rows (CW) or reverse rows then transpose (CCW). Spiral traversal → 4 boundaries, shrink after each side. Zero matrix → two-pass: record then zero. Check prime up to n → Sieve of Eratosthenes. Check single prime → trial division up to √n. Fast power → recursive x^(n/2) squaring.",
    problems: [
      { id: "roman-to-integer", title: "Roman to Integer", difficulty: "Easy", difficultyScore: 3, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/roman-to-integer/", hasVisualization: true, tags: ["Hash Map", "Math", "String"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "happy-number", title: "Happy Number", difficulty: "Easy", difficultyScore: 4, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/happy-number/", hasVisualization: true, tags: ["Hash Set", "Math", "Two Pointers"], companies: ["Amazon"], frequency: "Medium" },
      { id: "plus-one", title: "Plus One", difficulty: "Easy", difficultyScore: 3, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/plus-one/", hasVisualization: true, tags: ["Array", "Math"], companies: ["Amazon", "Google"], frequency: "Medium" },
      { id: "rotate-image", title: "Rotate Image", difficulty: "Medium", difficultyScore: 6, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/rotate-image/", hasVisualization: true, tags: ["Array", "Math", "Matrix"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "spiral-matrix", title: "Spiral Matrix", difficulty: "Medium", difficultyScore: 6, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/", hasVisualization: true, tags: ["Array", "Matrix", "Simulation"], companies: ["Amazon", "Microsoft", "Google"], frequency: "High" },
      { id: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "Medium", difficultyScore: 6, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/", hasVisualization: true, tags: ["Array", "Hash Table", "Matrix"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "pow-x-n", title: "Pow(x, n)", difficulty: "Medium", difficultyScore: 6, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/powx-n/", hasVisualization: true, tags: ["Math", "Recursion", "Fast Power"], companies: ["Google", "Facebook"], frequency: "High" },
      { id: "multiply-strings", title: "Multiply Strings", difficulty: "Medium", difficultyScore: 7, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/multiply-strings/", hasVisualization: true, tags: ["Math", "String", "Simulation"], companies: ["Amazon", "Facebook"], frequency: "Medium" },
      { id: "count-primes", title: "Count Primes", difficulty: "Medium", difficultyScore: 6, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/count-primes/", hasVisualization: true, tags: ["Math", "Enumeration", "Number Theory"], companies: ["Amazon"], frequency: "Medium" },
      { id: "detect-squares", title: "Detect Squares", difficulty: "Medium", difficultyScore: 7, pattern: "math-geometry", leetcodeUrl: "https://leetcode.com/problems/detect-squares/", hasVisualization: true, tags: ["Array", "Hash Table", "Design", "Counting"], companies: [], frequency: "Low" },
    ]
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    description: "Bit manipulation operates directly on binary representations, giving O(1) or O(log n) solutions to problems that would otherwise require O(n) or O(n²). Key operations: XOR cancels duplicate pairs (a^a=0, a^0=a), AND extracts specific bits (n & 1 checks odd/even, n & (n-1) clears lowest set bit), OR sets bits, shifts multiply/divide by powers of 2. These tricks are memory-efficient and cache-friendly.",
    coreIntuition: "XOR's cancellation property is the basis for finding the single number among pairs. n & (n-1) clears the lowest set bit — counting how many times this takes to reach 0 gives the bit count. For counting bits up to n, use DP: dp[i] = dp[i >> 1] + (i & 1) — the bit count of i equals the bit count of i/2 plus whether i is odd. Power of 2 check: n > 0 && (n & (n-1)) == 0.",
    recognitionSignals: [
      "Find single number among pairs (XOR trick)",
      "Count set bits / Hamming weight",
      "Missing number in range 0..n",
      "Check if number is power of 2",
      "Reverse all 32 bits",
      "Counting bits 0..n (DP with bit shift)",
      "Sum without arithmetic operators",
      "Any O(1) manipulation on numeric properties"
    ],
    template: `// XOR — find single number
int single = 0;
for (int x : nums) single ^= x;
return single; // pairs cancel, single survives

// Count set bits (Brian Kernighan)
int count = 0;
while (n) { n &= (n-1); count++; } // clears lowest set bit each time
return count;

// Counting bits up to n — O(n) DP
vector<int> dp(n+1);
for (int i = 1; i <= n; i++)
    dp[i] = dp[i >> 1] + (i & 1);

// Sum without + (bit addition)
while (b) {
    int carry = (a & b) << 1;
    a ^= b; b = carry;
}
return a;`,
    timeComplexity: "O(1) or O(n) depending on operation",
    spaceComplexity: "O(1) for most bit tricks",
    realWorldAnalogy: "Light switches. XOR = toggle — flip twice, back to original. AND = 'are BOTH switches on?' OR = 'is EITHER switch on?' Left shift = multiply by 2 (adding a zero at the end in binary).",
    icon: "Binary",
    color: "slate",
    keyInsights: [
      "XOR fundamental properties: a^0=a (identity), a^a=0 (self-inverse), commutative+associative → order doesn't matter",
      "n & (n-1) clears the lowest set bit — loop counting how many times this reaches 0 = popcount",
      "n & (-n) isolates the lowest set bit (two's complement: -n = ~n+1)",
      "Power of 2: exactly ONE bit set → n & (n-1) == 0 (removes the only bit, leaving 0)",
      "Sum without +: use XOR for addition without carry, AND shifted left for carry. Iterate until carry is 0.",
    ],
    commonMistakes: [
      "Reverse bits: using arithmetic right shift (>>) which sign-extends — use unsigned right shift or cast to unsigned",
      "Sum of two integers: forgetting that in C++ / most languages, must handle carry as UNSIGNED to avoid infinite loop on negatives",
      "Counting bits DP: dp[i] = dp[i>>1] + (i&1) NOT dp[i/2] + (i%2) — same logic but >> and & are faster",
      "Missing number: Gauss formula also works (n*(n+1)/2 - sum) but XOR approach is cleaner and handles large n without overflow",
      "Bitwise AND range: the common prefix of lo and hi (in binary) — shift both right until equal, then shift answer left",
    ],
    whenNotToUse: "Bit tricks are not always the right tool. If the problem can be solved with sorting or hash maps more clearly, prefer those for readability. Reserve bit manipulation for space-critical scenarios or when problem explicitly hints at it (XOR, set bits).",
    thinkingProcess: [
      "1. Does the problem involve pairs that cancel, or single values? → XOR",
      "2. Can I encode a set as a bitmask? (for small n ≤ 32)",
      "3. Is there a mathematical shortcut using n&(n-1) or n&(-n)?",
      "4. Can I use DP with bit shift? (counting bits: dp[i] = dp[i>>1] + LSB)",
      "5. Does the problem say 'without +' or 'O(1) space'? → Bit manipulation likely",
    ],
    decisionFramework: "Find single among pairs → XOR all elements. Count set bits → n&(n-1) loop or __builtin_popcount(). Missing in 0..n → XOR indices with values, or Gauss sum. Power of 2 → n>0 && (n&(n-1))==0. Sum without arithmetic → XOR+AND carry loop. Reverse 32 bits → process bit by bit.",
    problems: [
      { id: "single-number", title: "Single Number", difficulty: "Easy", difficultyScore: 3, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/single-number/", hasVisualization: true, tags: ["Array", "Bit Manipulation"], companies: ["Amazon"], frequency: "High" },
      { id: "number-1-bits", title: "Number of 1 Bits", difficulty: "Easy", difficultyScore: 3, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/", hasVisualization: true, tags: ["Bit Manipulation", "Divide & Conquer"], companies: ["Apple", "Microsoft"], frequency: "Medium" },
      { id: "counting-bits", title: "Counting Bits", difficulty: "Easy", difficultyScore: 4, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/counting-bits/", hasVisualization: true, tags: ["DP", "Bit Manipulation"], companies: ["Amazon"], frequency: "Medium" },
      { id: "reverse-bits", title: "Reverse Bits", difficulty: "Easy", difficultyScore: 4, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/reverse-bits/", hasVisualization: true, tags: ["Bit Manipulation", "Divide & Conquer"], companies: ["Apple"], frequency: "Medium" },
      { id: "missing-number", title: "Missing Number", difficulty: "Easy", difficultyScore: 3, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/missing-number/", hasVisualization: true, tags: ["Array", "Bit Manipulation", "Math", "Hash Table"], companies: ["Amazon", "Microsoft"], frequency: "High" },
      { id: "power-of-two", title: "Power of Two", difficulty: "Easy", difficultyScore: 3, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/power-of-two/", hasVisualization: true, tags: ["Math", "Bit Manipulation", "Recursion"], companies: ["Amazon"], frequency: "Medium" },
      { id: "sum-two-integers", title: "Sum of Two Integers", difficulty: "Medium", difficultyScore: 6, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/", hasVisualization: true, tags: ["Math", "Bit Manipulation"], companies: ["Amazon"], frequency: "Medium" },
      { id: "reverse-integer", title: "Reverse Integer", difficulty: "Medium", difficultyScore: 5, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/reverse-integer/", hasVisualization: false, tags: ["Math", "Bit Manipulation"], companies: ["Amazon", "Apple"], frequency: "Medium" },
      { id: "bitwise-and-numbers-range", title: "Bitwise AND of Numbers Range", difficulty: "Medium", difficultyScore: 6, pattern: "bit-manipulation", leetcodeUrl: "https://leetcode.com/problems/bitwise-and-of-numbers-range/", hasVisualization: true, tags: ["Bit Manipulation"], companies: ["Amazon"], frequency: "Medium" },
    ]
  },
  {
    id: "tries",
    title: "Tries",
    description: "A trie (prefix tree) stores strings by sharing common prefixes. Each node represents one character; a path from root to a leaf (or any isEnd node) spells a word. Insert, search, and startsWith all run in O(L) where L = word length, regardless of how many words are stored. Tries beat hash maps when you need prefix-based queries (autocomplete, 'does any word start with X?').",
    coreIntuition: "Picture the words 'apple', 'app', 'application' — they share the path a→p→p. The trie stores this path once. To insert: walk the path letter by letter, creating nodes as needed. To search: walk the path; if any character is missing, the word doesn't exist. To startsWith: same as search but don't require isEnd at the endpoint. Word Search II: combine trie with backtracking on the grid — prune when no word starts with current prefix.",
    recognitionSignals: [
      "Prefix matching or autocomplete",
      "'Does any word start with prefix X?'",
      "Wildcard search with '.' matching any char",
      "Word search in grid with a dictionary",
      "Replace words with their root prefix",
      "Find longest word that is a prefix of another",
      "Multiple string lookups by prefix"
    ],
    template: `struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        TrieNode* cur = root;
        for (char c : word) {
            if (!cur->children[c-'a'])
                cur->children[c-'a'] = new TrieNode();
            cur = cur->children[c-'a'];
        }
        cur->isEnd = true;
    }
    bool search(string word) {
        TrieNode* cur = root;
        for (char c : word) {
            if (!cur->children[c-'a']) return false;
            cur = cur->children[c-'a'];
        }
        return cur->isEnd;
    }
    bool startsWith(string prefix) { /* same but return true */ }
};`,
    timeComplexity: "O(L) per operation where L = word length",
    spaceComplexity: "O(total characters across all words × alphabet size)",
    realWorldAnalogy: "Autocomplete on your phone. Each keystroke narrows the trie path. 'ap' → shows 'apple', 'application', 'apt'. The shared prefix nodes are not duplicated — one 'a' and 'p' node serve all ap-words.",
    icon: "Network",
    color: "teal",
    keyInsights: [
      "Trie vs Hash Map: trie beats hash map for prefix queries — hash map can't efficiently find all words with prefix 'app'",
      "Array[26] children faster than unordered_map for lowercase alphabet — index = char - 'a'",
      "isEnd flag is SEPARATE from children — a node can be both an end AND have children (e.g., 'app' inside 'apple')",
      "Word Search II: prune entire branches when trie has no word starting with current path prefix → massive speedup",
      "Wildcard search ('.') in Add Search Words: at '.' node, try ALL 26 children recursively",
    ],
    commonMistakes: [
      "Forgetting isEnd flag: startsWith('apple') returns true even if 'apple' was never inserted (because child nodes exist)",
      "Memory leak: trie nodes are never freed in C++ — use smart pointers or delete explicitly",
      "Word Search II: not removing found words from trie → same word can be found multiple times",
      "Wildcard: iterating over all children but forgetting to check child is non-null before recursing",
      "Treating isEnd as 'no children' — wrong, intermediate nodes can have isEnd=true",
    ],
    whenNotToUse: "When all queries are exact matches (hash map is faster and simpler). When words are very short (overhead of trie not worth it). When character set is huge (hash map children more efficient than array[charset_size]).",
    thinkingProcess: [
      "1. Does the problem involve PREFIX queries? (startsWith, autocomplete, word search pruning) → Trie",
      "2. Is the character set small? (26 lowercase → array; general → hash map)",
      "3. Do I need to mark intermediate nodes (isEnd)?",
      "4. For grid + dictionary: build trie, DFS grid, prune when no word starts with current path",
      "5. For wildcard: at '.', try all valid children recursively",
    ],
    decisionFramework: "Implement prefix search → Trie with array[26] children + isEnd. Wildcard '.' → DFS over all children at '.' nodes. Replace with root → build trie, for each word scan forward until root prefix found. Word Search II → trie + grid DFS backtracking with prefix pruning.",
    problems: [
      { id: "implement-trie", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", difficultyScore: 6, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/", hasVisualization: true, tags: ["Trie", "Design", "Hash Table"], companies: ["Google", "Amazon", "Microsoft"], frequency: "High" },
      { id: "add-search-words", title: "Design Add and Search Words Data Structure", difficulty: "Medium", difficultyScore: 7, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", hasVisualization: true, tags: ["Trie", "DFS", "Backtracking", "Design"], companies: ["Facebook"], frequency: "Medium" },
      { id: "replace-words", title: "Replace Words", difficulty: "Medium", difficultyScore: 6, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/replace-words/", hasVisualization: false, tags: ["Trie", "Hash Table", "String"], companies: ["Uber"], frequency: "Medium" },
      { id: "longest-word-dictionary", title: "Longest Word in Dictionary", difficulty: "Medium", difficultyScore: 5, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/longest-word-in-dictionary/", hasVisualization: false, tags: ["Trie", "Hash Table", "Sorting"], companies: ["Google"], frequency: "Low" },
      { id: "index-pairs-string", title: "Index Pairs of a String", difficulty: "Easy", difficultyScore: 4, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/index-pairs-of-a-string/", hasVisualization: false, tags: ["Trie", "String", "Sorting"], companies: [], frequency: "Low" },
      { id: "word-search-ii", title: "Word Search II", difficulty: "Hard", difficultyScore: 10, pattern: "tries", leetcodeUrl: "https://leetcode.com/problems/word-search-ii/", hasVisualization: true, tags: ["Trie", "Backtracking", "Matrix", "DFS"], companies: ["Amazon", "Airbnb"], frequency: "High" },
    ]
  },
  {
    id: "advanced-graphs",
    title: "Advanced Graphs",
    description: "Advanced graph algorithms handle weighted edges, minimum spanning trees, and complex traversal orders. Dijkstra finds shortest paths with non-negative weights using a min-heap. Bellman-Ford handles negative weights (but not negative cycles). Prim/Kruskal build minimum spanning trees. Hierholzer finds Eulerian paths. Understanding when each algorithm applies is key: weighted → Dijkstra; K-stop constraint → Bellman-Ford variant; connect all → MST.",
    coreIntuition: "Dijkstra is greedy BFS with a priority queue — always expand the currently cheapest known node. This greedy choice is safe because all edge weights are non-negative. For K-stop flights, use Bellman-Ford with exactly K+1 relaxation rounds (not Dijkstra, which can't enforce hop limit). For MST: Kruskal sorts edges by weight and uses Union-Find; Prim starts from any node and greedily adds cheapest edge to unvisited node.",
    recognitionSignals: [
      "Shortest path with non-negative weights (Dijkstra)",
      "Shortest path with K hops limit (Bellman-Ford)",
      "Minimum spanning tree — connect all nodes cheaply",
      "Reconstruct itinerary — Eulerian path",
      "Alien dictionary — topological sort from constraints",
      "Probability / maximum path weight (modified Dijkstra)",
      "Evaluate system of equations (graph of ratios)",
      "Swim in rising water — binary search + BFS/DFS"
    ],
    template: `// Dijkstra — shortest paths from src
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
vector<int> dist(n, INT_MAX);
dist[src] = 0; pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue; // stale entry
    for (auto [v, w] : adj[u])
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
}

// Bellman-Ford — K relaxation rounds
vector<int> prices(n, INT_MAX); prices[src] = 0;
for (int i = 0; i < K+1; i++) {
    auto tmp = prices;
    for (auto [u, v, w] : flights)
        if (prices[u] != INT_MAX)
            tmp[v] = min(tmp[v], prices[u] + w);
    prices = tmp;
}`,
    timeComplexity: "O((V+E) log V) Dijkstra; O(V*E) Bellman-Ford; O(E log E) Kruskal",
    spaceComplexity: "O(V + E)",
    realWorldAnalogy: "GPS with traffic. Dijkstra = always take currently fastest route. K-stop flights = Bellman-Ford exploring exactly K hops. MST = laying minimum cable to connect all houses in a neighborhood.",
    icon: "GitMerge",
    color: "pink",
    keyInsights: [
      "Dijkstra requires NON-NEGATIVE edge weights — with negative edges it gives wrong answers. Use Bellman-Ford instead.",
      "Dijkstra key insight: once a node is popped from min-heap, its shortest distance is FINALIZED (greedy proof)",
      "Handle stale entries in heap: check if popped distance > recorded distance → skip (lazy deletion)",
      "Bellman-Ford K-stops: run exactly K+1 relaxation rounds. Use COPY of distances each round to prevent using edges twice in one round.",
      "MST Prim vs Kruskal: Prim grows from a single node (better for dense graphs), Kruskal picks globally cheapest edges (better for sparse graphs)",
    ],
    commonMistakes: [
      "Dijkstra with negative edges → wrong answer. Always check if problem guarantees non-negative weights.",
      "Cheapest Flights: using regular Dijkstra (can't enforce K-stop limit). Must use Bellman-Ford with exactly K+1 rounds.",
      "Bellman-Ford without COPY: reading updated distances in same round allows multi-hop in one iteration.",
      "Reconstruct Itinerary: sorting neighbors lexicographically, then doing Hierholzer's DFS. Forgetting to add node to result AFTER all neighbors processed (not before).",
      "Prim's MST: not checking if neighbor is already in MST before adding to heap.",
    ],
    whenNotToUse: "When graph is unweighted (use BFS for shortest path). When you only need connectivity (use Union-Find or DFS). When there are negative cycles (problem becomes undefined — Bellman-Ford detects but can't solve).",
    thinkingProcess: [
      "1. Are edge weights present? → Yes → Advanced graphs. No → BFS/DFS.",
      "2. Shortest path with non-negative weights? → Dijkstra.",
      "3. Shortest path with K-hop limit? → Bellman-Ford K rounds.",
      "4. Connect all nodes with minimum cost? → Kruskal (sort edges + Union-Find) or Prim (min-heap).",
      "5. Reconstruct a path using all edges? → Eulerian path (Hierholzer's algorithm).",
    ],
    decisionFramework: "Shortest path non-negative → Dijkstra with min-heap. Shortest path K stops → Bellman-Ford K rounds with copy. All-pairs shortest → Floyd-Warshall O(V³). MST → Kruskal (sort+UF) or Prim (min-heap). Eulerian path → Hierholzer's DFS. Topological order with weights → Bellman-Ford on DAG.",
    problems: [
      { id: "network-delay-time", title: "Network Delay Time", difficulty: "Medium", difficultyScore: 7, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/network-delay-time/", hasVisualization: true, tags: ["Graph", "Dijkstra", "Bellman-Ford", "BFS", "DFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "min-cost-connect-points", title: "Min Cost to Connect All Points", difficulty: "Medium", difficultyScore: 7, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/min-cost-to-connect-all-points/", hasVisualization: true, tags: ["Array", "Union Find", "MST", "Prim"], companies: ["Amazon"], frequency: "Medium" },
      { id: "cheapest-flights", title: "Cheapest Flights Within K Stops", difficulty: "Medium", difficultyScore: 8, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", hasVisualization: true, tags: ["Graph", "Bellman-Ford", "BFS", "Dijkstra", "DP"], companies: ["Amazon"], frequency: "Medium" },
      { id: "path-max-probability", title: "Path with Maximum Probability", difficulty: "Medium", difficultyScore: 7, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/path-with-maximum-probability/", hasVisualization: true, tags: ["Graph", "Dijkstra", "BFS"], companies: ["Amazon"], frequency: "Medium" },
      { id: "evaluate-division", title: "Evaluate Division", difficulty: "Medium", difficultyScore: 7, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/evaluate-division/", hasVisualization: true, tags: ["Graph", "DFS", "BFS", "Union Find"], companies: ["Google", "Facebook"], frequency: "Medium" },
      { id: "reconstruct-itinerary", title: "Reconstruct Itinerary", difficulty: "Hard", difficultyScore: 8, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/reconstruct-itinerary/", hasVisualization: true, tags: ["DFS", "Graph", "Eulerian Path"], companies: ["Airbnb", "Google"], frequency: "Medium" },
      { id: "swim-rising-water", title: "Swim in Rising Water", difficulty: "Hard", difficultyScore: 9, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/swim-in-rising-water/", hasVisualization: false, tags: ["Array", "Dijkstra", "Union Find", "Binary Search"], companies: ["Google"], frequency: "Low" },
      { id: "alien-dictionary", title: "Alien Dictionary", difficulty: "Hard", difficultyScore: 9, pattern: "advanced-graphs", leetcodeUrl: "https://leetcode.com/problems/alien-dictionary/", hasVisualization: true, tags: ["String", "Graph", "Topological Sort"], companies: ["Facebook", "Airbnb", "Google"], frequency: "High" },
    ]
  },
];

export const getAllProblems = (): Problem[] =>
  PATTERNS.flatMap(p => p.problems);

export const getPatternById = (id: string): Pattern | undefined =>
  PATTERNS.find(p => p.id === id);

export const getProblemById = (id: string): Problem | undefined =>
  getAllProblems().find(p => p.id === id);

export const getTotalProblems = () => getAllProblems().length;
export const getTotalPatterns = () => PATTERNS.length;
