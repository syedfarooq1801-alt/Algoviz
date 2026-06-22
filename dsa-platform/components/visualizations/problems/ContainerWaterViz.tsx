"use client";
import { useState, useEffect, useRef } from "react";

export default function ContainerWaterViz() {
  const [heights, setHeights] = useState([1,8,6,2,5,4,8,3,7]);
  const [input, setInput] = useState("1,8,6,2,5,4,8,3,7");
  const [L, setL] = useState(0);
  const [R, setR] = useState(8);
  const [maxWater, setMaxWater] = useState(0);
  const [bestL, setBestL] = useState(-1);
  const [bestR, setBestR] = useState(-1);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [msg, setMsg] = useState("Press Play — move pointer of shorter bar inward, track max water");
  const stateRef = useRef({ l:0, r:8, maxWater:0, bestL:-1, bestR:-1, heights:[1,8,6,2,5,4,8,3,7] });
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const reset = (h=heights) => {
    stateRef.current = { l:0, r:h.length-1, maxWater:0, bestL:-1, bestR:-1, heights:h };
    setL(0); setR(h.length-1); setMaxWater(0); setBestL(-1); setBestR(-1); setDone(false); setPlaying(false);
    setMsg("L=0, R=last — two pointers converge");
    if (iRef.current) clearInterval(iRef.current);
  };

  const doStep = () => {
    const { l, r, maxWater, heights:h } = stateRef.current;
    if (l >= r) {
      setDone(true); setPlaying(false); setMsg(`Done! Max water = ${stateRef.current.maxWater}`); return;
    }
    const water = Math.min(h[l],h[r]) * (r-l);
    const newMax = Math.max(maxWater, water);
    const newBestL = newMax > maxWater ? l : stateRef.current.bestL;
    const newBestR = newMax > maxWater ? r : stateRef.current.bestR;
    if (h[l] <= h[r]) {
      stateRef.current = { ...stateRef.current, l:l+1, maxWater:newMax, bestL:newBestL, bestR:newBestR };
      setL(l+1); setMaxWater(newMax); setBestL(newBestL); setBestR(newBestR);
      setMsg(`water=min(${h[l]},${h[r]})×(${r}-${l})=${water}${water>maxWater?" NEW MAX!":""} → L shorter, move L right`);
    } else {
      stateRef.current = { ...stateRef.current, r:r-1, maxWater:newMax, bestL:newBestL, bestR:newBestR };
      setR(r-1); setMaxWater(newMax); setBestL(newBestL); setBestR(newBestR);
      setMsg(`water=min(${h[l]},${h[r]})×(${r}-${l})=${water}${water>maxWater?" NEW MAX!":""} → R shorter, move R left`);
    }
  };

  useEffect(() => {
    if (playing) { iRef.current = setInterval(doStep, speed); }
    else if (iRef.current) { clearInterval(iRef.current); iRef.current = null; }
    return () => { if (iRef.current) clearInterval(iRef.current); };
  }, [playing, speed]);

  const apply = () => {
    const h = input.split(",").map(x=>parseInt(x.trim())).filter(x=>!isNaN(x)&&x>0);
    setHeights(h); reset(h);
  };

  const maxH = Math.max(...heights, 1);
  const barW = Math.max(28, Math.min(44, Math.floor(320/heights.length)));
  const currentWater = L>=0&&R>=0&&L<R ? Math.min(heights[L],heights[R])*(R-L) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color:"var(--text-primary)" }}>Container With Most Water — Two Pointers</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2"><label className="text-xs" style={{ color:"var(--text-muted)" }}>heights:</label>
            <input className="px-2 py-1 rounded text-xs" style={{ background:"var(--bg-hover)", border:"1px solid var(--border)", color:"var(--text-primary)", width:"220px" }} value={input} onChange={e=>setInput(e.target.value)}/></div>
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
          <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)" }}>Max={maxWater}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl p-4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
        <div className="flex items-end gap-1" style={{ height:"160px" }}>
          {heights.map((h,i) => {
            const isL = i === L;
            const isR = i === R;
            const isBestL = i === bestL && done;
            const isBestR = i === bestR && done;
            const inRange = i > L && i < R;
            const waterH = L>=0&&R>=0&&i>=L&&i<=R&&!done ? (Math.min(heights[L],heights[R])/maxH)*140 : 0;
            return (
              <div key={i} className="relative flex flex-col justify-end items-center" style={{ width:`${barW}px`, height:"100%" }}>
                {/* Water fill */}
                {inRange && waterH > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 transition-all duration-300" style={{ height:`${waterH}px`, background:"rgba(79,142,247,0.15)", borderTop:"1px solid rgba(79,142,247,0.3)" }}></div>
                )}
                {/* Bar */}
                <div className="relative transition-all duration-200 w-full" style={{ height:`${(h/maxH)*140}px`, background:isBestL||isBestR?"rgba(34,197,94,0.35)":isL||isR?"rgba(79,142,247,0.35)":"rgba(168,85,247,0.2)", border:isBestL||isBestR?"1px solid rgba(34,197,94,0.6)":isL||isR?"1px solid rgba(79,142,247,0.6)":"1px solid rgba(168,85,247,0.3)", borderRadius:"3px 3px 0 0" }}></div>
                <span style={{ fontSize:"9px", color:isL||isR?"#4f8ef7":"var(--text-muted)", marginTop:"2px" }}>{isL?"L":isR?"R":i}</span>
              </div>
            );
          })}
        </div>
        {L>=0&&R>=0&&L<R&&!done&&(
          <div className="mt-2 text-xs font-mono" style={{ color:"var(--text-muted)" }}>
            Current water = min({heights[L]},{heights[R]}) × ({R}-{L}) = {currentWater}
          </div>
        )}
      </div>

      <div className="rounded-lg px-4 py-2 text-xs font-mono" style={{ background:"rgba(79,142,247,0.07)", color:"#4f8ef7", border:"1px solid rgba(79,142,247,0.18)" }}>{msg}</div>

      {done && (
        <div className="rounded-xl p-4 text-center" style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)" }}>
          <div className="font-semibold text-sm" style={{ color:"#22c55e" }}>Max water: {maxWater}</div>
        </div>
      )}
    </div>
  );
}
