// Curated "15-Day Essentials" — the non-negotiable set for a 30 LPA fresher
// interview (MSRIT-style drives: Amazon, Microsoft, Google, Flipkart, De Shaw…).
// 101 DSA problems + deep SE + deep SD. The 15-day intensive plan schedules
// ONLY these so 12 hr/day is realistic instead of an impossible full-syllabus cram.

// 101 must-do DSA problems, pattern-wise (ids match data/problems.ts).
export const ESSENTIAL_DSA: string[] = [
  // Arrays & Hashing (7)
  "two-sum", "valid-anagram", "group-anagrams", "top-k-frequent",
  "product-except-self", "longest-consecutive", "contains-duplicate",
  // Two Pointers (5)
  "valid-palindrome", "two-sum-ii", "three-sum", "container-water", "trapping-rain-water",
  // Sliding Window (4)
  "best-time-stock", "longest-substring", "longest-repeating-replacement", "min-window-substring",
  // Prefix Sum (3)
  "subarray-sum-equals-k", "find-pivot-index", "subarray-sums-divisible-k",
  // Stack (5)
  "valid-parentheses", "min-stack", "daily-temperatures", "largest-rectangle-histogram", "reverse-polish",
  // Binary Search (6)
  "binary-search", "search-rotated", "find-min-rotated", "koko-bananas", "find-first-last-position", "median-two-sorted",
  // Linked List (8)
  "reverse-linked-list", "merge-two-sorted", "linked-list-cycle", "remove-nth-node",
  "reorder-list", "copy-list-random", "lru-cache", "merge-k-sorted",
  // Trees (12)
  "invert-binary-tree", "max-depth-tree", "diameter-tree", "subtree-of-another",
  "lowest-common-ancestor", "level-order-traversal", "right-side-view", "validate-bst",
  "kth-smallest-bst", "construct-tree-preorder", "serialize-deserialize", "max-path-sum",
  // Heap (4)
  "kth-largest-array", "k-closest-points", "task-scheduler", "find-median-stream",
  // Backtracking (6)
  "subsets", "combination-sum", "permutations", "word-search", "palindrome-partitioning", "n-queens",
  // Graphs (9)
  "number-of-islands", "clone-graph", "max-area-island", "pacific-atlantic", "rotting-oranges",
  "course-schedule", "course-schedule-ii", "num-connected-components", "word-ladder",
  // Dynamic Programming (12)
  "climbing-stairs", "house-robber", "house-robber-ii", "coin-change", "longest-increasing-subsequence",
  "word-break", "max-product-subarray", "longest-palindromic-substr", "unique-paths",
  "longest-common-subsequence", "edit-distance", "partition-equal-subset",
  // Greedy (4)
  "max-subarray", "jump-game", "jump-game-ii", "gas-station",
  // Intervals (4)
  "insert-interval", "merge-intervals", "non-overlapping-intervals", "meeting-rooms-ii",
  // Bit Manipulation (3)
  "single-number", "number-1-bits", "counting-bits",
  // Tries (2)
  "implement-trie", "word-search-ii",
  // Math & Geometry (3)
  "rotate-image", "spiral-matrix", "set-matrix-zeroes",
  // Advanced Graphs (4)
  "network-delay-time", "min-cost-connect-points", "cheapest-flights", "alien-dictionary",
];

// Deep SE coverage — ids are `${subjectId}/${chapterId}` (match buildSETasks).
export const ESSENTIAL_SE: string[] = [
  // Operating Systems (11)
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
  // DBMS (9)
  "dbms/er-modeling",
  "dbms/keys-and-constraints",
  "dbms/normalization",
  "dbms/sql-joins-subqueries-aggregation",
  "dbms/indexing",
  "dbms/transactions-acid-properties",
  "dbms/concurrency-control",
  "dbms/isolation-levels-anomalies",
  "dbms/storage-and-file-organization",
  // Computer Networks (8)
  "computer-networks/why-networking-is-layered",
  "computer-networks/addressing-mac-ip-subnetting",
  "computer-networks/transport-layer-tcp-vs-udp",
  "computer-networks/dns-domain-name-system",
  "computer-networks/http-and-https",
  "computer-networks/what-happens-when-you-type-a-url",
  "computer-networks/routing-basics",
  "computer-networks/security-essentials",
  // OOP (8)
  "oop/classes-objects-why-oop-exists",
  "oop/encapsulation",
  "oop/abstraction",
  "oop/inheritance",
  "oop/polymorphism",
  "oop/constructors-destructors-rule-of-three-five",
  "oop/solid-design-principles",
  "oop/common-design-patterns",
  // Concurrency (4)
  "concurrency/threads-processes",
  "concurrency/mutex-semaphore",
  "concurrency/producer-consumer",
  "concurrency/deadlock-detection",
  // Linux & SE fundamentals (3)
  "linux-se/complexity-analysis-big-o",
  "linux-se/git-and-version-control",
  "linux-se/system-design-basics",
];

// Deep SD coverage — concept + case-study ids (match buildSDTasks).
export const ESSENTIAL_SD: string[] = [
  // Foundations (14)
  "scalability", "availability", "latency-vs-throughput", "load-balancing", "caching",
  "cdn", "database-indexing", "replication", "sharding", "cap-theorem", "acid-vs-base",
  "message-queues", "api-gateway", "rate-limiting",
  // Databases in depth (5)
  "relational-vs-nosql", "nosql-types", "transactions-isolation", "replication-strategies", "sharding-strategies",
  // Networking (4)
  "tcp-udp-quic", "http-versions", "dns-resolution", "connection-pooling",
  // Interview framework (4)
  "clarify-requirements", "back-of-envelope", "api-data-model", "high-level-architecture",
  // Case studies — do these end to end (2)
  "url-shortener", "rate-limiter-system",
];

export const ESSENTIAL_DSA_SET = new Set(ESSENTIAL_DSA);
export const ESSENTIAL_SE_SET = new Set(ESSENTIAL_SE);
export const ESSENTIAL_SD_SET = new Set(ESSENTIAL_SD);
