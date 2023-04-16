interface CRUD<T> {
  create: (item: T) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, item: T) => Promise<T>;
  remove: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
}
