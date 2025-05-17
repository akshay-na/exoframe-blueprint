import { Express } from "express";
import { Environment } from "../../common/Environment";

export interface IExpressBuilder {
  readonly app: Express;
  readonly environment: Environment;
  initialize(): Express;
}
