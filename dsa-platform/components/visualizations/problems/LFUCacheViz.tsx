"use client";
import { useState } from "react";

interface Entry { key: number; val: number; freq: number }

function useLFU(cap: number) {
  const [cache, setCache] = useState<Map<number, Entry>>(new Map());
  const [freqMap, setFreqMap] = useState<Map<number, number[]>>(new Map());
  const [minFreq, setMinFreq] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const get = (key: number) => {
    setCache(prev => {
      const c = new Map(prev);
      if (!c.has(key)) { setLog(l => [...l, `get(${key}) → -1 (miss)`]); return prev; }
      const e = { ...c.get(key)! };
      setLog(l => [...l, `get(${key}) → ${e.val} (freq ${e.freq}→${e.freq + 1})`]);
      setFreqMap(fm => {
        const nfm = new Map(fm);
        const old = nfm.get(e.freq)?.filter(k => k !== key) ?? [];
        if (old.length) nfm.set(e.freq, old); else nfm.delete(e.freq);
        e.freq++;
        nfm.set(e.freq, [key, ...(nfm.get(e.freq) ?? [])]);
        return nfm;
      });
      setMinFreq(mf => {
        const newMf = (freqMap.get(mf)?.filter(k => k !== key) ?? []).length === 0 ? mf + 1 : mf;
        return newMf;
      });
      e.freq++;
      c.set(key, e);
      return c;
    });
  };

  const put = (key: number, val: number) => {
    if (cap === 0) return;
    setCache(prev => {
      const c = new Map(prev);
      setFreqMap(prevFm => {
        const fm = new Map(prevFm);
        if (c.has(key)) {
          const e = { ...c.get(key)!, val };
          const old = fm.get(e.freq)?.filter(k => k !== key) ?? [];
          if (old.length) fm.set(e.freq, old); else fm.delete(e.freq);
          e.freq++;
          fm.set(e.freq, [key, ...(fm.get(e.freq) ?? [])]);
          c.set(key, e);
          setMinFreq(mf => (prevFm.get(mf)?.filter(k => k !== key) ?? []).length === 0 ? mf + 1 : mf);
          setLog(l => [...l, `put(${key},${val}) update (freq→${e.freq})`]);
        } else {
          if (c.size >= cap) {
            const evict = (fm.get(minFreq) ?? []).pop()!;
            if ((fm.get(minFreq) ?? []).length === 0) fm.delete(minFreq);
            c.delete(evict);
            setLog(l => [...l, `put(${key},${val}) evict key=${evict} (minFreq=${minFreq})`]);
          } else {
            setLog(l => [...l, `put(${key},${val}) insert`]);
          }
          c.set(key, { key, val, freq: 1 });
          fm.set(1, [key, ...(fm.get(1) ?? [])]);
          setMinFreq(1);
        }
        return fm;
      });
      return c;
    });
  };

  return { cache, freqMap, minFreq, log, get, put };
}

const OPS: { type: "put" | "get"; k: number; v?: number }[] = [
  { type: "put", k: 1, v: 1 }, { type: "put", k: 2, v: 2 }, { type: "get", k: 1 },
  { type: "put", k: 3, v: 3 }, { type: "get", k: 2 }, { type: "put", k: 4, v: 4 },
];

export default function LFUCacheViz() {
  const { cache, freqMap, minFreq, log, get, put } = useLFU(2);
  const [opIdx, setOpIdx] = useState(0);

  const step = () => {
    if (opIdx >= OPS.length) return;
    const op = OPS[opIdx];
    if (op.type === "put") put(op.k, op.v!);
    else get(op.k);
    setOpIdx(p => p + 1);
  };

  const freqBuckets: { freq: number; keys: number[] }[] = [];
  freqMap.forEach((keys, freq) => { if (keys.length) freqBuckets.push({ freq, keys }); });
  freqBuckets.sort((a, b) => a.freq - b.freq);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>LFU Cache (capacity=2)</h3>
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Evicts least-frequently-used key. Tie → evict LRU. minFreq tracks which bucket to evict from.</div>
        <div className="flex gap-2 flex-wrap items-center mb-3">
          <button onClick={step} disabled={opIdx >= OPS.length} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>
            → Next Op
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {opIdx < OPS.length ? `Next: ${OPS[opIdx].type}(${OPS[opIdx].k}${OPS[opIdx].v !== undefined ? `,${OPS[opIdx].v}` : ""})` : "Done"}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {OPS.map((op, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{ background: i < opIdx ? "rgba(34,197,94,0.1)" : i === opIdx ? "rgba(79,142,247,0.2)" : "var(--bg-hover)", color: i < opIdx ? "#22c55e" : i === opIdx ? "#4f8ef7" : "var(--text-muted)", border: `1px solid ${i === opIdx ? "rgba(79,142,247,0.4)" : "transparent"}` }}>
              {op.type}({op.k}{op.v !== undefined ? `,${op.v}` : ""})
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Cache entries</div>
          {cache.size === 0 ? <div className="text-xs" style={{ color: "var(--text-muted)" }}>empty</div> : (
            <div className="space-y-2">
              {[...cache.entries()].map(([k, e]) => (
                <div key={k} className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
                  <span className="text-xs font-mono font-bold" style={{ color: "#4f8ef7" }}>k={k}</span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>v={e.val}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>f={e.freq}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Freq buckets <span style={{ color: "#f97316" }}>(minFreq={minFreq})</span></div>
          {freqBuckets.length === 0 ? <div className="text-xs" style={{ color: "var(--text-muted)" }}>empty</div> : (
            <div className="space-y-2">
              {freqBuckets.map(({ freq, keys }) => (
                <div key={freq} className="flex items-center gap-2">
                  <span className="text-xs font-mono w-12" style={{ color: freq === minFreq ? "#f97316" : "var(--text-muted)" }}>f={freq}{freq === minFreq ? "*" : ""}</span>
                  <div className="flex gap-1">
                    {keys.map((k, i) => (
                      <span key={k} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: i === keys.length - 1 && freq === minFreq ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", color: i === keys.length - 1 && freq === minFreq ? "#ef4444" : "var(--text-secondary)", border: `1px solid ${i === keys.length - 1 && freq === minFreq ? "rgba(239,68,68,0.4)" : "transparent"}` }}>
                        {k}{i === keys.length - 1 && freq === minFreq ? "←evict" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Operation log</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {log.map((l, i) => <div key={i} className="text-xs font-mono" style={{ color: i === log.length - 1 ? "#4f8ef7" : "var(--text-muted)" }}>{l}</div>)}
          {log.length === 0 && <div className="text-xs" style={{ color: "var(--text-muted)" }}>No operations yet</div>}
        </div>
      </div>
    </div>
  );
}
