import { InternalCollection } from "./InternalCollection";
import { Collection, CollectionOptions, Identifiable } from "./types";

export class InMemoryDatabase {
  private readonly _collections = new Map<string, InternalCollection<any>>();

  public collection<T extends Identifiable = Identifiable>(
    name: string,
    options: CollectionOptions<T> = {}
  ): Collection<T> {
    let col = this._collections.get(name);
    if (!col) {
      col = new InternalCollection<T>(options);
      this._collections.set(name, col);
    }
    return col!;
  }

  public reset(): void {
    this._collections.forEach((c) => c.clear());
    this._collections.clear();
  }

  public listCollections(): string[] {
    return Array.from(this._collections.keys());
  }
}

const dbInstance = new InMemoryDatabase();
export default dbInstance;
