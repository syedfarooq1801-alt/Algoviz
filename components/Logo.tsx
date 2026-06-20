"use client";

export function LogoIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tree edges */}
      <line x1="12" y1="7.2" x2="7.6" y2="10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <line x1="12" y1="7.2" x2="16.4" y2="10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <line x1="6" y1="15.6" x2="3.8" y2="19.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.32" />
      <line x1="6" y1="15.6" x2="8.4" y2="19.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.32" />

      {/* Root node */}
      <circle cx="12" cy="5" r="3" fill="currentColor" />

      {/* Level 2 nodes */}
      <circle cx="6" cy="13" r="2.4" fill="currentColor" opacity="0.85" />
      <circle cx="18" cy="13" r="2.4" fill="currentColor" opacity="0.5" />

      {/* Level 3 nodes (left subtree only — asymmetric, more natural) */}
      <circle cx="3.5" cy="20.5" r="1.7" fill="currentColor" opacity="0.48" />
      <circle cx="8.5" cy="20.5" r="1.7" fill="currentColor" opacity="0.32" />
    </svg>
  );
}

export function LogoBadge({ size = 40 }: { size?: number }) {
  const s = size / 40;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="40" height="40" rx="10" fill="rgba(79,140,255,0.1)" />
      <rect width="40" height="40" rx="10" stroke="rgba(79,140,255,0.28)" strokeWidth="1" fill="none" />

      {/* Tree edges */}
      <line x1="20" y1="11.5" x2="13" y2="17" stroke="#4F8CFF" strokeWidth={1.8 * s} strokeLinecap="round" opacity="0.5" />
      <line x1="20" y1="11.5" x2="27" y2="17" stroke="#4F8CFF" strokeWidth={1.8 * s} strokeLinecap="round" opacity="0.5" />
      <line x1="13" y1="23.5" x2="9.5" y2="30" stroke="#4F8CFF" strokeWidth={1.4 * s} strokeLinecap="round" opacity="0.32" />
      <line x1="13" y1="23.5" x2="16.5" y2="30" stroke="#4F8CFF" strokeWidth={1.4 * s} strokeLinecap="round" opacity="0.32" />

      {/* Root node */}
      <circle cx="20" cy="9" r="4.5" fill="#4F8CFF" />
      {/* Inner highlight */}
      <circle cx="18.5" cy="7.5" r="1.5" fill="white" opacity="0.25" />

      {/* Level 2 */}
      <circle cx="13" cy="21" r="3.5" fill="#4F8CFF" opacity="0.85" />
      <circle cx="27" cy="21" r="3.5" fill="#4F8CFF" opacity="0.5" />

      {/* Level 3 (left only) */}
      <circle cx="9" cy="32" r="2.5" fill="#4F8CFF" opacity="0.48" />
      <circle cx="17" cy="32" r="2.5" fill="#4F8CFF" opacity="0.32" />
    </svg>
  );
}

export function LogoWordmark({ iconSize = 32, textSize = 14 }: { iconSize?: number; textSize?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoBadge size={iconSize} />
      <span style={{ fontSize: textSize, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        Code Algo
      </span>
    </div>
  );
}
