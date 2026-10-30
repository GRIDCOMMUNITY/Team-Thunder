// ================= STATE =================
let ROWS = 21, COLS = 41;
let grid = [];
let start = { r: 10, c: 3 };
let end = { r: 10, c: 37 };
let mouseDown = false, dragging = null, paintTo = true, running = false;

const $ = id => document.getElementById(id);
const gridEl = $('grid'), statsEl = $('stats');

// ================= BUILD GRID =================
function buildGrid() {
  gridEl.innerHTML = '';
  gridEl.style.display = 'grid';
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.r = r;
      el.dataset.c = c;
      gridEl.appendChild(el);
      row.push({ r, c, el, wall: false, weight: 1, prev: null, dist: Infinity, seen: false, f: 0 });
    }
    grid.push(row);
  }
  start = { r: Math.floor(ROWS / 2), c: 3 };
  end = { r: Math.floor(ROWS / 2), c: COLS - 4 };
  paintEndpoints();
}

function paintEndpoints() {
  document.querySelectorAll('.start,.end').forEach(e => e.classList.remove('start', 'end'));
  grid[start.r][start.c].el.classList.add('start');
  grid[end.r][end.c].el.classList.add('end');
}

// ================= MOUSE + TOUCH =================
const cellOf = el => grid[+el.dataset.r][+el.dataset.c];
const isCell = el => el && el.classList && el.classList.contains('cell');

function applyPaint(cell) {
  if (cell.el.classList.contains('start') || cell.el.classList.contains('end')) return;
  if ($('weightMode').checked) {
    cell.wall = false;
    cell.weight = paintTo ? 5 : 1;
    cell.el.classList.remove('wall');
    cell.el.classList.toggle('weight', paintTo);
  } else {
    cell.wall = paintTo;
    cell.weight = 1;
    cell.el.classList.toggle('wall', paintTo);
    cell.el.classList.remove('weight');
  }
}

function pressCell(el) {
  if (running || !isCell(el)) return;
  mouseDown = true;
  if (el.classList.contains('start')) dragging = 'start';
  else if (el.classList.contains('end')) dragging = 'end';
  else {
    const cell = cellOf(el);
    paintTo = $('weightMode').checked ? cell.weight === 1 : !cell.wall;
    applyPaint(cell);
  }
}

function moveCell(el) {
  if (!mouseDown || !isCell(el)) return;
  const cell = cellOf(el);
  if (dragging) {
    const other = dragging === 'start' ? end : start;
    if (cell.wall || (cell.r === other.r && cell.c === other.c)) return;
    const p = dragging === 'start' ? start : end;
    p.r = cell.r;
    p.c = cell.c;
    paintEndpoints();
  } else {
    applyPaint(cell);
  }
}

const release = () => { mouseDown = false; dragging = null; };

gridEl.addEventListener('mousedown', e => pressCell(e.target));
gridEl.addEventListener('mouseover', e => moveCell(e.target));
document.addEventListener('mouseup', release);

const elAt = t => document.elementFromPoint(t.clientX, t.clientY);
gridEl.addEventListener('touchstart', e => { e.preventDefault(); pressCell(elAt(e.touches[0])); }, { passive: false });
gridEl.addEventListener('touchmove', e => { e.preventDefault(); moveCell(elAt(e.touches[0])); }, { passive: false });
document.addEventListener('touchend', release);

// ================= ALGORITHM HELPERS =================
function neighbors(cell) {
  const out = [];
  for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
    const r = cell.r + dr, c = cell.c + dc;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && !grid[r][c].wall) out.push(grid[r][c]);
  }
  return out;
}

function buildPath(endCell) {
  const path = [];
  for (let n = endCell; n; n = n.prev) path.unshift(n);
  return path;
}

// ================= BFS =================
function bfs(s, e) {
  const visited = [], queue = [s];
  s.seen = true;
  while (queue.length) {
    const cur = queue.shift();
    visited.push(cur);
    if (cur === e) return { visited, path: buildPath(e) };
    for (const n of neighbors(cur)) {
      if (!n.seen) { n.seen = true; n.prev = cur; queue.push(n); }
    }
  }
  return { visited, path: [] };
}

// ================= DFS =================
function dfs(s, e) {
  const visited = [], stack = [s];
  while (stack.length) {
    const cur = stack.pop();
    if (cur.seen) continue;
    cur.seen = true;
    visited.push(cur);
    if (cur === e) return { visited, path: buildPath(e) };
    for (const n of neighbors(cur)) {
      if (!n.seen) { n.prev = cur; stack.push(n); }
    }
  }
  return { visited, path: [] };
}

// ================= DIJKSTRA + A* =================
function weighted(s, e, h) {
  const visited = [], open = [s];
  s.dist = 0;
  s.f = h(s);
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift();
    if (cur.seen) continue;
    cur.seen = true;
    visited.push(cur);
    if (cur === e) return { visited, path: buildPath(e) };
    for (const n of neighbors(cur)) {
      const d = cur.dist + n.weight;
      if (d < n.dist) { n.dist = d; n.prev = cur; n.f = d + h(n); open.push(n); }
    }
  }
  return { visited, path: [] };
}

const dijkstra = (s, e) => weighted(s, e, () => 0);
const astar = (s, e) => weighted(s, e, n => Math.abs(n.r - e.r) + Math.abs(n.c - e.c));

// ================= ANIMATION + STATS =================
function setButtons(disabled) {
  document.querySelectorAll('button, select, #weightMode').forEach(b => b.disabled = disabled);
}

function clearPath() {
  if (running) return;
  for (const row of grid) {
    for (const cell of row) {
      cell.prev = null;
      cell.dist = Infinity;
      cell.seen = false;
      cell.f = 0;
      cell.el.classList.remove('visited', 'path');
    }
  }
}

function animate(visited, path) {
  running = true;
  setButtons(true);
  const delay = 101 - $('speed').value;
  visited.forEach((cell, i) => setTimeout(() => cell.el.classList.add('visited'), i * delay));
  const t = visited.length * delay;
  path.forEach((cell, i) => setTimeout(() => cell.el.classList.add('path'), t + i * delay * 2));
  setTimeout(() => { running = false; setButtons(false); }, t + path.length * delay * 2 + 50);
}

function run() {
  if (running) return;
  clearPath();
  const s = grid[start.r][start.c], e = grid[end.r][end.c];
  const t0 = performance.now();
  const result = { bfs, dfs, dijkstra, astar }[$('algo').value](s, e);
  const ms = performance.now() - t0;
  const len = result.path.length ? result.path.length - 1 : 'No path found';
  statsEl.textContent = `Cells visited: ${result.visited.length} | Path length: ${len} | Time: ${ms.toFixed(2)} ms`;
  animate(result.visited, result.path);
}

// ================= MAZE (recursive backtracker) =================
function setWall(r, c, v) {
  const cell = grid[r][c];
  cell.wall = v;
  cell.weight = 1;
  cell.el.classList.toggle('wall', v);
  cell.el.classList.remove('weight');
}

function generateMaze() {
  if (running) return;
  clearPath();
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) setWall(r, c, true);

  setWall(1, 1, false);
  const stack = [[1, 1]];
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = [[-2, 0], [0, 2], [2, 0], [0, -2]]
      .map(([dr, dc]) => [r + dr, c + dc, r + dr / 2, c + dc / 2])
      .filter(([nr, nc]) => nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && grid[nr][nc].wall);
    if (!options.length) { stack.pop(); continue; }
    const [nr, nc, wr, wc] = options[Math.floor(Math.random() * options.length)];
    setWall(wr, wc, false);
    setWall(nr, nc, false);
    stack.push([nr, nc]);
  }
  start = { r: 1, c: 1 };
  end = { r: ROWS - 2, c: COLS - 2 };
  paintEndpoints();
  statsEl.textContent = 'Maze generated. Press Run.';
}

// ================= BUTTONS =================
$('run').addEventListener('click', run);
$('clearPath').addEventListener('click', clearPath);
$('maze').addEventListener('click', generateMaze);
$('reset').addEventListener('click', () => {
  if (running) return;
  buildGrid();
  statsEl.textContent = 'Board reset.';
});
$('size').addEventListener('change', e => {
  [ROWS, COLS] = e.target.value.split(',').map(Number);
  buildGrid();
});

// ================= START =================
if (window.innerWidth < 600) {
  ROWS = 15;
  COLS = 31;
  $('size').value = '15,31';
}
buildGrid();
