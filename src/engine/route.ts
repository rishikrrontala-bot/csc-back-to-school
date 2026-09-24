import { CROWD, ELEVATOR_PER_FLOOR, ELEVATOR_WAIT, addRange, mid, timeFor } from './profiles';
import type { CrowdLevel, MapEdge, MapNode, Profile, Range, Route, SchoolMap, Step } from './types';

interface Adj {
  to: string;
  edge: MapEdge;
}

export interface Graph {
  map: SchoolMap;
  nodes: Map<string, MapNode>;
  adj: Map<string, Adj[]>;
}

export function buildGraph(map: SchoolMap): Graph {
  const nodes = new Map<string, MapNode>();
  for (const n of map.nodes) {
    if (nodes.has(n.id)) throw new Error(`Duplicate node id "${n.id}"`);
    nodes.set(n.id, n);
  }
  const adj = new Map<string, Adj[]>();
  for (const n of map.nodes) adj.set(n.id, []);
  for (const e of map.edges) {
    if (!nodes.has(e.a) || !nodes.has(e.b)) {
      throw new Error(`Edge ${e.a}–${e.b} points at a node that does not exist`);
    }
    adj.get(e.a)!.push({ to: e.b, edge: e });
    adj.get(e.b)!.push({ to: e.a, edge: e });
  }
  return { map, nodes, adj };
}

/** Straight-line length of an edge in metres (same floor), or its explicit length. */
export function edgeLength(g: Graph, e: MapEdge): number {
  if (e.length !== undefined) return e.length;
  const a = g.nodes.get(e.a)!;
  const b = g.nodes.get(e.b)!;
  if (e.kind === 'elevator') return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Time range to traverse one edge for a profile, or null when the edge is not
 * usable (stairs for a wheelchair, the elevator for someone who doesn't need it).
 */
export function edgeTime(g: Graph, e: MapEdge, profile: Profile, crowd: CrowdLevel): Range | null {
  const c = CROWD[crowd];
  const len = edgeLength(g, e);
  let t: Range;
  switch (e.kind) {
    case 'walk':
    case 'outdoor':
      t = timeFor(len, profile.level, e.kind === 'outdoor' ? [1, 1] : c);
      break;
    case 'ramp':
      t = timeFor(len, profile.ramp, c);
      break;
    case 'stair':
      if (!profile.stairs) return null;
      t = timeFor(len, profile.stairs, c);
      break;
    case 'elevator': {
      if (!profile.elevator) return null;
      const a = g.nodes.get(e.a)!;
      const b = g.nodes.get(e.b)!;
      const floors = Math.abs(a.floor - b.floor);
      t = addRange(ELEVATOR_WAIT, [ELEVATOR_PER_FLOOR[0] * floors, ELEVATOR_PER_FLOOR[1] * floors]);
      break;
    }
  }
  if (e.door) t = addRange(t, profile.door);
  return t;
}

/**
 * Dijkstra on the midpoint of each edge's time range. The route returned is
 * the fastest-on-average path the profile can use; its full [lo, hi] range is
 * the sum of the edge ranges along it.
 */
export function findRoute(
  g: Graph,
  from: string,
  to: string,
  profile: Profile,
  crowd: CrowdLevel = 'typical',
): Route | null {
  if (!g.nodes.has(from) || !g.nodes.has(to)) return null;
  const dist = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, { node: string; edge: MapEdge; time: Range }>();
  const done = new Set<string>();
  // Binary heap keyed on distance.
  const heap: [number, string][] = [[0, from]];
  const push = (item: [number, string]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p]![0] <= heap[i]![0]) break;
      [heap[p], heap[i]] = [heap[i]!, heap[p]!];
      i = p;
    }
  };
  const pop = (): [number, string] | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
        if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i]!, heap[m]!];
        i = m;
      }
    }
    return top;
  };

  for (let item = pop(); item; item = pop()) {
    const [d, u] = item;
    if (done.has(u)) continue;
    done.add(u);
    if (u === to) break;
    for (const { to: v, edge } of g.adj.get(u)!) {
      if (done.has(v)) continue;
      // Rooms are destinations, not corridors: never route *through* another room.
      const vn = g.nodes.get(v)!;
      if (vn.kind === 'room' && v !== to) continue;
      const t = edgeTime(g, edge, profile, crowd);
      if (!t) continue;
      const nd = d + mid(t);
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        prev.set(v, { node: u, edge, time: t });
        push([nd, v]);
      }
    }
  }
  if (!done.has(to)) return null;

  const nodes: string[] = [to];
  const steps: Step[] = [];
  let cur = to;
  while (cur !== from) {
    const p = prev.get(cur)!;
    const step: Step = {
      from: p.node,
      to: cur,
      kind: p.edge.kind,
      length: edgeLength(g, p.edge),
      time: p.time,
    };
    if (p.edge.name !== undefined) step.name = p.edge.name;
    if (p.edge.door) step.door = true;
    steps.push(step);
    nodes.push(p.node);
    cur = p.node;
  }
  nodes.reverse();
  steps.reverse();
  let time: Range = [0, 0];
  let length = 0;
  let floorsChanged = 0;
  for (const s of steps) {
    time = addRange(time, s.time);
    length += s.length;
    if (s.kind === 'stair' || s.kind === 'elevator') {
      floorsChanged += Math.abs(g.nodes.get(s.from)!.floor - g.nodes.get(s.to)!.floor);
    }
  }
  return {
    nodes,
    steps,
    length,
    time,
    usesElevator: steps.some((s) => s.kind === 'elevator'),
    usesStairs: steps.some((s) => s.kind === 'stair'),
    floorsChanged,
  };
}
