import type { CrowdLevel, Profile, Range } from './types';

/**
 * Speed ranges and their sources. Every number here is either cited in
 * docs/SOURCES.md or explicitly labelled an assumption the user can edit.
 */

export const PROFILES: Record<Profile['id'], Profile> = {
  walk: {
    id: 'walk',
    label: 'Walking',
    // Weidmann's free walking speed is 1.34 m/s; adolescents' habitual pace runs a little lower.
    level: [1.1, 1.4],
    // Fruin: 0.59–0.88 m/s measured along the stair (female up … male down).
    stairs: [0.59, 0.88],
    ramp: [1.0, 1.3],
    elevator: false,
    door: [0, 1],
  },
  crutches: {
    id: 'crutches',
    label: 'Crutches',
    // 3-point axillary crutch gait ≈ 0.5 m/s (Malaysian Orthopaedic Journal 2021);
    // practised swing-through gait reaches 1.2 m/s, so 0.9 is a generous upper bound for a new injury.
    level: [0.5, 0.9],
    // Stairs on crutches are possible but unsafe in a crowd; off by default (elevator instead).
    stairs: null,
    ramp: [0.45, 0.8],
    elevator: true,
    door: [3, 8],
  },
  wheelchair: {
    id: 'wheelchair',
    label: 'Wheelchair',
    // Self-selected manual propulsion ≈ 1.27 m/s on a lab surface; corridors with turns and people run slower.
    level: [0.9, 1.27],
    stairs: null,
    ramp: [0.6, 1.0],
    elevator: true,
    door: [4, 10],
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    level: [0.7, 1.0],
    stairs: [0.3, 0.5],
    ramp: [0.6, 0.9],
    elevator: false,
    door: [1, 4],
  },
};

/**
 * Crowd multiplier on speed during a passing period. Weidmann's fundamental
 * diagram: speed falls as density rises. The ranges are assumptions, shown to the user.
 */
export const CROWD: Record<CrowdLevel, Range> = {
  quiet: [1, 1],
  typical: [0.75, 0.9],
  packed: [0.55, 0.75],
};

/** Elevator: waiting for the car (often key-operated in schools) plus the ride. Assumption. */
export const ELEVATOR_WAIT: Range = [30, 90];
export const ELEVATOR_PER_FLOOR: Range = [4, 6];

export const LOCKER_STOP: Range = [20, 45];

/** Divide a length by a speed range: fast end gives the short time. */
export function timeFor(length: number, speed: Range, crowd: Range = [1, 1]): Range {
  const fast = speed[1] * crowd[1];
  const slow = speed[0] * crowd[0];
  return [length / fast, length / slow];
}

export function addRange(a: Range, b: Range): Range {
  return [a[0] + b[0], a[1] + b[1]];
}

export function scaleRange(a: Range, k: number): Range {
  return [a[0] * k, a[1] * k];
}

export function mid(r: Range): number {
  return (r[0] + r[1]) / 2;
}
