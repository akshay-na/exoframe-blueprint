// Logger.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { join } from "path";
import pino, { LoggerOptions, Logger as PinoLogger } from "pino";

type Store = { logger: PinoLogger };

export class Logger {
  public static readonly instance: PinoLogger = Logger.buildFacadeProxy();

  public static runWithLogger<T>(logger: PinoLogger, fn: () => T): T {
    return Logger.als.run({ logger }, fn);
  }

  public static PinoLogger = {} as unknown as PinoLogger;

  private static readonly als = new AsyncLocalStorage<Store>();

  private static readonly root: PinoLogger = Logger.#buildRootLogger();

  private static get current(): PinoLogger {
    return Logger.als.getStore()?.logger ?? Logger.root;
  }

  /** Build the root logger with env‑sensitive transport & options. */
  static #buildRootLogger(): PinoLogger {
    const level = process.env.DEBUG ?? "info";
    const isProd = process.env.NODE_ENV === "production";

    // --- transport selection ---
    const transport = isProd
      ? pino.transport({
          targets: [
            {
              target: "pino/file",
              level,
              options: {
                destination: join(
                  process.cwd(),
                  "logs",
                  `${new Date().toISOString().replace(/[:.]/g, "-")}.log`
                ),
                mkdir: true,
              },
            },
          ],
        })
      : pino.transport({
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        });

    // --- base options ---
    const opts: LoggerOptions = {
      level,
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: [
          "req.headers.authorization",
          "*.password",
          "*.token",
          "*.secret",
        ],
        censor: "***",
      },
      formatters: {
        level(label) {
          return { level: label };
        },
      },
    };

    const root = pino(opts, transport as any);

    // graceful shutdown
    for (const sig of ["SIGINT", "SIGTERM"] as NodeJS.Signals[]) {
      process.on(sig, async () => {
        root.info({ sig }, "Shutting down – draining logs");
        await root.flush?.();
        process.exit(0);
      });
    }
    return root;
  }

  private static buildFacadeProxy(): PinoLogger {
    return new Proxy({} as PinoLogger, {
      get(_t, prop: string | symbol, receiver) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const real = (Logger.current as any)[prop];
        return typeof real === "function" ? real.bind(Logger.current) : real;
      },
    });
  }
}

/**
 *  -----------------------------------------------------------------
 *  ↓ Preferred default export so calling code writes just `logger`.
 *  -----------------------------------------------------------------
 */
export const logger = Logger.instance; // e.g. logger.info("Hello!");

/**
 * Helper re‑export for test helpers / middleware that need ALS binding.
 */
export const LoggerScope = {
  runWithLogger: Logger.runWithLogger.bind(Logger),
};

// Keep Pino’s type available without an extra import
export type { PinoLogger };
