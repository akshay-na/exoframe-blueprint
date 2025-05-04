import { LooseObject } from "../common/LooseObject";
import { RouteRegistry } from "../express/RouteRegistry";
import {
  ConfigurationOptions,
  EndpointOptions,
  ErrorMappingOptions,
  RouteOptions,
} from "./types";

export const META_ROUTE = Symbol("route:meta");
export const META_DESCRIPTION = Symbol("route:description");
export const META_DISCOVERABLE = Symbol("route:discoverable");
export const META_ENDPOINT = Symbol("method:endpoint");
export const META_CONFIG = Symbol("method:config");
export const META_ARGS = Symbol("method:args");
export const META_ERRORS = Symbol("method:errors");

export function Route(
  path: string,
  options: RouteOptions = {}
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(META_ROUTE, { path, ...options }, target);
    RouteRegistry.instance.register(target);
  };
}

export function RouteDescription(description: string): ClassDecorator {
  return (target) =>
    Reflect.defineMetadata(META_DESCRIPTION, description, target);
}

export function Discoverable(tag: string): ClassDecorator {
  return (target) => Reflect.defineMetadata(META_DISCOVERABLE, tag, target);
}

export function Endpoint(
  method: string,
  options: EndpointOptions = {}
): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      META_ENDPOINT,
      { method, ...options },
      target,
      propertyKey
    );
  };
}

export function Configuration(options: ConfigurationOptions): MethodDecorator {
  return (target, propertyKey) =>
    Reflect.defineMetadata(META_CONFIG, options, target, propertyKey);
}

export function ArgumentMapping(
  args: (string | LooseObject)[]
): MethodDecorator {
  return (target, propertyKey) =>
    Reflect.defineMetadata(META_ARGS, args, target, propertyKey);
}

export function ErrorMapping(map: ErrorMappingOptions): MethodDecorator {
  return (target, propertyKey) =>
    Reflect.defineMetadata(META_ERRORS, map, target, propertyKey);
}
