export class RouteRegistry {
  private static _instance: RouteRegistry;
  private routes = new Set<Function>();
  private constructor() {}

  public static get instance(): RouteRegistry {
    if (!this._instance) this._instance = new RouteRegistry();
    return this._instance;
  }

  public register(target: Function): void {
    this.routes.add(target);
  }

  public all(): Function[] {
    return Array.from(this.routes);
  }
}
