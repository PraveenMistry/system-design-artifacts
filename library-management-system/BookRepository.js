interface BookRepository {
  add(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(isbn: string): Promise<void>;
  getByIsbn(isbn: string): Promise<Book | null>;
  getAll(): Promise<Book[]>;
  findByTitle(title: string): Promise<Book[]>;
  findByAuthor(author: string): Promise<Book[]>;
  updateAvailability(isbn: string, isAvailable: boolean): Promise<void>;
}
