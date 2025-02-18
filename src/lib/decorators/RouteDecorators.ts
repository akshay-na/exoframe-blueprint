import { RouteOptions } from "./types";
// src/lib/decorators/RouteDecorators.ts

/**
 * Declares the base path and version for the route.
 */
export function Route(path: string, options: RouteOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("route:path", path, target);
    Reflect.defineMetadata("route:version", options.version, target);
  };
}

/**
 * Marks the route as discoverable by a router with a matching tag.
 */
export function Discoverable(tag: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("route:tag", tag, target);
  };
}

/**
 * Specifies the HTTP method for this endpoint.
 */
export function Endpoint(method: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(
      "route:endpoint",
      method.toLowerCase(),
      descriptor.value!
    );
  };
}

/**
 * Maps the arguments from the request to the endpoint method.
 */
export function ArgumentMapping(mapping: string[]): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata("route:argumentMapping", mapping, descriptor.value!);
  };
}

/**
 * Maps error codes to HTTP status codes.
 */
export function ErrorMapping(mapping: object): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata("route:errorMapping", mapping, descriptor.value!);
  };
}
