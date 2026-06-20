# Claude Code Prompt — AlgoVis UI Redesign

Paste this entire prompt into Claude Code to implement the redesigned inner screens.

---

## Context

I have a Next.js 14 (App Router) + TypeScript + Tailwind CSS codebase at `dsa-platform/`. The fonts, sidebar, and global CSS variables are already set up correctly. I need you to redesign the UI of 7 existing pages to match a new design reference.

The design reference file is: `design_handoff_algovis_studio/AlgoVis Inner Screens — Standalone.html`

Open this file in a browser to see the target design. It is an **interactive prototype** — click the sidebar items to switch between all 7 screens. Do not copy the HTML code directly; instead implement each page using React, TypeScript, Tailwind, and the existing codebase patterns.

---

## Design System (already in globals.css — use these tokens)

```css
--bg-primary: #090B0F
--bg-secondary: #10141B
--bg-elevated: #151B24
--bg-card: #10141B
--border: #263140
--border-subtle: #1B2430
--text-primary: #F7F8FA
--text-secondary: #A5AFBD
--text-muted: #6F7A89
--accent: #4F8CFF
--accent-soft: rgba(79,140,255,0.12)
--accent-green: #2FBF71
--accent-orange: #F5A524
--accent-red: #EF4444
--font-sans: Space Grotesk
--font-mono: JetBrains Mono
```

Company tag colors:
- Google → `#4F8CFF`
- Amazon → `#F5A524`
- Meta → `#A78BFA`
- Apple → `#9499C0`
- Microsoft → `#22D587`
- LinkedIn → `#0EA5E9`

---

## Pages to Redesign

### 1. `/dsa` — `app/dsa/page.tsx`

**Target layout:**
- Two-column: `172px` topic sidebar on left + problem list on right
- Topic sidebar: scrollable list of pattern names with problem counts. "All Topics" selected by default highlighted with `var(--accent-soft)` + `var(--accent)` text
- Problem list: table-like rows with columns: `#` | Title + company tags | Topic badge | Difficulty | Status icon
- **Company tags**: displayed as small monospace text below the problem title (e.g. `Amazon · Google · Meta`), color `var(--text-muted)`, font `var(--font-mono)`, font-size 11px
- Difficulty filter bar at top: `All | Easy | Medium | Hard` segmented buttons. Active button: `var(--accent-soft)` bg + `var(--accent)` text + border `rgba(79,140,255,0.22)`. Inactive: transparent bg + `var(--text-muted)` text
- Problem count chip top-right: shows `47 / 293` in mono font
- Each row: `padding: 10px 16px`, `border-bottom: 1px solid var(--border-subtle)`
- Status icons: `→` (blue, next up), `✓` (green, solved), `◐` (amber, attempted), `·` (muted, not started)
- Difficulty badges: colored background chip — Easy: green, Medium: amber, Hard: red

**Company tags from `problem.companies[]` in `data/problems.ts`** — display up to 3 companies joined with ` · `.

---

### 2. `/system-design` — `app/system-design/page.tsx`

**Target layout:**
- Header: title + progress chip (e.g. `8 / 42 concepts` with a small progress bar)
- Category filter pills: `All | Scalability | Storage | Caching | Messaging` — horizontal scroll row
- Card grid: 3 columns, responsive to 2 on tablet
- Each card:
  - Icon area (32×32px, `var(--accent-soft)` bg, 7px radius) top-left
  - Difficulty badge top-right (colored)
  - Title: 13px, weight 600, `var(--text-primary)`
  - Concept tags: small mono badges, `var(--text-muted)`, `var(--border-subtle)` border
  - "Start →" button: full width, `var(--accent-soft)` bg, `var(--accent)` text, 5px radius
- Card bg: `var(--bg-card)`, border: `var(--border)`, radius: `var(--radius)`

---

### 3. `/se-basics` — `app/se-basics/page.tsx`

**Target layout:**
- Two-column: `248px` chapter list on left + chapter detail on right
- Chapter list items: numbered icon (22×22px) + title + reading time + status. Active item: `var(--accent-soft)` bg + outline `rgba(79,140,255,0.14)`
  - Done: green filled icon with `✓`
  - Reading: blue icon with `→`
  - Not started: `var(--bg-card)` icon with number
- Chapter detail panel:
  - Chapter number label (9px mono, `var(--text-muted)`, letter-spacing)
  - Title (20px, weight 700)
  - Reading time + status badge
  - "What you'll learn" section: dark bg box with bullet list of topics (blue dot + `var(--text-secondary)` text)
  - CTA button: full-width, `var(--accent)` bg, white text, "Continue reading →" or "Start reading →"
  - "Save" secondary button

---

### 4. `/behavioral` — `app/behavioral/page.tsx`

**Target layout:**
- Header: title + prep count chip
- Category tab bar: `All | Leadership | Teamwork | Conflict | Failure | Achievement` segmented buttons (same style as DSA difficulty filter)
- Question card grid: 2 columns
- Each card:
  - Category badge top-left (colored: Leadership=blue, Conflict=amber, Failure=red, Achievement=green, Teamwork=purple)
  - Prep status top-right: "Prepped ✓" or "Not prepped" in `var(--text-muted)`
  - Question text: 13px, `var(--text-secondary)`, line-height 1.55
  - Bottom row: `STAR` chip (mono, subtle) + `Prep →` button (blue outlined)
- Card bg: `var(--bg-card)`, border: `var(--border)`, radius: `var(--radius)`, padding: `18px 20px`

---

### 5. `/mock` — `app/mock/page.tsx`

**Two phases — setup and active:**

**Setup phase:**
- Two-column: setup card (480px) + session preview sidebar
- Setup card sections (each with 9px mono label + button group):
  1. Interview Type: `Coding | System Design | Behavioral`
  2. Difficulty: `Easy | Medium | Hard` (Easy=green, Medium=amber, Hard=red active styles)
  3. Duration: `30 min | 45 min | 60 min`
  4. Company Focus: `Google | Amazon | Meta | Apple`
- "Begin Interview →" CTA: full width, `var(--accent)` bg, white, 14px weight 600
- Preview sidebar: dark card showing Type / Difficulty / Duration / Company + Last Session score with progress bar

**Active phase:**
- Top bar: problem title + difficulty badge + topic badge | Timer (amber, mono) | "End Session" button (red outlined)
- Split view: 42% problem panel | 58% code editor
- Problem panel: statement text, example input/output in code block, constraints
- Code editor: dark bg (`#05060F`), language selector, Run + Submit buttons, monospace code with syntax coloring

---

### 6. `/flashcards` — `app/flashcards/page.tsx`

**Target layout:**
- Header: title + card count chip
- Progress bar: thin 3px bar showing session progress
- Category filter pills (horizontal)
- **Flip card** (full width, 200px tall, `perspective: 1200px`):
  - Front face: category label (9px mono) + question text (17px, weight 500, centered) + "tap to reveal →" hint
  - Back face: "ANSWER" label (blue) + answer text (14px, `var(--text-secondary)`)
  - 3D flip on click: `transform: rotateY(180deg)` with `transition: 0.5s ease`, `transform-style: preserve-3d`
  - Front: `var(--bg-card)` bg | Back: slightly different dark bg `#0A1220`
- Confidence buttons row: `Again` (red) | `Hard` (amber) | `Good` (blue) | `Easy` (green) — each advances to next card + resets flip state
- Stats footer: Remaining / Done today / Due tomorrow

**Implementation note:** The existing flashcard page uses `markKnown`/`markWeak` from `useFlashcardStore`. Map: Good/Easy → `markKnown`, Hard/Again → `markWeak`.

---

### 7. `/study-plan` — `app/study-plan/page.tsx`

**Target layout:**
- Header: title + streak chip (🔥 N day streak, amber)
- Weekly calendar card:
  - Label "WEEK OF [dates]" (9px mono)
  - 7-column grid: Mon–Sun
  - Each day: day label + circular indicator (32×32px) + task count
    - Complete: green circle with `✓`
    - Partial: amber circle with count
    - Today: blue circle with double-border (current day highlighted)
    - Upcoming: muted circle with total count
- Two-column bottom section:
  - **Today's tasks**: checklist with status icons (checked=green, current=blue arrow, upcoming=empty box) + category tag right-aligned
  - **Upcoming milestones**: list with colored dot + title + subtitle + day count badge

---

## Implementation Instructions for Claude Code

1. **Read the standalone design file first**: `design_handoff_algovis_studio/AlgoVis Inner Screens — Standalone.html` — open it in a browser and interact with all 7 screens
2. **Use CSS variables** from `globals.css` — never hardcode colors that already have a token
3. **Use existing components** where they exist (Sidebar, NavLink, etc.) — do not recreate them
4. **Use existing data** from `data/problems.ts`, `data/systemDesign.ts`, `data/seBasics.ts`, `data/behavioral.ts` — the problem company tags are already in `problem.companies[]`
5. **Use existing stores** — `useProgressStore`, `useFlashcardStore`, `useInterviewStore` for state
6. **Font classes** — use `font-mono` (JetBrains Mono) for all monospace elements, `font-sans` (Space Grotesk) for UI text
7. **Do one page at a time** — start with DSA (`/dsa`), then System Design, etc. Commit after each page is complete
8. **Respect light/dark theme** — the CSS variables already handle both; use them consistently

---

## Priority Order

1. `/dsa` — highest traffic, company tags are the key addition
2. `/flashcards` — flip animation is the main new interaction
3. `/study-plan` — weekly calendar is new UI
4. `/mock` — setup + active phase split
5. `/behavioral` — category filtering
6. `/system-design` — card grid refinement
7. `/se-basics` — two-panel layout

