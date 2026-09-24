import { describe, expect, it } from 'vitest';
import { PROFILES } from '../src/engine/profiles';
import { buildGraph } from '../src/engine/route';
import {
  classify, earlyReleaseMinutes, evaluateDay, formatClock, formatDuration, formatRange, parseClock, transitions,
} from '../src/engine/schedule';
import { SAMPLE_SCHEDULE, SAMPLE_SCHOOL } from '../src/data/sample-school';
import type { Schedule } from '../src/engine/types';

describe('clock helpers', () => {
  it('parses and formats times', () => {
    expect(parseClock('08:50')).toBe(530);
    expect(parseClock('7:05')).toBe(425);
    expect(() => parseClock('25:00')).toThrow();
    expect(() => parseClock('noon')).toThrow();
    expect(formatClock(530)).toBe('8:50 AM');
    expect(formatClock(750)).toBe('12:30 PM');
    expect(formatClock(0)).toBe('12:00 AM');
  });
  it('formats durations and ranges', () => {
    expect(formatDuration(185)).toBe('3:05');
    expect(formatDuration(-40)).toBe('−0:40');
    expect(formatRange([170, 220])).toBe('2:50–3:40');
    expect(formatRange([60.2, 59.8])).toBe('1:00');
  });
});

describe('classify', () => {
  it('fits when even the slow end beats the bell', () => {
    expect(classify([100, 250], 300)).toEqual({ verdict: 'fits', margin: 50 });
  });
  it('is tight when the bell falls inside the range', () => {
    expect(classify([200, 400], 300).verdict).toBe('tight');
  });
  it('is short when even the fast end misses the bell', () => {
    expect(classify([330, 500], 300)).toEqual({ verdict: 'short', margin: 30 });
  });
});

describe('earlyReleaseMinutes', () => {
  it('rounds the overrun up to whole minutes', () => {
    expect(earlyReleaseMinutes([100, 300], 300)).toBe(0);
    expect(earlyReleaseMinutes([100, 301], 300)).toBe(1);
    expect(earlyReleaseMinutes([100, 481], 300)).toBe(4);
  });
});

describe('transitions', () => {
  it('pairs consecutive classes in time order, ignoring unknown periods', () => {
    const s: Schedule = {
      periods: [
        { id: 'b', name: 'B', start: 600, end: 650 },
        { id: 'a', name: 'A', start: 500, end: 550 },
      ],
      classes: [
        { periodId: 'b', roomId: 'y', title: 'Y' },
        { periodId: 'a', roomId: 'x', title: 'X' },
        { periodId: 'ghost', roomId: 'z', title: 'Z' },
      ],
    };
    const t = transitions(s);
    expect(t).toHaveLength(1);
    expect(t[0]!.from.title).toBe('X');
    expect(t[0]!.to.title).toBe('Y');
  });
});

describe('evaluateDay on the sample school', () => {
  const g = buildGraph(SAMPLE_SCHOOL);

  it('every transition fits for a walking student', () => {
    const day = evaluateDay(g, SAMPLE_SCHEDULE, PROFILES.walk);
    expect(day).toHaveLength(6);
    expect(day.every((d) => d.verdict === 'fits')).toBe(true);
    expect(day.every((d) => d.passing === 300)).toBe(true);
  });

  it('crutches turn most transitions tight or short and ask for early release', () => {
    const day = evaluateDay(g, SAMPLE_SCHEDULE, PROFILES.crutches);
    const notFit = day.filter((d) => d.verdict !== 'fits');
    expect(notFit.length).toBeGreaterThanOrEqual(4);
    expect(day.some((d) => d.verdict === 'short')).toBe(true);
    expect(notFit.some((d) => d.earlyRelease > 0)).toBe(true);
    // Every floor change on crutches goes through the elevator.
    for (const d of day) if (d.route!.floorsChanged > 0) expect(d.route!.usesElevator).toBe(true);
  });

  it('a locker stop adds its time and is reported', () => {
    const base = evaluateDay(g, SAMPLE_SCHEDULE, PROFILES.walk)[0]!;
    const withLocker = evaluateDay(g, SAMPLE_SCHEDULE, PROFILES.walk, {
      crowd: 'typical', lockerStop: [20, 45], lockerStops: [0], lockerId: 'r1_Office',
    })[0]!;
    expect(withLocker.time[1]).toBeGreaterThan(base.time[1] + 45 - 1e-9);
    expect(withLocker.reasons).toContain('includes a locker stop');
  });

  it('reports an unreachable room plainly instead of throwing', () => {
    const m = { ...SAMPLE_SCHOOL, edges: SAMPLE_SCHOOL.edges.filter((e) => e.kind !== 'elevator') };
    const day = evaluateDay(buildGraph(m), SAMPLE_SCHEDULE, PROFILES.wheelchair);
    const stuck = day.find((d) => d.route === null)!;
    expect(stuck.verdict).toBe('short');
    expect(stuck.reasons[0]).toMatch(/No route/);
  });
});
