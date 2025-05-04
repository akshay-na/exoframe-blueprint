// ObjectUtils.ts
// Useful utilities that manipulate POJsO objs

import hash from "object-hash";

import { LooseObject } from "./LooseObject";
import { Reflectable } from "./types";

export class ObjectUtils {
  public static isLooseObject(obj: unknown): boolean {
    return typeof obj === "object" && obj?.constructor === Object;
  }

  public static asLooseObject(obj: unknown): LooseObject {
    if (!ObjectUtils.isLooseObject(obj))
      throw new TypeError("CANNOT_CAST_AS_LOOSE_OBJECT");
    return obj as LooseObject;
  }

  public static md5(obj: object, encoding?: string): string {
    return hash(obj, { algorithm: "md5", encoding });
  }

  public static sha256(obj: object, encoding?: string): string {
    return hash(obj, { algorithm: "sha256", encoding });
  }

  public static prune<T extends object>(obj: T): T {
    Reflect.ownKeys(obj).forEach((key) => {
      if (Reflect.get(obj, key) === undefined) Reflect.deleteProperty(obj, key);
    });
    return obj;
  }

  public static stripNulls<T extends object>(obj: T): T {
    return ObjectUtils.exclude(obj, null);
  }

  public static exclude<T>(obj: object, ...values: unknown[]): T {
    const clone = Object.assign({}, obj) as Record<PropertyKey, unknown>;
    Reflect.ownKeys(obj).forEach((key) => {
      const v = Reflect.get(obj, key);
      if (v !== undefined && values.find((e) => e === v) !== undefined)
        Reflect.deleteProperty(clone, key);
    });
    return clone as T;
  }

  public static include<T>(obj: object, ...values: unknown[]): T {
    const clone = Object.assign({}, obj) as Record<PropertyKey, unknown>;
    Reflect.ownKeys(obj).forEach((key) => {
      const v = Reflect.get(obj, key);
      if (v !== undefined && values.find((e) => e === v) === undefined)
        Reflect.deleteProperty(clone, key);
    });
    return clone as T;
  }

  public static omit<T>(obj: object, ...properties: PropertyKey[]): T {
    const clone = Object.assign({}, obj) as Record<PropertyKey, unknown>;
    properties.forEach((prop) => {
      if (typeof prop !== "symbol") delete clone[prop];
    });
    return clone as T;
  }

  public static pick<T>(obj: object, ...properties: PropertyKey[]): T {
    const clone = {} as Record<PropertyKey, unknown>;
    properties.forEach((prop) => {
      if (typeof prop !== "symbol" && Reflect.has(obj, prop))
        clone[prop] = Reflect.get(obj, prop);
    });
    return clone as T;
  }

  public static rename<T>(obj: object, from: PropertyKey, to: PropertyKey): T {
    if (!Reflect.has(obj, from)) return obj as unknown as T;
    Reflect.set(obj, to, Reflect.get(obj, from));
    Reflect.deleteProperty(obj, from);
    return obj as unknown as T;
  }

  public static find(obj: object, ...properties: PropertyKey[]): PropertyKey[] {
    const found = new Array<PropertyKey>();
    properties.forEach((prop) => {
      if (typeof prop !== "symbol" && Reflect.has(obj, prop)) found.push(prop);
    });
    return found;
  }

  public static merge<T>(...sources: object[]): T {
    const values = new Array<unknown>();
    sources.forEach((o) => values.push(ObjectUtils.prune(o)));
    return Object.assign({}, ...values);
  }

  public static assignAll<T extends Reflectable>(
    target: T,
    value: unknown,
    ...keys: PropertyKey[]
  ): T {
    keys.forEach((key) => Reflect.set(target, key, value));
    return target as T;
  }

  public static toMap<T extends Reflectable, V = unknown>(
    obj: T,
    coercion?: (v: unknown) => V
  ): Map<string, V> {
    coercion = coercion ?? ((v) => v as V);
    const map = new Map<string, V>();
    for (const key of Object.keys(obj)) {
      map.set(key, coercion(Reflect.get(obj, key)));
    }
    return map;
  }
}
