import { MapBuilder, type Attach } from '../engine/builder';
import { parseClock } from '../engine/schedule';
import type { Schedule, SchoolMap } from '../engine/types';

/**
 * "Northgate High": a SYNTHETIC sample school, authored for this demo and
 * labelled as such everywhere it appears. Two floors, a gym annex reached by a
 * ramp, three stairwells and one elevator, at plausible real-world scale.
 */

const room = (at: number, side: Attach['side'], label: string, name?: string, extra: Partial<Attach> = {}): Attach => {
  const a: Attach = { at, side, label, ...extra };
  if (name !== undefined) a.name = name;
  return a;
};

function build(): SchoolMap {
  const b = new MapBuilder();
  for (const f of [1, 2]) {
    const p = f * 100;
    const R = (n: number) => String(p + n);
    // Main Hall, the east–west spine. Junctions with the wings at x = 10 and x = 110.
    b.corridor(
      f,
      'Main Hall',
      [0, 30],
      [120, 30],
      [
        { at: 0, side: 'W', depth: 5, id: `st${f}_west`, label: 'West Stairs', kind: 'stair', door: true },
        { at: 120, side: 'E', depth: 5, id: `st${f}_east`, label: 'East Stairs', kind: 'stair', door: true },
        { at: 56, side: 'N', depth: 6, id: `st${f}_center`, label: 'Center Stairs', kind: 'stair', door: true },
        { at: 66, side: 'N', depth: 6, id: `el${f}`, label: 'Elevator E1', kind: 'elevator' },
        ...(f === 1
          ? [
              room(22, 'N', '101', 'Health'),
              room(32, 'N', '103', 'Computer Science'),
              room(44, 'N', 'Cafeteria', 'Cafeteria & Commons', { depth: 10 }),
              room(80, 'N', 'Library', 'Library', { depth: 9 }),
              room(94, 'N', '105', 'Chemistry'),
              room(26, 'S', 'Office', 'Main Office'),
              room(40, 'S', '102', 'Physics'),
              { at: 60, side: 'S' as const, depth: 8, id: 'entrance', label: 'Main Entrance', kind: 'entrance' as const, door: true },
              room(80, 'S', '104', 'Algebra II'),
              room(96, 'S', '106', 'Geometry'),
            ]
          : [
              room(22, 'N', R(1), 'Journalism'),
              room(32, 'N', R(3), 'Economics'),
              room(44, 'N', R(7), 'Psychology'),
              room(80, 'N', R(9), 'World History'),
              room(94, 'N', R(11), 'Music Theory'),
              room(26, 'S', R(2), 'French'),
              room(40, 'S', R(14), 'US History'),
              room(60, 'S', R(16), 'Government'),
              room(80, 'S', R(18), 'Statistics'),
              room(96, 'S', R(20), 'Calculus'),
            ]),
      ],
      [10, 110],
    );
    // West Wing, running south from the spine.
    b.corridor(
      f,
      'West Wing',
      [10, 30],
      [10, 74],
      f === 1
        ? [room(44, 'W', '112', 'Earth Science'), room(56, 'W', '114', 'Environmental Science'), room(68, 'W', '118', 'Biology'), room(44, 'E', '111', 'Spanish I'), room(56, 'E', '113', 'Latin'), room(68, 'E', '115', 'Anatomy')]
        : [room(44, 'W', R(22), 'English 9'), room(56, 'W', R(28), 'English 11'), room(68, 'W', R(5), 'Spanish II'), room(44, 'E', R(24), 'Creative Writing'), room(56, 'E', R(26), 'AP Literature')],
    );
    // East Wing, running south from the spine.
    b.corridor(
      f,
      'East Wing',
      [110, 30],
      [110, 74],
      f === 1
        ? [room(44, 'W', '131', 'Ceramics'), room(56, 'W', '133', 'Photography'), room(44, 'E', '142', 'Studio Art'), room(56, 'E', '144', 'Drama'), room(68, 'E', '146', 'Band')]
        : [room(44, 'W', R(33), 'Biology II'), room(56, 'W', R(37), 'Physics II'), room(44, 'E', R(35), 'AP Chemistry'), room(62, 'E', R(31), 'English 10')],
    );
  }
  // Gym annex: out of the East Wing's south end, then a long ramp down to the gym level.
  b.corridor(1, 'Gym Walk', [110, 74], [110, 86]);
  b.node({ id: 'ramp_top', floor: 1, x: 118, y: 86, kind: 'hall' });
  b.node({ id: 'ramp_bottom', floor: 1, x: 138, y: 86, kind: 'hall' });
  b.edge('h1_110_86', 'ramp_top', 'walk', { name: 'Gym Walk' });
  b.edge('ramp_top', 'ramp_bottom', 'ramp', { name: 'Gym Ramp' });
  b.node({ id: 'gym', floor: 1, x: 148, y: 86, kind: 'room', label: 'Gym', name: 'Gymnasium' });
  b.edge('ramp_bottom', 'gym', 'walk', { door: true });

  // Vertical connections: two flights per floor ≈ 14 m walked along the stair.
  for (const s of ['west', 'east', 'center']) {
    const label = `${s[0]!.toUpperCase()}${s.slice(1)} Stairs`;
    b.edge(`st1_${s}`, `st2_${s}`, 'stair', { length: 14, name: label });
  }
  b.edge('el1', 'el2', 'elevator', { name: 'Elevator E1' });

  return b.build({
    id: 'northgate-sample',
    name: 'Northgate High',
    synthetic: true,
    floors: [
      { id: 1, name: 'Floor 1' },
      { id: 2, name: 'Floor 2' },
    ],
    outlines: [1, 2].map((floor) => ({
      floor,
      points: [
        [-10, 12],
        [130, 12],
        [130, 80],
        [96, 80],
        [96, 46],
        [24, 46],
        [24, 80],
        [-4, 80],
        [-4, 46],
        [-10, 46],
      ] as [number, number][],
    })),
  });
}

export const SAMPLE_SCHOOL: SchoolMap = build();

const t = parseClock;

/** A plausible bell schedule: 55-minute periods, 5-minute passing. Synthetic. */
export const SAMPLE_SCHEDULE: Schedule = {
  periods: [
    { id: 'p1', name: 'Period 1', start: t('07:50'), end: t('08:45') },
    { id: 'p2', name: 'Period 2', start: t('08:50'), end: t('09:45') },
    { id: 'p3', name: 'Period 3', start: t('09:50'), end: t('10:45') },
    { id: 'p4', name: 'Period 4', start: t('10:50'), end: t('11:45') },
    { id: 'lunch', name: 'Lunch', start: t('11:50'), end: t('12:25') },
    { id: 'p5', name: 'Period 5', start: t('12:30'), end: t('13:25') },
    { id: 'p6', name: 'Period 6', start: t('13:30'), end: t('14:25') },
  ],
  classes: [
    { periodId: 'p1', roomId: 'r1_118', title: 'Biology' },
    { periodId: 'p2', roomId: 'r2_231', title: 'English 10' },
    { periodId: 'p3', roomId: 'gym', title: 'PE' },
    { periodId: 'p4', roomId: 'r2_214', title: 'US History' },
    { periodId: 'lunch', roomId: 'r1_Cafeteria', title: 'Lunch' },
    { periodId: 'p5', roomId: 'r1_142', title: 'Studio Art' },
    { periodId: 'p6', roomId: 'r2_205', title: 'Spanish II' },
  ],
};
