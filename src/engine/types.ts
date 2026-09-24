/**
 * Core data model. Coordinates are metres on a per-floor plane, so a traced
 * map and the sample school share one unit and every distance is a real length.
 */

export type NodeKind = 'room' | 'hall' | 'door' | 'stair' | 'elevator' | 'entrance';

export interface MapNode {
  id: string;
  floor: number;
  x: number;
  y: number;
  kind: NodeKind;
  /** Short label shown on the plan and read aloud in directions, e.g. "118", "East Stairs". */
  label?: string;
  /** Longer name, e.g. "Biology Lab". Optional. */
  name?: string;
}

/**
 * walk     level corridor or room doorway
 * stair    a stair run between two stair nodes on different floors
 * elevator a lift ride between two elevator nodes on different floors
 * ramp     a sloped connection (step-free, slower for wheels)
 * outdoor  a path outside between buildings
 */
export type EdgeKind = 'walk' | 'stair' | 'elevator' | 'ramp' | 'outdoor';

export interface MapEdge {
  a: string;
  b: string;
  kind: EdgeKind;
  /** Corridor name used in directions ("North Hall"). */
  name?: string;
  /** Override length in metres. Stairs use the distance walked along the stair. */
  length?: number;
  /** Heavy or manual door on this edge (adds door time for some profiles). */
  door?: boolean;
}

export interface Floor {
  id: number;
  name: string;
}

export interface SchoolMap {
  id: string;
  name: string;
  /** True for the built-in demo school: the UI must label it as synthetic. */
  synthetic: boolean;
  floors: Floor[];
  nodes: MapNode[];
  edges: MapEdge[];
  /** Optional outline polygons per floor, drawn as walls. Metres. */
  outlines?: { floor: number; points: [number, number][] }[];
}

/** A closed interval [lo, hi] of seconds or of a speed. lo <= hi always. */
export type Range = readonly [number, number];

export interface Period {
  id: string;
  /** e.g. "Period 2", "Lunch". */
  name: string;
  /** Minutes after midnight. */
  start: number;
  end: number;
}

export interface ClassBlock {
  periodId: string;
  roomId: string;
  /** e.g. "English 10". */
  title: string;
}

export interface Schedule {
  periods: Period[];
  classes: ClassBlock[];
}

export type CrowdLevel = 'quiet' | 'typical' | 'packed';

export interface Profile {
  id: 'walk' | 'crutches' | 'wheelchair' | 'custom';
  label: string;
  /** Level-floor speed, m/s. */
  level: Range;
  /** Speed along a stair, m/s, or null when stairs are not usable. */
  stairs: Range | null;
  /** Speed on ramps, m/s. */
  ramp: Range;
  /** Whether the elevator is usable/needed. */
  elevator: boolean;
  /** Seconds added per heavy door. */
  door: Range;
}

export interface Options {
  crowd: CrowdLevel;
  /** Seconds added for a locker stop, applied to transitions flagged in `lockerStops`. */
  lockerStop: Range;
  /** Transition indices (0-based) where the student stops at their locker. */
  lockerStops: number[];
  /** Locker node id, if set. */
  lockerId?: string;
}

export interface Step {
  from: string;
  to: string;
  kind: EdgeKind;
  length: number;
  time: Range;
  name?: string;
  door?: boolean;
}

export interface Route {
  nodes: string[];
  steps: Step[];
  length: number;
  time: Range;
  usesElevator: boolean;
  usesStairs: boolean;
  floorsChanged: number;
}

export type Verdict = 'fits' | 'tight' | 'short';

export interface TransitionResult {
  index: number;
  from: ClassBlock;
  to: ClassBlock;
  fromPeriod: Period;
  toPeriod: Period;
  /** Seconds between the bells. */
  passing: number;
  route: Route | null;
  /** Total time including stops. */
  time: Range;
  verdict: Verdict;
  /** Seconds to spare at the slow end (fits) or seconds short at the fast end (short). */
  margin: number;
  /** Whole minutes of early release that cover the slow end with quiet halls. 0 when not needed. */
  earlyRelease: number;
  /** Why it's short or tight, in plain words. */
  reasons: string[];
}
