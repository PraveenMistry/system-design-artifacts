interface LibraryRepository {
  add(library: Library): Promise<void>;
  update(library: Library): Promise<void>;
  delete(libraryId: string): Promise<void>;
  getById(libraryId: string): Promise<Library | null>;
  getAll(): Promise<Library[]>;
}
