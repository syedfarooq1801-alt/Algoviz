export type ConceptDifficulty = "Fundamental" | "Intermediate" | "Advanced";
export type VizType =
  | "load-balancer"
  | "cache"
  | "replication"
  | "consistent-hashing"
  | "cap-theorem"
  | "message-queue"
  | "rate-limiter"
  | "dns"
  | "url-shortener"
  | "consensus"
  | "none";
export type CaseStudyDifficulty = "Junior" | "Mid" | "Senior" | "Staff";
export type ArchLayerType =
  | "client"
  | "cdn"
  | "lb"
  | "gateway"
  | "service"
  | "cache"
  | "db"
  | "queue"
  | "storage"
  | "search"
  | "stream";

export interface SDConcept {
  id: string;
  title: string;
  chapterId: string;
  summary: string;
  difficulty: ConceptDifficulty;
  hasVisualization: boolean;
  vizType: VizType;
  tags: string[];
}

export interface ArchLayer {
  name: string;
  type: ArchLayerType;
  connects_to: string[];
  note?: string;
}

export interface DeepDive {
  title: string;
  problem: string;
  solution: string;
}

export interface CaseStudyRef {
  id: string;
  title: string;
  chapterId: string;
  difficulty: CaseStudyDifficulty;
  companies: string[];
  hasVisualization: boolean;
  tags: string[];
}

export interface SDChapter {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  concepts: SDConcept[];
  caseStudies?: CaseStudyRef[];
}

// ─── Chapters ───────────────────────────────────────────────────────────────

export const SD_CHAPTERS: SDChapter[] = [
  {
    id: "foundations",
    title: "Foundations",
    description: "Core concepts every system design interview assumes you know cold.",
    color: "blue",
    icon: "🏗️",
    concepts: [
      { id: "scalability", title: "Scalability", chapterId: "foundations", summary: "Handle more load — vertical vs horizontal scaling.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["scale","horizontal","vertical"] },
      { id: "availability", title: "Availability & Reliability", chapterId: "foundations", summary: "Uptime measured in 9s — redundancy, failover, SLA.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["uptime","sla","redundancy"] },
      { id: "latency-vs-throughput", title: "Latency vs Throughput", chapterId: "foundations", summary: "Speed of one request vs requests per second — Little's Law.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["latency","throughput","performance"] },
      { id: "load-balancing", title: "Load Balancing", chapterId: "foundations", summary: "Distribute traffic across servers — L4 vs L7, algorithms, health checks.", difficulty: "Fundamental", hasVisualization: true, vizType: "load-balancer", tags: ["nginx","ha","traffic"] },
      { id: "caching", title: "Caching", chapterId: "foundations", summary: "Store expensive results closer to the requester — Redis, write patterns, eviction.", difficulty: "Fundamental", hasVisualization: true, vizType: "cache", tags: ["redis","memcached","lru","ttl"] },
      { id: "cdn", title: "CDN & Edge", chapterId: "foundations", summary: "Geographically distributed cache for static and dynamic content.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["cloudflare","edge","anycast"] },
      { id: "database-indexing", title: "Database Indexing", chapterId: "foundations", summary: "B-tree, hash, and composite indexes — skip the full table scan.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["btree","index","query"] },
      { id: "replication", title: "Replication", chapterId: "foundations", summary: "Multiple data copies for durability and read scale — sync vs async.", difficulty: "Fundamental", hasVisualization: true, vizType: "replication", tags: ["primary","replica","failover"] },
      { id: "sharding", title: "Sharding & Partitioning", chapterId: "foundations", summary: "Split data across machines — range, hash, directory-based.", difficulty: "Intermediate", hasVisualization: true, vizType: "consistent-hashing", tags: ["partition","horizontal","scale"] },
      { id: "cap-theorem", title: "CAP Theorem", chapterId: "foundations", summary: "Consistency, Availability, Partition tolerance — pick two.", difficulty: "Intermediate", hasVisualization: true, vizType: "cap-theorem", tags: ["consistency","availability","partition"] },
      { id: "acid-vs-base", title: "ACID vs BASE", chapterId: "foundations", summary: "Strong consistency (ACID) vs eventual consistency (BASE) — when to use each.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["transactions","consistency","nosql"] },
      { id: "message-queues", title: "Message Queues", chapterId: "foundations", summary: "Async communication — Kafka vs RabbitMQ, at-least-once, exactly-once.", difficulty: "Intermediate", hasVisualization: true, vizType: "message-queue", tags: ["kafka","rabbitmq","async","pubsub"] },
      { id: "microservices-vs-monolith", title: "Microservices vs Monolith", chapterId: "foundations", summary: "Trade deployment independence for distributed systems complexity.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["architecture","services","deploy"] },
      { id: "api-gateway", title: "API Gateway", chapterId: "foundations", summary: "Single entry point — auth, rate limiting, routing, SSL termination.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["gateway","kong","aws","routing"] },
      { id: "rate-limiting", title: "Rate Limiting", chapterId: "foundations", summary: "Token bucket, leaky bucket, sliding window — prevent abuse.", difficulty: "Intermediate", hasVisualization: true, vizType: "rate-limiter", tags: ["throttle","token-bucket","abuse"] },
      { id: "circuit-breaker", title: "Circuit Breaker", chapterId: "foundations", summary: "Open the circuit on failures to prevent cascade — closed/open/half-open states.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["resilience","failover","hystrix"] },
      { id: "observability", title: "Observability", chapterId: "foundations", summary: "Metrics, logs, traces — the three pillars of knowing what's happening.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["metrics","logging","tracing","prometheus"] },
      { id: "security-authn-authz", title: "Auth & Security", chapterId: "foundations", summary: "AuthN (prove identity) vs AuthZ (check permissions) — OAuth2, JWT, mTLS.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["oauth","jwt","security","rbac"] },
      { id: "api-styles", title: "API Styles", chapterId: "foundations", summary: "REST, GraphQL, gRPC, WebSocket — pick the right one for the job.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["rest","graphql","grpc","websocket"] },
      { id: "storage-tiers", title: "Storage Tiers", chapterId: "foundations", summary: "Memory, SSD, HDD, object storage — cost vs latency hierarchy.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["s3","storage","memory","cost"] },
    ],
  },
  {
    id: "databases",
    title: "Databases in Depth",
    description: "Deep dive into storage engines, indexing internals, and distributed database trade-offs.",
    color: "green",
    icon: "🗄️",
    concepts: [
      { id: "relational-vs-nosql", title: "Relational vs NoSQL", chapterId: "databases", summary: "Choose by query patterns, not religion — when each wins.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["sql","nosql","postgres","mongodb"] },
      { id: "nosql-types", title: "NoSQL Flavors", chapterId: "databases", summary: "Document, Key-Value, Column-family, Graph — four shapes for four problems.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["mongodb","redis","cassandra","neo4j"] },
      { id: "oltp-vs-olap", title: "OLTP vs OLAP", chapterId: "databases", summary: "Operational writes vs analytical reads — row store vs column store.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["oltp","olap","warehouse","analytics"] },
      { id: "indexing-internals", title: "Indexing Internals", chapterId: "databases", summary: "B-tree vs LSM vs Hash — storage engine trade-offs.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["btree","lsm","rocksdb","storage"] },
      { id: "transactions-isolation", title: "Transactions & Isolation", chapterId: "databases", summary: "Four isolation levels, four anomalies — MVCC prevents most.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["mvcc","isolation","acid","locks"] },
      { id: "replication-strategies", title: "Replication Strategies", chapterId: "databases", summary: "Single-leader, multi-leader, leaderless — replication lag gotchas.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["leader","follower","dynamo","quorum"] },
      { id: "sharding-strategies", title: "Sharding Strategies", chapterId: "databases", summary: "Range vs hash vs directory — resharding pain and how to avoid it.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["partition","shard","reshard","consistent-hash"] },
      { id: "distributed-databases", title: "Distributed Databases", chapterId: "databases", summary: "Spanner, CockroachDB, Cassandra, DynamoDB — global consistency trade-offs.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["spanner","cassandra","dynamodb","global"] },
      { id: "eventual-consistency", title: "Eventual Consistency", chapterId: "databases", summary: "Gossip, anti-entropy, CRDTs — converge without coordination.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["gossip","crdt","convergence","conflict"] },
      { id: "multi-region-databases", title: "Multi-Region Databases", chapterId: "databases", summary: "Active-active vs active-passive — geo-partitioning and RPO/RTO.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["geo","multi-region","dr","rpo","rto"] },
    ],
  },
  {
    id: "networking",
    title: "Networking Fundamentals",
    description: "TCP/IP, HTTP, TLS, DNS — the stack your distributed system rides on.",
    color: "cyan",
    icon: "🌐",
    concepts: [
      { id: "osi-model", title: "OSI / TCP-IP Model", chapterId: "networking", summary: "Seven-layer stack — system design cares about L3-L7.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["osi","tcp","ip","layers"] },
      { id: "tcp-udp-quic", title: "TCP vs UDP vs QUIC", chapterId: "networking", summary: "Reliable-ordered vs fire-and-forget vs HTTP/3 best-of-both.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["tcp","udp","quic","http3"] },
      { id: "http-versions", title: "HTTP/1.1 vs HTTP/2 vs HTTP/3", chapterId: "networking", summary: "Multiplexing, server push, QUIC — each version's bottleneck fix.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["http","http2","http3","multiplexing"] },
      { id: "tls-handshake", title: "TLS & mTLS", chapterId: "networking", summary: "1-RTT TLS 1.3 handshake — certificate chains, SNI, mutual auth.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["tls","ssl","mtls","certificates"] },
      { id: "dns-resolution", title: "DNS Resolution", chapterId: "networking", summary: "Recursive resolver chain — caching, anycast, GeoDNS load balancing.", difficulty: "Fundamental", hasVisualization: true, vizType: "dns", tags: ["dns","resolver","anycast","ttl"] },
      { id: "proxies-nat", title: "Proxies & NAT", chapterId: "networking", summary: "Forward proxy (client-side) vs reverse proxy (server-side) — NAT translation.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["proxy","nginx","nat","reverse-proxy"] },
      { id: "connection-pooling", title: "Connection Pooling", chapterId: "networking", summary: "Reuse open DB connections — pool sizing formula, PgBouncer.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["pool","pgbouncer","connections","overhead"] },
      { id: "tail-latency", title: "Tail Latency", chapterId: "networking", summary: "P99 outliers that kill SLAs — hedged requests, fan-out amplification.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["p99","p999","latency","hedged"] },
    ],
  },
  {
    id: "interview-framework",
    title: "Interview Framework",
    description: "The 45-minute clock, 6-step process, and what MAANG interviewers actually look for.",
    color: "orange",
    icon: "🎤",
    concepts: [
      { id: "45-minute-clock", title: "The 45-Minute Clock", chapterId: "interview-framework", summary: "Time-box each phase or you'll run out before architecture is done.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["interview","time","structure"] },
      { id: "clarify-requirements", title: "Clarifying Requirements", chapterId: "interview-framework", summary: "Functional vs non-functional — never assume DAU, QPS, or data size.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["requirements","dau","qps","clarify"] },
      { id: "back-of-envelope", title: "Back-of-Envelope Estimation", chapterId: "interview-framework", summary: "Order-of-magnitude math that proves you understand scale.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["estimation","math","qps","storage"] },
      { id: "api-data-model", title: "API & Data Model Design", chapterId: "interview-framework", summary: "Define the contract and schema before drawing boxes — drives architecture.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["api","schema","rest","database"] },
      { id: "high-level-architecture", title: "High-Level Architecture", chapterId: "interview-framework", summary: "Boxes and arrows — client → CDN → LB → services → cache → DB.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["architecture","hld","diagram","design"] },
      { id: "deep-dives", title: "Deep Dives", chapterId: "interview-framework", summary: "Pick the 2-3 hardest problems and go deep — what interviewers probe.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["deep-dive","bottleneck","scale","interview"] },
      { id: "tradeoffs-failure-monitoring", title: "Tradeoffs & Failure Modes", chapterId: "interview-framework", summary: "Every design choice has a cost — say tradeoffs out loud, mention SPOFs.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["tradeoffs","spof","monitoring","failure"] },
      { id: "communication-patterns", title: "Communication Patterns", chapterId: "interview-framework", summary: "How you talk matters as much as what you say — propose, explain, move on.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["communication","interview","soft-skills"] },
      { id: "red-flags", title: "Common Red Flags", chapterId: "interview-framework", summary: "Mistakes that signal inexperience — over-engineering, no failure handling.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["mistakes","anti-patterns","interview"] },
      { id: "level-expectations", title: "Level Expectations", chapterId: "interview-framework", summary: "Junior → Mid → Senior → Staff — what bar each level must clear.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["levels","sde","staff","senior"] },
    ],
  },
  {
    id: "case-studies",
    title: "Case Studies",
    description: "28 real system designs from URL shorteners to Netflix — structured walkthrough of each.",
    color: "purple",
    icon: "📐",
    concepts: [],
    caseStudies: [
      { id: "url-shortener", title: "URL Shortener (TinyURL/bit.ly)", chapterId: "case-studies", difficulty: "Junior", companies: ["Amazon","Google","Meta"], hasVisualization: true, tags: ["hashing","redirect","base62"] },
      { id: "pastebin", title: "Pastebin", chapterId: "case-studies", difficulty: "Junior", companies: ["Amazon","Microsoft"], hasVisualization: false, tags: ["blob","storage","expiry"] },
      { id: "distributed-cache", title: "Distributed Cache (Redis)", chapterId: "case-studies", difficulty: "Mid", companies: ["Meta","Twitter","Uber"], hasVisualization: false, tags: ["cache","eviction","consistent-hash"] },
      { id: "rate-limiter-system", title: "API Rate Limiter", chapterId: "case-studies", difficulty: "Mid", companies: ["Stripe","Cloudflare","Twilio"], hasVisualization: false, tags: ["rate-limit","token-bucket","redis"] },
      { id: "notification-system", title: "Notification System", chapterId: "case-studies", difficulty: "Mid", companies: ["Meta","Uber","Airbnb"], hasVisualization: false, tags: ["push","sms","email","async"] },
      { id: "logging-pipeline", title: "Logging & Metrics Pipeline", chapterId: "case-studies", difficulty: "Senior", companies: ["Google","Amazon","Meta"], hasVisualization: false, tags: ["kafka","elasticsearch","analytics"] },
      { id: "job-scheduler", title: "Distributed Job Scheduler", chapterId: "case-studies", difficulty: "Senior", companies: ["Airbnb","LinkedIn","Netflix"], hasVisualization: false, tags: ["cron","queue","distributed"] },
      { id: "web-crawler", title: "Web Crawler", chapterId: "case-studies", difficulty: "Mid", companies: ["Google","Bing","Amazon"], hasVisualization: false, tags: ["crawler","queue","dedup"] },
      { id: "search-engine", title: "Search Engine (Typeahead)", chapterId: "case-studies", difficulty: "Senior", companies: ["Google","Meta","Uber"], hasVisualization: false, tags: ["trie","inverted-index","suggest"] },
      { id: "twitter-feed", title: "Twitter / X Feed", chapterId: "case-studies", difficulty: "Senior", companies: ["Twitter","Meta","LinkedIn"], hasVisualization: false, tags: ["feed","fanout","celebrity"] },
      { id: "facebook-feed", title: "Facebook News Feed", chapterId: "case-studies", difficulty: "Senior", companies: ["Meta","LinkedIn"], hasVisualization: false, tags: ["feed","ranking","social-graph"] },
      { id: "instagram", title: "Instagram Photos", chapterId: "case-studies", difficulty: "Mid", companies: ["Meta","Snapchat"], hasVisualization: false, tags: ["cdn","object-storage","feed"] },
      { id: "whatsapp", title: "WhatsApp Messaging", chapterId: "case-studies", difficulty: "Senior", companies: ["Meta","Telegram","Signal"], hasVisualization: false, tags: ["chat","websocket","e2e"] },
      { id: "discord", title: "Discord (Chat + Voice)", chapterId: "case-studies", difficulty: "Senior", companies: ["Discord","Slack","Teams"], hasVisualization: false, tags: ["websocket","guilds","voice"] },
      { id: "zoom", title: "Zoom / Video Conferencing", chapterId: "case-studies", difficulty: "Staff", companies: ["Zoom","Google","Cisco"], hasVisualization: false, tags: ["webrtc","sfu","mcu","video"] },
      { id: "youtube", title: "YouTube / Video Streaming", chapterId: "case-studies", difficulty: "Senior", companies: ["Google","Netflix","Twitch"], hasVisualization: false, tags: ["streaming","cdn","transcoding"] },
      { id: "netflix", title: "Netflix Streaming", chapterId: "case-studies", difficulty: "Senior", companies: ["Netflix","Disney+","Hulu"], hasVisualization: false, tags: ["streaming","recommendation","cdn","adaptive"] },
      { id: "spotify-rec", title: "Spotify Recommendations", chapterId: "case-studies", difficulty: "Staff", companies: ["Spotify","Apple","Amazon"], hasVisualization: false, tags: ["ml","recommendation","collaborative-filtering"] },
      { id: "uber", title: "Uber Ride-Sharing", chapterId: "case-studies", difficulty: "Senior", companies: ["Uber","Lyft","DoorDash"], hasVisualization: false, tags: ["geo","matching","websocket","real-time"] },
      { id: "food-delivery", title: "Food Delivery (DoorDash)", chapterId: "case-studies", difficulty: "Senior", companies: ["DoorDash","Uber Eats","GrubHub"], hasVisualization: false, tags: ["geo","matching","order","tracking"] },
      { id: "google-drive", title: "Google Drive / File Storage", chapterId: "case-studies", difficulty: "Senior", companies: ["Google","Dropbox","Box"], hasVisualization: false, tags: ["storage","chunking","sync","delta"] },
      { id: "dropbox", title: "Dropbox Sync", chapterId: "case-studies", difficulty: "Senior", companies: ["Dropbox","OneDrive","iCloud"], hasVisualization: false, tags: ["sync","delta","chunking","conflict"] },
      { id: "reddit", title: "Reddit (Votes + Feed)", chapterId: "case-studies", difficulty: "Mid", companies: ["Reddit","HackerNews"], hasVisualization: false, tags: ["votes","ranking","feed","karma"] },
      { id: "google-docs", title: "Google Docs (Real-time Collab)", chapterId: "case-studies", difficulty: "Staff", companies: ["Google","Notion","Figma"], hasVisualization: false, tags: ["ot","crdt","real-time","collaboration"] },
      { id: "ad-serving", title: "Ad Serving System", chapterId: "case-studies", difficulty: "Staff", companies: ["Google","Meta","Amazon"], hasVisualization: false, tags: ["ads","bidding","targeting","real-time"] },
      { id: "payment-gateway", title: "Payment Gateway", chapterId: "case-studies", difficulty: "Senior", companies: ["Stripe","PayPal","Square"], hasVisualization: false, tags: ["payments","idempotency","saga","compliance"] },
      { id: "amazon-ecommerce", title: "Amazon E-Commerce", chapterId: "case-studies", difficulty: "Staff", companies: ["Amazon","Shopify","eBay"], hasVisualization: false, tags: ["catalog","inventory","order","cart"] },
      { id: "kv-store", title: "Distributed KV Store (Dynamo)", chapterId: "case-studies", difficulty: "Staff", companies: ["Amazon","LinkedIn","Etsy"], hasVisualization: false, tags: ["dynamo","quorum","consistent-hash","vector-clock"] },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Distributed Systems",
    description: "Consensus algorithms, CRDTs, Kafka internals, and multi-region architecture.",
    color: "red",
    icon: "⚙️",
    concepts: [
      { id: "paxos-raft", title: "Paxos & Raft Consensus", chapterId: "advanced", summary: "How distributed nodes agree on a value — leader election, log replication.", difficulty: "Advanced", hasVisualization: true, vizType: "consensus", tags: ["raft","paxos","consensus","leader"] },
      { id: "consistent-hashing", title: "Consistent Hashing", chapterId: "advanced", summary: "Hash ring — add/remove nodes with minimal key movement.", difficulty: "Intermediate", hasVisualization: true, vizType: "consistent-hashing", tags: ["ring","vnodes","cassandra","dynamo"] },
      { id: "gossip-crdt", title: "Gossip & CRDTs", chapterId: "advanced", summary: "Epidemic propagation + merge-friendly data types for eventual consistency.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["gossip","crdt","eventual","merge"] },
      { id: "saga-2pc", title: "Distributed Transactions (Saga / 2PC)", chapterId: "advanced", summary: "Two-phase commit blocks; Sagas compensate — choreography vs orchestration.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["saga","2pc","compensation","transaction"] },
      { id: "cqrs-event-sourcing", title: "CQRS & Event Sourcing", chapterId: "advanced", summary: "Separate read/write models — store events not state, audit trail free.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["cqrs","event-sourcing","projections","kafka"] },
      { id: "kafka-internals", title: "Kafka Internals", chapterId: "advanced", summary: "Partitioned durable log — producers, consumers, offsets, compaction.", difficulty: "Advanced", hasVisualization: true, vizType: "message-queue", tags: ["kafka","topic","partition","offset","consumer"] },
      { id: "multi-region-geo", title: "Multi-Region Architecture", chapterId: "advanced", summary: "Active-active vs active-passive — geo-routing, RPO/RTO, conflict resolution.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["multi-region","active-active","geo","dr"] },
      { id: "distributed-caching-scale", title: "Caching at Scale", chapterId: "advanced", summary: "Hot keys, thundering herd, cache warming — production cache problems.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["hotkey","thundering-herd","warming","redis-cluster"] },
      { id: "data-lake-warehouse", title: "Data Lake & Warehouse", chapterId: "advanced", summary: "Lake (raw S3 + Spark) vs Warehouse (columnar, queryable) vs Lakehouse.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["datalake","redshift","bigquery","spark","iceberg"] },
      { id: "kubernetes-service-mesh", title: "Kubernetes & Service Mesh", chapterId: "advanced", summary: "Container orchestration + Istio sidecar for mTLS, circuit breaking, observability.", difficulty: "Advanced", hasVisualization: false, vizType: "none", tags: ["kubernetes","istio","sidecar","service-mesh"] },
    ],
  },
  {
    id: "toolkit",
    title: "Interview Prep Toolkit",
    description: "Top 50 MAANG questions, mock walkthroughs, and sample answer scripts.",
    color: "amber",
    icon: "🧰",
    concepts: [
      { id: "top-50-questions", title: "Top 50 MAANG Questions", chapterId: "toolkit", summary: "The questions you'll actually see at Google, Meta, Amazon, Apple, Netflix.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["interview","maang","faang","list"] },
      { id: "mock-walkthrough", title: "Mock Interview Walkthroughs", chapterId: "toolkit", summary: "Full end-to-end walkthroughs with sample dialogue and decision rationale.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["mock","walkthrough","practice","dialogue"] },
      { id: "question-types", title: "Question Type Classification", chapterId: "toolkit", summary: "Storage, real-time, social graph, ML serving — map any question to a pattern.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["classification","pattern","storage","real-time"] },
    ],
  },
  {
    id: "cheat-sheets",
    title: "Cheat Sheets",
    description: "Numbers to memorize, decision matrices, and patterns by problem type.",
    color: "teal",
    icon: "📋",
    concepts: [
      { id: "numbers-to-know", title: "Numbers Every Engineer Knows", chapterId: "cheat-sheets", summary: "Latencies, capacities, and back-of-envelope constants — commit these to memory.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["numbers","latency","capacity","memory"] },
      { id: "decision-matrix", title: "Database Decision Matrix", chapterId: "cheat-sheets", summary: "SQL vs NoSQL, type of NoSQL, replication strategy — guided by requirements.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["database","decision","matrix","choose"] },
      { id: "patterns-by-problem", title: "Patterns by Problem Type", chapterId: "cheat-sheets", summary: "Social feed? Fan-out. File sync? Chunking + delta. Match each problem to pattern.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["patterns","mapping","problem-types","reference"] },
    ],
  },
  {
    id: "mental-models",
    title: "Mental Models",
    description: "Repeatable 8-step scaling process and the 'what would break first' heuristic.",
    color: "violet",
    icon: "🧠",
    concepts: [
      { id: "8-scaling-moves", title: "The 8 Scaling Moves", chapterId: "mental-models", summary: "Every scaling problem reduces to one of 8 moves — know them cold.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["scaling","moves","framework","heuristic"] },
      { id: "what-breaks-first", title: "'What Would Break First?'", chapterId: "mental-models", summary: "Find the bottleneck before the interviewer does — systematic stress-testing.", difficulty: "Intermediate", hasVisualization: false, vizType: "none", tags: ["bottleneck","spof","failure","analysis"] },
      { id: "repeatable-model", title: "Repeatable Design Model", chapterId: "mental-models", summary: "A single mental template that works for 90% of system design questions.", difficulty: "Fundamental", hasVisualization: false, vizType: "none", tags: ["template","model","framework","design"] },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getChapterById(id: string): SDChapter | undefined {
  return SD_CHAPTERS.find((c) => c.id === id);
}

export function getConceptById(id: string): SDConcept | undefined {
  for (const ch of SD_CHAPTERS) {
    const found = ch.concepts.find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getCaseStudyRefById(id: string): CaseStudyRef | undefined {
  for (const ch of SD_CHAPTERS) {
    const found = ch.caseStudies?.find((cs) => cs.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getAllConcepts(): SDConcept[] {
  return SD_CHAPTERS.flatMap((ch) => ch.concepts);
}

export function getAllCaseStudyRefs(): CaseStudyRef[] {
  return SD_CHAPTERS.flatMap((ch) => ch.caseStudies ?? []);
}

export function getTotalSDConcepts(): number {
  return getAllConcepts().length;
}

export function getTotalCaseStudies(): number {
  return getAllCaseStudyRefs().length;
}
