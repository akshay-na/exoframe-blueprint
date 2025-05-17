import { Router } from "express";
import {
  META_ARGS,
  META_CONFIG,
  META_ENDPOINT,
  META_ERRORS,
  META_ROUTE,
} from "../../decorators/Route";
import {
  ConfigurationOptions,
  ErrorMappingOptions,
} from "../../decorators/types";
import { RouteHandler } from "../handlers/RouteHandler";
import { RouteRegistry } from "../RouteRegistry";

export class RouteRegistrar {
  constructor(private readonly basePath: string) {}

  public registerRoutes(router: Router): void {
    for (const routeClass of RouteRegistry.instance.all()) {
      const { path } = Reflect.getMetadata(META_ROUTE, routeClass) as {
        path: string;
      };
      const instance = new (routeClass as any)();

      for (const key of Object.getOwnPropertyNames(routeClass.prototype)) {
        if (key === "constructor") continue;

        const endpoint = Reflect.getMetadata(
          META_ENDPOINT,
          routeClass.prototype,
          key
        );
        if (!endpoint) continue;

        const config =
          (Reflect.getMetadata(
            META_CONFIG,
            routeClass.prototype,
            key
          ) as ConfigurationOptions) ?? {};
        const argMapping: string[] =
          Reflect.getMetadata(META_ARGS, routeClass.prototype, key) ?? [];
        const errorMap: ErrorMappingOptions =
          Reflect.getMetadata(META_ERRORS, routeClass.prototype, key) ?? {};

        const handler = new RouteHandler(
          instance,
          key,
          config,
          argMapping,
          errorMap
        );

        const verb = (endpoint.method as string).toLowerCase();
        (router as any)[verb](
          endpoint.hints?.includes("ACTION") ? path : `${path}`,
          handler.guards,
          handler.handle.bind(handler)
        );
      }
    }
  }
}
