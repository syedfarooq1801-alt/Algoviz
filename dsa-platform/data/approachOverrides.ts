// Rewritten `approach` steps for problems whose steps were pseudo-code.
//
// The old steps restated the solution line by line — "l=0, r=n-1", "maxP =
// max(nums[i], maxP * nums[i])". The actual code sits directly below the
// approach on the page, so a step that repeats it says nothing twice and
// never explains why the step is there. A walkthrough should give the
// reasoning: what the invariant is, why the choice is safe, what would break.
//
// Rules: no assignments, no array indexing, no operators standing in for
// English. Name the invariant. Say why a greedy choice is safe or why a
// pointer moves the way it does. Three to five steps.
//
// Keyed by problem id; merged in data/problemContent.ts.

export const APPROACH_OVERRIDES: Record<string, string[]> = {
  "is-subsequence": [
    "Walk through t with one pointer, and keep a second pointer parked on the first character of s that hasn't been matched yet.",
    "Whenever the current character of t is the one s is waiting for, advance s's pointer — that character is now accounted for, in order.",
    "Advance through t unconditionally: a character of t that doesn't match is simply skipped, which is exactly what being a subsequence allows.",
    "s is a subsequence precisely when its pointer reached the end, meaning every character found a match without ever going backwards.",
  ],

  "find-duplicate-number": [
    "Read each value as a pointer to the index it names. With n+1 slots holding values in 1..n, some index gets pointed at twice, and that duplicate is the entrance to a cycle.",
    "Phase one: advance one pointer a step at a time and another two at a time until they collide. The collision proves a cycle exists but is not itself the answer.",
    "Phase two: restart one pointer at the beginning and advance both one step at a time.",
    "They meet exactly at the cycle's entrance, and that entrance is the duplicated value — found without modifying the array or using extra space.",
  ],

  "swap-pairs": [
    "Stop when fewer than two nodes remain: a single node or an empty list is already in its final order.",
    "Within a pair, the second node is the one that ends up in front, so it becomes the head this call returns.",
    "Recurse on everything past the pair first, and hang the result off the original first node.",
    "Point the second node back at the first to complete the swap. Each call handles exactly one pair and trusts recursion for the rest.",
  ],

  "decode-ways": [
    "Let the state be the number of ways to decode the first i characters. The empty prefix has exactly one decoding, which seeds everything.",
    "At each position, ask two independent questions. Can this character stand alone? Yes unless it's '0', and if so it inherits every decoding of the prefix before it.",
    "Can it pair with the previous character? Only if those two digits read as 10 through 26, and if so it inherits the decodings from two positions back.",
    "Add whichever readings are legal. When neither is, the count becomes zero and correctly propagates forward to kill the whole string.",
  ],

  "max-product-subarray": [
    "Track both the largest and the smallest product ending at the current position. The smallest matters because one more negative flips it into the largest.",
    "When the current number is negative it inverts that ordering, so exchange the two running products before extending them.",
    "Extend each running product by the current number, or abandon it and restart from the number alone — whichever is better.",
    "The answer is the best value the running maximum ever reached, not its final value.",
  ],

  "search-rotated": [
    "Binary search still applies: however a rotated array is split at the midpoint, at least one of the two halves is guaranteed to be sorted.",
    "Compare the midpoint against the left end to work out which half that is.",
    "Check whether the target falls inside the sorted half's known range. If it does, discard the other half; if it doesn't, discard the sorted one.",
    "Either way the search space halves each round, so the rotation costs nothing asymptotically.",
  ],

  "jump-game-ii": [
    "Think of it as breadth-first search on levels: level k is every index reachable in exactly k jumps.",
    "Sweep forward while tracking the furthest index reachable from anywhere in the current level.",
    "When the sweep reaches the end of the current level, that level is exhausted — spend a jump, and the next level ends at the furthest index found.",
    "The number of level boundaries crossed is the minimum number of jumps; no backtracking is ever needed.",
  ],

  "partition-labels": [
    "A partition cannot close before the last occurrence of any character inside it, so first record where each character last appears.",
    "Sweep the string keeping the furthest last-occurrence seen so far. That index is the earliest point this partition could possibly end.",
    "When the current position reaches that index, every character in the stretch is fully contained — close the partition here.",
    "Begin the next partition at the following index. Greedy is safe because closing any earlier would split some character across two parts.",
  ],

  "insert-interval": [
    "Pass through every interval that ends before the new one begins — they cannot overlap, so they need no changes.",
    "Then absorb the overlapping run: while an interval starts before the new one ends, widen the new interval to swallow it.",
    "Emit the widened interval once that run is exhausted.",
    "Copy the remaining intervals across untouched. The result stays sorted because the input was and the merged interval sits exactly where the run was.",
  ],

  "trapping-rain-water": [
    "Water above a bar is limited by the shorter of the tallest bar to its left and the tallest to its right.",
    "Walk two pointers inward from both ends, each carrying the running maximum it has seen so far.",
    "Always advance whichever side currently has the shorter bar. That side's running max is then provably the limiting wall, because the opposite side is already at least as tall.",
    "That guarantee lets you bank the water for that bar immediately — one pass, constant space, no precomputed arrays.",
  ],

  "permutations": [
    "Build one permutation position by position, keeping a record of which values are already placed.",
    "At each depth, try every value not yet used, placing it and recursing to fill the next position.",
    "When the path reaches full length, every position is filled — record a copy of it.",
    "Undo the choice on the way back out so a single shared path can be reused for every branch instead of copying at each step.",
  ],

  "detect-squares": [
    "Keep a count for each exact point, plus a lookup from x-coordinate to the y values seen on that vertical line.",
    "For a query point, treat it as one corner. Any other point on the same vertical line gives a candidate side length.",
    "That side length plus a direction — left or right — fully determines the other two corners, so there is nothing left to search for.",
    "Multiply the three other corners' counts, since duplicate points each form a separate square, and total over every candidate.",
  ],

  "sum-two-integers": [
    "Addition splits into two independent pieces: the sum if you ignore every carry, and the carries themselves.",
    "XOR produces the carry-less sum, since in each bit position it is exactly addition without carrying.",
    "AND finds the positions that generate a carry, and shifting it left by one moves each carry to the column it belongs in.",
    "Feed those two values back in and repeat until no carry remains. What's left is the answer.",
  ],

  "sliding-window-max": [
    "Keep a deque of indices whose values decrease from front to back, so the front is always the maximum of the current window.",
    "Before pushing a new index, discard every index at the back with a smaller value — while the newcomer is in the window, none of them can ever be the maximum again.",
    "Discard the front index once it falls outside the window's left edge.",
    "Once the window reaches full width, the value at the front index is that window's answer. Each index is pushed and popped once, so the sweep is linear.",
  ],

  "find-first-last-position": [
    "Run binary search twice, each pass biased toward a different end of the matching block.",
    "For the first occurrence, do not stop on a match — keep searching to the left, because an earlier match may still exist.",
    "For the last occurrence, do the mirror image: on a match, keep searching to the right.",
    "Each pass is logarithmic, so finding both ends is still far cheaper than scanning outward from a single hit.",
  ],

  "count-good-nodes": [
    "A node counts when nothing on the path from the root is greater than it, so carry the running maximum of that path down through the recursion.",
    "Compare the node's value against the maximum it inherited to decide whether it contributes.",
    "Pass the larger of the node and the inherited maximum down to both children.",
    "Return this node's contribution plus both subtrees'. One traversal, and the path context travels as an argument rather than as shared state.",
  ],

  "lemonade-change": [
    "Track only how many $5 and $10 notes are in hand — a $20 can never be given as change, so counting them is pointless.",
    "A $5 sale needs nothing back; a $10 sale needs a single $5.",
    "A $20 sale can be settled with a $10 plus a $5, or with three $5s. Prefer the first, because $5 notes are the scarcer resource and every other transaction depends on them.",
    "Fail the moment a sale needs a combination that isn't in hand.",
  ],

  "max-subarray": [
    "Track the best sum of a subarray ending exactly at the current position.",
    "At each element, either extend that run or restart from the element alone — restart precisely when the running sum has gone negative.",
    "That rule is safe because a negative prefix can only reduce whatever follows it, so dropping it is never worse.",
    "Keep the highest value the running sum ever reached; the final running sum is not necessarily the answer.",
  ],

  "three-sum": [
    "Sort first. Sorting is what makes both the two-pointer sweep and the duplicate-skipping possible.",
    "Fix the first number, then look for a pair in the rest of the array summing to its negation.",
    "Converge two pointers from both ends: too small a sum means raising the left one, too large means lowering the right one. Sortedness makes that decision unambiguous.",
    "Skip repeated values at every level so each distinct triple is recorded exactly once, without needing a set to deduplicate afterwards.",
  ],

  "linked-list-cycle": [
    "Advance one pointer a node at a time and a second pointer two nodes at a time.",
    "If the list ends, the fast pointer runs off it and there is no cycle.",
    "If a cycle exists, both pointers end up trapped inside it, and the gap between them closes by one node every step.",
    "A closing gap inside a finite loop means they must eventually land on the same node — proving the cycle in constant space, unlike a visited set.",
  ],

  "non-overlapping-intervals": [
    "Sort by end time. Keeping whichever interval frees up soonest always leaves the most room for everything after it.",
    "Remember the end of the last interval you decided to keep.",
    "If the next interval starts before that point, the two overlap, so one must go — discard the one that ends later, which is the incoming one.",
    "Otherwise keep it and move the boundary forward. Counting discards is the same as maximising what remains.",
  ],

  "spiral-matrix": [
    "Hold four boundaries — top, bottom, left and right — and peel off one edge at a time.",
    "Walk the top row left to right, then move the top boundary down past it.",
    "Walk the right column downward and pull the right boundary in; repeat for the bottom row and the left column.",
    "Re-check that the boundaries haven't crossed before the bottom and left passes: with a single row or column remaining, skipping that check would traverse it twice.",
  ],
};
