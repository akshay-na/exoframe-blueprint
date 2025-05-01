import { LooseObject } from "@/lib/src/lib/common/LooseObject";
import { RuntimeError } from "@/lib/src/lib/common/RuntimeError";

export class InvalidRequest extends RuntimeError {
  constructor(info?: LooseObject);

  constructor(cause: Error, info?: LooseObject) {
    super(cause!, "INVALID_REQUEST", info);
  }
}
