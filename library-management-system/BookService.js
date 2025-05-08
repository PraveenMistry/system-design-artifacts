class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async addBook(book: Book): Promise<void> {
    await this.bookRepository.add(book);
  }

  async updateBook(book: Book): Promise<void> {
    await this.bookRepository.update(book);
  }

  async deleteBook(isbn: string): Promise<void> {
    await this.bookRepository.delete(isbn);
  }

  async getBookByIsbn(isbn: string): Promise<Book | null> {
    return this.bookRepository.getByIsbn(isbn);
  }

  async getAllBooks(): Promise<Book[]> {
    return this.bookRepository.getAll();
  }

  async findBooksByTitle(title: string): Promise<Book[]> {
    return this.bookRepository.findByTitle(title);
  }

  async findBooksByAuthor(author: string): Promise<Book[]> {
    return this.bookRepository.findByAuthor(author);
  }
}
