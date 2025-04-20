// src/lib/ExpressRouter.ts
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import util from "util";

import { ARG_MAP_KEY, ERROR_MAP_KEY } from "../decorators/RouteDecorators";
import { resolveArguments } from "../http/ArgumentResolver";
import { translateError } from "../http/ErrorTranslator";
import { sendEnvelope } from "../http/ResponseFormatter";

/**
 * Base class for every tagged router.
 *  –  Single‑responsibility: orchestration only.
 *  –  Extensible debug hooks (request/response dump).
 */
export abstract class ExpressRouter {
  /** toggle at ctor, env or subclass (default off) */
  protected readonly debug: boolean;

  readonly tag: string;
  readonly basePath: string;
  readonly router: Router;

  /* ───────── constructor ───────── */
  protected constructor(
    tag: string,
    basePath: string,
    { debug = false }: { debug?: boolean } = {}
  ) {
    this.tag = tag;
    this.basePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    this.debug = debug || process.env.DEBUG_ROUTER === "true";
    this.router = express.Router();

    this.attachMiddlewares();
  }

  /* ───────── optional middle‑/after‑ hooks ───────── */

  /** Override to inject auth, rate‑limit, etc. */
  protected attachMiddlewares(): void {}

  /** Override for metrics, tracing… */
  protected beforeInvoke(_req: Request, _res: Response): void {}

  /** Override for logging, cleanup… */
  protected afterInvoke(_req: Request, _res: Response): void {}

  /* ───────── debugging helpers ───────── */

  protected debugRequest(req: Request): void {
    console.debug(
      "⇢ REQUEST",
      util.inspect(
        {
          url: `${req.method} ${req.originalUrl}`,
          headers: req.headers,
          params: req.params,
          query: req.query,
          body: req.body,
        },
        false,
        4,
        true
      )
    );
  }

  protected debugResponse(res: Response): void {
    console.debug(
      "⇠ RESPONSE",
      util.inspect(
        {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.getHeaders(),
          // any data the handler stashed on res.locals
          locals: res.locals,
        },
        false,
        4,
        true
      )
    );
  }

  /* ───────── internal: wrap one endpoint ───────── */

  private createHandler(
    instance: any,
    handlerName: string | symbol
  ): RequestHandler {
    const argMap: string[] =
      Reflect.getMetadata(ARG_MAP_KEY, instance, handlerName) ?? [];
    const errMap =
      Reflect.getMetadata(ERROR_MAP_KEY, instance, handlerName) ?? {};

    const endpoint = (instance as any)[handlerName].bind(instance);
    const self = this;

    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        if (self.debug) self.debugRequest(req);
        self.beforeInvoke(req, res);

        const args = resolveArguments(argMap, req);
        const result = await endpoint(...args);

        if (!res.headersSent) {
          const { status, data } =
            typeof result === "object" && result && "status" in result
              ? (result as any)
              : { status: result === undefined ? 204 : 200, data: result };

          sendEnvelope(req, res, status, data);
        }

        self.afterInvoke(req, res);
        if (self.debug) self.debugResponse(res);
      } catch (err: any) {
        const status = translateError(err, errMap);
        sendEnvelope(req, res, status, {
          message: err.message ?? "Internal Server Error",
        });
        if (self.debug) self.debugResponse(res);
      }
    };
  }

  /* ───────── internal: mount all endpoints ───────── */
  _mount(
    path: string,
    verb: keyof Router,
    instance: any,
    name: string | symbol
  ): void {
    const wrapped = this.createHandler(instance, name);
    (this.router as any)[verb](path, wrapped);
  }
}
