import { describe, expect, it } from 'vitest';
import { PROFILES } from '../src/engine/profiles';
import { buildGraph, findRoute } from '../src/engine/route';
import { directionsFor, placeName, sayDistance, turnSide } from '../src/engine/directions';
import { SAMPLE_SCHOOL } from '../src/data/sample-school';
import { tinySchool } from './fixtures';
import type { MapNode } from '../src/engine/types';

const n = (x: number, y: number): MapNode => ({ id: `${x},${y}`, floor: 1, x, y, kind: 'hall' });

describe('turnSide (y points down the page)', () => {
  it('east then south is a right turn', () => expect(turnSide(n(0, 0), n(10, 0), n(10, 10))).toBe('right'));
  it('east then north is a left turn', () => expect(turnSide(n(0, 0), n(10, 0), n(10, -10))).toBe('left'));
  it('a slight bend reads as straight', () => expect(turnSide(n(0, 0), n(10, 0), n(20, 2))).toBe('straight'));
});

describe('phrasing', () => {
  it('names rooms by number and keeps named places', () => {
    expect(placeName({ id: 'x', floor: 1, x: 0, y: 0, kind: 'room', label: '214' })).toBe('Room 214');
    expect(placeName({ id: 'x', floor: 1, x: 0, y: 0, kind: 'room', label: 'Library' })).toBe('Library');
  });
  it('rounds distances like a person', () => {
    expect(sayDistance(3)).toBe('a few steps');
    expect(sayDistance(43)).toBe('45 m');
    expect(sayDistance(117)).toBe('120 m');
  });
});

describe('directionsFor', () => {
  it('walks the tiny school: hall, stairs, arrive', () => {
    const g = buildGraph(tinySchool());
    const d = directionsFor(g, findRoute(g, 'A', 'B', PROFILES.walk)!);
    expect(d.map((x) => x.kind)).toEqual(['start', 'walk', 'stairs', 'arrive']);
    expect(d[0]!.text).toBe('Leave Room 101 on Floor 1.');
    expect(d[2]!.text).toBe('Take North Stairs up to Floor 2.');
    expect(d[3]!.text).toMatch(/^Room 201 is /);
  });

  it('uses only labels that exist on the map', () => {
    const g = buildGraph(SAMPLE_SCHOOL);
    const known = new Set<string>(['the hallway']);
    for (const e of SAMPLE_SCHOOL.edges) if (e.name) known.add(e.name);
    for (const node of SAMPLE_SCHOOL.nodes) if (node.label) known.add(node.label);
    const r = findRoute(g, 'r1_118', 'r2_231', PROFILES.wheelchair)!;
    for (const step of directionsFor(g, r)) {
      const places = [...step.text.matchAll(/(?:into|along|Take|Leave|Room) ([A-Z][\w ]*?|\d+)(?= and| for| up| down| on| is|\.| \()/g)].map((m) => m[1]!);
      for (const p of places) expect(known.has(p) || known.has(p.replace(/^Room /, '')), `${p} in "${step.text}"`).toBe(true);
    }
  });

  it('instruction times add up to the route time', () => {
    const g = buildGraph(SAMPLE_SCHOOL);
    const r = findRoute(g, 'r2_231', 'gym', PROFILES.walk)!;
    const d = directionsFor(g, r);
    const lo = d.reduce((s, x) => s + x.time[0], 0);
    const hi = d.reduce((s, x) => s + x.time[1], 0);
    expect(lo).toBeCloseTo(r.time[0], 6);
    expect(hi).toBeCloseTo(r.time[1], 6);
  });
});
