"use client";
import { use } from "react";
import { getProblemById, getPatternById } from "@/data/problems";
import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import PatternVizDispatcher from "@/components/visualizations/PatternVizDispatcher";
import ProblemVizFallback from "@/components/visualizations/ProblemVizFallback";
import VizPageTabs from "@/components/visualizations/VizPageTabs";

// ── Problem-specific visualizations ─────────────────────────────────────────

// Arrays & Hashing
const ContainsDuplicateViz   = dynamic(() => import("@/components/visualizations/problems/ContainsDuplicateViz"),   { ssr: false });
const TwoSumViz              = dynamic(() => import("@/components/visualizations/TwoSumViz"),                       { ssr: false });
const ValidAnagramViz        = dynamic(() => import("@/components/visualizations/problems/ValidAnagramViz"),        { ssr: false });
const GroupAnagramsViz       = dynamic(() => import("@/components/visualizations/problems/GroupAnagramsViz"),       { ssr: false });
const TopKFrequentViz        = dynamic(() => import("@/components/visualizations/problems/TopKFrequentViz"),        { ssr: false });
const ProductExceptSelfViz   = dynamic(() => import("@/components/visualizations/problems/ProductExceptSelfViz"),   { ssr: false });
const LongestConsecutiveViz  = dynamic(() => import("@/components/visualizations/problems/LongestConsecutiveViz"),  { ssr: false });

// Two Pointers
const ValidPalindromeViz     = dynamic(() => import("@/components/visualizations/problems/ValidPalindromeViz"),     { ssr: false });
const TwoSumIIViz            = dynamic(() => import("@/components/visualizations/problems/TwoSumIIViz"),            { ssr: false });
const ThreeSumViz            = dynamic(() => import("@/components/visualizations/problems/ThreeSumViz"),            { ssr: false });
const ContainerWaterViz      = dynamic(() => import("@/components/visualizations/problems/ContainerWaterViz"),      { ssr: false });
const TrappingRainWaterViz   = dynamic(() => import("@/components/visualizations/problems/TrappingRainWaterViz"),   { ssr: false });

// Sliding Window
const BestTimeStockViz             = dynamic(() => import("@/components/visualizations/problems/BestTimeStockViz"),             { ssr: false });
const LongestRepeatingReplacementViz = dynamic(() => import("@/components/visualizations/problems/LongestRepeatingReplacementViz"), { ssr: false });
const MinWindowSubstringViz        = dynamic(() => import("@/components/visualizations/problems/MinWindowSubstringViz"),        { ssr: false });
const SlidingWindowMaxViz          = dynamic(() => import("@/components/visualizations/problems/SlidingWindowMaxViz"),          { ssr: false });
const SlidingWindowViz             = dynamic(() => import("@/components/visualizations/SlidingWindowViz"),                      { ssr: false });

// Stack
const MinStackViz            = dynamic(() => import("@/components/visualizations/problems/MinStackViz"),            { ssr: false });
const DailyTemperaturesViz   = dynamic(() => import("@/components/visualizations/problems/DailyTemperaturesViz"),   { ssr: false });
const GenerateParenthesesViz = dynamic(() => import("@/components/visualizations/problems/GenerateParenthesesViz"), { ssr: false });
const LargestRectangleViz    = dynamic(() => import("@/components/visualizations/problems/LargestRectangleViz"),    { ssr: false });
const StackViz               = dynamic(() => import("@/components/visualizations/StackViz"),                        { ssr: false });

// Binary Search
const BinarySearchViz        = dynamic(() => import("@/components/visualizations/BinarySearchViz"),                 { ssr: false });
const KokoBananasViz         = dynamic(() => import("@/components/visualizations/problems/KokoBananasViz"),         { ssr: false });
const FindMinRotatedViz      = dynamic(() => import("@/components/visualizations/problems/FindMinRotatedViz"),      { ssr: false });
const SearchRotatedViz       = dynamic(() => import("@/components/visualizations/problems/SearchRotatedViz"),       { ssr: false });
const MedianTwoSortedViz     = dynamic(() => import("@/components/visualizations/problems/MedianTwoSortedViz"),     { ssr: false });

// Linked List
const LinkedListViz          = dynamic(() => import("@/components/visualizations/LinkedListViz"),                   { ssr: false });
const MergeTwoSortedViz      = dynamic(() => import("@/components/visualizations/problems/MergeTwoSortedViz"),      { ssr: false });
const LinkedListCycleViz     = dynamic(() => import("@/components/visualizations/problems/LinkedListCycleViz"),     { ssr: false });
const RemoveNthNodeViz       = dynamic(() => import("@/components/visualizations/problems/RemoveNthNodeViz"),       { ssr: false });
const LRUCacheViz            = dynamic(() => import("@/components/visualizations/problems/LRUCacheViz"),            { ssr: false });

// Trees
const TreeViz                = dynamic(() => import("@/components/visualizations/TreeViz"),                         { ssr: false });
const MaxDepthTreeViz        = dynamic(() => import("@/components/visualizations/problems/MaxDepthTreeViz"),        { ssr: false });
const DiameterTreeViz        = dynamic(() => import("@/components/visualizations/problems/DiameterTreeViz"),        { ssr: false });
const LowestCommonAncestorViz = dynamic(() => import("@/components/visualizations/problems/LowestCommonAncestorViz"), { ssr: false });
const LevelOrderViz          = dynamic(() => import("@/components/visualizations/problems/LevelOrderViz"),          { ssr: false });
const ValidateBSTViz         = dynamic(() => import("@/components/visualizations/problems/ValidateBSTViz"),         { ssr: false });

// Heap / Priority Queue
const KthLargestStreamViz    = dynamic(() => import("@/components/visualizations/problems/KthLargestStreamViz"),   { ssr: false });
const FindMedianStreamViz    = dynamic(() => import("@/components/visualizations/problems/FindMedianStreamViz"),    { ssr: false });

// Intervals
const MergeIntervalsViz      = dynamic(() => import("@/components/visualizations/problems/MergeIntervalsViz"),      { ssr: false });

// Backtracking
const SubsetsViz             = dynamic(() => import("@/components/visualizations/SubsetsViz"),                      { ssr: false });
const CombinationSumViz      = dynamic(() => import("@/components/visualizations/problems/CombinationSumViz"),      { ssr: false });
const PermutationsViz        = dynamic(() => import("@/components/visualizations/problems/PermutationsViz"),        { ssr: false });
const WordSearchViz          = dynamic(() => import("@/components/visualizations/problems/WordSearchViz"),          { ssr: false });
const LetterCombinationsViz  = dynamic(() => import("@/components/visualizations/problems/LetterCombinationsViz"),  { ssr: false });
const NQueensViz             = dynamic(() => import("@/components/visualizations/problems/NQueensViz"),             { ssr: false });

// Tries
const ImplementTrieViz       = dynamic(() => import("@/components/visualizations/problems/ImplementTrieViz"),       { ssr: false });
const AddSearchWordsViz      = dynamic(() => import("@/components/visualizations/problems/AddSearchWordsViz"),      { ssr: false });
const WordSearchIIViz        = dynamic(() => import("@/components/visualizations/problems/WordSearchIIViz"),        { ssr: false });

// Graphs
const IslandsViz             = dynamic(() => import("@/components/visualizations/IslandsViz"),                      { ssr: false });
const MaxAreaIslandViz       = dynamic(() => import("@/components/visualizations/problems/MaxAreaIslandViz"),       { ssr: false });
const RottingOrangesViz      = dynamic(() => import("@/components/visualizations/problems/RottingOrangesViz"),      { ssr: false });
const CourseScheduleViz      = dynamic(() => import("@/components/visualizations/CourseScheduleViz"),               { ssr: false });
const FindPathExistsViz      = dynamic(() => import("@/components/visualizations/problems/FindPathExistsViz"),      { ssr: false });
const CloneGraphViz          = dynamic(() => import("@/components/visualizations/problems/CloneGraphViz"),          { ssr: false });
const WallsGatesViz          = dynamic(() => import("@/components/visualizations/problems/WallsGatesViz"),          { ssr: false });
const PacificAtlanticViz     = dynamic(() => import("@/components/visualizations/problems/PacificAtlanticViz"),     { ssr: false });
const SurroundedRegionsViz   = dynamic(() => import("@/components/visualizations/problems/SurroundedRegionsViz"),   { ssr: false });
const WordLadderViz          = dynamic(() => import("@/components/visualizations/problems/WordLadderViz"),          { ssr: false });
const CourseScheduleIIViz    = dynamic(() => import("@/components/visualizations/problems/CourseScheduleIIViz"),    { ssr: false });
const AllPathsSourceTargetViz = dynamic(() => import("@/components/visualizations/problems/AllPathsSourceTargetViz"), { ssr: false });
const NumConnectedComponentsViz = dynamic(() => import("@/components/visualizations/problems/NumConnectedComponentsViz"), { ssr: false });
const RedundantConnectionViz = dynamic(() => import("@/components/visualizations/problems/RedundantConnectionViz"), { ssr: false });
const GraphValidTreeViz      = dynamic(() => import("@/components/visualizations/problems/GraphValidTreeViz"),      { ssr: false });

// Dynamic Programming
const ClimbingStairsViz      = dynamic(() => import("@/components/visualizations/problems/ClimbingStairsViz"),      { ssr: false });
const HouseRobberViz         = dynamic(() => import("@/components/visualizations/problems/HouseRobberViz"),         { ssr: false });
const MaxSubarrayViz         = dynamic(() => import("@/components/visualizations/problems/MaxSubarrayViz"),         { ssr: false });
const UniquePathsViz         = dynamic(() => import("@/components/visualizations/problems/UniquePathsViz"),         { ssr: false });
const LongestIncreasingSubsequenceViz = dynamic(() => import("@/components/visualizations/problems/LongestIncreasingSubsequenceViz"), { ssr: false });
const LongestCommonSubsequenceViz     = dynamic(() => import("@/components/visualizations/problems/LongestCommonSubsequenceViz"),     { ssr: false });
const EditDistanceViz        = dynamic(() => import("@/components/visualizations/problems/EditDistanceViz"),        { ssr: false });
const CoinChangeViz          = dynamic(() => import("@/components/visualizations/problems/CoinChangeViz"),          { ssr: false });
const HouseRobberIIViz       = dynamic(() => import("@/components/visualizations/problems/HouseRobberIIViz"),       { ssr: false });
const DecodeWaysViz          = dynamic(() => import("@/components/visualizations/problems/DecodeWaysViz"),          { ssr: false });
const WordBreakViz           = dynamic(() => import("@/components/visualizations/problems/WordBreakViz"),           { ssr: false });
const MaxProductSubarrayViz  = dynamic(() => import("@/components/visualizations/problems/MaxProductSubarrayViz"),  { ssr: false });
const LongestPalindromicSubstrViz = dynamic(() => import("@/components/visualizations/problems/LongestPalindromicSubstrViz"), { ssr: false });
const PalindromicSubstringsViz    = dynamic(() => import("@/components/visualizations/problems/PalindromicSubstringsViz"),    { ssr: false });
const TargetSumViz           = dynamic(() => import("@/components/visualizations/problems/TargetSumViz"),           { ssr: false });
const CoinChangeIIViz        = dynamic(() => import("@/components/visualizations/problems/CoinChangeIIViz"),        { ssr: false });
const BuySellCooldownViz     = dynamic(() => import("@/components/visualizations/problems/BuySellCooldownViz"),     { ssr: false });
const PartitionEqualSubsetViz = dynamic(() => import("@/components/visualizations/problems/PartitionEqualSubsetViz"), { ssr: false });
const NthTribonacciViz       = dynamic(() => import("@/components/visualizations/problems/NthTribonacciViz"),       { ssr: false });
const MinCostClimbingViz     = dynamic(() => import("@/components/visualizations/problems/MinCostClimbingViz"),     { ssr: false });
const TriangleViz            = dynamic(() => import("@/components/visualizations/problems/TriangleViz"),            { ssr: false });
const MinimumPathSumViz      = dynamic(() => import("@/components/visualizations/problems/MinimumPathSumViz"),      { ssr: false });
const DistinctSubsequencesViz = dynamic(() => import("@/components/visualizations/problems/DistinctSubsequencesViz"), { ssr: false });
const MaxScoreMultiplicationViz = dynamic(() => import("@/components/visualizations/problems/MaxScoreMultiplicationViz"), { ssr: false });
const LongestIncreasingPathMatrixViz = dynamic(() => import("@/components/visualizations/problems/LongestIncreasingPathMatrixViz"), { ssr: false });

// Greedy
const JumpGameViz            = dynamic(() => import("@/components/visualizations/problems/JumpGameViz"),            { ssr: false });
const JumpGameIIViz          = dynamic(() => import("@/components/visualizations/problems/JumpGameIIViz"),          { ssr: false });
const GasStationViz          = dynamic(() => import("@/components/visualizations/problems/GasStationViz"),          { ssr: false });
const HandOfStraightsViz     = dynamic(() => import("@/components/visualizations/problems/HandOfStraightsViz"),     { ssr: false });
const MergeTripletsViz       = dynamic(() => import("@/components/visualizations/problems/MergeTripletsViz"),       { ssr: false });
const PartitionLabelsViz     = dynamic(() => import("@/components/visualizations/problems/PartitionLabelsViz"),     { ssr: false });
const ValidParenthesisStringViz = dynamic(() => import("@/components/visualizations/problems/ValidParenthesisStringViz"), { ssr: false });
const LemonadeChangeViz      = dynamic(() => import("@/components/visualizations/problems/LemonadeChangeViz"),      { ssr: false });
const BestTimeStockIIViz     = dynamic(() => import("@/components/visualizations/problems/BestTimeStockIIViz"),     { ssr: false });

// Advanced Graphs
const NetworkDelayTimeViz    = dynamic(() => import("@/components/visualizations/problems/NetworkDelayTimeViz"),    { ssr: false });
const MinCostConnectPointsViz = dynamic(() => import("@/components/visualizations/problems/MinCostConnectPointsViz"), { ssr: false });
const CheapestFlightsViz     = dynamic(() => import("@/components/visualizations/problems/CheapestFlightsViz"),     { ssr: false });
const PathMaxProbabilityViz  = dynamic(() => import("@/components/visualizations/problems/PathMaxProbabilityViz"),  { ssr: false });
const EvaluateDivisionViz    = dynamic(() => import("@/components/visualizations/problems/EvaluateDivisionViz"),    { ssr: false });
const ReconstructItineraryViz = dynamic(() => import("@/components/visualizations/problems/ReconstructItineraryViz"), { ssr: false });
const AlienDictionaryViz     = dynamic(() => import("@/components/visualizations/problems/AlienDictionaryViz"),     { ssr: false });

// Bit Manipulation
const SingleNumberViz        = dynamic(() => import("@/components/visualizations/problems/SingleNumberViz"),        { ssr: false });
const Number1BitsViz         = dynamic(() => import("@/components/visualizations/problems/Number1BitsViz"),         { ssr: false });
const ReverseBitsViz         = dynamic(() => import("@/components/visualizations/problems/ReverseBitsViz"),         { ssr: false });
const SumTwoIntegersViz      = dynamic(() => import("@/components/visualizations/problems/SumTwoIntegersViz"),      { ssr: false });
const CountingBitsViz        = dynamic(() => import("@/components/visualizations/problems/CountingBitsViz"),        { ssr: false });
const MissingNumberViz       = dynamic(() => import("@/components/visualizations/problems/MissingNumberViz"),       { ssr: false });
const PowerOfTwoViz          = dynamic(() => import("@/components/visualizations/problems/PowerOfTwoViz"),          { ssr: false });
const BitwiseAndNumbersRangeViz = dynamic(() => import("@/components/visualizations/problems/BitwiseAndNumbersRangeViz"), { ssr: false });

// Stack (new)
const ReversePolishViz       = dynamic(() => import("@/components/visualizations/problems/ReversePolishViz"),       { ssr: false });
const CarFleetViz            = dynamic(() => import("@/components/visualizations/problems/CarFleetViz"),            { ssr: false });
const DecodeStringViz        = dynamic(() => import("@/components/visualizations/problems/DecodeStringViz"),        { ssr: false });
const AsteroidCollisionViz   = dynamic(() => import("@/components/visualizations/problems/AsteroidCollisionViz"),   { ssr: false });

// Binary Search (new)
const SearchInsertPositionViz = dynamic(() => import("@/components/visualizations/problems/SearchInsertPositionViz"), { ssr: false });
const FirstBadVersionViz     = dynamic(() => import("@/components/visualizations/problems/FirstBadVersionViz"),     { ssr: false });
const Search2DMatrixViz      = dynamic(() => import("@/components/visualizations/problems/Search2DMatrixViz"),      { ssr: false });

// Linked List (new)
const FindDuplicateNumberViz = dynamic(() => import("@/components/visualizations/problems/FindDuplicateNumberViz"), { ssr: false });
const ReorderListViz         = dynamic(() => import("@/components/visualizations/problems/ReorderListViz"),         { ssr: false });
const CopyListRandomViz      = dynamic(() => import("@/components/visualizations/problems/CopyListRandomViz"),      { ssr: false });
const SwapPairsViz           = dynamic(() => import("@/components/visualizations/problems/SwapPairsViz"),           { ssr: false });
const MergeKSortedViz        = dynamic(() => import("@/components/visualizations/problems/MergeKSortedViz"),        { ssr: false });
const ReverseKGroupViz       = dynamic(() => import("@/components/visualizations/problems/ReverseKGroupViz"),       { ssr: false });
const AddTwoNumbersViz       = dynamic(() => import("@/components/visualizations/problems/AddTwoNumbersViz"),       { ssr: false });
const PalindromeLinkedListViz = dynamic(() => import("@/components/visualizations/problems/PalindromeLinkedListViz"), { ssr: false });

// Trees (new)
const BalancedTreeViz        = dynamic(() => import("@/components/visualizations/problems/BalancedTreeViz"),        { ssr: false });
const RightSideViewViz       = dynamic(() => import("@/components/visualizations/problems/RightSideViewViz"),       { ssr: false });
const KthSmallestBSTViz      = dynamic(() => import("@/components/visualizations/problems/KthSmallestBSTViz"),      { ssr: false });
const PathSumViz             = dynamic(() => import("@/components/visualizations/problems/PathSumViz"),             { ssr: false });
const MaxPathSumViz          = dynamic(() => import("@/components/visualizations/problems/MaxPathSumViz"),          { ssr: false });
const SameTreeViz            = dynamic(() => import("@/components/visualizations/problems/SameTreeViz"),            { ssr: false });
const SubtreeOfAnotherViz    = dynamic(() => import("@/components/visualizations/problems/SubtreeOfAnotherViz"),    { ssr: false });
const CountGoodNodesViz      = dynamic(() => import("@/components/visualizations/problems/CountGoodNodesViz"),      { ssr: false });
const ConstructTreePreorderViz = dynamic(() => import("@/components/visualizations/problems/ConstructTreePreorderViz"), { ssr: false });
const SerializeDeserializeViz = dynamic(() => import("@/components/visualizations/problems/SerializeDeserializeViz"), { ssr: false });
const AverageOfLevelsViz     = dynamic(() => import("@/components/visualizations/problems/AverageOfLevelsViz"),     { ssr: false });
const MinDepthTreeViz        = dynamic(() => import("@/components/visualizations/problems/MinDepthTreeViz"),        { ssr: false });
const SymmetricTreeViz       = dynamic(() => import("@/components/visualizations/problems/SymmetricTreeViz"),       { ssr: false });

// Heap (new)
const LastStoneWeightViz     = dynamic(() => import("@/components/visualizations/problems/LastStoneWeightViz"),     { ssr: false });
const KthLargestArrayViz     = dynamic(() => import("@/components/visualizations/problems/KthLargestArrayViz"),     { ssr: false });
const KClosestPointsViz      = dynamic(() => import("@/components/visualizations/problems/KClosestPointsViz"),      { ssr: false });
const TaskSchedulerViz       = dynamic(() => import("@/components/visualizations/problems/TaskSchedulerViz"),       { ssr: false });

// Backtracking (new)
const SubsetsIIViz           = dynamic(() => import("@/components/visualizations/problems/SubsetsIIViz"),           { ssr: false });
const PalindromePartitioningViz = dynamic(() => import("@/components/visualizations/problems/PalindromePartitioningViz"), { ssr: false });

// Intervals (new)
const MinIntervalQueryViz    = dynamic(() => import("@/components/visualizations/problems/MinIntervalQueryViz"),    { ssr: false });

// Two Pointers (new)
const IsSubsequenceViz       = dynamic(() => import("@/components/visualizations/problems/IsSubsequenceViz"),       { ssr: false });
const MoveZeroesViz          = dynamic(() => import("@/components/visualizations/problems/MoveZeroesViz"),          { ssr: false });

// Sliding Window (new)
const PermutationInStringViz = dynamic(() => import("@/components/visualizations/problems/PermutationInStringViz"), { ssr: false });
const MaxPointsCardsViz      = dynamic(() => import("@/components/visualizations/problems/MaxPointsCardsViz"),      { ssr: false });

// Math & Geometry
const RomanToIntegerViz      = dynamic(() => import("@/components/visualizations/problems/RomanToIntegerViz"),      { ssr: false });
const HappyNumberViz         = dynamic(() => import("@/components/visualizations/problems/HappyNumberViz"),         { ssr: false });
const PlusOneViz             = dynamic(() => import("@/components/visualizations/problems/PlusOneViz"),             { ssr: false });
const RotateImageViz         = dynamic(() => import("@/components/visualizations/problems/RotateImageViz"),         { ssr: false });
const SpiralMatrixViz        = dynamic(() => import("@/components/visualizations/problems/SpiralMatrixViz"),        { ssr: false });
const SetMatrixZeroesViz     = dynamic(() => import("@/components/visualizations/problems/SetMatrixZeroesViz"),     { ssr: false });
const MultiplyStringsViz     = dynamic(() => import("@/components/visualizations/problems/MultiplyStringsViz"),     { ssr: false });
const CountPrimesViz         = dynamic(() => import("@/components/visualizations/problems/CountPrimesViz"),         { ssr: false });
const PowXNViz               = dynamic(() => import("@/components/visualizations/problems/PowXNViz"),               { ssr: false });
const DetectSquaresViz       = dynamic(() => import("@/components/visualizations/problems/DetectSquaresViz"),       { ssr: false });

// ── VIZ_MAP: problem ID → dedicated component ────────────────────────────────

const VIZ_MAP: Record<string, React.ComponentType> = {
  // Arrays & Hashing
  "contains-duplicate":          ContainsDuplicateViz,
  "two-sum":                     TwoSumViz,
  "valid-anagram":               ValidAnagramViz,
  "group-anagrams":              GroupAnagramsViz,
  "top-k-frequent":              TopKFrequentViz,
  "product-except-self":         ProductExceptSelfViz,
  "longest-consecutive":         LongestConsecutiveViz,

  // Two Pointers
  "valid-palindrome":            ValidPalindromeViz,
  "two-sum-ii":                  TwoSumIIViz,
  "three-sum":                   ThreeSumViz,
  "container-water":             ContainerWaterViz,
  "trapping-rain-water":         TrappingRainWaterViz,

  // Sliding Window
  "best-time-stock":             BestTimeStockViz,
  "longest-substring":           SlidingWindowViz,
  "longest-repeating-replacement": LongestRepeatingReplacementViz,
  "min-window-substring":        MinWindowSubstringViz,
  "sliding-window-max":          SlidingWindowMaxViz,

  // Stack
  "valid-parentheses":           StackViz,
  "min-stack":                   MinStackViz,
  "daily-temperatures":          DailyTemperaturesViz,
  "generate-parentheses":        GenerateParenthesesViz,
  "largest-rectangle-histogram": LargestRectangleViz,

  // Binary Search
  "binary-search":               BinarySearchViz,
  "koko-bananas":                KokoBananasViz,
  "find-min-rotated":            FindMinRotatedViz,
  "search-rotated":              SearchRotatedViz,
  "median-two-sorted":           MedianTwoSortedViz,

  // Linked List
  "reverse-linked-list":         LinkedListViz,
  "merge-two-sorted":            MergeTwoSortedViz,
  "linked-list-cycle":           LinkedListCycleViz,
  "remove-nth-node":             RemoveNthNodeViz,
  "lru-cache":                   LRUCacheViz,

  // Trees
  "invert-binary-tree":          TreeViz,
  "max-depth-tree":              MaxDepthTreeViz,
  "diameter-tree":               DiameterTreeViz,
  "lowest-common-ancestor":      LowestCommonAncestorViz,
  "level-order-traversal":       LevelOrderViz,
  "validate-bst":                ValidateBSTViz,

  // Heap / Priority Queue
  "kth-largest-stream":          KthLargestStreamViz,
  "find-median-stream":          FindMedianStreamViz,

  // Intervals
  "merge-intervals":             MergeIntervalsViz,

  // Backtracking
  "subsets":                     SubsetsViz,
  "combination-sum":             CombinationSumViz,
  "permutations":                PermutationsViz,
  "word-search":                 WordSearchViz,
  "letter-combinations":         LetterCombinationsViz,
  "n-queens":                    NQueensViz,

  // Tries
  "implement-trie":              ImplementTrieViz,
  "add-search-words":            AddSearchWordsViz,
  "word-search-ii":              WordSearchIIViz,

  // Graphs
  "number-of-islands":           IslandsViz,
  "max-area-island":             MaxAreaIslandViz,
  "rotting-oranges":             RottingOrangesViz,
  "course-schedule":             CourseScheduleViz,
  "find-path-exists":            FindPathExistsViz,
  "clone-graph":                 CloneGraphViz,
  "walls-gates":                 WallsGatesViz,
  "pacific-atlantic":            PacificAtlanticViz,
  "surrounded-regions":          SurroundedRegionsViz,
  "word-ladder":                 WordLadderViz,
  "course-schedule-ii":          CourseScheduleIIViz,
  "all-paths-source-target":     AllPathsSourceTargetViz,
  "num-connected-components":    NumConnectedComponentsViz,
  "redundant-connection":        RedundantConnectionViz,
  "graph-valid-tree":            GraphValidTreeViz,

  // Dynamic Programming
  "climbing-stairs":             ClimbingStairsViz,
  "house-robber":                HouseRobberViz,
  "max-subarray":                MaxSubarrayViz,
  "unique-paths":                UniquePathsViz,
  "longest-increasing-subsequence": LongestIncreasingSubsequenceViz,
  "longest-common-subsequence":  LongestCommonSubsequenceViz,
  "edit-distance":               EditDistanceViz,
  "coin-change":                 CoinChangeViz,
  "house-robber-ii":             HouseRobberIIViz,
  "decode-ways":                 DecodeWaysViz,
  "word-break":                  WordBreakViz,
  "max-product-subarray":        MaxProductSubarrayViz,
  "longest-palindromic-substr":  LongestPalindromicSubstrViz,
  "palindromic-substrings":      PalindromicSubstringsViz,
  "target-sum":                  TargetSumViz,
  "coin-change-ii":              CoinChangeIIViz,
  "buy-sell-cooldown":           BuySellCooldownViz,
  "partition-equal-subset":      PartitionEqualSubsetViz,
  "nth-tribonacci":              NthTribonacciViz,
  "min-cost-climbing":           MinCostClimbingViz,
  "triangle":                    TriangleViz,
  "minimum-path-sum":            MinimumPathSumViz,
  "distinct-subsequences":       DistinctSubsequencesViz,
  "max-score-multiplication":    MaxScoreMultiplicationViz,
  "longest-increasing-path-matrix": LongestIncreasingPathMatrixViz,

  // Greedy
  "jump-game":                   JumpGameViz,
  "jump-game-ii":                JumpGameIIViz,
  "gas-station":                 GasStationViz,
  "hand-of-straights":           HandOfStraightsViz,
  "merge-triplets":              MergeTripletsViz,
  "partition-labels":            PartitionLabelsViz,
  "valid-parenthesis-string":    ValidParenthesisStringViz,
  "lemonade-change":             LemonadeChangeViz,
  "best-time-stock-ii":          BestTimeStockIIViz,

  // Advanced Graphs
  "network-delay-time":          NetworkDelayTimeViz,
  "min-cost-connect-points":     MinCostConnectPointsViz,
  "cheapest-flights":            CheapestFlightsViz,
  "path-max-probability":        PathMaxProbabilityViz,
  "evaluate-division":           EvaluateDivisionViz,
  "reconstruct-itinerary":       ReconstructItineraryViz,
  "alien-dictionary":            AlienDictionaryViz,

  // Bit Manipulation
  "single-number":               SingleNumberViz,
  "number-1-bits":               Number1BitsViz,
  "reverse-bits":                ReverseBitsViz,
  "sum-two-integers":            SumTwoIntegersViz,
  "counting-bits":               CountingBitsViz,
  "missing-number":              MissingNumberViz,
  "power-of-two":                PowerOfTwoViz,
  "bitwise-and-numbers-range":   BitwiseAndNumbersRangeViz,

  // Stack (new)
  "reverse-polish":              ReversePolishViz,
  "car-fleet":                   CarFleetViz,
  "decode-string":               DecodeStringViz,
  "asteroid-collision":          AsteroidCollisionViz,

  // Binary Search (new)
  "search-insert-position":      SearchInsertPositionViz,
  "first-bad-version":           FirstBadVersionViz,
  "search-2d-matrix":            Search2DMatrixViz,

  // Linked List (new)
  "find-duplicate-number":       FindDuplicateNumberViz,
  "reorder-list":                ReorderListViz,
  "copy-list-random":            CopyListRandomViz,
  "swap-pairs":                  SwapPairsViz,
  "merge-k-sorted":              MergeKSortedViz,
  "reverse-k-group":             ReverseKGroupViz,
  "add-two-numbers":             AddTwoNumbersViz,
  "palindrome-linked-list":      PalindromeLinkedListViz,

  // Trees (new)
  "balanced-tree":               BalancedTreeViz,
  "right-side-view":             RightSideViewViz,
  "kth-smallest-bst":            KthSmallestBSTViz,
  "path-sum":                    PathSumViz,
  "max-path-sum":                MaxPathSumViz,
  "same-tree":                   SameTreeViz,
  "subtree-of-another":          SubtreeOfAnotherViz,
  "count-good-nodes":            CountGoodNodesViz,
  "construct-tree-preorder":     ConstructTreePreorderViz,
  "serialize-deserialize":       SerializeDeserializeViz,
  "average-of-levels":           AverageOfLevelsViz,
  "min-depth-tree":              MinDepthTreeViz,
  "symmetric-tree":              SymmetricTreeViz,

  // Heap (new)
  "last-stone-weight":           LastStoneWeightViz,
  "kth-largest-array":           KthLargestArrayViz,
  "k-closest-points":            KClosestPointsViz,
  "task-scheduler":              TaskSchedulerViz,

  // Backtracking (new)
  "subsets-ii":                  SubsetsIIViz,
  "palindrome-partitioning":     PalindromePartitioningViz,

  // Intervals (new)
  "min-interval-query":          MinIntervalQueryViz,

  // Two Pointers (new)
  "is-subsequence":              IsSubsequenceViz,
  "move-zeroes":                 MoveZeroesViz,

  // Sliding Window (new)
  "permutation-in-string":       PermutationInStringViz,
  "max-points-cards":            MaxPointsCardsViz,

  // Math & Geometry
  "roman-to-integer":            RomanToIntegerViz,
  "happy-number":                HappyNumberViz,
  "plus-one":                    PlusOneViz,
  "rotate-image":                RotateImageViz,
  "spiral-matrix":               SpiralMatrixViz,
  "set-matrix-zeroes":           SetMatrixZeroesViz,
  "multiply-strings":            MultiplyStringsViz,
  "count-primes":                CountPrimesViz,
  "pow-x-n":                     PowXNViz,
  "detect-squares":              DetectSquaresViz,
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function VisualizationPage({ params }: Props) {
  const { id } = use(params);
  const problem = getProblemById(id);
  if (!problem) notFound();

  const pattern = getPatternById(problem.pattern);
  const VizComponent = VIZ_MAP[id];

  const diffColor = problem.difficulty === "Easy" ? "var(--accent-green)" : problem.difficulty === "Medium" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Breadcrumb */}
        <div className="pt-6 pb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          {pattern && (
            <>
              <Link href={`/patterns/${pattern.id}`} className="hover:text-white transition-colors">{pattern.title}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <Link href={`/problems/${id}`} className="hover:text-white transition-colors">{problem.title}</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-secondary)" }}>Visualization</span>
        </div>

        {/* Header */}
        <div className="mt-4 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {problem.title}
              <span className="ml-2 text-sm font-normal" style={{ color: "var(--accent-purple)" }}>— Visualization</span>
            </h1>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ color: diffColor, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {problem.difficulty}
              </span>
              {pattern && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {pattern.title} pattern
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/problems/${id}`}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              ← Back to Problem
            </Link>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "var(--accent-orange)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              LeetCode ↗
            </a>
          </div>
        </div>

        {/* Visualization + Code tabs */}
        <VizPageTabs
          problem={problem}
          pattern={pattern ?? null}
          VizComponent={VizComponent}
          problemId={id}
        />
      </main>
    </div>
  );
}
