"use client";
import { useState, useEffect, useRef } from "react";

export default function BestTimeStockViz() {
  const [prices, setPrices] = useState([7,1,5,3,6,4]);
  const [input, setInput] = useState("7,1,5,3,6,4");
  const [idx, setIdx] = useState(-1);
  const [minPrice, setMinPrice] = useState(Infinity);
  const [maxProfit, setMaxProfit] = useState(0);
  const [bestBuy, setBestBuy] = useState(-1);
  const [bestSell, setBestSell] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [msg, setMsg] = useState("Press Play — track min price (buy), compute profit = price - minPrice, track max");
  const stateRef = useRef({ idx:-1, min:Infinity, max:0, bestBuy:-1, bestSell:-1, prices:[7,1,5,3,6,4] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (p=prices) => {
    stateRef.current = { idx:-1, min:Infinity, max:0, bestBuy:-1, bestSell:-1, prices:p };
    setIdx(-1); setMinPrice(Infinity); setMaxProfit(0); setBestBuy(-1); setBestSell(-1); setDone(false); setPlaying(false);
    setMsg("Scan prices: minPrice=∞, maxProfit=0");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const st = stateRef.current;
    const next = st.idx + 1;
    if (next >= st.prices.length) {
      setDone(true); setPlaying(false); setMsg(`Done! Max profit = ${st.max} (buy day ${st.bestBuy}, sell day ${st.bestSell})`); return;
    }
    const p = st.prices[next];
    const newMin = Math.min(st.min, p);
    const profit = p - newMin;
    const newMax = Math.max(st.max, profit);
    const newBestBuy = newMax > st.max ? st.prices.indexOf(newMin) : st.bestBuy;
    const newBestSell = newMax > st.max ? next : st.bestSell;
    stateRef.current = { ...st, idx:next, min:newMin, max:newMax, bestBuy:newBestBuy, bestSell:newBestSell };
    setIdx(next); setMinPrice(newMin); setMaxProfit(newMax); setBestBuy(newBestBuy); setBestSell(newBestSell);
    setMsg(`day ${next}: price=${p}, minPrice=${newMin}, profit=${profit}${profit>st.max?" → NEW MAX PROFIT!":""}`);
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const p = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)&&x>0);
    setPrices(p); reset(p);
  };

  const maxPrice = Math.max(...prices,1);
  const minIdx = prices.indexOf(minPrice);

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Best Time to Buy and Sell Stock — Sliding Window Min-Track</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>prices:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"200px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="200" max="1500" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[["minPrice", minPrice===Infinity?"∞":minPrice, "#22c55e"],["maxProfit", maxProfit, "#f97316"],["current day", idx>=0?idx:"-", "#4f8ef7"]].map(([l,v,c])=>(
          <div key={l as string} className="rounded-lg p-3 text-center" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
            <div className="text-xs" style={{ color:"var(--text-muted)" }}>{l as string}</div>
            <div className="text-lg font-bold font-mono mt-1" style={{ color:c as string }}>{String(v)}</div>
          </div>
        ))}
      </div>

      {/* Price bars */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex gap-2 items-end" style={{ height:"120px" }}>
          {prices.map((p,i) => {
            const isCurr = i === idx;
            const isBuy = done && i === bestBuy;
            const isSell = done && i === bestSell;
            const isMinSoFar = i === minIdx && i <= idx;
            return (
              <div key={i} className="flex flex-col items-center justify-end flex-1" style={{ height:"100%" }}>
                <div className="text-[9px] mb-0.5 font-mono" style={{ color:isSell?"#f97316":isBuy||isMinSoFar?"#22c55e":isCurr?"#4f8ef7":"var(--text-muted)" }}>{isBuy?"BUY":isSell?"SELL":""}</div>
                <div className="w-full rounded-t transition-all duration-200"
                  style={{ height:`${(p/maxPrice)*100}px`, background:isBuy||isSell?"rgba(34,197,94,0.35)":isCurr?"rgba(79,142,247,0.35)":i<idx?"rgba(168,85,247,0.15)":"rgba(168,85,247,0.1)", border:isCurr?"1px solid rgba(79,142,247,0.6)":"1px solid rgba(168,85,247,0.3)" }}></div>
                <span style={{ fontSize:"9px", color:"var(--text-muted)", marginTop:"2px" }}>{p}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Max profit: {maxProfit} {maxProfit===0?"(no profit possible)":""}</div>
        </div>
      )}
    </div>
  );
}
