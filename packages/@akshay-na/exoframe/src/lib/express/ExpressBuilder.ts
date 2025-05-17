import express, { Express, Router } from "express";
import "reflect-metadata";
import { Environment, ENVIRONMENT } from "../common/Environment";
import { IExpressBuilder } from "./interfaces/IExpressBuilder";
import { RouteRegistrar } from "./registrars/RouteRegistrar";
import { requestLoggerMiddleware } from "./RequestLogger";

export type { Express } from "express";
export type { Server } from "http";

export class ExpressBuilder implements IExpressBuilder {
  public readonly app: Express;

  constructor(private readonly basePath = "") {
    this.app = express();
  }

  public get environment(): Environment {
    return ENVIRONMENT;
  }

  initialize(): Express {
    this.setupMiddleware();
    this.setupRoutes();
    return this.app;
  }

  private setupMiddleware(): void {
    this.app.use(requestLoggerMiddleware());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const router = Router();
    const routeRegistrar = new RouteRegistrar(this.basePath);
    routeRegistrar.registerRoutes(router);
    this.app.use(this.basePath, router);
  }
}
