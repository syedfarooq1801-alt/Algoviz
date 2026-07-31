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

/** One block of work inside a countdown prep day. */
export interface PrepBlock {
  time: string;
  title: string;
  items: string[];
}

/** A single day of a dated, countdown-style prep plan for an announced drive. */
export interface PrepDay {
  day: number;
  date: string;
  weekday: string;
  theme: string;
  goal: string;
  blocks: PrepBlock[];
}

/** Hard logistics that disqualify you if missed — shown above everything else. */
export interface PrepDeadline {
  label: string;
  detail: string;
  critical?: boolean;
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
  /** Set only for a live, dated campus drive — renders a countdown prep plan. */
  prepPlan?: PrepDay[];
  deadlines?: PrepDeadline[];
}

export const COMPANIES: Company[] = [
  {
    id: "ibm",
    name: "IBM",
    logo: "IBM",
    color: "#0F62FE",
    tagline: "IBM Infrastructure / India Systems Development Lab (ISDL) — systems software, not web dev. The assessment is standard DSA on HackerRank; the interview is where OS internals, C/C++ and Linux decide it.",
    roles: ["Software Engineer — IBM Infrastructure (2027 batch)", "6-month internship (Jan'27–Jun'27) → full-time"],
    packageRange: "₹17L CTC + ₹1.5L one-time premium + ₹25K settling · Internship ₹30K/mo (BE/BTech), ₹40K/mo (M.Tech/Dual)",
    deadlines: [
      { label: "Assessment", detail: "4 Aug 2026, 5:00 PM — HackerRank, 1–2 hours, webcam-proctored", critical: true },
      { label: "Registration window", detail: "Link goes live 4 Aug at 4:30 PM and dies after 30 minutes. Miss it and you are out — be at your desk by 4:25.", critical: true },
      { label: "College name format", detail: "Type exactly \"Ramaiah Institute of Technology Bangalore\". Any other spelling can get the application dropped.", critical: true },
      { label: "Contact details", detail: "Personal email + personal phone only. A college email ID will invalidate the registration." },
      { label: "Desktop app", detail: "Install the HackerRank desktop app and pass the sample test BEFORE the day — https://www.hackerrank.com/app · sample: https://hr.gs/sample-app-test", critical: true },
      { label: "Eligibility", detail: "2027 batch · ≥70% or 7.0 CGPA (all subjects incl. electives) · no active backlog · CS/IT/ISE/EE/ECE/EIE/AEIE/EEE/ETE/Robotics/Computing" },
    ],
    rounds: [
      { name: "Pre-Placement Talk", duration: "~45 min", format: "Virtual — IBM introduces ISDL, the Power/Z/Storage stack and the role", tips: ["Attend it — interviewers ask 'why IBM Infrastructure' and the PPT hands you the answer", "Note the specific team names mentioned (AIX, OpenBMC, Spectrum Fusion, AI on Z)", "Write down 2 questions to ask; it signals genuine interest"] },
      { name: "Coding Assessment", duration: "1–2 hours", format: "Virtual — HackerRank desktop app, webcam on, fullscreen locked", tips: ["Typically 2–3 coding problems, easy→medium, sometimes with MCQs on OS/DBMS/CN/C output", "HackerRank needs FULL programs with stdin/stdout — not just a function body like LeetCode", "Tab switching is flagged. Do not leave fullscreen", "Partial credit is per test case — always submit a brute force before optimising"] },
      { name: "Technical Interview", duration: "45–60 min", format: "In-person — DSA + OS/Linux internals + C/C++ + your projects", tips: ["This is where IBM differs: OS internals carry as much weight as DSA", "Expect 'what happens when you run ./a.out', signals, IPC, shared memory, threads vs processes", "Know your resume projects to the line — they will drill into one", "C/C++ pointer and memory questions are near-guaranteed"] },
      { name: "HR / Managerial", duration: "20–30 min", format: "In-person — fit, relocation, the 6-month internship commitment", tips: ["Be clear you can do the Jan–Jun 2027 in-person internship", "Bangalore/Pune/Hyderabad relocation willingness", "Ask about the team you'd join — ISDL has very distinct sub-teams"] },
    ],
    focus: [
      { topic: "Arrays, Strings & Hashing", weight: "High", notes: "The bread and butter of an IBM HackerRank set — frequency counts, two pointers, prefix sums" },
      { topic: "OS & Linux Internals", weight: "High", notes: "The JD's core ask. Processes vs threads, scheduling, deadlock, paging, signals, IPC, shared memory. Heavy in the INTERVIEW, not the assessment" },
      { topic: "C / C++ Fundamentals", weight: "High", notes: "Pointers, memory layout, malloc vs new, structs, dangling pointers, static/extern. IBM Systems is a C/C++ shop" },
      { topic: "Recursion, Trees & Graphs", weight: "Medium", notes: "BFS/DFS and basic tree traversals show up; deep graph theory rarely does" },
      { topic: "Sorting & Searching", weight: "Medium", notes: "Binary search on answer, custom comparators, complexity reasoning" },
      { topic: "DBMS & Networking", weight: "Medium", notes: "Normalization, joins, ACID, indexing; TCP vs UDP, the DNS/HTTP path. Common as MCQs and interview filler" },
      { topic: "Dynamic Programming", weight: "Low", notes: "Occasionally one easy-medium DP. Don't spend your 4 days here" },
    ],
    topPatterns: ["Hashing & Frequency Maps", "Two Pointers", "Sliding Window", "Sorting + Greedy", "Binary Search", "BFS/DFS", "Prefix Sum", "String Manipulation"],
    mustSolve: [
      { title: "Two Sum", pattern: "Hashing", frequency: "Very Common" },
      { title: "Valid Anagram", pattern: "Hashing", frequency: "Very Common" },
      { title: "Group Anagrams", pattern: "Hashing", frequency: "Common" },
      { title: "Maximum Subarray", pattern: "Kadane / Greedy", frequency: "Very Common" },
      { title: "Merge Intervals", pattern: "Sorting + Intervals", frequency: "Common" },
      { title: "Best Time to Buy and Sell Stock", pattern: "Sliding Window", frequency: "Very Common" },
      { title: "Longest Substring Without Repeating Chars", pattern: "Sliding Window", frequency: "Common" },
      { title: "Binary Search", pattern: "Binary Search", frequency: "Very Common" },
      { title: "Reverse Linked List", pattern: "Linked List", frequency: "Very Common" },
      { title: "Number of Islands", pattern: "BFS/DFS", frequency: "Common" },
      { title: "Valid Parentheses", pattern: "Stack", frequency: "Very Common" },
      { title: "Climbing Stairs", pattern: "DP", frequency: "Common" },
    ],
    behavioralFocus: [
      "Why IBM Infrastructure / systems software rather than a product web role?",
      "Are you comfortable with C/C++ and low-level work? (Say yes only if you mean it — they will test it)",
      "Walk me through a project — expect them to drill into one specific decision",
      "A time you debugged something genuinely hard, and how you isolated the cause",
      "Are you able to relocate and do the full 6-month in-person internship from Jan 2027?",
    ],
    insiderTips: [
      "IBM's assessment is EASIER than its interview. Most eliminations happen at the interview on OS and C — so don't spend all 4 days on DSA",
      "HackerRank ≠ LeetCode: you write a complete program and parse stdin yourself. Practise reading input in your language before the test day",
      "Always submit a working brute force first — HackerRank scores per test case, so a passing O(n²) beats an unfinished O(n)",
      "The JD names C, C++, Go, Python, shell and Linux repeatedly. Mentioning any real Linux/C exposure in the interview is a strong differentiator",
      "Do not use a college email or a misspelt college name at registration — those are silent rejections before anyone reads your code",
      "The 30-minute registration window is the single most common way people lose this opportunity. Set two alarms for 4:25 PM on 4 Aug",
    ],
    prepPlan: [
      {
        day: 1,
        date: "1 Aug 2026",
        weekday: "Saturday",
        theme: "Assessment core — hashing, arrays, strings",
        goal: "Get fast and accurate on the problem types that actually appear on an IBM HackerRank set, and get the HackerRank environment working today (not on test day).",
        blocks: [
          { time: "Morning", title: "Logistics first — 30 min, do not skip", items: [
            "Install the HackerRank desktop app and run the sample test end to end, with webcam on.",
            "Fix any camera/permission/fullscreen issue NOW — you cannot debug this at 5 PM on the 4th.",
            "Save your personal email + personal phone somewhere ready to paste at registration.",
          ]},
          { time: "Morning", title: "Arrays & Hashing — 12 problems", items: [
            "Two Sum, Contains Duplicate, Valid Anagram, Ransom Note, Group Anagrams, Top K Frequent.",
            "Maximum Subarray (Kadane), Product of Array Except Self, Move Zeroes.",
            "For each: state the brute force out loud first, then the optimisation. That is exactly the interview script.",
          ]},
          { time: "Afternoon", title: "Strings + I/O drilling", items: [
            "Longest Substring Without Repeating Chars, Valid Palindrome, Longest Common Prefix, string reversal/rotation.",
            "Critical: write 3 of these as FULL programs reading from stdin and printing to stdout — the HackerRank format.",
            "Practise parsing: single int, array on one line, n then n lines, multiple test cases.",
          ]},
          { time: "Evening", title: "C/C++ fundamentals — 1 hour", items: [
            "Pointers vs references, pointer arithmetic, array-pointer decay.",
            "malloc/free vs new/delete, memory leaks, dangling pointers, the stack/heap/data/text memory layout.",
            "sizeof of structs and why padding exists — a classic IBM warm-up question.",
          ]},
        ],
      },
      {
        day: 2,
        date: "2 Aug 2026",
        weekday: "Sunday",
        theme: "Two pointers, sliding window, sorting, binary search",
        goal: "Finish the remaining high-frequency assessment patterns, then start OS — because OS is what wins the interview.",
        blocks: [
          { time: "Morning", title: "Two Pointers & Sliding Window — 10 problems", items: [
            "Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Merge Sorted Array.",
            "Best Time to Buy and Sell Stock, Max Consecutive Ones III, Fruit Into Baskets.",
            "Fixed-size vs variable-size window — be able to say which one a problem needs within 30 seconds.",
          ]},
          { time: "Afternoon", title: "Sorting, Searching & Intervals — 8 problems", items: [
            "Binary Search, Search Insert Position, First Bad Version, Koko Eating Bananas (binary search on the answer).",
            "Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms.",
            "Custom comparators in your language — sorting by a second key trips people up under time pressure.",
          ]},
          { time: "Evening", title: "OS block 1 — processes & concurrency", items: [
            "Process vs thread, the PCB, context switching, process states.",
            "CPU scheduling: FCFS, SJF, Round Robin, priority. Be able to compute average waiting time by hand.",
            "Deadlock: the 4 Coffman conditions, prevention vs avoidance vs detection, Banker's algorithm idea.",
            "Mutex vs semaphore vs spinlock — IBM asks this constantly.",
          ]},
        ],
      },
      {
        day: 3,
        date: "3 Aug 2026",
        weekday: "Monday",
        theme: "Linked lists, trees, graphs + OS/Linux internals + full mock",
        goal: "Close the remaining DSA gaps, go deep on the Linux internals the JD keeps naming, and sit one full timed mock under real conditions.",
        blocks: [
          { time: "Morning", title: "Linked Lists, Stacks, Trees, Graphs — 10 problems", items: [
            "Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Remove Nth Node.",
            "Valid Parentheses, Min Stack, Implement Queue using Stacks.",
            "Max Depth, Invert Binary Tree, Level Order Traversal, Validate BST.",
            "Number of Islands, Rotting Oranges — BFS/DFS on a grid is the most likely graph question.",
          ]},
          { time: "Afternoon", title: "OS block 2 — memory + Linux internals (the JD's core)", items: [
            "Paging, segmentation, virtual memory, page faults, TLB, thrashing.",
            "Page replacement: FIFO, LRU, Optimal — be able to trace a reference string.",
            "Linux internals the JD names explicitly: signals, IPC (pipes, message queues, shared memory), fork/exec/wait, zombie vs orphan processes.",
            "File systems: inodes, hard vs soft links, file descriptors.",
            "Multi-threading: race conditions, critical section, producer-consumer.",
          ]},
          { time: "Afternoon", title: "DBMS + Networking speed pass — 45 min", items: [
            "Normalization 1NF→3NF, joins, ACID, indexing, transactions/isolation levels.",
            "TCP vs UDP, the 3-way handshake, what happens when you type a URL, DNS, HTTP vs HTTPS.",
            "These mostly appear as MCQs — recognition is enough, no deep study needed.",
          ]},
          { time: "Evening", title: "FULL TIMED MOCK — 2 hours, non-negotiable", items: [
            "Use the HackerRank desktop app in fullscreen with the webcam on. Simulate the real thing.",
            "Pick 3 unseen problems (1 easy, 2 medium) and give yourself 2 hours total.",
            "Practise the real strategy: read all problems first, solve the easiest first, brute force before optimising.",
            "Afterwards, write down every mistake — the fix list becomes tomorrow's revision.",
          ]},
        ],
      },
      {
        day: 4,
        date: "4 Aug 2026",
        weekday: "Tuesday — ASSESSMENT DAY (5:00 PM)",
        theme: "Light revision, zero new topics, flawless logistics",
        goal: "Do not learn anything new today. Stay sharp, stay calm, and do not lose this on a registration technicality.",
        blocks: [
          { time: "Morning", title: "Light revision only — 2 hours max", items: [
            "Re-read your mistake list from yesterday's mock. That is the highest-value hour you have.",
            "Re-solve 3–4 problems you have ALREADY solved, for confidence and speed — not new ones.",
            "Skim OS one-liners: process vs thread, mutex vs semaphore, deadlock conditions, paging vs segmentation.",
          ]},
          { time: "Afternoon (by 3:00 PM)", title: "Machine check — do this early", items: [
            "Reboot. Close every other app. Test the webcam and the HackerRank desktop app one final time.",
            "Check your internet; keep a mobile hotspot ready as a backup.",
            "Charge your laptop AND plug it in. Sit somewhere quiet with decent lighting on your face.",
            "Keep your ID proof on the desk in case it's asked for.",
          ]},
          { time: "4:25 PM", title: "REGISTRATION — the 30-minute window", items: [
            "Be seated by 4:25 PM. The link goes live at 4:30 PM and closes at 5:00 PM.",
            "College name must read exactly: Ramaiah Institute of Technology Bangalore.",
            "Personal email and personal phone number only — never the college ID.",
            "Register the moment the link drops. Do not wait, do not multitask.",
          ]},
          { time: "5:00 PM", title: "The assessment — execution rules", items: [
            "Read every problem before writing any code, then start with the easiest.",
            "Write a working brute force and SUBMIT it before optimising — partial test cases still score.",
            "Remember it is a full program: read stdin, print stdout, handle the exact output format.",
            "Never leave fullscreen or switch tabs — it is flagged as malpractice.",
            "If stuck for more than 10 minutes, move on and come back. An unattempted easy problem is the worst outcome.",
          ]},
        ],
      },
    ],
  },
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
