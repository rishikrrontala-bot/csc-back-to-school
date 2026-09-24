import { LOCKER_STOP, addRange } from './profiles';
import { findRoute, type Graph } from './route';
import type { ClassBlock, Options, Period, Profile, Range, Route, Schedule, TransitionResult, Verdict } from './types';

export const DEFAULT_OPTIONS: Options = {
  crowd: 'typical',
  lockerStop: LOCKER_STOP,
  lockerStops: [],
};

/** "08:50" → 530. Throws on anything that isn't a 24-hour HH:MM time. */
export function parseClock(s: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) throw new Error(`"${s}" is not a time like 08:50`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`"${s}" is not a valid time`);
  return h * 60 + min;
}

/** 530 → "8:50 AM". */
export function formatClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
}

/** Seconds → "3:05". Negative values keep their sign. */
export function formatDuration(seconds: number): string {
  const sign = seconds < 0 ? '−' : '';
  const s = Math.round(Math.abs(seconds));
  return `${sign}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** A range as "2:50–3:40", collapsing to one value when both ends round alike. */
export function formatRange(r: Range): string {
  const a = formatDuration(r[0]);
  const b = formatDuration(r[1]);
  return a === b ? a : `${a}–${b}`;
}

export function classify(time: Range, passing: number): { verdict: Verdict; margin: number } {
  if (time[1] <= passing) return { verdict: 'fits', margin: passing - time[1] };
  if (time[0] > passing) return { verdict: 'short', margin: time[0] - passing };
  return { verdict: 'tight', margin: passing - time[0] };
}

/**
 * Whole minutes of early release that let the slow end of a *quiet-hall* trip
 * finish by the next bell. Leaving early means empty hallways, so the quiet
 * route time is the honest one to size the release with.
 */
export function earlyReleaseMinutes(quietTime: Range, passing: number): number {
  const over = quietTime[1] - passing;
  return over <= 0 ? 0 : Math.ceil(over / 60);
}

/** Ordered periods that have a class, paired into consecutive transitions. */
export function transitions(schedule: Schedule): { from: ClassBlock; to: ClassBlock; fromPeriod: Period; toPeriod: Period }[] {
  const byId = new Map(schedule.periods.map((p) => [p.id, p]));
  const blocks = schedule.classes
    .filter((c) => byId.has(c.periodId))
    .map((c) => ({ c, p: byId.get(c.periodId)! }))
    .sort((a, b) => a.p.start - b.p.start);
  const out = [];
  for (let i = 0; i + 1 < blocks.length; i++) {
    const a = blocks[i]!;
    const b = blocks[i + 1]!;
    out.push({ from: a.c, to: b.c, fromPeriod: a.p, toPeriod: b.p });
  }
  return out;
}

function routeVia(g: Graph, from: string, to: string, via: string | undefined, profile: Profile, crowd: Options['crowd']): Route | null {
  if (!via || via === from || via === to) return findRoute(g, from, to, profile, crowd);
  const a = findRoute(g, from, via, profile, crowd);
  const b = findRoute(g, via, to, profile, crowd);
  if (!a || !b) return null;
  return {
    nodes: [...a.nodes, ...b.nodes.slice(1)],
    steps: [...a.steps, ...b.steps],
    length: a.length + b.length,
    time: addRange(a.time, b.time),
    usesElevator: a.usesElevator || b.usesElevator,
    usesStairs: a.usesStairs || b.usesStairs,
    floorsChanged: a.floorsChanged + b.floorsChanged,
  };
}

export function evaluateDay(g: Graph, schedule: Schedule, profile: Profile, options: Options = DEFAULT_OPTIONS): TransitionResult[] {
  return transitions(schedule).map((t, index) => {
    const passing = (t.toPeriod.start - t.fromPeriod.end) * 60;
    const locker = options.lockerStops.includes(index) ? options.lockerId : undefined;
    const route = routeVia(g, t.from.roomId, t.to.roomId, locker, profile, options.crowd);
    const reasons: string[] = [];
    if (!route) {
      return {
        index,
        ...t,
        passing,
        route: null,
        time: [Infinity, Infinity] as Range,
        verdict: 'short' as Verdict,
        margin: Infinity,
        earlyRelease: 0,
        reasons: ['No route this way of moving can use connects these rooms. Check the map for a missing elevator or ramp.'],
      };
    }
    let time = route.time;
    if (locker) {
      time = addRange(time, options.lockerStop);
      reasons.push('includes a locker stop');
    }
    const { verdict, margin } = classify(time, passing);
    const quiet = routeVia(g, t.from.roomId, t.to.roomId, locker, profile, 'quiet');
    const quietTime = quiet ? (locker ? addRange(quiet.time, options.lockerStop) : quiet.time) : time;
    if (route.usesElevator) reasons.push('elevator wait and ride');
    if (route.usesStairs && route.floorsChanged > 0) reasons.push(`${route.floorsChanged} floor${route.floorsChanged > 1 ? 's' : ''} of stairs`);
    if (route.length > 150) reasons.push(`${Math.round(route.length)} m of hallway`);
    if (options.crowd !== 'quiet') reasons.push(`${options.crowd} hallway crowds`);
    return {
      index,
      ...t,
      passing,
      route,
      time,
      verdict,
      margin,
      earlyRelease: verdict === 'fits' ? 0 : earlyReleaseMinutes(quietTime, passing),
      reasons,
    };
  });
}
