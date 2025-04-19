// PathUtils.ts
// Utilities that perform operayions with file paths

import Path from "path";
import { PathLike } from "./types";

export class PathUtils {
  public static path(...components: PathLike[]) {
    return Path.resolve(process.cwd(), ...components.flat(2));
  }

  public static extension(path: string): string {
    return Path.extname(path);
  }

  public static basename(path: string, ext?: string): string {
    return Path.basename(path, ext);
  }

  public static dirname(path: string): string {
    return Path.dirname(path);
  }
}
