import { describe, expect, it } from 'vitest';
import { decodeShare, encodeShare, validMap, type ShareState } from '../src/engine/share';
import { SAMPLE_SCHEDULE, SAMPLE_SCHOOL } from '../src/data/sample-school';

const state: ShareState = { v: 1, profile: 'crutches', crowd: 'typical', lockerStops: [1], schedule: SAMPLE_SCHEDULE };

describe('share links', () => {
  it('round-trips a schedule', () => {
    const hash = encodeShare(state);
    expect(hash.startsWith('s=')).toBe(true);
    expect(decodeShare('#' + hash)).toEqual(state);
  });

  it('round-trips a whole traced map and stays URL-safe', () => {
    const hash = encodeShare({ ...state, map: SAMPLE_SCHOOL });
    expect(hash).toMatch(/^s=[A-Za-z0-9+\-$_]*$/);
    expect(decodeShare(hash)?.map?.nodes.length).toBe(SAMPLE_SCHOOL.nodes.length);
    // A full two-floor school fits comfortably in a link.
    expect(hash.length).toBeLessThan(8000);
  });

  it('rejects garbage and tampered links instead of throwing', () => {
    expect(decodeShare('')).toBeNull();
    expect(decodeShare('#s=not-lz')).toBeNull();
    expect(decodeShare('#x=abc')).toBeNull();
    expect(decodeShare(encodeShare({ ...state, profile: 'rocket' as never }))).toBeNull();
    const badMap = { ...SAMPLE_SCHOOL, edges: [{ a: 'nope', b: 'gym', kind: 'walk' as const }] };
    expect(decodeShare(encodeShare({ ...state, map: badMap }))).toBeNull();
  });

  it('validMap catches duplicate ids', () => {
    expect(validMap(SAMPLE_SCHOOL)).toBe(true);
    expect(validMap({ ...SAMPLE_SCHOOL, nodes: [...SAMPLE_SCHOOL.nodes, SAMPLE_SCHOOL.nodes[0]] })).toBe(false);
  });
});
