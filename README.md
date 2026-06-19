# AlgoVis Interview Prep Platform

AlgoVis is a local-first interview prep app for DSA, system design, CS fundamentals, behavioral interviews, and mock interview feedback. It is built for structured placement and software engineering prep, not just passive reading.

## What It Helps You Do

- Learn DSA by pattern with curated LeetCode-style problems.
- Practice with visual explanations, hints, dry runs, and runnable code.
- Run timed mock interviews and score the behaviors interviewers care about.
- Diagnose pattern-recognition mistakes before coding.
- Track spaced repetition states: unseen, attempted, solved, reviewing, mastered.
- Follow 30, 60, or 90 day plans with company and role-oriented prep tracks.
- Review analytics that recommend what to study next.
- Build behavioral STAR answers and score them with a rubric.

## Core Prep Workflow

1. Pick a prep track in `Study Plan`.
2. Work through the daily DSA, system design, and SE basics tasks.
3. Use `Diagnosis` to train pattern recognition.
4. Solve problems in interview mode: clarify, brute force, optimize, code, test, state complexity, reflect.
5. Run mock interviews weekly.
6. Review the analytics dashboard and attack the weakest area next.

## Features

- DSA curriculum: 17 patterns and 186 problems.
- Problem pages: intuition, approach, walkthroughs, complexity, edge cases, common mistakes, solutions, notes, and interview checklist.
- Code runner: in-browser Python, C++ scratchpad, submit-style tests, hidden tests, custom test cases, and attempt history.
- Mock interviews: timed sessions with post-mock score, correctness, complexity, edge case, solution reveal, self-explanation, notes, and coaching insights.
- Pattern diagnosis: unseen problem prompts, pattern selection, immediate feedback, and accuracy tracking.
- Spaced repetition: review due dates and readiness states per problem.
- Study plans: 30, 60, and 90 day schedules with prep tracks such as FAANG DSA, backend-focused, system-design-heavy, weak DP, and weak graphs.
- Behavioral prep: company values, common questions, STAR answer builder, saved drafts, and scoring rubric.
- Analytics: weak patterns, difficulty gaps, weekly progress, due reviews, mock average, diagnosis accuracy, and interview pace.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Zustand persisted local stores
- Tailwind CSS
- Pyodide for browser-based Python execution

## Notes

Most progress is stored locally in the browser through persisted Zustand stores. Firebase support exists for authentication-related flows, but the core prep loop works locally.
