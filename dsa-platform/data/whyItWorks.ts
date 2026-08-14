// "Why is this correct?" — the argument, not the algorithm.
//
// Steps fade. The reason a step is *safe* is what survives, and it's what
// lets you rebuild the solution from scratch a month later instead of trying
// to recall it. These are written for the problems where the algorithm looks
// like a magic trick: every greedy that needs an exchange argument, every
// two-pointer whose discarded half needs justifying, every binary search on
// an answer that needs its monotonicity spelled out.
//
// Each one answers: what would go wrong if I did the obvious thing instead,
// and why can't that happen here?

export const WHY_IT_WORKS: Record<string, string> = {
  "trapping-rain-water":
    "Water over a bar is min(tallest-left, tallest-right) minus its height. You normally can't know both maxima in one pass — but you don't need both, only the smaller one. When the left bar is shorter than the right, there is *some* bar on the right at least that tall, so the right maximum is guaranteed ≥ the left maximum. The left running max is therefore already the true limit, whatever lies further right. That's why advancing the shorter side is always safe.",

  "max-subarray":
    "The question is when to abandon a run. If the sum so far is negative, then for any continuation, dropping the prefix strictly increases the total — a negative number added to anything makes it smaller. So a negative prefix can never be part of the best subarray ending later, and discarding it loses nothing. Every position is thus correctly answered by 'extend, or start fresh here'.",

  "gas-station":
    "Two facts. First, if total gas < total cost, no start can work. Second, if you leave A and run dry at B, then no station between them works either: you arrived at each with a non-negative tank, so starting there gives you no more fuel than you already had — you'd run dry at B too. That lets you skip the whole failed stretch instead of retrying each station, turning O(n²) into one pass.",

  "jump-game":
    "Track the furthest index reachable so far. Reachability is 'downward closed' — if you can reach index i, you can reach every index before it, since jumps allow any distance up to nums[i]. So a single furthest-reachable number fully describes your position. If the scan ever stands on an index beyond that number, no earlier index could bridge the gap, and no later one helps.",

  "jump-game-ii":
    "This is breadth-first search on an implicit graph, which is why it gives the *minimum*. Level k is every index reachable in exactly k jumps. Because reachability is contiguous, each level is a solid range, so you can represent it with just its right edge instead of a queue. Crossing a level boundary is one jump, and BFS visits levels in increasing order — so the first level containing the last index is the shortest route.",

  "find-duplicate-number":
    "Reading values as next-indices makes the array a linked list, and the duplicate is the one node two arrows point at — the entrance to a cycle. Floyd's second phase is the part that looks arbitrary. If the tail before the cycle has length μ and the pointers first met at distance k inside the cycle, the meeting point is exactly μ steps short of the entrance going forward. Restarting one pointer at the head and stepping both one at a time therefore lands both on the entrance simultaneously.",

  "linked-list-cycle":
    "Once both pointers are inside the loop, look at the gap between them. The fast one gains exactly one node per step, so the gap shrinks by one every time. A gap that decreases by one inside a finite loop must hit zero — it can't jump over, because it changes by exactly one. So they always meet, and meeting is only possible if a loop exists.",

  "container-water":
    "Area is width × the shorter of the two lines. Moving the taller pointer inward always loses width while the height stays capped by the same shorter line, so it can never improve. Moving the shorter one loses width too, but is the only move that can raise the height cap. So every pair you skip is provably no better than one already considered.",

  "three-sum":
    "Once the array is sorted, the two-pointer sweep is exhaustive rather than a heuristic. If the current sum is too small, every pair using this left pointer with a smaller right pointer is also too small — so the whole column can be discarded in one move, not just the current pair. The same holds mirrored on the other side. Each move eliminates a full set of candidates, which is what turns O(n²) inner work into O(n).",

  "non-overlapping-intervals":
    "Exchange argument. Sort by end time and always keep the interval that finishes soonest. If some optimal solution instead keeps a later-ending interval, swapping it for the earliest-ending one leaves at least as much room for everything after — the replacement conflicts with no more intervals than the original. So an optimal solution containing the greedy choice always exists, and the greedy is optimal by induction.",

  "partition-labels":
    "A partition must contain every occurrence of each of its characters, so it cannot end before the last occurrence of anything inside it. That gives a hard lower bound on where the cut can go. Closing exactly at that bound is optimal because any later cut just merges two valid partitions into one, and you want the most partitions possible.",

  "hand-of-straights":
    "The smallest remaining card has no smaller card left to sit above it, so it can only ever be the *bottom* of its group. That forces the rest of that group entirely — the next w−1 consecutive values. There is no choice to make and therefore nothing to backtrack over, which is why a greedy pass with no lookahead is correct.",

  "koko-bananas":
    "Binary search here is on the answer, not an index, and it needs monotonicity to be valid: if speed k finishes in time, so does every speed above k. That makes the feasibility function a single step from false to true, and binary search finds exactly that boundary. The same argument licenses Capacity to Ship Packages and Split Array Largest Sum.",

  "capacity-ship-packages":
    "Feasibility is monotone in capacity — a ship that can clear the backlog in D days can also do it with a larger hold. So 'can I finish in D days?' is false up to some threshold and true forever after, and binary search on that boundary is exact. The lower bound must be the heaviest single package, since no capacity below it can ever load that item.",

  "split-array-largest-sum":
    "Turn 'minimise the largest part' into a yes/no question: given a cap, how few parts can I get away with? Greedily filling each part until it would exceed the cap is optimal for that question, and the number of parts needed only decreases as the cap rises. That monotonicity is what makes binary search over the cap correct.",

  "find-min-rotated":
    "The minimum is the single point where the ascending order breaks. Comparing the midpoint to the *right* end identifies which side holds that break: if mid > right, the drop must be after mid, so the answer lies strictly right of it. Comparing against the left end instead fails on an unrotated array, which is the classic bug here.",

  "search-rotated":
    "A rotated sorted array split at any midpoint always leaves at least one half fully sorted — the rotation point can only be in one of them. Once you know which half is sorted, you can test the target against its two endpoints and decide definitively whether it lives there. So one half is always discardable, and the search stays logarithmic.",

  "median-two-sorted":
    "Don't merge — partition. Cut both arrays so the left pieces together hold exactly half the elements. The cut is correct when every element left of it is ≤ every element right of it, which needs only two cross-comparisons at the boundary. Binary searching the cut position in the shorter array gives O(log min(m,n)), and the median falls out of the four boundary values.",

  "sliding-window-max":
    "Discarding smaller values from the back is safe because of a dominance argument: if a later element is larger, the earlier smaller one is younger-and-weaker — it leaves the window sooner *and* is smaller, so there is no future window where it could be the maximum while the newcomer is present. It can never be the answer again, so nothing is lost. Each index enters and leaves once, giving O(n) despite the nested-looking loop.",

  "min-window-substring":
    "Two halves. Growing the window can only ever make it valid, and shrinking can only ever make it invalid — so validity is monotone in each direction. That means for each right edge there is exactly one furthest-left valid boundary, and once you shrink to it you never need to revisit it as the right edge advances. Both pointers only move forward, so the scan is linear.",

  "longest-repeating-replacement":
    "The window never shrinks, only slides — which is why the max-frequency count is never recomputed downward. A window is valid when its length minus its most frequent character ≤ k. If it becomes invalid, sliding by one keeps the length the same, and a longer answer can only be found later. Since only a longer window would beat the current best, a stale max-frequency can never cause a wrong answer.",

  "kth-largest-array":
    "Quickselect works because partitioning tells you which side the answer is on without sorting either side. After a partition the pivot sits in its final position, so comparing that position to k discards one whole side. Recursing into one side instead of two gives O(n) average — the recurrence T(n) = T(n/2) + n sums to 2n, not n log n.",

  "task-scheduler":
    "The most frequent task dictates the schedule. It forces (maxCount − 1) gaps of length n between its runs, forming a fixed skeleton, and every other task either slots into those idle gaps or extends the timeline. That gives the formula as a lower bound. When there are enough other tasks to fill every gap, no idling is needed at all, so the answer is simply the total task count — hence the max of the two.",

  "burst-balloons":
    "Thinking about which balloon to pop *first* fails: the neighbours change, so subproblems overlap in a way that doesn't decompose. Fixing which balloon is popped *last* in a range does decompose — at that moment its neighbours are exactly the untouched range boundaries, which are known and fixed. The two sides then become independent subproblems, which is the whole reason interval DP applies.",

  "longest-increasing-subsequence":
    "The patience-sorting array is not the subsequence itself — it holds the smallest possible tail for a subsequence of each length. Keeping tails as small as possible is what maximises future extension, and the array stays sorted because a length-k subsequence's tail is always below a length-(k+1) one's. Sortedness is what allows the binary search, giving O(n log n).",

  "house-robber":
    "At each house you either take it (adding to the best from two back) or skip it (keeping the best from one back). Nothing further back matters, because any earlier state is already folded into those two numbers. That bounded lookback is why two rolling variables replace the whole array without losing information.",

  "best-time-stock":
    "The best sale on day i uses the cheapest price seen before day i — nothing else about the history matters. So a single running minimum is a complete summary of the past, and one pass suffices. This is why the problem is a sliding window and not a DP.",

  "single-number":
    "XOR is associative and commutative, so the order of the array is irrelevant. Every value XORed with itself is 0, and 0 XORed with x is x. So all the paired numbers annihilate regardless of where they sit, and the lone value is what remains — O(1) space with no hash map.",

  "missing-number":
    "Two exact identities, either of which works. XOR every index together with every value: each present number cancels its own index, leaving only the missing one. Or sum 0..n by the closed form and subtract the actual sum. Both rely on knowing the complete expected multiset in advance, which is what makes O(1) space possible.",

  "coin-change":
    "The greedy 'take the largest coin' fails on sets like {1,3,4} for amount 6 — it gives 4+1+1 rather than 3+3. That failure is why DP is needed: the best way to make an amount genuinely depends on the best ways to make every smaller amount, not on a local choice. Solving amounts in increasing order guarantees each subproblem is final before it's used.",

  "word-break":
    "The state 'can the first i characters be segmented?' is enough because *how* the prefix was split never affects the suffix — only that a valid split exists at that boundary. That independence is what collapses exponential branching into a linear scan over positions, and it's why memoising on the index alone is sufficient.",

  "climbing-stairs":
    "The last move to reach step n was either a 1-step or a 2-step, and those two cases are disjoint and exhaustive. So the count of routes to n is exactly the count to n−1 plus the count to n−2 — which is the Fibonacci recurrence arriving from a counting argument rather than by pattern-matching.",

  "validate-bst":
    "Checking each node against only its immediate children is the classic wrong answer: a node deep in the left subtree can still exceed the root and satisfy every local check. The BST property is about *ranges*, not neighbours, so the valid interval has to be narrowed as you descend. Equivalently, an inorder traversal must come out strictly increasing.",

  "lru-cache":
    "Each half covers the other's weakness. A hash map finds a key in O(1) but knows nothing about order; a doubly linked list reorders in O(1) but can't find anything without scanning. Storing node pointers *in* the map lets you jump straight to a node and then unlink it in constant time, which neither structure achieves alone.",

  "merge-intervals":
    "Sorting by start time means any interval that overlaps the current one must come immediately next — there's no way for a later interval to reach back over a gap already passed. That's why comparing only against the most recent merged interval is sufficient, instead of checking against all previous ones.",

  "meeting-rooms-ii":
    "Rooms needed equals the maximum number of meetings in progress at any instant. Treat each start as +1 and each end as −1, sweep the timeline in chronological order, and the running total's peak is the answer. This is why the correct comparison is start-vs-earliest-end, not interval-vs-interval.",

  // ── Arrays & Hashing ──────────────────────────────────────────────────
  "contains-duplicate":
    "A set answers 'have I seen this before' in O(1), and seeing a value twice is the definition of a duplicate. The check has to happen before insertion, or every element matches itself. Sorting also works and uses no extra space — the set trades space to remove the log factor.",
  "valid-anagram":
    "Anagram is a claim about multisets, not order. A frequency count is the canonical form of a multiset, so two strings are anagrams exactly when their counts agree. In the single-pass increment/decrement version the length check isn't an optimisation but a correctness guard: unequal lengths can still net to zero.",
  "two-sum":
    "Rearranged, a + b = target becomes b = target − a. That turns 'find a pair' into 'have I already seen the complement', which a hash map answers in O(1). Checking the map before inserting the current element is what stops a number from pairing with itself.",
  "group-anagrams":
    "Grouping needs a key identical for members and different for everything else. Sorted letters — or the 26-slot count signature — is exactly that canonical form: every anagram maps to it and nothing else does. Correctness rests entirely on the key being a true invariant of the group.",
  "top-k-frequent":
    "Counting is O(n) but sorting the counts costs O(n log n). Bucket sort exploits a bound the problem hands you: a frequency can never exceed n, so there are only n+1 possible buckets. Indexing by frequency replaces comparison altogether, which is what gets it to O(n).",
  "encode-decode-strings":
    "Any delimiter can also appear inside the payload, so delimiters alone are ambiguous. Length-prefixing removes the ambiguity: the decoder reads a count and then consumes exactly that many characters without inspecting them. No character is special, which is why the scheme survives arbitrary input.",
  "product-except-self":
    "Division is the obvious route and breaks on zeros. Instead each answer is everything to its left times everything to its right, which two accumulating passes produce directly. Neither pass ever divides, so zeros are handled as ordinary factors rather than as a special case.",
  "valid-sudoku":
    "Validity is nine independent constraints per unit type, and the units partition the board. Encoding each cell's row, column and box membership as three distinct keys lets one pass over 81 cells check all of them, since a duplicate in any unit shows up as a repeated key. Box index (r/3)*3 + c/3 is what makes box membership a lookup instead of a scan.",
  "longest-consecutive":
    "The naive version re-walks the same run from every one of its members. The fix is to start a run only from a value whose predecessor is absent — a condition true exactly once per run. So despite the nested loop each element is visited at most twice overall, which is why it is O(n) and not O(n²).",

  // ── Two Pointers ──────────────────────────────────────────────────────
  "valid-palindrome":
    "A palindrome is defined by symmetry about its centre, so converging from both ends checks every required pair and no others. Skipping non-alphanumeric characters in place, rather than building a cleaned copy first, is what keeps it O(1) space.",
  "two-sum-ii":
    "Sortedness makes each pointer move provable rather than heuristic. If the current sum is too small, no pair using this left index with any smaller right index can reach the target either — so an entire column of candidates dies in one move. Each step eliminates a set, which is why one sweep suffices.",

  // ── Sliding Window ────────────────────────────────────────────────────
  "longest-substring":
    "The window is valid when it holds no repeat. Growing can introduce a repeat and shrinking can only remove one, so validity is monotone in each direction. Jumping the left edge straight past the previous occurrence — rather than stepping — is safe because every position in between is already known to be invalid.",
  "permutation-in-string":
    "A permutation is a multiset, so only counts matter and order can be ignored entirely. Because the window has fixed width, exactly one character enters and one leaves per step, so the count vector updates in O(1) instead of being rebuilt. Tracking how many of the 26 counts currently match avoids re-comparing all of them each step.",

  // ── Stack ─────────────────────────────────────────────────────────────
  "valid-parentheses":
    "Bracket nesting is last-opened-first-closed, which is precisely a stack's discipline. A closer can only legally match the most recent unmatched opener, so no other candidate need be considered. Finishing with a non-empty stack catches openers that were never closed — a case a simple counter misses once bracket types are mixed.",
  "min-stack":
    "The minimum can only change on push and pop, and a pop must restore the previous minimum — which requires history, not one variable. Storing the running minimum alongside each element carries that history at no extra asymptotic cost, keeping every operation O(1).",
  "reverse-polish":
    "Postfix needs no precedence rules and no parentheses because the evaluation order is already encoded in the ordering. An operator's operands are always the two most recent results, which is exactly what sits on top of a stack, so one left-to-right pass evaluates it with no lookahead.",
  "generate-parentheses":
    "Rather than generate 2^(2n) strings and filter, prune during construction. Two invariants guarantee every partial string is still completable: never place more than n of either bracket, and never let closers exceed openers. Because every leaf reached is valid by construction, no final validity check is needed.",
  "daily-temperatures":
    "A day still waiting for something warmer is an unanswered question, and those accumulate in decreasing temperature order. A warmer day resolves every pending day it exceeds, and each of those is popped and never revisited. Every index is pushed and popped at most once, so it is O(n) despite the inner loop.",
  "car-fleet":
    "Process cars from the one nearest the target backwards. A car joins the fleet ahead exactly when its arrival time is no greater, and once absorbed its own time stops mattering — the fleet moves at the slower car's pace. So only the running maximum arrival time survives, and each new maximum marks a new fleet.",
  "largest-rectangle-histogram":
    "A bar's rectangle extends until a strictly shorter bar stops it on either side. Keeping the stack in increasing height order means that when a shorter bar arrives, every taller bar on the stack has just found its right boundary, and the element beneath it is its left boundary. Both bounds arrive without any scanning, which is the whole trick.",

  // ── Binary Search ─────────────────────────────────────────────────────
  "binary-search":
    "Sortedness means one comparison against the midpoint is a verdict on an entire half rather than a single element. Halving each step gives log n. The loop bound and the midpoint update must together strictly shrink the range — when they don't, the search spins, which is the source of nearly every binary search bug.",
  "search-2d-matrix":
    "A matrix whose rows are sorted and whose rows are themselves in order is just a sorted array that has been folded into a grid. Mapping a flat index i to (i / cols, i % cols) unfolds it, so one ordinary binary search over m*n virtual positions works. No separate row-then-column search is needed.",
  "time-based-key-value":
    "Timestamps for a given key only increase, so appending keeps each key's history sorted at no cost. The query asks for the largest timestamp not exceeding a target — a floor search, the binary search variant that records a candidate on a match and keeps moving right to find the last qualifying one.",

  // ── Linked List ───────────────────────────────────────────────────────
  "reverse-linked-list":
    "Reversal flips each next pointer, and the instant you flip one you lose the route forward. That is why the next node must be saved before the flip, not after. Three pointers — previous, current, saved-next — are the minimum state required to flip one link without stranding the remainder of the list.",
  "merge-two-sorted":
    "Both inputs are sorted, so the smallest unplaced element overall is always at one of the two heads. Comparing just those two is therefore sufficient at every step, and the whole merge is one pass. A dummy head removes the special case of picking the very first node.",
  "reorder-list":
    "The target order needs the last node, then the second, then the second-to-last — a backwards walk a singly linked list cannot perform. Reversing the second half converts that backwards traversal into a forward one, after which the two halves simply zip together in a single pass.",
  "remove-nth-node":
    "Deleting the nth node from the end requires the node before it, but the length is unknown. Starting a second pointer n nodes ahead fixes that gap permanently, so when the leader reaches the end the trailer is exactly where it needs to be. One pass, no length count, and a dummy head handles removing the first node.",
  "copy-list-random":
    "A random pointer may target a node that has not been copied yet, so a single straight walk cannot resolve it. A map from original to copy lets any target resolve regardless of visit order. The O(1)-space variant instead weaves each copy directly behind its original, so a copy's random is always reachable as original.random.next.",
  "add-two-numbers":
    "Converting both lists to integers overflows once the lists are long. Digit-by-digit addition with a carry mirrors written arithmetic and works at any length. The loop must continue while either list has digits left or a carry is still outstanding — that trailing carry is what produces a result longer than both inputs.",
  "merge-k-sorted":
    "The next element of the output is the smallest among the k current heads, so a heap of size k answers each step in log k, giving O(N log k). Merging the lists one at a time is O(N·k) because early lists get re-traversed on every merge. Divide-and-conquer pairing reaches the same bound by halving the list count each round.",
  "reverse-k-group":
    "Each group is an ordinary reversal, but the groups must stay stitched together, so the node before the group and the node after it both have to be captured before reversing. Checking that k nodes actually remain before starting is what correctly leaves a trailing partial group untouched.",

  // ── Trees ─────────────────────────────────────────────────────────────
  "invert-binary-tree":
    "Mirroring is defined recursively: a tree is the mirror of another when their subtrees are swapped mirrors of each other. Swapping the two children at every node applies that definition exactly once per node, and because the swap is purely local the traversal order makes no difference.",
  "max-depth-tree":
    "The depth of a tree is one more than the deeper of its two subtrees — a definition that is already the algorithm. Every node must be visited because any leaf might be the deepest one, so O(n) here is required rather than merely achieved.",
  "diameter-tree":
    "The longest path either bends at a node or lies wholly within one subtree. At each node the bending candidate is leftHeight + rightHeight, so computing heights bottom-up lets every candidate be evaluated during the same traversal that produces those heights. Recomputing heights separately is exactly what makes the naive version O(n²).",
  "balanced-tree":
    "Returning a sentinel for 'already unbalanced' instead of a height lets the failure propagate straight to the top, so no further work is wasted. That is the whole difference from the naive version, which recomputes each subtree's height independently and lands at O(n²).",
  "same-tree":
    "Structural equality is recursive: equal values, equal left subtrees, equal right subtrees. Both-null is the base case that succeeds. Exactly-one-null must fail, and that check is what catches two trees holding the same values in different shapes.",
  "subtree-of-another":
    "The match could begin at any node, so every node is a candidate root and each candidate needs a full structural comparison. Anchoring only on nodes whose value equals the subtree's root prunes most attempts, but correctness never depends on that pruning — only on trying every anchor.",
  "lowest-common-ancestor":
    "In a BST the values themselves reveal the direction. If both targets sit below the current node, the answer is to the left; if both above, to the right. The first node that splits them — or that equals one of them — is the lowest node containing both, so no upward walk or parent pointers are needed.",
  "level-order-traversal":
    "A queue emits nodes in non-decreasing depth, so all nodes of a level are contiguous in the output. Recording the queue's size before draining it is what carves that contiguous run into a discrete level, without having to store a depth on every node.",
  "right-side-view":
    "The visible node is the last one at each depth. Taking the final element of each BFS level gives it directly. Equivalently a DFS that visits right before left reaches each depth's rightmost node first, so the first node seen at a newly reached depth is the answer.",
  "count-good-nodes":
    "Goodness depends on the entire root-to-node path, not just the parent. Passing the running maximum down as an argument makes that path context available in O(1) at each node, so one traversal suffices instead of walking back toward the root from every node.",
  "kth-smallest-bst":
    "Inorder traversal of a BST emits values in sorted order — that is the defining property of the structure. So the kth value emitted is the answer, and the traversal can stop the moment a counter reaches k rather than materialising the entire sequence first.",
  "construct-tree-preorder":
    "Preorder's first element is always the root, and inorder splits at that root into exactly the left and right subtrees. Together the two orders determine the tree uniquely, which neither does alone. A hash map from value to inorder index replaces the linear search for the split point, turning O(n²) into O(n).",
  "max-path-sum":
    "A path may bend at a node, but what a node can contribute upward cannot — a parent can only continue through one branch. So each call returns the best single-branch total while separately updating a global best using the bending value. Negative branches clamp to zero because dropping a branch is always permitted.",
  "serialize-deserialize":
    "Preorder alone is ambiguous, because shape cannot be recovered from values. Emitting explicit null markers makes the stream uniquely decodable: reconstruction consumes tokens in exactly the order they were produced, so the recursion rebuilds the original shape rather than merely a tree with the same values.",

  // ── Tries ─────────────────────────────────────────────────────────────
  "implement-trie":
    "A trie makes lookup cost proportional to word length rather than dictionary size, because shared prefixes are stored once. The end-of-word flag is what separates a stored word from a mere prefix — without it, inserting 'apple' would make 'app' report as present.",
  "add-search-words":
    "A wildcard destroys the single-path guarantee that makes trie lookup fast. At a '.', every child is a possible continuation, so the search branches into a DFS over the trie. Correctness requires exploring all of them; only a concrete character keeps the walk down one path.",
  "word-search-ii":
    "Running one grid DFS per word repeats the same prefix walks over and over. Putting the whole dictionary in a trie lets a single DFS carry a trie node alongside the grid position, matching every word simultaneously and abandoning a path the instant its prefix leaves the trie. That shared pruning is the entire gain.",

  // ── Heap / Priority Queue ─────────────────────────────────────────────
  "kth-largest-stream":
    "Hold exactly k elements in a min-heap, so its root is the kth largest by construction. Anything smaller than that root can never enter the top k and is discarded immediately, so the heap never grows beyond k. That bound is what makes each add O(log k) rather than O(log n).",
  "last-stone-weight":
    "Only the two heaviest stones ever matter, and a smash produces a new stone that must be re-ranked among the rest. A max-heap answers 'two heaviest' and reinserts in O(log n), where re-sorting the array after every smash would cost O(n log n) each time.",
  "k-closest-points":
    "The actual distance is never needed, only the ordering — and squaring is monotone over non-negative values, so squared distances sort identically to real ones with no square root. A heap capped at k then keeps the closest k in O(n log k) instead of sorting everything.",
  "design-twitter":
    "A feed is a merge of the followees' tweet lists, each already in time order. That is exactly k-way merge, so a heap over the k list heads yields the ten most recent without materialising or sorting the union. A global incrementing timestamp supplies the total order the merge depends on.",
  "find-median-stream":
    "Split the data into a max-heap holding the lower half and a min-heap holding the upper half. Keep their sizes within one of each other and the median is always sitting at one or both roots — an O(1) read. Rebalancing costs O(log n) per insert, against O(n log n) to re-sort on every query.",

  // ── Backtracking ──────────────────────────────────────────────────────
  "subsets":
    "Each element is independently in or out, which is one binary decision per element and therefore exactly 2^n outcomes. The recursion tree enumerates those decisions without ever repeating one, so every subset is produced exactly once and no deduplication is required.",
  "combination-sum":
    "Reuse is allowed, so the recursion may stay on the same index — but it must never return to an earlier one, or the same multiset would be counted again in a different order. That single restriction is what makes each combination unique without needing a set.",
  "permutations":
    "Order matters here, so unlike subsets every position must consider every unused value. The used-marker prevents an element appearing twice within one arrangement, and clearing it on the way back out is what lets sibling branches use it again.",
  "subsets-ii":
    "Duplicate values would otherwise generate identical subsets from different positions. Sorting brings equal values adjacent, and skipping a value equal to its predecessor at the same recursion depth blocks precisely the repeated branches — while still allowing that value to be used deeper along the current path.",
  "combination-sum-ii":
    "Same duplicate-skip rule as Subsets II, plus each element may be used at most once, so the recursion advances past the current index. Sorting also enables an early exit: once the remaining target drops below the current candidate, every later candidate is too large as well.",
  "word-search":
    "A path may not revisit a cell, so cells are marked on the way in and unmarked on the way out — leaving them marked would wrongly block unrelated paths that pass through later. Returning immediately on success avoids exploring the rest of the grid once the word is found.",
  "palindrome-partitioning":
    "The decisions are the cut positions, giving 2^(n−1) partitions. Testing a prefix for palindromicity before recursing prunes the branch at once rather than validating a whole partition at a leaf, and that early rejection is where nearly all the saving comes from.",
  "letter-combinations":
    "Each digit multiplies the possibilities by its letter count, so the recursion's depth is the number of digits and its branching factor is per-digit. Every leaf is a complete valid combination by construction, so nothing needs filtering afterwards.",
  "n-queens":
    "Assuming one queen per row collapses the search from choosing squares to choosing a column for each row. Conflicts then reduce to three sets — column, and the two diagonals — because row−col is constant along one diagonal and row+col along the other. That makes each safety check O(1) instead of a board scan.",

  // ── Graphs ────────────────────────────────────────────────────────────
  "number-of-islands":
    "Every land cell belongs to exactly one island, so flooding a cell's entire component the first time you reach it — marking as you go — means later encounters are skipped. The number of times you *start* a flood is therefore the component count. Marking during the flood, not after, is what prevents double counting.",
  "max-area-island":
    "Same component decomposition as counting islands, except the flood returns a size rather than nothing. Because each cell is visited once across all floods combined, accumulating within a flood is free — total work stays O(m·n) no matter how many islands there are.",
  "clone-graph":
    "The graph can contain cycles, so a naive DFS would recurse forever. A map from original node to clone doubles as the visited set: an existing entry means the node is already cloned and can simply be linked. Creating the clone *before* recursing into neighbours is what actually breaks the cycle.",
  "walls-gates":
    "One BFS per empty room is O((mn)²). Reversing it — seeding a single BFS with every gate at once — works because BFS expands in distance order, so the first time a room is reached it is by its nearest gate and can be settled permanently. Each cell is written once, giving O(m·n).",
  "rotting-oranges":
    "Every initially rotten orange spreads simultaneously, which is multi-source BFS. Draining the queue one whole level at a time makes each level exactly one minute, and since BFS reaches each cell by its shortest path, the level on which the last orange rots is the minimum possible time.",
  "pacific-atlantic":
    "Asking 'can this cell reach an ocean' from all cells is O((mn)²). Inverting the question — start at each ocean's border and walk *uphill* — computes reachability for every cell in two sweeps. A cell found by both sweeps drains to both oceans, so the answer is simply the intersection.",
  "surrounded-regions":
    "A region survives only if it touches the border, so rather than test each region for enclosure, flood inward from the border and mark everything reached as safe. Whatever remains unmarked is enclosed by definition. Inverting the question turns a per-region test into one pass.",
  "course-schedule":
    "A valid schedule exists exactly when the prerequisite graph is acyclic. Kahn's algorithm repeatedly removes nodes with no outstanding prerequisites; if every node is removed, no cycle exists. Anything left behind must sit on a cycle, since each survivor still depends on another survivor.",
  "course-schedule-ii":
    "The same cycle test, except the removal order *is* the answer — a course is emitted only once everything it depends on has been. That is precisely the definition of a topological order. An output shorter than the course count signals a cycle, so validity and ordering fall out of one pass.",
  "graph-valid-tree":
    "A tree is exactly a connected acyclic graph, which for n nodes is equivalent to having exactly n−1 edges *and* being connected. Both checks are needed: n−1 edges alone permits a cycle plus a detached node, and connectivity alone permits extra edges forming a cycle.",
  "num-connected-components":
    "Union-find merges the endpoints of every edge, so afterwards two nodes share a root exactly when some path connects them. The number of distinct roots is therefore the component count — obtained without traversing the graph at all.",
  "redundant-connection":
    "Process edges in order with union-find. The first edge whose endpoints already share a root is the one closing a cycle: they were connected before this edge existed, so it is redundant. Scanning in input order guarantees the last such edge is the one returned, as the problem requires.",
  "word-ladder":
    "Each single-letter transformation is one edge, so the shortest sequence is a shortest path in an unweighted graph — where BFS is optimal. Generating neighbours through wildcard patterns avoids comparing every pair of words. Marking a word visited when it is enqueued, not dequeued, is what stops it entering the frontier many times.",

  // ── Advanced Graphs ───────────────────────────────────────────────────
  "reconstruct-itinerary":
    "Every ticket must be used exactly once, so this is an Eulerian path, not a shortest path. Hierholzer's algorithm walks until stuck, and the node where it gets stuck must be the route's end — so appending nodes as they dead-end and reversing at the finish yields a valid path. Taking destinations in lexical order makes it the smallest one.",
  "min-cost-connect-points":
    "Connecting all points at minimum total cost is a minimum spanning tree. The cut property licenses the greed: for any partition of the nodes, the cheapest edge crossing it belongs to some MST. So repeatedly taking the cheapest safe edge can never rule out the optimum.",
  "network-delay-time":
    "The time to reach everyone is the maximum shortest-path distance from the source, so it is single-source shortest paths followed by a max. Dijkstra applies because all delays are non-negative — that is exactly the condition under which settling the nearest unsettled node is final and never needs revising.",
  "swim-rising-water":
    "A path's cost here is its maximum cell, not its sum, making this a minimax path problem. Dijkstra still works with relaxation changed from addition to max, because taking the smallest-maximum frontier node first is still final. Binary searching the water level with a reachability test is the equivalent formulation.",
  "alien-dictionary":
    "Each adjacent pair of words contributes exactly one ordering constraint, at their first differing character — nothing after that position tells you anything. Topologically sorting those constraints yields a consistent alphabet, and a cycle means the input contradicts itself. The subtle invalid case is a longer word placed before its own prefix, which no ordering can satisfy.",
  "cheapest-flights":
    "Plain Dijkstra fails because the cheapest route to a city may use too many stops, so a city cannot be settled once and for all — the real state is (city, stops used), not city alone. Bellman-Ford relaxed exactly k+1 times enforces the limit naturally, since after i rounds only paths of at most i edges have been considered.",

  // ── 1-D Dynamic Programming ───────────────────────────────────────────
  "min-cost-climbing":
    "You arrive at a step from one below or two below, so the cheapest arrival is the smaller of those two totals plus this step's cost. Both step 0 and step 1 are legal starting points, which is why they are seeded at zero rather than at their own cost.",
  "house-robber-ii":
    "The circle matters only because the first and last houses are adjacent, so they can never both be robbed. Running the straight-line solution twice — once excluding the first house, once excluding the last — covers every legal configuration between them, and the answer is the better run.",
  "longest-palindromic-substr":
    "Every palindrome has a centre, and there are only 2n−1 of them once you include the gaps between characters for even lengths. Expanding outward from a centre finds the longest palindrome about it, so sweeping all centres is exhaustive — O(n²) time with no table at all.",
  "palindromic-substrings":
    "The same centre argument as the longest-palindrome version; the only difference is that each successful expansion is counted rather than compared. Every successful step outward is one more distinct palindromic substring, so the total accumulates as you expand.",
  "decode-ways":
    "The final decoding step consumed either one digit or two, and those cases are disjoint and exhaustive, so their counts add. A leading zero can never stand alone and anything above 26 can never pair — which is how an undecodable string correctly collapses to zero and propagates that forward.",
  "max-product-subarray":
    "Unlike sums, a product's ranking can invert: multiplying by a negative turns the smallest into the largest. So the maximum alone is not a sufficient state — the running minimum has to travel alongside it. That is the single structural difference from Kadane's algorithm.",
  "partition-equal-subset":
    "An equal split means finding a subset summing to half the total, so an odd total is impossible immediately. That reduces the problem to subset-sum: a boolean table of reachable sums where each item is offered once. Iterating sums downward is what prevents a single item being counted twice.",

  // ── 2-D Dynamic Programming ───────────────────────────────────────────
  "unique-paths":
    "A cell is reachable only from above or from the left, and those two route sets are disjoint, so their counts add. The first row and column have exactly one route each, anchoring the recurrence. The binomial closed form is the same count derived combinatorially rather than by table.",
  "longest-common-subsequence":
    "When the characters match, an optimal answer can always be taken to use that match, so it extends the diagonal. On a mismatch at least one of the two characters is unusable, so the answer is the better of dropping one or the other. Those cases are exhaustive, which is why two indices fully describe the state.",
  "buy-sell-cooldown":
    "Holding stock, having just sold, and being free to buy all behave differently, so the day alone cannot describe where you are — the state is the day plus which mode you are in. The cooldown then becomes a restriction on one transition rather than a special case scattered through the logic.",
  "coin-change-ii":
    "This counts combinations, not permutations, so loop order is the entire problem. Putting coins in the outer loop fixes an order in which coins may be used, so 1+2 and 2+1 are never both counted. Swapping the loops silently changes the answer to permutations — same code shape, different problem.",
  "target-sum":
    "Every element takes a + or a −, so the positive subset determines everything. If P is the positive sum then P − (total − P) = target, giving P = (total + target) / 2 — a fixed number. That converts sign assignment into a subset-sum count, and a non-integer or out-of-range P means no assignment exists.",
  "interleaving-string":
    "An interleaving consumes characters from s1 and s2 in order, so the state is how many of each have been used — and the position in s3 is implied, since it is their sum. That is why a two-dimensional table suffices for what appears to be a three-string problem.",
  "longest-increasing-path-matrix":
    "No visited set is needed and no cycle is possible, because every move must go strictly uphill — the values themselves impose a DAG on the grid. That acyclicity is exactly what licenses memoisation: a cell's longest path never depends on how you arrived at it.",
  "distinct-subsequences":
    "On a matching character you may either use it or skip it, and those produce genuinely different subsequences, so their counts add. On a mismatch the character must be skipped. Because the answer is a count rather than an optimum, the recurrence sums where LCS would take a maximum.",
  "edit-distance":
    "The last operation was an insert, a delete, or a replace, and each corresponds to one neighbouring cell — so the cost is one plus the cheapest of the three. Matching characters cost nothing and move diagonally. Row and column zero encode transforming to or from the empty string, which is why they count upward.",
  "regular-expression-matching":
    "The star is the only real difficulty, since it can consume zero characters or many. Splitting it into exactly those two cases — skip the pattern pair entirely, or consume one character and keep the star available — is exhaustive. Memoising on the index pair is what stops the same split being re-explored exponentially.",

  // ── Greedy ────────────────────────────────────────────────────────────
  "merge-triplets":
    "Only component-wise maxima are ever taken, so a triplet with any component exceeding the target is poison — once merged, that excess can never be undone. Discard those, and the only remaining question is whether the survivors collectively reach the target in each position, which one pass answers.",
  "valid-parenthesis-string":
    "A single counter fails because '*' is ambiguous. Tracking a range of possible open counts — a low and a high — represents every interpretation simultaneously. The string is valid when the high never drops below zero and the low returns to zero, with low clamped at zero since a negative open count is not a real state.",

  // ── Intervals ─────────────────────────────────────────────────────────
  "insert-interval":
    "The input is sorted and non-overlapping, so the intervals overlapping the new one form a single contiguous run. That is what splits the work into three phases — before, merging, after — with nothing ever revisited. A full re-sort would be discarding exactly that contiguity.",
  "meeting-rooms":
    "One person can attend everything precisely when no two meetings overlap. After sorting by start time, any overlap must involve an adjacent pair, so checking neighbours is sufficient — a non-adjacent overlap would necessarily force an adjacent one as well.",
  "min-interval-query":
    "Sorting both the intervals and the queries lets a pointer admit intervals as they become relevant and never take them back. A min-heap keyed by interval size then exposes the smallest containing interval in O(log n), while intervals that have expired are discarded lazily from the top instead of being searched for.",

  // ── Math & Geometry ───────────────────────────────────────────────────
  "rotate-image":
    "A 90-degree rotation decomposes into two in-place reflections: transpose across the main diagonal, then reverse each row. Composing two reflections avoids reasoning about a four-way cyclic swap and needs no second matrix, which is what keeps it O(1) space.",
  "spiral-matrix":
    "Four boundaries completely describe the unvisited rectangle, so the state is four integers rather than a visited grid. Each pass consumes one edge and shrinks its boundary, which guarantees termination. Re-checking the boundaries before the bottom and left passes is what stops a lone remaining row or column being walked twice.",
  "set-matrix-zeroes":
    "The naive in-place attempt fails because a zero written during the pass is indistinguishable from an original one, so clearing cascades. Recording which rows and columns must be cleared *before* clearing anything separates detection from mutation — and using the first row and column as that record is what achieves O(1) space.",
  "happy-number":
    "The digit-square sum of any number below 1000 stays below 1000, so the sequence is trapped in a finite set and must therefore either reach 1 or repeat. Repetition is a cycle, so Floyd's two pointers detect an unhappy number in O(1) space without a seen-set.",
  "plus-one":
    "Adding one only propagates while the digit is 9, so the scan can stop at the first digit below 9 and return immediately. All-nines is the sole case that lengthens the number, and its result is always 1 followed by zeros — so it can be constructed directly rather than shifted.",
  "pow-x-n":
    "x^n = (x^(n/2))² when n is even, halving the exponent each step for O(log n) instead of O(n); an odd exponent peels off one factor first. A negative exponent inverts the base, and n = INT_MIN must be widened to a long first, because negating it overflows.",
  "multiply-strings":
    "Digit i of one number times digit j of the other always lands on positions i+j and i+j+1 of the result. That positional identity is what lets the entire product accumulate into a fixed-size array with no intermediate string addition, resolving all carries in a single pass afterwards.",
  "detect-squares":
    "An axis-aligned square is fully determined by one corner plus a diagonal corner, so iterating candidate diagonal points is exhaustive without any nested search over all pairs. Multiplying the three other corners' stored counts handles duplicate points correctly, since each distinct combination is a separate square.",

  // ── Bit Manipulation ──────────────────────────────────────────────────
  "number-1-bits":
    "n & (n−1) clears exactly the lowest set bit: subtracting one flips that bit off and turns every bit below it on, which the AND then wipes out. So the loop runs once per set bit rather than 32 times — proportional to the answer, not to the word size.",
  "counting-bits":
    "The bit count of i equals the count of i with its lowest set bit removed, plus one — and i & (i−1) is always strictly smaller than i, so that value has already been computed. Each answer therefore costs O(1), giving O(n) overall instead of O(n log n).",
  "reverse-bits":
    "Bit i must land at position 31−i, a fixed permutation that does not depend on the value at all. Shifting the result left while shifting the input right realises that permutation in one pass. Divide-and-conquer masks achieve it in five steps by swapping progressively larger blocks.",
  "reverse-integer":
    "The digits reverse by repeated modulo and division, but the reversed value can exceed the 32-bit range even when the input does not. The overflow check has to happen *before* the final multiply-and-add, comparing against INT_MAX/10 — checking afterwards means the overflow already occurred and the value is meaningless.",
  "sum-two-integers":
    "Addition decomposes into the carry-free sum and the carries themselves. XOR gives the first, since in each bit position it is addition modulo two; AND shifted left by one gives the second, marking the column each carry must land in. Feeding both back repeats the process, and it terminates because every round pushes the remaining carries strictly leftward until none are left.",
};
