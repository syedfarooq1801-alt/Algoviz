"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const d = (imp: () => Promise<{ default: ComponentType }>) => dynamic(imp, { ssr: false });

// Arrays & Hashing
const ContainsDuplicateViz   = d(() => import("@/components/visualizations/problems/ContainsDuplicateViz"));
const TwoSumViz              = d(() => import("@/components/visualizations/TwoSumViz"));
const ValidAnagramViz        = d(() => import("@/components/visualizations/problems/ValidAnagramViz"));
const GroupAnagramsViz       = d(() => import("@/components/visualizations/problems/GroupAnagramsViz"));
const TopKFrequentViz        = d(() => import("@/components/visualizations/problems/TopKFrequentViz"));
const ProductExceptSelfViz   = d(() => import("@/components/visualizations/problems/ProductExceptSelfViz"));
const LongestConsecutiveViz  = d(() => import("@/components/visualizations/problems/LongestConsecutiveViz"));
// Two Pointers
const ValidPalindromeViz     = d(() => import("@/components/visualizations/problems/ValidPalindromeViz"));
const TwoSumIIViz            = d(() => import("@/components/visualizations/problems/TwoSumIIViz"));
const ThreeSumViz            = d(() => import("@/components/visualizations/problems/ThreeSumViz"));
const ContainerWaterViz      = d(() => import("@/components/visualizations/problems/ContainerWaterViz"));
const TrappingRainWaterViz   = d(() => import("@/components/visualizations/problems/TrappingRainWaterViz"));
const IsSubsequenceViz       = d(() => import("@/components/visualizations/problems/IsSubsequenceViz"));
const MoveZeroesViz          = d(() => import("@/components/visualizations/problems/MoveZeroesViz"));
// Sliding Window
const BestTimeStockViz             = d(() => import("@/components/visualizations/problems/BestTimeStockViz"));
const LongestRepeatingReplacementViz = d(() => import("@/components/visualizations/problems/LongestRepeatingReplacementViz"));
const MinWindowSubstringViz        = d(() => import("@/components/visualizations/problems/MinWindowSubstringViz"));
const SlidingWindowMaxViz          = d(() => import("@/components/visualizations/problems/SlidingWindowMaxViz"));
const SlidingWindowViz             = d(() => import("@/components/visualizations/SlidingWindowViz"));
const PermutationInStringViz = d(() => import("@/components/visualizations/problems/PermutationInStringViz"));
const MaxPointsCardsViz      = d(() => import("@/components/visualizations/problems/MaxPointsCardsViz"));
// Stack
const MinStackViz            = d(() => import("@/components/visualizations/problems/MinStackViz"));
const DailyTemperaturesViz   = d(() => import("@/components/visualizations/problems/DailyTemperaturesViz"));
const GenerateParenthesesViz = d(() => import("@/components/visualizations/problems/GenerateParenthesesViz"));
const LargestRectangleViz    = d(() => import("@/components/visualizations/problems/LargestRectangleViz"));
const StackViz               = d(() => import("@/components/visualizations/StackViz"));
const ReversePolishViz       = d(() => import("@/components/visualizations/problems/ReversePolishViz"));
const CarFleetViz            = d(() => import("@/components/visualizations/problems/CarFleetViz"));
const DecodeStringViz        = d(() => import("@/components/visualizations/problems/DecodeStringViz"));
const AsteroidCollisionViz   = d(() => import("@/components/visualizations/problems/AsteroidCollisionViz"));
// Binary Search
const BinarySearchViz        = d(() => import("@/components/visualizations/BinarySearchViz"));
const KokoBananasViz         = d(() => import("@/components/visualizations/problems/KokoBananasViz"));
const FindMinRotatedViz      = d(() => import("@/components/visualizations/problems/FindMinRotatedViz"));
const SearchRotatedViz       = d(() => import("@/components/visualizations/problems/SearchRotatedViz"));
const MedianTwoSortedViz     = d(() => import("@/components/visualizations/problems/MedianTwoSortedViz"));
const SearchInsertPositionViz = d(() => import("@/components/visualizations/problems/SearchInsertPositionViz"));
const FirstBadVersionViz     = d(() => import("@/components/visualizations/problems/FirstBadVersionViz"));
const Search2DMatrixViz      = d(() => import("@/components/visualizations/problems/Search2DMatrixViz"));
// Linked List
const LinkedListViz          = d(() => import("@/components/visualizations/LinkedListViz"));
const MergeTwoSortedViz      = d(() => import("@/components/visualizations/problems/MergeTwoSortedViz"));
const LinkedListCycleViz     = d(() => import("@/components/visualizations/problems/LinkedListCycleViz"));
const RemoveNthNodeViz       = d(() => import("@/components/visualizations/problems/RemoveNthNodeViz"));
const LRUCacheViz            = d(() => import("@/components/visualizations/problems/LRUCacheViz"));
const FindDuplicateNumberViz = d(() => import("@/components/visualizations/problems/FindDuplicateNumberViz"));
const ReorderListViz         = d(() => import("@/components/visualizations/problems/ReorderListViz"));
const CopyListRandomViz      = d(() => import("@/components/visualizations/problems/CopyListRandomViz"));
const SwapPairsViz           = d(() => import("@/components/visualizations/problems/SwapPairsViz"));
const MergeKSortedViz        = d(() => import("@/components/visualizations/problems/MergeKSortedViz"));
const ReverseKGroupViz       = d(() => import("@/components/visualizations/problems/ReverseKGroupViz"));
const AddTwoNumbersViz       = d(() => import("@/components/visualizations/problems/AddTwoNumbersViz"));
const PalindromeLinkedListViz = d(() => import("@/components/visualizations/problems/PalindromeLinkedListViz"));
// Trees
const TreeViz                = d(() => import("@/components/visualizations/TreeViz"));
const MaxDepthTreeViz        = d(() => import("@/components/visualizations/problems/MaxDepthTreeViz"));
const DiameterTreeViz        = d(() => import("@/components/visualizations/problems/DiameterTreeViz"));
const LowestCommonAncestorViz = d(() => import("@/components/visualizations/problems/LowestCommonAncestorViz"));
const LevelOrderViz          = d(() => import("@/components/visualizations/problems/LevelOrderViz"));
const ValidateBSTViz         = d(() => import("@/components/visualizations/problems/ValidateBSTViz"));
const BalancedTreeViz        = d(() => import("@/components/visualizations/problems/BalancedTreeViz"));
const RightSideViewViz       = d(() => import("@/components/visualizations/problems/RightSideViewViz"));
const KthSmallestBSTViz      = d(() => import("@/components/visualizations/problems/KthSmallestBSTViz"));
const PathSumViz             = d(() => import("@/components/visualizations/problems/PathSumViz"));
const MaxPathSumViz          = d(() => import("@/components/visualizations/problems/MaxPathSumViz"));
const SameTreeViz            = d(() => import("@/components/visualizations/problems/SameTreeViz"));
const SubtreeOfAnotherViz    = d(() => import("@/components/visualizations/problems/SubtreeOfAnotherViz"));
const CountGoodNodesViz      = d(() => import("@/components/visualizations/problems/CountGoodNodesViz"));
const ConstructTreePreorderViz = d(() => import("@/components/visualizations/problems/ConstructTreePreorderViz"));
const SerializeDeserializeViz = d(() => import("@/components/visualizations/problems/SerializeDeserializeViz"));
const AverageOfLevelsViz     = d(() => import("@/components/visualizations/problems/AverageOfLevelsViz"));
const MinDepthTreeViz        = d(() => import("@/components/visualizations/problems/MinDepthTreeViz"));
const SymmetricTreeViz       = d(() => import("@/components/visualizations/problems/SymmetricTreeViz"));
// Heap
const KthLargestStreamViz    = d(() => import("@/components/visualizations/problems/KthLargestStreamViz"));
const FindMedianStreamViz    = d(() => import("@/components/visualizations/problems/FindMedianStreamViz"));
const LastStoneWeightViz     = d(() => import("@/components/visualizations/problems/LastStoneWeightViz"));
const KthLargestArrayViz     = d(() => import("@/components/visualizations/problems/KthLargestArrayViz"));
const KClosestPointsViz      = d(() => import("@/components/visualizations/problems/KClosestPointsViz"));
const TaskSchedulerViz       = d(() => import("@/components/visualizations/problems/TaskSchedulerViz"));
// Intervals
const MergeIntervalsViz      = d(() => import("@/components/visualizations/problems/MergeIntervalsViz"));
const MinIntervalQueryViz    = d(() => import("@/components/visualizations/problems/MinIntervalQueryViz"));
// Backtracking
const SubsetsViz             = d(() => import("@/components/visualizations/SubsetsViz"));
const CombinationSumViz      = d(() => import("@/components/visualizations/problems/CombinationSumViz"));
const PermutationsViz        = d(() => import("@/components/visualizations/problems/PermutationsViz"));
const WordSearchViz          = d(() => import("@/components/visualizations/problems/WordSearchViz"));
const LetterCombinationsViz  = d(() => import("@/components/visualizations/problems/LetterCombinationsViz"));
const NQueensViz             = d(() => import("@/components/visualizations/problems/NQueensViz"));
const SubsetsIIViz           = d(() => import("@/components/visualizations/problems/SubsetsIIViz"));
const PalindromePartitioningViz = d(() => import("@/components/visualizations/problems/PalindromePartitioningViz"));
// Tries
const ImplementTrieViz       = d(() => import("@/components/visualizations/problems/ImplementTrieViz"));
const AddSearchWordsViz      = d(() => import("@/components/visualizations/problems/AddSearchWordsViz"));
const WordSearchIIViz        = d(() => import("@/components/visualizations/problems/WordSearchIIViz"));
// Graphs
const IslandsViz             = d(() => import("@/components/visualizations/IslandsViz"));
const MaxAreaIslandViz       = d(() => import("@/components/visualizations/problems/MaxAreaIslandViz"));
const RottingOrangesViz      = d(() => import("@/components/visualizations/problems/RottingOrangesViz"));
const CourseScheduleViz      = d(() => import("@/components/visualizations/CourseScheduleViz"));
const FindPathExistsViz      = d(() => import("@/components/visualizations/problems/FindPathExistsViz"));
const CloneGraphViz          = d(() => import("@/components/visualizations/problems/CloneGraphViz"));
const WallsGatesViz          = d(() => import("@/components/visualizations/problems/WallsGatesViz"));
const PacificAtlanticViz     = d(() => import("@/components/visualizations/problems/PacificAtlanticViz"));
const SurroundedRegionsViz   = d(() => import("@/components/visualizations/problems/SurroundedRegionsViz"));
const WordLadderViz          = d(() => import("@/components/visualizations/problems/WordLadderViz"));
const CourseScheduleIIViz    = d(() => import("@/components/visualizations/problems/CourseScheduleIIViz"));
const AllPathsSourceTargetViz = d(() => import("@/components/visualizations/problems/AllPathsSourceTargetViz"));
const NumConnectedComponentsViz = d(() => import("@/components/visualizations/problems/NumConnectedComponentsViz"));
const RedundantConnectionViz = d(() => import("@/components/visualizations/problems/RedundantConnectionViz"));
const GraphValidTreeViz      = d(() => import("@/components/visualizations/problems/GraphValidTreeViz"));
// Dynamic Programming
const ClimbingStairsViz      = d(() => import("@/components/visualizations/problems/ClimbingStairsViz"));
const HouseRobberViz         = d(() => import("@/components/visualizations/problems/HouseRobberViz"));
const MaxSubarrayViz         = d(() => import("@/components/visualizations/problems/MaxSubarrayViz"));
const UniquePathsViz         = d(() => import("@/components/visualizations/problems/UniquePathsViz"));
const LongestIncreasingSubsequenceViz = d(() => import("@/components/visualizations/problems/LongestIncreasingSubsequenceViz"));
const LongestCommonSubsequenceViz     = d(() => import("@/components/visualizations/problems/LongestCommonSubsequenceViz"));
const EditDistanceViz        = d(() => import("@/components/visualizations/problems/EditDistanceViz"));
const CoinChangeViz          = d(() => import("@/components/visualizations/problems/CoinChangeViz"));
const HouseRobberIIViz       = d(() => import("@/components/visualizations/problems/HouseRobberIIViz"));
const DecodeWaysViz          = d(() => import("@/components/visualizations/problems/DecodeWaysViz"));
const WordBreakViz           = d(() => import("@/components/visualizations/problems/WordBreakViz"));
const MaxProductSubarrayViz  = d(() => import("@/components/visualizations/problems/MaxProductSubarrayViz"));
const LongestPalindromicSubstrViz = d(() => import("@/components/visualizations/problems/LongestPalindromicSubstrViz"));
const PalindromicSubstringsViz    = d(() => import("@/components/visualizations/problems/PalindromicSubstringsViz"));
const TargetSumViz           = d(() => import("@/components/visualizations/problems/TargetSumViz"));
const CoinChangeIIViz        = d(() => import("@/components/visualizations/problems/CoinChangeIIViz"));
const BuySellCooldownViz     = d(() => import("@/components/visualizations/problems/BuySellCooldownViz"));
const PartitionEqualSubsetViz = d(() => import("@/components/visualizations/problems/PartitionEqualSubsetViz"));
const NthTribonacciViz       = d(() => import("@/components/visualizations/problems/NthTribonacciViz"));
const MinCostClimbingViz     = d(() => import("@/components/visualizations/problems/MinCostClimbingViz"));
const TriangleViz            = d(() => import("@/components/visualizations/problems/TriangleViz"));
const MinimumPathSumViz      = d(() => import("@/components/visualizations/problems/MinimumPathSumViz"));
const DistinctSubsequencesViz = d(() => import("@/components/visualizations/problems/DistinctSubsequencesViz"));
const MaxScoreMultiplicationViz = d(() => import("@/components/visualizations/problems/MaxScoreMultiplicationViz"));
const LongestIncreasingPathMatrixViz = d(() => import("@/components/visualizations/problems/LongestIncreasingPathMatrixViz"));
// Greedy
const JumpGameViz            = d(() => import("@/components/visualizations/problems/JumpGameViz"));
const JumpGameIIViz          = d(() => import("@/components/visualizations/problems/JumpGameIIViz"));
const GasStationViz          = d(() => import("@/components/visualizations/problems/GasStationViz"));
const HandOfStraightsViz     = d(() => import("@/components/visualizations/problems/HandOfStraightsViz"));
const MergeTripletsViz       = d(() => import("@/components/visualizations/problems/MergeTripletsViz"));
const PartitionLabelsViz     = d(() => import("@/components/visualizations/problems/PartitionLabelsViz"));
const ValidParenthesisStringViz = d(() => import("@/components/visualizations/problems/ValidParenthesisStringViz"));
const LemonadeChangeViz      = d(() => import("@/components/visualizations/problems/LemonadeChangeViz"));
const BestTimeStockIIViz     = d(() => import("@/components/visualizations/problems/BestTimeStockIIViz"));
// Advanced Graphs
const NetworkDelayTimeViz    = d(() => import("@/components/visualizations/problems/NetworkDelayTimeViz"));
const MinCostConnectPointsViz = d(() => import("@/components/visualizations/problems/MinCostConnectPointsViz"));
const CheapestFlightsViz     = d(() => import("@/components/visualizations/problems/CheapestFlightsViz"));
const PathMaxProbabilityViz  = d(() => import("@/components/visualizations/problems/PathMaxProbabilityViz"));
const EvaluateDivisionViz    = d(() => import("@/components/visualizations/problems/EvaluateDivisionViz"));
const ReconstructItineraryViz = d(() => import("@/components/visualizations/problems/ReconstructItineraryViz"));
const AlienDictionaryViz     = d(() => import("@/components/visualizations/problems/AlienDictionaryViz"));
// New Hard problems
const FirstMissingPositiveViz    = d(() => import("@/components/visualizations/problems/FirstMissingPositiveViz"));
const CountSmallerAfterSelfViz   = d(() => import("@/components/visualizations/problems/CountSmallerAfterSelfViz"));
const MinimumWindowSubsequenceViz = d(() => import("@/components/visualizations/problems/MinimumWindowSubsequenceViz"));
const MaximalRectangleViz        = d(() => import("@/components/visualizations/problems/MaximalRectangleViz"));
const LFUCacheViz                = d(() => import("@/components/visualizations/problems/LFUCacheViz"));
const MaximumSumBSTViz           = d(() => import("@/components/visualizations/problems/MaximumSumBSTViz"));
const SmallestRangeKListsViz     = d(() => import("@/components/visualizations/problems/SmallestRangeKListsViz"));
const SudokuSolverViz            = d(() => import("@/components/visualizations/problems/SudokuSolverViz"));
const CriticalConnectionsViz     = d(() => import("@/components/visualizations/problems/CriticalConnectionsViz"));
const CandyViz                   = d(() => import("@/components/visualizations/problems/CandyViz"));
const EmployeeFreeTimeViz        = d(() => import("@/components/visualizations/problems/EmployeeFreeTimeViz"));
const BasicCalculatorViz         = d(() => import("@/components/visualizations/problems/BasicCalculatorViz"));
const MaximumStudentsExamViz     = d(() => import("@/components/visualizations/problems/MaximumStudentsExamViz"));
const DesignSearchAutocompleteViz = d(() => import("@/components/visualizations/problems/DesignSearchAutocompleteViz"));
const ShortestPathObstacleViz    = d(() => import("@/components/visualizations/problems/ShortestPathObstacleViz"));
// Bit Manipulation
const SingleNumberViz        = d(() => import("@/components/visualizations/problems/SingleNumberViz"));
const Number1BitsViz         = d(() => import("@/components/visualizations/problems/Number1BitsViz"));
const ReverseBitsViz         = d(() => import("@/components/visualizations/problems/ReverseBitsViz"));
const SumTwoIntegersViz      = d(() => import("@/components/visualizations/problems/SumTwoIntegersViz"));
const CountingBitsViz        = d(() => import("@/components/visualizations/problems/CountingBitsViz"));
const MissingNumberViz       = d(() => import("@/components/visualizations/problems/MissingNumberViz"));
const PowerOfTwoViz          = d(() => import("@/components/visualizations/problems/PowerOfTwoViz"));
const BitwiseAndNumbersRangeViz = d(() => import("@/components/visualizations/problems/BitwiseAndNumbersRangeViz"));
// Math & Geometry
const RomanToIntegerViz      = d(() => import("@/components/visualizations/problems/RomanToIntegerViz"));
const HappyNumberViz         = d(() => import("@/components/visualizations/problems/HappyNumberViz"));
const PlusOneViz             = d(() => import("@/components/visualizations/problems/PlusOneViz"));
const RotateImageViz         = d(() => import("@/components/visualizations/problems/RotateImageViz"));
const SpiralMatrixViz        = d(() => import("@/components/visualizations/problems/SpiralMatrixViz"));
const SetMatrixZeroesViz     = d(() => import("@/components/visualizations/problems/SetMatrixZeroesViz"));
const MultiplyStringsViz     = d(() => import("@/components/visualizations/problems/MultiplyStringsViz"));
const CountPrimesViz         = d(() => import("@/components/visualizations/problems/CountPrimesViz"));
const PowXNViz               = d(() => import("@/components/visualizations/problems/PowXNViz"));
const DetectSquaresViz       = d(() => import("@/components/visualizations/problems/DetectSquaresViz"));

export const VIZ_MAP: Record<string, ComponentType> = {
  "contains-duplicate": ContainsDuplicateViz, "two-sum": TwoSumViz, "valid-anagram": ValidAnagramViz,
  "group-anagrams": GroupAnagramsViz, "top-k-frequent": TopKFrequentViz, "product-except-self": ProductExceptSelfViz,
  "longest-consecutive": LongestConsecutiveViz,
  "valid-palindrome": ValidPalindromeViz, "two-sum-ii": TwoSumIIViz, "three-sum": ThreeSumViz,
  "container-water": ContainerWaterViz, "trapping-rain-water": TrappingRainWaterViz, "is-subsequence": IsSubsequenceViz, "move-zeroes": MoveZeroesViz,
  "best-time-stock": BestTimeStockViz, "longest-substring": SlidingWindowViz, "longest-repeating-replacement": LongestRepeatingReplacementViz,
  "min-window-substring": MinWindowSubstringViz, "sliding-window-max": SlidingWindowMaxViz, "permutation-in-string": PermutationInStringViz, "max-points-cards": MaxPointsCardsViz,
  "valid-parentheses": StackViz, "min-stack": MinStackViz, "daily-temperatures": DailyTemperaturesViz,
  "generate-parentheses": GenerateParenthesesViz, "largest-rectangle-histogram": LargestRectangleViz,
  "reverse-polish": ReversePolishViz, "car-fleet": CarFleetViz, "decode-string": DecodeStringViz, "asteroid-collision": AsteroidCollisionViz,
  "binary-search": BinarySearchViz, "koko-bananas": KokoBananasViz, "find-min-rotated": FindMinRotatedViz,
  "search-rotated": SearchRotatedViz, "median-two-sorted": MedianTwoSortedViz, "search-insert-position": SearchInsertPositionViz,
  "first-bad-version": FirstBadVersionViz, "search-2d-matrix": Search2DMatrixViz,
  "reverse-linked-list": LinkedListViz, "merge-two-sorted": MergeTwoSortedViz, "linked-list-cycle": LinkedListCycleViz,
  "remove-nth-node": RemoveNthNodeViz, "lru-cache": LRUCacheViz, "find-duplicate-number": FindDuplicateNumberViz,
  "reorder-list": ReorderListViz, "copy-list-random": CopyListRandomViz, "swap-pairs": SwapPairsViz,
  "merge-k-sorted": MergeKSortedViz, "reverse-k-group": ReverseKGroupViz, "add-two-numbers": AddTwoNumbersViz, "palindrome-linked-list": PalindromeLinkedListViz,
  "invert-binary-tree": TreeViz, "max-depth-tree": MaxDepthTreeViz, "diameter-tree": DiameterTreeViz,
  "lowest-common-ancestor": LowestCommonAncestorViz, "level-order-traversal": LevelOrderViz, "validate-bst": ValidateBSTViz,
  "balanced-tree": BalancedTreeViz, "right-side-view": RightSideViewViz, "kth-smallest-bst": KthSmallestBSTViz,
  "path-sum": PathSumViz, "max-path-sum": MaxPathSumViz, "same-tree": SameTreeViz, "subtree-of-another": SubtreeOfAnotherViz,
  "count-good-nodes": CountGoodNodesViz, "construct-tree-preorder": ConstructTreePreorderViz, "serialize-deserialize": SerializeDeserializeViz,
  "average-of-levels": AverageOfLevelsViz, "min-depth-tree": MinDepthTreeViz, "symmetric-tree": SymmetricTreeViz,
  "kth-largest-stream": KthLargestStreamViz, "find-median-stream": FindMedianStreamViz, "last-stone-weight": LastStoneWeightViz,
  "kth-largest-array": KthLargestArrayViz, "k-closest-points": KClosestPointsViz, "task-scheduler": TaskSchedulerViz,
  "merge-intervals": MergeIntervalsViz, "min-interval-query": MinIntervalQueryViz,
  "subsets": SubsetsViz, "combination-sum": CombinationSumViz, "permutations": PermutationsViz, "word-search": WordSearchViz,
  "letter-combinations": LetterCombinationsViz, "n-queens": NQueensViz, "subsets-ii": SubsetsIIViz, "palindrome-partitioning": PalindromePartitioningViz,
  "implement-trie": ImplementTrieViz, "add-search-words": AddSearchWordsViz, "word-search-ii": WordSearchIIViz,
  "number-of-islands": IslandsViz, "max-area-island": MaxAreaIslandViz, "rotting-oranges": RottingOrangesViz,
  "course-schedule": CourseScheduleViz, "find-path-exists": FindPathExistsViz, "clone-graph": CloneGraphViz,
  "walls-gates": WallsGatesViz, "pacific-atlantic": PacificAtlanticViz, "surrounded-regions": SurroundedRegionsViz,
  "word-ladder": WordLadderViz, "course-schedule-ii": CourseScheduleIIViz, "all-paths-source-target": AllPathsSourceTargetViz,
  "num-connected-components": NumConnectedComponentsViz, "redundant-connection": RedundantConnectionViz, "graph-valid-tree": GraphValidTreeViz,
  "climbing-stairs": ClimbingStairsViz, "house-robber": HouseRobberViz, "max-subarray": MaxSubarrayViz, "unique-paths": UniquePathsViz,
  "longest-increasing-subsequence": LongestIncreasingSubsequenceViz, "longest-common-subsequence": LongestCommonSubsequenceViz,
  "edit-distance": EditDistanceViz, "coin-change": CoinChangeViz, "house-robber-ii": HouseRobberIIViz, "decode-ways": DecodeWaysViz,
  "word-break": WordBreakViz, "max-product-subarray": MaxProductSubarrayViz, "longest-palindromic-substr": LongestPalindromicSubstrViz,
  "palindromic-substrings": PalindromicSubstringsViz, "target-sum": TargetSumViz, "coin-change-ii": CoinChangeIIViz,
  "buy-sell-cooldown": BuySellCooldownViz, "partition-equal-subset": PartitionEqualSubsetViz, "nth-tribonacci": NthTribonacciViz,
  "min-cost-climbing": MinCostClimbingViz, "triangle": TriangleViz, "minimum-path-sum": MinimumPathSumViz,
  "distinct-subsequences": DistinctSubsequencesViz, "max-score-multiplication": MaxScoreMultiplicationViz, "longest-increasing-path-matrix": LongestIncreasingPathMatrixViz,
  "jump-game": JumpGameViz, "jump-game-ii": JumpGameIIViz, "gas-station": GasStationViz, "hand-of-straights": HandOfStraightsViz,
  "merge-triplets": MergeTripletsViz, "partition-labels": PartitionLabelsViz, "valid-parenthesis-string": ValidParenthesisStringViz,
  "lemonade-change": LemonadeChangeViz, "best-time-stock-ii": BestTimeStockIIViz,
  "network-delay-time": NetworkDelayTimeViz, "min-cost-connect-points": MinCostConnectPointsViz, "cheapest-flights": CheapestFlightsViz,
  "path-max-probability": PathMaxProbabilityViz, "evaluate-division": EvaluateDivisionViz, "reconstruct-itinerary": ReconstructItineraryViz, "alien-dictionary": AlienDictionaryViz,
  "single-number": SingleNumberViz, "number-1-bits": Number1BitsViz, "reverse-bits": ReverseBitsViz, "sum-two-integers": SumTwoIntegersViz,
  "counting-bits": CountingBitsViz, "missing-number": MissingNumberViz, "power-of-two": PowerOfTwoViz, "bitwise-and-numbers-range": BitwiseAndNumbersRangeViz,
  "roman-to-integer": RomanToIntegerViz, "happy-number": HappyNumberViz, "plus-one": PlusOneViz, "rotate-image": RotateImageViz,
  "spiral-matrix": SpiralMatrixViz, "set-matrix-zeroes": SetMatrixZeroesViz, "multiply-strings": MultiplyStringsViz,
  "count-primes": CountPrimesViz, "pow-x-n": PowXNViz, "detect-squares": DetectSquaresViz,
  // New Hard problems
  "first-missing-positive": FirstMissingPositiveViz,
  "count-of-smaller-after-self": CountSmallerAfterSelfViz,
  "minimum-window-subsequence": MinimumWindowSubsequenceViz,
  "maximal-rectangle": MaximalRectangleViz,
  "lfu-cache": LFUCacheViz,
  "maximum-sum-bst": MaximumSumBSTViz,
  "smallest-range-k-lists": SmallestRangeKListsViz,
  "sudoku-solver": SudokuSolverViz,
  "critical-connections": CriticalConnectionsViz,
  "candy": CandyViz,
  "employee-free-time": EmployeeFreeTimeViz,
  "basic-calculator": BasicCalculatorViz,
  "maximum-students-exam": MaximumStudentsExamViz,
  "design-search-autocomplete": DesignSearchAutocompleteViz,
  "shortest-path-obstacle": ShortestPathObstacleViz,
};

export function getProblemViz(id: string): ComponentType | undefined {
  return VIZ_MAP[id];
}
