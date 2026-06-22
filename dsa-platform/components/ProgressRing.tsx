"use client";

interface Props { pct: number; size?: number; stroke?: number; color?: string; label?: string; }

export default function ProgressRing({ pct, size = 56, stroke = 5, color = "var(--accent)", label }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      {label !== undefined && (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
          fontSize={size * 0.26} fontWeight="700" fill="var(--text-primary)">{label}</text>
      )}
    </svg>
  );
}
