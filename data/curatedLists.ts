// Blind 75 and NeetCode 150 curated problem lists
// IDs must match data/problems.ts

export const BLIND_75: string[] = [
  // Arrays
  "two-sum", "best-time-stock", "contains-duplicate", "product-except-self",
  "max-subarray", "max-product-subarray", "find-min-rotated", "search-rotated",
  "three-sum", "container-water",
  // Bit Manipulation
  "sum-two-integers", "number-1-bits", "counting-bits", "missing-number", "reverse-bits",
  // Dynamic Programming
  "climbing-stairs", "coin-change", "longest-increasing-subsequence",
  "longest-common-subsequence", "word-break", "house-robber", "house-robber-ii",
  "decode-ways", "unique-paths", "jump-game",
  // Graphs
  "clone-graph", "course-schedule", "pacific-atlantic", "number-of-islands",
  "longest-consecutive", "alien-dictionary", "graph-valid-tree", "num-connected-components",
  // Intervals
  "insert-interval", "merge-intervals", "non-overlapping-intervals",
  "meeting-rooms", "meeting-rooms-ii",
  // Linked List
  "reverse-linked-list", "linked-list-cycle", "merge-two-sorted",
  "merge-k-sorted", "remove-nth-node", "reorder-list",
  // Matrix
  "set-matrix-zeroes", "spiral-matrix", "rotate-image", "word-search",
  // Strings
  "longest-substring", "longest-repeating-replacement", "min-window-substring",
  "valid-anagram", "group-anagrams", "valid-palindrome",
  "longest-palindromic-substr", "palindromic-substrings", "encode-decode-strings",
  // Trees
  "max-depth-tree", "same-tree", "invert-binary-tree", "max-path-sum",
  "level-order-traversal", "serialize-deserialize", "subtree-of-another",
  "construct-tree-preorder", "validate-bst", "kth-smallest-bst",
  "lowest-common-ancestor", "implement-trie", "add-search-words", "word-search-ii",
  // Heap
  "top-k-frequent", "find-median-stream",
  // Stack
  "valid-parentheses", "generate-parentheses",
];

export const NEETCODE_150: string[] = [
  ...BLIND_75,
  // Additional Arrays & Hashing
  "valid-sudoku", "ransom-note", "isomorphic-strings", "encode-decode-strings",
  // Additional Two Pointers
  "two-sum-ii", "move-zeroes", "is-subsequence", "trapping-rain-water",
  // Additional Sliding Window
  "permutation-in-string", "sliding-window-max", "max-points-cards",
  // Additional Stack
  "min-stack", "reverse-polish", "daily-temperatures", "car-fleet",
  "largest-rectangle-histogram", "decode-string", "asteroid-collision",
  // Additional Binary Search
  "binary-search", "first-bad-version", "search-insert-position",
  "koko-bananas", "time-based-key-value", "median-two-sorted",
  // Additional Linked List
  "copy-list-random", "add-two-numbers", "find-duplicate-number", "lru-cache",
  "reverse-k-group", "swap-pairs", "palindrome-linked-list",
  // Additional Trees
  "balanced-tree", "diameter-tree", "right-side-view",
  "count-good-nodes", "average-of-levels", "path-sum",
  // Additional Heap / Priority Queue
  "kth-largest-stream", "last-stone-weight", "k-closest-points",
  "task-scheduler", "design-twitter", "kth-largest-array",
  // Additional Backtracking
  "subsets", "combination-sum", "permutations", "subsets-ii",
  "combination-sum-ii", "palindrome-partitioning", "letter-combinations", "n-queens",
  // Additional Graphs
  "rotting-oranges", "course-schedule-ii", "surrounded-regions",
  "max-area-island", "find-path-exists", "all-paths-source-target",
  "word-ladder", "walls-gates", "num-connected-components",
  // Additional Advanced Graphs
  "reconstruct-itinerary", "min-cost-connect-points", "network-delay-time",
  "swim-rising-water", "cheapest-flights", "evaluate-division",
  "redundant-connection", "path-max-probability",
  // Additional 1D DP
  "min-cost-climbing", "palindromic-substrings", "partition-equal-subset",
  "max-product-subarray", "nth-tribonacci", "triangle",
  // Additional 2D DP
  "buy-sell-cooldown", "coin-change-ii", "target-sum", "interleaving-string",
  "longest-increasing-path-matrix", "distinct-subsequences",
  "edit-distance", "burst-balloons", "regular-expression-matching",
  "minimum-path-sum",
  // Additional Greedy
  "jump-game-ii", "gas-station", "hand-of-straights",
  "merge-triplets", "partition-labels", "valid-parenthesis-string",
  "lemonade-change",
  // Additional Intervals
  "min-interval-query",
  // Additional Math & Geometry
  "happy-number", "plus-one", "pow-x-n", "multiply-strings",
  "detect-squares", "reverse-integer", "roman-to-integer", "count-primes",
  // Additional Bit Manipulation
  "single-number", "power-of-two",
  // Additional Tries
  "replace-words", "longest-word-dictionary",
].filter((id, i, arr) => arr.indexOf(id) === i); // deduplicate

// Company-specific track definitions — curated problem IDs
export interface CompanyTrack {
  id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  focus: string[];   // key pattern areas
  problems: string[]; // problem IDs
}

export const COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: "google",
    label: "Google Track",
    color: "#4F8CFF",
    icon: "G",
    description: "Graph traversal, BFS/DFS, DP, and clean O(n log n) solutions. Google loves problems where the naive O(n²) must be optimized.",
    focus: ["Graphs", "Dynamic Programming", "Trees", "Sliding Window", "Binary Search"],
    problems: [
      // Arrays
      "product-except-self", "longest-consecutive", "max-subarray",
      // Graphs
      "number-of-islands", "course-schedule", "course-schedule-ii", "clone-graph",
      "pacific-atlantic", "word-ladder", "evaluate-division", "all-paths-source-target",
      // Trees
      "level-order-traversal", "serialize-deserialize", "max-path-sum",
      "construct-tree-preorder", "right-side-view", "count-good-nodes",
      // DP
      "longest-increasing-subsequence", "edit-distance", "word-break",
      "longest-common-subsequence", "burst-balloons", "decode-ways",
      // Sliding Window / String
      "min-window-substring", "longest-substring", "permutation-in-string",
      // Binary Search
      "search-rotated", "median-two-sorted", "koko-bananas",
      // Heap
      "merge-k-sorted", "find-median-stream", "k-closest-points",
    ],
  },
  {
    id: "meta",
    label: "Meta Track",
    color: "#2FBF71",
    icon: "M",
    description: "Arrays, hashing, two pointers, BFS on graphs. Meta focuses on speed and clean code — expect 2 problems with follow-ups.",
    focus: ["Arrays & Hashing", "Two Pointers", "BFS/DFS", "Trees", "Backtracking"],
    problems: [
      // Arrays & Hashing
      "two-sum", "three-sum", "group-anagrams", "top-k-frequent",
      "contains-duplicate", "product-except-self", "longest-consecutive",
      "valid-anagram", "max-subarray",
      // Two Pointers
      "valid-palindrome", "container-water", "trapping-rain-water",
      "move-zeroes", "is-subsequence",
      // Sliding Window
      "longest-substring", "min-window-substring", "permutation-in-string",
      // Trees
      "invert-binary-tree", "max-depth-tree", "level-order-traversal",
      "right-side-view", "lowest-common-ancestor", "diameter-tree",
      // Graphs
      "number-of-islands", "clone-graph", "rotting-oranges",
      // Backtracking
      "subsets", "combination-sum", "permutations", "letter-combinations",
      // Linked List
      "reverse-linked-list", "merge-two-sorted", "linked-list-cycle",
      "copy-list-random", "add-two-numbers",
    ],
  },
  {
    id: "amazon",
    label: "Amazon Track",
    color: "#F5A524",
    icon: "A",
    description: "DP, trees, graphs, system design thinking in code. Amazon tests breadth — be solid across all patterns.",
    focus: ["Dynamic Programming", "Trees", "Graphs", "Heap", "Sliding Window"],
    problems: [
      // Arrays
      "two-sum", "max-subarray", "product-except-self", "trapping-rain-water",
      "three-sum", "container-water",
      // Linked List
      "reverse-linked-list", "merge-two-sorted", "lru-cache",
      "copy-list-random", "add-two-numbers",
      // Trees
      "level-order-traversal", "max-depth-tree", "validate-bst",
      "construct-tree-preorder", "serialize-deserialize", "lowest-common-ancestor",
      // Graphs
      "number-of-islands", "course-schedule", "rotting-oranges",
      "word-ladder", "num-connected-components",
      // DP
      "climbing-stairs", "house-robber", "coin-change", "word-break",
      "longest-increasing-subsequence", "partition-equal-subset", "decode-ways",
      // Heap
      "merge-k-sorted", "top-k-frequent", "k-closest-points", "task-scheduler",
      // Sliding Window
      "min-window-substring", "longest-substring", "sliding-window-max",
      // Binary Search
      "search-rotated", "search-2d-matrix", "koko-bananas",
    ],
  },
  {
    id: "microsoft",
    label: "Microsoft Track",
    color: "#06b6d4",
    icon: "MS",
    description: "Trees, linked lists, DP, and design. Microsoft interviews tend to be more structured with clearer problem statements.",
    focus: ["Trees", "Linked Lists", "Dynamic Programming", "Design", "Binary Search"],
    problems: [
      // Arrays
      "two-sum", "max-subarray", "rotate-image", "spiral-matrix",
      "set-matrix-zeroes", "product-except-self",
      // Linked List
      "reverse-linked-list", "merge-two-sorted", "linked-list-cycle",
      "remove-nth-node", "reorder-list", "lru-cache", "reverse-k-group",
      // Trees
      "invert-binary-tree", "max-depth-tree", "level-order-traversal",
      "validate-bst", "construct-tree-preorder", "serialize-deserialize",
      "lowest-common-ancestor", "path-sum",
      // DP
      "climbing-stairs", "house-robber", "coin-change", "longest-common-subsequence",
      "edit-distance", "word-break", "unique-paths",
      // Binary Search
      "binary-search", "search-2d-matrix", "find-min-rotated",
      // Graphs
      "number-of-islands", "course-schedule",
      // Stack
      "valid-parentheses", "min-stack", "daily-temperatures",
    ],
  },
  {
    id: "apple",
    label: "Apple Track",
    color: "#a855f7",
    icon: "Ap",
    description: "Deep expertise required. Expect edge case drilling, clean Swift/Python, and questions around optimization and memory.",
    focus: ["Arrays", "Trees", "Strings", "DP", "Design"],
    problems: [
      // Arrays
      "two-sum", "three-sum", "container-water", "trapping-rain-water",
      "max-subarray", "rotate-image",
      // Strings
      "longest-substring", "valid-palindrome", "group-anagrams",
      "longest-palindromic-substr", "encode-decode-strings",
      // Trees
      "invert-binary-tree", "max-depth-tree", "level-order-traversal",
      "serialize-deserialize", "lowest-common-ancestor", "diameter-tree",
      // Linked List
      "reverse-linked-list", "merge-two-sorted", "lru-cache",
      // DP
      "climbing-stairs", "house-robber", "coin-change", "word-break",
      "unique-paths", "longest-increasing-subsequence",
      // Binary Search
      "median-two-sorted", "search-rotated",
      // Graph
      "number-of-islands", "course-schedule",
    ],
  },
];
