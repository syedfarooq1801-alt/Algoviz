export interface BehavioralQuestion {
  id: string;
  question: string;
  principle?: string;
  star: { situation: string; task: string; action: string; result: string };
  antiPattern: string;
  followUps: string[];
}

export interface CompanyValues {
  company: string;
  color: string;
  icon: string;
  values: string[];
  tipsheet: string;
  questions: BehavioralQuestion[];
}

export const COMPANY_VALUES: CompanyValues[] = [
  {
    company: "Amazon",
    color: "#f97316",
    icon: "📦",
    values: [
      "Customer Obsession", "Ownership", "Invent and Simplify", "Are Right, A Lot",
      "Learn and Be Curious", "Hire and Develop the Best", "Insist on the Highest Standards",
      "Think Big", "Bias for Action", "Frugality", "Earn Trust", "Dive Deep",
      "Have Backbone; Disagree and Commit", "Deliver Results", "Strive to be Earth's Best Employer",
      "Success and Scale Bring Broad Responsibility",
    ],
    tipsheet: "Amazon interviews are LP-heavy. Every behavioral question maps to at least one LP. Prepare 2 STAR stories per LP. Use recent examples (< 2 years). Be data-driven: 'We reduced latency by 40%' not 'we made it faster'. Interviewers have a rubric — hit all 4 STAR parts. Disagreed and committed = most underused LP. Frugality = doing more with less, cost optimization.",
    questions: [
      {
        id: "amz-customer-obsession",
        question: "Tell me about a time you went above and beyond for a customer.",
        principle: "Customer Obsession",
        star: {
          situation: "Our team's recommendation service had 200ms p99 latency. Product analytics showed 12% of users abandoning the recommendations carousel — we correlated it with latency.",
          task: "I owned the recommendations backend. No ticket existed — I self-identified the problem from dashboards.",
          action: "I added Redis caching for the top-1000 users' recommendation outputs (pre-computed nightly), reducing cache miss rate to 3%. Added async prefetch so next page was ready before user scrolled. Pushed a client-side skeleton loader while fetching.",
          result: "p99 dropped from 200ms to 18ms. Abandonment rate dropped from 12% to 3%. No manager assigned this — I identified, scoped, and shipped it in one sprint.",
        },
        antiPattern: "Don't confuse 'customer' with just end-user. Internal teams are also customers. Don't say you 'tried to improve' — say what you shipped and measured.",
        followUps: ["How did you know 200ms was the problem and not content quality?", "What was the tradeoff of pre-computing vs real-time?", "Did you get pushback on taking unscoped work?"],
      },
      {
        id: "amz-ownership",
        question: "Describe a time you took ownership of a problem outside your scope.",
        principle: "Ownership",
        star: {
          situation: "Post-deploy, another team's service started timing out. On-call pages hit my team because our service called theirs. My manager was traveling.",
          task: "I was not the on-call but I was the one who spotted the cascade pattern from logs.",
          action: "I added a circuit breaker in our client to stop hammering their failing service. Filed a SEV-2 ticket, looped in their team, wrote a runbook, and set up an alert for downstream timeout rate exceeding 5%.",
          result: "Cascade stopped in 8 minutes. I wrote the post-mortem even though it wasn't my system. The circuit breaker became a company-wide pattern for external service calls.",
        },
        antiPattern: "Don't say 'it wasn't my job to fix.' Ownership means you don't watch problems float past. Don't take credit for other people's fixes.",
        followUps: ["What if the other team had said no to your circuit breaker?", "How did you balance this with your own sprint work?"],
      },
      {
        id: "amz-dive-deep",
        question: "Tell me about a time you used data to solve a problem others thought was unsolvable.",
        principle: "Dive Deep",
        star: {
          situation: "Users complained our checkout was slow. Engineers said it felt fast — average latency was 120ms. Leadership wanted to deprioritize.",
          task: "I believed the issue was real but hidden in averages.",
          action: "I pulled p99 and p999 latency histograms segmented by region, device type, and cart size. Found: users with 10+ items in cart hit 3.2 seconds p99 on mobile in Southeast Asia. Root cause: N+1 query — each cart item triggered a separate inventory check. I wrote a batch inventory endpoint and modified the cart service to use it.",
          result: "p99 for large carts dropped from 3.2s to 280ms. Mobile conversion in SEA increased 8% MoM. Leadership: 'We thought this was a perception problem.'",
        },
        antiPattern: "Don't present analysis without action. Don't use averages when percentiles matter. Don't say 'I noticed' without showing what tool you used.",
        followUps: ["Why were you looking at p99 and not p50?", "How did you get buy-in to build the batch endpoint?"],
      },
      {
        id: "amz-bias-for-action",
        question: "Tell me about a time you made a decision with incomplete information.",
        principle: "Bias for Action",
        star: {
          situation: "Black Friday minus 2 days. Load test showed our order service would cap at 80K QPS, but our projection was 120K. Full re-architecture was 2 weeks.",
          task: "We needed a decision in 4 hours.",
          action: "I recommended pre-scaling to 3x instances immediately (cost: ~$50K for 3 days), adding a queue to absorb burst, and adding feature flags to gracefully degrade recommendations if needed. I documented the decision, risks, and the trigger conditions that would activate the degradation.",
          result: "Peak hit 105K QPS. The queue absorbed the burst. Recommendations degraded for 4 minutes at peak. Zero checkout failures. We fixed the underlying bottleneck in January.",
        },
        antiPattern: "Don't wait for perfect data. 'I escalated to leadership and waited' is not bias for action. Document your assumptions so you can revisit them.",
        followUps: ["What if your recommendation to scale had been wrong?", "How did you ensure the $50K spend was approved quickly?"],
      },
      {
        id: "amz-disagree-commit",
        question: "Tell me about a time you disagreed with a decision and what you did.",
        principle: "Have Backbone; Disagree and Commit",
        star: {
          situation: "My team decided to use DynamoDB for a new feature requiring complex multi-attribute filtering and sorting. I believed PostgreSQL was the better fit.",
          task: "I had to either make my case or commit to the team's direction.",
          action: "I wrote a 1-page doc: DynamoDB cost per query, limitations on secondary indexes, estimated migration cost if we needed to change later. I presented it in the design review. The team discussed and still chose DynamoDB due to existing infra. I said 'I disagree with this choice, but I commit to making it work' — and then I spent two sprints building the most robust DynamoDB access patterns possible, with a migration path doc.",
          result: "6 months later we hit the GSI limits I predicted. My migration doc was ready. Migration took 2 weeks, not months. Team cited my prep as saving the project.",
        },
        antiPattern: "Don't just disagree and complain. Don't say 'I was right, they were wrong.' The point is you committed fully even while disagreeing. Don't bring this up without a specific outcome.",
        followUps: ["What would you have done if your migration doc wasn't needed?", "How did the team react to your written disagreement?"],
      },
    ],
  },
  {
    company: "Google",
    color: "#4f8ef7",
    icon: "🔍",
    values: [
      "Focus on the user", "It's best to do one thing really well", "Fast is better than slow",
      "Democracy on the web", "You don't need to be at your desk", "Great just isn't good enough",
      "Data beats opinion", "Think 10x not 10%", "Psychological safety", "Googliness",
    ],
    tipsheet: "Google behavioral rounds assess 4 attributes: General Cognitive Ability, Leadership, Googleyness, Role-Related Knowledge. Interviewers use structured scoring rubrics. Focus on YOUR impact, not team impact. Use 'I' not 'we'. Ambiguity tolerance is key — show you can work without perfect requirements. 'Googliness' = intellectual curiosity, collaborative, doing the right thing.",
    questions: [
      {
        id: "goog-ambiguity",
        question: "Tell me about a time you worked on a project with unclear requirements.",
        principle: "Ambiguity Tolerance",
        star: {
          situation: "I was handed a project: 'improve developer productivity.' No spec, no timeline, no metric baseline.",
          task: "Figure out what to build and convince stakeholders it was the right thing.",
          action: "I spent week 1 interviewing 20 developers about their biggest pain points. Synthesized into a top-5 list, ranked by impact and feasibility. Found the #1 issue: slow CI builds (avg 40 minutes). Set a goal: cut CI time by 50%. Built a proposal doc, got sign-off, then built a distributed test splitting system using existing infrastructure.",
          result: "CI time dropped from 40min to 18min. 200 engineers × 5 CI runs/day × 22min saved = 3,667 engineer-hours/month. PM asked me to present at all-hands. I also left a methodology doc for how to run 'unclear project kickoffs.'",
        },
        antiPattern: "Don't say you waited for someone to clarify. Don't frame ambiguity as a blocker. Show structured thinking to create clarity yourself.",
        followUps: ["How did you prioritize among the 5 pain points?", "What would you have done if the top pain point was politically sensitive?"],
      },
      {
        id: "goog-data-driven",
        question: "Tell me about a time you used data to drive a significant decision.",
        principle: "Data Beats Opinion",
        star: {
          situation: "Team debated whether to rewrite a legacy service in Go or extend the Python version. Strong opinions on both sides.",
          task: "Move the conversation from opinion to evidence.",
          action: "I set up a benchmark: identical load test on 3 versions — current Python, refactored Python, a 2-week Go prototype I built. Measured: throughput, p99 latency, CPU cost per request, lines of code for equivalent features. Go prototype: 4x throughput, 80% cost reduction. But I also measured developer velocity: Go took 40% more code for same features.",
          result: "Data showed Go won on performance, Python won on velocity. Decision: keep Python for 80% of endpoints (low traffic, complex logic), rewrite only the 3 hot paths (high traffic, simple logic) in Go. Everyone was happy because the decision was based on trade-offs, not religion.",
        },
        antiPattern: "Don't only show data supporting your existing opinion. Present data that challenges your hypothesis — it shows intellectual honesty.",
        followUps: ["What if the data had been inconclusive?", "How long did the benchmark take and was it worth the time?"],
      },
    ],
  },
  {
    company: "Meta",
    color: "#22c55e",
    icon: "👥",
    values: [
      "Move Fast", "Focus on Long-Term Impact", "Build Awesome Things", "Live in the Future",
      "Be Direct and Respect Your Colleagues", "Meta, Metamates, Me",
    ],
    tipsheet: "Meta interviews focus on 'Move Fast' — show you can ship, iterate, and learn. They value impact at scale (billions of users). Show you can handle ambiguity and own outcomes end-to-end. Be direct — say what you think, even if it's uncomfortable. 'Metamates' = team over self. Expect questions about tradeoffs at scale, data-driven decisions, and cross-functional collaboration.",
    questions: [
      {
        id: "meta-move-fast",
        question: "Tell me about a time you shipped something quickly despite uncertainty.",
        principle: "Move Fast",
        star: {
          situation: "Competitor shipped a feature our users were requesting loudly. Leadership wanted us to match it in 2 weeks, but our PM estimated 6 weeks for 'proper' implementation.",
          task: "I was the tech lead. Ship something fast without accruing crippling tech debt.",
          action: "I proposed a phased approach: Week 1: 80% of the feature with a feature flag behind an experiment. Deliberately limited to 10% of users. Week 2: Measure metrics, fix the 3 most reported issues. Week 4: Full rollout. Week 6: Full implementation without shortcuts. I created a tech debt ticket for each shortcut I took, with estimated cleanup cost.",
          result: "Shipped to 10% in 9 days. Competitor's advantage lasted 3 weeks instead of 6. Experiment showed +7% engagement. Cleanup happened in sprint 4 as planned. Zero shortcuts remained in production after 6 weeks.",
        },
        antiPattern: "Don't say you just cut corners. Show you were deliberate about which corners and had a cleanup plan. 'Move fast' ≠ 'ship broken things permanently.'",
        followUps: ["How did you decide which shortcuts were acceptable?", "What was the metric you chose to validate the fast ship?"],
      },
      {
        id: "meta-scale",
        question: "Tell me about a time you built something that had to work at massive scale.",
        principle: "Long-Term Impact",
        star: {
          situation: "Building a notification preference system for a product going from 1M to 50M users in 6 months.",
          task: "Design the storage and delivery system to handle 50x growth without a rewrite.",
          action: "I chose horizontal scale-first: denormalized preference store per user in Redis (fast reads), async write-through to MySQL (durable). Designed the schema with a versioning field so we could add preference types without migrations. Added a preference evaluation service behind an interface so the storage layer could change independently. Load tested to 100M users before launch.",
          result: "System handled 50M users with no changes. 18 months later, team added 5 new preference types with zero schema changes. Notification delivery SLA remained 99.99% throughout. I presented the design doc at an internal tech talk; it became a reference for 3 other teams.",
        },
        antiPattern: "Don't just say 'I designed it to scale.' Show specific decisions: denormalization, horizontal partitioning, abstraction layers. Numbers matter.",
        followUps: ["How did you pick Redis over Cassandra for the preference store?", "What was your rollback plan if the load test had failed?"],
      },
    ],
  },
  {
    company: "Microsoft",
    color: "#06b6d4",
    icon: "🪟",
    values: [
      "Growth Mindset", "Customer Obsessed", "Diversity and Inclusion",
      "One Microsoft", "Making a Difference", "Respect, Integrity, Accountability",
    ],
    tipsheet: "Microsoft focuses heavily on Growth Mindset (Satya Nadella's philosophy). Show learning from failure. Collaboration over individual heroics. 'One Microsoft' = cross-team, cross-product thinking. MAANG-level bar: behavioral + system design + coding. Azure familiarity a plus. Don't bash competitors — they take their values seriously.",
    questions: [
      {
        id: "msft-growth",
        question: "Tell me about a time you failed and what you learned.",
        principle: "Growth Mindset",
        star: {
          situation: "I led a migration of our core data pipeline from on-prem to Azure. I estimated 2 months. It took 5 months and caused 2 production incidents.",
          task: "Complete the migration without breaking SLAs for our 15 downstream teams.",
          action: "My key mistake: I underestimated the number of undocumented dependencies. I learned this by discovering them one at a time as things broke. After the 2nd incident, I stopped the migration, built a dependency map using static analysis and traffic analysis, and restarted with a proper phase plan. I created a shared runbook and did weekly syncs with downstream teams.",
          result: "The last 60% of the migration was clean — zero incidents. I documented the dependency discovery process and shared it with the platform team. This approach was adopted for 2 subsequent migrations. My manager used my post-mortem as a training document for junior engineers.",
        },
        antiPattern: "Don't pick a failure that wasn't really your fault. Don't say 'I learned I should ask for help earlier' without specifics of what you actually changed. Show the learning led to concrete behavior change.",
        followUps: ["What would you do differently on day 1?", "How did you rebuild trust with the downstream teams after the incidents?"],
      },
    ],
  },
  {
    company: "Apple",
    color: "#a855f7",
    icon: "🍎",
    values: [
      "Privacy as a Human Right", "Accessibility", "Environmental Responsibility",
      "Quality over Quantity", "Radical Focus", "Inclusion and Diversity",
    ],
    tipsheet: "Apple interviews are notoriously focused on deep expertise. Be the world's best at whatever you claim. Show attention to detail — they'll probe edge cases you haven't thought of. Privacy is a core value — expect questions about how you'd handle user data. Accessibility is expected, not optional. 'Radical focus' = saying no to 1000 things. Minimal viable answers don't pass here.",
    questions: [
      {
        id: "apple-quality",
        question: "Tell me about the most complex technical challenge you've solved.",
        principle: "Quality over Quantity",
        star: {
          situation: "Our mobile app had a memory leak on iOS that only appeared on iPhone 8 and earlier, only when the user backgrounded the app while a video was playing, and only after 4+ videos in the same session.",
          task: "Reproduce, diagnose, and fix within a 2-week release cycle.",
          action: "I wrote an automated repro harness that played videos in a loop, backgrounded the app at random intervals, and logged memory samples every 500ms. After 200 test runs I found the pattern: VideoPlayer instances were being retained by a closure in the analytics callback when the app went to background. The closure captured `self` (the view controller) creating a retain cycle. Fix: weak self + explicit cleanup in `applicationWillResignActive`.",
          result: "Crash rate on iPhone 8 dropped 94% in the next release. I added the automated test harness to CI — now catches any memory regression in VideoPlayer within 10 minutes. Written up as an internal Apple Engineering blog post.",
        },
        antiPattern: "Don't describe a problem that's impressive but not your work. Don't skip the diagnosis steps — Apple wants to see methodical debugging, not luck.",
        followUps: ["How did you ensure the fix didn't introduce a different memory issue?", "How long did it take to build the automated harness?"],
      },
    ],
  },
  {
    company: "Netflix",
    color: "#ef4444",
    icon: "🎬",
    values: [
      "Judgment", "Selflessness", "Courage", "Communication",
      "Innovation", "Curiosity", "Inclusion", "Integrity", "Impact",
    ],
    tipsheet: "Netflix has the famous 'Freedom and Responsibility' culture. They hire 'stunning colleagues' and let them self-direct. Show you can operate with minimal oversight. They pay top-of-market and expect it back in results. 'Courage' = saying hard truths. They value written communication (long-form memos). Their tech stack is heavily AWS + Java + chaos engineering. No PIP culture — underperformers are given severance.",
    questions: [
      {
        id: "netflix-judgment",
        question: "Tell me about a time you made a controversial engineering decision.",
        principle: "Judgment + Courage",
        star: {
          situation: "Our team was about to adopt a popular internal framework used by 30 other Netflix teams. After 2 days of investigation, I believed it was the wrong choice for our use case.",
          task: "Recommend against the official recommended path — which would be unpopular.",
          action: "I wrote a 4-page decision doc comparing the framework against our specific requirements: low latency (< 5ms), high throughput (500K RPS), and team size (2 engineers). Framework: great DX, 12ms overhead, maintained by large team. Alternative: roll our own thin layer, 2ms overhead, 400 lines of code, 2 engineer-weeks to build. I presented at the architecture review and recommended the custom path, citing the cost at scale: 7ms × 500K RPS × 30 servers = $18K/month extra.",
          result: "Decision was controversial. I was asked to justify twice more. We shipped the custom layer. 18 months later it's still in production, 2 engineers maintain it, cost savings were $216K. The popular framework was deprecated 1 year later — choosing it would have meant a forced migration.",
        },
        antiPattern: "Don't frame this as 'I was right, everyone else was wrong.' Frame it as 'I had data, I made my case respectfully, and I committed to the outcome either way.'",
        followUps: ["What would you have done if the architecture review had overruled you?", "How did you account for the risk of maintaining custom infra?"],
      },
    ],
  },
];

export interface STARFramework {
  letter: string;
  full: string;
  description: string;
  questions: string[];
  badExample: string;
  goodExample: string;
}

export const STAR_FRAMEWORK: STARFramework[] = [
  {
    letter: "S",
    full: "Situation",
    description: "Set the context. Be specific — name the product, the scale, the timeframe. 1-2 sentences max. Don't over-explain.",
    questions: ["What was the context?", "What was the scale? (users, requests, team size, revenue)", "What made this situation challenging?"],
    badExample: "I was working at a company where we had a system...",
    goodExample: "At [Company], our payment service was processing $2M/day with 99.85% reliability — 0.15% failure rate was costing us $3K/day in failed transactions.",
  },
  {
    letter: "T",
    full: "Task",
    description: "What was YOUR specific responsibility? Use 'I' not 'we'. Why was this hard? What constraints existed?",
    questions: ["What were you personally accountable for?", "What was the deadline / constraint?", "What would failure have meant?"],
    badExample: "We needed to fix the system.",
    goodExample: "I owned the payment retry logic. We had a 2-week window before a major campaign that would 10x volume. If we failed, the campaign would be cancelled.",
  },
  {
    letter: "A",
    full: "Action",
    description: "The heart of the answer. What did YOU specifically do? Show your thinking process. Name tools, approaches, tradeoffs considered. 3-5 specific actions.",
    questions: ["What options did you consider?", "Why did you choose this approach over alternatives?", "What was hardest about this?"],
    badExample: "I investigated and found the bug and fixed it.",
    goodExample: "I added distributed tracing to identify the bottleneck — found 60% of failures were idempotency key collisions on retry. I designed a SHA-256 hash of (userId + orderId + timestamp_bucket) as the key, tested with chaos injection (10K concurrent retries), and shipped behind a feature flag to 5% traffic first.",
  },
  {
    letter: "R",
    full: "Result",
    description: "Quantified impact. Business metric, not just engineering metric. What did you learn? What happened next?",
    questions: ["What was the measurable outcome?", "What was the business impact?", "What did you learn?"],
    badExample: "It worked and the system was better.",
    goodExample: "Failure rate dropped from 0.15% to 0.02% ($2,600/day recovered). Campaign launched successfully. I wrote a post-mortem; idempotency pattern is now a standard for all payment services at the company.",
  },
];

export const COMMON_QUESTIONS = [
  { category: "Conflict", question: "Tell me about a time you had a conflict with a coworker or manager." },
  { category: "Leadership", question: "Describe a time you led a project end-to-end without being asked." },
  { category: "Failure", question: "What's the biggest mistake you've made and what did you learn?" },
  { category: "Influence", question: "Tell me about a time you influenced without authority." },
  { category: "Prioritization", question: "How do you handle competing priorities when everything is P0?" },
  { category: "Communication", question: "Tell me about a time you had to explain a complex technical concept to a non-technical audience." },
  { category: "Ambiguity", question: "Describe a project where requirements were unclear or constantly changing." },
  { category: "Innovation", question: "Tell me about a time you came up with a creative solution to a hard problem." },
  { category: "Mentorship", question: "How have you helped a colleague grow or develop their skills?" },
  { category: "Speed", question: "Tell me about a time you had to deliver something faster than expected." },
  { category: "Data", question: "Give an example of a data-driven decision you made." },
  { category: "Feedback", question: "Tell me about a time you received critical feedback. How did you respond?" },
];
