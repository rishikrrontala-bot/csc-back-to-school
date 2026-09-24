import LZString from 'lz-string';
import type { CrowdLevel, Profile, Schedule, SchoolMap } from './types';

/**
 * Everything a shared link carries. The map is optional: a link to the sample
 * school only needs the schedule. Nothing is sent anywhere; it lives in the URL hash.
 */
export interface ShareState {
  v: 1;
  profile: Profile['id'];
  custom?: { level: [number, number]; stairs: [number, number] | null; elevator: boolean };
  crowd: CrowdLevel;
  lockerStops: number[];
  schedule: Schedule;
  map?: SchoolMap;
}

const PREFIX = 's=';

export function encodeShare(state: ShareState): string {
  return PREFIX + LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

function isNum(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function isRange(x: unknown): x is [number, number] {
  return Array.isArray(x) && x.length === 2 && isNum(x[0]) && isNum(x[1]) && x[0] > 0 && x[0] <= x[1];
}

export function validSchedule(s: unknown): s is Schedule {
  if (!s || typeof s !== 'object') return false;
  const o = s as Schedule;
  if (!Array.isArray(o.periods) || !Array.isArray(o.classes)) return false;
  if (o.periods.length > 20 || o.classes.length > 20) return false;
  return (
    o.periods.every((p) => typeof p.id === 'string' && typeof p.name === 'string' && isNum(p.start) && isNum(p.end) && p.start < p.end) &&
    o.classes.every((c) => typeof c.periodId === 'string' && typeof c.roomId === 'string' && typeof c.title === 'string')
  );
}

export function validMap(m: unknown): m is SchoolMap {
  if (!m || typeof m !== 'object') return false;
  const o = m as SchoolMap;
  if (typeof o.name !== 'string' || !Array.isArray(o.floors) || !Array.isArray(o.nodes) || !Array.isArray(o.edges)) return false;
  if (o.nodes.length > 2000 || o.edges.length > 4000) return false;
  const ids = new Set<string>();
  for (const n of o.nodes) {
    if (typeof n.id !== 'string' || !isNum(n.x) || !isNum(n.y) || !isNum(n.floor) || ids.has(n.id)) return false;
    ids.add(n.id);
  }
  return o.edges.every((e) => ids.has(e.a) && ids.has(e.b) && ['walk', 'stair', 'elevator', 'ramp', 'outdoor'].includes(e.kind));
}

/** Returns null for anything malformed, so a bad link falls back to the sample instead of crashing. */
export function decodeShare(hash: string): ShareState | null {
  const h = hash.replace(/^#/, '');
  if (!h.startsWith(PREFIX)) return null;
  let raw: unknown;
  try {
    const json = LZString.decompressFromEncodedURIComponent(h.slice(PREFIX.length));
    if (!json) return null;
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  const o = raw as ShareState;
  if (!o || o.v !== 1) return null;
  if (!['walk', 'crutches', 'wheelchair', 'custom'].includes(o.profile)) return null;
  if (!['quiet', 'typical', 'packed'].includes(o.crowd)) return null;
  if (!Array.isArray(o.lockerStops) || !o.lockerStops.every(isNum)) return null;
  if (!validSchedule(o.schedule)) return null;
  if (o.map !== undefined && !validMap(o.map)) return null;
  if (o.custom !== undefined) {
    if (!isRange(o.custom.level) || (o.custom.stairs !== null && !isRange(o.custom.stairs)) || typeof o.custom.elevator !== 'boolean') return null;
  }
  return o;
}
