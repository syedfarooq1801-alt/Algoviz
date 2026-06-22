"use client";
import { useEffect, useState } from "react";

const SERVERS = ["Server A", "Server B", "Server C"];
const ALGORITHMS = ["Round Robin", "Least Connections", "IP Hash"];

export default function LoadBalancerViz() {
  const [tick, setTick] = useState(0);
  const [requests, setRequests] = useState<{ id: number; server: number; y: number; done: boolean }[]>([]);
  const [loads, setLoads] = useState([0, 0, 0]);
  const [algo, setAlgo] = useState(0);
  const [rrIdx, setRrIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((p) => p + 1);

      setRequests((prev) => {
        // advance existing
        const moved = prev.map((r) => ({ ...r, y: r.y + 12, done: r.y + 12 > 80 }));
        const kept = moved.filter((r) => !r.done);

        // new request
        const newId = Date.now() % 10000;
        let targetServer = 0;
        setAlgo((a) => {
          if (a === 0) {
            setRrIdx((ri) => { targetServer = ri % 3; return (ri + 1) % 3; });
          } else if (a === 1) {
            setLoads((ld) => { targetServer = ld.indexOf(Math.min(...ld)); return ld; });
          } else {
            targetServer = newId % 3;
          }
          return a;
        });

        setLoads((ld) => {
          const next = [...ld];
          next[targetServer] = Math.min(next[targetServer] + 1, 9);
          moved.filter((r) => r.done).forEach((r) => { next[r.server] = Math.max(0, next[r.server] - 1); });
          return next;
        });

        return [...kept, { id: newId, server: targetServer, y: 0, done: false }].slice(-8);
      });

      if (tick % 15 === 0) setAlgo((a) => (a + 1) % 3);
    }, 600);
    return () => clearInterval(id);
  }, [tick]);

  const colors = ["#4f8ef7", "#22c55e", "#f97316"];

  return (
    <div className="space-y-4 select-none">
      {/* Algorithm badge */}
      <div className="flex justify-center gap-2">
        {ALGORITHMS.map((a, i) => (
          <span key={a} className="text-xs px-2 py-1 rounded-md font-medium transition-all"
            style={{ background: algo === i ? "rgba(168,85,247,0.2)" : "transparent", color: algo === i ? "#a855f7" : "var(--text-muted)", border: `1px solid ${algo === i ? "rgba(168,85,247,0.4)" : "var(--border)"}` }}>
            {a}
          </span>
        ))}
      </div>

      {/* Main diagram */}
      <div className="relative" style={{ height: 260 }}>
        {/* Client */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 px-4 py-2 rounded-lg text-xs font-semibold"
          style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e" }}>
          🌐 Clients
        </div>

        {/* Load Balancer */}
        <div className="absolute left-1/2 -translate-x-1/2 top-16 px-5 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: "rgba(79,142,247,0.15)", border: "2px solid rgba(79,142,247,0.5)", color: "#4f8ef7" }}>
          ⚖️ Load Balancer
        </div>

        {/* Servers */}
        {SERVERS.map((s, i) => {
          const left = i === 0 ? "12%" : i === 1 ? "42%" : "72%";
          const load = loads[i];
          const pct = (load / 9) * 100;
          return (
            <div key={s} className="absolute rounded-xl p-2 text-center" style={{ left, top: 170, width: 90,
              background: `${colors[i]}12`, border: `1.5px solid ${colors[i]}50`, color: colors[i] }}>
              <div className="text-xs font-semibold mb-1">{s}</div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, background: pct > 70 ? "#ef4444" : colors[i] }} />
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{load} req</div>
            </div>
          );
        })}

        {/* Request particles */}
        {requests.map((r) => {
          const serverX = r.server === 0 ? 13 : r.server === 1 ? 43 : 73;
          const progress = r.y / 80;
          const x = 50 + (serverX - 50) * progress;
          return (
            <div key={r.id} className="absolute w-2 h-2 rounded-full transition-all"
              style={{ left: `${x}%`, top: `${40 + r.y}px`, background: colors[r.server], boxShadow: `0 0 6px ${colors[r.server]}`, transform: "translate(-50%,-50%)" }} />
          );
        })}
      </div>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Algorithm rotates every 15 requests — watch traffic distribution change
      </p>
    </div>
  );
}
