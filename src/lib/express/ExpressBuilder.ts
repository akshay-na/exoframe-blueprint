import "reflect-metadata";

import { Express, NextFunction, Request, Response, Router } from "express";
import {
  META_ARGS,
  META_CONFIG,
  META_ENDPOINT,
  META_ERRORS,
  META_ROUTE,
} from "../decorators/Route";
import { sendEnvelope } from "../http/ResponseFormatter";
import { RouteRegistry } from "./RouteRegistry";
import { applyGuards, resolveToken } from "./utils";

export class ExpressBuilder {
  constructor(
    private readonly app: Express,
    private readonly basePath = ""
  ) {}

  build(): void {
    for (const routeClass of RouteRegistry.instance.all()) {
      /* ---------- class‑level metadata ---------- */
      const { path } = Reflect.getMetadata(META_ROUTE, routeClass) as {
        path: string;
      };
      const router = Router();
      const instance = new (routeClass as any)();

      /* ---------- walk own methods ---------- */
      for (const key of Object.getOwnPropertyNames(routeClass.prototype)) {
        if (key === "constructor") continue;

        const endpoint = Reflect.getMetadata(
          META_ENDPOINT,
          routeClass.prototype,
          key
        );
        if (!endpoint) continue; // skip non‑decorated methods

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

        /* ------ We build a closure that binds config & error mapping ------ */
        const handler = async (
          req: Request,
          res: Response,
          next: NextFunction
        ): Promise<void> => {
          try {
            /* ---------- Simple argument resolver ---------- */
            const resolvedArgs = argMapping.map((token) =>
              resolveToken(token, req)
            );
            const result = await instance[key](...resolvedArgs);
            sendEnvelope(req, res, 200, result);
          } catch (err: any) {
            const matched = Object.entries(errorMap).find(
              ([code]) => code === err?.code
            );
            if (matched) {
              const [, status] = matched;
              sendEnvelope(req, res, status, {
                error: err?.code,
                message: err?.message,
              });
            }
            return next(err);
          }
        };

        /* ---------- Apply access control if needed ---------- */
        const verb = (endpoint.method as string).toLowerCase();
        (router as any)[verb](
          endpoint.hints?.includes("ACTION") ? path : `${path}`,
          applyGuards(config),
          handler
        );
      }

      this.app.use(this.basePath, router);
    }
  }
}
