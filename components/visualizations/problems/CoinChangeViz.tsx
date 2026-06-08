"use client";
import { useState, useEffect, useRef } from "react";

export default function CoinChangeViz() {
  const [coins, setCoins] = useState([1,5,11]);
  const [amount, setAmount] = useState(15);
  const [iCoins, setICoins] = useState("1,5,11");
  const [iAmt, setIAmt] = useState(15);
  const [dp, setDp] = useState<number[]>([]);
  const [active, setActive] = useState(-1);
  const [activeCoin, setActiveCoin] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [msg, setMsg] = useState("Press Play — dp[i] = min coins to make amount i");
  const stateRef = useRef({ i:1, j:0, dp:[] as number[], coins:[1,5,11], amount:15 });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const INF = 1e9;

  const reset = (c=coins, a=amount) => {
    const init = Array(a+1).fill(INF); init[0]=0;
    stateRef.current = { i:1, j:0, dp:init, coins:c, amount:a };
    setDp([...init]); setActive(-1); setActiveCoin(-1); setDone(false); setPlaying(false);
    setMsg("dp[0]=0 (0 coins for amount 0), all others = ∞"); if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { i, j, dp: d, coins: c, amount: a } = stateRef.current;
    if (i > a) { setDone(true); setPlaying(false); setActive(-1); setActiveCoin(-1);
      const ans = stateRef.current.dp[a]; setMsg(`Done! Min coins for ${a} = ${ans>=INF?-1:ans}`); return; }
    const nd = [...d];
    const coin = c[j];
    if (coin <= i && d[i-coin] !== INF) {
      nd[i] = Math.min(nd[i], d[i-coin]+1);
    }
    const nextJ = j+1 >= c.length ? 0 : j+1;
    const nextI = j+1 >= c.length ? i+1 : i;
    stateRef.current = { ...stateRef.current, i:nextI, j:nextJ, dp:nd };
    setDp([...nd]); setActive(i); setActiveCoin(j);
    const val = nd[i]<INF?nd[i]:"∞";
    setMsg(`dp[${i}]: try coin=${coin} → dp[${i}]=min(${d[i]<INF?d[i]:"∞"}, dp[${i}-${coin}]+1=${d[i-coin]<INF&&coin<=i?d[i-coin]+1:"∞"})=${val}`);
  };

  useEffect(() => { reset(); }, []);

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const c = iCoins.split(",").map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>0);
    setCoins(c); setAmount(iAmt); reset(c,iAmt);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Coin Change — 1D DP (Unbounded Knapsack)</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>coins:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"110px" }} value={iCoins} onChange={e=>setICoins(e.target.value)}/></div>
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>amount:</label>
            <input type="number" className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"60px" }} value={iAmt} onChange={e=>setIAmt(+e.target.value)}/></div>
          <button onClick={apply} className="px-3 py-1 rounded text-xs" style={{ background:"rgba(79,142,247,0.15)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.3)" }}>Apply</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setPlaying(!playing)} disabled={done} className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background:playing?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)", color:playing?"#ef4444":"#22c55e", border:`1px solid ${playing?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
            {playing?"⏸ Pause":"▶ Play"}
          </button>
          <button onClick={doStep} disabled={done} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>→ Step</button>
          <button onClick={()=>reset()} className="px-3 py-1.5 rounded text-xs" style={{ background:"var(--bg-hover)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>↺ Reset</button>
          <input type="range" min="100" max="1000" step="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{ width:"80px", accentColor:"#4f8ef7" }} />
        </div>
      </div>

      {/* Coins legend */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color:"var(--text-muted)" }}>Coins</div>
        <div className="flex gap-2">
          {coins.map((c,i)=>(
            <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background:activeCoin===i?"rgba(168,85,247,0.3)":"rgba(168,85,247,0.1)", border:activeCoin===i?"2px solid #a855f7":"1px solid rgba(168,85,247,0.3)", color:"#a855f7" }}>{c}</div>
          ))}
        </div>
      </div>

      {/* DP array */}
      <div className="rounded-xl p-4 overflow-x-auto" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="text-xs font-semibold mb-3" style={{ color:"var(--text-muted)" }}>dp table (dp[i] = min coins for amount i)</div>
        <div className="flex gap-1">
          {dp.slice(0, Math.min(dp.length, 20)).map((v,i)=>{
            const isActive = i===active;
            const isDone2 = done&&i===amount;
            const disp = v>=INF?"∞":v;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-9 h-9 rounded flex items-center justify-center text-xs font-bold font-mono transition-all duration-200"
                  style={{ background:isDone2?"rgba(34,197,94,0.3)":isActive?"rgba(79,142,247,0.3)":v<INF&&v>0?"rgba(168,85,247,0.1)":"var(--bg-hover)", border:isDone2?"2px solid #22c55e":isActive?"2px solid #4f8ef7":"1px solid var(--border)", color:isDone2?"#22c55e":isActive?"#4f8ef7":v<INF&&v>0?"#a855f7":"var(--text-muted)", transform:isActive?"scale(1.12)":"scale(1)" }}>
                  {disp}
                </div>
                <span style={{ fontSize:"8px", color:"var(--text-muted)" }}>{i}</span>
              </div>
            );
          })}
        </div>
        {dp.length > 20 && <div style={{ fontSize:"10px", color:"var(--text-muted)", marginTop:"4px" }}>...and {dp.length-20} more cells</div>}
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:dp[amount]>=INF?"rgba(239,68,68,0.08)":"rgba(34,197,94,0.08)", border:`1px solid ${dp[amount]>=INF?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}` }}>
          <div className="font-semibold text-sm" style={{ color:dp[amount]>=INF?"#ef4444":"#22c55e" }}>
            Min coins for {amount}: {dp[amount]>=INF?-1:dp[amount]}
          </div>
        </div>
      )}
    </div>
  );
}
