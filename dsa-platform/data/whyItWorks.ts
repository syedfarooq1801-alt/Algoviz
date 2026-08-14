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
};
