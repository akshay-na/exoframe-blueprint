// environment.ts
// File that loads / configures the environment for the application

import dotenv from "dotenv";
import fs from "fs";
import Path from "path";

import { LooseObject } from "./LooseObject";

import { InvalidValue } from "./errors";
import {
  EnvironmentType,
  ParseSpec,
  PathLike,
  PathMapping,
  Platform,
  PlatformComponent,
} from "./types";

export interface EnvironmentConfig {
  type?: EnvironmentType;
  component?: PlatformComponent;
}

export class Environment {
  public static readonly PATHS: PathMapping = {
    data: "./data",
    config: "./config",
    keys: "./keys",
  };

  public static readonly PLATFORMS = new Map<EnvironmentType, Platform>()
    .set("development", "azure")
    .set("testing", "azure")
    .set("staging", "azure")
    .set("production", "azure");

  private isBootstrapped = false;

  public readonly type: EnvironmentType;
  public readonly component: PlatformComponent;

  constructor(cfg?: EnvironmentConfig) {
    this.type = cfg?.type ?? "local";
    this.component = cfg?.component ?? "webapp";
  }

  public get platform(): string {
    return Environment.PLATFORMS.get(this.type) ?? "local";
  }

  public get isLocal(): boolean {
    return this.type === "local";
  }

  public get isProduction(): boolean {
    return this.type === "production";
  }

  public get isTesting(): boolean {
    return this.type === "testing";
  }

  public get isDevelopment(): boolean {
    return this.type === "development";
  }

  protected bootstrap(): boolean {
    // load the appropriate environment file
    const envFile = Path.resolve(process.cwd(), `.env.${this.type}`);
    if (fs.existsSync(envFile)) {
      console.info(`[Environment(${this.type})] USING '${envFile}' FILE`);
      dotenv.config({ path: envFile });
    } else if (fs.existsSync(".env")) {
      console.info(`[Environment(${this.type})] USING '.env' FILE`);
      dotenv.config({ path: ".env" });
    } else {
      console.warn(`[Environment(${this.type})] NO ENVIRONMENT FILE LOCATED`);
    }
    this.isBootstrapped = true;
    // dump the environment
    if (this.boolean("ENVIRONMENT_DEBUG") === true) this.debug();
    return this.isBootstrapped;
  }

  public debug(): void {
    console.debug("ENVIRONMENT -------------------------------------------");
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("npm_")) continue;
      console.debug(`[${key}]: ${process.env[key]}`);
    }
    console.debug("------------------------------------------------------");
  }

  public get(name: string): string | undefined {
    if (!this.isBootstrapped) {
      this.bootstrap();
    }
    return process.env[name];
  }

  protected parse0(env?: string, spec?: ParseSpec): LooseObject | undefined {
    if (env === undefined) return undefined;
    spec = spec ?? {};
    return env
      .split("|")
      .map((v) => v.split(":"))
      .map((bits) => [bits[0], bits[1]])
      .map((bits) => {
        if (bits[1] === undefined) return bits;
        else
          switch (spec![bits[0]]) {
            case "integer":
              return [bits[0], this.integer0(bits[1])];
            case "number":
              return [bits[0], this.number0(bits[1])];
            case "hex":
              return [bits[0], this.hex0(bits[1])];
            case "boolean":
              return [bits[0], this.boolean0(bits[1])];
            case "date":
              return [bits[0], this.date0(bits[1])];
            case "url":
              return [bits[0], this.url0(bits[1])];
            default:
              return bits;
          }
      })
      .reduce((parsed, bits) => {
        Reflect.set(parsed, bits[0] as string, bits[1] ?? true);
        return parsed;
      }, {} as LooseObject);
  }

  public parse(name: string): LooseObject | undefined {
    return this.parse0(this.get(name));
  }

  protected boolean0(env?: string): boolean | undefined {
    switch (env) {
      case undefined:
        return undefined;
      case "0":
        return false;
      case "1":
        return true;
      default:
        switch (env.toLowerCase()) {
          case "no":
            return false;
          case "yes":
            return true;
          case "false":
            return false;
          case "true":
            return true;
          default:
            throw new InvalidValue({ value: env, wanted: "boolean" });
        }
    }
  }

  public boolean(name: string): boolean | undefined {
    return this.boolean0(this.get(name));
  }

  protected hex0(env?: string): number | undefined {
    if (env === undefined) return undefined;
    else return parseInt(env, 16);
  }

  public hex(name: string): number | undefined {
    return this.hex0(this.get(name));
  }

  protected url0(env?: string): URL | undefined {
    if (env === undefined) return undefined;
    else return new URL(env);
  }

  public url(name: string): URL | undefined {
    return this.url0(this.get(name));
  }

  protected integer0(env?: string): number | undefined {
    if (env === undefined) return undefined;
    else return parseInt(env, 10);
  }

  public integer(name: string): number | undefined {
    const env = this.get(name);
    if (env === undefined) return undefined;
    else return parseInt(env, 10);
  }

  protected number0(env?: string): number | undefined {
    if (env === undefined) return undefined;
    else return parseFloat(env);
  }

  public number(name: string): number | undefined {
    return this.number0(this.get(name));
  }

  protected date0(env?: string): Date | undefined {
    if (env === undefined) return undefined;
    else return new Date(env);
  }

  public date(name: string): Date | undefined {
    return this.date0(this.get(name));
  }

  public is(name: string, value: string | number | boolean): boolean {
    switch (typeof value) {
      case "string":
        return this.get(name) === value;
      case "number":
        return this.number(name) === value;
      case "boolean":
        return this.boolean(name) === value;
    }
  }

  public path(name: string): PathLike | undefined {
    return Environment.PATHS[name];
  }
}

console.log("NODE_ENV =", process.env.NODE_ENV);
export const ENVIRONMENT = new Environment({
  type: process.env.NODE_ENV as EnvironmentType | undefined,
  component: process.env.PLATFORM_COMPONENT as PlatformComponent | undefined,
});
