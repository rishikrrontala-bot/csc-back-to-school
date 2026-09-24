import { describe, expect, it } from 'vitest';
import { PROFILES } from '../src/engine/profiles';
import { buildGraph, edgeTime, findRoute } from '../src/engine/route';
import { SAMPLE_SCHOOL } from '../src/data/sample-school';
import { tinySchool } from './fixtures';

describe('buildGraph', () => {
  it('rejects edges to missing nodes and duplicate ids', () => {
    const m = tinySchool();
    expect(() => buildGraph({ ...m, edges: [...m.edges, { a: 'A', b: 'nope', kind: 'walk' }] })).toThrow(/does not exist/);
    expect(() => buildGraph({ ...m, nodes: [...m.nodes, m.nodes[0]!] })).toThrow(/Duplicate/);
  });
});

describe('findRoute', () => {
  const g = buildGraph(tinySchool());

  it('walkers take the stairs next to the destination', () => {
    const r = findRoute(g, 'A', 'B', PROFILES.walk, 'quiet')!;
    expect(r.usesStairs).toBe(true);
    expect(r.usesElevator).toBe(false);
    // 2 m out of A, 100 m of hall, 2 m to the stairs, 14 m of stair, 2 m out, 2 m into B.
    expect(r.length).toBeCloseTo(122, 5);
    // Walking 1.1–1.4 m/s on 108 m of level, 0.59–0.88 m/s on 14 m of stair.
    expect(r.time[0]).toBeCloseTo(108 / 1.4 + 14 / 0.88, 5);
    expect(r.time[1]).toBeCloseTo(108 / 1.1 + 14 / 0.59, 5);
  });

  it('wheelchairs are routed through the elevator, never the stairs', () => {
    const r = findRoute(g, 'A', 'B', PROFILES.wheelchair, 'quiet')!;
    expect(r.usesElevator).toBe(true);
    expect(r.usesStairs).toBe(false);
    expect(r.nodes).toContain('E1');
    expect(r.floorsChanged).toBe(1);
  });

  it('returns null when no usable route exists', () => {
    const m = tinySchool();
    const noLift = buildGraph({ ...m, edges: m.edges.filter((e) => e.kind !== 'elevator') });
    expect(findRoute(noLift, 'A', 'B', PROFILES.wheelchair)).toBeNull();
    expect(findRoute(noLift, 'A', 'missing', PROFILES.walk)).toBeNull();
  });

  it('never routes through another room', () => {
    const sg = buildGraph(SAMPLE_SCHOOL);
    const r = findRoute(sg, 'r1_118', 'r2_231', PROFILES.walk)!;
    const rooms = r.nodes.filter((id) => sg.nodes.get(id)!.kind === 'room');
    expect(rooms).toEqual(['r1_118', 'r2_231']);
  });

  it('crowds only ever slow a route down', () => {
    const quiet = findRoute(g, 'A', 'B', PROFILES.walk, 'quiet')!;
    const packed = findRoute(g, 'A', 'B', PROFILES.walk, 'packed')!;
    expect(packed.time[0]).toBeGreaterThan(quiet.time[0]);
    expect(packed.time[1]).toBeGreaterThan(quiet.time[1]);
  });

  it('heavy doors add the profile’s door time', () => {
    const e = { a: 'A', b: 'h1_0_0', kind: 'walk' as const, door: true };
    const plain = edgeTime(g, { ...e, door: false }, PROFILES.wheelchair, 'quiet')!;
    const heavy = edgeTime(g, e, PROFILES.wheelchair, 'quiet')!;
    expect(heavy[0] - plain[0]).toBeCloseTo(PROFILES.wheelchair.door[0]);
    expect(heavy[1] - plain[1]).toBeCloseTo(PROFILES.wheelchair.door[1]);
  });
});
