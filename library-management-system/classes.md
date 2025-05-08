// -------------------- Data Models (TypeScript Interfaces) --------------------

interface Library {
  libraryId: string;
  name: string;
  address: string;
  contactInfo: string;
}

interface Librarian {
  librarianId: string;
  name: string;
  email: string;
  phone: string;
}

interface Member {
  memberId: string;
  name: string;
  contactInfo: string;
  borrowingHistory: string[]; // Array of borrowing IDs
}

interface Book {
  isbn: string;
  title: string;
  author: string;
  publicationYear: number;
  isAvailable: boolean;
}

interface Borrowing {
  borrowingId: string;
  memberId: string;
  bookIsbn: string;
  borrowDate: Date;
  returnDate?: Date;
  dueDate: Date;
  fineAmount?: number;
}

interface BorrowingRules {
  maxBorrowingLimit: number;
  loanDurationDays: number;
  finePerDay: number;
}

// -------------------- Repository Interfaces --------------------

interface LibraryRepository {
  add(library: Library): Promise<void>;
  update(library: Library): Promise<void>;
  delete(libraryId: string): Promise<void>;
  getById(libraryId: string): Promise<Library | null>;
  getAll(): Promise<Library[]>;
}

interface LibrarianRepository {
  add(librarian: Librarian): Promise<void>;
  update(librarian: Librarian): Promise<void>;
  delete(librarianId: string): Promise<void>;
  getById(librarianId: string): Promise<Librarian | null>;
  getAll(): Promise<Librarian[]>;
}

interface MemberRepository {
  add(member: Member): Promise<void>;
  update(member: Member): Promise<void>;
  delete(memberId: string): Promise<void>;
  getById(memberId: string): Promise<Member | null>;
  getAll(): Promise<Member[]>;
}

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

interface BorrowingRepository {
  borrowBook(borrowing: Borrowing): Promise<void>;
  returnBook(borrowingId: string, returnDate: Date): Promise<void>;
  getById(borrowingId: string): Promise<Borrowing | null>;
  getCurrentBorrowingsByMember(memberId: string): Promise<Borrowing[]>;
  getOverdueBorrowings(): Promise<Borrowing[]>;
}

interface BorrowingRulesRepository {
  getRules(): Promise<BorrowingRules>;
  updateRules(rules: BorrowingRules): Promise<void>;
}

// -------------------- Service Classes --------------------

class LibraryService {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  async addLibrary(library: Library): Promise<void> {
    await this.libraryRepository.add(library);
  }

  async updateLibrary(library: Library): Promise<void> {
    await this.libraryRepository.update(library);
  }

  async deleteLibrary(libraryId: string): Promise<void> {
    await this.libraryRepository.delete(libraryId);
  }

  async getLibrary(libraryId: string): Promise<Library | null> {
    return this.libraryRepository.getById(libraryId);
  }

  async getAllLibraries(): Promise<Library[]> {
    return this.libraryRepository.getAll();
  }
}

class LibrarianService {
  constructor(private readonly librarianRepository: LibrarianRepository) {}

  async addLibrarian(librarian: Librarian): Promise<void> {
    await this.librarianRepository.add(librarian);
  }

  async updateLibrarian(librarian: Librarian): Promise<void> {
    await this.librarianRepository.update(librarian);
  }

  async deleteLibrarian(librarianId: string): Promise<void> {
    await this.librarianRepository.delete(librarianId);
  }

  async getLibrarian(librarianId: string): Promise<Librarian | null> {
    return this.librarianRepository.getById(librarianId);
  }

  async getAllLibrarians(): Promise<Librarian[]> {
    return this.librarianRepository.getAll();
  }
}

class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async addMember(member: Member): Promise<void> {
    await this.memberRepository.add(member);
  }

  async updateMember(member: Member): Promise<void> {
    await this.memberRepository.update(member);
  }

  async deleteMember(memberId: string): Promise<void> {
    await this.memberRepository.delete(memberId);
  }

  async getMember(memberId: string): Promise<Member | null> {
    return this.memberRepository.getById(memberId);
  }

  async getAllMembers(): Promise<Member[]> {
    return this.memberRepository.getAll();
  }
}

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

class BorrowRuleService {
  constructor(private readonly borrowingRulesRepository: BorrowingRulesRepository) {}

  async getBorrowingRules(): Promise<BorrowingRules> {
    return this.borrowingRulesRepository.getRules();
  }

  async updateBorrowingRules(rules: BorrowingRules): Promise<void> {
    await this.borrowingRulesRepository.updateRules(rules);
  }
}

class BorrowService {
  constructor(
    private readonly borrowingRepository: BorrowingRepository,
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository,
    private readonly borrowingRulesRepository: BorrowingRulesRepository,
    private readonly fineService: FineService // Dependency on FineService
  ) {}

  async borrowBook(memberId: string, bookIsbn: string): Promise<void> {
    const member = await this.memberRepository.getById(memberId);
    const book = await this.bookRepository.getByIsbn(bookIsbn);
    const rules = await this.borrowingRulesRepository.getRules();
    const currentBorrowings = await this.borrowingRepository.getCurrentBorrowingsByMember(memberId);

    if (!member) {
      throw new Error(`Member with ID ${memberId} not found.`);
    }
    if (!book) {
      throw new Error(`Book with ISBN ${bookIsbn} not found.`);
    }
    if (!book.isAvailable) {
      throw new Error(`Book with ISBN ${bookIsbn} is currently unavailable.`);
    }
    if (currentBorrowings.length >= rules.maxBorrowingLimit) {
      throw new Error(`Member ${memberId} has reached the maximum borrowing limit.`);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + rules.loanDurationDays);

    const borrowing: Borrowing = {
      borrowingId: crypto.randomUUID(), // Generate a unique ID
      memberId,
      bookIsbn,
      borrowDate: new Date(),
      dueDate,
    };

    await this.borrowingRepository.borrowBook(borrowing);
    await this.bookRepository.updateAvailability(bookIsbn, false);
  }

  async returnBook(borrowingId: string): Promise<number> {
    const borrowing = await this.borrowingRepository.getById(borrowingId);
    if (!borrowing) {
      throw new Error(`Borrowing record with ID ${borrowingId} not found.`);
    }
    if (borrowing.returnDate) {
      throw new Error(`Book with borrowing ID ${borrowingId} has already been returned.`);
    }

    const returnDate = new Date();
    await this.borrowingRepository.returnBook(borrowingId, returnDate);
    await this.bookRepository.updateAvailability(borrowing.bookIsbn, true);

    const rules = await this.borrowingRulesRepository.getRules();
    const fine = this.fineService.calculateFine(borrowing.dueDate, returnDate, rules.finePerDay);
    if (fine > 0) {
      // Ideally, you'd update the borrowing record with the fine amount
      // await this.borrowingRepository.updateFine(borrowingId, fine);
      console.log(`Fine for borrowing ID ${borrowingId}: ${fine}`);
    }
    return fine;
  }

  async getCurrentBorrowingsByMember(memberId: string): Promise<Borrowing[]> {
    return this.borrowingRepository.getCurrentBorrowingsByMember(memberId);
  }

  async getOverdueBorrowings(): Promise<Borrowing[]> {
    return this.borrowingRepository.getOverdueBorrowings();
  }
}

class FineService {
  calculateFine(dueDate: Date, returnDate: Date, finePerDay: number): number {
    if (returnDate > dueDate) {
      const timeDiff = returnDate.getTime() - dueDate.getTime();
      const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysLate * finePerDay;
    }
    return 0;
  }
}

// Example of how you might instantiate these services (assuming you have repository implementations)
// const libraryRepositoryImpl = new InMemoryLibraryRepository(); // Replace with your actual implementation
// const libraryService = new LibraryService(libraryRepositoryImpl);

// const bookService = new BookService(new InMemoryBookRepository());
// const catalogService = new CatalogService(new InMemoryBookRepository());
// const memberService = new MemberService(new InMemoryMemberRepository());
// const borrowingRulesService = new BorrowRuleService(new InMemoryBorrowingRulesRepository());
// const borrowingRepository = new InMemoryBorrowingRepository();
// const fineService = new FineService();
// const borrowService = new BorrowService(borrowingRepository, bookService['bookRepository'], memberService['memberRepository'], borrowingRulesService, fineService);
