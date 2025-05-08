
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
