class CatalogService {
  constructor(private readonly bookRepository: BookRepository) {}

  async addBookToLibrary(book: Book): Promise<void> {
    const existingBook = await this.bookRepository.getByIsbn(book.isbn);
    if (!existingBook) {
      await this.bookRepository.add(book);
    } else {
      throw new Error(`Book with ISBN ${book.isbn} already exists in the catalog.`);
    }
  }

  async removeBookFromLibrary(isbn: string): Promise<void> {
    const book = await this.bookRepository.getByIsbn(isbn);
    if (book) {
      await this.bookRepository.delete(isbn);
    } else {
      throw new Error(`Book with ISBN ${isbn} not found in the catalog.`);
    }
  }
}
