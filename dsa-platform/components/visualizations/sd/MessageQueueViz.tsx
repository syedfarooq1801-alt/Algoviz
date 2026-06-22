"use client";
import { useEffect, useState } from "react";

interface Message { id: number; topic: string; payload: string; offset: number; consumed: boolean }

const TOPICS = [
  { name: "orders", color: "#4f8ef7", emoji: "🛒" },
  { name: "payments", color: "#22c55e", emoji: "💳" },
  { name: "notifications", color: "#a855f7", emoji: "🔔" },
];
const CONSUMERS = ["Order Service", "Analytics", "Audit Log"];

export default function MessageQueueViz() {
  const [queues, setQueues] = useState<Record<string, Message[]>>({ orders: [], payments: [], notifications: [] });
  const [offsets, setOffsets] = useState<Record<string, number>>({ orders: 0, payments: 0, notifications: 0 });
  const [processing, setProcessing] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const topic = TOPICS[t % TOPICS.length];
        const payloads = { orders: ["order #" + (t * 7 + 1), "order #" + (t * 3 + 5)], payments: ["$" + (t * 11 + 20), "refund $5"], notifications: ["email", "push"] };
        const payload = (payloads[topic.name as keyof typeof payloads] as string[])[t % 2];

        // Produce
        const msgId = t * 10 + Math.floor(Math.random() * 9);
        setQueues((prev) => {
          const q = prev[topic.name];
          const newMsg: Message = { id: msgId, topic: topic.name, payload, offset: q.length, consumed: false };
          return { ...prev, [topic.name]: [...q, newMsg].slice(-5) };
        });

        // Consume after delay
        setTimeout(() => {
          setProcessing(`${CONSUMERS[t % 3]} consuming ${topic.name}`);
          setQueues((prev) => {
            const q = prev[topic.name];
            if (q.length === 0) return prev;
            const [first, ...rest] = q;
            return { ...prev, [topic.name]: [{ ...first, consumed: true }, ...rest.slice(0, 4)] };
          });
          setOffsets((prev) => ({ ...prev, [topic.name]: prev[topic.name] + 1 }));
          setTimeout(() => setProcessing(null), 500);
        }, 600);

        return t + 1;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      {/* Topics */}
      {TOPICS.map((topic) => {
        const msgs = queues[topic.name];
        return (
          <div key={topic.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${topic.color}30` }}>
            <div className="flex items-center justify-between px-4 py-2" style={{ background: `${topic.color}10`, borderBottom: `1px solid ${topic.color}20` }}>
              <span className="text-xs font-semibold" style={{ color: topic.color }}>{topic.emoji} {topic.name}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>offset: {offsets[topic.name]} consumed</span>
            </div>
            <div className="flex gap-2 px-3 py-2 items-center min-h-12 overflow-hidden" style={{ background: "rgba(0,0,0,0.15)" }}>
              {/* Producer side */}
              <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>Producer →</span>
              {/* Messages */}
              <div className="flex gap-1.5 flex-1 overflow-hidden">
                {msgs.map((m) => (
                  <div key={m.id} className="shrink-0 px-2 py-1 rounded text-xs font-mono transition-all"
                    style={{
                      background: m.consumed ? "rgba(34,197,94,0.08)" : `${topic.color}15`,
                      border: `1px solid ${m.consumed ? "rgba(34,197,94,0.3)" : `${topic.color}40`}`,
                      color: m.consumed ? "#22c55e" : topic.color,
                      opacity: m.consumed ? 0.5 : 1,
                      textDecoration: m.consumed ? "line-through" : "none",
                    }}>
                    {m.payload}
                  </div>
                ))}
                {msgs.length === 0 && <span className="text-xs" style={{ color: "var(--border)" }}>empty</span>}
              </div>
              {/* Consumer side */}
              <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>→ Consumer</span>
            </div>
          </div>
        );
      })}

      {/* Processing indicator */}
      <div className="rounded-lg px-4 py-2 text-xs text-center transition-all duration-300"
        style={{ background: processing ? "rgba(168,85,247,0.1)" : "rgba(0,0,0,0.1)", border: `1px solid ${processing ? "rgba(168,85,247,0.3)" : "var(--border-subtle)"}`, color: processing ? "#a855f7" : "var(--text-muted)", minHeight: 32 }}>
        {processing ?? "Waiting for messages..."}
      </div>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Producers write to topics. Consumers read at their own pace using offsets. Messages persist until TTL.
      </p>
    </div>
  );
}
