import { NextFunction, Request, Response } from "express";
import { CapabilitySpec } from "../express/types";

export interface RouteOptions {
  version: string;
}

export interface RouterOptions {
  name: string;
  basePath: string;
  // Automatically load all routes from this container (e.g. using a file glob)
  routesToLoad: { container: string };
  // Only load routes decorated with @Discoverable(thisTag)
  routeTag: string;
  // Fallback route options (e.g. for a 404 handler)
  backstop: { routeAt: string };
  // Capabilities: functions that attach default middleware (e.g. Helmet, Compression, etc.)
  capabilities: CapabilitySpec[];
}

export interface RouteDefinition {
  path: string;
  requestMethod: "get" | "post" | "put" | "delete" | "patch";
  methodName: string;
  middlewares: Array<(req: Request, res: Response, next: NextFunction) => void>;
}
