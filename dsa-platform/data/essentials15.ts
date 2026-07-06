// Curated "15-Day Essentials" — the non-negotiable set for a 30 LPA fresher
// interview (MSRIT-style drives: Amazon, Microsoft, Google, Flipkart, De Shaw…).
// 122 DSA problems + deep SE + deep SD. The 15-day intensive plan schedules
// ONLY these so 12 hr/day is realistic instead of an impossible full-syllabus cram.

// 122 must-do DSA problems, pattern-wise (ids match data/problems.ts).
export const ESSENTIAL_DSA: string[] = [
  // Arrays & Hashing (7)
  "two-sum", "valid-anagram", "group-anagrams", "top-k-frequent",
  "product-except-self", "longest-consecutive", "contains-duplicate",
  // Two Pointers (8)
  "valid-palindrome", "two-sum-ii", "three-sum", "container-water", "trapping-rain-water",
  "remove-duplicates-ii", "merge-sorted-array", "next-permutation",
  // Sliding Window (7)
  "best-time-stock", "longest-substring", "longest-repeating-replacement", "min-window-substring",
  "fruit-into-baskets", "max-consecutive-ones-iii", "subarray-product-less-k",
  // Prefix Sum (3)
  "subarray-sum-equals-k", "find-pivot-index", "subarray-sums-divisible-k",
  // Stack (6)
  "valid-parentheses", "min-stack", "daily-temperatures", "largest-rectangle-histogram", "reverse-polish",
  "implement-queue-using-stacks",
  // Binary Search (9)
  "binary-search", "search-rotated", "find-min-rotated", "koko-bananas", "find-first-last-position", "median-two-sorted",
  "find-peak-element", "capacity-ship-packages", "split-array-largest-sum",
  // Linked List (9)
  "reverse-linked-list", "merge-two-sorted", "linked-list-cycle", "remove-nth-node",
  "reorder-list", "copy-list-random", "lru-cache", "merge-k-sorted", "reverse-linked-list-ii",
  // Trees (16)
  "invert-binary-tree", "max-depth-tree", "diameter-tree", "subtree-of-another",
  "lowest-common-ancestor", "level-order-traversal", "right-side-view", "validate-bst",
  "kth-smallest-bst", "construct-tree-preorder", "serialize-deserialize", "max-path-sum",
  "zigzag-level-order", "path-sum-ii", "vertical-order-traversal", "boundary-traversal-tree",
  // Heap (4)
  "kth-largest-array", "k-closest-points", "task-scheduler", "find-median-stream",
  // Backtracking (6)
  "subsets", "combination-sum", "permutations", "word-search", "palindrome-partitioning", "n-queens",
  // Graphs (9)
  "number-of-islands", "clone-graph", "max-area-island", "pacific-atlantic", "rotting-oranges",
  "course-schedule", "course-schedule-ii", "num-connected-components", "word-ladder",
  // Dynamic Programming (16)
  "climbing-stairs", "house-robber", "house-robber-ii", "coin-change", "longest-increasing-subsequence",
  "word-break", "max-product-subarray", "longest-palindromic-substr", "unique-paths",
  "longest-common-subsequence", "edit-distance", "partition-equal-subset",
  "01-knapsack", "matrix-chain-multiplication", "best-time-stock-iii", "best-time-stock-iv",
  // Greedy (4)
  "max-subarray", "jump-game", "jump-game-ii", "gas-station",
  // Intervals (4)
  "insert-interval", "merge-intervals", "non-overlapping-intervals", "meeting-rooms-ii",
  // Bit Manipulation (5)
  "single-number", "number-1-bits", "counting-bits", "single-number-ii", "single-number-iii",
  // Tries (2)
  "implement-trie", "word-search-ii",
  // Math & Geometry (3)
  "rotate-image", "spiral-matrix", "set-matrix-zeroes",
  // Advanced Graphs (4)
  "network-delay-time", "min-cost-connect-points", "cheapest-flights", "alien-dictionary",
];

// Deep SE coverage — ids are `${subjectId}/${chapterId}` (match buildSETasks).
export const ESSENTIAL_SE: string[] = [
  // Operating Systems (12)
  "operating-systems/why-an-operating-system-exists",
  "operating-systems/os-architecture-kernel-modes-system-calls",
  "operating-systems/processes-states-the-pcb-context-switching",
  "operating-systems/threads-multithreading-models",
  "operating-systems/cpu-scheduling-algorithms",
  "operating-systems/inter-process-communication",
  "operating-systems/process-synchronization",
  "operating-systems/deadlocks",
  "operating-systems/memory-management",
  "operating-systems/page-replacement-algorithms",
  "operating-systems/file-systems",
  "operating-systems/linux-essentials-interview-focused",
  // DBMS (10)
  "dbms/er-modeling",
  "dbms/keys-and-constraints",
  "dbms/normalization",
  "dbms/sql-joins-subqueries-aggregation",
  "dbms/indexing",
  "dbms/transactions-acid-properties",
  "dbms/concurrency-control",
  "dbms/isolation-levels-anomalies",
  "dbms/storage-and-file-organization",
  "dbms/recovery-and-logging",
  // Computer Networks (9)
  "computer-networks/why-networking-is-layered",
  "computer-networks/addressing-mac-ip-subnetting",
  "computer-networks/transport-layer-tcp-vs-udp",
  "computer-networks/dns-domain-name-system",
  "computer-networks/http-and-https",
  "computer-networks/what-happens-when-you-type-a-url",
  "computer-networks/routing-basics",
  "computer-networks/security-essentials",
  "computer-networks/sockets",
  // OOP (9)
  "oop/classes-objects-why-oop-exists",
  "oop/encapsulation",
  "oop/abstraction",
  "oop/inheritance",
  "oop/polymorphism",
  "oop/constructors-destructors-rule-of-three-five",
  "oop/operator-overloading",
  "oop/solid-design-principles",
  "oop/common-design-patterns",
  // Concurrency (7)
  "concurrency/threads-processes",
  "concurrency/mutex-semaphore",
  "concurrency/producer-consumer",
  "concurrency/dining-philosophers",
  "concurrency/thread-pool",
  "concurrency/deadlock-detection",
  "concurrency/async-programming",
  // Linux & SE fundamentals (4)
  "linux-se/complexity-analysis-big-o",
  "linux-se/git-and-version-control",
  "linux-se/testing",
  "linux-se/system-design-basics",
];

// Deep SD coverage — concept + case-study ids (match buildSDTasks).
export const ESSENTIAL_SD: string[] = [
  // Foundations (17)
  "scalability", "availability", "latency-vs-throughput", "load-balancing", "caching",
  "cdn", "database-indexing", "replication", "sharding", "cap-theorem", "acid-vs-base",
  "message-queues", "microservices-vs-monolith", "api-gateway", "rate-limiting",
  "security-authn-authz", "api-styles",
  // Databases in depth (6)
  "relational-vs-nosql", "nosql-types", "oltp-vs-olap", "transactions-isolation",
  "replication-strategies", "sharding-strategies",
  // Networking (6)
  "osi-model", "tcp-udp-quic", "http-versions", "tls-handshake", "dns-resolution", "connection-pooling",
  // Interview framework (6)
  "45-minute-clock", "clarify-requirements", "back-of-envelope", "api-data-model",
  "high-level-architecture", "red-flags",
  // Cheat-sheets & mental models — the tactical shortcuts that make 15 days enough (6)
  "repeatable-model", "numbers-to-know", "patterns-by-problem",
  "what-breaks-first", "decision-matrix", "question-types",
  // Case studies — do these end to end (2)
  "url-shortener", "rate-limiter-system",
];

export const ESSENTIAL_DSA_SET = new Set(ESSENTIAL_DSA);
export const ESSENTIAL_SE_SET = new Set(ESSENTIAL_SE);
export const ESSENTIAL_SD_SET = new Set(ESSENTIAL_SD);
