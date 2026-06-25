export interface CompanyFocus {
  topic: string;
  weight: "High" | "Medium" | "Low";
  notes: string;
}

export interface CompanyRound {
  name: string;
  duration: string;
  format: string;
  tips: string[];
}

export interface CompanyProblem {
  title: string;
  pattern: string;
  frequency: "Very Common" | "Common" | "Occasional";
  link?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  color: string;
  tagline: string;
  roles: string[];
  rounds: CompanyRound[];
  focus: CompanyFocus[];
  topPatterns: string[];
  mustSolve: CompanyProblem[];
  behavioralFocus: string[];
  insiderTips: string[];
  packageRange: string;
}

export const COMPANIES: Company[] = [
  {
    id: "google",
    name: "Google",
    logo: "G",
    color: "#4285F4",
    tagline: "Focus on clean code, correctness, and optimal complexity. Googlers want to see how you think.",
    roles: ["SWE", "SWE II", "Senior SWE", "Staff SWE"],
    packageRange: "₹30L–₹1.5Cr (India SWE III–Staff)",
    rounds: [
      { name: "Phone Screen", duration: "45 min", format: "1 coding problem, medium-hard", tips: ["Use Google Doc or CoderPad", "Verbalize your thought process", "Ask clarifying questions first"] },
      { name: "Onsite × 4–5", duration: "45 min each", format: "2 coding rounds + system design + behavioral (Googleyness)", tips: ["System design at L5+", "Googleyness = culture fit round", "Always discuss time/space complexity"] },
    ],
    focus: [
      { topic: "Graphs & Trees", weight: "High", notes: "BFS/DFS, shortest path, topological sort appear in ~40% of Google rounds" },
      { topic: "Dynamic Programming", weight: "High", notes: "2D DP, interval DP, DP on trees. Google loves DP variants" },
      { topic: "String / Arrays", weight: "High", notes: "Sliding window, two pointers, rolling hash" },
      { topic: "Math & Bit Manipulation", weight: "Medium", notes: "Prime factorization, modular arithmetic, bit tricks" },
      { topic: "System Design", weight: "High", notes: "L5+ — search infrastructure, YouTube, Maps scale" },
    ],
    topPatterns: ["BFS/DFS", "Dynamic Programming", "Two Pointers", "Binary Search", "Heap/Priority Queue", "Trie", "Union Find", "Segment Tree"],
    mustSolve: [
      { title: "Word Ladder", pattern: "BFS", frequency: "Very Common" },
      { title: "Median of Data Streams", pattern: "Two Heaps", frequency: "Very Common" },
      { title: "Serialize/Deserialize Binary Tree", pattern: "Tree DFS", frequency: "Very Common" },
      { title: "Word Search II", pattern: "Trie + Backtracking", frequency: "Common" },
      { title: "Edit Distance", pattern: "2D DP", frequency: "Very Common" },
      { title: "Trapping Rain Water", pattern: "Two Pointers", frequency: "Common" },
      { title: "LRU Cache", pattern: "HashMap + DLL", frequency: "Very Common" },
      { title: "Decode Ways", pattern: "DP", frequency: "Common" },
      { title: "Course Schedule II", pattern: "Topological Sort", frequency: "Very Common" },
      { title: "Merge K Sorted Lists", pattern: "Heap", frequency: "Very Common" },
    ],
    behavioralFocus: [
      "Googleyness & Culture Fit — collaboration, ambiguity, humility",
      "Describe a time you disagreed with a technical decision",
      "How do you handle large-scale ambiguous projects?",
      "Tell me about a time you improved a process significantly",
    ],
    insiderTips: [
      "Google values correctness over speed — a slower but correct solution beats a fast buggy one",
      "Write code as if it's going to production — handle edge cases, null checks",
      "Think out loud from the start — interviewers want to see your reasoning process",
      "After solving, always discuss trade-offs of your approach vs alternatives",
      "System design: start with scale requirements, then work bottom-up",
    ],
  },
  {
    id: "meta",
    name: "Meta",
    logo: "M",
    color: "#1877F2",
    tagline: "Speed + correctness. Meta values practical problem-solving and iteration. Move fast.",
    roles: ["E3", "E4", "E5", "E6"],
    packageRange: "₹60L–₹2Cr+ (E4–E6)",
    rounds: [
      { name: "Initial Screen", duration: "45 min", format: "2 LeetCode-style problems", tips: ["Target medium difficulty", "Meta screens are harder than Google phone screens", "Finish BOTH problems"] },
      { name: "Onsite × 4", duration: "45–60 min each", format: "2 coding + system design + behavioral", tips: ["Behavioral is 1 full round at Meta", "System design at E4+", "Code in your preferred language"] },
    ],
    focus: [
      { topic: "Arrays & Strings", weight: "High", notes: "Two pointers, sliding window, in-place manipulation" },
      { topic: "Graphs", weight: "High", notes: "Union Find, BFS on grids, connected components" },
      { topic: "Trees", weight: "High", notes: "Binary tree traversals, BST operations, LCA" },
      { topic: "Dynamic Programming", weight: "Medium", notes: "1D DP mostly, interval DP occasionally" },
      { topic: "System Design", weight: "High", notes: "News Feed, Instagram, WhatsApp messaging scale" },
    ],
    topPatterns: ["Two Pointers", "BFS/DFS", "Union Find", "Sliding Window", "Binary Search", "Stack/Queue", "Tree Traversal"],
    mustSolve: [
      { title: "Valid Palindrome II", pattern: "Two Pointers", frequency: "Very Common" },
      { title: "Number of Islands", pattern: "BFS/DFS", frequency: "Very Common" },
      { title: "Minimum Remove to Make Valid Parentheses", pattern: "Stack", frequency: "Very Common" },
      { title: "Buildings With an Ocean View", pattern: "Stack", frequency: "Very Common" },
      { title: "K Closest Points to Origin", pattern: "Heap", frequency: "Very Common" },
      { title: "Subarray Sum Equals K", pattern: "Prefix Sum + HashMap", frequency: "Very Common" },
      { title: "Lowest Common Ancestor", pattern: "Tree DFS", frequency: "Very Common" },
      { title: "Find All Anagrams", pattern: "Sliding Window", frequency: "Common" },
      { title: "Binary Tree Right Side View", pattern: "BFS", frequency: "Common" },
      { title: "Move Zeroes", pattern: "Two Pointers", frequency: "Very Common" },
    ],
    behavioralFocus: [
      "Tell me about a time you had a huge impact",
      "How do you handle conflict with a teammate?",
      "Describe a project where you made a controversial technical decision",
      "Move Fast — give an example of shipping something quickly",
    ],
    insiderTips: [
      "Meta expects you to solve 2 problems in 45 minutes — pace yourself",
      "They care about clean API design — think about your function signatures",
      "Behavioral at Meta is scored separately with equal weight as coding",
      "Practice Facebook's tagged problems on LeetCode — they reuse problems",
      "System design: think about news feed ranking, real-time messaging, CDN",
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "A",
    color: "#FF9900",
    tagline: "LP stories matter as much as DSA. Amazon is uniquely balanced between coding and leadership principles.",
    roles: ["SDE I", "SDE II", "SDE III", "Principal SDE"],
    packageRange: "₹25L–₹80L (SDE I–SDE III, India)",
    rounds: [
      { name: "OA (Online Assessment)", duration: "90 min", format: "2 coding problems + work simulation", tips: ["Typically LeetCode medium", "Work simulation tests LP judgment", "No debugging round in new format"] },
      { name: "Onsite (Virtual Loop)", duration: "4–5 rounds × 60 min", format: "Coding + LP + system design (SDE II+) + bar raiser", tips: ["Every round has LP questions", "Bar raiser is extra round — don't know which", "Use STAR format strictly for LP"] },
    ],
    focus: [
      { topic: "Arrays & Strings", weight: "High", notes: "Most common category at Amazon — sliding window, sorting" },
      { topic: "Trees & Graphs", weight: "High", notes: "BST, tree traversals, BFS for shortest path" },
      { topic: "Dynamic Programming", weight: "Medium", notes: "Knapsack, coin change variants" },
      { topic: "OOD / LLD", weight: "High", notes: "Amazon explicitly tests LLD — design parking lot, design Amazon locker" },
      { topic: "Leadership Principles", weight: "High", notes: "14 LPs woven into every round — you must prep specific stories" },
    ],
    topPatterns: ["Arrays/Strings", "Trees", "BFS/DFS", "Dynamic Programming", "Heap", "Two Pointers", "Sliding Window", "OOD"],
    mustSolve: [
      { title: "Two Sum", pattern: "HashMap", frequency: "Very Common" },
      { title: "Meeting Rooms II", pattern: "Heap/Intervals", frequency: "Very Common" },
      { title: "Product of Array Except Self", pattern: "Prefix Products", frequency: "Very Common" },
      { title: "Number of Islands", pattern: "BFS/DFS", frequency: "Very Common" },
      { title: "Spiral Matrix", pattern: "Matrix Traversal", frequency: "Common" },
      { title: "Kth Largest Element", pattern: "Heap", frequency: "Very Common" },
      { title: "Design HashMap", pattern: "OOD", frequency: "Common" },
      { title: "LRU Cache", pattern: "OOD + HashMap + DLL", frequency: "Very Common" },
      { title: "Word Break", pattern: "DP + Trie", frequency: "Common" },
      { title: "Rotting Oranges", pattern: "BFS", frequency: "Common" },
    ],
    behavioralFocus: [
      "Customer Obsession — tell me about a time you advocated for the customer",
      "Ownership — tell me about a time you went beyond your scope",
      "Dive Deep — describe a time you got to the root cause of a problem",
      "Bias for Action — time you made a decision with incomplete data",
      "Invent and Simplify — example of a creative solution",
      "Frugality — accomplished more with less",
    ],
    insiderTips: [
      "Prepare 8–10 unique LP stories. Each story should map to 3–4 LPs",
      "Amazon interviewers use a behavior evidence sheet — give specific metrics",
      "For OOD: they want class diagrams, extensibility, SOLID principles",
      "Amazon values working backwards from the customer — mention customer impact",
      "SDE II+ will have system design — focus on AWS services (their ecosystem)",
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "MS",
    color: "#00A4EF",
    tagline: "Collaborative culture. Microsoft interviews are thorough but less intense than Google/Meta. Communication is key.",
    roles: ["SDE 59", "SDE 60", "SDE 61–62 (Senior)", "Principal 63+"],
    packageRange: "₹25L–₹70L (India SDE 59–Senior)",
    rounds: [
      { name: "Phone Screen", duration: "45–60 min", format: "1–2 coding problems + behavioral", tips: ["Often asked to code in real IDE", "More conversational than Google", "Communication matters a lot"] },
      { name: "Onsite × 4–5", duration: "60 min each", format: "Coding + design + behavioral + 'as appropriate' (hire/no-hire round)", tips: ["Design for L62+", "As Appropriate round = deciding vote", "Focus on code quality and testing"] },
    ],
    focus: [
      { topic: "Arrays & Strings", weight: "High", notes: "Classic problems, variations on standard patterns" },
      { topic: "Trees", weight: "High", notes: "BST, serialization, LCA, diameter" },
      { topic: "Design", weight: "High", notes: "Both OOD and system design. Xbox, Azure, Office scenarios" },
      { topic: "Concurrency", weight: "Medium", notes: "Thread safety, producer-consumer, at senior levels" },
      { topic: "Dynamic Programming", weight: "Medium", notes: "1D DP most common" },
    ],
    topPatterns: ["Trees/Graphs", "Arrays/Strings", "DP", "OOD", "Concurrency", "Recursion"],
    mustSolve: [
      { title: "Reverse Linked List", pattern: "Linked List", frequency: "Very Common" },
      { title: "Clone Graph", pattern: "BFS/DFS", frequency: "Common" },
      { title: "Design Parking Lot", pattern: "OOD", frequency: "Very Common" },
      { title: "Binary Tree Level Order", pattern: "BFS", frequency: "Very Common" },
      { title: "Valid Parentheses", pattern: "Stack", frequency: "Very Common" },
      { title: "Find Median from Data Stream", pattern: "Two Heaps", frequency: "Common" },
      { title: "Word Break II", pattern: "DP + Backtracking", frequency: "Common" },
      { title: "Implement Trie", pattern: "Trie", frequency: "Common" },
    ],
    behavioralFocus: [
      "Growth Mindset — tell me about a time you had to learn something new quickly",
      "Collaboration — how do you handle disagreements within a team?",
      "Impact — describe your most significant project contribution",
      "Diversity and Inclusion perspective",
    ],
    insiderTips: [
      "Microsoft values communication above speed — talk through everything",
      "They often ask you to write tests — include edge cases",
      "Code quality matters: variable names, structure, not just passing examples",
      "Design rounds often use Office/Azure scenarios — know cloud basics",
      "Growth mindset is a real filter — show genuine curiosity and learning",
    ],
  },
  {
    id: "flipkart-uber",
    name: "Flipkart / Uber / Swiggy",
    logo: "IN",
    color: "#2563EB",
    tagline: "Indian unicorns test OOD heavily alongside DSA. Move fast, demonstrate product sense.",
    roles: ["SDE I", "SDE II", "Senior SDE", "Staff SDE"],
    packageRange: "₹20L–₹80L (SDE I–Staff)",
    rounds: [
      { name: "Coding Round × 2", duration: "60–90 min each", format: "2–3 DSA problems per round", tips: ["HackerRank/HackerEarth platform", "Medium-Hard difficulty", "Optimize after brute force"] },
      { name: "LLD Round", duration: "60 min", format: "Design a system class diagram + code", tips: ["Parking lot, Splitwise, BookMyShow", "Draw class diagram first", "Show SOLID principles awareness"] },
      { name: "HLD Round (SDE II+)", duration: "60 min", format: "System design", tips: ["Flipkart: e-commerce scale (catalog, orders)", "Swiggy/Uber: location-based, real-time", "Cover DB, cache, CDN, queues"] },
    ],
    focus: [
      { topic: "OOD / LLD", weight: "High", notes: "Flipkart, Uber, Swiggy all dedicate a full round to OOD" },
      { topic: "Arrays & Strings", weight: "High", notes: "Basis of all coding rounds" },
      { topic: "Graphs", weight: "High", notes: "Delivery routing (Swiggy/Uber), network problems" },
      { topic: "System Design", weight: "High", notes: "At SDE II+ — scale to millions of orders/rides" },
      { topic: "Dynamic Programming", weight: "Medium", notes: "Medium DP usually sufficient" },
    ],
    topPatterns: ["OOD/LLD", "Graphs", "Arrays", "Sliding Window", "BFS for shortest path", "Interval problems"],
    mustSolve: [
      { title: "Design Ride Sharing (Uber OOD)", pattern: "OOD", frequency: "Very Common" },
      { title: "Design Food Delivery (Swiggy)", pattern: "OOD + State Machine", frequency: "Very Common" },
      { title: "Shortest Path in Grid", pattern: "BFS", frequency: "Very Common" },
      { title: "Meeting Rooms II", pattern: "Intervals + Heap", frequency: "Common" },
      { title: "Maximum Subarray", pattern: "Kadane", frequency: "Very Common" },
      { title: "LRU Cache", pattern: "OOD", frequency: "Very Common" },
    ],
    behavioralFocus: [
      "Describe your biggest impact on scale/performance",
      "How do you handle ambiguous requirements?",
      "Tell me about a system you designed from scratch",
      "Customer impact stories for Flipkart",
    ],
    insiderTips: [
      "LLD round is make-or-break — spend a week on class diagram practice",
      "Swiggy/Uber: know real-time systems, location algorithms, ETA calculation",
      "Flipkart: catalog search, inventory, order management at scale",
      "OOD tip: always start with enums + entities + relationships before methods",
    ],
  },
];

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}
