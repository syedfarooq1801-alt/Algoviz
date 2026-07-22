// Maps problem ID -> sub-family label, one level finer than the broad pattern
// (e.g. "Dynamic Programming") but coarser than the per-problem technique in
// problemTechniques.ts (which is close to 1:1 per problem). Used purely to
// order problems WITHIN a pattern in the study plan so that genuine "twin"
// problems (same sub-technique, different twist) land next to each other in
// the schedule instead of being scattered — solving one right after the
// other is what builds transfer instead of memorized-per-problem recall.
//
// Missing an entry is harmless: those problems just keep their original
// curriculum order and sort after any labeled sub-families in their pattern.
export const PROBLEM_SUBGROUPS: Record<string, string> = {
  // Dynamic programming — linear recurrence dp[i] from a small fixed window
  "climbing-stairs": "Linear Recurrence DP",
  "min-cost-climbing": "Linear Recurrence DP",
  "nth-tribonacci": "Linear Recurrence DP",
  "house-robber": "Linear Recurrence DP",
  "house-robber-ii": "Linear Recurrence DP",
  "jump-game-vii": "Linear Recurrence DP",

  // Dynamic programming — 2D grid path dp
  "unique-paths": "2D Grid Path DP",
  "minimum-path-sum": "2D Grid Path DP",
  triangle: "2D Grid Path DP",
  "longest-increasing-path-matrix": "2D Grid Path DP",

  // Dynamic programming — subset-sum / knapsack family
  "coin-change": "Subset-Sum Knapsack",
  "coin-change-ii": "Subset-Sum Knapsack",
  "target-sum": "Subset-Sum Knapsack",
  "01-knapsack": "Subset-Sum Knapsack",
  "partition-equal-subset": "Subset-Sum Knapsack",

  // Dynamic programming — two-string dp[i][j]
  "longest-common-subsequence": "Two-String DP",
  "edit-distance": "Two-String DP",
  "distinct-subsequences": "Two-String DP",
  "interleaving-string": "Two-String DP",

  // Dynamic programming — stock state-machine dp
  "best-time-stock-iii": "Stock State Machine",
  "best-time-stock-iv": "Stock State Machine",
  "buy-sell-cooldown": "Stock State Machine",

  // Dynamic programming — palindrome expand/dp
  "longest-palindromic-substr": "Palindrome Expand DP",
  "palindromic-substrings": "Palindrome Expand DP",

  // Dynamic programming — count ways to segment a sequence
  "decode-ways": "Sequence Segmentation DP",
  "word-break": "Sequence Segmentation DP",

  // Dynamic programming — interval dp
  "stone-game": "Interval DP",
  "burst-balloons": "Interval DP",
  "matrix-chain-multiplication": "Interval DP",

  // Tries — trie build + prefix lookup
  "implement-trie": "Trie Build + Prefix Lookup",
  "add-search-words": "Trie Build + Prefix Lookup",
  "replace-words": "Trie Build + Prefix Lookup",
  "longest-word-dictionary": "Trie Build + Prefix Lookup",

  // Intervals — interval overlap counting
  "meeting-rooms": "Interval Overlap Counting",
  "meeting-rooms-ii": "Interval Overlap Counting",

  // Intervals — sort + merge/sweep intervals
  "insert-interval": "Sort + Merge Intervals",
  "merge-intervals": "Sort + Merge Intervals",
  "non-overlapping-intervals": "Sort + Merge Intervals",

  // Heap — top-k via heap
  "kth-largest-stream": "Top-K Via Heap",
  "kth-largest-array": "Top-K Via Heap",
  "k-closest-points": "Top-K Via Heap",

  // Heap — two-heap / k-way merge with heap
  "find-median-stream": "K-Way Merge Heap",
  "smallest-range-k-lists": "K-Way Merge Heap",

  // Trees — DFS returns a combinable size/depth value up
  "max-depth-tree": "DFS Combinable Depth",
  "min-depth-tree": "DFS Combinable Depth",
  "diameter-tree": "DFS Combinable Depth",
  "balanced-tree": "DFS Combinable Depth",

  // Trees — DFS structural comparison of two trees
  "same-tree": "DFS Structural Comparison",
  "symmetric-tree": "DFS Structural Comparison",
  "subtree-of-another": "DFS Structural Comparison",

  // Trees — DFS with root-to-leaf accumulator
  "path-sum": "Root-To-Leaf Path DFS",
  "path-sum-ii": "Root-To-Leaf Path DFS",
  "binary-tree-paths": "Root-To-Leaf Path DFS",

  // Trees — BFS level-by-level with a queue
  "level-order-traversal": "BFS Level Order",
  "right-side-view": "BFS Level Order",
  "average-of-levels": "BFS Level Order",
  "zigzag-level-order": "BFS Level Order",
  "boundary-traversal-tree": "BFS Level Order",
  "vertical-order-traversal": "BFS Level Order",

  // Trees — BST property (ordering) exploited during traversal
  "validate-bst": "BST Property Traversal",
  "kth-smallest-bst": "BST Property Traversal",
  "lowest-common-ancestor": "BST Property Traversal",

  // Trees — DFS returns local value up while tracking a separate global best
  "max-path-sum": "DFS Local + Global Best",
  "maximum-sum-bst": "DFS Local + Global Best",

  // Graphs — grid flood-fill DFS/BFS
  "number-of-islands": "Grid Flood Fill",
  "max-area-island": "Grid Flood Fill",
  "pacific-atlantic": "Grid Flood Fill",
  "surrounded-regions": "Grid Flood Fill",
  "walls-gates": "Grid Flood Fill",

  // Graphs — multi-source BFS shortest-step spread
  "rotting-oranges": "Multi-Source BFS",
  "word-ladder": "Multi-Source BFS",

  // Graphs — cycle detection + topological order on directed graph
  "course-schedule": "Topological Sort Cycle Detection",
  "course-schedule-ii": "Topological Sort Cycle Detection",

  // Graphs — union-find / connectivity
  "find-path-exists": "Union-Find Connectivity",
  "graph-valid-tree": "Union-Find Connectivity",
  "num-connected-components": "Union-Find Connectivity",
  "redundant-connection": "Union-Find Connectivity",

  // Advanced graphs — Dijkstra/priority-queue shortest path variants
  "network-delay-time": "Dijkstra Priority Queue",
  "cheapest-flights": "Dijkstra Priority Queue",
  "path-max-probability": "Dijkstra Priority Queue",
  "shortest-path-obstacle": "Dijkstra Priority Queue",

  // Advanced graphs — MST / binary-search-on-answer over a graph
  "min-cost-connect-points": "MST Binary Search Answer",
  "swim-rising-water": "MST Binary Search Answer",

  // Linked list — pointer rewiring in place
  "reverse-linked-list": "Pointer Rewiring In Place",
  "reverse-linked-list-ii": "Pointer Rewiring In Place",
  "reverse-k-group": "Pointer Rewiring In Place",
  "swap-pairs": "Pointer Rewiring In Place",

  // Linked list — fast/slow two-pointer on a list
  "linked-list-cycle": "Fast/Slow List Pointer",
  "find-duplicate-number": "Fast/Slow List Pointer",
  "palindrome-linked-list": "Fast/Slow List Pointer",
  "remove-nth-node": "Fast/Slow List Pointer",

  // Linked list — merge sorted lists
  "merge-two-sorted": "Merge Sorted Lists",
  "merge-k-sorted": "Merge Sorted Lists",

  // Linked list — hash map + doubly linked list design
  "lru-cache": "Hash Map + Doubly Linked List",
  "lfu-cache": "Hash Map + Doubly Linked List",

  // Two pointers — opposite-ends two pointer on sorted/symmetric structure
  "valid-palindrome": "Opposite-Ends Two Pointer",
  "two-sum-ii": "Opposite-Ends Two Pointer",
  "container-water": "Opposite-Ends Two Pointer",

  // Two pointers — write-pointer in-place compaction
  "move-zeroes": "Write-Pointer Compaction",
  "remove-duplicates": "Write-Pointer Compaction",
  "remove-duplicates-ii": "Write-Pointer Compaction",

  // Two pointers — sorted array + two-pointer with an extra dimension
  "three-sum": "Sorted Array Extra-Dimension Two Pointer",
  "trapping-rain-water": "Sorted Array Extra-Dimension Two Pointer",

  // Stack — monotonic stack for "next greater/collision" pattern
  "next-greater-element-i": "Monotonic Stack Next Greater",
  "next-greater-element-ii": "Monotonic Stack Next Greater",
  "daily-temperatures": "Monotonic Stack Next Greater",
  "car-fleet": "Monotonic Stack Next Greater",
  "asteroid-collision": "Monotonic Stack Next Greater",

  // Stack — monotonic stack for max-rectangle area
  "largest-rectangle-histogram": "Monotonic Stack Max Rectangle",
  "maximal-rectangle": "Monotonic Stack Max Rectangle",

  // Binary search — classic binary search on a sorted array
  "binary-search": "Classic Sorted-Array Binary Search",
  "first-bad-version": "Classic Sorted-Array Binary Search",
  "search-insert-position": "Classic Sorted-Array Binary Search",
  "find-first-last-position": "Classic Sorted-Array Binary Search",

  // Binary search — binary search on the answer (feasibility check)
  "koko-bananas": "Binary Search On Answer",
  "capacity-ship-packages": "Binary Search On Answer",
  "split-array-largest-sum": "Binary Search On Answer",

  // Binary search — binary search on a rotated sorted array
  "find-min-rotated": "Rotated Array Binary Search",
  "search-rotated": "Rotated Array Binary Search",

  // Bit manipulation — XOR/bit-counting to isolate the unique element(s)
  "single-number": "XOR Isolate Unique",
  "single-number-ii": "XOR Isolate Unique",
  "single-number-iii": "XOR Isolate Unique",

  // Bit manipulation — popcount / bit-counting
  "counting-bits": "Popcount Bit Counting",
  "number-1-bits": "Popcount Bit Counting",

  // Bit manipulation — digit/bit reversal
  "reverse-bits": "Digit/Bit Reversal",
  "reverse-integer": "Digit/Bit Reversal",

  // Arrays & hashing — frequency-count hash map
  "contains-duplicate": "Frequency-Count Hash Map",
  "valid-anagram": "Frequency-Count Hash Map",
  "ransom-note": "Frequency-Count Hash Map",

  // Arrays & hashing — hash map keyed lookup/grouping
  "two-sum": "Hash Map Keyed Lookup",
  "group-anagrams": "Hash Map Keyed Lookup",

  // Arrays & hashing — hash-set range/cyclic-sort trick over integers
  "longest-consecutive": "Hash-Set Integer Range Trick",
  "first-missing-positive": "Hash-Set Integer Range Trick",

  // Sliding window — variable window shrink on a violated constraint
  "longest-substring": "Variable Window Shrink",
  "longest-repeating-replacement": "Variable Window Shrink",
  "max-consecutive-ones-iii": "Variable Window Shrink",

  // Sliding window — window matching against a target frequency/subsequence
  "permutation-in-string": "Window Matching Target",
  "min-window-substring": "Window Matching Target",
  "minimum-window-subsequence": "Window Matching Target",

  // Sliding window — variable window with a running-count/product constraint
  "fruit-into-baskets": "Window Running Count Constraint",
  "subarray-product-less-k": "Window Running Count Constraint",

  // Math & geometry — in-place matrix traversal/transformation
  "rotate-image": "In-Place Matrix Transform",
  "spiral-matrix": "In-Place Matrix Transform",
  "set-matrix-zeroes": "In-Place Matrix Transform",

  // Greedy — greedy reachability/min-jumps over an array of ranges
  "jump-game": "Greedy Jump Reachability",
  "jump-game-ii": "Greedy Jump Reachability",

  // Greedy — greedy grouping using a last-seen/count map
  "hand-of-straights": "Greedy Grouping Via Map",
  "partition-labels": "Greedy Grouping Via Map",

  // Backtracking — backtracking subset generation (with/without duplicates)
  subsets: "Backtracking Subset Generation",
  "subsets-ii": "Backtracking Subset Generation",

  // Backtracking — backtracking combination generation with a target sum
  "combination-sum": "Backtracking Combination Sum",
  "combination-sum-ii": "Backtracking Combination Sum",
  "combination-sum-iii": "Backtracking Combination Sum",

  // Backtracking — backtracking full-arrangement generation
  permutations: "Backtracking Full Arrangement",
  "letter-combinations": "Backtracking Full Arrangement",

  // Backtracking — backtracking with a constraint-satisfaction grid
  "n-queens": "Backtracking Constraint Grid",
  "sudoku-solver": "Backtracking Constraint Grid",

  // Prefix sum — basic prefix-sum array build + query
  "running-sum-1d": "Basic Prefix Sum Build",
  "range-sum-query": "Basic Prefix Sum Build",
  "find-pivot-index": "Basic Prefix Sum Build",

  // Prefix sum — prefix-sum + hash map for subarray count/existence
  "subarray-sum-equals-k": "Prefix Sum Hash Map",
  "subarray-sums-divisible-k": "Prefix Sum Hash Map",
  "continuous-subarray-sum": "Prefix Sum Hash Map",

  // Prefix sum — difference-array technique
  "range-addition": "Difference Array Technique",
  "car-pooling": "Difference Array Technique",
};
