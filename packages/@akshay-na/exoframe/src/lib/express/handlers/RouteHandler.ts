import { NextFunction, Request, Response } from "express";
import {
  ConfigurationOptions,
  ErrorMappingOptions,
} from "../../decorators/types";
import { sendEnvelope } from "../../http/ResponseFormatter";
import { applyGuards, resolveToken } from "../utils";

export class RouteHandler {
  constructor(
    private readonly instance: any,
    private readonly methodName: string,
    private readonly config: ConfigurationOptions,
    private readonly argMapping: string[],
    private readonly errorMap: ErrorMappingOptions
  ) {}

  private errorKey(err: any): string | undefined {
    if (!err || typeof err !== "object") return undefined;
    return err.code ?? err.id ?? err.name;
  }

  public async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const resolvedArgs = this.argMapping.map((token) =>
        resolveToken(token, req)
      );

      const result = await this.instance[this.methodName](...resolvedArgs);
      sendEnvelope(req, res, 200, result);
    } catch (err: any) {
      const key = this.errorKey(err);
      const status = key && this.errorMap[key] ? this.errorMap[key] : 500;

      sendEnvelope(req, res, status, {
        error: key,
        info: err?.info,
      });
    }
  }

  public get guards() {
    return applyGuards(this.config);
  }
}
