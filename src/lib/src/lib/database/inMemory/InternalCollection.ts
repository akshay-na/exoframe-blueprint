import { UUID } from "../../common/UUID";
import { Collection, CollectionOptions, Identifiable } from "./types";

export class InternalCollection<T extends Identifiable>
  implements Collection<T>
{
  private docs = new Map<string, T>();
  private readonly options: Required<CollectionOptions<T>>;

  constructor(opts: CollectionOptions<T>) {
    this.options = {
      idFactory: opts.idFactory ?? (() => UUID.randomUUID()),
      readonly: opts.readonly ?? false,
    } as Required<CollectionOptions<T>>;
  }

  private freeze<R>(obj: R): R {
    return this.options.readonly ? (Object.freeze(obj) as R) : obj;
  }

  insert(data: Omit<T, "id"> & Partial<Pick<T, "id">>): T {
    const id = data.id ?? this.options.idFactory();
    if (this.docs.has(id)) {
      throw new Error(`Duplicate id '${id}' in collection`);
    }
    const doc = { ...(data as object), id } as unknown as T;
    this.docs.set(id, doc);
    return this.freeze({ ...doc });
  }

  upsert(data: T): T {
    if (!data.id) {
      throw new Error("Upsert requires an id");
    }
    const exists = this.docs.has(data.id);
    if (exists) {
      this.docs.set(data.id, { ...this.docs.get(data.id)!, ...data });
    } else {
      this.docs.set(data.id, { ...data });
    }
    return this.freeze({ ...this.docs.get(data.id)! });
  }

  findById(id: string): T | undefined {
    const doc = this.docs.get(id);
    return doc ? this.freeze({ ...doc }) : undefined;
  }

  find(predicate: (doc: T) => boolean = () => true): T[] {
    const out: T[] = [];
    for (const doc of this.docs.values()) {
      if (predicate(doc)) out.push(this.freeze({ ...doc }));
    }
    return out;
  }

  update(id: string, patch: Partial<Omit<T, "id">>): T | undefined {
    const existing = this.docs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch } as T;
    this.docs.set(id, updated);
    return this.freeze({ ...updated });
  }

  delete(id: string): boolean {
    return this.docs.delete(id);
  }

  clear(): void {
    this.docs.clear();
  }

  all(): T[] {
    return this.find();
  }

  count(): number {
    return this.docs.size;
  }
}
