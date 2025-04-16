import { RouteOptions } from "./types";
// src/lib/decorators/RouteDecorators.ts

/**
 * Declares the base path and version for the route.
 */
export function Route(path: string, options?: { version?: string }) {
  return function (target: any) {
    Reflect.defineMetadata("route:path", path, target);
    if (options?.version) {
      Reflect.defineMetadata("route:version", options.version, target);
    }
  };
}

export function RouteDescription(description: string) {
  return function (target: any) {
    Reflect.defineMetadata("route:description", description, target);
  };
}

/**
 * Marks the route as discoverable by a router with a matching tag.
 */
export function Discoverable(routeId: string) {
  return function (target: any) {
    Reflect.defineMetadata("route:discoverable", routeId, target);
  };
}

/**
 * Specifies the HTTP method for this endpoint.
 */
export function Endpoint(
  method: "GET" | "POST" | "PUT" | "DELETE",
  options?: { hints?: string[] }
) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("endpoint:method", method, target, propertyKey);
    if (options?.hints) {
      Reflect.defineMetadata(
        "endpoint:hints",
        options.hints,
        target,
        propertyKey
      );
    }
  };
}

/**
 * Maps the arguments from the request to the endpoint method.
 */
export function ArgumentMapping(mapping: Array<any>) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("endpoint:arguments", mapping, target, propertyKey);
  };
}

export function Configuration(options: {
  access: string;
  guard: { rights: string };
}) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      "endpoint:configuration",
      options,
      target,
      propertyKey
    );
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
