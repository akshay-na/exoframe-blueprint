import { LooseObject } from "./LooseObject";
import { RuntimeError } from "./RuntimeError";

export class InvalidValue extends RuntimeError {
  constructor(info?: LooseObject) {
    super("INVALID_VALUE", info);
  }
}

export class InvalidUuid extends RuntimeError {
  constructor(info?: LooseObject) {
    super("INVALID_UUID", info);
  }
}

export class Todo extends RuntimeError {
  constructor(info?: LooseObject) {
    super("TODO", info);
  }
}
