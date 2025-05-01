export interface Identifiable {
  id: string;
}

export interface CollectionOptions<T> {
  idFactory?: () => string;
  readonly?: boolean;
}

export interface Collection<T extends Identifiable> {
  insert(data: Omit<T, "id"> & Partial<Pick<T, "id">>): T;
  upsert(data: T): T;
  findById(id: string): T | undefined;
  find(predicate?: (doc: T) => boolean): T[];
  update(id: string, patch: Partial<Omit<T, "id">>): T | undefined;
  delete(id: string): boolean;
  clear(): void;
  all(): T[];
  count(): number;
}
