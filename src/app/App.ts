import { ENVIRONMENT } from "@akshay-na/exoframe/lib/common/Environment";
import { logger } from "@akshay-na/exoframe/lib/common/Logger";
import { RuntimeError } from "@akshay-na/exoframe/lib/common/RuntimeError";
import {
  Express,
  ExpressBuilder,
  Server,
} from "@akshay-na/exoframe/lib/express/ExpressBuilder";

import "./routers/routes/index";

export default class Application {
  private expressBuilder: ExpressBuilder;
  private static application: Express;
  private static server: Server;

  constructor() {
    this.expressBuilder = new ExpressBuilder();
  }

  public getInstance(): Express {
    if (!Application.application) {
      throw new RuntimeError("App not initialized yet!");
    }
    return Application.application;
  }

  public async initialize(): Promise<Express> {
    try {
      Application.application = this.expressBuilder.initialize();
      return Application.application;
    } catch (error) {
      console.error("Error initializing application:", error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    if (!Application.application)
      throw new RuntimeError("App not initialized yet!");
  }

  public startServer(): void {
    if (!Application.application) {
      throw new Error("Application is not initialized!");
    }

    const PORT = ENVIRONMENT.get("PORT") ?? 8888;
    Application.server = Application.application.listen(PORT, () => {
      logger.info(`API ready on: http://localhost:${PORT}`);
    });

    process.on("SIGTERM", this.closeServer.bind(this, Application.application));
    process.on("SIGINT", this.closeServer.bind(this, Application.application));
  }

  public async closeServer() {
    try {
      if (Application.server) {
        Application.server.close();
      }

      await this.shutdown();

      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1); // Exit with error code if shutdown fails
    }
  }
}
