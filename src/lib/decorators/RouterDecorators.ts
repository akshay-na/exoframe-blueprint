import { RouterOptions } from "./types";

export function RouterDecorator(options: RouterOptions): ClassDecorator {
  return (target: Function) => {
    // Save router options as metadata on the class
    Reflect.defineMetadata("router:options", options, target);
  };
}
