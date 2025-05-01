import "reflect-metadata";

import { Express, NextFunction, Request, Response, Router } from "express";
import { Environment, ENVIRONMENT } from "../common/Environment";
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

  public get environment(): Environment {
    return ENVIRONMENT;
  }

  initialize(): void {
    for (const routeClass of RouteRegistry.instance.all()) {
      const { path } = Reflect.getMetadata(META_ROUTE, routeClass) as {
        path: string;
      };
      const router = Router();
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

        function errorKey(err: any): string | undefined {
          if (!err || typeof err !== "object") return undefined;
          return err.code ?? err.id ?? err.name;
        }

        const handler = async (
          req: Request,
          res: Response,
          next: NextFunction
        ): Promise<void> => {
          try {
            const resolvedArgs = argMapping.map((token) =>
              resolveToken(token, req)
            );
            const result = await instance[key](...resolvedArgs);
            sendEnvelope(req, res, 200, result);
          } catch (err: any) {
            const key = errorKey(err);
            const status = key && errorMap[key] ? errorMap[key] : 500;

            sendEnvelope(req, res, status, {
              error: key,
              message: err?.message,
            });
          }
        };

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
