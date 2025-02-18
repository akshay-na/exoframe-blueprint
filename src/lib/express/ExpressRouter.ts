// src/lib/Express/ExpressRouter.ts
import { RouterOptions } from "@/lib/decorators/types";
import { CapabilitySpec } from "@/lib/express/types";
import bodyParser from "body-parser";
import glob from "glob";
import helmet from "helmet";
import passport from "passport";
import path from "path";
import "reflect-metadata";

export abstract class ExpressRouter {
  protected app: any; // the express app instance (created elsewhere with: const app = express())
  protected options: RouterOptions;

  constructor(app: any) {
    this.app = app;

    // Retrieve router options from metadata applied by the RouterDecorator.
    this.options = Reflect.getMetadata("router:options", this.constructor);

    // Define a base path – all routes will be mounted under this path.
    const basePath = this.options.basePath || "";

    // Apply capabilities (middleware) from the provided specs.
    if (this.options.capabilities && this.options.capabilities.length) {
      this.options.capabilities.forEach((spec: CapabilitySpec) => {
        this.applyCapability(spec);
      });
    }

    // Load and register route classes, prefixing their paths with basePath.
    this.loadRoutes(basePath);

    // Attach a fallback (backstop) route at basePath + backstop.routeAt.
    this.app.use(basePath + this.options.backstop.routeAt, (req, res) => {
      res.status(404).send("Not Found");
    });
  }

  private applyCapability(spec: CapabilitySpec): void {
    switch (spec.blueprint) {
      case "body-parser":
        if (spec.options && spec.options.properties) {
          if (spec.options.properties.json) {
            this.app.use(bodyParser.json());
          }
          if (spec.options.properties.urlencoded) {
            this.app.use(
              bodyParser.urlencoded(spec.options.properties.urlencoded)
            );
          }
        }
        console.log(`[${spec.name}] BodyParser applied`);
        break;
      case "helmet":
        this.app.use(helmet(spec.options || {}));
        console.log(`[${spec.name}] Helmet applied`);
        break;
      case "passport":
        this.app.use(spec.options.route || "/*", passport.initialize());
        console.log(`[${spec.name}] Passport applied`);
        break;
      // Add additional capabilities as needed...
      default:
        if (!spec.optional) {
          console.warn(`Unknown capability blueprint: ${spec.blueprint}`);
        }
    }
  }

  private loadRoutes(basePath: string): void {
    // Resolve the container directory where route classes live.
    const containerDir = path.resolve(
      process.cwd(),
      this.options.routesToLoad.container
    );
    const files = glob.sync(containerDir + "/**/*.{js,ts}");

    for (const file of files) {
      const routesModule = require(file);
      for (const exportKey in routesModule) {
        const RouteClass = routesModule[exportKey];
        if (
          typeof RouteClass === "function" &&
          Reflect.hasMetadata("route:path", RouteClass)
        ) {
          const discoverableTag = Reflect.getMetadata("route:tag", RouteClass);
          if (discoverableTag === this.options.routeTag) {
            const instance = new RouteClass();
            const classPath: string = Reflect.getMetadata(
              "route:path",
              RouteClass
            );
            // Combine the basePath and the route class path.
            const fullPath = basePath + classPath;
            const proto = Object.getPrototypeOf(instance);
            const methodNames = Object.getOwnPropertyNames(proto).filter(
              (name) => name !== "constructor"
            );

            for (const methodName of methodNames) {
              const methodFunc = instance[methodName];
              if (
                typeof methodFunc === "function" &&
                Reflect.hasMetadata("route:endpoint", methodFunc)
              ) {
                const httpMethod: string = Reflect.getMetadata(
                  "route:endpoint",
                  methodFunc
                );
                const errorMapping: { [key: string]: number } =
                  Reflect.getMetadata("route:errorMapping", methodFunc) || {};
                const argumentMapping: any[] =
                  Reflect.getMetadata("route:argumentMapping", methodFunc) ||
                  [];

                const resolveArgument = (
                  mapping: any,
                  req: any,
                  res: any,
                  next: any
                ): any => {
                  if (typeof mapping === "string") {
                    switch (mapping) {
                      case "$query":
                        return req.query;
                      case "$body":
                        return req.body;
                      case "$params":
                        return req.params;
                      case "$headers":
                        return req.headers;
                      case "$req":
                        return req;
                      case "$res":
                        return res;
                      case "$next":
                        return next;
                      case "$files":
                        return req.files;
                      default:
                        return undefined;
                    }
                  } else if (typeof mapping === "object" && mapping !== null) {
                    const key = Object.keys(mapping)[0];
                    const prop = mapping[key];
                    switch (key) {
                      case "$body":
                        return req.body ? req.body[prop] : undefined;
                      case "$query":
                        return req.query ? req.query[prop] : undefined;
                      case "$params":
                        return req.params ? req.params[prop] : undefined;
                      case "$headers":
                        return req.headers ? req.headers[prop] : undefined;
                      default:
                        return undefined;
                    }
                  }
                  return undefined;
                };

                const wrappedHandler = async (
                  req: any,
                  res: any,
                  next: any
                ) => {
                  try {
                    const mappedArgs =
                      argumentMapping.length > 0
                        ? argumentMapping.map((m) =>
                            resolveArgument(m, req, res, next)
                          )
                        : [req, res, next];
                    const result = await methodFunc.apply(instance, mappedArgs);
                    res.json({
                      path: `[${httpMethod.toUpperCase()}] ${fullPath}`,
                      success: true,
                      data: result,
                    });
                  } catch (error: any) {
                    const status = errorMapping[error.code] || 500;
                    res.status(status).json({
                      path: `[${httpMethod.toUpperCase()}] ${fullPath}`,
                      success: false,
                      data: error.message || "Internal Server Error",
                    });
                  }
                };

                // Register the route handler directly on the app.
                this.app[httpMethod](fullPath, wrappedHandler);
              }
            }
          }
        }
      }
    }
  }
}
