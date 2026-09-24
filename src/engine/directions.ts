import { addRange } from './profiles';
import type { Graph } from './route';
import type { MapNode, Range, Route, Step } from './types';

/**
 * Turn-by-turn directions built only from the map's own geometry and labels.
 * Nothing here invents a place name: an unnamed corridor is "the hallway".
 */

export type DirectionKind = 'start' | 'walk' | 'stairs' | 'elevator' | 'ramp' | 'outdoor' | 'arrive';

export interface Direction {
  kind: DirectionKind;
  text: string;
  floor: number;
  /** Metres covered by this instruction (0 for start). */
  distance: number;
  time: Range;
}

/** "118" → "Room 118"; "Library" stays "Library". */
export function placeName(n: MapNode): string {
  const label = n.label ?? n.id;
  return /^\d+[A-Z]?$/i.test(label) ? `Room ${label}` : label;
}

export function floorName(g: Graph, floor: number): string {
  return g.map.floors.find((f) => f.id === floor)?.name ?? `Floor ${floor}`;
}

/** Round a distance the way a person would say it. */
export function sayDistance(m: number): string {
  if (m < 8) return 'a few steps';
  const r = m < 50 ? Math.round(m / 5) * 5 : Math.round(m / 10) * 10;
  return `${r} m`;
}

/** Turn direction at b when going a → b → c, on a y-down plan (screen coordinates). */
export function turnSide(a: MapNode, b: MapNode, c: MapNode): 'left' | 'right' | 'straight' {
  const v1x = b.x - a.x;
  const v1y = b.y - a.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const l1 = Math.hypot(v1x, v1y);
  const l2 = Math.hypot(v2x, v2y);
  if (l1 === 0 || l2 === 0) return 'straight';
  const cross = (v1x * v2y - v1y * v2x) / (l1 * l2);
  // Under 30° of deviation reads as "straight on".
  if (Math.abs(cross) < 0.5) return 'straight';
  return cross > 0 ? 'right' : 'left';
}

interface Leg {
  kind: Step['kind'];
  name: string | undefined;
  steps: Step[];
  /** Index in route.nodes of the leg's first node. */
  start: number;
}

const LEVEL = new Set<Step['kind']>(['walk', 'outdoor', 'ramp']);
/** Unnamed connectors shorter than this (room doorways, stairwell lobbies) fold into their neighbours. */
const STUB = 15;

function legsOf(route: Route): Leg[] {
  const legs: Leg[] = [];
  route.steps.forEach((s, i) => {
    const last = legs[legs.length - 1];
    if (last && LEVEL.has(s.kind) && last.kind === s.kind && last.name === s.name) last.steps.push(s);
    else legs.push({ kind: s.kind, name: s.name, steps: [s], start: i });
  });
  return legs;
}

const legLength = (l: Leg) => l.steps.reduce((d, s) => d + s.length, 0);
const legTime = (l: Leg) => l.steps.reduce<Range>((t, s) => addRange(t, s.time), [0, 0]);
const isStub = (l: Leg) => LEVEL.has(l.kind) && l.name === undefined && legLength(l) < STUB;

export function directionsFor(g: Graph, route: Route): Direction[] {
  const node = (id: string) => g.nodes.get(id)!;
  const at = (i: number) => node(route.nodes[i]!);
  const start = at(0);
  const end = at(route.nodes.length - 1);
  const out: Direction[] = [
    { kind: 'start', text: `Leave ${placeName(start)} on ${floorName(g, start.floor)}.`, floor: start.floor, distance: 0, time: [0, 0] },
  ];
  // Time and distance from folded stubs ride along with the next instruction.
  let carryTime: Range = [0, 0];
  let carryDist = 0;
  let afterVertical = false;

  for (const leg of legsOf(route)) {
    const time = addRange(legTime(leg), carryTime);
    const distance = legLength(leg) + carryDist;
    if (isStub(leg)) {
      carryTime = time;
      carryDist = distance;
      continue;
    }
    carryTime = [0, 0];
    carryDist = 0;
    const from = at(leg.start);
    const to = at(leg.start + leg.steps.length);

    if (leg.kind === 'stair' || leg.kind === 'elevator') {
      const dir = to.floor > from.floor ? 'up' : 'down';
      const what = from.label ?? (leg.kind === 'stair' ? 'the stairs' : 'the elevator');
      out.push({ kind: leg.kind === 'stair' ? 'stairs' : 'elevator', text: `Take ${what} ${dir} to ${floorName(g, to.floor)}.`, floor: to.floor, distance, time });
      afterVertical = true;
      continue;
    }

    const where = leg.name ?? 'the hallway';
    // The turn happens where this leg begins: compare the incoming and outgoing directions there.
    const i = leg.start;
    const side = i > 0 ? turnSide(at(i - 1), at(i), at(i + 1)) : 'straight';
    const d = sayDistance(distance);
    const action =
      leg.kind === 'ramp'
        ? `take ${where} (${d})`
        : side === 'straight'
          ? `${afterVertical ? 'go straight' : 'continue'} along ${where} for ${d}`
          : `turn ${side} into ${where} and go ${d}`;
    const sentence = afterVertical ? `Out on ${floorName(g, from.floor)}, ${action}` : action.charAt(0).toUpperCase() + action.slice(1);
    const kind = leg.kind === 'ramp' ? 'ramp' : leg.kind === 'outdoor' ? 'outdoor' : 'walk';
    out.push({ kind, text: `${sentence}.`, floor: from.floor, distance, time });
    afterVertical = false;
  }

  // Which side of the corridor is the destination on?
  const n = route.nodes.length;
  const side = n >= 3 ? turnSide(at(n - 3), at(n - 2), end) : 'straight';
  out.push({
    kind: 'arrive',
    text: `${placeName(end)} is ${side === 'straight' ? 'straight ahead' : `on your ${side}`}.`,
    floor: end.floor,
    distance: carryDist,
    time: carryTime,
  });
  return out;
}
