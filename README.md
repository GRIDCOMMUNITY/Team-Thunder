# Pathfinding Visualizer

> Watch BFS, DFS, Dijkstra and A-star search a grid.

Hack Day Haldia x GRID community - 6-hour build challenge

**Repo:** `team-thunder` | **Stack:** HTML + vanilla JavaScript | **Difficulty:** Hard | **Time:** 6 hours

## Brief
Algorithms click when you can see them. Build an interactive grid where each search algorithm is animated and measured.

## Core tasks (must-do)
- [ ] Grid with draggable start / end and click-drag walls
- [ ] BFS, DFS, Dijkstra and `A*`, with weighted cells for Dijkstra and `A*`
- [ ] Animate visited cells and the final path, with a speed slider
- [ ] Random maze generation (recursive backtracker)
- [ ] Stats: cells visited, path length, time taken
- [ ] Clear path / reset board / resize the grid
- [ ] Responsive grid with touch support

## Bonus tasks (only after the core works)
- [ ] Bidirectional search
- [ ] Run all algorithms and compare side by side
- [ ] Diagonal moves toggle
- [ ] Save and load boards

## What is already here
- `index.html` - base page
- `script.js` - state, `save()` / `load()` (localStorage), `render()` and TODO function stubs
- `package.json` - `npm start` serves this folder

## Run locally
```bash
npm start   # or simply open index.html in your browser
```

## Deploy
Any static host works (for example GitHub Pages, Netlify or Vercel). There is no build step.

## Suggested pacing
- Hour 1: read this README, agree on a plan and split the work
- Hours 2-4: build the core tasks
- Hour 5: integrate, polish, then bonus tasks if time allows
- Hour 6: deploy, open the Pull Request, submit on the MLH platform (OrganizerHQ)

## Submission checklist
- [ ] All core tasks work end to end
- [ ] Project is deployed and the live link opens
- [ ] Pull Request created on the Voyage GitHub repository assigned to your team
- [ ] Project submitted on the MLH platform (OrganizerHQ) - instructions are shared at the start of the event

## Rules
- Build new features on top of this starter project and integrate them.
- Teams of 3-4; every member must be present.
- AI tools and open-source / open-weight models are fully allowed.
