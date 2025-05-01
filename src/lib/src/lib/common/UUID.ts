import { v4 as UUIDv4, v5 as UUIDv5 } from "uuid";

import { InvalidUuid } from "./errors";
import { UuidType } from "./types";

// re-implemented to use the new `uuid` module
export class UUID {
  public static PATTERN =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  public static randomUUID(): UuidType {
    return UUIDv4();
  }

  public static domainUUID(domain: string): UuidType {
    return UUIDv5(domain, UUIDv5.DNS);
  }

  public static urlUUID(url: string | URL): UuidType {
    return typeof url === "string"
      ? UUIDv5(url, UUIDv5.URL)
      : UUIDv5(url.toString(), UUIDv5.URL);
  }

  public static customUUID(value: unknown, ns: string): UuidType {
    return UUIDv5(`${value}`, ns);
  }

  public static parts(uuid: UuidType): string[] {
    if (!UUID.validate(uuid)) throw new InvalidUuid({ uuid });
    return [
      uuid.slice(0, 8),
      uuid.slice(9, 13),
      uuid.slice(14, 18),
      uuid.slice(19, 23),
      uuid.slice(24, 36),
    ];
  }

  public static values(uuid: UuidType): number[] {
    return UUID.parts(uuid).map((part) => Number.parseInt(part, 16));
  }

  public static parse(uuid: UuidType): Uint8Array {
    const values = UUID.values(uuid);
    const bytes = new Uint8Array(16);

    // Parse ########-....-....-....-............
    bytes[0] = values[0] >>> 24;
    bytes[1] = (values[0] >>> 16) & 0xff;
    bytes[2] = (values[0] >>> 8) & 0xff;
    bytes[3] = values[0] & 0xff;

    // Parse ........-####-....-....-............
    bytes[4] = values[1] >>> 8;
    bytes[5] = values[1] & 0xff;

    // Parse ........-....-####-....-............
    bytes[6] = values[2] >>> 8;
    bytes[7] = values[2] & 0xff;

    // Parse ........-....-....-####-............
    bytes[8] = values[3] >>> 8;
    bytes[9] = values[3] & 0xff;

    // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    bytes[10] = (values[4] / 0x10000000000) & 0xff;
    bytes[11] = (values[4] / 0x100000000) & 0xff;
    bytes[12] = (values[4] >>> 24) & 0xff;
    bytes[13] = (values[4] >>> 16) & 0xff;
    bytes[14] = (values[4] >>> 8) & 0xff;
    bytes[15] = values[4] & 0xff;

    return bytes;
  }

  public static validate(uuid: UuidType): boolean {
    return UUID.PATTERN.test(uuid);
  }

  public static version(uuid: UuidType): number {
    if (!UUID.validate(uuid)) throw new InvalidUuid({ uuid });
    else return Number.parseInt(uuid.substr(14, 1), 16);
  }
}
