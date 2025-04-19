// src/lib/decorators/RouteDecorators.ts

import { HttpMthods } from "./types";

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
function Discoverable(routeId: string) {
  return function (target: any) {
    // Register the route as discoverable
    Reflect.defineMetadata("discoverable", routeId, target);

    // Automatically register the routes when the class is loaded
    const serviceRoute = Reflect.getMetadata("serviceRoute", target);
    const routeDescription = Reflect.getMetadata("routeDescription", target);
    const endpoints = Reflect.getMetadata("endpoints", target);

    if (!endpoints) return;

    const routeInstance = new target();

    // Register each endpoint dynamically on the route instance's router
    endpoints.forEach(
      (endpoint: { method: string; propertyKey: string; hints: string[] }) => {
        const handler = routeInstance[endpoint.propertyKey].bind(routeInstance);
        routeInstance.router[endpoint.method.toLowerCase()](
          serviceRoute.path,
          handler
        );
        console.log(
          `Registered route: ${serviceRoute.path} [${endpoint.method}]`
        );
      }
    );
  };
}

/**
 * Specifies the HTTP method for this endpoint.
 */
function Endpoint(method: HttpMthods, options: { hints: string[] }) {
  return function (target: any, propertyKey: string) {
    const existingEndpoints =
      Reflect.getMetadata("endpoints", target.constructor) || [];
    existingEndpoints.push({
      method,
      propertyKey,
      hints: options.hints,
    });
    Reflect.defineMetadata("endpoints", existingEndpoints, target.constructor);
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
