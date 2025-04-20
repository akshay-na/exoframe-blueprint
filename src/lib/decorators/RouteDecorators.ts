// src/lib/decorators/endpoint.ts
import "reflect-metadata";
import { RuntimeError } from "../common/RuntimeError";
import { EndpointConfig, EndpointDef, ErrorMap, HttpVerb } from "./types";

export const ENDPOINTS_KEY = Symbol("endpoints");
export const BASE_PATH_KEY = Symbol("basePath");
export const DISCOVERABLE_KEY = Symbol("discoverableTag");
export const ARG_MAP_KEY = Symbol("argMap");
export const CONFIG_KEY = Symbol("endpointConfig");
export const ERROR_MAP_KEY = Symbol("errorMap");

export function Endpoint(verb: HttpVerb, options?: Record<string, unknown>) {
  return (target: object, prop: string | symbol) => {
    const eps: EndpointDef[] =
      Reflect.getMetadata(ENDPOINTS_KEY, target.constructor) ?? [];
    eps.push({ verb, options, handlerName: prop });
    Reflect.defineMetadata(ENDPOINTS_KEY, eps, target.constructor);
  };
}

export function Route(basePath: string) {
  return <T extends { new (...args: any[]): {} }>(ctr: T) =>
    Reflect.defineMetadata(BASE_PATH_KEY, basePath, ctr);
}

export function Discoverable(tag: string) {
  if (!tag || tag.includes("/"))
    throw new RuntimeError("Discoverable tag must be non‑empty without “/”");
  return <T extends { new (...args: any[]): {} }>(ctr: T) =>
    Reflect.defineMetadata(DISCOVERABLE_KEY, tag, ctr);
}

export function ArgumentMapping(parts: string[]) {
  return (target: object, prop: string | symbol) =>
    Reflect.defineMetadata(ARG_MAP_KEY, parts, target, prop);
}

export function Configuration(cfg: EndpointConfig) {
  return (t: object, p: string | symbol) =>
    Reflect.defineMetadata(CONFIG_KEY, cfg, t, p);
}

export function ErrorMapping(map: ErrorMap) {
  return (t: object, p: string | symbol) =>
    Reflect.defineMetadata(ERROR_MAP_KEY, map, t, p);
}
