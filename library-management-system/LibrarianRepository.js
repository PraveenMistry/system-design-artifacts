interface LibrarianRepository {
  add(librarian: Librarian): Promise<void>;
  update(librarian: Librarian): Promise<void>;
  delete(librarianId: string): Promise<void>;
  getById(librarianId: string): Promise<Librarian | null>;
  getAll(): Promise<Librarian[]>;
}
