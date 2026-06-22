export interface ProblemContent {
  intuition: string;
  approach: string[];
  cppSolution: string;
  pythonSolution?: string;
  timeComplexity: string;
  timeExplanation: string;
  spaceComplexity: string;
  spaceExplanation: string;
  edgeCases: string[];
  memoryTrick: string;
  // Deep explanation fields
  whyItWorks?: string;
  commonMistakes?: string[];
  patternConnection?: string;
  walkthroughExample?: string;
  alternativeApproaches?: string[];
  proTips?: string[];
}

export const PROBLEM_CONTENT: Record<string, ProblemContent> = {
  "add-two-numbers": {
    intuition: `— Simulate addition digit by digit with a carry. Process both lists simultaneously.`,
    approach: [
      `— Simulate addition digit by digit with a carry.`,
      `Process both lists simultaneously.`,
    ],
    cppSolution: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
  ListNode dummy(0);
  ListNode* cur=&dummy;
  int carry=0;
  while (l1||l2||carry) {
    int sum=carry;
    if (l1) {
      sum+=l1->val;
      l1=l1->next;
    }
    if (l2) {
      sum+=l2->val;
      l2=l2->next;
    }
    carry=sum/10;
    cur->next=new ListNode(sum%10);
    cur=cur->next;
  }
  return dummy.next;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DIGIT BY DIGIT with carry. sum = l1 pointer val + l2 pointer val + carry. New digit = sum%10. carry = sum/10. Continue while list or carry remains.`,
  },
  "asteroid-collision": {
    intuition: `— Positive asteroids move right negative move left. Collision when positive is followed by negative. Larger survives.`,
    approach: [
      `— Positive asteroids move right negative move left.`,
      `Collision when positive is followed by negative.`,
      `Larger survives.`,
    ],
    cppSolution: `vector<int> asteroidCollision(vector<int>& asteroids) {
  stack<int> st;
  for (int a:asteroids) {
    bool alive=true;
    while (alive&&a<0&&!st.empty()&&st.top()>0) {
      if (st.top()<-a) st.pop();
      else if (st.top()==-a) {
        st.pop();
        alive=false;
      }
      else alive=false;
    }
    if (alive) st.push(a);
  }
  vector<int> res(st.size());
  int i=res.size()-1;
  while (!st.empty()) {
    res[i--]=st.top();
    st.pop();
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— STACK of survivors. Positive: push. Negative: while top is positive and smaller: pop (destroy). Equal: destroy both. If stack top negative: push.`,
  },
  "average-of-levels": {
    intuition: `— BFS level by level. Average the values at each level.`,
    approach: [
      `— BFS level by level.`,
      `Average the values at each level.`,
    ],
    cppSolution: `vector<double> averageOfLevels(TreeNode* root) {
  vector<double> res;
  if (!root) return res;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int sz=q.size();
    double sum=0;
    for (int i=0; i<sz; i++) {
      auto n=q.front();
      q.pop();
      sum+=n->val;
      if (n->left) q.push(n->left);
      if (n->right) q.push(n->right);
    }
    res.push_back(sum/sz);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BFS + AVERAGE PER LEVEL. Same as level order traversal but compute average of each level vector.`,
  },
  "balanced-tree": {
    intuition: `— A tree is balanced if every node left and right subtree heights differ by at most 1. Return -1 if unbalanced.`,
    approach: [
      `— A tree is balanced if every node left and right subtree heights differ by at most 1.`,
      `Return -1 if unbalanced.`,
    ],
    cppSolution: `bool isBalanced(TreeNode* root) {
  function<int(TreeNode*)> h = [&](TreeNode* n)->int {
    if (!n) return 0;
    int L = h(n.left);
    if (L==-1) return -1;
    int R = h(n.right);
    if (R==-1) return -1;
    if (abs(L-R)>1) return -1;
    return 1 + max(L,R);
  }
  return h(root)!= -1;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— HEIGHT = -1 means unbalanced. Return -1 early if subtree is unbalanced OR heights differ by more than 1.`,
  },
  "best-time-stock": {
    intuition: `— Track the minimum price seen so far. What is the profit if you sell today?`,
    approach: [
      `— Track the minimum price seen so far.`,
      `What is the profit if you sell today?`,
    ],
    cppSolution: `int maxProfit(vector<int>& prices) {
  int L = 0, R = 1, best = 0;
  while (R<(int) prices.size()) {
    if (prices[R]> prices[L]) best = max(best, prices[R]-prices[L]);
    else L = R;
    R++;
  }
  return best;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIN SO FAR + MAX PROFIT. Two variables one pass. Update minPrice if lower update maxProfit = price - minPrice.`,
  },
  "binary-search": {
    intuition: `— Compare middle element to target. If equal return. If target bigger search right half. If smaller search left half.`,
    approach: [
      `— Compare middle element to target.`,
      `If equal return.`,
      `If target bigger search right half.`,
      `If smaller search left half.`,
    ],
    cppSolution: `int search(vector<int>& nums, int target) {
  int L = 0, R =(int) nums.size()-1;
  while (L<= R) {
    int mid = L+(R-L)/2;
    if (nums[mid]==target) return mid;
    else if (nums[mid]<target) L = mid+1;
    else R = mid-1;
  }
  return -1;
}`,
    timeComplexity: `O(log n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(1)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— L + R + MID. mid = L+(R-L)/2. Three cases: equal return, too small L=mid+1, too big R=mid-1o big R=mid-1. Loop while L less-than =R.`,
  },
  "binary-tree-paths": {
    intuition: `— DFS collecting all root-to-leaf paths. Build path string as you go down append to result at leaf.`,
    approach: [
      `— DFS collecting all root-to-leaf paths.`,
      `Build path string as you go down append to result at leaf.`,
    ],
    cppSolution: `vector<string> binaryTreePaths(TreeNode* root) {
  vector<string> res;
  function<void(TreeNode*,string)> dfs=[&](TreeNode* n,string path) {
    if (!n) return;
    path+=(path.empty()?"":"->")+to_string(n->val);
    if (!n->left&&!n->right) res.push_back(path);
    dfs(n->left,path);
    dfs(n->right,path);
  }
  dfs(root,"");
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DFS with path string. At each node append value. At leaf append to result. Backtrack by passing path by value.`,
  },
  "car-fleet": {
    intuition: `— Sort by position descending. Calculate time each car takes to reach target. A faster car behind joins the fleet ahead.`,
    approach: [
      `— Sort by position descending.`,
      `Calculate time each car takes to reach target.`,
      `A faster car behind joins the fleet ahead.`,
    ],
    cppSolution: `int carFleet(int target, vector<int>& pos, vector<int>& speed) {
  int n = pos.size();
  vector<pair<int,int>> cars(n);
  for (int i = 0; i<n; i++) cars[i] = {
    pos[i], speed[i]
  }
  sort(cars.rbegin(), cars.rend());
  stack<double> st;
  for (auto& [p, s] : cars) {
    double t =(double)(target-p)/s;
    if (st.empty()|| t> st.top()) st.push(t);
  }
  return st.size();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORT DESC by position. time = (target-pos)/speed. If time is less-than-or-equal stack top it merges into that fleet. Stack size = fleets.`,
  },
  "clone-graph": {
    intuition: `— BFS from the start node. Use a map from original to clone. For each node clone it then clone its neighbors.`,
    approach: [
      `— BFS from the start node.`,
      `Use a map from original to clone.`,
      `For each node clone it then clone its neighbors.`,
    ],
    cppSolution: `Node* cloneGraph(Node* node) {
  unordered_map<Node*,Node*> mp;
  function<Node*(Node*)> dfs=[&](Node* n).Node* {
    if (!n) return nullptr;
    if (mp.count(n)) return mp[n];
    mp[n]=new Node(n->val);
    for (auto nb:n.neighbors) mp[n].neighbors.push_back(dfs(nb));
    return mp[n];
  }
  return dfs(node);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MAP OLD to NEW. DFS: if already cloned return clone. Else create new node add to map recurse on neighbors.`,
  },
  "combination-sum": {
    intuition: `— Same element can be reused. For each candidate add it recurse at same index (reuse allowed) then pop.`,
    approach: [
      `— Same element can be reused.`,
      `For each candidate add it recurse at same index (reuse allowed) then pop.`,
    ],
    cppSolution: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
  vector<vector<int>> res;
  vector<int> cur;
  function<void(int,int)> bt=[&](int i,int rem) {
    if (rem==0) {
      res.push_back(cur);
      return;
    }
    if (rem<0||i>=(int) candidates.size()) return;
    cur.push_back(candidates[i]);
    bt(i,rem-candidates[i]);
    cur.pop_back();
    bt(i+1,rem);
  }
  bt(0,target);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— REUSE = recurse at same index i not i+1. Stop when target is negative. When target == 0 add to result.`,
  },
  "combination-sum-ii": {
    intuition: `— Each element used once skip duplicates at same level. Sort first. if i greater-than start AND nums[i]==nums[i-1]: skip.`,
    approach: [
      `— Each element used once skip duplicates at same level.`,
      `Sort first.`,
      `if i greater-than start AND nums[i]==nums[i-1]: skip.`,
    ],
    cppSolution: `vector<vector<int>> combinationSum2(vector<int>& c, int target) {
  sort(c.begin(),c.end());
  vector<vector<int>> res;
  vector<int> cur;
  function<void(int,int)> bt=[&](int i,int rem) {
    if (rem==0) {
      res.push_back(cur);
      return;
    }
    for (int j=i; j<(int) c.size()&&c[j]<=rem; j++) {
      if (j> i&&c[j]==c[j-1]) continue;
      cur.push_back(c[j]);
      bt(j+1,rem-c[j]);
      cur.pop_back();
    }
  }
  bt(0,target);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORT + SKIP DUPS + NO REUSE (i+1). One-time use means recurse with i+1. Skip same value at same depth.`,
  },
  "combination-sum-iii": {
    intuition: `— Find all combinations of k numbers from 1-9 that sum to n. Backtrack with start index.`,
    approach: [
      `— Find all combinations of k numbers from 1-9 that sum to n.`,
      `Backtrack with start index.`,
    ],
    cppSolution: `vector<vector<int>> combinationSum3(int k, int n) {
  vector<vector<int>> res;
  vector<int> cur;
  function<void(int,int)> bt=[&](int start,int rem) {
    if ((int) cur.size()==k&&rem==0) {
      res.push_back(cur);
      return;
    }
    if ((int) cur.size()==k||rem<0) return;
    for (int i=start; i<=9; i++) {
      cur.push_back(i);
      bt(i+1,rem-i);
      cur.pop_back();
    }
  }
  bt(1,n);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— K NUMBERS FROM 1-9 summing to n. Backtrack: pick from start to 9 decreasing remaining. Stop when k items found.`,
  },
  "construct-tree-preorder": {
    intuition: `— Preorder[0] is always the root. Find root in inorder. Elements left of it are left subtree right are right subtree.`,
    approach: [
      `— Preorder[0] is always the root.`,
      `Find root in inorder.`,
      `Elements left of it are left subtree right are right subtree.`,
    ],
    cppSolution: `TreeNode* buildTree(vector<int>& pre, vector<int>& in) {
  unordered_map<int,int> idx;
  for (int i=0; i<(int) in.size(); i++) idx[in[i]]=i;
  function<TreeNode*(int,int,int,int)> build=[&](int ps,int pe,int is,int ie).TreeNode* {
    if (ps> pe) return nullptr;
    TreeNode* root=new TreeNode(pre[ps]);
    int mid=idx[pre[ps]]-is;
    root.left=build(ps+1,ps+mid,is,idx[pre[ps]]-1);
    root.right=build(ps+mid+1,pe,idx[pre[ps]]+1,ie);
    return root;
  }
  return build(0,pre.size()-1,0,in.size()-1);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— PREORDER[0] = ROOT. Find it in inorder. Left of it = left subtree size. Use that to split both arrays. Recurse.`,
  },
  "container-water": {
    intuition: `— Area = min(height[L], height[R]) * (R-L). Start wide then move the shorter wall inward.`,
    approach: [
      `— Area = min(height[L], height[R]) * (R-L).`,
      `Start wide then move the shorter wall inward.`,
    ],
    cppSolution: `int maxArea(vector<int>& height) {
  int L = 0, R =(int) height.size()-1, res = 0;
  while (L<R) {
    res = max(res, min(height[L], height[R])*(R-L));
    if (height[L]<height[R]) L++;
    else R--;
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MOVE THE SHORTER WALL. Moving the taller one can only decrease area. Greedy: shorter pointer moves inward.`,
  },
  "contains-duplicate": {
    intuition: `— Check if any value appears more than once. Can you do it in one pass using a set to remember what you have seen?`,
    approach: [
      `— Check if any value appears more than once.`,
      `Can you do it in one pass using a set to remember what you have seen?`,
    ],
    cppSolution: `bool containsDuplicate(vector<int>& nums) {
  unordered_set<int> seen;
  for (int n : nums) {
    if (seen.count(n)) return true;
    seen.insert(n);
  }
  return false;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SET = seen before? If seen.count(n) before insert: duplicate found. Like a bouncer checking a guest list.`,
  },
  "copy-list-random": {
    intuition: `— Two passes: first create all new nodes stored in map. Second pass set next and random pointers using the map.`,
    approach: [
      `— Two passes: first create all new nodes stored in map.`,
      `Second pass set next and random pointers using the map.`,
    ],
    cppSolution: `Node* copyRandomList(Node* head) {
  unordered_map<Node*,Node*> mp;
  Node* cur=head;
  while (cur) {
    mp[cur]=new Node(cur->val);
    cur=cur->next;
  }
  cur=head;
  while (cur) {
    mp[cur]->next=mp[cur->next];
    mp[cur].random=mp[cur.random];
    cur=cur->next;
  }
  return mp[head];
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MAP OLD to NEW. Pass 1: create copy of every node. Pass 2: copy pointer next = map[orig pointer next] copy dot random = map[orig dot random].`,
  },
  "count-good-nodes": {
    intuition: `— A node is good if no ancestor has a greater value. DFS track max value on path from root to current node.`,
    approach: [
      `— A node is good if no ancestor has a greater value.`,
      `DFS track max value on path from root to current node.`,
    ],
    cppSolution: `int goodNodes(TreeNode* root) {
  function<int(TreeNode*,int)> dfs=[&](TreeNode* node, int maxVal) {
    if (!node) return 0;
    int res = node->val>=maxVal ? 1 : 0;
    maxVal = max(maxVal, node->val);
    return res+dfs(node.left,maxVal)+dfs(node.right,maxVal);
  }
  return dfs(root, INT_MIN);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— GOOD = val is at least maxOnPath. DFS passing current max. If node pointer val is at least max it is good. Update max as you go deeper.`,
  },
  "daily-temperatures": {
    intuition: `— For each day find the next warmer day. Monotonic stack stores indices. When current temp greater-than stack top temp pop and record gap.`,
    approach: [
      `— For each day find the next warmer day.`,
      `Monotonic stack stores indices.`,
      `When current temp greater-than stack top temp pop and record gap.`,
    ],
    cppSolution: `vector<int> dailyTemperatures(vector<int>& T) {
  vector<int> res(T.size(), 0);
  stack<int> st;
  for (int i = 0; i<(int) T.size(); i++) {
    while (!st.empty()& T[st.top()]<T[i]) {
      res[st.top()] = i - st.top();
      st.pop();
    }
    st.push(i);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MONO STACK of indices decreasing temp. Current greater than top? Pop and answer[top] = i - top. Push current index.`,
  },
  "decode-string": {
    intuition: `— Nested encoded strings like 3[a2[c]]. Use two stacks: one for counts one for current strings.`,
    approach: [
      `— Nested encoded strings like 3[a2[c]].`,
      `Use two stacks: one for counts one for current strings.`,
    ],
    cppSolution: `string decodeString(string s) {
  stack<int> counts;
  stack<string> strs;
  string curr;
  int num=0;
  for (char c:s) {
    if (isdigit(c)) num=num*10+(c-'0');
    else if (c=='[') {
      counts.push(num);
      strs.push(curr);
      curr="";
      num=0;
    }
    else if (c==']') {
      int k=counts.top();
      counts.pop();
      string prev=strs.top();
      strs.pop();
      while (k--) prev+=curr;
      curr=prev;
    }
    else curr+=c;
  }
  return curr;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO STACKS: count stack and string stack. On digit: build number. On open bracket: push curr and count reset. On close: pop and repeat.`,
  },
  "design-twitter": {
    intuition: `— Map userId to list of (timestamp tweetId). For getNewsFeed collect tweets from followees and self use max-heap for top 10.`,
    approach: [
      `— Map userId to list of (timestamp tweetId).`,
      `For getNewsFeed collect tweets from followees and self use max-heap for top 10.`,
    ],
    cppSolution: `class Twitter {
  unordered_map<int,vector<pair<int,int>>> tweets;
  unordered_map<int,unordered_set<int>> follows;
  int time=0;
  public: void postTweet(int u,int t) {
    tweets[u].push_back( {
      time++,t
    }
    );
  }
  vector<int> getNewsFeed(int u) {
    priority_queue<pair<int,int>> pq;
    for (auto& t:tweets[u]) pq.push(t);
    for (int f:follows[u]) for (auto& t:tweets[f]) pq.push(t);
    vector<int> res;
    while (!pq.empty()&&(int) res.size()<10) {
      res.push_back(pq.top().second);
      pq.pop();
    }
    return res;
  }
  void follow(int u,int f) {
    follows[u].insert(f);
  }
  void unfollow(int u,int f) {
    follows[u].erase(f);
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MAP + MAX-HEAP. Store tweets per user with timestamp. getNewsFeed: gather all relevant tweets heap-select top 10.`,
  },
  "diameter-tree": {
    intuition: `— Diameter at each node = leftHeight + rightHeight. Track global max. Return height to parent.`,
    approach: [
      `— Diameter at each node = leftHeight + rightHeight.`,
      `Track global max.`,
      `Return height to parent.`,
    ],
    cppSolution: `int diameterOfBinaryTree(TreeNode* root) {
  int res = 0;
  function<int(TreeNode*)> dfs = [&](TreeNode* node) {
    if (!node) return 0;
    int L = dfs(node.left), R = dfs(node.right);
    res = max(res, L+R);
    return 1 + max(L, R);
  }
  dfs(root);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DIAMETER = leftH + rightH at each node. Helper returns height. Track global max. Diameter passes through subtree root.`,
  },
  "encode-decode-strings": {
    intuition: `— You need a delimiter that cannot appear in the string itself. Encode the length of each string before it.`,
    approach: [
      `— You need a delimiter that cannot appear in the string itself.`,
      `Encode the length of each string before it.`,
    ],
    cppSolution: `string encode(vector<string>& strs) {
  string res;
  for (string& s : strs) res += to_string(s.size())+ '#' + s;
  return res;
}
vector<string> decode(string s) {
  vector<string> res;
  int i = 0;
  while (i<(int) s.size()) {
    int j = s.find('#', i);
    int len = stoi(s.substr(i, j-i));
    res.push_back(s.substr(j+1, len));
    i = j + 1 + len;
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— LENGTH PREFIX: encode as len#string. Decode by reading until '#' then reading exactly len chars.`,
  },
  "find-duplicate-number": {
    intuition: `— Treat array as linked list where value = next index. Find cycle entry point using Floyd's algorithm.`,
    approach: [
      `— Treat array as linked list where value = next index.`,
      `Find cycle entry point using Floyd's algorithm.`,
    ],
    cppSolution: `int findDuplicate(vector<int>& nums) {
  int slow=nums[0], fast=nums[0];
  do {
    slow=nums[slow];
    fast=nums[nums[fast]];
  }
  while (slow!=fast);
  slow=nums[0];
  while (slow!=fast) {
    slow=nums[slow];
    fast=nums[fast];
  }
  return slow;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FLOYD'S CYCLE DETECTION on array indices. Phase 1: find meeting point. Phase 2: start one pointer at 0 advance both at speed 1.`,
  },
  "find-median-stream": {
    intuition: `— Two heaps: max-heap for lower half min-heap for upper half. Balance them so sizes differ by at most 1.`,
    approach: [
      `— Two heaps: max-heap for lower half min-heap for upper half.`,
      `Balance them so sizes differ by at most 1.`,
    ],
    cppSolution: `class MedianFinder {
  priority_queue<int> maxH;
  priority_queue<int,vector<int>,greater<int>> minH;
  public: void addNum(int n) {
    maxH.push(n);
    minH.push(maxH.top());
    maxH.pop();
    if (minH.size()> maxH.size()) {
      maxH.push(minH.top());
      minH.pop();
    }
  }
  double findMedian() {
    if (maxH.size()> minH.size()) return maxH.top();
    return(maxH.top()+minH.top())/2.0;
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO HEAPS: maxH (lower half) + minH (upper half). Keep balanced. Median = top of bigger heap or average of both tops.`,
  },
  "find-min-rotated": {
    intuition: `— The minimum is in the unsorted half. If left side is sorted the min must be in right half.`,
    approach: [
      `— The minimum is in the unsorted half.`,
      `If left side is sorted the min must be in right half.`,
    ],
    cppSolution: `int findMin(vector<int>& nums) {
  int L = 0, R =(int) nums.size()-1;
  while (L<R) {
    int mid = L+(R-L)/2;
    if (nums[mid]> nums[R]) L = mid+1;
    else R = mid;
  }
  return nums[L];
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORTED HALF has no minimum. If nums[L] is less-equal nums[mid] left is sorted so min is in right half (L=mid+1). Else R=mid.`,
  },
  "first-bad-version": {
    intuition: `— Binary search for the first version where isBadVersion returns true. Classic binary search on answer.`,
    approach: [
      `— Binary search for the first version where isBadVersion returns true.`,
      `Classic binary search on answer.`,
    ],
    cppSolution: `int firstBadVersion(int n) {
  int L=1,R=n;
  while (L<R) {
    int mid=L+(R-L)/2;
    if (isBadVersion(mid)) R=mid;
    else L=mid+1;
  }
  return L;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FIND FIRST TRUE. If mid is bad: R=mid (might be answer). If good: L=mid+1. Return L.`,
  },
  "generate-parentheses": {
    intuition: `— Add open bracket if open count is less than n. Add close bracket if close count is less than open count. Recurse until string length = 2n.`,
    approach: [
      `— Add open bracket if open count is less than n.`,
      `Add close bracket if close count is less than open count.`,
      `Recurse until string length = 2n.`,
    ],
    cppSolution: `vector<string> generateParenthesis(int n) {
  vector<string> res;
  function<void(string,int,int)> bt = [&](string cur, int op, int cl) {
    if ((int) cur.size()== 2*n) {
      res.push_back(cur);
      return;
    }
    if (op<n) bt(cur+'(', op+1, cl); if (cl<op) bt(cur+')', op, cl+1);
  }
  bt("", 0, 0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— RULE: open less than n means can add open bracket. close less than open means can add close bracket. Never close more than you have opened.`,
  },
  "group-anagrams": {
    intuition: `— Anagrams all sort to the same string. Use that sorted string as a map key to group them together.`,
    approach: [
      `— Anagrams all sort to the same string.`,
      `Use that sorted string as a map key to group them together.`,
    ],
    cppSolution: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
  unordered_map<string, vector<string>> groups;
  for (string& s : strs) {
    string key = s;
    sort(key.begin(), key.end());
    groups[key].push_back(s);
  }
  vector<vector<string>> res;
  for (auto& [k, v] : groups) res.push_back(v);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORT = SIGNATURE. Sort each word alphabetically. Anagrams get same key. 'eat' 'tea' 'ate' all sort to 'aet'.`,
  },
  "invert-binary-tree": {
    intuition: `— Swap left and right children at each node then recursively do the same for both subtrees.`,
    approach: [
      `— Swap left and right children at each node then recursively do the same for both subtrees.`,
    ],
    cppSolution: `TreeNode* invertTree(TreeNode* root) {
  if (!root) return nullptr;
  swap(root.left, root.right);
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SWAP THEN RECURSE. At every node swap left and right then recurse on both children.`,
  },
  "is-subsequence": {
    intuition: `— Check if s appears in t in order (not necessarily contiguous). One pointer for s one for t.`,
    approach: [
      `— Check if s appears in t in order (not necessarily contiguous).`,
      `One pointer for s one for t.`,
    ],
    cppSolution: `bool isSubsequence(string s, string t) {
  int i=0,j=0;
  while (i<(int) s.size()&&j<(int) t.size()) if (s[i]==t[j++]) i++;
  return i==s.size();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO POINTERS: i for s j for t. When s[i]==t[j] advance i. Always advance j. Done when i reaches end of s.`,
  },
  "isomorphic-strings": {
    intuition: `— Two strings are isomorphic if characters can be replaced consistently. Map each char in s to char in t and vice versa.`,
    approach: [
      `— Two strings are isomorphic if characters can be replaced consistently.`,
      `Map each char in s to char in t and vice versa.`,
    ],
    cppSolution: `bool isIsomorphic(string s, string t) {
  unordered_map<char,char> st, ts;
  for (int i=0; i<(int) s.size(); i++) {
    if (st.count(s[i])&&st[s[i]]!=t[i]) return false;
    if (ts.count(t[i])&&ts[t[i]]!=s[i]) return false;
    st[s[i]]=t[i];
    ts[t[i]]=s[i];
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO-WAY MAP. Map s[i] to t[i] and t[i] to s[i]. If any mapping conflicts return false.`,
  },
  "k-closest-points": {
    intuition: `— Compute distance squared (no sqrt needed). Use a max-heap of size k evict farthest when size exceeds k.`,
    approach: [
      `— Compute distance squared (no sqrt needed).`,
      `Use a max-heap of size k evict farthest when size exceeds k.`,
    ],
    cppSolution: `vector<vector<int>> kClosest(vector<vector<int>>& pts, int k) {
  priority_queue<pair<int,int>> maxH;
  for (int i=0; i<(int) pts.size(); i++) {
    int d=pts[i][0]*pts[i][0]+pts[i][1]*pts[i][1];
    maxH.push( {
      d,i
    }
    );
    if ((int) maxH.size()> k) maxH.pop();
  }
  vector<vector<int>> res;
  while (!maxH.empty()) {
    res.push_back(pts[maxH.top().second]);
    maxH.pop();
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MAX-HEAP size K on distance. When size exceeds K pop max (farthest). What remains = K closest. Compare x*x+y*y.`,
  },
  "koko-bananas": {
    intuition: `— Binary search on the answer which is eating speed. For a given speed can Koko finish in h hours?`,
    approach: [
      `— Binary search on the answer which is eating speed.`,
      `For a given speed can Koko finish in h hours?`,
    ],
    cppSolution: `int minEatingSpeed(vector<int>& piles, int h) {
  int L = 1, R = *max_element(piles.begin(), piles.end()), res = R;
  while (L<= R) {
    int mid = L+(R-L)/2;
    long hours = 0;
    for (int p : piles) hours +=(p+mid-1)/mid;
    if (hours<= h) {
      res = mid;
      R = mid-1;
    }
    else L = mid+1;
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BINARY SEARCH ON SPEED. min=1 max=max(piles). Check sum(ceil(pile/k)) is less or equal h. If valid try slower (R=mid-1).`,
  },
  "kth-largest-array": {
    intuition: `— Use a min-heap of size k. If heap size exceeds k pop the minimum. The top is always the kth largest.`,
    approach: [
      `— Use a min-heap of size k.`,
      `If heap size exceeds k pop the minimum.`,
      `The top is always the kth largest.`,
    ],
    cppSolution: `int findKthLargest(vector<int>& nums, int k) {
  priority_queue<int,vector<int>,greater<int>> minH;
  for (int n : nums) {
    minH.push(n);
    if ((int) minH.size()> k) minH.pop();
  }
  return minH.top();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIN-HEAP size K. When size exceeds K pop min. Top = Kth largest. Heap evicts anyone not in top K.`,
  },
  "kth-largest-stream": {
    intuition: `— Maintain a min-heap of size k. The top is always the kth largest. On add: push and pop if exceeds k.`,
    approach: [
      `— Maintain a min-heap of size k.`,
      `The top is always the kth largest.`,
      `On add: push and pop if exceeds k.`,
    ],
    cppSolution: `class KthLargest {
  priority_queue<int,vector<int>,greater<int>> minH;
  int k;
  public: KthLargest(int k,vector<int>& nums):k(k) {
    for (int n:nums) add(n);
  }
  int add(int val) {
    minH.push(val);
    if ((int) minH.size()> k) minH.pop();
    return minH.top();
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIN-HEAP size K = permanent top K. add(): push then if size exceeds k pop. Top = kth largest always.`,
  },
  "kth-smallest-bst": {
    intuition: `— Inorder traversal of BST gives sorted order. The kth element visited in inorder is the answer.`,
    approach: [
      `— Inorder traversal of BST gives sorted order.`,
      `The kth element visited in inorder is the answer.`,
    ],
    cppSolution: `int kthSmallest(TreeNode* root, int k) {
  int count=0, res=0;
  function<void(TreeNode*)> inorder=[&](TreeNode* n) {
    if (!n||count>=k) return;
    inorder(n.left);
    if (++count==k) {
      res=n->val;
      return;
    }
    inorder(n.right);
  }
  inorder(root);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— INORDER = SORTED in BST. Count nodes in inorder. When count reaches k that is your answer.`,
  },
  "largest-rectangle-histogram": {
    intuition: `— For each bar the rectangle extends left and right until a shorter bar blocks it. Use a monotonic stack to find boundaries.`,
    approach: [
      `— For each bar the rectangle extends left and right until a shorter bar blocks it.`,
      `Use a monotonic stack to find boundaries.`,
    ],
    cppSolution: `int largestRectangleArea(vector<int>& heights) {
  stack<int> st;
  int res = 0;
  heights.push_back(0);
  for (int i = 0; i<(int) heights.size(); i++) {
    while (!st.empty()& heights[st.top()]> heights[i]) {
      int h = heights[st.top()];
      st.pop();
      int w = st.empty()? i : i - st.top()- 1;
      res = max(res, h * w);
    }
    st.push(i);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MONO STACK increasing. When current is less than top: pop top width = i - stack.top() - 1. Area = height * width.`,
  },
  "last-stone-weight": {
    intuition: `— Simulate: always smash the two heaviest. Use a max-heap.`,
    approach: [
      `— Simulate: always smash the two heaviest.`,
      `Use a max-heap.`,
    ],
    cppSolution: `int lastStoneWeight(vector<int>& stones) {
  priority_queue<int> pq(stones.begin(),stones.end());
  while (pq.size()>1) {
    int a=pq.top();
    pq.pop();
    int b=pq.top();
    pq.pop();
    if (a!=b) pq.push(a-b);
  }
  return pq.empty()?0:pq.top();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MAX-HEAP: always extract two largest. If not equal push the difference back. Repeat until 0 or 1 stone.`,
  },
  "letter-combinations": {
    intuition: `— Map each digit to its letters. Backtrack: for each digit letters add one recurse to next digit pop.`,
    approach: [
      `— Map each digit to its letters.`,
      `Backtrack: for each digit letters add one recurse to next digit pop.`,
    ],
    cppSolution: `vector<string> letterCombinations(string digits) {
  if (digits.empty()) return {
  }
  vector<string> map= {
    "abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"
  }
  vector<string> res;
  string cur;
  function<void(int)> bt=[&](int i) {
    if (i==(int) digits.size()) {
      res.push_back(cur);
      return;
    }
    for (char c:map[digits[i]-'2']) {
      cur+=c;
      bt(i+1);
      cur.pop_back();
    }
  }
  bt(0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DIGIT MAP + BACKTRACK. For each digit try all its letters. When path length = digits length add to result.`,
  },
  "level-order-traversal": {
    intuition: `— BFS with a queue. Process all nodes at current level push their children. Track level size to separate levels.`,
    approach: [
      `— BFS with a queue.`,
      `Process all nodes at current level push their children.`,
      `Track level size to separate levels.`,
    ],
    cppSolution: `vector<vector<int>> levelOrder(TreeNode* root) {
  vector<vector<int>> res;
  if (!root) return res;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int sz=q.size();
    vector<int> level;
    for (int i=0; i<sz; i++) {
      TreeNode* n=q.front();
      q.pop();
      level.push_back(n->val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    res.push_back(level);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BFS + LEVEL SIZE SNAPSHOT. int sz = q.size() before processing. Process exactly sz nodes per level.`,
  },
  "linked-list-cycle": {
    intuition: `— Fast pointer moves 2 steps slow moves 1. If there is a cycle fast will eventually lap slow and they will meet.`,
    approach: [
      `— Fast pointer moves 2 steps slow moves 1.`,
      `If there is a cycle fast will eventually lap slow and they will meet.`,
    ],
    cppSolution: `bool hasCycle(ListNode* head) {
  ListNode* slow=head, *fast=head;
  while (fast & fast->next) {
    slow=slow->next;
    fast=fast->next->next;
    if (slow==fast) return true;
  }
  return false;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FAST LAPS SLOW in a cycle. If fast or fast pointer next is null: no cycle. If fast==slow: cycle detected.`,
  },
  "longest-consecutive": {
    intuition: `— Only start counting from the beginning of a sequence. How do you know if something is a sequence start?`,
    approach: [
      `— Only start counting from the beginning of a sequence.`,
      `How do you know if something is a sequence start?`,
    ],
    cppSolution: `int longestConsecutive(vector<int>& nums) {
  unordered_set<int> s(nums.begin(), nums.end());
  int best = 0;
  for (int n : s) {
    if (!s.count(n-1)) {
      int len = 1;
      while (s.count(n + len)) len++;
      best = max(best, len);
    }
  }
  return best;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— START OF SEQUENCE = num-1 is NOT in set. Only count from starts. Each number visited once. Put all in unordered_set first.`,
  },
  "longest-repeating-replacement": {
    intuition: `— In any window the characters you replace = windowSize - maxFrequency. If replacements exceed k shrink the window.`,
    approach: [
      `— In any window the characters you replace = windowSize - maxFrequency.`,
      `If replacements exceed k shrink the window.`,
    ],
    cppSolution: `int characterReplacement(string s, int k) {
  unordered_map<char,int> freq;
  int L = 0, maxFreq = 0, res = 0;
  for (int R = 0; R<(int) s.size(); R++) {
    freq[s[R]]++;
    maxFreq = max(maxFreq, freq[s[R]]);
    while ((R-L+1)- maxFreq> k) {
      freq[s[L]]--;
      L++;
    }
    res = max(res, R-L+1);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— REPLACEMENTS = windowSize - maxFreq. If greater than k move L. Track maxFreq and never decrease it.`,
  },
  "longest-substring": {
    intuition: `— When you add a character that already exists in the window shrink from the left until it is gone.`,
    approach: [
      `— When you add a character that already exists in the window shrink from the left until it is gone.`,
    ],
    cppSolution: `int lengthOfLongestSubstring(string s) {
  unordered_map<char,int> freq;
  int L = 0, res = 0;
  for (int R = 0; R<(int) s.size(); R++) {
    freq[s[R]]++;
    while (freq[s[R]]>1) {
      freq[s[L]]--;
      L++;
    }
    res = max(res, R-L+1);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— WINDOW = no duplicates. freq map tracks counts. When freq[c] exceeds 1 shrink L until back to 1. Result = max window size.`,
  },
  "lowest-common-ancestor": {
    intuition: `— In a BST if both p and q are less than root go left. If both greater go right. Otherwise root is the LCA.`,
    approach: [
      `— In a BST if both p and q are less than root go left.`,
      `If both greater go right.`,
      `Otherwise root is the LCA.`,
    ],
    cppSolution: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
  while (root) {
    if (p->val<root->val & q->val<root->val) root=root.left;
    else if (p->val> root->val & q->val> root->val) root=root.right;
    else return root;
  }
  return nullptr;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BST PROPERTY GUIDES YOU. Both is less than root: go left. Both greater-than root: go right. Split means root is LCA.`,
  },
  "lru-cache": {
    intuition: `— Need O(1) get and put. Use a hashmap for O(1) lookup and a doubly linked list to track recency.`,
    approach: [
      `— Need O(1) get and put.`,
      `Use a hashmap for O(1) lookup and a doubly linked list to track recency.`,
    ],
    cppSolution: `class LRUCache {
  int cap;
  list<pair<int,int>> cache;
  unordered_map<int,list<pair<int,int>>::iterator> mp;
  public: LRUCache(int c):cap(c) {
  }
  int get(int k) {
    if (!mp.count(k)) return -1;
    cache.splice(cache.begin(), cache, mp[k]);
    return mp[k].second;
  }
  void put(int k, int v) {
    if (mp.count(k)) cache.erase(mp[k]);
    else if ((int) cache.size()==cap) {
      mp.erase(cache.back().first);
      cache.pop_back();
    }
    cache.push_front( {
      k,v
    }
    );
    mp[k]=cache.begin();
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— HASHMAP + DOUBLY LINKED LIST. Map key to node. List: head=least recent tail=most recent. On access move node to front.`,
  },
  "max-area-island": {
    intuition: `— Same as number of islands but return the size of the largest island. DFS returns the size of the island it visited.`,
    approach: [
      `— Same as number of islands but return the size of the largest island.`,
      `DFS returns the size of the island it visited.`,
    ],
    cppSolution: `int maxAreaOfIsland(vector<vector<int>>& grid) {
  int m=grid.size(),n=grid[0].size(),res=0;
  function<int(int,int)> dfs=[&](int r,int c)->int {
    if (r<0||r>=m||c<0||c>=n||grid[r][c]==0) return 0;
    grid[r][c]=0;
    return 1+dfs(r+1,c)+dfs(r-1,c)+dfs(r,c+1)+dfs(r,c-1);
  }
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) res=max(res,dfs(r,c));
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DFS RETURNS SIZE. Each DFS call returns 1 + sum of neighbor DFS calls. Track max area seen.`,
  },
  "max-depth-tree": {
    intuition: `— The depth = 1 + max depth of left or right subtree. Base case: null node has depth 0.`,
    approach: [
      `— The depth = 1 + max depth of left or right subtree.`,
      `Base case: null node has depth 0.`,
    ],
    cppSolution: `int maxDepth(TreeNode* root) {
  if (!root) return 0;
  return 1 + max(maxDepth(root.left), maxDepth(root.right));
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DEPTH = 1 + max(left right). Trust the recursion. Null returns 0.`,
  },
  "max-path-sum": {
    intuition: `— At each node path through it = node pointer val + max(0 leftGain) + max(0 rightGain). Return only one branch to parent.`,
    approach: [
      `— At each node path through it = node pointer val + max(0 leftGain) + max(0 rightGain).`,
      `Return only one branch to parent.`,
    ],
    cppSolution: `int maxPathSum(TreeNode* root) {
  int res=INT_MIN;
  function<int(TreeNode*)> dfs=[&](TreeNode* n)->int {
    if (!n) return 0;
    int L=max(0,dfs(n.left)), R=max(0,dfs(n.right));
    res=max(res, n->val+L+R);
    return n->val+max(L,R);
  }
  dfs(root);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— GLOBAL MAX at each node. Gain = max(0 recurse). Path through node = val+left+right. Return val+max(left right) to parent.`,
  },
  "max-points-cards": {
    intuition: `— You can take k cards from the front or back. Total cards - k stay in middle. Minimise middle window sum.`,
    approach: [
      `— You can take k cards from the front or back.`,
      `Total cards - k stay in middle.`,
      `Minimise middle window sum.`,
    ],
    cppSolution: `int maxScore(vector<int>& cards, int k) {
  int n=cards.size(), total=0;
  for (int c:cards) total+=c;
  int windowSize=n-k, windowSum=0;
  for (int i=0; i<windowSize; i++) windowSum+=cards[i];
  int minWindow=windowSum;
  for (int i=windowSize; i<n; i++) {
    windowSum+=cards[i]-cards[i-windowSize];
    minWindow=min(minWindow,windowSum);
  }
  return total-minWindow;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— REVERSE THINKING: min sum of middle window of size n-k. Total - min_middle = max_cards.`,
  },
  "median-two-sorted": {
    intuition: `— Binary search on the smaller array partition. Find a cut so max of lefts is less-equal min of rightsghts) on both arrays.`,
    approach: [
      `— Binary search on the smaller array partition.`,
      `Find a cut so max of lefts is less-equal min of rightsghts) on both arrays.`,
    ],
    cppSolution: `double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
  if (A.size()> B.size()) return findMedianSortedArrays(B, A);
  int m=A.size(), n=B.size(), half=(m+n)/2;
  int L=0, R=m;
  while (true) {
    int i=L+(R-L)/2, j=half-i;
    int Al=i>0?A[i-1]:INT_MIN, Ar=i<m?A[i]:INT_MAX;
    int Bl=j>0?B[j-1]:INT_MIN, Br=j<n?B[j]:INT_MAX;
    if (Al<=Br & Bl<=Ar) {
      if ((m+n)%2) return min(Ar,Br);
      return(max(Al,Bl)+min(Ar,Br))/2.0;
    }
    else if (Al> Br) R=i-1;
    else L=i+1;
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— PARTITION BOTH ARRAYS. Binary search on smaller array. Ensure maxLeft1 is at most minRight2 AND maxLeft2 is at most minRight1.`,
  },
  "merge-k-sorted": {
    intuition: `— Use a min-heap to always extract the smallest current element. Push the next element of that list into the heap.`,
    approach: [
      `— Use a min-heap to always extract the smallest current element.`,
      `Push the next element of that list into the heap.`,
    ],
    cppSolution: `ListNode* mergeKLists(vector<ListNode*>& lists) {
  auto cmp=[](ListNode* a,ListNode* b) {
    return a->val> b->val;
  }
  priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> pq(cmp);
  for (auto l:lists) if (l) pq.push(l);
  ListNode dummy(0);
  ListNode* cur=&dummy;
  while (!pq.empty()) {
    cur->next=pq.top();
    pq.pop();
    cur=cur->next;
    if (cur->next) pq.push(cur->next);
  }
  return dummy.next;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIN-HEAP of node pointers. Extract min add to result push next node from same list. Heap size stays at most K.`,
  },
  "merge-two-sorted": {
    intuition: `— Compare heads of both lists. Take the smaller one attach to result advance that pointer.`,
    approach: [
      `— Compare heads of both lists.`,
      `Take the smaller one attach to result advance that pointer.`,
    ],
    cppSolution: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
  ListNode dummy(0);
  ListNode* cur = &dummy;
  while (l1 & l2) {
    if (l1->val<= l2->val) {
      cur->next=l1;
      l1=l1->next;
    }
    else {
      cur->next=l2;
      l2=l2->next;
    }
    cur = cur->next;
  }
  cur->next = l1 ? l1 : l2;
  return dummy.next;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SMALLER HEAD WINS. Use a dummy node to simplify head handling. Compare l1 and l2 take smaller move that pointer.`,
  },
  "min-depth-tree": {
    intuition: `— BFS finds shortest path to leaf fastest. Or DFS: depth = 1 + min of non-null children.`,
    approach: [
      `— BFS finds shortest path to leaf fastest.`,
      `Or DFS: depth = 1 + min of non-null children.`,
    ],
    cppSolution: `int minDepth(TreeNode* root) {
  if (!root) return 0;
  queue<TreeNode*> q;
  q.push(root);
  int depth=1;
  while (!q.empty()) {
    int sz=q.size();
    while (sz--) {
      auto n=q.front();
      q.pop();
      if (!n->left&&!n->right) return depth;
      if (n->left) q.push(n->left);
      if (n->right) q.push(n->right);
    }
    depth++;
  }
  return depth;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BFS SHORTEST PATH TO LEAF. First leaf found in BFS = minimum depth. DFS: be careful with nodes that have only one child.`,
  },
  "min-stack": {
    intuition: `— Normal stack plus track the minimum. When you push also push the current minimum at that moment.`,
    approach: [
      `— Normal stack plus track the minimum.`,
      `When you push also push the current minimum at that moment.`,
    ],
    cppSolution: `class MinStack {
  stack<int> st, minSt;
  public: void push(int val) {
    st.push(val);
    minSt.push(minSt.empty()? val : min(val, minSt.top()));
  }
  void pop() {
    st.pop();
    minSt.pop();
  }
  int top() {
    return st.top();
  }
  int getMin() {
    return minSt.top();
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO STACKS: main + minStack. minStack stores current min AT EACH LEVEL. Push min(new_val, minStack.top()) every push.`,
  },
  "min-window-substring": {
    intuition: `— Expand R until window has all chars of t. Then shrink L to minimise. Track have vs need counts.`,
    approach: [
      `— Expand R until window has all chars of t.`,
      `Then shrink L to minimise.`,
      `Track have vs need counts.`,
    ],
    cppSolution: `string minWindow(string s, string t) {
  unordered_map<char,int> need, have;
  for (char c : t) need[c]++;
  int formed = 0, required = need.size();
  int L = 0, minLen = INT_MAX, start = 0;
  for (int R = 0; R<(int) s.size(); R++) {
    char c = s[R];
    have[c]++;
    if (need.count(c)& have[c] == need[c]) formed++;
    while (formed == required) {
      if (R-L+1<minLen) {
        minLen = R-L+1;
        start = L;
      }
      have[s[L]]--;
      if (need.count(s[L])& have[s[L]]<need[s[L]]) formed--;
      L++;
    }
  }
  return minLen==INT_MAX ? "" : s.substr(start, minLen);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— HAVE vs NEED. Expand until formed == required. Then shrink L to minimise. formed counter tracks satisfied unique chars.`,
  },
  "move-zeroes": {
    intuition: `— Move all zeroes to the end while maintaining relative order of non-zero elements. Two pointers: one for placing non-zeroes.`,
    approach: [
      `— Move all zeroes to the end while maintaining relative order of non-zero elements.`,
      `Two pointers: one for placing non-zeroes.`,
    ],
    cppSolution: `void moveZeroes(vector<int>& nums) {
  int slow=0;
  for (int fast=0; fast<(int) nums.size(); fast++) if (nums[fast]!=0) swap(nums[slow++],nums[fast]);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SLOW FAST POINTERS. Slow tracks where to place next non-zero. Fast scans. When fast finds non-zero swap with slow.`,
  },
  "n-queens": {
    intuition: `— Place queens row by row. A position is safe if no queen in same column or diagonals. Use sets to track occupied slots.`,
    approach: [
      `— Place queens row by row.`,
      `A position is safe if no queen in same column or diagonals.`,
      `Use sets to track occupied slots.`,
    ],
    cppSolution: `vector<vector<string>> solveNQueens(int n) {
  vector<vector<string>> res;
  vector<string> board(n, string(n,'.'));
  set<int> cols,diag,anti;
  function<void(int)> bt=[&](int r) {
    if (r==n) {
      res.push_back(board);
      return;
    }
    for (int c=0; c<n; c++) {
      if (cols.count(c)||diag.count(r-c)||anti.count(r+c)) continue;
      board[r][c]='Q';
      cols.insert(c);
      diag.insert(r-c);
      anti.insert(r+c);
      bt(r+1);
      board[r][c]='.';
      cols.erase(c);
      diag.erase(r-c);
      anti.erase(r+c);
    }
  }
  bt(0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SETS for col diag (r-c) anti-diag (r+c). Try each column in each row. If safe place and recurse. Unplace on backtrack.`,
  },
  "number-of-islands": {
    intuition: `— For each unvisited 1 do DFS to mark the whole island as visited. Count how many times you start a new DFS.`,
    approach: [
      `— For each unvisited 1 do DFS to mark the whole island as visited.`,
      `Count how many times you start a new DFS.`,
    ],
    cppSolution: `int numIslands(vector<vector<char>>& grid) {
  int m=grid.size(),n=grid[0].size(),res=0;
  function<void(int,int)> dfs=[&](int r,int c) {
    if (r<0||r>=m||c<0||c>=n||grid[r][c]!='1') return;
    grid[r][c]='0';
    dfs(r+1,c);
    dfs(r-1,c);
    dfs(r,c+1);
    dfs(r,c-1);
  }
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) if (grid[r][c]=='1') {
    dfs(r,c);
    res++;
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DFS from every 1. Mark visited by setting to 0. Each DFS start = one island. Count DFS starts.`,
  },
  "pacific-atlantic": {
    intuition: `— Reverse flow: BFS from Pacific edges and Atlantic edges separately. Answer = cells reachable from both.`,
    approach: [
      `— Reverse flow: BFS from Pacific edges and Atlantic edges separately.`,
      `Answer = cells reachable from both.`,
    ],
    cppSolution: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
  int m=h.size(),n=h[0].size();
  vector<vector<bool>> pac(m,vector<bool>(n,false)),atl(m,vector<bool>(n,false));
  auto bfs=[&](queue<pair<int,int>>& q, vector<vector<bool>>& vis) {
    int d[][2]= {
      {
        1,0
      }
      , {
        -1,0
      }
      , {
        0,1
      }
      , {
        0,-1
      }
    }
    while (!q.empty()) {
      auto[r,c]=q.front();
      q.pop();
      for (auto&dr:d) {
        int nr=r+dr[0],nc=c+dr[1];
        if (nr>=0&&nr<m&&nc>=0&&nc<n&&!vis[nr][nc]&&h[nr][nc]>=h[r][c]) {
          vis[nr][nc]=true;
          q.push( {
            nr,nc
          }
          );
        }
      }
    }
  }
  queue<pair<int,int>> pq,aq;
  for (int i=0; i<m; i++) {
    pac[i][0]=true;
    pq.push( {
      i,0
    }
    );
    atl[i][n-1]=true;
    aq.push( {
      i,n-1
    }
    );
  }
  for (int j=0; j<n; j++) {
    pac[0][j]=true;
    pq.push( {
      0,j
    }
    );
    atl[m-1][j]=true;
    aq.push( {
      m-1,j
    }
    );
  }
  bfs(pq,pac);
  bfs(aq,atl);
  vector<vector<int>> res;
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) if (pac[r][c]&&atl[r][c]) res.push_back( {
    r,c
  }
  );
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— REVERSE FLOW: BFS FROM BORDERS. Pacific = top+left edges. Atlantic = bottom+right edges. Cell in both = answer.`,
  },
  "palindrome-linked-list": {
    intuition: `— Find middle reverse second half compare with first half.`,
    approach: [
      `— Find middle reverse second half compare with first half.`,
    ],
    cppSolution: `bool isPalindrome(ListNode* head) {
  ListNode* slow=head,*fast=head;
  while (fast&&fast->next) {
    slow=slow->next;
    fast=fast->next->next;
  }
  ListNode* prev=nullptr,*curr=slow;
  while (curr) {
    ListNode* nxt=curr->next;
    curr->next=prev;
    prev=curr;
    curr=nxt;
  }
  ListNode* left=head,*right=prev;
  while (right) {
    if (left->val!=right->val) return false;
    left=left->next;
    right=right->next;
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FIND MID then REVERSE SECOND HALF then COMPARE. Classic three-step linked list pattern.`,
  },
  "palindrome-partitioning": {
    intuition: `— Backtrack trying all substrings from current index. If it is a palindrome add it and recurse from after it.`,
    approach: [
      `— Backtrack trying all substrings from current index.`,
      `If it is a palindrome add it and recurse from after it.`,
    ],
    cppSolution: `vector<vector<string>> partition(string s) {
  vector<vector<string>> res;
  vector<string> cur;
  function<bool(int,int)> isPalin=[&](int l,int r) {
    while (l<r) if (s[l++]!=s[r--]) return false;
    return true;
  }
  function<void(int)> bt=[&](int start) {
    if (start==(int) s.size()) {
      res.push_back(cur);
      return;
    }
    for (int end=start; end<(int) s.size(); end++) {
      if (isPalin(start,end)) {
        cur.push_back(s.substr(start,end-start+1));
        bt(end+1);
        cur.pop_back();
      }
    }
  }
  bt(0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BACKTRACK + PALINDROME CHECK. For each end index if substr is palindrome: add to path recurse pop. Collect when i reaches end.`,
  },
  "path-sum": {
    intuition: `— DFS checking if any root-to-leaf path sums to target. Subtract node value as you go down.`,
    approach: [
      `— DFS checking if any root-to-leaf path sums to target.`,
      `Subtract node value as you go down.`,
    ],
    cppSolution: `bool hasPathSum(TreeNode* root, int target) {
  if (!root) return false;
  if (!root->left&&!root->right) return root->val==target;
  return hasPathSum(root->left,target-root->val)||hasPathSum(root->right,target-root->val);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DFS subtracting. If leaf and remaining==0: found. Recurse left and right with reduced target.`,
  },
  "permutation-in-string": {
    intuition: `— Fixed window of size len(s1). Check if window character frequencies match s1. Slide window and update counts.`,
    approach: [
      `— Fixed window of size len(s1).`,
      `Check if window character frequencies match s1.`,
      `Slide window and update counts.`,
    ],
    cppSolution: `bool checkInclusion(string s1, string s2) {
  if (s1.size()> s2.size()) return false;
  vector<int> need(26,0), have(26,0);
  for (char c : s1) need[c-'a']++;
  for (int i = 0; i<(int) s1.size(); i++) have[s2[i]-'a']++;
  if (need == have) return true;
  for (int i = s1.size(); i<(int) s2.size(); i++) {
    have[s2[i]-'a']++;
    have[s2[i-s1.size()]-'a']--;
    if (need == have) return true;
  }
  return false;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FIXED WINDOW = len(s1). Count chars in s1. Slide same-size window over s2. Add right char remove left char compare.`,
  },
  "permutations": {
    intuition: `— Use a visited array. At each step try all unvisited elements. Mark visited before recurse unmark after.`,
    approach: [
      `— Use a visited array.`,
      `At each step try all unvisited elements.`,
      `Mark visited before recurse unmark after.`,
    ],
    cppSolution: `vector<vector<int>> permute(vector<int>& nums) {
  vector<vector<int>> res;
  vector<int> cur;
  vector<bool> used(nums.size(),false);
  function<void()> bt=[&]() {
    if ((int) cur.size()==(int) nums.size()) {
      res.push_back(cur);
      return;
    }
    for (int i=0; i<(int) nums.size(); i++) {
      if (used[i]) continue;
      used[i]=true;
      cur.push_back(nums[i]);
      bt();
      used[i]=false;
      cur.pop_back();
    }
  }
  bt();
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— VISITED ARRAY. Try every element at every position but skip already used. used[i]=true recurse used[i]=false.`,
  },
  "product-except-self": {
    intuition: `— For each position you need product of everything to its left AND right. Precompute both directions without division.`,
    approach: [
      `— For each position you need product of everything to its left AND right.`,
      `Precompute both directions without division.`,
    ],
    cppSolution: `vector<int> productExceptSelf(vector<int>& nums) {
  int n = nums.size();
  vector<int> res(n, 1);
  int left = 1;
  for (int i = 0; i<n; i++) {
    res[i] = left;
    left *= nums[i];
  }
  int right = 1;
  for (int i = n-1; i>= 0; i--) {
    res[i] *= right;
    right *= nums[i];
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— LEFT PASS then RIGHT PASS. First sweep stores running product from left. Second sweep multiplies in product from right.`,
  },
  "ransom-note": {
    intuition: `— Check if all characters needed for the ransom note can be found in the magazine. What counts matter?`,
    approach: [
      `— Check if all characters needed for the ransom note can be found in the magazine.`,
      `What counts matter?`,
    ],
    cppSolution: `bool canConstruct(string ransomNote, string magazine) {
  vector<int> cnt(26,0);
  for (char c:magazine) cnt[c-'a']++;
  for (char c:ransomNote) {
    cnt[c-'a']--;
    if (cnt[c-'a']<0) return false;
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— CHAR FREQUENCY. Count chars in magazine. For each char in note subtract from magazine. If any goes negative: false.`,
  },
  "remove-nth-node": {
    intuition: `— Move right pointer n steps ahead. Then move both until right reaches end. Delete left's next node.`,
    approach: [
      `— Move right pointer n steps ahead.`,
      `Then move both until right reaches end.`,
      `Delete left's next node.`,
    ],
    cppSolution: `ListNode* removeNthFromEnd(ListNode* head, int n) {
  ListNode* dummy=new ListNode(0,head);
  ListNode* L=dummy, *R=head;
  while (n--) R=R->next;
  while (R) {
    L=L->next;
    R=R->next;
  }
  L->next=L->next->next;
  return dummy->next;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— GAP OF N. R goes n steps first. Then both move together. When R=null L.next is target. Dummy node handles edge cases.`,
  },
  "reorder-list": {
    intuition: `— Three steps: find middle reverse second half merge two halves alternately.`,
    approach: [
      `— Three steps: find middle reverse second half merge two halves alternately.`,
    ],
    cppSolution: `void reorderList(ListNode* head) {
  ListNode* slow=head, *fast=head;
  while (fast->next & fast->next->next) {
    slow=slow->next;
    fast=fast->next->next;
  }
  ListNode* second=slow->next;
  slow->next=nullptr;
  ListNode* prev=nullptr, *curr=second;
  while (curr) {
    ListNode* tmp=curr->next;
    curr->next=prev;
    prev=curr;
    curr=tmp;
  }
  ListNode* first=head;
  second=prev;
  while (second) {
    ListNode* t1=first->next, *t2=second->next;
    first->next=second;
    second->next=t1;
    first=t1;
    second=t2;
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FIND MID then REVERSE SECOND HALF then MERGE. Like folding a list in half and interleaving the two halves.`,
  },
  "reverse-k-group": {
    intuition: `— Count k nodes reverse them recurse for the rest. Connect reversed group to the recursed result.`,
    approach: [
      `— Count k nodes reverse them recurse for the rest.`,
      `Connect reversed group to the recursed result.`,
    ],
    cppSolution: `ListNode* reverseKGroup(ListNode* head, int k) {
  ListNode* cur=head;
  int count=0;
  while (cur & count<k) {
    cur=cur->next;
    count++;
  }
  if (count<k) return head;
  ListNode* prev=nullptr, *node=head;
  for (int i=0; i<k; i++) {
    ListNode* nxt=node->next;
    node->next=prev;
    prev=node;
    node=nxt;
  }
  head->next=reverseKGroup(node,k);
  return prev;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— COUNT K then REVERSE GROUP then RECURSE TAIL. If fewer than k nodes remain leave as is. Connect group tail to recursive result.`,
  },
  "reverse-linked-list": {
    intuition: `— Iteratively change the next pointer of each node to point to the previous node. You need three pointers.`,
    approach: [
      `— Iteratively change the next pointer of each node to point to the previous node.`,
      `You need three pointers.`,
    ],
    cppSolution: `ListNode* reverseList(ListNode* head) {
  ListNode* prev = nullptr, *curr = head;
  while (curr) {
    ListNode* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— prev=null curr=head. Loop: save next point curr to prev advance prev and curr. When curr=null prev is new head.`,
  },
  "reverse-polish": {
    intuition: `— Push numbers onto stack. When you see an operator pop two numbers apply operator push result back.`,
    approach: [
      `— Push numbers onto stack.`,
      `When you see an operator pop two numbers apply operator push result back.`,
    ],
    cppSolution: `int evalRPN(vector<string>& tokens) {
  stack<long> st;
  for (string& t : tokens) {
    if (t=="+"||t=="-"||t=="*"||t=="/") {
      long b = st.top();
      st.pop();
      long a = st.top();
      st.pop();
      if (t=="+") st.push(a+b);
      else if (t=="-") st.push(a-b);
      else if (t=="*") st.push(a*b);
      else st.push(a/b);
    }
    else st.push(stol(t));
  }
  return st.top();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— OPERAND: push. OPERATOR: pop two compute push result. Stack naturally handles order of operations in RPN.`,
  },
  "right-side-view": {
    intuition: `— BFS level by level. The last node processed at each level is visible from the right side.`,
    approach: [
      `— BFS level by level.`,
      `The last node processed at each level is visible from the right side.`,
    ],
    cppSolution: `vector<int> rightSideView(TreeNode* root) {
  vector<int> res;
  if (!root) return res;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int sz=q.size();
    for (int i=0; i<sz; i++) {
      TreeNode* n=q.front();
      q.pop();
      if (i==sz-1) res.push_back(n->val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— LAST NODE PER LEVEL = right view. BFS take the last element of each level.`,
  },
  "rotting-oranges": {
    intuition: `— Multi-source BFS from all initially rotten oranges simultaneously. Each BFS level = 1 minute.`,
    approach: [
      `— Multi-source BFS from all initially rotten oranges simultaneously.`,
      `Each BFS level = 1 minute.`,
    ],
    cppSolution: `int orangesRotting(vector<vector<int>>& grid) {
  int m=grid.size(),n=grid[0].size(),fresh=0,mins=0;
  queue<pair<int,int>> q;
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) {
    if (grid[r][c]==2) q.push( {
      r,c
    }
    );
    if (grid[r][c]==1) fresh++;
  }
  int d[][2]= {
    {
      1,0
    }
    , {
      -1,0
    }
    , {
      0,1
    }
    , {
      0,-1
    }
  }
  while (!q.empty()&&fresh>0) {
    int sz=q.size();
    mins++;
    while (sz--) {
      auto[r,c]=q.front();
      q.pop();
      for (auto&dr:d) {
        int nr=r+dr[0],nc=c+dr[1];
        if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]==1) {
          grid[nr][nc]=2;
          fresh--;
          q.push( {
            nr,nc
          }
          );
        }
      }
    }
  }
  return fresh==0?mins:-1;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MULTI-SOURCE BFS. Start from ALL rotten oranges at once. Spread each minute. Count fresh left after BFS.`,
  },
  "same-tree": {
    intuition: `— Two trees are the same if roots have same value AND left subtrees are same AND right subtrees are same.`,
    approach: [
      `— Two trees are the same if roots have same value AND left subtrees are same AND right subtrees are same.`,
    ],
    cppSolution: `bool isSameTree(TreeNode* p, TreeNode* q) {
  if (!p & !q) return true;
  if (!p || !q || p->val!=q->val) return false;
  return isSameTree(p.left,q.left)& isSameTree(p.right,q.right);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SAME = same val + same left + same right. Both null = true. One null = false. Values differ = false.`,
  },
  "search-2d-matrix": {
    intuition: `— Treat the 2D matrix as a 1D sorted array. Map 1D index to 2D: row = mid/cols col = mid%cols.`,
    approach: [
      `— Treat the 2D matrix as a 1D sorted array.`,
      `Map 1D index to 2D: row = mid/cols col = mid%cols.`,
    ],
    cppSolution: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
  int m = matrix.size(), n = matrix[0].size();
  int L = 0, R = m*n-1;
  while (L<= R) {
    int mid = L+(R-L)/2;
    int val = matrix[mid/n][mid%n];
    if (val==target) return true;
    else if (val<target) L = mid+1;
    else R = mid-1;
  }
  return false;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FLATTEN the matrix. Binary search on [0 m*n-1]. Convert mid to (mid/cols mid%cols). Same as 1D binary search.`,
  },
  "search-insert-position": {
    intuition: `— Binary search. If target found return index. If not found return where it would be inserted.`,
    approach: [
      `— Binary search.`,
      `If target found return index.`,
      `If not found return where it would be inserted.`,
    ],
    cppSolution: `int searchInsert(vector<int>& nums, int target) {
  int L=0,R=(int) nums.size()-1;
  while (L<=R) {
    int mid=L+(R-L)/2;
    if (nums[mid]==target) return mid;
    else if (nums[mid]<target) L=mid+1;
    else R=mid-1;
  }
  return L;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— STANDARD BINARY SEARCH. If not found L is the insertion position. Return L after loop exits.`,
  },
  "search-rotated": {
    intuition: `— One half is always sorted. Check which half then decide if target is in that sorted half.`,
    approach: [
      `— One half is always sorted.`,
      `Check which half then decide if target is in that sorted half.`,
    ],
    cppSolution: `int search(vector<int>& nums, int target) {
  int L = 0, R =(int) nums.size()-1;
  while (L<= R) {
    int mid = L+(R-L)/2;
    if (nums[mid]==target) return mid;
    if (nums[L] is less-equal nums[mid]) {
      if (nums[L]<=target & target<nums[mid]) R = mid-1;
      else L = mid+1;
    }
    else {
      if (nums[mid]<target & target<=nums[R]) L = mid+1;
      else R = mid-1;
    }
  }
  return -1;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— IDENTIFY SORTED HALF first. If nums[L] is less-equal nums[mid]: left sorted. Is target in range [L mid]? Go left. Else go right.`,
  },
  "serialize-deserialize": {
    intuition: `— Preorder DFS to serialize writing val or N for null. Deserialize using a queue of tokens rebuild recursively.`,
    approach: [
      `— Preorder DFS to serialize writing val or N for null.`,
      `Deserialize using a queue of tokens rebuild recursively.`,
    ],
    cppSolution: `string serialize(TreeNode* root) {
  if (!root) return "N,";
  return to_string(root->val)+","+serialize(root.left)+serialize(root.right);
}
TreeNode* deserialize(string data) {
  queue<string> q;
  stringstream ss(data);
  string tok;
  while (getline(ss,tok,',')) q.push(tok);
  function<TreeNode*()> dfs=[&]().TreeNode* {
    string v=q.front();
    q.pop();
    if (v=="N") return nullptr;
    TreeNode* n=new TreeNode(stoi(v));
    n.left=dfs();
    n.right=dfs();
    return n;
  }
  return dfs();
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— PREORDER + NULL MARKERS. Serialize: write val recurse left right write N for null. Deserialize: read token create node recurse.`,
  },
  "sliding-window-max": {
    intuition: `— A deque can track useful candidates. Remove elements outside the window and smaller elements from the back.`,
    approach: [
      `— A deque can track useful candidates.`,
      `Remove elements outside the window and smaller elements from the back.`,
    ],
    cppSolution: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
  deque<int> dq;
  vector<int> res;
  for (int i = 0; i<(int) nums.size(); i++) {
    while (!dq.empty()& nums[dq.back()]<nums[i]) dq.pop_back();
    dq.push_back(i);
    if (dq.front()<= i-k) dq.pop_front();
    if (i>= k-1) res.push_back(nums[dq.front()]);
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MONOTONIC DEQUE: indices in decreasing order of values. Front = max. Pop back anything smaller before adding R.`,
  },
  "subsets": {
    intuition: `— At each element include it or do not. Backtrack by adding to current recurse with next index then remove.`,
    approach: [
      `— At each element include it or do not.`,
      `Backtrack by adding to current recurse with next index then remove.`,
    ],
    cppSolution: `vector<vector<int>> subsets(vector<int>& nums) {
  vector<vector<int>> res;
  vector<int> cur;
  function<void(int)> bt=[&](int i) {
    res.push_back(cur);
    for (int j=i; j<(int) nums.size(); j++) {
      cur.push_back(nums[j]);
      bt(j+1);
      cur.pop_back();
    }
  }
  bt(0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— INCLUDE or EXCLUDE. For each element: push recurse from next index pop. Every recursive call state is a valid subset.`,
  },
  "subsets-ii": {
    intuition: `— Sort first. Skip duplicate elements at the same recursion level. Allow same element in deeper levels.`,
    approach: [
      `— Sort first.`,
      `Skip duplicate elements at the same recursion level.`,
      `Allow same element in deeper levels.`,
    ],
    cppSolution: `vector<vector<int>> subsetsWithDup(vector<int>& nums) {
  sort(nums.begin(),nums.end());
  vector<vector<int>> res;
  vector<int> cur;
  function<void(int)> bt=[&](int start) {
    res.push_back(cur);
    for (int i=start; i<(int) nums.size(); i++) {
      if (i> start&&nums[i]==nums[i-1]) continue;
      cur.push_back(nums[i]);
      bt(i+1);
      cur.pop_back();
    }
  }
  bt(0);
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORT + SKIP DUPS AT SAME LEVEL. if i greater-than start AND nums[i]==nums[i-1]: skip. Avoids duplicate subsets.`,
  },
  "subtree-of-another": {
    intuition: `— For each node in the main tree check if the subtree rooted there is identical to the given subtree.`,
    approach: [
      `— For each node in the main tree check if the subtree rooted there is identical to the given subtree.`,
    ],
    cppSolution: `bool isSubtree(TreeNode* root, TreeNode* sub) {
  if (!root) return false;
  if (isSameTree(root, sub)) return true;
  return isSubtree(root.left,sub)|| isSubtree(root.right,sub);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— IS SAME TREE at every node. Call isSameTree(root sub). If false recurse on left and right children.`,
  },
  "surrounded-regions": {
    intuition: `— O's connected to the border cannot be captured. DFS from all border O's and mark them safe. Flip unmarked O's.`,
    approach: [
      `— O's connected to the border cannot be captured.`,
      `DFS from all border O's and mark them safe.`,
      `Flip unmarked O's.`,
    ],
    cppSolution: `void solve(vector<vector<char>>& board) {
  int m=board.size(),n=board[0].size();
  function<void(int,int)> dfs=[&](int r,int c) {
    if (r<0||r>=m||c<0||c>=n||board[r][c]!='O') return;
    board[r][c]='S';
    dfs(r+1,c);
    dfs(r-1,c);
    dfs(r,c+1);
    dfs(r,c-1);
  }
  for (int r=0; r<m; r++) {
    dfs(r,0);
    dfs(r,n-1);
  }
  for (int c=0; c<n; c++) {
    dfs(0,c);
    dfs(m-1,c);
  }
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) {
    if (board[r][c]=='O') board[r][c]='X';
    else if (board[r][c]=='S') board[r][c]='O';
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BORDER-CONNECTED O's ARE SAFE. DFS from all border O's mark as S. Then O becomes X (captured) S becomes O (restore).`,
  },
  "swap-pairs": {
    intuition: `— Swap every two adjacent nodes. Use recursion: swap first pair then recurse on the rest.`,
    approach: [
      `— Swap every two adjacent nodes.`,
      `Use recursion: swap first pair then recurse on the rest.`,
    ],
    cppSolution: `ListNode* swapPairs(ListNode* head) {
  if (!head||!head->next) return head;
  ListNode* second=head->next;
  head->next=swapPairs(second->next);
  second->next=head;
  return second;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SWAP PAIR then RECURSE. head->next = swapPairs(second->next). second->next = head. Return second.`,
  },
  "symmetric-tree": {
    intuition: `— A tree is symmetric if left subtree mirrors right subtree. Compare outer and inner pairs recursively.`,
    approach: [
      `— A tree is symmetric if left subtree mirrors right subtree.`,
      `Compare outer and inner pairs recursively.`,
    ],
    cppSolution: `bool isSymmetric(TreeNode* root) {
  function<bool(TreeNode*,TreeNode*)> mirror=[&](TreeNode* l,TreeNode* r)->bool {
    if (!l&&!r) return true;
    if (!l||!r||l->val!=r->val) return false;
    return mirror(l->left,r->right)&&mirror(l->right,r->left);
  }
  return mirror(root->left,root->right);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIRROR CHECK. isMirror(left right). left->val == right->val AND isMirror(left->left right->right) AND isMirror(left->right right->left).`,
  },
  "task-scheduler": {
    intuition: `— The bottleneck is the most frequent task. Gap = (maxFreq-1)*(n+1) + count of tasks with maxFreq.`,
    approach: [
      `— The bottleneck is the most frequent task.`,
      `Gap = (maxFreq-1)*(n+1) + count of tasks with maxFreq.`,
    ],
    cppSolution: `int leastInterval(vector<char>& tasks, int n) {
  vector<int> freq(26,0);
  for (char c:tasks) freq[c-'A']++;
  int maxFreq=*max_element(freq.begin(),freq.end());
  int maxCount=count(freq.begin(),freq.end(),maxFreq);
  return max((int) tasks.size(),(maxFreq-1)*(n+1)+maxCount);
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FORMULA: (maxFreq-1)*(n+1) + countOfMaxFreqTasks. Answer = max(this len(tasks)). Most frequent task determines idle time.`,
  },
  "three-sum": {
    intuition: `— Fix one element with a for loop then use two pointers for the remaining pair. Sort first to avoid duplicates easily.`,
    approach: [
      `— Fix one element with a for loop then use two pointers for the remaining pair.`,
      `Sort first to avoid duplicates easily.`,
    ],
    cppSolution: `vector<vector<int>> threeSum(vector<int>& nums) {
  sort(nums.begin(), nums.end());
  vector<vector<int>> res;
  for (int i = 0; i<(int) nums.size(); i++) {
    if (i is positive & nums[i] == nums[i-1]) continue;
    int L = i+1, R =(int) nums.size()-1;
    while (L<R) {
      int sum = nums[i]+nums[L]+nums[R];
      if (sum == 0) {
        res.push_back( {
          nums[i],nums[L],nums[R]
        }
        );
        while (L<R & nums[L]==nums[L+1]) L++;
        while (L<R & nums[R]==nums[R-1]) R--;
        L++;
        R--;
      }
      else if (sum<0) L++;
      else R--;
    }
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— FIX + TWO POINTER. Sort first. Skip duplicate at i. Skip duplicates after finding valid triplet. Like Two Sum II with a fixed element.`,
  },
  "time-based-key-value": {
    intuition: `— Store values in a list per key. Timestamps are increasing so binary search for largest timestamp is at most given time.`,
    approach: [
      `— Store values in a list per key.`,
      `Timestamps are increasing so binary search for largest timestamp is at most given time.`,
    ],
    cppSolution: `class TimeMap {
  unordered_map<string, vector<pair<int,string>>> store;
  public: void set(string k, string v, int t) {
    store[k].push_back( {
      t,v
    }
    );
  }
  string get(string k, int t) {
    auto& v = store[k];
    int L=0, R=(int) v.size()-1;
    string res="";
    while (L<=R) {
      int mid=L+(R-L)/2;
      if (v[mid].first<=t) {
        res=v[mid].second;
        L=mid+1;
      }
      else R=mid-1;
    }
    return res;
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORTED TIMESTAMPS = binary search. Store list of timestamp-value pairs. Binary search for rightmost timestamp is at most t.`,
  },
  "top-k-frequent": {
    intuition: `— Count frequencies with a map then find the K highest. Use a min-heap of size K to avoid sorting all elements.`,
    approach: [
      `— Count frequencies with a map then find the K highest.`,
      `Use a min-heap of size K to avoid sorting all elements.`,
    ],
    cppSolution: `vector<int> topKFrequent(vector<int>& nums, int k) {
  unordered_map<int,int> freq;
  for (int n : nums) freq[n]++;
  priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>> minH;
  for (auto& [val, cnt] : freq) {
    minH.push( {
      cnt, val
    }
    );
    if ((int) minH.size()> k) minH.pop();
  }
  vector<int> res;
  while (!minH.empty()) {
    res.push_back(minH.top().second);
    minH.pop();
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— MIN-HEAP TRICK: Keep a min-heap of size K. When it exceeds K pop the smallest. What remains is the top K.`,
  },
  "trapping-rain-water": {
    intuition: `— Water at each cell = min(maxLeft, maxRight) - height. Two pointer: process the smaller side first.`,
    approach: [
      `— Water at each cell = min(maxLeft, maxRight) - height.`,
      `Two pointer: process the smaller side first.`,
    ],
    cppSolution: `int trap(vector<int>& height) {
  int L = 0, R =(int) height.size()-1;
  int maxL = 0, maxR = 0, res = 0;
  while (L<R) {
    if (maxL<= maxR) {
      maxL = max(maxL, height[L]);
      res += maxL - height[L];
      L++;
    }
    else {
      maxR = max(maxR, height[R]);
      res += maxR - height[R];
      R--;
    }
  }
  return res;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— WATER = min(maxL, maxR) - height. Whichever side has smaller max process it. That side max is the bottleneck.`,
  },
  "two-sum": {
    intuition: `— For each number you need its partner (target - num). Store what you have seen so far to find the partner instantly.`,
    approach: [
      `— For each number you need its partner (target - num).`,
      `Store what you have seen so far to find the partner instantly.`,
    ],
    cppSolution: `vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int,int> seen;
  for (int i = 0; i<(int) nums.size(); i++) {
    int comp = target - nums[i];
    if (seen.count(comp)) return {
      seen[comp], i
    }
    seen[nums[i]] = i;
  }
  return {
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— TWO SUM = looking for my other half. Map stores each number. For every new number check if complement exists.`,
  },
  "two-sum-ii": {
    intuition: `— Array is sorted. If sum is too big move right pointer left. If too small move left pointer right.`,
    approach: [
      `— Array is sorted.`,
      `If sum is too big move right pointer left.`,
      `If too small move left pointer right.`,
    ],
    cppSolution: `vector<int> twoSum(vector<int>& nums, int target) {
  int L = 0, R =(int) nums.size()-1;
  while (L<R) {
    int sum = nums[L] + nums[R];
    if (sum == target) return {
      L+1, R+1
    }
    else if (sum<target) L++;
    else R--;
  }
  return {
  }
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— SORTED = TWO POINTERS. Too big: R--. Too small: L++. Equal: done. Never need a hashmap when array is sorted.`,
  },
  "valid-anagram": {
    intuition: `— Two strings are anagrams if they use exact same letters same number of times. Count chars in s then subtract for t.`,
    approach: [
      `— Two strings are anagrams if they use exact same letters same number of times.`,
      `Count chars in s then subtract for t.`,
    ],
    cppSolution: `bool isAnagram(string s, string t) {
  if (s.size()!= t.size()) return false;
  unordered_map<char,int> freq;
  for (char c : s) freq[c]++;
  for (char c : t) {
    freq[c]--;
    if (freq[c]<0) return false;
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— ANAGRAM = same letters shuffled. Increment freq for s, decrement for t. Any count going negative = not anagram.`,
  },
  "valid-palindrome": {
    intuition: `— Skip non-alphanumeric chars. Compare chars from both ends moving inward. What two pointers do you need?`,
    approach: [
      `— Skip non-alphanumeric chars.`,
      `Compare chars from both ends moving inward.`,
      `What two pointers do you need?`,
    ],
    cppSolution: `bool isPalindrome(string s) {
  int L = 0, R =(int) s.size()-1;
  while (L<R) {
    while (L<R & !isalnum(s[L])) L++;
    while (L<R & !isalnum(s[R])) R--;
    if (tolower(s[L])!= tolower(s[R])) return false;
    L++;
    R--;
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— L and R squeeze inward skip non-alpha. tolower() both before comparing. Stop when L is at least R.`,
  },
  "valid-parentheses": {
    intuition: `— Push open brackets onto a stack. When you see a closing bracket check if top of stack is its matching opener.`,
    approach: [
      `— Push open brackets onto a stack.`,
      `When you see a closing bracket check if top of stack is its matching opener.`,
    ],
    cppSolution: `bool isValid(string s) {
  stack<char> st;
  for (char c : s) {
    if (c=='('||c==' {
      '||c=='[') st.push(c); else {
        if (st.empty()) return false; char t = st.top(); st.pop(); if (c==')'&&t!='(') return false; if (c=='
      }
      '&&t!=' {
        ') return false; if (c==']'&&t!='[') return false;
      }
    }
    return st.empty();
  }`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— STACK = memory of openers. Closing bracket? Peek top. Match? Pop. No match or empty? False. End: stack must be empty.`,
  },
  "valid-sudoku": {
    intuition: `— Check rows, columns, and 3x3 boxes separately. Box index = (row/3)*3 + col/3. Use sets to detect duplicates.`,
    approach: [
      `— Check rows, columns, and 3x3 boxes separately.`,
      `Box index = (row/3)*3 + col/3.`,
      `Use sets to detect duplicates.`,
    ],
    cppSolution: `bool isValidSudoku(vector<vector<char>>& board) {
  unordered_set<string> seen;
  for (int r = 0; r<9; r++) for (int c = 0; c<9; c++) {
    char d = board[r][c];
    if (d == '.') continue;
    if (!seen.insert(to_string(r)+"r"+d).second) return false;
    if (!seen.insert(to_string(c)+"c"+d).second) return false;
    if (!seen.insert(to_string(r/3)+","+to_string(c/3)+"b"+d).second) return false;
  }
  return true;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— BOX INDEX = (row/3)*3 + (col/3). Encode each digit with its position context into a single set. If insert fails: invalid.`,
  },
  "validate-bst": {
    intuition: `— Each node must be within a valid range (min max). Pass these bounds down recursively.`,
    approach: [
      `— Each node must be within a valid range (min max).`,
      `Pass these bounds down recursively.`,
    ],
    cppSolution: `bool isValidBST(TreeNode* root) {
  function<bool(TreeNode*,long,long)> ok=[&](TreeNode* n, long lo, long hi) {
    if (!n) return true;
    if (n->val<=lo || n->val>=hi) return false;
    return ok(n.left,lo,n->val)& ok(n.right,n->val,hi);
  }
  return ok(root, LONG_MIN, LONG_MAX);
}`,
    timeComplexity: `O(log n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(1)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— PASS BOUNDS DOWN. isValid(node min max). Left: max becomes node pointer val. Right: min becomes node pointer val. Reject if out of range.`,
  },
  "word-search": {
    intuition: `— DFS from every cell matching word[0]. Mark cell as visited (modify in-place) recurse in 4 directions unmark after.`,
    approach: [
      `— DFS from every cell matching word[0].`,
      `Mark cell as visited (modify in-place) recurse in 4 directions unmark after.`,
    ],
    cppSolution: `bool exist(vector<vector<char>>& board, string word) {
  int m=board.size(),n=board[0].size();
  function<bool(int,int,int)> dfs=[&](int r,int c,int i).bool {
    if (i==(int) word.size()) return true;
    if (r<0||r>=m||c<0||c>=n||board[r][c]!=word[i]) return false;
    char tmp=board[r][c];
    board[r][c]='#';
    bool res=dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);
    board[r][c]=tmp;
    return res;
  }
  for (int r=0; r<m; r++) for (int c=0; c<n; c++) if (dfs(r,c,0)) return true;
  return false;
}`,
    timeComplexity: `O(n)`,
    timeExplanation: `Based on the algorithm shown, this is the expected runtime for the core loop.`,
    spaceComplexity: `O(n)`,
    spaceExplanation: `This uses extra space for the auxiliary data structures shown in the solution.`,
    edgeCases: [
      `Handle empty input where applicable.`,
      `Handle duplicate values or repeated characters as needed.`,
    ],
    memoryTrick: `— DFS + MARK VISITED IN PLACE. Change cell to '#' to mark. Restore after backtrack. 4-directional DFS.`,
  },

  "climbing-stairs": {
    intuition: "Each step you can take 1 or 2 stairs. Ways to reach step n = ways(n-1) + ways(n-2). This is exactly Fibonacci. You only need the previous two values, not the whole array.",
    approach: [
      "Base cases: 1 step = 1 way, 2 steps = 2 ways.",
      "For each step from 3 to n: ways[i] = ways[i-1] + ways[i-2].",
      "Space-optimize: keep only prev1 and prev2, rolling update.",
      "Return prev1 after the loop completes.",
    ],
    cppSolution: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass from 3 to n.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two variables stored.",
    edgeCases: ["n=1: return 1", "n=2: return 2", "Large n: no overflow risk for typical constraints"],
    memoryTrick: "Fibonacci! Ways(n) = Ways(n-1) + Ways(n-2). Roll two variables forward.",
    whyItWorks: "The recurrence holds because every valid path to step n either came from step n-1 (took 1 stair) or step n-2 (took 2 stairs). These two cases are mutually exclusive and exhaustive.",
    commonMistakes: [
      "Starting loop at i=2 and initializing wrong — always dry-run with n=3 to verify",
      "Using full dp array when O(1) space is possible",
      "Off-by-one: ways[1]=1, ways[2]=2, NOT ways[0]=1, ways[1]=1 (like pure Fibonacci)",
    ],
    patternConnection: "Gateway DP problem. The 'current depends on previous two states' pattern reappears in House Robber, Decode Ways, and Min Cost Climbing Stairs.",
    walkthroughExample: `n=5:
step 1: 1 way  (1)
step 2: 2 ways (1+1, 2)
step 3: 3 ways (prev1+prev2 = 2+1)
step 4: 5 ways (3+2)
step 5: 8 ways (5+3) ← answer`,
    alternativeApproaches: [
      "Top-down memoization: recursive with cache, O(n) time/space",
      "Matrix exponentiation: O(log n) time — overkill for this problem",
    ],
    proTips: [
      "Recognize Fibonacci pattern immediately in interviews — say it out loud",
      "Generalize: k steps allowed → dp[i] = sum of dp[i-1..i-k]",
    ],
  },

  "coin-change": {
    intuition: "Find minimum coins to make amount. Classic unbounded knapsack. dp[i] = minimum coins needed for amount i. For each coin, try using it and update dp[i] = min(dp[i], dp[i-coin]+1).",
    approach: [
      "Initialize dp array of size amount+1 with infinity (impossible).",
      "Set dp[0] = 0 (zero coins for zero amount).",
      "For each amount from 1 to amount:",
      "  For each coin: if coin <= i, dp[i] = min(dp[i], dp[i-coin]+1).",
      "Return dp[amount] if not infinity, else -1.",
    ],
    cppSolution: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != INT_MAX)
                    dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] == INT_MAX ? -1 : dp[amount];
    }
};`,
    timeComplexity: "O(amount × coins)",
    timeExplanation: "Outer loop: amount iterations. Inner loop: number of coins.",
    spaceComplexity: "O(amount)",
    spaceExplanation: "dp array of size amount+1.",
    edgeCases: [
      "amount=0: return 0",
      "No valid combination: return -1 (check for INT_MAX at end)",
      "Coin larger than amount: skip it (coin <= i check)",
      "INT_MAX + 1 overflow: check dp[i-coin] != INT_MAX before adding 1",
    ],
    memoryTrick: "Bottom-up build: dp[0]=0, fill forward using each coin. 'Min coins to make i = min over all coins of (1 + dp[i-coin])'.",
    whyItWorks: "Optimal substructure: if you know the min coins for all amounts < i, you can compute i by trying each coin and taking the best. Overlapping subproblems make memoization essential.",
    commonMistakes: [
      "INT_MAX + 1 overflow when checking dp[i-coin]+1 — guard with != INT_MAX",
      "Initializing dp[0] wrong — must be 0",
      "Returning dp[amount] without the -1 check",
      "Using greedy (doesn't always work — e.g. coins=[1,3,4], amount=6 → greedy gives 4+1+1=3 but optimal is 3+3=2)",
    ],
    patternConnection: "Archetypal DP problem. Same pattern as Coin Change II (counting), Word Break (reachability), and Perfect Squares. 'Build dp table bottom-up, each cell depends on prior cells.'",
    walkthroughExample: `coins=[1,5,6], amount=9:
dp[0]=0, dp[1]=1(1), dp[2]=2, dp[3]=3, dp[4]=4
dp[5]=1(5), dp[6]=1(6), dp[7]=2(6+1), dp[8]=3(6+1+1)
dp[9]=2(6+5→ nope, 9-6=3→dp[3]=3→4, 9-5=4→dp[4]=4→5, 9-1=8→dp[8]=3→4)
Wait: dp[9]: coin=6→dp[3]+1=4, coin=5→dp[4]+1=5, coin=1→dp[8]+1=4 → dp[9]=4
Actually optimal: 6+1+1+1=4 ✓`,
    alternativeApproaches: [
      "BFS: treat as shortest path, amount is node, each coin is edge of weight 1 — O(amount × coins)",
      "Top-down recursion with memo: same complexity, more intuitive for some",
    ],
    proTips: [
      "Unbounded = each coin can be used multiple times → inner loop over coins, outer over amount",
      "0/1 knapsack (each coin once) → reverse direction or 2D dp",
    ],
  },

  "house-robber": {
    intuition: "Can't rob adjacent houses. At each house, choose max(rob this + best from two back, skip and take best from previous). Roll two variables — no array needed.",
    approach: [
      "prev2 = max if you rob up to two houses back.",
      "prev1 = max if you rob up to one house back.",
      "For each house: curr = max(prev1, prev2 + nums[i]).",
      "Roll: prev2 = prev1, prev1 = curr.",
      "Return prev1 after processing all houses.",
    ],
    cppSolution: `class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int num : nums) {
            int curr = max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Only two rolling variables.",
    edgeCases: [
      "Single house: return nums[0]",
      "Two houses: return max(nums[0], nums[1])",
      "All zeros: return 0",
    ],
    memoryTrick: "At each house: SKIP (take prev1) vs ROB (take prev2 + current). Max of the two. Roll forward.",
    whyItWorks: "Every house either gets robbed or skipped. If robbed, you must have skipped prev house, so you get prev2's value. If skipped, you get prev1's value. Optimal substructure holds — local optimal choices compose to global optimum.",
    commonMistakes: [
      "Initializing prev1 = nums[0] then starting loop at i=1 — works but error-prone, cleaner to start both at 0",
      "Forgetting that adjacent includes immediately previous, not 2-back",
      "Trying to use greedy (take even-indexed or odd-indexed) — doesn't work for all inputs",
    ],
    patternConnection: "Linear DP. Direct parent of House Robber II (circular), Delete and Earn, and any 'can't pick adjacent' problem. Pattern: dp[i] = max(dp[i-1], dp[i-2] + val[i]).",
    walkthroughExample: `nums=[2,7,9,3,1]:
i=2: curr=max(0,0+2)=2  → prev2=0,prev1=2
i=7: curr=max(2,0+7)=7  → prev2=2,prev1=7
i=9: curr=max(7,2+9)=11 → prev2=7,prev1=11
i=3: curr=max(11,7+3)=11→ prev2=11,prev1=11
i=1: curr=max(11,11+1)=12→ answer=12 ✓`,
    alternativeApproaches: [
      "dp array O(n) space: dp[i]=max(dp[i-1], dp[i-2]+nums[i])",
      "Recursion + memo: top-down, same complexity",
    ],
    proTips: [
      "Space-optimize immediately — interviewers expect O(1) space",
      "Generalize to k-distance constraint: keep dp array of size k",
    ],
  },

  "house-robber-ii": {
    intuition: "Houses in a circle — first and last are adjacent. Break circle by solving twice: once excluding last house, once excluding first. Answer is max of both runs.",
    approach: [
      "Handle edge case: single house → return nums[0].",
      "Define helper function: linear rob on subarray.",
      "Run linear rob on nums[0..n-2] (skip last).",
      "Run linear rob on nums[1..n-1] (skip first).",
      "Return max of both results.",
    ],
    cppSolution: `class Solution {
    int robRange(vector<int>& nums, int lo, int hi) {
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two linear passes, each O(n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two rolling variables in each pass.",
    edgeCases: [
      "n=1: only one house, return nums[0]",
      "n=2: return max(nums[0], nums[1])",
      "All same values: works correctly",
    ],
    memoryTrick: "Circle = two lines. Either rob first (exclude last) OR rob last (exclude first). Max of both.",
    whyItWorks: "In any optimal solution for circular arrangement, you cannot rob both house 0 and house n-1. So optimal solution either includes house 0 (and excludes n-1) or includes n-1 (and excludes 0). Two linear passes cover both cases exhaustively.",
    commonMistakes: [
      "Forgetting the n=1 edge case — robRange(0, n-2) would be robRange(0, -1) which is wrong",
      "Running on nums[0..n-1] both times — that's just House Robber I twice",
      "Thinking you need to track which houses were chosen — you don't, just max values",
    ],
    patternConnection: "Elegant reduction: circular constraint → two linear sub-problems. Same trick used in Jump Game II circular and other ring problems. Always try 'break the circle at the problematic edge'.",
    walkthroughExample: `nums=[2,3,2]:
Pass 1 (skip last, indices 0..1): rob([2,3]) = max(2,3) = 3
Pass 2 (skip first, indices 1..2): rob([3,2]) = max(3,2) = 3
Answer = max(3,3) = 3 ✓ (rob house at index 1)`,
    alternativeApproaches: [
      "DP with circular tracking: more complex, not worth it",
      "Greedy on circular array: doesn't work — use the two-pass decomposition",
    ],
    proTips: [
      "Extract robRange as helper — clean pattern for any linear DP sub-range",
      "Same decomposition works for any 'first-and-last adjacent' constraint",
    ],
  },

  "max-subarray": {
    intuition: "Kadane's algorithm: extend current subarray or start fresh. At each index, decide: is nums[i] alone better than extending? Track current sum and global max.",
    approach: [
      "Initialize currSum = nums[0], maxSum = nums[0].",
      "For each subsequent element:",
      "  currSum = max(nums[i], currSum + nums[i]). // extend or restart",
      "  maxSum = max(maxSum, currSum).",
      "Return maxSum.",
    ],
    cppSolution: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int currSum = nums[0], maxSum = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            currSum = max(nums[i], currSum + nums[i]);
            maxSum = max(maxSum, currSum);
        }
        return maxSum;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single linear pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two variables only.",
    edgeCases: [
      "All negative numbers: return the least negative (single element)",
      "Single element: return it",
      "All same: works correctly",
    ],
    memoryTrick: "Kadane's: if current sum goes negative, abandon it — restart from current element. 'Drag or drop the anchor?'",
    whyItWorks: "If the running sum drops below zero, it can only hurt future subarrays — better to start fresh. This local greedy choice is globally optimal because a negative prefix always reduces any suffix that extends through it.",
    commonMistakes: [
      "Initializing currSum=0 instead of nums[0] — fails for all-negative arrays",
      "Using if (currSum < 0) currSum = 0 — same mistake",
      "Forgetting to update maxSum inside the loop",
    ],
    patternConnection: "Prefix sum variant. currSum = max prefix ending here. maxSum = max over all ending positions. Extends to max subarray with k negatives allowed (sliding window), 2D maximum submatrix (Kadane on columns).",
    walkthroughExample: `nums=[-2,1,-3,4,-1,2,1,-5,4]:
i=1: curr=max(1,−2+1)=1,     max=1
i=2: curr=max(-3,1-3)=-2,    max=1
i=3: curr=max(4,-2+4)=4,     max=4
i=4: curr=max(-1,4-1)=3,     max=4
i=5: curr=max(2,3+2)=5,      max=5
i=6: curr=max(1,5+1)=6,      max=6
Answer=6 ✓ (subarray [4,-1,2,1])`,
    alternativeApproaches: [
      "Divide and conquer: O(n log n) — find max crossing midpoint recursively",
      "Prefix sums: max(prefix[j] - min_prefix[i<j]) — O(n)",
    ],
    proTips: [
      "If asked for the actual subarray (not just sum), track start/end indices",
      "Circular max subarray: max of (Kadane forward) and (total_sum - min_subarray)",
    ],
  },

  "single-number": {
    intuition: "XOR of a number with itself is 0. XOR of a number with 0 is the number. XOR all elements: pairs cancel, leaving the unique element.",
    approach: [
      "Initialize result = 0.",
      "XOR every element with result.",
      "Return result — pairs cancel, singleton survives.",
    ],
    cppSolution: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int result = 0;
        for (int n : nums) result ^= n;
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass through the array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Single variable.",
    edgeCases: [
      "Single element array: returns that element",
      "Negative numbers: XOR works on two's complement representation",
    ],
    memoryTrick: "XOR = 'difference detector'. Pairs annihilate. Lone wolf survives. result ^= each element.",
    whyItWorks: "XOR is commutative and associative. a^a=0, a^0=a. So XORing all elements: (a^a)^(b^b)^...^x = 0^0^...^x = x. Order doesn't matter.",
    commonMistakes: [
      "Using hash map — works but O(n) space, XOR is cleaner",
      "Sorting then checking pairs — O(n log n), unnecessary",
      "Forgetting this only works when all others appear EXACTLY twice",
    ],
    patternConnection: "XOR identity property. Same trick for: find two non-repeating numbers, find missing number. Bit manipulation chapter's most elegant O(1) space trick.",
    walkthroughExample: `nums=[4,1,2,1,2]:
0^4=4, 4^1=5, 5^2=7, 7^1=6, 6^2=4 → return 4 ✓`,
    alternativeApproaches: [
      "Hash set: add if not present, remove if present — O(n) space",
      "Math: 2*(sum of unique) - total_sum — requires collecting unique elements first",
    ],
    proTips: [
      "Memorize: XOR-all is the canonical O(1) space solution",
      "Single Number II (appears 3 times): bit counting mod 3 approach",
    ],
  },

  "missing-number": {
    intuition: "Array has n numbers from 0..n with one missing. XOR approach: XOR all indices 0..n with all array values — pairs cancel, missing index survives. Or use math: expected sum − actual sum.",
    approach: [
      "Method 1 (XOR): result = n, then for each i: result ^= i ^ nums[i]. Return result.",
      "Method 2 (Math): expected = n*(n+1)/2, return expected - sum(nums).",
    ],
    cppSolution: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int x : nums) actual += x;
        return expected - actual;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass to sum the array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant extra space.",
    edgeCases: [
      "Missing 0: sum formula handles it",
      "Missing n (last): sum formula handles it",
      "n=1: single element, missing is 0 or 1",
    ],
    memoryTrick: "Gauss formula: n*(n+1)/2 is the expected sum. Subtract actual sum → missing number.",
    whyItWorks: "Gauss sum formula gives exact sum of 0..n. Any missing number creates a deficit equal to its value.",
    commonMistakes: [
      "Overflow on large n with int — use long for the formula if n > 46340",
      "Confusing 0..n-1 vs 0..n range — problem says 0..n, array has n elements",
    ],
    patternConnection: "XOR or math identity. Variant of 'find the duplicate' (Floyd cycle) and 'single number' (XOR). Math approach is O(1) space and intuitive.",
    walkthroughExample: `nums=[3,0,1] (n=3):
expected = 3*4/2 = 6
actual = 3+0+1 = 4
missing = 6-4 = 2 ✓`,
    alternativeApproaches: [
      "XOR: result=n, for i in 0..n-1: result^=i^nums[i] — avoids potential overflow",
      "Sort and binary search: O(n log n)",
      "Hash set: O(n) space",
    ],
    proTips: [
      "XOR approach avoids overflow entirely — prefer for large n",
      "Same pattern for 'find duplicate' but reversed — there it's Floyd cycle detection",
    ],
  },

  "counting-bits": {
    intuition: "For each number i, count its set bits. Key insight: dp[i] = dp[i >> 1] + (i & 1). Right-shifting removes the last bit; add 1 if last bit was set. Build table bottom-up.",
    approach: [
      "Initialize dp array of size n+1 with all zeros.",
      "For i from 1 to n: dp[i] = dp[i >> 1] + (i & 1).",
      "Return dp array.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= n; i++)
            dp[i] = dp[i >> 1] + (i & 1);
        return dp;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, O(1) per element.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Output array of size n+1.",
    edgeCases: [
      "n=0: return [0]",
      "n=1: return [0,1]",
    ],
    memoryTrick: "Shift right = divide by 2. Bit count(i) = bit_count(i/2) + last_bit. Build on already-computed values.",
    whyItWorks: "i and i>>1 share all bits except the LSB. So popcount(i) = popcount(i>>1) + LSB(i). Since i>>1 < i, it's already computed when we process i.",
    commonMistakes: [
      "Using __builtin_popcount in a loop — correct but O(n log n), misses the DP insight",
      "Starting loop at 0 — dp[0]=0 by initialization, start at 1",
    ],
    patternConnection: "DP with bit manipulation. Pattern: use smaller solved subproblem (i>>1) to solve larger (i). Same idea as 'is power of two' and 'number of 1 bits'.",
    walkthroughExample: `n=5:
dp[0]=0
dp[1]=dp[0]+(1&1)=0+1=1
dp[2]=dp[1]+(2&1)=1+0=1
dp[3]=dp[1]+(3&1)=1+1=2
dp[4]=dp[2]+(4&1)=1+0=1
dp[5]=dp[2]+(5&1)=1+1=2
Result=[0,1,1,2,1,2] ✓`,
    alternativeApproaches: [
      "Brian Kernighan: for each i, while i: i&=(i-1), count++ — O(n log n) total",
      "Lookup table with 8-bit chunks: O(n) but complex implementation",
    ],
    proTips: [
      "Offset pattern: dp[i] = dp[i - offset] + 1 where offset = highest power of 2 ≤ i — equally valid",
      "i & (i-1) removes lowest set bit — useful for 'number of operations to make 0'",
    ],
  },

  "number-1-bits": {
    intuition: "Count set bits in integer n. Brian Kernighan trick: n & (n-1) clears the lowest set bit. Count how many times you can do this before n becomes 0.",
    approach: [
      "Initialize count = 0.",
      "While n != 0: n = n & (n-1), count++.",
      "Return count.",
    ],
    cppSolution: `class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        while (n) {
            n &= (n - 1); // clear lowest set bit
            count++;
        }
        return count;
    }
};`,
    timeComplexity: "O(k)",
    timeExplanation: "k = number of set bits. Loop runs exactly k times.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant extra space.",
    edgeCases: [
      "n=0: return 0",
      "All bits set (0xFFFFFFFF): return 32",
      "Power of 2: single set bit, returns 1",
    ],
    memoryTrick: "n & (n-1) flips the lowest set bit to 0. Count iterations until n=0.",
    whyItWorks: "n-1 flips the lowest set bit and all lower bits. ANDing with n clears the lowest set bit. Repeat until no bits remain.",
    commonMistakes: [
      "Using n & 1 and right-shifting — correct but O(32) always, not O(popcount)",
      "Signed int overflow with negative numbers — use uint32_t or unsigned",
    ],
    patternConnection: "Bit manipulation building block. n&(n-1) appears in: check power of two (n&(n-1)==0), count set bits, reverse bits. Memorize this trick.",
    walkthroughExample: `n=11 (binary 1011):
1011 & 1010 = 1010 → count=1
1010 & 1001 = 1000 → count=2
1000 & 0111 = 0000 → count=3
Return 3 ✓`,
    alternativeApproaches: [
      "Right-shift loop: check LSB each time, shift right — O(32)",
      "__builtin_popcount(n) in C++ — one line but know the manual method for interviews",
    ],
    proTips: [
      "n & (n-1) == 0 checks if n is power of 2 — instant check",
      "For 'Hamming distance': XOR two numbers, then count bits of result",
    ],
  },

  "reverse-bits": {
    intuition: "Reverse all 32 bits of an integer. Take LSB of n, shift it into position in result, then shift n right. Repeat 32 times.",
    approach: [
      "Initialize result = 0.",
      "For 32 iterations:",
      "  Shift result left by 1.",
      "  OR in the LSB of n: result |= (n & 1).",
      "  Shift n right by 1.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>= 1;
        }
        return result;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "Always exactly 32 iterations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant space.",
    edgeCases: [
      "n=0: return 0",
      "n=1: returns 0x80000000 (bit moved to position 31)",
      "All 1s: returns all 1s",
    ],
    memoryTrick: "Peel LSB from n, stick it as MSB of result. Shift both each iteration. 32 rounds.",
    whyItWorks: "Each iteration extracts the next bit from n (from bit 0 upward) and places it into result from bit 31 downward. After 32 iterations, all bits are reversed.",
    commonMistakes: [
      "Using signed int — undefined behavior on right shift of negative — use uint32_t",
      "Only 31 iterations — must do exactly 32",
      "Shifting result right instead of left",
    ],
    patternConnection: "Classic bit manipulation. Extends to: byte-reversal optimization (cache 8-bit lookup table), bit-level palindrome check. Shows up in graphics and cryptography contexts.",
    walkthroughExample: `n=43261596 (00000010100101000001111010011100):
Extract bits right-to-left, place left-to-right in result.
Result=00111001011110000010100101000000 = 964176192 ✓`,
    alternativeApproaches: [
      "Divide and conquer: swap 16-bit halves, then 8-bit, then 4-bit, etc. — O(log 32) = O(1) but more complex",
      "Lookup table: precompute 8-bit reversal, compose 4 lookups",
    ],
    proTips: [
      "If called multiple times: cache results (memoize) — input is 32-bit so cache is small",
      "Byte-reverse trick: reverseBits(n) = (rev[n&0xFF]<<24) | (rev[(n>>8)&0xFF]<<16) | ...",
    ],
  },

  "power-of-two": {
    intuition: "Power of 2 has exactly one set bit. n & (n-1) clears the lowest set bit. If n is power of 2, n & (n-1) == 0. Also check n > 0.",
    approach: [
      "Check n > 0 (negative numbers and 0 cannot be powers of 2).",
      "Return (n & (n-1)) == 0.",
    ],
    cppSolution: `class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "Single bitwise operation.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space.",
    edgeCases: [
      "n=0: return false (0 is not a power of 2)",
      "n=1: return true (2^0 = 1)",
      "Negative n: return false",
      "INT_MIN: negative, return false",
    ],
    memoryTrick: "Power of 2 = exactly one '1' bit. n & (n-1) clears that bit → result is 0. One-liner.",
    whyItWorks: "Powers of 2 in binary: 1, 10, 100, 1000... Exactly one bit set. n-1 for these: 0, 01, 011, 0111... — AND with n clears the single set bit.",
    commonMistakes: [
      "Forgetting the n > 0 check — n=0 would pass the bit check incorrectly",
      "Using n % 2 == 0 in a loop — O(log n) but misses the elegant O(1) solution",
    ],
    patternConnection: "n & (n-1) trick — same as used in Number of 1 Bits. Generalizes to: count set bits, check power of k (harder, use math).",
    walkthroughExample: `n=8 (1000): 8&7 = 1000&0111 = 0 → true ✓
n=6 (110):  6&5 = 110&101  = 100 ≠ 0 → false ✓`,
    alternativeApproaches: [
      "While loop dividing by 2: O(log n)",
      "Math: n > 0 && (INT_MIN % n == 0) — since INT_MIN = -2^31, any power of 2 divides it",
    ],
    proTips: [
      "Memorize: n > 0 && (n & (n-1)) == 0 — instant one-liner",
      "Power of 4: additionally check (n & 0x55555555) != 0 (bit in even position)",
    ],
  },

  "sum-two-integers": {
    intuition: "Add two integers without using + or -. Use bit manipulation: XOR gives sum without carry, AND gives carry bits. Shift carry left, repeat until no carry remains.",
    approach: [
      "While b != 0:",
      "  carry = (a & b) << 1  (carry bits shifted left)",
      "  a = a ^ b              (sum without carry)",
      "  b = carry",
      "Return a.",
    ],
    cppSolution: `class Solution {
public:
    int getSum(int a, int b) {
        while (b != 0) {
            unsigned carry = (unsigned)(a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
};`,
    timeComplexity: "O(1)",
    timeExplanation: "At most 32 iterations (one per bit position).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant space.",
    edgeCases: [
      "a=0: return b immediately",
      "Negative numbers: two's complement works naturally with XOR/AND",
      "Overflow: use unsigned for carry to avoid UB on left shift",
    ],
    memoryTrick: "XOR = add without carry. AND+shift = the carry. Repeat until carry=0.",
    whyItWorks: "Digital adder circuit logic: XOR computes sum bits, AND computes carry bits. Shifting carry left aligns it for next addition. Termination: carry shrinks (or stays) each step, guaranteed to reach 0 in at most 32 steps.",
    commonMistakes: [
      "Using int for carry — left shift of negative int is UB in C++, use unsigned",
      "Using subtraction to handle negative — defeats the purpose",
      "Infinite loop if carry logic is wrong",
    ],
    patternConnection: "Fundamental bit manipulation. Hardware adder simulation. Shows understanding of two's complement and bitwise ops.",
    walkthroughExample: `a=2(010), b=3(011):
Round 1: carry=(010&011)<<1=(010)<<1=100, a=010^011=001, b=100
Round 2: carry=(001&100)<<1=000, a=001^100=101, b=000
b=0, return a=101=5 ✓`,
    alternativeApproaches: [
      "Recursive: getSum(a^b, (a&b)<<1) — same logic, recursive call",
      "String representation tricks — far more complex, not recommended",
    ],
    proTips: [
      "In Python, must mask to 32 bits: (a^b) & 0xFFFFFFFF etc.",
      "Subtraction: a-b = getSum(a, getSum(~b, 1)) — negate b using two's complement",
    ],
  },

  "jump-game": {
    intuition: "Track the farthest index reachable. If current index exceeds farthest, we're stuck. If farthest >= last index, we can reach the end.",
    approach: [
      "Initialize maxReach = 0.",
      "For each index i from 0 to n-1:",
      "  If i > maxReach, return false (can't reach here).",
      "  Update maxReach = max(maxReach, i + nums[i]).",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int maxReach = 0;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (i > maxReach) return false;
            maxReach = max(maxReach, i + nums[i]);
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through the array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "Single element: always reachable",
      "First element is 0 and n>1: return false immediately at i=1",
      "Large jumps: greedy maxReach handles them",
    ],
    memoryTrick: "Track the 'horizon' — farthest point reachable. If you fall off the edge of the horizon, stuck.",
    whyItWorks: "If you can reach index i, you can reach any index up to i+nums[i]. The greedy maxReach captures the union of all reachable ranges. No backtracking needed because a wider range is always at least as good.",
    commonMistakes: [
      "Backtracking DFS — O(2^n) worst case, unnecessary",
      "Checking if nums[i]==0 to prune — not sufficient since you might skip over zeros",
      "Updating maxReach before checking if i is reachable",
    ],
    patternConnection: "Greedy interval merging. Conceptually: you have intervals [i, i+nums[i]] for each i. Greedily expand your reachable interval. Same idea as Jump Game II (min jumps).",
    walkthroughExample: `nums=[2,3,1,1,4]:
i=0: maxReach=max(0,0+2)=2
i=1: maxReach=max(2,1+3)=4
i=2: maxReach=max(4,2+1)=4
i=3: maxReach=max(4,3+1)=4
i=4: 4<=4 ✓ → return true`,
    alternativeApproaches: [
      "DP: dp[i]=can reach i? O(n^2) — much slower",
      "BFS: treat as graph — O(n^2) worst case",
    ],
    proTips: [
      "Backward greedy: start from end, track leftmost 'good' position — same O(n) complexity",
      "If nums has no zeros, always reachable — but don't rely on this in code",
    ],
  },

  "jump-game-ii": {
    intuition: "Minimum jumps to reach end. BFS level-by-level: each 'level' is a jump. Track current jump's coverage [lo, hi]. Expand to next jump's coverage.",
    approach: [
      "jumps=0, lo=0, hi=0 (current window).",
      "While hi < n-1:",
      "  Find farthest reachable from any index in [lo, hi].",
      "  lo = hi + 1, hi = farthest, jumps++.",
      "Return jumps.",
    ],
    cppSolution: `class Solution {
public:
    int jump(vector<int>& nums) {
        int jumps = 0, lo = 0, hi = 0;
        while (hi < (int)nums.size() - 1) {
            int farthest = hi;
            for (int i = lo; i <= hi; i++)
                farthest = max(farthest, i + nums[i]);
            lo = hi + 1;
            hi = farthest;
            jumps++;
        }
        return jumps;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Each index visited at most once across all iterations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant variables.",
    edgeCases: [
      "n=1: already at end, return 0",
      "First jump covers entire array: return 1",
    ],
    memoryTrick: "BFS jumps: expand horizon greedily per jump. 'Each jump level expands the frontier.'",
    whyItWorks: "Greedy: at each jump, extend as far as possible. Taking the maximum reach from each position within the current jump's range guarantees minimum total jumps — you never need to go back.",
    commonMistakes: [
      "Counting jumps including the starting position",
      "Off-by-one: condition should be hi < n-1 (not hi < n)",
      "Not handling n=1 (already at destination)",
    ],
    patternConnection: "BFS shortest path applied greedily. Each 'level' = one jump. Related to Jump Game I (reachability) and graph shortest path.",
    walkthroughExample: `nums=[2,3,0,1,4]:
Jump 1: window[0,0], farthest=2, new window[1,2], jumps=1
Jump 2: window[1,2], from i=1: 1+3=4, from i=2: 2+0=2, farthest=4, new window[3,4], jumps=2
hi=4=n-1, done. Answer=2 ✓`,
    alternativeApproaches: [
      "DP: dp[i]=min jumps to reach i, O(n^2)",
      "Single-pass greedy: track curEnd and farthest in one loop — cleaner O(n)",
    ],
    proTips: [
      "Cleaner single-pass: for each i, update farthest; when i==curEnd, jump++, curEnd=farthest",
      "Guaranteed solution exists per problem constraints — no need to check",
    ],
  },

  "gas-station": {
    intuition: "If total gas >= total cost, a solution exists. The starting station is the first one where cumulative surplus never goes negative. Reset start greedily.",
    approach: [
      "Track total surplus (total_gas - total_cost) and current tank.",
      "For each station: tank += gas[i] - cost[i].",
      "If tank < 0: can't start from anywhere in 0..i, set start = i+1, reset tank = 0.",
      "If total >= 0, return start. Else return -1.",
    ],
    cppSolution: `class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < (int)gas.size(); i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through all stations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "total < 0: no solution exists, return -1",
      "Single station: gas[0] >= cost[0] → return 0",
      "All stations have surplus: start at 0",
    ],
    memoryTrick: "If tank goes negative, the start must be AFTER current i. Reset. If total >= 0, the accumulated start is valid.",
    whyItWorks: "If you can't reach station i from start s, you also can't reach i from any station between s and i (they'd have less remaining fuel). So skip ahead to i+1. The unique solution (if it exists) is the one valid start.",
    commonMistakes: [
      "Brute force: O(n^2), trying each start",
      "Thinking you need to simulate the full circle after finding start — the greedy proof guarantees it",
      "Forgetting the total >= 0 check — start might be set to n which is invalid",
    ],
    patternConnection: "Greedy circular array. Same 'reset and advance' pattern appears in: candy distribution, valid parenthesis string (greedy). Key insight: local failure reveals global constraint.",
    walkthroughExample: `gas=[1,2,3,4,5], cost=[3,4,5,1,2]:
i=0: diff=-2, tank=-2<0 → start=1, tank=0
i=1: diff=-2, tank=-2<0 → start=2, tank=0
i=2: diff=-2, tank=-2<0 → start=3, tank=0
i=3: diff=3, tank=3
i=4: diff=3, tank=6
total=(1+2+3+4+5)-(3+4+5+1+2)=15-15=0≥0 → return start=3 ✓`,
    alternativeApproaches: [
      "Brute force: try each start, simulate — O(n^2)",
      "Prefix sum: find index where prefix is minimum, start there+1",
    ],
    proTips: [
      "Total sum ≥ 0 is necessary AND sufficient for existence of solution",
      "The start you find in one pass is the guaranteed unique answer",
    ],
  },

  "lemonade-change": {
    intuition: "Greedy: always use larger bills first when making change. Track $5 and $10 bills. For $20 payment, prefer to give $10+$5 over $5+$5+$5.",
    approach: [
      "Track count of $5 bills and $10 bills.",
      "For each customer payment:",
      "  $5: five++ (just collect)",
      "  $10: need $5 change. If five==0, return false. ten++, five--.",
      "  $20: prefer $10+$5 (ten>0 && five>0: ten--,five--). Else three $5s (five>=3: five-=3). Else false.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool lemonadeChange(vector<int>& bills) {
        int five = 0, ten = 0;
        for (int bill : bills) {
            if (bill == 5) five++;
            else if (bill == 10) {
                if (!five) return false;
                ten++; five--;
            } else { // bill == 20
                if (ten > 0 && five > 0) { ten--; five--; }
                else if (five >= 3) five -= 3;
                else return false;
            }
        }
        return true;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "One pass through bills array.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two counters.",
    edgeCases: [
      "First customer pays $10 or $20: can't make change",
      "All $5 payments: always true",
    ],
    memoryTrick: "Track $5s and $10s only. For $20 change: prefer $10+$5 (saves $5s for later). Greedy: preserve smaller bills.",
    whyItWorks: "$5 bills are most versatile (can make change for both $10 and $20 payments). $10 bills only useful for $20 change. Greedy: use $10 first when possible preserves $5s for future.",
    commonMistakes: [
      "Not preferring $10+$5 over $5+$5+$5 — $5s are more valuable",
      "Tracking $20 bills — you never need to give $20 change",
      "Checking wrong order of conditions",
    ],
    patternConnection: "Simple greedy simulation. Tests ability to recognize greedy correctness. Related to task scheduling and activity selection.",
    walkthroughExample: `bills=[5,5,5,10,20]:
$5: five=1; $5: five=2; $5: five=3
$10: five=2, ten=1
$20: ten>0&&five>0 → ten=0, five=1
Return true ✓`,
    alternativeApproaches: [
      "No alternative — this is the only reasonable approach",
    ],
    proTips: [
      "Only three bill denominations simplifies the case analysis",
      "The $20 bill greedy choice ($10+$5 preferred) is the key insight",
    ],
  },

  "best-time-stock-ii": {
    intuition: "Unlimited transactions, no cooldown. Greedy: capture every upward price movement. Sum all positive differences between consecutive days.",
    approach: [
      "For each consecutive pair of days:",
      "  If prices[i] > prices[i-1]: add the difference to profit.",
      "Return total profit.",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        for (int i = 1; i < (int)prices.size(); i++)
            if (prices[i] > prices[i-1])
                profit += prices[i] - prices[i-1];
        return profit;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "One variable.",
    edgeCases: [
      "Strictly decreasing prices: profit = 0",
      "Single day: no transactions possible",
      "All same prices: profit = 0",
    ],
    memoryTrick: "Sum all positive day-to-day gains. 'If it goes up, take the profit.'",
    whyItWorks: "Every multi-day profit can be decomposed into consecutive 1-day profits. Buy on day i, sell on day i+1 captures the same total gain as buy on day i, sell on day j (for any j>i) through the telescoping sum.",
    commonMistakes: [
      "Thinking you need to track actual buy/sell days — greedy sum of positive diffs is enough",
      "Using buy-sell tracking like in Stock I — unnecessary here",
    ],
    patternConnection: "Greedy — capture incremental gains. Different from Stock I (single transaction) and Stock III/IV (limited transactions) and Stock with Cooldown (DP required).",
    walkthroughExample: `prices=[7,1,5,3,6,4]:
1-7: negative, skip
5-1=4: add 4
3-5: negative, skip
6-3=3: add 3
4-6: negative, skip
Profit=4+3=7 ✓`,
    alternativeApproaches: [
      "Track valleys/peaks explicitly: same result, more complex code",
      "DP states (hold/sold): more general, works for variants with cooldown",
    ],
    proTips: [
      "Sum of positive differences = peak-to-valley sum = total max profit",
      "For Stock with Cooldown or Transaction Fee, you MUST use DP instead",
    ],
  },

  "buy-sell-cooldown": {
    intuition: "After selling, 1-day cooldown. Three states: HELD (holding stock), SOLD (just sold, in cooldown), REST (free to buy). Transitions: held→held (do nothing) or held→sold (sell). sold→rest. rest→held (buy) or rest→rest.",
    approach: [
      "Initialize: held=-prices[0], sold=0, rest=0.",
      "For each price from index 1:",
      "  new_held = max(held, rest - price)  // keep or buy",
      "  new_sold = held + price              // sell",
      "  new_rest = max(rest, sold)           // cooldown or stay",
      "  Update states.",
      "Return max(sold, rest).",
    ],
    cppSolution: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int held = -prices[0], sold = 0, rest = 0;
        for (int i = 1; i < (int)prices.size(); i++) {
            int new_held = max(held, rest - prices[i]);
            int new_sold = held + prices[i];
            int new_rest = max(rest, sold);
            held = new_held; sold = new_sold; rest = new_rest;
        }
        return max(sold, rest);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass, O(1) per day.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three state variables.",
    edgeCases: [
      "Single day: no profit possible",
      "Two days: can buy then sell, no cooldown triggered if only one trade",
      "Decreasing prices: all transitions stay at 0",
    ],
    memoryTrick: "State machine: HELD→SOLD (sell), SOLD→REST (cooldown), REST→HELD (buy). Track max profit in each state.",
    whyItWorks: "State machine captures all constraints. Each state transition corresponds to exactly one action. Since states are Markovian (only depend on previous day), O(1) space suffices.",
    commonMistakes: [
      "Using new values to compute other new values in same loop — must use old values for all",
      "Forgetting cooldown: thinking you can go directly from sold to held",
      "Not returning max(sold, rest) — resting at end is valid",
    ],
    patternConnection: "DP state machine. Same approach for: Stock with Transaction Fee (modify sold formula), Stock IV (limit k transactions with 2D DP). State machine generalizes all stock problems.",
    walkthroughExample: `prices=[1,2,3,0,2]:
Start: held=-1, sold=0, rest=0
Day 2(2): held=max(-1,0-2)=-1, sold=-1+2=1, rest=max(0,0)=0
Day 3(3): held=max(-1,0-3)=-1, sold=-1+3=2, rest=max(0,1)=1
Day 4(0): held=max(-1,1-0)=1,  sold=-1+0=-1, rest=max(1,2)=2
Day 5(2): held=max(1,2-2)=1,   sold=1+2=3,   rest=max(2,-1)=2
Return max(3,2)=3 ✓`,
    alternativeApproaches: [
      "2D DP: dp[i][state] — same but O(n) space",
      "Recursion + memo: top-down, same complexity",
    ],
    proTips: [
      "Draw the state machine before coding — avoid bugs in transition logic",
      "Compute ALL new states using OLD values before updating any",
    ],
  },

  "decode-ways": {
    intuition: "Each digit or pair of digits may map to a letter (1-26). dp[i] = ways to decode s[0..i-1]. A single digit decodes if it's non-zero; a pair decodes if it's 10-26.",
    approach: [
      "dp[0]=1 (empty string), dp[1] = s[0]!='0' ? 1 : 0.",
      "For i from 2 to n:",
      "  oneDigit = s[i-1]-'0'. If oneDigit != 0: dp[i] += dp[i-1].",
      "  twoDigit = stoi(s.substr(i-2,2)). If 10<=twoDigit<=26: dp[i] += dp[i-2].",
      "Return dp[n].",
    ],
    cppSolution: `class Solution {
public:
    int numDecodings(string s) {
        int n = s.size();
        if (s[0] == '0') return 0;
        vector<int> dp(n + 1, 0);
        dp[0] = 1; dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            int one = s[i-1] - '0';
            int two = stoi(s.substr(i-2, 2));
            if (one != 0) dp[i] += dp[i-1];
            if (two >= 10 && two <= 26) dp[i] += dp[i-2];
        }
        return dp[n];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through string.",
    spaceComplexity: "O(n)",
    spaceExplanation: "dp array of size n+1.",
    edgeCases: [
      "Leading zero: '0...' → return 0 immediately",
      "'10': dp[2] = dp[0] = 1 (only '10' = J, not '1'+'0')",
      "'30': dp[2] = 0 (30>26 and second digit is 0 as single = invalid)",
      "Multiple consecutive zeros: 0",
    ],
    memoryTrick: "Climbing stairs but with validity checks. One step back if single digit valid. Two steps back if two-digit number in 10-26.",
    whyItWorks: "At each position, you either 'consumed' one character or two. dp[i] = total ways to reach position i = sum of valid predecessors. The validity constraints for 1-digit and 2-digit decodings are independent.",
    commonMistakes: [
      "twoDigit < 10 check: '06' would be 6, not valid two-digit encoding — must be 10-26",
      "s[i-1]=='0' single digit invalid — '0' doesn't map to any letter",
      "Off-by-one: dp[i] corresponds to s[0..i-1]",
    ],
    patternConnection: "Fibonacci-variant DP. Similar to Climbing Stairs but with validity conditions. Also related to regex DP and string parsing problems.",
    walkthroughExample: `s="226":
dp[0]=1, dp[1]=1
i=2: one=2(valid)→dp[2]+=dp[1]=1; two=22(10-26)→dp[2]+=dp[0]=1 → dp[2]=2
i=3: one=6(valid)→dp[3]+=dp[2]=2; two=26(10-26)→dp[3]+=dp[1]=1 → dp[3]=3
Return 3 (ways: 2-2-6, 22-6, 2-26) ✓`,
    alternativeApproaches: [
      "Space-optimized: keep prev2, prev1 instead of full array — O(1) space",
      "Recursion + memo: top-down",
    ],
    proTips: [
      "Space optimize: dp[i] only depends on dp[i-1] and dp[i-2]",
      "Handle '*' wildcard variant: multiply by 9 or 6 depending on position",
    ],
  },

  "unique-paths": {
    intuition: "Move only right or down. dp[i][j] = ways to reach cell (i,j) = dp[i-1][j] + dp[i][j-1]. First row and column are all 1s (only one way to reach them).",
    approach: [
      "Create m×n dp grid, initialize first row and first column to 1.",
      "For each cell (i,j) from (1,1): dp[i][j] = dp[i-1][j] + dp[i][j-1].",
      "Return dp[m-1][n-1].",
    ],
    cppSolution: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 1));
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
        return dp[m-1][n-1];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill every cell once.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "dp grid. Optimize to O(n) with 1D rolling array.",
    edgeCases: [
      "1×1 grid: return 1",
      "1×n or m×1: return 1 (only one path)",
    ],
    memoryTrick: "Pascal's triangle on a grid. Each cell = sum of cell above + cell to left.",
    whyItWorks: "Only two directions (right/down), so any path to (i,j) came from (i-1,j) or (i,j-1). No cycles. Optimal substructure holds trivially.",
    commonMistakes: [
      "Forgetting to initialize first row/column to 1",
      "Using dp[0][0]=0 — should be 1 (one way to be at start)",
    ],
    patternConnection: "2D DP classic. Same grid structure as Minimum Path Sum, Dungeon Game, Triangle. Math shortcut: C(m+n-2, m-1) — combinatorics gives O(1) solution.",
    walkthroughExample: `3×3 grid:
1 1 1
1 2 3
1 3 6
Answer=6 ✓`,
    alternativeApproaches: [
      "Math: C(m+n-2, m-1) — combinations, O(m) time",
      "1D DP: single row array, update in-place — O(n) space",
    ],
    proTips: [
      "Combinatorics: C(m+n-2, m-1) — mention this if interviewer asks for O(1) space and O(1) time",
      "With obstacles: can't use math, must use DP",
    ],
  },

  "minimum-path-sum": {
    intuition: "Find path from top-left to bottom-right minimizing sum. dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). First row/col have only one path.",
    approach: [
      "Initialize dp with grid values.",
      "Fill first row: dp[0][j] = dp[0][j-1] + grid[0][j].",
      "Fill first column: dp[i][0] = dp[i-1][0] + grid[i][0].",
      "Fill rest: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m-1][n-1].",
    ],
    cppSolution: `class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<vector<int>> dp(m, vector<int>(n));
        dp[0][0] = grid[0][0];
        for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
        for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);
        return dp[m-1][n-1];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill every cell once.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "dp grid (can optimize to O(n) with 1D array).",
    edgeCases: [
      "1×1 grid: return grid[0][0]",
      "1×n: only one path, sum entire row",
    ],
    memoryTrick: "Each cell inherits the cheaper path from above or left, then adds its own cost.",
    whyItWorks: "Optimal substructure: min path to (i,j) comes from min path to either (i-1,j) or (i,j-1). Greedy doesn't work (going left doesn't always help) but DP captures all possibilities.",
    commonMistakes: [
      "Using grid in-place without copying — modifies input",
      "Forgetting to initialize first row and column separately",
    ],
    patternConnection: "Standard 2D DP. Unique Paths variant with costs. Prepares for Dungeon Game (work backward), Cherry Pickup (multiple passes).",
    walkthroughExample: `grid=[[1,3,1],[1,5,1],[4,2,1]]:
dp: [1,4,5]
    [2,7,6]
    [6,8,7]
Answer=7 ✓`,
    alternativeApproaches: [
      "In-place: modify grid directly (O(1) extra space)",
      "1D DP: rolling array O(n) space",
    ],
    proTips: [
      "Can modify grid in-place to save space — check if input modification is allowed",
      "Dijkstra: works but O((mn) log(mn)) — overkill since movement is DAG",
    ],
  },

  "triangle": {
    intuition: "Minimum path sum from top to bottom of a triangle, moving to adjacent numbers. Bottom-up DP: start from second-to-last row, update each element as min of the two elements below it plus itself.",
    approach: [
      "Copy last row into dp.",
      "From row n-2 down to 0:",
      "  For each j in row: dp[j] = triangle[i][j] + min(dp[j], dp[j+1]).",
      "Return dp[0].",
    ],
    cppSolution: `class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        vector<int> dp = triangle.back();
        for (int i = (int)triangle.size()-2; i >= 0; i--)
            for (int j = 0; j <= i; j++)
                dp[j] = triangle[i][j] + min(dp[j], dp[j+1]);
        return dp[0];
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Process all elements in the triangle.",
    spaceComplexity: "O(n)",
    spaceExplanation: "dp array of last row size.",
    edgeCases: [
      "Single row: return that element",
      "All same values: any path, return n*val",
    ],
    memoryTrick: "Bottom-up bubble: each cell absorbs the best of its two children. Propagate upward.",
    whyItWorks: "Bottom-up avoids needing 2D dp. Each dp[j] stores the min path from that position to the bottom. After processing all rows, dp[0] holds the answer.",
    commonMistakes: [
      "Going top-down: must track two choices at each row, harder to manage",
      "Not using bottom-up: top-down requires 2D dp",
    ],
    patternConnection: "Triangle DP. Related to Pascal's triangle and pyramid DP problems. The 'adjacent' constraint (j or j+1) is what makes this 2D-reducible to 1D.",
    walkthroughExample: `triangle=[[2],[3,4],[6,5,7],[4,1,8,3]]:
dp=[4,1,8,3]
Row 2: dp[0]=6+min(4,1)=7, dp[1]=5+min(1,8)=6, dp[2]=7+min(8,3)=10
dp=[7,6,10,3]
Row 1: dp[0]=3+min(7,6)=9, dp[1]=4+min(6,10)=10
dp=[9,10,...]
Row 0: dp[0]=2+min(9,10)=11
Return 11 ✓`,
    alternativeApproaches: [
      "Top-down with 2D dp: dp[i][j] = min path from (0,0) to (i,j)",
      "Recursion + memo: O(n²) time and space",
    ],
    proTips: [
      "Bottom-up on last row = O(n) space — the canonical space-optimal approach",
      "Note: 'adjacent' in row i means same index j or j+1, not j-1",
    ],
  },

  "longest-common-subsequence": {
    intuition: "LCS of two strings. dp[i][j] = LCS of first i chars of s1 and first j chars of s2. If chars match: dp[i][j] = dp[i-1][j-1]+1. Else: max(dp[i-1][j], dp[i][j-1]).",
    approach: [
      "Create (m+1)×(n+1) dp table initialized to 0.",
      "For i from 1 to m, j from 1 to n:",
      "  If s1[i-1]==s2[j-1]: dp[i][j] = dp[i-1][j-1]+1.",
      "  Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (text1[i-1] == text2[j-1])
                    dp[i][j] = dp[i-1][j-1] + 1;
                else
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill every cell of the (m+1)×(n+1) table.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "dp table. Can reduce to O(n) with rolling rows.",
    edgeCases: [
      "One empty string: LCS = 0",
      "Identical strings: LCS = length",
      "No common characters: LCS = 0",
    ],
    memoryTrick: "Match = diagonal + 1. Mismatch = max of left or above. Fill the grid.",
    whyItWorks: "dp[i][j] represents the optimal solution for the subproblem of first i chars vs first j chars. Match extends both simultaneously. Mismatch: skip one character from either string — take the better option.",
    commonMistakes: [
      "1-indexed vs 0-indexed: dp[i][j] corresponds to text1[i-1] and text2[j-1]",
      "Forgetting dp[0][*] and dp[*][0] = 0 (empty prefix has no common subsequence)",
      "Confusing substring (contiguous) vs subsequence (not necessarily contiguous)",
    ],
    patternConnection: "Foundation of sequence DP. Appears in: Edit Distance, Interleaving String, Distinct Subsequences. 2D DP where rows=one string, cols=other string is the core template.",
    walkthroughExample: `text1="ace", text2="abcde":
    "" a b c d e
"" [0,0,0,0,0,0]
a  [0,1,1,1,1,1]
c  [0,1,1,2,2,2]
e  [0,1,1,2,2,3]
LCS=3 ("ace") ✓`,
    alternativeApproaches: [
      "Space-optimized 1D: two rows at a time — O(n) space",
      "Recursion + memo: top-down, same complexity",
      "Hirschberg's algorithm: O(mn) time, O(m+n) space, also reconstructs LCS",
    ],
    proTips: [
      "To reconstruct the actual LCS: backtrack from dp[m][n] checking match/mismatch",
      "LCS length = (m+n - edit_distance) / 2 for equal-char-cost edit distance",
    ],
  },

  "longest-increasing-subsequence": {
    intuition: "Find length of longest strictly increasing subsequence. DP approach: dp[i] = LIS ending at index i. For each i, check all j<i where nums[j]<nums[i]. O(n²). Optimal: patience sorting with binary search gives O(n log n).",
    approach: [
      "O(n log n) approach: maintain 'tails' array where tails[i] = smallest tail of LIS of length i+1.",
      "For each num: binary search for first tail >= num, replace it with num.",
      "If num > all tails: append it (extends LIS by 1).",
      "Return tails.size().",
    ],
    cppSolution: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int num : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), num);
            if (it == tails.end()) tails.push_back(num);
            else *it = num;
        }
        return tails.size();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "n iterations, each with O(log n) binary search.",
    spaceComplexity: "O(n)",
    spaceExplanation: "tails array of at most n elements.",
    edgeCases: [
      "All decreasing: LIS = 1",
      "All increasing: LIS = n",
      "All same: LIS = 1 (strictly increasing)",
    ],
    memoryTrick: "Patience sorting: maintain piles with smallest-top. Each new card: replace first pile top >= card, or start new pile. Pile count = LIS length.",
    whyItWorks: "tails[i] = smallest tail element of all increasing subsequences of length i+1. This invariant ensures binary search correctly finds where to place each new element. Replacing (not appending) maintains the invariant.",
    commonMistakes: [
      "tails is NOT the actual LIS — don't return tails as the answer subsequence",
      "Using upper_bound instead of lower_bound for strictly increasing",
      "The O(n²) dp[i]=max over j<i where nums[j]<nums[i] — valid but too slow",
    ],
    patternConnection: "Greedy + binary search. Also solvable with DP O(n²). The O(n log n) solution is a classic that shows up in: Russian Doll Envelopes (2D LIS), Number of LIS, and patience sorting.",
    walkthroughExample: `nums=[10,9,2,5,3,7,101,18]:
10→[10]
9→replace 10→[9]
2→replace 9→[2]
5→append→[2,5]
3→replace 5→[2,3]
7→append→[2,3,7]
101→append→[2,3,7,101]
18→replace 101→[2,3,7,18]
Length=4 ✓`,
    alternativeApproaches: [
      "O(n²) DP: dp[i] = LIS ending at i — simpler to understand/implement",
      "Segment tree: O(n log n) — when values are compressed coordinates",
    ],
    proTips: [
      "lower_bound for strictly increasing; upper_bound for non-decreasing variant",
      "Russian Doll: sort by width asc, height desc → LIS on heights",
    ],
  },

  "longest-palindromic-substr": {
    intuition: "Every palindrome has a center (single char or pair). Expand outward from each center while chars match. Track longest expansion. O(n) total centers × O(n) expansion = O(n²).",
    approach: [
      "For each index i, expand with single center (odd length) and dual center (even length).",
      "Expand while left>=0, right<n, s[left]==s[right]. Track max length and start.",
      "Return s.substr(start, maxLen).",
    ],
    cppSolution: `class Solution {
    int expand(string& s, int l, int r) {
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }
        return r - l - 1; // length of palindrome
    }
public:
    string longestPalindrome(string s) {
        int start = 0, maxLen = 1;
        for (int i = 0; i < (int)s.size(); i++) {
            int odd = expand(s, i, i);
            int even = expand(s, i, i+1);
            int len = max(odd, even);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substr(start, maxLen);
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "n centers × O(n) expansion each.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space beyond the answer.",
    edgeCases: [
      "Single character: return it",
      "All same characters: return entire string",
      "No palindrome longer than 1: return any single char",
    ],
    memoryTrick: "Expand around center: try every possible center (2n-1 centers), expand outward while matching. Track global max.",
    whyItWorks: "Every palindrome has exactly one 'center'. By trying all 2n-1 possible centers (n single-char + n-1 gaps), we guarantee finding the longest. Expanding is greedy: go as far as possible from each center.",
    commonMistakes: [
      "Forgetting even-length palindromes have dual-char centers",
      "start calculation: start = i - (len-1)/2 — verify with examples",
      "DP approach: O(n²) space — expand-around-center is O(1) space",
    ],
    patternConnection: "Two-pointer expansion from center. Related to Palindromic Substrings (count all), Palindrome Partitioning (backtracking). Manacher's algorithm gives O(n) — mention it as bonus.",
    walkthroughExample: `s="babad":
center 0(b): odd=b(1), even=0
center 1(a): odd=bab(3), even=ab(0)
center 2(b): odd=aba(3), even=ab(0)
...
maxLen=3, start=0 → "bab" ✓ (or "aba")`,
    alternativeApproaches: [
      "2D DP: dp[i][j]=is s[i..j] palindrome — O(n²) time and space",
      "Manacher's algorithm: O(n) time and space — worth knowing for interviews",
    ],
    proTips: [
      "Manacher's algorithm: O(n) — mention it to impress, but expand-center is acceptable",
      "start = i - (len-1)/2 handles both odd and even length correctly",
    ],
  },

  "palindromic-substrings": {
    intuition: "Count all palindromic substrings. Same expand-around-center approach. Each expansion that succeeds = one palindrome found.",
    approach: [
      "For each center (odd and even): expand outward while s[l]==s[r].",
      "Each successful expansion contributes 1 to count.",
      "Sum all counts.",
    ],
    cppSolution: `class Solution {
    int countExpand(string& s, int l, int r) {
        int count = 0;
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {
            count++; l--; r++;
        }
        return count;
    }
public:
    int countSubstrings(string s) {
        int total = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            total += countExpand(s, i, i);   // odd
            total += countExpand(s, i, i+1); // even
        }
        return total;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "n centers, O(n) expansion each.",
    spaceComplexity: "O(1)",
    spaceExplanation: "No extra space.",
    edgeCases: [
      "Single char: 1 palindrome",
      "All same chars: n*(n+1)/2 palindromes",
    ],
    memoryTrick: "Each center expansion step = one palindrome. Count expansions, don't return strings.",
    whyItWorks: "Same as longest palindrome but instead of tracking max, we count. Each successful [l,r] expansion is a distinct palindromic substring.",
    commonMistakes: [
      "Forgetting single characters count as palindromes",
      "Double-counting: odd and even centers are separate — no overlap",
    ],
    patternConnection: "Companion to Longest Palindromic Substring. Same pattern, different aggregation (count vs max). Both O(n²) with O(1) space.",
    walkthroughExample: `s="abc": a(1)+b(1)+c(1) = 3 (no even palindromes)
s="aaa": a(1)+aa(1)+a(1)+aaa(1)+aa(1)+a(1) = 6
Formula: n*(n+1)/2 for all-same string`,
    alternativeApproaches: [
      "2D DP: dp[i][j] = is palindrome — O(n²) space",
      "Manacher's: O(n) time",
    ],
    proTips: [
      "Same O(n²) solution as longest palindrome — just aggregate differently",
      "Manacher's gives each palindrome's radius in O(n), can count from radii",
    ],
  },

  "edit-distance": {
    intuition: "Min operations (insert, delete, replace) to transform word1 to word2. dp[i][j] = edit distance between first i chars of word1 and first j chars of word2. If chars match: dp[i][j]=dp[i-1][j-1]. Else: 1 + min(replace, delete, insert).",
    approach: [
      "Create (m+1)×(n+1) dp table.",
      "Base: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars).",
      "For i,j from 1: if word1[i-1]==word2[j-1]: dp[i][j]=dp[i-1][j-1].",
      "Else: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]).",
      "  (replace, delete from word1, insert into word1).",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m+1, vector<int>(n+1));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (word1[i-1] == word2[j-1])
                    dp[i][j] = dp[i-1][j-1];
                else
                    dp[i][j] = 1 + min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]});
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill the (m+1)×(n+1) DP table.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "DP table. Can optimize to O(n) with rolling rows.",
    edgeCases: [
      "One empty string: distance = other string's length",
      "Same strings: distance = 0",
      "Single char each: 0 if same, 1 if different",
    ],
    memoryTrick: "Match = diagonal (free). Mismatch = 1 + min(diagonal=replace, up=delete, left=insert).",
    whyItWorks: "Levenshtein distance. Three operations cover all transformations. dp[i-1][j-1] = replace last chars. dp[i-1][j] = delete last char of word1. dp[i][j-1] = insert a char into word1. Taking minimum gives optimal.",
    commonMistakes: [
      "Confusing which operation goes with which cell: diagonal=replace, up=delete, left=insert",
      "Not initializing base cases (first row/column)",
      "Word1 and word2 mixed up — doesn't matter for final answer but matters for reconstruction",
    ],
    patternConnection: "2D string DP. Same table structure as LCS, Interleaving String, Distinct Subsequences. The 'diagonal/up/left' choices appear in most 2-string DP problems.",
    walkthroughExample: `word1="horse", word2="ros":
    ""  r  o  s
""  [0, 1, 2, 3]
h   [1, 1, 2, 3]
o   [2, 2, 1, 2]
r   [3, 2, 2, 2]
s   [4, 3, 3, 2]
e   [5, 4, 4, 3]
Answer=3 ✓`,
    alternativeApproaches: [
      "Space-optimized: two 1D rows — O(n) space",
      "Recursion + memo: top-down, same complexity",
    ],
    proTips: [
      "Edit distance = m+n - 2*LCS(word1,word2) when all ops have cost 1",
      "Reconstruct operations by backtracking through dp table",
    ],
  },

  "distinct-subsequences": {
    intuition: "Count ways to form t as subsequence of s. dp[i][j] = ways to form t[0..j-1] from s[0..i-1]. If s[i-1]==t[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]. Else: dp[i][j] = dp[i-1][j].",
    approach: [
      "Create (m+1)×(n+1) dp table. dp[i][0] = 1 for all i (empty t, one way: delete all).",
      "For i from 1 to m, j from 1 to n:",
      "  Always take dp[i-1][j] (skip s[i-1]).",
      "  If s[i-1]==t[j-1]: also add dp[i-1][j-1] (use s[i-1] to match t[j-1]).",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    int numDistinct(string s, string t) {
        int m = s.size(), n = t.size();
        vector<vector<long>> dp(m+1, vector<long>(n+1, 0));
        for (int i = 0; i <= m; i++) dp[i][0] = 1;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                dp[i][j] = dp[i-1][j];
                if (s[i-1] == t[j-1]) dp[i][j] += dp[i-1][j-1];
            }
        return (int)dp[m][n];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill entire DP table.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "t empty: 1 way (empty subsequence)",
      "s empty, t non-empty: 0 ways",
      "s shorter than t: 0 ways",
      "Large inputs: use long to avoid overflow",
    ],
    memoryTrick: "Skip s[i-1] always contributes dp[i-1][j]. Match contributes dp[i-1][j-1] additionally.",
    whyItWorks: "At each s[i-1], you either use it to match t[j-1] (if they're equal) or skip it. Skipping adds all ways from the previous row. Using it adds ways from diagonal (both strings advanced).",
    commonMistakes: [
      "Overflow: use long/long long — answer can be very large",
      "dp[0][j]=0 for j>0 (can't form non-empty t from empty s)",
      "Confusing with LCS — this counts WAYS to form subsequence, not length",
    ],
    patternConnection: "Hard 2D DP on sequences. Part of the family with LCS and Edit Distance but specifically counting subsequences. Key distinction: skip is always allowed (dp[i-1][j]), match is additive.",
    walkthroughExample: `s="rabbbit", t="rabbit":
Tracking where 3 b's can be chosen from 3 b positions.
Answer=3 ✓ (choose first 2, 1&3, or 2&3 b's)`,
    alternativeApproaches: [
      "1D DP (right-to-left): optimize space to O(n)",
      "Recursion + memo: top-down",
    ],
    proTips: [
      "Iterate j right-to-left when using 1D to avoid using updated values",
      "Use long even if answer fits int — intermediate values may overflow",
    ],
  },

  "interleaving-string": {
    intuition: "Is s3 an interleaving of s1 and s2? dp[i][j] = can s3[0..i+j-1] be formed by interleaving s1[0..i-1] and s2[0..j-1]. Transition: from dp[i-1][j] if s1[i-1]==s3[i+j-1], or dp[i][j-1] if s2[j-1]==s3[i+j-1].",
    approach: [
      "Check len(s1)+len(s2)==len(s3), else false.",
      "Create (m+1)×(n+1) dp table, dp[0][0]=true.",
      "Init first row: dp[0][j] = dp[0][j-1] && s2[j-1]==s3[j-1].",
      "Init first col: dp[i][0] = dp[i-1][0] && s1[i-1]==s3[i-1].",
      "Fill: dp[i][j] = (dp[i-1][j]&&s1[i-1]==s3[i+j-1]) || (dp[i][j-1]&&s2[j-1]==s3[i+j-1]).",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        int m = s1.size(), n = s2.size();
        if (m + n != (int)s3.size()) return false;
        vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
        dp[0][0] = true;
        for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] && s2[j-1]==s3[j-1];
        for (int i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] && s1[i-1]==s3[i-1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1])
                         || (dp[i][j-1] && s2[j-1]==s3[i+j-1]);
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill the DP table.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "DP table. Optimize to O(n) with 1D.",
    edgeCases: [
      "Length mismatch: immediately return false",
      "One empty string: s3 must equal the other string",
      "All same characters: careful with overlapping matches",
    ],
    memoryTrick: "Grid: row=s1 chars consumed, col=s2 chars consumed. Each cell: can we reach this state? Move right=use s2 char, move down=use s1 char.",
    whyItWorks: "State (i,j) = consumed i chars from s1 and j chars from s2 → matched i+j chars of s3. Valid if we got here from (i-1,j) with s1[i-1] match or from (i,j-1) with s2[j-1] match.",
    commonMistakes: [
      "Not checking length equality first",
      "s3 index is i+j-1 (not i or j independently)",
      "Forgetting base case initialization of first row and column",
    ],
    patternConnection: "2D boolean DP on two strings. Less common than LCS/Edit Distance but tests same grid-DP intuition. BFS alternative is also clean for this problem.",
    walkthroughExample: `s1="aab", s2="axy", s3="aaxaby":
Build 4×4 grid, trace T/F values.
dp[3][3]=true → valid interleaving ✓`,
    alternativeApproaches: [
      "BFS: state=(i,j) index in s1 and s2, traverse s3 — O(mn) time/space",
      "1D DP: single row, update right-to-left — O(n) space",
    ],
    proTips: [
      "BFS is often more intuitive: add (i,j) to queue, advance s3 pointer accordingly",
      "1D optimization: dp[j] = (dp[j] && s1 match) || (dp[j-1] && s2 match)",
    ],
  },

  "partition-equal-subset": {
    intuition: "Can we split array into two equal-sum subsets? If total sum is odd, impossible. Else find subset summing to total/2. 0/1 knapsack: dp[s] = can we achieve sum s?",
    approach: [
      "If sum is odd, return false.",
      "target = sum/2.",
      "dp[0] = true. For each num, iterate s from target down to num:",
      "  dp[s] |= dp[s-num].",
      "Return dp[target].",
    ],
    cppSolution: `class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        if (sum % 2) return false;
        int target = sum / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int num : nums)
            for (int s = target; s >= num; s--)
                dp[s] = dp[s] || dp[s - num];
        return dp[target];
    }
};`,
    timeComplexity: "O(n × sum)",
    timeExplanation: "n numbers, each with target/2 iterations.",
    spaceComplexity: "O(sum)",
    spaceExplanation: "1D dp array of size sum/2+1.",
    edgeCases: [
      "Odd total sum: immediately false",
      "Single element: only if it's 0",
      "All same elements: depends on count and value",
    ],
    memoryTrick: "0/1 knapsack: iterate sums BACKWARD to avoid reusing same element. dp[target] = reachable?",
    whyItWorks: "0/1 knapsack (each element used at most once). Backward iteration ensures each num is considered at most once per pass. dp[s] = true means we can select a subset summing to s.",
    commonMistakes: [
      "Forward iteration reuses same number — must go backward for 0/1 knapsack",
      "Not checking odd sum first — saves work",
      "Using 2D dp when 1D suffices",
    ],
    patternConnection: "0/1 Knapsack DP. Same backward-iteration pattern: Target Sum (count ways), Subset Sum, Coin Change II (forward = unbounded). Remember: backward = 0/1, forward = unbounded.",
    walkthroughExample: `nums=[1,5,11,5], sum=22, target=11:
After 1: dp[1]=T
After 5: dp[5]=T, dp[6]=T
After 11: dp[11]=T ← found!
Return true ✓`,
    alternativeApproaches: [
      "2D DP: dp[i][s] = using first i nums, can reach sum s — O(n×sum) space",
      "Bitset optimization: O(n×sum/64) with bitset",
    ],
    proTips: [
      "Backward iteration = each item used once. Memorize this distinction",
      "Early termination: if dp[target] becomes true, return immediately",
    ],
  },

  "target-sum": {
    intuition: "Assign + or - to each number, count ways to reach target. DP counting variant. dp[sum+offset] = ways to reach sum. Or transform: subset P with +, subset N with -. P-N=target, P+N=total → P=(target+total)/2. Count subsets summing to P.",
    approach: [
      "If (target+total) is odd or abs(target)>total: return 0.",
      "goal = (target+total)/2.",
      "dp[0]=1. For each num: iterate s from goal down to num:",
      "  dp[s] += dp[s-num].",
      "Return dp[goal].",
    ],
    cppSolution: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int total = 0;
        for (int n : nums) total += n;
        if ((total + target) % 2 || abs(target) > total) return 0;
        int goal = (total + target) / 2;
        vector<int> dp(goal + 1, 0);
        dp[0] = 1;
        for (int num : nums)
            for (int s = goal; s >= num; s--)
                dp[s] += dp[s - num];
        return dp[goal];
    }
};`,
    timeComplexity: "O(n × sum)",
    timeExplanation: "Knapsack over all nums and possible sums.",
    spaceComplexity: "O(sum)",
    spaceExplanation: "1D dp array.",
    edgeCases: [
      "(total+target) odd: return 0",
      "abs(target) > total: impossible",
      "All zeros: 2^(count of zeros) ways if target==0",
    ],
    memoryTrick: "Transform to subset sum counting: P=(target+total)/2. Count subsets summing to P using backward knapsack.",
    whyItWorks: "Let P = set of + nums, N = set of - nums. P-N=target, P+N=total → P=(target+total)/2. Counting subsets of given sum = standard 0/1 knapsack counting.",
    commonMistakes: [
      "Goal might be negative if target<-total: handle with abs check",
      "Integer overflow: goal could be large with big inputs",
      "Using DFS: O(2^n) — DP is much better",
    ],
    patternConnection: "Knapsack counting variant. Same pattern as Coin Change II (forward) but with 0/1 (backward). The math transformation (P-N=target trick) is reusable.",
    walkthroughExample: `nums=[1,1,1,1,1], target=3:
total=5, goal=(3+5)/2=4
Count subsets of [1,1,1,1,1] summing to 4 = C(5,4) = 5 ✓`,
    alternativeApproaches: [
      "DFS + memo: top-down with (index, currentSum) state — O(n×sum)",
      "BFS: expand states (sum) level by level — more memory",
    ],
    proTips: [
      "DFS solution is more intuitive but DP is faster in practice",
      "The P=(target+total)/2 transformation is a powerful trick for +/- assignment problems",
    ],
  },

  "coin-change-ii": {
    intuition: "Count ways to make amount using coins (unlimited use). Unlike Coin Change I (minimum count), this counts combinations. dp[s] = ways to make sum s. For each coin: update forward (unbounded knapsack).",
    approach: [
      "dp[0]=1 (one way to make 0: use no coins).",
      "For each coin (outer loop): for s from coin to amount (inner loop, forward):",
      "  dp[s] += dp[s-coin].",
      "Return dp[amount].",
    ],
    cppSolution: `class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> dp(amount + 1, 0);
        dp[0] = 1;
        for (int coin : coins)
            for (int s = coin; s <= amount; s++)
                dp[s] += dp[s - coin];
        return dp[amount];
    }
};`,
    timeComplexity: "O(amount × coins)",
    timeExplanation: "Outer loop over coins, inner over amounts.",
    spaceComplexity: "O(amount)",
    spaceExplanation: "1D dp array.",
    edgeCases: [
      "amount=0: return 1 (empty combination)",
      "No coins: return 0 for amount>0",
      "Coin larger than amount: skipped by inner loop condition",
    ],
    memoryTrick: "Forward iteration = unbounded (each coin usable multiple times). Outer loop = coins ensures combinations not permutations.",
    whyItWorks: "Processing one coin at a time ensures we count combinations (not permutations). Forward iteration allows the same coin to be used multiple times. Each dp[s] accumulates all ways to reach s using all coins seen so far.",
    commonMistakes: [
      "Swapping inner/outer loops: coins inner, amounts outer → counts permutations not combinations",
      "Using backward iteration → 0/1 knapsack (each coin once)",
      "Confusing with Coin Change I (min coins) — that uses min(), this uses +=",
    ],
    patternConnection: "Unbounded knapsack counting. Perfect pair with Partition Equal Subset (0/1 backward) and Target Sum. 'Outer coin loop = combinations, inner coin loop = permutations.'",
    walkthroughExample: `amount=5, coins=[1,2,5]:
After coin=1: dp=[1,1,1,1,1,1]
After coin=2: dp[2]+=dp[0]=1→dp=[1,1,2,2,3,3]
After coin=5: dp[5]+=dp[0]=1→dp=[1,1,2,2,3,4]
Return 4 ✓ (1+1+1+1+1, 1+1+1+2, 1+2+2, 5)`,
    alternativeApproaches: [
      "2D DP: dp[i][s] = ways using first i coins for sum s",
      "Recursion + memo: top-down",
    ],
    proTips: [
      "Outer=coin, inner=sum → combinations. Swap → permutations. Know this distinction",
      "Same base as Coin Change I but += instead of min()",
    ],
  },

  "max-product-subarray": {
    intuition: "Track both max and min product ending at current position (negative×negative=positive). At each element: new_max = max(nums[i], maxProd*nums[i], minProd*nums[i]). Similarly for min. Update global max.",
    approach: [
      "Initialize maxP=minP=result=nums[0].",
      "For each nums[i] from index 1:",
      "  Compute candidates: nums[i], maxP*nums[i], minP*nums[i].",
      "  new_max = max of candidates, new_min = min of candidates.",
      "  Update result = max(result, new_max).",
      "  maxP = new_max, minP = new_min.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxP = nums[0], minP = nums[0], result = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            int a = nums[i], b = maxP * nums[i], c = minP * nums[i];
            maxP = max({a, b, c});
            minP = min({a, b, c});
            result = max(result, maxP);
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "Single element: return it",
      "All negatives with even count: product of all is max",
      "Contains zero: resets both maxP and minP to nums[i]",
    ],
    memoryTrick: "Track both max AND min product (min can become max when multiplied by negative). Reset on zero automatically (max(0, 0, 0) = 0 = nums[i]).",
    whyItWorks: "Negative number flips max and min. Zero resets both. By tracking both extremes, we always have the right candidates for the next element. The maximum subarray product must end at some index — try all endings.",
    commonMistakes: [
      "Only tracking max — misses negative×negative=positive case",
      "Computing new values from already-updated maxP/minP — use old values",
      "Not handling the case where nums[i] alone is best (start fresh)",
    ],
    patternConnection: "Kadane's variant for products. The dual-tracking (max+min) pattern also appears in: best stock with cooldown states, DP with flipped costs.",
    walkthroughExample: `nums=[2,3,-2,4]:
i=3: maxP=2,minP=2
i=-3: maxP=6,minP=6... wait
nums=[2,3,-2,4]:
Start: maxP=minP=res=2
i=3: a=3,b=6,c=6→maxP=6,minP=3,res=6
i=-2: a=-2,b=-12,c=-6→maxP=-2,minP=-12,res=6
i=4: a=4,b=-8,c=-48→maxP=4,minP=-48,res=6
Return 6 ✓`,
    alternativeApproaches: [
      "Prefix/suffix product: product from left and right, zeros split — O(n) space",
      "Brute force: O(n²) — all subarrays",
    ],
    proTips: [
      "Must compute all three candidates (a,b,c) using OLD maxP and minP",
      "With all positives: same as max subarray sum",
    ],
  },

  "word-break": {
    intuition: "Can string s be segmented into dictionary words? DP: dp[i] = can s[0..i-1] be segmented. For each i: try all j<i where dp[j]=true and s[j..i-1] is in dict.",
    approach: [
      "Build unordered_set from wordDict for O(1) lookup.",
      "dp[0]=true (empty string). For i from 1 to n:",
      "  For j from 0 to i: if dp[j] && dict.count(s.substr(j, i-j)): dp[i]=true.",
      "Return dp[n].",
    ],
    cppSolution: `class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && dict.count(s.substr(j, i-j))) {
                    dp[i] = true;
                    break;
                }
        return dp[n];
    }
};`,
    timeComplexity: "O(n² × L)",
    timeExplanation: "n² pairs, substring creation is O(L) where L = max word length.",
    spaceComplexity: "O(n + dict size)",
    spaceExplanation: "dp array + hash set.",
    edgeCases: [
      "Empty string: dp[0]=true → return true",
      "Word longer than s: substr check fails",
      "Repeated characters in dict: handled by set",
    ],
    memoryTrick: "dp[i] = true if any valid split at j makes s[0..j-1] and s[j..i-1] both valid. 'Can I reach position i from any previous true position?'",
    whyItWorks: "dp[0] is the base: empty prefix is always valid. dp[i] extends from any valid prefix dp[j] where the remaining segment s[j..i-1] is in the dictionary. The set of valid splits is enumerated.",
    commonMistakes: [
      "Forgetting to break after finding a valid split (minor optimization but shows understanding)",
      "Not using set — O(k) dict check instead of O(1)",
      "Substr creates new strings — Trie is more efficient if many lookups needed",
    ],
    patternConnection: "String segmentation DP. Related to: Palindrome Partitioning (backtracking), Decode Ways (single/double char choices). Classic 'reachability from true positions' pattern.",
    walkthroughExample: `s="leetcode", dict=["leet","code"]:
dp[0]=T
dp[4]: j=0,dp[0]=T,"leet"∈dict → dp[4]=T
dp[8]: j=4,dp[4]=T,"code"∈dict → dp[8]=T
Return true ✓`,
    alternativeApproaches: [
      "Recursion + memo: top-down with memoization",
      "Trie: build trie from dict for faster prefix matching",
      "BFS: treat each dp[true] as node, explore from there",
    ],
    proTips: [
      "Optimization: only iterate j from max(0, i-maxWordLen) to i",
      "If asked for all segmentations, switch to DFS/backtracking — dp only gives T/F",
    ],
  },

  "regular-expression-matching": {
    intuition: "Match string s with pattern p containing '.' (any char) and '*' (zero or more of preceding). dp[i][j] = does s[0..i-1] match p[0..j-1]? Handle '*' by either using it 0 times (dp[i][j-2]) or using it (dp[i-1][j] if s[i-1] matches p[j-2]).",
    approach: [
      "dp[0][0]=true. dp[0][j]: true if p[j-1]=='*' and dp[0][j-2].",
      "For each i,j: if p[j-1]!='*':",
      "  match char: dp[i][j] = dp[i-1][j-1] && (s[i-1]==p[j-1] || p[j-1]=='.').",
      "Else (p[j-1]=='*'):",
      "  Zero: dp[i][j] |= dp[i][j-2].",
      "  One+: dp[i][j] |= dp[i-1][j] && (s[i-1]==p[j-2] || p[j-2]=='.').",
      "Return dp[m][n].",
    ],
    cppSolution: `class Solution {
public:
    bool isMatch(string s, string p) {
        int m = s.size(), n = p.size();
        vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
        dp[0][0] = true;
        for (int j = 2; j <= n; j++)
            if (p[j-1] == '*') dp[0][j] = dp[0][j-2];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (p[j-1] != '*') {
                    dp[i][j] = dp[i-1][j-1] && (s[i-1]==p[j-1] || p[j-1]=='.');
                } else {
                    dp[i][j] = dp[i][j-2]; // zero occurrences
                    if (s[i-1]==p[j-2] || p[j-2]=='.')
                        dp[i][j] = dp[i][j] || dp[i-1][j]; // one or more
                }
            }
        return dp[m][n];
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Fill (m+1)×(n+1) DP table.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "DP table.",
    edgeCases: [
      "Empty pattern: only matches empty string",
      "Pattern 'a*': matches zero or more 'a's",
      "'.*': matches any string",
      "p longer than s with '*': may still match if '*' absorbs everything",
    ],
    memoryTrick: "'*' has two cases: zero (skip back 2 in pattern) or one+ (extend match, stay in pattern). Base: empty string, handle 'x*' patterns.",
    whyItWorks: "'*' is the hardest: it can eliminate the preceding char (zero times = dp[i][j-2]) or it can absorb the current s char (one more = dp[i-1][j], but only if chars match). DP captures all possibilities.",
    commonMistakes: [
      "Base case: dp[0][j] needs star pattern handling (not just dp[0][0]=true)",
      "One+ case: dp[i-1][j] (not dp[i-1][j-1]) — stay at same pattern position",
      "Confusing Wildcard Matching ('?' and '*') with Regex Matching",
    ],
    patternConnection: "Hard 2D DP. Similar to Edit Distance but with wildcard rules. Understanding this problem deeply shows mastery of 2D string DP.",
    walkthroughExample: `s="aab", p="c*a*b":
c* can match 0 c's, a* matches aa, b matches b.
dp[3][5]=true ✓`,
    alternativeApproaches: [
      "Recursion + memo: top-down, same complexity",
      "NFA simulation: construct NFA from pattern, simulate — O(mn)",
    ],
    proTips: [
      "Wildcard Matching ('?' and '*'): '?' = any char, '*' = any sequence — different DP transitions",
      "This is hard — accept O(mn) DP without overthinking optimization",
    ],
  },

  "burst-balloons": {
    intuition: "Interval DP. Think in reverse: which balloon to burst LAST in range [l,r]? If k is last in [l,r], it contributes nums[l-1]*nums[k]*nums[r+1]. dp[l][r] = max coins from bursting all balloons in [l,r].",
    approach: [
      "Add 1 to both ends of nums: nums = [1] + nums + [1].",
      "dp[l][r] = max coins from bursting balloons l..r (exclusive of 1-padded ends).",
      "For each length from 1 to n, for each l:",
      "  r = l + length - 1. For each k from l to r:",
      "  dp[l][r] = max(dp[l][r], dp[l][k-1]+nums[l-1]*nums[k]*nums[r+1]+dp[k+1][r]).",
      "Return dp[1][n].",
    ],
    cppSolution: `class Solution {
public:
    int maxCoins(vector<int>& nums) {
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        int n = nums.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));
        for (int len = 1; len <= n-2; len++)
            for (int l = 1; l <= n-2-len+1; l++) {
                int r = l + len - 1;
                for (int k = l; k <= r; k++)
                    dp[l][r] = max(dp[l][r],
                        dp[l][k-1] + nums[l-1]*nums[k]*nums[r+1] + dp[k+1][r]);
            }
        return dp[1][n-2];
    }
};`,
    timeComplexity: "O(n³)",
    timeExplanation: "Three nested loops over n elements.",
    spaceComplexity: "O(n²)",
    spaceExplanation: "2D dp table.",
    edgeCases: [
      "Single balloon: nums[0] padded by 1s on both sides",
      "All 1s: any order gives same result",
    ],
    memoryTrick: "Think backward: choose LAST balloon to burst (not first). Padding with 1s handles boundaries cleanly.",
    whyItWorks: "Forward thinking (first to burst) creates dependencies. Backward thinking (last to burst in interval) isolates intervals cleanly — once you fix k as last, [l,k-1] and [k+1,r] are independent subproblems with 1-padded boundaries at k.",
    commonMistakes: [
      "Thinking about first balloon to burst — creates complex dependencies",
      "Not padding with 1s — boundary conditions become messy",
      "Wrong boundary: dp[l-1] and dp[r+1] should be padded positions, not array bounds",
    ],
    patternConnection: "Interval DP with 'last element' trick. Same reverse thinking in: Strange Printer, Remove Boxes. Interval DP template: for len in 1..n, for l in range, r=l+len-1, try each split point k.",
    walkthroughExample: `nums=[3,1,5,8] → padded=[1,3,1,5,8,1]:
Burst in some order. Optimal: burst 1 first (coins=3*1*5=15), then 5(3*5*8=120), then 3(1*3*8=24), then 8(1*8*1=8). Total=167 ✓`,
    alternativeApproaches: [
      "No simpler approach exists — O(n³) interval DP is the standard",
      "Recursion + memo: same complexity, can be cleaner to write",
    ],
    proTips: [
      "Always add padding: nums[-1]=nums[n]=1. Saves boundary checks",
      "Build dp for increasing lengths — ensures subproblems solved before use",
    ],
  },

  "course-schedule": {
    intuition: "Can you finish all courses with prerequisites? This is cycle detection in a directed graph. Use DFS with three colors: white (unvisited), gray (in-progress), black (done). Gray-to-gray edge = cycle.",
    approach: [
      "Build adjacency list from prerequisites.",
      "For each unvisited node: run DFS.",
      "In DFS: mark gray. Visit all neighbors. If neighbor is gray: cycle found, return false. If black: skip. After all neighbors: mark black.",
      "If no cycles found: return true.",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> adj;
    vector<int> state; // 0=white,1=gray,2=black
    bool hasCycle(int u) {
        state[u] = 1;
        for (int v : adj[u]) {
            if (state[v] == 1) return true;
            if (state[v] == 0 && hasCycle(v)) return true;
        }
        state[u] = 2;
        return false;
    }
public:
    bool canFinish(int n, vector<vector<int>>& prereqs) {
        adj.resize(n); state.resize(n, 0);
        for (auto& p : prereqs) adj[p[1]].push_back(p[0]);
        for (int i = 0; i < n; i++)
            if (state[i] == 0 && hasCycle(i)) return false;
        return true;
    }
};`,
    timeComplexity: "O(V+E)",
    timeExplanation: "Each node and edge visited once.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list + state array.",
    edgeCases: [
      "No prerequisites: always true",
      "Single course: true",
      "Mutual prerequisites (a→b, b→a): cycle → false",
    ],
    memoryTrick: "Three-color DFS: WHITE→GRAY (entering) →BLACK (done). Gray neighbor = back edge = cycle.",
    whyItWorks: "Directed cycle means some course is prerequisite of itself (directly or indirectly) — impossible to complete. DFS detects cycles via back edges (gray→gray). Topological ordering exists iff no cycle.",
    commonMistakes: [
      "Only using visited boolean — misses cycle in current DFS path vs previously-completed path",
      "Wrong edge direction: prereq[1]→prereq[0] (to take course 0, must take 1 first)",
      "Not resetting state after DFS call — three colors handle this correctly",
    ],
    patternConnection: "Topological sort / cycle detection. Course Schedule II (return order), Alien Dictionary (order from words). Three-color DFS = canonical cycle detection.",
    walkthroughExample: `n=4, prereqs=[[1,0],[2,0],[3,1],[3,2]]:
Graph: 0→1→3, 0→2→3 (DAG)
DFS from 0: 0(gray)→1(gray)→3(gray)→black→black→2(gray)→black→black
No cycles → true ✓`,
    alternativeApproaches: [
      "Kahn's BFS topological sort: count in-degrees, reduce — cycle if not all nodes processed",
      "Union-Find: doesn't directly handle directed cycles",
    ],
    proTips: [
      "Kahn's algorithm alternative: start with in-degree=0 nodes, process level by level. Cycle = remaining nodes with in-degree > 0",
      "Three-color DFS is more generalizable than simple visited set",
    ],
  },

  "course-schedule-ii": {
    intuition: "Return topological order of courses. DFS-based: add course to result AFTER visiting all its dependents (post-order). Reverse gives topological order. Or Kahn's BFS: process nodes with in-degree 0 first.",
    approach: [
      "Build adjacency list (same direction as Course Schedule I).",
      "DFS post-order: mark gray→black, push to result after all neighbors done.",
      "If cycle detected: return empty array.",
      "Return reversed result (or use stack).",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> adj;
    vector<int> state;
    vector<int> order;
    bool dfs(int u) {
        state[u] = 1;
        for (int v : adj[u])
            if (state[v]==1 || (state[v]==0 && dfs(v))) return true;
        state[u] = 2;
        order.push_back(u);
        return false;
    }
public:
    vector<int> findOrder(int n, vector<vector<int>>& prereqs) {
        adj.resize(n); state.resize(n, 0);
        for (auto& p : prereqs) adj[p[1]].push_back(p[0]);
        for (int i = 0; i < n; i++)
            if (state[i]==0 && dfs(i)) return {};
        reverse(order.begin(), order.end());
        return order;
    }
};`,
    timeComplexity: "O(V+E)",
    timeExplanation: "DFS visits each node and edge once.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list + state + output.",
    edgeCases: [
      "Cycle: return empty vector",
      "No prerequisites: any order works",
      "Disconnected graph: DFS handles by trying all unvisited nodes",
    ],
    memoryTrick: "Post-order DFS = dependencies done before course. Reverse = correct take order. Or Kahn's: peel nodes with no prerequisites.",
    whyItWorks: "Post-order DFS visits a node AFTER all nodes it depends on. Reversing this gives an order where dependencies come first. This is the definition of topological sort.",
    commonMistakes: [
      "Forgetting to reverse — post-order gives reverse topological order",
      "Returning empty on cycle but not checking return value in main loop",
    ],
    patternConnection: "Topological sort — builds on Course Schedule I. Used in: Alien Dictionary (deduce ordering), Build Order problems. Kahn's BFS is equally valid.",
    walkthroughExample: `n=4, prereqs=[[1,0],[2,0],[3,1],[3,2]]:
Post-order DFS: 3,1,2,0 (black order) → reversed: [0,2,1,3] or [0,1,2,3] ✓`,
    alternativeApproaches: [
      "Kahn's BFS: in-degree array, queue with 0-degree nodes — often easier to implement",
    ],
    proTips: [
      "Kahn's: easier to implement correctly. DFS: more elegant for detecting cycles simultaneously",
      "Both are O(V+E) — choose based on interviewer preference or your comfort",
    ],
  },

  "walls-gates": {
    intuition: "Multi-source BFS from all gates simultaneously. Cells fill with minimum distance to nearest gate. Start with all gates (0s) in queue, expand outward — BFS guarantees shortest distance.",
    approach: [
      "Find all gates (0s), add to BFS queue.",
      "BFS: for each position, try all 4 directions.",
      "If neighbor is INF (empty room): set its distance = current+1, add to queue.",
      "Walls (-1) are never updated.",
    ],
    cppSolution: `class Solution {
public:
    void wallsAndGates(vector<vector<int>>& rooms) {
        int m = rooms.size(), n = rooms[0].size();
        const int INF = 2147483647;
        queue<pair<int,int>> q;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (rooms[i][j] == 0) q.push({i, j});
        int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
        while (!q.empty()) {
            auto [x, y] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nx = x+dx[d], ny = y+dy[d];
                if (nx>=0 && nx<m && ny>=0 && ny<n && rooms[nx][ny]==INF) {
                    rooms[nx][ny] = rooms[x][y] + 1;
                    q.push({nx, ny});
                }
            }
        }
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Each cell visited at most once in BFS.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "BFS queue in worst case.",
    edgeCases: [
      "No gates: all rooms remain INF",
      "No rooms: BFS doesn't start",
      "Walls blocking all paths: some rooms remain INF",
    ],
    memoryTrick: "Multi-source BFS: start from ALL gates at once. Distance fills outward like ripples. BFS = shortest path.",
    whyItWorks: "BFS processes nodes level by level. Level k = distance k from nearest gate. Multi-source BFS expands from all sources simultaneously — equivalent to adding a virtual super-source connected to all gates with cost 0.",
    commonMistakes: [
      "Single-source BFS per room: O(m²n²) — far too slow",
      "Using DFS: doesn't guarantee shortest distance",
      "Updating non-INF cells: would overwrite previously set shorter distances",
    ],
    patternConnection: "Multi-source BFS — same pattern as Rotting Oranges, 01-Matrix (distance to nearest 0). Any 'distance to nearest X' problem → multi-source BFS.",
    walkthroughExample: `Grid: INF -1  0 INF
       INF INF INF -1
       INF -1 INF -1
        0  -1 INF INF
BFS from two gates (row0,col2) and (row3,col0).
Fills minimum distances outward. ✓`,
    alternativeApproaches: [
      "DFS from each gate: O(m²n²) — too slow",
      "DP: works for grids without complex obstacles",
    ],
    proTips: [
      "Multi-source BFS = add virtual node 0 connected to all sources with cost 0",
      "Only update INF cells — prevents overwriting shorter distances",
    ],
  },

  "graph-valid-tree": {
    intuition: "A valid tree has exactly n-1 edges and no cycles. Check both conditions. Union-Find: if edge creates cycle (same component), invalid. After processing: check exactly n-1 edges were added.",
    approach: [
      "If edges.size() != n-1: return false (not a tree).",
      "Union-Find with n nodes. For each edge:",
      "  If find(u)==find(v): cycle exists → return false.",
      "  Union u and v.",
      "Return true (n-1 edges, no cycles = valid tree).",
    ],
    cppSolution: `class Solution {
    vector<int> parent, rank_;
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y);
        if (x==y) return false;
        if (rank_[x]<rank_[y]) swap(x,y);
        parent[y]=x; if(rank_[x]==rank_[y]) rank_[x]++;
        return true;
    }
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n-1) return false;
        parent.resize(n); rank_.resize(n,0);
        iota(parent.begin(), parent.end(), 0);
        for (auto& e : edges)
            if (!unite(e[0], e[1])) return false;
        return true;
    }
};`,
    timeComplexity: "O(E α(n))",
    timeExplanation: "E union-find operations, nearly O(1) each.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent and rank arrays.",
    edgeCases: [
      "n=1, no edges: valid tree (single node)",
      "n=2, one edge: valid",
      "Self-loop: cycle → false",
    ],
    memoryTrick: "Tree = n nodes + n-1 edges + connected + no cycle. Check n-1 edges first (O(1)), then Union-Find for cycles.",
    whyItWorks: "n-1 edges + no cycles → connected (by property of trees). Checking n-1 edges first filters obvious non-trees. Union-Find detects cycles in near-O(1) per edge.",
    commonMistakes: [
      "Not checking edge count first — adds unnecessary work",
      "Forgetting both conditions: need n-1 edges AND no cycle (but n-1 edges + no cycle implies connected)",
    ],
    patternConnection: "Union-Find application. Same as Redundant Connection (find the cycle edge), Number of Connected Components. Tree validation = cycle detection + connectivity.",
    walkthroughExample: `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]:
4 edges = n-1=4 ✓
Union 0-1: ok; 0-2: ok; 0-3: ok; 1-4: ok (4 merges, no conflicts)
Return true ✓`,
    alternativeApproaches: [
      "DFS: check connectivity + cycle in one pass — O(V+E)",
      "BFS: same, also O(V+E)",
    ],
    proTips: [
      "Check edge count first — instant O(1) filter for most invalid inputs",
      "Union-Find vs DFS: UF is often faster in practice for this specific problem",
    ],
  },

  "num-connected-components": {
    intuition: "Count connected components in undirected graph. Union-Find: start with n components, decrement each time two different components merge. Final count = answer.",
    approach: [
      "Initialize Union-Find with n components, count=n.",
      "For each edge [u,v]: if find(u)!=find(v): unite, count--.",
      "Return count.",
    ],
    cppSolution: `class Solution {
    vector<int> parent, rank_;
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y);
        if (x==y) return false;
        if (rank_[x]<rank_[y]) swap(x,y);
        parent[y]=x; if(rank_[x]==rank_[y]) rank_[x]++;
        return true;
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n); rank_.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
        int count = n;
        for (auto& e : edges)
            if (unite(e[0], e[1])) count--;
        return count;
    }
};`,
    timeComplexity: "O(E α(n))",
    timeExplanation: "E union-find operations.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent and rank arrays.",
    edgeCases: [
      "No edges: n components",
      "All connected: 1 component",
      "Self-loops: unite returns false, count unchanged",
    ],
    memoryTrick: "Start with n islands. Each successful merge sinks one island. Final = remaining islands.",
    whyItWorks: "Each merge operation reduces component count by exactly 1 (two distinct components become one). Failed merges (same component) don't change count. Path compression and union by rank ensure near-O(1) per operation.",
    commonMistakes: [
      "Counting merges instead of tracking distinct components — same result but less intuitive",
      "Using DFS with visited array — correct but slower for dynamic graphs",
    ],
    patternConnection: "Union-Find canonical use case. Same structure: Graph Valid Tree (add tree check), Redundant Connection (find last merge). Count = n - successful_merges.",
    walkthroughExample: `n=5, edges=[[0,1],[1,2],[3,4]]:
Start: count=5
Merge 0-1: count=4
Merge 1-2: count=3
Merge 3-4: count=2
Return 2 ✓`,
    alternativeApproaches: [
      "DFS/BFS: for each unvisited node, DFS and count starts — O(V+E)",
    ],
    proTips: [
      "Union-Find is ideal for this — also handles dynamic edge additions",
      "DFS simpler to code if graph is static and small",
    ],
  },

  "all-paths-source-target": {
    intuition: "Find all paths from node 0 to node n-1 in a DAG. Backtracking DFS: explore each neighbor, add to path, recurse, then remove. Collect paths when reaching n-1.",
    approach: [
      "DFS from node 0 with current path [0].",
      "At each node: if current==n-1, add path to results.",
      "For each neighbor: add to path, recurse, pop from path.",
      "Return all collected paths.",
    ],
    cppSolution: `class Solution {
    vector<vector<int>> result;
    void dfs(vector<vector<int>>& graph, int node, vector<int>& path) {
        if (node == (int)graph.size()-1) { result.push_back(path); return; }
        for (int next : graph[node]) {
            path.push_back(next);
            dfs(graph, next, path);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
        vector<int> path = {0};
        dfs(graph, 0, path);
        return result;
    }
};`,
    timeComplexity: "O(2^n × n)",
    timeExplanation: "At most 2^n paths, each of length up to n.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Recursion stack depth n, current path O(n).",
    edgeCases: [
      "No path exists: return empty",
      "Single node: return [[0]]",
      "DAG guaranteed: no cycle check needed",
    ],
    memoryTrick: "Backtracking: push→recurse→pop. Collect when reaching target. DAG means no cycles to worry about.",
    whyItWorks: "DAG guarantees no infinite loops. DFS explores all possible paths naturally. Backtracking ensures the path array correctly tracks the current path at each recursion level.",
    commonMistakes: [
      "Forgetting to pop after recursion — path grows incorrectly",
      "Copying path in every recursive call — O(n) overhead per call, avoidable",
      "Adding visited check — unnecessary for DAG, would miss valid paths",
    ],
    patternConnection: "Backtracking on graph. Similar to: Permutations, Subsets (on arrays). The 'push→recurse→pop' pattern is universal for path enumeration.",
    walkthroughExample: `graph=[[1,2],[3],[3],[]] (n=4):
0→1→3 ✓, 0→2→3 ✓
Result=[[0,1,3],[0,2,3]] ✓`,
    alternativeApproaches: [
      "BFS: store entire path in queue — memory intensive for long paths",
      "DP counting: if you only need count of paths, O(V+E)",
    ],
    proTips: [
      "DAG = no visited set needed — saves O(V) space and code complexity",
      "For general graphs: add visited set but remove on backtrack",
    ],
  },

  "find-path-exists": {
    intuition: "Check if path exists between source and destination in undirected graph. Simple DFS or BFS from source, check if destination is reachable.",
    approach: [
      "Build adjacency list from edges.",
      "DFS/BFS from source. Mark visited.",
      "Return true if destination reached.",
    ],
    cppSolution: `class Solution {
public:
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
        if (source == destination) return true;
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(source); visited[source] = true;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == destination) return true;
            for (int v : adj[u]) if (!visited[v]) { visited[v]=true; q.push(v); }
        }
        return false;
    }
};`,
    timeComplexity: "O(V+E)",
    timeExplanation: "BFS visits each node and edge once.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list + visited + queue.",
    edgeCases: [
      "source==destination: return true immediately",
      "No edges: only true if source==destination",
      "Disconnected graph: BFS won't reach other components",
    ],
    memoryTrick: "Simple BFS from source. Did we reach destination? That's it.",
    whyItWorks: "BFS guarantees we explore all reachable nodes. If destination is in the same connected component as source, BFS will reach it.",
    commonMistakes: [
      "Building directed instead of undirected adjacency list",
      "Not handling source==destination early",
    ],
    patternConnection: "Basic graph traversal. Simpler version of all graph reachability problems. Union-Find alternative: even simpler O(E α(n)).",
    walkthroughExample: `n=3, edges=[[0,1],[1,2]], src=0, dst=2:
BFS: 0→{1}→{2}→found destination ✓`,
    alternativeApproaches: [
      "Union-Find: find(source)==find(destination) — simplest",
      "DFS: equivalent to BFS for this problem",
    ],
    proTips: [
      "Union-Find is cleanest: unite all edges, check if same component",
      "For multiple queries, Union-Find is vastly superior",
    ],
  },

  "evaluate-division": {
    intuition: "Graph of ratios. a/b=2.0 means edge a→b with weight 2.0 and b→a with weight 0.5. Query a/d = product of edge weights along path a→...→d. BFS/DFS to find path and multiply weights.",
    approach: [
      "Build weighted adjacency list (bidirectional, reciprocal weights).",
      "For each query [src, dst]:",
      "  If either not in graph: -1.",
      "  BFS from src, tracking product of weights.",
      "  If dst reached: record product. Else: -1.",
    ],
    cppSolution: `class Solution {
public:
    vector<double> calcEquation(vector<vector<string>>& equations,
                                 vector<double>& values,
                                 vector<vector<string>>& queries) {
        unordered_map<string, vector<pair<string,double>>> adj;
        for (int i = 0; i < (int)equations.size(); i++) {
            adj[equations[i][0]].push_back({equations[i][1], values[i]});
            adj[equations[i][1]].push_back({equations[i][0], 1.0/values[i]});
        }
        vector<double> result;
        for (auto& q : queries) {
            string src=q[0], dst=q[1];
            if (!adj.count(src)||!adj.count(dst)) { result.push_back(-1); continue; }
            if (src==dst) { result.push_back(1); continue; }
            unordered_set<string> visited;
            queue<pair<string,double>> bfs;
            bfs.push({src, 1.0}); visited.insert(src);
            double ans = -1;
            while (!bfs.empty()) {
                auto [node, prod] = bfs.front(); bfs.pop();
                if (node==dst) { ans=prod; break; }
                for (auto& [next,w] : adj[node])
                    if (!visited.count(next)) { visited.insert(next); bfs.push({next,prod*w}); }
            }
            result.push_back(ans);
        }
        return result;
    }
};`,
    timeComplexity: "O((V+E) × Q)",
    timeExplanation: "Q queries, each BFS O(V+E).",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list.",
    edgeCases: [
      "Unknown variable: return -1",
      "Same variable: return 1.0",
      "Disconnected graph: some queries return -1",
    ],
    memoryTrick: "Ratio = edge weight. Path product = chain of divisions. BFS tracks running product.",
    whyItWorks: "Division is multiplicative along paths. If a/b=2 and b/c=3, then a/c=6. BFS finds a path and multiplies weights. Reciprocal edges handle reversed queries.",
    commonMistakes: [
      "Not adding reciprocal edges (b→a with weight 1/values[i])",
      "Not checking if variables exist in graph before BFS",
      "Floating point precision: accept minor deviation",
    ],
    patternConnection: "Weighted graph BFS. Related to: Network Delay Time (Dijkstra), Path With Maximum Probability. The key is recognizing ratios as graph edges.",
    walkthroughExample: `equations=[a/b=2, b/c=3], query a/c:
Graph: a→b(2), b→a(0.5), b→c(3), c→b(1/3)
BFS from a: a(1)→b(2)→c(6). Answer=6 ✓`,
    alternativeApproaches: [
      "Floyd-Warshall: precompute all pairs O(V³) — good if many queries",
      "Union-Find with ratio weights — more complex implementation",
    ],
    proTips: [
      "Floyd-Warshall: precompute dist[i][j] for all pairs — query answering in O(1)",
      "Always handle src==dst→1.0 and unknown→-1 before BFS",
    ],
  },

  "word-ladder": {
    intuition: "Minimum word transformations from beginWord to endWord, changing one letter at a time. BFS shortest path. For each word, try all single-char changes and check if in wordList.",
    approach: [
      "Add beginWord to wordSet, start BFS from beginWord.",
      "For each word in queue: try changing each character to a-z.",
      "If new word is in set: add to queue, remove from set (avoid revisit).",
      "If endWord reached: return current level+1.",
      "If queue empty without finding endWord: return 0.",
    ],
    cppSolution: `class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        if (!wordSet.count(endWord)) return 0;
        queue<string> q;
        q.push(beginWord); wordSet.erase(beginWord);
        int steps = 1;
        while (!q.empty()) {
            int sz = q.size();
            while (sz--) {
                string word = q.front(); q.pop();
                if (word == endWord) return steps;
                for (int i = 0; i < (int)word.size(); i++) {
                    char orig = word[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        word[i] = c;
                        if (wordSet.count(word)) { wordSet.erase(word); q.push(word); }
                    }
                    word[i] = orig;
                }
            }
            steps++;
        }
        return 0;
    }
};`,
    timeComplexity: "O(M² × N)",
    timeExplanation: "N words of length M, each generating M×26 neighbors, each comparison O(M).",
    spaceComplexity: "O(N × M)",
    spaceExplanation: "Queue and word set storage.",
    edgeCases: [
      "endWord not in wordList: return 0",
      "beginWord == endWord: return 1",
      "No transformation exists: return 0",
    ],
    memoryTrick: "BFS level = transformation count. Remove from set on visit to avoid cycles. Try all 26 letters at each position.",
    whyItWorks: "BFS guarantees shortest path (minimum transformations). Removing visited words from set prevents revisiting — crucial for performance and correctness.",
    commonMistakes: [
      "Not removing words from set after visiting — leads to TLE",
      "Not checking if endWord is in wordList first",
      "Using DFS — finds A path but not necessarily shortest",
    ],
    patternConnection: "BFS shortest path on implicit graph. Pattern: vertices = words, edges = single-char difference. Same structure: Sliding Puzzle, Jump Game (reachability).",
    walkthroughExample: `beginWord=hit, endWord=cog, wordList=[hot,dot,dog,lot,log,cog]:
hit→hot(1)→dot,lot(2)→dog,log(3)→cog(4) → return 5 ✓`,
    alternativeApproaches: [
      "Bidirectional BFS: expand from both ends — O(M² × √N) in practice",
      "A* with heuristic: Hamming distance — faster in practice but complex",
    ],
    proTips: [
      "Bidirectional BFS: cut search space dramatically. Swap queues, always expand smaller frontier",
      "Erase from set immediately after adding to queue (not after processing) to prevent duplicates",
    ],
  },

  "alien-dictionary": {
    intuition: "Deduce character ordering from sorted word list. Compare adjacent words: first differing characters give an ordering constraint (edge). Topological sort gives the order. Check for cycles (invalid input).",
    approach: [
      "Compare each adjacent pair of words, find first differing char: add edge prev_char→curr_char.",
      "Special case: if word1 is prefix of word2 but longer: invalid ('abc' before 'ab' violates sort).",
      "Topological sort (DFS or Kahn's) on the character graph.",
      "If cycle detected: return empty string.",
    ],
    cppSolution: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char,set<char>> adj;
        unordered_map<char,int> inDeg;
        for (auto& w : words) for (char c : w) if (!inDeg.count(c)) inDeg[c]=0;
        for (int i = 0; i+1 < (int)words.size(); i++) {
            string& a=words[i], &b=words[i+1];
            int len=min(a.size(),b.size());
            bool found=false;
            for (int j = 0; j < (int)len; j++)
                if (a[j]!=b[j]) { if(!adj[a[j]].count(b[j])){adj[a[j]].insert(b[j]);inDeg[b[j]]++;} found=true; break; }
            if (!found && a.size()>b.size()) return "";
        }
        queue<char> q;
        for (auto& [c,d] : inDeg) if (d==0) q.push(c);
        string result;
        while (!q.empty()) {
            char c=q.front(); q.pop(); result+=c;
            for (char next : adj[c]) if (--inDeg[next]==0) q.push(next);
        }
        return result.size()==inDeg.size() ? result : "";
    }
};`,
    timeComplexity: "O(C)",
    timeExplanation: "C = total characters across all words. Topological sort O(V+E) where V≤26.",
    spaceComplexity: "O(1)",
    spaceExplanation: "At most 26 characters — O(1) for the graph.",
    edgeCases: [
      "Single word: return all unique chars (any order)",
      "Cycle in constraints: return empty string",
      "Longer word before shorter prefix: invalid → empty string",
    ],
    memoryTrick: "Adjacent words → edges between first differing chars → topological sort. Cycle = invalid.",
    whyItWorks: "Each pair of adjacent sorted words encodes at most one ordering constraint. Collecting all constraints and topological sorting gives the alien alphabet. Cycle = contradiction in ordering.",
    commonMistakes: [
      "Not handling prefix case (abc before ab is invalid)",
      "Adding duplicate edges — use set for adjacency or track added edges",
      "Forgetting to initialize all unique characters in inDeg map",
    ],
    patternConnection: "Topological sort on derived graph. Classic application of Course Schedule pattern to string problems. Key skill: extracting graph edges from problem constraints.",
    walkthroughExample: `words=["wrt","wrf","er","ett","rftt"]:
wrt vs wrf: t→f
wrf vs er: w→e
er vs ett: r→t
ett vs rftt: e→r
Graph: t→f, w→e, r→t, e→r
Topo sort: w,e,r,t,f ✓`,
    alternativeApproaches: [
      "DFS topological sort: same complexity, slightly different implementation",
    ],
    proTips: [
      "Kahn's BFS is easier to implement correctly for topological sort",
      "Always check result length == unique char count — mismatch = cycle",
    ],
  },

  "network-delay-time": {
    intuition: "Shortest time for signal to reach all nodes from source k. Dijkstra's algorithm: find shortest path from k to all nodes. Answer = max of all shortest paths. If any node unreachable: return -1.",
    approach: [
      "Build weighted adjacency list.",
      "Dijkstra from k: min-heap (dist, node), process in order.",
      "dist array initialized to infinity, dist[k]=0.",
      "Process: for each neighbor, relax edge. Push to heap if shorter.",
      "Return max(dist) if all finite, else -1.",
    ],
    cppSolution: `class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int,int>>> adj(n+1);
        for (auto& t : times) adj[t[0]].push_back({t[1],t[2]});
        vector<int> dist(n+1, INT_MAX);
        dist[k] = 0;
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
        pq.push({0, k});
        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (d > dist[u]) continue;
            for (auto& [v, w] : adj[u])
                if (dist[u]+w < dist[v]) { dist[v]=dist[u]+w; pq.push({dist[v],v}); }
        }
        int ans = *max_element(dist.begin()+1, dist.end());
        return ans == INT_MAX ? -1 : ans;
    }
};`,
    timeComplexity: "O((V+E) log V)",
    timeExplanation: "Dijkstra with binary heap.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list + dist array + heap.",
    edgeCases: [
      "k not connected to all nodes: return -1",
      "Single node: return 0",
      "Negative weights: Dijkstra invalid — use Bellman-Ford",
    ],
    memoryTrick: "Dijkstra = greedy shortest path. Min-heap processes nearest node first. After processing all: max dist = signal delay.",
    whyItWorks: "Dijkstra's greedy choice: always process the currently closest unvisited node. This guarantees shortest paths for non-negative weights. Max of all shortest paths = time for last node to receive signal.",
    commonMistakes: [
      "Not skipping stale heap entries (d > dist[u] check)",
      "1-indexed nodes: dist array size n+1",
      "Forgetting -1 for unreachable nodes",
    ],
    patternConnection: "Dijkstra's algorithm. Same structure: Path With Maximum Probability (maximize), Cheapest Flights (k stops = constraint). Dijkstra = single-source shortest path for non-negative weights.",
    walkthroughExample: `n=4, k=2, times=[[2,1,1],[2,3,1],[3,4,1]]:
From 2: dist[1]=1, dist[3]=1, dist[4]=2
max(dist[1..4])=max(1,0,1,2)=2 ✓`,
    alternativeApproaches: [
      "Bellman-Ford: O(VE) — handles negative weights",
      "Floyd-Warshall: O(V³) — all pairs, overkill for single source",
    ],
    proTips: [
      "Always skip stale heap entries: if d > dist[u], continue",
      "Min-heap tuple: (distance, node) — Python/C++ handle comparison correctly",
    ],
  },

  "reconstruct-itinerary": {
    intuition: "Find Eulerian path in directed graph (use each ticket once). Hierholzer's algorithm: DFS, whenever stuck (no unvisited edges from current node), prepend to result. Start from JFK.",
    approach: [
      "Build adjacency list sorted lexicographically (priority_queue or sorted list).",
      "DFS from JFK: while current node has outgoing edges, follow smallest lexicographic edge.",
      "When no more edges from current node: push to result (prepend).",
      "Return reversed result.",
    ],
    cppSolution: `class Solution {
public:
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        unordered_map<string, priority_queue<string, vector<string>, greater<>>> adj;
        for (auto& t : tickets) adj[t[0]].push(t[1]);
        vector<string> result;
        stack<string> stk;
        stk.push("JFK");
        while (!stk.empty()) {
            string curr = stk.top();
            if (adj[curr].empty()) {
                result.push_back(curr);
                stk.pop();
            } else {
                stk.push(adj[curr].top());
                adj[curr].pop();
            }
        }
        reverse(result.begin(), result.end());
        return result;
    }
};`,
    timeComplexity: "O(E log E)",
    timeExplanation: "E edges, each pushed/popped from priority queue in O(log E).",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency lists + stack + result.",
    edgeCases: [
      "Single ticket: result is [from, to]",
      "All airports connect linearly: straightforward path",
      "Guaranteed Eulerian path exists (per problem statement)",
    ],
    memoryTrick: "Hierholzer: follow edges greedily (smallest lex first), push to result only when stuck. Reverse at end.",
    whyItWorks: "Hierholzer's algorithm finds Eulerian paths. When we hit a dead end, that node must be the end of the path (or a sub-circuit end). Prepending ensures correct ordering — deeper dead-ends go to the tail of the route.",
    commonMistakes: [
      "Using min-heap (ascending) not max-heap — we want lexicographic smallest: use greater<string>",
      "DFS recursive version: can stack overflow on large inputs — iterative with explicit stack is safer",
      "Appending (not prepending) and then reversing — or just reverse at end",
    ],
    patternConnection: "Eulerian path — Hierholzer's algorithm. Advanced graph pattern. Related to: Chinese Postman Problem, De Bruijn sequences. Recognizing it requires knowing graph Euler path theory.",
    walkthroughExample: `tickets=[JFK→SFO, JFK→ATL, SFO→ATL, ATL→JFK, ATL→SFO]:
DFS: JFK→ATL→JFK→SFO→ATL→SFO (stuck) → add SFO
Back: ATL (stuck) → add ATL; SFO (stuck) → add SFO; JFK (stuck)...
Reversed: JFK,ATL,JFK,SFO,ATL,SFO ✓`,
    alternativeApproaches: [
      "DFS recursive: cleaner but risks stack overflow",
      "Sorting adjacency lists: sort once, use index instead of priority queue",
    ],
    proTips: [
      "Priority queue (min-heap with greater<>) auto-sorts lexicographically",
      "Iterative stack simulation avoids recursion depth issues",
    ],
  },

  "redundant-connection": {
    intuition: "Find the last edge that creates a cycle in an undirected graph that would be a tree without it. Union-Find: process edges in order. First edge where both endpoints are already connected = the redundant edge.",
    approach: [
      "Initialize Union-Find with n+1 nodes.",
      "For each edge [u,v] in order: if find(u)==find(v): return this edge (creates cycle). Else: unite.",
      "Return empty (shouldn't happen per constraints).",
    ],
    cppSolution: `class Solution {
    vector<int> parent, rank_;
    int find(int x) { return parent[x]==x?x:parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x);y=find(y);
        if(x==y)return false;
        if(rank_[x]<rank_[y])swap(x,y);
        parent[y]=x;if(rank_[x]==rank_[y])rank_[x]++;
        return true;
    }
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n=edges.size();
        parent.resize(n+1);rank_.resize(n+1,0);
        iota(parent.begin(),parent.end(),0);
        for(auto& e:edges)
            if(!unite(e[0],e[1]))return e;
        return {};
    }
};`,
    timeComplexity: "O(E α(n))",
    timeExplanation: "E union-find operations, nearly O(1) each.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Parent and rank arrays.",
    edgeCases: [
      "Last edge is always redundant if exactly one cycle",
      "1-indexed nodes: parent array size n+1",
    ],
    memoryTrick: "Process edges in order. First edge connecting already-connected nodes = cycle edge. Return immediately.",
    whyItWorks: "Any edge connecting two already-connected nodes creates a cycle. Since we process edges in order and problem guarantees one redundant edge, the first such edge is the answer (it's the last one we'd want to remove to keep the tree).",
    commonMistakes: [
      "Returning last edge vs first cycle-creating edge — return the cycle-creating edge",
      "0-indexed vs 1-indexed nodes — edges are 1-indexed in this problem",
    ],
    patternConnection: "Union-Find cycle detection. Same as Graph Valid Tree but returns the edge. Redundant Connection II (directed graph) is much harder.",
    walkthroughExample: `edges=[[1,2],[1,3],[2,3]]:
Unite 1-2: ok. Unite 1-3: ok. Unite 2-3: find(2)=1, find(3)=1 → cycle → return [2,3] ✓`,
    alternativeApproaches: [
      "DFS: for each edge, check if path exists without it — O(VE) much slower",
    ],
    proTips: [
      "Union-Find with path compression + union by rank: O(α(n)) ≈ O(1) per operation",
      "Redundant Connection II (directed): need 2 parent approach — significantly harder",
    ],
  },

  "min-cost-connect-points": {
    intuition: "Connect all points with minimum total Manhattan distance. Minimum Spanning Tree (MST) problem. Prim's algorithm: greedily add nearest unvisited point. Or Kruskal's: sort all edges, add if not cycle.",
    approach: [
      "Prim's: dist[] = min distance to add each node to MST. Start with point 0.",
      "Repeat n-1 times: pick unvisited node with min dist, mark visited, update neighbors.",
      "Total cost = sum of all selected min dists.",
    ],
    cppSolution: `class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int n = points.size();
        vector<int> dist(n, INT_MAX);
        vector<bool> inMST(n, false);
        dist[0] = 0;
        int total = 0;
        for (int iter = 0; iter < n; iter++) {
            int u = -1;
            for (int i = 0; i < n; i++)
                if (!inMST[i] && (u==-1||dist[i]<dist[u])) u=i;
            inMST[u] = true;
            total += dist[u];
            for (int v = 0; v < n; v++)
                if (!inMST[v]) {
                    int d=abs(points[u][0]-points[v][0])+abs(points[u][1]-points[v][1]);
                    dist[v]=min(dist[v],d);
                }
        }
        return total;
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Dense graph: Prim's with adjacency matrix is O(n²). Heap version O(n² log n) since there are O(n²) edges.",
    spaceComplexity: "O(n)",
    spaceExplanation: "dist and inMST arrays.",
    edgeCases: [
      "Single point: return 0",
      "Two points: return their Manhattan distance",
    ],
    memoryTrick: "Prim's = Dijkstra but for MST. Pick min-dist unvisited, add to tree, update neighbors. Dense graph → O(n²) Prim's is optimal.",
    whyItWorks: "MST connects all points with minimum total edge weight. Prim's greedy choice (always pick cheapest edge to grow the tree) is provably optimal via cut property.",
    commonMistakes: [
      "Using Kruskal's: O(n² log n) due to sorting all O(n²) edges — worse for dense graphs",
      "Not adding dist[u] to total (forgot the starting node cost)",
    ],
    patternConnection: "MST with Prim's. Same pattern: Swim in Rising Water (binary search on max edge), Cheapest Flights (constrained MST). Dense graph → Prim's O(n²) beats Kruskal's.",
    walkthroughExample: `points=[[0,0],[2,2],[3,10],[5,2],[7,0]]:
Start at 0: distances to all others.
Greedily pick nearest: 0→[5,2](7)→[2,2](3)→[7,0](5)→[3,10](15)
Total=7+3+5+15=30 ✓`,
    alternativeApproaches: [
      "Kruskal's: generate all n(n-1)/2 edges, sort, union-find — O(n² log n)",
      "Heap-based Prim's: O(n² log n) for complete graph",
    ],
    proTips: [
      "Dense graph (all pairs connected): O(n²) Prim's without heap is optimal",
      "Sparse graph: heap-based Prim's or Kruskal's with sorted edges",
    ],
  },

  "swim-rising-water": {
    intuition: "Find path from (0,0) to (n-1,n-1) minimizing the maximum cell value on path. Binary search on the answer + BFS/DFS to check feasibility, or Dijkstra treating each cell's value as 'time to pass through'.",
    approach: [
      "Dijkstra: min-heap of (max_val_so_far, row, col). Start with (grid[0][0], 0, 0).",
      "For each neighbor: new_max = max(current_max, grid[nr][nc]). Push to heap.",
      "When (n-1,n-1) reached: return current max.",
    ],
    cppSolution: `class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<vector<int>> dist(n, vector<int>(n, INT_MAX));
        priority_queue<tuple<int,int,int>,vector<tuple<int,int,int>>,greater<>> pq;
        pq.push({grid[0][0],0,0}); dist[0][0]=grid[0][0];
        int dx[]={0,0,1,-1},dy[]={1,-1,0,0};
        while (!pq.empty()) {
            auto [d,x,y]=pq.top(); pq.pop();
            if (x==n-1&&y==n-1) return d;
            for (int i=0;i<4;i++) {
                int nx=x+dx[i],ny=y+dy[i];
                if (nx>=0&&nx<n&&ny>=0&&ny<n) {
                    int nd=max(d,grid[nx][ny]);
                    if (nd<dist[nx][ny]) { dist[nx][ny]=nd; pq.push({nd,nx,ny}); }
                }
            }
        }
        return -1;
    }
};`,
    timeComplexity: "O(n² log n)",
    timeExplanation: "n² cells, each pushed to heap once with O(log n²) = O(log n) cost.",
    spaceComplexity: "O(n²)",
    spaceExplanation: "dist grid + heap.",
    edgeCases: [
      "n=1: return grid[0][0]",
      "Already passable at time 0: rare",
    ],
    memoryTrick: "Dijkstra where 'distance' = max cell value on path. Min-heap minimizes the bottleneck.",
    whyItWorks: "We want minimax path. Dijkstra with cost=max(path) instead of sum(path) correctly finds the path where the maximum cell value is minimized. The greedy choice holds because max is monotonically non-decreasing.",
    commonMistakes: [
      "Using BFS (not Dijkstra) — BFS doesn't handle min-max correctly",
      "Summing instead of max-ing values",
    ],
    patternConnection: "Dijkstra variant for min-max path. Also: Path With Maximum Probability (max product), Cheapest Flights (sum with constraints). Alternative: binary search on answer + BFS feasibility check.",
    walkthroughExample: `grid=[[0,2],[1,3]]:
Start(0): push(0,0,0)
Process(0): neighbors: (2,0,1)→push, (1,1,0)→push
Process(1): at (1,0): neighbor (3,1,1)→push
Process(2): at (0,1): neighbor max(2,3)=3,(1,1)→push(3)
Process(3): (1,1) reached → return 3 ✓`,
    alternativeApproaches: [
      "Binary search + BFS: O(n² log n) — binary search on time t, BFS to check if can reach end using only cells ≤ t",
      "Union-Find: incrementally add cells by value, check when 0,0 and n-1,n-1 connect",
    ],
    proTips: [
      "Binary search approach: easier to think about but same complexity",
      "Dijkstra approach is cleaner code for this specific problem",
    ],
  },

  "path-max-probability": {
    intuition: "Find path from start to end maximizing probability (product of edge probabilities). Dijkstra but with max-product instead of min-sum. Use max-heap, relax if new probability is higher.",
    approach: [
      "Build adjacency list with bidirectional probability edges.",
      "Max-heap: (probability, node). Start with (1.0, start).",
      "prob array = -INF, prob[start] = 1.0.",
      "For each neighbor: new_prob = current_prob * edge_weight. Relax if better.",
      "Return prob[end] after processing (or 0 if unreachable).",
    ],
    cppSolution: `class Solution {
public:
    double maxProbability(int n, vector<vector<int>>& edges,
                          vector<double>& succProb, int start, int end) {
        vector<vector<pair<int,double>>> adj(n);
        for (int i = 0; i < (int)edges.size(); i++) {
            adj[edges[i][0]].push_back({edges[i][1],succProb[i]});
            adj[edges[i][1]].push_back({edges[i][0],succProb[i]});
        }
        vector<double> prob(n, 0);
        prob[start] = 1.0;
        priority_queue<pair<double,int>> pq;
        pq.push({1.0, start});
        while (!pq.empty()) {
            auto [p, u] = pq.top(); pq.pop();
            if (p < prob[u]) continue;
            for (auto& [v, w] : adj[u])
                if (prob[u]*w > prob[v]) { prob[v]=prob[u]*w; pq.push({prob[v],v}); }
        }
        return prob[end];
    }
};`,
    timeComplexity: "O((V+E) log V)",
    timeExplanation: "Dijkstra with max-heap.",
    spaceComplexity: "O(V+E)",
    spaceExplanation: "Adjacency list + prob array + heap.",
    edgeCases: [
      "No path to end: return 0",
      "start==end: return 1.0",
      "Single edge: return its probability if connects start to end",
    ],
    memoryTrick: "Dijkstra but MAX probability instead of MIN distance. Max-heap. Multiply probabilities instead of adding.",
    whyItWorks: "Probabilities multiply along a path. Maximizing product is analogous to minimizing sum of negative logs. Standard Dijkstra with max-heap and multiplication relaxation.",
    commonMistakes: [
      "Using min-heap instead of max-heap for maximum probability",
      "Forgetting bidirectional edges",
      "Using sum instead of product for probabilities",
    ],
    patternConnection: "Dijkstra generalization. Same structure as Network Delay Time (min sum) and Swim in Rising Water (min max). Shows Dijkstra works for any monotone combination function.",
    walkthroughExample: `edges=[[0,1],[1,2],[0,2]], probs=[0.5,0.5,0.2], start=0, end=2:
0→1→2: 0.5*0.5=0.25; 0→2: 0.2
max=0.25 ✓`,
    alternativeApproaches: [
      "Bellman-Ford variant: O(VE) — handles more complex constraints",
      "DFS + memo: top-down, but harder to prove optimality",
    ],
    proTips: [
      "Negative log transform: -log(prob) makes it minimum sum — standard Dijkstra applies",
      "Stale entry skip: if p < prob[u], continue — same as standard Dijkstra",
    ],
  },

  "cheapest-flights": {
    intuition: "Find cheapest flight from src to dst with at most k stops. Bellman-Ford with k+1 iterations. Or modified Dijkstra with state (node, stops_remaining). DP: dp[stops][node] = min cost.",
    approach: [
      "Bellman-Ford: dp[k+1][n] where dp[i][v] = min cost to reach v in exactly i flights.",
      "Init dp[0][src]=0, all else INF.",
      "For i from 1 to k+1: for each edge (u,v,w): dp[i][v]=min(dp[i][v], dp[i-1][u]+w).",
      "Return dp[k+1][dst] (min over 1..k+1 actually use row approach).",
    ],
    cppSolution: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights,
                          int src, int dst, int k) {
        vector<int> prices(n, INT_MAX);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {
            vector<int> temp = prices;
            for (auto& f : flights) {
                if (prices[f[0]] != INT_MAX && prices[f[0]]+f[2] < temp[f[1]])
                    temp[f[1]] = prices[f[0]] + f[2];
            }
            prices = temp;
        }
        return prices[dst] == INT_MAX ? -1 : prices[dst];
    }
};`,
    timeComplexity: "O(k × E)",
    timeExplanation: "k+1 Bellman-Ford relaxation rounds, each O(E).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Price array (two copies for temp).",
    edgeCases: [
      "k=0: can only fly direct src→dst",
      "No path within k stops: return -1",
      "src==dst: return 0 (but usually not in constraints)",
    ],
    memoryTrick: "Bellman-Ford k+1 iterations = at most k stops = k+1 flights. Use temp copy each round to avoid using same-round updates.",
    whyItWorks: "After i Bellman-Ford rounds, prices[v] = min cost to reach v in at most i flights (stops = flights-1). Using a temp copy ensures each round only uses the previous round's values.",
    commonMistakes: [
      "Not using temp copy — allows 'multi-hop' in a single round",
      "k stops = k+1 flights: loop k+1 times, not k",
      "INT_MAX + w overflow: check != INT_MAX before adding",
    ],
    patternConnection: "Bellman-Ford with constraint. Related to Network Delay Time (unrestricted BF) and Cheapest Flights variant patterns. The 'at most k edges' constraint is naturally handled by limiting BF rounds.",
    walkthroughExample: `n=4,flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],src=0,dst=3,k=1:
Round 0: prices=[0,100,INF,INF]
Round 1: from 0→1(100 stay 100),from 1→3(100+600=700)
prices[3]=700 ✓`,
    alternativeApproaches: [
      "Dijkstra with state (cost, node, stops): push (cost, node, remaining_stops)",
      "DFS + memo: dp[node][stops] = min cost",
    ],
    proTips: [
      "Always use a temp copy each round — critical for correctness",
      "Dijkstra with stops: heap entry = (cost, node, stops_used), prune if stops_used > k",
    ],
  },

  "implement-trie": {
    intuition: "Trie (prefix tree): each node represents a character. 26 children (for lowercase). isEnd marks complete words. Insert: create nodes along path. Search: traverse, check isEnd. StartsWith: traverse, return true if path exists.",
    approach: [
      "TrieNode: children[26], isEnd=false.",
      "Insert: for each char, create child if missing, advance. Mark isEnd at last char.",
      "Search: traverse path. Return isEnd of last node.",
      "StartsWith: traverse path. Return true if reached end of prefix.",
    ],
    cppSolution: `class Trie {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root;
public:
    Trie() { root=new Node(); }
    void insert(string word) {
        Node* cur=root;
        for(char c:word){if(!cur->ch[c-'a'])cur->ch[c-'a']=new Node();cur=cur->ch[c-'a'];}
        cur->end=true;
    }
    bool search(string word) {
        Node* cur=root;
        for(char c:word){if(!cur->ch[c-'a'])return false;cur=cur->ch[c-'a'];}
        return cur->end;
    }
    bool startsWith(string prefix) {
        Node* cur=root;
        for(char c:prefix){if(!cur->ch[c-'a'])return false;cur=cur->ch[c-'a'];}
        return true;
    }
};`,
    timeComplexity: "O(L) per operation",
    timeExplanation: "L = length of word/prefix. Each op traverses one char per step.",
    spaceComplexity: "O(N × L × 26)",
    spaceExplanation: "N words, each of length L, each node has 26 children pointers.",
    edgeCases: [
      "Empty string insert/search: edge case depending on implementation",
      "Prefix is the word: startsWith and search may both return true",
      "Word not in trie: search returns false even if prefix exists",
    ],
    memoryTrick: "Tree of characters. Each level = one character position. isEnd = 'word ends here'. Traverse character by character.",
    whyItWorks: "Sharing common prefixes reduces space vs storing all words separately. Each unique prefix path is shared. O(L) operations regardless of number of words stored.",
    commonMistakes: [
      "Confusing startsWith and search: search checks isEnd, startsWith doesn't",
      "Forgetting to mark isEnd at insert completion",
      "Using array[26] vs unordered_map — array faster, map more flexible for unicode",
    ],
    patternConnection: "Foundation data structure for: Add and Search Words (DFS with wildcards), Replace Words (prefix replacement), Word Search II (Trie + DFS). Memorize the standard TrieNode structure.",
    walkthroughExample: `insert("apple"):
root→a→p→p→l→e(isEnd=true)
search("apple")→true, search("app")→false, startsWith("app")→true ✓`,
    alternativeApproaches: [
      "Hash set: O(1) search but no prefix operations",
      "Sorted array + binary search: prefix queries O(log n + prefix_count)",
    ],
    proTips: [
      "Use array[26] for lowercase letters — faster than unordered_map",
      "For deletion: track word count per node or mark isEnd=false",
    ],
  },

  "add-search-words": {
    intuition: "Trie with wildcard search. '.' can match any character. Search: DFS through trie, at '.' try all 26 children. Regular chars: standard trie traversal.",
    approach: [
      "Use standard Trie for addWord.",
      "search: DFS from root, current word index.",
      "At each node: if word[idx]=='.', recurse on all non-null children.",
      "Else: standard trie step on word[idx].",
      "Return true if any path reaches isEnd at word end.",
    ],
    cppSolution: `class WordDictionary {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root;
    bool dfs(Node* node, string& word, int i) {
        if (!node) return false;
        if (i == (int)word.size()) return node->end;
        if (word[i] == '.') {
            for (auto c : node->ch) if (dfs(c, word, i+1)) return true;
            return false;
        }
        return dfs(node->ch[word[i]-'a'], word, i+1);
    }
public:
    WordDictionary() { root=new Node(); }
    void addWord(string word) {
        Node* cur=root;
        for(char c:word){if(!cur->ch[c-'a'])cur->ch[c-'a']=new Node();cur=cur->ch[c-'a'];}
        cur->end=true;
    }
    bool search(string word) { return dfs(root,word,0); }
};`,
    timeComplexity: "O(M × 26^M) worst case",
    timeExplanation: "All '.' pattern: tries 26 branches at each level. Practical complexity much lower for typical inputs.",
    spaceComplexity: "O(N × L)",
    spaceExplanation: "Trie storing all added words.",
    edgeCases: [
      "Search with all dots: tries all paths",
      "Word with '.' at end: must check isEnd",
      "Empty word: depends on if empty word was added",
    ],
    memoryTrick: "Trie + DFS for '.' wildcards. Standard character: trie step. Dot: fork into all 26 children.",
    whyItWorks: "'.' is non-deterministic — must try all options. DFS with backtracking explores all possibilities. Standard trie for fixed chars, branching DFS for wildcards.",
    commonMistakes: [
      "Not returning false when branching on '.': must return false if ALL children fail",
      "Checking null node after recursion: check null before recursing",
    ],
    patternConnection: "Trie + DFS. Extends Implement Trie. Same DFS-on-trie pattern in Word Search II (Trie + matrix DFS). '.' wildcard = 'try all children'.",
    walkthroughExample: `addWord("bad"), addWord("dad"), addWord("mad"):
search(".ad")→DFS, try 'b','d','m'...→true ✓
search("b..")→b→any→any→isEnd?→true ✓`,
    alternativeApproaches: [
      "Regex: compile pattern, match — complex and likely slower",
      "Hash map by length: for each '.' pattern, try all words of same length",
    ],
    proTips: [
      "Short-circuit: return true immediately when any branch succeeds",
      "If pattern has few dots, prune heavily — mostly O(L) per search",
    ],
  },

  "word-search-ii": {
    intuition: "Find all words from list that exist in board. Build Trie from word list, then DFS on board. At each cell, traverse trie simultaneously. When trie node marks word end: record it. Prune when no trie path exists.",
    approach: [
      "Build trie from all words.",
      "DFS on each board cell, track trie node pointer.",
      "In DFS: mark cell visited (temporarily '#'), advance trie pointer.",
      "If trie node marks word end: add to result, clear end marker (avoid duplicates).",
      "Recurse in 4 directions. Restore cell after.",
    ],
    cppSolution: `class Solution {
    struct Node { Node* ch[26]={}; string* word=nullptr; };
    Node* root=new Node();
    vector<string> result;
    void dfs(vector<vector<char>>& board, Node* node, int r, int c) {
        char ch=board[r][c];
        if(ch=='#'||!node->ch[ch-'a'])return;
        Node* next=node->ch[ch-'a'];
        if(next->word){result.push_back(*next->word);next->word=nullptr;}
        board[r][c]='#';
        int m=board.size(),n=board[0].size();
        if(r>0)dfs(board,next,r-1,c);if(r<m-1)dfs(board,next,r+1,c);
        if(c>0)dfs(board,next,r,c-1);if(c<n-1)dfs(board,next,r,c+1);
        board[r][c]=ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        for(auto& w:words){Node* cur=root;for(char c:w){if(!cur->ch[c-'a'])cur->ch[c-'a']=new Node();cur=cur->ch[c-'a'];}cur->word=&w;}
        int m=board.size(),n=board[0].size();
        for(int i=0;i<m;i++)for(int j=0;j<n;j++)dfs(board,root,i,j);
        return result;
    }
};`,
    timeComplexity: "O(M × N × 4 × 3^(L-1))",
    timeExplanation: "M×N cells, DFS expands up to 3 directions (not back) for L steps.",
    spaceComplexity: "O(W × L)",
    spaceExplanation: "Trie of W words each of length L.",
    edgeCases: [
      "Word not in board: not added to result",
      "Duplicate words in list: using word pointer and clearing avoids duplicates",
      "Word used same cell twice: '#' marking prevents this",
    ],
    memoryTrick: "Trie prunes search early. DFS on board traces paths. Word found when trie says 'word ends here'. Mark visited to avoid reuse.",
    whyItWorks: "Trie allows O(L) simultaneous matching for all words as we DFS the board. Without trie, we'd DFS for each word separately. The board DFS explores paths; trie eliminates dead-end paths instantly.",
    commonMistakes: [
      "Not clearing word pointer after finding: leads to duplicate results",
      "Not restoring board cell after DFS: '#' remains, corrupts subsequent searches",
      "Starting DFS from every cell vs starting from first char only — every cell needed",
    ],
    patternConnection: "Trie + DFS backtracking. The ultimate combination of Implement Trie, Word Search I, and backtracking. The trie makes it feasible for large word lists.",
    walkthroughExample: `board=[['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']]
words=["oath","pea","eat","rain"]:
DFS from each cell, trie guides. "oath" and "eat" found ✓`,
    alternativeApproaches: [
      "Without trie: for each word, run Word Search I — O(W×M×N×4×3^L) much slower",
    ],
    proTips: [
      "Prune trie: remove leaf nodes when no more words to find — reduces future DFS",
      "Store word directly in trie node (not in separate list) for O(1) word retrieval",
    ],
  },

  "replace-words": {
    intuition: "Replace words in sentence with their shortest root from dictionary. Build Trie from dictionary roots. For each word in sentence: traverse trie, stop at first complete root (isEnd=true). Replace with that root.",
    approach: [
      "Build trie from all roots.",
      "For each word in sentence: traverse trie char by char.",
      "If trie node isEnd: stop, use prefix so far.",
      "If word ends without finding root: use full word.",
      "Join results.",
    ],
    cppSolution: `class Solution {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root=new Node();
    string replaceWord(string& word) {
        Node* cur=root; string prefix;
        for (char c : word) {
            if (!cur->ch[c-'a']) break;
            cur=cur->ch[c-'a']; prefix+=c;
            if (cur->end) return prefix;
        }
        return word;
    }
public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        for (auto& r:dictionary){Node* cur=root;for(char c:r){if(!cur->ch[c-'a'])cur->ch[c-'a']=new Node();cur=cur->ch[c-'a'];}cur->end=true;}
        istringstream iss(sentence); string word, result;
        while (iss>>word) {if(!result.empty())result+=' ';result+=replaceWord(word);}
        return result;
    }
};`,
    timeComplexity: "O(D×L + S)",
    timeExplanation: "D roots of average length L for trie build. S = total sentence length for lookup.",
    spaceComplexity: "O(D×L)",
    spaceExplanation: "Trie storing all roots.",
    edgeCases: [
      "Root longer than word: word unchanged",
      "Multiple roots match: use shortest (trie naturally stops at first isEnd)",
      "No matching root: use original word",
    ],
    memoryTrick: "Trie stops at first complete root. Shortest root wins automatically — trie processes character by character and stops at first isEnd.",
    whyItWorks: "Trie traversal stops at first complete word (isEnd=true). Since we traverse character by character from shortest prefix up, the first isEnd we hit is the shortest matching root.",
    commonMistakes: [
      "Not stopping at first isEnd: would continue to longer roots",
      "Building trie from sentence words instead of dictionary",
    ],
    patternConnection: "Trie prefix lookup. Classic trie application. Same 'stop at first complete word' pattern used in word completion/autocomplete.",
    walkthroughExample: `dict=["cat","bat","rat"], sentence="the cattle was rattled by the battery":
cattle→cat(root found!) → "cat"
rattled→rat(root found!) → "rat"
battery→bat(root found!) → "bat"
Result: "the cat was rat by the bat" ✓`,
    alternativeApproaches: [
      "Hash set + sort: sort roots by length, for each word check all prefixes",
      "Brute force: for each word, check all roots — O(D×S) much slower",
    ],
    proTips: [
      "Trie naturally handles shortest root — no need to sort dictionary",
      "Parse sentence with istringstream or split on spaces",
    ],
  },

  "longest-word-dictionary": {
    intuition: "Find longest word in dictionary that can be built one letter at a time. Sort words by length, use set. For each word: if all prefixes are in set, it's buildable. Track longest.",
    approach: [
      "Sort words by length (ascending), then lexicographically.",
      "Add empty string to set.",
      "For each word: if word[0..n-2] in set, add word to set, update longest.",
      "Return longest.",
    ],
    cppSolution: `class Solution {
public:
    string longestWord(vector<string>& words) {
        sort(words.begin(), words.end(), [](auto& a, auto& b){
            return a.size()!=b.size() ? a.size()<b.size() : a<b;
        });
        unordered_set<string> built = {""};
        string result;
        for (auto& w : words) {
            if (built.count(w.substr(0, w.size()-1))) {
                built.insert(w);
                if (w.size() > result.size()) result = w;
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(N×L log N)",
    timeExplanation: "Sort O(NL log N), then O(NL) for set operations.",
    spaceComplexity: "O(N×L)",
    spaceExplanation: "Set stores all buildable words.",
    edgeCases: [
      "No buildable word: return empty string",
      "Multiple same-length buildable words: return lexicographically smallest",
    ],
    memoryTrick: "Buildable = all prefixes in dictionary. Sort by length, check one-shorter prefix in set.",
    whyItWorks: "A word is buildable if its n-1 length prefix is buildable. By processing in length order, when we check prefix, it's already been processed and verified if buildable.",
    commonMistakes: [
      "Not starting set with empty string — single character words have empty prefix",
      "Not returning lexicographically smallest among same-length results — sort handles this",
    ],
    patternConnection: "Trie or DP on sorted words. Related to Word Break (can build string from pieces).",
    walkthroughExample: `words=["a","banana","app","appl","ap","apply","apple"]:
sort by length: a,ap,app,appl,apple,apply,banana
a: prefix ""∈set → built; ap: prefix "a"∈set → built; ... apple: built
apple and apply both length 5: apple < apply → result="apple" ✓`,
    alternativeApproaches: [
      "Trie: build trie, DFS finding longest path where all nodes are word endings",
    ],
    proTips: [
      "Sort lexicographically first, then by length — ensures smallest word wins ties naturally",
      "Trie DFS approach is cleaner and avoids substr creation",
    ],
  },

  "index-pairs-string": {
    intuition: "Find all start/end index pairs where words from list appear in text. Build Trie from words. For each starting position in text, traverse trie — record end indices when word found.",
    approach: [
      "Build trie from all words.",
      "For each starting index i in text:",
      "  Traverse trie character by character from text[i].",
      "  If node marks word end: record [i, j] pair.",
      "  If no trie child: break.",
      "Sort and return all pairs.",
    ],
    cppSolution: `class Solution {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root=new Node();
public:
    vector<vector<int>> indexPairs(string text, vector<string>& words) {
        for (auto& w:words){Node* cur=root;for(char c:w){if(!cur->ch[c-'a'])cur->ch[c-'a']=new Node();cur=cur->ch[c-'a'];}cur->end=true;}
        vector<vector<int>> result;
        for (int i=0;i<(int)text.size();i++) {
            Node* cur=root;
            for (int j=i;j<(int)text.size();j++) {
                cur=cur->ch[text[j]-'a'];
                if(!cur)break;
                if(cur->end)result.push_back({i,j});
            }
        }
        return result;
    }
};`,
    timeComplexity: "O(W×L + T²)",
    timeExplanation: "W words of length L to build trie. T² for scanning all start positions.",
    spaceComplexity: "O(W×L)",
    spaceExplanation: "Trie of all words.",
    edgeCases: [
      "Overlapping words: both pairs reported",
      "Word longer than text: not found",
      "Same word multiple times: all occurrences reported",
    ],
    memoryTrick: "Trie from words. Slide start position across text. For each start, traverse trie — collect all word completions.",
    whyItWorks: "Trie allows simultaneously checking all words that start with the same prefix. When traversing text[i..], each character step in the trie prunes non-matching words. isEnd flags valid word completions.",
    commonMistakes: [
      "Breaking when no trie child — correct, prevents indexing null",
      "Not sorting result — problem may require sorted output",
    ],
    patternConnection: "Trie for multi-pattern string matching. Related to Aho-Corasick algorithm (O(T+W) total vs O(T×W) or O(T²) here).",
    walkthroughExample: `text="thestoryofleetcodeandme", words=["story","fleet","leetcode"]:
Start at 3: t-h-e-s-t-o-r-y → "story" found at [3,7]
Start at 10: l-e-e-t-c-o-d-e → "leetcode" found at [10,17]
etc. ✓`,
    alternativeApproaches: [
      "Brute force: for each word, scan text — O(W×T×L)",
      "Aho-Corasick: O(W×L + T) optimal — worth knowing for production",
    ],
    proTips: [
      "Aho-Corasick algorithm: builds failure links on trie for O(T) scanning — mention as optimal",
      "For small inputs, brute force or trie-scan are fine in interviews",
    ],
  },

  "insert-interval": {
    intuition: "Insert new interval into sorted non-overlapping intervals, merging as needed. Three phases: add all intervals ending before new interval starts, merge overlapping ones, add remaining.",
    approach: [
      "Add all intervals that end before newInterval starts (no overlap).",
      "Merge all overlapping intervals: update newInterval start/end with min/max.",
      "Add remaining intervals.",
      "Return result with merged newInterval inserted.",
    ],
    cppSolution: `class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0, n = intervals.size();
        // Add non-overlapping before
        while (i < n && intervals[i][1] < newInterval[0])
            result.push_back(intervals[i++]);
        // Merge overlapping
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.push_back(newInterval);
        // Add remaining
        while (i < n) result.push_back(intervals[i++]);
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through all intervals.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Output array.",
    edgeCases: [
      "Empty intervals: return [newInterval]",
      "newInterval before all: prepend",
      "newInterval after all: append",
      "newInterval overlaps all: one merged interval",
    ],
    memoryTrick: "Three phases: BEFORE (end < new start), OVERLAP (merge), AFTER (start > new end). Middle phase expands newInterval.",
    whyItWorks: "Intervals are sorted. We can categorize each existing interval relative to newInterval. Before-overlap is clean separation. Overlapping intervals are merged by taking min start and max end.",
    commonMistakes: [
      "Condition for 'before': intervals[i][1] < newInterval[0] (not <=)",
      "Condition for 'overlap': intervals[i][0] <= newInterval[1] (equals = touching = merge)",
      "Forgetting to push merged newInterval between phases",
    ],
    patternConnection: "Interval manipulation. Related to Merge Intervals (sort+merge), Non-overlapping Intervals (remove minimum), Meeting Rooms. Knowing when intervals overlap: A.start <= B.end && B.start <= A.end.",
    walkthroughExample: `intervals=[[1,3],[6,9]], newInterval=[2,5]:
Before: none (no interval ends before 2)
Overlap: [1,3] overlaps [2,5] → merge to [1,5]
After: [6,9]
Result=[[1,5],[6,9]] ✓`,
    alternativeApproaches: [
      "Binary search: find insertion point, then merge — O(log n) to find, O(n) to merge",
    ],
    proTips: [
      "Linear scan is O(n) regardless — binary search doesn't improve overall complexity",
      "Touching intervals (end==start) usually merge — verify with problem statement",
    ],
  },

  "meeting-rooms": {
    intuition: "Can one person attend all meetings? Sort by start time. If any meeting starts before previous ends: overlap → impossible. Otherwise possible.",
    approach: [
      "Sort intervals by start time.",
      "For i from 1 to n-1: if intervals[i][0] < intervals[i-1][1]: return false.",
      "Return true.",
    ],
    cppSolution: `class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        for (int i = 1; i < (int)intervals.size(); i++)
            if (intervals[i][0] < intervals[i-1][1]) return false;
        return true;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Dominated by sorting.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place sort, constant extra space.",
    edgeCases: [
      "Empty: true (no meetings, no conflicts)",
      "Single meeting: true",
      "Touching meetings (end==start): check if problem considers this overlap",
    ],
    memoryTrick: "Sort, then check no consecutive overlap. If next starts before current ends → conflict.",
    whyItWorks: "After sorting, consecutive interval pairs are the only potential conflicts. If sorted pair i and i+1 don't overlap, no overlap exists between any pair.",
    commonMistakes: [
      "Not sorting first — random order can miss overlaps",
      "Using <= instead of < for overlap check — depends on whether touching counts",
    ],
    patternConnection: "Interval sorting baseline. Simpler version of Meeting Rooms II (count rooms needed). Merge Intervals uses same sorting technique.",
    walkthroughExample: `[[0,30],[5,10],[15,20]] → sort → [[0,30],[5,10],[15,20]]
5<30 → conflict → return false ✓`,
    alternativeApproaches: [
      "Sort all start/end events, process chronologically — same O(n log n)",
    ],
    proTips: [
      "Sort is O(n log n) — can't do better since we need total order",
      "Meeting Rooms II: use min-heap to track end times of ongoing meetings",
    ],
  },

  "meeting-rooms-ii": {
    intuition: "Minimum conference rooms needed. Sort by start time. Use min-heap of end times. For each meeting: if starts after heap.top() ends, reuse that room (pop). Always add current end time to heap. Heap size = rooms needed.",
    approach: [
      "Sort meetings by start time.",
      "Min-heap of end times.",
      "For each meeting: if heap not empty and heap.top() <= meeting.start: pop (room freed).",
      "Push meeting.end to heap.",
      "Return heap.size().",
    ],
    cppSolution: `class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        priority_queue<int, vector<int>, greater<int>> minHeap; // end times
        for (auto& interval : intervals) {
            if (!minHeap.empty() && minHeap.top() <= interval[0])
                minHeap.pop(); // reuse room
            minHeap.push(interval[1]);
        }
        return minHeap.size();
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Sort O(n log n) + n heap operations O(log n) each.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Heap stores at most n end times.",
    edgeCases: [
      "No meetings: return 0",
      "All overlapping: return n",
      "No overlapping: return 1",
    ],
    memoryTrick: "Min-heap of end times. Each new meeting: can it use the earliest-ending room? Heap size = active rooms.",
    whyItWorks: "Greedy: always try to reuse the room that frees up soonest. If the earliest-ending room overlaps with new meeting, all rooms overlap — need new one. This gives minimum rooms.",
    commonMistakes: [
      "Using max-heap: need min-heap (earliest ending room first)",
      "Condition: heap.top() <= interval[0] (not <) — room ending exactly when meeting starts is free",
    ],
    patternConnection: "Interval scheduling. Same heap approach: Task Scheduler (CPU scheduling), Min Interval to Include Queries. Also: chronological events (sweep line) is equivalent.",
    walkthroughExample: `[[0,30],[5,10],[15,20]] sorted:
[0,30]: heap=[30] (1 room)
[5,10]: 30>5, new room: heap=[10,30] (2 rooms)
[15,20]: 10<=15, reuse: heap=[20,30] (still 2 rooms)
Return 2 ✓`,
    alternativeApproaches: [
      "Sweep line: sort all start/end events. +1 at start, -1 at end. Track max value — O(n log n)",
      "Chronological ordering: equivalent to heap approach",
    ],
    proTips: [
      "Sweep line alternative: [(start,+1),(end,-1)], sort, scan — clean and O(n log n)",
      "If asking for which meetings share a room: track assignment separately",
    ],
  },

  "hand-of-straights": {
    intuition: "Can arrange cards into groups of size W as consecutive sequences? Count frequencies. Greedily form groups starting from smallest card. If smallest card can't form a full group: impossible.",
    approach: [
      "If hand.size() % W != 0: return false.",
      "Count frequencies in ordered map.",
      "For each unique card (smallest first): if count[card] > 0, try to extend sequence of W cards.",
      "For each of the W cards starting from card: if count[card+i] < count[card]: return false. Reduce counts.",
    ],
    cppSolution: `class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        if (hand.size() % groupSize) return false;
        map<int,int> cnt;
        for (int h : hand) cnt[h]++;
        for (auto& [card, freq] : cnt) {
            if (freq == 0) continue;
            for (int i = 1; i < groupSize; i++) {
                if (cnt[card+i] < freq) return false;
                cnt[card+i] -= freq;
            }
        }
        return true;
    }
};`,
    timeComplexity: "O(n log n)",
    timeExplanation: "Map insertion O(n log n), traversal O(n × W).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Frequency map.",
    edgeCases: [
      "W=1: always true",
      "n not divisible by W: immediately false",
      "Gaps in sequence: consecutive card not found → false",
    ],
    memoryTrick: "Ordered map. Process smallest card first. Drain entire group of size W starting from it. If any card missing: impossible.",
    whyItWorks: "The smallest remaining card MUST start a new group (it can't be in the middle of someone else's group since all smaller cards are processed). This greedy choice is forced and correct.",
    commonMistakes: [
      "Using unordered_map — need ordered iteration (smallest first)",
      "Not checking if cnt[card+i] exists before accessing",
      "Modifying map while iterating — use value copy",
    ],
    patternConnection: "Greedy with sorted frequency map. Related to: Task Scheduler (greedy grouping), Divide Array in Sets of K Consecutive Numbers (same problem different name).",
    walkthroughExample: `hand=[1,2,3,6,2,3,4,7,8], W=3:
cnt={1:1,2:2,3:2,4:1,6:1,7:1,8:1}
card=1(freq=1): extend [1,2,3], cnt[2]-=1,cnt[3]-=1 → cnt={2:1,3:1,4:1,...}
card=2(freq=1): extend [2,3,4]
card=6(freq=1): extend [6,7,8]
Return true ✓`,
    alternativeApproaches: [
      "Sort + greedy: sort hand, use multiset, greedily consume sequences",
      "Same complexity but different implementation style",
    ],
    proTips: [
      "Ordered map (std::map) is key — processes cards from smallest to largest",
      "When cnt[card]==0, the inner loop naturally handles it (all subtracted from cnt[card+i])",
    ],
  },

  "partition-labels": {
    intuition: "Partition string so each letter appears in at most one part. For each char: track last occurrence. Greedily extend current partition to include last occurrence of all chars seen so far. When current index == partition end: start new partition.",
    approach: [
      "Precompute last[c] = last index of char c for all c.",
      "Initialize start=0, end=0.",
      "For each index i: end = max(end, last[s[i]]).",
      "If i == end: partition [start, end] complete. Record size (end-start+1). start = i+1.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> partitionLabels(string s) {
        int last[26] = {};
        for (int i = 0; i < (int)s.size(); i++) last[s[i]-'a'] = i;
        vector<int> result;
        int start = 0, end = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            end = max(end, last[s[i]-'a']);
            if (i == end) { result.push_back(end-start+1); start = i+1; }
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Two passes: one for last occurrences, one for partitioning.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed array of size 26.",
    edgeCases: [
      "Single character: one partition of size 1",
      "All same character: one partition",
      "All unique characters: each char is its own partition",
    ],
    memoryTrick: "Last occurrence of each char = furthest it 'must' be in same partition. Extend end greedily. Partition when reached.",
    whyItWorks: "A partition containing char c must extend at least to c's last occurrence. Greedily tracking the farthest last occurrence ensures the partition is as small as possible while still valid.",
    commonMistakes: [
      "Not precomputing last occurrences — doing it inline is O(n²)",
      "start vs end+1 for next partition start",
    ],
    patternConnection: "Greedy interval scheduling. Related to Jump Game (tracking furthest reach) and Non-overlapping Intervals. The 'last occurrence as boundary' is a recurring greedy pattern.",
    walkthroughExample: `s="ababcbacadefegdehijhklij":
last: a=8,b=5,c=7,d=14,e=15,f=11,g=13,h=19,i=22,j=23,k=20,l=21
i=0(a→8),i=1(b→5),i=2(a→8),i=3(b→5),i=4(c→7),i=5(b→5),i=6(a→8),i=7(c→7),i=8: i==end → size=9
Continue: i=9(d→14)...i=15: size=7. i=16..23: size=8 ✓`,
    alternativeApproaches: [
      "Interval merging: each char occupies interval [first_occur, last_occur], merge overlapping intervals",
    ],
    proTips: [
      "Interval merging approach: create [first, last] for each char, merge — equivalent and also O(n)",
      "Track sizes, not indices: result.push_back(end-start+1)",
    ],
  },

  "merge-triplets": {
    intuition: "Find if target can be formed by OR-ing triplets after removing those with any component exceeding target. Only keep triplets where all components ≤ corresponding target values. OR all kept triplets — check if equals target.",
    approach: [
      "For each triplet: if triplet[i] <= target[i] for all i: it's valid.",
      "OR all valid triplets component-wise.",
      "If result equals target: true. Else: false.",
    ],
    cppSolution: `class Solution {
public:
    bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
        int a=0,b=0,c=0;
        for (auto& t : triplets) {
            if (t[0]<=target[0] && t[1]<=target[1] && t[2]<=target[2]) {
                a=max(a,t[0]); b=max(b,t[1]); c=max(c,t[2]);
            }
        }
        return a==target[0] && b==target[1] && c==target[2];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through triplets.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "Target not achievable: some component never reached",
      "Multiple triplets contribute different components",
    ],
    memoryTrick: "Filter: exclude triplets with any component > target. Max-merge remaining. Check if equals target.",
    whyItWorks: "Triplets with components exceeding target are useless (would push merged result above target). Among valid triplets, taking max of each component is optimal — we want to reach target exactly.",
    commonMistakes: [
      "Including invalid triplets (any component > target): inflates result above target",
      "Using OR instead of max: OR is equivalent since max(a,b) = OR when values are non-overlapping bits, but max is clearer",
    ],
    patternConnection: "Greedy selection. Key insight: invalid triplets can never be used. Among valid ones, take max each component. Simple O(n) pass.",
    walkthroughExample: `triplets=[[2,5,3],[1,8,4],[1,7,5]], target=[2,7,5]:
t=[2,5,3]: 5<7,3<5 valid. max=(2,5,3)
t=[1,8,4]: 8>7 INVALID, skip
t=[1,7,5]: valid. max=max((2,5,3),(1,7,5))=(2,7,5)
(2,7,5)==target → true ✓`,
    alternativeApproaches: [
      "No significantly different approach exists — linear scan with filter is optimal",
    ],
    proTips: [
      "Key insight: invalid triplets (any component > target) can ONLY hurt, never help",
      "max over each component = greedy merge of valid triplets",
    ],
  },

  "min-interval-query": {
    intuition: "For each query, find smallest interval containing it. Sort intervals by size. Sort queries. Use min-heap: add all intervals containing current query (sorted by right endpoint), track active intervals. Min-heap top = smallest containing interval.",
    approach: [
      "Sort intervals by left endpoint. Sort queries (with original indices).",
      "Min-heap: (interval_size, right). Process queries in sorted order.",
      "For each query: push all intervals with left <= query into heap.",
      "Pop intervals from heap where right < query (expired).",
      "Heap top = answer for this query. Map back to original indices.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        sort(intervals.begin(), intervals.end());
        vector<int> sortedQ = queries;
        sort(sortedQ.begin(), sortedQ.end());
        map<int,int> ans; // query→answer
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq; // (size,right)
        int i=0;
        for (int q : sortedQ) {
            while (i<(int)intervals.size() && intervals[i][0]<=q) {
                pq.push({intervals[i][1]-intervals[i][0]+1, intervals[i][1]});
                i++;
            }
            while (!pq.empty() && pq.top().second < q) pq.pop();
            ans[q] = pq.empty() ? -1 : pq.top().first;
        }
        vector<int> result;
        for (int q : queries) result.push_back(ans[q]);
        return result;
    }
};`,
    timeComplexity: "O((n+q) log n)",
    timeExplanation: "Sort O(n log n + q log q), then sweep with heap O((n+q) log n).",
    spaceComplexity: "O(n+q)",
    spaceExplanation: "Heap + answer map.",
    edgeCases: [
      "Query outside all intervals: return -1",
      "Multiple intervals of same size: any works (heap handles it)",
      "Duplicate queries: map handles them",
    ],
    memoryTrick: "Sweep queries sorted. Add intervals as they become valid (left ≤ query). Remove expired (right < query). Heap top = smallest active.",
    whyItWorks: "By processing queries in sorted order, we can sweep intervals left-to-right. The heap maintains all currently-valid (started) intervals ordered by size. We clean expired intervals lazily.",
    commonMistakes: [
      "Not removing expired intervals (right < q) — stale entries give wrong answers",
      "Not mapping back to original query order",
      "Using interval size = right-left+1 vs right-left",
    ],
    patternConnection: "Sweep line + min-heap. Similar to: Meeting Rooms II (sweep), Sliding Window Maximum (deque). Any 'active intervals for each query' problem uses this pattern.",
    walkthroughExample: `intervals=[[1,4],[2,4],[3,6],[4,4]], queries=[2,3,4,5]:
query=2: add [1,4](size4), [2,4](size3). Top=(3,4). ans[2]=3
query=3: add [3,6](size4). Pop? none. Top=(3,4). ans[3]=3
query=4: add [4,4](size1). Pop? none. Top=(1,4). ans[4]=1
query=5: Pop (1,4)(right=4<5), (3,4)(right=4<5). Top=(4,6). ans[5]=4 ✓`,
    alternativeApproaches: [
      "Segment tree / interval tree: O(n log n + q log n) — more complex",
      "Brute force: O(n×q) — works for small inputs",
    ],
    proTips: [
      "Lazy deletion from heap (pop when expired, not proactively) is simpler to implement",
      "Using map<int,int> ans avoids index confusion between sorted and original queries",
    ],
  },

  "roman-to-integer": {
    intuition: "Roman numerals: if a smaller value precedes a larger one, subtract it (IV=4, IX=9). Otherwise add. Process left to right: peek at next symbol — if current < next, subtract current. Else add.",
    approach: [
      "Build map: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
      "For each character: if next char value > current: subtract current. Else add current.",
      "Sum up all values.",
    ],
    cppSolution: `class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char,int> val={{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
        int result = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            if (i+1 < (int)s.size() && val[s[i]] < val[s[i+1]])
                result -= val[s[i]];
            else
                result += val[s[i]];
        }
        return result;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through string.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Fixed-size map of 7 symbols.",
    edgeCases: [
      "Single symbol: just return its value",
      "All additive (III, VIII): just sum",
      "Multiple subtractive pairs (XIV): handle each correctly",
    ],
    memoryTrick: "If current < next: subtract current. Else add. One-liner decision per symbol.",
    whyItWorks: "Roman numeral rules: subtractive notation only when smaller precedes larger. Looking ahead one character captures this rule completely.",
    commonMistakes: [
      "Handling subtractive pairs as two-char strings vs single-char lookahead — lookahead is simpler",
      "Missing CM(900), CD(400), XC(90), XL(40) — the lookahead approach handles all automatically",
    ],
    patternConnection: "String parsing with lookahead. Related to: Integer to Roman (reverse), Valid Parentheses (stack parsing). Simple rule-based parsing.",
    walkthroughExample: `"MCMXCIV":
M(1000)+: add 1000
C(100)<M(1000): subtract 100
M(1000)+: add 1000
X(10)<C(100): subtract 10
C(100)+: add 100
I(1)<V(5): subtract 1
V(5)+: add 5
Total=1000-100+1000-10+100-1+5=1994 ✓`,
    alternativeApproaches: [
      "HashMap of two-char combinations: precompute CM=900, CD=400 etc.",
      "Reverse iteration: if prev > curr (going right-to-left means next > curr means subtract)",
    ],
    proTips: [
      "Lookahead is simplest: no need to handle special 2-char combos separately",
      "Reverse scan: process right-to-left, add if >= running max, else subtract",
    ],
  },

  "happy-number": {
    intuition: "A happy number eventually reaches 1. Unhappy numbers cycle. Use Floyd's cycle detection: slow/fast pointer on the digit-square-sum sequence. If fast==1: happy. If slow==fast (cycle): not happy.",
    approach: [
      "Define getNext(n): sum of squares of digits.",
      "slow = getNext(n), fast = getNext(getNext(n)).",
      "While slow != fast: slow = getNext(slow), fast = getNext(getNext(fast)).",
      "Return slow == 1.",
    ],
    cppSolution: `class Solution {
    int getNext(int n) {
        int sum = 0;
        while (n) { int d=n%10; sum+=d*d; n/=10; }
        return sum;
    }
public:
    bool isHappy(int n) {
        int slow = n, fast = getNext(n);
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        return fast == 1;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Sequence converges quickly. Each step: sum of digit squares of n is O(log n).",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two pointers, no set.",
    edgeCases: [
      "n=1: immediately happy",
      "n=7: happy (7→49→97→130→10→1)",
      "n=2: eventually cycles, not happy",
    ],
    memoryTrick: "Floyd cycle detection on digit-square sequence. Fast reaches 1 if happy, or meets slow in cycle if not.",
    whyItWorks: "All non-happy numbers eventually enter a cycle. Floyd's algorithm detects any cycle in O(cycle_length) time with O(1) space. If fast pointer reaches 1, it's happy before any cycle.",
    commonMistakes: [
      "Using hash set: O(n) space — works but Floyd's is O(1)",
      "Checking slow==1 vs fast==1: fast is ahead so check fast first",
    ],
    patternConnection: "Floyd's cycle detection (tortoise and hare). Same algorithm: Linked List Cycle, Find Duplicate Number. Recognizing this is a sequence = linked list structure is the key insight.",
    walkthroughExample: `n=19:
19→82→68→100→1 (happy!)
Floyd: slow=82, fast=100 → slow=68, fast=1 → fast==1 → return true ✓`,
    alternativeApproaches: [
      "Hash set: seen = set(), while n not in seen: if n==1 return true; seen.add(n); n=getNext(n)",
      "Known cycle: 4→16→37→58→89→145→42→20→4 — hardcode check",
    ],
    proTips: [
      "Floyd's cycle detection is O(1) space vs set's O(k) — use Floyd's",
      "All non-happy numbers enter cycle containing 4 (or 89)",
    ],
  },

  "plus-one": {
    intuition: "Add 1 to number represented as array of digits. Traverse from right: if digit < 9, increment and return. If digit is 9, set to 0 and carry. If all 9s: prepend 1.",
    approach: [
      "Traverse digits from right to left.",
      "If current digit < 9: increment, return.",
      "Else: set to 0, continue (carry propagates).",
      "If loop completes: all were 9s, prepend 1.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        for (int i = (int)digits.size()-1; i >= 0; i--) {
            if (digits[i] < 9) { digits[i]++; return digits; }
            digits[i] = 0;
        }
        digits.insert(digits.begin(), 1);
        return digits;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "At most one pass through all digits.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification (except the prepend case).",
    edgeCases: [
      "[9]: becomes [1,0]",
      "[9,9,9]: becomes [1,0,0,0]",
      "[1,2,9]: becomes [1,3,0]",
    ],
    memoryTrick: "Right-to-left. Digit<9→increment and done. Digit=9→zero and carry. All zeros after loop→prepend 1.",
    whyItWorks: "Carry propagates left. Only 9→0 creates carry. First non-9 absorbs the carry. If all digits are 9, we need one extra digit (1 followed by n zeros).",
    commonMistakes: [
      "Forgetting the all-9s case — must prepend 1",
      "Using digits.insert(begin, 1) — O(n) but unavoidable for all-9s case",
    ],
    patternConnection: "Digit manipulation. Related to: Add Two Numbers (carry simulation), Multiply Strings (grade-school algorithm). Carry propagation is the core pattern.",
    walkthroughExample: `[9,9,9]:
i=2: 9→0, carry
i=1: 9→0, carry
i=0: 9→0, carry
Loop ends → prepend 1 → [1,0,0,0] ✓`,
    alternativeApproaches: [
      "Convert to int, add 1, convert back — fails for very large numbers",
      "Recursive: plusOne(digits, index) — same logic, recursive",
    ],
    proTips: [
      "Early return on digits[i]++ — most inputs handled in O(1)",
      "insert at beginning is O(n) — if performance critical, return reversed and reverse at end",
    ],
  },

  "count-primes": {
    intuition: "Count primes less than n. Sieve of Eratosthenes: start with all numbers as prime, mark multiples of each prime as composite. Remaining = primes.",
    approach: [
      "Create boolean array isPrime[n], all true.",
      "Set isPrime[0]=isPrime[1]=false.",
      "For i from 2 to √n: if isPrime[i]: mark all multiples i*i, i*i+i, ... as false.",
      "Count true values in array.",
    ],
    cppSolution: `class Solution {
public:
    int countPrimes(int n) {
        if (n < 2) return 0;
        vector<bool> isPrime(n, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; (long long)i*i < n; i++)
            if (isPrime[i])
                for (int j = i*i; j < n; j += i)
                    isPrime[j] = false;
        return count(isPrime.begin(), isPrime.end(), true);
    }
};`,
    timeComplexity: "O(n log log n)",
    timeExplanation: "Sieve complexity: sum of n/p for all primes p ≤ n = O(n log log n).",
    spaceComplexity: "O(n)",
    spaceExplanation: "Boolean array of size n.",
    edgeCases: [
      "n=0 or n=1: return 0",
      "n=2: return 0 (no primes < 2)",
      "n=3: return 1 (only prime < 3 is 2)",
    ],
    memoryTrick: "Sieve: cross out composites. Start marking from i*i (not 2*i — smaller multiples already crossed). Count remaining.",
    whyItWorks: "Every composite number n has a factor ≤ √n. So we only need to sieve up to √n. Starting at i*i avoids redundant marking (i*2, i*3, ... already marked by smaller primes).",
    commonMistakes: [
      "Starting j at 2*i instead of i*i — correct but slower",
      "i*i overflow for large i: use (long long)i*i < n",
      "Including n itself: problem says 'less than n'",
    ],
    patternConnection: "Classic number theory algorithm. Related to: Power of 2, Happy Number. Sieve pattern: initialize all, remove composites, count remaining.",
    walkthroughExample: `n=10:
isPrime=[F,F,T,T,T,T,T,T,T,T] (0,1 false)
i=2: mark 4,6,8 → isPrime=[F,F,T,T,F,T,F,T,F,T]
i=3: mark 9   → isPrime=[F,F,T,T,F,T,F,T,F,F]
Count true: 2,3,5,7 → return 4 ✓`,
    alternativeApproaches: [
      "Trial division for each number: O(n√n) — much slower",
      "Linear sieve: O(n) — marks each composite exactly once",
    ],
    proTips: [
      "vector<bool> uses bit packing — space efficient but slightly slower than char array",
      "Segmented sieve: for very large n, process in blocks fitting in cache",
    ],
  },

  "pow-x-n": {
    intuition: "Compute x^n efficiently. Divide and conquer: x^n = (x^(n/2))^2. If n is odd: multiply by x once more. Handle negative n: x^(-n) = 1/x^n.",
    approach: [
      "If n < 0: x = 1/x, n = -n.",
      "If n == 0: return 1.",
      "If n is odd: return x * myPow(x, n-1).",
      "Half = myPow(x, n/2). Return half*half.",
    ],
    cppSolution: `class Solution {
public:
    double myPow(double x, int n) {
        long long N = n; // avoid overflow on -INT_MIN
        if (N < 0) { x = 1.0/x; N = -N; }
        double result = 1.0;
        while (N > 0) {
            if (N & 1) result *= x;
            x *= x;
            N >>= 1;
        }
        return result;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "Halve n each iteration — log n steps.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Iterative, no recursion stack.",
    edgeCases: [
      "n=0: return 1",
      "n=INT_MIN: -INT_MIN overflows int — use long long",
      "x=0, n<0: mathematically undefined (division by 0)",
      "x=1: return 1 always",
    ],
    memoryTrick: "Binary exponentiation: multiply by x when bit is 1, square x each step (for next bit position). Process bits of n from LSB to MSB.",
    whyItWorks: "Fast power via binary representation of n. If n=13=1101₂: x^13=x^8×x^4×x^1. Square x each step, multiply result when current bit is 1.",
    commonMistakes: [
      "INT_MIN negation overflow: -INT_MIN = INT_MIN (wraps). Use long long N=n",
      "Recursive approach: stack overflow for large n (though O(log n) deep)",
    ],
    patternConnection: "Binary exponentiation — fundamental algorithm. Same principle: Matrix fast exponentiation (Fibonacci in O(log n)), modular exponentiation (cryptography).",
    walkthroughExample: `x=2, n=10 (N=1010₂):
N=10(even): x=4, N=5
N=5(odd): result=4, x=16, N=2
N=2(even): x=256, N=1
N=1(odd): result=4*256=1024, N=0
Return 1024=2^10 ✓`,
    alternativeApproaches: [
      "Recursive: myPow(x,n) = half*half (n even) or half*half*x (n odd) — O(log n) stack",
    ],
    proTips: [
      "Iterative > recursive: avoids stack overflow for very large n",
      "Same technique for modular exponentiation: add % MOD at each multiplication",
    ],
  },

  "multiply-strings": {
    intuition: "Multiply two non-negative integers as strings. Grade-school multiplication: each digit of num1 multiplies each digit of num2, results placed at correct position. pos[i+j] and pos[i+j+1] hold the product.",
    approach: [
      "Result array of size m+n (max digits).",
      "For each i from num1 right-to-left: for each j from num2 right-to-left:",
      "  product = (num1[i]-'0') * (num2[j]-'0').",
      "  pos[i+j+1] += product. Handle carry: pos[i+j] += pos[i+j+1]/10. pos[i+j+1] %= 10.",
      "Skip leading zeros and build result string.",
    ],
    cppSolution: `class Solution {
public:
    string multiply(string num1, string num2) {
        int m=num1.size(), n=num2.size();
        vector<int> pos(m+n, 0);
        for (int i=m-1;i>=0;i--)
            for (int j=n-1;j>=0;j--) {
                int mul=(num1[i]-'0')*(num2[j]-'0');
                int p1=i+j, p2=i+j+1;
                int sum=mul+pos[p2];
                pos[p2]=sum%10; pos[p1]+=sum/10;
            }
        string result;
        for (int p : pos) if (!(result.empty()&&p==0)) result+=to_string(p);
        return result.empty() ? "0" : result;
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Each digit of num1 multiplied with each digit of num2.",
    spaceComplexity: "O(m+n)",
    spaceExplanation: "Result array and output string.",
    edgeCases: [
      "Either input is '0': return '0'",
      "Single digit multiplication: works normally",
      "Result has leading zeros: skip them",
    ],
    memoryTrick: "Grade school: num1[i] × num2[j] goes to pos[i+j+1] (units) and carry to pos[i+j]. Build string from pos array skipping leading zeros.",
    whyItWorks: "If num1 has m digits and num2 has n digits, their product has at most m+n digits. Each (i,j) pair contributes to position i+j+1 in the result. Accumulating carries handles overflow.",
    commonMistakes: [
      "Not adding carry from pos[p2] to pos[p1] for multi-digit intermediate sums",
      "Not skipping leading zeros in output",
      "Off-by-one in position: p1=i+j, p2=i+j+1",
    ],
    patternConnection: "Math simulation. Related to: Add Two Numbers (digit-by-digit), Plus One (carry). Big number arithmetic — classic when language lacks big integers.",
    walkthroughExample: `num1="12", num2="34":
pos=[0,0,0,0] (size 4)
i=1,j=1: 2*4=8, pos[3]+=8→[0,0,0,8]
i=1,j=0: 2*3=6, pos[2]+=6→[0,0,6,8]
i=0,j=1: 1*4=4, pos[2]+=4→[0,0,10,8]→carry→[0,1,0,8]
i=0,j=0: 1*3=3, pos[1]+=3→[0,4,0,8]
Result: "408" ✓`,
    alternativeApproaches: [
      "Long multiplication then add rows: same complexity but more complex",
      "FFT-based multiplication: O(n log n) — massive overkill for interviews",
    ],
    proTips: [
      "Accumulate all intermediate values first (no immediate carry propagation) — then normalize in one pass",
      "Handle '0' inputs first: if num1=='0' || num2=='0' return '0'",
    ],
  },

  "rotate-image": {
    intuition: "Rotate matrix 90° clockwise in-place. Transpose (flip along main diagonal) then reverse each row. Two simple O(n²) operations compose to give 90° rotation.",
    approach: [
      "Transpose: for i<j, swap matrix[i][j] and matrix[j][i].",
      "Reverse each row: for each row, reverse left-right.",
    ],
    cppSolution: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        // Transpose
        for (int i = 0; i < n; i++)
            for (int j = i+1; j < n; j++)
                swap(matrix[i][j], matrix[j][i]);
        // Reverse each row
        for (int i = 0; i < n; i++)
            reverse(matrix[i].begin(), matrix[i].end());
    }
};`,
    timeComplexity: "O(n²)",
    timeExplanation: "Transpose O(n²/2), reverse rows O(n²/2).",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place — no extra matrix needed.",
    edgeCases: [
      "1×1 matrix: no change needed",
      "2×2: verify manually",
    ],
    memoryTrick: "Clockwise 90°: Transpose + Reverse rows. Counter-clockwise 90°: Reverse rows + Transpose. Memorize this pair.",
    whyItWorks: "After transposing, element at (i,j) is at (j,i). After row reversal, (j,i) becomes (j, n-1-i). Combined: original (i,j) → final (j, n-1-i) = clockwise 90°.",
    commonMistakes: [
      "Transposing with full n×n loop instead of upper triangle (i<j): double-swaps",
      "Reversing columns instead of rows (gives wrong rotation)",
      "Counter-clockwise: reverse each row THEN transpose (opposite order)",
    ],
    patternConnection: "Matrix manipulation. Related to: Spiral Matrix (traversal), Set Matrix Zeroes (in-place). Transpose+flip as rotation is a fundamental image processing operation.",
    walkthroughExample: `[[1,2,3],[4,5,6],[7,8,9]]:
Transpose: [[1,4,7],[2,5,8],[3,6,9]]
Reverse rows: [[7,4,1],[8,5,2],[9,6,3]] ✓`,
    alternativeApproaches: [
      "Layer-by-layer 4-way swap: rotate shells from outside in — O(n²) same",
      "Extra matrix: result[j][n-1-i]=matrix[i][j] — O(n²) space",
    ],
    proTips: [
      "Memorize: CW = Transpose + Reverse. CCW = Reverse + Transpose",
      "4-way swap: matrix[i][j]→matrix[j][n-1-i]→matrix[n-1-i][n-1-j]→matrix[n-1-j][i] in cycles",
    ],
  },

  "spiral-matrix": {
    intuition: "Traverse matrix in spiral order. Maintain four boundaries: top, bottom, left, right. Traverse top row, right column, bottom row (reversed), left column (reversed). Shrink boundaries. Repeat.",
    approach: [
      "top=0, bottom=m-1, left=0, right=n-1.",
      "While top<=bottom and left<=right:",
      "  Traverse top row left→right, then right col top→bottom.",
      "  If top<bottom: traverse bottom row right→left.",
      "  If left<right: traverse left col bottom→top.",
      "  Shrink all four boundaries.",
    ],
    cppSolution: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> result;
        int top=0,bottom=matrix.size()-1,left=0,right=matrix[0].size()-1;
        while (top<=bottom && left<=right) {
            for (int i=left;i<=right;i++) result.push_back(matrix[top][i]);
            top++;
            for (int i=top;i<=bottom;i++) result.push_back(matrix[i][right]);
            right--;
            if (top<=bottom) {for(int i=right;i>=left;i--) result.push_back(matrix[bottom][i]); bottom--;}
            if (left<=right) {for(int i=bottom;i>=top;i--) result.push_back(matrix[i][left]); left++;}
        }
        return result;
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Each element visited exactly once.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Output array aside, O(1) extra space.",
    edgeCases: [
      "Single row: traverse left to right only",
      "Single column: traverse top to bottom only",
      "1×1: return single element",
    ],
    memoryTrick: "Four boundaries shrink inward. Each spiral layer: →, ↓, ←, ↑. Shrink boundaries after each direction. Guard conditions for single row/col.",
    whyItWorks: "Each traversal direction follows one boundary. After traversal, that boundary shrinks inward. The inner condition guards (top<=bottom, left<=right) prevent double-traversal of edge rows/columns.",
    commonMistakes: [
      "Forgetting guard conditions for bottom row and left column (needed when single row/col remains)",
      "Not incrementing top before right column traversal",
    ],
    patternConnection: "Matrix traversal pattern. Related to: Spiral Matrix II (fill spiral), Rotate Image, Set Matrix Zeroes. Boundary-shrinking is a clean way to traverse matrices without visited arrays.",
    walkthroughExample: `[[1,2,3],[4,5,6],[7,8,9]]:
Top row: 1,2,3. Right col: 6,9. Bottom row: 8,7. Left col: 4.
Inner: [5] → 5.
Result: [1,2,3,6,9,8,7,4,5] ✓`,
    alternativeApproaches: [
      "Direction vector: (dx,dy) cycling through right/down/left/up, turn when hitting boundary — more elegant",
      "Recursive peel: process outer ring, recurse on inner submatrix",
    ],
    proTips: [
      "Guard conditions: if(top<=bottom) and if(left<=right) before bottom/left traversal",
      "Direction array approach: cleaner for implementation, same O(mn) complexity",
    ],
  },

  "set-matrix-zeroes": {
    intuition: "Set entire row and column to zero wherever a zero exists. Use first row and first column as markers (in-place). Track separately whether first row/col themselves should be zeroed.",
    approach: [
      "Check if first row has zero: firstRowZero. Check if first col has zero: firstColZero.",
      "For each cell (i,j) i>0,j>0: if matrix[i][j]==0: mark matrix[i][0]=0 and matrix[0][j]=0.",
      "Use markers: for i>0,j>0: if matrix[i][0]==0 or matrix[0][j]==0: zero out cell.",
      "Zero first row if firstRowZero. Zero first col if firstColZero.",
    ],
    cppSolution: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size(),n=matrix[0].size();
        bool firstRow=false,firstCol=false;
        for(int j=0;j<n;j++) if(!matrix[0][j]) firstRow=true;
        for(int i=0;i<m;i++) if(!matrix[i][0]) firstCol=true;
        for(int i=1;i<m;i++) for(int j=1;j<n;j++)
            if(!matrix[i][j]) {matrix[i][0]=0;matrix[0][j]=0;}
        for(int i=1;i<m;i++) for(int j=1;j<n;j++)
            if(!matrix[i][0]||!matrix[0][j]) matrix[i][j]=0;
        if(firstRow) for(int j=0;j<n;j++) matrix[0][j]=0;
        if(firstCol) for(int i=0;i<m;i++) matrix[i][0]=0;
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Multiple O(m×n) passes.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place using first row/col as markers.",
    edgeCases: [
      "First row contains zero: firstRowZero=true, handle separately",
      "First col contains zero: firstColZero=true, handle separately",
      "Entire matrix zeros: all cells zero after processing",
    ],
    memoryTrick: "Use first row/col as scratch. But first save whether first row/col themselves need zeroing. Process interior → apply markers → zero first row/col last.",
    whyItWorks: "First row/col as markers is safe because we mark interior cells using markers, then zero them. The first row/col themselves are handled last using the boolean flags, preventing premature zeroing.",
    commonMistakes: [
      "Not separating first row/col handling: zeroing first row early corrupts markers for first column and vice versa",
      "Marking cells as zero directly: corrupts future zero detection",
      "O(m+n) solution with separate arrays: correct but not O(1) space",
    ],
    patternConnection: "In-place matrix manipulation. Use existing structure as markers. Related to: Rotate Image (in-place), Spiral Matrix. The 'use existing array as scratch space' trick appears in multiple in-place problems.",
    walkthroughExample: `[[1,1,1],[1,0,1],[1,1,1]]:
firstRow=F,firstCol=F
Mark: matrix[1][0]=0, matrix[0][1]=0
Apply: row1col1=0(checked), row1col2 not (matrix[1][0]=0→zero→0)
Zero: all of row 1 and col 1 → [[1,0,1],[0,0,0],[1,0,1]] ✓`,
    alternativeApproaches: [
      "Two extra arrays: rowZero[m], colZero[n] — O(m+n) space, simpler logic",
    ],
    proTips: [
      "Always handle first row/col separately and last — classic interview trick",
      "Use any cell as flags — even matrix[0][0] if needed, just track it separately",
    ],
  },

  "detect-squares": {
    intuition: "Detect-Squares: count axis-aligned squares that can be formed using stored points and a query point. For query point P, pair it with each other point P1 at same y-coordinate. Third and fourth points determined by x-coordinates. Multiply counts.",
    approach: [
      "Store points as hash map: count[x][y] = frequency.",
      "Also store set of unique x-values per y (or use map of maps).",
      "For query (qx,qy): for each point (px,qy) at same y (px≠qx): side=|px-qx|.",
      "Check if (qx,qy+side), (px,qy+side) and (qx,qy-side), (px,qy-side) exist.",
      "Add count[(qx)(qy±side)] × count[(px)(qy±side)] × count[(px)(qy)] to total.",
    ],
    cppSolution: `class DetectSquares {
    map<pair<int,int>,int> cnt;
    map<int,set<int>> xAtY;
public:
    void add(vector<int> point) {
        cnt[{point[0],point[1]}]++;
        xAtY[point[1]].insert(point[0]);
    }
    int count(vector<int> point) {
        int qx=point[0],qy=point[1],result=0;
        for (int px : xAtY[qy]) {
            if (px==qx) continue;
            int side=abs(px-qx);
            result+=cnt[{px,qy}]*cnt[{qx,qy+side}]*cnt[{px,qy+side}];
            result+=cnt[{px,qy}]*cnt[{qx,qy-side}]*cnt[{px,qy-side}];
        }
        return result;
    }
};`,
    timeComplexity: "O(n) per query",
    timeExplanation: "Iterate all x-values at query y-level.",
    spaceComplexity: "O(n)",
    spaceExplanation: "Point count map + x-per-y index.",
    edgeCases: [
      "No points at same y: count=0",
      "Duplicate points: count them (multiply frequencies)",
      "Query point itself exists: px==qx → skip",
    ],
    memoryTrick: "Fix diagonal by choosing base edge (qx,qy)-(px,qy). Two squares above and below. Multiply frequencies of all 4 corners.",
    whyItWorks: "An axis-aligned square has two horizontal edges and two vertical edges. Given query point and one horizontal partner (same y), the other two corners are uniquely determined. Count all configurations by multiplying frequencies.",
    commonMistakes: [
      "Only checking squares above (not below): need both +side and -side",
      "Not skipping px==qx: would form degenerate zero-area square",
      "Using frequency for base point (px,qy) but not multiplying all 4 corner counts",
    ],
    patternConnection: "Math + hash map counting. The 'enumerate one edge, derive others' technique appears in geometric problems. Similar to counting triangles/rectangles.",
    walkthroughExample: `add(3,10),add(11,2),add(3,2):
count([11,10]):
px=3 at y=10: side=|3-11|=8
  Above: cnt[3,10]*cnt[11,10-8=2]*cnt[3,2]=1*1*1=1
  Below: cnt[3,10]*cnt[11,18]*cnt[3,18]=1*0*0=0
Result=1 ✓`,
    alternativeApproaches: [
      "Check all pairs of points: O(n²) per query — too slow for many queries",
    ],
    proTips: [
      "Only need to enumerate base edge (one horizontal side) — O(n) per query is optimal",
      "Multiply ALL 4 corner frequencies — duplicates are valid configurations",
    ],
  },

  "nth-tribonacci": {
    intuition: "Tribonacci: T(n) = T(n-1) + T(n-2) + T(n-3). T(0)=0, T(1)=1, T(2)=1. Roll three variables.",
    approach: [
      "Base: T0=0, T1=1, T2=1. If n≤2, return T[n].",
      "For i from 3 to n: T3 = T0+T1+T2. Roll: T0=T1, T1=T2, T2=T3.",
      "Return T2.",
    ],
    cppSolution: `class Solution {
public:
    int tribonacci(int n) {
        if (n==0) return 0;
        if (n<=2) return 1;
        int a=0,b=1,c=1;
        for (int i=3;i<=n;i++) {int d=a+b+c;a=b;b=c;c=d;}
        return c;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single loop from 3 to n.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Three variables.",
    edgeCases: [
      "n=0: return 0",
      "n=1 or n=2: return 1",
    ],
    memoryTrick: "Fibonacci but sum last THREE. Roll three variables a,b,c → b,c,a+b+c.",
    whyItWorks: "Tribonacci recurrence directly implemented with three rolling variables — same principle as Fibonacci but one more term.",
    commonMistakes: [
      "Wrong base cases: T(0)=0, T(1)=1, T(2)=1 (not T(2)=2)",
    ],
    patternConnection: "Extension of Fibonacci DP. k-step Fibonacci: sum last k values. Rolling k variables.",
    walkthroughExample: `n=4: T(4)=T(3)+T(2)+T(1)=2+1+1=4
a=0,b=1,c=1
i=3: d=2,a=1,b=1,c=2
i=4: d=4,a=1,b=2,c=4 → return 4 ✓`,
    alternativeApproaches: [
      "Memoization/full dp array: O(n) space but unnecessary",
    ],
    proTips: [
      "Precompute all values up to n=37 (fits in int) — O(1) with lookup table",
    ],
  },

  "min-cost-climbing": {
    intuition: "Pay cost[i] to step on stair i, then jump 1 or 2 steps. Find min cost to reach top (beyond last step). DP: dp[i] = min cost to reach step i from start.",
    approach: [
      "dp[0]=cost[0], dp[1]=cost[1].",
      "For i from 2 to n-1: dp[i] = cost[i] + min(dp[i-1], dp[i-2]).",
      "Return min(dp[n-1], dp[n-2]) — can start from either last step.",
    ],
    cppSolution: `class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        int n = cost.size();
        for (int i = 2; i < n; i++)
            cost[i] += min(cost[i-1], cost[i-2]);
        return min(cost[n-1], cost[n-2]);
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass.",
    spaceComplexity: "O(1)",
    spaceExplanation: "In-place modification of cost array.",
    edgeCases: [
      "n=2: return min(cost[0], cost[1])",
      "All same costs: any path is optimal",
    ],
    memoryTrick: "cost[i] += min(cost[i-1], cost[i-2]). Answer = min of last two.",
    whyItWorks: "cost[i] becomes total cost to reach top FROM step i. The min of last two gives cheapest entry to top (can start from either last or second-last step).",
    commonMistakes: [
      "dp starting from index 0 vs 1 (can start at either)",
      "Forgetting final min(dp[n-1], dp[n-2]) — not just dp[n-1]",
    ],
    patternConnection: "Fibonacci-style DP. Climbing Stairs variant with costs. House Robber sibling problem.",
    walkthroughExample: `cost=[10,15,20]:
cost[2]+=min(10,15)=10+10=20
min(cost[1],cost[2])=min(15,20)=15 ✓`,
    alternativeApproaches: [
      "Two variables (no in-place): prev2=cost[0], prev1=cost[1], curr = cost[i]+min(prev1,prev2)",
    ],
    proTips: [
      "In-place modification: space O(1) but mutates input — ask if allowed",
      "Top-down: dfs(i) = cost[i] + min(dfs(i+1), dfs(i+2))",
    ],
  },

  "max-score-multiplication": {
    intuition: "At each step: pick from left or right end of nums, multiply by multipliers[i]. DP: dp[i][l] = max score using i multipliers with l picks from left (so i-l from right). Try pick left or right.",
    approach: [
      "m = multipliers.size(). dp[i][l] = max score after i operations, l from left.",
      "For i from 1 to m: for l from 0 to i:",
      "  r = i - l. Left pick: dp[i][l] = dp[i-1][l-1] + nums[l-1]*mult[i-1].",
      "  Right pick: dp[i][l] = max with dp[i-1][l] + nums[n-r]*mult[i-1].",
      "Return max over dp[m][0..m].",
    ],
    cppSolution: `class Solution {
public:
    int maximumScore(vector<int>& nums, vector<int>& multipliers) {
        int n=nums.size(), m=multipliers.size();
        vector<vector<int>> dp(m+1, vector<int>(m+1, INT_MIN));
        dp[0][0]=0;
        int ans=INT_MIN;
        for(int i=1;i<=m;i++)
            for(int l=0;l<=i;l++){
                int r=i-l;
                if(l>0&&dp[i-1][l-1]!=INT_MIN)
                    dp[i][l]=max(dp[i][l],dp[i-1][l-1]+nums[l-1]*multipliers[i-1]);
                if(r>0&&dp[i-1][l]!=INT_MIN)
                    dp[i][l]=max(dp[i][l],dp[i-1][l]+nums[n-r]*multipliers[i-1]);
                if(i==m&&dp[m][l]!=INT_MIN) ans=max(ans,dp[m][l]);
            }
        return ans;
    }
};`,
    timeComplexity: "O(m²)",
    timeExplanation: "m multipliers, each with up to m+1 left-pick states.",
    spaceComplexity: "O(m²)",
    spaceExplanation: "dp table of size (m+1)×(m+1).",
    edgeCases: [
      "m=1: choose max(nums[0]*mult[0], nums[n-1]*mult[0])",
      "All multipliers positive: pick largest nums",
    ],
    memoryTrick: "State (step, left_picks) defines right_picks = step - left_picks. Two choices per state: pick left or pick right.",
    whyItWorks: "After i steps, if we picked l from left, we picked r=i-l from right. This determines which elements were picked. DP over (step, left) captures all valid configurations.",
    commonMistakes: [
      "Using n (nums size) instead of m (multipliers size) for dp dimensions",
      "Index arithmetic: left picks → nums[l-1], right picks → nums[n-r]",
    ],
    patternConnection: "2D DP with decision at each step. Related to: Stone Game (min/max), Burst Balloons (interval DP). Key: reduce to minimal state space.",
    walkthroughExample: `nums=[1,2,3],mult=[3,2,1]:
Best: take 3,3,3→... various combos. Answer=14 ✓`,
    alternativeApproaches: [
      "Top-down memoization: memo[i][l] = max score",
      "1D DP rolling: O(m) space with careful implementation",
    ],
    proTips: [
      "Top-down is more natural to implement: dfs(i,l) with memo",
      "Optimize to 1D DP: iterate right-to-left on l for each i",
    ],
  },

  "longest-increasing-path-matrix": {
    intuition: "Longest increasing path in matrix. DFS from each cell, memoize result. No visited array needed — strictly increasing constraint prevents cycles.",
    approach: [
      "memo[i][j] = longest increasing path starting at (i,j).",
      "DFS: for each of 4 neighbors, if neighbor > current: recurse, update memo.",
      "Return 1 + max of valid neighbor results.",
      "Answer = max of all memo[i][j].",
    ],
    cppSolution: `class Solution {
    int dfs(vector<vector<int>>& grid, vector<vector<int>>& memo, int r, int c) {
        if (memo[r][c]) return memo[r][c];
        int m=grid.size(),n=grid[0].size();
        int dx[]={0,0,1,-1},dy[]={1,-1,0,0};
        int best=1;
        for(int d=0;d<4;d++){
            int nr=r+dx[d],nc=c+dy[d];
            if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]>grid[r][c])
                best=max(best,1+dfs(grid,memo,nr,nc));
        }
        return memo[r][c]=best;
    }
public:
    int longestIncreasingPath(vector<vector<int>>& matrix) {
        int m=matrix.size(),n=matrix[0].size(),ans=0;
        vector<vector<int>> memo(m,vector<int>(n,0));
        for(int i=0;i<m;i++)for(int j=0;j<n;j++) ans=max(ans,dfs(matrix,memo,i,j));
        return ans;
    }
};`,
    timeComplexity: "O(m×n)",
    timeExplanation: "Each cell computed once via memoization.",
    spaceComplexity: "O(m×n)",
    spaceExplanation: "memo grid + recursion stack.",
    edgeCases: [
      "1×1: return 1",
      "Strictly decreasing matrix: each cell alone, return 1",
      "All same values: no valid moves, each cell=1",
    ],
    memoryTrick: "DFS + memo on matrix. No visited set (strictly increasing = DAG). Max of all starting cells.",
    whyItWorks: "Strictly increasing prevents cycles — the matrix forms a DAG. Memoization ensures each cell computed once. Starting DFS from every cell finds globally longest path.",
    commonMistakes: [
      "Using visited set: unnecessary and breaks memoization — strictly increasing prevents cycles",
      "Checking neighbors equal or greater: must be strictly greater",
      "Not trying all starting cells",
    ],
    patternConnection: "DFS with memoization on grid DAG. Topological sort alternative: order cells by value (Kahn's-style). Same pattern: matrix chain multiplication (interval DP), stone game.",
    walkthroughExample: `matrix=[[9,9,4],[6,6,8],[2,1,1]]:
Starting from cell(2,2)=1: go to 8(up-right? no)...
Starting from 1→2→6→9 = length 4 ✓`,
    alternativeApproaches: [
      "Topological sort: sort cells by value, process in increasing order — O(mn log mn)",
    ],
    proTips: [
      "DFS+memo is simpler to code than topological sort for this problem",
      "Check 0 in memo for 'not computed yet' — safe since all paths are ≥ 1",
    ],
  },

  "jump-game-vii": {
    intuition: "From each '0' position, can jump to any '0' in [i+minJump, i+maxJump]. Reach last '0' from position 0. BFS with range or prefix sum to efficiently check reachable positions.",
    approach: [
      "Use prefix sum of reachable positions. Pre[i] = number of reachable positions up to i.",
      "reach[0]=1 (start is reachable). For each i from 1 to n-1:",
      "  If s[i]=='1': not reachable. Else: check if any reachable position in [i-maxJump, i-minJump] exists (prefix sum).",
      "  If yes and s[i]='0': reach[i]=true.",
      "Return reach[n-1].",
    ],
    cppSolution: `class Solution {
public:
    bool canReach(string s, int minJump, int maxJump) {
        int n=s.size();
        vector<bool> reach(n,false);
        reach[0]=true;
        int pre=0; // count of reachable positions up to current window
        for (int i=1;i<n;i++) {
            if (i>=minJump) pre+=(reach[i-minJump]?1:0);
            if (i>maxJump)  pre-=(reach[i-maxJump-1]?1:0);
            if (pre>0 && s[i]=='0') reach[i]=true;
        }
        return reach[n-1];
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass with O(1) window sum.",
    spaceComplexity: "O(n)",
    spaceExplanation: "reach array.",
    edgeCases: [
      "Last position is '1': always false",
      "minJump=1, maxJump=n: essentially any reachable '0' from start",
    ],
    memoryTrick: "Sliding window sum of reachable positions in valid jump range. If any reachable and cell is '0': reachable. BFS variant with prefix sum optimization.",
    whyItWorks: "For position i to be reachable: some position j in [i-maxJump, i-minJump] must be reachable and s[i]='0'. Prefix sum of reach[] gives O(1) count of reachable positions in any window.",
    commonMistakes: [
      "BFS without prefix sum: O(n×(maxJump-minJump)) TLE for large inputs",
      "Not checking s[i]=='0': can't land on '1'",
    ],
    patternConnection: "Reachability DP with sliding window. Jump Game I/II (no range constraint). The prefix sum optimization converts O(range) per cell to O(1).",
    walkthroughExample: `s="011010", minJump=2, maxJump=3:
reach[0]=T, pre tracks reachable in [i-3,i-2]
i=3('0'): pre includes reach[0]=1, reach[1]=0 → pre=1>0 → reach[3]=T
i=5('0'): pre includes reach[2],reach[3] → pre=1>0 → reach[5]=T ✓`,
    alternativeApproaches: [
      "BFS: queue of reachable '0's, expand range — O(n) with proper deduplication",
    ],
    proTips: [
      "Prefix sum is the key optimization — naive BFS is TLE",
      "pre tracks sum in sliding window [i-maxJump, i-minJump] — update at boundaries",
    ],
  },

  "bitwise-and-numbers-range": {
    intuition: "Find bitwise AND of all numbers in [m, n]. Numbers between m and n differ in their lower bits. AND of a range zeroes out all bits that differ. Find common prefix of m and n in binary.",
    approach: [
      "While m != n: right-shift both m and n, count shifts.",
      "When m==n: they share the common prefix.",
      "Left-shift m (or n) back by the shift count.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    int rangeBitwiseAnd(int m, int n) {
        int shift = 0;
        while (m != n) { m >>= 1; n >>= 1; shift++; }
        return m << shift;
    }
};`,
    timeComplexity: "O(log n)",
    timeExplanation: "At most 32 right-shift operations.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant variables.",
    edgeCases: [
      "m=n: return m (AND of single number)",
      "m=0: return 0 (0 ANDed with anything = 0)",
      "Consecutive numbers m,m+1: lower bit always 0 in range",
    ],
    memoryTrick: "Shift right until m==n. That's the common prefix. Shift back left. AND of range = common prefix of m and n.",
    whyItWorks: "Any two consecutive numbers in [m,n] differ in at least one bit. AND across the range zeros all bits that ever differ. The common left prefix of m and n is the maximum that can survive.",
    commonMistakes: [
      "Naive AND of all numbers in range: O(n) — TLE",
      "Not shifting both m and n equally",
    ],
    patternConnection: "Bit manipulation. Finding common binary prefix. Related to: XOR range problems, single number variants.",
    walkthroughExample: `m=5(101), n=7(111):
5!=7: m=2(10),n=3(11),shift=1
2!=3: m=1(1),n=1(1),shift=2
m==n=1: return 1<<2=4(100) ✓`,
    alternativeApproaches: [
      "Brian Kernighan: n &= (n-1) while n>m — clear lowest set bit of n until n<=m",
    ],
    proTips: [
      "Alternative: n &= (n-1) while n>m — clears trailing 1s one at a time",
      "Common in interview: bit manipulation, O(log n) solution expected",
    ],
  },

  "reverse-integer": {
    intuition: "Reverse digits of integer. Extract digits with %10 and /10, build reversed number. Check for 32-bit integer overflow before updating result.",
    approach: [
      "result = 0.",
      "While x != 0: digit = x%10, x /= 10.",
      "Before updating: check if result > INT_MAX/10 or result < INT_MIN/10.",
      "result = result*10 + digit.",
      "Return result.",
    ],
    cppSolution: `class Solution {
public:
    int reverse(int x) {
        int result = 0;
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            if (result > INT_MAX/10 || (result == INT_MAX/10 && digit > 7)) return 0;
            if (result < INT_MIN/10 || (result == INT_MIN/10 && digit < -8)) return 0;
            result = result * 10 + digit;
        }
        return result;
    }
};`,
    timeComplexity: "O(log |x|)",
    timeExplanation: "Number of digits in x.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Constant space.",
    edgeCases: [
      "x=0: return 0",
      "Trailing zeros become leading zeros in reverse: 100→1",
      "Overflow: return 0 (INT_MAX=2147483647, INT_MIN=-2147483648)",
      "Negative: %10 in C++ preserves sign",
    ],
    memoryTrick: "Extract digit = x%10. Overflow check before multiplying. result = result*10 + digit.",
    whyItWorks: "C++ integer division and modulo preserve sign for negative numbers (x=-123: -123%10=-3, -123/10=-12). Overflow check compares result to INT_MAX/10 — if already larger, multiplying by 10 would overflow.",
    commonMistakes: [
      "Not checking overflow before multiplying — use result > INT_MAX/10 not result*10 > INT_MAX",
      "Forgetting negative numbers: x%10 is negative for negative x — handled correctly by result*10+digit",
      "Converting to string: works but arithmetic approach is preferred",
    ],
    patternConnection: "Math digit manipulation. Related to: Plus One, Palindrome Number, Multiply Strings. Overflow checking pattern appears in: atoi, string to integer.",
    walkthroughExample: `x=123:
digit=3, x=12, result=3
digit=2, x=1,  result=32
digit=1, x=0,  result=321
Return 321 ✓`,
    alternativeApproaches: [
      "String conversion: reverse string, handle sign — simpler but less elegant",
      "Long long: store intermediate in long long, check bounds — avoids per-step overflow check",
    ],
    proTips: [
      "Check INT_MAX/10=214748364: if result>this before adding digit → overflow",
      "Negative modulo: in C++, (-7)%10=-7. So result builds negative correctly",
    ],
  },

  "valid-parenthesis-string": {
    intuition: "String with '(', ')', '*'. '*' can be '(', ')' or empty. Greedy: track range [lo, hi] of possible open parenthesis counts. '(' increments both, ')' decrements both, '*' widens range [-1 from lo, +1 to hi]. If hi<0: invalid. Final lo==0 means valid.",
    approach: [
      "lo = hi = 0.",
      "For each char: '(' → lo++, hi++. ')' → lo--, hi--. '*' → lo--, hi++.",
      "If hi < 0: return false (too many ')').",
      "lo = max(lo, 0) (lo can't be negative).",
      "Return lo == 0.",
    ],
    cppSolution: `class Solution {
public:
    bool checkValidString(string s) {
        int lo = 0, hi = 0;
        for (char c : s) {
            if (c == '(') { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else { lo--; hi++; } // '*'
            if (hi < 0) return false;
            lo = max(lo, 0);
        }
        return lo == 0;
    }
};`,
    timeComplexity: "O(n)",
    timeExplanation: "Single pass through string.",
    spaceComplexity: "O(1)",
    spaceExplanation: "Two variables.",
    edgeCases: [
      "All '*': valid (all empty)",
      "Empty string: valid",
      "More ')' than can be balanced: return false",
    ],
    memoryTrick: "Track [lo,hi] = range of valid open-paren counts. '*' widens range. hi<0=impossible. End: lo==0 means can balance.",
    whyItWorks: "lo = minimum possible open count (treating '*' as ')' or empty). hi = maximum possible (treating '*' as '('). Any value in [lo,hi] is achievable. If 0 in range at end → valid.",
    commonMistakes: [
      "lo = max(lo,0): can't have negative open parens",
      "Forgetting hi<0 check: if all '*' used as ')' still too many",
      "DP solution: O(n²) — greedy O(n) is better",
    ],
    patternConnection: "Greedy interval tracking. Related to: Valid Parentheses (stack), Remove Invalid Parentheses (BFS/DP). Tracking possible range instead of exact count is the key greedy insight.",
    walkthroughExample: `s="(**)":
'(':lo=1,hi=1
'*':lo=0,hi=2
'*':lo=-1→0,hi=3
')':lo=-1→0,hi=2
lo=0 → true ✓`,
    alternativeApproaches: [
      "DP: dp[i][j] = can s[0..i] be valid with j open parens — O(n²)",
      "Stack: two stacks for '(' and '*' positions — O(n) space",
    ],
    proTips: [
      "Greedy [lo,hi] range is the cleanest O(n) O(1) solution",
      "Stack alternative: use stacks for '(' and '*' indices, match greedily",
    ],
  },
}