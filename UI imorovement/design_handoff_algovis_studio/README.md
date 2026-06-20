# Handoff: AlgoVis Inner Screens Redesign

## Overview

This package contains the redesigned UI for 7 inner screens of the AlgoVis Studio DSA prep platform. The redesign brings consistency, clarity, and polish to: DSA problem list, System Design, SE Basics, Behavioral, Mock Interview, Flashcards, and Study Plan.

## About the Design Files

The `.dc.html` and `— Standalone.html` files are **interactive HTML prototypes** created as design references — not production code. The task is to **recreate these designs in the existing Next.js + TypeScript + Tailwind codebase** using its established patterns, components, and CSS variables.

Open `AlgoVis Inner Screens — Standalone.html` in any browser and click the sidebar items to explore all 7 screens interactively.

## Fidelity

**High-fidelity.** These are pixel-accurate mockups with final colors (all from the existing `globals.css` CSS variable system), typography (Space Grotesk + JetBrains Mono — already loaded), spacing, and interactions. Implement as close to pixel-perfect as the existing Tailwind setup allows.

## Design System

All colors map to existing CSS tokens in `globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#090B0F` | Page background |
| `--bg-secondary` | `#10141B` | Sidebar, panels |
| `--bg-card` | `#10141B` | Cards, list items |
| `--border` | `#263140` | Card borders |
| `--border-subtle` | `#1B2430` | Row dividers |
| `--text-primary` | `#F7F8FA` | Headings, titles |
| `--text-secondary` | `#A5AFBD` | Body text |
| `--text-muted` | `#6F7A89` | Labels, meta |
| `--accent` | `#4F8CFF` | Active states, CTAs |
| `--accent-soft` | `rgba(79,140,255,0.12)` | Active bg |
| `--accent-green` | `#2FBF71` | Easy / solved |
| `--accent-orange` | `#F5A524` | Medium / due |
| `--accent-red` | `#EF4444` | Hard |

Company tag colors (not in tokens — add as needed):
- Google: `#4F8CFF` | Amazon: `#F5A524` | Meta: `#A78BFA`
- Apple: `#9499C0` | Microsoft: `#22D587` | LinkedIn: `#0EA5E9`

## Screens

### 1. DSA Problems (`/dsa`)
Two-column layout: 172px topic sidebar + problem list table. Key changes:
- **Company tags** displayed below each problem title as `Amazon · Google · Meta` (mono, muted, 11px)
- Difficulty filter bar: All / Easy / Medium / Hard
- Problem rows: # | Title+companies | Topic badge | Difficulty | Status icon
- Status icons: `→` next, `✓` solved, `◐` attempted, `·` not started

### 2. System Design (`/system-design`)
- 3-column card grid with icon, difficulty badge, concept tags, and Start button
- Category filter pills at top
- Progress chip in header

### 3. SE Basics (`/se-basics`)
- Two-panel: chapter list (248px) + chapter detail
- Chapter status indicators: Done (green ✓), Reading (blue →), Not started (numbered)
- Detail panel: topics list + reading time + CTA button

### 4. Behavioral (`/behavioral`)
- 2-column question card grid
- Category filter tabs: All / Leadership / Teamwork / Conflict / Failure / Achievement
- Category color badges on each card
- STAR chip + Prep → button per card

### 5. Mock Interview (`/mock`)
- **Setup phase**: type / difficulty / duration / company selector + session preview sidebar
- **Active phase**: timer top-bar + problem panel + code editor split view

### 6. Flashcards (`/flashcards`)
- 3D flip card (click to reveal answer)
- Confidence buttons: Again / Hard / Good / Easy
- Progress bar + stats footer

### 7. Study Plan (`/study-plan`)
- Weekly 7-day calendar grid with completion indicators
- Today's task checklist
- Upcoming milestones with day countdown

## Interactions

| Screen | Interactions |
|---|---|
| DSA | Filter by difficulty; company data from `problem.companies[]` |
| Behavioral | Filter cards by category tab |
| Flashcards | Click card to flip (3D CSS); confidence buttons advance + reset flip |
| Mock | "Begin Interview →" transitions to active phase; "End Session" returns to setup |
| SE Basics | Click chapter item to show detail panel |

## Files in This Package

| File | Purpose |
|---|---|
| `AlgoVis Inner Screens — Standalone.html` | **Start here** — interactive design reference, open in browser |
| `AlgoVis Inner Screens.dc.html` | Source design component (editable in Claude) |
| `CLAUDE_CODE_PROMPT.md` | Ready-to-paste prompt for Claude Code |
| `README.md` | This file |

## For Claude Code

Paste the contents of `CLAUDE_CODE_PROMPT.md` directly into Claude Code. It contains page-by-page layout specs, implementation notes, and priority order.
