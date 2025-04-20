// src/lib/ExpressServer.ts
//--------------------------------------------------------------
// Core kernel for Node / Express apps, Winston‑only version
//--------------------------------------------------------------

import cors, { CorsOptions } from "cors";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import expressWinston from "express-winston";

import { CryptoUtils } from "../common/CryptoUtils";
import { ENVIRONMENT, Environment } from "../common/Environment";

import { logger } from "../common/Logger";
import { ExpressRouter } from "./ExpressRouter";
import { Registrar } from "./Registrar";

/* ------------------------------------------------------------------ */
/*  Server configuration                                              */
/* ------------------------------------------------------------------ */
export interface ServerConfig {
  port?: number;
  trustProxy?: boolean;
  cors?: CorsOptions | false;
  httpLogs?: boolean; // turn request/error logging on/off
  jsonLimit?: string;
  urlencodedLimit?: string;
}

/* ------------------------------------------------------------------ */
/*  Base server class                                                 */
/* ------------------------------------------------------------------ */
export abstract class ExpressServer {
  /** Environment & crypto helpers available to subclasses */
  protected readonly env: Environment = ENVIRONMENT;
  protected readonly crypto: typeof CryptoUtils = CryptoUtils;

  protected readonly app: Application = express();
  protected readonly config: Required<ServerConfig>;
  private readonly registrar: Registrar;

  protected constructor(routers: ExpressRouter[], cfg: ServerConfig = {}) {
    /* -------- immutable runtime config -------- */
    this.config = {
      port: cfg.port ?? this.env.integer("PORT") ?? 3000,
      trustProxy: cfg.trustProxy ?? !this.env.isLocal,
      cors: cfg.cors ?? { origin: "*" },
      httpLogs: cfg.httpLogs ?? true,
      jsonLimit: cfg.jsonLimit ?? "1mb",
      urlencodedLimit: cfg.urlencodedLimit ?? "1mb",
    };

    /* -------- core express settings / middleware -------- */
    this.app.set("trust proxy", this.config.trustProxy);

    if (this.config.cors !== false) {
      this.app.use(cors(this.config.cors));
    }

    this.app.use(express.json({ limit: this.config.jsonLimit }));
    this.app.use(
      express.urlencoded({ extended: true, limit: this.config.urlencodedLimit })
    );

    /* -------- subclass hook for additional global middleware -------- */
    this.attachGlobalMiddlewares();

    /* -------- HTTP request logging (Winston) -------- */
    if (this.config.httpLogs) {
      this.app.use(
        expressWinston.logger({
          winstonInstance: logger,
          meta: true,
          msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
          colorize: false,
        })
      );
    }

    /* -------- register tagged routers & routes -------- */
    this.registrar = new Registrar(this.app, routers);
    this.registerRoutes(this.registrar);

    /* -------- error logger (Winston) -------- */
    if (this.config.httpLogs) {
      this.app.use(expressWinston.errorLogger({ winstonInstance: logger }));
    }

    /* -------- 404 & final error handler -------- */
    this.app.all("*", this.notFound());
    this.app.use(this.errorHandler());
  }

  /* ==============================================================
     ==============  EXTENSION POINTS  =============================
     ============================================================== */

  /** Override to inject auth, rate‑limit, compression… */
  protected attachGlobalMiddlewares(): void {
    /* default no‑op */
  }

  /**
   * Subclasses must register their Route classes (controllers).
   *   registrar.registerRoutes([ UsersRoute, AuthRoute ]);
   */
  protected abstract registerRoutes(registrar: Registrar): void;

  /** Override to centralise domain‑specific error mapping */
  protected formatError(err: any): { status: number; payload: unknown } {
    return {
      status: err.status ?? 500,
      payload: { message: err.message ?? "Internal Server Error" },
    };
  }

  /* ==============================================================
     ==================  PUBLIC API  ===============================
     ============================================================== */

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        logger.info(`[${this.env.type.toUpperCase()}] server listening`, {
          port: this.config.port,
        });
        resolve();
      });
    });
  }

  /** exposes underlying Express app for tests or advanced plugins */
  public get express(): Application {
    return this.app;
  }

  /* ==============================================================
     ===============  INTERNAL HELPERS  ============================
     ============================================================== */

  /** fallback 404 middleware */
  private notFound(): RequestHandler {
    return (_req, res) => {
      res.status(404).json({
        ok: false,
        message: "FAILED(Unknown Route)",
        data: null,
      });
    };
  }

  /** last error handler in the chain */
  private errorHandler(): ErrorRequestHandler {
    return (err: any, req: Request, res: Response, _next: NextFunction) => {
      const { status, payload } = this.formatError(err);
      res.status(status).json({
        ok: false,
        message: `FAILED(${req.method} ${req.originalUrl})`,
        data: payload,
      });
    };
  }
}
