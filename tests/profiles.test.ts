import { describe, expect, it } from 'vitest';
import { CROWD, PROFILES, addRange, mid, scaleRange, timeFor } from '../src/engine/profiles';

describe('profiles', () => {
  it('every range is ordered lo <= hi and positive', () => {
    for (const p of Object.values(PROFILES)) {
      for (const r of [p.level, p.ramp, p.door, ...(p.stairs ? [p.stairs] : [])]) {
        expect(r[0]).toBeGreaterThanOrEqual(0);
        expect(r[0]).toBeLessThanOrEqual(r[1]);
      }
    }
    for (const c of Object.values(CROWD)) expect(c[0]).toBeLessThanOrEqual(c[1]);
  });

  it('wheelchair and crutches cannot use stairs and do use the elevator', () => {
    expect(PROFILES.wheelchair.stairs).toBeNull();
    expect(PROFILES.crutches.stairs).toBeNull();
    expect(PROFILES.wheelchair.elevator).toBe(true);
  });

  it('walking brackets Weidmann’s 1.34 m/s free speed', () => {
    expect(PROFILES.walk.level[0]).toBeLessThan(1.34);
    expect(PROFILES.walk.level[1]).toBeGreaterThan(1.34);
  });

  it('timeFor divides length by the speed range, fast end first', () => {
    expect(timeFor(100, [1, 2])).toEqual([50, 100]);
    // Crowds slow both ends.
    expect(timeFor(90, [1, 1], [0.5, 0.9])).toEqual([100, 180]);
  });

  it('range helpers', () => {
    expect(addRange([1, 2], [3, 4])).toEqual([4, 6]);
    expect(scaleRange([1, 2], 3)).toEqual([3, 6]);
    expect(mid([2, 4])).toBe(3);
  });
});
