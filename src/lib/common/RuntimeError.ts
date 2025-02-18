// RuntimeError.ts
// Base class for all runtime errors

import { LooseObject } from "./LooseObject";

export interface ErrorCause {
  name: string;
  message: string;
  cause?: ErrorCause;
  info?: LooseObject;
}

export class RuntimeError extends Error {
  public readonly id?: string;
  public readonly cause?: ErrorCause;
  public readonly info?: LooseObject;

  constructor(msg: string, info?: LooseObject);
  constructor(cause: Error | undefined, msg: string, info?: LooseObject);

  constructor(
    causeOrError: string | Error | undefined,
    msgOrInfo?: string | LooseObject,
    maybeInfo?: LooseObject
  ) {
    const cause = typeof causeOrError === "object" ? causeOrError : undefined;
    const msg =
      typeof causeOrError === "string" ? causeOrError : (msgOrInfo as string);
    const info =
      typeof causeOrError === "string" ? (msgOrInfo as LooseObject) : maybeInfo;
    super();
    this.id = msg;
    this.info = info;
    if (cause !== undefined) this.cause = cause as unknown as ErrorCause;
  }

  public get name(): string {
    return this.constructor.name;
  }

  public get message(): string {
    if (this.cause === undefined) return `[${this.id}]`;
    return this.id === undefined
      ? `${super.message}${this.cause.message}`
      : `[${this.id}] ${this.cause.message}`;
  }

  public toJSON(): LooseObject {
    return { msg: this.message, info: this.info };
  }
}
