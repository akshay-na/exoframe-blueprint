import { LooseObject } from "./LooseObject";
import { RuntimeError } from "./RuntimeError";

export class InvalidValue extends RuntimeError {
  constructor(info?: LooseObject) {
    super("INVALID_VALUE", info);
  }
}
