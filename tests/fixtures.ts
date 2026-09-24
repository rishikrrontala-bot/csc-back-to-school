import { MapBuilder } from '../src/engine/builder';
import type { SchoolMap } from '../src/engine/types';

/**
 * A tiny two-floor school with exact, hand-checkable geometry:
 *  Floor 1: A (room) at x=0 — hall 100 m east — stairs S1 at x=100, elevator E1 at x=0 (next to A).
 *  Floor 2: B (room) at x=100 above the stairs.
 * Walkers take the stairs next to B; wheelchairs must use the elevator at the far end.
 */
export function tinySchool(): SchoolMap {
  const b = new MapBuilder();
  b.corridor(1, 'Ground Hall', [0, 0], [100, 0], [
    { at: 0, side: 'N', depth: 2, id: 'A', label: '101', kind: 'room' },
    { at: 0, side: 'S', depth: 2, id: 'E1', label: 'Elevator E1', kind: 'elevator' },
    { at: 100, side: 'N', depth: 2, id: 'S1', label: 'North Stairs', kind: 'stair' },
  ]);
  b.corridor(2, 'Upper Hall', [0, 0], [100, 0], [
    { at: 0, side: 'S', depth: 2, id: 'E2', label: 'Elevator E1', kind: 'elevator' },
    { at: 100, side: 'N', depth: 2, id: 'S2', label: 'North Stairs', kind: 'stair' },
    { at: 100, side: 'S', depth: 2, id: 'B', label: '201', kind: 'room' },
  ]);
  b.edge('S1', 'S2', 'stair', { length: 14, name: 'North Stairs' });
  b.edge('E1', 'E2', 'elevator', { name: 'Elevator E1' });
  return b.build({ id: 'tiny', name: 'Tiny', synthetic: true, floors: [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }] });
}
