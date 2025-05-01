import { LooseObject } from "@akshay-na/exoframe/lib/common/LooseObject";
import { RuntimeError } from "@akshay-na/exoframe/lib/common/RuntimeError";

export class InvalidRequest extends RuntimeError {
  constructor(info?: LooseObject);

  constructor(cause: Error, info?: LooseObject) {
    super(cause!, "INVALID_REQUEST", info);
  }
}
