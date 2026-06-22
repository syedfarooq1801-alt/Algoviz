"use client";
import { useState, useEffect, useRef } from "react";

const DEFAULT_N = 4;
const DEFAULT_PREREQS = [[1,0],[2,0],[3,1],[3,2]]; // [course, prereq]

type NodeState = "unvisited" | "visiting" | "visited" | "cycle";

export default function CourseScheduleViz() {
  const [n, setN] = useState(DEFAULT_N);
  const [prereqs, setPrereqs] = useState(DEFAULT_PREREQS);
  const [prereqInput, setPrereqInput] = useState("[[1,0],[2,0],[3,1],[3,2]]");
  const [nInput, setNInput] = useState(String(DEFAULT_N));
  const [nodeStates, setNodeStates] = useState<NodeState[]>(Array(DEFAULT_N).fill("unvisited"));
  const [topoOrder, setTopoOrder] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [hasCycle, setHasCycle] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const stepsRef = useRef<{ states: NodeState[]; curr: number | null; order: number[]; cycle: boolean | null; msg: string }[]>([]);
  const stepIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function buildSteps(numCourses: number, edges: number[][]) {
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of edges) adj[prereq].push(course);

    const states: NodeState[] = Array(numCourses).fill("unvisited");
    const order: number[] = [];
    const steps: typeof stepsRef.current = [];
    let foundCycle = false;

    steps.push({ states: [...states], curr: null, order: [...order], cycle: null, msg: "Build adjacency list. Start DFS from each unvisited node." });

    function dfs(node: number) {
      if (foundCycle) return;
      states[node] = "visiting";
      steps.push({ states: [...states], curr: node, order: [...order], cycle: null, msg: `DFS: node ${node} → state=VISITING (gray — in current path)` });

      for (const neighbor of adj[node]) {
        if (foundCycle) return;
        if (states[neighbor] === "visiting") {
          foundCycle = true;
          states[neighbor] = "cycle";
          steps.push({ states: [...states], curr: neighbor, order: [...order], cycle: true, msg: `CYCLE DETECTED: ${node} → ${neighbor} but ${neighbor} is already VISITING → cycle!` });
          return;
        }
        if (states[neighbor] === "unvisited") {
          steps.push({ states: [...states], curr: neighbor, order: [...order], cycle: null, msg: `Explore edge ${node} → ${neighbor}` });
          dfs(neighbor);
        }
      }

      if (!foundCycle) {
        states[node] = "visited";
        order.push(node);
        steps.push({ states: [...states], curr: node, order: [...order], cycle: false, msg: `Node ${node} fully explored → VISITED. Added to topo order.` });
      }
    }

    for (let i = 0; i < numCourses; i++) {
      if (states[i] === "unvisited" && !foundCycle) {
        steps.push({ states: [...states], curr: i, order: [...order], cycle: null, msg: `Start DFS from unvisited node ${i}` });
        dfs(i);
      }
    }

    if (!foundCycle) {
      steps.push({ states: [...states], curr: null, order: [...order], cycle: false, msg: `No cycle found! Can complete all courses. Order: [${[...order].reverse().join(" → ")}]` });
    }
    return steps;
  }

  const reset = (numCourses = n, edges = prereqs) => {
    const steps = buildSteps(numCourses, edges);
    stepsRef.current = steps;
    stepIdxRef.current = 0;
    setNodeStates(Array(numCourses).fill("unvisited"));
    setTopoOrder([]);
    setCurrentNode(null);
    setHasCycle(null);
    setLog([]);
    setDone(false);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => { reset(); }, []);

  const doStep = () => {
    const idx = stepIdxRef.current;
    if (idx >= stepsRef.current.length) { setDone(true); setPlaying(false); return; }
    const s = stepsRef.current[idx];
    setNodeStates([...s.states]);
    setCurrentNode(s.curr);
    setTopoOrder([...s.order]);
    if (s.cycle !== null) setHasCycle(s.cycle);
    setLog((p) => [...p.slice(-8), s.msg]);
    stepIdxRef.current = idx + 1;
    if (idx + 1 >= stepsRef.current.length) setDone(true);
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(doStep, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const apply = () => {
    try {
      const num = parseInt(nInput, 10);
      const edges = JSON.parse(prereqInput) as number[][];
      setN(num); setPrereqs(edges);
      reset(num, edges);
    } catch {}
  };

  // Node positions in a circle
  const W = 320, H = 260, cx = W / 2, cy = H / 2, r = 100;
  const nodePositions = Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const stateColor: Record<NodeState, { fill: string; stroke: string; text: string }> = {
    unvisited: { fill: "var(--bg-hover)", stroke: "var(--border)", text: "var(--text-primary)" },
    visiting:  { fill: "rgba(249,115,22,0.2)", stroke: "#f97316", text: "#f97316" },
    visited:   { fill: "rgba(34,197,94,0.2)", stroke: "#22c55e", text: "#22c55e" },
    cycle:     { fill: "rgba(239,68,68,0.3)", stroke: "#ef4444", text: "#ef4444" },
  };

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [course, prereq] of prereqs) if (prereq < n && course < n) adj[prereq].push(course);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Course Schedule — Cycle Detection (DFS Topological Sort)
        </h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Courses (n):</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "50px" }}
              value={nInput} onChange={(e) => setNInput(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>Prerequisites [[a,b],...]:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", width: "220px" }}
              value={prereqInput} onChange={(e) => setPrereqInput(e.target.value)} />
          </div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPlaying(!playing)} disabled={done}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? "#ef4444" : "#22c55e", border: `1px solid ${playing ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>→ Step</button>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>↺ Reset</button>
          <div className="flex items-center gap-2">
            <input type="range" min="200" max="1500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: "80px", accentColor: "#4f8ef7" }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Graph SVG */}
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>
            Directed Graph (edge = must take prereq first)
          </div>
          <svg width={W} height={H} style={{ overflow: "visible" }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#4f8ef7" />
              </marker>
              <marker id="arrowhead-cycle" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
              </marker>
            </defs>

            {/* Edges */}
            {adj.map((neighbors, from) =>
              neighbors.map((to) => {
                const p1 = nodePositions[from];
                const p2 = nodePositions[to];
                const dx = p2.x - p1.x, dy = p2.y - p1.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const nx = dx/dist, ny = dy/dist;
                const R = 18;
                const isCycleEdge = nodeStates[to] === "cycle";
                return (
                  <line key={`${from}-${to}`}
                    x1={p1.x + nx*R} y1={p1.y + ny*R}
                    x2={p2.x - nx*R} y2={p2.y - ny*R}
                    stroke={isCycleEdge ? "#ef4444" : "#4f8ef7"}
                    strokeWidth={isCycleEdge ? 2 : 1.5}
                    markerEnd={isCycleEdge ? "url(#arrowhead-cycle)" : "url(#arrowhead)"}
                    opacity={0.7}
                  />
                );
              })
            )}

            {/* Nodes */}
            {nodePositions.map((pos, i) => {
              const sc = stateColor[nodeStates[i]] ?? stateColor.unvisited;
              const isCurr = currentNode === i;
              return (
                <g key={i}>
                  <circle cx={pos.x} cy={pos.y} r={isCurr ? 22 : 18}
                    fill={sc.fill} stroke={sc.stroke} strokeWidth={isCurr ? 2.5 : 1.5}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <text x={pos.x} y={pos.y+1} textAnchor="middle" dominantBaseline="middle"
                    fill={sc.text} fontSize="13" fontWeight="700" fontFamily="monospace">
                    {i}
                  </text>
                  {isCurr && (
                    <circle cx={pos.x} cy={pos.y} r={26} fill="none" stroke={sc.stroke} strokeWidth="1" strokeDasharray="3,2" opacity={0.5} />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex gap-3 flex-wrap mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            {(["unvisited","visiting","visited","cycle"] as NodeState[]).map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ background: stateColor[s].fill, border: `1px solid ${stateColor[s].stroke}` }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State + log */}
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Node States</div>
            <div className="flex flex-wrap gap-2">
              {nodeStates.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: stateColor[s].fill, border: `1.5px solid ${stateColor[s].stroke}`, color: stateColor[s].text }}>
                    {i}
                  </div>
                  <span style={{ fontSize: "9px", color: stateColor[s].stroke }}>{s.slice(0,4)}</span>
                </div>
              ))}
            </div>
          </div>

          {topoOrder.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-xs mb-2 font-semibold" style={{ color: "#22c55e" }}>Topological Order (reversed finish)</div>
              <div className="flex gap-1 flex-wrap">
                {[...topoOrder].reverse().map((node, i) => (
                  <span key={i} className="px-2 py-1 rounded text-xs font-mono" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>DFS Log</div>
            <div className="space-y-1 text-xs font-mono" style={{ maxHeight: "130px", overflowY: "auto" }}>
              {log.map((l, i) => (
                <div key={i} style={{ color: l.includes("CYCLE") ? "#ef4444" : l.includes("VISITED") ? "#22c55e" : l.includes("VISITING") ? "#f97316" : "var(--text-secondary)" }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {done && hasCycle !== null && (
        <div className="rounded-xl p-4 text-center" style={{
          background: hasCycle ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
          border: `1px solid ${hasCycle ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
        }}>
          <div className="font-semibold text-sm" style={{ color: hasCycle ? "#ef4444" : "#22c55e" }}>
            {hasCycle ? "✗ Cycle detected — cannot complete all courses!" : `✓ No cycle — can finish all ${n} courses!`}
          </div>
          {!hasCycle && topoOrder.length > 0 && (
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Order: {[...topoOrder].reverse().join(" → ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
