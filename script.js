// Pathfinding Visualizer - Hack Day Haldia x GRID community starter. Build the core tasks from README.md.
const KEY = "hackday-haldia-team-thunder";
const $ = (sel) => document.querySelector(sel);

// App state - reshape it to fit your project.
let state = { items: [] };

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked */ }
}

function load() {
  try { state = JSON.parse(localStorage.getItem(KEY)) || state; } catch (e) { /* ignore */ }
}

function render() {
  // TODO: draw your UI into #app
}

// ---- TODO(core): fill these in -------------------------------------------
// TODO(core): breadth-first search
function bfs() {
}

// TODO(core): depth-first search
function dfs() {
}

// TODO(core): Dijkstra with weights
function dijkstra() {
}

// TODO(core): A-star with a heuristic
function aStar() {
}

// TODO(core): recursive backtracker maze
function generateMaze() {
}

// TODO(core): play visited cells, then the path
function animateSearch() {
}


document.addEventListener("DOMContentLoaded", () => {
  load();
  $("#status").textContent = "script.js loaded.";
  render();
});
