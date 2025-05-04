// QuadrantUtils.ts

import ngeohash from "ngeohash";

export const GEO_BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
export const DEFAULT_GEO_LEVEL = 6; // ≈ 1 km around 23° N
export type Quadrant = string;

export type BBox = [number, number, number, number];

export class QuadrantUtils {
  public static encode(
    [lon, lat]: [number, number],
    level: number = DEFAULT_GEO_LEVEL
  ): Quadrant {
    QuadrantUtils.guardLevel(level);
    return ngeohash.encode(lat, lon, level);
  }

  public static decode(q: Quadrant): [number, number] {
    QuadrantUtils.assertValid(q);
    const { latitude, longitude } = ngeohash.decode(q);
    return [longitude, latitude];
  }

  public static level(q: Quadrant): number {
    QuadrantUtils.assertValid(q);
    return q.length;
  }

  public static isValid(q: unknown): q is Quadrant {
    return (
      typeof q === "string" &&
      q.length > 0 &&
      [...q].every((c) => GEO_BASE32.includes(c))
    );
  }

  public static neighbourhood(q: Quadrant): Quadrant[] {
    QuadrantUtils.assertValid(q);
    return [q, ...ngeohash.neighbors(q)];
  }

  /** Eight immediate neighbours only. */
  public static neighbours(q: Quadrant): Quadrant[] {
    QuadrantUtils.assertValid(q);
    return ngeohash.neighbors(q);
  }

  public static parent(q: Quadrant): Quadrant {
    QuadrantUtils.assertValid(q);
    if (q.length === 1) throw new RangeError("ROOT_HAS_NO_PARENT");
    return q.slice(0, -1);
  }

  /** Thirty‑two immediate children one level finer. */
  public static children(q: Quadrant): Quadrant[] {
    QuadrantUtils.assertValid(q);
    return [...GEO_BASE32].map((c) => q + c);
  }

  public static bbox(q: Quadrant): BBox {
    QuadrantUtils.assertValid(q);
    const [minLat, minLon, maxLat, maxLon] = ngeohash.decode_bbox(q);
    return [minLon, minLat, maxLon, maxLat];
  }

  public static distance(q1: Quadrant, q2: Quadrant): number {
    const [lon1, lat1] = QuadrantUtils.decode(q1);
    const [lon2, lat2] = QuadrantUtils.decode(q2);
    return QuadrantUtils.haversine(lat1, lon1, lat2, lon2);
  }

  public static coverBBox(
    [minLon, minLat, maxLon, maxLat]: BBox,
    level: number = DEFAULT_GEO_LEVEL
  ): Set<Quadrant> {
    QuadrantUtils.guardLevel(level);
    if (minLon > maxLon || minLat > maxLat)
      throw new RangeError("INVALID_BBOX_CORNERS");

    // Step size ≈ cell diagonal so we don’t miss skinny strips.
    const [latSpan, lonSpan] = QuadrantUtils.cellSize(level);
    const dLat = latSpan;
    const dLon = lonSpan;

    const cells = new Set<Quadrant>();
    for (let lat = minLat; lat <= maxLat; lat += dLat) {
      for (let lon = minLon; lon <= maxLon; lon += dLon) {
        cells.add(QuadrantUtils.encode([lon, lat], level));
      }
    }
    // Edges might straddle – make sure max corner is covered.
    cells.add(QuadrantUtils.encode([maxLon, maxLat], level));
    return cells;
  }

  public static cellSize(level: number): [number, number] {
    QuadrantUtils.guardLevel(level);
    if (!QuadrantUtils.sizeCache.has(level)) {
      // Size halves at each increment, starting from 180° × 360° / 2
      const latSpan = 180 / 2 ** Math.ceil((level * 5) / 2);
      const lonSpan = 360 / 2 ** Math.floor((level * 5) / 2);
      QuadrantUtils.sizeCache.set(level, [latSpan, lonSpan]);
    }
    return QuadrantUtils.sizeCache.get(level)!;
  }

  private static sizeCache: Map<number, [number, number]> = new Map();

  private static assertValid(q: Quadrant): void {
    if (!QuadrantUtils.isValid(q)) throw new TypeError("INVALID_QUADRANT");
  }

  private static guardLevel(level: number): void {
    if (!Number.isInteger(level) || level < 1 || level > 12)
      throw new RangeError("LEVEL_OUT_OF_RANGE");
  }

  private static haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6_371_000; // mean Earth radius (m)
    const φ1 = QuadrantUtils.deg2rad(lat1);
    const φ2 = QuadrantUtils.deg2rad(lat2);
    const Δφ = QuadrantUtils.deg2rad(lat2 - lat1);
    const Δλ = QuadrantUtils.deg2rad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  private static deg2rad(d: number): number {
    return (d * Math.PI) / 180;
  }
}
