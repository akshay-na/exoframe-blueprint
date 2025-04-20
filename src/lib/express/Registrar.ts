// src/lib/Registrar.ts
import {
  BASE_PATH_KEY,
  DISCOVERABLE_KEY,
  ENDPOINTS_KEY,
} from "../decorators/RouteDecorators";

import { Application } from "express";
import { EndpointDef } from "../decorators/types";
import { ExpressRouter } from "./ExpressRouter";

/* ------------------------------------------------------------------ */

export class Registrar {
  private readonly routerMap = new Map<string, ExpressRouter>();
  private readonly rootRouter: ExpressRouter;

  constructor(
    private readonly app: Application,
    routers: ExpressRouter[]
  ) {
    /* ── create a fallback router for un‑discoverable routes ── */
    this.rootRouter = new (class Root extends ExpressRouter {
      constructor() {
        super("root", "");
      }
    })();
    this.routerMap.set("root", this.rootRouter);
    this.app.use("/", this.rootRouter.router);

    /* ── mount supplied (tagged) routers ── */
    for (const r of routers) {
      if (this.routerMap.has(r.tag)) {
        throw new Error(`Duplicate router tag “${r.tag}”`);
      }
      this.routerMap.set(r.tag, r);
      this.app.use(r.basePath, r.router);
    }
  }

  /* ----------------------------------------------------------------
     Register Route classes (controllers) after all routers exist
     ---------------------------------------------------------------- */
  public registerRoutes(routeClasses: any[]): void {
    for (const RC of routeClasses) {
      const tag: string | undefined = Reflect.getMetadata(DISCOVERABLE_KEY, RC);
      const basePath: string = Reflect.getMetadata(BASE_PATH_KEY, RC) ?? "";
      const endpoints: EndpointDef[] =
        Reflect.getMetadata(ENDPOINTS_KEY, RC) ?? [];
      const instance = new RC();

      const router = tag ? this.routerMap.get(tag) : this.rootRouter;

      if (!router) {
        throw new Error(
          `${RC.name} declares @Discoverable("${tag}") but no router with that tag`
        );
      }

      endpoints.forEach(({ verb, handlerName }) => {
        router._mount(
          basePath,
          verb.toLowerCase() as keyof ExpressRouter["router"],
          instance,
          handlerName
        );
        console.info(
          `${verb.toUpperCase()} ${router.basePath}${basePath} ` +
            `→ ${RC.name}.${String(handlerName)}()`
        );
      });
    }
  }
}
