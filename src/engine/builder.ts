import type { EdgeKind, MapEdge, MapNode, NodeKind, SchoolMap } from './types';

export type Side = 'N' | 'S' | 'E' | 'W';

export interface Attach {
  /** Position along the corridor's axis (x for a horizontal corridor, y for a vertical one). */
  at: number;
  side?: Side;
  id?: string;
  label?: string;
  name?: string;
  kind?: NodeKind;
  /** Distance from the corridor centreline to the room/stair point. */
  depth?: number;
  door?: boolean;
}

/**
 * Small helper for authoring orthogonal school plans in metres. Corridor
 * nodes that land on the same floor and coordinate are merged, which is how
 * corridors join at junctions.
 */
export class MapBuilder {
  readonly nodes: MapNode[] = [];
  readonly edges: MapEdge[] = [];
  private byKey = new Map<string, string>();

  hallNode(floor: number, x: number, y: number): string {
    const key = `${floor}:${x}:${y}`;
    const found = this.byKey.get(key);
    if (found) return found;
    const id = `h${floor}_${x}_${y}`;
    this.nodes.push({ id, floor, x, y, kind: 'hall' });
    this.byKey.set(key, id);
    return id;
  }

  node(n: MapNode): string {
    if (this.nodes.some((m) => m.id === n.id)) throw new Error(`Duplicate node ${n.id}`);
    this.nodes.push(n);
    return n.id;
  }

  edge(a: string, b: string, kind: EdgeKind, extra: Partial<MapEdge> = {}): void {
    this.edges.push({ a, b, kind, ...extra });
  }

  /** A straight, axis-aligned corridor with rooms and stairs attached along it. */
  corridor(floor: number, name: string, from: [number, number], to: [number, number], attach: Attach[] = [], junctions: number[] = []): void {
    const horizontal = from[1] === to[1];
    if (!horizontal && from[0] !== to[0]) throw new Error(`Corridor ${name} must be horizontal or vertical`);
    const axis = (p: [number, number]) => (horizontal ? p[0] : p[1]);
    const point = (t: number): [number, number] => (horizontal ? [t, from[1]] : [from[0], t]);
    const stops = new Set<number>([axis(from), axis(to), ...attach.map((a) => a.at), ...junctions]);
    const ordered = [...stops].sort((a, b) => a - b);
    const ids = ordered.map((t) => this.hallNode(floor, ...point(t)));
    for (let i = 0; i + 1 < ids.length; i++) this.edge(ids[i]!, ids[i + 1]!, 'walk', { name });
    for (const a of attach) {
      const [hx, hy] = point(a.at);
      const d = a.depth ?? 7;
      const side = a.side ?? (horizontal ? 'N' : 'E');
      const [x, y] =
        side === 'N' ? [hx, hy - d] : side === 'S' ? [hx, hy + d] : side === 'E' ? [hx + d, hy] : [hx - d, hy];
      const id = a.id ?? `r${floor}_${a.label ?? `${x}_${y}`}`;
      const n: MapNode = { id, floor, x, y, kind: a.kind ?? 'room' };
      if (a.label !== undefined) n.label = a.label;
      if (a.name !== undefined) n.name = a.name;
      this.node(n);
      const extra: Partial<MapEdge> = {};
      if (a.door) extra.door = true;
      this.edge(this.hallNode(floor, hx, hy), id, 'walk', extra);
    }
  }

  build(meta: Omit<SchoolMap, 'nodes' | 'edges'>): SchoolMap {
    return { ...meta, nodes: this.nodes, edges: this.edges };
  }
}
