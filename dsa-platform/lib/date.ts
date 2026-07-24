// Local-timezone date helpers. `new Date().toISOString()` reports UTC, which
// is wrong for "today" in any timezone ahead of UTC (e.g. India, UTC+5:30) —
// between local midnight and the UTC offset, it still reports yesterday.
// Use these instead of toISOString() wherever "today" means the user's day.

export function todayLocalISO(): string {
  return dateToLocalISO(new Date());
}

export function dateToLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
